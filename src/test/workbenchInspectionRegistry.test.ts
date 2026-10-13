import {it,expect} from 'vitest';
import {INSPECTION_EXPERIMENTS} from '../workbench/inspectionRegistry';
import {createBatchRun,type BatchJob} from '../workbench/experimentRegistry';
it('does not enroll newly available inspectors in qualified batch execution',async()=>{
 for(const id of ['multisource','adapt','det']){expect(INSPECTION_EXPERIMENTS.some(e=>e.id===id)).toBe(true);await expect(createBatchRun({id:'unqualified',experimentId:id,name:'baseline',seed:0,law:1,expectedSaveHashes:[]} as unknown as BatchJob)).rejects.toThrow('Unsupported batch experiment');}
});
