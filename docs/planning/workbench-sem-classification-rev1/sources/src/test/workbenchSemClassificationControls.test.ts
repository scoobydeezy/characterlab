import {it,expect} from 'vitest';import {runSemClassificationControls} from '../workbench/semClassificationControls';
it('preserves explicit false versus missing and original emission/field boundaries',async()=>{
 const r=await runSemClassificationControls();expect(await runSemClassificationControls()).toEqual(r);
 const metallic=(i:number)=>r.cases[i].facets.filter(c=>c.facet==='perceptual-facet/appears-metallic');expect(metallic(0).map(c=>c.value)).toEqual([true]);expect(metallic(1).map(c=>c.value)).toEqual([false]);expect(metallic(2)).toEqual([]);
 expect(r.negatives.map(n=>n.failure.code)).toEqual(['UNKNOWN_FACET','UNKNOWN_FEATURE','INVALID_FEATURE_OBSERVATION']);expect(r.emissions[0].accepted).toBe(true);expect(r.emissions.slice(1).map(e=>e.failure?.code)).toEqual(Array(9).fill('FORBIDDEN_EMISSION_TARGET'));
 for(const s of r.shapes){for(const fields of s.fieldSets)expect(fields).toEqual(['classificationEvidenceId','classificationRuleId','experienceId','observerId','occurredAt','perceptualFacetId','perceptualReferentId','supportingFeatureObservationIds','supportingObservationIds','transformationVersion','typedPerceivedValue']);for(const forbidden of ['appraisal','affect','motive','pressure','reason','valence','salience','arousal','intensity','confidence','weight','score'])expect(s.diagnostic.toLowerCase()).not.toContain('"'+forbidden+'"');}
});
