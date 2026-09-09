import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),source='src/campaign2/adaptationEvaluation.ts',test='src/test/campaign2FrozenGateOrder.test.ts';
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=[source,test].map(fingerprint);
const mutants=[
 {name:'ignore-referent-match',from:'if(key(f(match,u(f(match,1n))===1n?2n:3n))!==key(f(basis,2n)))return undefined;',to:''},
 {name:'omit-empty-dispatch',from:'outputs:[dispatch,...evaluations]',to:'outputs:[...(execution.rules.length?[dispatch]:[]),...evaluations]'},
 {name:'state-dependent-applicability',from:'const evaluations=execution.rules.map(({ruleId,rule,path,gatePath})=>{',to:"const evaluations=execution.rules.filter(({gatePath})=>!gatePath||snapshot.read(gatePath)===undefined).map(({ruleId,rule,path,gatePath})=>{"},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
  {plugins:mutant?[{name:'applicability-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};
  for(const f of ctx.state.getFiles())walk(f);assert.equal(tests.length,2);
  if(mutant){assert.equal(transformed,1);assert(tests.some(t=>t.name.startsWith('AD-E2:')&&t.state==='fail'));}
  else assert(tests.every(t=>t.state==='pass'));
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);
  return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant?{source,from:mutant.from,to:mutant.to}:{}),tests};
 }finally{await ctx.close();for(const listener of process.listeners('unhandledRejection'))if(!listeners.has(listener))process.removeListener('unhandledRejection',listener);}
}
const baseline=await run(),results=[];
for(const mutant of mutants)results.push(await run(mutant));
assert.deepEqual([source,test].map(fingerprint),before);
fs.writeFileSync(new URL(process.argv[2]??'docs/planning/CAMPAIGN2_APPLICABILITY_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',contract:'adaptation-input/0.31-candidate',sourceFingerprints:before,baseline,mutants:results,
 limitations:['Isolated two-rule declaration specimen; frozen production artifacts unchanged.','Wrong-referent exposure uses an existing runtime-origin identity family, not a second character or CONTENT kind.','Three fixed-declaration in-memory substitutions; no exhaustive applicability or whole FCT verdict.']},null,2)+'\n');
process.exitCode=0;
