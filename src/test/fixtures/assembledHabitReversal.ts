/** M118 plan3cd0e7e0: three nonsocial tasks, ordinary evidence, no learned S0.
 * Same physical training; only permitted binary reward reports differ.
 * Current reference0.89 laws; acquisition10/12, third attempt14, correction15,
 * B-only16 then free18. Seed0. Body10/rate0; actuator10, no delay. */
import {fixture as base,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,type Run,type CanonicalValue} from './assembledEffectEvidence';
import {BODY_DELIVERY,BODY_SAMPLE} from '../../assembled/body';
import {HABIT_SOURCE} from '../../assembled/habit';
import {habitFrame,target} from './assembledHabit';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {DELAYED_ACTION_BODY} from '../../assembled/actionBody';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {unsigned,set} from '../../substrate/canonicalEncoding';
import {changeDefinition} from './assembledCharacter';
export type Profile='trained'|'untrained'|'reversed'|'other-cue'|'unseen-cue';
export const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
export function fixture(profile:Profile,amount=10){
 const b=base('zero',10),slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')];body[2]=q(0,1);slots[6]=list(body);
 const act=items(slots[10],'list');slots[10]=list([text(DELAYED_ACTION_BODY),true,set(items(act[2],'set').map(v=>list([items(v,'list')[0],q(amount,1),unsigned(0)])))]);
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[q(10,1),signed(0)])}:e));
 const original=items(decode(b.d.orderedInputs),'list'),skip=[BODY_DELIVERY,HABIT_SOURCE,DISPLAY];
 const template=original.filter(v=>time(items(v,'list')[0])===12n&&!skip.some(k=>key(k)===key(items(v,'list')[2])));
 if(!template.length)throw Error('ordinary opportunity missing');
 const rows=original.filter(v=>time(items(v,'list')[0])<10n&&!skip.some(k=>key(k)===key(items(v,'list')[2])));
 const tasks=items(slots[12],'list');const taskIds=items(tasks[1],'list').map(v=>items(v,'list')[0]);
 const display=(at:number,available:boolean[],receipt:number)=>list([signed(at),unsigned(30),DISPLAY,list([text(STRATEGY),list(taskIds.flatMap(task=>available.map((yes,route)=>list([task,unsigned(route),unsigned(receipt+route),yes,unsigned(at),unsigned(25),true]))))]),list([])]);
 rows.push(display(1,[true,false],1),display(16,[false,true],3),display(18,[true,true],5));
 for(const at of [10,12,14,16,18])rows.push(...template.map(v=>list([signed(at),...items(v,'list').slice(1)])));
 for(const at of [10,12])rows.push(habitFrame(at,true,{report:profile==='untrained'?2:1}));
 rows.push(habitFrame(14,false,{visible:profile==='reversed',report:2}),habitFrame(15,false,{information:true}),habitFrame(18,false,{visible:false,cue:profile!=='other-cue',cueVisible:profile!=='unseen-cue'}));
 let s=changeDefinition({...b.s,registry:enc(list(slots))},'definition/protocol-execution',1n,true);
 for(const name of ['definition/task-a','definition/task-b','definition/task-c'])s=changeDefinition(s,name,6n,signed(25));
 s=changeDefinition(s,'definition/task-b',3n,q(10,1));
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
