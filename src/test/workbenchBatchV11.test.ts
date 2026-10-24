import {expect,it} from 'vitest';
import {BatchSession,BATCH_LIMITS} from '../workbench/batchSession';
import type {BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV11.json';
import previous from '../workbench/batchCatalogV10.json';
it('preserves all prior declarations and the bounded public persistence admission',()=>{
 expect(catalog.jobs.slice(0,1068)).toEqual(previous.jobs);expect(BATCH_LIMITS.jobs).toBeGreaterThanOrEqual(1072);
 expect(catalog.jobs).toHaveLength(1072);expect(catalog.jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0)).toBe(7310);
 expect(catalog.jobs.slice(1068).map(j=>j.experimentId)).toEqual(['adapt','adapt','det','det']);
});
it('executes all new roles through the shared session and preserves complete original exports',async()=>{
 const jobs=catalog.jobs.slice(1068) as BatchJob[],batch=new BatchSession(jobs);await batch.run();
 const snapshot=batch.snapshot();expect(snapshot.status).toBe('complete');expect(snapshot.current).toBe(4);
 expect(snapshot.results.flatMap(r=>r.prefixes)).toHaveLength(26);expect(snapshot.results.every(r=>r.prefixes.every(p=>p.matchesFrozenSave))).toBe(true);
 const report=batchReport(snapshot);expect(report.originals.adapt).toEqual(catalog.adapt);expect(report.originals.det).toEqual(catalog.det);
 expect(report.experiments.map(e=>e.id).sort()).toEqual(['adapt','det']);
},600000);
