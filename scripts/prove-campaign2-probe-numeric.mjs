import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),file='src/campaign2/probeReadout.ts',test='src/test/campaign2ProbeNumericDomain.test.ts';
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex');
const mutants=[
  {
    "name": "clip-negative-level",
    "from": "input.reference+input.displacement",
    "to": "input.reference+input.displacement<0n?0n:input.reference+input.displacement"
  },
  {
    "name": "saturate-at-half-range",
    "from": "input.reference+input.displacement",
    "to": "input.reference+input.displacement>50n?50n:input.reference+input.displacement"
  },
  {
    "name": "threshold-instead-of-readout",
    "from": "input.reference+input.displacement",
    "to": "input.reference+input.displacement>0n?1n:0n"
  },
  {
    "name": "response-gain",
    "from": "input.reference+input.displacement",
    "to": "2n*(input.reference+input.displacement)"
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
  for(const f of ctx.state.getFiles())walk(f);assert.equal(tests.length,1);
  const failed=tests.filter(t=>t.state==='fail');if(mutant){assert.equal(transformed,1);assert(failed.length>0);}else assert.equal(failed.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',tests};
 }finally{await ctx.close();for(const listener of process.listeners('unhandledRejection'))if(!prior.has(listener))process.removeListener('unhandledRejection',listener);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_PROBE_NUMERIC_MUTATION_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:[file,test].map(path=>({path,sha256:hash(path)})),baseline,mutants:results,
 limitations:['Test-only in-memory interpreter substitutions; frozen declarations unchanged.','Generic accepted signed REG domain with production probe consumer; frozen public profile excludes the broader declarations.','No global factory, VAL, ADAPT or Campaign-2 verdict.']},null,2)+'\n');
process.exitCode=0;
