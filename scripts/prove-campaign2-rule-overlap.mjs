import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),construction='src/campaign2/adaptationTransitions.ts',runtime='src/campaign2/adaptationEvaluation.ts',test='src/test/campaign2RuleOverlap.test.ts';
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=[construction,runtime,test].map(fingerprint);
const predicate='key(selected[i].match)===key(selected[j].match)&&key(selected[i].target)===key(selected[j].target)';
const mutants=[
 {name:'defer-guaranteed-collision-to-runtime',source:construction,from:`if(${predicate})`,to:'if(false)',required:'AD-E13 rejects guaranteed overlap'},
 {name:'reject-disjoint-matches',source:construction,from:`if(${predicate})`,to:'if(key(selected[i].target)===key(selected[j].target))',required:'AD-E13 permits disjoint exposure'},
 {name:'omit-runtime-target-collision',source:runtime,from:"if(targets.has(pathKey))throw new SchedulerContractError('ADAPTATION_TARGET_COLLISION','duplicate target across complete phase-140 batch');",to:'',required:'AD-E13 disjoint exposures can still collide'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'overlap-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+mutant.source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,21);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert(failures.some(t=>t.name.startsWith(mutant.required)));}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual([construction,runtime,test].map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_RULE_OVERLAP_PROOF_REV2.json',root),JSON.stringify({status:'COMPONENT PASS',contract:'adaptation-input/0.31-candidate',sourceFingerprints:before,baseline,mutants:results,limitations:['Five key forms, same/Step/Gate variants, four disjoint exposure positives, original distinct recipes and one runtime displacement collision.','No arbitrary matcher language or whole B/FCT qualification.','Runtime case checks no projection reads and public snapshot rollback with Failed status; full queue/allocator rollback remains separately evidenced.']},null,2)+'\n');process.exitCode=0;
