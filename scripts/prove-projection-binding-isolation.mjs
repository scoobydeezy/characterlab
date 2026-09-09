import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),source='src/substrate/state.ts',test='src/test/projectionBindingIsolation.test.ts';
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=[source,test].map(fingerprint),code=fs.readFileSync(new URL(source,root),'utf8');
const snapshots=code.match(/this\.#bindings = Object\.fromEntries[\s\S]*?as Bindings;/g);assert.equal(snapshots?.length,1);
const mutants=[
 {name:'retain-caller-binding-alias',from:snapshots[0],to:'this.#bindings = bindings;'},
 {name:'retain-nested-direct-path-alias',from:'path:cloneStatePath(binding.path)',to:'path:binding.path'},
];
async function run(mutant){
 let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{config:false,run:true,watch:false,include:['src/test/**/*.test.ts'],maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'projection-isolation-control',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+source))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});assert(ctx);
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0);const tests=[];
  const walk=t=>{if(t.type==='test')tests.push({name:t.name,state:t.result?.state,errors:t.result?.errors?.map(e=>e.message)});for(const c of t.tasks??[])walk(c);};for(const f of ctx.state.getFiles())walk(f);
  assert.equal(tests.length,3);const failures=tests.filter(t=>t.state==='fail');
  if(mutant){assert.equal(transformed,1);assert(failures.some(t=>t.name.startsWith('PRJ binding isolation: direct')));}else assert.equal(failures.length,0);
  console.log(`${mutant?.name??'baseline'}: ${mutant?'DETECTED':'PASS'}`);return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',...(mutant??{}),tests};
 }finally{await ctx.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baseline=await run(),results=[];for(const mutant of mutants)results.push(await run(mutant));assert.deepEqual([source,test].map(fingerprint),before);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_PROJECTION_BINDING_ISOLATION_PROOF.json',root),JSON.stringify({status:'CORRECTION EVIDENCE SUBMITTED',sourceFingerprints:before,baseline,mutants:results,limitations:['Generic construction alias isolation; not a public Campaign2 executor-binding API.','No purity guarantee for trusted derive closures, no universal hostile-code confinement.','Whole AD-E7/B/FCT remain open.']},null,2)+'\n');process.exitCode=0;
