// Execute unchanged historical builders/reviewers with only output redirection.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='docs/planning/campaign3-history-ga-identity-roles-rev1';
fs.mkdirSync(dir,{recursive:true});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const rows=[];
for(let revision=1;revision<=17;revision++){
 const suffix=revision===1?'':`-rev${revision}`;
 const row={revision};
 for(const kind of ['build','review']){
  const path=`scripts/${kind}-ga-identity-role-closure${suffix}.mjs`;
  let source=fs.readFileSync(path,'utf8'),writes=0;
  assert.equal(source.split('assert(!fs.existsSync(output));').length-1,1);
  assert.equal(source.split('fs.writeFileSync(output,').length-1,1);
  const methods=[...source.matchAll(/fs\.(\w+)/g)].map(m=>m[1]);
  assert(methods.every(m=>['readFileSync','existsSync','writeFileSync'].includes(m)));
  source=source.replace('assert(!fs.existsSync(output));','assert(fs.existsSync(output));');
  source=source.replace('fs.writeFileSync(output,','globalThis.__historyIdentityWrite(output,');
  globalThis.__historyIdentityWrite=(output,text)=>{
   writes++;const original=JSON.parse(fs.readFileSync(output));
   assert.deepEqual(JSON.parse(text),original,'Exact full historical output: '+output);
   for(const r of original.sources)assert.deepEqual(fp(r.path),r);
   row[kind]={original:fp(output),script:fp(path)};
   if(kind==='build')Object.assign(row,{records:original.recordCount,positions:original.positions.length,boundaries:original.boundaries.length});
   else Object.assign(row,{faults:original.faults});
  };
  try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));assert.equal(writes,1);}
  finally{delete globalThis.__historyIdentityWrite;}
 }
 rows.push(row);
}
assert.equal(rows.reduce((n,r)=>n+r.faults.length,0),390);
const result={status:'PASS; 17 SYMBOLIC INVENTORY RECONSTRUCTIONS AND 390 ORIGINAL FAULT EXECUTIONS',checker:fp('scripts/replay-history-ga-identity-roles.mjs'),rows,limits:['Exact symbolic builder/reviewer outputs only. No production handler, state ownership enforcement, numeric allocation or public admission is executed.','33 distinct fault labels include a namespace mutation change under the same concern/appraisal label; source scripts retain the actual mutations.']};
const out=dir+'/replay.json';
if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,first:rows[0].records,last:rows.at(-1).records,uniqueFaultLabels:new Set(rows.flatMap(r=>r.faults.map(f=>f.name))).size}));
