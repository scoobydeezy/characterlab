import type {compareDisposition} from './dispositionComparison';
export type DispositionComparisonReport=Awaited<ReturnType<typeof compareDisposition>>;
/** Retained report history is diagnostic evidence, never authoritative state. */
export function dispositionDivergenceHistory(reports:readonly DispositionComparisonReport[]){
 if(reports.length>256)throw Error('DISPOSITION retained comparison report limit exceeded; no partial history inferred');
 const rows=new Map<number,DispositionComparisonReport>();let lineage:string|undefined;
 for(const report of reports){
  if(report.version!=='disposition-contrast-inspection/0.1'||!report.aligned||report.a.prefix!==report.b.prefix||!Number.isInteger(report.a.prefix)||report.a.prefix<0||report.a.prefix>18||report.a.clock!==String(report.a.prefix)||report.b.clock!==String(report.b.prefix))throw Error('DISPOSITION aligned committed comparison required');
  if(report.stateEqual!==(report.a.stateHash===report.b.stateHash)||report.mechanismProjectionEqual!==(report.a.projectionHash===report.b.projectionHash)||report.saveEqual!==(report.a.saveHash===report.b.saveHash))throw Error('DISPOSITION comparison equality commitment mismatch');
  const identity=JSON.stringify({contrast:report.contrast,a:[report.a.program,report.a.modelHash,report.a.runHash],b:[report.b.program,report.b.modelHash,report.b.runHash],inputHashes:report.inputHashes,runSeed:report.runSeed});
  if(lineage!==undefined&&identity!==lineage)throw Error('DISPOSITION comparison history mixes branch identities');lineage=identity;
  const prior=rows.get(report.a.prefix);if(prior&&JSON.stringify(prior)!==JSON.stringify(report))throw Error('DISPOSITION conflicting report at the same prefix');rows.set(report.a.prefix,structuredClone(report));
 }
 const ordered=[...rows.values()].sort((a,b)=>a.a.prefix-b.a.prefix),latest=ordered.at(-1)?.a.prefix??null,observed=ordered.map(r=>r.a.prefix),missing=latest===null?[]:Array.from({length:latest+1},(_,i)=>i).filter(i=>!rows.has(i));
 const first=(key:'stateEqual'|'mechanismProjectionEqual')=>{
  const report=ordered.find(r=>r[key]===false);if(!report)return null;
  return {prefix:report.a.prefix,earliestProven:missing.every(p=>p>report.a.prefix),a:{...report.a},b:{...report.b}};
 };
 return {version:'disposition-divergence-history/0.1',comparison:ordered[0]?.contrast.id??null,observedPrefixes:observed,missingPrefixes:missing,latestPrefix:latest,completeFromInitial:latest!==null&&missing.length===0,firstStateDifference:first('stateEqual'),firstMechanismProjectionDifference:first('mechanismProjectionEqual'),
  checkpoints:ordered.map(r=>({prefix:r.a.prefix,stateEqual:r.stateEqual,mechanismProjectionEqual:r.mechanismProjectionEqual,aSaveHash:r.a.saveHash,bSaveHash:r.b.saveHash})),
  scope:'First retained differences in exact state and mechanism projection are distinct. Earliest is proven only when every earlier committed prefix is present. Missing observations are not equality. Projection difference does not establish different character knowledge, chosen action, psychological significance or causal necessity. Reports are trusted qualified-adapter diagnostics, not standalone save authentication.'};
}
