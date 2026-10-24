import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sources=[],sha=b=>createHash('sha256').update(b).digest('hex');
function read(path){const b=fs.readFileSync(path);sources.push({path,sha256:sha(b)});return JSON.parse(b);}
const previous=read('src/workbench/batchCatalogV11.json'),jobs=[...previous.jobs];
const bioPlan=read('docs/planning/BIO_COMPARISON_PLAN_REV3.json'),bioIdentity=read('docs/planning/BIO_IDENTITY_PLAN_REV1.json');
const bioRoot='docs/planning/workbench-bio-parity-rev1',bioReceipt=read(bioRoot+'/receipt.json');
assert.equal(bioReceipt.status,'PASS BIO COMPONENT ADAPTER PARITY AND CONTINUATION');
for(const p of ['docs/planning/BIO_COMPARISON_PLAN_REV3.json','docs/planning/BIO_IDENTITY_PLAN_REV1.json'])assert.equal(sha(fs.readFileSync(p)),bioReceipt.sources.find(s=>s.path===p).sha256);
assert.deepEqual(bioIdentity.runs.map(r=>r.name),bioPlan.cases.map(r=>r.name));assert.equal(bioIdentity.runs.length,13);
for(const r of bioIdentity.runs){
 const artifact=bioReceipt.cases.find(c=>c.name===r.name);assert(artifact);const record=read(bioRoot+'/'+artifact.path);assert.equal(sources.at(-1).sha256,artifact.sha256);
 assert.equal(record.name,r.name);assert.equal(record.law,r.law);assert.equal(record.prefixes.length,20);
 jobs.push({id:'bio/'+r.name,experimentId:'bio',name:r.name,law:r.law,seed:r.earlySeed,seedHex:r.earlySeed.toString(16).padStart(2,'0').repeat(32),executionKind:'composed-component',expectedSaveHashes:record.prefixes.map(p=>p.saveHash)});
}
const sem=read('src/workbench/semCatalog.json'),semReceipt=read('docs/planning/workbench-sem-parity-rev1/receipt.json');
assert.equal(semReceipt.status,'PASS ACCEPTED SEM INTEGRATED HARNESS PARITY');assert.equal(semReceipt.fixtureDigest,sem.fixtureDigest);
assert.equal(sha(fs.readFileSync('src/workbench/semCatalog.json')),semReceipt.sources.find(s=>s.path==='src/workbench/semCatalog.json').sha256);
assert.equal(semReceipt.results.length,4);assert.equal(sem.schedule.length,3);
// Exact friendly integer13 is unsigned big-endian256; the transport audit also
// authenticates these bytes against the original fixture's canonical run identity.
const semSeed='00'.repeat(31)+'0d';
jobs.push({id:'sem/integrated-three-observer',experimentId:'sem',name:'integrated-three-observer',law:sem.contract,seed:13,seedHex:semSeed,executionKind:'fixed-scheduler-harness',expectedSaveHashes:semReceipt.results.map(p=>p.saveHash)});
assert.deepEqual(jobs.slice(0,1072),previous.jobs);assert.equal(jobs.length,1086);assert.equal(new Set(jobs.map(j=>j.id)).size,1086);
assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),7574);
const catalog={...previous,version:'workbench-batch-catalog/0.12',sources:[...previous.sources,...sources],
 scope:'Prepared1086 roles/7574 prefixes: prior1072 unchanged plus BIO13 component cases/260 prefixes and SEM1 fixed scheduler harness/4 prefixes. These are distinct execution boundaries, not new public factory admission or complete corpus acceptance.',
 bio:{plan:bioPlan,identities:bioIdentity,executionKind:'composed-component',clock:null,seedRouting:'Early decision seed is repeated32 bytes; probe255, nondecision254 and original contrary routing stay separate.'},
 sem:{...sem,executionKind:'fixed-scheduler-harness',runSeed:semSeed,seedEncoding:'Friendly integer13 as unsigned big-endian256; not byte13 repeated.',inputScope:'Original ordered-input commitment remains empty. The three-observer schedule is inserted incrementally by the fixed harness, with a separate diagnostic fixture digest.'},jobs};
const output=JSON.stringify(catalog,null,2)+'\n',target='src/workbench/batchCatalogV12.json';assert(Buffer.byteLength(output)<50_000_000);
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8'),output);else fs.writeFileSync(target,output,{flag:'wx'});
console.log('PASS prepared1086/7574; prior1072 unchanged; BIO13/260 and SEM1/4 boundaries distinct');
