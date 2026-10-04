import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {applyStatePatch} from '../substrate/state';
import {valuesRecipe,valuesInitial,valuesOrdered,compileValuesModel,compileValuesInputs,path,sid,stages,eventId,type ValuesFrame} from '../campaign3/valuesPublicModel';
import {prepareValuesModel,createValuesPublicRun,restoreValuesPublicRun} from '../campaign3/valuesPublicFactory';
import {createValuesPublicRuntime} from '../campaign3/valuesPublicRuntime';
import {valuesPublicRows} from '../campaign3/valuesPublicMath';
import {parseValuesSave} from '../campaign3/valuesPublicCodecs';
import {createValuesOwner,VALUE_LAWS,type ValueLaw} from '../campaign3/valuesComponent';
import {receiveValues} from '../campaign3/valuesReceiving';
function frames():ValuesFrame[]{return [1,2,3,4,5,64,65].map(instant=>({instant,receipt:instant<=4?{instant,id:instant,category:'Care',target:'A',outcome:instant===4?-1:1}:null,probe:{instant,seed:1,currentNeed:0,goal:1,linked:true,mode:'ValuesOnly'}}));}
const input=(xs=frames())=>({initialState:valuesInitial(),orderedInputs:valuesOrdered(xs),runSeed:new Uint8Array(32)});
async function native(law:ValueLaw='Accumulated',xs=frames()){const model=await compileValuesModel(valuesRecipe(law)),i=input(xs),compiled=await compileValuesInputs(model,i.initialState,i.orderedInputs,i.runSeed);return {model,compiled,runtime:createValuesPublicRuntime(model,compiled)};}
it('four laws reproduce component reasons/resolutions and prospective projections through actual native stages',async()=>{
 for(const law of VALUE_LAWS){const xs=frames(),n=await native(law,xs),o=createValuesOwner(law),addresses:string[]=[];
  for(const x of xs){const expected=await receiveValues(o,x.probe!);await n.runtime.settle();const actual=valuesPublicRows(n.runtime.snapshot().outputs).at(-1)!;expect(actual.view).toEqual(expected.view);expect(key(actual.reason)).toBe(key(expected.reason));expect(key(actual.resolution)).toBe(key(expected.resolution));addresses.push(...expected.addresses);if(x.receipt)o.admit(x.receipt);}
  expect(n.runtime.snapshot().randomAddresses).toEqual(addresses);const traces=n.runtime.snapshot().trace.map(v=>rec(v,160n));expect(traces.length).toBe(xs.length*4);expect(traces.slice(0,4).map(t=>f(rec(f(t,4n),130n),3n))).toEqual(stages.map(([,phase])=>u(phase)));
  expect(n.compiled.state.read(path(1517)).presence).toBe(law!=='Refold');
 }
},600000);
it('public Save132 restores every prefix and its next exact native save',async()=>{
 const source=valuesRecipe('Accumulated'),i=input(),run=await createValuesPublicRun(await prepareValuesModel(source),i);
 for(let prefix=0;prefix<=frames().length;prefix++){const saved=run.save();expect(parseValuesSave(saved).schema.typeId).toBe(132n);const restored=await restoreValuesPublicRun(source,{initialState:i.initialState,orderedInputs:i.orderedInputs,save:saved});expect(restored.save()).toEqual(saved);if(prefix<frames().length){await restored.settleNextInstant();await run.settleNextInstant();expect(restored.save()).toEqual(run.save());}else expect(await restored.settleNextInstant()).toBe(false);}
},600000);
it('wrong authority and altered registry/input/initial seed reject',async()=>{
 const n=await native();for(const root of [1516,1517]){const p=path(root),prior=n.compiled.state.read(p).value!;expect(()=>applyStatePatch(n.compiled.state,{operations:[{kind:'set',path:p,expected:{presence:true,value:prior},newValue:prior}]},sid(1025,'authority/values/choice'),n.model.authority)).toThrow();}
 await expect(prepareValuesModel({...valuesRecipe('Accumulated'),registry:enc(list([]))})).rejects.toThrow();await expect(createValuesPublicRun(await prepareValuesModel(valuesRecipe('Accumulated')),{...input(),runSeed:new Uint8Array(32).fill(1)})).rejects.toThrow();const xs=frames();xs[0].probe!.instant=2;expect(()=>valuesOrdered(xs)).toThrow('TIME');expect(()=>valuesOrdered([{...frames()[0],truth:1} as any])).toThrow('FIELDS');
},600000);
it('forged save and changed original reject even when source shape remains valid',async()=>{
 const source=valuesRecipe('Accumulated'),i=input(),run=await createValuesPublicRun(await prepareValuesModel(source),i);await run.settleNextInstant();const saved=parseValuesSave(run.save()),fields=new Map(saved.fields);fields.set(11n,list([]));await expect(restoreValuesPublicRun(source,{initialState:i.initialState,orderedInputs:i.orderedInputs,save:enc(record(saved.schema,fields))})).rejects.toThrow();const xs=frames();xs[0].receipt!.outcome=-1;await expect(restoreValuesPublicRun(source,{initialState:i.initialState,orderedInputs:valuesOrdered(xs),save:run.save()})).rejects.toThrow();
},600000);
for(const stage of [...stages.map(([n])=>n),'commit'])it('native rollback retains state, queue and RNG at '+stage,async()=>{
 const n=await native();await n.runtime.settle();const before=n.runtime.snapshot(),project=(s:typeof before)=>({...s,status:undefined,state:enc(s.state.canonicalValue())});let reached=false;
 await expect(n.runtime.settleForConformance({onBoundary(b,e){if(stage==='commit'?b==='before-commit':b==='after-trace-validation'&&e&&key(e.eventTypeId)===key(eventId(stage))){reached=true;throw Error('injected');}}})).rejects.toThrow();expect(reached).toBe(true);expect(n.runtime.snapshot().status).toBe('Failed');expect(project(n.runtime.snapshot())).toEqual(project(before));
},600000);
it('public publication rejects in-flight reads/concurrent settlement and preserves caller ownership',async()=>{
 const source=valuesRecipe('Accumulated'),i=input(),run=await createValuesPublicRun(await prepareValuesModel(source),i);i.orderedInputs.fill(0);source.parameters.fill(0);const pending=run.settleNextInstant();expect(()=>run.save()).toThrow();expect(()=>run.rows()).toThrow();expect(()=>run.characterProjection()).toThrow();await expect(run.settleNextInstant()).rejects.toThrow();await pending;expect(run.rows()[0].view.mean).toBeNull();const bytes=run.snapshot().state;bytes.fill(0);expect(run.snapshot().state).not.toEqual(bytes);
},600000);
it('runtime publication covers the commit microtask through RNG publication',async()=>{
 const n=await native(),seen:string[]=[];const pending=n.runtime.settleForConformance({onBoundary(b){if(b==='before-commit')queueMicrotask(()=>{for(const get of [()=>n.runtime.save(),()=>n.runtime.snapshot()])try{get();seen.push('accepted');}catch(e){seen.push(String(e));}});await expect(n.runtime.settle()).rejects.toThrow('not quiescent');await pending;expect(seen).toHaveLength(2);expect(seen.every(s=>s.includes('not quiescent'))).toBe(true);
},600000);
it('duplicates are no-op evidence and blank probe branches do not manufacture choices',async()=>{
 const xs=frames().slice(0,3);xs[1].receipt={...xs[0].receipt!};xs[1].probe=null;const n=await native('Accumulated',xs);while(await n.runtime.settle()){}const rows=valuesPublicRows(n.runtime.snapshot().outputs);expect(rows).toHaveLength(2);expect(rows[1].view.count).toBe(1);const bad=frames().slice(0,2);bad[1].receipt={...bad[0].receipt!,outcome:-1};expect(()=>valuesOrdered(bad)).toThrow('CONFLICT');
},600000);
