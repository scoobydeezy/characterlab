import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash}from'node:crypto';import {gunzipSync}from'node:zlib';import {createServer}from'vite';
const root='docs/planning/workbench-long-navigation-ui-rev1',parent='docs/planning/workbench-long-navigation-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const receipt=read(parent+'/receipt.json'),entry=receipt.results.find(r=>r.program==='representation-1-law-1'),bytes=fs.readFileSync(entry.source);assert.equal(sha(bytes),entry.sourceSha256);const snapshots=JSON.parse(gunzipSync(bytes)),reports=read(parent+'/'+entry.path),b=read(root+'/browser.json'),keys=['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash','observerHash'];
assert.deepEqual(b.participation,reports[2].participation);assert.deepEqual(b.before,keys.map(k=>snapshots[2][k]));assert.deepEqual(b.afterLinks,b.before);assert.equal(b.prior,'61');assert.equal(b.ancestor,'49');assert.deepEqual(b.reports.map(r=>r.prefix),[2,3]);
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {recordedCausalHistory}=await server.ssrLoadModule('/src/workbench/causalNavigation.ts'),{recordedStateReadHistory}=await server.ssrLoadModule('/src/workbench/stateReadHistory.ts');
 for(const r of b.reports){
  const s=snapshots[r.prefix],h=recordedCausalHistory(s.timeline,'62');assert.equal(r.selected,'62');assert.deepEqual(r.hashes,keys.map(k=>s[k]));assert.deepEqual(r.event,s.timeline.find(e=>e.id==='62'));
  assert.deepEqual(r.causal,{renderer:h.version,runHash:s.runHash,selected:h.selected,nodes:h.nodes.map(n=>({id:n.event.id,instant:n.event.instant,stage:n.event.stage,distance:n.distance})),edges:h.edges,missing:h.missing,cyclic:h.cyclic});
  assert.deepEqual(r.reads,{runHash:s.runHash,...recordedStateReadHistory(s.timeline,'62')});
 }
 assert.deepEqual(b.reports[0].causal,b.reports[1].causal);assert.deepEqual(b.reports[0].reads,b.reports[1].reads);assert.deepEqual(b.reports[0].event,b.reports[1].event);assert.deepEqual(b.alerts,[]);
}finally{await server.close();}
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
const script='scripts/check-workbench-long-navigation-ui.mjs',artifacts=[root+'/browser.json',root+'/navigation.png',root+'/ancestors.png',parent+'/receipt.json',parent+'/'+entry.path,script].map(path=>({path,sha256:sha(fs.readFileSync(path))}));
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED LONG LINKED INSPECTION BROWSER',sources:receipt.sources,artifacts,scope:'Original representation-1-law-1 prefixes2/3, production preview4181. Complete participation report equals qualified native-backed report. Keyboard state-row event62 -> prior mutation61 -> ancestor49 navigation preserves seven native hashes. Event62 parent/read/exact event records match originals and remain unchanged after advancing to prefix3. No psychological necessity, native derived-source or all-program browser claim. Full Workbench entry remains open.'},null,2)+'\n',{flag:'wx'});console.log('PASS LONG linked inspection and historical stability browser');
