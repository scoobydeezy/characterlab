import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const dir='docs/planning/campaign3-history-ga-registration-rev1';fs.mkdirSync(dir,{recursive:true});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const rows=[];
for(const name of ['build-ga-registration-carrier','review-ga-registration-carrier','review-ga-write-scope-correction']){
 const path='scripts/'+name+'.mjs';let source=fs.readFileSync(path,'utf8'),writes=0;
 source=source.replace(/assert\(!fs.existsSync\((output|out)\)\);/,(_,v)=>`assert(fs.existsSync(${v}));`);assert(!source.includes('assert(!fs.existsSync('));
 assert.equal((source.match(/fs.writeFileSync\(/g)||[]).length,1);source=source.replace('fs.writeFileSync(','globalThis.__historyRegistrationWrite(');
 globalThis.__historyRegistrationWrite=(output,text)=>{writes++;const v=JSON.parse(text);assert.deepEqual(v,JSON.parse(fs.readFileSync(output)));for(const f of v.sources)assert.deepEqual(fp(f.path),f);rows.push({script:fp(path),output:fp(output),faults:v.faults??[]});};
 try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));assert.equal(writes,1);}finally{delete globalThis.__historyRegistrationWrite;}
}
assert.equal(rows.reduce((n,r)=>n+r.faults.length,0),17);
const files=['src/test/generalRegistration.test.ts','src/test/generalAccessors.test.ts','src/test/recallPartitionProjection.test.ts'];
const output=dir+'/current-tests.json';assert(!fs.existsSync(output));
const ctx=await startVitest('test',files,{config:false,include:files,run:true,watch:false,minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:output});assert(ctx);await ctx.close();
const report=JSON.parse(fs.readFileSync(output));assert.equal(report.numTotalTests,19);assert.equal(report.numPassedTests,19);assert.equal(report.numFailedTests,0);
const out=dir+'/replay.json';assert(!fs.existsSync(out));fs.writeFileSync(out,JSON.stringify({status:'PASS; EXACT SYMBOLIC BUILDER/REVIEWERS AND CURRENT FOCUSED COMPILER CONTROLS',checker:fp('scripts/replay-history-ga-registration.mjs'),rows,tests:fp(output),inputs:[...files,'src/campaign3/generalRegistration.ts','src/campaign3/generalAccessors.ts','src/campaign3/recallPartitionProjection.ts'].map(fp),limits:['17 original symbolic faults;19 current focused tests. Neither executes public source authentication or complete model/persistence admission.','Registration tests use synthetic compiler-owned implementation bindings; equality to them does not independently establish their semantic validity.']},null,2)+'\n');
