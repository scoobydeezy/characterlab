import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root='docs/planning/workbench-sem-coverage-rev1',formal='docs/formal/CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md';
const sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const body=fs.readFileSync(formal,'utf8'),lines=body.split(/\r?\n/);
const section=(a,b)=>body.slice(body.indexOf(a),b?body.indexOf(b):undefined);
const vectorRows=lines.map((text,i)=>({text,line:i+1})).filter(r=>/^\| `CV-SEM-\d{3}` \|/.test(r.text)&&r.line<123);
assert.equal(vectorRows.length,100);assert.deepEqual(vectorRows.map(r=>r.text.match(/CV-SEM-\d{3}/)[0]),Array.from({length:100},(_,i)=>`CV-SEM-${String(i+1).padStart(3,'0')}`));
const named=section('The named controls:','## Acceptance gate').split(/\r?\n/).filter(l=>l.startsWith('- '));assert.equal(named.length,31);
const gateLines=section('## Acceptance gate').split(/\r?\n/).filter(l=>/^\d+\. /.test(l));assert.equal(gateLines.length,10);
const extra=['phenSem001Integration.test.ts','semanticNegativeControls.test.ts','semanticOccurrenceIdentity.test.ts','semanticStateAuthority.test.ts'];
const testPaths=fs.readdirSync('src/test').filter(n=>n.endsWith('.test.ts')&&(extra.includes(n)||fs.readFileSync('src/test/'+n,'utf8').includes('CV-SEM-'))).map(n=>'src/test/'+n).sort();
const tests=testPaths.map(path=>({path,lines:fs.readFileSync(path,'utf8').split(/\r?\n/)}));
const receipts=[
 ['integrated','workbench-sem-parity-rev1'],['integrated-browser','workbench-sem-ui-rev1'],['character','workbench-sem-language-rev1'],['character-browser','workbench-sem-character-ui-rev1'],
 ['semantic','workbench-sem-controls-ui-rev1'],['recognition','workbench-sem-recognition-ui-rev1'],['knowledge','workbench-sem-knowledge-ui-rev1'],['measurement','workbench-sem-measurement-ui-rev1'],['classification','workbench-sem-classification-ui-rev1'],['recognition-boundaries','workbench-sem-recognition-boundaries-ui-rev1']
].map(([id,dir])=>({id,path:`docs/planning/${dir}/receipt.json`}));
for(const r of receipts){const receipt=JSON.parse(fs.readFileSync(r.path));r.sha256=sha(fs.readFileSync(r.path));r.recordedStatus=receipt.status??null;}
const references={
 semantic:[2,9,15],recognition:[61,62,63,65,67],knowledge:[99,100],measurement:[11,14],classification:[17,18],'recognition-boundaries':[64,66,68,69,70],
 integrated:[3,6,97],character:[7],
};
const family=n=>n===13||n>=19&&n<=22?'continuant-lifecycle':n>=23&&n<=30?'truth-binding':n>=31&&n<=40?'event-files':n>=41&&n<=50?'continuant-classification':n>=51&&n<=60?'event-classification':n>=61&&n<=70?'recognition':n>=71&&n<=80?'evidence-provenance':n>=81&&n<=90?'phase-ordering':n>=91&&n<=95?'schema-registry':n>=96?'codec-state-knowledge':'integrated-phenomenon';
const vectors=vectorRows.map(row=>{const id=row.text.match(/CV-SEM-\d{3}/)[0],n=Number(id.slice(-3));const relatedReceipts=Object.entries(references).filter(([,ids])=>ids.includes(n)).map(([id])=>receipts.find(r=>r.id===id).path);return {id,family:family(n),requirement:{path:formal,line:row.line,exact:row.text},nativeSourceLocations:tests.flatMap(t=>t.lines.flatMap((text,i)=>text.includes(id)?[{path:t.path,line:i+1,exact:text}]:[])),workbenchStatus:relatedReceipts.length?'PARTIAL SCOPED EVIDENCE; FULL VECTOR NOT YET QUALIFIED':'NO DEDICATED WORKBENCH QUALIFICATION',relatedReceipts,remaining:'Inspect the complete original vector and controls, expose required evidence/comparators, and qualify matching UI scope. Passing the original native suite is regression evidence, not workbench completion.'};});
// A title typo in the original test labels the discontinuity half CV-SEM-019;
// retain the exact source rather than silently rewriting the historical title.
const discontinuity=tests.find(t=>t.path.endsWith('/perceptualContinuantFiles.test.ts'));const index=discontinuity.lines.findIndex(l=>l.includes("it('CV-SEM-019 false discontinuity"));assert(index>=0);
vectors[19].nativeSourceLocations.push({path:discontinuity.path,line:index+1,exact:discontinuity.lines[index],disposition:'Original title says CV-SEM-019; body exercises discontinuity relevant to CV-SEM-020. Recognition association is a separate portion, not proven by this title.'});
const negativeControls=named.map((exact,i)=>({id:`SEM-NEG-${String(i+1).padStart(2,'0')}`,requirement:{path:formal,line:lines.indexOf(exact)+1,exact},nativeLedger:'src/test/semanticNegativeControls.test.ts',workbenchStatus:'NAMED CONTROL NOT YET INDIVIDUALLY QUALIFIED IN WORKBENCH',remaining:'Retain exact closure failure or structural-absence proof and first divergence; selected similar component guards do not discharge this named ledger item.'}));
const acceptance=gateLines.map((exact,i)=>({id:`SEM-GATE-${i+1}`,requirement:{path:formal,line:lines.indexOf(exact)+1,exact},nativeGate:'src/test/sem001AcceptanceGate.test.ts',workbenchStatus:'OPEN RECONCILIATION',remaining:'Preserve accepted native scope; establish the corresponding workbench inspection evidence without broadening the original gate.'}));
const supplements=[['Mutation authority.','**Mutation authority.**','**Membership representation.**','src/test/semanticStateAuthority.test.ts'],['Membership representation.','**Membership representation.**','Authority identities','src/test/semanticStateAuthority.test.ts'],['Integrated canonical migration','## Carried condition on `SEM-001J`','## Mandatory `PHEN-SEM-001` fixture','src/test/sem001JIntegratedGate.test.ts'],['Mandatory fixture','## Mandatory `PHEN-SEM-001` fixture','## `SEM-001J` integrated evidence','src/test/phenSem001Integration.test.ts'],['Integrated evidence join','## `SEM-001J` integrated evidence','## Registered is not admitted','src/test/sem001JIntegratedGate.test.ts'],['Registration versus admission','## Registered is not admitted','## Required negative controls and first divergence','src/test/semanticCodecs.test.ts']].map(([id,a,b,nativeSource])=>({id,exact:section(a,b),nativeSource,workbenchStatus:'OPEN SCOPE RECONCILIATION'}));
const sourcePaths=[formal,...testPaths,...receipts.map(r=>r.path),'scripts/check-workbench-sem-coverage.mjs'];
const sources=sourcePaths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
const manifest={version:'workbench-sem-coverage/0.1',status:'INCOMPLETE WORKBENCH COVERAGE; REQUIREMENT INVENTORY',sources,vectors,negativeControls,acceptance,supplements,receipts,next:['Continuant lifecycle: CV013/019-022, exact per-observer counters, retirement/no-reuse, independent tracking versus recognition.','Truth bindings/event files/classifiers and provenance: original controls with admitted component versions.','Phase/codec/state/identity/authority and integrated negative controls; all31 named failures/absence witnesses.','Renderer scopes and all10 acceptance conditions; comprehensive SEM browser and architecture participation qualification.'],limits:'Source text matches locate evidence, not prove it. Existing receipts are partial pointers only. No vector is marked complete by inventory or passing native tests. Original Campaign3 acceptance and18 conditional obligations are unchanged.'};
fs.writeFileSync(root+'/inventory.json',JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
const args=['node_modules/vitest/vitest.mjs','run',...testPaths,'--reporter=json',`--outputFile=${root}/native-tests.json`];
const result=spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:16*1024*1024});fs.writeFileSync(root+'/native-test-output.txt',(result.stdout??'')+(result.stderr??''),{flag:'wx'});assert.equal(result.status,0,result.stderr);
const native=JSON.parse(fs.readFileSync(root+'/native-tests.json'));assert.equal(native.success,true);assert.equal(native.numFailedTests,0);assert.equal(native.testResults.length,testPaths.length);for(const t of native.testResults)assert.equal(t.status,'passed');
for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
const artifacts=['inventory.json','native-tests.json','native-test-output.txt'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}));
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS REQUIREMENT CENSUS AND NATIVE REGRESSION; WORKBENCH INCOMPLETE',sources,artifacts,counts:{vectors:vectors.length,negativeControls:negativeControls.length,acceptance:acceptance.length,supplements:supplements.length,nativeFiles:testPaths.length,nativeTests:native.numPassedTests,partialReceiptVectors:vectors.filter(v=>v.relatedReceipts.length).length,completeWorkbenchVectors:0},scope:manifest.limits},null,2)+'\n',{flag:'wx'});
console.log(`PASS SEM100 vectors/31 negatives/10 gates/6 supplemental sections; native ${testPaths.length} files/${native.numPassedTests} tests; workbench qualification remains open`);
