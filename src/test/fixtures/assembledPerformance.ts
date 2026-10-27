import {canonicalEncode as enc,list,text,unsigned,signed,rational,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
import {PERFORMANCE_RULES,PERFORMANCE_REGISTRY} from '../../assembled/model';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../../assembled/performance';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY} from '../../assembled/strategy';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {horizonSource,horizonData} from './assembledHorizon';
import {taskKeys,frame} from './assembledStrategy';
export const performanceSource=()=>{const s=horizonSource();return {...s,rulesVersion:PERFORMANCE_RULES,registrySchemaVersion:PERFORMANCE_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(PERFORMANCE)])]))};};
export const feedbackFrame=(at:number,mode=0,visible=true,task=taskKeys()[0])=>list([signed(at),unsigned(30),PERFORMANCE_SETTING,list([text(PERFORMANCE),list([list([task,visible,unsigned(mode)])])]),list([])]);
export function performanceData(mode=1,seed=7,o:{feedback?:CanonicalValue[];alternative?:boolean;difficulty?:CanonicalValue;importance?:CanonicalValue}={}){const d=horizonData(null,seed),rows=items(decode(d.orderedInputs),'list').filter(row=>key(items(row,'list')[2])!==key(DISPLAY)).map(row=>{const x=items(row,'list');if(key(x[2])===key(PRIORITY_DISPLAY)&&key(x[0])===key(signed(1))){const payload=items(x[3],'list'),goals=items(payload[1],'list').map(v=>{const g=items(v,'list');return list([g[0],list([key(g[0])===key(taskKeys()[0])?(o.importance??rational(1,1)):rational(0,1)]),...g.slice(2)]);});return list([...x.slice(0,3),list([payload[0],list(goals)]),x[4]]);}if(key(x[2])===key(PRACTICE_SETTING)&&o.difficulty!==undefined){const a=items(x[3],'list');return list([...x.slice(0,3),list([...a.slice(0,3),o.difficulty,...a.slice(4)]),x[4]]);}return row;});return {...d,orderedInputs:enc(list([...rows,frame(1,[true,o.alternative!==false],1),...(o.feedback??[feedbackFrame(3,mode),feedbackFrame(5,mode),feedbackFrame(7,0)])]))};}
