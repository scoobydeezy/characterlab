/** Independent public replay and exact graph capture for the frozen cohort.
 * These runs add no model, source intervention or inference authority. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const folder='docs/planning/general-attention-public-replay-rev1';
assert(!fs.existsSync(folder));fs.mkdirSync(folder);
const freezePath='docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
const freeze=JSON.parse(fs.readFileSync(freezePath));
const digest=b=>createHash('sha256').update(b).digest('hex');
const fp=path=>({path,sha256:digest(fs.readFileSync(path))});
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try {
 const api=await server.ssrLoadModule('/src/campaign3/generalFactory.ts');
 const {decodeGeneralAttention:decode}=await server.ssrLoadModule('/src/campaign3/generalAttentionCodecs.ts');
 const {generalBindingContext}=await server.ssrLoadModule('/src/campaign3/generalBindingProfile.ts');
 const {canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const context=generalBindingContext(),seed=Uint8Array.from(Buffer.from(freeze.seed,'hex'));
 const field=(v,n)=>v.fields.get(BigInt(n)),rows=[],yieldWorker=()=>new Promise(resolve=>setTimeout(resolve,0));
 const names=[...freeze.models.filter(m=>m.name.startsWith('footprint-')).map(m=>m.name),'source-consequence-lane','credit-significance-first'];
 for(const name of names){
  const source=api.generalAttentionModelSource(name),token=await api.prepareGeneralAttentionModel(source);
  const inputs={initialState:api.generalAttentionInitialState(token),orderedInputs:api.generalAttentionOrderedInputs(token),runSeed:seed};
  const run=await api.createGeneralAttentionRun(token,inputs);
  const checkpoint=name==='credit-significance-first'?37n:name==='source-consequence-lane'?6n:null;
  let restored,prefixHash,continuations=0;
  while(await run.settleNextInstant()){
   if(checkpoint!==null){
    if(restored){assert(await restored.settleNextInstant());assert.equal(digest(restored.save()),digest(run.save()));continuations++;}
    else if(run.snapshot().clock===checkpoint){
     const save=run.save();prefixHash=digest(save);
     restored=await api.restoreGeneralAttentionRun(source,{initialState:inputs.initialState,orderedInputs:inputs.orderedInputs,save});
     assert.equal(digest(restored.save()),prefixHash);
    }
   }
   await yieldWorker();
  }
  if(checkpoint!==null){assert(restored);assert.equal(await restored.settleNextInstant(),false);assert(continuations>0);}
  const snapshot=run.snapshot(),state=decode(snapshot.state,context),graph=field(state.items.find(row=>field(field(row,1),1).value===631n),2);
  const statePath=folder+'/'+name+'.state.cenc';fs.writeFileSync(statePath,snapshot.state);
  const item={name,modelIdentity:Buffer.from(api.generalAttentionModelIdentity(token)).toString('hex'),runIdentity:Buffer.from(run.runIdentity()).toString('hex'),finalClock:String(snapshot.clock),state:fp(statePath),hashes:{state:digest(snapshot.state),outputs:digest(snapshot.outputs),trace:digest(snapshot.trace),save:digest(run.save())},graph:{canonicalHex:Buffer.from(enc(graph)).toString('hex'),digest:digest(enc(graph)),keys:field(graph,1).items.map(v=>Buffer.from(enc(v)).toString('hex')),mass:field(graph,2).items.map(row=>field(row,1).items.map(n=>Number(n.value))),scale:100,lastUpdatedAt:String(field(graph,3).value)},replay:checkpoint===null?null:{checkpoint:String(checkpoint),prefixHash,continuations,allCompleteSavesEqual:true}};
  fs.writeFileSync(folder+'/'+name+'.json',JSON.stringify(item,null,2)+'\n');rows.push(item);console.log(JSON.stringify({completed:rows.length,total:names.length,name,replayed:!!restored}));
 }
 fs.writeFileSync(folder+'/RESULTS.json',JSON.stringify({status:'PUBLIC REEXECUTION AND COMPLETE-PREFIX REPLAY PASS',freeze:fp(freezePath),runs:rows,script:fp('scripts/qualify-general-attention-public-replay.mjs')},null,2)+'\n');
}finally{await server.close();}
