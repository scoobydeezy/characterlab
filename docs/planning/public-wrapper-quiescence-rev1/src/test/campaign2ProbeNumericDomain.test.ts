import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,map,record,signed,unsigned,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
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

it('PROBE-G generic signed domain: exact negative/zero/fraction/endpoints, no clipping, frozen profile excludes widened domain',async()=>{
 const source={...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES},slots=[...items(decodeProbeReview(source.registry),'list')];let registration:CanonicalValue|undefined;
 slots[0]=set(items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
  const body=f(v,4n);if(typeof body==='boolean'||body.kind!=='record'||body.schema.typeId!==283n)return v;
  const reference=rec(f(body,2n),282n),anchors=f(reference,1n),parameters=f(reference,2n);
  if(typeof anchors==='boolean'||anchors.kind!=='map'||typeof parameters==='boolean'||parameters.kind!=='map')throw Error('fixture');
  const updated=replace(replace(reference,1n,map(anchors.entries.map(([k,a])=>[k,replace(a,1n,signed(0))]))),2n,map(parameters.entries.map(([k,p])=>[k,replace(p,4n,signed(-100))])));
  registration=replace(v,4n,replace(replace(body,1n,replace(f(body,1n),2n,signed(-100))),2n,updated));return registration;
 }));
 const registry=list(slots),before=enc(registry),base=await compileBoundedModelDeclarations(firstTraceModel());
 const reg=compileRegulatoryReferences(enc(set([registration!])),base.compiled.content),probe=compileProbeExecution(registry,reg);
 for(const n of [-101n,-100n,-99n,-1n,0n,1n,99n,100n,101n]){
  const state=new AuthoritativeState(n===0n?[]:[{path:probe.path,value:r('RegulatoryAdaptationValue',{Magnitude:signed(n)})}]),beforeState=enc(state.canonicalValue());
  const execution=probe.begin(4n),sourceEvent={eventId:0n,eventSequence:0n,dueAt:simInstant(4n),phase:110n,eventTypeId:PROBE_SOURCE_EVENT,payload:probeRecord(333,[probe.definitionId]),dependencies:list([]),causalParentEventIds:[]};let ordinal=0n;
  const allocator={allocateRuntimeId:()=>ordinal++};
  if(n< -100n||n>100n){expect(()=>execution.execute(sourceEvent,state,allocator)).toThrow();expect(ordinal).toBe(0n);}
  else{
   const result=execution.execute(sourceEvent,state,allocator);expect(result.outputs).toHaveLength(1);expect(f(rec(result.outputs[0],334n),4n)).toEqual(signed(n));
   const children=result.plan.emissions().map(e=>({...e,eventId:1n,eventSequence:1n,causalParentEventIds:[0n]}));result.plan.bindAllocatedChildren(children);
   const out=execution.execute(children[0],state,allocator);expect(out.outputs).toHaveLength(1);
   const observation=rec(out.outputs[0],203n),interval=rec(f(observation,6n),204n);
   expect(f(interval,2n)).toEqual(rational(n,10n));expect(f(interval,4n)).toEqual(rational(n,10n));
   expect(f(observation,9n)).toEqual(list([]));expect(f(observation,10n)).toEqual(list([]));
  }
  expect(enc(state.canonicalValue())).toEqual(beforeState);execution.abort();
 }
 expect(enc(registry)).toEqual(before);await expect(prepareCampaign2Model({...source,registry:before})).rejects.toThrow();
});
