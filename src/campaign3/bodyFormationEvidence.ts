/** body-formation-evidence-component/0.1-candidate. Symbolic acquisition identity, not a public codec. */
import {cloneCanonicalValue} from '../substrate/canonicalEncoding';
import {consumeContextualBody,type ContextualBodyView} from './contextualBodySelection';
export const BODY_FORMATION_EVIDENCE_VERSION='body-formation-evidence-component/0.1-candidate';
/** Only the actual selected capability can reach this producer. Zero groups allocate nothing. */
export function produceBodyFormationEvidence(view:ContextualBodyView,allocate:()=>bigint){
 const selected=consumeContextualBody(view);
 if(!selected.groups.length)return {kind:'NoFormation' as const,selectionId:selected.selectionId};
 const acquisitionId=allocate();if(typeof acquisitionId!=='bigint'||acquisitionId<0n)throw Error('BODY_FORMATION_ALLOCATION');
 return {kind:'Formation' as const,evidence:{acquisitionId,observer:cloneCanonicalValue(selected.observer),at:selected.at,sourceSelectionId:selected.selectionId,transformationVersion:BODY_FORMATION_EVIDENCE_VERSION,content:{children:selected.groups.map(g=>({signal:g.signal,views:g.samples.map(sample=>({sample:cloneCanonicalValue(sample),context:structuredClone(selected.context)}))}))}}};
}
