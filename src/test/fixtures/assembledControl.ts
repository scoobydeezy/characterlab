import {canonicalEncode as enc,list,text,unsigned,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
import {CONTROL_RULES,CONTROL_REGISTRY} from '../../assembled/model';
import {CONTROL,CONTROL_SOURCE} from '../../assembled/control';
import {DISPLAY} from '../../assembled/strategy';
import {HABIT_SOURCE} from '../../assembled/habit';
import {sid} from '../../assembled/skill';
import {habitSource,habitData,habitFrame} from './assembledHabit';
import {changeDefinition} from './assembledCharacter';
export const controlSource=()=>{const s=changeDefinition(habitSource(),'definition/task-b',6n,signed(6));return {...s,rulesVersion:CONTROL_RULES,registrySchemaVersion:CONTROL_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(CONTROL)])]))};};
export const controlFrame=(at:number,instruction=0,reminder=false,card=false,support=true,visible=true)=>list([signed(at),unsigned(10),CONTROL_SOURCE,list([text(CONTROL),unsigned(instruction),reminder,support,card,visible]),list([])]);
export function controlData(card=false,seed=0,frames?:CanonicalValue[]){const d=habitData(true,seed),rows=items(decode(d.orderedInputs),'list').map(row=>{let x=[...items(row,'list')];if(key(x[0])===key(signed(7)))x[0]=signed(8);if(key(x[2])===key(DISPLAY)){const a=items(x[3],'list');x[3]=list([a[0],list(items(a[1],'list').map(v=>{const b=items(v,'list');return list([...b.slice(0,5),unsigned(10),...b.slice(6)]);}))]);}if(key(x[2])===key(HABIT_SOURCE)&&key(x[0])===key(signed(8)))return habitFrame(8,true);return list(x);});const decision=items(rows.find(row=>key(items(row,'list')[2])===key(sid(1001,'event/deliberation-opportunity')))!,'list');return {...d,orderedInputs:enc(list([...rows,list([signed(9),...decision.slice(1)]),habitFrame(9,true),...(frames??[controlFrame(6,1),controlFrame(8,2,true,card),controlFrame(9,0,true)])]))};}
