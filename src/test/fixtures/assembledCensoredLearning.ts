/** M116: real continuing body, fixed seed0 and unchanged reference0.89.
 * Nonsocial tasks; original body/observation channels remain live. */
import {fixture as base,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,PROPOSITIONS,exact,type Run,type CanonicalValue} from './assembledEffectEvidence';
import {BODY_DELIVERY,BODY_SAMPLE} from '../../assembled/body';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {unsigned} from '../../substrate/canonicalEncoding';
import {changeDefinition} from './assembledCharacter';
export type Profile='repeated'|'hidden'|'missing'|'compatible'|'inconsistent'|'zero'|'positiveZero';
export const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
export function fixture(profile:Profile){
 const b=base('zero',10),high=profile==='compatible'||profile==='inconsistent',zero=profile==='zero'||profile==='positiveZero';
 const slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')];body[2]=q(zero?0:10,1);slots[6]=list(body);
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[q(high||zero?0:100,1),signed(0)])}:e));
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(BODY_DELIVERY));
 const delivery=(at:number,amount:number,permitted=true)=>list([signed(at),unsigned(110),BODY_DELIVERY,list([C,q(amount,1),permitted]),list([])]);
 let s={...b.s,registry:enc(list(slots))};
 if(high){
  const amount=profile==='compatible'?40:5;
  for(let i=0;i<25;i++)rows.push(delivery(1+4*i,amount));
  rows.push(delivery(98,profile==='compatible'?70:100,false),delivery(99,10));
  const template=rows.filter(v=>time(items(v,'list')[0])===12n&&key(items(v,'list')[2])!==key(BODY_SAMPLE));
  if(!template.length)throw Error('missing ordinary opportunity');
  rows.push(...template.map(v=>{const x=[...items(v,'list')];x[0]=signed(100);return list(x);}));
  for(const name of ['definition/task-a','definition/task-b'])s=changeDefinition(s,name,6n,signed(101));
 }else if(zero){
  if(profile==='positiveZero')rows.push(delivery(1,40),delivery(2,60,false));
  else rows.push(delivery(2,100,false));
  rows.push(delivery(9,10));
 }else{
  for(let at=1;at<=6;at++)rows.push(delivery(at,profile==='hidden'?80:10,profile!=='missing'));
  rows.push(delivery(11,42));
 }
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,PROPOSITIONS,exact};
export type {Run,CanonicalValue};
