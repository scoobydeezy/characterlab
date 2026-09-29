import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const p='docs/planning/',dir=p+'defining-public-matrix-rev1',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const manifestPath=dir+'/MANIFEST.json',manifest=read(manifestPath),manifestHash=sha(manifestPath);assert.equal(manifest.cases.length,68);assert.equal(manifest.expectedPrefixes,1680);
for(const f of manifest.files)assert.equal(sha(f.path),f.sha256,f.path);
const baselines=[],results=[],receiptPaths=[manifestPath];let prefixes=0,stages=0,advancing=0;
for(let index=0;index<68;index++){
 const caseDir=dir+'/CASE_'+String(index).padStart(2,'0');assert(!fs.readdirSync(caseDir).some(n=>n.startsWith('FAILURE_')),'Preserve and resolve failed cohort before closure');
 const baselinePath=caseDir+'/BASELINE.json',resultPath=caseDir+'/RESULT.json',b=read(baselinePath),r=read(resultPath),native=read(p+'defining-native-cohort-rev1/CASE_'+String(index).padStart(2,'0')+'.json');
 assert.equal(r.status,'PASS');assert.equal(r.index,index);assert.deepEqual(r.spec,manifest.cases[index]);assert.equal(r.manifestHash,manifestHash);
 assert.equal(b.index,index);assert.deepEqual(b.spec,r.spec);assert.equal(b.manifestHash,manifestHash);assert.deepEqual(b.rows.map(x=>x.clock),['0',...native.instants]);assert.equal(r.prefixes,b.rows.length);assert.equal(r.nativeStageComparisons,native.stages.length);assert.equal(b.rows.filter(x=>x.nativeStageCompared).length,native.stages.length);
 assert.equal(b.initialState,native.initialState);assert.equal(b.orderedInputs,native.originals);assert.notEqual(b.modelIdentity,native.modelIdentity);assert.notEqual(b.runIdentity,native.runIdentity);
 assert.deepEqual(r.files.map(x=>x.path),[baselinePath,...b.rows.map((_,i)=>caseDir+'/PREFIX_'+String(i).padStart(2,'0')+'.json')]);
 for(const f of r.files)assert.equal(sha(f.path),f.sha256,f.path);
 for(let i=0;i<b.rows.length;i++){
  const x=read(caseDir+'/PREFIX_'+String(i).padStart(2,'0')+'.json'),next=b.rows[Math.min(i+1,b.rows.length-1)];
  assert.equal(x.status,'PASS');assert.equal(x.index,index);assert.equal(x.prefix,i);assert.equal(x.manifestHash,manifestHash);assert.equal(x.baselineHash,sha(baselinePath));
  for(const k of ['clock','save','observer'])assert.equal(x[k],b.rows[i][k]);assert.equal(x.nextSave,next.save);assert.equal(x.nextObserver,next.observer);assert.equal(x.exhausted,i===b.rows.length-1);if(!x.exhausted)advancing++;
 }
 prefixes+=r.prefixes;stages+=r.nativeStageComparisons;baselines.push(b);results.push(r);receiptPaths.push(resultPath);
}
assert.equal(prefixes,1680);assert.equal(advancing,1612);assert.equal(stages,376);
assert.equal(new Set(baselines.map(b=>b.modelIdentity)).size,68);assert.equal(new Set(baselines.map(b=>b.runIdentity)).size,68);
const diagnosticPairs=read(p+'DEFINING_NATIVE_COHORT_CHECK_REV1.json').diagnosticPairs;
for(const [a,b]of diagnosticPairs)assert.deepEqual(baselines[a].rows.map(r=>[r.clock,r.observer]),baselines[b].rows.map(r=>[r.clock,r.observer]),'Whole observer projection changed under diagnostic-only worldAfter');
const implementation=read(p+'DEFINING_PUBLIC_IMPLEMENTATION_CHECK_REV1.json');assert.equal(implementation.status,'FOCUSED PUBLIC IMPLEMENTATION CHECKS PASS');for(const f of implementation.files)assert.equal(sha(f.path),f.sha256,f.path);
const result={status:'ALL68 PUBLIC PROGRAMS AND1680 RESTORES PASS',scope:'Every S0/settled prefix restored through original-input public API; exact Save132/observer bytes and one actual successor or terminal exhaustion. Not full-tail continuation from every prefix.',programs:68,models:68,runIdentities:68,restorePrefixes:prefixes,advancingSuccessorChecks:advancing,terminalExhaustionChecks:68,nativeStateOutputStageComparisons:stages,wholeObserverDiagnosticPairs:diagnosticPairs,productionChanges:0,countersAtExecution:{highestAllocated:1492,sinceVerdict:8},files:[...receiptPaths,p+'DEFINING_PUBLIC_IMPLEMENTATION_CHECK_REV1.json','scripts/check-defining-public-matrix.mjs'].map(path=>({path,sha256:sha(path)}))};
const out=p+'DEFINING_PUBLIC_MATRIX_CHECK_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);
console.log(JSON.stringify({...result,files:undefined}));
