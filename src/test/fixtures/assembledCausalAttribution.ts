import {list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {CAUSAL_RULES,CAUSAL_REGISTRY} from '../../assembled/model';
import {CAUSAL,CAUSAL_QUERY,CAUSAL_SOURCE,CAUSAL_CONTEXT} from '../../assembled/causalAttribution';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {source as oldSource,data as oldData,decode,items,key,enc} from './assembledValueReceiving';
import {topic} from './assembledOutcomeDisclosure';
export const task=()=>items(topic(),'list')[1];
export const source=()=>({...oldSource(),rulesVersion:CAUSAL_RULES,registrySchemaVersion:CAUSAL_REGISTRY});
export type Options={goal?:'ProtectRoute'|'RepairCapability';denied?:boolean;changed?:boolean;missing?:boolean;difficulty?:CanonicalValue;duplicate?:boolean;foreign?:boolean;current?:boolean};
export function data(o:Options={}){
 const d=oldData(true,0,undefined,{missingA:o.missing}),t=task(),rows=items(decode(d.orderedInputs),'list').map(v=>{const x=[...items(v,'list')];if(key(x[2])===key(PERFORMANCE_SETTING)&&key(x[0])===key(signed(3))){const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{const a=items(v,'list');return list([a[0],a[1],unsigned(1)]);}))]);}if(o.difficulty&&key(x[2])===key(PRACTICE_SETTING)&&key(x[0])===key(signed(3))){const p=[...items(x[3],'list')];p[3]=o.difficulty;x[3]=list(p);}return list(x);});
 for(const at of [3,5,7])rows.push(list([signed(at),unsigned(30),CAUSAL_CONTEXT,list([text(CAUSAL_QUERY),t,unsigned(3),text(o.goal??'ProtectRoute')]),list([])]));
 for(const [i,at]of [4,o.current?7:6].entries())rows.push(list([signed(at),unsigned(10),CAUSAL_SOURCE,list([text(CAUSAL),t,unsigned(o.foreign&&i?2:3),unsigned(o.duplicate?1:i+1),!o.denied,i?true:!!o.changed,i?true:!!o.changed]),list([])]));
 return {...d,orderedInputs:enc(list(rows))};
}
export {decode,items,key,enc};
