/** M60: three physical tasks, reserve10 unsensed, workspace6, seed0.
 * Coat reports1/2; chosen A informs/B contradicts; channel3/4; no authored assertion.
 * Goals1/1/0 unchanged; perceived availability selects one action, not forced choice. */
import {list,text,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {dataUnsigned as uint} from '../../campaign2/canonicalData';
import {CONTRARY_RULES,CONTRARY_REGISTRY} from '../../assembled/model';
import {ATTACHMENT,LOSS} from '../../assembled/attachment';
import {EMBARRASSMENT} from '../../assembled/embarrassment';
import {LEARNED_DISCLOSURE,COMM_SOURCE} from '../../assembled/communication';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {RUMINATION_SOURCE} from '../../assembled/rumination';
import {FATIGUE_SOURCE} from '../../assembled/fatigue';
import {HABIT_SOURCE} from '../../assembled/habit';
import {CONTROL_SOURCE} from '../../assembled/control';
import {DISPLAY} from '../../assembled/strategy';
import {fixture as previous,decode,items,key,enc} from './assembledRumination';
import {learnedData} from './assembledLearnedDisclosure';
import {target,other} from './assembledPersonHistory';
import {recipients} from './assembledCommunication';
import {thirdKey} from './assembledConfiguration';
import {signedValue} from './assembledComparison';
export {decode,items,key,enc,target,other,recipients};
export const actionA=typedIdentifier(1027,text('definition/protocol-contact-one')),actionB=typedIdentifier(1027,text('definition/protocol-contact-two'));
export type Opt={honest?:boolean;claim?:boolean;unknown?:boolean;denied?:boolean;hidden?:boolean;late?:boolean;delivery?:boolean;access?:boolean;physical?:boolean;annex?:boolean};
let cached:ReturnType<typeof previous>|undefined;
export function fixture(o:Opt={}){
 const b=structuredClone(cached??(cached=previous())),slots=[...items(decode(b.s.registry),'list')],task=items(items(items(slots[12],'list')[1],'list')[0],'list')[0];
 slots[18]=list([text(LEARNED_DISCLOSURE),actionA,list(recipients),target,...(o.annex===false?[]:[actionB])]);
 if(o.physical===false){const body=items(slots[10],'list');slots[10]=list([body[0],false,...body.slice(2)]);}
 slots.push(list([text(ATTACHMENT)]),list([text(LOSS),list([list([target,actionB]),list([other,actionA])])]),list([text(EMBARRASSMENT),target,task,actionA]));
 b.s={...b.s,rulesVersion:CONTRARY_RULES,registrySchemaVersion:CONTRARY_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return signedValue(a[0])<=3n&&![RUMINATION_SOURCE,FATIGUE_SOURCE,HABIT_SOURCE,CONTROL_SOURCE,SOCIAL_SOURCE,COMM_SOURCE].some(t=>key(t)===key(a[2]));}).map(v=>{
  const a=items(v,'list');if(key(a[2])!==key(DISPLAY))return v;const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=key(r[0])!==key(thirdKey)&&uint(r[1])===BigInt(o.honest?0:1);return list(r);}))]),a[4]]);
 });
 const frames=[{at:1,signals:[['appearance/coat',true] as [string,boolean]],kind:0,access:o.denied!==true,hidden:o.hidden?other:target},{at:2,signals:[['appearance/coat',true] as [string,boolean]],kind:0,continuity:true,access:o.denied!==true,hidden:o.hidden?other:target},...(o.late?[{at:3,signals:[['appearance/coat',true] as [string,boolean]],kind:0,continuity:true}]:[])];
 const social=items(decode(learnedData(0,frames,[],at=>at===3?false:o.claim!==false).orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE));
 for(const v of social){const r=[...items(v,'list')],p=[...items(r[3],'list')],s=[...items(p[1],'list')];if(o.unknown)s[3]=u(0);p[1]=list(s);p.push(list([u(1),u(1)]),list([false,u(0),false,false,false,true,true]),list([false,u(0),true,u(0)]),list([list([false,false,false]),list([false,false,false]),list([false,false,false])]));r[3]=list(p);rows.push(list(r));}
 for(const at of [3,4])rows.push(list([signed(at),u(10),COMM_SOURCE,list([text(LEARNED_DISCLOSURE),o.delivery!==false,o.access!==false,false]),list([])]));
 b.d={...b.d,runSeed:new Uint8Array(32),orderedInputs:enc(list(rows))};return b;
}
