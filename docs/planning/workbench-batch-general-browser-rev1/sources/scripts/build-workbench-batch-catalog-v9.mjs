import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sources=[], sha=b=>createHash('sha256').update(b).digest('hex');
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const old=read('src/workbench/batchCatalogV8.json');
const freeze=read('docs/planning/campaign3-general-attention-model-rev2/FREEZE.json');
const root='docs/planning/workbench-general-cohort-rev1', receipt=read(root+'/receipt.json');
assert.equal(receipt.status,'PASS FROZEN GA COHORT NATIVE INSTRUMENT PARITY');
assert.equal(receipt.seed,freeze.seed);
const jobs=[...old.jobs],programs=[];
for(const model of freeze.models){
  const artifact=receipt.artifacts.find(a=>a.recipe===model.name);assert(artifact);
  const record=read(root+'/'+artifact.path);assert.equal(sources.at(-1).sha256,artifact.sha256);
  assert.equal(record.seed,freeze.seed);assert.equal(record.recipe,model.name);
  const originals={};
  for(const field of ['initial','originals']){
    const source=model.files[field],bytes=fs.readFileSync(source.path);assert.equal(sha(bytes),source.sha256);
    sources.push(source);originals[field]=bytes.toString('utf8').trim();
  }
  programs.push({name:model.name,runSeed:freeze.seed,modelIdentity:model.modelIdentity,runIdentity:model.runIdentity,...originals});
  jobs.push({id:'general/'+model.name,experimentId:'general',name:model.name,law:freeze.versions.rulesVersion,
    seed:0,seedHex:freeze.seed,expectedSaveHashes:record.prefixes.map(p=>p.saveHash)});
}
assert.equal(programs.length,43);assert.equal(jobs.length,990);
assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),6956);
assert.deepEqual(jobs.slice(0,947),old.jobs);
const catalog={version:'workbench-batch-catalog/0.9',sources:[...old.sources,...sources],retention:old.retention,
 scope:'V8 declarations unchanged plus43 original General recipes/568 prefixes shared by MEM and ATTN. seedHex is the exact authoritative General seed; seed0 is a legacy transport placeholder. Other corpus and component successors remain separate.',general:{versions:freeze.versions,programs},jobs};
const output=JSON.stringify(catalog,null,2)+'\n', target='src/workbench/batchCatalogV9.json';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8'),output);else fs.writeFileSync(target,output,{flag:'wx'});
console.log('PASS990 roles/6956 prefixes; previous947 unchanged; exact General seed and originals');
