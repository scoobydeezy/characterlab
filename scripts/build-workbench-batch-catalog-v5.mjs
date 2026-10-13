import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=[];
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const old=read('src/workbench/batchCatalogV4.json'),work=read('src/workbench/workCatalog.json'),parity=read('docs/planning/workbench-work-parity-rev2/receipt.json'),jobs=[...old.jobs];sources.push(...old.sources,...work.sources);
for(const row of work.programs){const r=parity.results.find(r=>r.id===row.name);assert(r);assert.equal(r.model,row.model);jobs.push({id:'work/'+row.name,experimentId:'work',name:row.name,law:row.model,seed:row.seed,expectedSaveHashes:r.prefixes.map(p=>p.saveHash)});}
assert.equal(jobs.length,766);assert.equal(new Set(jobs.map(j=>j.id)).size,766);assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),4666);assert.deepEqual(jobs.slice(0,688),old.jobs);
const output=JSON.stringify({version:'workbench-batch-catalog/0.5',sources,retention:old.retention,scope:'Nine public seams; previous688 execution roles plus78 WORK programs including8 distractor controls. Not full corpus.',jobs},null,2)+'\n',path='src/workbench/batchCatalogV5.json';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),output);else fs.writeFileSync(path,output,{flag:'wx'});console.log('PASS766 execution roles/4666 prefixes; previous688 jobs unchanged');
