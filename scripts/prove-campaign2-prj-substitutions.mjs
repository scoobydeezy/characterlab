// Run the inherited generic PRJ control against isolated in-memory compiler substitutions.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {startVitest} from 'vitest/node';
const root=new URL('../',import.meta.url),file='src/campaign2/requiredProjection.ts',test='src/test/campaign2TransitionAdmission.test.ts';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const sources=[file,test].map(path=>({path,sha256:hash(fs.readFileSync(new URL(path,root)))}));
const mutants=[
 {name:'select-occurrence-instead-of-observer',from:'const selector=f(payload,q.sourceId)',to:'const selector=f(payload,1n)'},
 {name:'expose-roster-wrapper',from:'const value=f(sourceValue,q.projectedId);',to:'const value=sourceValue;'},
 {name:'lose-source-wrapper-evidence',from:'derivedSources:[source]',to:'derivedSources:[{...source,value}]'},
 {name:'skip-required-presence-carrier',from:"if(!source.presence)throw new StateContractError('REQUIRED_PROJECTION_VALUE_ABSENT','required projection source is absent');",to:'void source.presence;'},
 {name:'skip-roster-static-read-ban',from:"if(patternMatches(roster,path))invalidModel('IDN forbids static/legacy derived roster access');",to:'void path;'},
 {name:'skip-required-roster-projection',from:"if(rosterCount!==(rosterReadable?1:0))invalidModel('IDN roster ReadDomain requires exactly one subject projection');",to:'void rosterCount;'},
];
async function execute(mutant){
 let transformed=0;
 const ctx=await startVitest('test',[test],{config:false,include:['src/test/**/*.test.ts'],run:true,watch:false,maxWorkers:1,minWorkers:1,reporters:[],testNamePattern:'required projection accepts only admitted input'},
  {plugins:mutant?[{name:'isolated-prj-substitution',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+file))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);}}]:[]});
 assert(ctx,'Vitest context');
 try{
  assert.equal(ctx.state.getUnhandledErrors().length,0,'no runner errors');
  const selected=[];
  function walk(task){if(task.type==='test'&&task.result&&['pass','fail'].includes(task.result.state))selected.push({name:task.name,state:task.result.state,errors:task.result.errors?.map(e=>e.message)});for(const child of task.tasks??[])walk(child);}
  for(const f of ctx.state.getFiles())walk(f);
  assert.equal(selected.length,1,'exact inherited control executed');
  assert.equal(selected[0].state,mutant?'fail':'pass');if(mutant)assert.equal(transformed,1);
  return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',tests:selected};
 }finally{await ctx.close();}
}
const baseline=await execute(),mutations=[];console.log('Inherited PRJ execution control PASS');
for(const m of mutants){mutations.push({...await execute(m),source:file,from:m.from,to:m.to});console.log(m.name+': DETECTED');}
for(const s of sources)assert.equal(hash(fs.readFileSync(new URL(s.path,root))),s.sha256);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_PRJ_SUBSTITUTION_PROOF_REV4.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:sources,baseline,mutations,
 limitations:['Runs an existing generic PRJ fixture registration, not the zero-read EVID specialization or frozen first-model activation.',
 'Inherited assertion-based mutation qualification, not an independent general PRJ interpreter.',
 'No whole PRJ/IDN, FCT-6 or VAL-N release verdict.']},null,2)+'\n');
process.exitCode=0; // Expected mutant test failures were inspected and attested above.
