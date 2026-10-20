import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {createServer} from 'vite';
const root='docs/planning/workbench-general-event-state-rev2',prior='docs/planning/workbench-general-comparison-cohort-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/EventStatePanel.tsx','src/workbench/GeneralWorkbench.tsx','src/workbench/contracts.ts','src/workbench/nativeTimeline.ts','package-lock.json','scripts/check-workbench-general-event-state-v2.mjs',prior+'/receipt.json'].map(path=>{const b=fs.readFileSync(path),target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,b,{flag:'wx'});return{path,sha256:sha(b)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {EventStatePanel}=await server.ssrLoadModule('/src/workbench/EventStatePanel.tsx'),models=JSON.parse(fs.readFileSync(prior+'/receipt.json')).models,results=[];
 const decode=s=>s.replace(/&(amp|lt|gt|quot|#x27);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"', '#x27':"'"}[x]));
 const values=(html,attr)=>[...html.matchAll(new RegExp('<pre[^>]*'+attr+'[^>]*>([\\s\\S]*?)</pre>','g'))].map(m=>decode(m[1]));
 let events=0,reads=0,mutations=0,changes=0,unchanged=0;
 assert.equal(models.length,43);
 for(let program=0;program<models.length;program++){
  const entry=models[program],file=entry.path,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),entry.sha256);const decoded=gunzipSync(bytes);assert.equal(sha(decoded),entry.decodedSha256);const snapshots=JSON.parse(decoded),s=snapshots.at(-1),renderHashes=[];
  const originals=new Map(s.timeline.map(e=>[e.id,sha(JSON.stringify(e))]));for(const snapshot of snapshots)for(const e of snapshot.timeline)assert.equal(sha(JSON.stringify(e)),originals.get(e.id),'Historical event changed');
  for(const event of s.timeline){
   const before=JSON.stringify(event),html=renderToStaticMarkup(createElement(EventStatePanel,{event}));
   assert.deepEqual(values(html,'data-event-read-value'),event.reads.map(r=>r.exact));assert.deepEqual(values(html,'data-event-before'),event.diffs.map(d=>d.before));assert.deepEqual(values(html,'data-event-after'),event.diffs.map(d=>d.after));assert.equal(JSON.stringify(event),before);
   for(const [i,d] of event.diffs.entries()){assert.equal(d.changed,d.before!==d.after);assert(html.includes(`Mutation ${i+1} · ${d.changed?'Changed':'Unchanged'}`));}
   events++;reads+=event.reads.length;mutations+=event.diffs.length;changes+=event.diffs.filter(d=>d.changed).length;unchanged+=event.diffs.filter(d=>!d.changed).length;renderHashes.push({eventId:event.id,sha256:sha(html)});
  }
  results.push({program,recipe:entry.recipe,prefixes:snapshots.length,source:{path:prior+'/'+file,sha256:sha(bytes)},renderHashes});console.log(`PASS event-state rendering ${program+1}/43`);
 }
 assert.equal(results.reduce((n,r)=>n+r.prefixes,0),568);assert(events>0);assert(mutations>0);assert.equal(changes+unchanged,mutations);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS EXACT GENERAL EVENT STATE RENDERING',sources,counts:{programs:43,prefixes:568,events,reads,mutations,changes,unchanged},results,scope:'Server-rendered initial panel for every original terminal timeline event preserves exact read/before/after strings and changed/unchanged labels without mutation. All568 archived prefix histories match their terminal original event records. Client filtering and navigation are separately qualified. Derived read/source distinctions remain in the separate native metadata inspector. Recorded activity is not causal necessity.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
