import {describe,it,expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import {prepareEmbodiedModel,createEmbodiedRun} from '../campaign3/embodiedFactory';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {canonicalEncode as enc,list,set,record,rational,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {materializeReserve as q,reserveBin,deficitPressure as p,replenishReserve as refill} from '../campaign3/embodiedMath';
const num=(x:number,d=1)=>Q.of(BigInt(x),BigInt(d)),kind=(v:CanonicalValue,n:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n;
async function result(name:string){const modelName=name==='hidden89'?'baseline':name,model=await prepareEmbodiedModel({...freeze.versions,content:bytes(modelName+'/content.cenc.hex'),registry:bytes(modelName+'/registry.cenc.hex'),parameters:bytes(modelName+'/parameters.cenc.hex')});const run=await createEmbodiedRun(model,{initialState:bytes('runs/'+name+'/initial-state.cenc.hex'),orderedInputs:bytes('runs/'+name+'/ordered-inputs.cenc.hex'),runSeed:new Uint8Array(32)});while(await run.settleNextInstant()){}const s=run.snapshot();return {run,...s,values:items(decode(s.outputs),'list'),rows:items(decode(s.trace),'list').map(v=>rec(v,160n))};}
describe('EMB exact arithmetic controls (component scope)',()=>{
 it('kinetics and rational partition defeat a stored-level/rounded-query control',()=>{
  expect(q(num(80),0n,num(100),num(1),10n)).toEqual(num(70));expect(q(num(80),0n,num(100),num(2),10n)).toEqual(num(60));
  const queries=[1n,2n,3n].map(t=>q(num(80),0n,num(100),num(1,3),t));expect(queries).toEqual([num(239,3),num(238,3),num(79)]);
  expect(q(num(80),0n,num(100),num(1,3),3n)).toEqual(queries[2]);expect(queries[2]).not.toEqual(num(80));
 });
 it('depletion cancels consumption debt and zero delivery cannot raise reserve',()=>{
  const empty=q(num(2),0n,num(100),num(1),3n);expect(empty).toEqual(num(0));const delivered=refill(empty,num(100),num(5));expect(q(delivered.after,3n,num(100),num(1),4n)).toEqual(num(4));
  expect(refill(num(95),num(100),num(0)).after).toEqual(num(95));expect(()=>refill(num(95),num(100),num(-1))).toThrow();
 });
 it('overflow and bin aliasing cannot become hidden pressure operands',()=>{
  const a=refill(num(95),num(100),num(5)),b=refill(num(95),num(100),num(9));expect(a.after).toEqual(b.after);expect(a.overflow).toEqual(num(0));expect(b.overflow).toEqual(num(4));
  const bins=[41,49].map(v=>reserveBin(num(v),num(100),num(20)));expect(bins[0]).toEqual(bins[1]);expect(p(bins[0].upper,num(60))).toEqual(num(0));expect(p(num(41),num(60))).not.toEqual(p(num(49),num(60)));
  expect(p(reserveBin(num(45),num(100),num(10)).upper,num(60))).toEqual(num(1,6));
 });
 it('uses upper bin at interior ties, last bin at capacity and rejects invalid time/width',()=>{
  expect([0,20,100].map(v=>reserveBin(num(v),num(100),num(20)).index)).toEqual([0n,1n,4n]);
  for(const w of [0,3])expect(()=>reserveBin(num(20),num(100),num(w))).toThrow();
  expect(()=>q(num(80),2n,num(100),num(1),1n)).toThrow();expect(()=>q(num(101),0n,num(100),num(1),1n)).toThrow();
 });
});
describe('EMB committed public comparisons',()=>{
 it('executes the exact 41/49 alias and depleted-refill witnesses as new original-input runs',async()=>{
  const initial=(amount:number)=>{const state=items(decode(bytes('runs/baseline/initial-state.cenc.hex')),'set');return enc(set(state.map(v=>{const leaf=rec(v,151n),value=f(leaf,2n);if(typeof value==='boolean'||value.kind!=='record'||value.schema.typeId!==454n)return v;const anchor=record(value.schema,new Map([[1n,rational(amount,1)],[2n,signed(0)]]));return record(leaf.schema,new Map([[1n,f(leaf,1n)],[2n,anchor]]));})));};
  const rows=items(decode(bytes('runs/baseline/ordered-inputs.cenc.hex')),'list'),at=(row:CanonicalValue,time:number)=>list(items(row,'list').map((v,i)=>i===0?signed(time):v));
  const prepare=async(name:string,amount:number,orderedInputs:Uint8Array)=>{const model=await prepareEmbodiedModel({...freeze.versions,content:bytes(name+'/content.cenc.hex'),registry:bytes(name+'/registry.cenc.hex'),parameters:bytes(name+'/parameters.cenc.hex')});const run=await createEmbodiedRun(model,{initialState:initial(amount),orderedInputs,runSeed:new Uint8Array(32)});while(await run.settleNextInstant()){}return run.snapshot();};
  const single=enc(list([at(rows[0],1)])),a=await prepare('coarser',42,single),b=await prepare('coarser',50,single);expect(a.outputs).toEqual(b.outputs);expect(a.trace).not.toEqual(b.trace);
  const replenished=await prepare('baseline',2,enc(list([at(rows[0],3),at(rows[5],3),at(rows[0],4)]))),trace=items(decode(replenished.trace),'list').map(v=>rec(v,160n));
  const amounts=trace.filter(v=>items(f(v,15n),'list').length).map(v=>f(rec(items(f(v,15n),'list')[0],484n),1n));expect(amounts).toEqual([rational(0,1),rational(4,1)]);
  const partitioned=await prepare('baseline',80,enc(list([at(rows[0],1),at(rows[0],2),at(rows[0],3)]))),direct=await prepare('baseline',80,enc(list([at(rows[0],3)])));expect(partitioned.state).toEqual(direct.state);expect(direct.state).toEqual(initial(80));
 },10000);
 it('separates kinetics, resolution and hidden-state aliases through the admitted channel',async()=>{
  const base=await result('baseline'),hidden=await result('hidden89'),slow=await result('slower'),coarse=await result('coarser');
  const samples=(r:typeof base)=>r.values.filter(v=>kind(v,461n)),pressures=(r:typeof base)=>r.values.filter(v=>kind(v,464n));
  expect(samples(base).slice(0,2)).toEqual(samples(hidden).slice(0,2));expect(pressures(base).slice(0,2)).toEqual(pressures(hidden).slice(0,2));
  expect(f(base.rows[0],15n)).not.toEqual(f(hidden.rows[0],15n));
  expect(f(rec(pressures(base)[1],464n),4n)).not.toEqual(f(rec(pressures(slow)[1],464n),4n));
  expect(f(rec(pressures(base)[1],464n),4n)).not.toEqual(f(rec(pressures(coarse)[1],464n),4n));expect(base.state).toEqual(coarse.state);
  expect(f(rec(samples(base)[1],461n),5n)).not.toEqual(f(rec(samples(coarse)[1],461n),5n));
 },10000);
 it('same saturated body/evidence coexists with different trace-only overflow',async()=>{
  const a=await result('baseline'),b=await result('overflow');expect(a.state).toEqual(b.state);
  expect(a.values.filter(v=>!kind(v,479n))).toEqual(b.values.filter(v=>!kind(v,479n)));
  expect(a.values.filter(v=>kind(v,479n))).not.toEqual(b.values.filter(v=>kind(v,479n)));
 });
 it('denied/unavailable branches are byte-equal, make only the real roster read and never write',async()=>{
  const a=await result('denied'),b=await result('unavailable');expect(a.outputs).toEqual(b.outputs);
  for(const row of a.rows){const event=rec(f(row,4n),130n),phase=(f(event,3n) as {value:bigint}).value,reads=items(f(row,11n),'list');
   expect(items(f(row,15n),'list')).toHaveLength(0);expect(items(f(row,14n),'list')).toHaveLength(0);
   if(phase===10n||phase===60n){expect(reads).toHaveLength(1);const path=rec(f(rec(reads[0],147n),2n),140n);expect((f(path,1n) as {value:bigint}).value).toBe(268n);}
   if(phase!==110n){expect(items(f(rec(f(row,16n),144n),1n),'list')).toHaveLength(0);expect(items(f(row,17n),'list')).toHaveLength(0);}
  }
 });
});
