/** M81: 85727519; two recognized stand-ins, physical tasks, fixed0.73 calibration.
 * Only personal participation in the same perceived breaches differs. */
import {list,text,unsigned as u,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledDecisionRegimes';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {REL_PEOPLE,REL} from '../../assembled/relationship';
import {target,other} from './assembledRecognitionCatalog';
import {sid} from '../../assembled/skill';
import type {ComparisonDrawMap} from '../../substrate/random';
let base:ReturnType<typeof prior>|undefined;
export function fixture(low=true,hidden=false,mapping?:ComparisonDrawMap){
 const b=base??(base=prior('balanced')),slots=[...items(decode(b.s.registry),'list')];
 slots[20]=list([text(REL_PEOPLE),list([list([target,sid(1027,'definition/protocol-contact-one')]),list([other,sid(1027,'definition/protocol-contact-two')])])]);
 let encounters=0;
 const originals=[...items(decode(b.d.orderedInputs),'list')],template=originals.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE));
 if(!template)throw Error('M81 requires existing social channel template');
 for(const at of [1,2])if(!originals.some(v=>key(items(v,'list')[0])===key(signed(at))&&key(items(v,'list')[2])===key(SOCIAL_SOURCE))){
  const x=[...items(template,'list')];x[0]=signed(at);originals.push(list(x));
 }
 const rows=originals.map(v=>{
  const x=[...items(v,'list')];if(key(x[2])!==key(SOCIAL_SOURCE))return v;
  const p=[...items(x[3],'list')],social=[...items(p[1],'list')];
  const first=key(x[0])===key(signed(1)),second=key(x[0])===key(signed(2));
  if(hidden){social[1]=social[1]!==true;p[2]=key(p[2])===key(target)?other:target;}
  if(first||second){encounters++;social[3]=u(3);social[4]=u(first?1:2);social[5]=true;p[4]=list([true]);p[3]=false;p[5]=list([list([text(first?'appearance/coat':'appearance/plain'),true])]);
   p[6]=list([text(REL),u(2),low,true,u(0)]);
  }else {const relation=[...items(p[6],'list')];relation[2]=false;p[6]=list(relation);}
  p[1]=list(social);x[3]=list(p);return list(x);
 });
 if(encounters!==2)throw Error('M81 requires exactly two original encounters');
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list([...(mapping?[mapping.canonicalValue]:[]),...rows]))}};
}
export {taskA,taskB,decode,items,key,enc,target,other};
