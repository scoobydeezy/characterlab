import {canonicalEncode as enc,list,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {chosenData} from '../campaign2/cognitiveChoice';
import {OPTIONS,type Law} from '../campaign3/embarrassment';
import {readHistory} from '../campaign3/embarrassmentPublicMath';
import {embarrassmentPublicRecipe,embarrassmentOriginals,compileEmbarrassmentPublicModel,compileEmbarrassmentPublicInputs} from '../campaign3/embarrassmentPublicModel';
import {createEmbarrassmentPublicRuntime} from '../campaign3/embarrassmentPublicRuntime';
import {prepareEmbarrassmentPublicModel,createEmbarrassmentPublicRun} from '../campaign3/embarrassmentPublicFactory';
import {embarrassmentFrames,type Scenario} from './embarrassmentFixtures';
export function nativeCase(scenario:Scenario='Balanced',law:Law='Contextual',seed=0,projection=2){return {source:embarrassmentPublicRecipe(law,projection),law,initialState:enc(set([])),orderedInputs:embarrassmentOriginals(embarrassmentFrames(scenario)),runSeed:new Uint8Array(32).fill(seed)};}
export const publicInput=(c:ReturnType<typeof nativeCase>)=>({initialState:c.initialState,orderedInputs:c.orderedInputs,runSeed:c.runSeed});
export const restoreInput=(c:ReturnType<typeof nativeCase>,save:Uint8Array)=>({initialState:c.initialState,orderedInputs:c.orderedInputs,save});
export async function nativeRun(c=nativeCase()){return createEmbarrassmentPublicRun(await prepareEmbarrassmentPublicModel(c.source),publicInput(c));}
export async function nativeRuntime(c=nativeCase()){const model=await compileEmbarrassmentPublicModel(c.source),input=await compileEmbarrassmentPublicInputs(model,c.initialState,c.orderedInputs,c.runSeed);return {model,input,runtime:createEmbarrassmentPublicRuntime(model,input)};}
const fraction=(v:ReturnType<typeof readQ>)=>`${v.numerator}/${v.denominator}`;
export function nativeRows(outputs:readonly CanonicalValue[]){
 const groups:CanonicalValue[][]=[];for(const v of outputs){if((v as Extract<CanonicalValue,{kind:'record'}>).schema.typeId===1477n)groups.push([]);groups.at(-1)!.push(v);}
 return groups.map(g=>{const get=(n:number)=>g.find(v=>(v as Extract<CanonicalValue,{kind:'record'}>).schema.typeId===BigInt(n))!,optional=(n:number)=>get(n)?key(get(n)):null,ctx=rec(get(1477),1477n),at=Number(uint(f(ctx,2n))),goals=rec(f(ctx,3n),1470n),app=rec(get(1478),1478n),opt=(i:bigint)=>items(f(app,i),'list'),qopt=(i:bigint)=>opt(i).length?fraction(readQ(opt(i)[0])):null,resolution=get(409),chosen=uint(f(rec(f(rec(resolution,409n),4n),419n),1n))===3n?OPTIONS.findIndex(o=>key(o)===key(f(chosenData(resolution),1n))):-1,cue=items(f(rec(get(1481),1481n),3n),'list');
 return {at,goals:[1n,2n,3n].map(i=>Number(uint(f(goals,i)))),knowledgeBefore:readHistory(f(app,3n)),knowledgeAfter:readHistory(f(rec(get(1483),1483n),4n)),mismatch:opt(4n)[0]??null,seen:opt(5n)[0]??null,judgment:qopt(6n),likelihood:qopt(7n),severity:fraction(readQ(f(app,8n))),vulnerability:'1/1',control:'0/1',affect:items(f(app,9n),'list').map(x=>fraction(readQ(x))),raw:key(f(rec(f(rec(get(1479),1479n),3n),408n),2n)),reasons:key(f(rec(get(1479),1479n),3n)),resolution:key(resolution),probabilities:chosen>=0?items(f(chosenData(resolution),2n),'list').map(x=>fraction(readQ(f(rec(x,421n),2n)))):[],chosen,intent:optional(425),expression:optional(426),plan:optional(431),attempt:optional(432),execution:optional(433),completion:f(rec(get(1480),1480n),5n)===true,cue:cue.length?fraction(readQ(cue[0])):null,observation:{at,reports:items(f(rec(get(1482),1482n),3n),'list').map(v=>items(v,'list')[0]??null)}};});
}
export const nativePresence=(outputs:readonly CanonicalValue[])=>outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1484n).map(v=>f(rec(f(rec(v,1484n),3n),1475n),1n));
