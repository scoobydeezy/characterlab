import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {VALUE_MOTIVE,VALUE_RECEIVING} from '../assembled/valueReceiving';
import {VALUES} from '../assembled/values';
import {receivingRecord as rec,decodeCognitive as decode} from '../assembled/codecs';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {text,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {source,data} from './fixtures/assembledValueReceiving';
import {fixture as currentFixture} from './fixtures/assembledDecisionHistory';
import {outputs,through,signedValue,type Run} from './fixtures/assembledComparison';
import {definition,correspondence,pooledControl} from './fixtures/assembledReasonCorrespondence';

function exact(a:Run,b:Run){
 const x=a.snapshot(),y=b.snapshot();expect([x.clock,x.status]).toEqual([y.clock,y.status]);
 for(const [p,z] of [...(['state','outputs','trace'] as const).map(k=>[x[k],y[k]]),[a.save(),b.save()],[a.runIdentity(),b.runIdentity()]]){
  expect(p.length).toBe(z.length);expect(p.every((v,i)=>v===z[i])).toBe(true);
 }
}
function capture(run:Run,at:bigint){
 const d=outputs(run.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===at);
 expect(d,'actual resolution').toBeDefined();
 const status=rec(f(d!,4n),419n);expect(uint(f(status,1n)),'live choice before comparison').toBe(3n);
 return {d:d!,context:f(d!,3n),choice:rec(f(status,2n),420n)};
}
const isValue=(n:CanonicalValue)=>rec(f(rec(n,407n),1n),404n).schema.schemaVersion===2n;
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
function executed(run:Run,decision:CanonicalValue){
 expect(outputs(run.snapshot().outputs,433n).some(o=>{
  const intent=rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n);
  return key(f(intent,2n))===key(decision);
 }),'actual chosen decision reaches execution').toBe(true);
}
it('M84 independent motives: actual learned sources match original compiler and affect decision probabilities',async()=>{
 // Exact retained M34 declarations: A/garden social, B non-social; no encounter
 // frames; permitted performance/disclosure inputs, body100/cap100/rate1; only
 // category linkage at3 differs; unchanged opportunities3/5/7 and outcome at3.
 const s=source(),d=data(true,0),other=data(false,0),compiled=await compileCharacterModel(s),model=await prepareCharacterModel(s);
 console.info('M84 SCENARIO '+JSON.stringify({version:s.rulesVersion,seed:0,body:compiled.body,initialReserve:100,socialTasks:['A','garden'],nonSocialTasks:['B'],encounterFrames:0,fixture:'unchanged M34 source/data; permitted performance/disclosure inputs; importance1'},(_,v)=>typeof v==='bigint'?v.toString():v));
 const a=await createCharacterRun(model,d),repeat=await createCharacterRun(model,d),b=await createCharacterRun(model,other);
 for(const r of [a,repeat,b])await through(r,3n);exact(a,repeat);
 const first=correspondence(capture(a,3n).context,definition(s));expect(first.native.filter(isValue)).toHaveLength(0);
 const resumed=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,resumed);
 for(const r of [a,resumed])await through(r,4n);exact(a,resumed);
 for(const r of [a,b,resumed])await through(r,5n);exact(a,resumed);
 const ac=capture(a,5n),bc=capture(b,5n),ap=correspondence(ac.context,definition(s)),bp=correspondence(bc.context,definition(s));
 expect(ap.native.filter(isValue)).toHaveLength(1);expect(bp.native.filter(isValue)).toHaveLength(0);
 const vk=rec(f(rec(ap.native.find(isValue)!,407n),1n),404n);
 expect(ap.native.filter(n=>{const k=rec(f(rec(n,407n),1n),404n);return !isValue(n)&&key(f(k,1n))===key(f(vk,1n))&&key(f(k,3n))===key(f(vk,3n));}),'live Commitment for exactly the same option and referent').toHaveLength(1);
 expect(ap.native.filter(n=>!isValue(n))).toEqual(bp.native);
 expect(reports(a,VALUE_MOTIVE)[1][6]).toEqual(q(1,2));expect(reports(b,VALUE_MOTIVE)[1][6]).toEqual(q(0,1));
 expect(f(ac.choice,2n)).not.toEqual(f(bc.choice,2n));executed(a,ac.d);executed(b,bc.d);
 const learning=reports(a,VALUES)[0];expect(learning).toBeDefined();expect(learning[4]).toEqual(q(1,2));
 const trace=outputs(a.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text(VALUE_RECEIVING))&&signedValue(f(rec(f(t,4n),130n),2n))===5n);
 expect(trace).toHaveLength(2);
 const raw=rec(f(rec(ac.context,408n),2n),403n);
 expect(trace.some(t=>key(f(t,13n))===key(raw)),'actual generated raw context consumed by compiler').toBe(true);
 pooledControl(ac.context,definition(s));
 console.info('M84 LIVE learned Value1/2 vs0; other nuclei identical; exact choice probability vectors differ; both choices executed; no seed-choice or shared-draw claim');
 while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await resumed.settleNextInstant());exact(a,resumed);}
 expect(await a.settleNextInstant()).toBe(false);expect(await resumed.settleNextInstant()).toBe(false);exact(a,resumed);
 console.info('M84 CONTINUATION repeat3; exact restore3 at4/5 and each remaining instant through terminal10, including state/output/trace/save/RNG');
},570000);

it('M84 current configuration: original compiler agrees on actual0.74 reasons and restored continuation',async()=>{
 // M82 quiet: three physical tasks, no social dependency; body30/cap100/rate10,
 // delivery90 at9, A/B importance3/5 urgency1 threat1/2, live channels, seed0.
 const b=currentFixture(true,true,'quiet'),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);
 console.info('M84 SCENARIO current0.74 quiet: physical A/B/third, body30/cap100/rate10, delivery90 at9; seed0; no social dependency');
 await through(run,9n);const resumed=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:run.save()});exact(run,resumed);
 for(const r of [run,resumed])await through(r,10n);exact(run,resumed);
 const c=capture(run,10n),mapped=correspondence(c.context,definition(b.s));
 expect(mapped.native).toHaveLength(2);expect(mapped.lanes[1].signals).toHaveLength(0);
 expect(correspondence(capture(resumed,10n).context,definition(b.s)).originals).toEqual(mapped.originals);executed(run,c.d);
 console.info('M84 CURRENT PASS 0.74 actual producer/compiler/decision/execution, exact restore9->10; Value lane inactive here, no current-version Value claim');
},570000);
