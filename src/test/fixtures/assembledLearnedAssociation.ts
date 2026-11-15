/** M123 plan4b866e1f. One holder, two social tasks/third unknown, body10, seed0.
 * A true1 Actor+Actor, B false2 Actor+Participant, same-track silent cue3.
 * Delay20; first recall/deliberation/sample21. Task deadlines30. No learned S0. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue,type EncodingBudget} from './assembledEncodingBudgets';
import {ASSOCIATION_RULES,ASSOCIATION_REGISTRY} from '../../assembled/model';
import {LEARNED_AFFECT_MEMORY} from '../../assembled/affectMemory';
import {ASSOCIATION} from '../../assembled/learnedAssociation';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {BODY_SAMPLE} from '../../assembled/body';
import {sid} from '../../assembled/skill';
import {unsigned as u} from '../../substrate/canonicalEncoding';
import {walk} from './campaign2Cognitive';
import {replace} from './assembledCharacter';
export type Mode='main'|'hidden'|'denied'|'absent';
export function fixture(nodes=30,mode:Mode='main',capacity=2,law:EncodingBudget='historical-shared'){
 const b=prior('dense',law,'UnitBudget',capacity),slots=[...items(decode(b.s.registry),'list')],retention=[...items(slots[8],'list')],affect=items(slots[29],'list');
 retention[3]=u(20);slots[8]=list(retention);
 slots[29]=list([text(LEARNED_AFFECT_MEMORY),affect[1],list([text(ASSOCIATION),u(1000),q(1,1),q(1,1),u(nodes),u(nodes*(nodes-1))])]);
 const registry=walk(list(slots),v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===370n?replace(v,6n,signed(30)):v);
 const rows:CanonicalValue[]=[];
 for(const v of items(decode(b.d.orderedInputs),'list')){
  const a=[...items(v,'list')],at=key(a[0]),op=key(a[2])===key(sid(1001,'event/deliberation-opportunity')),context=key(a[1])===key(u(30));
  if(at===key(signed(3))&&(op||context))continue;
  if(at===key(signed(4))&&(op||context||key(a[2])===key(BODY_SAMPLE)))a[0]=signed(21);
  if(key(a[2])===key(SOCIAL_SOURCE)){
   const p=[...items(a[3],'list')],r=[...items(p[7],'list')],first=at===key(signed(1)),second=at===key(signed(2)),role=first?1:3;
   r[2]=list((first||second)&&mode!=='absent'?[list([mode!=='denied',u(mode==='hidden'?4:role),u(role)])]:[]);
   p[7]=list(r);a[3]=list(p);
  }
  rows.push(list(a));
 }
 return {s:{...b.s,rulesVersion:ASSOCIATION_RULES,registrySchemaVersion:ASSOCIATION_REGISTRY,registry:enc(registry)},d:{...b.d,orderedInputs:enc(list(rows))},legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue,EncodingBudget};
