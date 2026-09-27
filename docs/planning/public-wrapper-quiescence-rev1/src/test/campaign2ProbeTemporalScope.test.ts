import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,map,record,signed,unsigned,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {simInstant,INT64_MAX} from '../substrate/time';
import {compileBoundedModelDeclarations} from '../campaign2/modelPackaging';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileProbeExecution} from '../campaign2/probeExecution';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {prepareCampaign2Model} from '../campaign2/factory';
import {decodeProbeReview,probeRecord} from '../campaign2/probeCodecs';
import {campaign2Record as r} from '../campaign2/codecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';

function replace(v:CanonicalValue,n:bigint,value:CanonicalValue){if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture');return record(v.schema,new Map([...v.fields,[n,value]]));}
function temporalDeclarations(){
 const source={...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES},slots=[...items(decodeProbeReview(source.registry),'list')];
 let registration:CanonicalValue|undefined;
 slots[0]=set(items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
  const body=f(v,4n);if(typeof body==='boolean'||body.kind!=='record'||body.schema.typeId!==283n)return v;
  const reference=rec(f(body,2n),282n),parameters=f(reference,2n);if(typeof parameters==='boolean'||parameters.kind!=='map')throw Error('fixture');
  const dynamic=map(parameters.entries.map(([k,p])=>[k,replace(replace(p,2n,signed(1)),3n,unsigned(INT64_MAX))]));
  registration=replace(v,4n,replace(body,2n,replace(reference,2n,dynamic)));return registration;
 }));
 if(!registration)throw Error('missing REG');
 return {source:{...source,registry:enc(list(slots))},registry:list(slots),registration};
}

it('PROBE-F component witness: shared dynamic REG, matched time and exact D difference; no public model widening',async()=>{
 const dynamic=temporalDeclarations(),before=enc(dynamic.registry),base=await compileBoundedModelDeclarations(firstTraceModel());
 const reg=compileRegulatoryReferences(enc(set([dynamic.registration])),base.compiled.content),probe=compileProbeExecution(dynamic.registry,reg);
 const read=(at:bigint,d:bigint)=>{
  const state=new AuthoritativeState(d===0n?[]:[{path:probe.path,value:r('RegulatoryAdaptationValue',{Magnitude:signed(d)})}]),stateBefore=enc(state.canonicalValue());
  let ordinal=0n;const execution=probe.begin(at);
  const source={eventId:0n,eventSequence:0n,dueAt:simInstant(at),phase:110n,eventTypeId:PROBE_SOURCE_EVENT,payload:probeRecord(333,[probe.definitionId]),dependencies:list([]),causalParentEventIds:[]};
  const result=execution.execute(source,state,{allocateRuntimeId:()=>ordinal++});probe.validateReadEvidence(result.reads);
  const children=result.plan.emissions().map((e,i)=>({...e,eventId:BigInt(i+1),eventSequence:BigInt(i+1),causalParentEventIds:[0n]}));result.plan.bindAllocatedChildren(children);
  const observation=execution.execute(children[0],state,{allocateRuntimeId:()=>ordinal++});
  expect(enc(state.canonicalValue())).toEqual(stateBefore);execution.abort();
  return {n:f(rec(result.outputs[0],334n),4n),q:f(rec(f(rec(observation.outputs[0],203n),6n),204n),2n),truth:enc(result.outputs[0]),observation:enc(observation.outputs[0])};
 };
 const early=read(INT64_MAX-1n,0n),a=read(INT64_MAX,0n),same=read(INT64_MAX,0n),b=read(INT64_MAX,1n);
 expect(early.n).toEqual(signed(50));expect(a.n).toEqual(signed(51));expect(b.n).toEqual(signed(52));
 // Equal D across times isolates reference drift, not adaptation. Matched T isolates D.
 expect(early.q).toEqual(rational(50n,10n));expect(a.q).toEqual(rational(51n,10n));expect(b.q).toEqual(rational(52n,10n));
 expect(a).toEqual(same);expect(a.observation).not.toEqual(b.observation);expect(enc(dynamic.registry)).toEqual(before);
 // Component declarations are valid REG, but this frozen public specimen admits only boolean variants.
 await expect(prepareCampaign2Model(dynamic.source)).rejects.toThrow();
 await expect(prepareCampaign2Model({...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES})).resolves.toBeDefined();
});
