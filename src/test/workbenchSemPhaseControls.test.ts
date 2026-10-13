import {it,expect} from 'vitest';
import {runSemPhaseControls} from '../workbench/semPhaseControls';
it('records executed failure causes and immutable recognition history separately from declarations',async()=>{
 const r=await runSemPhaseControls();expect(await runSemPhaseControls()).toEqual(r);
 expect(r.cases).toHaveLength(10);expect(r.negatives).toHaveLength(10);
 const p=Object.fromEntries(r.cases.map(c=>[c.id,JSON.parse(c.evidence.exact)]));
 expect(p['executed-backward-chain'].visited).toEqual([{$bigint:'110'},{$bigint:'120'}]);expect(p['executed-backward-chain'].status).toBe('Failed');
 expect(p['conditional-reservations'].emptyCalls).toBe(0);expect(p['conditional-reservations'].calls).toBe(2);expect(p['conditional-reservations'].current.experienceId.$bigint).toBe('40');expect(p['conditional-reservations'].consequence.experienceId.$bigint).toBe('41');
 const c=p['frozen-recognition-correction'];expect(c.mutable.cueEvidence).toHaveLength(0);expect(c.frozen.request.cueEvidence).toHaveLength(1);expect(c.first.resolutionRecord).toEqual(c.firstBefore);expect(c.correction.resolutionRecord.revisesRecognitionResolutionId).toEqual(c.first.resolutionRecord.recognitionResolutionId);expect(c.correction.resolutionRecord.resolution).not.toEqual(c.first.resolutionRecord.resolution);
 expect(r.rollback.validationFailureCode).toBe('ORPHAN_EXPERIENCE_RESERVATION');expect(r.rollback.failureCode).toBe('TRANSITION_FAILURE');expect(JSON.parse(r.rollback.attempted.exact).experienceId.$bigint).toBe('70');expect(r.rollback.before.status).toBe('Active');expect(r.rollback.after.status).toBe('Failed');expect(Object.values(r.rollback.preserved)).toEqual([true,true,true,true]);
 expect(r.negatives.map(n=>n.code)).toEqual(['LATE_TRUTH_CANNOT_REOPEN_LANE','LATE_TRUTH_CANNOT_REOPEN_LANE','INVALID_PHASE','CAUSAL_ORDER_VIOLATION','ORPHAN_EXPERIENCE_RESERVATION','DUPLICATE_EXPERIENCE_ENVELOPE','NONCANONICAL_CLASSIFICATION_WORK','OUTCOME_TRUTH_READ_FORBIDDEN','ADAPTATION_AS_LEARNING_EVIDENCE','INVALID_EVENT']);
});

