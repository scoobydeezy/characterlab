/** M72: one character; three physical tasks, perceived stand-ins, no social dependencies.
 * Actual context trials1..9; chosen cognition10 then physical choice11. Body30/rate10.
 * Safe/current observation channels are live; law/calibration/seed0 fixed. */
import {list,text,signed,unsigned as u,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledReserveAffect';
import {INTERPRETED_THREAT_RULES,INTERPRETED_THREAT_REGISTRY} from '../../assembled/model';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {BODY_SAMPLE} from '../../assembled/body';
import {REAPPRAISAL,REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {DISPLAY} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {PRACTICE_SETTING,sid} from '../../assembled/skill';
export type Mode='complete'|'interrupted'|'noFrame'|'denied'|'ineffective'|'hidden';
export function fixture(mode:Mode='complete'){
 const b=prior('low'),slots=[...items(decode(b.s.registry),'list')],app=[...items(slots[28],'list')],cognitive=app[1];
 if(mode==='noFrame')app[3]=text('NoReappraisal');slots[28]=list(app);
 // Replace inherited urgency11 with the explicitly pinned A/B urgency below.
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const r=items(v,'list');return !(key(r[0])===key(signed(11))&&key(r[2])===key(PRIORITY_DISPLAY));}).map(v=>{
  const row=[...items(v,'list')],at=row[0];if(typeof at==='boolean'||at.kind!=='signed')throw Error('M72 time');
  if(key(row[2])===POSITION_SOURCE_KEY){
   const p=[...items(row[3],'list')],panel=[...items(p[2],'list')],annex=[...items(p[3],'list')];
   const alternative=at.value>=4n&&at.value<=6n;panel[0]=u(alternative?2:0);
   if(mode==='denied'&&at.value===5n)panel[3]=false;
   annex[0]=u(0);annex[1]=mode==='hidden';annex[2]=u(0);annex[3]=false;
   annex[7]=!alternative||mode==='ineffective';p[2]=list(panel);p[3]=list(annex);row[3]=list(p);
  }
  if(key(row[2])===key(REAPPRAISAL_SOURCE)&&at.value===7n){
   const p=[...items(row[3],'list')];p[5]=u(2);p[6]=true;p[9]=list([u(1),true]);row[3]=list(p);
  }
  if(key(row[2])===key(DISPLAY)&&at.value===8n){const p=[...items(row[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[5]=u(11);return list(r);}));row[3]=list(p);}
  if(key(row[2])===key(PRIORITY_DISPLAY)){
   const p=[...items(row[3],'list')];p[1]=list(items(p[1],'list').map(v=>{
    const r=[...items(v,'list')];if(at.value===1n)r[1]=list([q(1,1)]);
    if(at.value===10n){r[3]=list([q(key(r[0])===key(cognitive)?1:0,1)]);r[4]=true;}
    return list(r);
   }));row[3]=list(p);
  }
  return list(row);
 });
 const cloneTypes=['event/deliberation-opportunity','event/assembled-identity-context','event/assembled-self-context','event/assembled-values-context'].map(n=>key(sid(1001,n)));
 for(const v of [...rows]){const r=items(v,'list');if(key(r[0])===key(signed(10))&&(cloneTypes.includes(key(r[2]))||key(r[2])===key(BODY_SAMPLE)||key(r[2])===key(PRACTICE_SETTING)))rows.push(list([signed(11),...r.slice(1)]));}
 const priority=items(rows.find(v=>key(items(v,'list')[0])===key(signed(10))&&key(items(v,'list')[2])===key(PRIORITY_DISPLAY))!,'list'),p=items(priority[3],'list');
 rows.push(list([signed(11),...priority.slice(1,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[1]=list([]);r[3]=list([q(key(r[0])===key(cognitive)?0:1,1)]);return list(r);}))]),list([])]));
 for(const at of [10,11]){if(rows.some(v=>key(items(v,'list')[0])===key(signed(at))&&key(items(v,'list')[2])===key(REAPPRAISAL_SOURCE)))throw Error('M72 source collision');
 rows.push(list([signed(at),u(30),REAPPRAISAL_SOURCE,list([text(REAPPRAISAL),u(0),false,false,false,u(0),false,at===10,mode!=='interrupted',list([u(0),false])]),list([])]));}
 return {s:{...b.s,rulesVersion:INTERPRETED_THREAT_RULES,registrySchemaVersion:INTERPRETED_THREAT_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
const POSITION_SOURCE_KEY=key(POSITION_SOURCE);
export {taskA,taskB,decode,items,key,enc};
