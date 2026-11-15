/** M121 plan36e3d13f. Two social tasks/third unknown; body10/sample4, seed0.
 * Actual A true1/B false2/A reminder3. Only A has additional perceived objects.
 * Focal A is Target; competing Actor/Participant changes selection, not laws. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledAttentionReceiving';
import {MULTI_UNIT_RULES,MULTI_UNIT_REGISTRY} from '../../assembled/model';
import {MULTI_ENCODING} from '../../assembled/encoding';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='low'|'high'|'dense'|'denied'|'hidden'|'none';
export function fixture(mode:Mode='low',capacity=1){
 const b=prior('main',capacity),slots=[...items(decode(b.s.registry),'list')],settings=items(slots[30],'list');slots[30]=list([text(MULTI_ENCODING),...settings.slice(1)]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)){
  const p=[...items(a[3],'list')],role=items(p[7],'list'),first=key(a[0])===key(signed(1)),observed=mode==='high'?1:3;
  const additional=first&&mode!=='none'?[list([mode!=='denied',u(mode==='hidden'?4:observed),u(observed)]),...(mode==='dense'?[list([true,u(3),u(3)])]:[])]:[];
  p[7]=list([role[0],first?u(2):role[1],list(additional)]);a[3]=list(p);
 }return list(a);});
 return {s:{...b.s,rulesVersion:MULTI_UNIT_RULES,registrySchemaVersion:MULTI_UNIT_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))},legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
