import {decodeReceiving} from '../campaign3/receivingCodecs';
import {dataItems as items,dataRecord as rec,dataField as field,dataUnsigned as uint} from '../campaign2/canonicalData';
import {exactKey,exactText,fromHex} from './canonical';
import {inspectBioReasons} from './bioReasonDiagnostics';

/** Exact source-ID join to original earlier component rows, never a current archive. */
export function inspectBioReasonHistory(records:readonly string[],selected:number){
 if(records.length>19||!Number.isInteger(selected)||selected<1||selected>records.length)throw Error('BIO history selection outside retained calendar');
 let bytes=0;
 const rows=records.map((hex,index)=>{
  bytes+=hex.length;if(hex.length>16_000_000||bytes>64_000_000)throw Error('BIO history byte limit');
  const row=items(decodeReceiving(fromHex(hex)),'list');
  if(row.length!==14||uint(row[0])!==BigInt(index+1))throw Error('BIO history record order mismatch');
  return row;
 });
 const qualifications=new Map<string,{ordinal:number;qualification:string;expression:string;eligibility:string;evidence:string|null}>();
 rows.forEach((row,index)=>{
  const qualification=rec(row[8],429n),id=exactKey(field(qualification,1n)),result=rec(field(qualification,3n),430n),tag=uint(field(result,1n));
  if(qualifications.has(id))throw Error('BIO duplicate qualification identity');
  if(exactKey(field(qualification,2n))!==exactKey(row[7]))throw Error('BIO qualification/expression lineage mismatch');
  qualifications.set(id,{ordinal:index+1,qualification:exactKey(qualification),expression:exactKey(row[7]),eligibility:String(tag),evidence:tag===1n?exactText(field(result,3n)):null});
 });
 const reason=inspectBioReasons(records[selected-1]),raw=rec(rows[selected-1][3],403n);
 const sources=items(field(raw,3n),'set').map(value=>{
  const signal=rec(value,402n),sourceKey=exactKey(field(signal,1n)),basis=field(rec(field(signal,3n),400n),1n);
  if(typeof basis==='boolean'||basis.kind!=='map'||basis.entries.length>64)throw Error('BIO evidence basis shape/limit');
  return {sourceKey,atoms:basis.entries.map(([value,weight])=>{
   const atom=rec(value,399n),variant=uint(field(atom,1n));
   const base={atom:exactKey(atom),identity:exactText(atom),weight:exactText(weight)};
   if(variant!==2n)return {...base,status:'other-recorded-atom' as const};
   const qualificationId=exactKey(field(atom,3n)),candidate=qualifications.get(qualificationId);
   // Current/future rows cannot become evaluation-time provenance.
   if(!candidate||candidate.ordinal>=selected)return {...base,qualificationId,status:'no-earlier-recorded-qualification' as const};
   return {...base,qualificationId,status:'earlier-recorded-qualification' as const,source:{...candidate}};
  })};
 });
 return {version:'bio-reason-history/0.1',seamVersion:reason.seamVersion,selected,reasonIdentity:reason.reasonIdentity,sources,
  scope:'Recorded evidence-atom identity joins to original earlier component qualifications and expressions. Basis weight is separate from qualification evidence. A match is recorded provenance, not proof of independent evidence, causal necessity or character self-knowledge. Later/current rows and rewritten current archives cannot supply earlier provenance; unavailable sources remain explicit.'};
}
