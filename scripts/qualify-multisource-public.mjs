/** Public factory experiment; immutable receipts. No runtime hooks here. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const destination='docs/planning/MULTISOURCE_PUBLIC_EXPERIMENT_REV1.json';assert(!fs.existsSync(destination));
const freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-multisource-model-rev2/FREEZE.json','utf8'));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
const hash=b=>createHash('sha256').update(b).digest('hex'),readHex=p=>new Uint8Array(Buffer.from(fs.readFileSync(p,'utf8').trim(),'hex'));
try{
 const {prepareMultisourceModel,createMultisourceRun,restoreMultisourceRun}=await server.ssrLoadModule('/src/campaign3/multisourceFactory.ts');
 const {decodeMultisource:decode}=await server.ssrLoadModule('/src/campaign3/multisourcePublicCodecs.ts');
 const {canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {multisourceCoverage}=await server.ssrLoadModule('/src/campaign3/multisourceReasons.ts');
 const f=(r,n)=>r.fields.get(BigInt(n)),rows=v=>v.items,q=v=>v.numerator+'/'+v.denominator,id=v=>v.payload.value;
 const results=[];
 for(const image of freeze.models){
  for(const file of image.files)assert.equal(hash(fs.readFileSync(file.path)),file.sha256);
  const load=name=>readHex(image.files.find(f=>f.path.endsWith('/'+name+'.cenc.hex')).path);
  const source={...freeze.versions,content:load('content'),registry:load('registry'),parameters:load('parameters')},initialState=load('initial-state'),orderedInputs=load('ordered-inputs'),model=await prepareMultisourceModel(source),run=await createMultisourceRun(model,{initialState,orderedInputs,runSeed:new Uint8Array(32).fill(7)}),checkpoints=[];
  // Restore every actual whole-instant prefix, including the empty prefix.
  do{const save=run.save(),restored=await restoreMultisourceRun(source,{initialState,orderedInputs,save});assert.deepEqual(restored.save(),save);checkpoints.push({clock:String(run.snapshot().clock),saveSha256:hash(save)});}while(await run.settleNextInstant());
  const snap=run.snapshot(),outputs=rows(decode(snap.outputs)),first=type=>outputs.find(v=>v.schema?.typeId===BigInt(type)),raw=first(722),reason=first(726),decision=first(728),sourceOutput=first(719);
  const coverage=multisourceCoverage(rows(f(raw,3)),BigInt(['GroundAggregate','GroundPairwise','GroundUncovered','FamilyNormalized','DescriptionDice'].indexOf(image.law)+1));
  results.push({name:image.name,caseName:image.caseName,law:image.law,modelIdentity:image.modelIdentity,runIdentity:Buffer.from(run.runIdentity()).toString('hex'),checkpoints,traceRows:rows(decode(snap.trace)).length,outputs:outputs.length,rawSignals:rows(f(raw,3)).length,assessments:rows(f(sourceOutput,3)).map(a=>({description:id(f(a,1)),kind:Number(f(a,2).value),...(f(a,4)?{strength:q(f(a,4))}:{}),support:f(a,6)?rows(f(a,6)).map(s=>({observation:String(f(s,1).payload.value),channel:id(f(s,3)),lower:q(f(f(s,5),1)),upper:q(f(f(s,5),2))})):[]})),coverage:coverage.map(g=>({option:id(f(g.option,2)),ground:Buffer.from(enc(g.ground)).toString('hex'),family:Number(f(g.ground,1).value),base:q(g.base),situation:q(g.situation),witnesses:g.witnesses.map(w=>({description:f(f(w,1),5)?id(f(f(w,1),5)):'commitment',magnitude:q(f(w,2)),normalization:q(f(w,3)),overlap:q(f(w,4)),effective:q(f(w,5))}))})),nuclei:rows(f(reason,3)).map(n=>({option:id(f(f(n,1),1).fields.get(2n)),family:Number(f(f(f(n,1),2),1).value),base:q(f(n,2)),situation:q(f(n,3)),die:String(f(n,5).value),modifier:String(f(n,6).value)})),decision:{status:Number(f(decision,4).value),probabilities:rows(f(decision,6)).map(v=>({option:id(f(f(v,1),2)),probability:q(f(v,2))})),mode:Number(f(decision,12).value),draws:rows(f(decision,13)).length},outcomes:outputs.filter(v=>v.schema?.typeId===733n).map(v=>String(f(v,3).value)),traceSha256:hash(snap.trace),stateSha256:hash(snap.state)});
  console.log('Public execution and all prefixes: '+results.length+'/55 '+image.name);
 }
 const get=(c,l='GroundAggregate')=>results.find(r=>r.caseName===c&&r.law===l),body=r=>r.coverage.find(g=>g.family===2),prob=r=>r.decision.probabilities.find(p=>p.option==='definition/protocol-contact-two').probability;
 assert.equal(body(get('orphan')).base,body(get('orphan-removed')).base);
 assert.notEqual(body(get('orphan','FamilyNormalized')).base,body(get('orphan-removed','FamilyNormalized')).base);
 assert.equal(body(get('shared')).base,body(get('independent')).base);
 assert.notEqual(body(get('shared','FamilyNormalized')).base,body(get('independent','FamilyNormalized')).base);
 assert.equal(body(get('duplicate')).base,body(get('shared')).base);
 assert.notEqual(body(get('duplicate','GroundUncovered')).base,body(get('duplicate')).base);
 const third=(r)=>body(r).witnesses.find(w=>w.description==='definition/multisource/body-c').effective;
 assert.equal(third(get('aggregate')),'0/1');assert.notEqual(third(get('aggregate','GroundPairwise')),'0/1');
 assert.ok(get('execution-blocked').outcomes.every(x=>x==='0'));
 for(const c of ['unavailable','known-zero','capacity-zero','no-body'])assert.equal(get(c).coverage.filter(g=>g.family===2).length,0);
 const shared=get('shared').assessments,bodySupport=shared.find(a=>a.description.endsWith('/body-a')).support,taskSupport=shared.find(a=>a.description.endsWith('/task-situation')).support;assert.deepEqual(bodySupport,taskSupport);
 const independent=get('independent').assessments;assert.notDeepEqual(independent[0].support,independent[1].support);
 const receipt={date:'2026-09-20',scope:'55 frozen models through the public factory; every whole-instant prefix restored by reexecution. Additional physical-intervention, boundary and preservation gates are separate.',freeze:'docs/planning/campaign3-multisource-model-rev2/FREEZE.json',models:55,prefixRestores:results.reduce((n,r)=>n+r.checkpoints.length,0),contrasts:{orphan:{groundAggregate:[body(get('orphan')).base,body(get('orphan-removed')).base],familyNormalized:[body(get('orphan','FamilyNormalized')).base,body(get('orphan-removed','FamilyNormalized')).base],probabilities:[prob(get('orphan','FamilyNormalized')),prob(get('orphan-removed','FamilyNormalized'))]},collective:{aggregateThird:third(get('aggregate')),pairwiseThird:third(get('aggregate','GroundPairwise'))}},results};
 fs.writeFileSync(destination,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log('Public experiment receipt written.');
}finally{await server.close();}
