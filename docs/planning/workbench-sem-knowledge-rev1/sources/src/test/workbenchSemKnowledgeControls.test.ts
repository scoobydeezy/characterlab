import {it,expect} from 'vitest';
import {runSemKnowledgeControls} from '../workbench/semKnowledgeControls';
it('preserves original mapping occurrence, catalog uniqueness and resolution-state witnesses',async()=>{
 const r=await runSemKnowledgeControls();expect(await runSemKnowledgeControls()).toEqual(r);
 expect(r.cases.map(c=>c.accepted)).toEqual([true,false,true,false,false,false,true,true,false]);
 expect(r.cases[0].resolution).not.toEqual(r.cases[2].resolution);
 expect(r.cases[4].failure).toMatchObject({code:'INVALID_SYMBOL_MAPPING'});expect(r.cases[4].failure!.message).toContain('more than one active mapping');
 expect(r.cases[8].failure).toMatchObject({code:'INVALID_CATALOG'});expect(r.cases[8].failure!.message).toContain('duplicate candidate catalog entry');
 for(const index of [1,3,5])expect(r.cases[index].failure!.code).toBe('INVALID_SYMBOL_MAPPING');
 expect(r.occurrencePreservation.mappingBefore).toBe(r.occurrencePreservation.mappingAfter);expect(r.occurrencePreservation.referenceBefore).toBe(r.occurrencePreservation.referenceAfter);expect(r.occurrencePreservation.distinctSecondOccurrence).toBe('4300');
 expect(r.resolutionState).toMatchObject({evaluationId:'0',resolutionId:'1',hasEvaluationPointer:false});
});
