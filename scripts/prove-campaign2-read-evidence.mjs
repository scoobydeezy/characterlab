import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),source='src/campaign2/adaptationEvaluation.ts',test='src/test/campaign2ReadEvidence.test.ts';
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=[source,test].map(fingerprint);
const mutants=[
 {name:'omit-active-execution-guard',from:'if(active)',required:'AD-E7 rejects active'},
 {name:'allow-finish-during-active-evaluation',from:'if(active||closed||cursor!==executions.length)',to:'if(closed||cursor!==executions.length)',required:'AD-E7 rejects active'},
 {name:'omit-per-rule-instrumentation-check',from:"if(JSON.stringify(segment.map(v=>key(actualReadRecordValue(v))))!==JSON.stringify(expectedSegment))",required:'AD-E7 rejects'},
 {name:'omit-staged-read-comparison',from:"if(JSON.stringify(result.actualReadRecords.map(v=>key(actualReadRecordValue(v))))!==JSON.stringify(expected.reads)||JSON.stringify(result.actualReads.map(key))!==JSON.stringify(expected.reads))",required:'AD-E7 staged read evidence'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'read-evidence-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to??'if(false)');}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,10);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert(failures.some(t=>t.name.startsWith(mutant.required)));}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual([source,test].map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_READ_EVIDENCE_PROOF_REV2.json',root),JSON.stringify({status:'CORRECTION EVIDENCE SUBMITTED',contract:'adaptation-input/0.31-candidate',sourceFingerprints:before,baseline,mutants:results,limitations:['Internal admitted batch boundary, not a public executor injection API.','Partial AD-E7 evidence only; no whole-vector or B/FCT acceptance.','Historical evaluator-sensitive reports require explicit refresh before whole B/FCT.']},null,2)+'\n');process.exitCode=0;
