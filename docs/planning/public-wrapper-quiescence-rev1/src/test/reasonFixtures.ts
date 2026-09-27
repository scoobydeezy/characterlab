import {canonicalEncode as enc,list,set,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {reasonRecord as r,decodeReason} from '../campaign3/reasonCodecs';
import {CONTEXT_NAMES,reasonRecipe} from '../campaign3/reasonModel';
import {prepareReasonModel,createReasonRun} from '../campaign3/reasonFactory';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(7);
export const original=(at:number,context:string|undefined,visible=true,values=[1,1],hidden=0)=>r(915,[signed(at),u(context?2:1),u(context?CONTEXT_NAMES.indexOf(context as typeof CONTEXT_NAMES[number])+1:0),list(values.map(n=>q(n,1))),visible,q(hidden,1)]);
export function cases():Record<string,CanonicalValue[]>{return {...Object.fromEntries(CONTEXT_NAMES.map(n=>[n,[original(1,undefined),original(2,n)]])),
 avoidStanding:[original(1,undefined),original(2,'strongStanding',true,[-1,1])],
 hidden:[original(1,undefined),original(2,'collective',true,[1,1],1)],
 denied:[original(1,undefined),original(2,'collective',false)],
 untrained:[original(1,'weakStanding')],
 continued:[original(1,undefined),original(2,'weakStanding'),original(3,undefined),original(4,'weakStanding')]
};}
export const ordered=(values:readonly CanonicalValue[])=>enc(list(values));
export const records=(values:readonly CanonicalValue[],type:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
export async function runCase(name:string,law=1){const source=reasonRecipe(law),orderedInputs=ordered(cases()[name]),run=await createReasonRun(await prepareReasonModel(source),{initialState,orderedInputs,runSeed:seed});while(await run.settleNextInstant()){/* public path */}const outputs=items(decodeReason(run.snapshot().outputs),'list'),compilations=records(outputs,924n);return {source,orderedInputs,run,outputs,compilation:compilations.at(-1)!,nuclei:items(f(compilations.at(-1)!,3n),'list').map(v=>rec(v,923n))};}
