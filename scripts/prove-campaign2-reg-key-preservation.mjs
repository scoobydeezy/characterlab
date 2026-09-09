import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),source='src/campaign2/adaptationDomains.ts',test='src/test/campaign2RegKeyPreservation.test.ts';
const paths=[source,'src/campaign2/regulatoryReference.ts',test],fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')}),before=paths.map(fingerprint);
const mutants=[
 {name:'omit-variable-key-guard',from:'key(variable)!==key(f(selected,2n))',to:'false'},
 {name:'select-V1-query-V2',from:'validateKeyedRegulatoryReference(reg,k,f(k,1n),f(k,2n),at,signed(magnitude))',to:"validateKeyedRegulatoryReference(reg,k,f(k,1n),atom(1029n,'variable/key-preservation'),at,signed(magnitude))"},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'reg-key-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,1);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert.equal(failures.length,1);}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual(paths.map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_REG_KEY_PRESERVATION_PROOF.json',root),JSON.stringify({status:'EXECUTED BOUNDED EVIDENCE',sourceFingerprints:before,baseline,mutants:results,limitations:['Real generic two-variable component, public first-profile two-variable exclusion.','D=0 wrong-key rejection occurs before real REG arithmetic; both variables independently admit that scalar.','This guards a selected-key/query mismatch, not arbitrary malicious replacement of both trusted operands.']},null,2)+'\n');process.exitCode=0;
