/** M149: one actual character, body10/seed0, two social tasks/third unknown.
 * Two passive observers see a controlled display of this character's task A.
 * Current rich perception/body/decision sources from M148 remain in the SAME run. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target} from './assembledSocialCorrection';
import {SOCIAL_WITNESS_RULES,SOCIAL_WITNESS_REGISTRY} from '../../assembled/model';
import {SW,SW_SOURCE} from '../../assembled/socialWitness';
import {semanticReferentFromAuthoredContent as ref} from '../../substrate/referentOrigin';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {unsigned as u,typedIdentifier as tid,type CanonicalValue} from '../../substrate/canonicalEncoding';
export type Mode='main'|'denied'|'false'|'duplicate'|'missing'|'silent'|'swapped'|'both';
export function promote<B extends ReturnType<typeof prior>>(b:B,reverse=false){
 const slots=items(decode(b.s.registry),'list'),recipients=items(items(slots[18],'list')[2],'list');
 const observers=recipients.map((o,i)=>list([o,ref(tid(1038,text('content/social-holder-'+i))),ref(tid(1038,text('content/social-local-target-'+i)))]));
 const declaration=list([text(SW),b.taskA,reverse,list(observers)]);
 return {...b,s:{...b.s,rulesVersion:SOCIAL_WITNESS_RULES,registrySchemaVersion:SOCIAL_WITNESS_REGISTRY,registry:enc(list([...slots,declaration]))}};
}
export function fixture(mode:Mode='main',privateCommitment=true,reverse=false){
 const b=promote(prior(),reverse),source=[2,3,5,6].map((at,i)=>{
  const probe=i===3,access=i===0?[true,true]:probe?[false,false]:mode==='denied'?[false,false]:mode==='swapped'?[false,true]:mode==='both'?[true,true]:[true,false];
  return list([signed(at),u(30),SW_SOURCE,list([b.taskA,u(i===0?1:2),u(probe||mode==='silent'?0:i===0||mode==='false'?4:3),u(probe||mode==='missing'?0:mode==='duplicate'&&i>0?2:i+1),true,...access]),list([])]);
 });
 const initial=restoreAuthoritativeState(decode(b.d.initialState)),entries=initial.entries().filter(e=>privateCommitment||!(e.path.rootStateTypeId===373n&&[1n,2n].includes(e.path.fieldId)&&e.path.selectors[0]?.kind==='mapKey'&&key(e.path.selectors[0].key)===key(b.taskA)));
 return {...b,d:{...b.d,initialState:enc(new AuthoritativeState(entries).canonicalValue()),orderedInputs:enc(list([...items(decode(b.d.orderedInputs),'list'),...source]))}};
}
export {prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u};
export type {CanonicalValue};
