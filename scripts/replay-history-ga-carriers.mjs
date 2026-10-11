import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/planning/campaign3-history-ga-carriers-rev1';fs.mkdirSync(dir,{recursive:true});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});const rows=[];
for(const name of ['build-ga-requested-source-carrier','review-ga-requested-source-carrier','review-ga-visual-pipeline-carrier']){
 const path='scripts/'+name+'.mjs';let source=fs.readFileSync(path,'utf8'),writes=0;
 assert.equal((source.match(/assert\(!fs.existsSync\(output\)\);/g)||[]).length,1);source=source.replace('assert(!fs.existsSync(output));','assert(fs.existsSync(output));');
 assert.equal((source.match(/fs.writeFileSync\(/g)||[]).length,1);source=source.replace('fs.writeFileSync(','globalThis.__historySourceWrite(');
 globalThis.__historySourceWrite=(output,text)=>{writes++;const v=JSON.parse(text);assert.deepEqual(v,JSON.parse(fs.readFileSync(output)));for(const f of v.sources)assert.deepEqual(fp(f.path),f);rows.push({script:fp(path),output:fp(output),faults:v.faults??[]});};
 try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));assert.equal(writes,1);}finally{delete globalThis.__historySourceWrite;}
}
assert.equal(rows.reduce((n,r)=>n+r.faults.length,0),19);
const result={status:'PASS; REQUESTED CARRIER BUILDER AND TWO ORIGINAL REVIEWERS',checker:fp('scripts/replay-history-ga-carriers.mjs'),rows,limits:['19 symbolic faults only. Visual builder is not replayed because its three old component dependencies are unavailable; visual reviewer reads the exact preserved packet and unchanged SEM registry.','Successor reservation and Claims fields are separately inspected,not covered by REV1 reviewers.']};
const out=dir+'/replay.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(result.status);
