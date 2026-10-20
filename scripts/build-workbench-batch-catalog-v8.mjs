import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=[];
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const old=read('src/workbench/batchCatalogV7.json'),catalog=read('src/workbench/longCatalog.json'),root='docs/planning/workbench-long-parity-rev2',parity=read(root+'/receipt.json');
sources.push(...old.sources,...catalog.sources);
assert.equal(parity.results.length,32);const jobs=[...old.jobs];
for(const p of catalog.programs){
 const entry=parity.results.find(r=>r.program===p.name);assert(entry);
 const record=read(root+'/'+entry.path);assert.equal(sources.at(-1).sha256,entry.sha256);assert.equal(record.program,p.name);assert.equal(record.model,p.model);
 assert.equal(record.prefixes.length,entry.prefixes);
 jobs.push({id:'long/'+p.name,experimentId:'long',name:p.name,law:p.model,seed:p.seed,expectedSaveHashes:record.prefixes.map(r=>r.saveHash)});
}
assert.equal(jobs.length,947);assert.equal(new Set(jobs.map(j=>j.id)).size,947);assert.deepEqual(jobs.slice(0,915),old.jobs);
assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),6388);
for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
const output=JSON.stringify({version:'workbench-batch-catalog/0.8',sources,retention:old.retention,scope:'Fourteen admitted native seams. Previous915 execution roles unchanged plus32 original LONG programs/513 prefixes, including3 execution probes. Component successors remain separate; full corpus admission is incomplete.',jobs},null,2)+'\n',path='src/workbench/batchCatalogV8.json';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),output);else fs.writeFileSync(path,output,{flag:'wx'});
console.log('PASS947 roles/6388 prefixes; previous915 unchanged');
