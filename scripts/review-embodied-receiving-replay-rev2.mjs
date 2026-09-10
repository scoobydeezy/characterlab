// Replay every whole-instant prefix in the public receiving witness corpus.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/EMBODIED_RECEIVING_REPLAY_REV2.json';assert(!fs.existsSync(output));
const folder='docs/planning/embodied-receiving-execution-rev4',cohort='docs/planning/campaign3-embodied-receiving-model-rev1',executions=JSON.parse(fs.readFileSync(folder+'/REVIEW.json')),freeze=JSON.parse(fs.readFileSync(cohort+'/FREEZE.json'));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),read=p=>new Uint8Array(Buffer.from(fs.readFileSync(p,'utf8').trim(),'hex')),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const f of executions.sources)assert.deepEqual(fp(f.path),f);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'}),results=[];
try{
 const api=await server.ssrLoadModule('/src/campaign3/receivingFactory.ts'),cache=new Map();
 for(const specimen of executions.runs){const name=specimen.model,source={...freeze.versions,...Object.fromEntries(['content','registry','parameters'].map(n=>[n,read(cohort+'/'+name+'/'+n+'.cenc.hex')]))};if(!cache.has(name))cache.set(name,await api.prepareReceivingModel(source));
  const input={initialState:read(folder+'/'+specimen.name+'/initial.cenc.hex'),orderedInputs:read(folder+'/'+specimen.name+'/inputs.cenc.hex'),runSeed:new Uint8Array(32)},run=await api.createReceivingRun(cache.get(name),input),prefixes=[run.save()];while(await run.settleNextInstant())prefixes.push(run.save());
  const final=read(folder+'/'+specimen.name+'/save.cenc.hex');assert.deepEqual(run.save(),final);const accepted=[];
  for(const [index,save] of prefixes.entries()){
   const restored=await api.restoreReceivingRun(source,{initialState:input.initialState,orderedInputs:input.orderedInputs,save});assert.deepEqual(restored.save(),save);while(await restored.settleNextInstant()){}assert.deepEqual(restored.save(),final);assert.deepEqual(restored.snapshot().outputs,read(folder+'/'+specimen.name+'/outputs.cenc.hex'));assert.deepEqual(restored.snapshot().trace,read(folder+'/'+specimen.name+'/trace.cenc.hex'));accepted.push({index,saveBytes:save.length,sha256:sha(save),restoreAndContinuation:'PASS'});
  }
  results.push({specimen:specimen.name,model:name,prefixes:accepted});console.log(specimen.name+': '+accepted.length+' prefixes');
 }
 // work25 is a failure-control model at its ceiling, but has a real successful22-event prefix too.
 const source={...freeze.versions,...Object.fromEntries(['content','registry','parameters'].map(n=>[n,read(cohort+'/work25/'+n+'.cenc.hex')]))},handle=await api.prepareReceivingModel(source),input={initialState:read(folder+'/baseline/initial.cenc.hex'),orderedInputs:read(folder+'/baseline/inputs.cenc.hex'),runSeed:new Uint8Array(32)},run=await api.createReceivingRun(handle,input),prefixes=[run.save()];while(await run.settleNextInstant())prefixes.push(run.save());
 for(const save of prefixes){const restored=await api.restoreReceivingRun(source,{initialState:input.initialState,orderedInputs:input.orderedInputs,save});while(await restored.settleNextInstant()){}assert.deepEqual(restored.save(),run.save());}
 results.push({specimen:'work25-positive-prefix',model:'work25',prefixes:prefixes.map((save,index)=>({index,saveBytes:save.length,sha256:sha(save),restoreAndContinuation:'PASS'}))});
}finally{await server.close();}
fs.writeFileSync(output,JSON.stringify({status:'ALL WITNESS PREFIXES RESTORE AND CONTINUE EXACTLY',models:new Set(results.map(r=>r.model)).size,publicSpecimens:results.length,prefixes:results.reduce((n,r)=>n+r.prefixes.length,0),results,sources:[folder+'/REVIEW.json',cohort+'/FREEZE.json','src/campaign3/receivingFactory.ts','src/campaign3/receivingRuntime.ts','src/campaign3/receivingTrace.ts','src/campaign3/receivingArbitration.ts','scripts/review-embodied-receiving-replay-rev2.mjs'].map(fp),limits:['Exhaustive across this finite witness set, not every admitted original sequence.','Public tampering and whole-instant boundary controls are in receivingFactory.test.ts.']},null,2)+'\n');
