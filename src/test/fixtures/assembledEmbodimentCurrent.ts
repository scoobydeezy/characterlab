/** M218 current0.143: same runtime for reserve, tolerance and sleep comparisons. */
import {cohort,start,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,at,labels,state,through,type Run} from './assembledIntoxicationCohort';
import {fixture as oldBody,type Profile} from './assembledBodyTrajectory';
import {fixture as oldSleep,type Case} from './assembledSleepCohort';
import {BODY_SAMPLE,BODY_DELIVERY} from '../../assembled/body';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {REWARD_EVIDENCE,REWARD_SOURCE} from '../../assembled/rewardExperience';
import {INTOXICATION,SLEEP_SOURCE} from '../../assembled/sleepControl';
import {REWARD_EVIDENCE_RULES,REWARD_EVIDENCE_REGISTRY} from '../../assembled/model';
import {changeDefinition} from './assembledCharacter';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {set,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
export * from './assembledIntoxicationCohort';
export type {Profile,Case};
export function currentSleep(c:Case,blocked=false){
 const b=oldSleep(c,blocked),slots=[...items(decode(b.s.registry),'list')],sleep=[...items(slots[55],'list')],reward=[...items(slots[57],'list')];sleep[0]=text(INTOXICATION);sleep.push(u(100),u(850));slots[55]=list(sleep);reward[0]=text(REWARD_EVIDENCE);slots[57]=list(reward);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SLEEP_SOURCE)){const p=[...items(a[3],'list')];p[0]=text(INTOXICATION);p.push(u(0));a[3]=list(p);}return list(a);});
 return {s:{...b.s,rulesVersion:REWARD_EVIDENCE_RULES,registrySchemaVersion:REWARD_EVIDENCE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export function reserve(profile:Profile){
 const b=cohort({scenario:'Sober',seed:0,law:'Full'}),old=oldBody(profile),slots=[...items(decode(b.s.registry),'list')],body=items(items(decode(old.s.registry),'list')[6],'list');
 slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(0)]);
 const oldState=restoreAuthoritativeState(decode(old.d.initialState)),initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n&&e.path.fieldId===1n?{...e,value:oldState.read(e.path).value!}:e));
 let s={...b.s,registry:enc(list(slots))};for(const name of ['definition/task-a','definition/task-b','definition/task-c'])s=changeDefinition(s,name,6n,signed(101));s=changeDefinition(s,'definition/task-b',3n,q(10,1));
 const original=items(decode(b.d.orderedInputs),'list'),template=original.filter(v=>at(items(v,'list')[0])===13n),kinetic=['fast','slow','no-delivery'].includes(profile),probes=kinetic?[31,41,61]:[10,12];
 let rows=original.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(PRIORITY_DISPLAY)){const p=[...items(a[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];t[1]=list([q(1,1)]);return list(t);}));a[3]=list(p);}return list(a);});
 for(const t of probes.filter(t=>t>13))rows.push(...template.map(v=>list([signed(t),...items(v,'list').slice(1)])));
 const bodyRows=items(decode(old.d.orderedInputs),'list').filter(v=>[BODY_SAMPLE,BODY_DELIVERY].some(t=>key(t)===key(items(v,'list')[2])));rows.push(...bodyRows);
 const displayRows=original.filter(v=>key(items(v,'list')[2])===key(DISPLAY)).flatMap(v=>items(items(items(v,'list')[3],'list')[1],'list'));
 const seen=new Set<string>(),renew:CanonicalValue[]=[];for(const v of [...displayRows].reverse()){const a=[...items(v,'list')],id=key(list(a.slice(0,2)));if(seen.has(id))continue;seen.add(id);a[2]=u(100+renew.length);a[4]=u(13);a[5]=u(101);renew.push(list(a));}
 rows.push(list([signed(13),u(30),DISPLAY,list([text(STRATEGY),list(renew)]),list([])]));
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
export {start};
