import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sources=[],sha=b=>createHash('sha256').update(b).digest('hex');
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const previous=read('src/workbench/batchCatalogV9.json'),body=read('src/workbench/bodyCatalog.json'),multi=read('src/workbench/multisourceCatalog.json');
const bodyRoot='docs/planning/workbench-body-parity-rev1',bodyReceipt=read(bodyRoot+'/receipt.json');
const multiReceipt=read('docs/planning/workbench-multisource-parity-rev1/receipt.json');
assert.equal(bodyReceipt.status,'PASS BODY SOURCE ADAPTER PARITY AND CONTINUATION');
assert.equal(multiReceipt.status,'PASS COMPLETE FROZEN MULTISOURCE ADAPTER PARITY');
for(const [catalogPath,receipt]of [['src/workbench/bodyCatalog.json',bodyReceipt],['src/workbench/multisourceCatalog.json',multiReceipt]]){
 const source=receipt.sources.find(s=>s.path===catalogPath);assert(source);assert.equal(sha(fs.readFileSync(catalogPath)),source.sha256);
}
const jobs=[...previous.jobs];
for(const p of body.programs){
 const artifact=bodyReceipt.results.find(r=>r.program===p.name);assert(artifact);
 const record=read(bodyRoot+'/'+artifact.path);assert.equal(sources.at(-1).sha256,artifact.sha256);
 assert.equal(record.program,p.name);assert.equal(record.model,p.model);assert.equal(record.prefixes.length,artifact.prefixes);
 assert.equal(p.runSeed,'00'.repeat(32));
 jobs.push({id:'body/'+p.name,experimentId:'body',name:p.name,law:p.model,seed:0,expectedSaveHashes:record.prefixes.map(r=>r.saveHash)});
}
for(const p of multi.programs){
 const record=multiReceipt.results.find(r=>r.id===p.name);assert(record);
 assert.equal(record.model,p.model);assert.equal(record.cohort,p.cohort);assert.equal(p.runSeed,'07'.repeat(32));
 jobs.push({id:'multisource/'+p.name,experimentId:'multisource',name:p.name,law:p.model,seed:7,expectedSaveHashes:record.prefixes.map(r=>r.saveHash)});
}
assert.equal(jobs.length,1068);assert.equal(new Set(jobs.map(j=>j.id)).size,jobs.length);
assert.deepEqual(jobs.slice(0,990),previous.jobs);assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),7284);
assert.equal(jobs.filter(j=>j.experimentId==='body').length,16);assert.equal(jobs.filter(j=>j.experimentId==='multisource').length,62);
for(const j of jobs.slice(990)){assert(j.expectedSaveHashes.every(h=>/^[0-9a-f]{64}$/.test(h)));assert(j.expectedSaveHashes.length<=33);}
const catalog={...previous,version:'workbench-batch-catalog/0.10',sources:[...previous.sources,...sources],
 scope:'Prepared V10: previous990 declarations unchanged plus16 original BODY public source programs/79 prefixes and62 original MULTISOURCE public programs/249 prefixes. Five BODY ownership components are separate. Native batch execution and browser admission remain due; enrollment does not close corpus phenomena or successors.',
 body:{versions:body.versions,programs:body.programs,models:body.models,runtimeSource:body.runtimeSource,seedEncoding:'Zero repeated32 times; exact originals retained.'},
 multisource:{versions:multi.versions,programs:multi.programs,models:multi.models,seedEncoding:'Byte7 repeated32 times; exact originals retained.'},jobs};
const output=JSON.stringify(catalog,null,2)+'\n',target='src/workbench/batchCatalogV10.json';assert(Buffer.byteLength(output)<50_000_000);
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8'),output);else fs.writeFileSync(target,output,{flag:'wx'});
console.log('PASS prepared1068 declarations/7284 prefixes; prior990 unchanged; BODY16/79 and MULTISOURCE62/249 exact');
