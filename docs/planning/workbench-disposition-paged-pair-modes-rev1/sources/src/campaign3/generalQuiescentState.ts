/** Quiescent cross-owner coherence. These are runtime invariants, not cognitive
 * reads; intermediate owner patches are allowed until the common barrier ends. */
import {canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as identity,dataUnsigned as uint,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {generalSubject,generalDefinitionId as d,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import type {compileGeneralState} from './generalState';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA state instant');return v.value;};
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
const entries=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='map')return fail('GA state protocol map');return v.entries;};
export function compileGeneralQuiescentState(definitions:ReadonlyMap<string,RecordValue>,stateModel:ReturnType<typeof compileGeneralState>,required:readonly StatePath[]){
 const who=generalSubject(),context=generalBindingContext(),retention=rec(f(definitions.get(key(d('retention')))!,4n),692n),task=rec(f(definitions.get(key(d('task')))!,4n),370n);
 return (state:AuthoritativeState,now:bigint,nextRuntimeId?:bigint)=>{
  stateModel.validateState(state);if(now<0n)fail('GA quiescent clock');for(const path of required)if(!state.read(path).presence)fail('GA missing required state root');
  const leaf=(root:bigint,type:bigint,observer=false)=>rec(state.read({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key:observer?who.observer:who.character}]}).value??fail('GA missing quiescent owner'),type);
  const memory=items(f(leaf(630n,555n),1n),'list').map(v=>rec(v,554n)),acquisitions=new Map<string,RecordValue>(),eventIds=new Set<string>(),counts=[0n,0n];
  for(const a of memory){
   const id=key(f(a,1n));if(acquisitions.has(id)||at(f(a,3n))>now||key(f(a,2n))!==key(who.observer))fail('GA acquisition state coherence');acquisitions.set(id,a);
   const content=rec(f(a,6n),(f(a,6n) as RecordValue).schema.typeId),event=content.schema.typeId===552n,children=items(f(content,event?2n:1n),'list');counts[event?0:1]+=BigInt(children.length);if(event)eventIds.add(id);
  }
  if(counts[0]>uint(f(retention,1n))||counts[1]>uint(f(retention,2n)))fail('GA quiescent memory capacity');
  const seen=new Set<string>();for(const value of items(f(leaf(632n,595n),1n),'list')){
   const row=rec(value,594n),id=key(f(row,1n)),history=items(f(row,2n),'list').map(at),a=acquisitions.get(id);
   if(!eventIds.has(id)||seen.has(id)||!a||!history.length||history[0]!==at(f(a,3n))||history.some((t,i)=>t>now||i>0&&t<history[i-1]))fail('GA presentation state coherence');seen.add(id);
  }
  if(seen.size!==eventIds.size)fail('GA missing event presentation history');
  const protocolRead=state.read({rootStateTypeId:581n,fieldId:1n,selectors:[]});if(!protocolRead.presence)fail('GA missing protocol singleton');
  const protocol=rec(decode(enc(protocolRead.value!),context),580n),domain=entries(f(protocol,1n)),successes=entries(f(protocol,2n)),covered=new Set<string>();
  for(const [source,value] of successes){
   const row=rec(value,579n),sourceKey=rec(source,577n),admission=domain.find(([k])=>key(k)===key(source)),id=key(f(row,1n)),a=acquisitions.get(id);
   if(!admission||key(f(sourceKey,1n))!==key(who.character)||covered.has(id)||at(f(row,2n))>now||(f(row,3n)===true)===(a!==undefined))fail('GA protocol success coherence');covered.add(id);
   if(a&&(key(f(sourceKey,2n))!==key(f(a,4n))||at(f(row,2n))!==at(f(a,3n))||uint(f(rec(admission[1],578n),1n))!==((f(a,6n) as RecordValue).schema.typeId===552n?1n:2n)))fail('GA protocol acquisition association');
  }
  if([...acquisitions.keys()].some(id=>!covered.has(id)))fail('GA ungoverned live acquisition');
  for(const root of [631n,634n,635n]){const value=leaf(root,root===631n?625n:root===634n?627n:629n,root!==631n);if(at(f(value,root===631n?3n:1n))>now)fail('GA owner clock ahead of run');}
  for(const entry of state.entries())if(entry.path.rootStateTypeId===649n&&at(f(rec(entry.value,454n),2n))>now)fail('GA physical anchor ahead of run');
  if(now>=at(f(task,6n))&&state.entries().some(e=>e.path.rootStateTypeId===373n&&uint(f(rec(e.value,372n),1n))===1n))fail('GA expired open task at quiescence');
  for(const value of items(f(leaf(633n,560n),1n),'list')){const goal=rec(value,559n);if(at(f(goal,2n))>now||at(f(goal,4n))>now)fail('GA goal clock ahead of run');}
  if(nextRuntimeId!==undefined){
   const visit=(v:CanonicalValue):void=>{if(typeof v==='boolean')return;if(v.kind==='typedIdentifier'){if(v.namespaceId>=1100n&&ordinal(v)>=nextRuntimeId)fail('GA state occurrence outside allocator prefix');visit(v.payload);}else if(v.kind==='record')for(const child of v.fields.values())visit(child);else if(v.kind==='list'||v.kind==='set')v.items.forEach(visit);else if(v.kind==='map')for(const [k,c]of v.entries){visit(k);visit(c);}};
   visit(state.canonicalValue());
  }
 };
}
