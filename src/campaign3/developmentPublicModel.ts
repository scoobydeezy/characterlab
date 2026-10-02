/** development-public/0.1-candidate: original sources and sole-writer registry. */
import {canonicalEncode as enc,list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {copyData} from './biologyPublicBytes';
import {developmentPublicRecord as r,decodeDevelopmentPublic as decode} from './developmentPublicCodecs';
import {identityPublicRecord as old} from './identityPublicCodecs';
import {dispositionPublicRecord as disposition} from './dispositionPublicCodecs';
import {sid,actor as sourceActor,path as sourcePath,pattern,contextValue} from './identityPublicModel';
import {checkedDevelopment,type DevelopmentProfile,type DevelopmentFrame} from './developmentComponent';
import {qualifications,identityFold} from './identityPublicMath';
export {copyData,sid,pattern};
export const VERSION='development-public/0.1-candidate',actor=sourceActor('Task'),path=(root:number)=>sourcePath('Task',root);
export const stages=[['development',30],['context',40],['reasons',52],['decision',60],['intent',70],['expression',80],['exercise',100],['execution',110],['report',120],['qualify',130],['learning',140],['identity',140],['formation',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/development/'+n),owner=(n:string)=>sid(1025,'authority/development/'+n);
export const roots=[1436,1457,1500,1501,1502,1503],types:Record<number,number>={1436:1435,1457:1453,1500:1495,1501:1496,1502:1497,1503:1499};
export const reads=(n:string)=>(({development:[1500],reasons:[1457,1436,1503],execution:[1501],learning:[1500,1501,1502],identity:[1436],formation:[1500,1503]} as Record<string,number[]>)[n]??[]).map(path);
export const writes=(n:string)=>(({development:[1500],learning:[1501,1502],identity:[1436],formation:[1503]} as Record<string,number[]>)[n]??[]).map(path);
const ownership=()=>compileMutationAuthorityRegistry(['development','learning','identity','formation'].map(n=>({authorityName:'authority/development/'+n,ownedLeaves:writes(n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:BigInt(types[Number(p.rootStateTypeId)])},removalAllowed:false}))})));
const choices=['None','Learn','Probe','Forced'] as const;
const dummy:DevelopmentFrame={phase:0,exercise:false,practice:false,permitted:true,difficulty:0,report:null,choice:'None',significance:0,pressure:0,setting:'Work',seed:0};
export function developmentRecipe(profile:DevelopmentProfile){
 const checked=checkedDevelopment(profile,[dummy]).profile;
 return {parameters:enc(r(1493,[text(VERSION),u(checked.curve==='Step'?1:2),checked.learning,checked.formation,q(checked.constitution,8)])),registry:enc(list([ownership().definitionValue,list(stages.map(([n,p])=>list([eventId(n),u(p),list(reads(n).map(x=>statePathPatternValue(pattern(x)))),list(writes(n).map(x=>statePathPatternValue(pattern(x)))),owner(n)])))]))};
}
export type DevelopmentSource=ReturnType<typeof developmentRecipe>;
export const developmentInitial=()=>enc(list([]));
export function developmentOrdered(profile:DevelopmentProfile,frames:readonly DevelopmentFrame[]){return enc(list(checkedDevelopment(profile,frames).frames.map((x,i)=>r(1494,[u(i+1),u(x.phase),x.exercise,x.practice,x.permitted,q(x.difficulty,8),list(x.report===null?[]:[x.report]),u(choices.indexOf(x.choice)),contextValue({setting:x.setting,significance:x.significance,pressure:x.pressure,instructed:false,movement:'Chosen',permitted:true},x.choice==='Learn'),u(x.seed)]))));}
export async function compileDevelopmentModel(input:DevelopmentSource){
 const source=copyData(input,['parameters','registry']),v=rec(decode(source.parameters),1493n),constitution=readQ(f(v,5n)).multiply(Q.of(8n));
 if(dataText(f(v,1n))!==VERSION||constitution.denominator!==1n)throw Error('DEVELOPMENT_PROFILE');
 const profile={curve:uint(f(v,2n))===1n?'Step':'Ramp',learning:f(v,3n),formation:f(v,4n),constitution:Number(constitution.numerator)} as DevelopmentProfile,recipe=developmentRecipe(profile);
 if(key(decode(recipe.parameters))!==key(v)||key(decode(recipe.registry))!==key(decode(source.registry)))throw Error('DEVELOPMENT_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(list([actor,v,text('13 native stages; independent phase, learning, qualification and event-time formation;1..24 instants')])),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(v),numericProfileVersion:'development-exact/0.1-candidate',randomAlgorithmVersion:'rng/disposition-input-seed-routed-sha256/0.1-candidate',registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 const memo=new Map<number,string>();
 function validateState(state:AuthoritativeState){
  if(state.entries().length!==roots.length)throw Error('DEVELOPMENT_ROOTS');
  for(const e of state.entries()){
   const root=roots.find(n=>key(statePathPatternValue(pattern(path(n))))===key(statePathPatternValue(pattern(e.path))));if(!root)throw Error('DEVELOPMENT_PATH');
   const bytes=key(e.value);if(memo.get(root)===bytes)continue;decode(enc(e.value));rec(e.value,BigInt(types[root]));
   if(root===1457&&!readQ(f(rec(e.value,1453n),1n)).equals(Q.of(BigInt(profile.constitution),8n)))throw Error('DEVELOPMENT_CONSTITUTION');
   if(root===1503){const x=readQ(f(rec(e.value,1499n),1n));if(x.compare(Q.of(1n,2n))>0||x.compare(Q.of(-1n,2n))<0)throw Error('DEVELOPMENT_PERSONALITY_BOUND');}
   if(root===1502){const x=rec(e.value,1497n);if(uint(f(x,2n))>24n||(items(f(x,1n),'list').length===0)!==(uint(f(x,2n))===0n))throw Error('DEVELOPMENT_SUPPORT');}
   if(root===1436){if(qualifications(e.value).length>24)throw Error('DEVELOPMENT_HISTORY');for(const x of qualifications(e.value)){const expression=rec(f(rec(x,1434n),2n),1433n);if(key(f(expression,2n))!==key(actor)||uint(f(expression,4n))!==1n)throw Error('DEVELOPMENT_HISTORY_ROLE');}identityFold(e.value);}
   memo.set(root,bytes);
  }
 }
 return {source,profile,authority,modelIdentity,validateState};
}
export type DevelopmentCompiled=Awaited<ReturnType<typeof compileDevelopmentModel>>;
export async function compileDevelopmentInputs(model:DevelopmentCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(runSeed.length!==32||runSeed.some(b=>b!==0))throw Error('DEVELOPMENT_SEED');if(key(decode(initialState))!==key(decode(developmentInitial())))throw Error('DEVELOPMENT_INITIAL');
 const originals=items(decode(orderedInputs),'list');if(originals.length<1||originals.length>24)throw Error('DEVELOPMENT_HORIZON');
 const frames=originals.map((v,i)=>{const x=rec(v,1494n),ctx=rec(f(x,9n),1429n),report=items(f(x,7n),'list'),choice=choices[Number(uint(f(x,8n)))];if(uint(f(x,1n))!==BigInt(i+1)||f(ctx,4n)!==false||uint(f(ctx,5n))!==1n||f(ctx,6n)!==(choice==='Learn'))throw Error('DEVELOPMENT_CONTEXT');const difficulty=readQ(f(x,6n)).multiply(Q.of(8n));if(difficulty.denominator!==1n)throw Error('DEVELOPMENT_DIFFICULTY');return {phase:Number(uint(f(x,2n))),exercise:f(x,3n),practice:f(x,4n),permitted:f(x,5n),difficulty:Number(difficulty.numerator),report:report.length?report[0]:null,choice,setting:uint(f(ctx,1n))===1n?'Work':'Home',significance:Number(readQ(f(ctx,2n)).multiply(Q.of(4n)).numerator),pressure:Number(readQ(f(ctx,3n)).multiply(Q.of(4n)).numerator),seed:Number(uint(f(x,10n)))} as DevelopmentFrame;});
 const checked=checkedDevelopment(model.profile,frames);if(key(decode(developmentOrdered(model.profile,checked.frames)))!==key(list(originals)))throw Error('DEVELOPMENT_INPUT');
 const state=new AuthoritativeState([{path:path(1436),value:old(1435,[list([])])},{path:path(1457),value:disposition(1453,[q(model.profile.constitution,8)])},{path:path(1500),value:r(1495,[u(frames[0].phase)])},{path:path(1501),value:r(1496,[q(0,1)])},{path:path(1502),value:r(1497,[list([]),u(0)])},{path:path(1503),value:r(1499,[q(0,1),list([])])}]);model.validateState(state);
 const events:ScheduledEvent[]=originals.map((payload,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(i+1)),phase:30n,eventTypeId:eventId('development'),payload,dependencies:list([]),causalParentEventIds:[]}));
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(list(originals)),runSeed});
 return {state,events,frames:checked.frames,runIdentity,runSeed:runSeed.slice()};
}
