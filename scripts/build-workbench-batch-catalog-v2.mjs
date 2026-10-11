import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=[];
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const old=read('src/workbench/batchCatalog.json'),jobs=[...old.jobs];sources.push(...old.sources);
for(const experimentId of ['epi','learn']){
 const plan=read(`docs/planning/${experimentId.toUpperCase()}_PUBLIC_EXPERIMENT_PLAN_REV1.json`),receipt=read(`docs/planning/workbench-${experimentId}-parity-rev1/receipt.json`);
 for(const row of plan.runs){const id=`${row.law}/${row.numeric}/${row.name}`,r=receipt.results.find(r=>r.id===id);assert(r);jobs.push({id:`${experimentId}/${id}`,experimentId,name:row.name,law:row.law,numeric:row.numeric,seed:experimentId==='epi'?19:0,expectedSaveHashes:r.prefixes.map(p=>p.saveHash)});}
}
assert.equal(jobs.length,351);assert.equal(new Set(jobs.map(j=>j.id)).size,351);assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),1795);
const output=JSON.stringify({version:'workbench-batch-catalog/0.2',sources,retention:old.retention,jobs},null,2)+'\n',path='src/workbench/batchCatalogV2.json';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),output);else fs.writeFileSync(path,output,{flag:'wx'});
console.log('PASS351 exact programs/1795 prefixes');
