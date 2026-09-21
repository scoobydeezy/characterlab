import {canonicalEncode as enc,list,set,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataItems as items} from '../campaign2/canonicalData';
import {decisionRecord as r,decodeDecision} from '../campaign3/decisionCodecs';
import {decisionRecipe} from '../campaign3/decisionModel';
import {prepareDecisionModel,createDecisionRun} from '../campaign3/decisionFactory';
export const initialState=enc(set([])),seed=(n=0)=>new Uint8Array(32).fill(n);
export const original=(at:number,regime=3,permitted=true,outcomeVisible=true,hidden=0,currentVisible=true)=>r(932,[signed(at),u(regime),permitted,outcomeVisible,q(hidden,1),currentVisible]);
export const ordered=(values:readonly CanonicalValue[])=>enc(list(values));
export const records=(values:readonly CanonicalValue[],type:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
export function cases(){const rows:{name:string;seed:number;inputs:CanonicalValue[]}[]=[];for(const regime of [1,2,3])for(const s of [0,1,2,3])for(const permitted of [true,false])rows.push({name:`r${regime}-s${s}-${permitted?'allowed':'blocked'}`,seed:s,inputs:[original(1,regime,permitted)]});return [...rows,{name:'hidden',seed:0,inputs:[original(1,3,true,true,1)]},{name:'denied',seed:0,inputs:[original(1,3,true,true,0,false)]},{name:'invisibleAllowed',seed:0,inputs:[original(1,3,true,false)]},{name:'invisibleBlocked',seed:0,inputs:[original(1,3,false,false)]},{name:'continued',seed:0,inputs:[original(1,3),original(2,1,false),original(3,2)]}];}
export async function runCase(name='r3-s0-allowed',law=1){const fixture=cases().find(c=>c.name===name)!;if(!fixture)throw Error('fixture');const source=decisionRecipe(law),orderedInputs=ordered(fixture.inputs),run=await createDecisionRun(await prepareDecisionModel(source),{initialState,orderedInputs,runSeed:seed(fixture.seed)});while(await run.settleNextInstant()){/* public path */}const outputs=items(decodeDecision(run.snapshot().outputs),'list');return {source,orderedInputs,run,outputs};}
