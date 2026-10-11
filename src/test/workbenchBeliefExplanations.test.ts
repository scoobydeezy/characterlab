import {expect,it} from 'vitest';
import {BeliefWorkbenchRun} from '../workbench/beliefAdapter';
import {explainBelief} from '../workbench/beliefExplanations';
it('keeps initial appraisal unknown and later known zero explicit',async()=>{
 const run=await BeliefWorkbenchRun.create('knownZero-law-1');await run.advance();const first=run.snapshot().explanations;
 expect(first[0].kind).toBe('Appraisal');expect(first[0].known).toBe(false);expect(first[0].at).toBeNull();
 expect(first.find(c=>c.kind==='Learning')?.human).toContain('estimate is 0/1');
 await run.advance();expect(run.snapshot().explanations.slice(0,first.length)).toEqual(first);
 expect(run.snapshot().explanations.filter(c=>c.kind==='Appraisal'&&c.known)[0].human).toContain('not calibrated correctness');
 expect(()=>explainBelief([true],1)).toThrow('Unclassified');
},600000);
it('does not turn incomplete monitoring or absent opportunity into negative evidence',async()=>{
 for(const name of ['censored','noOpportunity']){const run=await BeliefWorkbenchRun.create(`${name}-law-1`);while(await run.advance()){}const cards=run.snapshot().explanations.filter(c=>c.kind==='Learning');expect(cards[1].human).toContain('did not apply');expect(cards[1].human).toContain(name==='censored'?'absence of an outcome is not established':'not evidence of an unsuccessful outcome');}
},600000);
