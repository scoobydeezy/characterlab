import {candidate269} from './assembledActivationCarry';
/** M261 exact original frames expanded into ordinary native sources. Seed0;
 * nonsocial task, body30/rate10, zero body delivery, item criterion1..1. */
import {fixture as previous,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,target,origin,destination,type CanonicalValue} from './assembledIntentionCompletion';
import {intentionCases} from '../intentionForgettingFixtures';
import {ATTEMPT_RECEIPT_RULES,ATTEMPT_RECEIPT_REGISTRY} from '../../assembled/model';
import {ATTEMPT_RECEIPT} from '../../assembled/criterionSensing';
import {PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {WORK,WORK_SOURCE} from '../../assembled/workMaintenance';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {PRIORITY_DISPLAY,PRIORITY_ADOPTION} from '../../assembled/priority';
import {DISPLAY} from '../../assembled/strategy';
import {COMMITMENT_REQUEST} from '../../assembled/commitment';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Case=keyof ReturnType<typeof intentionCases>;
export const names=Object.keys(intentionCases()) as Case[];
export function fixture(name:Case){
 const frames=intentionCases()[name],b=previous(frames[0].execution?'main':'blocked'),slots=[...items(decode(b.s.registry),'list')],retention=[...items(slots[8],'list')];retention[5]=u(frames[0].capacity);slots[8]=list(retention);
 const s={...b.s,rulesVersion:ATTEMPT_RECEIPT_RULES,registrySchemaVersion:ATTEMPT_RECEIPT_REGISTRY,registry:enc(list(slots))};
 const old=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')),probe=old.find(a=>key(a[2])===key(PROBE_SOURCE_EVENT))!,adoption=old.find(a=>key(a[2])===key(PRIORITY_DISPLAY)&&key(a[0])===key(signed(1)))!,display=old.find(a=>key(a[2])===key(DISPLAY))!,position=old.find(a=>key(a[2])===key(POSITION_SOURCE))!;
 const rows:CanonicalValue[]=[list(probe)],a=items(adoption[3],'list'),row=items(items(a[1],'list')[0],'list');
 rows.push(list([adoption[0],adoption[1],adoption[2],list([text(PRIORITY_ADOPTION),list([list([row[0],row[1],frames[0].visible,row[3],row[4],list([b.route.plans[frames[0].instruction-1].instructionId])])])]),adoption[4]]));
 const frame=old.filter(a=>key(a[0])===key(signed(5))&&![PROBE_SOURCE_EVENT,WORK_SOURCE].some(t=>key(t)===key(a[2])));
 for(const x of frames){const t=x.at,available=x.visible&&x.opportunity,ds=items(display[3],'list');
  if(t===1||available!==(frames[t-2].visible&&frames[t-2].opportunity))rows.push(list([signed(t),display[1],DISPLAY,list([ds[0],list(items(ds[1],'list').map(v=>{const d=items(v,'list');return list(d.map((v,i)=>i===2?u((t-1)*2+Number(uint(d[1]))+1):i===3?available:i===4?u(t):v));}))]),display[4]]));
  if(t>=2)rows.push(...frame.map(a=>list([signed(t),...a.slice(1)])));
  if(x.neutral)rows.push(list([signed(t),...position.slice(1)]));
  rows.push(list([signed(t),u(110),WORK_SOURCE,list([text(WORK),x.visible,x.cue!==0,x.privateBit,list([list([u(1),true,u(x.cue===2?1:3)]),...(x.cue===2?[list([u(2),true,u(3)])]:[])])]),list([])]));
  if(x.cancel)rows.push(list([signed(t),u(30),COMMITMENT_REQUEST,list([taskA,true,x.privateBit]),list([])]));
  if(t>=2&&x.receipt)rows.push(list([signed(t),u(120),PROBE_SOURCE_EVENT,list([text(ATTEMPT_RECEIPT),probe[3],signed(0),list(b.route.plans.map(p=>p.actionId)),...(x.report?[u(x.report)]:[])]),list([])]));
 }
 return candidate269({s,d:{...b.d,orderedInputs:enc(list(rows))},name,frames,route:b.route});
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,target,origin,destination};
export type {CanonicalValue};
