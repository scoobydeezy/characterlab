// Complete data images and adversarial declaration review; no frozen runtime model.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
import {embodiedDeclarationTools} from './embodied-declaration-tools.mjs';
const folder='docs/planning/campaign3-embodied-model-review';assert(!fs.existsSync(folder));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const t=await embodiedDeclarationTools(server),{compileEmbodiedModel}=await server.ssrLoadModule('/src/campaign3/embodiedModel.ts');
 const {AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {commitManifest,createRunIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const {compileCognitiveModel}=await server.ssrLoadModule('/src/campaign2/cognitiveModel.ts');
 const {canonicalEncode:enc,list,set,record,signed:i,unsigned:u,rational:q,text}=t.c;
 const files=new Map(),models=[],compiled=new Map(),checks=[];
 const hex=bytes=>Buffer.from(bytes).toString('hex');
 for(const name of t.models){const source=t.source(name),model=await compileEmbodiedModel(source);compiled.set(name,model);
  for(const field of ['content','registry','parameters'])files.set(`${name}/${field}.cenc.hex`,hex(source[field])+'\n');
  files.set(`${name}/model-identity.cenc.hex`,hex(model.modelIdentity.canonicalBytes)+'\n');
  models.push({name,modelDigest:hex(model.modelIdentity.digest),work:String(model.work),kind:name==='work7'?'negative work-limit control':'semantic comparison'});
 }
 assert.equal(new Set(models.map(m=>m.modelDigest)).size,7);checks.push('Seven complete model images compile with distinct commitments');
 const base=t.source(),slots=t.codec.decodeEmbodied(base.registry).items;
 const replace=(r,n,v)=>record(r.schema,new Map([...r.fields].map(([k,x])=>[k,k===BigInt(n)?v:x])));
 const slot=(index,value)=>({...base,registry:enc(list(slots.map((s,i)=>i===index?value:s)))});
 const edit=(payload,fn)=>slot(0,set(slots[0].items.map(e=>e.schema.typeId===171n&&e.fields.get(1n).payload.value===payload?fn(e):e)));
 const reject=async(name,source)=>{await assert.rejects(()=>compileEmbodiedModel(source));checks.push(name);};
 await reject('Foreign numeric profile rejects',{...base,numericProfileVersion:'numeric/exact-1'});
 await reject('Extra source property rejects',{...base,handler:()=>{}});
 await reject('Missing registry slot rejects',{...base,registry:enc(list(slots.slice(0,5)))});
 await reject('Wrong phase registry rejects',slot(1,list([])));
 await reject('Missing owner rejects',slot(2,t.r(155,[text('mutation-authority/0.1-candidate#TRC-001-002-addendum'),set([])])));
 await reject('Missing immutable roster rejects',slot(3,set([])));
 await reject('Missing key grammar rejects',slot(4,set(slots[4].items.slice(0,1))));
 await reject('Missing canonical role rejects',slot(5,set(slots[5].items.slice(0,-1))));
 await reject('Extra character content rejects',{...base,content:enc(set([]))});
 await reject('Wrong channel fuel member rejects',edit('definition/embodied-level-channel',e=>replace(e,4,replace(e.fields.get(4n),3,t.id(1039,'unit/fixture-pulse')))));
 await reject('Mismatched channel capacity rejects',edit('definition/embodied-level-channel',e=>replace(e,4,replace(e.fields.get(4n),5,q(200,1)))));
 await reject('Orphan pressure target rejects',edit('definition/embodied-pressure',e=>replace(e,4,replace(e.fields.get(4n),1,t.def('not-declared')))));
 await reject('Threshold greater than capacity rejects',edit('definition/embodied-pressure',e=>replace(e,4,replace(e.fields.get(4n),2,q(101,1)))));
 await reject('Source channel-definition schema cannot replace opportunity459',edit('definition/embodied-level-source',e=>replace(e,4,replace(e.fields.get(4n),3,replace(e.fields.get(4n).fields.get(3n),1,t.ref('LevelChannelDefinition'))))));
 await reject('Wrong-kind well-typed channel-set reference rejects',edit('definition/embodied-level-source',e=>replace(e,4,replace(e.fields.get(4n),3,replace(e.fields.get(4n).fields.get(3n),4,set([t.def('embodied-pressure')]))))));
 await reject('Missing source branch output rejects',edit('definition/embodied-level-source',e=>replace(e,4,replace(e.fields.get(4n),3,replace(e.fields.get(4n).fields.get(3n),6,t.r('LevelSampleOutputChoice',[t.ref('EmbodiedLevelObservation'),t.ref('EmbodiedLevelObservation')]))))));
 await reject('Pressure cannot change its admitted source registration',edit('EmbodiedPresentPressureTransition',e=>{const reg=e.fields.get(4n),definition=reg.fields.get(3n),admission=definition.fields.get(1n),producer=admission.fields.get(2n);return replace(e,4,replace(reg,3,replace(definition,1,replace(admission,2,replace(producer,1,t.def('embodied-replenishment'))))));}));
 await reject('Writer cannot use source definition as delivery member',edit('definition/embodied-replenishment',e=>replace(e,4,replace(e.fields.get(4n),5,set([t.def('embodied-level-source')])))));
 await reject('Extra learning route rejects',edit('definition/transition-admission',e=>replace(e,4,replace(e.fields.get(4n),1,set([t.id(1026,'route/character-learning')])))));
 await reject('Missing output occurrence rejects',edit('definition/transition-admission',e=>replace(e,4,replace(e.fields.get(4n),3,t.c.map([])))));
 await assert.rejects(()=>compileCognitiveModel(base));checks.push('Old cognitive model factory excludes EMB bundle');
 const snapshotSource=t.source(),promise=compileEmbodiedModel(snapshotSource);snapshotSource.registry.fill(0);const snap=await promise;assert.equal(hex(snap.modelIdentity.digest),models[0].modelDigest);checks.push('Caller byte mutation after compile entry cannot change snapshot');
 const inputRows=[[10,'sample'],[40,'sample'],[40,30],[41,'sample'],[75,'sample'],[75,5],[75,60],[76,'sample'],[180,'sample']];
 const ordered=list(inputRows.map(([time,kind])=>list([i(time),u(kind==='sample'?10:110),t.event(kind==='sample'?'embodied-level-sample':'embodied-reserve-replenishment'),kind==='sample'?t.r('LevelSamplingOpportunity',[t.observer,t.def('embodied-level-channel')]):t.r('ReserveReplenishmentInput',[t.def('embodied-delivery-'+kind)]),list([])])));
 const seed=new Uint8Array(32),runs=[];
 for(const name of ['baseline','hidden89','slower','coarser','denied','unavailable','overflow']){
  const modelName=name==='hidden89'?'baseline':name,model=compiled.get(modelName);
  const path=(root,key)=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key}]});
  const state=new AuthoritativeState([{path:path(268,t.observer),value:t.r(267,[t.char])},{path:path(455,t.char),value:t.r('ReserveAnchor',[q(name==='hidden89'?89:80,1),i(0)])}]);
  model.state.validateState(state);
  const identity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(state.canonicalValue()),orderedInputSequence:await commitManifest(ordered),runSeed:seed});
  files.set(`runs/${name}/initial-state.cenc.hex`,hex(enc(state.canonicalValue()))+'\n');files.set(`runs/${name}/ordered-inputs.cenc.hex`,hex(enc(ordered))+'\n');files.set(`runs/${name}/run-identity.cenc.hex`,hex(identity.canonicalBytes)+'\n');
  runs.push({name,model:modelName,modelDigest:hex(model.modelIdentity.digest),runDigest:hex(identity.digest),initialClock:'0',initialAllocatorsBeforeInputs:['0','0','0'],afterInputs:['0','9','9'],runSeedHex:hex(seed)});
 }
 assert.equal(runs[0].modelDigest,runs[1].modelDigest);assert.notEqual(runs[0].runDigest,runs[1].runDigest);assert.equal(new Set(runs.map(r=>r.runDigest)).size,7);checks.push('Seven run commitments; hidden89 shares model but changes RunIdentity');
 const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));for(const f of frozen.checks)assert.deepEqual(fp(f.path),{path:f.path,sha256:f.sha256});
 for(const [name,data] of files){const path=folder+'/'+name;fs.mkdirSync(path.slice(0,path.lastIndexOf('/')),{recursive:true});fs.writeFileSync(path,data);}
 const sources=['src/campaign3/embodiedCodecs.ts','src/campaign3/embodiedModel.ts','scripts/embodied-declaration-tools.mjs','scripts/materialize-embodied-model-review.mjs','docs/formal/EMBODIED_MODEL_PACKAGING_ACCEPTANCE.md','docs/formal/EMBODIED_PACKAGING_INPUT_REFERENCE_CORRECTION.md','docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json'];
 fs.writeFileSync(folder+'/REVIEW_MANIFEST.json',JSON.stringify({status:'COMPLETE DECLARATION AND RUN COMMITMENT REVIEW; NOT FROZEN',versions:t.profiles,models,runs,checks,adversarialChecks:checks.length,artifacts:[...files.keys()].map(p=>fp(folder+'/'+p)),sources:sources.map(fp),preservedChecks:frozen.checks.length,limits:['New model declaration compiler executed; no runtime activation.','State specimens checked structurally; exact public initial-state admission remains a runtime gate.','Ordered input bytes are constructed, not yet passed through the new live-source compiler.','No whole EPACK work/identity/runtime control inferred from these checks.']},null,2)+'\n');console.log(JSON.stringify({models:models.length,runs:runs.length,checks:checks.length,baseline:models[0].modelDigest,preserved:446}));
}finally{await server.close();}
