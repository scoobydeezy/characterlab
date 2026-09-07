import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),file='src/campaign2/probeExecution.ts',test='src/test/campaign2ProbeScalarIsolation.test.ts';
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex');
const mutants=[
  {
    "name": "wrong-map-1",
    "from": "{kind:'direct',accessorId:PROBE_ACCESSOR,path}",
    "to": "{kind:'direct',accessorId:PROBE_ACCESSOR,path:{...path,fieldId:1n}}"
  },
  {
    "name": "wrong-map-2",
    "from": "{kind:'direct',accessorId:PROBE_ACCESSOR,path}",
    "to": "{kind:'direct',accessorId:PROBE_ACCESSOR,path:{...path,fieldId:2n}}"
  },
  {
    "name": "wrong-map-4",
    "from": "{kind:'direct',accessorId:PROBE_ACCESSOR,path}",
    "to": "{kind:'direct',accessorId:PROBE_ACCESSOR,path:{...path,fieldId:4n}}"
  },
  {
    "name": "arbitrary-root",
    "from": "{kind:'direct',accessorId:PROBE_ACCESSOR,path}",
    "to": "{kind:'direct',accessorId:PROBE_ACCESSOR,path:{...path,rootStateTypeId:999n}}"
  },
  {
    "name": "unselected-map-root",
    "from": "{kind:'direct',accessorId:PROBE_ACCESSOR,path}",
    "to": "{kind:'direct',accessorId:PROBE_ACCESSOR,path:{...path,selectors:[]}}"
  },
  {
    "name": "other-character",
    "from": "{kind:'direct',accessorId:PROBE_ACCESSOR,path}",
    "to": "{kind:'direct',accessorId:PROBE_ACCESSOR,path:{...path,selectors:[{kind:'mapKey',key:campaign2Record('RegulatoryAdaptationKey',{CharacterId:atom(1002,'other'),RegulatoryVariableId:V})}]}}"
  },
  {
    "name": "other-variable",
    "from": "{kind:'direct',accessorId:PROBE_ACCESSOR,path}",
    "to": "{kind:'direct',accessorId:PROBE_ACCESSOR,path:{...path,selectors:[{kind:'mapKey',key:campaign2Record('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:atom(1029,'other')})}]}}"
  },
  {
    "name": "duplicate-logical-read",
    "from": "leaf=projection.read('displacement');",
    "to": "leaf=projection.read('displacement');projection.read('displacement');"
  },
  {
    "name": "embed-scalar-in-support",
    "from": "observationId:ordinal.value",
    "to": "observationId:ordinal.value+leakedScalar",
    "capture": true
  },
  {
    "name": "hash-scalar-in-support",
    "from": "observationId:ordinal.value",
    "to": "observationId:ordinal.value+(leakedScalar*17n)%97n",
    "capture": true
  },
  {
    "name": "branch-support-on-scalar",
    "from": "observationId:ordinal.value",
    "to": "observationId:ordinal.value+(leakedScalar>50n?1n:0n)",
    "capture": true
  },
  {
    "name": "embed-scalar-in-experience-version",
    "from": "transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'",
    "to": "transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'+String(leakedScalar)",
    "capture": true
  }
];
async function run(mutant){
 let transformed=0;const prior=new Set(process.listeners('unhandledRejection'));
 const ctx=await startVitest('test',[test],{run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:[{onFinished(){}}]},
  {plugins:mutant?[{name:'batch-mutant',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+(mutant.file??file)))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;if(mutant.capture){assert.equal(code.split('begin(instant:bigint){').length-1,1);assert.equal(code.split('const q=ExactRational.of(n.value,scale.value)').length-1,1);code=code.replace('begin(instant:bigint){','begin(instant:bigint){let leakedScalar=0n;').replace('const q=ExactRational.of(n.value,scale.value)','leakedScalar=n.value;const q=ExactRational.of(n.value,scale.value)');}return code.replace(mutant.from,mutant.to);}}]:[]});
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
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_PROBE_ISOLATION_MUTATION_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:[file,'src/campaign2/probeReadout.ts',test].map(path=>({path,sha256:hash(path)})),baseline,mutants:results,
 limitations:['Test-only in-memory interpreter substitutions; frozen declarations unchanged.','Focused matched-allocation scalar isolation; wrong-read and scalar-carriage substitutions are test-only.','No global factory, VAL, ADAPT or Campaign-2 verdict.']},null,2)+'\n');
process.exitCode=0;
