import fs from 'node:fs';import assert from 'node:assert/strict';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-state-read-history-rev1',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const b=read(root+'/browser.json'),receipt=read(root+'/receipt.json');assert.equal(receipt.status,'PASS FULL VALUES RETAINED STATE-READ HISTORY');
const matches=[];for(const r of receipt.results){assert.equal(sha(root+'/'+r.path),r.sha256);const data=JSON.parse(gunzipSync(fs.readFileSync(root+'/'+r.path)));if(data.rows[2].runHash===b.hashesBefore[1])matches.push(data);}
assert.equal(matches.length,1);const data=matches[0];
for(const [key,prefix,id] of [['reason',2,'17'],['appraisal',2,'16'],['prior',2,'15'],['appraisalLater',4,'16']]){
 const row=data.rows[prefix];assert.deepEqual(b[key],{runHash:row.runHash,...row.histories.find(h=>h.selected===id)});
}
assert.equal(b.hashesBefore.length,4);assert.deepEqual(b.hashesAfter,b.hashesBefore);assert.equal(b.hashesBefore[3],data.rows[2].saveHash);assert.equal(b.hashesLater[3],data.rows[4].saveHash);
assert.deepEqual(b.appraisal,b.appraisalLater);assert.equal(b.appraisal.reads[3].priorMutation.event.id,'15');assert.equal(b.appraisal.reads[3].relation,'exact-value-match');assert.equal(b.prior.reads[0].relation,'no-prior-recorded-mutation');
for(const s of receipt.sources)assert.equal(sha(s.path),s.sha256);
const result={status:'PASS BOUNDED STATE-READ BROWSER',program:data.index,prefixes:[2,4],navigation:['reason17','appraisal16','forecast15'],checks:['keyboard prior-mutation navigation','four unchanged run hashes during inspection','exact full-cohort diagnostic join','earlier appraisal history stable at prefix4','missing prior mutation remains unresolved'],parentReceiptSha256:sha(root+'/receipt.json'),artifacts:Object.fromEntries(['browser.json','history.png','history-expanded.png'].map(p=>[p,sha(root+'/'+p)])),scope:'Values browser program only. Shared component is integrated in Values, General and Disposition; other browser profiles remain due. Exact-path value continuity is not complete derived-source or causal provenance.'};
fs.writeFileSync(root+'/browser-receipt.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
