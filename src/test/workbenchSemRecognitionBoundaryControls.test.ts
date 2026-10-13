import {it,expect} from 'vitest';
import {runSemRecognitionBoundaryControls} from '../workbench/semRecognitionBoundaryControls';
it('preserves original mapping, continuity, authority, allocation, failed settlement and emission witnesses',async()=>{
 const r=await runSemRecognitionBoundaryControls();expect(await runSemRecognitionBoundaryControls()).toEqual(r);
 expect(r.mapping.missing.code).toBe('INVALID_SYMBOL_MAPPING');expect(r.mapping.truthGuard.code).toBe('FORBIDDEN_TRUTH_FIELD');expect(r.mapping.semanticView).toMatch(/^asserted:/);
 expect([r.continuity.sameTrackAfterReplacement,r.continuity.changedRecognition,r.continuity.splitTrack,r.continuity.sameRecognitionAcrossSplit]).toEqual([true,true,true,true]);
 expect(r.authority.alternativeModel).toBe('model/alternative');expect(r.authority.guards.map(g=>g.code)).toEqual(['MISSING_RECOGNITION_AUTHORITY','DUPLICATE_RECOGNITION_AUTHORITY','CARRIER_TYPE_MISMATCH','UNKNOWN_DERIVATION']);
 expect([r.allocation.exactReplay,r.allocation.sameSemanticView,r.allocation.differentResolutionId]).toEqual([true,true,true]);expect(r.allocation.historyGuard.code).toBe('INVALID_RESOLUTION_HISTORY');
 expect(r.rollback.allocatedEvaluation).toBe('50');expect(r.rollback.before.status).toBe('Active');expect(r.rollback.after.status).toBe('Failed');expect(r.rollback.preserved).toEqual({state:true,allocators:true,trace:true,outputs:true});
 expect(r.emission.targets).toHaveLength(13);expect(r.emission.targets[0].accepted).toBe(true);expect(r.emission.targets.slice(1).map(t=>t.failure?.code)).toEqual(Array(12).fill('FORBIDDEN_EMISSION_TARGET'));
 expect(r.emission.resolutionEmitted).toBe(false);expect(r.emission.result).toEqual({kind:'no-update',reason:'SameCandidateMaintained'});
 const parse=(e:{exact:string})=>JSON.parse(e.exact);
 expect(parse(r.allocation.low).resolutionRecord.recognitionResolutionId).toEqual({$bigint:'5'});expect(parse(r.allocation.shifted).resolutionRecord.recognitionResolutionId).toEqual({$bigint:'901'});
 expect(parse(r.mapping.mapped).candidateCatalog.find((c:{candidateDomain:string})=>c.candidateDomain==='DiscreteObject')).toBeDefined();
});
