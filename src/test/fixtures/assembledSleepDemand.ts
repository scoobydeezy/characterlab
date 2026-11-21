/** M210: same M209 Rested history, nonsocial tasks/reserve10/practice12.
 * Only current presented demand differs. No protective-identity claim. */
import {fixture as previous,decode,items,key,enc,list,text,u} from './assembledSleepControl';
import {SLEEP_LOAD_RULES,SLEEP_LOAD_REGISTRY} from '../../assembled/model';
import {SLEEP_LOAD} from '../../assembled/sleepControl';
import {CONTROL_SOURCE} from '../../assembled/control';
export function fixture(demand=800,mode:'visible'|'hidden'|'absent'='visible'){
 const b=previous('Rested'),slots=[...items(decode(b.s.registry),'list')],decl=[...items(slots[55],'list')];decl[0]=text(SLEEP_LOAD);slots[55]=list(decl);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return !(mode==='absent'&&key(a[2])===key(CONTROL_SOURCE)&&(a[0] as {value:bigint}).value===14n);}).map(v=>{
  const a=[...items(v,'list')];if(key(a[2])!==key(CONTROL_SOURCE))return v;const at=(a[0] as {value:bigint}).value,p=[...items(a[3],'list')];if(at===14n&&mode==='hidden')p[5]=false;p.push(u(at===14n?demand:0));a[3]=list(p);return list(a);
 });
 return {...b,s:{...b.s,rulesVersion:SLEEP_LOAD_RULES,registrySchemaVersion:SLEEP_LOAD_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {start,state,labels,through,at,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,outputs,bytes,exact} from './assembledSleepControl';
export type {Run} from './assembledSleepControl';
