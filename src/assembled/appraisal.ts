/** assembled-character-interaction/0.1: restricted, detached character operands.
 * Conditional forecast-distance appraisal; no physiology/registry/state capability. */
import {list,map,set,text,unsigned as u,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {deficitPressure,exact,atom} from '../campaign3/embodiedMath';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText as txt} from '../campaign2/canonicalData';
import type {BodyEvidence} from './body';
import {WORKSPACE} from './workspace';
import {EPISODE} from './memory';
export const MEMORY_CONTEXT='assembled-memory-context/0.1';
export const JOINT_APPRAISAL='assembled-body-appraisal/0.1';
export function jointAppraisal(taskAppraisal:CanonicalValue,sample:CanonicalValue|undefined,experience:CanonicalValue|undefined,threshold:Q,likelihoods?:ReadonlyMap<string,Q|undefined>){
 const appraisal=rec(taskAppraisal,384n),present=sample!==undefined&&typeof sample!=='boolean'&&sample.kind==='record'&&sample.schema.typeId===461n;
 if(present&&!experience)throw Error('joint appraisal requires actual settled experience');
 const vulnerability=present?deficitPressure(exact(f(rec(f(rec(sample!,461n),5n),462n),2n)),threshold):undefined;
 const rows=items(f(appraisal,3n),'list').map(value=>{const assessment=rec(value,383n),distance=rec(f(assessment,2n),382n),tag=uint(f(distance,1n)),severity=tag===1n?undefined:tag===3n?Q.of(0n):exact(f(distance,2n)).divide(Q.of(10n));
  const projected=compareAffectFactors({likelihood:likelihoods?.has(key(f(assessment,1n)))?likelihoods.get(key(f(assessment,1n))):Q.of(1n),severity,vulnerability,control:Q.of(0n)},'SplitExposure');
  return projected.status==='Unavailable'?list([f(assessment,1n),text('Unavailable')]):list([f(assessment,1n),atom(severity!),atom(vulnerability!),...projected.coordinates.map(atom)]);
 });
 return list([text(JOINT_APPRAISAL),taskAppraisal,sample??list([]),experience??list([]),list(rows)]);
}
export function jointConcern(occurrence:CanonicalValue,taskAppraisal:CanonicalValue,joint:CanonicalValue,definition:CanonicalValue){
 const report=items(joint,'list');if(key(report[1])!==key(taskAppraisal))throw Error('joint concern appraisal association');
 const d=rec(definition,385n),gain=exact(f(d,1n)),rows=items(report[4],'list');
 return r(388,[occurrence,taskAppraisal,list(rows.map(value=>{const row=items(value,'list');return r(387,[row[0],row.length!==5||f(d,2n)!==true?r(386,[u(1)]):r(386,[u(2),atom(gain.multiply(exact(row[4])))])]);}))]);
}
export function jointSignalSupport(raw:CanonicalValue,joint:CanonicalValue){
 const report=items(joint,'list'),sample=report[2],present=typeof sample!=='boolean'&&sample.kind==='record'&&sample.schema.typeId===461n,social=report[6]?items(report[6],'list'):undefined;
 if(!present&&!social)return raw;
 const source=rec(raw,403n),signals=items(f(source,3n),'set').map(value=>{const signal=rec(value,402n),signalKey=rec(f(signal,1n),401n);if(uint(f(signalKey,3n))!==2n)return signal;
  const basis=f(rec(f(signal,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('joint signal evidence map');
  const merged=new Map(basis.entries.map(([k,v])=>[key(k),[k,v] as const])),add=(occ:CanonicalValue)=>{const observation=r(399,[u(1),r(237,[u(1),occ])]);merged.set(key(observation),[observation,atom(Q.of(1n))]);};
  if(present)add(f(rec(sample,461n),1n));
  const people=social?(txt(social[0])==='assembled-social-people/0.1/appraisal'?social.slice(1).map(v=>items(v,'list')):[social]):[];
  for(const person of people)if(items(person[5],'list').some(v=>key(items(v,'list')[0])===key(f(signalKey,2n))))for(const o of items(person[3],'list'))add(items(o,'list')[0]);
  return r(402,[f(signal,1n),f(signal,2n),r(400,[map([...merged.values()])])]);
 });return record(source.schema,new Map([...source.fields].map(([n,v])=>[n,n===3n?set(signals):v])));
}

/** Earlier context is an explicitly qualified appraisal, never a current observation. */
export function contextAppraisal(task:CanonicalValue,workspace:CanonicalValue,at:bigint,current:BodyEvidence|undefined,threshold:Q,likelihoods?:ReadonlyMap<string,Q|undefined>){
 const w=items(workspace,'list'),t=w[1];
 if(w.length!==5||txt(w[0])!==WORKSPACE||typeof t==='boolean'||t.kind!=='signed'||t.value!==at||key(w[3])!==key(f(rec(task,384n),2n)))throw Error('memory context workspace association');
 let sample=current?.sample,experience=current?.experience,selected:CanonicalValue=list([]),mode=sample?'Current':'Unavailable';
 if(current){if(current.settledEvent.dueAt!==at||current.settledEvent.phase!==20n)throw Error('memory context current evidence time');}
 else {const first=items(w[4],'list')[0];if(first){
  const row=items(first,'list'),episode=items(row[1],'list'),time=episode[5];
  if(row.length!==3||episode.length!==6||txt(episode[0])!==EPISODE||key(row[0])!==key(episode[1])||typeof time==='boolean'||time.kind!=='signed'||time.value>=at)throw Error('memory context episode association');
  sample=episode[2];experience=episode[3];selected=first;mode='RecalledContext';
 }}
 return list([...items(jointAppraisal(task,sample,experience,threshold,likelihoods),'list'),list([text(MEMORY_CONTEXT),text(mode),selected])]);
}
