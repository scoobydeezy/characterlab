/** assembled-character-interaction/0.1: restricted, detached character operands.
 * Conditional forecast-distance appraisal; no physiology/registry/state capability. */
import {list,map,set,text,unsigned as u,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {deficitPressure,exact,atom} from '../campaign3/embodiedMath';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
export const JOINT_APPRAISAL='assembled-body-appraisal/0.1';
export function jointAppraisal(taskAppraisal:CanonicalValue,sample:CanonicalValue|undefined,experience:CanonicalValue|undefined,threshold:Q){
 const appraisal=rec(taskAppraisal,384n),present=sample!==undefined&&typeof sample!=='boolean'&&sample.kind==='record'&&sample.schema.typeId===461n;
 if(present&&!experience)throw Error('joint appraisal requires actual settled experience');
 const vulnerability=present?deficitPressure(exact(f(rec(f(rec(sample!,461n),5n),462n),2n)),threshold):undefined;
 const rows=items(f(appraisal,3n),'list').map(value=>{const assessment=rec(value,383n),distance=rec(f(assessment,2n),382n),tag=uint(f(distance,1n)),severity=tag===1n?undefined:tag===3n?Q.of(0n):exact(f(distance,2n)).divide(Q.of(10n));
  const projected=compareAffectFactors({likelihood:Q.of(1n),severity,vulnerability,control:Q.of(0n)},'SplitExposure');
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
 const report=items(joint,'list'),sample=report[2];if(typeof sample==='boolean'||sample.kind!=='record'||sample.schema.typeId!==461n)return raw;
 const observation=r(399,[u(1),r(237,[u(1),f(sample,1n)])]),source=rec(raw,403n);
 const signals=items(f(source,3n),'set').map(value=>{const signal=rec(value,402n),signalKey=rec(f(signal,1n),401n);if(uint(f(signalKey,3n))!==2n)return signal;
  const basis=f(rec(f(signal,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('joint signal evidence map');
  const merged=new Map(basis.entries.map(([k,v])=>[key(k),[k,v] as const]));merged.set(key(observation),[observation,atom(Q.of(1n))]);
  return r(402,[f(signal,1n),f(signal,2n),r(400,[map([...merged.values()])])]);
 });
 return record(source.schema,new Map([...source.fields].map(([n,v])=>[n,n===3n?set(signals):v])));
}
