import {canonicalEncode as enc,list,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {OPTIONS} from '../campaign3/longitudinalModel';
import {chosenData} from '../campaign2/cognitiveChoice';
import {readQ} from '../campaign2/cognitiveMath';
import {identityRecipe,taskInitial,taskOrdered,biologyOrdered,contextValue,compileIdentityModel,compileIdentityInputs} from '../campaign3/identityPublicModel';
import {createIdentityTaskRuntime} from '../campaign3/identityTaskRuntime';
import {createIdentityBiologyRuntime} from '../campaign3/identityBiologyRuntime';
import {decodeIdentityPublic} from '../campaign3/identityPublicCodecs';
import {identityFold} from '../campaign3/identityPublicMath';
import {initialBytes,orderedBytes} from '../campaign3/biologyPublicModel';
import {value} from '../campaign3/biologyPublicData';
import {eligibilityInputs,type EligibilityScenario} from './identityEligibilityFixtures';
import {matchedBiology,hiddenBiology} from './biologyPublicFixtures';
import {biologicalScenarios} from './biologicalIntegrationFixtures';
import type {EligibilityLaw} from '../campaign3/identityEligibility';
export const records=(xs:readonly CanonicalValue[],type:number)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===BigInt(type)).map(v=>rec(v,BigInt(type)));
export const fraction=(v:CanonicalValue)=>{const n=readQ(v);return `${n.numerator}/${n.denominator}`;};
export function taskCase(scenario:EligibilityScenario='Meaningful',law:EligibilityLaw='Threshold',seed=6){return {source:identityRecipe('Task',law),initialState:taskInitial(),orderedInputs:taskOrdered(eligibilityInputs(scenario)),runSeed:new Uint8Array(32).fill(seed)};}
export function bioCase(name='matched',law:EligibilityLaw='Threshold',seed=7){
 let c=name.startsWith('hidden')?hiddenBiology(name==='hiddenChanged'):name==='main'?{...biologicalScenarios().main,law:'Full' as const}:matchedBiology();
 if(name==='noGoal'){c=matchedBiology();c.frames=c.frames.map(f=>({...f,adoptProtection:false,reminder:false}));}
 const contexts=c.frames.map((_,i)=>contextValue({setting:'Work',significance:name==='trivial'?0:4,pressure:name==='constrained'?4:0,instructed:false,movement:'Chosen',permitted:true},true));
 return {source:identityRecipe('Biological',law,c.law,c.config),initialState:initialBytes(c.config.initial),orderedInputs:biologyOrdered(orderedBytes(c.frames),contexts),runSeed:new Uint8Array(32).fill(seed),c};
}
export async function runtime(c:ReturnType<typeof taskCase>){const model=await compileIdentityModel(c.source),input=await compileIdentityInputs(model,c.initialState,c.orderedInputs,c.runSeed);return {model,input,runtime:model.family==='Task'?createIdentityTaskRuntime(model,input):createIdentityBiologyRuntime(model,input)};}
export function taskSemantic(outputs:readonly CanonicalValue[]){const expressions=records(outputs,1433),quals=records(outputs,1434),applications=records(outputs,1437),executions=records(outputs,1439);return applications.map((app,i)=>{const e=expressions.find(e=>uint(f(e,8n))===BigInt(i+1)),q=quals.find(q=>uint(f(rec(f(q,2n),1433n),8n))===BigInt(i+1)),chosen=e?chosenData(f(rec(f(rec(f(e,5n),1432n),3n),425n),2n)):undefined,s=identityFold(f(app,3n)).strength;return {at:i+1,chosen:chosen?(key(f(chosen,1n))===key(OPTIONS[0])?'A':'B'):null,authorship:chosen?fraction(f(chosen,7n)):null,probabilities:chosen?items(f(chosen,2n),'list').map(p=>fraction(f(rec(p,421n),2n))):[],contribution:q&&uint(f(q,3n))!==6n?fraction(f(q,4n)):'0/1',strength:`${s.numerator}/${s.denominator}`,executed:Number(uint(f(executions[i],2n)))};});}
export const nativeOutputs=(run:{snapshot():{outputs:Uint8Array}})=>items(decodeIdentityPublic(run.snapshot().outputs),'list');
