import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),runtime='src/campaign2/adaptationRuntime.ts',scheduler='src/substrate/scheduler.ts',evaluator='src/campaign2/adaptationEvaluation.ts',test='src/test/campaign2StageBoundary.test.ts';
const paths=[runtime,scheduler,evaluator,test],fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')}),before=paths.map(fingerprint);
const mutants=[
 {name:'omit-unconsumed-batch-barrier',source:evaluator,from:'if(active||closed||cursor!==executions.length)',to:'if(active||closed)',required:'skip-execute'},
 {name:'permit-handler-input-only-origin',source:runtime,from:"if(key(event.eventTypeId)===key(AUTHORED_FACT_EVENT)||key(event.eventTypeId)===key(PROBE_SOURCE_EVENT)||task&&key(event.eventTypeId)===key(TASK_DEADLINE_EVENT))throw new SchedulerContractError('INPUT_ONLY_EVENT_ORIGIN_VIOLATION','sources are compiler-only inputs');",to:'void event;',required:'input-only-emission'},
 {name:'omit-ordinary-phase140-exclusion',source:runtime,from:"for(const event of events)if(!shared.registrationForEvent(event.eventTypeId))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','undeclared phase-140 event');",to:'void events;',required:'ordinary-event'},
 {name:'permit-late-phase140-child',source:scheduler,from:"if(batch&&currentEvent.phase===140n&&result.emittedEvents.length)fail('ADAPTATION_STAGE_VIOLATION','automatic outputs are terminal');",to:'void batch;',required:'late-child'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'stage-boundary-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+mutant.source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,7);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert(failures.some(t=>t.name.endsWith(mutant.required)));}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual(paths.map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_STAGE_BOUNDARY_PROOF_REV5.json',root),JSON.stringify({status:'EXECUTED BOUNDED EVIDENCE',sourceFingerprints:before,baseline,mutants:results,limitations:['Internal fault injection into real public-factory runtime; not public scheduling authority.','Ordinary event exclusion, forbidden late-child stage, missing consumption and InputOnly emission are distinguished from later ingress failure.','Positive witness checks one batch and exactly one execution per original event; duplicate execution also rejects with no extra reads.']},null,2)+'\n');process.exitCode=0;

