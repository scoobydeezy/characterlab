/** defining-native-rehearsal/0.1-candidate. Internal actual-event adapters. */
import {canonicalEncode as enc,list,set,map,signed,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity,dataText as txt,dataKey as key,type RecordValue} from '../campaign2/canonicalData';
import {generalSubject,generalId as id,generalRecord as gr} from './generalBindingProfile';
import {definingMemoryOwnerRecord as r,decodeDefiningMemoryOwner as decode} from './definingMemoryOwnerCodecs';
import {decodeDefiningRehearsal as decodeRehearsal} from './definingRehearsalCodecs';
import {canonicalAcquisitionChildren} from './generalMemoryOwner';
import {canonicalOperationKeyIndex} from './canonicalChildKeys';
import {groupRetainedPositionTrial} from './retainedContextGrouping';
import {qualifyGoalOutcome} from './goalOutcomeQualification';
import type {MaintenanceGoal} from './bodilyMaintenanceGoal';
import {prepareOrdinaryMemoryBatch,prepareAgeOnlyMemoryBatchControl,prepareUseOnlyMemoryBatchControl,prepareSharedProtectionMemoryBatchControl} from './ordinaryMemoryBatch';
import {settleEventPresentationHistory} from './eventPresentationSettlement';
import type {SignificantAcquisition} from './directionalSignificanceState';
import type {GovernanceKind} from './formationGovernance';
import type {DefiningLaw} from './definingMemoryExperiment';
const who=generalSubject();
function fail(why:string):never{throw Error('DEFINING_MEMORY_OWNER: '+why);}
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload),time=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='signed'?v.value:fail('time');
const rational=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='rational'?Q.of(v.numerator,v.denominator):fail('rational');
const interval=(v:CanonicalValue)=>{const value=rec(v,556n);return {lower:rational(f(value,1n)),upper:rational(f(value,2n))};};
const range=(x:{lower:Q;upper:Q})=>gr(556,[q(x.lower.numerator,x.lower.denominator),q(x.upper.numerator,x.upper.denominator)]);
export const definingMemoryPath=(root:630|632|1485):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:who.character}]});
const protocolPath:StatePath={rootStateTypeId:581n,fieldId:1n,selectors:[]};
function read(state:AuthoritativeState,root:630|632|1485){const path=definingMemoryPath(root),value=state.read(path);if(!value.presence)fail('missing owner');return {value:value.value!,record:{accessorId:id(1028,'accessor/defining-memory/'+root),path,presence:true,value:value.value,derivedSources:[]} as ActualReadRecord};}
function ledger(state:AuthoritativeState){const memory=read(state,630),prior=items(f(rec(memory.value,555n),1n),'list').map(v=>rec(v,554n));for(const a of prior)if(key(f(a,2n))!==key(who.observer))fail('foreign acquisition');return {memory,prior};}
const kind=(a:RecordValue):GovernanceKind=>(f(a,6n) as RecordValue).schema.typeId===552n?'EventContinuant':'Interoceptive';
/** Prepared against common B0. Publication and attribution provenance are authenticated by the runtime. */
export function prepareDefiningRehearsalSettlement(state:AuthoritativeState,now:bigint,law:DefiningLaw,batchValue:CanonicalValue){
 if(![39n,40n,41n].includes(now))fail('settlement clock');const carried=rec(decodeRehearsal(enc(batchValue)),1492n);if(time(f(carried,1n))!==now||uint(f(carried,2n))!==1n)fail('rehearsal batch');const {memory,prior}=ledger(state),history=read(state,632),protocolRead=state.read(protocolPath);if(!protocolRead.presence)fail('protocol absent');
 const protocol=rec(protocolRead.value!,580n),entries=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='map'?v.entries:fail('protocol map'),sources=entries(f(protocol,1n)),successes=entries(f(protocol,2n)),sourceIndex=canonicalOperationKeyIndex(sources.map(([k])=>k));
 const source=(v:CanonicalValue)=>{const row=rec(v,577n);if(key(f(row,1n))!==key(who.character))fail('protocol holder');const admitted=sources.find(([k])=>key(k)===key(v));if(!admitted)fail('protocol source');return {character:'holder',source:sourceIndex.label(v),kind:(uint(f(rec(admitted[1],578n),1n))===1n?'EventContinuant':'Interoceptive') as GovernanceKind};};
 const children=new Map(prior.map(a=>[ordinal(f(a,1n)),canonicalAcquisitionChildren(a,true)])),childIndex=canonicalOperationKeyIndex([...children.values()].flatMap(cs=>cs.map(c=>c.childKey)));
 const memoryRows:SignificantAcquisition[]=prior.map(a=>({id:ordinal(f(a,1n)),kind:kind(a),acquiredAt:time(f(a,3n)),units:children.get(ordinal(f(a,1n)))!.map(c=>({key:childIndex.label(c.childKey),views:c.views,useProtection:c.useProtection,outcomeSignificanceDirections:c.directions}))}));
 const attribution=rec(f(carried,5n),575n);if(time(f(attribution,5n))!==now||key(f(attribution,2n))!==key(who.observer)||key(f(attribution,3n))!==key(who.character))fail('actual rehearsal attribution');
 const consumed=items(f(attribution,8n),'set').map(v=>{const address=rec(v,573n),acquisition=ordinal(f(address,1n)),child=f(address,2n);if(!children.get(acquisition)?.some(c=>key(c.childKey)===key(child)))fail('live consumed child');return {acquisition,unit:childIndex.label(child)};});
 const publications=items(f(carried,3n),'list').map(v=>rec(v,590n));
 const presentations=publications.flatMap(pub=>{if(time(f(pub,3n))!==now||key(f(pub,2n))!==key(who.character))fail('actual rehearsal publication');const winner=f(pub,4n) as RecordValue;return winner.schema.typeId===588n?[{recollection:ordinal(f(pub,1n)),acquisition:ordinal(f(rec(f(winner,1n),587n),1n))}]:[];});
 const prepare={SignificanceFirst:prepareOrdinaryMemoryBatch,SharedProtection:prepareSharedProtectionMemoryBatchControl,UseOnly:prepareUseOnlyMemoryBatchControl,AgeOnly:prepareAgeOnlyMemoryBatchControl}[law];if(!prepare)fail('retention model');
 const batch=prepare({observer:'observer',character:'holder',priorMemory:memoryRows,priorProtocol:{domain:sources.map(([k])=>source(k)),successes:successes.map(([k,v])=>{const row=rec(v,579n);return {...source(k),acquisition:ordinal(f(row,1n)),formedAt:time(f(row,2n)),completeLoss:f(row,3n)===true};})},incoming:[],formed:[],freshMemory:[],now,sourceLimit:32,capacity:{EventContinuant:8,Interoceptive:8},useResults:uint(f(attribution,7n))===1n?[consumed]:[],significance:[]});
 try{const result=batch.finish(batch.resolve()),rows=result.memory.map(a=>{const original=prior.find(v=>ordinal(f(v,1n))===a.id)!,content=rec(f(original,6n),(f(original,6n) as RecordValue).schema.typeId),event=a.kind==='EventContinuant';const units=a.units.map(unit=>{const child=children.get(a.id)!.find(c=>childIndex.label(c.childKey)===unit.key)!;return gr(event?550:551,[child.evidence,unit.useProtection,set(unit.outcomeSignificanceDirections.map(d=>u(d==='MovingCloser'?1:2)))]);});const fields=new Map(original.fields);fields.set(6n,gr(event?552:553,event?[f(content,1n),list(units)]:[list(units)]));return gr(554,fields);});
  const ledgerValue=gr(555,[list(rows)]),protocolValue=gr(580,[map(result.protocol.domain.map(s=>[sourceIndex.original(s.source),gr(578,[u(s.kind==='EventContinuant'?1:2)])])),map(result.protocol.successes.map(s=>[sourceIndex.original(s.source),gr(579,[typedIdentifier(1145,u(s.acquisition)),signed(s.formedAt),s.completeLoss])]))]);
  const histories=items(f(rec(history.value,595n),1n),'list').map(v=>{const row=rec(v,594n);return {acquisition:ordinal(f(row,1n)),instants:items(f(row,2n),'list').map(time)};});
  const nextHistory=settleEventPresentationHistory({now,priorAcquisitions:memoryRows.map(({id,kind,acquiredAt})=>({id,kind,acquiredAt})),formed:[],survivingAcquisitions:result.memory.map(a=>a.id),priorHistory:histories,presentations}),historyValue=gr(595,[list(nextHistory.map(h=>gr(594,[typedIdentifier(1145,u(h.acquisition)),list(h.instants.map(signed))])))]);
  const patch=(path:StatePath,old:CanonicalValue,value:CanonicalValue):StatePatch=>({operations:key(old)===key(value)?[]:[{kind:'set',path,expected:{presence:true,value:old},newValue:value}]});
  return {memoryPatch:patch(definingMemoryPath(630),memory.value,ledgerValue),historyPatch:patch(definingMemoryPath(632),history.value,historyValue),protocolPatch:patch(protocolPath,protocol,protocolValue),memoryReads:[memory.record],historyReads:[history.record],protocolRead,retained:result.memory.map(a=>a.id)};
 }finally{batch.close();}
}
