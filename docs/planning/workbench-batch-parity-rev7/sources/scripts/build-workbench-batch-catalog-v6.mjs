import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=[];
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const old=read('src/workbench/batchCatalogV5.json'),jobs=[...old.jobs];sources.push(...old.sources);
for(const name of ['skill','habit']){const catalog=read('src/workbench/'+name+'Catalog.json'),parity=read('docs/planning/workbench-'+name+'-parity-rev1/receipt.json');sources.push(...catalog.sources);for(const row of catalog.programs){const r=parity.results.find(r=>r.id===row.name);assert(r);assert.equal(r.model,row.model);assert.equal(row.seed,0);jobs.push({id:name+'/'+row.name,experimentId:name,name:row.name,law:row.model,seed:row.seed,expectedSaveHashes:r.prefixes.map(p=>p.saveHash)});}}
assert.equal(jobs.length,841);assert.equal(new Set(jobs.map(j=>j.id)).size,841);assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),5236);assert.deepEqual(jobs.slice(0,766),old.jobs);
for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
const output=JSON.stringify({version:'workbench-batch-catalog/0.6',sources,retention:old.retention,scope:'Eleven public seams; previous766 roles plus52 SKILL and23 HABIT originals. HABIT successors and full corpus remain open.',jobs},null,2)+'\n',path='src/workbench/batchCatalogV6.json';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),output);else fs.writeFileSync(path,output,{flag:'wx'});console.log('PASS841 roles/5236 prefixes; previous766 unchanged');
