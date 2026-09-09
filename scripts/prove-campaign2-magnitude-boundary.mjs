import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),runtime='src/campaign2/adaptationEvaluation.ts',domains='src/campaign2/adaptationDomains.ts',test='src/test/campaign2MagnitudeBoundary.test.ts';
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=[runtime,domains,test].map(fingerprint);
const expression='q=countStepWithBaselineGate(u(f(execution.basis,3n)),step.value,p,g);';
const mutants=[
 {name:'clamp-negative-q-to-zero',source:runtime,from:expression,to:'raw=countStepWithBaselineGate(u(f(execution.basis,3n)),step.value,p,g),q=raw<0n?0n:raw;',required:'AD-E9 unsigned leaf'},
 {name:'clamp-bounded-q-to-maximum',source:runtime,from:expression,to:'raw=countStepWithBaselineGate(u(f(execution.basis,3n)),step.value,p,g),q=path.rootStateTypeId===302n&&(path.fieldId===1n||path.fieldId===4n)&&raw>10n?10n:raw;',required:'AD-E9 bounded leaf'},
 {name:'invent-ceiling-for-unbounded-leaves',source:domains,from:'if(magnitude<0n||(maximum!==undefined&&magnitude>maximum))',to:'if(magnitude<0n||magnitude>(maximum??10n))',required:'AD-E9 unbounded leaf'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'magnitude-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+mutant.source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,13);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert(failures.some(t=>t.name.startsWith(mutant.required)));}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual([runtime,domains,test].map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_MAGNITUDE_BOUNDARY_PROOF_REV3.json',root),JSON.stringify({status:'EVIDENCE SUBMITTED',contract:'adaptation-input/0.31-candidate',sourceFingerprints:before,baseline,mutants:results,limitations:['Finite public-model matrix; no universal arbitrary-integer proof.','No whole B/FCT or AD-E9 acceptance assigned by this assay.','Public snapshot rollback here; complete queue/allocator fault matrix belongs to AD-E12.','Second-leaf confinement also relies on separately accepted AD-E4/E8 exact target/diff enforcement.']},null,2)+'\n');process.exitCode=0;
