import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,record,rational as q} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {applyStatePatch,AuthoritativeState} from '../substrate/state';
import {path,owner,roots,stages,eventId,writes,developmentRecipe} from '../campaign3/developmentPublicModel';
import {parseDevelopmentSave} from '../campaign3/developmentPublicCodecs';
import {dispositionPublicRecord as old} from '../campaign3/dispositionPublicCodecs';
import {prepareDevelopmentModel,createDevelopmentPublicRun,restoreDevelopmentPublicRun} from '../campaign3/developmentPublicFactory';
import {createDevelopmentRun} from '../campaign3/developmentComponent';
import {developmentPublicRows} from '../campaign3/developmentPublicProjection';
import {publicCase,publicInput,restoreInput,nativeRun,nativeRuntime} from './developmentPublicFixtures';
vi.setConfig({testTimeout:600000});
it('native component rows, actual bundles and random draws agree through the full primary program',async()=>{
 const c=publicCase(),s=await nativeRuntime(c),component=createDevelopmentRun(c.profile,c.frames);while(await s.runtime.settle()){}while(await component.step()){}
 expect(developmentPublicRows(s.runtime.snapshot().outputs)).toEqual(component.rows());
 const componentBundles=items(items(component.snapshot(),'list')[4],'list').flatMap(x=>items(x,'list'));
 const nativeBundles=s.runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1430n,1431n,1432n,1433n,1434n].includes(v.schema.typeId));expect(nativeBundles.map(key)).toEqual(componentBundles.map(key));
 const trace=s.runtime.snapshot().trace.map(v=>rec(v,160n));expect(trace.length).toBe(13*c.frames.length);expect(s.runtime.snapshot().randomAddresses.length).toBeGreaterThan(0);expect(new Set(s.runtime.snapshot().randomAddresses).size).toBe(s.runtime.snapshot().randomAddresses.length);
});
it('sole writers exclude all foreign mutations and every constitution writer',async()=>{
 const s=await nativeRuntime(publicCase('Main',1));for(const root of roots)for(const [writer] of stages){if(writes(writer).some(p=>p.rootStateTypeId===BigInt(root)))continue;const p=path(root),prior=s.input.state.read(p).value!;expect(()=>applyStatePatch(s.input.state,{operations:[{kind:'set',path:p,expected:{presence:true,value:prior},newValue:prior}]},owner(writer),s.model.authority)).toThrow();}
 const changed=new AuthoritativeState(s.input.state.entries().map(e=>e.path.rootStateTypeId===1457n?{...e,value:old(1453,[q(1,8)])}:e));expect(()=>s.model.validateState(changed)).toThrow();
});
it('closed source and whole-save admission reject mismatched identities, seeds and forged state',async()=>{
 const c=publicCase('Main',2),h=await prepareDevelopmentModel(c.source);await expect(createDevelopmentPublicRun({} as any,publicInput(c))).rejects.toThrow();await expect(prepareDevelopmentModel({...c.source,registry:enc(list([]))})).rejects.toThrow();await expect(createDevelopmentPublicRun(h,{...publicInput(c),runSeed:new Uint8Array(32).fill(1)})).rejects.toThrow();await expect(createDevelopmentPublicRun(h,{...publicInput(c),initialState:enc(old(1453,[q(1,8)]))})).rejects.toThrow();
 const run=await nativeRun(c);await run.settleNextInstant();const save=run.save(),parsed=parseDevelopmentSave(save),fields=new Map(parsed.fields);fields.set(11n,list([]));await expect(restoreDevelopmentPublicRun(c.source,restoreInput(c,enc(record(parsed.schema,fields))))).rejects.toThrow();await expect(restoreDevelopmentPublicRun(developmentRecipe({...c.profile,formation:false}),restoreInput(c,save))).rejects.toThrow();
 const restored=await restoreDevelopmentPublicRun(c.source,restoreInput(c,save));expect(restored.save()).toEqual(save);await restored.settleNextInstant();await run.settleNextInstant();expect(restored.save()).toEqual(run.save());
});
for(const stage of [...stages.map(([n])=>n),'commit'])it('native Failed rollback at reached '+stage,async()=>{
 const s=await nativeRuntime(publicCase('Main',2));await s.runtime.settle();const before=s.runtime.snapshot(),project=(v:typeof before)=>({...v,status:undefined,state:enc(v.state.canonicalValue())});let reached=false;
 await expect(s.runtime.settleForConformance({onBoundary(b,e){if(stage==='commit'?b==='before-commit':b==='after-trace-validation'&&e&&key(e.eventTypeId)===key(eventId(stage))){reached=true;throw Error('injected');}}})).rejects.toThrow();expect(reached).toBe(true);expect(s.runtime.snapshot().status).toBe('Failed');expect(project(s.runtime.snapshot())).toEqual(project(before));await expect(s.runtime.settle()).rejects.toThrow();
});
it('factory publication rejects in-flight reads and second calls without releasing the first barrier',async()=>{
 const run=await nativeRun(publicCase('Main',2)),first=run.settleNextInstant();for(const get of [run.save,run.snapshot,run.rows,run.characterProjection])expect(get).toThrow();await expect(run.settleNextInstant()).rejects.toThrow();expect(run.save).toThrow();await first;expect(run.save().length).toBeGreaterThan(0);
});
it('runtime publication barrier spans the commit microtask',async()=>{
 const s=await nativeRuntime(publicCase('Main',1)),reads:string[]=[];await s.runtime.settleForConformance({onBoundary(b){if(b==='before-commit')queueMicrotask(()=>{for(const get of [s.runtime.save,s.runtime.snapshot]){try{get();reads.push('ACCEPTED');}catch(e){reads.push(String(e));}}});}});expect(reads.length).toBe(2);expect(reads.every(x=>x.includes('not quiescent'))).toBe(true);
});
it('hidden physical outcomes never become admitted performance evidence',async()=>{
 const a=await nativeRun(publicCase('Physical0',2)),b=await nativeRun(publicCase('Physical8',2));while(await a.settleNextInstant()){}while(await b.settleNextInstant()){}expect(a.rows()[0].executed).not.toBe(b.rows()[0].executed);expect(a.characterProjection()).toEqual(b.characterProjection());
});
it('copies caller bytes and rejects wrong original event lineage',async()=>{
 const c=publicCase('Main',1),a=await nativeRun(c),b=await nativeRun(publicCase('Main',1));c.orderedInputs.fill(0);c.source.parameters.fill(0);await a.settleNextInstant();await b.settleNextInstant();expect(a.save()).toEqual(b.save());const output=a.snapshot().state;output.fill(0);expect(a.snapshot().state).not.toEqual(output);
 const s=await nativeRuntime(publicCase('Main',1));Object.assign(s.input.events[0],{payload:list([])});await expect(s.runtime.settle()).rejects.toThrow();expect(s.runtime.snapshot().status).toBe('Failed');
});
