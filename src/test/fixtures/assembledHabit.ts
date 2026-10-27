import {canonicalEncode as enc,list,text,unsigned,signed,rational,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
import {HABIT_RULES,HABIT_REGISTRY} from '../../assembled/model';
import {HABIT,HABIT_SOURCE} from '../../assembled/habit';
import {DISPLAY} from '../../assembled/strategy';
import {sid} from '../../assembled/skill';
import {performanceSource,performanceData} from './assembledPerformance';
import {taskKeys} from './assembledStrategy';
import {mapPriorityInputs} from './assembledPriority';
export const target=sid(1027,'definition/protocol-contact-one');
export const habitSource=()=>{const s=performanceSource();return {...s,rulesVersion:HABIT_RULES,registrySchemaVersion:HABIT_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(HABIT),target])]))};};
export const habitFrame=(at:number,reward=false,o:{cue?:boolean;cueVisible?:boolean;information?:boolean;visible?:boolean;report?:number}={})=>list([signed(at),unsigned(10),HABIT_SOURCE,list([text(HABIT),o.cue??true,o.cueVisible??true,o.information??false,reward,o.visible??true,unsigned(o.report??0)]),list([])]);
export function habitData(reward=true,seed=7,frames?:CanonicalValue[],difficulty:CanonicalValue=rational(0,1)){
 const base=performanceData(1,seed,{difficulty}),d=mapPriorityInputs(base,row=>{const x=items(row,'list');if(key(x[2])!==key(DISPLAY))return row;const a=items(x[3],'list');return list([...x.slice(0,3),list([a[0],list(items(a[1],'list').map(v=>{const b=items(v,'list');return key(b[0])===key(taskKeys()[1])?list([...b.slice(0,3),key(b[1])===key(unsigned(1)),...b.slice(4)]):v;}))]),x[4]]);});
 return {...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...(frames??[habitFrame(3,reward),habitFrame(5,reward),habitFrame(6,false,{information:true}),habitFrame(7)])]))};
}
