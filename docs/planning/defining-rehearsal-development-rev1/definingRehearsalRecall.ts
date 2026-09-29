/** defining-native-rehearsal/0.1-candidate. Rank/publication over actual owner leaves.
 * Prior cue is an authenticated carried query, not a new perception at this instant.
 */
import {canonicalEncode as enc,list,set,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {AuthoritativeState,ActualReadRecord} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity,dataKey as key,dataText as txt,type RecordValue} from '../campaign2/canonicalData';
import {generalSubject,generalBindingContext,generalRecord as r,generalId as id} from './generalBindingProfile';
import {decodeDefiningRehearsal as decode} from './definingRehearsalCodecs';
import {definingMemoryPath} from './definingMemoryOwner';
import {projectCanonicalRecallPartition} from './canonicalRecallProjection';
import {canonicalAcquisitionChildren} from './generalMemoryOwner';
import {prepareEventRecollections,prepareBodyRecollections,publishRecollections,takeEventPresentation,closeRecollections,type RecollectionView} from './recollectionProduction';
import {atom} from './embodiedMath';
function fail(s:string):never{throw Error('DEFINING_REHEARSAL_RECALL: '+s);}
const time=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='signed'?v.value:fail('time'),ordinal=(v:CanonicalValue)=>uint(identity(v).payload),who=generalSubject();
export function prepareDefiningRecall(state:AuthoritativeState,request:CanonicalValue,now:bigint){
 const req=rec(decode(enc(request)),1491n),mode=uint(f(req,2n)),present=uint(f(req,3n))===1n;
 if(time(f(req,1n))!==now||mode===1n&&(![39n,40n,41n].includes(now)||!present)||mode===2n&&![50n,400n,4000n].includes(now))fail('request clock/mode');
 const priorCue=req.fields.get(4n),focal=req.fields.get(5n);
 if(present!==!!priorCue||mode===1n!==!!focal)fail('request operands');
 if(priorCue){const c=rec(priorCue,623n);if(key(f(c,1n))!==key(who.observer)||time(f(c,3n))!==37n||uint(f(c,5n))!==1n)fail('actual prior cue');}
 if(focal){const c=rec(focal,680n);if(key(f(c,1n))!==key(who.observer)||time(f(c,5n))!==37n)fail('actual prior focal');}
 const reads:ActualReadRecord[]=[],evidence=new Map<bigint,RecordValue>(),views:RecollectionView[]=[];
 let memory:CanonicalValue|undefined;
 function read(root:630|632){const path=definingMemoryPath(root),value=state.read(path);if(!value.presence)fail('missing owner');reads.push({accessorId:id(1028,'accessor/defining-recall/'+root),path,presence:true,value:value.value,derivedSources:[]});return value.value!;}
 const at=(a:RecordValue)=>time(f(a,3n));
 function partition(kind:'EventContinuant'|'Interoceptive'){if(!memory)memory=read(630);const rows=projectCanonicalRecallPartition(memory,who.observer,kind,now,generalBindingContext());rows.forEach(a=>evidence.set(ordinal(f(a,1n)),a));return rows;}
 const calibration={beta:Q.of(0n),scale:100n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:Q.of(1n),k:mode===1n?8:1};
 const event=prepareEventRecollections({observer:txt(who.observer.payload),character:'holder'},present?{kind:'Present',key:f(rec(priorCue!,623n),7n)}:{kind:'Absent'},now,calibration,()=>{
  const rows=partition('EventContinuant'),history=rec(read(632),595n);
  return {memory:rows.map(a=>({id:ordinal(f(a,1n)),acquiredAt:at(a),units:canonicalAcquisitionChildren(a,false).map(c=>({key:f(rec(c.childKey,571n),1n),views:c.views}))})),graph:{keys:[],weights:[]},presentations:new Map(items(f(history,1n),'list').map(v=>{const row=rec(v,594n);return [ordinal(f(row,1n)),items(f(row,2n),'list').map(time)];}))};
 });views.push(event.view);
 const e=event.evaluation,eventWinners=new Map(e.recalled.map(a=>[a.id,r(588,[evidence.get(a.id)!,atom(e.scores.find(s=>s.acquisition===a.id)!.score)])]));
 const ranks:CanonicalValue[]=[r(592,[who.observer,who.character,signed(now),u(e.disposition==='Evaluated'?2:1),list(e.scores.map(s=>r(591,[typedIdentifier(1145,u(s.acquisition)),atom(s.base),atom(s.pull),atom(s.score)]))),list([...eventWinners.values()])])];
 const body=mode===1n?prepareBodyRecollections({observer:txt(who.observer.payload),character:'holder'},{kind:'Present',signals:['interoceptive-signal/A']},now,8,()=>partition('Interoceptive').map(a=>({id:ordinal(f(a,1n)),kind:'Interoceptive' as const,acquiredAt:at(a),units:canonicalAcquisitionChildren(a,false).map(c=>({key:txt(identity(f(rec(c.childKey,572n),1n)).payload),views:c.views}))}))):undefined;
 const bodyWinners=new Map(body?.evaluation.recalled.map(a=>[a.id,r(589,[evidence.get(a.id)!])])??[]);
 if(body){views.push(body.view);ranks.push(r(593,[who.observer,who.character,signed(now),u(2),set(body.evaluation.eligible.map(n=>typedIdentifier(1145,u(n)))),list([...bodyWinners.values()])]));}
 return {ranks,reads,publish(allocate:()=>bigint){const ep=publishRecollections(event.view,allocate);takeEventPresentation(ep);const bp=body?publishRecollections(body.view,allocate):undefined;return [...ep.recollections,...(bp?.recollections??[])].map(row=>r(590,[typedIdentifier(1148,u(row.occurrence)),who.character,signed(now),(row.content.kind==='EventContinuant'?eventWinners:bodyWinners).get(row.content.winner.id)!]));},close(){views.forEach(closeRecollections);}};
}
