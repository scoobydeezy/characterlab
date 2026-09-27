import {describe,it,expect} from 'vitest';
import {typedIdentifier,text,canonicalEncode} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {EventRoleId} from '../semanticBinding/eventBindings';
import {causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {createPositionSceneSource} from '../campaign3/positionSceneSource';
import {observePositionSceneOpportunity} from '../campaign3/positionSceneOpportunity';
import {createTrialPanelPerception} from '../campaign3/trialPanelPerception';
import {createTenSweepMarkerTransactionManager} from '../campaign3/transactionalMarkerTracking';
import {deriveGeneralSourceRoles as derive} from '../campaign3/generalSourceRoles';
function experience(unresolved=false){const source=createPositionSceneSource([{at:1n,items:[EventRoleId.Actor,EventRoleId.Target,EventRoleId.Participant].map((role,i)=>({marker:semanticReferentFromAuthoredContent(governedContentDefinitionId('object/'+i)),role,x:BigInt(i),y:0n,glyph:BigInt(i),visible:true,permitted:true,roleMode:unresolved?'Unresolved' as const:'Preserve' as const}))}]);let n=0n;return observePositionSceneOpportunity(source,createTenSweepMarkerTransactionManager('observer/a'),createTrialPanelPerception('observer/a'),typedIdentifier(1000,text('observer/a')),1n,'Current',()=>n++).staged!.experience;}
describe('actual allocated source role batch',()=>{
 it('GSR-A: every actual claim receives its own arbitrary shared slot and canonical240 bytes',()=>{const ids=[100n,50n,200n],e=experience();let calls=0;const claims=derive(e,()=>ids[calls++]);expect(calls).toBe(3);expect(claims.map(c=>c.causalRoleEvidenceId)).toEqual(ids);for(const c of claims){expect(c.experienceId).toBe(e.experienceId);expect(c.supportingEvidenceRefs).toHaveLength(1);const bytes=canonicalEncode(causalRoleEvidenceValue(c));expect(canonicalEncode(decodeSemanticValue(bytes))).toEqual(bytes);}});
 it('GSR-B: unresolved bindings create neither claims nor unused claim occurrences',()=>{let calls=0;expect(derive(experience(true),()=>BigInt(calls++))).toEqual([]);expect(calls).toBe(0);});
 it('GSR-C: provenance mismatch cannot be relabeled as the accepted binding producer',()=>{const e=experience();for(const bad of [{...e,transformationVersion:'foreign'}, {...e,perceivedBindings:e.perceivedBindings.map(b=>({...b,transformationVersion:'foreign'}))}]){let calls=0;expect(()=>derive(bad,()=>BigInt(calls++))).toThrow();expect(calls).toBe(0);}});
 it('GSR-D: duplicate and negative actual allocation values reject without mutating source',()=>{for(const next of [()=>0n,()=>-1n]){const e=experience(),before=structuredClone(e);expect(()=>derive(e,next)).toThrow('SOURCE_ROLE_ALLOCATION');expect(e).toEqual(before);}});
});
