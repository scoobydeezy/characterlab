import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const destination='docs/planning/BELIEF_PUBLIC_EXPERIMENT_REV1.json';assert(!fs.existsSync(destination));
const hash=b=>createHash('sha256').update(b).digest('hex'),bytes=s=>new Uint8Array(Buffer.from(s.trim(),'hex'));
const plan=JSON.parse(fs.readFileSync('docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json','utf8')),freeze=JSON.parse(fs.readFileSync(plan.modelFreeze,'utf8'));
assert.equal(hash(fs.readFileSync(plan.modelFreeze)),plan.modelFreezeSha256);
for(const m of freeze.models)for(const file of m.files)assert.equal(hash(fs.readFileSync(file.path)),file.sha256);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {prepareBeliefModel,createBeliefRun,restoreBeliefRun}=await server.ssrLoadModule('/src/campaign3/beliefFactory.ts');
 const {decodeBelief:decode}=await server.ssrLoadModule('/src/campaign3/beliefCodecs.ts');
 const {canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const f=(r,n)=>r.fields.get(BigInt(n)),q=v=>v?`${v.numerator}/${v.denominator}`:null,type=(v,t)=>v.schema?.typeId===BigInt(t);
 const results=[],raw=new Map();
 for(const spec of plan.runs){
  const image=freeze.models.find(m=>m.law===spec.law&&m.goal===spec.goal),source=Object.fromEntries(['content','registry','parameters'].map(n=>[n,bytes(fs.readFileSync(image.files.find(f=>f.path.endsWith('/'+n+'.cenc.hex')).path,'utf8'))])),initialState=bytes(plan.initialState),orderedInputs=bytes(spec.orderedInputs),run=await createBeliefRun(await prepareBeliefModel(source),{initialState,orderedInputs,runSeed:bytes(plan.runSeed)}),prefixes=[];
  for(;;){const save=run.save(),restored=await restoreBeliefRun(source,{initialState,orderedInputs,save});assert.deepEqual(restored.save(),save);prefixes.push({clock:String(run.snapshot().clock),saveSha256:hash(save)});const next=await run.settleNextInstant();assert.equal(await restored.settleNextInstant(),next);assert.deepEqual(restored.save(),run.save());if(!next)break;}
  const snap=run.snapshot(),outputs=decode(snap.outputs).items,applications=outputs.filter(v=>type(v,742)),appraisals=outputs.filter(v=>type(v,743)),state=decode(snap.state).items;
  const beliefs=state.map(leaf=>{const estimate=f(leaf,2);return {mean:q(f(estimate,1)),precision:String(f(estimate,2).value),support:f(estimate,3).items.length};});
  const result={name:spec.name,caseName:spec.caseName,law:spec.law,goal:spec.goal,modelIdentity:image.modelIdentity,runIdentity:Buffer.from(run.runIdentity()).toString('hex'),prefixes,beliefs,appraisals:appraisals.map(v=>({mean:q(f(v,4)&&f(f(v,4),1)),expected:q(f(v,5)),confidence:q(f(v,6))})),applications:applications.map(v=>({classification:Number(f(f(v,2),3).value),prior:q(f(v,3)&&f(f(v,3),1)),posterior:q(f(v,4)&&f(f(v,4),1)),applied:f(v,5)})),observations:outputs.filter(v=>type(v,737)).length,stateSha256:hash(snap.state),safeOutputSha256:hash(snap.outputs),traceSha256:hash(snap.trace),finalSaveSha256:hash(run.save())};
  results.push(result);raw.set(spec.name,snap);if(results.length%12===0)console.log('Qualified prefixes '+results.length+'/'+plan.runs.length);
 }
 const get=(name,law=1)=>results.find(r=>r.caseName===name&&r.law===law),mean=(name,law=1)=>get(name,law).beliefs[0]?.mean,lastApp=(name,law=1)=>get(name,law).appraisals.at(-2);
 assert.equal(mean('misleading'),'1/1');assert.equal(lastApp('misleading').confidence,'8/9');assert.equal(mean('accurate'),'0/1');assert.equal(mean('corrected'),'8/17');
 assert.equal(mean('corrected',2),'0/1');assert.equal(get('corrected',3).beliefs.length,0);
 for(const law of [1,2,3]){
  assert.deepEqual(raw.get(`misleading-law-${law}`).outputs,raw.get(`hidden-law-${law}`).outputs);
  assert.deepEqual(raw.get(`misleading-law-${law}`).state,raw.get(`hidden-law-${law}`).state);
  assert.deepEqual(raw.get(`independent-law-${law}`).outputs,raw.get(`permuted-law-${law}`).outputs);
  for(const goal of [0,1])assert.deepEqual(raw.get(`misleading-law-${law}`).state,raw.get(`goal-${goal}-law-${law}`).state);
 }
 assert.equal(lastApp('misleading').expected,'-1/1');assert.equal(lastApp('goal-0').expected,'0/1');assert.equal(lastApp('goal-1').expected,'1/1');
 assert.equal(mean('safeAbsence'),'1/6');for(const name of ['noOpportunity','censored','unavailable']){assert.equal(mean(name),'1/1');assert.equal(get(name).beliefs[0].precision,'1');}
 assert.equal(get('unknown').beliefs.length,0);assert.equal(mean('knownZero'),'0/1');assert.equal(get('unknown').observations,0);assert.equal(get('empty').beliefs.length,0);
 assert.equal(get('misleading').appraisals[0].mean,null);assert.equal(get('misleading').appraisals[2].mean,'1/1');
 // Researcher-side negative controls are unlicensed alternatives, not covert public reads.
 const average=bits=>{let n=BigInt(bits.filter(Boolean).length),d=BigInt(bits.length),a=n,b=d;while(b){const t=a%b;a=b;b=t;}return `${n/a}/${d/a}`;};
 const sourceFrames=name=>decode(bytes(plan.runs.find(r=>r.caseName===name).orderedInputs)).items.flatMap(v=>f(v,2).items);
 const oracleMean=average(sourceFrames('misleading').map(v=>f(v,3))),unconditionalMean=average(sourceFrames('noOpportunity').map(v=>f(v,7)));
 assert.notEqual(oracleMean,mean('misleading'));assert.notEqual(unconditionalMean,mean('noOpportunity'));
 // Explicit bad fusion: average observed belief with an authored desired-outcome bit.
 const goalBiasedAvoid=average([true,false]),goalBiasedSeek=average([true,true]);assert.notEqual(goalBiasedAvoid,goalBiasedSeek);
 const negativeControls={TruthLookup:{oracleMean,admittedMean:mean('misleading'),fails:'different evidence with fixed truth'},GoalAsBelief:{formula:'(belief mean + desired outcome bit)/2',avoid:goalBiasedAvoid,seek:goalBiasedSeek,fails:'exact belief equality under goal intervention'},UnconditionalAbsence:{naiveMean:unconditionalMean,admittedMean:mean('noOpportunity'),fails:'zero update without observed qualifying opportunity'}};
 const codePaths=['src/campaign3/beliefCodecs.ts','src/campaign3/beliefModel.ts','src/campaign3/beliefMath.ts','src/campaign3/beliefRuntime.ts','src/campaign3/beliefFactory.ts'];
 const receipt={date:'2026-09-20',status:'PASS: bounded frozen public comparison',planSha256:hash(fs.readFileSync('docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json')),models:new Set(results.map(r=>r.modelIdentity)).size,runs:results.length,prefixRestores:results.reduce((n,r)=>n+r.prefixes.length,0),nextStepContinuationComparisons:results.reduce((n,r)=>n+r.prefixes.length,0),code:codePaths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),negativeControls,results};
 fs.writeFileSync(destination,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({models:receipt.models,runs:receipt.runs,prefixRestores:receipt.prefixRestores}));
}finally{await server.close();}
