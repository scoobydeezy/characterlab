/** identity-public/0.1-candidate: exact source/initial/input admission and ownership. */
import {canonicalEncode as enc,list,text,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText} from '../campaign2/canonicalData';
import {copyData} from './biologyPublicBytes';
import {identityPublicRecord as r,decodeIdentityPublic as decode} from './identityPublicCodecs';
import {biologyRecipe,compileBiologyModel,compileBiologyInputs,ACTOR as BIO_ACTOR,STAGES as BIO_STAGES,type BiologyCompiled} from './biologyPublicModel';
import {biologicalConfig,type IntegrationConfig,type IntegrationLaw,type BiologicalFrame} from './biologicalIntegration';
import {value} from './biologyPublicData';
import {ACTOR as TASK_ACTOR} from './longitudinalModel';
import {ELIGIBILITY_LAWS,type EligibilityLaw,type EligibilityInput} from './identityEligibility';
import {identityFold,qualifications} from './identityPublicMath';
export {copyData};
export const VERSION='identity-public/0.1-candidate';
export type Family='Task'|'Biological';
export const sid=(ns:number,s:string)=>typedIdentifier(ns,text(s));
export const taskStages=[['context',40],['reasons',52],['decision',60],['intent',70],['expression',80],['attempt',100],['execution',110],['qualify',130],['identity',140]] as const;
export const bioStages=[...BIO_STAGES,['qualify',130],['identity',140]] as const;
export const actor=(family:Family)=>family==='Task'?TASK_ACTOR:BIO_ACTOR;
export const path=(family:Family,root:number):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:actor(family)}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const eventId=(family:Family,n:string)=>sid(1001,'event/identity/'+family.toLowerCase()+'/'+n);
export const roots=(family:Family)=>family==='Task'?[1436,1441]:[1422,1423,1424,1425,1426,1436];
const valueTypes:Record<number,number>={1422:1404,1423:1405,1424:1406,1425:1407,1426:1408,1436:1435,1441:1440};
export const reads=(family:Family,n:string)=>(({reasons:[1436],identity:[1436],...(family==='Task'?{execution:[1441]}:{passive:[1422,1423],sense:[1422,1423],goals:[1425],appraise:[1424,1425,1426],execution:[1422,1423],observe:[1422,1423],learn:[1424],adapt:[1423]})} as Record<string,number[]>)[n]??[]).map(root=>path(family,root));
export const writes=(family:Family,n:string)=>(({identity:[1436],...(family==='Task'?{execution:[1441]}:{passive:[1422],goals:[1425],appraise:[1426],execution:[1422],learn:[1424],adapt:[1423]})} as Record<string,number[]>)[n]??[]).map(root=>path(family,root));
export const owner=(family:Family,n:string)=>sid(1025,'authority/identity/'+family.toLowerCase()+'/'+({passive:'physical',execution:'physical',appraise:'affect'}[n]??n));
const ownership=(family:Family)=>compileMutationAuthorityRegistry((family==='Task'?['execution','identity']:['execution','adapt','learn','goals','appraise','identity']).map(n=>({authorityName:(owner(family,n).payload as {value:string}).value,ownedLeaves:writes(family,n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:BigInt(valueTypes[Number(p.rootStateTypeId)])},removalAllowed:false}))})));
export function identityRecipe(family:Family='Task',law:EligibilityLaw='Threshold',bioLaw:IntegrationLaw='Full',config:IntegrationConfig=biologicalConfig(),standingDenominator:1|16=16){
 if(!['Task','Biological'].includes(family)||!ELIGIBILITY_LAWS.includes(law)||![1,16].includes(standingDenominator)||family==='Task'&&standingDenominator!==16)throw Error('IDENTITY_PROFILE');
 const parameters=enc(r(1427,[text(VERSION),u(family==='Task'?1:2),text(law),list(family==='Task'?[]:[decode(biologyRecipe(bioLaw,config).parameters)]),u(standingDenominator)])),stages=family==='Task'?taskStages:bioStages;
 return {parameters,registry:enc(list([ownership(family).definitionValue,list(stages.map(([n,p])=>list([eventId(family,n),u(p),list(reads(family,n).map(x=>statePathPatternValue(pattern(x)))),list(writes(family,n).map(x=>statePathPatternValue(pattern(x)))),owner(family,n)])))]))};
}
export type IdentitySource=ReturnType<typeof identityRecipe>;
export function contextValue(x:EligibilityInput,learning:boolean){return r(1429,[u(x.setting==='Work'?1:2),q(x.significance,4),q(x.pressure,4),x.instructed,u(x.movement==='Chosen'?1:2),learning]);}
export const taskInitial=()=>enc(r(1440,[u(0)]));
export const taskOrdered=(inputs:readonly EligibilityInput[])=>enc(list(inputs.map((x,i)=>r(1428,[u(i+1),contextValue(x,i<4),x.permitted]))));
export const biologyOrdered=(originals:Uint8Array,contexts:readonly CanonicalValue[])=>{const xs=items(decode(originals),'list');if(xs.length!==contexts.length)throw Error('IDENTITY_CONTEXT_COUNT');return enc(list(xs.map((x,i)=>r(1428,[u(i+1),contexts[i],x]))));};
export async function compileIdentityModel(input:IdentitySource){
 const source=copyData(input,['parameters','registry']),profile=rec(decode(source.parameters),1427n);if(dataText(f(profile,1n))!==VERSION)throw Error('IDENTITY_VERSION');
 const family:Family=uint(f(profile,2n))===1n?'Task':'Biological',law=dataText(f(profile,3n)) as EligibilityLaw,bios=items(f(profile,4n),'list'),standingDenominator=Number(uint(f(profile,5n))) as 1|16;let biological:BiologyCompiled|undefined;
 if(family==='Task'&&bios.length||family==='Biological'&&bios.length!==1)throw Error('IDENTITY_PROFILE_SOURCE');
 if(bios.length){const parsed=value<{law:IntegrationLaw;config:Omit<IntegrationConfig,'initial'>}>(f(rec(bios[0],1401n),2n)),config={...parsed.config,initial:biologicalConfig().initial};biological=await compileBiologyModel({parameters:enc(bios[0]),registry:biologyRecipe(parsed.law,config).registry});}
 const recipe=identityRecipe(family,law,biological?.law,biological?.config,standingDenominator);if(key(decode(recipe.parameters))!==key(profile)||key(decode(recipe.registry))!==key(decode(source.registry)))throw Error('IDENTITY_EXACT_MODEL');
 const own=ownership(family),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),stages=family==='Task'?taskStages:bioStages;
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(list([actor(family),profile])),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'identity-exact-lattice/0.1',randomAlgorithmVersion:family==='Task'?'rng/identity-eligibility-routed-sha256/0.1-candidate':RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));if(state.entries().length!==roots(family).length)throw Error('IDENTITY_STATE_ROOTS');for(const e of state.entries()){const root=roots(family).find(n=>key(statePathPatternValue(pattern(path(family,n))))===key(statePathPatternValue(pattern(e.path))));if(!root)throw Error('IDENTITY_STATE_PATH');rec(e.value,BigInt(valueTypes[root]));}
  const journal=state.read(path(family,1436)).value!;if(qualifications(journal).length>64)throw Error('IDENTITY_HISTORY_LIMIT');for(const q of qualifications(journal)){const expression=rec(f(rec(q,1434n),2n),1433n);if(key(f(expression,2n))!==key(actor(family))||uint(f(expression,4n))!==(family==='Task'?1n:2n))throw Error('IDENTITY_HISTORY_ROLE');}identityFold(journal);
  if(biological)biological.validateState(new AuthoritativeState(state.entries().filter(e=>Number(e.path.rootStateTypeId)!==1436)));
 }
 return {source,family,law,standingDenominator,biological,authority,modelIdentity,stages,validateState};
}
export type IdentityCompiled=Awaited<ReturnType<typeof compileIdentityModel>>;
export async function compileIdentityInputs(model:IdentityCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(runSeed.length!==32||!runSeed.every(b=>b===runSeed[0]))throw Error('IDENTITY_SEED');
 const originals=items(decode(orderedInputs),'list');if(model.family==='Task'?originals.length!==5:originals.length<12||originals.length>64)throw Error('IDENTITY_INPUT_COUNT');
 const contexts:CanonicalValue[]=[],worlds:CanonicalValue[]=[];originals.forEach((v,i)=>{const x=rec(v,1428n);if(uint(f(x,1n))!==BigInt(i+1))throw Error('IDENTITY_TIME');const ctx=rec(f(x,2n),1429n),world=f(x,3n);if(model.family==='Task'){if(typeof world!=='boolean'||(i===4&&(uint(f(ctx,5n))!==1n||f(ctx,6n)!==false))||i<4&&f(ctx,6n)!==true)throw Error('IDENTITY_TASK_INPUT');}else if(typeof world==='boolean'||world.kind!=='record'||world.schema.typeId!==1403n||uint(f(ctx,1n))!==1n||uint(f(ctx,5n))!==1n)throw Error('IDENTITY_BIO_INPUT');contexts.push(ctx);worlds.push(world);});
 let state:AuthoritativeState,frames:BiologicalFrame[]=[];
 if(model.family==='Task'){if(uint(f(rec(decode(initialState),1440n),1n))!==0n)throw Error('IDENTITY_INITIAL');state=new AuthoritativeState([{path:path(model.family,1441),value:r(1440,[u(0)])}]);}
 else{const compiled=await compileBiologyInputs(model.biological!,initialState,enc(list(worlds)),runSeed);state=compiled.state;frames=compiled.frames;}
 state=new AuthoritativeState([...state.entries(),{path:path(model.family,1436),value:r(1435,[list([])])}]);model.validateState(state);
 const events:ScheduledEvent[]=originals.map((v,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(i+1)),phase:model.family==='Task'?40n:0n,eventTypeId:eventId(model.family,model.family==='Task'?'context':'passive'),payload:v,dependencies:list([]),causalParentEventIds:[]}));
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
 return {state,events,contexts,worlds,frames,runIdentity,runSeed:runSeed.slice()};
}
