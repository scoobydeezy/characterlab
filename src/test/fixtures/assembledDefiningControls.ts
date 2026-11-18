/** M164 reuses the frozen M157 scenarios and M163's explicit input migration. */
import {fixture,items,key,enc,list,decode,type Mode} from './assembledDefining';
import {LONG_CLOCK_RULES,LONG_CLOCK_REGISTRY} from '../../assembled/model';
import {BODY_DELIVERY} from '../../assembled/body';
export function current(mode:Mode='High',law='SignificanceFirst',hidden=false){
 const b=fixture(mode,law,16,hidden),rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];if(key(a[2])===key(BODY_DELIVERY)){const p=items(a[3],'list');if(p.length!==2)throw Error('M164 original delivery shape');a[3]=list([...p,false]);}return list(a);
 });
 return {...b,s:{...b.s,rulesVersion:LONG_CLOCK_RULES,registrySchemaVersion:LONG_CLOCK_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {items,key,enc,list,decode};
