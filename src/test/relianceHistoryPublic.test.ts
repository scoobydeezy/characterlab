import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileRelDimensionsModel,compileRelDimensionsInputs,relDimensionsRecipe,STAGES,eventId,path,owner,HOLDERS,TARGETS,OPTIONS} from '../campaign3/relDimensionsModel';
import {createRelDimensionsRuntime} from '../campaign3/relDimensionsRuntime';
import {emptyKnowledge,learn} from '../campaign3/relDimensionsMath';
import {prepareRelDimensionsModel,createRelDimensionsRun,restoreRelDimensionsRun} from '../campaign3/relDimensionsFactory';
import {decodeRelDimensions as decode} from '../campaign3/relDimensionsCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './relianceHistoryFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=relDimensionsRecipe(law,goal),m=await compileRelDimensionsModel(source),orderedInputs=ordered(cases()[name]),i=await compileRelDimensionsInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createRelDimensionsRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1216n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const lenses=(a:CanonicalValue)=>[8n,9n,10n,11n].map(k=>f(a,k));
const probability=(s:Awaited<ReturnType<typeof run>>,at:number,k:number,i=0)=>{const p=outputs(s,1217n).find(x=>key(f(f(x,2n),3n))===key(HOLDERS[i])&&key(f(f(x,2n),2n))===key({kind:'signed',value:BigInt(at)})&&key(f(x,3n))===key(u(k+1)))!;return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(OPTIONS[i][k][0]))!,2n);};
it('observed commitment history changes prospective reliance in both directions',async()=>{
 const s=await run(),reverse=await run('reverse');
 expect(f(apps(s)[0],10n)).toEqual(list([]));expect(f(apps(s)[1],10n)).toEqual(list([q(1,1)]));expect(f(apps(s)[3],10n)).toEqual(list([q(1,2)]));
 expect([1,2,4,7].map(at=>probability(s,at,2))).toEqual([q(1,2),q(7,9),q(1,2),q(1,2)]);
 expect(f(apps(reverse)[1],10n)).toEqual(list([q(0,1)]));expect(f(apps(reverse)[3],10n)).toEqual(list([q(1,2)]));expect(probability(reverse,2,2)).toEqual(q(2,9));expect(probability(reverse,4,2)).toEqual(probability(s,4,2));
});
it('missing opportunity is not failure, and unknown differs from known zero',async()=>{
 const missing=await run('missing'),fulfilled=await run('fulfilled'),first=await run('noFirst'),unknown=await run('unknown');
 for(const s of [missing,fulfilled]){expect(f(apps(s)[3],10n)).toEqual(list([q(1,1)]));expect(probability(s,4,2)).toEqual(q(7,9));}
 expect(f(apps(first)[1],10n)).toEqual(list([]));expect(f(apps(first)[3],10n)).toEqual(list([q(0,1)]));expect(probability(first,4,2)).toEqual(q(2,9));
 expect(f(apps(unknown)[3],10n)).toEqual(list([]));expect(probability(unknown,4,2)).toEqual(q(1,2));
});
it('commitment intervention affects only its Split lens and consumer; task evidence stays separate',async()=>{
 const base=await run(),fulfilled=await run('fulfilled'),task=await run('taskGood');
 for(const k of [0,1,3]){expect(lenses(apps(base)[3])[k]).toEqual(lenses(apps(fulfilled)[3])[k]);expect(probability(base,4,k)).toEqual(probability(fulfilled,4,k));}
 expect(f(apps(base)[3],10n)).toEqual(f(apps(task)[3],10n));expect(probability(base,4,2)).toEqual(probability(task,4,2));
 for(const law of [2,3]){const a=await run('main',law),b=await run('taskGood',law);expect(probability(a,4,2)).not.toEqual(probability(b,4,2));}
 const a=await run('main',3),b=await run('fulfilled',3);expect(probability(a,4,2)).toEqual(probability(b,4,2));
},60000);
it('personal participation and target ownership govern the commitment history',async()=>{
 const base=await run(),witness=await run('witnessA'),other=await run('otherTarget');
 expect(f(apps(witness)[3],10n)).toEqual(list([]));expect(probability(witness,4,2)).toEqual(q(1,2));expect(f(apps(witness,1)[3],10n)).toEqual(f(apps(base,1)[3],10n));
 for(const person of [false,true])expect(base.r.snapshot().state.read(path(0,0,person))).toEqual(other.r.snapshot().state.read(path(0,0,person)));
 expect(apps(base).filter(a=>key(f(a,4n))===key(TARGETS[0]))).toEqual(apps(other).filter(a=>key(f(a,4n))===key(TARGETS[0])));
});
it('NoRetention and modifier-disabled controls distinguish learning from downstream use',async()=>{
 const base=await run(),no=await run('main',4),off=await run('main',1,2);
 expect(f(apps(no)[3],10n)).toEqual(list([]));expect(probability(no,2,2)).toEqual(q(1,2));
 for(const t of [1209n,1210n,1216n,1218n])expect(outputs(base,t)).toEqual(outputs(off,t));
 for(const at of [2,4,7])expect(probability(off,at,2)).toEqual(q(1,2));
});
it('whole later public views exclude hidden/denied/nonrecipient data, including later receipt',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const r=await createRelDimensionsRun(await prepareRelDimensionsModel(relDimensionsRecipe(law)),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 const base=await view('main');expect(await view('hiddenWorld')).toEqual(base);expect(await view('denied')).toEqual(base);expect((await view('noA'))[1]).toEqual(base[1]);expect((await view('noB'))[0]).toEqual(base[0]);expect(await view('main',5)).not.toEqual(await view('hiddenWorld',5));
},120000);
it('learning140 affects the next40/60 only and preserves historical observations and judgments',async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot().outputs.slice();while(await s.r.settle()){}expect(s.r.snapshot().outputs.slice(0,before.length)).toEqual(before);
 expect(f(apps(s)[2],10n)).toEqual(list([q(1,1)]));expect(f(apps(s)[3],10n)).toEqual(list([q(1,2)]));
 for(const [type,phase] of [[1216n,40n],[1217n,60n],[1209n,120n],[1218n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}
 expect(s.r.snapshot().randomAddresses).toEqual([]);
});
