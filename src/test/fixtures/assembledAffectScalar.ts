/** M75: M74 sources, only existing silent social cue9 moves to10 for prior recall11. */
import {list,signed} from '../../substrate/canonicalEncoding';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {fixture as prior,taskA,taskB,decode,items,key,enc,type Cell} from './assembledAffectFactorial';
export function fixture(cell:Cell={p:1,s:1,v:1,c:1},control:'normal'|'hidden'|'denied'='normal'){
 const b=prior(cell,control);let moved=0;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];
  if(key(a[2])===key(SOCIAL_SOURCE)&&key(a[0])===key(signed(9))){a[0]=signed(10);moved++;}
  return list(a);
 });
 if(moved!==1)throw Error('M75 exactly one existing cue');
 return {s:b.s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {taskA,taskB,decode,items,key,enc,type Cell};
