/** M120 planecd3ae36: M44 perceived role/recall scenario in reference0.89.
 * Two social tasks, third unknown. True1/false2/silent cue3; body10 sampled4.
 * No learned S0, seed0. Extra current encounter reports absent through perception. */
import {source as oldSource,data as oldData,target} from './assembledEncoding';
import {fixture as current,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,type Run,type CanonicalValue} from './assembledEffectEvidence';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../../substrate/state';
import {REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='main'|'unknown'|'hidden'|'denied'|'bare'|'target';
let cached:ReturnType<typeof current>|undefined;
export function fixture(mode:Mode='main',capacity=1,attention='role-calibrated',inheritedCue=false){
 const b=cached??(cached=current('zero',10)),s=oldSource(capacity,attention),d=oldData(mode==='bare'?'main':mode);
 const slots=[...items(decode(s.registry),'list'),...items(decode(b.s.registry),'list').slice(31)];
 // Current grounded appraisal declaration; retain the one shared reference law.
 const currentSlots=items(decode(b.s.registry),'list');slots[28]=currentSlots[28];
 // Grounded threat uses garden/water, distinct from the compared A/B social routes.
 slots[10]=currentSlots[10];slots[11]=currentSlots[11];
 const routes=items(slots[12],'list'),currentRoutes=items(currentSlots[12],'list');
 slots[12]=list([routes[0],list([...items(routes[1],'list').slice(0,2),items(currentRoutes[1],'list')[2]])]);
 const prior=restoreAuthoritativeState(decode(d.initialState)).entries(),present=new Set(prior.map(e=>key(statePathValue(e.path))));
 const initial=new AuthoritativeState([...prior,...restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>!present.has(key(statePathValue(e.path))))]);
 const rows=items(decode(d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)){const p=[...items(a[3],'list')];p[4]=list(mode==='bare'?[]:[true]);if(!inheritedCue&&key(a[0])===key(signed(3))){const observation=[...items(p[1],'list')];observation[4]=u(1);p[1]=list(observation);}p.push(list([false,u(0),false,false,false,false,false]),list([false,u(0),false,u(0)]),list([list([false,false,false]),list([false,false,false]),list([false,false,false])]));a[3]=list(p);}if(key(a[2])===key(REAPPRAISAL_SOURCE))a[3]=list([...items(a[3],'list'),list([u(0),false])]);return list(a);});
 return {s:{...s,rulesVersion:b.s.rulesVersion,registrySchemaVersion:b.s.registrySchemaVersion,registry:enc(list(slots))},d:{...d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
