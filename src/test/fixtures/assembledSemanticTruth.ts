/** M140c0d9434d: same body10/seed0/two social tasks/history; precision is the intervention. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledSceneWidth';
import {SEMANTIC_TRUTH_RULES,SEMANTIC_TRUTH_REGISTRY} from '../../assembled/model';
import {SEMANTIC_TRUTH,TRUTH_CHANNEL} from '../../assembled/semanticTruth';
import {CURRENT_SEM_SOURCE} from '../../assembled/semanticLanes';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
import {semanticReferentValue} from '../../substrate/referentOrigin';
import {authoredReferentKey} from './referentOrigin';
export const ref=(n:string)=>semanticReferentValue(authoredReferentKey(n));
export const binding=(role:number,name:string,precision=1,group=0)=>list([u(role),ref(name),u(precision),u(group)]);
export const rule=(role:number,min=1,max:number|undefined=1,tag?:string)=>list([u(role),u(min),list(max===undefined?[]:[u(max)]),list(tag?[text(tag)]:[])]);
export const schema=(name:string,rules:CanonicalValue[],fixed?:string)=>list([text(name),list(rules),list(fixed?[ref(fixed)]:[])]);
export const channel=(type:string,bindings:CanonicalValue[])=>list([text(TRUTH_CHANNEL),text(type),list(bindings)]);
export const content=()=>list([text(SEMANTIC_TRUTH),list([
 ['action.skip-rope',['action']],['action.walk',['action']],['person.mina',['entity']],['person.glen',['entity']],['person.darius',['entity']],
 ['location.library',['interior-space','location']],['object.lead-pipe',['blunt','entity','metal','striking-capable','usable-entity']],
 ['object.cup',['drink-container','entity','usable-entity']],['object.decorative-hammer',['entity','striking-capable']]
 ].map(([n,tags])=>list([ref(n as string),list((tags as string[]).map(text))]))),list([
 schema('event-type/action-occurrence',[rule(10),rule(1),rule(5,1,undefined),rule(7),rule(6)]),
 schema('event-type/social-scene',[rule(2),rule(1),rule(7),rule(6),rule(8)]),
 schema('event-type/strike',[rule(6,1,1,'striking-capable')]),schema('event-type/drink',[rule(6,1,2,'drink-container')]),
 schema('event-type/fixed-action',[rule(1)],'action.walk')
 ])]);
export type Mode='coarsened'|'preserved'|'hidden'|'multi'|'omitted'|'unresolved';
export function currentScene(mode:Mode){return channel('event-type/action-occurrence',[
 binding(10,mode==='hidden'?'action.walk':'action.skip-rope',0),binding(1,'person.mina',1,0),
 binding(5,mode==='multi'?'person.mina':'person.glen',mode==='omitted'?0:mode==='unresolved'?3:1,mode==='multi'?0:1),
 binding(5,'person.darius',1,2),binding(7,'location.library',1,3),binding(6,'object.lead-pipe',1,4)
 ]);}
export function consequenceScene(mode:Mode){return channel('event-type/social-scene',[
 binding(2,mode==='hidden'?'person.darius':'person.mina',1,0),binding(1,'person.glen',mode==='preserved'?1:2,1),
 binding(7,'location.library',1,2),binding(6,'object.lead-pipe',1,3),binding(8,'person.darius',1,4)
 ]);}
export function fixture(mode:Mode='coarsened'){
 const b=prior(),slots=[...items(decode(b.s.registry),'list'),content()],s={...b.s,rulesVersion:SEMANTIC_TRUTH_RULES,registrySchemaVersion:SEMANTIC_TRUTH_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],current=key(a[2])===key(CURRENT_SEM_SOURCE);if(!current&&!(key(a[2])===key(SOCIAL_SOURCE)&&key(a[0])===key(signed(2))))return v;
 const p=[...items(a[3],'list')];p[current?6:7]=current?currentScene(mode):consequenceScene(mode);a[3]=list(p);return list(a);});
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
