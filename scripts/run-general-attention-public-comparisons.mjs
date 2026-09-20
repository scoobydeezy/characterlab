/** Actual frozen public executions; deterministic summaries never replace input
 * authority. Per-run hashes bind complete canonical outputs/state/trace/save. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const folder='docs/planning/general-attention-public-comparisons-rev1';assert(!fs.existsSync(folder));fs.mkdirSync(folder);
const freezePath='docs/planning/campaign3-general-attention-model-rev2/FREEZE.json',freeze=JSON.parse(fs.readFileSync(freezePath));
const digest=b=>createHash('sha256').update(b).digest('hex'),fp=p=>({path:p,sha256:digest(fs.readFileSync(p))}),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const api=await server.ssrLoadModule('/src/campaign3/generalFactory.ts');
 const {decodeGeneralAttention}=await server.ssrLoadModule('/src/campaign3/generalAttentionCodecs.ts'),{generalBindingContext}=await server.ssrLoadModule('/src/campaign3/generalBindingProfile.ts');
 const {canonicalEncode:enc,list,text}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {createExperimentIdentity,createComparisonCase,restoreModelIdentity,restoreRunIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const decode=b=>decodeGeneralAttention(b,generalBindingContext()),f=(r,n)=>{assert.equal(r.kind,'record');assert(r.fields.has(BigInt(n)));return r.fields.get(BigInt(n));},seq=v=>{assert(['set','list'].includes(v.kind));return v.items;},num=v=>{assert(['unsigned','signed'].includes(v.kind));return v.value;},id=v=>String(v.payload.value),q=v=>{assert.equal(v.kind,'rational');return v.numerator+'/'+v.denominator;};
 const seed=Uint8Array.from(Buffer.from(freeze.seed,'hex')),runs=[];
 function recordTypes(value,found=new Set()){
  if(typeof value==='boolean')return found;if(value.kind==='record'){found.add(Number(value.schema.typeId));for(const v of value.fields.values())recordTypes(v,found);}else if(value.kind==='list'||value.kind==='set')value.items.forEach(v=>recordTypes(v,found));else if(value.kind==='map')for(const [k,v]of value.entries){recordTypes(k,found);recordTypes(v,found);}return found;
 }
 for(const image of freeze.models){
  const source=api.generalAttentionModelSource(image.name),model=await api.prepareGeneralAttentionModel(source),initialState=api.generalAttentionInitialState(model),orderedInputs=api.generalAttentionOrderedInputs(model);
  const run=await api.createGeneralAttentionRun(model,{initialState,orderedInputs,runSeed:seed});let instants=0;
  while(await run.settleNextInstant()){instants++;await new Promise(resolve=>setTimeout(resolve,0));}
  const snapshot=run.snapshot(),outputs=seq(decode(snapshot.outputs)),trace=seq(decode(snapshot.trace)),state=seq(decode(snapshot.state)),save=run.save();
  assert.equal(hex(api.generalAttentionModelIdentity(model)),image.modelIdentity);assert.equal(hex(run.runIdentity()),image.runIdentity);
  const byType=type=>outputs.filter(v=>v.kind==='record'&&v.schema.typeId===BigInt(type));
  const acquireAt=new Map(byType(549).map(v=>[id(f(v,1)),String(num(f(v,3)))]));
  const candidates=byType(621).map(v=>({at:String(num(f(v,3))),units:seq(f(v,5)).map(child=>{const unit=f(child,1),factors=f(unit,4);return {roles:seq(f(unit,3)).map(claim=>id(f(claim,6))).sort(),base:q(f(factors,1)),role:q(f(factors,2)),attention:q(f(factors,3)),raw:q(f(factors,4)),strength:q(f(unit,5))};})}));
  const ranks=[...byType(592),...byType(643).map(v=>f(v,1))].map(v=>({at:String(num(f(v,3))),scores:seq(f(v,5)).map(row=>({acquisition:id(f(row,1)),acquiredAt:acquireAt.get(id(f(row,1))),base:q(f(row,2)),pull:q(f(row,3)),score:q(f(row,4))})),winners:seq(f(v,6)).map(w=>id(f(f(w,1),1)))}));
  const leaf=root=>{const row=state.find(v=>num(f(f(v,1),1))===BigInt(root));return row?f(row,2):undefined;};
  const memory=leaf(630),acquisitions=seq(f(memory,1)),children=acquisitions.flatMap(a=>{const content=f(a,6);return seq(f(content,content.schema.typeId===552n?2:1));});
  const finalMemory={acquisitions:acquisitions.length,usedChildren:children.filter(c=>f(c,2)===true).length,significantChildren:children.filter(c=>seq(f(c,3)).length).length,lateAcquisitions:acquisitions.filter(a=>num(f(a,3))>=40n).length,digest:digest(enc(memory))};
  const history=seq(f(leaf(632),1)).map(v=>({acquisition:id(f(v,1)),acquiredAt:acquireAt.get(id(f(v,1))),presentations:seq(f(v,2)).map(v=>String(num(v)))}));
  const work=new Map(),stageCounts=new Map(),readRoots=new Map();const flattened=[];
  for(const row of trace){assert.equal(row.schema.typeId,160n);const event=f(row,4),at=String(num(f(event,2))),stage=id(f(event,5));work.set(at,(work.get(at)??0)+1);stageCounts.set(stage,(stageCounts.get(stage)??0)+1);flattened.push(...seq(f(row,13)));
   for(const read of seq(f(row,11))){const root=Number(num(f(f(read,2),1)));assert.notEqual(root,581);if(root===649)assert(stage.endsWith('-sample')||stage.endsWith('-replenishment'));readRoots.set(root,(readRoots.get(root)??0)+1);}
  }
  assert.equal(digest(enc(list(flattened))),digest(snapshot.outputs));assert(Math.max(...work.values())<=92);
  for(const value of [...byType(549),...byType(590),...byType(621)])for(const type of recordTypes(value))assert(![200,210,211,334,454,649,652,658,659,660].includes(type),'hidden source record in character evidence');
  const definitions=seq(decode(source.definitions)),policy=f(definitions.find(v=>id(f(v,1))==='definition/general-attention/visual-selection'),4),algorithm=Number(num(f(policy,1))),capacity=Number(num(f(policy,2)));
  const selected=byType(615).map(v=>seq(f(f(v,1),4)).length);if(algorithm!==3)assert(selected.every(n=>n<=capacity));
  const summary={name:image.name,modelIdentity:image.modelIdentity,runIdentity:image.runIdentity,instants,finalClock:String(snapshot.clock),events:trace.length,outputs:outputs.length,maximumInstantWork:Math.max(...work.values()),stageCounts:Object.fromEntries(stageCounts),readRoots:Object.fromEntries(readRoots),selected:{algorithm,capacity,counts:selected},candidates,ranks,history,graphDigest:digest(enc(leaf(631))),finalMemory,attribution:byType(575).map(v=>({disposition:String(num(f(v,7))),consumed:seq(f(v,8)).length,targets:seq(f(v,9)).length})),modulations:[...byType(641),...byType(643)].map(v=>{const m=f(v,3);return {source:String(num(f(m,1))),branch:String(num(f(m,2))),residual:q(f(m,3)),omega:q(f(m,4))};}),hashes:{initial:digest(initialState),originals:digest(orderedInputs),state:digest(snapshot.state),outputs:digest(snapshot.outputs),trace:digest(snapshot.trace),save:digest(save)}};
  const filename=folder+'/'+String(runs.length).padStart(2,'0')+'.json';fs.writeFileSync(filename,JSON.stringify(summary,null,2)+'\n');runs.push({name:image.name,file:fp(filename),modelIdentity:image.modelIdentity,runIdentity:image.runIdentity});console.log(JSON.stringify({completed:runs.length,total:freeze.models.length,name:image.name,events:trace.length}));
 }
 const proposed=JSON.parse(fs.readFileSync('docs/planning/GA_COHORT_SOURCE_RECONCILIATION_REV1.json')).comparisons.filter(c=>runs.some(r=>r.name===c.control)&&runs.some(r=>r.name===c.candidate));
 for(const law of ['Independent','HistoricalShared','HistoricalHybrid','RetiredFlat'])proposed.push({control:'footprint-'+law+'-sparse',candidate:'footprint-'+law+'-dense',changed:['permitted nonfocal participant count'],alignment:'same focal Actor role/position and later cue; opaque occurrence IDs remain trace-side'});
 for(const name of ['credit-use-only','credit-shared-protection','credit-significance-first'])proposed.push({control:'credit-age-only',candidate:name,changed:['retention policy']});
 const experiment=await createExperimentIdentity('corpus/0.28.0','comparison/general-attention/0.1-candidate','harness/general-attention/0.1-candidate'),comparisons=[];
 for(const spec of proposed){const pair=[spec.control,spec.candidate].map(name=>runs.find(r=>r.name===name)),models=await Promise.all(pair.map(r=>restoreModelIdentity(decode(Uint8Array.from(Buffer.from(r.modelIdentity,'hex')))))),identities=await Promise.all(pair.map(r=>restoreRunIdentity(decode(Uint8Array.from(Buffer.from(r.runIdentity,'hex'))))));
  const coupling=list([text('deterministic; no random draws'),text(JSON.stringify(spec))]);const comparison=await createComparisonCase(models,identities,coupling);comparisons.push({...spec,canonicalHex:hex(comparison.canonicalBytes),digest:hex(comparison.digest)});
 }
 const receipt={status:'ACTUAL FROZEN PUBLIC RUNS COMPLETE; VERDICT REVIEW PENDING',corpusVersion:'corpus/0.28.0',experimentIdentity:hex(experiment.canonicalBytes),experimentDigest:hex(experiment.digest),seed:freeze.seed,freeze:fp(freezePath),runs,comparisons,script:fp('scripts/run-general-attention-public-comparisons.mjs'),limits:['No RNG draws in this finite source cohort.','Current visual baseline stages are replaced by explicit delivered-feedback stages; consequence baseline stages execute separately.','Role and spatial controls remain distinct; missing facets are public exclusions.','No general Affect, Need, surprise or causal-truth recognition is claimed.'],counters:{highestAllocated:706,allocatedSinceVerdictOrCorpusMember:0}};
 fs.writeFileSync(folder+'/RESULTS.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({status:receipt.status,runs:runs.length,comparisons:comparisons.length}));
}finally{await server.close();}
