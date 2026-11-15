/** M120 planecd3ae36: M44 perceived role/recall scenario in reference0.89.
 * Two social tasks, third unknown. True1/false2/silent cue3; body10 sampled4.
 * No learned S0, seed0. Extra current encounter reports absent through perception. */
import {source as oldSource,data as oldData,target} from './assembledEncoding';
import {fixture as current,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,type Run,type CanonicalValue} from './assembledEffectEvidence';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../../substrate/state';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='main'|'unknown'|'hidden'|'denied'|'bare'|'target';
let cached:ReturnType<typeof current>|undefined;
export function fixture(mode:Mode='main',capacity=1,attention='role-calibrated'){
 const b=cached??(cached=current('zero',10)),s=oldSource(capacity,attention),d=oldData(mode==='bare'?'main':mode);
 const slots=[...items(decode(s.registry),'list'),...items(decode(b.s.registry),'list').slice(31)];
 const prior=restoreAuthoritativeState(decode(d.initialState)).entries(),present=new Set(prior.map(e=>key(statePathValue(e.path))));
 const initial=new AuthoritativeState([...prior,...restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>!present.has(key(statePathValue(e.path))))]);
 const rows=items(decode(d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)){const p=[...items(a[3],'list')];p[4]=list(mode==='bare'?[]:[true]);p.push(list([false,u(0),false,false,false,false,false]),list([false,u(0),false,u(0)]),list([list([false,false,false]),list([false,false,false]),list([false,false,false])]));a[3]=list(p);}return list(a);});
 return {s:{...s,rulesVersion:b.s.rulesVersion,registrySchemaVersion:b.s.registrySchemaVersion,registry:enc(list(slots))},d:{...d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
