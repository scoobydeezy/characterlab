import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-paged-full-diagnostics-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',script='scripts/check-workbench-disposition-paged-full-diagnostics.mjs',sha=b=>createHash('sha256').update(b).digest('hex'),jsonSha=v=>sha(JSON.stringify(v));
assert(!fs.existsSync(root),'Never overwrite an audit revision');fs.mkdirSync(root,{recursive:true});
const modules=['dispositionPagedAdapter','dispositionArchitecture','dispositionReasonDiagnostics','dispositionResolution','dispositionFactorSources','dispositionCalibration','dispositionProvenance','dispositionTaskSources','dispositionExplanations'];
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of [...modules.map(m=>'src/workbench/'+m+'.ts'),script,prior+'/receipt.json'])visit(p);
const sources=[...files].sort().map(p=>{const b=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});return{path:p,sha256:sha(b)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources,scope:'All15 original programs/all19 prefixes; ten diagnostic kinds, compact history and recorded choices. Native paged path, not browser or paired controls.'},null,2)+'\n',{flag:'wx'});
const artifacts=new Map(JSON.parse(fs.readFileSync(prior+'/receipt.json')).artifacts.map(a=>[a.path,a.sha256]));
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[];
try{
 const loaded=Object.assign({},...await Promise.all(modules.map(m=>server.ssrLoadModule('/src/workbench/'+m+'.ts')))),{DispositionPagedRun:Run}=loaded;
 const plan=JSON.parse(fs.readFileSync('docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json'));
 async function program(index){
  const spec=plan.runs[index],run=await Run.create(spec.law+'/'+spec.name),history=[],choices=[],historical=new Map();
  function inspect(prefix){
   const name=`snapshot-${index}-${prefix}.json.gz`,compressed=fs.readFileSync(prior+'/'+name);assert.equal(sha(compressed),artifacts.get(name));const expected=JSON.parse(gunzipSync(compressed)),summary=run.summary(),checks=[];
   for(const key of ['program','seamVersion','constitution','law','prefix','complete','clock','modelHash','runHash','stateHash','saveHash','projectionHash'])assert.deepEqual(summary[key],expected[key],key);
   assert.deepEqual(summary.timeline,expected.timeline.map(({id,instant,phase,stage,parents})=>({id,instant,phase,stage,parents})));assert.deepEqual(summary.fields,expected.fields.map(({root,path})=>({root,path})));
   const report=(selection)=>{const e=run.diagnostic(summary.saveHash,selection);assert.equal(e.identity.saveHash,summary.saveHash);assert.equal(e.identity.program,summary.program);checks.push({selection,reportSha256:jsonSha(e.report)});return e.report;};
   const scalar=root=>{const f=expected.fields.find(f=>f.root===root);if(!f)return null;const exact=JSON.parse(f.exact)['Value [1]'],[n,d]=exact.split('/').map(Number);return {exact,plot:n/d,path:f.path};};
   history.push({prefix,constitution:scalar('1457'),plastic:scalar('1458')});const stored=report({kind:'storedState'});assert.deepEqual(stored.constitution,history.at(-1).constitution);assert.deepEqual(stored.plastic,history.at(-1).plastic);assert.deepEqual(run.storedHistory(summary.saveHash).rows,history);
   assert.deepEqual(report({kind:'architecture'}),loaded.dispositionArchitecture(expected));
   for(const event of expected.timeline.filter(e=>Number(e.instant)===prefix)){
    const e=report({kind:'eventState',eventId:event.id});assert.deepEqual(e.event,summary.timeline.find(h=>h.id===event.id));
    assert.deepEqual(e.reads,event.reads.map((r,index)=>({index,path:r.path,label:r.label,presence:r.exact!=='Absent'})));
    assert.deepEqual(e.diffs,event.diffs.map((d,index)=>({index,path:d.path,label:d.label,beforePresence:d.before!=='Absent',afterPresence:d.after!=='Absent',changed:d.changed})));
    if(event.stage!=='reasons')continue;
    const resolution=loaded.dispositionResolution(expected.timeline,event.id,summary.seamVersion);
    const originals={reasons:loaded.inspectDispositionReasons(event),resolution,calibration:loaded.dispositionCalibration(event,summary.seamVersion),provenance:loaded.dispositionProvenance(event,summary.law,summary.seamVersion),taskSources:loaded.dispositionTaskSources(event,summary.seamVersion)};
    for(const [kind,value]of Object.entries(originals))assert.deepEqual(report({kind,eventId:event.id}),value);
    const factors=report({kind:'factorSources',eventId:event.id}),originalFactors=loaded.dispositionFactorSources(event);assert.deepEqual(factors.rows,originalFactors.rows);assert.deepEqual(factors.nuclei,originalFactors.nuclei);
    for(const audience of ['researcher','character','player'])assert.deepEqual(report({kind:'language',eventId:event.id,audience}),loaded.explainDispositionFactors(event,summary.seamVersion,audience));
    choices.push({instant:resolution.instant,reasonEvent:resolution.reasonEvent,decisionEvent:resolution.decisionEvent,intentEvent:resolution.intentEvent,emitted:resolution.emitted,candidate:resolution.emitted?resolution.chosenCandidate:null});
   }
   assert.deepEqual(run.choiceRows(summary.saveHash),choices);
   for(const [key,hash]of historical){const selection=JSON.parse(key);assert.equal(jsonSha(run.diagnostic(summary.saveHash,selection).report),hash,'historical '+key);}
   for(const c of checks)if('eventId'in c.selection)historical.set(JSON.stringify(c.selection),c.reportSha256);
   assert.deepEqual(run.summary(),summary);const result={program:summary.program,index,prefix,archive:{path:name,sha256:artifacts.get(name)},identities:Object.fromEntries(['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>[k,summary[k]])),checks,scalarHistorySha256:jsonSha(history),choicesSha256:jsonSha(choices),historicalReports:historical.size,processMemoryObservation:process.memoryUsage()};
   const file=`program-${index}-prefix-${prefix}.json`;fs.writeFileSync(root+'/'+file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});results.push({path:file,sha256:sha(fs.readFileSync(root+'/'+file))});console.log(`PASS paged diagnostics ${index+1}/15 prefix${prefix}/18`);
  }
  for(let prefix=0;prefix<=18;prefix++){inspect(prefix);global.gc?.();if(prefix<18)await run.advance();}
 }
 for(let i=0;i<15;i++){await program(i);global.gc?.();}
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 assert.equal(results.length,285);fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL NATIVE PAGED DIAGNOSTIC HORIZONS',results,scope:'15 original programs/285 prefixes. Exact native identities, headers, state descriptors, stored scalar values/history, architecture, each new event-state metadata, reason/calibration/resolution/provenance/task/language reports, factor rows/nuclei and choices against authenticated original snapshots. Prior event reports remain exact at later prefixes. No browser, checkpoint restoration, all source-page bytes, player-disclosure or heap-bound claim. Process memory includes archive parsing.'},null,2)+'\n',{flag:'wx'});
}catch(error){fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),stack:error.stack,completed:results},null,2)+'\n',{flag:'wx'});throw error;}finally{await server.close();}
