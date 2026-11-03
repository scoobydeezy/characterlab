/** M43: one holder; recognized stand-in, A true1/B false2/Q silent3.
 * Risk evidence1; deliberate3/4, reserve10 sampled4, diagnostic1. Two social tasks,
 * third unknown outside gate. Fixed laws/calibration/seed0; no authored memory. */
import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {source as baseSource,data as baseData,decode,items,key,enc,target} from './assembledSocialMemory';
import {AFFECT_MEMORY_RULES,AFFECT_MEMORY_REGISTRY} from '../../assembled/model';
import {AFFECT_MEMORY} from '../../assembled/affectMemory';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {REAPPRAISAL,REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {RETENTION} from '../../assembled/retention';
import {sid} from '../../assembled/skill';
let cached:ReturnType<typeof baseData>|undefined;
export function source(law='UncontrolledGain',graph=true,slots=1,workspace=5){const s=baseSource(slots,8,workspace),a=[...items(decode(s.registry),'list')];a[8]=list([text(RETENTION),unsigned(8),unsigned(8),unsigned(1)]);a.push(list([text(AFFECT_MEMORY),text(law),list(graph?[list([target,unsigned(1),unsigned(1),unsigned(3),q(1,4)])]:[])]));return {...s,rulesVersion:AFFECT_MEMORY_RULES,registrySchemaVersion:AFFECT_MEMORY_REGISTRY,registry:enc(list(a))};}
export type Mode='main'|'zero'|'unknown'|'hidden'|'denied'|'late'|'current';
export function data(mode:Mode='main'){
 const d=cached??(cached=baseData()),rows:CanonicalValue[]=[];
 for(const v of items(decode(d.orderedInputs),'list')){const r=[...items(v,'list')];if(key(r[2])===key(SOCIAL_SOURCE)){if(key(r[0])===key(signed(6)))continue;const p=[...items(r[3],'list')],o=[...items(p[1],'list')];o[1]=mode!=='hidden';o[3]=unsigned(key(r[0])===key(signed(1))?3:key(r[0])===key(signed(2))?4:0);o[5]=!(mode==='denied'&&key(r[0])===key(signed(3)));p[1]=list(o);r[3]=list(p);}
  const decision=key(r[2])===key(sid(1001,'event/deliberation-opportunity')),context=key(r[1])===key(unsigned(30));if(key(r[0])===key(signed(8))&&(decision||context||key(r[2])===key(sid(1001,'event/assembled-body-sample')))){r[0]=signed(4);if(decision||context)rows.push(list([signed(3),...r.slice(1)]));}rows.push(list(r));
 }
 const risk=(at:number,display:boolean,observed:boolean)=>rows.push(list([signed(at),unsigned(30),REAPPRAISAL_SOURCE,list([text(REAPPRAISAL),unsigned(1),mode!=='hidden',display,observed,unsigned(0),false,false,false]),list([])]));
 risk(1,mode!=='zero',!['unknown','late'].includes(mode));if(mode==='late'||mode==='current')risk(3,mode==='late',true);
 return {...d,orderedInputs:enc(list(rows))};
}
export {decode,items,key,enc,target};
