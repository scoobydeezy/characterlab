/** M126 plan3fb25f25. One holder/recognized stand-in; two social tasks, third unknown.
 * Body10, importance0, seed0. Long:8 positives +9 qualified negatives; short:1+5.
 * Full monitoring/opportunity are permitted display, independent of actual world.
 * Delay20; live current probes precede recalled memory. No learned initial state. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledBeliefReceiving';
import {BELIEF_TRIAL_RULES,BELIEF_TRIAL_REGISTRY} from '../../assembled/model';
import {SOCIAL_SOURCE,SOCIAL_TRIAL} from '../../assembled/social';
import {BODY_SAMPLE} from '../../assembled/body';
import {sid} from '../../assembled/skill';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='qualified'|'no-opportunity'|'censored'|'denied'|'hidden'|'unknown'|'accurate';
export function fixture(mode:Mode='qualified',long=false,count=long?17:6,flipGoal=false){
 const b=prior('corrected',flipGoal),originals=items(decode(b.d.orderedInputs),'list'),rows:CanonicalValue[]=[];
 const template=items(originals.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list');
 const probes=long?[9,10,18]:[6,7];
 for(const v of originals){const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE))continue;
  const isProbe=key(a[2])===key(sid(1001,'event/deliberation-opportunity'))||key(a[1])===key(u(30))||key(a[2])===key(BODY_SAMPLE);
  if(isProbe&&[8,9].some(n=>key(a[0])===key(signed(n)))){if(key(a[0])===key(signed(8)))for(const n of probes)rows.push(list([signed(n),...a.slice(1)]));continue;}
  rows.push(list(a));
 }
 for(let at=1;at<=count;at++){const p=[...items(template[3],'list')],o=[...items(p[1],'list')],positive=at<=(long?8:1),controlled=!positive||mode==='unknown';
  o[0]=text(SOCIAL_TRIAL);o[1]=mode==='hidden';o[3]=u(positive&&mode!=='accurate'?3:4);o[4]=u(at);o[5]=!(controlled&&mode==='denied');
  o.push(mode==='hidden',!(controlled&&(mode==='no-opportunity'||mode==='unknown')),!(controlled&&mode==='censored'));
  p[1]=list(o);p[3]=at>1;rows.push(list([signed(at),...template.slice(1,3),list(p),template[4]]));
 }
 return {s:{...b.s,rulesVersion:BELIEF_TRIAL_RULES,registrySchemaVersion:BELIEF_TRIAL_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))},task:b.task,legacy:b.s};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
