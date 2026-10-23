import type {CanonicalValue} from '../substrate/canonicalEncoding';
import type {TimelineEvent} from './contracts';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactKey,readable} from './canonical';
import {scalar} from './nativeTimeline';
import {equalCanonicalText} from './canonicalTextEquality';
import {dispositionCanonicalFactorSources} from './dispositionCanonicalFactorSources';
import {dispositionProvenanceFromOwnedReads} from './dispositionProvenance';
/** Select only provenance operands; nested expression/decision payloads stay in paged sources. */
export function dispositionCanonicalProvenance(event:Pick<TimelineEvent,'id'|'instant'|'stage'|'phase'>,output:CanonicalValue,reads:CanonicalValue,law:string,seamVersion:string){
 if(!['Plastic','Leaky','Refold','StandingOnly','Neither','JointMax','JointAdd'].includes(law)||seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified provenance profile');
 const factors=dispositionCanonicalFactorSources(event,output,reads);
 if(!factors.emitted)return {version:'disposition-provenance/0.1',seamVersion,law,eventId:event.id,instant:event.instant,emitted:false as const};
 const operands=rec(items(output,'list')[0],1455n),rows=items(reads,'list').map(v=>rec(v,147n));
 const read=(root:string,type:bigint)=>{
  const matches=rows.filter(r=>scalar(f(rec(f(r,2n),140n),1n))===root);
  if(!matches.length)return undefined;
  if(matches.length!==1||f(matches[0],3n)!==true)throw Error('Provenance requires one exact present owned-state read');
  return {path:exactKey(f(matches[0],2n)),value:rec(f(matches[0],4n),type)};
 };
 const constitution=read('1457',1453n),journal=read('1436',1435n);
 if(!constitution||!journal)throw Error('Provenance requires one exact owned-state read');
 if(!equalCanonicalText(constitution.value,f(operands,2n))||!equalCanonicalText(journal.value,f(operands,7n)))throw Error('Provenance read/operand mismatch');
 const entries=items(f(journal.value,1n),'list');if(entries.length>96)throw Error('Provenance history bound');
 const projectedJournal={path:journal.path,value:{'Qualifications [1]':entries.map(v=>{
  const entry=rec(v,1434n),expression=rec(f(entry,2n),1433n);
  return {record:'IdentityQualification#1434/1','Occurrence [1]':readable(f(entry,1n)),'Expression [2]':{record:'IdentityExpression#1433/1','At [8]':scalar(f(expression,8n))},'Disposition [3]':scalar(f(entry,3n)),'Contribution [4]':readable(f(entry,4n))};
 })}};
 const projectedOperands=Object.fromEntries([[3n,'Plastic [3]'],[4n,'Standing [4]'],[5n,'Effective [5]'],[6n,'Feedback [6]']].map(([id,name])=>[name,readable(f(operands,id as bigint))]));
 return dispositionProvenanceFromOwnedReads(event,law,seamVersion,factors,projectedOperands,{path:constitution.path,value:readable(constitution.value)},projectedJournal,()=>{
  const plastic=read('1458',1454n);return plastic?{path:plastic.path,value:readable(plastic.value)}:undefined;
 });
}
