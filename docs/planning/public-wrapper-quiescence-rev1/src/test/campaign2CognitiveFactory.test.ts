import {beforeAll,describe,it,expect,vi} from 'vitest';
import registryHex from '../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import contentHex from '../../docs/planning/campaign2-task-cognitive-model/content.cenc.hex?raw';
import parameterHex from '../../docs/planning/campaign2-task-cognitive-model/parameters.cenc.hex?raw';
import {canonicalEncode as enc,list,set,map,record,text,bytes,typedIdentifier,unsigned as u,signed,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {taskModelReviewSource} from '../campaign2/taskModelReview';
import {cognitiveRecord as r,decodeCognitive as decode} from '../campaign2/cognitiveCodecs';
import {prepareCognitiveModel,createCognitiveRun,restoreCognitiveRun,type CognitiveModel} from '../campaign2/cognitiveFactory';
import * as runtimeModule from '../campaign2/cognitiveRuntime';
import * as traceModule from '../substrate/trace';
import * as schedulerModule from '../substrate/scheduler';
import {dataField as f,dataRecord as rec,dataItems as items} from '../campaign2/canonicalData';
const hex=(s:string)=>Uint8Array.from(s.trim().match(/../g)!.map(v=>parseInt(v,16)));
const source=()=>({...taskModelReviewSource(),rulesVersion:'rules/campaign2-task-cognitive/0.1-candidate',registrySchemaVersion:'campaign2-task-cognitive-registry/0.1-candidate',numericProfileVersion:'numeric/task-cognitive-exact/0.1-candidate',content:hex(contentHex),registry:hex(registryHex),parameters:hex(parameterHex)});
function equalCriteriaSource(){const s=source(),slots=items(decode(s.registry),'list');return {...s,registry:enc(list(slots.map((slot,i)=>i?slot:set(items(slot,'set').map(v=>{
 if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;const body=f(v,4n);if(typeof body==='boolean'||body.kind!=='record'||body.schema.typeId!==370n)return v;
 const next=record(body.schema,new Map([...body.fields].map(([k,v])=>[k,k===3n?rational(4,1):k===4n?rational(6,1):v])));return record(v.schema,new Map([...v.fields].map(([k,v])=>[k,k===4n?next:v])));
 }))))) };}
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
function data(){const state=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])},{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(-50)])},...['a','b'].flatMap((n,i)=>{const key=r(371,[C,semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-'+n))]);return [{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key}]},value:r(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey' as const,key}]},value:r(390,[id(1027,'definition/task-instruction-'+(i?'two':'one'))])}];})]);
 return {initialState:enc(state.canonicalValue()),orderedInputs:enc(list([1,2,3,4,5,6].map(t=>{const probe=t===1||t===5;return list([signed(t),u(probe?110:40),id(1001,probe?'event/regulatory-diagnostic-probe':'event/deliberation-opportunity'),probe?r(333,[id(1027,'definition/regulatory-diagnostic-probe')]):r(377,[id(1000,'observer/bridge-subject'),id(1027,'definition/task-workspace')]),list([])]);}))),runSeed:new Uint8Array(32)};
}
function replace(v:CanonicalValue,n:bigint,next:CanonicalValue){const x=rec(v,132n);return record(x.schema,new Map([...x.fields].map(([k,v])=>[k,k===n?next:v])));}
function walk(v:CanonicalValue,change:(v:CanonicalValue)=>CanonicalValue):CanonicalValue {
 const changed=change(v);if(changed!==v)return changed;if(typeof v==='boolean')return v;
 if(v.kind==='record')return record(v.schema,new Map([...v.fields].map(([k,v])=>[k,walk(v,change)])));
 if(v.kind==='list'||v.kind==='set')return (v.kind==='list'?list:set)(v.items.map(v=>walk(v,change)));
 if(v.kind==='map')return map(v.entries.map(([k,v])=>[walk(k,change),walk(v,change)]));
 return v;
}
function deadlineSource(){const s=source();return {...s,registry:enc(walk(decode(s.registry),v=>{
 if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;const name=f(v,1n);if(typeof name==='boolean'||name.kind!=='typedIdentifier'||typeof name.payload==='boolean'||name.payload.kind!=='text'||!['definition/task-a','definition/task-b'].includes(name.payload.value))return v;
 const deadline=name.payload.value==='definition/task-a'?2:3,body=rec(f(v,4n),370n),next=record(body.schema,new Map([...body.fields].map(([k,v])=>[k,k===6n?signed(deadline):v])));return record(v.schema,new Map([...v.fields].map(([k,v])=>[k,k===4n?next:v])));
 }))};}
describe('cognitive public factory and complete-prefix persistence',()=>{
 let model:CognitiveModel;
 beforeAll(async()=>{model=await prepareCognitiveModel(source());});
 it('copies exact public data and rejects capabilities/accessors without invoking them',async()=>{
  const get=vi.fn();await expect(createCognitiveRun(model,Object.defineProperty(data(),'orderedInputs',{get}))).rejects.toThrow('data-only');expect(get).not.toHaveBeenCalled();
  await expect(createCognitiveRun({} as CognitiveModel,data())).rejects.toThrow('prepared');
  await expect(createCognitiveRun(model,{...data(),handler:()=>{}} as never)).rejects.toThrow('data-only');
  const original=data(),run=createCognitiveRun(model,original);original.initialState.fill(0);expect((await run).snapshot().clock).toBe(0n);
 });
 it('executes the exact27-event deadline overlap; ceiling26 rejects atomically',async()=>{
  const handle=await prepareCognitiveModel(deadlineSource()),run=await createCognitiveRun(handle,data());await run.settleNextInstant();const first=rec(decode(run.save()),132n),beforeRows=items(f(first,11n),'list').length;
  await run.settleNextInstant();const next=rec(decode(run.save()),132n);expect(items(f(next,11n),'list').length-beforeRows).toBe(27);expect((f(rec(f(next,6n),131n),1n) as {value:bigint}).value-(f(rec(f(first,6n),131n),1n) as {value:bigint}).value).toBe(26n);
  const Original=schedulerModule.DeterministicScheduler,spy=vi.spyOn(schedulerModule,'DeterministicScheduler').mockImplementation(function(config:schedulerModule.SchedulerConfiguration<AuthoritativeState>){expect(config.maxSettlementWorkPerSimulationInstant).toBe(27n);return new Original({...config,maxSettlementWorkPerSimulationInstant:26n});} as never);
  try{const small=await createCognitiveRun(handle,data());await small.settleNextInstant();const before=small.snapshot();await expect(small.settleNextInstant()).rejects.toMatchObject({code:'CASCADE_LIMIT_EXCEEDED'});expect(small.snapshot().state).toEqual(before.state);expect(small.snapshot().trace).toEqual(before.trace);expect(small.snapshot().outputs).toEqual(before.outputs);}finally{spy.mockRestore();}
 },30000);
 it('rebuilds actual pre-save draws and matches the complete continuation byte for byte',async()=>{
  const d=data(),run=await createCognitiveRun(model,d);await run.settleNextInstant();await run.settleNextInstant();
  const rows=items(decode(run.snapshot().trace),'list').map(v=>rec(v,160n));expect(rows.some(v=>items(f(v,14n),'list').length>0)).toBe(true);
  const save=run.save(),projection=items(f(rec(decode(save),132n),9n),'set');expect(projection.length).toBeGreaterThanOrEqual(6);
  const restored=await restoreCognitiveRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save});expect(restored.save()).toEqual(save);
  while(await run.settleNextInstant()){expect(await restored.settleNextInstant()).toBe(true);expect(restored.save()).toEqual(run.save());}expect(await restored.settleNextInstant()).toBe(false);
 },30000);
 it('rejects stale projection, missing trace and changed outputs at whole-save equality',async()=>{
  const d=data(),run=await createCognitiveRun(model,d);await run.settleNextInstant();await run.settleNextInstant();const save=decode(run.save());
  for(const [field,value] of [[9n,set([])],[11n,list([])],[12n,list([])]] as const)await expect(restoreCognitiveRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:enc(replace(save,field,value))})).rejects.toThrow('whole-save');
 },30000);
 it('rebuilds consumed addresses even when genuine choices leave no retained identity contribution',async()=>{
  let runtime:ReturnType<typeof runtimeModule.createCognitiveRuntime>|undefined;const make=runtimeModule.createCognitiveRuntime,capture=vi.spyOn(runtimeModule,'createCognitiveRuntime').mockImplementation((...args)=>runtime=make(...args));
  try{const s=equalCriteriaSource(),d=data(),run=await createCognitiveRun(await prepareCognitiveModel(s),d);await run.settleNextInstant();await run.settleNextInstant();
   const addresses=runtime!.committedRandomAddressKeys();expect(addresses.length).toBeGreaterThan(0);expect(runtime!.snapshot().state.entries().filter(e=>e.path.rootStateTypeId===415n)).toEqual([]);
   const qualifications=items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===429n);expect(qualifications).toHaveLength(1);expect(f(rec(f(rec(qualifications[0],429n),3n),430n),1n)).toEqual(u(2));
   const save=run.save(),restored=await restoreCognitiveRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save});expect(runtime!.committedRandomAddressKeys()).toEqual(addresses);
   await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());expect(runtime!.committedRandomAddressKeys().length).toBeGreaterThan(addresses.length);
  }finally{capture.mockRestore();}
 },30000);
 it('rejects independent retained-root, instruction, seed and prior-draw substitutions',async()=>{
  const d=data(),run=await createCognitiveRun(model,d);await run.settleNextInstant();await run.settleNextInstant();const save=rec(decode(run.save()),132n);
  const state=f(save,5n),changedRoot=walk(state,v=>typeof v!=='boolean'&&v.kind==='typedIdentifier'&&v.namespaceId===1135n?typedIdentifier(1135,u(999)):v);
  const changedInstruction=walk(state,v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===390n?r(390,[id(1027,'definition/task-instruction-two')]):v);
  const savedRun=rec(f(save,3n),104n),changedSeed=record(savedRun.schema,new Map([...savedRun.fields].map(([k,v])=>[k,k===4n?bytes(new Uint8Array(32).fill(1)):v])));
  const changedDraw=walk(f(save,11n),v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===411n?record(v.schema,new Map([...v.fields].map(([k,v])=>[k,k===5n?u(999):v]))):v);
  for(const [field,value] of [[5n,changedRoot],[5n,changedInstruction],[3n,changedSeed],[11n,changedDraw]] as const)await expect(restoreCognitiveRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:enc(replace(save,field,value))})).rejects.toThrow();
  await expect(restoreCognitiveRun(source(),{initialState:d.initialState,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').slice(1))),save:run.save()})).rejects.toThrow('commitments differ');
 },30000);
 it('rolls back a final identity trace failure after genuine draws and retries with identical candidate bytes',async()=>{
  let runtime:ReturnType<typeof runtimeModule.createCognitiveRuntime>|undefined;const make=runtimeModule.createCognitiveRuntime,capture=vi.spyOn(runtimeModule,'createCognitiveRuntime').mockImplementation((...args)=>runtime=make(...args));
  let failed=false;const originalTrace=traceModule.traceRecordValue,trace=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{if(value.event.dueAt===2n&&typeof value.event.eventTypeId.payload!=='boolean'&&value.event.eventTypeId.payload.kind==='text'&&value.event.eventTypeId.payload.value==='event/task-identity-application'){failed=true;throw Error('after actual identity patch');}return originalTrace(value);});
  try{const d=data(),run=await createCognitiveRun(model,d);await run.settleNextInstant();const before=runtime!.snapshot(),save=run.save(),addresses=runtime!.committedRandomAddressKeys();
   await expect(run.settleNextInstant()).rejects.toThrow('after actual identity patch');expect(failed).toBe(true);const after=runtime!.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const field of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[field]).toEqual(before[field]);expect(runtime!.committedRandomAddressKeys()).toEqual(addresses);
   trace.mockRestore();const retry=await restoreCognitiveRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save}),control=await createCognitiveRun(model,d);await control.settleNextInstant();await control.settleNextInstant();await retry.settleNextInstant();expect(retry.save()).toEqual(control.save());
  }finally{trace.mockRestore();capture.mockRestore();}
 },30000);
 it.each(['missing-I','duplicate-I','missing-A','unexpected-P'] as const)('rejects %s before any common-stage prior read',async mode=>{
  const Original=schedulerModule.DeterministicScheduler;let checked=false;
  const scheduler=vi.spyOn(schedulerModule,'DeterministicScheduler').mockImplementation(function(config:schedulerModule.SchedulerConfiguration<AuthoritativeState>){const a=config.adaptationSettlement!;return new Original({...config,adaptationSettlement:{...a,prepare(events,state,instant){if(instant!==2n)return a.prepare(events,state,instant);
   const I=events.find(e=>e.eventTypeId.payload===undefined?false:typeof e.eventTypeId.payload!=='boolean'&&e.eventTypeId.payload.kind==='text'&&e.eventTypeId.payload.value==='event/task-identity-application')!;
   const changed=mode==='missing-I'?events.filter(e=>e!==I):mode==='duplicate-I'?[...events,I]:mode==='missing-A'?[I]:[...events,{...I,eventTypeId:id(1001,'event/measurement-prediction-application')}];
   const read=vi.spyOn(AuthoritativeState.prototype,'read');try{expect(()=>a.prepare(changed,state,instant)).toThrow('exactly A + I');expect(read).not.toHaveBeenCalled();checked=true;}finally{read.mockRestore();}throw Error('mutant stage rejected before priors');
  }}});} as never);
  try{const run=await createCognitiveRun(model,data());await run.settleNextInstant();const before=run.snapshot();await expect(run.settleNextInstant()).rejects.toThrow('mutant stage rejected');expect(checked).toBe(true);expect(run.snapshot().state).toEqual(before.state);expect(run.snapshot().trace).toEqual(before.trace);await expect(run.settleNextInstant()).rejects.toThrow();}finally{scheduler.mockRestore();}
 },30000);
});



