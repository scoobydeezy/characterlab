import {createElement} from 'react';
import {expect,it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {BatchSeed} from '../workbench/BatchSeed';
import type {BatchJob} from '../workbench/experimentRegistry';
import catalog from '../workbench/batchCatalogV9.json';

it('renders the exact retained seed for every declared job without changing its declaration',()=>{
  const before=JSON.stringify(catalog);
  for(const entry of catalog.jobs){
    const job=entry as BatchJob,html=renderToStaticMarkup(createElement(BatchSeed,{job}));
    const expected=job.experimentId==='general'?job.seedHex:String(job.seed);
    expect(html).toContain(`data-batch-seed="${expected}"`);
    expect(html).not.toContain('role="alert"');
    if(job.experimentId==='general')expect(html).not.toContain('data-batch-seed="0"');
  }
  expect(JSON.stringify(catalog)).toBe(before);
});
it('shows unavailable rather than substituting the numeric placeholder for a missing exact seed',()=>{
  const job=catalog.jobs.find(j=>j.experimentId==='general')! as BatchJob;
  for(const seedHex of [undefined,'bad','0'.repeat(63),'A'.repeat(64)]){
    const html=renderToStaticMarkup(createElement(BatchSeed,{job:{...job,seedHex}}));
    expect(html).toContain('Exact General seed unavailable');
    expect(html).not.toContain('data-batch-seed');
  }
});
