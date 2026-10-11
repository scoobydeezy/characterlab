/** Read-only historical identity/graph reconstruction; no scheduler execution. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const read=p=>JSON.parse(fs.readFileSync(p)), sha=b=>createHash('sha256').update(b).digest('hex');
const fp=path=>({path,sha256:sha(fs.readFileSync(path))}), hex=b=>Buffer.from(b).toString('hex');
const root='docs/planning/', mainPath=root+'general-attention-public-comparisons-rev1/RESULTS.json', replayPath=root+'general-attention-public-replay-rev1/RESULTS.json';
const main=read(mainPath), replay=read(replayPath), byName=new Map(main.runs.map(r=>[r.name,r]));
const server=await createServer({configFile:false,server:{middlewareMode:true,ws:false},appType:'custom'});
try {
 const {decodeGeneralAttention:decode}=await server.ssrLoadModule('/src/campaign3/generalAttentionCodecs.ts');
 const {generalBindingContext}=await server.ssrLoadModule('/src/campaign3/generalBindingProfile.ts');
 const {canonicalEncode:enc,list,text}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {createComparisonCase,createExperimentIdentity,restoreModelIdentity,restoreRunIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const context=generalBindingContext(), unhex=s=>Uint8Array.from(Buffer.from(s,'hex')), field=(v,n)=>v.fields.get(BigInt(n));
 const experiment=await createExperimentIdentity('corpus/0.28.0','comparison/general-attention/0.1-candidate','harness/general-attention/0.1-candidate');
 assert.equal(hex(experiment.canonicalBytes),main.experimentIdentity);assert.equal(hex(experiment.digest),main.experimentDigest);
 for(const row of main.comparisons){
  const {canonicalHex,digest,...spec}=row;
  const pair=[spec.control,spec.candidate].map(n=>byName.get(n));assert(pair.every(Boolean));
  const models=await Promise.all(pair.map(r=>restoreModelIdentity(decode(unhex(r.modelIdentity),context))));
  const runs=await Promise.all(pair.map(r=>restoreRunIdentity(decode(unhex(r.runIdentity),context))));
  const c=await createComparisonCase(models,runs,list([text('deterministic; no random draws'),text(JSON.stringify(spec))]));
  assert.equal(hex(c.canonicalBytes),canonicalHex);assert.equal(hex(c.digest),digest);
 }
 for(const row of replay.runs){
  assert.equal(sha(fs.readFileSync(row.state.path)),row.state.sha256);
  const state=decode(fs.readFileSync(row.state.path),context);assert.equal(sha(enc(state)),row.hashes.state);
  const graph=field(state.items.find(r=>field(field(r,1),1).value===631n),2);
  assert.deepEqual({canonicalHex:hex(enc(graph)),digest:sha(enc(graph)),keys:field(graph,1).items.map(v=>hex(enc(v))),mass:field(graph,2).items.map(r=>field(r,1).items.map(n=>Number(n.value))),scale:100,lastUpdatedAt:String(field(graph,3).value)},row.graph);
  assert.deepEqual(read(root+'general-attention-public-replay-rev1/'+row.name+'.json'),row);
 }
 const paths=[...server.moduleGraph.idToModuleMap.values()].map(m=>m.file).filter(p=>p&&fs.existsSync(p)&&p.replaceAll('\\','/').includes('/src/'));
 const sources=[...new Set(paths)].sort().map(p=>fp(p.replaceAll('\\','/').replace(process.cwd().replaceAll('\\','/')+'/','')));
 const result={status:'PASS',scope:'Fresh reconstruction of committed identities and captured graph/state bytes only; no GA runtime, restore, tests or build rerun.',comparisons:36,experimentIdentities:1,capturedStates:10,originals:[fp(mainPath),fp(replayPath)],currentSources:sources,checker:fp('scripts/check-history-ga-public-identities.mjs')};
 const path=root+'campaign3-history-ga-public-rev1/identities.json';
 if(fs.existsSync(path))assert.deepEqual(read(path),result);else fs.writeFileSync(path,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({status:'PASS',comparisons:36,capturedStates:10,sourceFiles:sources.length}));
} finally {await server.close();}
