/** Research harness only: exact PHEN-ADAPT-001 parent intervention pair. */
function assert(value:unknown,message='assertion failed'):asserts value {if(!value)throw Error(message);}
function eq(a:unknown,b:unknown,message='equality failed'){assert(a===b,message);}
function neq(a:unknown,b:unknown,message='unexpected equality'){assert(a!==b,message);}
function exactArray(a:readonly bigint[],b:readonly bigint[]){assert(a.length===b.length&&a.every((v,i)=>v===b[i]));}
const bytesHex=(b:Uint8Array)=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier,record,rational,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../../substrate/state';
import {governedContentDefinitionId} from '../../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {memoryModelSource} from '../../campaign2/memoryModelSource';
import {prepareMemoryModel,memoryModelIdentity,createMemoryRun,restoreMemoryRun} from '../../campaign2/memoryFactory';
import {memoryRecord as r,decodeMemory} from '../../campaign2/memoryCodecs';
import {campaign2Record} from '../../campaign2/codecs';
import {AUTHORED_FACT_EVENT,PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as u,dataText as txt,dataIdentity as ident} from '../../campaign2/canonicalData';

const id=(n:number,s:string)=>typedIdentifier(n,text(s));
const hex=(v:CanonicalValue)=>bytesHex(enc(v));
const pairs=(v:CanonicalValue)=>{assert(typeof v!=='boolean'&&v.kind==='map');return v.entries;};
const replace=(v:CanonicalValue,k:bigint,x:CanonicalValue)=>{assert(typeof v!=='boolean'&&v.kind==='record');return record(v.schema,new Map([...v.fields,[k,x]]));};
const records=(bytes:Uint8Array)=>items(decodeMemory(bytes),'list');
const ofType=(values:readonly CanonicalValue[],n:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n);
const event=(trace:CanonicalValue)=>rec(f(rec(trace,160n),4n),130n);
const eventId=(trace:CanonicalValue)=>u(f(event(trace),1n));
const eventName=(trace:CanonicalValue)=>txt(ident(f(event(trace),5n)).payload);
const traceNamed=(traces:readonly CanonicalValue[],name:string)=>{const found=traces.filter(t=>eventName(t)===name);eq(found.length,1,name);return rec(found[0],160n);};
const stateEntries=(bytes:Uint8Array)=>restoreAuthoritativeState(decodeMemory(bytes)).entries();

export async function proveAdaptParentPair(){
 const checks:string[]=[];
 const same=(a:CanonicalValue,b:CanonicalValue,label:string)=>{eq(key(a),key(b),label);checks.push(label);};
 const source=memoryModelSource(),model=await prepareMemoryModel(source);
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const initialState=enc(new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])}]).canonicalValue());
 const seed=new Uint8Array(32);
 const probe=list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])]);
 const manifests=[0,1].map(count=>list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,campaign2Record('AuthoredActualAdaptationFact',{Fact:campaign2Record('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:unsigned(count)})}),list([])]),probe]));
 // Structural comparison of the entire manifests, changing only the declared count field.
 const entry=items(items(manifests[1],'list')[0],'list'),authored=rec(entry[3],304n);
 const normalized=list([list([...entry.slice(0,3),replace(authored,1n,replace(f(authored,1n),3n,unsigned(0))),entry[4]]),probe]);
 same(manifests[0],normalized,'Only the earlier authored count differs in complete original inputs');
 const runs=await Promise.all(manifests.map(manifest=>createMemoryRun(model,{initialState,orderedInputs:enc(manifest),runSeed:seed})));
 const identities=runs.map(run=>rec(decodeMemory(run.runIdentity()),104n));
 for(const field of [1n,2n,4n])same(f(identities[0],field),f(identities[1],field),`RunIdentity field ${field} identical`);
 neq(key(f(identities[0],3n)),key(f(identities[1],3n)));checks.push('Only OrderedInputSequenceDigest differs in RunIdentity');
 same(decodeMemory(runs[0].snapshot().state),decodeMemory(runs[1].snapshot().state),'Complete initial state bytes identical');
 same(f(identities[0],1n),decodeMemory(memoryModelIdentity(model)),'Shared exact frozen ModelIdentity');

 // Query the committed route topology, including unwritten/virtual cognitive families.
 const rows=items(items(decodeMemory(source.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const body=(name:string)=>f(rec(rows.find(v=>key(f(rec(v,171n),1n))===key(id(1027,name)))!,171n),4n);
 const route=id(1026,'route/character-learning');
 const families=pairs(f(rec(body('definition/campaign2-state-families'),284n),1n)).filter(([,v])=>key(f(rec(v,285n),1n))===key(route));
 eq(families.length,8);
 const roots=families.flatMap(([,v])=>{const storage=rec(f(rec(v,285n),2n),286n);return storage.fields.has(2n)?[u(f(storage,2n))]:[];});
 assert(roots.includes(346n));
 const transitions=pairs(f(rec(body('definition/transition-admission'),279n),2n)).filter(([,v])=>key(v)===key(route));
 const closure=new Set<bigint>();
 for(const [transition] of transitions){
  let registration=f(rec(rows.find(v=>key(f(rec(v,171n),1n))===key(transition))!,171n),4n);
  if(typeof registration!=='boolean'&&registration.kind==='record'&&[356n,357n,358n].includes(registration.schema.typeId))registration=f(registration,1n);
  assert(typeof registration!=='boolean'&&registration.kind==='record');
  const definition=f(registration,3n);assert(typeof definition!=='boolean'&&definition.kind==='record');
  for(const output of items(f(definition,3n),'set'))closure.add(u(f(rec(f(rec(output,277n),1n),254n),1n)));
 }
 for(const n of [269n,270n,342n])assert(closure.has(n));
 const cognitive=(bytes:Uint8Array)=>list(stateEntries(bytes).filter(e=>roots.includes(e.path.rootStateTypeId)).map(e=>r(151,[statePathValue(e.path),e.value])));
 const safe=(bytes:Uint8Array)=>list(records(bytes).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&closure.has(v.schema.typeId)));
 const target={rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey' as const,key:campaign2Record('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]};

 for(const run of runs)assert(await run.settleNextInstant());
 const adapted=runs.map(run=>run.snapshot());
 same(cognitive(adapted[0].state),cognitive(adapted[1].state),'All eight route families equal before revealing probe');
 same(safe(adapted[0].outputs),safe(adapted[1].outputs),'Complete derived character-learning output closure equal before probe');
 for(const n of [203n,227n,269n,270n]){const a=ofType(records(adapted[0].outputs),n),b=ofType(records(adapted[1].outputs),n);assert(a.length>0);same(list(a),list(b),`Immediate ${n} genuinely inhabited and equal`);}
 const d=adapted.map(s=>stateEntries(s.state).filter(e=>key(statePathValue(e.path))===key(statePathValue(target))));
 eq(d[0].length,0);eq(d[1].length,1);same(d[1][0].value,r(299,[signed(1)]),'Count1 creates D=1; count0 retains canonical absent baseline');
 const targets=[{...target,fieldId:1n,selectors:[{kind:'mapKey' as const,key:campaign2Record('ToleranceKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]},{...target,fieldId:2n,selectors:[{kind:'mapKey' as const,key:campaign2Record('SensitizationKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:id(1029,'variable/fixture-regulation')})}]},target,{...target,fieldId:4n,selectors:[{kind:'mapKey' as const,key:campaign2Record('AccumulatedLoadKey',{CharacterId:C,LoadDomainId:id(1033,'load/fixture-load')})}]}];
 const targetKeys=new Set(targets.map(p=>key(statePathValue(p))));
 eq(stateEntries(adapted[1].state).filter(e=>targetKeys.has(key(statePathValue(e.path)))).length,4);
 eq(stateEntries(adapted[0].state).filter(e=>targetKeys.has(key(statePathValue(e.path)))).length,0);
 const nonTarget=(bytes:Uint8Array)=>list(stateEntries(bytes).filter(e=>!targetKeys.has(key(statePathValue(e.path)))).map(e=>r(151,[statePathValue(e.path),e.value])));
 same(nonTarget(adapted[0].state),nonTarget(adapted[1].state),'Every non-target state leaf identical after exposure');
 const adaptationTraces=adapted.map(s=>records(s.trace).map(t=>rec(t,160n)).filter(t=>u(f(event(t),3n))===140n));
 eq(adaptationTraces[0].length,1);eq(adaptationTraces[1].length,1);
 const dispatches=adapted.map(s=>ofType(records(s.outputs),324n));
 eq(dispatches[0].length,1);eq(dispatches[1].length,1);
 same(f(rec(dispatches[0][0],324n),3n),f(rec(dispatches[1][0],324n),3n),'Identical applicable rule set including zero-count dispatch');
 eq(items(f(rec(dispatches[0][0],324n),3n),'set').length,4);
 const evaluations=adapted.map(s=>ofType(records(s.outputs),325n));
 for(let i=0;i<2;i++){
  eq(evaluations[i].length,4);
  for(const value of evaluations[i])eq(u(f(rec(f(rec(value,325n),6n),327n),1n)),i===0?1n:2n);
  same(set(evaluations[i].map(v=>f(rec(v,325n),4n))),set(targets.map(statePathValue)),`Timeline${i} four exact evaluated paths`);
 }
 checks.push('Zero-count evaluates four NoStateChange results; count1 evaluates four StateChange results');
 eq(items(f(adaptationTraces[0][0],17n),'list').length,0);
 const exposureDiffs=items(f(adaptationTraces[1][0],17n),'list').map(v=>rec(v,148n));eq(exposureDiffs.length,4);
 same(set(exposureDiffs.map(v=>f(v,1n))),set(targets.map(statePathValue)),'Exact four governed exposure mutation paths; no spill');
 const diff=exposureDiffs.find(v=>key(f(v,1n))===key(statePathValue(target)))!;assert(diff);
 same(f(diff,1n),statePathValue(target),'Exposure mutation targets the exact later-read D path');
 same(f(diff,5n),d[1][0].value,'Trace mutation value matches retained adaptation state');
 for(const run of runs)assert(await run.settleNextInstant());
 const formed=runs.map(run=>run.snapshot()),saved=runs.map(run=>run.save());
 const episode=(bytes:Uint8Array)=>{const e=stateEntries(bytes).filter(e=>e.path.rootStateTypeId===346n);eq(e.length,1);return e[0];};
 const episodes=formed.map(s=>episode(s.state));
 same(statePathValue(episodes[0].path),statePathValue(episodes[1].path),'Episode keys/owners/occurrences matched');
 neq(key(episodes[0].value),key(episodes[1].value));
 const ancestry:{exposureRoot:string;adaptation:string;probeRoot:string;observation:string;carriage:string;m1:string;formation:string;stateDependency:{path:string;probeRead:string;adaptationDiffs:string}}[]=[];
 for(let i=0;i<2;i++){
  const out=records(formed[i].outputs),obs=ofType(out,203n).at(-1)!,carriage=ofType(out,337n)[0],m1=ofType(out,342n)[0];
  same(f(rec(f(rec(obs,203n),6n),204n),2n),rational(BigInt(50+i),10n),`Timeline${i} actual probe measurement ${i?'51/10':'5'}`);
  same(f(rec(carriage,337n),2n),obs,`Timeline${i} carriage preserves actual observation`);
  same(f(rec(m1,342n),2n),carriage,`Timeline${i} M1 consumes actual carriage`);
  same(f(rec(episodes[i].value,345n),1n),m1,`Timeline${i} episode retains actual M1`);
  const traces=records(formed[i].trace),probeTrace=traceNamed(traces,'event/regulatory-diagnostic-probe');
  const read=rec(items(f(probeTrace,11n),'list')[0],147n);eq(items(f(probeTrace,11n),'list').length,1);
  same(f(read,2n),statePathValue(target),`Timeline${i} probe reads exposure-owned D path`);
  eq(f(read,3n),i===1);if(i===1)same(f(read,4n),f(diff,5n),'Later probe read equals earlier committed D write');
  const formation=traceNamed(traces,'event/measurement-episode-formation');
  const memoryDiffs=traces.filter(t=>key(f(event(t),2n))===key(signed(4))).flatMap(t=>items(f(rec(t,160n),17n),'list'));
  eq(memoryDiffs.length,1);same(f(rec(memoryDiffs[0],148n),1n),statePathValue(episodes[i].path),'First later persistent cognitive mutation is episode formation');
  const chain=['event/regulatory-diagnostic-probe-observation','event/measurement-evidence-intake','event/measurement-episode-evidence','event/measurement-episode-formation'].map(n=>traceNamed(traces,n));
  const parent=(child:CanonicalValue,ancestor:CanonicalValue)=>assert(items(f(event(child),8n),'list').some(v=>u(v)===eventId(ancestor)));
  parent(chain[0],probeTrace);parent(chain[1],chain[0]);parent(chain[2],chain[1]);parent(chain[3],chain[2]);
  const earlier=records(adapted[i].trace),byId=new Map(earlier.map(t=>[eventId(t),t]));
  let cursor:CanonicalValue=adaptationTraces[i][0];while(items(f(event(cursor),8n),'list').length){cursor=byId.get(u(items(f(event(cursor),8n),'list')[0]))!;assert(cursor);}
  eq(key(f(event(cursor),5n)),key(AUTHORED_FACT_EVENT));
  ancestry.push({exposureRoot:String(eventId(cursor)),adaptation:String(eventId(adaptationTraces[i][0])),probeRoot:String(eventId(probeTrace)),observation:String(eventId(chain[0])),carriage:String(eventId(chain[1])),m1:String(eventId(chain[2])),formation:String(eventId(formation)),stateDependency:{path:hex(statePathValue(target)),probeRead:hex(read),adaptationDiffs:hex(f(adaptationTraces[i][0],17n))}});
 }
 same(list(ofType(records(formed[0].outputs),269n)),list(ofType(records(formed[1].outputs),269n)),'All EVID269 still equal after reveal');
 same(list(ofType(records(formed[0].outputs),270n)),list(ofType(records(formed[1].outputs),270n)),'All EVID270 still equal after reveal');
 const restored=await Promise.all(saved.map((save,i)=>restoreMemoryRun(source,{initialState,orderedInputs:enc(manifests[i]),save})));
 for(let i=0;i<2;i++){eq(key(decodeMemory(restored[i].save())),key(decodeMemory(saved[i])));assert(await runs[i].settleNextInstant());assert(await restored[i].settleNextInstant());eq(key(decodeMemory(restored[i].save())),key(decodeMemory(runs[i].save())));}
 const final=runs.map(run=>run.snapshot());
 for(let i=0;i<2;i++){
  same(decodeMemory(final[i].state),decodeMemory(formed[i].state),`Timeline${i} recall makes no persistent mutation`);
  const recollection=ofType(records(final[i].outputs),352n);eq(recollection.length,1);same(f(rec(recollection[0],352n),2n),episodes[i].value,`Timeline${i} later352 recovers the actual episode`);
  const recall=traceNamed(records(final[i].trace),'event/measurement-exact-recall');
  const reads=items(f(recall,11n),'list').map(v=>rec(v,147n));eq(reads.length,2);same(f(reads[1],2n),statePathValue(episodes[i].path),'Recall reads exact formed episode path');same(f(reads[1],4n),episodes[i].value,'Recall read value equals earlier episode write');
  exactArray(items(f(event(recall),8n),'list').map(u),[BigInt(ancestry[i].carriage)]);
 }
 same(f(traceNamed(records(final[0].trace),'event/measurement-exact-recall'),12n),f(traceNamed(records(final[1].trace),'event/measurement-exact-recall'),12n),'Identical content-free delayed recall cue');
 const topology=(bytes:Uint8Array)=>list(records(bytes).map(t=>{const e=event(t);return list([f(e,1n),f(e,2n),f(e,3n),f(e,4n),f(e,5n),f(e,7n),f(e,8n)]);}));
 same(topology(final[0].trace),topology(final[1].trace),'Complete event timing/identity/parent topology matched');
 for(const pair of [saved,runs.map(run=>run.save())])same(f(rec(decodeMemory(pair[0]),132n),6n),f(rec(decodeMemory(pair[1]),132n),6n),'All allocator positions matched');
 for(const s of final)for(const t of records(s.trace))eq(items(f(rec(t,160n),14n),'list').length,0);
 checks.push('No random draws; paired random-address coupling is empty','Both timelines restored after formation before recall to exact complete final saves');
 return {status:'PASS',scope:'Exact same-S0 PHEN-ADAPT actual-fact intervention pair; ADAPT-9b and parent control9 integrated witness',checks,routeClosure:{families:families.map(([k])=>txt(ident(k).payload)),physicalRoots:roots.map(String),outputTypes:[...closure].map(String)},modelIdentityHex:bytesHex(memoryModelIdentity(model)),initialStateHex:bytesHex(initialState),runSeedHex:bytesHex(seed),timelines:manifests.map((manifest,i)=>({count:i,orderedInputsHex:hex(manifest),orderedInputDigestHex:hex(f(identities[i],3n)),afterExposureStateHex:bytesHex(adapted[i].state),afterFormationStateHex:bytesHex(formed[i].state),recollectionHex:hex(ofType(records(final[i].outputs),352n)[0]),ancestry:ancestry[i],topologyHex:hex(topology(final[i].trace)),finalAllocatorHex:hex(f(rec(decodeMemory(runs[i].save()),132n),6n))})),limitations:['Omniscient state-dependency join, not a scheduler-parent edge between independent original roots','PHEN-ADAPT consolidation review remains required; PHEN-MEM and Campaign2 not passed']};
}
