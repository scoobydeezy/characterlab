import {it,expect} from 'vitest';
import browser from '../../docs/planning/workbench-disposition-pair-browser-rev1/browser.json';
import {dispositionDivergenceHistory,type DispositionComparisonReport} from '../workbench/dispositionDivergenceHistory';
const zero=browser.zero as DispositionComparisonReport,one=browser.paused as DispositionComparisonReport,two=browser.advanced as DispositionComparisonReport;
it('distinguishes initial state differences from later mechanism differences in qualified native/browser reports',()=>{
 const reports=[two,zero,one],before=JSON.stringify(reports),history=dispositionDivergenceHistory(reports);
 expect(history.observedPrefixes).toEqual([0,1,2]);expect(history.missingPrefixes).toEqual([]);expect(history.completeFromInitial).toBe(true);
 expect(history.firstStateDifference?.prefix).toBe(0);expect(history.firstStateDifference?.earliestProven).toBe(true);
 expect(history.firstMechanismProjectionDifference?.prefix).toBe(1);expect(history.firstMechanismProjectionDifference?.earliestProven).toBe(true);
 expect(history.firstMechanismProjectionDifference?.a.saveHash).toBe(one.a.saveHash);expect(JSON.stringify(reports)).toBe(before);
 expect(dispositionDivergenceHistory([zero,one,two,one,two])).toEqual(history);
});
it('withholds earliest claims across gaps, missing initial state and an empty history',()=>{
 const gap=dispositionDivergenceHistory([zero,two]);expect(gap.missingPrefixes).toEqual([1]);expect(gap.firstStateDifference?.earliestProven).toBe(true);expect(gap.firstMechanismProjectionDifference?.prefix).toBe(2);expect(gap.firstMechanismProjectionDifference?.earliestProven).toBe(false);
 expect(dispositionDivergenceHistory([one]).firstStateDifference?.earliestProven).toBe(false);
 const empty=dispositionDivergenceHistory([]);expect(empty.latestPrefix).toBeNull();expect(empty.completeFromInitial).toBe(false);expect(empty.firstStateDifference).toBeNull();
 expect(dispositionDivergenceHistory([zero]).firstMechanismProjectionDifference).toBeNull();
});
it('rejects mixed branches, inconsistent equality, conflicting revisions and unaligned reports',()=>{
 expect(()=>dispositionDivergenceHistory([zero,{...one,a:{...one.a,runHash:'different'}}])).toThrow('identities');
 expect(()=>dispositionDivergenceHistory([{...zero,stateEqual:true}])).toThrow('equality');
 expect(()=>dispositionDivergenceHistory([zero,{...zero,scope:'rewritten revision'}])).toThrow('conflicting');
 expect(()=>dispositionDivergenceHistory([{...one,aligned:false}])).toThrow('aligned');
 expect(()=>dispositionDivergenceHistory(Array.from({length:257},()=>zero))).toThrow('limit');
});
