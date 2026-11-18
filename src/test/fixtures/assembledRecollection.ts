/** M155 fixed neutral appearance history; seed0/body10; no social-task choice claim. */
import {fixture as prior,items,decode,key,enc,list,text,signed,u,type CanonicalValue} from './assembledFamiliarity';
import {RECOLLECTION_RULES,RECOLLECTION_REGISTRY} from '../../assembled/model';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {PerceptualFeatureId as CF} from '../../semanticBinding/perceptualClassification';
export type Mode155='baseline'|'hidden'|'denied'|'missing'|'tie'|'otherCategory'|'evicted';
export function fixture155(mode:Mode155='baseline'){
 const b=prior(mode==='hidden'?'hidden':'same',mode==='evicted'?2:32),rows=items(decode(b.d.orderedInputs),'list'),template=items(rows.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list');
 const events=[1,2,3,4,5,6,7,8].map(at=>{const a=[...template],p=[...items(a[3],'list')],other=[2,3,6,7].includes(at),place=mode==='otherCategory'&&[2,3].includes(at),detail=![2,3].includes(at),known=![4,5,8].includes(at)&&mode!=='missing'&&!(mode==='tie'&&at===3);a[0]=signed(at);
 const source=[...items(p[1],'list')];source[4]=u(at);source[5]=!(mode==='denied'&&at===1);p[1]=list(source);
 p[4]=list([list([[CF.ObservedPersonForm,!place,true],[CF.ObservedEnclosureForm,place,true],[CF.ObservedMetallicSurface,!other,true],[CF.ObservedElongatedForm,!other,true],[CF.ObservedBluntForm,detail,known]].map(([name,value,access])=>list([text(name as string),value as boolean,access as boolean]))),list([])]);
 a[3]=list(p);return list(a);});
 return {...b,s:{...b.s,rulesVersion:RECOLLECTION_RULES,registrySchemaVersion:RECOLLECTION_REGISTRY},d:{...b.d,orderedInputs:enc(list([...rows.filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE)),...events]))},mode};
}
export {items,decode,key,enc,list,text,signed,u};
export type {CanonicalValue};
