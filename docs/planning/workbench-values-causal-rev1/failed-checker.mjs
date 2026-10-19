import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-values-causal-rev1',planPath='docs/planning/values-integration-matrix-rev1/plan.json',sha=b=>createHash('sha256').update(b).digest('hex'),plan=JSON.parse(fs.readFileSync(planPath));assert(!fs.existsSync(root));
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);if(child.endsWith('.ts'))visit(child);else files.add(child.replaceAll('\\','/'));}}
for(const p of ['src/workbench/valuesAdapter.ts','src/workbench/causalNavigation.ts','src/test/workbenchCausalNavigation.test.ts'])visit(p);
for(const p of ['src/workbench/CausalHistoryPanel.tsx','src/workbench/Workbench.tsx','scripts/check-workbench-values-causal.mjs'])files.add(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),target=root+'/sources/'+p;fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[];let prefixes=0,traversals=0;
try{
 const {ValuesWorkbenchRun}=await server.ssrLoadModule('/src/workbench/valuesAdapter.ts'),{recordedCausalHistory}=await server.ssrLoadModule('/src/workbench/causalNavigation.ts');
 for(const config of plan.runs){
  const referencePath=`docs/planning/values-integration-matrix-rev1/run-${config.index}.json`,reference=JSON.parse(fs.readFileSync(referencePath)),run=await ValuesWorkbenchRun.create({profile:{law:config.law,appraisal:config.appraisal,seed:config.seed},frames:config.frames}),rows=[],historical=new Map();
  for(let prefix=0;prefix<=4;prefix++){
   const snapshot=run.snapshot(),before=run.checkpoint(),histories=[];assert.equal(snapshot.saveHash,reference.prefixes[prefix].saveSha256);assert.equal(snapshot.timeline.length,13*prefix);
   for(const selected of snapshot.timeline){
    const h=recordedCausalHistory(snapshot.timeline,selected.id),expected=new Set([selected.id]);let grew=true;
    while(grew){grew=false;for(const e of snapshot.timeline)if(expected.has(e.id))for(const p of e.parents)if(!expected.has(p)){expected.add(p);grew=true;}}
    assert.deepEqual(new Set(h.nodes.map(n=>n.event.id)),expected);assert.equal(h.cyclic,false);assert.deepEqual(h.missing,[]);
    const edges=snapshot.timeline.filter(e=>expected.has(e.id)).flatMap(e=>[...new Set(e.parents)].map(parent=>({parent,child:e.id})));assert.deepEqual([...h.edges].sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),edges.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
    const stable={selected:h.selected,nodes:h.nodes,edges:h.edges};if(historical.has(selected.id))assert.deepEqual(stable,historical.get(selected.id));historical.set(selected.id,stable);
    histories.push({selected:h.selected,nodes:h.nodes.map(n=>({id:n.event.id,distance:n.distance})),edges:h.edges});traversals++;
   }
   for(const reason of snapshot.reasons){assert(snapshot.timeline.some(e=>e.id===reason.eventId&&e.stage==='reasons'&&e.instant===String(reason.instant)));}
   assert.deepEqual(run.checkpoint(),before);rows.push({prefix,saveHash:snapshot.saveHash,stateHash:snapshot.stateHash,runHash:snapshot.runHash,histories});prefixes++;if(prefix<4)await run.advance();
  }
  const final=run.snapshot(),filename=`run-${config.index}.json.gz`,bytes=gzipSync(JSON.stringify({index:config.index,rows,timeline:final.timeline,reasons:final.reasons}),{level:9});fs.writeFileSync(root+'/'+filename,bytes,{flag:'wx'});results.push({index:config.index,path:filename,sha256:sha(bytes),referencePath,referenceSha256:sha(fs.readFileSync(referencePath))});if(results.length%10===0)console.log(`PASS causal ${results.length}/125`);
 }
 assert.equal(results.length,125);assert.equal(prefixes,625);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL RETAINED VALUES RECORDED-ANCESTRY COHORT',sources,plan:{path:planPath,sha256:sha(fs.readFileSync(planPath))},programs:results.length,prefixes,traversals,results,scope:'Exact original saves at all prefixes; every retained event ancestor/edge set and reason-event identity checked; historical ancestry stable after later execution; diagnostic reads leave checkpoints unchanged. Recorded scheduler dependency only, not complete state-read causality, psychological necessity or full language adequacy.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',programs:results.length,prefixes,traversals}));
}finally{await server.close();}
