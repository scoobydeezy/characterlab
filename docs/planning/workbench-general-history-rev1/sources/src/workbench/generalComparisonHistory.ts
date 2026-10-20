import type {compareGeneralSnapshots} from './generalComparison';
export type GeneralComparisonReport=ReturnType<typeof compareGeneralSnapshots>;
/** Diagnostic history of qualified reports; never save authentication or a causal verdict. */
export function generalComparisonHistory(input:readonly GeneralComparisonReport[]){
 if(input.length>202)throw Error('General comparison history limit exceeded');
 const rows=new Map<number,GeneralComparisonReport>();let identity:string|undefined;
 for(const r of input){
  if(r.control.prefix!==r.candidate.prefix||!Number.isInteger(r.control.prefix)||r.control.prefix<0||r.control.prefix>100)throw Error('General comparison requires paired prefixes');
  const key=JSON.stringify([r.version,r.spec,r.source,r.seed]);
  if(identity!==undefined&&key!==identity)throw Error('General comparison mixes declarations');identity=key;
  const old=rows.get(r.control.prefix);if(old&&JSON.stringify(old)!==JSON.stringify(r))throw Error('General comparison conflicting prefix');
  rows.set(r.control.prefix,r);
 }
 const ordered=[...rows.values()].sort((a,b)=>a.control.prefix-b.control.prefix),latest=ordered.at(-1)?.control.prefix;
 const missing=latest===undefined?[]:Array.from({length:latest+1},(_,i)=>i).filter(i=>!rows.has(i));
 const first=(predicate:(r:GeneralComparisonReport)=>boolean)=>{
  const found=ordered.find(r=>r.status==='ALIGNED_COMMITTED_INSTANT'&&predicate(r));if(!found)return null;
  return {prefix:found.control.prefix,clock:found.control.clock,earliestProven:missing.every(p=>p>found.control.prefix)&&ordered.filter(r=>r.control.prefix<found.control.prefix).every(r=>r.status==='ALIGNED_COMMITTED_INSTANT')};
 };
 return {version:'general-comparison-history/0.1',observedPrefixes:ordered.map(r=>r.control.prefix),missingPrefixes:missing,
  unqualifiedPrefixes:ordered.filter(r=>r.status!=='ALIGNED_COMMITTED_INSTANT').map(r=>r.control.prefix),
  firstStateDifference:first(r=>!r.identity.stateEqual),
  firstOutputDifference:first(r=>r.status==='ALIGNED_COMMITTED_INSTANT'&&r.events.some(e=>e.outputsEqual===false)),
  scope:'First retained exact state difference and unique-stage output difference are separate diagnostics. Missing or ambiguous event slots are not output inequality. Earliest is proven only with every earlier paired prefix present and qualified. Neither difference establishes psychological meaning or causal necessity.'};
}
export function retainGeneralComparison(previous:readonly GeneralComparisonReport[],next:GeneralComparisonReport,mode:'append'|'reset'|'restore'='append'){
 const base=mode==='reset'||(mode==='restore'&&previous[0]?.spec.id!==next.spec.id)?[]:previous;
 generalComparisonHistory([...base,next]);
 const rows=new Map(base.filter(r=>mode!=='restore'||r.control.prefix<=next.control.prefix).map(r=>[r.control.prefix,r]));
 rows.set(next.control.prefix,next);return structuredClone([...rows.values()].sort((a,b)=>a.control.prefix-b.control.prefix));
}
