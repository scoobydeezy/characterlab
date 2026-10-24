import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-affect-learning-episode-corpus-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
fs.mkdirSync(root);const write=(p,v)=>fs.writeFileSync(root+'/'+p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const refs=['docs/planning/workbench-affect-parity-rev1/receipt.json','docs/planning/workbench-affect-supplements-rev1/receipt.json','docs/planning/workbench-batch-parity-rev8/manifest.json'];
const [main,supp,batch]=refs.map(read),paths=[...new Set([...batch.sources.map(s=>s.path),'src/workbench/affectLearningEpisodeSources.ts','src/workbench/AffectLearningEpisodePanel.tsx','src/workbench/AffectTimelineView.tsx','scripts/check-affect-learning-episode-corpus.mjs'])];
const sources=paths.map(path=>{const b=fs.readFileSync(path),old=batch.sources.find(s=>s.path===path);if(old)assert.equal(sha(b),old.sha256,path);const copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return{path,copy,sha256:sha(b)};});
write('freeze.json',{sources,references:refs.map(path=>({path,sha256:sha(fs.readFileSync(path))})),target:{programs:105,prefixes:1436}});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[];
const counts={programs:0,prefixes:0,reports:0,conditional:0,empty:0,roles:0,evidenceJoins:0,freezeJoins:0,trackJoins:0,observationJoins:0,unavailable:0,multiple:0,historyChecks:0};
const countMatches=n=>{if(n===0)counts.unavailable++;if(n>1)counts.multiple++;};
try{
 const load=p=>server.ssrLoadModule('/src/workbench/'+p),{AffectWorkbenchRun}=await load('affectAdapter.ts'),{AffectSupplementRun}=await load('affectSupplementAdapter.ts'),{affectLearningEpisodeSources:project}=await load('affectLearningEpisodeSources.ts');
 for(const [prior,Adapter] of [[main,AffectWorkbenchRun],[supp,AffectSupplementRun]])for(const original of prior.results){
  const run=await Adapter.create(original.id),history=new Map(),prefixes=[];
  do{
   const s=run.snapshot(),before=sha(JSON.stringify(s)),o=original.prefixes[s.prefix];for(const key of ['stateHash','saveHash','outputsHash'])assert.equal(s[key],o[key]);
   const event=id=>{const e=s.timeline.find(e=>e.id===id);assert(e,`Missing event ${id}`);return e;};
   const join=(id,stage,consumer,value,parent)=>{const e=event(id);assert.equal(e.stage,stage);assert(s.timeline.indexOf(e)<s.timeline.indexOf(consumer));if(parent)assert(consumer.parents.includes(id));const values=JSON.parse(e.output);assert(values.some(v=>{try{assert.deepEqual(v,value);return true;}catch{return false;}}));return e;};
   const reports=s.timeline.filter(e=>e.stage==='apply').map(apply=>{
    const report=project(s,apply.id),{identity,...body}=report,input=JSON.parse(apply.input);counts.reports++;
    if(history.has(apply.id)){assert.deepEqual(body,history.get(apply.id));counts.historyChecks++;}else history.set(apply.id,body);
    if(Array.isArray(input)){assert.deepEqual(input,[]);assert.equal(report.conditionalEvidencePresent,false);assert.equal(report.current,null);assert.deepEqual(report.episodeBasis,[]);assert.deepEqual(report.evidence,[]);counts.empty++;return report;}
    counts.conditional++;assert.equal(report.conditionalEvidencePresent,true);assert.deepEqual(report.current.frozen,input['Current [2]']);assert.deepEqual(report.episodeBasis.map(r=>r.frozen),input['EpisodeBasis [3]']);assert.equal(report.samplePresent,Object.hasOwn(input,'Sample [4]'));
    countMatches(report.evidence.length);for(const e of report.evidence){join(e.eventId,'evidence',apply,input,true);counts.evidenceJoins++;}
    for(const row of [report.current,...report.episodeBasis]){counts.roles++;countMatches(row.freezes.length);for(const f of row.freezes){const frozen=join(f.eventId,'freeze',apply,row.frozen,false);assert.deepEqual(JSON.parse(frozen.input),row.frozen['Observation [2]']);counts.freezeJoins++;countMatches(f.tracks.length);
     for(const t of f.tracks){const track=join(t.eventId,'track',frozen,row.frozen['Observation [2]'],true);counts.trackJoins++;countMatches(t.observations.length);for(const obs of t.observations){join(obs.eventId,'observe',track,JSON.parse(track.input),true);counts.observationJoins++;}}
    }}return report;
   });
   assert.equal(sha(JSON.stringify(s)),before);prefixes.push({prefix:s.prefix,identities:{stateHash:s.stateHash,saveHash:s.saveHash,outputsHash:s.outputsHash},reports});counts.prefixes++;
  }while(await run.advance());
  assert(run.snapshot().complete);assert.equal(prefixes.length,original.prefixes.length);const file=`program-${String(results.length).padStart(3,'0')}.json`;write(file,{program:original.id,prefixes});results.push({program:original.id,file,sha256:sha(fs.readFileSync(root+'/'+file))});counts.programs++;console.log(`PASS episode corpus ${counts.programs}/105 ${original.id}`);
 }
 assert.equal(counts.programs,105);assert.equal(counts.prefixes,1436);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 write('receipt.json',{status:'PASS FULL ORIGINAL AFFECT RECORDED EPISODE CORPUS',counts,results,scope:'All105 original programs/1436 prefixes; exact conditional evidence and ordered episode data, original output and parent joins, immutable historical reports. Counters include repeated historical reports. Missing and multiple joins counted, never promoted to complete ancestry. No browser, player disclosure, causal necessity or full entry claim.'});
}catch(error){write('failure.json',{error:String(error),stack:error.stack,counts,results});throw error;}finally{await server.close();}
