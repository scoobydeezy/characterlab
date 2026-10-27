import {canonicalEncode as enc,list,set,text,unsigned,signed,rational,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items} from '../../campaign2/canonicalData';
import {HORIZON_RULES,HORIZON_REGISTRY} from '../../assembled/model';
import {HORIZON,HORIZON_DISPLAY} from '../../assembled/horizon';
import {ACTION_BODY} from '../../assembled/actionBody';
import {sid} from '../../assembled/skill';
import {prioritySource,priorityData,type PriorityOptions} from './assembledPriority';
import {taskKeys} from './assembledStrategy';
export const horizonSource=()=>{const s=prioritySource(),slots=[...items(decode(s.registry),'list')];slots[10]=list([text(ACTION_BODY),true,set(['one','two'].map(n=>list([sid(1027,'definition/protocol-contact-'+n),rational(0,1)])))]);return {...s,rulesVersion:HORIZON_RULES,registrySchemaVersion:HORIZON_REGISTRY,registry:enc(list([...slots,list([text(HORIZON)])]))};};
export const horizonFrame=(at=1,available:boolean|null=true,opening=5,visible=true)=>list([signed(at),unsigned(10),HORIZON_DISPLAY,list([text(HORIZON),list([list([taskKeys()[0],available===null?list([]):list([unsigned(opening),available]),visible])])]),list([])]);
export function horizonData(available:boolean|null=true,seed=7,frames?:CanonicalValue[],o:PriorityOptions={},I:CanonicalValue|null=rational(1,1),U:CanonicalValue|null=rational(1,1)){const d=priorityData(I,U,seed,{urgency5:rational(1,1),urgency7:rational(1,1),...o});return {...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...(frames??[horizonFrame(1,available)])]))};}
