import {expect,it} from 'vitest';
import {BatchSession,BATCH_LIMITS} from '../workbench/batchSession';
import type {BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV10.json';
import previous from '../workbench/batchCatalogV9.json';
it('retains previous declarations and admits exactly78 original public-source roles',()=>{
 expect(catalog.jobs.slice(0,990)).toEqual(previous.jobs);expect(BATCH_LIMITS.jobs).toBeGreaterThanOrEqual(1068);
 expect(catalog.jobs).toHaveLength(1068);expect(catalog.jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0)).toBe(7284);
 expect(catalog.jobs.filter(j=>j.experimentId==='body')).toHaveLength(16);
 expect(catalog.jobs.filter(j=>j.experimentId==='multisource')).toHaveLength(62);
});
it('runs both public-source families through the shared session and exports exact originals',async()=>{
 const jobs=['body','multisource'].map(id=>catalog.jobs.find(j=>j.experimentId===id)!) as BatchJob[];
 const batch=new BatchSession(jobs);await batch.run();const snapshot=batch.snapshot();expect(snapshot.status).toBe('complete');
 expect(snapshot.results.every(r=>r.prefixes.every(p=>p.matchesFrozenSave))).toBe(true);
 const report=batchReport(snapshot);
 for(const id of ['body','multisource'] as const){
  expect(report.originals[id].programs).toEqual(catalog[id].programs.filter(p=>jobs.some(j=>j.experimentId===id&&j.name===p.name)));
  expect(report.originals[id].models).toEqual(catalog[id].models.filter(m=>report.originals[id].programs.some(p=>p.model===m.name)));
 }
},600000);
