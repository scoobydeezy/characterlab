import {it,expect} from 'vitest';
import {INSPECTION_EXPERIMENTS} from '../workbench/inspectionRegistry';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
it('does not enroll newly available inspectors in qualified batch execution',async()=>{
 for(const id of ['long-goal','long-habit','long-loss','long-routine','control','fatigue','substitution','disposition']){expect(INSPECTION_EXPERIMENTS.some(e=>e.id===id)).toBe(true);await expect(createBatchRun({id:'unqualified',experimentId:id,name:'baseline',seed:0,law:1,expectedSaveHashes:[]} as unknown as BatchJob)).rejects.toThrow('Unsupported batch experiment');}
 for(const id of ['body','multisource','adapt','det']){expect(INSPECTION_EXPERIMENTS.filter(e=>e.id===id)).toHaveLength(1);await expect(createBatchRun({id:'unqualified',experimentId:id,name:'baseline',seed:0,law:1,expectedSaveHashes:[]} as BatchJob)).rejects.toThrow('frozen');}
 for(const id of ['bio','sem'] as const){expect(INSPECTION_EXPERIMENTS.filter(e=>e.id===id)).toHaveLength(1);await expect(createBatchRun({id:'unqualified',experimentId:id,name:'invented',seed:0,law:'invented',seedHex:'00'.repeat(32),executionKind:id==='bio'?'composed-component':'fixed-scheduler-harness',expectedSaveHashes:[]})).rejects.toThrow('frozen');}
 expect(new Set(INSPECTION_EXPERIMENTS.map(e=>e.id)).size).toBe(INSPECTION_EXPERIMENTS.length);
 expect(INSPECTION_EXPERIMENTS.filter(e=>e.id==='long')).toHaveLength(1);
 await expect(createBatchRun({id:'unqualified',experimentId:'long',name:'baseline',seed:0,law:1,expectedSaveHashes:[]})).rejects.toThrow('frozen LONG program');
});
