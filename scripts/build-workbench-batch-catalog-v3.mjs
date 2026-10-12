import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=[];
function read(path){const bytes=fs.readFileSync(path);sources.push({path,sha256:sha(bytes)});return JSON.parse(bytes);}
const old=read('src/workbench/batchCatalogV2.json'),jobs=[...old.jobs];sources.push(...old.sources);
const belief=read('docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json'),bp=read('docs/planning/workbench-belief-parity-rev1/receipt.json');
const beliefSeed=Number.parseInt(belief.runSeed.slice(0,2),16);assert.equal(belief.runSeed,beliefSeed.toString(16).padStart(2,'0').repeat(32));
for(const row of belief.runs){const r=bp.results.find(r=>r.id===row.name);assert(r);jobs.push({id:`belief/${row.name}`,experimentId:'belief',name:row.name,law:row.law,appraisal:String(row.goal),seed:beliefSeed,expectedSaveHashes:r.prefixes.map(p=>p.saveHash)});}
for(const [path,receipt,supplementary] of [['docs/planning/AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json','docs/planning/workbench-affect-parity-rev1/receipt.json',false],['src/workbench/affectSupplementFixtures.json','docs/planning/workbench-affect-supplements-rev1/receipt.json',true]]){
 const plan=read(path),parity=read(receipt);
 for(const row of plan.runs){const name=supplementary?row.id:row.name,r=parity.results.find(r=>r.id===name);assert(r);jobs.push({id:`affect/${name}`,experimentId:'affect',name,law:row.model,seed:row.seed,expectedSaveHashes:r.prefixes.map(p=>p.saveHash)});}
}
read('src/workbench/affectFixtures.json');
assert.equal(jobs.length,504);assert.equal(new Set(jobs.map(j=>j.id)).size,504);assert.equal(jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0),3612);
const output=JSON.stringify({version:'workbench-batch-catalog/0.3',sources,retention:old.retention,scope:'490 main programs and14 supplementary AFFECT execution roles; six public seams, not full corpus.',jobs},null,2)+'\n',path='src/workbench/batchCatalogV3.json';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),output);else fs.writeFileSync(path,output,{flag:'wx'});
console.log('PASS504 execution roles/3612 prefixes');
