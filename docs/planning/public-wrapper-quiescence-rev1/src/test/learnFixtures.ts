import {canonicalEncode as enc,list,set,signed,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {learnRecord as r,decodeLearn as decode} from '../campaign3/learnCodecs';
import {PROPOSITIONS,learnRecipe} from '../campaign3/learnModel';
import {createLearnRun,prepareLearnModel} from '../campaign3/learnFactory';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
export const initialState=enc(set([])),seed=new Uint8Array(32);
export const frame=(n=1,d=10,bn=9,bd=10,visible=true,p=PROPOSITIONS[0])=>r(885,[p,rational(n,d),rational(bn,bd),visible]);
export const originals=(frames:CanonicalValue[][])=>enc(list(frames.map((v,i)=>r(886,[signed(i+1),list(v)]))));
const prime=(n:number,d:number)=>Array.from({length:25},()=>[frame(n,d,0,1)]);
export function learnCases():Record<string,CanonicalValue[][]>{return {
 compatible:[...prime(2,5),[frame()],[]],
 inconsistent:[...prime(1,20),[frame()],[]],
 zero:[[frame(1,2,1,1)],[]],
 repeated:[...Array.from({length:6},()=>[frame()]),[frame(21,50,0,1)],[]],
 hidden:[...Array.from({length:6},()=>[frame(4,5)]),[frame(21,50,0,1)],[]],
 missing:[...Array.from({length:6},()=>[frame(4,5,9,10,false)]),[frame(21,50,0,1)],[]],
 positiveZero:[...prime(2,5),[frame(1,2,1,1)],[]],
 repeatedEstablished:[...prime(1,20),...Array.from({length:6},()=>[frame()]),[]],
 twoTargets:[[frame(),frame(1,5,0,1,true,PROPOSITIONS[1])],[]]
};}
export const is=(v:CanonicalValue,t:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t;
export function applications(outputs:readonly CanonicalValue[]){return outputs.filter(v=>is(v,892n)).map(v=>rec(v,892n));}
export function posterior(outputs:readonly CanonicalValue[]){return rec(f(applications(outputs).at(-1)!,4n),889n);}
export async function runCase(name:string,law=1,numeric=1){
 const source=learnRecipe(law,numeric),orderedInputs=originals(learnCases()[name]),run=await createLearnRun(await prepareLearnModel(source),{initialState,orderedInputs,runSeed:seed});
 while(await run.settleNextInstant()){}
 return {run,source,orderedInputs,outputs:items(decode(run.snapshot().outputs),'list')};
}
