/** values-public/0.1-candidate: closed source and separate consolidation authority. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText} from '../campaign2/canonicalData';
import {valuesPublicRecord as r,decodeValuesPublic as decode} from './valuesPublicCodecs';
import {copyData} from './biologyPublicBytes';
import {data,value} from './biologyPublicData';
import {sid,actor as identityActor,path as identityPath,pattern} from './identityPublicModel';
import {createValuesOwner,VALUE_LAWS,type ValueLaw,type ValueReceipt,type ValueProjection} from './valuesComponent';
import type {ValuesProbe} from './valuesReceiving';
export {copyData,sid,pattern};
export const VERSION='values-public/0.1-candidate',actor=identityActor('Task'),path=(n:number)=>identityPath('Task',n);
export const stages=[['source',40],['reasons',52],['choice',60],['consolidate',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/values/'+n),owner=sid(1025,'authority/values/consolidate');
export const roots=(law:ValueLaw)=>law==='Refold'?[1516]:[1516,1517];
export const reads=(law:ValueLaw,n:string)=>(['reasons','consolidate'].includes(n)?roots(law):[]).map(path);
export const writes=(law:ValueLaw,n:string)=>(n==='consolidate'?roots(law):[]).map(path);
const ownership=(law:ValueLaw)=>compileMutationAuthorityRegistry([{authorityName:'authority/values/consolidate',ownedLeaves:roots(law).map(n=>({pattern:pattern(path(n)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:BigInt(n===1516?1513:1514)},removalAllowed:false}))}]);
const modes=['ValuesOnly','NeedOnly','Joint'] as const;
function fields(x:object,names:string[]){if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('VALUES_PUBLIC_FIELDS');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==names.length||names.some(n=>!ds[n]||!('value'in ds[n])))throw Error('VALUES_PUBLIC_FIELDS');}
export function receiptValue(x:ValueReceipt){createValuesOwner('Accumulated').admit(x);return r(1510,[u(x.instant),u(x.id),x.category==='Care',u(x.target==='A'?1:2),x.outcome!==null,signed(x.outcome??0)]);}
export function receiptData(v:CanonicalValue):ValueReceipt{const x=rec(v,1510n),out=f(x,6n);if(typeof out==='boolean'||out.kind!=='signed')throw Error('VALUES_OUTCOME');const result:ValueReceipt={instant:Number(uint(f(x,1n))),id:Number(uint(f(x,2n))),category:f(x,3n)===true?'Care':null,target:uint(f(x,4n))===1n?'A':'B',outcome:f(x,5n)===true?Number(out.value) as -1|0|1:null};if(key(receiptValue(result))!==key(v))throw Error('VALUES_RECEIPT');return result;}
export function probeValue(x:ValuesProbe){fields(x,['instant','seed','currentNeed','goal','linked','mode']);if(!Number.isInteger(x.instant)||x.instant<1||x.instant>65||!Number.isInteger(x.seed)||x.seed<0||x.seed>255||![0,1].includes(x.currentNeed)||![0,1].includes(x.goal)||typeof x.linked!=='boolean'||!modes.includes(x.mode))throw Error('VALUES_PROBE');return r(1511,[u(x.instant),u(x.seed),!!x.currentNeed,!!x.goal,x.linked,u(modes.indexOf(x.mode)+1)]);}
export function probeData(v:CanonicalValue):ValuesProbe{const x=rec(v,1511n),result={instant:Number(uint(f(x,1n))),seed:Number(uint(f(x,2n))),currentNeed:f(x,3n)===true?1:0,goal:f(x,4n)===true?1:0,linked:f(x,5n)===true,mode:modes[Number(uint(f(x,6n)))-1]} as ValuesProbe;if(key(probeValue(result))!==key(v))throw Error('VALUES_PROBE');return result;}
export const projectionValue=(x:ValueProjection)=>r(1514,[data(x)]);
export const projectionData=(x:CanonicalValue)=>value<ValueProjection>(f(rec(x,1514n),1n));
export function historyOwner(law:ValueLaw,h:CanonicalValue){const o=createValuesOwner(law);for(const x of items(f(rec(h,1513n),1n),'list'))o.admit(receiptData(x));return o;}
export const historyValue=(o:ReturnType<typeof createValuesOwner>)=>r(1513,[list(o.history().map(receiptValue))]);
export interface ValuesFrame{instant:number;receipt:ValueReceipt|null;probe:ValuesProbe|null;}
export function valuesOrdered(frames:readonly ValuesFrame[]){data(frames);if(!Array.isArray(frames)||frames.length<1||frames.length>65)throw Error('VALUES_HORIZON');let at=0;const seen=new Set<number>(),o=createValuesOwner('Accumulated');return enc(list(frames.map(x=>{fields(x,['instant','receipt','probe']);if(!Number.isInteger(x.instant)||x.instant<=at||x.instant>65)throw Error('VALUES_TIME');at=x.instant;if(x.receipt){if(!seen.has(x.receipt.id)&&x.receipt.instant!==at||x.receipt.instant>at)throw Error('VALUES_RECEIPT_TIME');o.admit(x.receipt);seen.add(x.receipt.id);}if(x.probe&&x.probe.instant!==at)throw Error('VALUES_PROBE_TIME');return r(1512,[u(at),list(x.receipt?[receiptValue(x.receipt)]:[]),list(x.probe?[probeValue(x.probe)]:[])]);})));}
export const valuesInitial=()=>enc(r(1513,[list([])]));
export function valuesRecipe(law:ValueLaw){if(!VALUE_LAWS.includes(law))throw Error('VALUES_LAW');return {parameters:enc(r(1509,[text(VERSION),text(law)])),registry:enc(list([ownership(law).definitionValue,list(stages.map(([n,p])=>list([eventId(n),u(p),list(reads(law,n).map(x=>statePathPatternValue(pattern(x)))),list(writes(law,n).map(x=>statePathPatternValue(pattern(x))))])))]))};}
export type ValuesSource=ReturnType<typeof valuesRecipe>;
export async function compileValuesModel(input:ValuesSource){const source=copyData(input,['parameters','registry']),profile=rec(decode(source.parameters),1509n),law=dataText(f(profile,2n)) as ValueLaw,recipe=valuesRecipe(law);if(dataText(f(profile,1n))!==VERSION||key(decode(recipe.parameters))!==key(profile)||key(decode(recipe.registry))!==key(decode(source.registry)))throw Error('VALUES_EXACT_MODEL');const own=ownership(law),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(list([actor,profile,text('component0.2; deadline65; source40/reasons52/choice60/consolidation140; complete overlap')])),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'values-exact/0.1',randomAlgorithmVersion:'values-input-seed-routed-sha256/0.1',registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(s:AuthoritativeState){if(s.entries().length!==roots(law).length)throw Error('VALUES_ROOTS');for(const e of s.entries())if(!roots(law).some(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n))))))throw Error('VALUES_PATH');const h=s.read(path(1516));if(!h.presence)throw Error('VALUES_HISTORY');const o=historyOwner(law,h.value!);if(key(historyValue(o))!==key(h.value!))throw Error('VALUES_HISTORY_CANONICAL');if(law!=='Refold'&&key(s.read(path(1517)).value!)!==key(projectionValue(o.view(65))))throw Error('VALUES_PROJECTION');}
 return {source,law,authority,modelIdentity,validateState};}
export type ValuesCompiled=Awaited<ReturnType<typeof compileValuesModel>>;
export async function compileValuesInputs(model:ValuesCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){if(runSeed.length!==32||runSeed.some(x=>x!==0)||key(decode(initialState))!==key(decode(valuesInitial())))throw Error('VALUES_INITIAL');const originals=items(decode(orderedInputs),'list'),frames=originals.map(v=>{const x=rec(v,1512n),rs=items(f(x,2n),'list'),ps=items(f(x,3n),'list');return {instant:Number(uint(f(x,1n))),receipt:rs.length?receiptData(rs[0]):null,probe:ps.length?probeData(ps[0]):null};});if(key(decode(valuesOrdered(frames)))!==key(list(originals)))throw Error('VALUES_ORIGINALS');
 const state=new AuthoritativeState([{path:path(1516),value:r(1513,[list([])])},...(model.law==='Refold'?[]:[{path:path(1517),value:projectionValue(createValuesOwner(model.law).view(1))}])]);model.validateState(state);
 const events:ScheduledEvent[]=originals.map((payload,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(frames[i].instant)),phase:40n,eventTypeId:eventId('source'),payload,dependencies:list([]),causalParentEventIds:[]}));
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(list(originals)),runSeed});return {state,events,frames,runIdentity,runSeed:runSeed.slice()};}
