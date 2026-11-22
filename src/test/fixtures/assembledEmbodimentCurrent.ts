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
import {CONTROL_SOURCE} from '../../assembled/control';
import {embodiedRecord} from '../../campaign3/embodiedCodecs';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
export * from './assembledIntoxicationCohort';
export type {Profile,Case};
export function currentSleep(c:Case,blocked=false){
 const b=oldSleep(c,blocked),slots=[...items(decode(b.s.registry),'list')],sleep=[...items(slots[55],'list')],reward=[...items(slots[57],'list')];sleep[0]=text(INTOXICATION);sleep.push(u(100),u(850));slots[55]=list(sleep);reward[0]=text(REWARD_EVIDENCE);slots[57]=list(reward);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SLEEP_SOURCE)){const p=[...items(a[3],'list')];p[0]=text(INTOXICATION);p.push(u(0));a[3]=list(p);}return list(a);});
 return {s:{...b.s,rulesVersion:REWARD_EVIDENCE_RULES,registrySchemaVersion:REWARD_EVIDENCE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
let currentBase:ReturnType<typeof cohort>|undefined;
const reserveCache=new Map<Profile,ReturnType<typeof cohort>>();
export function reserve(profile:Profile){
 const cached=reserveCache.get(profile);if(cached)return cached;
 const b=currentBase??(currentBase=cohort({scenario:'Sober',seed:0,law:'Full'})),old=oldBody(profile),slots=[...items(decode(b.s.registry),'list')],body=items(items(decode(old.s.registry),'list')[6],'list');
 slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(0)]);
 const oldState=restoreAuthoritativeState(decode(old.d.initialState)),initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n&&e.path.fieldId===1n?{...e,value:oldState.read(e.path).value!}:e));
 let s={...b.s,registry:enc(list(slots))};for(const name of ['definition/task-a','definition/task-b','definition/task-c'])s=changeDefinition(s,name,6n,signed(101));s=changeDefinition(s,'definition/task-b',3n,q(10,1));
 const original=items(decode(b.d.orderedInputs),'list'),template=original.filter(v=>at(items(v,'list')[0])===13n),kinetic=['fast','slow','no-delivery'].includes(profile),probes=kinetic?[31,41,61]:[10,12];
 let rows=original.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(PRIORITY_DISPLAY)){const p=[...items(a[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];t[1]=list([q(1,1)]);return list(t);}));a[3]=list(p);}return list(a);});
 for(const t of probes.filter(t=>t>13))rows.push(...template.map(v=>list([signed(t),...items(v,'list').slice(1)])));
 const bodyRows=items(decode(old.d.orderedInputs),'list').filter(v=>[BODY_SAMPLE,BODY_DELIVERY].some(t=>key(t)===key(items(v,'list')[2])));rows.push(...bodyRows,...items(decode(old.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(POSITION_SOURCE)||(items(v,'list')[2] as {payload:{value?:string}}).payload.value==='event/regulatory-diagnostic-probe').map(v=>{const a=items(v,'list');return (a[2] as {payload:{value?:string}}).payload.value==='event/regulatory-diagnostic-probe'?list([signed(1),...a.slice(1)]):v;}));
 const displayRows=original.filter(v=>key(items(v,'list')[2])===key(DISPLAY)).flatMap(v=>items(items(items(v,'list')[3],'list')[1],'list'));
 const seen=new Set<string>(),renew:CanonicalValue[]=[];for(const v of [...displayRows].reverse()){const a=[...items(v,'list')],id=key(list(a.slice(0,2)));if(seen.has(id))continue;seen.add(id);a[2]=u(10+renew.length);a[4]=u(13);a[5]=u(101);renew.push(list(a));}
 rows.push(list([signed(13),u(30),DISPLAY,list([text(STRATEGY),list(renew)]),list([])]));
 const result={s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};reserveCache.set(profile,result);return result;
}
export {start};

export function tolerance(law:'Reciprocal'|'Unattenuated'='Reciprocal',amount=40){
 const b=reserve('fast'),slots=[...items(decode(b.s.registry),'list')],act=items(slots[10],'list'),target=items(slots[57],'list')[1],tol=[...items(slots[26],'list')];tol[2]=text(law);slots[26]=list(tol);slots[10]=list([act[0],act[1],set(items(act[2],'set').map(v=>{const a=items(v,'list');return key(a[0])===key(target)?list([a[0],q(amount,1),u(2)]):v;}))]);
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n&&e.path.fieldId===1n?{...e,value:embodiedRecord(454,[q(10,1),signed(0)])}:e));
 const original=items(decode(b.d.orderedInputs),'list'),sample=items(original.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 const rows=original.filter(v=>{const a=items(v,'list');return at(a[0])<=13n&&![BODY_SAMPLE,BODY_DELIVERY,DISPLAY].some(t=>key(t)===key(a[2]));}).map(v=>{const a=[...items(v,'list')],t=at(a[0]);if((a[2] as {payload:{value?:string}}).payload.value==='event/regulatory-diagnostic-probe')a[0]=signed(1);if(key(a[2])===key(REWARD_SOURCE)){const p=[...items(a[3],'list')];p[3]=false;p[4]=t>=2n&&t<=4n;a[3]=list(p);}if(key(a[2])===key(CONTROL_SOURCE)){const p=[...items(a[3],'list')];p[1]=u(0);p[2]=false;a[3]=list(p);}return list(a);});
 const routes=items(items(slots[12],'list')[1],'list');rows.push(list([signed(1),u(30),DISPLAY,list([text(STRATEGY),list(routes.flatMap((v,i)=>[0,1].map(route=>list([items(v,'list')[0],u(route),u(route+1),i===0&&route===0,u(1),u(101),true]))))]),list([])]));
 rows.push(...[3,5,7].map(t=>list([signed(t),...sample.slice(1)])));
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
