/** M45 fixed source: first two tasks social, third unknown; perceived coat stand-in.
 * Reserve10/body4/7, diagnostic1/risk1; A true1/B false2/Q silent3/C false5/Q silent6.
 * Deliberate3/4/6/7; same seed0/dice; no authored learned state. */
import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {source as priorSource,data as priorData,decode,items,key,enc,target} from './assembledEncoding';
import {MEMORY_USE_RULES,MEMORY_USE_REGISTRY} from '../../assembled/model';
import {MEMORY_USE} from '../../assembled/memoryUse';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {RETENTION} from '../../assembled/retention';
import {changeDefinition} from './assembledCharacter';
import {sid} from '../../assembled/skill';
export function source(law='SignificanceFirst',capacity=3,workspace=5){
 const s=changeDefinition(priorSource(),'definition/task-workspace',2n,unsigned(workspace)),a=[...items(decode(s.registry),'list')];
 a[8]=list([text(RETENTION),unsigned(8),unsigned(capacity),unsigned(1)]);
 const access=[...items(a[29],'list')];access[2]=list([list([target,unsigned(1),unsigned(1),unsigned(3),q(1,2)])]);a[29]=list(access);
 a.push(list([text(MEMORY_USE),text(law)]));return {...s,rulesVersion:MEMORY_USE_RULES,registrySchemaVersion:MEMORY_USE_REGISTRY,registry:enc(list(a))};
}
export function data(hidden=false){
 const d=priorData(hidden?'hidden':'main'),rows=[...items(decode(d.orderedInputs),'list')],extra:CanonicalValue[]=[];
 for(const v of rows){const r=items(v,'list');
  if(key(r[2])===key(SOCIAL_SOURCE)&&key(r[0])===key(signed(2))){const p=[...items(r[3],'list')],o=[...items(p[1],'list')];o[4]=unsigned(4);p[1]=list(o);extra.push(list([signed(5),r[1],r[2],list(p),r[4]]));}
  if(key(r[2])===key(SOCIAL_SOURCE)&&key(r[0])===key(signed(3)))extra.push(list([signed(6),...r.slice(1)]));
  if(key(r[0])===key(signed(4))&&key(r[2])===key(sid(1001,'event/assembled-body-sample')))extra.push(list([signed(7),...r.slice(1)]));
  if(key(r[0])===key(signed(4))&&(key(r[1])===key(unsigned(30))||key(r[2])===key(sid(1001,'event/deliberation-opportunity'))))
   for(const at of [6,7])extra.push(list([signed(at),...r.slice(1)]));
 }
 return {...d,orderedInputs:enc(list([...rows,...extra]))};
}
export {decode,items,key,enc,target};
