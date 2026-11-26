/** Original procrastination facts enter ordinary perception, priority and physical execution. */
import {fixture as base,rec,f,uint,items,key,decode,enc,list,text,signed,q,u,sid,C,taskA,taskB,countPath,countStatus,countProgress,countWorld,cachedMemory,restorePreparedCharacterRun,type CanonicalValue} from './assembledCountedGoal';
import {set} from '../../substrate/canonicalEncoding';
import {procrastinationCases,procrastinationInputs,type Frame} from '../procrastinationFixtures';
import {changeDefinition} from './assembledCharacter';
import {WORK_CUE_RULES,WORK_CUE_REGISTRY} from '../../assembled/model';
import {COUNT,COUNT_SOURCE} from '../../assembled/countedGoal';
import {HORIZON,HORIZON_DISPLAY} from '../../assembled/horizon';
import {PRIORITY,PRIORITY_ADOPTION,PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {WORK_CUE,WORK_SOURCE} from '../../assembled/workMaintenance';
import {COMMITMENT_REQUEST} from '../../assembled/commitment';
import {PROTOCOL_PERMISSION,PROTOCOL_PERMISSION_SOURCE} from '../../assembled/protocolPermission';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,u,sid,C,taskA,taskB,countPath,countStatus,countProgress,countWorld,cachedMemory,restorePreparedCharacterRun,procrastinationCases,procrastinationInputs,set};
export {through,finish,type Run} from './assembledCountedGoal';
export type {CanonicalValue,Frame};
export const actionA=sid(1027,'definition/protocol-contact-one'),actionB=sid(1027,'definition/protocol-contact-two');
export function fixture(input:readonly Frame[],candidate=1){
 if(![1,2,3,4].includes(candidate)||input.length!==8||input.some((x,i)=>x.at!==i+1||(x.mode??2)!==2||(x.instruction===1&&x.at>=6)))throw Error('original procrastination domain/adoption window');
 const b=base(),slots=[...items(decode(b.s.registry),'list')],routes=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')),A=routes.find(v=>key(v[0])===key(taskA))!;
 slots[14]=list([text(HORIZON),u(candidate===2?2:candidate===3?3:1),list([taskA])]);slots[47]=list([text(WORK_CUE),list([taskA])]);slots[62]=list([text(COUNT),list([list([taskA,A[1],u(3),u(input[0].report??0)])])]);
 let s={...b.s,rulesVersion:WORK_CUE_RULES,registrySchemaVersion:WORK_CUE_REGISTRY,registry:enc(list(slots))};
 s=changeDefinition(changeDefinition(s,'definition/task-a',6n,signed(12)),'definition/task-b',6n,signed(17));
 s=changeDefinition(changeDefinition(s,'definition/task-b',3n,q(10,1)),'definition/task-b',4n,q(10,1));
 const removed=[PRIORITY_DISPLAY,DISPLAY,HORIZON_DISPLAY,WORK_SOURCE,COUNT_SOURCE],rows=items(decode(b.d.orderedInputs),'list').filter(v=>!removed.some(t=>key(t)===key(items(v,'list')[2]))).map(v=>{const a=[...items(v,'list')];if(typeof a[0]==='boolean'||a[0].kind!=='signed')throw Error('time');a[0]=signed(2*Number(a[0].value)-1);return list(a);});
 const event=(at:number,phase:number,type:CanonicalValue,payload:CanonicalValue)=>list([signed(at),u(phase),type,payload,list([])]);
 const actions=items(items(slots[10],'list')[2],'set').map(v=>items(v,'list')[0]);
 for(const frame of input){
  const t=frame.at,at=2*t-1,board=frame.board??true,fresh=t===1||frame.instruction===1;
  rows.push(event(at,10,PRIORITY_DISPLAY,list([text(fresh?PRIORITY_ADOPTION:PRIORITY),list(routes.map(route=>{
   const i=key(route[0])===key(taskA)?0:key(route[0])===key(taskB)?1:2,adopt=i===0?frame.instruction===1:i===1&&t===1,importance=i===2||i===1&&candidate===4?0:1;
   return list([route[0],adopt?list([q(importance,1)]):list([]),true,list([q(1,1)]),true,...(fresh?[adopt?list([route[i===1?2:1]]):list([])]:[])]);
  }))])));
  rows.push(event(t===1?1:at-1,30,DISPLAY,list([text(STRATEGY),list(routes.map(route=>{
   const i=key(route[0])===key(taskA)?0:key(route[0])===key(taskB)?1:2;
   return list([route[0],u(i===1?1:0),u(t),board&&(i===0?(frame.cue??true):i===1?(frame.immediate??false):false),u(t===1?1:at-1),u(17),true]);
  }))])));
  rows.push(event(at,10,WORK_SOURCE,list([text(WORK_CUE),board,frame.reminder??false,frame.support??true,list([list([u(1),true,u(1)])])])));
  rows.push(event(at,10,HORIZON_DISPLAY,list([text(HORIZON),list([list([taskA,(frame.future??0)?list([u(11),frame.future===2]):list([]),(frame.seen??true)&&(frame.recipient??true)])])])));
  rows.push(event(at,10,COUNT_SOURCE,list([text(COUNT),list([list([taskA,frame.reward??true,frame.visible??true,true])])])));
  rows.push(event(at,100,PROTOCOL_PERMISSION_SOURCE,list([text(PROTOCOL_PERMISSION),C,set(actions.map(a=>list([a,key(a)===key(actionA)?(frame.feasible??true)&&!(frame.blocked??false):true])))])));
  if(frame.instruction===2)rows.push(event(at,30,COMMITMENT_REQUEST,list([taskA,true,true])));
 }
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},input,candidate,original:procrastinationInputs(input)};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(b:ReturnType<typeof fixture>){const k=b.s.rulesVersion+key(decode(b.s.registry))+key(decode(b.s.parameters));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
