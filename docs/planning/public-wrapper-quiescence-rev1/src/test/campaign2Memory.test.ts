import {describe,it,expect,vi} from 'vitest';
import * as traceModule from '../substrate/trace';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as memoryExecutionModule from '../campaign2/memoryExecution';
import {canonicalEncode as enc,list,set,record,typedIdentifier,text,unsigned,signed} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {memoryModelSource,memoryWrapperDeclarations} from '../campaign2/memoryModelSource';
import {prepareMemoryModel} from '../campaign2/memoryFactory';
import {createMemoryRun,restoreMemoryRun} from '../campaign2/memoryFactory';
import {memoryRecord as r,decodeMemory} from '../campaign2/memoryCodecs';
import {campaign2Record} from '../campaign2/codecs';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {compileMemoryModel} from '../campaign2/memoryModel';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileProbeExecution} from '../campaign2/probeExecution';
import {beginTransitionIngressV04} from '../campaign2/transitionIngressV04';
import {executeMeasurementIntake} from '../campaign2/measurementExecution';
import {measurementEvidenceModelSource} from '../campaign2/measurementModelSource';
import {simInstant} from '../substrate/time';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
const id=(n:number,s:string)=>typedIdentifier(n,text(s));
function fixture(){
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const state=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])}]);
 return {initialState:enc(state.canonicalValue()),orderedInputs:enc(list([list([signed(4),unsigned(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])])])),runSeed:new Uint8Array(32)};
}
describe('frozen measurement-memory causal execution',()=>{
 it('MEMR-B/G component: distinct hidden decompositions produce identical actual carriage, episode and recall',async()=>{
  const source=memoryModelSource(),model=await compileMemoryModel(source),data=fixture();
  const run=await createMemoryRun(await prepareMemoryModel(source),data),runIdentity=decodeMemory(run.runIdentity()),pair=[];
  for(const anchor of [50n,51n]){
   const slots=items(decodeMemory(measurementEvidenceModelSource().registry),'list');let regEntry:import('../substrate/canonicalEncoding').CanonicalValue|undefined;
   const replace=(v:import('../substrate/canonicalEncoding').CanonicalValue,field:bigint,value:import('../substrate/canonicalEncoding').CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[field,value]]));};
   const entries=items(slots[0],'set').map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;const body=f(v,4n);if(typeof body==='boolean'||body.kind!=='record'||body.schema.typeId!==283n)return v;const reference=rec(f(body,2n),282n),anchors=f(reference,1n);if(typeof anchors==='boolean'||anchors.kind!=='map')throw Error('anchor');regEntry=replace(v,4n,replace(body,2n,replace(reference,1n,{kind:'map',entries:anchors.entries.map(([k,a])=>[k,replace(a,1n,signed(anchor))])})));return regEntry;});
   const registry=list([set(entries),...slots.slice(1)]),reg=compileRegulatoryReferences(enc(set([regEntry!])),model.content),probe=compileProbeExecution(registry,reg);
   const roster=model.stateModel.restoreState(data.initialState),state=new AuthoritativeState([...roster.entries(),...(anchor===51n?[]:[{path:probe.path,value:campaign2Record('RegulatoryAdaptationValue',{Magnitude:signed(1)})}])]);
   const execution=probe.begin(4n);let ordinal=0n,eventOrdinal=1n;const allocator={allocateRuntimeId:()=>ordinal++};
   const event={eventId:0n,eventSequence:0n,dueAt:simInstant(4n),phase:110n,eventTypeId:id(1001,'event/regulatory-diagnostic-probe'),payload:r(333,[probe.definitionId]),dependencies:list([]),causalParentEventIds:[]};
   const children=(plan:{emissions:()=>readonly import('../substrate/scheduler').EventEmission[];bindAllocatedChildren:(children:readonly import('../substrate/scheduler').ScheduledEvent[])=>void},parent:bigint)=>{const out=plan.emissions().map(e=>{const n=eventOrdinal++;return {...e,eventId:n,eventSequence:n,causalParentEventIds:[parent]};});plan.bindAllocatedChildren(out);return out;};
   const produced=execution.execute(event,state,allocator),observedEvent=children(produced.plan,0n)[0],observed=execution.execute(observedEvent,state,allocator).outputs[0];
   const ingress=beginTransitionIngressV04(model.base.admission,4n),intake=children(ingress.observeMeasurement(observedEvent,enc(observed)),observedEvent.eventId)[0],token=ingress.admit(intake),occurrence=ingress.allocateMeasurementIdentity(token,allocator),output=executeMeasurementIntake(observed,model.base.measurement.unit,occurrence);ingress.completeMeasurement(token,enc(output)).bindAllocatedChildren([]);ingress.finish();execution.abort();
   const memory=memoryExecutionModule.createMemoryExecution(model,model.base.measurement.validateOutput,model.modelIdentity.value,runIdentity);memory.begin(4n);
   const generated=children(memory.observeIntake(intake,output),intake.eventId),m1=memory.execute(generated[0],state,allocator),formationEvent=children(m1.plan,generated[0].eventId)[0],formed=memory.execute(formationEvent,state,allocator);children(formed.plan,formationEvent.eventId);memory.commit();memory.close();
   // Component intervention between formation and recall; no public in-run R0 knob is invented.
   const recallState=new AuthoritativeState(formed.nextState.entries().map(e=>e.path.rootStateTypeId===302n?{...e,value:campaign2Record('RegulatoryAdaptationValue',{Magnitude:signed(2)})}:e));model.stateModel.validateState(recallState);
   memory.begin(5n);const recalled=memory.execute(generated[1],recallState,allocator);children(recalled.plan,generated[1].eventId);memory.commit();memory.close();
   pair.push({carriage:key(output),episodes:key(encEpisode(formed.nextState)),recall:key(list(recalled.outputs))});
   if(anchor===51n){const successorSlots=items(decodeMemory(source.registry),'list'),altered=set(items(successorSlots[0],'set').map(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(f(rec(regEntry!,171n),1n))?regEntry!:v));await expect(prepareMemoryModel({...source,registry:enc(list([altered,...successorSlots.slice(1)]))})).rejects.toThrow();}
  }
  expect(pair[0]).toEqual(pair[1]);
  function encEpisode(state:AuthoritativeState){return list(state.entries().filter(e=>e.path.rootStateTypeId===346n).map(e=>e.value));}
 },20000);
 it('MEMR-M: all sixteen successors preserve later authored-source sentinel identities',async()=>{
  const data=fixture(),C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),sentinels:string[]=[];
  const exposure=list([signed(6),unsigned(110),AUTHORED_FACT_EVENT,campaign2Record('AuthoredActualAdaptationFact',{Fact:campaign2Record('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:unsigned(1)})}),list([])]);
  for(const a of [false,true])for(const p of [false,true])for(const F of [false,true])for(const R of [false,true]){
   const w=memoryWrapperDeclarations(),model=await prepareMemoryModel(memoryModelSource(a,p,F?w.formation:w.formationAblated,R?w.recall:w.recallAblated));
   const run=await createMemoryRun(model,{...data,orderedInputs:enc(list([...items(decodeMemory(data.orderedInputs),'list'),exposure]))});
   await run.settleNextInstant();await run.settleNextInstant();const count=items(decodeMemory(run.snapshot().outputs),'list').length;await run.settleNextInstant();
   const output=items(decodeMemory(run.snapshot().outputs),'list').slice(count).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[269n,270n].includes(v.schema.typeId));
   expect(output).toHaveLength(2);sentinels.push(key(list(output)));
  }
  expect(new Set(sentinels).size).toBe(1);
 },60000);
 it('MEMR-C/D/K: substituted generative events reject before a state read',async()=>{
  const model=await prepareMemoryModel(memoryModelSource()),original=memoryExecutionModule.createMemoryExecution;
  for(const target of ['event/measurement-episode-evidence','event/measurement-episode-formation']){
   let checked=false;
   const injection=vi.spyOn(memoryExecutionModule,'createMemoryExecution').mockImplementation((...args)=>{
    const execution=original(...args);return {...execution,execute(event,state,allocator){
     if(key(event.eventTypeId)!==key(id(1001,target)))return execution.execute(event,state,allocator);
     const spy=vi.spyOn(AuthoritativeState.prototype,'read');try{checked=true;expect(()=>execution.execute({...event,eventId:event.eventId+100n},state,allocator)).toThrow();expect(spy).not.toHaveBeenCalled();}finally{spy.mockRestore();}
     return execution.execute(event,state,allocator);
    }};
   });
   try{const run=await createMemoryRun(model,fixture());await run.settleNextInstant();expect(checked).toBe(true);}finally{injection.mockRestore();}
  }
 },20000);
 it('MEMR-K: externally submitted memory events and contaminated cues are never admitted',async()=>{
  const model=await prepareMemoryModel(memoryModelSource()),data=fixture();
  for(const name of ['event/measurement-episode-evidence','event/measurement-episode-formation','event/measurement-exact-recall']){
   const inputs=enc(list([list([signed(5),unsigned(20),id(1001,name),list([signed(5)]),list([])])]));
   await expect(createMemoryRun(model,{...data,orderedInputs:inputs})).rejects.toThrow();
  }
 },20000);
 it('MEMR-L: late formation output failure rolls back the pending chain and episode',async()=>{
  let runtime:ReturnType<typeof runtimeModule.createAdaptationRuntime>|undefined;
  const original=runtimeModule.createAdaptationRuntime,trace=traceModule.traceRecordValue;
  const capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{runtime=original(...args);return runtime;});
  try{const run=await createMemoryRun(await prepareMemoryModel(memoryModelSource()),fixture()),before=runtime!.snapshot();
   const failure=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{if(key(value.event.eventTypeId)===key(id(1001,'event/measurement-episode-formation')))throw Error('late formation output failure');return trace(value);});
   try{await expect(run.settleNextInstant()).rejects.toThrow();const after=runtime!.snapshot();for(const k of ['allocators','queue','outputs','committedTrace','clock'] as const)expect(after[k]).toEqual(before[k]);expect(after.state.canonicalValue()).toEqual(before.state.canonicalValue());}finally{failure.mockRestore();}
  }finally{capture.mockRestore();}
 },20000);
 it('MEMR-G: later public adaptation preserves the historical episode and recollection',async()=>{
  const data=fixture(),C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
  const exposure=list([signed(5),unsigned(110),AUTHORED_FACT_EVENT,campaign2Record('AuthoredActualAdaptationFact',{Fact:campaign2Record('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:unsigned(1)})}),list([])]);
  const inputs=enc(list([...items(decodeMemory(data.orderedInputs),'list'),exposure]));
  const source=memoryModelSource(),run=await createMemoryRun(await prepareMemoryModel(source),{...data,orderedInputs:inputs});await run.settleNextInstant();
  const episode=(bytes:Uint8Array)=>items(decodeMemory(bytes),'set').find(v=>key(f(rec(f(rec(v,151n),1n),140n),1n))===key(unsigned(346)))!;
  const before=run.snapshot(),historical=episode(before.state);await run.settleNextInstant();
  const after=run.snapshot();expect(key(decodeMemory(after.state))).not.toBe(key(decodeMemory(before.state)));expect(episode(after.state)).toEqual(historical);
  const recalled=items(decodeMemory(after.outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===352n)!;
  expect(f(rec(recalled,352n),2n)).toEqual(f(rec(historical,151n),2n));
  const restored=await restoreMemoryRun(source,{initialState:data.initialState,orderedInputs:inputs,save:run.save()});expect(restored.save()).toEqual(run.save());
 },20000);
 it('MEMR-E/K/N: formation owns one leaf; recall reads only IDN and its exact episode',async()=>{
  const original=traceModule.traceRecordValue,seen:Parameters<typeof original>[0][]=[];
  const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{seen.push(value);return original(value);});
  try{const run=await createMemoryRun(await prepareMemoryModel(memoryModelSource()),fixture());await run.settleNextInstant();await run.settleNextInstant();
   const formation=seen.find(t=>key(t.event.eventTypeId)===key(id(1001,'event/measurement-episode-formation')))!;
   expect(formation.actualReadRecords.map(x=>x.path.rootStateTypeId)).toEqual([268n]);expect(formation.statePatch.operations).toHaveLength(1);
   expect(formation.statePatch.operations[0].path.rootStateTypeId).toBe(346n);expect(formation.structuralMutationDiffs).toHaveLength(1);
   const recall=seen.find(t=>key(t.event.eventTypeId)===key(id(1001,'event/measurement-exact-recall')))!;
   expect(recall.actualReadRecords.map(x=>x.path.rootStateTypeId)).toEqual([268n,346n]);expect(recall.actualReadRecords[1].derivedSources).toEqual([]);expect(recall.actualReadRecords[1].transformationId).toBeUndefined();
   expect(recall.statePatch.operations).toEqual([]);expect(recall.structuralMutationDiffs).toEqual([]);
   expect(recall.actualReadRecords[1].path).toEqual(formation.statePatch.operations[0].path);
  }finally{spy.mockRestore();}
 },20000);
 it('forged delayed observer rejects before any authoritative read',async()=>{
  const original=memoryExecutionModule.createMemoryExecution;
  const injection=vi.spyOn(memoryExecutionModule,'createMemoryExecution').mockImplementation((...args)=>{
   const execution=original(...args);return {...execution,execute(event,state,allocator){if(event.phase===20n){const cue=rec(event.payload,351n);return execution.execute({...event,payload:record(cue.schema,new Map([...cue.fields].map(([i,v])=>[i,i===1n?id(1000,'observer/forged'):v])))},state,allocator);}return execution.execute(event,state,allocator);}};
  });
  try{const run=await createMemoryRun(await prepareMemoryModel(memoryModelSource()),fixture());await run.settleNextInstant();const reads=vi.spyOn(AuthoritativeState.prototype,'read');try{await expect(run.settleNextInstant()).rejects.toMatchObject({code:'INPUT_NOT_ADMITTED'});expect(reads).not.toHaveBeenCalled();}finally{reads.mockRestore();}}finally{injection.mockRestore();}
 },20000);
 it('MEMR-A/F/O:5 versus51/10 first diverges in the episode and survives recall',async()=>{
  const source=memoryModelSource(),model=await prepareMemoryModel(source),data=fixture();
  const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
  const initial=items(decodeMemory(data.initialState),'set');
  const states=[0,1].map(d=>d===0?data.initialState:enc(set([...initial,r(151,[r(140,[unsigned(302),unsigned(3),list([r(142,[r(294,[C,id(1029,'variable/fixture-regulation')])])])]),r(299,[signed(d)])])])));
  const runs=await Promise.all(states.map(initialState=>createMemoryRun(model,{...data,initialState})));
  for(const run of runs)await run.settleNextInstant();
  const values=runs.map(run=>{const evidence=items(decodeMemory(run.snapshot().outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)!;return f(rec(f(rec(f(rec(evidence,337n),2n),203n),6n),204n),2n);});
  expect(values[0]).toEqual({kind:'rational',numerator:5n,denominator:1n});expect(values[1]).toEqual({kind:'rational',numerator:51n,denominator:10n});
  const episodes=runs.map(run=>items(decodeMemory(run.snapshot().state),'set').find(v=>key(f(rec(f(rec(v,151n),1n),140n),1n))===key(unsigned(346)))!);expect(key(episodes[0])).not.toBe(key(episodes[1]));
  const evid=runs.map(run=>items(decodeMemory(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[269n,270n].includes(v.schema.typeId)));expect(key(list(evid[0]))).toBe(key(list(evid[1])));
  for(const run of runs){const before=run.snapshot().state;await run.settleNextInstant();expect(key(decodeMemory(run.snapshot().state))).toBe(key(decodeMemory(before)));}
 },20000);
 it('MEMR-L:late recall trace failure restores queue, ordinals, state and outputs',async()=>{
  let runtime:ReturnType<typeof runtimeModule.createAdaptationRuntime>|undefined;
  const originalRuntime=runtimeModule.createAdaptationRuntime,originalTrace=traceModule.traceRecordValue;
  const capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{runtime=originalRuntime(...args);return runtime;});
  try{
   const run=await createMemoryRun(await prepareMemoryModel(memoryModelSource()),fixture());await run.settleNextInstant();const before=runtime!.snapshot();
   const failure=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{if(value.event.phase===20n)throw Error('late recall trace failure');return originalTrace(value);});
   try{await expect(run.settleNextInstant()).rejects.toThrow();const after=runtime!.snapshot();expect(after.allocators).toEqual(before.allocators);expect(after.queue).toEqual(before.queue);expect(after.clock).toBe(before.clock);expect(after.outputs).toEqual(before.outputs);expect(after.committedTrace).toEqual(before.committedTrace);expect(key(after.state.canonicalValue())).toBe(key(before.state.canonicalValue()));}finally{failure.mockRestore();}
  }finally{capture.mockRestore();}
 },20000);
 for(const permitted of [false,true])it(`checked delay overflow rolls back even private branch permitted=${permitted}`,async()=>{
  const data=fixture(),entries=items(decodeMemory(data.orderedInputs),'list'),entry=items(entries[0],'list');
  const run=await createMemoryRun(await prepareMemoryModel(memoryModelSource(true,permitted)),{...data,orderedInputs:enc(list([list([signed((1n<<63n)-1n),...entry.slice(1)])]))}),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toMatchObject({code:'INSTANT_OVERFLOW'});const after=run.snapshot();expect(after.clock).toBe(before.clock);for(const field of ['state','trace','outputs'] as const)expect(key(decodeMemory(after[field]))).toBe(key(decodeMemory(before[field])));
 },20000);
 it('prefix restores pending real recall and rejects wrong original S0',async()=>{
  const source=memoryModelSource(),data=fixture(),run=await createMemoryRun(await prepareMemoryModel(source),data);
  const initial=await restoreMemoryRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save:run.save()});expect(key(decodeMemory(initial.save()))).toBe(key(decodeMemory(run.save())));
  await run.settleNextInstant();const save=run.save();
  const restored=await restoreMemoryRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save});
  expect(key(decodeMemory(restored.save()))).toBe(key(decodeMemory(save)));
  await run.settleNextInstant();await restored.settleNextInstant();expect(key(decodeMemory(restored.save()))).toBe(key(decodeMemory(run.save())));
  await expect(restoreMemoryRun(source,{initialState:enc(set([])),orderedInputs:data.orderedInputs,save})).rejects.toThrow();
 },20000);
 it('rejects forged pending cue, dropped queue, changed ordinal, partial prefix and preseeded memory',async()=>{
  const source=memoryModelSource(),data=fixture(),handle=await prepareMemoryModel(source),run=await createMemoryRun(handle,data);await run.settleNextInstant();const saved=rec(decodeMemory(run.save()),132n);
  const replace=(v:ReturnType<typeof rec>,n:bigint,x:Parameters<typeof key>[0])=>record(v.schema,new Map([...v.fields].map(([i,a])=>[i,i===n?x:a])));
  const queue=items(f(saved,7n),'list'),event=rec(queue[0],130n),cue=rec(f(event,6n),351n);
  const mutants=[replace(saved,7n,list([replace(event,6n,replace(cue,1n,id(1000,'observer/other')))])),replace(saved,7n,list([])),replace(saved,6n,replace(rec(f(saved,6n),131n),1n,unsigned(999))),replace(saved,11n,list(items(f(saved,11n),'list').slice(0,1)))];
  for(const save of mutants)await expect(restoreMemoryRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save:enc(save)})).rejects.toThrow();
  await expect(createMemoryRun(handle,{...data,initialState:enc(f(saved,5n))})).rejects.toThrow('initial episodes');
 },20000);
 it('coincident pending recall and later source retain independent chains and restore exactly',async()=>{
  const source=memoryModelSource(),data=fixture(),first=items(items(decodeMemory(data.orderedInputs),'list')[0],'list');
  const orderedInputs=enc(list([list(first),list([signed(5),...first.slice(1)])])),run=await createMemoryRun(await prepareMemoryModel(source),{...data,orderedInputs});
  await run.settleNextInstant();const restored=await restoreMemoryRun(source,{initialState:data.initialState,orderedInputs,save:run.save()});
  for(let i=0;i<2;i++){await run.settleNextInstant();await restored.settleNextInstant();expect(key(decodeMemory(restored.save()))).toBe(key(decodeMemory(run.save())));}
  expect(items(decodeMemory(run.snapshot().state),'set')).toHaveLength(3);
 },20000);
 for(const a of [false,true])for(const p of [false,true])for(const F of [false,true])for(const R of [false,true])it(`available=${a} permitted=${p} forms=${F} recalls=${R}`,async()=>{
  const w=memoryWrapperDeclarations(),model=await prepareMemoryModel(memoryModelSource(a,p,F?w.formation:w.formationAblated,R?w.recall:w.recallAblated));
  const run=await createMemoryRun(model,fixture());
  await run.settleNextInstant();
  const first=run.snapshot();expect(first.status,JSON.stringify(run.diagnostic()?Array.from(run.diagnostic()!):null)).toBe('Active');
  const state=items(decodeMemory(first.state),'set');expect(state.length).toBe(a&&p&&F?2:1);
  expect(items(decodeMemory(first.trace),'list')).toHaveLength(11);
  expect(f(rec(f(rec(decodeMemory(run.save()),132n),6n),131n),1n)).toEqual(unsigned(7));
  const outputs=items(decodeMemory(first.outputs),'list');expect(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===342n)).toHaveLength(a&&p?1:0);
  expect(await run.settleNextInstant()).toBe(true);const later=run.snapshot();expect(later.clock).toBe(5n);expect(key(decodeMemory(later.state))).toBe(key(decodeMemory(first.state)));
  expect(items(decodeMemory(later.trace),'list')).toHaveLength(12);
  expect(f(rec(f(rec(decodeMemory(run.save()),132n),6n),131n),1n)).toEqual(unsigned(8));
  const recollections=items(decodeMemory(later.outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===352n);expect(recollections).toHaveLength(a&&p&&F&&R?1:0);
  if(a&&p&&F&&R){const historical=f(rec(f(rec(f(rec(recollections[0],352n),2n),345n),1n),342n),2n);expect(key(historical)).toBe(key(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)!));}
 },20000);
 it('restores private future padding and rejects edited historical output',async()=>{
  const source=memoryModelSource(true,false),data=fixture(),run=await createMemoryRun(await prepareMemoryModel(source),data);await run.settleNextInstant();
  const saved=run.save(),restored=await restoreMemoryRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save:saved});
  await restored.settleNextInstant();await run.settleNextInstant();expect(key(decodeMemory(restored.save()))).toBe(key(decodeMemory(run.save())));
  const value=rec(decodeMemory(saved),132n),bad=record(value.schema,new Map([...value.fields].map(([k,v])=>[k,k===12n?list([]):v])));
  await expect(restoreMemoryRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save:enc(bad)})).rejects.toThrow();
 },20000);
 it('missing roster fails formation atomically before persistent writes',async()=>{
  const data={...fixture(),initialState:enc(set([]))},run=await createMemoryRun(await prepareMemoryModel(memoryModelSource()),data),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrow();const after=run.snapshot();expect(after.status).toBe('Failed');expect(after.clock).toBe(before.clock);for(const field of ['state','outputs','trace'] as const)expect(key(decodeMemory(after[field]))).toBe(key(decodeMemory(before[field])));
 },20000);
});
