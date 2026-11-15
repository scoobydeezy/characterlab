/** M117 plan05d59396: fixed current reference, nonsocial tasks and normal channels. */
import {fixture as base,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,type Run,type CanonicalValue} from './assembledEffectEvidence';
import {BODY_DELIVERY,BODY_SAMPLE} from '../../assembled/body';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {unsigned} from '../../substrate/canonicalEncoding';
import {changeDefinition} from './assembledCharacter';
export type Profile='fast'|'slow'|'no-delivery'|'alias41'|'alias49'|'fine41'|'denied'|'unavailable';
export const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
export function fixture(profile:Profile){
 const b=base('zero',10),kinetic=['fast','slow','no-delivery'].includes(profile);
 const slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')];
 body[1]=q(100,1);body[2]=q(1,profile==='slow'?2:1);body[3]=q(kinetic||profile==='fine41'?10:20,1);body[4]=q(60,1);body[5]=profile!=='denied';body[6]=profile!=='unavailable';slots[6]=list(body);
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[q(kinetic?80:profile==='alias49'?51:43,1),signed(0)])}:e));
 const original=items(decode(b.d.orderedInputs),'list'),sample=items(original.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 const template=original.filter(v=>time(items(v,'list')[0])===12n&&key(items(v,'list')[2])!==key(BODY_SAMPLE));
 if(!template.length)throw Error('ordinary opportunity absent');
 const probes=kinetic?[31,41,61]:[2,4],samples=kinetic?[1,31,41,61]:[2,4],kinds=new Set(template.map(v=>key(items(v,'list')[2])));
 const rows=original.filter(v=>{const a=items(v,'list');return ![BODY_SAMPLE,BODY_DELIVERY].some(x=>key(x)===key(a[2]))&&!(probes.includes(Number(time(a[0])))&&kinds.has(key(a[2])));});
 rows.push(...samples.map(at=>list([signed(at),...sample.slice(1)])),...probes.flatMap(at=>template.map(v=>list([signed(at),...items(v,'list').slice(1)]))));
 if(kinetic)rows.push(list([signed(31),unsigned(110),BODY_DELIVERY,list([C,q(profile==='no-delivery'?0:30,1),false]),list([])]));
 let s={...b.s,registry:enc(list(slots))};for(const name of ['definition/task-a','definition/task-b'])s=changeDefinition(s,name,6n,signed(101));
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact};
export type {Run,CanonicalValue};
