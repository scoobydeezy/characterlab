/** position-scene-source-component/0.1-candidate; trusted compiled scene-object definitions. */
import {canonicalEncode,cloneCanonicalValue,bytesToHex,list,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {EventRoleId,EVENT_BINDING_CONTRACT_VERSION,compileEventBindings,materializeEventBindings,finiteMax,type EventRoleEvidence} from '../semanticBinding/eventBindings';
import {worldEventTruthValue,eventRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
export interface PositionSceneItem {readonly marker:CanonicalValue;readonly role:EventRoleId;readonly x:bigint;readonly y:bigint;readonly glyph:bigint;readonly visible:boolean;readonly permitted:boolean;readonly roleMode:'Preserve'|'Unresolved'}
export interface PositionSceneFrame {readonly at:bigint;readonly items:readonly PositionSceneItem[]}
declare const brand:unique symbol;export interface PositionSceneSource {readonly [brand]:true}
const facts=new WeakMap<object,readonly PositionSceneFrame[]>(),roles=[EventRoleId.Actor,EventRoleId.Target,EventRoleId.Participant,EventRoleId.Instrument,EventRoleId.Beneficiary].sort();
const schema={eventTypeId:'event/attention-participation-scene',roleCardinalityRules:roles.map(eventRoleId=>({eventRoleId,minOccurrences:0,maxOccurrences:finiteMax(3)})),bindingSchemaVersion:EVENT_BINDING_CONTRACT_VERSION};
function fail():never{throw Error('POSITION_SCENE_DOMAIN');}
const referentKey=(v:CanonicalValue)=>{validateSemanticReferent(v);return bytesToHex(canonicalEncode(v));};
function exact(value:unknown,names:readonly string[]){if(!value||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype)fail();const d=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!d[k])||Object.values(d).some(p=>!('value'in p)))fail();}
function dense(value:unknown,max:number):asserts value is readonly unknown[]{if(!Array.isArray(value)||Object.getPrototypeOf(value)!==Array.prototype||value.length>max)fail();const d=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(d).length!==value.length+1||Object.values(d).some(p=>!('value'in p))||Array.from({length:value.length},(_,i)=>!d[String(i)]).some(Boolean))fail();}
const requests=(items:readonly PositionSceneItem[])=>items.map(item=>({eventRoleId:item.role,semanticReferent:{semanticReferentId:referentKey(item.marker),domainTags:['entity','usable-entity']}}));
/** Content-kind qualification is a compiled-model premise, not inferred from ID text. */
export function createPositionSceneSource(frames:readonly PositionSceneFrame[]):PositionSceneSource{
 dense(frames,10);let prior=0n;
 const copy=frames.map(frame=>{exact(frame,['at','items']);if(typeof frame.at!=='bigint'||frame.at<=prior)fail();prior=frame.at;dense(frame.items,3);
  const markers=new Set<string>();const items=frame.items.map(item=>{exact(item,['marker','role','x','y','glyph','visible','permitted','roleMode']);validateSemanticReferent(item.marker);const marker=cloneCanonicalValue(item.marker),key=referentKey(marker);if(markers.has(key))fail();markers.add(key);
   if(!roles.includes(item.role as typeof roles[number])||[item.x,item.y,item.glyph].some(v=>typeof v!=='bigint'||v<0n||v>7n)||typeof item.visible!=='boolean'||typeof item.permitted!=='boolean'||!['Preserve','Unresolved'].includes(item.roleMode))fail();
   return Object.freeze({...item,marker});});compileEventBindings(schema,requests(items),0n);return Object.freeze({at:frame.at,items:Object.freeze(items)});
 });const token=Object.freeze({}) as PositionSceneSource;facts.set(token,Object.freeze(copy));return token;
}
/** Returns separate truth trace and safe source projection, never a cognitive truth accessor. */
export function materializePositionScene(source:PositionSceneSource,at:bigint,allocate:()=>bigint){
 const frame=facts.get(source)?.find(f=>f.at===at);if(!frame)fail();const used=new Set<bigint>();
 const next=()=>{const n=allocate();if(typeof n!=='bigint'||n<0n||used.has(n))throw Error('POSITION_SCENE_ALLOCATION');used.add(n);return n;};
 const world=next(),bindings=materializeEventBindings(schema,requests(frame!.items),next).bindings;
 const items=frame!.items.filter(i=>i.visible&&i.permitted).map(item=>{
  const binding=bindings.find(b=>b.semanticReferent.semanticReferentId===referentKey(item.marker))!;
  const role:EventRoleEvidence=item.roleMode==='Preserve'?{kind:'exact',eventRoleId:binding.eventRoleId}:{kind:'unresolved'};
  return {position:{x:item.x,y:item.y},glyph:item.glyph,role};
 });
 const order=(item:typeof items[number])=>bytesToHex(canonicalEncode(list([unsigned(item.glyph),unsigned(item.position.x),unsigned(item.position.y),eventRoleEvidenceValue(item.role)])));
 items.sort((a,b)=>order(a)<order(b)?-1:order(a)>order(b)?1:0);
 const safe=Object.freeze({at,items:Object.freeze(items.map(i=>Object.freeze({...i,position:Object.freeze(i.position),role:Object.freeze(i.role)})))});
 return {truth:worldEventTruthValue({worldEventOrdinal:world,eventTypeId:schema.eventTypeId,occurredAt:at,bindings}),safe};
}
