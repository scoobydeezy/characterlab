import * as f from '../test/fixtures/phenSem001';
import {EventRoleId} from '../semanticBinding/eventBindings';
import {eventBindingValue,preRecognitionSemanticExperienceValue,perceptualClassificationEvidenceValue,causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {list,canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {digest,exactKey,exactText} from './canonical';

export const SEM_CONTROL_IDS=['darius-preserved','darius-hidden-swap','darius-coarsened','glen-canonical','glen-hidden-swap','mina-multiple-roles','mina-repeated-role'] as const;
export type SemControlId=typeof SEM_CONTROL_IDS[number];
export const SEM_CONTROL_PAIRS=[
 {id:'hidden-causal',a:'darius-preserved',b:'darius-hidden-swap',label:'Hidden Actor/Companion swap; fixed permitted evidence',source:'src/test/phenSem001Causal.test.ts',vector:'CV-SEM-009'},
 {id:'permitted-role',a:'darius-preserved',b:'darius-coarsened',label:'Preserved Actor versus perceived Participant',source:'src/test/phenSem001Causal.test.ts',vector:'CV-SEM-009'},
 {id:'hidden-classification',a:'glen-canonical',b:'glen-hidden-swap',label:'Hidden Actor/Companion swap; fixed classification',source:'src/test/phenSem001Classification.test.ts',vector:'CV-SEM-015'},
] as const;
const contract='semantic-binding/0.1-candidate';
async function evidence(value:CanonicalValue){const encoded=canonicalEncode(value),decoded=decodeSemanticValue(encoded);return {sha256:await digest(encoded),canonicalHex:exactKey(decoded),exact:exactText(decoded)};}
/** Original component recipes, with their own allocator and experience1. These
 * never install state into the integrated scheduler or claim native RunIdentity. */
export async function runSemControl(id:SemControlId){
 if(!(SEM_CONTROL_IDS as readonly string[]).includes(id))throw Error('Unknown SEM component control');
 const darius=id.startsWith('darius-'),glen=id.startsWith('glen-'),swapped=id.endsWith('hidden-swap');
 const observer=darius?f.DARIUS:glen?f.GLEN:f.MINA;
 const requests=swapped?f.SWAPPED_BINDING_REQUESTS:id==='mina-multiple-roles'?f.MULTI_ROLE_BINDING_REQUESTS:id==='mina-repeated-role'?f.REPEATED_ROLE_BINDING_REQUESTS:f.CANONICAL_BINDING_REQUESTS;
 const affordances:readonly f.ObserverRoleAffordance[]|undefined=darius?[
  {eventRoleId:EventRoleId.Actor,permitted:id==='darius-coarsened'?{kind:'coarsen-to-participant'}:{kind:'preserve'},trackLabel:'darius/actor'},
  {eventRoleId:EventRoleId.Location,permitted:{kind:'preserve'},trackLabel:'darius/place'},
 ]:id==='mina-multiple-roles'?f.MULTI_ROLE_AFFORDANCES:id==='mina-repeated-role'?f.REPEATED_ROLE_AFFORDANCES:undefined;
 const truth=f.truthBindings(requests),projection=f.projectObserver({observerId:observer,truth,allocator:f.createRunAllocator(),experienceId:1n,affordances});
 const before=exactKey(preRecognitionSemanticExperienceValue(projection.experience));
 const causal=darius?f.deriveObserverCausalRoles(projection,projection.tracksByLabel.get('darius/actor')!,9000n):null;
 if(exactKey(preRecognitionSemanticExperienceValue(projection.experience))!==before)throw Error('SEM consumer mutated experience');
 return {version:'sem-component-controls/0.1',id,contract,source:darius?'src/test/phenSem001Causal.test.ts':glen?'src/test/phenSem001Classification.test.ts':'src/test/phenSem001Binding.test.ts',vector:darius?'CV-SEM-009':glen?'CV-SEM-015':'CV-SEM-002',boundary:'component experiment; no scheduler, native run identity, checkpoint or intervention',observer,experience:'1',evidenceTime:'10',allocatorStart:'5000',causalAllocation:darius?'9000':null,
  truth:await evidence(list(truth.map(eventBindingValue))),experienceEvidence:await evidence(preRecognitionSemanticExperienceValue(projection.experience)),classifications:await evidence(list(projection.classifications.map(perceptualClassificationEvidenceValue))),causal:causal?await evidence(list(causal.map(causalRoleEvidenceValue))):null,
  bindings:projection.perceivedBindings.map(b=>({occurrence:String(b.perceivedBindingId),track:String(b.perceptualReferentId.observerTrackSequence),event:String(b.perceptualEventReferentId.observerEventSequence),role:b.eventRoleEvidence.kind==='exact'?b.eventRoleEvidence.eventRoleId:'unresolved'})),
  causalRoles:causal?.map(c=>c.causalRoleId)??null,
  scope:'Researcher comparison only. Exact original component recipes; separate fresh allocators retain original ordinals. No recognition, whole-instant abort, measurement, general SEM or scheduler participation claim.'};
}
export async function compareSemControl(id:string){
 const pair=SEM_CONTROL_PAIRS.find(p=>p.id===id);if(!pair)throw Error('Unknown SEM control pair');
 const a=await runSemControl(pair.a),b=await runSemControl(pair.b);
 const equal=(key:'truth'|'experienceEvidence'|'classifications'|'causal')=>a[key]&&b[key]?a[key]!.canonicalHex===b[key]!.canonicalHex:null;
 return {version:'sem-component-comparison/0.1',pair,a,b,equality:{truth:equal('truth'),experience:equal('experienceEvidence'),classifications:equal('classifications'),causal:equal('causal')},scope:'Equality is exact within the original component recipes. Null means the consumer was not invoked; it does not mean equal or absent. This report is separate from integrated-run replay.'};
}
