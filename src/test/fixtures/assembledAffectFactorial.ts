/** M74: fixed reference model; four independent perceived/declared factor sources. */
import {list,rational as q,signed} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledAffectCounterfactual';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
export type Cell=Readonly<{p:0|1;s:0|1;v:0|1;c:0|1}>;
export function fixture(cell:Cell,control:'normal'|'hidden'|'denied'='normal'){
 const b=prior(cell.v?'high':'low'),slots=[...items(decode(b.s.registry),'list')],a=[...items(slots[28],'list')];a[5]=q(cell.s,1);slots[28]=list(a);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const x=[...items(v,'list')];if(key(x[2])!==key(POSITION_SOURCE))return v;
  const p=[...items(x[3],'list')],annex=[...items(p[3],'list')];
  if(key(x[0])===key(signed(6)))annex[7]=!cell.c;
  if(key(x[0])===key(signed(9)))annex[7]=!!cell.p;
  if(control==='hidden')annex[1]=!annex[1];
  if(control==='denied'&&key(x[0])===key(signed(5))){const panel=[...items(p[2],'list')];panel[3]=false;p[2]=list(panel);}
  p[3]=list(annex);x[3]=list(p);return list(x);
 });
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {taskA,taskB,decode,items,key,enc};
