/** M70: M69 physical A/B grounds, training1..6; cue7..9 then choice10.
 * Body30/rate10, no social dependencies, seed0; legacy report7 stays separate. */
import {list,text,unsigned as u,signed} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledGroundedAffect';
import {OBSERVED_THREAT_RULES,OBSERVED_THREAT_REGISTRY} from '../../assembled/model';
import {POSITION,POSITION_SOURCE} from '../../assembled/positionPerception';
import {REAPPRAISAL,REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {sid} from '../../assembled/skill';
export type Mode='risk'|'safe'|'denied'|'censored'|'noop'|'hidden'|'legacyFalse';
export function fixture(mode:Mode='risk'){
 const b=prior('ineffective'),s={...b.s,rulesVersion:OBSERVED_THREAT_RULES,registrySchemaVersion:OBSERVED_THREAT_REGISTRY};
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return !(key(a[0])===key(signed(9))&&['event/deliberation-opportunity','event/assembled-identity-context','event/assembled-self-context','event/assembled-values-context'].some(name=>key(a[2])===key(sid(1001,name))));}).map(v=>{
  const a=[...items(v,'list')];
  if(mode==='legacyFalse'&&key(a[0])===key(signed(7))&&key(a[2])===key(REAPPRAISAL_SOURCE)){const p=[...items(a[3],'list')];p[3]=false;a[3]=list(p);}
  return list(a);
 });
 for(let at=7;at<=9;at++){
  if(rows.some(v=>key(items(v,'list')[0])===key(signed(at))&&key(items(v,'list')[2])===key(POSITION_SOURCE)))throw Error('M70 unexpected inherited panel');
  const risk=at===9&&mode!=='safe',stage=['Before','Motion','After'][at-7];
  rows.push(list([signed(at),u(10),POSITION_SOURCE,list([text(POSITION),list([]),list([u(0),text(stage),true,!(mode==='denied'&&at===8)]),list([u(mode==='hidden'?2:0),mode==='hidden'?!risk:risk,u(0),false,at===9,mode!=='noop',mode!=='censored',risk])]),list([])]));
  if(!rows.some(v=>key(items(v,'list')[0])===key(signed(at))&&key(items(v,'list')[2])===key(REAPPRAISAL_SOURCE)))rows.push(list([signed(at),u(30),REAPPRAISAL_SOURCE,list([text(REAPPRAISAL),u(0),false,false,false,u(0),false,false,false,list([u(0),false])]),list([])]));
 }
 return {s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {taskA,taskB,decode,items,key,enc};
