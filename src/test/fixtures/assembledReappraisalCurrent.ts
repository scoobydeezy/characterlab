/** M187 fdc639b9: M72 perceived trials in the current full composition. */
import {fixture as current} from './assembledAffectMemoryCurrent';
import {fixture as original,type Mode,taskA,taskB} from './assembledThreatReinterpretation';
import {changeDefinition} from './assembledCharacter';
import {decode,items,key,enc,list,text,signed,u,q,type CanonicalValue} from './assembledFamiliarity';
import {dataRecord as metadataRecord,dataField as f} from '../../campaign2/canonicalData';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {PerceptualFeatureId as CF} from '../../semanticBinding/perceptualClassification';
import {BODY_DELIVERY} from '../../assembled/body';
import {REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {PRACTICE_SETTING,SKILL} from '../../assembled/skill';
export function fixture(mode:Mode='complete'){
 const b=current(),old=original(mode),slots=[...items(decode(b.s.registry),'list')],prior=items(decode(old.s.registry),'list');
 if(slots.length!==55||prior.length!==44)throw Error('M187 explicit current/prior schema');
 slots[6]=list([text('assembled-body/0.2'),...items(prior[6],'list').slice(1),signed(0)]);
 slots[19]=prior[19];slots[28]=prior[28];
 let s={...b.s,registry:enc(list(slots))};
 // Governed physical task geometry only; current reason/arbitration policy stays intact.
 for(const v of items(prior[0],'set')){
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)continue;
  const d=metadataRecord(v,171n),id=f(d,1n);if(typeof id==='boolean'||id.kind!=='typedIdentifier'||typeof id.payload==='boolean'||id.payload.kind!=='text'||!['definition/task-a','definition/task-b'].includes(id.payload.value))continue;
  const body=f(d,4n);if(typeof body==='boolean'||body.kind!=='record')throw Error('M187 task definition');
  for(const n of[3n,4n,5n,6n])s=changeDefinition(s,id.payload.value,n,f(body,n));
 }
 s=changeDefinition(changeDefinition(s,'definition/protocol-execution',1n,true),'definition/protocol-observation',4n,false);
 const rows=items(decode(old.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];
  if(key(a[2])===key(SOCIAL_SOURCE)){
   const p=[...items(a[3],'list')];if(typeof p[3]!=='boolean')throw Error('M187 expected original continuity');p[3]=list([p[3],false,false,false]);
   const form=items(p[4],'list');p[4]=list([list(form.map(value=>list([text(CF.ObservedPersonForm),value,true]))),list([])]);
   p[5]=list(items(p[5],'list').map(v=>list([u(1),...items(v,'list'),true])));
   const role=items(p[7],'list');if(role.length!==2)throw Error('M187 expected original roles');p[7]=list([...role,list([])]);a[3]=list(p);
  }
  if(key(a[2])===key(BODY_DELIVERY)){const p=items(a[3],'list');if(p.length!==2)throw Error('M187 original delivery');a[3]=list([...p,false]);}
  if(key(a[2])===key(PRACTICE_SETTING))a[3]=list([text(SKILL),u(4),q(0,1),q(0,1),true,false]);
  if(key(a[0])===key(signed(11))&&key(a[2])===key(REAPPRAISAL_SOURCE)){const p=[...items(a[3],'list')];p[8]=true;a[3]=list(p);}
  return list(a);
 });
 return {s,d:{...b.d,orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32)}};
}
export {taskA,taskB,decode,items,key,enc};
export type {Mode};
