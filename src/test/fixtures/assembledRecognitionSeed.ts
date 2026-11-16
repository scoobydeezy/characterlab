/** M1301b921218: voice1 positive; new-track coat2 negative; voice3 silent.
 * Two social goals/third unknown, body10, importance/urgency1; probe4 before recall21.
 * Same model/input/seed; only S0 target familiarity changes. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledRoleBinding';
import {RECOGNITION_SEED_RULES,RECOGNITION_SEED_REGISTRY} from '../../assembled/model';
import {RECOGNITION_DOMAIN} from '../../assembled/recognition';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {set,unsigned as u} from '../../substrate/canonicalEncoding';
import {dataIdentity as id} from '../../campaign2/canonicalData';
let cached:ReturnType<typeof prior>|undefined;
export function fixture(known=true,mode:'main'|'hidden'|'denied'='main'){
 const b=cached??(cached=prior()),slots=[...items(decode(b.s.registry),'list')],declaration=[...items(slots[21],'list')];declaration[0]=text(RECOGNITION_DOMAIN);slots[21]=list(declaration);
 const s={...b.s,rulesVersion:RECOGNITION_SEED_RULES,registrySchemaVersion:RECOGNITION_SEED_REGISTRY,registry:enc(list(slots))};
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>{
  if(e.path.rootStateTypeId!==243n||key(f(rec(e.value,228n),2n))!==key(target)||known)return e;
  const v=rec(e.value,228n);return {...e,value:{...v,fields:new Map([...v.fields].map(([n,x])=>[n,n===4n?set(items(x,'set').filter(t=>key(id(t).payload)!==key(text('appearance/coat')))):x]))}};
 }));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[0])===key(signed(21)))a[0]=signed(4);
 if(key(a[2])===key(SOCIAL_SOURCE)){const p=[...items(a[3],'list')],second=key(a[0])===key(signed(2));p[3]=key(a[0])===key(signed(3));p[5]=list([list([text(second?'appearance/coat':'appearance/voice'),true])]);
 const o=[...items(p[1],'list')];if(mode==='hidden'){o[1]=!(o[1]===true);const role=[...items(p[7],'list')];role[0]=u(4);p[7]=list(role);}if(mode==='denied'&&second)o[5]=false;p[1]=list(o);a[3]=list(p);}
 return list(a);});
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,known,mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
