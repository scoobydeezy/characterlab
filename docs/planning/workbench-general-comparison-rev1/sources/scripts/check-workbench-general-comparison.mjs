import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-general-comparison-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const catalog=JSON.parse(fs.readFileSync('src/workbench/generalComparisonCatalog.json'));
const paths=['src/workbench/generalComparison.ts','src/workbench/generalComparisonCatalog.json','src/workbench/generalAdapter.ts','src/workbench/associationProjection.ts','src/workbench/nativeTimeline.ts','src/test/workbenchGeneralComparison.test.ts','scripts/build-workbench-general-comparisons.mjs','scripts/check-workbench-general-comparison.mjs',catalog.source.path,catalog.freeze.path,'docs/planning/workbench-general-cohort-rev1/model-00.json','docs/planning/workbench-general-cohort-rev1/model-01.json'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
assert.equal(sha(fs.readFileSync(catalog.source.path)),catalog.source.sha256);
assert.equal(sha(fs.readFileSync(catalog.freeze.path)),catalog.freeze.sha256);
const original=JSON.parse(fs.readFileSync(catalog.source.path)),freeze=JSON.parse(fs.readFileSync(catalog.freeze.path));
assert.equal(catalog.seed,freeze.seed);assert.equal(catalog.comparisons.length,36);assert.equal(catalog.models.length,43);
for(const [i,spec]of catalog.comparisons.entries()){
 const retained=original.comparisons[i];assert.equal(spec.id,`ga-pair-${String(i+1).padStart(2,'0')}`);
 for(const key of ['control','candidate','changed'])assert.deepEqual(spec[key],retained[key]);
 assert.equal(spec.originalComparisonDigest,sha(Buffer.from(retained.canonicalHex,'hex')));
 assert.equal(spec.originalComparisonDigest,retained.digest);
}
for(const m of catalog.models){const f=freeze.models.find(f=>f.name===m.recipe);assert(f);assert.equal(m.modelHash,sha(Buffer.from(f.modelIdentity,'hex')));assert.equal(m.runHash,sha(Buffer.from(f.runIdentity,'hex')));}
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {GeneralWorkbenchRun}=await server.ssrLoadModule('/src/workbench/generalAdapter.ts');
 const {compareGeneralSnapshots}=await server.ssrLoadModule('/src/workbench/generalComparison.ts');
 const spec=catalog.comparisons[0],a=await GeneralWorkbenchRun.create(spec.control,catalog.seed),b=await GeneralWorkbenchRun.create(spec.candidate,catalog.seed);
 const parity=[0,1].map(i=>JSON.parse(fs.readFileSync(paths[paths.length-2+i]))),captures=[];
 for(let prefix=0;prefix<=1;prefix++){
  const checkpoints=[a.checkpoint(),b.checkpoint()],snapshots=[a.snapshot(),b.snapshot()];
  for(const [i,s]of snapshots.entries()){assert.equal(s.recipe,parity[i].recipe);for(const key of ['prefix','clock','modelHash','runHash','stateHash','saveHash'])assert.equal(s[key],parity[i].prefixes[prefix][key]);}
  const report=compareGeneralSnapshots(spec.id,...snapshots);assert.equal(report.status,'ALIGNED_COMMITTED_INSTANT');
  assert.deepEqual(compareGeneralSnapshots(spec.id,...snapshots),report);assert.deepEqual([a.checkpoint(),b.checkpoint()],checkpoints);
  const path=`prefix-${prefix}.json`;fs.writeFileSync(root+'/'+path,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  captures.push({path,sha256:sha(fs.readFileSync(root+'/'+path)),prefix,fields:report.fields.length,eventSlots:report.events.length,graphCells:report.graph.status==='IDENTITY_ALIGNED'?report.graph.cells.length:0});
  if(prefix===0){await a.advance();await b.advance();}
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED GENERAL COMPARISON FOUNDATION',sources,captures,counts:{retainedDeclarations:36,frozenModelIdentities:43,executedPairs:1,comparedPrefixes:2},scope:'Historical declaration/identity join and baseline versus Independent1/1 prefixes0/1 only. Each current snapshot matches its completed per-model native parity artifact; the enclosing43-model audit is still in progress. Repeated detached comparisons are identical and leave both checkpoints unchanged. Guard tests cover unequal horizons, wrong run identity, draw rejection, missing cells, identity ordering and ambiguous/missing event slots. No all36 current execution, full-horizon causal finding, browser comparison, language, RNG address coupling or Campaign4 entry acceptance.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS36 declarations/43 identities;1 pair/2 prefixes; repeated observer-safe comparison');
}finally{await server.close();}
