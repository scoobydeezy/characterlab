import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),runtime='src/campaign2/adaptationRuntime.ts',domains='src/campaign2/adaptationDomains.ts',test='src/test/campaign2RegExactWitnesses.test.ts';
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=[runtime,domains,'src/campaign2/regulatoryReference.ts',test].map(fingerprint);
const mutants=[
 {name:'omit-pre-instant-reference-validation',source:runtime,from:'beforeInstant(state,instant){\n        domains.validateStatic(state);domains.validateReferences(state,instant);',to:'beforeInstant(state,instant){\n        domains.validateStatic(state);',occurrences:1,required:'AC-H: a committed repairing rule'},
 {name:'collapse-unknown-variable-to-out-of-range',source:domains,from:"result.code==='REG_UNKNOWN_VARIABLE'?'ADAPTATION_REFERENCE_UNKNOWN_VARIABLE':'ADAPTATION_REFERENCE_OUT_OF_RANGE'",to:"'ADAPTATION_REFERENCE_OUT_OF_RANGE'",occurrences:2,required:'AD-E10: real domain component'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'reference-settlement-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+mutant.source))return;const normalized=code.replaceAll('\r\n','\n');assert.equal(normalized.split(mutant.from).length-1,mutant.occurrences);transformed++;return normalized.replaceAll(mutant.from,mutant.to);}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,8);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert(failures.some(t=>t.name.startsWith(mutant.required)));}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual([runtime,domains,'src/campaign2/regulatoryReference.ts',test].map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_REFERENCE_SETTLEMENT_PROOF_REV4.json',root),JSON.stringify({status:'EVIDENCE SUBMITTED',contracts:['adaptation-input/0.31-candidate','adaptation-settlement/0.2-candidate','regulatory-reference/0.5-candidate'],sourceFingerprints:before,baseline,mutants:results,limitations:['Finite AD-E10 and existing REG/AC-H witnesses; no whole B/FCT acceptance.','Unknown-variable translation is actual domain-component evidence with separate public earlier exclusion.','No production profile widening or exhaustive fault matrix.']},null,2)+'\n');process.exitCode=0;

