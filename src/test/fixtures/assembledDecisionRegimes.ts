/** M80: committed card d072d36a. Same0.73 character and reference calibration.
 * Three physical tasks; body30/cap100/rate10, delivery90 at9; no social dependencies.
 * A/B importance3/5, severity1/2 (owner amendment), live channels; seed0; full calendar through101. */
import {list,rational as q,signed} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledAffectControls';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {changeDefinition} from './assembledCharacter';
export type Regime='settled'|'quiet'|'balanced';
export function fixture(regime:Regime='quiet',control:'normal'|'hidden'|'failed'='normal'){
 const b=prior('historyRisk'),slots=[...items(decode(b.s.registry),'list')],a=[...items(slots[28],'list')];a[5]=q(1,2);slots[28]=list(a);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const x=[...items(v,'list')];
  if(key(x[2])===key(PRIORITY_DISPLAY)&&key(x[0])===key(signed(1))){
   const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];if([taskA,taskB].some(k=>key(k)===key(t[0])))t[1]=list([q(3,5)]);return list(t);}))]);
  }
  if(key(x[2])===key(POSITION_SOURCE)){
   const p=[...items(x[3],'list')],annex=[...items(p[3],'list')];
   if(key(x[0])===key(signed(3)))annex[7]=regime!=='balanced';
   if(key(x[0])===key(signed(9)))annex[7]=regime==='settled';
   if(control==='hidden')annex[1]=annex[1]!==true;
   p[3]=list(annex);x[3]=list(p);
  }
  return list(x);
 });
 const s={...b.s,registry:enc(list(slots))};
 return {s:control==='failed'?changeDefinition(s,'definition/protocol-execution',1n,false):s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {taskA,taskB,decode,items,key,enc};
