/** M55 fixed scene: three physical tasks, reserve10 unsensed, workspace6.
 * Only A is available for two important tasks. C/B third task has zero importance.
 * Action3 earns history; goal4 then reminders5/7/9. Fatigue4, missing6, recovery8.
 * Latest shared configuration, seed0, no initial learned state or autonomous peers. */
import {list,text,unsigned as u,signed,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {FATIGUE_RULES,FATIGUE_REGISTRY} from '../../assembled/model';
import {FATIGUE,FATIGUE_SOURCE,type FatigueLaw} from '../../assembled/fatigue';
import {CONTROL_SOURCE} from '../../assembled/control';
import {STRATEGY,DISPLAY} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {sid} from '../../assembled/skill';
import {source as oldSource,data as oldData,tasks,decode,items,key,enc} from './assembledDeliveryReward';
import {fixture as latest} from './assembledSpatialMeaning';
import {newAction,newInstruction,thirdKey} from './assembledConfiguration';
import {changeDefinition} from './assembledCharacter';
import {controlFrame} from './assembledControl';
import {signedValue} from './assembledComparison';
export {decode,items,key,enc};
export type Options={physical?:number;display?:number;visible?:boolean;recipient?:boolean;law?:FatigueLaw};
let cached:ReturnType<typeof build>|undefined;
function build(){
 let s=oldSource();for(const n of ['definition/task-a','definition/task-b','definition/configurable-garden'])s=changeDefinition(s,n,6n,signed(12));
 s=changeDefinition(s,'definition/task-workspace',2n,u(6));
 const slots=[...items(decode(s.registry),'list'),...items(decode(latest().s.registry),'list').slice(28)];
 const ts=tasks();slots[12]=list([text(STRATEGY),list(ts.map(t=>list([t,key(t)===key(thirdKey)?newInstruction:sid(1027,'definition/task-instruction-one'),sid(1027,'definition/task-instruction-two')])))]);const rp=items(slots[28],'list');slots[28]=list([rp[0],thirdKey,newAction,rp[3]]);
 for(const n of [32,37]){const a=[...items(slots[n],'list')];a[1]=list([]);slots[n]=list(a);}
 slots.push(list([text(FATIGUE),text('SevereThreshold')]));
 s={...s,rulesVersion:FATIGUE_RULES,registrySchemaVersion:FATIGUE_REGISTRY,registry:enc(list(slots))};
 const d=oldData(),rows=items(decode(d.orderedInputs),'list').filter(v=>![DISPLAY,CONTROL_SOURCE].some(t=>key(t)===key(items(v,'list')[2]))).map(v=>{
  const a=items(v,'list');if(key(a[2])!==key(PRIORITY_DISPLAY))return v;
  const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],list(items(p[1],'list').map(v=>{const b=[...items(v,'list')];if(items(b[1],'list').length)b[1]=list([q(key(b[0])===key(thirdKey)?0:1,1)]);return list(b);}))]),a[4]]);
 });
 for(const v of [...rows])if(signedValue(items(v,'list')[0])===7n)rows.push(list([signed(9),...items(v,'list').slice(1)]));
 rows.push(list([signed(1),u(30),DISPLAY,list([text(STRATEGY),list(ts.flatMap(t=>[0,1].map(r=>list([t,u(r),u(r+1),r===0&&key(t)!==key(thirdKey),u(1),u(12),true]))))]),list([])]));
 rows.push(controlFrame(4,1),controlFrame(5,0,true),controlFrame(7,0,true),controlFrame(9,0,true));
 return {s,d:{...d,runSeed:new Uint8Array(32),orderedInputs:enc(list(rows))}};
}
export const fatigueFrame=(at:number,physical:number,display=0,visible=true,recipient=true)=>list([signed(at),u(30),FATIGUE_SOURCE,list([text(FATIGUE),u(physical),u(display),visible,recipient]),list([])]);
export function fixture(o:Options={}){
 const b=structuredClone(cached??(cached=build())),slots=[...items(decode(b.s.registry),'list')];slots[38]=list([text(FATIGUE),text(o.law??'SevereThreshold')]);b.s.registry=enc(list(slots));
 b.d.orderedInputs=enc(list([...items(decode(b.d.orderedInputs),'list'),fatigueFrame(4,o.physical??2,o.display??0,o.visible??true,o.recipient??true),fatigueFrame(6,0,0,false),fatigueFrame(8,0)]));return b;
}
