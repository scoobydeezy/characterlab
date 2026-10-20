import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-event-state-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/EventStatePanel.tsx','src/workbench/DispositionWorkbench.tsx','src/workbench/contracts.ts','src/workbench/nativeTimeline.ts','package-lock.json','scripts/check-workbench-disposition-event-state.mjs',prior+'/receipt.json'].map(path=>{const b=fs.readFileSync(path),target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,b,{flag:'wx'});return{path,sha256:sha(b)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {EventStatePanel}=await server.ssrLoadModule('/src/workbench/EventStatePanel.tsx'),artifacts=new Map(JSON.parse(fs.readFileSync(prior+'/receipt.json')).artifacts.map(a=>[a.path,a.sha256])),results=[];
 const decode=s=>s.replace(/&(amp|lt|gt|quot|#x27);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"', '#x27':"'"}[x]));
 const values=(html,attr)=>[...html.matchAll(new RegExp('<pre[^>]*'+attr+'[^>]*>([\\s\\S]*?)</pre>','g'))].map(m=>decode(m[1]));
 let events=0,reads=0,mutations=0,changes=0,unchanged=0;
 for(let program=0;program<15;program++){
  const file=`snapshot-${program}-18.json.gz`,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),artifacts.get(file));const s=JSON.parse(gunzipSync(bytes)),renderHashes=[];
  for(const event of s.timeline){
   const before=JSON.stringify(event),html=renderToStaticMarkup(createElement(EventStatePanel,{event}));
   assert.deepEqual(values(html,'data-event-read-value'),event.reads.map(r=>r.exact));assert.deepEqual(values(html,'data-event-before'),event.diffs.map(d=>d.before));assert.deepEqual(values(html,'data-event-after'),event.diffs.map(d=>d.after));assert.equal(JSON.stringify(event),before);
   for(const [i,d] of event.diffs.entries()){assert.equal(d.changed,d.before!==d.after);assert(html.includes(`Mutation ${i+1} · ${d.changed?'Changed':'Unchanged'}`));}
   events++;reads+=event.reads.length;mutations+=event.diffs.length;changes+=event.diffs.filter(d=>d.changed).length;unchanged+=event.diffs.filter(d=>!d.changed).length;renderHashes.push({eventId:event.id,sha256:sha(html)});
  }
  results.push({program,source:{path:prior+'/'+file,sha256:sha(bytes)},renderHashes});console.log(`PASS event-state rendering ${program+1}/15`);
 }
 assert.equal(events,2700);assert(unchanged>0);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS EXACT DISPOSITION EVENT STATE RENDERING',sources,counts:{programs:15,events,reads,mutations,changes,unchanged},results,scope:'Server-rendered initial panel for every original terminal timeline event preserves exact read/before/after strings and changed/unchanged labels without mutation. Client filtering, navigation and historical persistence are separately qualified. Recorded activity is not causal necessity.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
