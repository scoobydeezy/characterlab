import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {expect,it} from 'vitest';
import {ScopedBatchSeed} from '../workbench/ScopedBatchSeed';import catalog from '../workbench/batchCatalogV12.json';
it('displays every exact BIO/SEM run seed with its declared seed scope',()=>{
 for(const job of catalog.jobs.slice(1072)){
  const html=renderToStaticMarkup(createElement(ScopedBatchSeed,{job:job as {experimentId:'bio'|'sem';seedHex:string}}));
  expect(html).toContain(`data-batch-seed="${job.seedHex}"`);expect(html).toContain(job.seedHex);
  expect(html).toContain(job.experimentId==='bio'?'Early decision run seed':'Run seed');expect(html).not.toContain('role="alert"');
 }
 expect(catalog.sem.runSeed).toBe('00'.repeat(31)+'0d');expect(catalog.sem.runSeed).not.toBe('0d'.repeat(32));
});
it('withholds malformed or missing bytes instead of showing a numeric substitute',()=>{
 for(const experimentId of ['bio','sem'] as const)for(const seedHex of [undefined,'','13','0D'.repeat(32),'00'.repeat(31)]){
  const html=renderToStaticMarkup(createElement(ScopedBatchSeed,{job:{experimentId,seedHex}}));expect(html).toContain('role="alert"');expect(html).not.toContain('data-batch-seed');
 }
});
