import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),test='src/test/campaign2MutationEvidence.test.ts',evaluator='src/campaign2/adaptationEvaluation.ts',state='src/campaign2/stateModel.ts';
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=[state,evaluator,test].map(fingerprint);
const mutants=[
 {name:'swap-rule-labels-before-snapshot',source:evaluator,from:'return {ruleId,rule,path,gatePath};',to:"return {ruleId:key(ruleId)===key(typedIdentifier(1035n,text('rule/fixture-tolerance')))?typedIdentifier(1035n,text('rule/fixture-sensitization')):key(ruleId)===key(typedIdentifier(1035n,text('rule/fixture-sensitization')))?typedIdentifier(1035n,text('rule/fixture-tolerance')):ruleId,rule,path,gatePath};",requiredTest:'AD-E4/E8 independent fixture oracle'},
 {name:'skip-family-scope-component',source:state,from:'if(!roots.includes(path.rootStateTypeId))',to:'if(false)'},
 {name:'skip-exact-target',source:state,from:'if(!targets.has(key(statePathValue(path))))',to:'if(false)'},
 {name:'skip-actual-diff',source:evaluator,from:'if(JSON.stringify(applied.diffs.map(d=>key(mutationDiffValue(d))))!==JSON.stringify(expected.diffs))',to:'if(false)'},
 {name:'skip-staged-output',source:evaluator,from:'if(result.outputs.length!==expected.outputs.length||result.outputs.some((v,i)=>key(v)!==key(decodeCampaign2(expected.outputs[i]))))',to:'if(false)'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'write-boundary-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+mutant.source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};
  for(const f of ctx.state.getFiles())walk(f);assert.equal(tests.length,25);
  const failed=tests.filter(t=>t.state==='fail');if(mutant)assert.equal(transformed,1);else assert.equal(failed.length,0);
  const status=mutant?(failed.length?'DETECTED':'SURVIVED'):'PASS';console.log(`${mutant?.name??'baseline'}: ${status}`);
  if(mutant?.requiredTest)assert(failed.some(t=>t.name.startsWith(mutant.requiredTest)));
  return {name:mutant?.name??'baseline',status,...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));
assert.deepEqual([state,evaluator,test].map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_ADAPT_WRITE_BOUNDARY_PROOF_REV6.json',root),JSON.stringify({status:results.every(r=>r.status==='DETECTED')?'COMPONENT PASS':'INCOMPLETE',sourceFingerprints:before,baseline,mutants:results,limitations:['Fixed in-memory substitutions only.','Family-scope component and alternate-subject generic-positive/bounded-exclusion scopes retain their accepted ruling.','One pre-snapshot rule-label swap and one staged association swap; not arbitrary resolver equivalence.','Revision1 retained: redundant staged-patch guard survived and was removed; actual-diff guard carries that obligation.']},null,2)+'\n');
process.exitCode=0;
