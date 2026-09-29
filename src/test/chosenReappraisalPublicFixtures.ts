import {canonicalEncode as enc,list,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {chosenData} from '../campaign2/cognitiveChoice';
import {OPTIONS,type Law,type Row} from '../campaign3/chosenReappraisal';
import {nativeReasons} from '../campaign3/chosenReappraisalPublicMath';
import {chosenReappraisalPublicRecipe,chosenReappraisalOriginals,compileChosenReappraisalPublicModel,compileChosenReappraisalPublicInputs} from '../campaign3/chosenReappraisalPublicModel';
import {createChosenReappraisalPublicRuntime} from '../campaign3/chosenReappraisalPublicRuntime';
import {prepareChosenReappraisalPublicModel,createChosenReappraisalPublicRun} from '../campaign3/chosenReappraisalPublicFactory';
import {chosenFrames,type Scenario} from './chosenReappraisalFixtures';
export function nativeCase(scenario:Scenario='Balanced',law:Law='BenefitRelative',seed=0,projection=1){return {source:chosenReappraisalPublicRecipe(law,projection),law,initialState:enc(set([])),orderedInputs:chosenReappraisalOriginals(chosenFrames(scenario)),runSeed:new Uint8Array(32).fill(seed)};}
export const publicInput=(c:ReturnType<typeof nativeCase>)=>({initialState:c.initialState,orderedInputs:c.orderedInputs,runSeed:c.runSeed});
export const restoreInput=(c:ReturnType<typeof nativeCase>,save:Uint8Array)=>({initialState:c.initialState,orderedInputs:c.orderedInputs,save});
export async function nativeRun(c=nativeCase()){return createChosenReappraisalPublicRun(await prepareChosenReappraisalPublicModel(c.source),publicInput(c));}
export async function nativeRuntime(c=nativeCase()){const model=await compileChosenReappraisalPublicModel(c.source),input=await compileChosenReappraisalPublicInputs(model,c.initialState,c.orderedInputs,c.runSeed);return {model,input,runtime:createChosenReappraisalPublicRuntime(model,input)};}
const fraction=(v:ReturnType<typeof readQ>)=>`${v.numerator}/${v.denominator}`;
export function nativeRows(outputs:readonly CanonicalValue[],law:Law):Row[]{
 const groups:CanonicalValue[][]=[];for(const v of outputs){if((v as Extract<CanonicalValue,{kind:'record'}>).schema.typeId===1467n)groups.push([]);groups.at(-1)!.push(v);}
 return groups.map(g=>{const get=(n:number)=>g.find(v=>(v as Extract<CanonicalValue,{kind:'record'}>).schema.typeId===BigInt(n))!,optional=(n:number)=>get(n)?key(get(n)):null,ctx=rec(get(1467),1467n),at=Number(uint(f(ctx,2n))),goals=rec(f(ctx,3n),1461n),gs=[Number(uint(f(goals,1n))),Number(uint(f(goals,2n)))],env=rec(get(1463),1463n),app=rec(get(1032),1032n),knowledge=f(env,4n),math=nativeReasons(law,knowledge,gs,at,f(ctx,4n)===true),frame=rec(get(1464),1464n),before=items(f(frame,2n),'list'),after=items(f(frame,3n),'list'),resolution=get(409),chosen=uint(f(rec(f(rec(resolution,409n),4n),419n),1n))===3n?OPTIONS.findIndex(o=>key(o)===key(f(chosenData(resolution),1n))):-1;
 return {at,goals:gs,eligible:f(env,5n)===true,values:math.values.map(fraction),appraisal:key(app),affect:items(f(app,7n),'list').map(x=>fraction(readQ(x))),means:math.k.means.map(x=>x?fraction(x):null),knowledgeBefore:key(knowledge),knowledgeAfter:key(f(rec(get(1465),1465n),3n)),frameBefore:before.length?key(before[0]):null,frameAfter:after.length?key(after[0]):null,raw:key(f(rec(f(env,6n),408n),2n)),reasons:key(f(env,6n)),resolution:key(resolution),probabilities:chosen>=0?items(f(chosenData(resolution),2n),'list').map(x=>fraction(readQ(f(rec(x,421n),2n)))):[],chosen,intent:optional(425),expression:optional(426),plan:optional(431),attempt:optional(432),completion:f(rec(get(1466),1466n),5n)===true,observation:key(get(1027))};});
}
