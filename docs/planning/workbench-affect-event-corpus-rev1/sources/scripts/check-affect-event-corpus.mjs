import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';

const root='docs/planning/workbench-affect-event-corpus-rev1';
const sha=value=>createHash('sha256').update(value).digest('hex');
assert(!fs.existsSync(root),'Preserve prior evidence; use a new revision');
fs.mkdirSync(root,{recursive:true});
const write=(name,value)=>fs.writeFileSync(`${root}/${name}`,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const referencePaths=['docs/planning/workbench-affect-parity-rev1/receipt.json','docs/planning/workbench-affect-supplements-rev1/receipt.json','docs/planning/workbench-affect-language-rev1/receipt.json','docs/planning/workbench-batch-parity-rev8/manifest.json'];
const references=referencePaths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const [main,supp,language,batch]=referencePaths.map(path=>JSON.parse(fs.readFileSync(path)));
const paths=[...new Set([...batch.sources.map(s=>s.path),'src/workbench/affectAppraisalEvent.ts','src/workbench/stateReadHistory.ts','scripts/check-affect-event-corpus.mjs'])];
const sources=paths.map(path=>{
 const bytes=fs.readFileSync(path),original=batch.sources.find(s=>s.path===path);
 if(original)assert.equal(sha(bytes),original.sha256,`Live binding ${path}`);
 const copy=`${root}/sources/${path}`;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});
 return {path,copy,sha256:sha(bytes)};
});
write('freeze.json',{status:'FROZEN BEFORE EXECUTION',sources,references,target:{roles:105,prefixes:1436,appraisals:1331}});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const results=[],counts={roles:0,prefixes:0,appraisals:0,historicalComparisons:0,reads:0,exactMatches:0,valueMismatches:0,noPriorMutation:0};
try{
 const {AffectWorkbenchRun}=await server.ssrLoadModule('/src/workbench/affectAdapter.ts');
 const {AffectSupplementRun}=await server.ssrLoadModule('/src/workbench/affectSupplementAdapter.ts');
 const {affectAppraisalEvent}=await server.ssrLoadModule('/src/workbench/affectAppraisalEvent.ts');
 const {recordedStateReadHistory}=await server.ssrLoadModule('/src/workbench/stateReadHistory.ts');
 for(const [cohort,prior,Adapter] of [['main',main,AffectWorkbenchRun],['supplementary',supp,AffectSupplementRun]])for(const original of prior.results){
  const run=await Adapter.create(original.id),history=new Map(),prefixes=[];
  do{
   const snapshot=run.snapshot(),oracle=original.prefixes[snapshot.prefix];
   assert(oracle,'Unexpected native prefix');
   for(const key of ['stateHash','saveHash','outputsHash'])assert.equal(snapshot[key],oracle[key],`${original.id}/${snapshot.prefix}/${key}`);
   const before=sha(JSON.stringify(snapshot)),cards=snapshot.explanations.filter(c=>c.kind==='Appraisal'),joins=[];
   for(const card of cards){
    const event=affectAppraisalEvent(snapshot.timeline,card.provenance),index=snapshot.timeline.findIndex(e=>e.id===event.id);
    assert.equal(event.instant,card.at);assert.equal(event.phase,'50');assert.equal(event.stage,'appraise');
    assert.equal(JSON.parse(event.output).filter(o=>JSON.stringify(o)===card.provenance).length,1);
    const report=recordedStateReadHistory(snapshot.timeline,event.id);
    assert.equal(report.reads.length,event.reads.length);
    for(const [ordinal,read] of event.reads.entries()){
     let predecessor=null;
     for(let i=index-1;i>=0&&!predecessor;i--){
      const priorEvent=snapshot.timeline[i],diff=priorEvent.diffs.find(d=>d.path===read.path);
      if(diff){const {id,instant,phase,stage}=priorEvent;predecessor={event:{id,instant,phase,stage},before:diff.before,after:diff.after,changed:diff.changed};}
     }
     assert.deepEqual(report.reads[ordinal],{ordinal,path:read.path,label:read.label,exact:read.exact,priorMutation:predecessor,relation:predecessor?(predecessor.after===read.exact?'exact-value-match':'value-mismatch'):'no-prior-recorded-mutation'});
    }
    const identity={eventSha256:sha(JSON.stringify(event)),historySha256:sha(JSON.stringify(report)),provenanceSha256:sha(card.provenance)};
    if(history.has(card.id)){assert.deepEqual(identity,history.get(card.id));counts.historicalComparisons++;}
    else{
     history.set(card.id,identity);counts.appraisals++;counts.reads+=report.reads.length;
     for(const read of report.reads)counts[read.relation==='exact-value-match'?'exactMatches':read.relation==='value-mismatch'?'valueMismatches':'noPriorMutation']++;
    }
    joins.push({card:card.id,at:card.at,event:event.id,...identity,reads:report.reads});
   }
   assert.equal(sha(JSON.stringify(snapshot)),before,'Inspector mutated snapshot');
   prefixes.push({prefix:snapshot.prefix,stateHash:snapshot.stateHash,saveHash:snapshot.saveHash,outputsHash:snapshot.outputsHash,joins});counts.prefixes++;
  }while(await run.advance());
  const terminal=run.snapshot(),retained=language.results.find(r=>r.program===original.id);
  assert(terminal.complete);assert.equal(prefixes.length,original.prefixes.length);
  const bytes=fs.readFileSync(retained.file);assert.equal(sha(bytes),retained.sha256);
  assert.deepEqual(terminal.explanations,JSON.parse(bytes).explanations);
  const file=`program-${String(results.length).padStart(3,'0')}.json`;
  write(file,{program:original.id,cohort,prefixes});
  results.push({program:original.id,cohort,file,sha256:sha(fs.readFileSync(`${root}/${file}`)),prefixes:prefixes.length,appraisals:history.size});counts.roles++;
  console.log(`PASS AFFECT event corpus ${counts.roles}/105 ${original.id}: ${prefixes.length} prefixes`);
 }
 assert.equal(counts.roles,105);assert.equal(counts.prefixes,1436);assert.equal(counts.appraisals,1331);
 for(const s of [...sources,...references])assert.equal(sha(fs.readFileSync(s.path)),s.sha256,`Changed source ${s.path}`);
 write('receipt.json',{status:'PASS AFFECT EVENT CORPUS',counts,results,references,scope:'All 105 admitted main/supplementary roles and 1436 original prefixes. Exact native identities, original appraisal emitter and independently reversed prior-mutation lookup; prior event/history stability and input immutability. Value matches are recorded continuity, not necessity or complete causal provenance. Browser scope, player language and integrated entry remain separate.'});
 console.log(JSON.stringify(counts));
}catch(error){write('failure.json',{message:String(error),stack:error.stack,counts,completed:results});throw error;}
finally{await server.close();}
