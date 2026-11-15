/** M124 plan8a03a53d. One holder; two social tasks/third unknown; body10/sample21.
 * True1/false2/silent cue3, seed0, delay20, deadlines30. No learned S0.
 * Only permitted irrelevant footprint changes; same focal Actor and receipt. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue,type EncodingBudget} from './assembledLearnedAssociation';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='sparse'|'dense'|'hidden'|'denied';
export function fixture(mode:Mode='dense',law:EncodingBudget='historical-shared',calibration='UnitBudget',capacity=2,attention='role-calibrated'){
 const b=prior(30,'absent',capacity,law),slots=[...items(decode(b.s.registry),'list')],settings=[...items(slots[30],'list')];
 settings[2]=text(attention);settings[4]=text(calibration);slots[30]=list(settings);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)){
   const p=[...items(a[3],'list')],roles=[...items(p[7],'list')],encoding=key(a[0])!==key(signed(3));
   roles[0]=u(mode==='hidden'?4:1);
   roles[2]=list(encoding&&mode!=='sparse'?Array.from({length:2},()=>list([mode!=='denied',u(mode==='hidden'?4:3),u(3)])):[]);
   p[7]=list(roles);a[3]=list(p);
  }return list(a);
 });
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue,EncodingBudget};
