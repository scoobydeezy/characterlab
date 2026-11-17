/** M145 ebacbc81. Existing M132/134/135 scenarios: body10/seed0/goals+urgency1,
 * two social tasks/third unknown; positive1/negative2/voice3/choice4, optional
 * current2/recall21. Only declaration/grammar promoted to current SEM versions. */
import {fixture as history} from './assembledRecognitionAccess';
import {fixture as lanes} from './assembledSemanticLanes';
import {fixture as lifecycle} from './assembledSemanticLifecycle';
import {content} from './assembledSemanticTruth';
import {CARRIER_OBSERVATION_RULES,CARRIER_OBSERVATION_REGISTRY} from '../../assembled/model';
import {SEMANTIC_EVENTS_ENCODING} from '../../assembled/encoding';
import {CONTINUANT_FEATURES} from '../../assembled/semanticAppearance';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {CURRENT_SEM_SOURCE} from '../../assembled/semanticLanes';
import {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledRecognitionAccess';
function upgrade<T extends ReturnType<typeof lifecycle>|ReturnType<typeof history>|ReturnType<typeof lanes>>(b:T){
 const slots=[...items(decode(b.s.registry),'list')],encoding=items(slots[30],'list');
 if(slots.length!==48)throw Error('M145 expected original 48-slot domain');
 slots[30]=list([text(SEMANTIC_EVENTS_ENCODING),...encoding.slice(1)]);slots.push(content());
 const s={...b.s,rulesVersion:CARRIER_OBSERVATION_RULES,registrySchemaVersion:CARRIER_OBSERVATION_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];if(![SOCIAL_SOURCE,CURRENT_SEM_SOURCE].some(t=>key(t)===key(a[2])))return v;
  const p=[...items(a[3],'list')];if(typeof p[3]==='boolean')p[3]=list([p[3],false,false,false]);
  const features=items(p[4],'list');if(features.length<2)p[4]=list([list(features.map(value=>list([text(CONTINUANT_FEATURES.find(x=>x.endsWith('person-form'))!),value,true]))),list([])]);
  a[3]=list(p);return list(a);
 });
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export const historyFixture=(...args:Parameters<typeof history>)=>upgrade(history(...args));
export const lanesFixture=(...args:Parameters<typeof lanes>)=>upgrade(lanes(...args));
export const lifecycleFixture=(...args:Parameters<typeof lifecycle>)=>upgrade(lifecycle(...args));
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
