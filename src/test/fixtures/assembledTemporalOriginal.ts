/** Original temporal source translation only; no authored psychological intermediates. */
import {fixture as base,rec,f,uint,items,key,decode,enc,list,text,signed,q,u,sid,taskA,taskB,countPath,countStatus,countProgress,countWorld,cachedMemory,restorePreparedCharacterRun,type CanonicalValue} from './assembledCountedGoal';
import type {Frame} from '../../campaign3/temporalGoalConflict';
import {HORIZON_POLICY_RULES,HORIZON_POLICY_REGISTRY} from '../../assembled/model';
import {COUNT,COUNT_SOURCE} from '../../assembled/countedGoal';
import {HORIZON,HORIZON_DISPLAY} from '../../assembled/horizon';
import {PRIORITY,PRIORITY_ADOPTION,PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {WORK,WORK_SOURCE} from '../../assembled/workMaintenance';
import {COMMITMENT_REQUEST} from '../../assembled/commitment';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,u,sid,taskA,taskB,countPath,countStatus,countProgress,countWorld,cachedMemory,restorePreparedCharacterRun};
export {through,finish,type Run} from './assembledCountedGoal';
export type {CanonicalValue};
export function fixture(input:readonly Frame[],law:'HorizonRelative'|'NoTemporalBias'){
 const b=base(),slots=[...items(decode(b.s.registry),'list')],routes=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list'));
 slots[14]=list([text(HORIZON),u(law==='HorizonRelative'?1:2)]);slots[47]=list([text(WORK),false,list([taskA,taskB])]);
 const bindings=items(items(slots[62],'list')[1],'list');slots[62]=list([text(COUNT),list(bindings.map(v=>list([...items(v,'list').slice(0,3),u(input[0].report)])))]);
 const removed=[PRIORITY_DISPLAY,DISPLAY,HORIZON_DISPLAY,WORK_SOURCE,COUNT_SOURCE],rows=items(decode(b.d.orderedInputs),'list').filter(v=>!removed.some(t=>key(t)===key(items(v,'list')[2])));
 const event=(at:number,phase:number,type:CanonicalValue,payload:CanonicalValue)=>list([signed(at),u(phase),type,payload,list([])]);
 for(const frame of input){
  const at=frame.at;
  rows.push(event(at,10,PRIORITY_DISPLAY,list([text(at===1?PRIORITY_ADOPTION:PRIORITY),list(routes.map(route=>{
   const i=key(route[0])===key(taskA)?0:key(route[0])===key(taskB)?1:2,adopt=at===1&&(i===0?frame.adoptShort:i===1?frame.adoptLong:false),strength=i===0?frame.strengthShort:i===1?frame.strengthLong:0;
   return list([route[0],adopt?list([q(strength,4)]):list([]),frame.visible,list([q(i===2?0:1,1)]),frame.visible,...(at===1?[adopt?list([route[i===1?2:1]]):list([])]:[])]);
  }))])));
  rows.push(event(at,30,DISPLAY,list([text(STRATEGY),list(routes.map(route=>{
   const i=key(route[0])===key(taskA)?0:key(route[0])===key(taskB)?1:2;
   return list([route[0],u(i===1?1:0),u(at),frame.visible&&(i===0?frame.availableShort:i===1?frame.availableLong:false),u(at),u(9),true]);
  }))])));
  rows.push(event(at,110,WORK_SOURCE,list([text(WORK),frame.visible,false,false,list([list([u(1),frame.accessShort,u(1)]),list([u(2),frame.accessLong,u(1)])])])));
  rows.push(event(at,10,HORIZON_DISPLAY,list([text(HORIZON),list([list([taskB,frame.forecast?list([u(5),frame.forecast===2]):list([]),frame.visible])])])));
  rows.push(event(at,10,COUNT_SOURCE,list([text(COUNT),list([list([taskA,frame.actualShort,frame.receipt,true]),list([taskB,frame.actualLong,frame.receipt,true])])])));
  for(const [task,cancel]of [[taskA,frame.cancelShort],[taskB,frame.cancelLong]] as const)if(cancel)rows.push(event(at,30,COMMITMENT_REQUEST,list([task,true,true])));
 }
 return {s:{...b.s,rulesVersion:HORIZON_POLICY_RULES,registrySchemaVersion:HORIZON_POLICY_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(b:ReturnType<typeof fixture>){const k=b.s.rulesVersion+key(decode(b.s.registry))+key(decode(b.s.parameters));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
