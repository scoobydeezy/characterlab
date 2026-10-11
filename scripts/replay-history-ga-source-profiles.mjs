import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/planning/campaign3-history-ga-source-profiles-rev1';fs.mkdirSync(dir,{recursive:true});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});const rows=[];
for(const name of ['build-ga-source-profile-declarations','review-ga-source-profile-declarations']){
 const path='scripts/'+name+'.mjs';let source=fs.readFileSync(path,'utf8'),writes=0;
 assert.equal((source.match(/assert\(!fs.existsSync\(output\)\);/g)||[]).length,1);source=source.replace('assert(!fs.existsSync(output));','assert(fs.existsSync(output));');
 assert.equal((source.match(/fs.writeFileSync\(/g)||[]).length,1);source=source.replace('fs.writeFileSync(','globalThis.__historySourceWrite(');
 globalThis.__historySourceWrite=(output,text)=>{writes++;const v=JSON.parse(text);assert.deepEqual(v,JSON.parse(fs.readFileSync(output)));for(const f of v.sources)assert.deepEqual(fp(f.path),f);rows.push({script:fp(path),output:fp(output),faults:v.faults??[]});};
 try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));assert.equal(writes,1);}finally{delete globalThis.__historySourceWrite;}
}
assert.equal(rows[1].faults.length,9);
const a=JSON.parse(fs.readFileSync('docs/planning/GA_SOURCE_PROFILE_DECLARATIONS_REV1.json')),b=JSON.parse(fs.readFileSync('docs/planning/GA_SOURCE_PROFILE_DECLARATIONS_REV2.json'));
const next=structuredClone(b);assert.deepEqual(next.records[6].fields.pop(),{name:'ExecutionPolicy',type:{kind:'ref',name:'DefinitionId'}});assert.deepEqual(next.records,a.records);
for(const k of ['status','newIdentityFamilies','storage','identityAliases','invariants'])assert.deepEqual(a[k],b[k]);for(const f of b.sources)assert.deepEqual(fp(f.path),f);
const result={status:'PASS; EXACT SYMBOLIC SOURCE PROFILE RECONSTRUCTION AND NINE ORIGINAL FAULTS',checker:fp('scripts/replay-history-ga-source-profiles.mjs'),rows,successor:fp('docs/planning/GA_SOURCE_PROFILE_DECLARATIONS_REV2.json'),delta:{addedField:b.records[6].fields.at(-1),executionPolicy:b.executionPolicy},limits:['Original REV1 reviewer does not validate the successor ExecutionPolicy field. Exact delta inspection is separate evidence.','No source runtime or public admission executed; prior current87 declaration/source tests are separately retained.']};
const out=dir+'/replay.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(result.status);
