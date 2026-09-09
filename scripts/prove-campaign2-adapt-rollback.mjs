import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),source='src/substrate/scheduler.ts',test='src/test/campaign2AdaptRollbackStages.test.ts';
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const paths=[source,'src/campaign2/adaptationRuntime.ts','src/campaign2/adaptationEvaluation.ts',test],before=paths.map(fingerprint);
const mutants=[
 {name:'publish-failed-working-state',injection:'this.#state=this.#adapter.clone(working.state);'},
 {name:'publish-failed-working-queue',injection:'this.#queue=working.queue.map(cloneEvent);'},
 {name:'burn-failed-working-allocators',injection:'this.#allocators={...working.allocators};'},
 {name:'publish-failed-working-trace-and-outputs',injection:'this.#committedTrace.push(...working.trace);this.#outputs.push(...working.outputs);'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'rollback-leak-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+source))return;const from="this.#status = 'Failed';";assert.equal(code.split(from).length-1,1);transformed++;return code.replace(from,mutant.injection+from);}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,6);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert(failures.some(t=>t.name.startsWith('AD-E12 final-trace')));}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual(paths.map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_ADAPT_ROLLBACK_PROOF_REV3.json',root),JSON.stringify({status:'EXECUTED BOUNDED EVIDENCE',sourceFingerprints:before,baseline,mutants:results,limitations:['Six explicit failure stages and four publication-leak substitutions; not all possible host failures.','No semantic contract widening or whole B/FCT qualification.']},null,2)+'\n');process.exitCode=0;

