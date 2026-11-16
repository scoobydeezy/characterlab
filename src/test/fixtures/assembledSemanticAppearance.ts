/** M133 f175f258. M132 declared social/body/choice scenario; feature-only contrasts
 * hold recognition cues fixed. Source features are permitted sensory predicates. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledRecognitionAccess';
import {SEMANTIC_APPEARANCE_RULES,SEMANTIC_APPEARANCE_REGISTRY} from '../../assembled/model';
import {CONTINUANT_FEATURES,EVENT_FEATURES} from '../../assembled/semanticAppearance';
import {PerceptualEventFeatureId as EF} from '../../semanticBinding/perceptualEventClassification';
import {DELIBERATION_EVENT} from '../../campaign2/orderedInputs';
import {BODY_SAMPLE} from '../../assembled/body';
import {SOCIAL_SOURCE} from '../../assembled/social';
export type Mode='full'|'negative'|'missing'|'hidden'|'denied';
export function fixture(mode:Mode='full',withdraw=false){
 const b=prior(withdraw,mode==='hidden'?'hidden':mode==='denied'?'denied':'main'),s={...b.s,rulesVersion:SEMANTIC_APPEARANCE_RULES,registrySchemaVersion:SEMANTIC_APPEARANCE_REGISTRY};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(SOCIAL_SOURCE))return v;
 const p=[...items(a[3],'list')],second=key(a[0])===key(signed(2));
 p[4]=list([list(CONTINUANT_FEATURES.map(feature=>list([text(feature),true,true]))),
 list(EVENT_FEATURES.map(feature=>{const affected=second&&feature===EF.ObservedCyclicFlexibleContinuantArc;return list([text(feature),!(affected&&(mode==='negative'||mode==='hidden')),!(affected&&(mode==='missing'||mode==='hidden'))]);}))]);
 a[3]=list(p);return list(a);});
 for(const type of[DELIBERATION_EVENT,BODY_SAMPLE]){
 const row=rows.find(v=>key(items(v,'list')[0])===key(signed(4))&&key(items(v,'list')[2])===key(type));if(!row)throw Error('M133 live probe source missing');
 const a=[...items(row,'list')];a[0]=signed(21);rows.push(list(a));
 }
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,mode,withdraw,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
