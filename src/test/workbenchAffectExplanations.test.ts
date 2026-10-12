import {expect,it} from 'vitest';
import {AffectWorkbenchRun} from '../workbench/affectAdapter';
import {AffectSupplementRun} from '../workbench/affectSupplementAdapter';
import {explainAffect} from '../workbench/affectExplanations';
import {DEFAULT_SETTINGS} from '../campaign3/affectModel';
it('distinguishes unknown appraisal, recorded choice and physical execution',async()=>{
 const a=await AffectWorkbenchRun.create('baseline');await a.advance();const cards=a.snapshot().explanations;
 expect(cards.map(c=>c.kind)).toEqual(['Appraisal','Decision']);expect(cards[0].human).toContain('likelihood is unavailable (not zero)');expect(cards[0].human).toContain('unavailable coordinates');
 expect(cards[1].human).toContain('Mechanical randomness is not evidence uncertainty');expect(cards[1].human).toContain('does not establish execution success');
 cards[0].human='changed by inspector';expect(a.snapshot().explanations[0].human).not.toBe(cards[0].human);
 const b=await AffectWorkbenchRun.create('blocked-execution');await b.advance();expect(b.snapshot().explanations).toEqual(a.snapshot().explanations);
 await expect(AffectWorkbenchRun.create('invented')).rejects.toThrow('Unknown');expect(()=>explainAffect([false],DEFAULT_SETTINGS)).toThrow('Unclassified');
},600000);
it('does not report automatic score placeholders as rolled evidence',async()=>{
 const a=await AffectWorkbenchRun.create('no-safety');await a.advance();const d=a.snapshot().explanations.find(c=>c.kind==='Decision')!;
 expect(d.human).toContain('Auto arbitration');expect(d.human).toContain('0 addressed random draws');expect(d.human).not.toContain('realized scores');expect(d.human).not.toContain('adopted safety goal');
},600000);
it('preserves historical descriptions and distinguishes known zero from later feedback',async()=>{
 const a=await AffectSupplementRun.create('interior/candidate-3-feedback-true');for(let i=0;i<13;i++)await a.advance();const before=a.snapshot().explanations;await a.advance();const after=a.snapshot().explanations;
 expect(after.slice(0,before.length)).toEqual(before);const last=after.filter(c=>c.kind==='Appraisal').at(-1)!;expect(last.human).toContain('raw coordinates [1/2] and resulting coordinates [5/8]');expect(last.human).toContain('completed appraisal at instant 13');
 const z=await AffectWorkbenchRun.create('factor-3-1-1-1-1');while(await z.advance()){}expect(z.snapshot().explanations.filter(c=>c.kind==='Appraisal').at(-1)!.human).toContain('raw coordinates [0/1] and resulting coordinates [0/1]');
},600000);
