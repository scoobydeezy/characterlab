import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),file='src/campaign2/adaptationEvaluation.ts',test='src/test/campaign2BatchWitnesses.test.ts';
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex');
const mutants=[
 {name:'omit-batch-collision-check',from:"if(targets.has(pathKey))throw new SchedulerContractError('ADAPTATION_TARGET_COLLISION','duplicate target across complete phase-140 batch');",to:''},
 {name:'filter-zero-count-rule',from:'const definition=transitions.ruleDefinition(ruleId);',to:'if(u(f(basis,3n))===0n)return undefined;const definition=transitions.ruleDefinition(ruleId);'},
 {name:'reverse-target-gate-read-evidence',from:'const segment=projection.actualReadRecords();',to:'const segment=[...projection.actualReadRecords()].reverse();'},
 {name:'omit-gate-read-evidence',from:'const segment=projection.actualReadRecords();',to:'const segment=projection.actualReadRecords().slice(0,1);'},
];
async function run(mutant){
 let transformed=0;const prior=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,include:['src/test/**/*.test.ts'],run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
  {plugins:mutant?[{name:'batch-mutant',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+file))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  function walk(t){if(t.type==='test'&&['pass','fail'].includes(t.result?.state))tests.push({name:t.name,state:t.result.state,errors:t.result.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);}
  for(const f of ctx.state.getFiles())walk(f);assert.equal(tests.length,5);
  const failed=tests.filter(t=>t.state==='fail');if(mutant){assert.equal(transformed,1);assert(failed.length>0);}else assert.equal(failed.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',tests};
 }finally{await ctx.close();for(const listener of process.listeners('unhandledRejection'))if(!prior.has(listener))process.removeListener('unhandledRejection',listener);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_BATCH_MUTATION_PROOF_REV2.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:[file,test].map(path=>({path,sha256:hash(path)})),baseline,mutants:results,
 limitations:['Test-only in-memory interpreter substitutions; frozen declarations unchanged.','Five tests cover AD-E1, AD-E6 and selected AD-E7 witnesses, not all ADAPT controls.','No global factory, VAL, ADAPT or Campaign-2 verdict.']},null,2)+'\n');
process.exitCode=0;
