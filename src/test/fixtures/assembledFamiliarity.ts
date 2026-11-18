/** M154 neutral permitted appearance; body10/seed0; social task choices are not the gate. */
import {promote,prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type CanonicalValue} from './assembledSocialWitness';
import {upgrade} from './assembledMultiReceipts';
import {FAMILIARITY_RULES,FAMILIARITY_REGISTRY} from '../../assembled/model';
import {SOCIAL,SOCIAL_SOURCE} from '../../assembled/social';
import {PerceptualFeatureId as CF} from '../../semanticBinding/perceptualClassification';
export type Mode='same'|'partial'|'novel'|'missing'|'hidden'|'denied'|'place'|'crossCategory';
export function fixture(mode:Mode='same',capacity=32){
 const b=upgrade(promote(prior())),slots=[...items(decode(b.s.registry),'list')],retention=[...items(slots[8],'list')];retention[2]=u(capacity);slots[8]=list(retention);
 const s={...b.s,rulesVersion:FAMILIARITY_RULES,registrySchemaVersion:FAMILIARITY_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list'),template=items(rows.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list');
 const events=[1,4,5].map((at,i)=>{const a=[...template],p=[...items(a[3],'list')];a[0]=signed(at);
 p[1]=list([text(SOCIAL),mode!=='hidden',u(1),u(0),u(i+1),!(mode==='denied'&&at===1),true]);
 if(mode==='hidden'){const catalog=items(items(slots[21],'list')[1],'list');p[2]=items(catalog.find(v=>key(items(v,'list')[0])!==key(p[2]))!,'list')[0];}
 p[3]=list([false,false,false,false]);p[5]=list([]);
 const place=mode==='place'||mode==='crossCategory'&&at===5,probe=at===5;
 p[4]=list([list([
 [CF.ObservedPersonForm,!place,true],[CF.ObservedEnclosureForm,place,true],
 [CF.ObservedMetallicSurface,!(probe&&mode==='novel'),!(probe&&mode==='missing')],
 [CF.ObservedElongatedForm,!(probe&&(mode==='partial'||mode==='novel')),!(probe&&mode==='missing')],
 [CF.ObservedBluntForm,true,at===1]
 ].map(([name,value,access])=>list([text(name as string),value as boolean,access as boolean]))),list([])]);
 a[3]=list(p);return list(a);
 });
 return {...b,s,d:{...b.d,orderedInputs:enc(list([...rows.filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE)),...events]))},mode,capacity};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u};
export type {CanonicalValue};
