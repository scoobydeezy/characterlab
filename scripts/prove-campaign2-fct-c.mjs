import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),runtime='src/campaign2/adaptationRuntime.ts',generic='src/test/campaign2GenericRoster.test.ts',bounded='src/test/campaign2RosterScope.test.ts';
const executor='src/campaign2/evidExecution.ts';
const sources=[runtime,executor,'src/campaign2/transitionIngressV04.ts','src/campaign2/requiredProjection.ts','src/substrate/state.ts',generic,bounded,'src/test/fixtures/campaign2RosterModel.ts'];
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex'),fingerprints=sources.map(path=>({path,sha256:hash(path)}));
const from="const version=text('character-learning-evidence/0.5-candidate');";
const mutations=['evaluation','learning'].flatMap(stage=>['state','event','trace','parent','content','registry'].map(field=>({stage,field,attempt:field==='state'?
`const x=input.evaluation?input.payload:(input.payload as any).fields.get(2n);const observer=(x as any).fields.get(2n);const state=(input as any).state;const binding=state.read({rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:observer}]});if(binding.presence)binding.value.fields.get(1n);`:
`void (input as any).${field};`})));
async function run(test,mutant){
 let transformed=0;const prior=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}],env:{CHARACTERLAB_FCT_C_PROJECTION_MUTANT:mutant?mutant.stage:'0'},...(mutant?{testNamePattern:'FCT-C1:'}:{})},
 {plugins:mutant?[{name:'forbidden-evid-capability',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+executor))return;assert.equal(code.split(from).length-1,1);transformed++;return code.replace(from,`if(${mutant.stage==='evaluation'?'input.evaluation':'!input.evaluation'}){${mutant.attempt}}\n`+from);}}]:[]});
 assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  function walk(t){if(t.type==='test'&&['pass','fail'].includes(t.result?.state))tests.push({name:t.name,state:t.result.state,errors:t.result.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);}
  for(const f of ctx.state.getFiles())walk(f);assert.equal(tests.length,mutant?1:2);assert(tests.every(t=>t.state==='pass'),JSON.stringify(tests));assert.equal(transformed,mutant?1:0);
  return {test,mode:mutant?'EXACT REJECTION WITNESS':'BASELINE',status:'PASS',tests};
 }finally{await ctx.close();for(const listener of process.listeners('unhandledRejection'))if(!prior.has(listener))process.removeListener('unhandledRejection',listener);}
}
const genericBaseline=await run(generic),projectionRejections=[];
for(const mutation of mutations){projectionRejections.push({...await run(generic,mutation),...mutation});console.log(mutation.stage+'/'+mutation.field+': REJECTED');}
const boundedBaseline=await run(bounded);
for(const item of fingerprints)assert.equal(hash(item.path),item.sha256);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_FCT_C_PROOF.json',root),JSON.stringify({status:'FCT-C PASS — split-scope qualification',sourceFingerprints:fingerprints,genericBaseline,projectionRejections,boundedBaseline,
 priorFailure:{status:'PRESERVED SUPERSEDED CAPABILITY FAILURE',source:runtime,description:'Original inline semantic code could read context.state directly; guarded PRJ alone rejected but direct access completed successfully. Fixed by separating production semantic execution from the host context.'},
 expected:'Inner ILLEGAL_READ; outer TRANSITION_FAILURE; zero roster reads and whole-instant rollback for A/B/absent rosters, independently in both stages.',
 limitations:['Generic harness is not an admitted bounded factory profile.','Handler read evidence is observed directly; no generic canonical trace profile is invented.','Twelve explicit expected-rejection substitutions, not merely arbitrary test failures.','Host admission/allocation/state validation remains outside the isolated semantic executor.','No global factory/VAL/ADAPT/Campaign-2 verdict.']},null,2)+'\n');
console.log('FCT-C1 PASS; FCT-C2 PASS (12 rejected substitutions); FCT-C3 PASS.');
process.exitCode=0;
