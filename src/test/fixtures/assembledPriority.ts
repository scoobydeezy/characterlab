import {canonicalEncode as enc,list,text,unsigned,signed,rational,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {decodeEmbodied as decode,embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataKey as key,dataField as f,dataRecord as rec} from '../../campaign2/canonicalData';
import {PRIORITY_RULES,PRIORITY_REGISTRY} from '../../assembled/model';
import {PRIORITY,PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {strategySource,strategyData,taskKeys} from './assembledStrategy';
export const prioritySource=()=>{const s=strategySource();return {...s,rulesVersion:PRIORITY_RULES,registrySchemaVersion:PRIORITY_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(PRIORITY)])]))};};
const optional=(v:CanonicalValue|null)=>v===null?list([]):list([v]);
export const priorityFrame=(at:number,I:CanonicalValue|null,U:CanonicalValue|null,adoptionVisible=true,urgencyVisible=true)=>list([signed(at),unsigned(10),PRIORITY_DISPLAY,list([text(PRIORITY),list(taskKeys().map((task,i)=>list([task,optional(i===0?I:at===1?rational(1,1):null),adoptionVisible,optional(i===0?U:rational(0,1)),urgencyVisible])))]),list([])]);
export interface PriorityOptions {adoptionVisible?:boolean;urgencyVisible?:boolean;body?:number;urgency5?:CanonicalValue|null;urgency7?:CanonicalValue|null;}
export function priorityData(I:CanonicalValue|null=rational(1,1),U:CanonicalValue|null=rational(0,1),seed=7,o:PriorityOptions={}){
 const d=strategyData(),rows=items(decode(d.orderedInputs),'list').filter(row=>key(items(row,'list')[2])!==key(DISPLAY));
 const route=list([signed(1),unsigned(30),DISPLAY,list([text(STRATEGY),list(taskKeys().flatMap((task,i)=>[0,1].map(route=>list([task,unsigned(route),unsigned(route+1),route===i,unsigned(1),unsigned(8),true]))))]),list([])]);
 const state=restoreAuthoritativeState(decode(d.initialState)),initial=new AuthoritativeState(state.entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[rational(o.body??100,1),f(rec(e.value,454n),2n)])}:e));
 const runSeed=new Uint8Array(32);runSeed[31]=seed;
 return {...d,initialState:enc(initial.canonicalValue()),runSeed,orderedInputs:enc(list([...rows,route,priorityFrame(1,I,null,o.adoptionVisible!==false),priorityFrame(3,null,U,true,o.urgencyVisible!==false),priorityFrame(5,null,o.urgency5===undefined?rational(0,1):o.urgency5,true,o.urgencyVisible!==false),priorityFrame(7,null,o.urgency7??null)]))};
}
export function mapPriorityInputs(d:ReturnType<typeof priorityData>,change:(row:CanonicalValue)=>CanonicalValue|undefined){return {...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').flatMap(row=>{const next=change(row);return next===undefined?[]:[next];})))};}
