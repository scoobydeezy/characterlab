import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {expect,it} from 'vitest';
import {batchExecutionBoundary,validBatchClock} from '../workbench/batchExecutionBoundary';
import {BatchExecutionBoundary} from '../workbench/BatchExecutionBoundary';

it('rejects missing or forged boundaries and component clock invention',()=>{
 const bio={experimentId:'bio',executionKind:'composed-component'},sem={experimentId:'sem',executionKind:'fixed-scheduler-harness'};
 for(const job of [{experimentId:'bio'},{experimentId:'sem'},{...bio,executionKind:'public-run'},{...sem,executionKind:'composed-component'},{experimentId:'adapt',executionKind:'composed-component'}])expect(()=>batchExecutionBoundary(job)).toThrow('boundary');
 expect(validBatchClock(bio,null)).toBe(true);for(const v of ['0','19',0,undefined])expect(validBatchClock(bio,v)).toBe(false);
 for(const job of [sem,{experimentId:'adapt'}]){expect(validBatchClock(job,'0')).toBe(true);expect(validBatchClock(job,null)).toBe(false);expect(validBatchClock(job,undefined)).toBe(false);}
});
it('renders the actual execution and clock qualification for each scope',()=>{
 const bio=renderToStaticMarkup(createElement(BatchExecutionBoundary,{job:{experimentId:'bio',executionKind:'composed-component'}}));
 expect(bio).toContain('Scheduler clock unavailable.');expect(bio).toContain('No scheduler clock or public factory admission.');expect(bio).toContain('probe, nondecision and contrary seeds');
 const sem=renderToStaticMarkup(createElement(BatchExecutionBoundary,{job:{experimentId:'sem',executionKind:'fixed-scheduler-harness'}}));
 expect(sem).toContain('Native scheduler clock.');expect(sem).toContain('ordered-input commitment is empty');expect(sem).toContain('schedule is inserted incrementally');
 const publicRun=renderToStaticMarkup(createElement(BatchExecutionBoundary,{job:{experimentId:'adapt'}}));expect(publicRun).toContain('Public run');expect(publicRun).toContain('One complete native instant');
});
