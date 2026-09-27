import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {allocateSpatialContext as allocate,type SpatialCalibration,type SpatialDetection} from '../campaign3/spatialContextAllocation';
const calibration:SpatialCalibration={minX:2n,maxX:5n,minY:2n,maxY:5n,focalWeight:Q.of(3n,4n),residualPool:Q.of(1n,5n)};
const observations=(cells:readonly (readonly [bigint,bigint]|undefined)[]):SpatialDetection[]=>cells.map((p,i)=>({detectionId:BigInt(i),...(p?{position:{x:p[0],y:p[1]}}:{})}));
describe('spatial-context-allocation/0.1-candidate',()=>{
 it('SCA-A: inclusive edges and immediately adjacent outside cells',()=>{
  const result=allocate(observations([[2n,3n],[5n,3n],[3n,2n],[3n,5n],[1n,3n],[6n,3n],[3n,1n],[3n,6n]]),calibration);
  expect(result.map(r=>r.spatialClass)).toEqual([...Array(4).fill('SpatialFocal'),...Array(4).fill('SpatialPeripheral')]);
 });
 it('SCA-B: only peripheral allocations dilute with positive footprint',()=>{
  const sparse=allocate(observations([[3n,3n],[0n,0n]]),calibration),dense=allocate(observations([[3n,3n],[0n,0n],[7n,7n]]),calibration);
  expect(sparse[0]).toEqual(dense[0]);expect(sparse[1]).toMatchObject({allocation:Q.of(1n,5n)});
  expect(dense.slice(1).map(r=>'allocation'in r?r.allocation:undefined)).toEqual([Q.of(1n,10n),Q.of(1n,10n)]);
 });
 it('SCA-C: unavailable evidence is not a pool member or known zero',()=>{
  const result=allocate(observations([[0n,0n],undefined]),{...calibration,residualPool:Q.of(0n)});
  expect(result[0]).toMatchObject({spatialClass:'SpatialPeripheral',allocation:Q.of(0n)});
  expect(result[1]).toEqual({detectionId:1n,spatialClass:'SpatialUnknown'});
  expect(allocate(observations([[0n,0n],undefined]),calibration)[0]).toMatchObject({allocation:Q.of(1n,5n)});
 });
 it('SCA-D: ordinals are not geometric or semantic features',()=>{
  const input=observations([[0n,0n],[3n,3n],undefined]),a=allocate(input,calibration),b=allocate(input.map(r=>({...r,detectionId:r.detectionId+999n})),calibration);
  expect(b.map(r=>({...r,detectionId:r.detectionId-999n}))).toEqual(a);
 });
 it('SCA-E: empty lists, singleton rectangles and whole-grid focus are defined',()=>{
  expect(allocate([],calibration)).toEqual([]);
  expect(allocate(observations([[7n,7n]]),{...calibration,minX:7n,maxX:7n,minY:7n,maxY:7n,focalWeight:Q.of(0n)})[0]).toMatchObject({spatialClass:'SpatialFocal',allocation:Q.of(0n)});
  expect(allocate(observations([[0n,0n],[7n,7n]]),{...calibration,minX:0n,maxX:7n,minY:0n,maxY:7n}).map(r=>r.spatialClass)).toEqual(['SpatialFocal','SpatialFocal']);
 });
 it('SCA-F: malformed and executable operands reject without getters or mutation',()=>{
  const input=observations([[3n,3n]]),before=structuredClone(input);
  const sparse=new Array(2);sparse[1]=input[0];
  for(const bad of [sparse,[input[0],input[0]],[{detectionId:-1n}],[{...input[0],truthHandle:1}],[{detectionId:0n,position:undefined}],observations([[8n,0n]]),Array.from({length:9},(_,i)=>({detectionId:BigInt(i)}))])expect(()=>allocate(bad,calibration)).toThrow();
  let invoked=false;const getter={detectionId:0n,get position(){invoked=true;return {x:1n,y:1n};}};
  expect(()=>allocate([getter],calibration)).toThrow();expect(invoked).toBe(false);
  for(const bad of [{...calibration,minX:6n},{...calibration,residualPool:Q.of(2n)},{...calibration,minY:-1n}])expect(()=>allocate(input,bad)).toThrow();
  expect(input).toEqual(before);
 });
 it('SCA-G: outputs are detached and do not manufacture causal claims or truth handles',()=>{
  const input=observations([[3n,3n]]),result=allocate(input,calibration),row=result[0];
  expect(Object.keys(row).sort()).toEqual(['allocation','detectionId','position','spatialClass']);
  if('position'in row)(row.position as {x:bigint}).x=0n;
  expect(input[0].position!.x).toBe(3n);expect(allocate(input,calibration)[0]).toMatchObject({position:{x:3n}});
 });
 it('SCA-H: later selection retains preselection residual allocation',()=>{
  const rows=allocate(observations([[0n,0n],[7n,7n]]),calibration),selected=rows.filter(r=>r.detectionId===0n);
  expect(selected[0]).toMatchObject({allocation:Q.of(1n,10n)});
  expect(selected[0]).not.toMatchObject({allocation:Q.of(1n,5n)});
 });
});
