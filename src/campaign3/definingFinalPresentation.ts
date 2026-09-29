/** defining-native-rehearsal/0.1-candidate. Existing presentation owner only. */
import {canonicalEncode as enc,list,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {AuthoritativeState,StatePatch,ActualReadRecord} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity,dataKey as key} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalId as id} from './generalBindingProfile';
import {decodeDefiningRehearsal as decode} from './definingRehearsalCodecs';
import {definingMemoryPath} from './definingMemoryOwner';
import {settleEventPresentationHistory} from './eventPresentationSettlement';
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
function time(v:CanonicalValue){if(typeof v==='boolean'||v.kind!=='signed')throw Error('DEFINING_FINAL_PRESENTATION_TIME');return v.value;}
export function prepareDefiningFinalPresentation(state:AuthoritativeState,batch:CanonicalValue,now:bigint){
 const b=rec(decode(enc(batch)),1492n),who=generalSubject(),pubs=items(f(b,3n),'list');
 if(![50n,400n,4000n].includes(now)||time(f(b,1n))!==now||uint(f(b,2n))!==2n||pubs.length!==1||b.fields.has(4n)||b.fields.has(5n))throw Error('DEFINING_FINAL_PRESENTATION_BATCH');
 const path=definingMemoryPath(632),read=state.read(path);if(!read.presence)throw Error('DEFINING_FINAL_HISTORY');
 const history=items(f(rec(read.value!,595n),1n),'list').map(v=>{const h=rec(v,594n);return {acquisition:ordinal(f(h,1n)),instants:items(f(h,2n),'list').map(time)};});
 const presentations=pubs.map(v=>{const pub=rec(v,590n);if(time(f(pub,3n))!==now||key(f(pub,2n))!==key(who.character))throw Error('DEFINING_FINAL_PUBLICATION');return {recollection:ordinal(f(pub,1n)),acquisition:ordinal(f(rec(f(rec(f(pub,4n),588n),1n),587n),1n))};});
 const next=settleEventPresentationHistory({now,priorAcquisitions:history.map(h=>({id:h.acquisition,kind:'EventContinuant',acquiredAt:h.instants[0]})),formed:[],survivingAcquisitions:history.map(h=>h.acquisition),priorHistory:history,presentations});
 const value=r(595,[list(next.map(h=>r(594,[typedIdentifier(1145,u(h.acquisition)),list(h.instants.map(signed))])))]);
 return {patch:{operations:[{kind:'set',path,expected:{presence:true,value:read.value},newValue:value}]} as StatePatch,reads:[{accessorId:id(1028,'accessor/defining-final-presentations'),path,presence:true,value:read.value,derivedSources:[]}] as ActualReadRecord[]};
}
