import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-long-goal-comparison-rev1',oldRoot='docs/planning/longitudinal-goal-execution-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),planPath='docs/planning/LONGITUDINAL_GOAL_PLAN_REV1.json',plan=JSON.parse(fs.readFileSync(planPath)),planHash=sha(fs.readFileSync(planPath));
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const paths=[planPath,'src/workbench/longGoalComparison.ts','src/workbench/canonical.ts','src/test/workbenchLongGoalComparison.test.ts','scripts/check-workbench-long-goal-comparison.mjs','src/campaign3/receivingCodecs.ts'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'}),cases=[],snapshots=[],pairs=[];
try{
 const {decodeReceiving}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts'),{LONG_GOAL_COMPARISONS,compareLongGoalSnapshots}=await server.ssrLoadModule('/src/workbench/longGoalComparison.ts');
 for(const [index,p]of plan.runs.entries()){
  const stem=String(index).padStart(3,'0'),path=oldRoot+'/'+stem+'.json',archivePath=oldRoot+'/'+stem+'.saves.gz',oldBytes=fs.readFileSync(path),old=JSON.parse(oldBytes),archive=fs.readFileSync(archivePath);
  assert.equal(old.planSha256,planHash);assert.equal(old.runIdentity,p.runIdentity);assert.equal(old.modelIdentity,p.modelIdentity);assert.equal(sha(archive),old.saveArchiveSha256);
  const saves=JSON.parse(gunzipSync(archive)).map(s=>Buffer.from(s,'base64'));assert.equal(saves.length,17);assert.deepEqual(saves.map(sha),old.prefixHashes);
  snapshots[index]=saves.map((save,prefix)=>{
   const value=decodeReceiving(save);assert.equal(value.kind,'text');const saved=JSON.parse(value.value);assert.equal(saved.version,'longitudinal-goal-component/0.1-candidate');for(const key of ['law','mode','seed','keepEpisodes'])assert.equal(saved[key],p[key]);assert.equal(saved.prefix,prefix);assert.equal(sha(Buffer.from(saved.native,'hex')),old.nativeHashes[prefix]);
   const state={prefix,actor:old.state.actor,goals:saved.goals,rows:saved.rows};if(prefix===16)assert.deepEqual(state,old.state);
   return{index,law:p.law,mode:p.mode,seed:p.seed,keepEpisodes:p.keepEpisodes,seamVersion:saved.version,boundary:'native-source-plus-component-receiver',prefix,complete:prefix===16,modelHash:sha(Buffer.from(p.modelIdentity,'hex')),runHash:sha(Buffer.from(p.runIdentity,'hex')),saveHash:old.prefixHashes[prefix],nativeSaveHash:old.nativeHashes[prefix],state,scope:'Authenticated historical save projection; current adapter parity is a separate audit'};
  });
  cases.push({index,path,sha256:sha(oldBytes),archivePath,archiveSha256:sha(archive),prefixes:17});
 }
 assert.equal(LONG_GOAL_COMPARISONS.length,120);let probabilityDifferences=0,actionDifferences=0;
 for(const [index,spec]of LONG_GOAL_COMPARISONS.entries()){
  const reports=[];
  for(let prefix=0;prefix<=16;prefix++){
   const a=snapshots[spec.control][prefix],b=snapshots[spec.candidate][prefix],before=JSON.stringify([a,b]),r=await compareLongGoalSnapshots(spec.id,a,b);assert.equal(r.status,'ALIGNED_COMPONENT_PREFIX');assert.deepEqual(await compareLongGoalSnapshots(spec.id,a,b),r);assert.equal(JSON.stringify([a,b]),before);assert.equal(r.fields.length,12);
   for(const field of r.fields)assert.equal(field.equal,field.control===field.candidate);
   assert.deepEqual(r.rng.controlDraws,a.state.rows.map(row=>({at:row.at,draws:row.choice.draws})));assert.deepEqual(r.rng.candidateDraws,b.state.rows.map(row=>({at:row.at,draws:row.choice.draws})));
   reports.push(r);
  }
  const last=reports[16],equal=name=>last.fields.find(f=>f.name===name).equal;
  if(spec.id.startsWith('feedback:')){probabilityDifferences+=!equal('probabilities');actionDifferences+=!equal('actions');assert(last.identity.nativeSaveEqual);}
  if(spec.id.startsWith('coarse:')||spec.id.startsWith('retention:')){assert(equal('probabilities'));assert(equal('actions'));}
  if(spec.id.startsWith('lifecycle:')){assert(last.identity.nativeSaveEqual);assert(equal('standing'));assert(!equal('goalLedger'));assert(!equal('actions'));}
  if(spec.id.startsWith('opportunity-withdrawn:')){assert(equal('goalLifecycle'));assert(equal('probabilities'));assert(equal('actions'));}
  const decoded=Buffer.from(JSON.stringify(reports)+'\n'),bytes=gzipSync(decoded,{level:9}),path=`pair-${String(index).padStart(3,'0')}.json.gz`;assert(gunzipSync(bytes).equals(decoded));assert(bytes.length<50_000_000);fs.writeFileSync(root+'/'+path,bytes,{flag:'wx'});pairs.push({id:spec.id,path,sha256:sha(bytes),decodedSha256:sha(decoded),prefixes:17});
 }
 assert.equal(probabilityDifferences,18);assert.equal(actionDifferences,14);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS HISTORICAL LONG GOAL COMPARISON PROJECTION',sources,cases,pairs,counts:{cases:120,comparisons:120,alignedPrefixes:2040,probabilityDifferences,actionDifferences},scope:'All declared pairs at every original saved prefix, authenticated to historical archive/save/native-source hashes. Preserves 18/24 fine probability and14/24 action differences, coarse equalities, retention equalities and lifecycle distinctions. This qualifies projection of preserved original saves; current native adapter replay audit, browser comparisons, pair persistence and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});console.log('PASS historical LONG goal comparison projection:120 pairs/2040 prefixes');
}finally{await server.close();}
