import {expect,it} from 'vitest';
import capture from '../../docs/planning/workbench-commit-browser-rev1/observer-a-v2.json';
import {explainCommitObserver} from '../workbench/commitExplanations';
it('keeps absence, unknown and historical report scope distinct with exact provenance',()=>{
 const report=JSON.parse(capture.exact).find((v:any)=>v.record==='CommitObservation#962/1');
 for(const [status,label] of [['0','absent'],['1','active'],['2','retired']]){
  const r={...report,'Status [5]':status},input=JSON.stringify([r]),result=explainCommitObserver(input,0);
  expect(result.reports[0].status).toBe(label);expect(result.reports[0].text).toContain('not the commitment\'s current private state');expect(JSON.parse(result.reports[0].exact)).toEqual(r);expect(result.reports[0].occurrence).toEqual(report['Id [1]']);expect(result.empty).toBeNull();expect(explainCommitObserver(input,0)).toEqual(result);
 }
 expect(explainCommitObserver('[]',0).empty).toContain('does not establish');
 expect(explainCommitObserver(capture.exact,0).reports).toHaveLength(1);
});
it('rejects another observer, unknown versions/statuses, and research-shaped inputs',()=>{
 expect(()=>explainCommitObserver(capture.exact,1)).toThrow('observer mismatch');
 expect(()=>explainCommitObserver(capture.exact,2)).toThrow('Unknown COMMIT observer');
 const r=JSON.parse(capture.exact).find((v:any)=>v.record==='CommitObservation#962/1');
 for(const changed of [{...r,record:'CommitObservation#962/2'},{...r,'Status [5]':'9'},{...r,privateState:'hidden'},{...r,'At [3]':3}])expect(()=>explainCommitObserver(JSON.stringify([changed]),0)).toThrow();
 expect(()=>explainCommitObserver('[{"record":"CommitLifecycle#956/1"}]',0)).toThrow();
});
