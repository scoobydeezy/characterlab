// Current-source substitutions; never edits production files or frozen model bytes.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),output='docs/planning/MEASUREMENT_PREDICTION_RUNTIME_PROOF_REV2.json';
assert(!fs.existsSync(new URL(output,root)),'Preserve previous proof');
const paths=['src/campaign2/predictionExecution.ts','src/campaign2/predictionModel.ts','src/campaign2/predictionFactory.ts','src/campaign2/adaptationRuntime.ts','src/campaign2/traceBinding.ts','src/substrate/scheduler.ts','src/test/campaign2Prediction.test.ts','src/test/campaign2PredictionComponent.test.ts','scripts/prove-measurement-prediction.mjs'];
const fp=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')}),before=paths.map(fp);
const source=paths[0],component=paths[7],publicTest=paths[6];
const mutants=[
 {name:'count-repeated-observation-as-fresh',from:'basis.some(v=>key(v)===key(ref))',to:'false',test:component,pattern:'PRED-D/H/K'},
 {name:'replace-mean-by-last-reading',from:'rational(count*m.numerator*x.denominator+x.numerator*m.denominator,(count+1n)*m.denominator*x.denominator)',to:'x',test:component,pattern:'PRED-D/H/K|PRED-P'},
 {name:'allow-sixty-fifth-support',from:'count>=u(f(model.definition,4n))',to:'count>u(f(model.definition,4n))',test:component,pattern:'PRED-D/H/K'},
 {name:'same-instant-read-back-edge',from:'simDuration(1n)',to:'simDuration(0n)',test:publicTest,pattern:'public prediction, independent memory'},
 {name:'application-extra-output',from:'patch={operations:[{kind:',to:'outputs.push(list([]));patch={operations:[{kind:',test:publicTest,pattern:'public prediction, independent memory'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[mutant?.test??component],{config:false,run:true,watch:false,environment:'node',maxWorkers:1,minWorkers:1,testNamePattern:mutant?.pattern,reporters:[{onFinished(){}}]}, {plugins:mutant?[{name:'prediction-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx);try{assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];const walk=t=>{if(t.type==='test'&&t.result?.state!=='skip'&&t.result?.state)tests.push({name:t.name,state:t.result.state,errors:t.result.errors?.map(e=>e.message)});for(const child of t.tasks??[])walk(child);};for(const f of ctx.state.getFiles())walk(f);
 const failed=tests.filter(t=>t.state==='fail');assert(tests.length);if(mutant){assert.equal(transformed,1);assert(failed.length,'named control did not detect substitution');}else assert.equal(failed.length,0);
 console.log(`${mutant?.name??'component-baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'component-baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual(paths.map(fp),before);
fs.writeFileSync(new URL(output,root),JSON.stringify({status:'EXECUTED BOUNDED EVIDENCE; NOT WHOLE QUALIFICATION',sourceFingerprints:before,baseline,mutants:results,limitations:['Generic/component interventions and public profile controls are named separately.','Only the listed source substitutions are claimed detected.','No immediate phase30 producer, calibrated uncertainty, reward or full Campaign2 topology is qualified.']},null,2)+'\n');process.exitCode=0;
