/** M125 plan66f62107. One holder, two social tasks/third unknown.
 * Body10/samples8+9; importance0, seed0. Seven misleading claims1..7, correction8.
 * Fixed false truth, no learned S0. Current probes8/9 precede recalls21 onward. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledLearnedAssociation';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {BODY_SAMPLE} from '../../assembled/body';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {sid} from '../../assembled/skill';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='corrected'|'accurate'|'silent'|'denied'|'hidden';
export function fixture(mode:Mode='corrected',flipGoal=false){
 const b=prior(30,'absent'),slots=[...items(decode(b.s.registry),'list')],social=[...items(slots[19],'list')];
 let task:CanonicalValue|undefined;
 social[1]=list(items(social[1],'list').map(v=>{const group=[...items(v,'list')];if(key(group[0])===key(target)){const rows=[...items(group[1],'list')],first=[...items(rows[0],'list')];task=first[0];first[1]=!flipGoal;rows[0]=list(first);group[1]=list(rows);}return list(group);}));slots[19]=list(social);if(!task)throw Error('M125 missing task');
 const originals=items(decode(b.d.orderedInputs),'list'),template=items(originals.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list'),rows:CanonicalValue[]=[];
 for(const v of originals){const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE))continue;
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=[...items(a[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const g=[...items(v,'list')];if(items(g[1],'list').length)g[1]=list([q(0,1)]);return list(g);}));a[3]=list(p);}
  if(key(a[0])===key(signed(21))){const opportunity=key(a[2])===key(sid(1001,'event/deliberation-opportunity')),context=key(a[1])===key(u(30));
   if(opportunity||context){rows.push(list([signed(8),...a.slice(1)]),list([signed(9),...a.slice(1)]));continue;}
   if(key(a[2])===key(BODY_SAMPLE)){rows.push(list([signed(9),...a.slice(1)]));a[0]=signed(8);}
  }rows.push(list(a));
 }
 for(let at=1;at<=8;at++){const p=[...items(template[3],'list')],o=[...items(p[1],'list')];o[1]=mode==='hidden';o[3]=u(mode==='accurate'||at===8?4:3);o[4]=u(at);o[5]=!(mode==='denied'&&at===8);if(mode==='silent'&&at===8)o[3]=u(0);p[1]=list(o);p[3]=at>1;rows.push(list([signed(at),...template.slice(1,3),list(p),template[4]]));}
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))},task};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
