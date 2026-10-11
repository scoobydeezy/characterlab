// Reconstruct frozen source graphs and commitments; never execute a continuation.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',out=p+'campaign3-history-defining-plans-rev1/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),keys=(v,s)=>assert.deepEqual(Object.keys(v).sort(),s.split(' ').sort());
const trainingPath=p+'DEFINING_MEMORY_TRAINING_REV1.json',training=read(trainingPath),server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
try{
 const ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{generalCandidateVersions:versions}=await server.ssrLoadModule('/src/campaign3/generalModelCandidate.ts');
 const definitions=[{lane:'MEMORY',version:'defining-memory-experiment/0.1-candidate',harness:'defining-memory-harness/0.1',module:'definingMemoryExperiment',fn:'definingCases',roots:['src/campaign3/definingMemoryExperiment.ts','src/campaign3/generalFactory.ts','src/test/definingMemoryExperiment.test.ts'],extra:['docs/formal/DEFINING_MEMORY_EXPERIMENT_CONTRACT.md','scripts/qualify-defining-memory.mjs','scripts/acquire-defining-memory-training.mjs'],registry:'unchanged inherited components; no allocations',coupling:'Matched acquired history; four retention laws, admission/capacity/time/cue interventions. Component continuation only.',count:288},{lane:'MEANING',version:'defining-meaning/0.1-candidate',harness:'defining-meaning-harness/0.1',module:'definingMeaning',fn:'definingMeaningCases',roots:['src/campaign3/definingMeaning.ts','src/test/definingMeaning.test.ts'],extra:['docs/formal/DEFINING_MEANING_CONTRACT.md','scripts/qualify-defining-meaning.mjs'],registry:'Inherited kernels; actual GA37 acquired evidence; no allocations',coupling:'Same acquired content with independently adopted High/Low/Wide/Absent goals; actual presentation/use; later report versus hidden truth; unchanged retention/access comparators.',count:68}];
 const records=[];
 for(const d of definitions){
  const file=p+`DEFINING_${d.lane}_PLAN_REV1.json`,v=read(file);keys(v,'status artifacts trainingSha256 models runs experimentIdentity comparisonCase');assert.equal(v.trainingSha256,sha(trainingPath));
  const graph=new Set();function visit(file){file=file.replaceAll('\\','/');if(graph.has(file))return;graph.add(file);if(!file.endsWith('.ts'))return;for(const m of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const base=path.resolve(path.dirname(file),m[1].split('?')[0]),found=[base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());assert(found);visit(path.relative(process.cwd(),found));}}
  d.roots.forEach(visit);d.extra.forEach(f=>graph.add(f));const artifacts=[...graph].sort().map(path=>({path,sha256:sha(path)}));assert.deepEqual(v.artifacts,artifacts);
  const mod=await server.ssrLoadModule('/src/campaign3/'+d.module+'.ts'),specs=mod[d.fn]();assert.equal(specs.length,d.count);assert.equal(v.runs.length,d.count);assert.equal(v.models.length,4);
  const models=[];for(const [i,law]of ['SignificanceFirst','SharedProtection','UseOnly','AgeOnly'].entries()){
   keys(v.models[i],'law modelIdentity');assert.equal(v.models[i].law,law);
   const m=await ids.createModelIdentity({...versions,rulesVersion:d.version,contentManifest:await ids.commitManifest(c.text(JSON.stringify(artifacts))),registryManifest:await ids.commitManifest(c.text(d.registry)),parameterSet:await ids.commitManifest(c.text(law))});assert.equal(hex(m.canonicalBytes),v.models[i].modelIdentity);models.push(m);
  }
  const runs=[];for(const[i,s]of specs.entries()){
   const r=v.runs[i];keys(r,'index spec runIdentity');assert.equal(r.index,i);assert.deepEqual(r.spec,s);
   const m=models[['SignificanceFirst','SharedProtection','UseOnly','AgeOnly'].indexOf(s.law)];
   const initial=d.lane==='MEMORY'?training.snapshots[s.admit?1:0].state:JSON.stringify(training.snapshots[0]);
   const run=await ids.createRunIdentity({modelIdentity:m,initialState:await ids.commitManifest(c.text(initial)),orderedInputSequence:await ids.commitManifest(c.text(JSON.stringify(s))),runSeed:new Uint8Array(Buffer.from(training.seed,'hex'))});assert.equal(hex(run.canonicalBytes),r.runIdentity);runs.push(run);
  }
  assert.equal(hex((await ids.createExperimentIdentity('corpus/0.29.0',d.version,d.harness)).canonicalBytes),v.experimentIdentity);assert.equal(hex((await ids.createComparisonCase(models,runs,c.text(d.coupling))).canonicalBytes),v.comparisonCase);
  records.push({path:file,sha256:sha(file),models:4,runs:runs.length,artifactBindings:artifacts.length,coupling:d.coupling,initialCommitment:d.lane==='MEMORY'?'Canonical text of selected37/38 state hex':'Canonical text of JSON.stringify complete37 snapshot'});
 }
 const result={status:'TWO COMPONENT PLAN GRAPHS RECONSTRUCTED',records,training:{path:trainingPath,sha256:sha(trainingPath)},scope:'Exact original source graph, model/run/experiment/comparison commitments and roster. Component initial commitments are canonical text manifests, not native Save132 state admission. No continuation executed; freeze declarations do not prove independent timestamps.',checkerSha256:sha('scripts/check-history-defining-plans.mjs')};
 fs.mkdirSync(out,{recursive:true});const file=out+'canonical-check.json';if(fs.existsSync(file))assert.deepEqual(read(file),result);else fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(result.status);
}finally{await server.close();}
