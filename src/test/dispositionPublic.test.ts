import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {applyStatePatch,AuthoritativeState} from '../substrate/state';
import {path,owner,stages,eventId,dispositionRecipe} from '../campaign3/dispositionPublicModel';
import {dispositionPublicRecord as r,parseDispositionSave} from '../campaign3/dispositionPublicCodecs';
import {prepareDispositionModel,createDispositionPublicRun,restoreDispositionPublicRun} from '../campaign3/dispositionPublicFactory';
import {createDispositionRun,dispositionRows} from '../campaign3/dispositionAdaptation';
import {nativeCase,nativeRun,nativeRuntime,publicInput,restoreInput,nativeRows,saveOutputs} from './dispositionPublicFixtures';
it('native phases preserve exact component expressions, journal, learning and decisions',async()=>{
 const c=nativeCase(),s=await nativeRuntime(c),component=createDispositionRun(c.profile,c.frames);while(await s.runtime.settle()){}while(await component.step()){}
 const expected=dispositionRows(component.snapshot()),actual=nativeRows(s.runtime.snapshot().outputs,c.frames);
 actual.forEach((row,i)=>{const {addresses,...old}=expected[i];if(!c.frames[i].active){old.state.constitution=null as any;old.state.effectiveBefore=null as any;}expect(row).toEqual(old);});
 expect(s.runtime.snapshot().randomAddresses).toEqual(expected.flatMap(r=>r.addresses));
 const ts=s.runtime.snapshot().trace.map(v=>rec(v,160n));expect(ts.length).toBe(180);for(let i=0;i<18;i++)expect(ts.slice(i*10,i*10+10).map(t=>f(rec(f(t,4n),130n),3n))).toEqual(stages.map(([,p])=>u(p)));
},600000);
it('all foreign writers and all constitution writers reject; Refold has no plastic leaf',async()=>{
 const s=await nativeRuntime();for(const root of [1436,1441,1457,1458])for(const writer of ['identity','execution','adapt']){if(root===1436&&writer==='identity'||root===1441&&writer==='execution'||root===1458&&writer==='adapt')continue;const p=path(root),prior=s.input.state.read(p).value!;expect(()=>applyStatePatch(s.input.state,{operations:[{kind:'set',path:p,expected:{presence:true,value:prior},newValue:prior}]},owner(writer),s.model.authority)).toThrow();}
 const refold=await nativeRuntime(nativeCase({name:'Main',law:'Refold',constitution:0}));expect(refold.input.state.read(path(1458)).presence).toBe(false);
 const changed=new AuthoritativeState(s.input.state.entries().map(e=>e.path.rootStateTypeId===1457n?{...e,value:r(1453,[q(1,8)])}:e));expect(()=>s.model.validateState(changed)).toThrow();
},600000);
it('closed model/initial/input/seed admission and whole-save forgery rejection',async()=>{
 const c=nativeCase(),h=await prepareDispositionModel(c.source);await expect(createDispositionPublicRun({} as any,publicInput(c))).rejects.toThrow();await expect(prepareDispositionModel({...c.source,registry:enc(list([]))})).rejects.toThrow();await expect(createDispositionPublicRun(h,{...publicInput(c),runSeed:new Uint8Array(32).fill(1)})).rejects.toThrow();await expect(createDispositionPublicRun(h,{...publicInput(c),initialState:enc(r(1454,[q(1,8)]))})).rejects.toThrow();
 const run=await nativeRun(c);await run.settleNextInstant();const save=run.save(),parsed=parseDispositionSave(save),fields=new Map(parsed.fields);fields.set(11n,list([]));await expect(restoreDispositionPublicRun(c.source,restoreInput(c,enc(record(parsed.schema,fields))))).rejects.toThrow();await expect(restoreDispositionPublicRun(dispositionRecipe({law:'Leaky',constitution:0}),restoreInput(c,save))).rejects.toThrow();
 const restored=await restoreDispositionPublicRun(c.source,restoreInput(c,save));expect(restored.save()).toEqual(save);await restored.settleNextInstant();await run.settleNextInstant();expect(restored.save()).toEqual(run.save());
},600000);
for(const stage of [...stages.map(([n])=>n),'commit'])it('native Failed rollback at reached '+stage,async()=>{
 const s=await nativeRuntime();await s.runtime.settle();const before=s.runtime.snapshot(),project=(v:typeof before)=>({...v,status:undefined,state:enc(v.state.canonicalValue())});let reached=false;
 await expect(s.runtime.settleForConformance({onBoundary(b,e){if(stage==='commit'?b==='before-commit':b==='after-trace-validation'&&e&&key(e.eventTypeId)===key(eventId(stage))){reached=true;throw Error('injected');}}})).rejects.toThrow();expect(reached).toBe(true);expect(s.runtime.snapshot().status).toBe('Failed');expect(project(s.runtime.snapshot())).toEqual(project(before));await expect(s.runtime.settle()).rejects.toThrow();
},600000);
it('quiescent publication rejects in-flight reads and concurrency without unlocking first caller',async()=>{
 const s=await nativeRuntime(),first=s.runtime.settle();expect(()=>s.runtime.save()).toThrow();expect(()=>s.runtime.snapshot()).toThrow();await expect(s.runtime.settle()).rejects.toThrow();expect(()=>s.runtime.save()).toThrow();await first;expect(s.runtime.snapshot().status).toBe('Active');expect(s.runtime.save().length).toBeGreaterThan(0);
},600000);
it('caller mutation cannot change copied inputs or outputs',async()=>{const c=nativeCase(),a=await nativeRun(c),b=await nativeRun();c.orderedInputs.fill(0);c.source.parameters.fill(0);c.runSeed.fill(1);await a.settleNextInstant();await b.settleNextInstant();expect(a.save()).toEqual(b.save());const bytes=a.snapshot().state;bytes.fill(0);expect(a.snapshot().state).not.toEqual(bytes);},600000);

it('whole-wrapper barrier spans scheduler commit through RNG-ledger publication',async()=>{const s=await nativeRuntime(),reads:string[]=[];const pending=s.runtime.settleForConformance({onBoundary(b){if(b==='before-commit')queueMicrotask(()=>{for(const get of [()=>s.runtime.save(),()=>s.runtime.snapshot()]){try{get();reads.push('ACCEPTED');}catch(e){reads.push(String(e));}}});}});await expect(s.runtime.settle()).rejects.toThrow('not quiescent');await pending;expect(reads).toHaveLength(2);expect(reads.every(s=>s.includes('not quiescent'))).toBe(true);},600000);
