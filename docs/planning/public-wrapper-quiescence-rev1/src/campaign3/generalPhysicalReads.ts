/** Internal state-backed source adapter: local-reserve-level-observation/0.1-candidate
 * and numeric/embodied-reserve-exact/0.1-candidate. No ingress or allocator authority. */
import {canonicalEncode as enc,list,set,text,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,patternMatches,type ActualReadRecord,type StatePath,type StatePatch} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalId as id,generalDefinitionId as d,generalStagePaths,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {validateGeneralPrimitive} from './generalPrimitiveGrammar';
import {exact,atom,materializeReserve,reserveBin} from './embodiedMath';
import {LOCAL_RESERVE_OBSERVATION_VERSION as version} from './localReserveObservation';
import {replenishLocalReserveDefinition} from './localReserveSource';

export function compileGeneralPhysicalReads(definitions:ReadonlyMap<string,RecordValue>,validateLeaf:(path:StatePath,value:CanonicalValue)=>void){
 const context=generalBindingContext(),who=generalSubject();
 const value=(ref:CanonicalValue)=>decode(enc(f(definitions.get(key(ref))??fail('GA missing physical definition'),4n)),context);
 const channels=items(f(rec(value(d('channels')),648n),1n),'set').map(v=>rec(v,647n));
 const bindings=items(f(rec(value(d('body')),646n),1n),'set').map(v=>rec(v,645n));
 const parameters=new Map(bindings.map(b=>[key(f(b,1n)),rec(value(f(b,2n)),453n)]));
 const domain=generalStagePaths('current-sample').reads;
 return Object.freeze({
  replenish(state:AuthoritativeState,input:CanonicalValue,at:bigint){
   validateGeneralPrimitive('Instant',signed(at));const original=rec(decode(enc(input),context),651n),target=rec(f(original,1n),644n),parameter=parameters.get(key(target));if(!parameter||key(f(target,1n))!==key(who.character))fail('GA replenishment target');
   const path:StatePath={rootStateTypeId:649n,fieldId:1n,selectors:[{kind:'mapKey',key:target}]};
   if(!generalStagePaths('local-reserve-replenishment').reads.some(p=>patternMatches(p,path)))fail('GA replenishment ReadDomain');
   const read=state.read(path);if(!read.presence)fail('GA replenishment absent anchor');validateLeaf(path,read.value!);const anchor=rec(read.value!,454n),instant=f(anchor,2n),reserve=f(target,2n);validateGeneralPrimitive('Instant',instant);
   if(typeof reserve==='boolean'||reserve.kind!=='typedIdentifier'||typeof reserve.payload==='boolean'||reserve.payload.kind!=='text')fail('GA replenishment reserve identity');
   const changed=replenishLocalReserveDefinition({key:reserve.payload.value,capacity:exact(f(parameter,2n)),rate:exact(f(parameter,3n)),amount:exact(f(anchor,1n)),anchoredAt:(instant as Extract<CanonicalValue,{kind:'signed'}>).value},at,exact(f(original,2n))),next=r(454,[atom(changed.result.next.amount),signed(at)]),n=changed.result.numeric;
   const result=decode(enc(r(652,[target,signed(at),anchor,next,r(479,[atom(n.before),atom(n.potential),atom(n.applied),atom(n.overflow),atom(n.after)])])),context);
   const patch:StatePatch={operations:[{kind:'set',path,expected:{presence:true,value:anchor},newValue:next}]};
   return Object.freeze({outputs:()=>[decode(enc(result),context)],patch:()=>structuredClone(patch),actualReadRecords:()=>structuredClone([{accessorId:id(1028,'accessor/embodied-reserve-anchor'),path,presence:true,value:anchor,derivedSources:[]}])});
  },
  /** Null means no body request: no roster/anchor reads and no occurrences.
   * A requested unavailable channel still emits its own observation occurrence. */
  sampleBody(state:AuthoritativeState,request:CanonicalValue|null,at:bigint,allocate:()=>bigint){
   validateGeneralPrimitive('Instant',signed(at));
   const reads:ActualReadRecord[]=[];
   if(request===null)return Object.freeze({bodyBytes:()=>null,actualReadRecords:()=>structuredClone(reads)});
   const input=rec(decode(enc(request),context),650n);
   if(key(f(input,1n))!==key(who.observer))fail('GA physical request observer');
   const requested=items(f(input,2n),'set').map(channel=>channels.find(c=>key(f(c,1n))===key(channel))??fail('GA unknown physical channel'));
   const read=(p:StatePath,member:string)=>{
    if(!domain.some(d=>patternMatches(d,p)))fail('GA physical read outside registration');
    const result=state.read(p);if(result.presence)validateLeaf(p,result.value!);
    reads.push({accessorId:id(1028,member),path:p,presence:result.presence,value:result.value,derivedSources:[]});return result;
   };
   const available=requested.some(c=>f(c,6n)===true&&f(c,7n)===true);
   if(available){
    const path:StatePath={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:who.observer}]};
    const roster=read(path,'ResolvedCharacterSubject');if(!roster.presence)fail('GA physical missing roster');
    const character=f(rec(roster.value!,267n),1n);if(key(character)!==key(who.character))fail('GA physical roster holder');
    reads[0]={accessorId:id(1028,'ResolvedCharacterSubject'),path,presence:true,value:character,derivedSources:[roster],transformationId:id(1028,'ResolvedCharacterSubject')};
   }
   // Multiple safe views may share one physical reserve; record one actual anchor
   // read and reuse its detached value, without probing other declared reserves.
   const anchors=new Map<string,RecordValue>();
   const samples=requested.map(channel=>{
    if(f(channel,6n)!==true||f(channel,7n)!==true)return {channel};
    const physical=f(channel,3n),k=key(physical);let anchor=anchors.get(k);
    if(!anchor){const prior=read({rootStateTypeId:649n,fieldId:1n,selectors:[{kind:'mapKey',key:physical}]},'accessor/embodied-reserve-anchor');
     if(!prior.presence)fail('GA physical missing anchor');anchor=rec(prior.value!,454n);anchors.set(k,anchor);}
    const parameter=parameters.get(k)??fail('GA physical unbound reserve'),instant=f(anchor,2n);
    validateGeneralPrimitive('Instant',instant);
    const capacity=exact(f(parameter,2n)),amount=materializeReserve(exact(f(anchor,1n)),(instant as Extract<CanonicalValue,{kind:'signed'}>).value,capacity,exact(f(parameter,3n)),at);
    const bin=reserveBin(amount,capacity,exact(f(channel,5n)));
    return {channel,interval:r(462,[atom(bin.lower),atom(bin.upper)])};
   });
   const issued=new Set<bigint>();
   const observations=samples.map(({channel,interval})=>{
    const n=allocate();if(typeof n!=='bigint'||n<0n||issued.has(n))fail('GA physical observation slot');issued.add(n);
    const header=[typedIdentifier(1115,u(n)),who.observer,f(channel,1n),signed(at)];
    return interval?r(461,[...header,interval,text(version)]):r(463,[...header,text(version)]);
   });
   const bytes=enc(decode(enc(r(654,[who.observer,signed(at),list(observations),set(requested.map(c=>r(598,[f(c,1n),f(c,4n)])))])),context));
   return Object.freeze({bodyBytes:()=>bytes.slice(),actualReadRecords:()=>structuredClone(reads)});
  },
 });
}
