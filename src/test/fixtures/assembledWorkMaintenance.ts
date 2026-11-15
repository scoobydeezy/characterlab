/** M128 cf435940. Body10; two social tasks, third unknown; no successful execution.
 * Initial A2/B1/C0, distract B3, then reminder and expiry. Only declared interventions differ. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledWorkspaceReceiving';
import {WORK_MAINTENANCE_RULES,WORK_MAINTENANCE_REGISTRY} from '../../assembled/model';
import {WORK,WORK_SOURCE} from '../../assembled/workMaintenance';
import {BODY_SAMPLE} from '../../assembled/body';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {sid} from '../../assembled/skill';
import {unsigned as u} from '../../substrate/canonicalEncoding';
import {changeDefinition} from './assembledCharacter';
export function fixture(support=false,distractor=3,capacity=2,hidden=false,visible=true){
 const b=prior(capacity,hidden),slots=[...items(decode(b.s.registry),'list')];slots.push(list([text(WORK),support,list([b.taskA,b.taskB])]));
 let s={...b.s,rulesVersion:WORK_MAINTENANCE_RULES,registrySchemaVersion:WORK_MAINTENANCE_REGISTRY,registry:enc(list(slots))};
 for(const name of['task-a','task-b','configurable-garden'])s=changeDefinition(s,'definition/'+name,6n,signed(9));
 const originals=items(decode(b.d.orderedInputs),'list'),rows:CanonicalValue[]=[];
 const moved=(a:readonly CanonicalValue[])=>key(a[2])===key(sid(1001,'event/deliberation-opportunity'))||key(a[1])===key(u(30))||key(a[2])===key(BODY_SAMPLE);
 for(const v of originals){const a=items(v,'list');if(moved(a)&&[6,7].some(n=>key(a[0])===key(signed(n)))){if(key(a[0])===key(signed(6)))for(const at of[6,7,8,9,10])rows.push(list([signed(at),...a.slice(1)]));}else rows.push(v);}
 // Current urgency is a separate normal display, repeated without re-adopting importance.
 const urgency=items(originals.find(v=>{const a=items(v,'list');return key(a[2])===key(PRIORITY_DISPLAY);})!,'list');
 for(const at of[6,7,8,9,10])if(!rows.some(v=>{const a=items(v,'list');return key(a[0])===key(signed(at))&&key(a[2])===key(PRIORITY_DISPLAY);})){
  const p=items(urgency[3],'list');rows.push(list([signed(at),...urgency.slice(1,3),list([p[0],list(items(p[1],'list').map(v=>{const a=[...items(v,'list')];a[1]=list([]);return list(a);}))]),urgency[4]]));
 }
 for(const at of[5,6,7,8,9]){const priorities=[2,at===5?1:distractor,0],cue=at===7||at===9;
  rows.push(list([signed(at),u(110),WORK_SOURCE,list([text(WORK),visible,cue,hidden,list((hidden?[3,2,1]:[1,2,3]).map(n=>list([u(n),true,u(priorities[n-1])])))]),list([])]));
 }
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,support,distractor,capacity,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
