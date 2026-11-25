/** M264: two nonsocial goals; current0.159; ordinary adoption/forecast channels.
 * Inherited physical body30/cap100/rate10; zero action-body amounts; no learned S0. */
import {fixture as base,start,through,finish,event,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,taskB,actionA,actionB,type Run,type CanonicalValue} from './assembledWorkspaceFamily';
import {changeDefinition} from './assembledCharacter';
import {HORIZON,HORIZON_DISPLAY} from '../../assembled/horizon';
import {DISPLAY} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
export const names=['available','unavailable','unknown','deniedAvailable','deniedUnavailable','corrected','noImmediate','noRoute'] as const;
export type Case=typeof names[number];
export function fixture(name:Case){
 const b=base('success'),s=changeDefinition(changeDefinition(b.s,'definition/task-a',6n,signed(9)),'definition/task-b',6n,signed(5));
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(PERFORMANCE_SETTING)).map(v=>{
  const a=[...items(v,'list')];
  if(key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[3]=key(x[0])===key(taskA)?uint(x[1])===0n&&name!=='noRoute':key(x[0])===key(taskB)&&uint(x[1])===1n;return list(x);}))]);}
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];if(key(x[0])===key(taskB)){if(items(x[1],'list').length)x[1]=list([q(name==='noImmediate'?0:1,1)]);x[3]=list([q(0,1)]);}return list(x);}))]);}
  return list(a);
 });
 const forecast=(at:number,available:boolean|null,visible=true)=>event(at,10,HORIZON_DISPLAY,list([text(HORIZON),list([list([taskA,available===null?list([]):list([u(5),available]),visible])])]));
 rows.push(forecast(1,name==='unknown'?null:!['unavailable','deniedUnavailable'].includes(name),!name.startsWith('denied')));
 if(name==='corrected')rows.push(forecast(3,false));
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},name};
}
export {start,through,finish,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,taskB,actionA,actionB};
export type {Run,CanonicalValue};
