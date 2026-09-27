import {canonicalEncode as enc,list,set,signed,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {epiRecord as r,decodeEpi} from '../campaign3/epiCodecs';
import {epiRecipe,PROPOSITIONS} from '../campaign3/epiModel';
import {prepareEpiModel,createEpiRun} from '../campaign3/epiFactory';
import {dataItems as items,dataRecord as rec} from '../campaign2/canonicalData';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(19);
export const frame=(n=1,d=10,bn=19,bd=20,visible=true,p=0)=>r(898,[PROPOSITIONS[p],rational(n,d),rational(bn,bd),visible]);
export const originals=(rows:readonly (readonly CanonicalValue[])[])=>enc(list(rows.map((frames,i)=>r(899,[signed(i+1),list(frames)]))));
export function epiCases(){return {
 establishedA:[[frame(2,5,0,1)],[frame()],[]],establishedB:[[frame(2,5,0,1)],[frame(4,5)],[]],
 informativeA:[[frame(1,100,0,1)],[frame()],[]],informativeB:[[frame(1,100,0,1)],[frame(4,5)],[]],
 freshA:[[frame()],[]],freshB:[[frame(4,5)],[]],
 permittedA:[[frame(1,10,0,1)],[]],permittedB:[[frame(4,5,0,1)],[]],
 missingA:[[frame(1,10,19,20,false)],[]],missingB:[[frame(4,5,19,20,false)],[]],
 zero:[[frame(0,1,1,1)],[]],twoTargets:[[frame(),frame(4,5,19,20,true,1)],[]]
};}
export const is=(v:CanonicalValue,t:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t;
export const records=(vs:readonly CanonicalValue[],t:bigint)=>vs.filter(v=>is(v,t)).map(v=>rec(v,t));
export async function runCase(name:keyof ReturnType<typeof epiCases>,projection=1,numeric=1){const source=epiRecipe(projection,numeric),orderedInputs=originals(epiCases()[name]),run=await createEpiRun(await prepareEpiModel(source),{initialState,orderedInputs,runSeed:seed});while(await run.settleNextInstant()){/* settle */}return {source,orderedInputs,run,outputs:items(decodeEpi(run.snapshot().outputs),'list')};}
