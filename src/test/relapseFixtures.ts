import {type Frame,controlInputs} from './controlFixtures';
import {compileControlModel,controlRecipe} from '../campaign3/controlModel';
import {createControlRun,prepareControlModel} from '../campaign3/controlFactory';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {decodeControl} from '../campaign3/controlCodecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
export function relapseCases(){
 const main:Frame[]=[...[1,2,3].map(at=>({at,mode:1,visible:true,instruction:at===3?1:0})),{at:4,reminder:true},{at:5},{at:6},{at:7,card:true},{at:8}];
 return {main,noLoad:main.map(x=>({...x,card:false})),otherCue:main.map(x=>({...x,...(x.at===7?{cue:false}:{})})),unseenTraining:main.map(x=>({...x,visible:false})),noGoal:main.map(x=>({...x,instruction:0})),negativeBelief:main.map(x=>({...x,...(x.at===6?{mode:3,visible:true,reward:false}:{})})),hiddenReward:main.map(x=>({...x,...(x.at>3?{reward:false}:{})})),retired:main.map(x=>({...x,card:false,...(x.at===6?{instruction:2}:{})})),lost:main.map(x=>({...x,card:false,...(x.at===7?{support:false}:{}),...(x.at===8?{reminder:true}:{})})),deniedCard:main.map(x=>({...x,...(x.at===7?{board:false}:{})}))};
}
export function relapseSummary(bytes:Uint8Array){
 const outputs=items(decodeControl(bytes),'list'),records=(t:bigint)=>outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
 const controls=records(1015n),histories=records(837n);
 return {actions:records(1024n).map(v=>f(v,3n)),rewards:records(1024n).map(v=>f(v,4n)),inhibited:controls.map(v=>f(v,5n)),retained:controls.map(v=>f(v,2n)),maintained:controls.map(v=>f(v,3n)),appraisals:controls.map(v=>key(f(v,1n))),optionCounts:records(827n).map(v=>items(f(v,3n),'list').length),distributions:records(1019n).map(v=>items(f(v,4n),'list').map(p=>key(f(rec(p,421n),2n)))),historyBefore:histories.map(v=>key(f(v,4n))),historyAfter:histories.map(v=>key(f(v,5n)))};
}
export async function runRelapse(name:keyof ReturnType<typeof relapseCases>,seed=7,candidate=1,law=1){
 const source=controlRecipe({candidate,law}),compiled=await compileControlModel(source),initialState=enc(compiled.initial.canonicalValue()),orderedInputs=controlInputs(relapseCases()[name]),run=await createControlRun(await prepareControlModel(source),{initialState,orderedInputs,runSeed:new Uint8Array(32).fill(seed)});
 while(await run.settleNextInstant());return {summary:relapseSummary(run.snapshot().outputs),safe:run.observerView(),run,source,initialState,orderedInputs};
}
