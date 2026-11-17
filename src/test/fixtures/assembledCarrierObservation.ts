/** M142449777c7: fixed body10/seed0/goals1; only target-cue carrier differs. */
import {fixture as prior,channel,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledSemanticTruth';
import {CARRIER_OBSERVATION_RULES,CARRIER_OBSERVATION_REGISTRY} from '../../assembled/model';
import {SEMANTIC_EVENTS_ENCODING} from '../../assembled/encoding';
import {CONTINUANT_FEATURES,EVENT_FEATURES} from '../../assembled/semanticAppearance';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {CURRENT_SEM_SOURCE} from '../../assembled/semanticLanes';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='focal'|'companion'|'hidden'|'denied';
export function fixture(mode:Mode='focal'){
 const b=prior(mode==='hidden'?'hidden':'coarsened'),slots=[...items(decode(b.s.registry),'list')],config=items(slots[30],'list');
 slots[30]=list([text(SEMANTIC_EVENTS_ENCODING),...config.slice(1)]);
 const s={...b.s,rulesVersion:CARRIER_OBSERVATION_RULES,registrySchemaVersion:CARRIER_OBSERVATION_REGISTRY,registry:enc(list(slots))};
 const original=items(decode(b.d.orderedInputs),'list'),first=original.map(v=>items(v,'list')).find(a=>key(a[2])===key(SOCIAL_SOURCE)&&key(a[0])===key(signed(1)))!,cue=items(items(first[3],'list')[5],'list')[0];
 const rows=original.map(v=>{const a=[...items(v,'list')];if(key(a[0])===key(signed(21)))a[0]=signed(22);const current=key(a[2])===key(CURRENT_SEM_SOURCE);
 if(!current&&!(key(a[2])===key(SOCIAL_SOURCE)&&key(a[0])===key(signed(2))))return list(a);
 const p=[...items(a[3],'list')],source=items(p[current?6:7],'list');
 if(!current){p[3]=list([false,true,false,false]);p[5]=list(mode==='companion'?[]:[cue]);}
 p[current?6:7]=channel((source[1] as {value:string}).value,items(source[2],'list').map(v=>{
  const r=items(v,'list'),group=uint(r[3]);if(group===0n)return v;
  const cf=group===1n?[list([text(CONTINUANT_FEATURES.find(x=>x.endsWith('person-form'))!),true,true])]:
   group===2n?[list([text(CONTINUANT_FEATURES.find(x=>x.endsWith('enclosure-form'))!),true,true]),list([text(CONTINUANT_FEATURES.find(x=>x.endsWith('person-form'))!),false,true])]:
   group===3n?[list([text(CONTINUANT_FEATURES.find(x=>x.endsWith('discrete-object-form'))!),true,true]),list([text(CONTINUANT_FEATURES.find(x=>x.endsWith('metallic-surface'))!),false,true])]:[];
  const ef=!current&&group===2n?EVENT_FEATURES.map(x=>list([text(x),true,true])):[];
  const cues=!current&&group===1n&&mode==='companion'?[cue]:[];
  if(mode==='denied'&&group===4n){cf.push(list([text(CONTINUANT_FEATURES[0]),false,false]));const c=items(cue,'list');cues.push(list([...c.slice(0,2),false,false]));}
  return list([...r,u(!current&&group>=2n?1:0),list([list([list(cf),list(ef)]),list(cues)])]);
 }));
 a[3]=list(p);return list(a);});
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
