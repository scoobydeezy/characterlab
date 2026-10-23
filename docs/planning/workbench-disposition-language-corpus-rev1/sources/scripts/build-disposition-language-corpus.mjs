import fs from 'node:fs';import assert from 'node:assert/strict';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-language-rev2',output='src/workbench/dispositionLanguageCorpus.json',sha=b=>createHash('sha256').update(b).digest('hex'),receiptBytes=fs.readFileSync(root+'/receipt.json'),receipt=JSON.parse(receiptBytes),plan=JSON.parse(fs.readFileSync('docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json'));
function archive(file,hash){const bytes=fs.readFileSync(root+'/'+file);assert.equal(sha(bytes),hash,file);return JSON.parse(gunzipSync(bytes));}
const findings=archive(receipt.findings.path,receipt.findings.sha256),semantics=[],ids=new Map(),programs=[];let events=0,descriptions=0,gaps=0;
const joined=new Set();
for(const source of receipt.results){const spec=plan.runs[source.program],reports=archive(source.path,source.sha256),eventRows=[];assert.equal(reports.length,18);
 for(const [reportIndex,r]of reports.entries()){assert.equal(r.version,'disposition-factor-language/0.2');assert.equal(r.audience,'researcher');assert.equal(r.instant,String(reportIndex+1));events++;
  const rows=r.rows.map((row,rowIndex)=>{descriptions++;const key=JSON.stringify(row.semantic);let id=ids.get(key);if(id===undefined){id=semantics.length;ids.set(key,id);semantics.push({id,semantic:row.semantic,text:row.text});}else assert.equal(semantics[id].text,row.text);
   for(const issue of row.issues){const matches=findings.map((f,i)=>({f,i})).filter(({f})=>f.program===source.program&&f.eventId===r.eventId&&f.sourceKey===row.sourceKey&&f.code===issue.code&&f.scope===issue.scope&&f.detail===issue.detail);assert.equal(matches.length,1);assert(!joined.has(matches[0].i));joined.add(matches[0].i);gaps++;}
   return {rowIndex,semanticId:id,issues:row.issues};
  });eventRows.push({reportIndex,eventId:r.eventId,instant:r.instant,emitted:r.emitted,rows});
 }
 programs.push({index:source.program,program:spec.law+'/'+spec.name,archive:root+'/'+source.path,sha256:source.sha256,snapshot:source.snapshot,events:eventRows});
}
assert.equal(events,receipt.counts.events);assert.equal(descriptions,receipt.counts.descriptions);assert.equal(gaps,receipt.counts.gaps);assert.equal(semantics.length,receipt.counts.uniqueSemantics);assert.equal(joined.size,findings.length);assert.equal(receipt.counts.collisions,0);assert.equal(receipt.counts.redundancy,0);
const result={version:'disposition-language-corpus-view/0.1',languageVersion:'disposition-factor-language/0.2',source:{path:root+'/receipt.json',sha256:sha(receiptBytes)},counts:receipt.counts,scope:receipt.scope,semantics,programs};const bytes=JSON.stringify(result,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(output,'utf8'),bytes);else fs.writeFileSync(output,bytes,{flag:'wx'});
console.log(`PASS corpus projection: ${events} reports/${descriptions} descriptions/${gaps} joined gaps; ${Buffer.byteLength(bytes)} bytes`);
