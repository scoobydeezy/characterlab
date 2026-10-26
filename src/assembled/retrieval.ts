/** assembled-character-retrieval/0.1-candidate: prior memory access, no state writer. */
import {canonicalEncode as enc,list,text,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError} from '../substrate/scheduler';
import {dataItems as items,dataField as f,dataRecord as rec,dataIdentity as id,dataUnsigned as uint,dataText as txt,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {BODY_CHANNEL,bodyId} from './body';
import {isBodyEpisodePath,RECALL,EPISODE} from './memory';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const RETRIEVAL='assembled-body-retrieval/0.1';
export function compileRetrievalDeclaration(v:CanonicalValue){const a=items(v,'list');if(a.length!==2||txt(a[0])!==RETRIEVAL||uint(a[1])>32n)invalidModel('retrieval requires slots0..32');return Object.freeze({slots:Number(uint(a[1]))});}
export type RetrievalDeclaration=ReturnType<typeof compileRetrievalDeclaration>;
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','assembled retrieval: '+s);};
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
export interface BodyRecallCandidate {readonly acquisition:bigint;readonly acquiredAt:bigint;readonly channel:CanonicalValue}
/** Same acquisition-recency law as BODY_RECALL_RECENCY_COMPONENT; no32-row truncation. */
export function rankBodyEpisodes(rows:readonly BodyRecallCandidate[],cue:CanonicalValue,at:bigint,slots:number){
 if(typeof at!=='bigint'||at<0n||!Number.isSafeInteger(slots)||slots<0||slots>32)fail('clock/slots');
 const seen=new Set<bigint>();for(const row of rows){if(typeof row.acquisition!=='bigint'||row.acquisition<0n||seen.has(row.acquisition)||typeof row.acquiredAt!=='bigint'||row.acquiredAt<0n||row.acquiredAt>=at)fail('duplicate or non-prior acquisition');seen.add(row.acquisition);}
 const eligible=rows.filter(row=>key(row.channel)===key(cue)).sort((a,b)=>a.acquiredAt!==b.acquiredAt?(a.acquiredAt>b.acquiredAt?-1:1):compare(enc(unsigned(a.acquisition)),enc(unsigned(b.acquisition)))).map(row=>row.acquisition);
 return {eligible,selected:eligible.slice(0,slots)};
}
export function retrieveBodyEpisodes(state:AuthoritativeState,stateModel:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,at:bigint,d:RetrievalDeclaration){
 const reads:ActualReadRecord[]=[],records=new Map<bigint,CanonicalValue>();
 const rows=state.entries().filter(e=>isBodyEpisodePath(e.path)).map(entry=>{
  const value=stateModel.read(state,entry.path);if(!value.presence)fail('enumerated episode absent');
  const k=items((entry.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key,'list'),a=items(value.value!,'list');
  if(key(k[1])!==key(C)||txt(a[0])!==EPISODE)fail('episode holder/tag');
  const occurrence=id(a[1]),acquisition=uint(occurrence.payload),time=a[5];if(occurrence.namespaceId!==1125n||typeof time==='boolean'||time.kind!=='signed')return fail('episode identity/time');
  reads.push({accessorId:bodyId(1028,'accessor/assembled-body-retrieval'),path:entry.path,presence:true,value:value.value,derivedSources:[]});records.set(acquisition,value.value!);
  return {acquisition,acquiredAt:time.value,channel:f(rec(a[2],461n),3n)};
 });
 const ranked=rankBodyEpisodes(rows,BODY_CHANNEL,at,d.slots);
 const outputs=ranked.selected.map(acquisition=>list([text(RECALL),signed(at),records.get(acquisition)!]));
 outputs.push(list([text(RETRIEVAL),signed(at),BODY_CHANNEL,unsigned(d.slots),list(ranked.eligible.map(unsigned)),list(ranked.selected.map(unsigned))]));
 return {reads,outputs};
}
