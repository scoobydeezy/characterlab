/** M40: three physical tasks, no person dependencies; reserve10, difficulty0.
 * Body samples absent in both arms. Cue/reward/route/task channels live; seed0.
 * Route1:A only,4:B only,6:both retain B. Feedback6 is a perceived correction.
 * No preloaded learning or belief. Existing passive disclosure observers remain. */
import {list,text,unsigned,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../../substrate/state';
import type {ComparisonDrawMap} from '../../substrate/random';
import {DELIVERY_REWARD_RULES,DELIVERY_REWARD_REGISTRY} from '../../assembled/model';
import {DELIVERY_REWARD,HABIT_SOURCE} from '../../assembled/habit';
import {BODY_SAMPLE} from '../../assembled/body';
import {STRATEGY,DISPLAY} from '../../assembled/strategy';
import {sid} from '../../assembled/skill';
import {source as priorSource,data as priorData,decode,items,key,enc} from './assembledTolerance';
import {habitFrame,target} from './assembledHabit';
export const tasks=()=>restoreAuthoritativeState(decode(priorData().initialState)).entries().filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n).map(e=>(e.path.selectors[0] as {key:CanonicalValue}).key);
export function source(amount=40,delay=0,permitted=true,legacy=false){const s=priorSource('Reciprocal',delay,permitted,amount),slots=[...items(decode(s.registry),'list')];slots[12]=list([text(STRATEGY),list(tasks().map(t=>list([t,sid(1027,'definition/task-instruction-one'),sid(1027,'definition/task-instruction-two')])))]);const rel=items(slots[20],'list');slots[20]=list([rel[0],list(items(rel[1],'list').map((v,i)=>list([items(v,'list')[0],sid(1027,'definition/protocol-contact-'+(i?'two':'one'))])))]);return {...s,...(legacy?{}:{rulesVersion:DELIVERY_REWARD_RULES,registrySchemaVersion:DELIVERY_REWARD_REGISTRY}),registry:enc(list([...slots,...(legacy?[]:[list([text(DELIVERY_REWARD)])])]))};}
function frame(at:number,available:boolean[],receipt:number){return list([signed(at),unsigned(30),DISPLAY,list([text(STRATEGY),list(tasks().flatMap(task=>available.map((a,r)=>list([task,unsigned(r),unsigned(receipt+r),a,unsigned(at),unsigned(10),true]))))]),list([])]);}
export function data(hidden=false,map?:ComparisonDrawMap,report=0){const d=priorData(false,map),rows=items(decode(d.orderedInputs),'list').filter(v=>{if(typeof v==='boolean'||v.kind!=='list')return true;const a=items(v,'list');return a.length!==5||![BODY_SAMPLE,DISPLAY,HABIT_SOURCE].some(t=>key(a[2])===key(t));});return {...d,orderedInputs:enc(list([...rows,frame(1,[true,false],1),frame(4,[false,true],3),frame(6,[true,true],5),habitFrame(3,true,{visible:!hidden,report}),habitFrame(5,true,{visible:!hidden,report}),habitFrame(6,false,{information:true}),habitFrame(7,true,{visible:false})]))};}
export {decode,items,key,enc,target};
