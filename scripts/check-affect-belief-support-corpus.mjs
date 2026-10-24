import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-affect-belief-support-corpus-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
fs.mkdirSync(root);const write=(p,v)=>fs.writeFileSync(root+'/'+p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const refs=['docs/planning/workbench-affect-parity-rev1/receipt.json','docs/planning/workbench-affect-supplements-rev1/receipt.json','docs/planning/workbench-batch-parity-rev8/manifest.json'];
const [main,supp,batch]=refs.map(read);
const paths=[...new Set([...batch.sources.map(s=>s.path),...['affectBeliefStateProjection.ts','affectBeliefSupport.ts','AffectBeliefSupportPanel.tsx','AffectBeliefStateView.tsx','affectProfileSources.json'].map(p=>'src/workbench/'+p),'scripts/check-affect-belief-support-corpus.mjs'])];
const sources=paths.map(path=>{const b=fs.readFileSync(path),old=batch.sources.find(s=>s.path===path);if(old)assert.equal(sha(b),old.sha256,path);const copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return{path,copy,sha256:sha(b)};});
write('freeze.json',{sources,references:refs.map(path=>({path,sha256:sha(fs.readFileSync(path))})),target:{programs:105,prefixes:1436}});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const results=[],counts={programs:0,prefixes:0,revisions:0,historyChecks:0,supports:0,unavailableApplications:0,multipleApplications:0,applicationJoins:0,unavailableObservations:0,multipleObservations:0,observationJoins:0};
try{
 const load=p=>server.ssrLoadModule('/src/workbench/'+p),{AffectWorkbenchRun}=await load('affectAdapter.ts'),{AffectSupplementRun}=await load('affectSupplementAdapter.ts'),{affectBeliefStateProjection:state}=await load('affectBeliefStateProjection.ts'),{affectBeliefSupport:project}=await load('affectBeliefSupport.ts');
 for(const [prior,Adapter] of [[main,AffectWorkbenchRun],[supp,AffectSupplementRun]])for(const original of prior.results){
  const run=await Adapter.create(original.id),history=new Map(),prefixes=[];
  do{
   const s=run.snapshot(),before=sha(JSON.stringify(s)),o=original.prefixes[s.prefix];for(const key of ['stateHash','saveHash','outputsHash'])assert.equal(s[key],o[key]);
   const reports=state(s).history.map(revision=>{
    const report=project(s,revision.eventId),key=revision.eventId??'initial';assert.deepEqual(report.rows.map(r=>({path:r.path,exact:r.exact})),revision.vector.map(r=>({path:r.path,exact:r.exact})));
    if(history.has(key)){assert.deepEqual(report.rows,history.get(key));counts.historyChecks++;}else history.set(key,report.rows);
    for(const row of report.rows)for(const support of row.support){counts.supports++;if(!support.sources.length)counts.unavailableApplications++;if(support.sources.length>1)counts.multipleApplications++;
     for(const source of support.sources){const e=s.timeline.find(e=>e.id===source.eventId);assert(e&&e.stage==='apply');assert(BigInt(e.instant)<=BigInt(report.at));assert(JSON.parse(e.output).some(v=>JSON.stringify(v)===JSON.stringify(source.application)));assert.equal(source.application['Applied [5]'],true);counts.applicationJoins++;
      if(!source.observations.length)counts.unavailableObservations++;if(source.observations.length>1)counts.multipleObservations++;
      for(const observation of source.observations){const emitted=s.timeline.find(e=>e.id===observation.eventId);assert(emitted&&emitted.stage==='observe');assert(s.timeline.indexOf(emitted)<s.timeline.indexOf(e));assert(JSON.parse(emitted.output).some(v=>JSON.stringify(v)===JSON.stringify(observation.observation)));counts.observationJoins++;}
     }
    }
    counts.revisions++;return report;
   });
   assert.equal(sha(JSON.stringify(s)),before);prefixes.push({prefix:s.prefix,identities:{stateHash:s.stateHash,saveHash:s.saveHash,outputsHash:s.outputsHash},reports});counts.prefixes++;
  }while(await run.advance());
  assert(run.snapshot().complete);assert.equal(prefixes.length,original.prefixes.length);const file=`program-${String(results.length).padStart(3,'0')}.json`;write(file,{program:original.id,prefixes});results.push({program:original.id,file,sha256:sha(fs.readFileSync(root+'/'+file))});counts.programs++;console.log(`PASS support corpus ${counts.programs}/105 ${original.id}`);
 }
 assert.equal(counts.programs,105);assert.equal(counts.prefixes,1436);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 write('receipt.json',{status:'PASS FULL ORIGINAL AFFECT RECORDED SUPPORT CORPUS',counts,results,scope:'All original105 programs/1436 prefixes; exact registered stored revision values, application/observation native output joins, chronology and immutable historical support. Counters include cumulative historical revisions. No complete conditional-episode ancestry, player disclosure, psychological causality or full-entry claim.'});
}catch(error){write('failure.json',{error:String(error),stack:error.stack,counts,results});throw error;}finally{await server.close();}
