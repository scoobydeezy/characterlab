import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash}from'node:crypto';import {gunzipSync}from'node:zlib';import {createServer}from'vite';
const root='docs/planning/workbench-long-navigation-rev1',parent='docs/planning/workbench-long-comparison-cohort-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const receipt=JSON.parse(fs.readFileSync(parent+'/receipt.json'));
const paths=['src/workbench/LongWorkbench.tsx','src/workbench/CausalHistoryPanel.tsx','src/workbench/StateReadHistoryPanel.tsx','src/workbench/ParticipationInspector.tsx','src/workbench/causalNavigation.ts','src/workbench/stateReadHistory.ts','src/workbench/participation.ts','scripts/check-workbench-long-navigation.mjs',parent+'/receipt.json','docs/planning/workbench-long-parity-rev2/evidence-join.json'];
const sources=paths.map(path=>{const bytes=fs.readFileSync(path),dest=root+'/sources/'+path;fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path,sha256:sha(bytes)};});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {participationReport}=await server.ssrLoadModule('/src/workbench/participation.ts'),{recordedCausalHistory}=await server.ssrLoadModule('/src/workbench/causalNavigation.ts'),{recordedStateReadHistory}=await server.ssrLoadModule('/src/workbench/stateReadHistory.ts');
 let prefixes=0,events=0,reads=0;const results=[];
 for(const entry of receipt.programs){
  const bytes=fs.readFileSync(parent+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);const decoded=gunzipSync(bytes);assert.equal(sha(decoded),entry.decodedSha256);const snapshots=JSON.parse(decoded),reports=[];
  for(const snapshot of snapshots){
   const before=sha(JSON.stringify(snapshot)),identity=Object.fromEntries(['modelHash','runHash','saveHash','stateHash','prefix'].map(k=>[k,snapshot[k]])),report=participationReport(identity,snapshot.timeline,snapshot.fields),counts=new Map();
   const touch=path=>{if(!counts.has(path))counts.set(path,{reads:0,mutations:0,changes:0,present:false,ids:new Set()});return counts.get(path);};
   for(const f of snapshot.fields)touch(f.path).present=true;
   const byId=new Map(snapshot.timeline.map(e=>[e.id,e])),latest=new Map();let eventChecks=0,readChecks=0;
   for(const event of snapshot.timeline){
    for(const r of event.reads){const c=touch(r.path);c.reads++;c.ids.add(event.id);}
    for(const d of event.diffs){const c=touch(d.path);c.mutations++;if(d.changed)c.changes++;c.ids.add(event.id);}
    const history=recordedCausalHistory(snapshot.timeline,event.id),seen=new Set(),pending=[event.id],edges=new Set(),missing=new Set();
    while(pending.length){const id=pending.pop();if(seen.has(id))continue;seen.add(id);const e=byId.get(id);if(!e){missing.add(id);continue;}for(const p of new Set(e.parents)){edges.add(p+'>'+id);pending.push(p);}}
    assert.deepEqual(new Set(history.nodes.map(n=>n.event.id)),new Set([...seen].filter(id=>byId.has(id))));assert.deepEqual(new Set(history.missing),missing);assert.deepEqual(new Set(history.edges.map(e=>e.parent+'>'+e.child)),edges);assert.deepEqual(history.children.map(e=>e.id),snapshot.timeline.filter(e=>e.parents.includes(event.id)).map(e=>e.id));assert.equal(history.cyclic,false);
    const readHistory=recordedStateReadHistory(snapshot.timeline,event.id);assert.equal(readHistory.reads.length,event.reads.length);
    for(const [i,row]of readHistory.reads.entries()){
     const actual=event.reads[i],prior=latest.get(actual.path);assert.equal(row.path,actual.path);assert.equal(row.exact,actual.exact);assert.equal(row.priorMutation?.event.id,prior?.id);assert.equal(row.relation,prior?(prior.after===actual.exact?'exact-value-match':'value-mismatch'):'no-prior-recorded-mutation');readChecks++;
    }
    for(const d of event.diffs)latest.set(d.path,{id:event.id,after:d.after});eventChecks++;
   }
   assert.equal(report.rows.length,counts.size);for(const row of report.rows){const c=counts.get(row.path);for(const k of ['reads','mutations','changes'])assert.equal(row[k],c[k]);assert.equal(row.presentAtRevision,c.present);assert.deepEqual(new Set(row.events.map(e=>e.id)),c.ids);}
   assert.equal(sha(JSON.stringify(snapshot)),before);reports.push({prefix:snapshot.prefix,identity,participation:report,eventChecks,readChecks});prefixes++;events+=eventChecks;reads+=readChecks;
  }
  const path=`program-${String(results.length).padStart(2,'0')}.json`;fs.writeFileSync(root+'/'+path,JSON.stringify(reports)+'\n',{flag:'wx'});results.push({program:entry.program,path,sha256:sha(fs.readFileSync(root+'/'+path)),source:parent+'/'+entry.path,sourceSha256:entry.sha256});console.log('PASS navigation '+entry.program);
 }
 assert.equal(prefixes,476);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS LONG RECORDED NAVIGATION AND PARTICIPATION',sources,results,counts:{programs:28,prefixes,events,reads},scope:'Every event and state path in28 saved native-backed comparison source programs/476 prefixes. Parent reachability, missing IDs, children, earlier identical-path mutations and participation counts independently checked; input unchanged. No new execution, canonical box mapping, native derived-source attribution or causal necessity. Four noncomparison source programs, broader browser and full Workbench acceptance remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',prefixes,events,reads}));
}finally{await server.close();}
