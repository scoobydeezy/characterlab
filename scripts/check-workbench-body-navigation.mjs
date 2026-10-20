import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-body-navigation-rev1',nativeRoot='docs/planning/workbench-body-parity-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const native=read(nativeRoot+'/receipt.json'),language=read('docs/planning/workbench-body-language-rev1/receipt.json'),catalog=read('src/workbench/bodyCatalog.json'),files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/BodyWorkbench.tsx','src/workbench/bodyPressureHistory.ts','src/workbench/bodyWorker.ts','scripts/check-workbench-body-navigation.mjs',nativeRoot+'/receipt.json','docs/planning/workbench-body-language-rev1/receipt.json'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {BodyWorkbenchRun}=await server.ssrLoadModule('/src/workbench/bodyAdapter.ts'),{bodyPressureEventLinks}=await server.ssrLoadModule('/src/workbench/bodyPressureHistory.ts'),{explainBodyPressure}=await server.ssrLoadModule('/src/workbench/bodyExplanations.ts'),{participationReport}=await server.ssrLoadModule('/src/workbench/participation.ts'),{recordedCausalHistory}=await server.ssrLoadModule('/src/workbench/causalNavigation.ts'),{recordedStateReadHistory}=await server.ssrLoadModule('/src/workbench/stateReadHistory.ts');
 let prefixes=0,events=0,reads=0,pressureLinks=0;const results=[];
 for(const [index,p]of catalog.programs.entries()){
  const n=native.results.find(r=>r.program===p.name),nb=fs.readFileSync(nativeRoot+'/'+n.path);assert.equal(sha(nb),n.sha256);const expected=JSON.parse(nb).prefixes;
  const l=language.results.find(r=>r.program===p.name),lp='docs/planning/workbench-body-language-rev1/'+l.path,lb=fs.readFileSync(lp);assert.equal(sha(lb),l.sha256);const descriptions=JSON.parse(lb);
  const run=await BodyWorkbenchRun.create(p.name),reports=[];
  for(;;){
   const s=run.snapshot(),before=sha(JSON.stringify(s)),original=expected[s.prefix];for(const k of ['prefix','clock','modelHash','runHash','stateHash','saveHash','outputsHash','traceHash'])assert.equal(s[k],original[k]);
   const description=explainBodyPressure(s.pressureRecords);assert.deepEqual(description,descriptions[s.prefix].report);
   const links=bodyPressureEventLinks(s.pressureRecords,s.timeline);assert.equal(links.length,description.rows.length);
   for(const [i,link]of links.entries()){
    const exact=JSON.parse(description.rows[i].exact),matches=s.timeline.filter(e=>JSON.parse(e.output).some(v=>JSON.stringify(v)===JSON.stringify(exact)));assert.equal(matches.length,1);assert.equal(link.eventId,matches[0].id);pressureLinks++;
   }
   const identity=Object.fromEntries(['modelHash','runHash','saveHash','stateHash','prefix'].map(k=>[k,s[k]])),participation=participationReport(identity,s.timeline,s.fields),counts=new Map(),byId=new Map(s.timeline.map(e=>[e.id,e])),latest=new Map();let eventChecks=0,readChecks=0;
   const touch=path=>{if(!counts.has(path))counts.set(path,{reads:0,mutations:0,changes:0,present:false,ids:new Set()});return counts.get(path);};
   for(const f of s.fields)touch(f.path).present=true;
   for(const event of s.timeline){
    for(const r of event.reads){const c=touch(r.path);c.reads++;c.ids.add(event.id);}for(const d of event.diffs){const c=touch(d.path);c.mutations++;if(d.changed)c.changes++;c.ids.add(event.id);}
    const h=recordedCausalHistory(s.timeline,event.id),seen=new Set(),pending=[event.id],edges=new Set(),missing=new Set();
    while(pending.length){const id=pending.pop();if(seen.has(id))continue;seen.add(id);const e=byId.get(id);if(!e){missing.add(id);continue;}for(const parent of new Set(e.parents)){edges.add(parent+'>'+id);pending.push(parent);}}
    assert.deepEqual(new Set(h.nodes.map(n=>n.event.id)),new Set([...seen].filter(id=>byId.has(id))));assert.deepEqual(new Set(h.missing),missing);assert.deepEqual(new Set(h.edges.map(e=>e.parent+'>'+e.child)),edges);assert.deepEqual(h.children.map(e=>e.id),s.timeline.filter(e=>e.parents.includes(event.id)).map(e=>e.id));assert.equal(h.cyclic,false);
    const rh=recordedStateReadHistory(s.timeline,event.id);assert.equal(rh.reads.length,event.reads.length);
    for(const [i,row]of rh.reads.entries()){const actual=event.reads[i],prior=latest.get(actual.path);assert.equal(row.path,actual.path);assert.equal(row.exact,actual.exact);assert.equal(row.priorMutation?.event.id,prior?.id);assert.equal(row.relation,prior?(prior.after===actual.exact?'exact-value-match':'value-mismatch'):'no-prior-recorded-mutation');readChecks++;}
    for(const d of event.diffs)latest.set(d.path,{id:event.id,after:d.after});eventChecks++;
   }
   assert.equal(participation.rows.length,counts.size);for(const row of participation.rows){const c=counts.get(row.path);for(const k of ['reads','mutations','changes'])assert.equal(row[k],c[k]);assert.equal(row.presentAtRevision,c.present);assert.deepEqual(new Set(row.events.map(e=>e.id)),c.ids);}
   assert.equal(sha(JSON.stringify(run.snapshot())),before);
   reports.push({prefix:s.prefix,identity:original,participation,links,eventChecks,readChecks});prefixes++;events+=eventChecks;reads+=readChecks;
   if(p.name==='baseline'&&s.prefix===1){
    const record=s.pressureRecords[0],producer=s.timeline.find(e=>e.id===links[0].eventId);
    assert.equal(bodyPressureEventLinks([record],[])[0].eventId,null);
    assert.throws(()=>bodyPressureEventLinks([record],[producer,producer]),/duplicate/);
    assert.throws(()=>bodyPressureEventLinks([record],[producer,{...producer,id:'other'}]),/ambiguous/);
   }
   if(!await run.advance())break;
  }
  assert.equal(reports.length,expected.length);const filename=`program-${String(index).padStart(2,'0')}.json`;fs.writeFileSync(root+'/'+filename,JSON.stringify(reports)+'\n',{flag:'wx'});results.push({program:p.name,path:filename,sha256:sha(fs.readFileSync(root+'/'+filename)),native:{path:nativeRoot+'/'+n.path,sha256:n.sha256},language:{path:lp,sha256:l.sha256}});console.log(`PASS BODY navigation ${index+1}/16 ${p.name}`);
 }
 assert.equal(prefixes,79);assert.equal(pressureLinks,190);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BODY RECORDED NAVIGATION AND PARTICIPATION',sources,results,counts:{programs:16,prefixes,events,reads,pressureLinks},scope:'Fresh original79-prefix execution matches native hashes and qualified language. All190 admitted-pressure instances join one exact producing event; all parent/child links, prior same-path mutations and participation counts checked. Counts are cumulative across prefixes. No canonical-box mapping, hidden-body language or causal-necessity claim.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',prefixes,events,reads,pressureLinks}));
}finally{await server.close();}
