/** M76: same perceived threat, competing importance and existing retrieval-law ablation. */
import {list,text,signed,rational as q} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledAffectScalar';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {AFFECT_MEMORY} from '../../assembled/affectMemory';
export type Mode='strong'|'weak'|'deniedStrong'|'deniedWeak';
export type Law='UncontrolledGain'|'NoFeedback';
export function fixture(mode:Mode='strong',law:Law='UncontrolledGain',control:0|1=0){
 const b=prior({p:1,s:1,v:1,c:control}),slots=[...items(decode(b.s.registry),'list')];
 const a=[...items(slots[28],'list')];a[5]=q(1,3);slots[28]=list(a);
 const i=slots.findIndex(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(AFFECT_MEMORY)));
 if(i<0)throw Error('M76 existing memory law');const m=[...items(slots[i],'list')];m[1]=text(law);slots[i]=list(m);
 let changed=0;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const x=[...items(v,'list')];if(key(x[2])!==key(PRIORITY_DISPLAY)||key(x[0])!==key(signed(1)))return v;
  const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{
   const r=[...items(v,'list')];if(key(r[0])===key(taskB)){changed++;r[1]=list([q(1,mode==='weak'||mode==='deniedWeak'?2:1)]);r[2]=!mode.startsWith('denied');}return list(r);
  }))]);return list(x);
 });
 if(changed!==1)throw Error('M76 one B adoption');
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {taskA,taskB,decode,items,key,enc};
