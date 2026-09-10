import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/COGNITIVE_FINAL_SUITE_RECEIPT_REV1.json';assert(!fs.existsSync(output));
const files=['src','reference/src'].flatMap(root=>fs.readdirSync(root,{recursive:true}).filter(n=>n.endsWith('.ts')||n.endsWith('.tsx')).map(n=>root+'/'+n.replaceAll('\\','/')));
files.push('scripts/qualify-cognitive-final-suites.mjs');
const fp=()=>files.map(path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')})),before=fp(),results=[];
for(const [name,include]of [['active','src/test/**/*.test.ts'],['reference','reference/src/test/**/*.test.ts']]){
 let completed;
 const v=await startVitest('test',[],{config:false,watch:false,run:true,include:[include],environment:'node',minWorkers:2,maxWorkers:2,testTimeout:60000,reporters:[{onFinished(files,errors){completed={files,errors};}}]});assert(v);
 try{
  const tests=[];function walk(t){if(t.type==='test')tests.push({name:t.name,state:t.result?.state});for(const c of t.tasks??[])walk(c);}
  for(const file of completed?.files??[])walk(file);
  assert((completed?.files.length??0)>0);assert(tests.length>0);assert.equal(completed.errors.length,0);assert(completed.files.every(f=>f.result?.state==='pass'));assert(tests.every(t=>t.state==='pass'));
  results.push({name,status:'PASS',files:completed.files.length,tests:tests.length});console.log(JSON.stringify(results.at(-1)));
 }finally{await v.close();}
}
assert.deepEqual(fp(),before);fs.writeFileSync(output,JSON.stringify({status:'CURRENT ACTIVE AND PRESERVED REFERENCE SUITES PASS',results,sourceFingerprints:before,runner:'Vitest API config:false; explicit disjoint test includes; node environment; two workers. Config loader cannot access ancestor paths in this environment.'},null,2)+'\n');
