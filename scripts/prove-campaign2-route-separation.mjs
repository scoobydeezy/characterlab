import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),source='src/campaign2/adaptationEvaluation.ts',test='src/test/campaign2RouteSeparation.test.ts';
const paths=[source,'src/campaign2/transitionIngressV04.ts',test],fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')}),before=paths.map(fingerprint);
const from='q=countStepWithBaselineGate(u(f(execution.basis,3n)),step.value,p,g);';
const mutants=[{name:'event-ordinal-as-magnitude',operand:'execution.admitted.event.eventId'},{name:'causal-parent-as-magnitude',operand:'execution.admitted.event.causalParentEventIds[0]'}];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'route-dependency-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+source))return;assert.equal(code.split(from).length-1,1);transformed++;return code.replace(from,from.slice(0,-1)+'+'+mutant.operand+';');}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,5);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert(failures.some(t=>t.name.startsWith('AD-E11 extra zero-count history')));}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual(paths.map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_ROUTE_SEPARATION_PROOF.json',root),JSON.stringify({status:'EXECUTED BOUNDED EVIDENCE',sourceFingerprints:before,baseline,mutants:results,limitations:['Five explicit public tests and two hidden-dependency mutants, not universal host-code noninterference.','EVID opaque occurrence is carried output identity; exact payload/identity closure is separately enforced.']},null,2)+'\n');process.exitCode=0;
