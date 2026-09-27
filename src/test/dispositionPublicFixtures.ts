import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {chosenData} from '../campaign2/cognitiveChoice';
import {OPTIONS} from '../campaign3/longitudinalModel';
import {identityFold,qualifications} from '../campaign3/identityPublicMath';
import {dispositionRecipe,dispositionInitial,dispositionOrdered,compileDispositionModel,compileDispositionInputs} from '../campaign3/dispositionPublicModel';
import {prepareDispositionModel,createDispositionPublicRun} from '../campaign3/dispositionPublicFactory';
import {createDispositionPublicRuntime} from '../campaign3/dispositionPublicRuntime';
import {decodeDispositionPublic as decode,parseDispositionSave} from '../campaign3/dispositionPublicCodecs';
import {dispositionCase,dispositionRoster,type DispositionCase} from './dispositionAdaptationFixtures';
export {dispositionRoster};
export function nativeCase(row:DispositionCase=dispositionRoster[0]){const c=dispositionCase(row);return {...c,source:dispositionRecipe(c.profile),initialState:dispositionInitial(),orderedInputs:dispositionOrdered(c.profile,c.frames),runSeed:new Uint8Array(32)};}
export const publicInput=(c:ReturnType<typeof nativeCase>)=>({initialState:c.initialState,orderedInputs:c.orderedInputs,runSeed:c.runSeed});
export const restoreInput=(c:ReturnType<typeof nativeCase>,save:Uint8Array)=>({initialState:c.initialState,orderedInputs:c.orderedInputs,save});
export async function nativeRun(c=nativeCase()){return createDispositionPublicRun(await prepareDispositionModel(c.source),publicInput(c));}
export async function nativeRuntime(c=nativeCase()){const model=await compileDispositionModel(c.source),input=await compileDispositionInputs(model,c.initialState,c.orderedInputs,c.runSeed);return {model,input,runtime:createDispositionPublicRuntime(model,input)};}
const fraction=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
export function nativeRows(outputs:readonly CanonicalValue[],frames:ReturnType<typeof nativeCase>['frames']){
 const groups:CanonicalValue[][]=[];let current:CanonicalValue[]=[];for(const v of outputs){current.push(v);if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1456n){groups.push(current);current=[];}}
 return groups.map((xs,i)=>{const find=(id:number)=>xs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===BigInt(id)),operand=find(1455),decision=find(1431),expression=find(1433),qualification=find(1434),update=rec(find(1456)!,1456n),journal=f(update,2n),choice=decision?chosenData(f(rec(decision,1431n),3n)):undefined;
 return {at:i+1,frame:frames[i],state:{constitution:operand?fraction(f(rec(f(rec(operand,1455n),2n),1453n),1n)):null,before:fraction(f(update,3n)),after:fraction(f(update,4n)),effectiveBefore:operand?fraction(f(rec(operand,1455n),5n)):null,feedback:operand?fraction(f(rec(operand,1455n),6n)):null,count:qualifications(journal).length},chosen:choice?(key(f(choice,1n))===key(OPTIONS[0])?'A':'B'):null,probabilities:choice?items(f(choice,2n),'list').map(v=>fraction(f(rec(v,421n),2n))):[],authorship:choice?fraction(f(choice,7n)):null,contribution:qualification?fraction(f(rec(qualification,1434n),4n)):'0/1',strength:fraction({kind:'rational',numerator:identityFold(journal).strength.numerator,denominator:identityFold(journal).strength.denominator}),executed:Number(uint(f(rec(find(1439)!,1439n),2n))),expression:expression?key(expression):null,journal:key(journal)};});
}
export function saveOutputs(save:Uint8Array){return items(f(parseDispositionSave(save),12n),'list');}
