import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,ContractReadProjection} from '../substrate/state';
import * as stateModule from '../substrate/state';
import {prepareCampaign2Model} from '../campaign2/factory';
import {decodeCampaign2} from '../campaign2/codecs';
import {dataItems as items,dataField as f} from '../campaign2/canonicalData';
import {compileBoundedModelDeclarations} from '../campaign2/modelPackaging';
import {firstModelCandidate,candidateId as id} from '../campaign2/firstModelCandidate';
import {compileOrderedInputProfile,beginAuthoredSourceInstant,AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {beginTransitionIngressV04} from '../campaign2/transitionIngressV04';
import {compileAdaptationEvaluator,adaptationExecutionDiffs} from '../campaign2/adaptationEvaluation';
import {campaign2Record as r} from '../campaign2/codecs';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
async function fixture(gated=false){
 const model=firstModelCandidate();
 if(gated){
  const slots=[...items(decodeCampaign2(model.registry),'list')];
  slots[0]=set(items(slots[0],'set').map(v=>{
   if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
   const d=f(v,4n);if(typeof d==='boolean'||d.kind!=='record'||d.schema.typeId!==311n)return v;
   const gate=r('AdaptationGate',{VariantTag:unsigned(2),Source:r('AdaptationReadTarget',{StateFamilyId:f(d,2n),LeafFamilyId:f(d,3n),KeyDerivation:f(d,4n)})});
   return record(v.schema,new Map([...v.fields,[4n,record(d.schema,new Map([...d.fields,[5n,gate]]))]]));
  }));model.registry=enc(list(slots));
 }
 const m=await compileBoundedModelDeclarations(model),character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const facts=[r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(1)}),r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:id(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(1)})];
 const inputs=await compileOrderedInputProfile(m.profiles.orderedInput,m.compiled.content,m.domains).create(enc(list(facts.map(Fact=>list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact}),list([])])))),enc(set([])),m.modelIdentity,new Uint8Array(32));
 const source=beginAuthoredSourceInstant(inputs,2n),ingress=beginTransitionIngressV04(m.admission,2n);let runtime=0n,eventId=2n;
 const allocator={allocateRuntimeId:()=>runtime++};
 const tokens=inputs.initialEvents.flatMap(event=>{
  const plan=ingress.observeAuthoredSource(event,enc(source.execute(event,allocator)));
  const children=plan.emissions().map(e=>({...e,eventId:eventId,eventSequence:eventId++,causalParentEventIds:[event.eventId]}));
  plan.bindAllocatedChildren(children);return children.map(c=>ingress.admit(c));
 });
 const initial=new AuthoritativeState([]),batch=compileAdaptationEvaluator(m.adaptation,m.domains,m.compiled.stateModel).prepare(tokens,2n).begin(initial);
 return {tokens,batch,allocator,initial,close:()=>{ingress.abort();source.close();}};
}
it.each(['omit','reverse','share','encoded'])('AD-E7 staged read evidence rejects %s substitution',async mode=>{
 const c=await fixture();try{
  const results=c.tokens.map(t=>c.batch.execute(t,c.allocator));
  if(mode==='omit')results[0].actualReadRecords.splice(0,1);
  if(mode==='reverse')results[0].actualReadRecords.reverse();
  if(mode==='share')results[1].actualReadRecords.splice(0,1,results[0].actualReadRecords[0]);
  if(mode==='encoded')results[0].actualReads.splice(0,1);
  expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code:'TRACE_VALIDATION_FAILURE'}));
  for(const result of results)expect(()=>adaptationExecutionDiffs(result)).toThrow(/completed/);
  expect(c.initial.entries()).toEqual([]);
 }finally{c.close();}
});
it('AD-E7 actual projection-object sharing is rejected during the second rule',async()=>{
 const c=await fixture(),Original=stateModule.ContractReadProjection;
 let shared:ContractReadProjection<Record<string,stateModule.ProjectionBinding>>|undefined;
 const spy=vi.spyOn(stateModule,'ContractReadProjection').mockImplementation(function(...args:ConstructorParameters<typeof Original>){return shared??=new Original(...args);});
 try{
  expect(()=>c.batch.execute(c.tokens[0],c.allocator)).toThrowError(expect.objectContaining({code:'TRACE_VALIDATION_FAILURE'}));
  expect(spy).toHaveBeenCalledTimes(2);expect(spy.mock.results[0].value).toBe(spy.mock.results[1].value);
  expect(c.initial.entries()).toEqual([]);
 }finally{spy.mockRestore();c.close();}
});
it('AD-E7 rejects active target-next-evaluation-gate interleaving before nested reads',async()=>{
 const c=await fixture(true),original=ContractReadProjection.prototype.read;let attempted=false;
 const observed:string[]=[];
 const spy=vi.spyOn(ContractReadProjection.prototype,'read').mockImplementation(function(this:ContractReadProjection<Record<string,stateModule.ProjectionBinding>>,name:string):CanonicalValue|undefined{
  observed.push(name);const result=original.call(this,name);
  if(!attempted){attempted=true;expect(()=>c.batch.execute(c.tokens[1],c.allocator)).toThrowError(expect.objectContaining({code:'ADAPTATION_STAGE_VIOLATION'}));expect(observed).toEqual(['target']);}
  if(observed.length===9)expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code:'ADAPTATION_STAGE_VIOLATION'}));
  return result;
 });
 try{
  c.tokens.forEach(t=>c.batch.execute(t,c.allocator));c.batch.finish();
  expect(attempted).toBe(true);expect(observed).toEqual(Array.from({length:5},()=>['target','gate']).flat());
 }finally{spy.mockRestore();c.close();}
});
it('AD-E7 public model rejects executor binding, read and enumeration hooks without invoking them',async()=>{
 let calls=0;const hook=()=>{calls++;return [];};
 for(const extra of [{projectionBindings:{target:hook}},{readProjection:hook},{actualReadRecords:hook},{enumerateState:hook}])
  await expect(prepareCampaign2Model({...firstModelCandidate(),...extra})).rejects.toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
 expect(calls).toBe(0);
});
it('AD-E7 distinct rule projections publish five isolated read segments',async()=>{
 const c=await fixture(),read=vi.spyOn(ContractReadProjection.prototype,'read');try{
  const results=c.tokens.map(t=>c.batch.execute(t,c.allocator));c.batch.finish();
  expect(read).toHaveBeenCalledTimes(5);expect(new Set(read.mock.instances).size).toBe(5);
  expect(results.map(e=>e.actualReadRecords.length)).toEqual([4,1]);
 }finally{read.mockRestore();c.close();}
});
it.each(['omit','accessor'])('AD-E7 rejects %s instrumentation before staging',async mode=>{
 const c=await fixture(),original=ContractReadProjection.prototype.actualReadRecords;
 const spy=vi.spyOn(ContractReadProjection.prototype,'actualReadRecords').mockImplementation(function(this:ContractReadProjection<Record<string,import('../substrate/state').ProjectionBinding>>){
  const reads=original.call(this);return mode==='omit'?[]:reads.map(r=>({...r,accessorId:id(1028,'accessor/adaptation-gate-prior')}));
 });
 try{expect(()=>c.batch.execute(c.tokens[0],c.allocator)).toThrowError(expect.objectContaining({code:'TRACE_VALIDATION_FAILURE'}));expect(c.initial.entries()).toEqual([]);}
 finally{spy.mockRestore();c.close();}
});
