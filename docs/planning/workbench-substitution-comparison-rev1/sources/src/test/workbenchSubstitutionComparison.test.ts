import {it,expect} from 'vitest';
import {SubstitutionWorkbenchRun as Run,SUBSTITUTION_PROGRAMS} from '../workbench/substitutionAdapter';
import {SUBSTITUTION_CONTRASTS,compareSubstitution} from '../workbench/substitutionComparison';
it('declares every original program and distinguishes hidden physical state from observer equality',async()=>{
 const covered=new Set(SUBSTITUTION_CONTRASTS.flatMap(c=>[c.a,c.b]));expect([...covered].sort()).toEqual(SUBSTITUTION_PROGRAMS.map(p=>p.id).sort());expect(new Set(SUBSTITUTION_CONTRASTS.map(c=>c.id)).size).toBe(SUBSTITUTION_CONTRASTS.length);
 const a=await Run.create('LatestHistory/deniedFeedback'),b=await Run.create('LatestHistory/hiddenBlocked');for(let i=0;i<6;i++){await a.advance();await b.advance();}
 const report=await compareSubstitution('privacy/denied-feedback',a.snapshot(),b.snapshot());expect(report.observerEqual).toBe(true);expect(report.stateEqual).toBe(false);expect(report.saveEqual).toBe(false);expect(report.stateDifferences.some(d=>d.path.startsWith('$/physical/'))).toBe(true);
 await a.advance();const unaligned=await compareSubstitution('privacy/denied-feedback',a.snapshot(),b.snapshot());expect(unaligned.aligned).toBe(false);expect(unaligned.observerEqual).toBeNull();expect(unaligned.stateDifferences).toEqual([]);
 const tampered=b.snapshot();tampered.observer.rows.length=0;await expect(compareSubstitution('privacy/denied-feedback',a.snapshot(),tampered)).rejects.toThrow('commitment');
},600000);
it('retains equal estimates with different histories without turning available options into action',async()=>{
 const a=await Run.create('LatestHistory/correctedConcentrated'),b=await Run.create('LatestHistory/correctedDiversified');for(let i=0;i<6;i++){await a.advance();await b.advance();}
 const x=a.snapshot().observer.rows.at(-1)!,y=b.snapshot().observer.rows.at(-1)!;expect(x.beliefBefore).toEqual(y.beliefBefore);expect(x.admitted).not.toEqual(y.admitted);expect(x.intent).toBe(-1);expect(y.intent).toBe(-1);
 const report=await compareSubstitution('history/equal-estimates',a.snapshot(),b.snapshot());expect(report.observerEqual).toBe(false);expect(report.changedSettings).toEqual([]);expect(report.inputDifferences.length).toBeGreaterThan(0);
 await expect(compareSubstitution('privacy/denied-feedback',a.snapshot(),b.snapshot())).rejects.toThrow('declared ordered pair');
},600000);
