import {it,expect} from 'vitest';
import {SubstitutionWorkbenchRun as Run} from '../workbench/substitutionAdapter';
import {describeSubstitutionObserver as describe} from '../workbench/substitutionDescription';
it('preserves whole-horizon observer equalities and excludes physical/draw provenance',async()=>{
 for(const [a,b]of [['diversified','falseTraining'],['deniedFeedback','hiddenBlocked'],['falseSuccess','trueSuccess'],['deniedInfo','absentInfo']]){
  const x=await Run.create('LatestHistory/'+a),y=await Run.create('LatestHistory/'+b);let previous=describe(x.snapshot().observer).entries;
  for(let i=1;i<=8;i++){await x.advance();await y.advance();const before=x.checkpoint(),report=describe(x.snapshot().observer);expect(report).toEqual(describe(y.snapshot().observer));expect(report.entries).toHaveLength(i*4);expect(report.entries.slice(0,previous.length)).toEqual(previous);expect(x.checkpoint()).toEqual(before);expect(JSON.stringify(report)).not.toMatch(/privateBit|physical\":|addresses\":|Draws|resolution\":|execution\":/);previous=report.entries;}
 }
},600000);
it('distinguishes no candidates, inactive reasons, information learning and missing learning',async()=>{
 const cases=['LatestHistory/concentrated','LatestHistory/correctedDiversified','LatestHistory/knownAlternative','NoLearning/knownAlternative'],runs=await Promise.all(cases.map(c=>Run.create(c)));for(const r of runs)for(let i=0;i<6;i++)await r.advance();
 const reports=runs.map(r=>describe(r.snapshot().observer)),entry=(n:number,at:number,kind:string)=>reports[n].entries.find(e=>e.at===at&&e.kind===kind)!;
 expect(entry(0,6,'Recorded selection').human).toContain('No candidates');expect(entry(1,6,'Recorded selection').human).toContain('no active reasons');expect(entry(2,6,'Recorded selection').human).toContain('Option B was selected');
 expect(entry(2,5,'Recorded learning').human).toContain('A 0, B 1; performed-history records added: 0');expect(entry(3,1,'Admitted feedback').human).toContain('reports success');expect(entry(3,1,'Recorded learning').human).toContain('performed-history records added: 0');
 expect(entry(0,6,'Recorded evaluation').human).toContain('B unknown');expect(()=>describe(runs[0].snapshot().state as never)).toThrow('observer');
},600000);
