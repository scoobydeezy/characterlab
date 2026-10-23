import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-affect-pair-horizons-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const write=(name,value)=>fs.writeFileSync(root+'/'+name,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const references=['docs/planning/workbench-affect-event-corpus-rev2/freeze.json','docs/planning/workbench-affect-retained-pair-rev1/freeze.json','docs/planning/workbench-affect-parity-rev1/receipt.json','docs/planning/workbench-affect-supplements-rev1/receipt.json'].map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const sourceMap=new Map();for(const r of references.slice(0,2))for(const s of JSON.parse(fs.readFileSync(r.path)).sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);sourceMap.set(s.path,s);}
for(const path of ['src/workbench/affectAppraisalComparison.ts','src/workbench/affectFactorProjection.ts','scripts/check-affect-pair-horizons.mjs']){const bytes=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});sourceMap.set(path,{path,copy,sha256:sha(bytes)});}
const sources=[...sourceMap.values()];write('freeze.json',{sources,references,target:'Eight complete declared original pairs, every prefix, terminal restore and no-op continuation'});
const originals=references.slice(2).flatMap(r=>JSON.parse(fs.readFileSync(r.path)).results),results=[];
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {AffectPairSession}=await server.ssrLoadModule('/src/workbench/affectPairSession.ts'),{createAffectInspection,restoreAffectInspection}=await server.ssrLoadModule('/src/workbench/affectSession.ts'),{AFFECT_CONTRASTS,summarizeAffectComparison}=await server.ssrLoadModule('/src/workbench/affectComparison.ts'),{compareAffectAppraisals}=await server.ssrLoadModule('/src/workbench/affectAppraisalComparison.ts');
 const factory={create:createAffectInspection,restore:restoreAffectInspection};
 for(const spec of AFFECT_CONTRASTS){
  const pair=await AffectPairSession.create(spec.id,factory),prefixes=[],history={a:[],b:[]};let historicalChecks=0;
  do{
   const view=pair.snapshot(),r=view.comparison;assert.equal(view.failure,null);assert(r.aligned);
   for(const branch of ['a','b']){const s=r[branch],p=originals.find(o=>o.id===s.program).prefixes[s.prefix];assert(p);for(const k of ['stateHash','outputsHash','saveHash'])assert.equal(s[k],p[k]);
    for(const old of history[branch]){assert.equal(sha(JSON.stringify(s.timeline.slice(0,old.events))),old.eventsHash);assert.equal(sha(JSON.stringify(s.explanations.slice(0,old.cards))),old.cardsHash);historicalChecks++;}
    history[branch].push({events:s.timeline.length,eventsHash:sha(JSON.stringify(s.timeline)),cards:s.explanations.length,cardsHash:sha(JSON.stringify(s.explanations))});
   }
   prefixes.push({prefix:r.a.prefix,summary:summarizeAffectComparison(r),appraisals:compareAffectAppraisals(r.a.explanations,r.b.explanations)});
  }while(await pair.advance());
  const terminal=pair.snapshot();assert(terminal.comparison.a.complete&&terminal.comparison.b.complete);
  for(const branch of ['a','b'])assert.equal(prefixes.length,originals.find(o=>o.id===terminal.comparison[branch].program).prefixes.length);
  const checkpoint=await pair.checkpoint(),restored=await AffectPairSession.restore(checkpoint,factory);assert.deepEqual(restored.snapshot(),terminal);assert.deepEqual(await restored.checkpoint(),checkpoint);assert.equal(await restored.advance(),false);assert.deepEqual(restored.snapshot(),terminal);
  const file=`pair-${results.length}.json`;write(file,{contrast:spec.id,prefixes,historicalChecks,terminalRestore:true,terminalAdvanceMoved:false,checkpointHash:sha(JSON.stringify(checkpoint))});results.push({contrast:spec.id,file,sha256:sha(fs.readFileSync(root+'/'+file)),prefixes:prefixes.length,historicalChecks});pair.dispose();restored.dispose();console.log(`PASS AFFECT pair horizon ${results.length}/8 ${spec.id} ${prefixes.length} prefixes + terminal restore`);
 }
 assert.equal(results.length,8);for(const s of [...sources,...references])assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 write('receipt.json',{status:'PASS ALL EIGHT AFFECT PAIR NATIVE HORIZONS',results,pairPrefixes:results.reduce((n,r)=>n+r.prefixes,0),historicalChecks:results.reduce((n,r)=>n+r.historicalChecks,0),scope:'Every declared original pair, exact original prefix state/save/output hashes, stable event/explanation history, terminal authenticated paired restore and no-op continuation. Browser horizons, player disclosure and integrated entry remain separate.'});
}catch(error){write('failure.json',{message:String(error),stack:error.stack,completed:results});throw error;}finally{await server.close();}
