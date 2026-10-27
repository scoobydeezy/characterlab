import {canonicalEncode as enc,list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items} from '../../campaign2/canonicalData';
import {COMMUNICATION_RULES,COMMUNICATION_REGISTRY} from '../../assembled/model';
import {COMM,COMM_SOURCE} from '../../assembled/communication';
import {sid} from '../../assembled/skill';
import {controlSource,controlData} from './assembledControl';
import {target} from './assembledHabit';
export const recipients=['a','b'].map(n=>sid(1000,'observer/assembled-communication/'+n));
export const communicationSource=()=>{const s=controlSource();return {...s,rulesVersion:COMMUNICATION_RULES,registrySchemaVersion:COMMUNICATION_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(COMM),target,list(recipients)])]))};};
export type Frame={at:number;truth?:boolean;display?:boolean;privateAccess?:boolean;delivery?:boolean;a?:boolean;b?:boolean};
export const communicationFrame=(x:Frame)=>list([signed(x.at),unsigned(10),COMM_SOURCE,list([text(COMM),x.truth??true,x.display??true,x.privateAccess??true,x.delivery??true,x.a??true,x.b??true]),list([])]);
export const frames:Frame[]=[{at:3,a:false,b:false},{at:5,a:false,b:false},{at:8,b:false},{at:9,privateAccess:false,b:false}];
export function communicationData(card=false,seed=0,xs:Frame[]=frames){const d=controlData(card,seed);return {...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...xs.map(communicationFrame)]))};}
