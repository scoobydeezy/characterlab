// In-memory substitutions against current production code; frozen artifacts remain untouched.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const output='docs/planning/TASK_LIFECYCLE_RUNTIME_PROOF_REV2.json';
assert(!fs.existsSync(output),'preserve previous proof');
const source='src/campaign2/taskExecution.ts',runtime='src/test/campaign2TaskRuntime.test.ts',boundary='src/test/campaign2TaskBoundary.test.ts';
const paths=[source,runtime,boundary,'src/campaign2/taskFactory.ts','src/campaign2/taskBootstrap.ts','src/campaign2/taskModel.ts','src/campaign2/taskDeclarations.ts','src/campaign2/orderedInputs.ts','src/campaign2/adaptationRuntime.ts','src/campaign2/memoryExecution.ts','src/campaign2/predictionExecution.ts','src/campaign2/traceBinding.ts','src/substrate/scheduler.ts','scripts/prove-task-lifecycle.mjs'];
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(fingerprint);
const mutants=[
 {name:'immortal-open-clock',from:"if(name(event)===names[2])value=r(372,[unsigned(3)]);",to:"if(name(event)===names[2])value=undefined;",test:runtime,pattern:'private clocks terminate'},
 {name:'exclude-exact-lower-endpoint',from:'compare(p.x!,t.minimum)>=0n',to:'compare(p.x!,t.minimum)>0n',test:runtime,pattern:'exact inclusive interval'},
 {name:'overwrite-terminal-with-clock',from:'||u(f(rec(prior.value!,372n),1n))!==1n',to:'',test:runtime,pattern:'one safe measurement satisfies'},
 {name:'permit-delayed-observation',from:"typeof at==='boolean'||at.kind!=='signed'||at.value!==instant",to:'false',test:boundary,pattern:'actual M1 source rejects'},
 {name:'skip-task-collision',from:'if(targets.has(k))',to:'if(false)',test:boundary,pattern:'actual task target collision'},
 {name:'skip-preflight-seal',from:'||!sealed||!p',to:'||!p',test:boundary,pattern:'actual task target collision'},
 {name:'unbound-task-source',from:'!pending.has(ek(event))',to:'false',test:runtime,pattern:'task forged association'},
];
async function run(mutant){let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',mutant?[mutant.test]:[runtime,boundary],{config:false,run:true,watch:false,environment:'node',maxWorkers:1,minWorkers:1,testNamePattern:mutant?.pattern??'^(?!.*task fixed slots)',reporters:[{onFinished(){}}]}, {plugins:mutant?[{name:'task-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx);try{assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];const walk=t=>{if(t.type==='test'&&t.result?.state&&t.result.state!=='skip')tests.push({name:t.name,state:t.result.state,errors:t.result.errors?.map(e=>e.message)});for(const child of t.tasks??[])walk(child);};for(const file of ctx.state.getFiles())walk(file);assert(tests.length);const failed=tests.filter(t=>t.state==='fail');if(mutant){assert.equal(transformed,1);assert(failed.length,'substitution escaped named control');}else assert.equal(failed.length,0);console.log((mutant?.name??'baseline')+': '+(mutant?'DETECTED':'PASS'));return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};}
 finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const m of mutants)results.push(await run(m));assert.deepEqual(paths.map(fingerprint),before);
fs.writeFileSync(output,JSON.stringify({status:'BOUNDED CURRENT-SOURCE SUBSTITUTIONS EXECUTED',sourceFingerprints:before,baseline,mutants:results,limitations:['Public controls and synthetic duplicate-clock component control are identified by test name.','This does not qualify the later workspace, pressure generation, identity or arbitration path.','Whole TC qualification and historical comparison remain separate.']},null,2)+'\n');

process.exitCode=0;
