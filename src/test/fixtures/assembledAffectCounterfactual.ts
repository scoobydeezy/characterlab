/** M73: current model; observed training/cue, body relief9, physical A/B choice10.
 * Three tasks, no social dependencies; seed0, body30/capacity100, severity1/3. */
import {list,rational as q,signed} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledReserveAffect';
import {INTERPRETED_THREAT_RULES,INTERPRETED_THREAT_REGISTRY} from '../../assembled/model';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
export type Mode='low'|'high'|'noGround'|'hidden'|'denied';
export function fixture(mode:Mode='high'){
 const b=prior(mode==='noGround'?'high':mode);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const x=[...items(v,'list')];
  if(mode==='noGround'&&key(x[0])===key(signed(1))&&key(x[2])===key(PRIORITY_DISPLAY)){
   const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{
    const r=[...items(v,'list')];if(key(r[0])===key(taskA))r[1]=list([q(0,1)]);return list(r);
   }))]);
  }return list(x);
 });
 return {s:{...b.s,rulesVersion:INTERPRETED_THREAT_RULES,registrySchemaVersion:INTERPRETED_THREAT_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {taskA,taskB,decode,items,key,enc};
