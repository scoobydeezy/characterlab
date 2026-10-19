import {it,expect} from 'vitest';
import browser from '../../docs/planning/workbench-disposition-pair-browser-rev1/browser.json';
import type {DispositionComparisonReport as Report} from '../workbench/dispositionDivergenceHistory';
import {retainDispositionReport} from '../workbench/dispositionReportRetention';
const zero=browser.zero as Report,one=browser.paused as Report,two=browser.advanced as Report;
it('retains aligned boundaries, restores the horizon and deterministically continues',()=>{
 const initial=retainDispositionReport([],zero,'reset');
 const first=retainDispositionReport(initial,one),second=retainDispositionReport(first,two);
 expect(second.map(r=>r.a.prefix)).toEqual([0,1,2]);
 const restored=retainDispositionReport(second,one,'restore');
 expect(restored).toEqual(first);expect(retainDispositionReport(restored,two)).toEqual(second);
 expect(retainDispositionReport(second,zero,'reset')).toEqual(initial);
 expect(retainDispositionReport(second,two)).toEqual(second);
 restored[0].scope='caller mutation';expect(second[0].scope).toBe(zero.scope);
});
it('rejects conflicts before restore truncation and resets another comparison explicitly',()=>{
 expect(()=>retainDispositionReport([zero,one,two],{...one,scope:'conflict'},'restore')).toThrow('conflicting');
 const other={...zero,contrast:{...zero.contrast,id:'other'}};
 expect(()=>retainDispositionReport([zero],other)).toThrow('identities');
 expect(retainDispositionReport([zero,one],other,'restore')).toEqual([other]);
});
