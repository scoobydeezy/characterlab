import {describe,it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,unsigned,signed,text,typedIdentifier,record,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {predictionModelReviewSource} from '../campaign2/predictionModelReview';
import {predictionRecord as r,decodePrediction as decode} from '../campaign2/predictionCodecs';
import {preparePredictionModel,createPredictionRun,restorePredictionRun} from '../campaign2/predictionFactory';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import * as traceModule from '../substrate/trace';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as executionModule from '../campaign2/predictionExecution';
const id=(n:number,s:string)=>typedIdentifier(n,text(s));
const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
function fixture(times=[4],D=0){
 const state=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])},...(D?[{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey' as const,key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(D)])}]:[])]);
 return {initialState:enc(state.canonicalValue()),orderedInputs:enc(list(times.map(t=>list([signed(t),unsigned(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])])))),runSeed:new Uint8Array(32)};
}
const values=(bytes:Uint8Array,type:bigint)=>items(decode(bytes),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{const q=rec(v,(v as ReturnType<typeof rec>).schema.typeId);return record(q.schema,new Map([...q.fields,[n,x]]));};
describe('measurement-prediction/0.2-candidate runtime',()=>{
 for(const a of [false,true])for(const p of [false,true])for(const F of [false,true])for(const R of [false,true])for(const B of [false,true])for(const P of [false,true])it(`PRED-L/M slots a=${a} p=${p} F=${F} R=${R} B=${B} P=${P}`,async()=>{
  const run=await createPredictionRun(await preparePredictionModel(predictionModelReviewSource(a,p,F,R,B,P)),fixture([4,5]));
  for(const length of [12,26,28]){await run.settleNextInstant();expect(items(decode(run.snapshot().trace),'list')).toHaveLength(length);}
  const snapshot=run.snapshot(),evidence=a&&p;
  expect(values(snapshot.outputs,342n)).toHaveLength(evidence?2:0);
  expect(values(snapshot.outputs,352n)).toHaveLength(evidence&&F&&R?2:0);
  expect(values(snapshot.outputs,366n)).toHaveLength(evidence&&B&&P?2:0);
  expect(items(decode(snapshot.state),'set')).toHaveLength(1+(evidence&&F?2:0)+(evidence&&B?1:0));
  expect(f(rec(f(rec(decode(run.save()),132n),6n),131n),1n)).toEqual(unsigned(18));
  const trace=values(snapshot.trace,160n);
  for(const t of trace){const q=rec(t,160n),n=f(q,7n);if(key(n)!==key(id(1001,'event/measurement-prediction-application'))&&key(n)!==key(id(1001,'event/measurement-prediction-read')))continue;
   const apply=key(n)===key(id(1001,'event/measurement-prediction-application')),reads=items(f(q,11n),'list');expect(reads).toHaveLength((apply?B:P)?2:1);
   expect(items(f(rec(f(q,16n),144n),1n),'list')).toHaveLength(apply&&B?1:0);
  }
 },20000);
 it('PRED-A: learned zero has nonempty support and remains distinguishable from absence',async()=>{
  const data=fixture([4],-50),forecasts:CanonicalValue[][]=[];
  for(const B of [false,true]){const run=await createPredictionRun(await preparePredictionModel(predictionModelReviewSource(true,true,true,true,B,true)),data);await run.settleNextInstant();await run.settleNextInstant();forecasts.push(values(run.snapshot().outputs,366n));}
  expect(forecasts[0]).toEqual([]);expect(forecasts[1]).toHaveLength(1);const v=rec(f(rec(forecasts[1][0],366n),3n),361n);expect(f(v,1n)).toEqual(rational(0,1));expect(items(f(v,2n),'set')).toHaveLength(1);
 },30000);
 it('public prediction, independent memory, exact actual reads and prefix continuation',async()=>{
  const source=predictionModelReviewSource(),data=fixture([4,5]),run=await createPredictionRun(await preparePredictionModel(source),data);
  await run.settleNextInstant();
  const first=run.snapshot();expect(items(decode(first.trace),'list')).toHaveLength(12);expect(items(decode(first.state),'set')).toHaveLength(3);
  const restored=await restorePredictionRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save:run.save()});
  for(let i=0;i<2;i++){await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());}
  const trace=values(run.snapshot().trace,160n),reads=trace.filter(t=>key(f(rec(t,160n),7n))===key(id(1001,'event/measurement-prediction-read')));
  expect(reads).toHaveLength(2);expect(values(run.snapshot().outputs,366n)).toHaveLength(2);
  expect(items(f(rec(reads[0],160n),9n),'list')).toEqual([]);
  expect(f(rec(f(rec(values(run.snapshot().outputs,366n)[0],366n),3n),361n),1n)).toEqual(rational(5,1));
 },30000);
 it('PRED-B: exact5 versus51/10 first changes forecast, not qualitative EVID',async()=>{
  const model=await preparePredictionModel(predictionModelReviewSource()),runs=await Promise.all([0,1].map(D=>createPredictionRun(model,fixture([4],D))));
  for(const run of runs){await run.settleNextInstant();await run.settleNextInstant();}
  expect(runs.map(run=>f(rec(f(rec(values(run.snapshot().outputs,366n)[0],366n),3n),361n),1n))).toEqual([rational(5,1),rational(51,10)]);
  expect(key(list(values(runs[0].snapshot().outputs,270n)))).toBe(key(list(values(runs[1].snapshot().outputs,270n))));
 },30000);
 it('PRED-N: failure after both staged writes rolls back all instant state and side effects',async()=>{
  let runtime:ReturnType<typeof runtimeModule.createAdaptationRuntime>|undefined;
  const original=runtimeModule.createAdaptationRuntime,capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>runtime=original(...args));
  try{const run=await createPredictionRun(await preparePredictionModel(predictionModelReviewSource()),fixture()),before=runtime!.snapshot(),originalTrace=traceModule.traceRecordValue;
   const failure=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(t=>{if(key(t.event.eventTypeId)===key(id(1001,'event/measurement-prediction-application')))throw Error('after prediction patch');return originalTrace(t);});
   try{await expect(run.settleNextInstant()).rejects.toThrow();const after=runtime!.snapshot();for(const k of ['queue','allocators','clock','outputs','committedTrace'] as const)expect(after[k]).toEqual(before[k]);expect(after.state.canonicalValue()).toEqual(before.state.canonicalValue());expect(runtime!.predictionPendingFacts()).toEqual([]);expect(runtime!.memoryPendingFacts()).toEqual([]);}finally{failure.mockRestore();}
  }finally{capture.mockRestore();}
 },30000);
 it('PRED-E: forged associated payload/event rejects before projection',async()=>{
  const original=executionModule.createPredictionExecution;let checked=false;
  const injection=vi.spyOn(executionModule,'createPredictionExecution').mockImplementation((...args)=>{const execution=original(...args);return {...execution,execute(event,state,allocator){if(event.phase===140n){const spy=vi.spyOn(AuthoritativeState.prototype,'read');try{expect(()=>execution.execute({...event,eventId:event.eventId+1n},state,allocator)).toThrow();expect(spy).not.toHaveBeenCalled();checked=true;}finally{spy.mockRestore();}}return execution.execute(event,state,allocator);}};});
  try{const run=await createPredictionRun(await preparePredictionModel(predictionModelReviewSource()),fixture());await run.settleNextInstant();expect(checked).toBe(true);}finally{injection.mockRestore();}
 },30000);
 it('PRED-O: forged mean and cue and preseeded prediction cannot gain restore/initial authority',async()=>{
  const source=predictionModelReviewSource(),model=await preparePredictionModel(source),data=fixture(),run=await createPredictionRun(model,data);await run.settleNextInstant();
  const saved=rec(decode(run.save()),132n),state=f(saved,5n),entries=items(state,'set');
  const corruptState={kind:'set' as const,items:entries.map(e=>{const q=rec(e,151n),v=f(q,2n);return typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===361n?replace(q,2n,replace(v,1n,rational(4,1))):e;})};
  const queue=items(f(saved,7n),'list'),corruptQueue=list(queue.map(e=>{const q=rec(e,130n),v=f(q,6n);return typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===365n?replace(q,6n,replace(v,1n,id(1000,'observer/foreign'))):e;}));
  for(const mutant of [replace(saved,5n,corruptState),replace(saved,7n,corruptQueue)])await expect(restorePredictionRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save:enc(mutant)})).rejects.toThrow();
  await expect(createPredictionRun(model,{...data,initialState:enc(state)})).rejects.toThrow('initial episodes and predictions');
 },30000);
});
