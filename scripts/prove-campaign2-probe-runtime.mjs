import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),file='src/campaign2/probeExecution.ts',test='src/test/campaign2ProbeRuntime.test.ts';
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex');
const mutants=[
  {
    "name": "ignore-retained-displacement",
    "file": "src/campaign2/probeReadout.ts",
    "from": "input.reference+input.displacement",
    "to": "input.reference+0n"
  },
  {
    "name": "normalize-without-scale",
    "from": "ExactRational.of(n.value,scale.value)",
    "to": "ExactRational.of(n.value,1n)"
  },
  {
    "name": "availability-always-true",
    "from": "available=f(definition,4n)===true",
    "to": "available=true"
  },
  {
    "name": "permission-ignored",
    "from": "permitted=available&&f(definition,5n)===true",
    "to": "permitted=available"
  },
  {
    "name": "skip-padding-advance",
    "from": "paddingRemaining--;allocator.allocateRuntimeId();",
    "to": "paddingRemaining--;"
  },
  {
    "name": "wrong-truth-family",
    "from": "typedIdentifier(1123,unsigned(allocator.allocateRuntimeId()))",
    "to": "typedIdentifier(1121,unsigned(allocator.allocateRuntimeId()))"
  },
  {
    "name": "borrow-adapt-accessor",
    "from": "atom(1028,'accessor/regulatory-diagnostic-displacement-prior')",
    "to": "atom(1028,'accessor/adaptation-target-prior')"
  }
];
async function run(mutant){
 let transformed=0;const prior=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
  {plugins:mutant?[{name:'batch-mutant',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+(mutant.file??file)))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  function walk(t){if(t.type==='test'&&['pass','fail'].includes(t.result?.state))tests.push({name:t.name,state:t.result.state,errors:t.result.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);}
  for(const f of ctx.state.getFiles())walk(f);assert.equal(tests.length,15);
  const failed=tests.filter(t=>t.state==='fail');if(mutant){assert.equal(transformed,1);assert(failed.length>0);}else assert.equal(failed.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',tests};
 }finally{await ctx.close();for(const listener of process.listeners('unhandledRejection'))if(!prior.has(listener))process.removeListener('unhandledRejection',listener);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_PROBE_RUNTIME_MUTATION_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:[file,'src/campaign2/probeReadout.ts',test].map(path=>({path,sha256:hash(path)})),baseline,mutants:results,
 limitations:['Test-only in-memory interpreter substitutions; frozen declarations unchanged.','Fifteen probe factory controls; seven substitutions do not exhaust all frozen probe adversarial obligations.','No global factory, VAL, ADAPT or Campaign-2 verdict.']},null,2)+'\n');
process.exitCode=0;
