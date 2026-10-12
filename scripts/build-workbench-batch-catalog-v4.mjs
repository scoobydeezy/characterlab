import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=[];
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const old=read('src/workbench/batchCatalogV3.json'),jobs=[...old.jobs];sources.push(...old.sources);
for(const experimentId of ['decision','commit']){
 const plan=read(`docs/planning/${experimentId.toUpperCase()}_PUBLIC_EXPERIMENT_PLAN_REV1.json`),parity=read(`docs/planning/workbench-${experimentId}-parity-rev1/receipt.json`);
 for(const row of plan.runs){const name=`${row.law}/${row.name}`,r=parity.results.find(r=>r.id===name);assert(r);jobs.push({id:`${experimentId}/${name}`,experimentId,name,law:row.law,seed:experimentId==='commit'?7:row.seed,expectedSaveHashes:r.prefixes.map(p=>p.saveHash)});}
}
assert.equal(jobs.length,688);assert.equal(new Set(jobs.map(j=>j.id)).size,688);assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),4042);assert.deepEqual(jobs.slice(0,504),old.jobs);
const output=JSON.stringify({version:'workbench-batch-catalog/0.4',sources,retention:old.retention,scope:'674 main programs and14 supplementary AFFECT execution roles; eight public seams, not full corpus.',jobs},null,2)+'\n',path='src/workbench/batchCatalogV4.json';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),output);else fs.writeFileSync(path,output,{flag:'wx'});console.log('PASS688 execution roles/4042 prefixes; previous504 jobs unchanged');
