/** Component interventions are deliberately separate from the closed public profile. */
import {describe,it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,rational,signed,unsigned,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
import {type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {predictionModelReviewSource} from '../campaign2/predictionModelReview';
import {compilePredictionModel} from '../campaign2/predictionModel';
import {createPredictionExecution} from '../campaign2/predictionExecution';
import {createMemoryExecution} from '../campaign2/memoryExecution';
import {beginTransitionIngressV04} from '../campaign2/transitionIngressV04';
import {executeMeasurementIntake} from '../campaign2/measurementExecution';
import {predictionRecord as r} from '../campaign2/predictionCodecs';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
type Model=Awaited<ReturnType<typeof compilePredictionModel>>;
const initial=()=>new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])}]);
function harness(model:Model){
 let ordinal=0n,eventOrdinal=0n;
 const allocator={allocateRuntimeId:()=>ordinal++};
 const allocate=(plan:{emissions():readonly EventEmission[];bindAllocatedChildren(children:readonly ScheduledEvent[]):void},parent:bigint)=>{const events=plan.emissions().map(e=>{const n=eventOrdinal++;return {...e,eventId:n,eventSequence:n,causalParentEventIds:[parent]};});plan.bindAllocatedChildren(events);return events;};
 function m1(state:AuthoritativeState,at:bigint,pointTenths:bigint){
  // Actual producer components, under an explicit retained-D intervention.
  // No public source/model widening and no hand-authored observation payload.
  const probe=model.base.probe,prior=new AuthoritativeState([...state.entries().filter(e=>e.path.rootStateTypeId!==302n),{path:probe.path,value:r(299,[signed(pointTenths-50n)])}]);
  const engine=probe.begin(at),n=eventOrdinal++,event:ScheduledEvent={eventId:n,eventSequence:n,dueAt:simInstant(at),phase:110n,eventTypeId:id(1001,'event/regulatory-diagnostic-probe'),payload:r(333,[probe.definitionId]),dependencies:list([]),causalParentEventIds:[]};
  const result=engine.execute(event,prior,allocator),observedEvent=allocate(result.plan,n)[0],observation=engine.execute(observedEvent,prior,allocator).outputs[0];
  const ingress=beginTransitionIngressV04(model.base.admission,at),intake=allocate(ingress.observeMeasurement(observedEvent,enc(observation)),observedEvent.eventId)[0],token=ingress.admit(intake),occurrence=ingress.allocateMeasurementIdentity(token,allocator),carried=executeMeasurementIntake(observation,model.base.measurement.unit,occurrence);
  ingress.completeMeasurement(token,enc(carried)).bindAllocatedChildren([]);ingress.finish();engine.abort();
  const memory=createMemoryExecution(model.memoryComponent,model.base.measurement.validateOutput,list([]),list([]));memory.begin(at);
  const generated=allocate(memory.observeIntake(intake,carried),intake.eventId),evidence=memory.execute(generated[0],state,allocator).outputs[0];memory.close();
  return {event:generated[0],evidence};
 }
 return {allocator,allocate,m1};
}
describe('prediction component controls; no public producer widening',()=>{
 it('PRED-C/F: held-safe-input hidden D cannot change operands; owner comes from IDN, absent roster blocks prior access',async()=>{
  const model=await compilePredictionModel(predictionModelReviewSource()),h=harness(model),state=initial(),source=h.m1(state,4n,51n),results:CanonicalValue[]=[];
  for(const D of [0,1]){const engine=createPredictionExecution(model,list([]),list([]));engine.begin(4n);const children=h.allocate(engine.observeM1(source.event,source.evidence),source.event.eventId),hidden=new AuthoritativeState([...state.entries(),{path:model.base.probe.path,value:r(299,[signed(D)])}]);
   const result=engine.execute(children[0],hidden,h.allocator),t=rec(result.trace(),160n);results.push(list([f(t,11n),f(t,16n),f(t,17n)]));
   const path=result.patch.operations[0].path;expect(f(rec((path.selectors[0] as {key:CanonicalValue}).key,360n),1n)).toEqual(C);expect(key(C)).not.toBe(key(id(1000,'observer/bridge-subject')));engine.close();
  }
  expect(key(results[0])).toBe(key(results[1]));
  const engine=createPredictionExecution(model,list([]),list([]));engine.begin(4n);const children=h.allocate(engine.observeM1(source.event,source.evidence),source.event.eventId),reads=vi.spyOn(AuthoritativeState.prototype,'read');
  try{expect(()=>engine.execute(children[0],new AuthoritativeState([]),h.allocator)).toThrowError(expect.objectContaining({code:'REQUIRED_PROJECTION_VALUE_ABSENT'}));expect(reads.mock.calls.map(c=>c[0].rootStateTypeId)).toEqual([268n]);}finally{reads.mockRestore();engine.close();}
 },30000);
 it('PRED-P: later read returns committed5 before its instant updates mean to11/2',async()=>{
  const model=await compilePredictionModel(predictionModelReviewSource()),h=harness(model),engine=createPredictionExecution(model,list([]),list([]));let state=initial();
  engine.begin(4n);const first=h.m1(state,4n,50n),firstChildren=h.allocate(engine.observeM1(first.event,first.evidence),first.event.eventId);state=engine.execute(firstChildren[0],state,h.allocator).nextState;engine.prepareCommit();engine.commit();engine.close();
  engine.begin(5n);const read=engine.execute(firstChildren[1],state,h.allocator);expect(f(rec(f(rec(read.outputs[0],366n),3n),361n),1n)).toEqual(rational(5,1));
  const next=h.m1(state,5n,60n),nextChildren=h.allocate(engine.observeM1(next.event,next.evidence),next.event.eventId);state=engine.execute(nextChildren[0],state,h.allocator).nextState;expect(f(rec(state.entries().find(e=>e.path.rootStateTypeId===362n)!.value,361n),1n)).toEqual(rational(11,2));
  expect(firstChildren[1].phase).toBe(40n);expect(nextChildren[0].phase).toBe(140n);expect(nextChildren[1].dueAt).toBe(6n);engine.prepareCommit();engine.commit();engine.close();
 },30000);
 it('PRED-D/H/K: actual generated points, exact mean, original-observation freshness and support limit',async()=>{
  const model=await compilePredictionModel(predictionModelReviewSource());
  const runHistory=(points:bigint[])=>{
   const h=harness(model),engine=createPredictionExecution(model,list([]),list([]));let state=initial();let last:ReturnType<typeof h.m1>|undefined;
   for(let i=0;i<points.length;i++){
    const at=BigInt(4+2*i);engine.begin(at);last=h.m1(state,at,points[i]);const children=h.allocate(engine.observeM1(last.event,last.evidence),last.event.eventId),applied=engine.execute(children[0],state,h.allocator);state=applied.nextState;engine.prepareCommit();engine.commit();engine.close();
    engine.begin(at+1n);engine.execute(children[1],state,h.allocator);engine.prepareCommit();engine.commit();engine.close();
   }
   return {h,engine,state,last:last!,value:rec(state.entries().find(e=>e.path.rootStateTypeId===362n)!.value,361n)};
  };
  const a=runHistory([0n,100n,100n]),b=runHistory([100n,0n,100n]);
  expect(f(a.value,1n)).toEqual(rational(20,3));expect(f(b.value,1n)).toEqual(f(a.value,1n));
  expect(f(a.value,1n)).not.toEqual(rational(10,1));expect(f(a.value,1n)).not.toEqual(rational(15,2));
  const limit=runHistory(Array.from({length:64},()=>50n));expect(items(f(limit.value,2n),'set')).toHaveLength(64);
  limit.engine.begin(132n);const next=limit.h.m1(limit.state,132n,50n),children=limit.h.allocate(limit.engine.observeM1(next.event,next.evidence),next.event.eventId);
  expect(()=>limit.engine.execute(children[0],limit.state,limit.h.allocator)).toThrowError(expect.objectContaining({code:'PREDICTION_EVIDENCE_LIMIT_EXCEEDED'}));limit.engine.close();
  // A genuinely new M1/carriage wrapper cannot turn the retained original observation into new support.
  const freshEngine=createPredictionExecution(model,list([]),list([])),fresh=harness(model);freshEngine.begin(140n);
  const source=fresh.m1(limit.state,140n,50n),newEvidence=rec(source.evidence,342n),newCarriage=rec(f(newEvidence,2n),337n),oldObservation=f(rec(f(rec(limit.last.evidence,342n),2n),337n),2n);
  const wrapper=record(newEvidence.schema,new Map([...newEvidence.fields,[2n,record(newCarriage.schema,new Map([...newCarriage.fields,[2n,oldObservation]]))]]));
  const pair=fresh.allocate(freshEngine.observeM1(source.event,wrapper),source.event.eventId);
  expect(()=>freshEngine.execute(pair[0],limit.state,fresh.allocator)).toThrowError(expect.objectContaining({code:'PREDICTION_OBSERVATION_ALREADY_APPLIED'}));freshEngine.close();
 },30000);
 it('PRED-G: source-domain alternatives fail before any prediction state access',async()=>{
  const model=await compilePredictionModel(predictionModelReviewSource()),h=harness(model),state=initial(),source=h.m1(state,4n,50n),evidence=rec(source.evidence,342n),carried=rec(f(evidence,2n),337n),obs=rec(f(carried,2n),203n);
  const change=(v:ReturnType<typeof rec>,n:bigint,x:CanonicalValue)=>record(v.schema,new Map([...v.fields,[n,x]]));
  const observationMutants=[change(obs,4n,id(1003,'channel/foreign')),change(obs,3n,semanticReferentFromAuthoredContent(governedContentDefinitionId('object/bridge-exposure'))),change(obs,6n,r(204,[true,rational(11,1),true,rational(11,1)])),change(obs,8n,rational(2,1))];
  const mutants=[...observationMutants.map(o=>change(evidence,2n,change(carried,2n,o))),change(evidence,2n,change(carried,3n,id(1039,'unit/foreign')))];
  for(const mutant of mutants){const engine=createPredictionExecution(model,list([]),list([]));engine.begin(4n);const reads=vi.spyOn(AuthoritativeState.prototype,'read');try{expect(()=>engine.observeM1(source.event,mutant)).toThrow();expect(reads).not.toHaveBeenCalled();}finally{reads.mockRestore();engine.close();}}
 },30000);
 it('PRED-I/J: collision precedes second prior read; exact owned patch and illegal foreign path',async()=>{
  const model=await compilePredictionModel(predictionModelReviewSource()),h=harness(model),engine=createPredictionExecution(model,list([]),list([])),state=initial();engine.begin(4n);
  const source=h.m1(state,4n,50n),one=h.allocate(engine.observeM1(source.event,source.evidence),source.event.eventId),two=h.allocate(engine.observeM1(source.event,source.evidence),source.event.eventId);
  const applied=engine.execute(one[0],state,h.allocator);expect(applied.patch.operations).toHaveLength(1);expect(applied.nextState.entries().filter(e=>e.path.rootStateTypeId!==362n)).toEqual(state.entries());
  const reads=vi.spyOn(AuthoritativeState.prototype,'read');try{expect(()=>engine.execute(two[0],state,h.allocator)).toThrowError(expect.objectContaining({code:'PREDICTION_TARGET_COLLISION'}));expect(reads.mock.calls.map(c=>c[0].rootStateTypeId)).toEqual([268n]);}finally{reads.mockRestore();}
  for(const bad of [[],[one[0]],[one[0],two[0]],[{...one[0],eventTypeId:id(1001,'event/measurement-episode-formation'),causalParentEventIds:[999n]},two[0]]])expect(()=>engine.validatePair(bad)).toThrowError(expect.objectContaining({code:'PREDICTION_STAGE_VIOLATION'}));
  const patch=applied.patch,foreign={...patch.operations[0],path:{...patch.operations[0].path,selectors:[{kind:'mapKey' as const,key:r(360,[C,id(1027,'definition/foreign')])}]}};
  expect(()=>model.stateModel.applyPatch(state,{operations:[foreign]},id(1025,'authority/belief-expectation'),{writableRoots:[362n],targetPaths:[patch.operations[0].path]})).toThrow();
  expect(()=>model.stateModel.applyPatch(state,patch,id(1025,'authority/measurement-episode-formation'))).toThrow();engine.close();
 },30000);
});

