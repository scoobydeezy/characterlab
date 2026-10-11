import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const dir='docs/planning/campaign3-history-ga-body-carriers-rev1';fs.mkdirSync(dir,{recursive:true});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});const rows=[];
for(const name of ['build-ga-body-pipeline-carrier','build-ga-body-pipeline-carrier-rev3','build-ga-surviving-child-carrier','review-ga-body-pipeline-carrier','review-ga-surviving-child-carrier']){
 const path='scripts/'+name+'.mjs';let source=fs.readFileSync(path,'utf8'),writes=0;
 assert.equal((source.match(/assert\(!fs.existsSync\(output\)\);/g)||[]).length,1);source=source.replace('assert(!fs.existsSync(output));','assert(fs.existsSync(output));');
 assert.equal((source.match(/fs.writeFileSync\(/g)||[]).length,1);source=source.replace('fs.writeFileSync(','globalThis.__historySourceWrite(');
 globalThis.__historySourceWrite=(output,text)=>{writes++;const v=JSON.parse(text);assert.deepEqual(v,JSON.parse(fs.readFileSync(output)));for(const f of v.sources)assert.deepEqual(fp(f.path),f);rows.push({script:fp(path),output:fp(output),faults:v.faults??[]});};
 try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));assert.equal(writes,1);}finally{delete globalThis.__historySourceWrite;}
}
assert.equal(rows.reduce((n,r)=>n+r.faults.length,0),22);
const a=JSON.parse(fs.readFileSync('docs/planning/GA_BODY_PIPELINE_CARRIER_REV2.json')),b=JSON.parse(fs.readFileSync('docs/planning/GA_BODY_PIPELINE_CARRIER_REV3.json'));
const next=structuredClone(b);const added=next.records.find(r=>r.name==='BodyOpportunityEvidence').fields.pop();assert.deepEqual(added,{name:'Context',type:{kind:'optional',value:{kind:'ref',name:'PerceivedTrialContextEvidence'}}});assert.deepEqual(next.records,a.records);
const result={status:'PASS; THREE EXACT CARRIER BUILDERS AND22 ORIGINAL STRUCTURAL FAULTS',checker:fp('scripts/replay-history-ga-body-carriers.mjs'),rows,delta:added,limits:['Symbolic field/reachability checks only. No source authenticity,owner write,loss enforcement or public persistence is executed.','Missing context transport is repaired by exact field addition; source relationship cannot be inferred from equal-looking context or occurrence identity.']};
const out=dir+'/replay.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(result.status);
