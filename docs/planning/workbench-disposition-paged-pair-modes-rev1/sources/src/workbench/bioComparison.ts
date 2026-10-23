import identities from '../../docs/planning/BIO_IDENTITY_PLAN_REV1.json';
import plan from '../../docs/planning/BIO_COMPARISON_PLAN_REV3.json';
import type {BioSnapshot} from './bioAdapter';
import {digest,fromHex} from './canonical';
const laws=identities.models.map(m=>m.law);
export const BIO_COMPARISONS=[
 ...laws.map(law=>({id:`seed:${law}`,control:`${law}/${plan.first}`,candidate:`${law}/${plan.second}`,kind:'early-seed',changed:'Early decision seed only; steps1–4. Original common probes, contrary routing and non-decision seed retained.'})),
 ...laws.filter(l=>l!=='Earned').flatMap(law=>[plan.first,plan.second].map(seed=>({id:`law:${law}:${seed}`,control:`Earned/${seed}`,candidate:`${law}/${seed}`,kind:'model-law',changed:`Earned → ${law}; same early seed and original schedule. Model identity differs.`}))),
 ...[plan.first,plan.second].map(seed=>({id:`display:${seed}`,control:`DisplayOnly/${seed}`,candidate:`HistoryOnly/${seed}`,kind:'model-law',changed:'DisplayOnly → HistoryOnly; preserve separate display and decision comparisons.'})),
 {id:'repeat',control:`Earned/${plan.first}`,candidate:'coupled-repeat',kind:'repeat',changed:'Independent repetition with identical original canonical run identity.'},
];
const equal=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
export async function compareBioSnapshots(id:string,a:BioSnapshot,b:BioSnapshot){
 a=structuredClone(a);b=structuredClone(b);
 const spec=BIO_COMPARISONS.find(s=>s.id===id);if(!spec)throw Error('Unknown BIO comparison');
 for(const [s,name]of [[a,spec.control],[b,spec.candidate]] as const){
  const expected=identities.runs.find(r=>r.name===name),model=identities.models.find(m=>m.law===expected?.law);
  if(!expected||!model||s.name!==name||s.law!==expected.law||s.boundary!=='composed-component'||s.seamVersion!=='bio-coupled-comparison/0.2-candidate'||s.modelHash!==await digest(fromHex(model.modelIdentity))||s.runHash!==await digest(fromHex(expected.runIdentity)))throw Error('BIO comparison identity mismatch');
  if(!equal(s.seedRouting,{early:expected.earlySeed,probe:255,nondecision:254,contrary:plan.contrarySeeds}))throw Error('BIO comparison seed routing mismatch');
  if(s.records.length!==s.prefix||s.records.some((r,i)=>r.ordinal!==i+1||r.summary.at!==String(i+1)))throw Error('BIO component record alignment mismatch');
 }
 const base={version:'bio-comparison/0.1',spec,alignment:'Original component step ordinal and canonical record identity; not public event IDs.',control:{name:a.name,prefix:a.prefix,modelHash:a.modelHash,runHash:a.runHash,saveHash:a.saveHash},candidate:{name:b.name,prefix:b.prefix,modelHash:b.modelHash,runHash:b.runHash,saveHash:b.saveHash},identity:{modelEqual:a.modelHash===b.modelHash,runEqual:a.runHash===b.runHash,stateEqual:a.stateHash===b.stateHash,saveEqual:a.saveHash===b.saveHash}};
 if(a.prefix!==b.prefix)return {...base,status:'UNALIGNED_PREFIXES' as const,scope:'Different component horizons; no record or aggregate semantic equality inferred.'};
 const records=a.records.map((left,i)=>{
  const right=b.records[i],x=left.summary,y=right.summary;
  return {ordinal:left.ordinal,recordEqual:left.canonicalHex===right.canonicalHex,choice:{control:x.chosen,candidate:y.chosen,equal:x.chosen===y.chosen},probabilities:{control:x.probabilities,candidate:y.probabilities,equal:equal(x.probabilities,y.probabilities)},modifiers:{control:x.modifiers,candidate:y.modifiers,equal:equal(x.modifiers,y.modifiers)},strength:{control:x.strength,candidate:y.strength,equal:x.strength===y.strength},authorship:{control:x.authorship,candidate:y.authorship,equal:x.authorship===y.authorship},historyEqual:x.history===y.history,archiveEqual:x.archive===y.archive,expressionEqual:x.expression===y.expression,displayEqual:x.display===y.display,contextEqual:x.context===y.context,rawEqual:x.raw===y.raw,reasonsEqual:x.reasons===y.reasons,rng:{controlSeed:x.seed,candidateSeed:y.seed,addressKeysEqual:equal(x.addresses,y.addresses),controlAddressKeys:x.addresses,candidateAddressKeys:y.addresses,drawRecordsEqual:equal(x.draws,y.draws),controlDraws:x.draws,candidateDraws:y.draws,nondecisionEqual:x.nondecision===y.nondecision}};
 });
 return {...base,status:'ALIGNED_COMPONENT_PREFIX' as const,records,currentHistoryEqual:a.history===b.history,currentArchiveEqual:a.archive===b.archive,scope:'Diagnostic comparison of the declared finite component executions. Actual address lists, draw records and non-decision transcripts are compared separately; common seeds do not imply identical decisions or require a draw in Auto mode. Earlier expressions remain separate from current strength and display. Equality here does not authorize reduction, general biography claims or Campaign4 entry.'};
}
