import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sources=[],sha=b=>createHash('sha256').update(b).digest('hex');
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const previous=read('src/workbench/batchCatalogV10.json'),jobs=[...previous.jobs],originals={};
for(const [id,root,status]of [
 ['adapt','workbench-adapt-parent-parity-rev1','PASS ACCEPTED ADAPT PARENT-PAIR PARITY'],
 ['det','workbench-det-parity-rev1','PASS BOUNDED COGNITIVE DET ADAPTER PARITY']]){
 const catalogPath=`src/workbench/${id}Catalog.json`,catalog=read(catalogPath),receipt=read(`docs/planning/${root}/receipt.json`);
 assert.equal(receipt.status,status);const binding=receipt.sources.find(s=>s.path===catalogPath);assert(binding);assert.equal(sha(fs.readFileSync(catalogPath)),binding.sha256);
 assert.equal(catalog.programs.length,2);
 for(const p of catalog.programs){
  assert.equal(p.runSeed,'00'.repeat(32));assert(catalog.models.some(m=>m.name===p.model));
  const record=receipt.results.find(r=>r.program===p.name);assert(record);
  const prefixes=record.prefixes??record.checks;assert.equal(prefixes.length,id==='adapt'?4:9);
  assert.deepEqual(prefixes.map(p=>p.prefix),prefixes.map((_,i)=>i));
  jobs.push({id:`${id}/${p.name}`,experimentId:id,name:p.name,law:p.model,seed:0,expectedSaveHashes:prefixes.map(p=>p.saveHash)});
 }
 originals[id]={...catalog,seedEncoding:'Zero repeated32 times; exact original programs retained.',
  batchScope:id==='adapt'?'Accepted count0/count1 parent pair only; remaining boundary/rollback/persistence controls stay separate.':'Cognitive persistence successor only; original substrate and failure/capacity controls stay separate. No external RNG coupling claim.'};
}
assert.deepEqual(jobs.slice(0,1068),previous.jobs);assert.equal(jobs.length,1072);assert.equal(new Set(jobs.map(j=>j.id)).size,1072);
assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),7310);
for(const j of jobs.slice(1068))assert(j.expectedSaveHashes.every(h=>/^[0-9a-f]{64}$/.test(h)));
const catalog={...previous,version:'workbench-batch-catalog/0.11',sources:[...previous.sources,...sources],
 scope:'Prepared1072 roles/7310 prefixes: previous1068 unchanged plus accepted ADAPT parent pair2/8 and DET cognitive successor2/18. BIO components and SEM fixed harness remain separate. Transport/shared UI qualification and full corpus entry remain due.',...originals,jobs};
const output=JSON.stringify(catalog,null,2)+'\n',target='src/workbench/batchCatalogV11.json';assert(Buffer.byteLength(output)<50_000_000);
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8'),output);else fs.writeFileSync(target,output,{flag:'wx'});
console.log('PASS prepared1072 roles/7310 prefixes; prior1068 unchanged; ADAPT2/8 and DET2/18');
