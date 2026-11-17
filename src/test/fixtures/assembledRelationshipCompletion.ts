/** M151: body10/seed0; two social goals/third unknown. Own cooperation1/2,
 * equal person estimate4; breach5/explanation6/probe7/repair8/probe9/absence11.
 * Controlled participant, normal rich perception; no authored learned state. */
import {promote,prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type CanonicalValue} from './assembledSocialWitness';
import {upgrade} from './assembledMultiReceipts';
import {SOCIAL,SOCIAL_SOURCE} from '../../assembled/social';
import {REL} from '../../assembled/relationship';
import {DISPLAY} from '../../assembled/strategy';
export type Mode='history'|'witness'|'denied'|'hidden'|'negativeExplanation'|'contact';
export function fixture(mode:Mode='history'){
 const b=upgrade(promote(prior())),original=items(decode(b.d.orderedInputs),'list'),frame=original.filter(v=>key(items(v,'list')[0])===key(signed(4))),source=original.find(v=>key(items(v,'list')[0])===key(signed(3))&&key(items(v,'list')[2])===key(SOCIAL_SOURCE))!;
 const observed=(v:CanonicalValue,at:number)=>{const a=[...items(v,'list')],p=[...items(a[3],'list')],acquire=at===1||at===2,kind=acquire||at===8?1:at===5?2:3;
  a[0]=signed(at);p[3]=list([at!==1,false,false,false]);
  p[6]=list([text(REL),u(mode==='hidden'&&kind<3?3-kind:kind),acquire?mode!=='witness':kind<3,mode!=='denied',u(kind)]);
  p[8]=list([false,u(0),false,false,false,false,false]);
  if(at>3)p[1]=list([text(SOCIAL),true,u(2),u(at===6?mode==='negativeExplanation'?4:3:0),u(at===6?4:0),true,true]);
  a[3]=list(p);return list(a);
 };
 const rows=original.filter(v=>![5,6,7,8,9,10,11].some(at=>key(items(v,'list')[0])===key(signed(at)))).map(v=>{const a=items(v,'list');return key(a[2])===key(SOCIAL_SOURCE)?observed(v,Number((a[0] as {value:bigint}).value)):v;});
 for(const at of [5,6,8])rows.push(observed(source,at));
 for(const at of [7,9,11])for(const v of frame){const a=[...items(v,'list')];a[0]=signed(at);rows.push(list(a));}
 const display=original.find(v=>key(items(v,'list')[2])===key(DISPLAY))!,d=[...items(display,'list')],p=items(d[3],'list');
 const current=items(p[1],'list').map(v=>items(v,'list')),maxReceipt=Math.max(...current.filter(r=>key(r[0])===key(b.taskA)).map(r=>Number(uint(r[2]))));
 d[0]=signed(10);d[3]=list([p[0],list([0,1].map(route=>list([b.taskA,u(route),u(maxReceipt+route+1),mode==='contact'&&route===0,u(10),u(30),true])))]);rows.push(list(d));
 return {...b,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u};
export type {CanonicalValue};
