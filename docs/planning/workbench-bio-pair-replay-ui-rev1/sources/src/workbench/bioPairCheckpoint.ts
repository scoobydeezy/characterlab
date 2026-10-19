import type {BioCheckpoint,BioSnapshot} from './bioAdapter';
import {BIO_COMPARISONS,compareBioSnapshots} from './bioComparison';
export interface BioPairCheckpoint {version:'bio-pair-checkpoint/0.1';comparisonId:string;control:BioCheckpoint;candidate:BioCheckpoint;}
export interface BioPairClient {snapshot():BioSnapshot;checkpoint():BioCheckpoint|Promise<BioCheckpoint>;dispose():void;}
function declaration(checkpoint:BioPairCheckpoint){
 if(!checkpoint||checkpoint.version!=='bio-pair-checkpoint/0.1')throw Error('BIO pair checkpoint version mismatch');
 const spec=BIO_COMPARISONS.find(s=>s.id===checkpoint.comparisonId);
 if(!spec||checkpoint.control?.name!==spec.control||checkpoint.candidate?.name!==spec.candidate)throw Error('BIO pair checkpoint declaration mismatch');
 if(checkpoint.control.prefix!==checkpoint.candidate.prefix)throw Error('BIO pair checkpoint requires aligned prefixes');
 return spec;
}
export async function captureBioPair(comparisonId:string,pair:readonly [BioPairClient,BioPairClient]):Promise<BioPairCheckpoint>{
 const before=pair.map(c=>c.snapshot());
 const report=await compareBioSnapshots(comparisonId,before[0],before[1]);
 if(report.status!=='ALIGNED_COMPONENT_PREFIX')throw Error('BIO pair capture requires aligned prefixes');
 const checkpoint:BioPairCheckpoint={version:'bio-pair-checkpoint/0.1',comparisonId,control:await pair[0].checkpoint(),candidate:await pair[1].checkpoint()};
 declaration(checkpoint);
 for(const [index,save]of [checkpoint.control,checkpoint.candidate].entries()){
  const after=pair[index].snapshot();
  for(const key of ['prefix','modelHash','runHash','saveHash'] as const)if(save[key]!==before[index][key]||after[key]!==before[index][key])throw Error('BIO pair changed during capture');
 }
 return structuredClone(checkpoint);
}
/** Construct privately; the caller replaces the live pair only after both authenticate. */
export async function restoreBioPair<T extends BioPairClient>(input:BioPairCheckpoint,restore:(checkpoint:BioCheckpoint)=>Promise<T>){
 const checkpoint=structuredClone(input);declaration(checkpoint);const fresh:T[]=[];
 try{
  fresh.push(await restore(checkpoint.control));fresh.push(await restore(checkpoint.candidate));
  for(const [index,save]of [checkpoint.control,checkpoint.candidate].entries()){
   const snapshot=fresh[index].snapshot();
   for(const key of ['prefix','modelHash','runHash','saveHash'] as const)if(snapshot[key]!==save[key])throw Error('BIO pair restored identity mismatch');
  }
  const report=await compareBioSnapshots(checkpoint.comparisonId,fresh[0].snapshot(),fresh[1].snapshot());
  if(report.status!=='ALIGNED_COMPONENT_PREFIX')throw Error('BIO restored pair is not aligned');
  return {pair:[fresh[0],fresh[1]] as [T,T],report,comparisonId:checkpoint.comparisonId};
 }catch(error){fresh.forEach(c=>c.dispose());throw error;}
}
