// Inspect commitments and stored observations only; no scheduler execution.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',out=p+'campaign3-history-development-replay-rev1/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),hash=b=>createHash('sha256').update(b).digest('hex');
const planPath=p+'DEVELOPMENT_HISTORY_PLAN_REV1.json',resultPath=p+'DEVELOPMENT_HISTORY_RESULT_REV1.json',plan=read(planPath),result=read(resultPath),oldPlan=read(p+'LONGITUDINAL_EXECUTION_PROBE_PLAN_REV1.json'),old=read(p+'LONGITUDINAL_EXECUTION_PROBE_REV1.json');
const keys=(v,s)=>assert.deepEqual(Object.keys(v).sort(),s.split(' ').sort()),digest=s=>assert.match(s,/^[0-9a-f]{64}$/),uint=s=>assert.match(s,/^(0|[1-9][0-9]*)$/),rat=s=>assert.match(s,/^-?[0-9]+\/[1-9][0-9]*$/);
keys(plan,'status version contract experimentIdentity comparisonCase runs files');keys(result,'status version planSha256 models runs prefixes advancing terminal newModels newTrajectories exactChangedInputFields results');
assert.equal(result.planSha256,sha(planPath));assert.equal(plan.status,'FROZEN BEFORE REPLAY');assert.equal(plan.version,'development-history/0.1-candidate');assert.equal(plan.contract,'longitudinal-public/0.2-candidate');assert.equal(result.version,plan.version);assert.equal(result.status,'PASS');
for(const [k,v]of Object.entries({models:2,runs:3,prefixes:51,advancing:48,terminal:3,newModels:0,newTrajectories:0}))assert.equal(result[k],v);
for(const a of plan.files){keys(a,'path sha256');assert.equal(sha(a.path),a.sha256);}
assert.equal(plan.runs.length,3);assert.equal(result.results.length,3);assert.deepEqual(plan.runs.map(x=>x.name),['retained','rust','fresh']);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),codec=await server.ssrLoadModule('/src/campaign3/longitudinalCodecs.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),decode=s=>codec.decodeLongitudinal(new Uint8Array(Buffer.from(s,'hex'))),models=[],runs=[],inputs=[];
 for(const [i,r]of plan.runs.entries()){
  keys(r,'name modelIdentity runIdentity initial inputs');models.push(await ids.restoreModelIdentity(decode(r.modelIdentity)));runs.push(await ids.restoreRunIdentity(decode(r.runIdentity)));
  const o=oldPlan.runs[i];assert.equal(r.name,o.name);const initial=new Uint8Array(Buffer.from(fs.readFileSync(p+'campaign3-longitudinal-model-rev2/'+o.model+'/initial-state.cenc.hex','utf8').trim(),'hex')),ordered=new Uint8Array(Buffer.from(o.orderedInputs,'hex'));
  assert.equal(hash(initial),r.initial);assert.equal(hash(ordered),r.inputs);inputs.push(decode(o.orderedInputs).items);
  assert.equal(hex(runs[i].value.fields.get(2n).value),r.initial);assert.equal(hex(runs[i].value.fields.get(3n).value),r.inputs);assert.equal(hex(runs[i].value.fields.get(4n).value),'00'.repeat(32));assert.equal(hex(c.canonicalEncode(runs[i].value.fields.get(1n))),r.modelIdentity);
 }
 const coupling='Exact existing retained/rust/fresh probes, fixed zero32 seed. Same-model retained/fresh differ only in early practice kinds at3/5; inputs after5 identical. Rust is a distinct law comparator. Reexecute every prior save hash and one successor. No calendar-age or maturation inference.';
 assert.equal(hex((await ids.createComparisonCase(models,runs,c.text(coupling))).canonicalBytes),plan.comparisonCase);
 assert.equal(hex((await ids.createExperimentIdentity('corpus/0.29.0',plan.version,'qualify-development-history/0.1;sha256='+sha('scripts/qualify-development-history.mjs'))).canonicalBytes),plan.experimentIdentity);
 assert.equal(plan.runs[0].modelIdentity,plan.runs[2].modelIdentity);assert.equal(plan.runs[0].initial,plan.runs[2].initial);assert.equal(plan.runs[0].inputs,plan.runs[1].inputs);assert.equal(new Set(plan.runs.map(x=>x.modelIdentity)).size,2);
 const changed=[];assert.equal(inputs[0].length,inputs[2].length);
 for(let i=0;i<inputs[0].length;i++){
  assert.deepEqual([...inputs[0][i].fields.keys()],[...inputs[2][i].fields.keys()]);
  for(const[k,v]of inputs[0][i].fields)if(hex(c.canonicalEncode(v))!==hex(c.canonicalEncode(inputs[2][i].fields.get(k))))changed.push([String(inputs[0][i].fields.get(1n).value),String(k)]);
 }
 assert.deepEqual(changed,[['3','2'],['5','2']]);assert.deepEqual(result.exactChangedInputFields,changed);
 for(const [i,r]of result.results.entries()){
  keys(r,'name prefixes views executions details probes');assert.equal(r.name,plan.runs[i].name);const{details,probes,...prior}=r;assert.deepEqual(prior,old.results.find(x=>x.name===r.name));
  assert.equal(r.prefixes.length,17);assert.equal(r.views.length,17);assert.equal(details.length,17);assert.equal(probes.length,16);r.prefixes.forEach(digest);
  for(const x of r.views){keys(x,'at skill episodes');uint(x.at);rat(x.skill);assert(Number.isInteger(x.episodes)&&x.episodes>=0);}
  for(const x of r.executions){keys(x,'at practiced success');uint(x.at);assert.equal(typeof x.practiced,'boolean');assert.equal(typeof x.success,'boolean');}
  for(const[j,x]of details.entries()){keys(x,'at identity relationship person practiceCount observer');assert.equal(x.at,r.views[j].at);uint(x.at);uint(x.practiceCount);digest(x.identity);digest(x.relationship);digest(x.observer);if(x.person!==null)digest(x.person);}
  for(const x of probes){keys(x,'at skillBefore');uint(x.at);rat(x.skillBefore);}
 }
 const a=result.results[0],b=result.results[2];for(let i=0;i<17;i++)for(const k of ['identity','relationship','person'])assert.equal(a.details[i][k],b.details[i][k]);
 for(const r of result.results){assert.equal(r.views.find(x=>x.at==='14').episodes,0);assert.equal(r.views[0].skill,'0/1');assert.equal(r.executions.find(x=>x.at==='17').success,r.name==='retained');}
 assert.equal(a.probes.find(x=>x.at==='17').skillBefore,'1/4');assert.equal(b.probes.find(x=>x.at==='17').skillBefore,'0/1');assert.equal(a.views.find(x=>x.at==='17').skill,'1/2');assert.equal(b.views.find(x=>x.at==='17').skill,'1/4');
 const receipt={status:'PASS: REPLAY PLAN IDENTITY AND WHOLE RESULT SCHEMA',sources:[planPath,resultPath].map(path=>({path,sha256:sha(path)})),models:2,runs:3,prefixes:51,exactChangedInputFields:changed,coupling,limits:['Stored hashes and details are historical replay evidence, not fresh restores.','Semantic decoding of model/run identity is not a new psychological law or independent timestamp proof.','51 prefixes include48 advancing and3 terminal; no full tails or unseen replication.'],checkerSha256:sha('scripts/check-history-development-replay.mjs')};
 fs.mkdirSync(out,{recursive:true});const file=out+'canonical-check.json';if(fs.existsSync(file))assert.deepEqual(read(file),receipt);else fs.writeFileSync(file,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(receipt.status);
}finally{await server.close();}
