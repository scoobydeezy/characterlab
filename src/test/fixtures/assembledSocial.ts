import {canonicalEncode as enc,list,text,signed,unsigned,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {SOCIAL_RULES,SOCIAL_REGISTRY} from '../../assembled/model';
import {SOCIAL,SOCIAL_SOURCE} from '../../assembled/social';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {PRACTICE_SETTING,sid} from '../../assembled/skill';
import {communicationSource} from './assembledCommunication';
import {horizonData} from './assembledHorizon';
import {taskKeys} from './assembledStrategy';
import {changeDefinition} from './assembledCharacter';
export const target=semanticReferentFromAuthoredContent(sid(1038,'content/assembled-social/target'));
export const socialSource=(reverse=false)=>{const s=changeDefinition(communicationSource(),'definition/task-b',6n,signed(10));return {...s,rulesVersion:SOCIAL_RULES,registrySchemaVersion:SOCIAL_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(SOCIAL),target,list(taskKeys().map((task,i)=>list([task,(i===0)!==reverse])))])]))};};
export type Frame={at:number;truth?:boolean;kind?:number;mode?:number;receipt?:number;access?:boolean;physical?:boolean};
export const socialFrame=(x:Frame)=>list([signed(x.at),unsigned(110),SOCIAL_SOURCE,list([text(SOCIAL),x.truth??true,unsigned(x.kind??1),unsigned(x.mode??3),unsigned(x.receipt??x.at),x.access??true,x.physical??true]),list([])]);
export function socialData(positive=true,seed=0,frames:Frame[]=[{at:1,mode:positive?3:4},{at:2,mode:positive?3:4}]){const d=horizonData(null,seed),rows=items(decode(d.orderedInputs),'list').map(row=>{const x=[...items(row,'list')];if(key(x[2])===key(PRIORITY_DISPLAY)){const p=[...items(x[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const a=[...items(v,'list')];a[3]=list([q(1,1)]);return list(a);}));x[3]=list(p);}if(key(x[2])===key(PRACTICE_SETTING)){const p=[...items(x[3],'list')];p[3]=q(0,1);x[3]=list(p);}return list(x);});return {...d,orderedInputs:enc(list([...rows,...frames.map(socialFrame)]))};}
