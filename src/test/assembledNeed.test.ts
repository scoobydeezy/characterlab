import {it,expect,vi} from 'vitest';
import {start,through,decode,items,key,text,rec,f,at,q} from './fixtures/assembledNeed';
import {NEED,NEED_MOTIVE,NEED_CRITERION} from '../assembled/need';
import {readQ} from '../campaign2/cognitiveMath';
import {dataUnsigned as uint} from '../campaign2/canonicalData';
it('need221 primary direct pressure supports two actions without a task',async()=>{
 const x=await start();await through(x.run);const os=items(decode(x.run.snapshot().outputs),'list');
 const report=os.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(NEED)));expect(report).toBeDefined();
 const a=items(report!,'list');expect(key(a[2])).toBe(key(text('Positive')));expect(a[3]).toEqual(q(49,60));expect(items(a[7],'list')).toHaveLength(2);
 const d=os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&at(f(v,2n))===2n)!;expect(d).toBeDefined();
 const context=rec(f(rec(d,409n),3n),408n),raw=rec(f(context,2n),403n);expect(items(f(raw,7n),'list')).toHaveLength(2);expect(items(f(raw,3n),'set')).toHaveLength(0);
 const ns=items(f(context,3n),'list');expect(ns,'live Need nuclei before comparing probabilities').toHaveLength(2);
 for(const n of ns){const nk=rec(f(rec(n,407n),1n),404n);expect(f(nk,2n)).toEqual(NEED_MOTIVE);expect(f(nk,3n)).toEqual(NEED_CRITERION);expect(nk.schema.schemaVersion).toBe(3n);expect(readQ(f(rec(f(rec(n,407n),2n),406n),1n)).numerator).toBeGreaterThan(0n);}
 const result=rec(f(rec(d,409n),4n),419n);expect(uint(f(result,1n))).toBe(3n);const data=rec(f(result,2n),420n);expect(items(f(data,2n),'list').map(v=>f(rec(v,421n),2n))).toEqual([q(1,2),q(1,2)]);
 expect(os.some(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===433n),'actual physical execution').toBe(true);
 console.info('M221 PRIMARY PASS',ns.length,'Need nuclei; exact probabilities1/2,1/2; no task sources; ordinary execution');
},590000);

import {restorePreparedCharacterRun} from '../assembled/character';
import {validateDecisionView,NEED_DECISION_VIEW_VERSION} from '../assembled/decisionView';
import * as producer from '../assembled/need';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
export function capture(run:Awaited<ReturnType<typeof start>>['run']){
 const os=items(decode(run.snapshot().outputs),'list'),report=items(os.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(NEED)))!,'list');
 const d=rec(os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&at(f(v,2n))===2n)!,409n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list'),status=rec(f(d,4n),419n);
 return {os,report,d,context,raw,ns,status,need:raw.schema.schemaVersion===4n?items(f(raw,7n),'list'):[],prob:uint(f(status,1n))===3n?items(f(rec(f(status,2n),420n),2n),'list').map(v=>f(rec(v,421n),2n)):[]};
}
it('need221 response and evidence gates preserve zero versus unknown',async()=>{
 for(const [o,count,status] of [[{responses:1},1,'Positive'],[{responses:0},0,'Positive'],[{reserve:100},0,'KnownZero'],[{permitted:false},0,'Unavailable'],[{selected:false},0,'Unavailable']] as const){
  const x=await start(o);await through(x.run);const p=capture(x.run);expect(p.report[2]).toEqual(text(status));expect(p.need).toHaveLength(count);expect(p.ns).toHaveLength(count);
  if(count)expect(p.prob).toContainEqual(q(1,1));else expect(uint(f(p.status,1n))).not.toBe(3n);
  console.info('M221 GATE',JSON.stringify(o),status,'Need',count);
 }
},590000);
it('need221 psychological adoption and direct Need have independent grounds',async()=>{
 const both=await start({goals:true}),task=await start({goals:true,responses:0});await through(both.run);await through(task.run);const a=capture(both.run),b=capture(task.run);
 expect(a.need).toHaveLength(2);expect(b.need).toHaveLength(0);expect(items(f(a.raw,3n),'set').length,'live independently adopted task sources').toBeGreaterThan(0);
 const keys=a.ns.map(v=>rec(f(rec(v,407n),1n),404n)),need=keys.filter(k=>key(f(k,2n))===key(NEED_MOTIVE)),psych=keys.filter(k=>key(f(k,2n))!==key(NEED_MOTIVE));expect(need).toHaveLength(2);expect(psych.length).toBeGreaterThan(0);
 expect(need.some(n=>psych.some(t=>key(f(n,1n))===key(f(t,1n))&&key(f(n,3n))!==key(f(t,3n)))),'same action, independent motives/grounds').toBe(true);
 expect(a.prob,'captured production probabilities change with direct Need').not.toEqual(b.prob);
 expect(items(f(a.raw,3n),'set')).toEqual(items(f(b.raw,3n),'set'));
 for(const x of[both,task]){validateDecisionView(decode(x.run.decisionHistory()));validateDecisionView(decode(x.run.decisionPresentation()));}
 expect(items(decode(both.run.decisionHistory()),'list')[0]).toEqual(text(NEED_DECISION_VIEW_VERSION+'/history'));
 console.info('M221 JOINT PASS exact probabilities',a.prob,b.prob,'distinct Need/Commitment; task sources preserved');
},590000);
it('need221 hidden truth does not change pressure or reasons',async()=>{
 const a=await start({reserve:11,width:10}),b=await start({reserve:19,width:10});await through(a.run);await through(b.run);const x=capture(a.run),y=capture(b.run);
 expect(x.report).toEqual(y.report);expect(x.need).toEqual(y.need);expect(x.ns).toEqual(y.ns);expect(x.prob).toEqual(y.prob);
 console.info('M221 PRIVACY PASS levels11/19, same selected bin, exact Need/receiving/probabilities');
},590000);
it('need221 repeat full continuation and rollback preserve the shared run',async()=>{
 const a=await start(),b=await start();await through(a.run,1n);await through(b.run,1n);expect(a.run.save()).toEqual(b.run.save());const checkpoint=a.run.save();
 const restored=cachedMemory(await restorePreparedCharacterRun(a.m,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:checkpoint}));expect(restored.save()).toEqual(checkpoint);
 const raw=producer.needRaw;let hit=false;const before=b.run.snapshot(),spy=vi.spyOn(producer,'needRaw').mockImplementation((...args)=>{raw(...args);hit=true;throw Error('M221 after Need receiving');});
 try{await expect(b.run.settleNextInstant()).rejects.toThrow('M221 after Need receiving');expect(hit).toBe(true);for(const field of ['state','outputs','trace'] as const)expect(b.run.snapshot()[field]).toEqual(before[field]);expect(b.run.snapshot().clock).toBe(before.clock);}finally{spy.mockRestore();}
 let done=false;for(let n=0;n<32;n++){const more=await a.run.settleNextInstant();expect(await restored.settleNextInstant()).toBe(more);expect(restored.snapshot()).toEqual(a.run.snapshot());expect(restored.save()).toEqual(a.run.save());if(!more){done=true;break;}}expect(done).toBe(true);
 validateDecisionView(decode(a.run.decisionHistory()));validateDecisionView(decode(a.run.decisionPresentation()));
 console.info('M221 PERSISTENCE PASS repeat1; every full state/output/trace/save through terminal; rollback');
},590000);
