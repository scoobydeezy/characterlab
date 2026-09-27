import {canonicalEncode as enc,list,set,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataItems as items} from '../campaign2/canonicalData';
import {commitRecord as r,decodeCommit} from '../campaign3/commitCodecs';
import {commitRecipe} from '../campaign3/commitModel';
import {prepareCommitModel,createCommitRun} from '../campaign3/commitFactory';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(7);
export const original=(at:number,command=0,communicate=0,recipients:number[]=[],hidden=0,training=false)=>r(954,[signed(at),training,u(command),u(communicate),set(recipients.map(u)),q(hidden,1)]);
export const ordered=(values:readonly CanonicalValue[])=>enc(list(values)),records=(values:readonly CanonicalValue[],type:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
export function cases(){const train=()=>original(1,0,0,[],0,true),timeline=(kind:string)=>[train(),original(2,kind==='absent'?0:1),original(3,kind==='absent'?0:2,['private','absent'].includes(kind)?0:1,kind==='both'?[1,2]:kind==='swapped'?[2]:[1]),original(4,kind==='absent'?0:3,kind==='retired'?1:0,kind==='retired'?[1]:[]),original(5,0,['private','absent'].includes(kind)?0:2,kind==='both'?[1,2]:kind==='swapped'?[1]:[2]),original(6)];const out=Object.fromEntries(['main','private','absent','both','swapped','retired'].map(n=>[n,timeline(n)]));out.hidden=timeline('main').map(v=>{const fields=new Map(rec(v,954n).fields);fields.set(6n,q(1,1));return r(954,fields);});return out;}
export async function runCase(name='main',law=1){const source=commitRecipe(law),orderedInputs=ordered(cases()[name]),run=await createCommitRun(await prepareCommitModel(source),{initialState,orderedInputs,runSeed:seed});while(await run.settleNextInstant()){/* public path */}const outputs=items(decodeCommit(run.snapshot().outputs),'list');return {source,orderedInputs,run,outputs};}
