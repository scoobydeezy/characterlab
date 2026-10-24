import {expect,it} from 'vitest';
import {BatchSession,BATCH_LIMITS} from '../workbench/batchSession';
import type {BatchJob} from '../workbench/experimentRegistry';
import {batchReport} from '../workbench/BatchWorkbench';
import catalog from '../workbench/batchCatalogV12.json';
import previous from '../workbench/batchCatalogV11.json';
const scoped=catalog.jobs.slice(1072) as BatchJob[];
it('preserves all1072 prior declarations and declares14 distinct scoped roles',()=>{
 expect(catalog.jobs.slice(0,1072)).toEqual(previous.jobs);expect(BATCH_LIMITS.jobs).toBe(1086);
 expect(catalog.jobs.reduce((n,j)=>n+j.expectedSaveHashes.length,0)).toBe(7574);
 expect(scoped.filter(j=>j.experimentId==='bio')).toHaveLength(13);expect(scoped.filter(j=>j.experimentId==='sem')).toHaveLength(1);
 for(const job of scoped)expect(()=>new BatchSession([{...job,seedHex:undefined}])).toThrow('exact 32-byte seed');
});
it('preserves boundary/clock distinctions and exact originals in shared reports',async()=>{
 // This test checks transport and report behavior only; full native audit is separate.
 const batch=new BatchSession(scoped,async job=>{
  let prefix=0;return {advance:async()=>prefix<job.expectedSaveHashes.length-1?(prefix++,true):false,
   view:()=>({prefix,total:job.expectedSaveHashes.length-1,complete:prefix===job.expectedSaveHashes.length-1,clock:job.experimentId==='bio'?null:String(prefix),modelHash:'a'.repeat(64),runHash:'b'.repeat(64),stateHash:'c'.repeat(64),saveHash:job.expectedSaveHashes[prefix]})};
 });
 await batch.run();const snapshot=batch.snapshot();expect(snapshot.status).toBe('complete');expect(snapshot.results.flatMap(r=>r.prefixes)).toHaveLength(264);
 const report=batchReport(snapshot);expect(report.originals.bio).toEqual(catalog.bio);expect(report.originals.sem).toEqual(catalog.sem);
 expect(report.executionBoundaries.filter(b=>b.kind==='composed-component')).toHaveLength(13);
 expect(report.executionBoundaries.filter(b=>b.kind==='fixed-scheduler-harness')).toHaveLength(1);
 expect(snapshot.results.filter(r=>r.job.experimentId==='bio').every(r=>r.prefixes.every(p=>p.clock===null))).toBe(true);
});
it('fails closed if a component adapter invents scheduler time',async()=>{
 const job=scoped[0],batch=new BatchSession([job],async()=>({advance:async()=>false,view:()=>({prefix:0,total:19,complete:false,clock:'0',modelHash:'a'.repeat(64),runHash:'b'.repeat(64),stateHash:'c'.repeat(64),saveHash:job.expectedSaveHashes[0]})}));
 await batch.run();expect(batch.snapshot().status).toBe('failed');expect(batch.snapshot().results[0].prefixes).toEqual([]);
});
