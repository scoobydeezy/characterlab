/** identity-belief-public/0.1-candidate: native independent holder admission. */
import {canonicalEncode as enc,list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {identityRecipe,compileIdentityModel,compileIdentityInputs,taskOrdered,taskInitial,sid,actor,path as sourcePath,reads as sourceReads,writes as sourceWrites,owner as sourceOwner,pattern,copyData,taskStages} from './identityPublicModel';
import {identityBeliefPublicRecord as r,decodeIdentityBeliefPublic as decode} from './identityBeliefPublicCodecs';
import {IDENTITY_BELIEF_LAWS,HOLDERS,identityBeliefInputValue,learnIdentityBelief,type IdentityBeliefLaw,type IdentityBeliefInput,type IdentityEvidence,type IdentityEstimate} from './identityBelief';
export {pattern,copyData,actor,sid};
export const VERSION='identity-belief-public/0.1-candidate';
export const stages=[...taskStages,...[1,2,3].flatMap(h=>[[`appraise${h}`,50],[`receive${h}`,130],[`learn${h}`,140]] as const)] as readonly (readonly [string,number])[];
export const eventId=(_family:string,n:string)=>sid(1001,'event/identity-belief/'+n);
export const holderOf=(name:string)=>Number(name.at(-1));
export const path=(_family:string,root:number,h=1):StatePath=>root===1447?{rootStateTypeId:1447n,fieldId:1n,selectors:[{kind:'mapKey',key:u(h)}]}:sourcePath('Task',root);
export const owner=(_family:string,n:string)=>n.startsWith('learn')?sid(1025,'authority/identity-belief/'+n):sourceOwner('Task',n);
export const reads=(_family:string,n:string,law:IdentityBeliefLaw='Mean')=>n.startsWith('appraise')?[path('Task',1447,holderOf(n))]:n.startsWith('learn')?[path('Task',1447,holderOf(n)),...(law==='StandingAlias'&&n==='learn1'?[path('Task',1436)]:law==='PrivateOracle'&&n!=='learn1'?[path('Task',1447,1)]:[])]:sourceReads('Task',n);
export const writes=(_family:string,n:string)=>n.startsWith('learn')?[path('Task',1447,holderOf(n))]:sourceWrites('Task',n);
const ownership=()=>compileMutationAuthorityRegistry(['execution','identity','learn1','learn2','learn3'].map(n=>({authorityName:(owner('Task',n).payload as {value:string}).value,ownedLeaves:writes('Task',n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:p.rootStateTypeId===1447n?1446n:p.rootStateTypeId===1436n?1435n:1440n},removalAllowed:false}))})));
export function beliefRecipe(law:IdentityBeliefLaw='Mean'){
 if(!IDENTITY_BELIEF_LAWS.includes(law))throw Error('IDENTITY_BELIEF_PUBLIC_LAW');
 const parameters=enc(r(1443,[text(VERSION),text(law),decode(identityRecipe().parameters)]));
 return {parameters,registry:enc(list([ownership().definitionValue,list(stages.map(([n,p])=>list([eventId('Task',n),u(p),list(reads('Task',n,law).map(x=>statePathPatternValue(pattern(x)))),list(writes('Task',n).map(x=>statePathPatternValue(pattern(x)))),owner('Task',n)])))]))};
}
export type BeliefSource=ReturnType<typeof beliefRecipe>;
export const initialBytes=taskInitial;
const modes=['Actual','Opposite','Neutral','Absent'];
export function orderedBytes(input:IdentityBeliefInput){identityBeliefInputValue(input);const xs=items(decode(taskOrdered(input.source)),'list');return enc(list(xs.map((x,i)=>r(1444,[x,list(input.channels[i].map(m=>u(modes.indexOf(m)+1))),list(input.goals[i].map(g=>q(g,1)))]))));}
export function evidenceValue(e:IdentityEvidence){return r(1445,[u(HOLDERS.indexOf(e.holder)+1),actor('Task'),text(e.proposition),u(e.ticket),q(e.polarity,1)]);}
export function evidence(v:CanonicalValue,h:number):IdentityEvidence{const x=rec(v,1445n),polarity=readQ(f(x,5n));if(uint(f(x,1n))!==BigInt(h)||key(f(x,2n))!==key(actor('Task'))||dataText(f(x,3n))!=='positive-task-fidelity'||polarity.denominator!==1n)throw Error('IDENTITY_BELIEF_PUBLIC_EVIDENCE');const e:IdentityEvidence={holder:HOLDERS[h-1],target:'target',proposition:'positive-task-fidelity',ticket:Number(uint(f(x,4n))),polarity:Number(polarity.numerator) as -1|0|1};learnIdentityBelief(e.holder,[],e,'Mean');return e;}
export const optionalQ=(x:string|null)=>list(x===null?[]:[q(...x.split('/').map(BigInt) as [bigint,bigint])]);
export function beliefState(h:number,history:IdentityEvidence[],estimate:IdentityEstimate){return r(1446,[u(h),list(history.map(evidenceValue)),optionalQ(estimate.value),u(estimate.evidence)]);}
export function stateData(v:CanonicalValue,h:number){const x=rec(v,1446n);if(uint(f(x,1n))!==BigInt(h))throw Error('IDENTITY_BELIEF_PUBLIC_OWNER');const history=items(f(x,2n),'list').map(e=>evidence(e,h));learnIdentityBelief(HOLDERS[h-1],history,null,'Mean');const xs=items(f(x,3n),'list'),vQ=xs.length?readQ(xs[0]):null;return {history,estimate:{value:vQ?`${vQ.numerator}/${vQ.denominator}`:null,evidence:Number(uint(f(x,4n)))}};}
export async function compileBeliefModel(input:BeliefSource){
 const source=copyData(input,['parameters','registry']),profile=rec(decode(source.parameters),1443n),beliefLaw=dataText(f(profile,2n)) as IdentityBeliefLaw,expected=beliefRecipe(beliefLaw);if(key(decode(source.parameters))!==key(decode(expected.parameters))||key(decode(source.registry))!==key(decode(expected.registry)))throw Error('IDENTITY_BELIEF_EXACT_MODEL');
 const base=await compileIdentityModel(identityRecipe()),own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(list([actor('Task'),profile])),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'identity-belief-exact/0.1',randomAlgorithmVersion:'rng/identity-eligibility-routed-sha256/0.1-candidate',registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 // Exact-byte one-entry validation memo; never skips validation of changed source bytes.
 let validatedSource:string|undefined;
 function validateState(s:AuthoritativeState){if(s.entries().length!==5)throw Error('IDENTITY_BELIEF_ROOTS');const sourceState=new AuthoritativeState(s.entries().filter(e=>e.path.rootStateTypeId!==1447n)),sourceKey=key(sourceState.canonicalValue());if(sourceKey!==validatedSource){base.validateState(sourceState);validatedSource=sourceKey;}for(const h of [1,2,3])stateData(decode(enc(s.read(path('Task',1447,h)).value!)),h);}
 return {...base,source,beliefLaw,authority,modelIdentity,stages,validateState};
}
export type BeliefCompiled=Awaited<ReturnType<typeof compileBeliefModel>>;
export async function compileBeliefInputs(model:BeliefCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(runSeed.length!==32||runSeed[0]>7||!runSeed.every(x=>x===runSeed[0]))throw Error('IDENTITY_BELIEF_SEED');
 const originals=items(decode(orderedInputs),'list');if(originals.length!==5)throw Error('IDENTITY_BELIEF_INPUT_COUNT');
 const channels:number[][]=[],goals:(1|-1)[][]=[];
 originals.forEach(v=>{const x=rec(v,1444n),cs=items(f(x,2n),'list').map(v=>Number(uint(v))),gs=items(f(x,3n),'list').map(v=>{const n=readQ(v);if(n.denominator!==1n||![-1n,1n].includes(n.numerator))throw Error('IDENTITY_BELIEF_GOAL');return Number(n.numerator) as 1|-1;});if(![1,4].includes(cs[0]))throw Error('IDENTITY_BELIEF_SELF_CHANNEL');channels.push(cs);goals.push(gs);});
 const base=await compileIdentityInputs(await compileIdentityModel(identityRecipe()),initialState,enc(list(originals.map(v=>f(rec(v,1444n),1n)))),runSeed);
 const state=new AuthoritativeState([...base.state.entries(),...[1,2,3].map(h=>({path:path('Task',1447,h),value:beliefState(h,[],{value:null,evidence:0})}))]);model.validateState(state);
 const events=base.events.map((e,i)=>({...e,eventTypeId:eventId('Task','context'),payload:originals[i]}));
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
 return {...base,state,events,channels,goals,runIdentity};
}
