/** disposition-public/0.1-candidate: closed native source, state and authority. */
import {canonicalEncode as enc,list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText} from '../campaign2/canonicalData';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {copyData} from './biologyPublicBytes';
import {dispositionPublicRecord as r,decodeDispositionPublic as decode} from './dispositionPublicCodecs';
import {identityPublicRecord as old} from './identityPublicCodecs';
import {sid,actor as sourceActor,path as sourcePath,pattern,contextValue} from './identityPublicModel';
import {checkedDisposition,DISPOSITION_LAWS,deriveDisposition,type DispositionProfile,type DispositionFrame,type DispositionLaw} from './dispositionAdaptation';
import {qualifications,identityFold} from './identityPublicMath';
export {copyData,sid,pattern};
export const VERSION='disposition-public/0.1-candidate';
export const actor=sourceActor('Task'),path=(root:number)=>sourcePath('Task',root);
export const stages=[['context',40],['reasons',52],['decision',60],['intent',70],['expression',80],['attempt',100],['execution',110],['qualify',130],['identity',140],['adapt',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/disposition/'+n),owner=(n:string)=>sid(1025,'authority/disposition/'+n);
export const roots=(law:DispositionLaw)=>[1436,1441,1457,...(law==='Refold'?[]:[1458])];
const types:Record<number,number>={1436:1435,1441:1440,1457:1453,1458:1454};
export const reads=(law:DispositionLaw,n:string)=>(({reasons:[1457,1436,...(law==='Refold'?[]:[1458])],execution:[1441],identity:[1436],adapt:[1436,...(law==='Refold'?[]:[1458])]} as Record<string,number[]>)[n]??[]).map(path);
export const writes=(law:DispositionLaw,n:string)=>(({execution:[1441],identity:[1436],adapt:law==='Refold'?[]:[1458]} as Record<string,number[]>)[n]??[]).map(path);
const ownership=(law:DispositionLaw)=>compileMutationAuthorityRegistry(['execution','identity',...(law==='Refold'?[]:['adapt'])].map(n=>({authorityName:'authority/disposition/'+n,ownedLeaves:writes(law,n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:BigInt(types[Number(p.rootStateTypeId)])},removalAllowed:false}))})));
export function dispositionRecipe(profile:DispositionProfile){
 if(!DISPOSITION_LAWS.includes(profile.law)||![-1,0,1].includes(profile.constitution)||Reflect.ownKeys(profile).length!==2)throw Error('DISPOSITION_PROFILE');
 return {parameters:enc(r(1451,[text(VERSION),text(profile.law),q(profile.constitution,8)])),registry:enc(list([ownership(profile.law).definitionValue,list(stages.map(([n,p])=>list([eventId(n),u(p),list(reads(profile.law,n).map(x=>statePathPatternValue(pattern(x)))),list(writes(profile.law,n).map(x=>statePathPatternValue(pattern(x)))),owner(n)])))]))};
}
export type DispositionSource=ReturnType<typeof dispositionRecipe>;
export const dispositionInitial=()=>enc(old(1440,[u(0)]));
export function dispositionOrdered(profile:DispositionProfile,frames:readonly DispositionFrame[]){return enc(list(checkedDisposition(profile,frames).frames.map((x,i)=>r(1452,[u(i+1),contextValue({setting:x.setting,significance:x.significance,pressure:x.pressure,instructed:false,movement:'Chosen',permitted:true},x.stage==='Learn'),x.active,u(x.seed),x.permitted]))));}
export async function compileDispositionModel(input:DispositionSource){
 const source=copyData(input,['parameters','registry']),v=rec(decode(source.parameters),1451n),b=readQ(f(v,3n)).multiply(Q.of(8n));
 if(dataText(f(v,1n))!==VERSION||b.denominator!==1n)throw Error('DISPOSITION_PROFILE');
 const profile:DispositionProfile={law:dataText(f(v,2n)) as DispositionLaw,constitution:Number(b.numerator) as -1|0|1},recipe=dispositionRecipe(profile);
 if(key(decode(recipe.parameters))!==key(v)||key(decode(recipe.registry))!==key(decode(source.registry)))throw Error('DISPOSITION_EXACT_MODEL');
 const own=ownership(profile.law),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(list([actor,v,text('18 instants; batch4; Step1/8 cap1/4; Leaky target1/4; meaning excludes feedback; operand lineage1455')])),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(v),numericProfileVersion:'disposition-exact/0.1-candidate',randomAlgorithmVersion:'rng/disposition-input-seed-routed-sha256/0.1-candidate',registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 const memo=new Map<number,string>();
 function validateState(state:AuthoritativeState){
  if(state.entries().length!==roots(profile.law).length)throw Error('DISPOSITION_ROOTS');
  for(const e of state.entries()){
   const root=roots(profile.law).find(n=>key(statePathPatternValue(pattern(path(n))))===key(statePathPatternValue(pattern(e.path))));if(!root)throw Error('DISPOSITION_PATH');
   const bytes=key(e.value);if(memo.get(root)===bytes)continue;decode(enc(e.value));rec(e.value,BigInt(types[root]));
   if(root===1457&&!readQ(f(rec(e.value,1453n),1n)).equals(Q.of(BigInt(profile.constitution),8n)))throw Error('DISPOSITION_CONSTITUTION');
   if(root===1458){const a=readQ(f(rec(e.value,1454n),1n));if(a.compare(Q.of(1n,4n))>0||a.compare(Q.of(-1n,4n))<0)throw Error('DISPOSITION_PLASTIC_BOUND');}
   if(root===1436){if(qualifications(e.value).length>18)throw Error('DISPOSITION_HISTORY');for(const x of qualifications(e.value)){const expression=rec(f(rec(x,1434n),2n),1433n);if(key(f(expression,2n))!==key(actor)||uint(f(expression,4n))!==1n)throw Error('DISPOSITION_HISTORY_ROLE');}identityFold(e.value);}
   memo.set(root,bytes);
  }
 }
 return {source,profile,authority,modelIdentity,validateState};
}
export type DispositionCompiled=Awaited<ReturnType<typeof compileDispositionModel>>;
export async function compileDispositionInputs(model:DispositionCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(runSeed.length!==32||runSeed.some(b=>b!==0))throw Error('DISPOSITION_SEED');if(key(decode(initialState))!==key(decode(dispositionInitial())))throw Error('DISPOSITION_INITIAL');
 const originals=items(decode(orderedInputs),'list');if(originals.length!==18)throw Error('DISPOSITION_HORIZON');
 const labels=['Learn','Learn','Learn','Learn','Probe','Gap','Probe','Learn','Learn','Learn','Learn','Probe','Learn','Learn','Learn','Learn','Probe','Probe'] as const;
 const frames=originals.map((v,i)=>{const x=rec(v,1452n),ctx=rec(f(x,2n),1429n);if(uint(f(x,1n))!==BigInt(i+1)||f(ctx,4n)!==false||uint(f(ctx,5n))!==1n||f(ctx,6n)!==(labels[i]==='Learn'))throw Error('DISPOSITION_CONTEXT');return {stage:labels[i],setting:uint(f(ctx,1n))===1n?'Work':'Home',significance:Number(readQ(f(ctx,2n)).multiply(Q.of(4n)).numerator),pressure:Number(readQ(f(ctx,3n)).multiply(Q.of(4n)).numerator),active:f(x,3n),seed:Number(uint(f(x,4n))),permitted:f(x,5n)} as DispositionFrame;});
 const checked=checkedDisposition(model.profile,frames);if(key(decode(dispositionOrdered(model.profile,checked.frames)))!==key(list(originals)))throw Error('DISPOSITION_INPUT');
 const state=new AuthoritativeState([{path:path(1436),value:old(1435,[list([])])},{path:path(1441),value:old(1440,[u(0)])},{path:path(1457),value:r(1453,[q(model.profile.constitution,8)])},...(model.profile.law==='Refold'?[]:[{path:path(1458),value:r(1454,[q(0,1)])}])]);model.validateState(state);
 const events:ScheduledEvent[]=originals.map((payload,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(i+1)),phase:40n,eventTypeId:eventId('context'),payload,dependencies:list([]),causalParentEventIds:[]}));
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(list(originals)),runSeed});
 return {state,events,frames:checked.frames,runIdentity,runSeed:runSeed.slice()};
}
