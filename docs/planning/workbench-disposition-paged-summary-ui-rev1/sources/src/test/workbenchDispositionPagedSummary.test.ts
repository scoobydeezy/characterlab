import {it,expect} from 'vitest';
import {DispositionPagedPair} from '../workbench/dispositionPagedPair';
import {dispositionPagedComparisonSummary as summarize} from '../workbench/dispositionPagedComparisonSummary';

it('exports exact native pair evidence without invented historical hashes, including unequal horizons and restore',async()=>{
 for(const id of ['model/0/2','input/Seed0']){
  const pair=await DispositionPagedPair.create(id);await pair.advance();
  const view=pair.summary(),report=summarize(view);
  expect(JSON.parse(report.text.split('\nExact report:\n')[1])).toEqual(report.artifact);
  expect(report.artifact.comparison).toEqual(view.comparison);
  expect(report.artifact.choices).toEqual(view.choices);
  expect(report.artifact.storedHistory).toEqual(view.history);
  expect(report.artifact.stateDivergence.status).toBe('unavailable');
  if(id==='model/0/2')expect(report.artifact.storedHistory.b.rows.every(r=>r.plastic===null)).toBe(true);
  else expect(report.artifact.choices.firstDifference?.outcome).toBe('different choice');
  const restored=await DispositionPagedPair.restore(await pair.checkpoint());expect(summarize(restored.summary())).toEqual(report);
  const frozen=report.text;await pair.advance('a');const unequal=summarize(pair.summary());
  expect(unequal.artifact.comparison.aligned).toBe(false);expect(unequal.artifact.comparison.stateEqual).toBe(null);
  expect(unequal.artifact.choices.rows.at(-1)?.outcome).toBe('unaligned');expect(report.text).toBe(frozen);
  report.artifact.comparison.a.saveHash='detached';expect(view.comparison.a.saveHash).not.toBe('detached');
  expect(()=>summarize({...view,failure:'partial failure'})).toThrow('failed pair');
  const mixed=structuredClone(view);mixed.history.a.source.saveHash='stale';expect(()=>summarize(mixed)).toThrow('Mixed');
  const wrong=structuredClone(view);wrong.choices.comparison='input/Pressure';expect(()=>summarize(wrong)).toThrow('contrasts');
 }
},300000);
