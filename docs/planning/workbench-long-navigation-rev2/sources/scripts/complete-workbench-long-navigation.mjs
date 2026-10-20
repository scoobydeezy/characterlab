import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash}from'node:crypto';import {createServer}from'vite';
const root='docs/planning/workbench-long-navigation-rev2',prior='docs/planning/workbench-long-navigation-rev1',native='docs/planning/workbench-long-parity-rev2',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const before=read(prior+'/receipt.json'),n=read(native+'/receipt.json'),results=[];
for(const r of before.results){assert.equal(sha(fs.readFileSync(prior+'/'+r.path)),r.sha256);results.push({...r,path:prior+'/'+r.path,inherited:true});}
const sourceMap=new Map([...before.sources,...n.sources].map(s=>[s.path,s.sha256]));
for(const path of ['scripts/complete-workbench-long-navigation.mjs',prior+'/receipt.json',native+'/receipt.json'])sourceMap.set(path,sha(fs.readFileSync(path)));
const sources=[...sourceMap].map(([path,sha256])=>{const bytes=fs.readFileSync(path);assert.equal(sha(bytes),sha256,path);const dest=root+'/sources/'+path;fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path,sha256};});
const pending=n.results.filter(p=>!results.some(r=>r.program===p.program));assert.deepEqual(pending.map(p=>p.program),['representation-3-law-2','representation-4-law-2','empty','maximum-time']);
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {LongWorkbenchRun}=await server.ssrLoadModule('/src/workbench/longAdapter.ts'),{participationReport}=await server.ssrLoadModule('/src/workbench/participation.ts'),{recordedCausalHistory}=await server.ssrLoadModule('/src/workbench/causalNavigation.ts'),{recordedStateReadHistory}=await server.ssrLoadModule('/src/workbench/stateReadHistory.ts');
 let prefixes=0,events=0,reads=0;
 for(const entry of pending){
  const bytes=fs.readFileSync(native+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);const expected=JSON.parse(bytes),run=await LongWorkbenchRun.create(entry.program),reports=[];
  for(;;){
   const snapshot=run.snapshot(),original=expected.prefixes[snapshot.prefix];assert(original);
   for(const key of ['prefix','clock','modelHash','runHash','stateHash','saveHash','outputsHash','traceHash','observerHash'])assert.equal(snapshot[key],original[key]);
   const frozen=sha(JSON.stringify(snapshot)),identity=Object.fromEntries(['modelHash','runHash','saveHash','stateHash','prefix'].map(k=>[k,snapshot[k]])),report=participationReport(identity,snapshot.timeline,snapshot.fields),counts=new Map(),latest=new Map(),byId=new Map(snapshot.timeline.map(e=>[e.id,e]));
   const touch=path=>{if(!counts.has(path))counts.set(path,{reads:0,mutations:0,changes:0,present:false,ids:new Set()});return counts.get(path);};
   for(const f of snapshot.fields)touch(f.path).present=true;
   let eventChecks=0,readChecks=0;
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
   assert.equal(sha(JSON.stringify(snapshot)),frozen);assert.deepEqual(run.snapshot(),snapshot);
   reports.push({prefix:snapshot.prefix,identity,participation:report,eventChecks,readChecks});prefixes++;events+=eventChecks;reads+=readChecks;
   console.log(`PASS ${entry.program} prefix ${snapshot.prefix}`);
   if(!await run.advance())break;
  }
  assert.equal(reports.length,entry.prefixes);const path=root+`/program-${String(results.length).padStart(2,'0')}.json`;fs.writeFileSync(path,JSON.stringify(reports)+'\n',{flag:'wx'});results.push({program:entry.program,path,sha256:sha(fs.readFileSync(path)),native:native+'/'+entry.path,nativeSha256:entry.sha256,inherited:false});
 }
 assert.equal(prefixes,37);assert.equal(results.length,32);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS COMPLETE ORIGINAL LONG NAVIGATION COVERAGE',sources,results,counts:{programs:32,prefixes:before.counts.prefixes+prefixes,events:before.counts.events+events,reads:before.counts.reads+reads,inheritedPrograms:28,inheritedPrefixes:476,freshPrograms:4,freshPrefixes:prefixes},scope:'Original32-program source only. Retains28 completed native-backed traversal audits and freshly executes four missing source programs/37 prefixes with nine native commitment joins. Every retained event/path checked for parent traversal, earlier read provenance and activity counts; diagnostic reads preserve snapshots. Empty program has no events. No repeated native restore audit, all-program browser claim, successor coverage, canonical box mapping, causal necessity or full Workbench acceptance.'},null,2)+'\n',{flag:'wx'});console.log('PASS full original LONG navigation census');
}catch(error){fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),results},null,2)+'\n',{flag:'wx'});throw error;}finally{await server.close();}
