/** M65: same M43 observed history, current 44-slot composition. See committed card. */
import {list,text,unsigned as u,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {fixture as current} from '../assembledActionMemory.test';
import {source as historical,data as history,decode,items,key,enc,target,type Mode} from './assembledAffectMemory';
import {ACQUISITION_RULES,ACQUISITION_REGISTRY} from '../../assembled/model';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {changeDefinition} from './assembledCharacter';
import {sid} from '../../assembled/skill';
let cached:ReturnType<typeof current>|undefined;
export function fixture(law='UncontrolledGain',mode:Mode='main',graph=true,k=1){
 const b=structuredClone(cached??(cached=current())),slots=[...items(decode(b.s.registry),'list')];
 const old=items(decode(historical(law,graph,k,5).registry),'list');
 for(const i of [8,9,19,29])slots[i]=old[i];
 // Only the two compared tasks depend on a person; keep the other target admitted.
 const social=items(slots[19],'list');slots[19]=list([social[0],list(items(social[1],'list').map(v=>{const group=items(v,'list');return list([group[0],key(group[0])===key(target)?group[1]:list([])]);}))]);
 const mappings=items(items(slots[19],'list')[1],'list').flatMap(v=>items(items(v,'list')[1],'list'));
 if(mappings.length!==2)throw Error('M65 exactly two social task dependencies');
 const s=changeDefinition({...b.s,rulesVersion:ACQUISITION_RULES,registrySchemaVersion:ACQUISITION_REGISTRY,registry:enc(list(slots))},'definition/task-workspace',2n,u(5));
 const original=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list'));
 const names=['event/assembled-identity-context','event/assembled-self-context','event/assembled-values-context'];
 const contexts=names.map(n=>original.find(r=>key(r[2])===key(sid(1001,n)))!);
 if(contexts.some(r=>!r))throw Error('M65 missing current context bundle');
 const rows=items(decode(history(mode).orderedInputs),'list').map(v=>{
  const r=[...items(v,'list')],context=names.findIndex(n=>key(r[2])===key(sid(1001,n)));
  if(context>=0)return list([r[0],...contexts[context].slice(1)]);
  if(key(r[2])===key(SOCIAL_SOURCE)){
   const p=[...items(r[3],'list')];
   p.push(list([u(1),u(1)]),list([false,u(0),false,false,false,true,true]),list([false,u(0),true,u(0)]),list([list([false,false,false]),list([false,false,false]),list([false,false,false])]));
   r[3]=list(p);
  }
  return list(r);
 });
 return {s,d:{...b.d,runSeed:new Uint8Array(32),orderedInputs:enc(list(rows))}};
}
export {decode,items,key,enc,target,type Mode};
