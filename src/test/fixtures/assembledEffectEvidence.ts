/** M114 d2993282: fixed seed0; same reference laws and nonsocial M106 history.
 * Acquired effect prior at1; unpermitted top-up2; paired saturated delivery9.
 * Original body-level channels remain live; no authored cognitive state. */
import {fixture as original,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,learned,type Run,type CanonicalValue} from './assembledBiography';
import {EFFECT_RULES,EFFECT_REGISTRY} from '../../assembled/model';
import {EFFECT} from '../../assembled/effectEvidence';
import {BODY_DELIVERY} from '../../assembled/body';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {PROPOSITIONS} from '../../campaign3/epiModel';
import {C} from './campaign2Cognitive';
import {unsigned} from '../../substrate/canonicalEncoding';
let base:ReturnType<typeof original>|undefined;
export type Profile='established'|'informative'|'fresh'|'zero'|'denied'|'point';
export function fixture(profile:Profile,amount:10|80,capacity?:number){
 base??=original();const b=base,slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')];body[2]=q(0,1);slots[6]=list(body);
 if(capacity!==undefined){const retention=[...items(slots[8],'list')];retention[2]=unsigned(capacity);slots[8]=list(retention);}
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[q(0,1),signed(0)])}:e));
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(BODY_DELIVERY));
 const delivery=(at:number,value:number,permitted:boolean)=>list([signed(at),unsigned(110),BODY_DELIVERY,list([C,q(value,1),permitted]),list([])]);
 if(profile==='established'||profile==='informative'){const prior=profile==='established'?40:1;rows.push(delivery(1,prior,true),delivery(2,95-prior,false));}
 else if(profile!=='point')rows.push(delivery(2,profile==='zero'?100:95,false));
 rows.push(delivery(9,amount,profile!=='denied'));
 return {s:{...b.s,rulesVersion:EFFECT_RULES,registrySchemaVersion:EFFECT_REGISTRY,registry:enc(list([...slots,list([text(EFFECT),PROPOSITIONS[0]])]))},d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
export const exact=(a:Run,b:Run)=>{const x=a.snapshot(),y=b.snapshot();if(x.clock!==y.clock||x.status!==y.status)throw Error('different continuation');for(const k of ['state','outputs','trace']as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());};
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,learned,C,PROPOSITIONS};
export type {Run,CanonicalValue};
