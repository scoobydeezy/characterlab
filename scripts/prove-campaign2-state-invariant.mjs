import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),file='src/campaign2/adaptationDomains.ts',test='src/test/campaign2UntouchedState.test.ts';
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex');
const mutants=[
  {
    "name": "omit-zero-normal-form",
    "from": "if(n===0n)bad('explicit baseline entry');",
    "to": ""
  },
  {
    "name": "omit-tolerance-bound",
    "from": "if(spec!.name==='leaf/tolerance'&&n>scales.get(spec!.name)!)bad('tolerance exceeds scale');",
    "to": ""
  },
  {
    "name": "omit-load-bound",
    "from": "if(maximum!==undefined&&n>maximum)bad('load exceeds capacity');",
    "to": ""
  },
  {
    "name": "omit-regulatory-domain-existence",
    "from": "if(!reg.hasVariable(domain))bad('unknown regulatory variable');",
    "to": ""
  },
  {
    "name": "omit-load-domain-existence",
    "from": "if(!loads.has(key(domain)))bad('unknown load domain');",
    "to": ""
  },
  {
    "name": "omit-procedure-existence",
    "from": "else if(!procedures.has(key(domain)))bad('unknown procedure');",
    "to": ""
  },
  {
    "name": "skip-procedural-state-family",
    "from": "const stored=state.entries().filter(e=>e.path.rootStateTypeId===302n||e.path.rootStateTypeId===303n);",
    "to": "const stored=state.entries().filter(e=>e.path.rootStateTypeId===302n);"
  }
];
async function run(mutant){
 let transformed=0;const prior=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,include:['src/test/**/*.test.ts'],run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
  {plugins:mutant?[{name:'batch-mutant',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+file))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  function walk(t){if(t.type==='test'&&['pass','fail'].includes(t.result?.state))tests.push({name:t.name,state:t.result.state,errors:t.result.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);}
  for(const f of ctx.state.getFiles())walk(f);assert.equal(tests.length,13);
  const failed=tests.filter(t=>t.state==='fail');if(mutant){assert.equal(transformed,1);assert(failed.length>0);}else assert.equal(failed.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',tests};
 }finally{await ctx.close();for(const listener of process.listeners('unhandledRejection'))if(!prior.has(listener))process.removeListener('unhandledRejection',listener);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_STATE_INVARIANT_PROOF_REV2.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:[file,test].map(path=>({path,sha256:hash(path)})),baseline,mutants:results,
 limitations:['Test-only in-memory interpreter substitutions; frozen declarations unchanged.','Thirteen tests cover initial/restore full-map invalidity and one generic future-writer invariant; not every AD-F7 substitution.','No global factory, VAL, ADAPT or Campaign-2 verdict.']},null,2)+'\n');
process.exitCode=0;
