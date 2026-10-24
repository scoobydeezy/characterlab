import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {createServer} from 'vite';
const root='docs/planning/workbench-body-state-inspection-rev1';assert(!fs.existsSync(root));
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const native=read('docs/planning/workbench-body-parity-rev1/receipt.json');
assert.equal(native.status,'PASS BODY SOURCE ADAPTER PARITY AND CONTINUATION');
const paths=['src/workbench/BodyWorkbench.tsx','src/workbench/bodyAdapter.ts','src/workbench/bodyCatalog.json',
 'src/workbench/nativeTimeline.ts','src/workbench/RecordedStateInspector.tsx','src/workbench/recordedStateSearch.ts',
 'src/workbench/EventStatePanel.tsx','scripts/check-body-state-inspection.mjs','docs/planning/workbench-body-parity-rev1/receipt.json'];
const sources=paths.map(path=>{const bytes=fs.readFileSync(path),copy=root+'/sources/'+path;
 fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});return {path,copy,sha256:sha(bytes)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({sources,status:'FROZEN BEFORE EXECUTION'},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const unescape=s=>s.replace(/&(amp|lt|gt|quot|#x27);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"','#x27':"'"}[x]));
const values=(html,attr)=>[...html.matchAll(new RegExp('<pre[^>]*'+attr+'[^>]*>([\\s\\S]*?)</pre>','g'))].map(m=>unescape(m[1]));
try{
 const {BodyWorkbenchRun}=await server.ssrLoadModule('/src/workbench/bodyAdapter.ts');
 const {RecordedStateInspector}=await server.ssrLoadModule('/src/workbench/RecordedStateInspector.tsx');
 const {EventStatePanel}=await server.ssrLoadModule('/src/workbench/EventStatePanel.tsx');
 const {searchRecordedState}=await server.ssrLoadModule('/src/workbench/recordedStateSearch.ts');
 const counts={programs:0,prefixes:0,fields:0,events:0,reads:0,mutations:0,changes:0,historicalEvents:0},results=[];
 for(const artifact of native.results){
  const bytes=fs.readFileSync('docs/planning/workbench-body-parity-rev1/'+artifact.path);assert.equal(sha(bytes),artifact.sha256);
  const original=JSON.parse(bytes);original.id=original.program;
  const run=await BodyWorkbenchRun.create(original.id),history=new Map(),snapshots=[];
  for(const expected of original.prefixes){
   const s=run.snapshot(),before=run.checkpoint();
   for(const key of ['prefix','clock','modelHash','runHash','saveHash','stateHash','outputsHash','traceHash'])assert.equal(s[key],expected[key]);
   assert.deepEqual(searchRecordedState(s.fields,''),s.fields);
   for(const f of s.fields){assert(searchRecordedState(s.fields,f.path).some(r=>r.path===f.path));assert(searchRecordedState(s.fields,'',f.root).some(r=>r.path===f.path));}
   assert.throws(()=>searchRecordedState(s.fields,'x'.repeat(257)));
   const stateHtml=renderToStaticMarkup(createElement(RecordedStateInspector,{fields:s.fields,prefix:s.prefix,saveHash:s.saveHash}));
   assert(stateHtml.includes(s.saveHash));assert(!stateHtml.includes('role="alert"'));
   for(const event of s.timeline){
    const encoded=JSON.stringify(event),old=history.get(event.id);
    if(old!==undefined){assert.equal(encoded,old);counts.historicalEvents++;continue;}
    const html=renderToStaticMarkup(createElement(EventStatePanel,{event}));
    assert.deepEqual(values(html,'data-event-read-value'),event.reads.map(r=>r.exact));
    assert.deepEqual(values(html,'data-event-before'),event.diffs.map(d=>d.before));
    assert.deepEqual(values(html,'data-event-after'),event.diffs.map(d=>d.after));
    assert.equal(JSON.stringify(event),encoded);history.set(event.id,encoded);
    counts.events++;counts.reads+=event.reads.length;counts.mutations+=event.diffs.length;counts.changes+=event.diffs.filter(d=>d.changed).length;
   }
   assert.deepEqual(run.checkpoint(),before);counts.prefixes++;counts.fields+=s.fields.length;
   snapshots.push({prefix:s.prefix,saveHash:s.saveHash,modelHash:s.modelHash,runHash:s.runHash,stateHash:s.stateHash,outputsHash:s.outputsHash,traceHash:s.traceHash,fields:s.fields,timeline:s.timeline});
   assert.equal(await run.advance(),s.prefix+1<original.prefixes.length);
  }
  const path=`program-${String(counts.programs).padStart(2,'0')}.json`,bytes=JSON.stringify({program:original.id,snapshots},null,2)+'\n';
  assert(Buffer.byteLength(bytes)<50_000_000);fs.writeFileSync(root+'/'+path,bytes,{flag:'wx'});
  results.push({program:original.id,path,sha256:sha(bytes),prefixes:snapshots.length});counts.programs++;
  console.log(`PASS ${counts.programs}/16 BODY state inspection`);
 }
 assert.equal(counts.programs,16);assert.equal(counts.prefixes,79);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BODY STATE INSPECTION',sources,counts,results,
 scope:'All16 original programs/79 prefixes preserve native commitments under read-only state search and server rendering. Exact event read/before/after values and historical stability checked. Browser selection/filter/reset and broader accessibility remain separate. Researcher diagnostics do not confer character knowledge or causal necessity.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
