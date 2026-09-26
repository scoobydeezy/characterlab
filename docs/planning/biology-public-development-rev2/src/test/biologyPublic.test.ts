import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {biologyRecipe,initialBytes,orderedBytes,compileBiologyModel,compileBiologyInputs,STAGES,eventId,path,owner,join} from '../campaign3/biologyPublicModel';
import {createBiologyRuntime} from '../campaign3/biologyPublicRuntime';
import {prepareBiologyModel,createBiologyPublicRun,restoreBiologyPublicRun} from '../campaign3/biologyPublicFactory';
import {decodeBiologyPublic as decode,biologyPublicRecord as r} from '../campaign3/biologyPublicCodecs';
import {decodeDelayed} from '../campaign3/delayedCodecs';
import {value,data} from '../campaign3/biologyPublicData';
import {createBiologicalRun,type IntegrationLaw} from '../campaign3/biologicalIntegration';
import {applyStatePatch} from '../substrate/state';
import {biologicalScenarios} from './biologicalIntegrationFixtures';
import {matchedBiology,hiddenBiology} from './biologyPublicFixtures';
const seed=new Uint8Array(32).fill(7);
const records=(xs:readonly CanonicalValue[],type:number)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===BigInt(type)).map(v=>rec(v,BigInt(type)));
async function setup(name='main',law:IntegrationLaw='Full',length=12){const c=biologicalScenarios()[name],frames=c.frames.slice(0,length),source=biologyRecipe(law,c.config),initialState=initialBytes(c.config.initial),orderedInputs=orderedBytes(frames),model=await compileBiologyModel(source),input=await compileBiologyInputs(model,initialState,orderedInputs,seed);return {c,frames,source,initialState,orderedInputs,model,input,runtime:createBiologyRuntime(model,input)};}
it('native scheduled biology exactly retains qualified component choices, observations and body',async()=>{
 const s=await setup(),old=createBiologicalRun('Full',s.frames,s.c.config,7);
 while(await s.runtime.settle())await old.step();
 const out=s.runtime.snapshot().outputs,a=records(out,1411).map(v=>value<any>(f(v,3n))),choices=records(out,1414).map(v=>value<any>(f(v,4n)));
 expect(a.map(v=>v.before)).toEqual(old.snapshot().rows.map(v=>v.before));
 expect(choices.map(v=>v.chosen)).toEqual(old.snapshot().rows.map(v=>v.intent));
 expect(choices.map(v=>v.draws)).toEqual(old.snapshot().rows.map(v=>v.choice.draws));
 const state=s.runtime.snapshot().state;expect(join(value(f(rec(state.read(path(1422)).value!,1404n),1n)),value(f(rec(state.read(path(1423)).value!,1405n),1n)))).toEqual(old.snapshot().state);
 for(const [type,phase] of [[1414,60],[1415,70],[1416,80],[1417,100],[1418,110],[1419,120],[1420,140],[1421,140]])for(const t of s.runtime.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length))expect(f(rec(f(t,4n),130n),3n)).toEqual(u(phase));
},120000);
it('public prefix restore compares the whole native save and rejects tampering',async()=>{
 const s=await setup(),run=await createBiologyPublicRun(await prepareBiologyModel(s.source),{initialState:s.initialState,orderedInputs:s.orderedInputs,runSeed:seed});await run.settleNextInstant();const save=run.save();await run.settleNextInstant();const restored=await restoreBiologyPublicRun(s.source,{initialState:s.initialState,orderedInputs:s.orderedInputs,save});await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(11n,list([]));await expect(restoreBiologyPublicRun(s.source,{initialState:s.initialState,orderedInputs:s.orderedInputs,save:enc(record(saved.schema,fields))})).rejects.toThrow();expect(()=>run.observerView(1)).toThrow();expect(()=>decodeDelayed(initialBytes(s.c.config.initial))).toThrow();
},120000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it('whole rollback at '+stage,async()=>{
 const s=await setup();await s.runtime.settle();const before=s.runtime.snapshot();let reached=false;await expect(s.runtime.settleForConformance({onBoundary(b,e){if(stage==='commit'?b==='before-commit':b==='after-trace-validation'&&e&&key(e.eventTypeId)===key(eventId(stage))){reached=true;throw Error('fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.runtime.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['queue','outputs','trace','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.runtime.save()).toThrow();
},60000);
it('mutation registry refuses learning owner writes to physical or adaptation roots',async()=>{const s=await setup();for(const [root,type] of [[1422,1404],[1423,1405]])expect(()=>applyStatePatch(s.input.state,{operations:[{kind:'set',path:path(root),expected:{presence:true,value:s.input.state.read(path(root)).value!},newValue:r(type,[data({})])}]},owner('learn'),s.model.authority)).toThrow();});
async function publicCase(c:ReturnType<typeof matchedBiology>,s=7){const run=await createBiologyPublicRun(await prepareBiologyModel(biologyRecipe(c.law,c.config)),{initialState:initialBytes(c.config.initial),orderedInputs:orderedBytes(c.frames),runSeed:new Uint8Array(32).fill(s)});while(await run.settleNextInstant()){}return run;}
it('matched learned history and goals separate bodily dependence from cue access',async()=>{
 const on=await publicCase(matchedBiology()),off=await publicCase(matchedBiology('NoAdaptation')),noCue=await publicCase(matchedBiology('Full',false));
 const apps=(run:typeof on)=>records(items(decode(run.snapshot().outputs),'list'),1411).map(v=>value<any>(f(v,3n))),a=apps(on),b=apps(off),c=apps(noCue);
 expect(a[8].beliefs).toEqual(b[8].beliefs);expect(a[8].habit).toEqual(b[8].habit);expect(a[8].goals).toEqual(b[8].goals);expect(a[8].before.withdrawalReward).toBeGreaterThan(b[8].before.withdrawalReward);
 expect(a[8].beliefs.drug.harm).toBe(b[8].beliefs.drug.harm);expect(a[8].options).toContain('drug');expect(c[8].options).not.toContain('drug');expect(c[8].before.withdrawalReward).toBe(a[8].before.withdrawalReward);
 const decisions=(run:typeof on)=>records(items(decode(run.snapshot().outputs),'list'),1414).map(v=>value<any>(f(v,4n)));expect(decisions(on)[8].probabilities).not.toEqual(decisions(off)[8].probabilities);expect(decisions(on)[8].chosen).toBe('drug');expect(decisions(off)[8].chosen).toBe('withhold');
},120000);
it('hidden execution/body changes preserve entire later observer view under identical denied sensing',async()=>{const a=await publicCase(hiddenBiology()),b=await publicCase(hiddenBiology(true));expect(a.observerView()).toEqual(b.observerView());expect(a.snapshot().state).not.toEqual(b.snapshot().state);},120000);
it('rejects model callbacks, unknown fields, forged handles, incorrect source roles and edited originals',async()=>{
 const s=await setup(),source=biologyRecipe();let called=false;await expect(prepareBiologyModel(Object.defineProperty({},'parameters',{get(){called=true;return source.parameters;}}) as typeof source)).rejects.toThrow();expect(called).toBe(false);
 const frames=structuredClone(s.frames);Object.assign(frames[0],{hiddenTruth:true});await expect(compileBiologyInputs(s.model,s.initialState,orderedBytes(frames),seed)).rejects.toThrow('EXACT_FIELDS');await expect(createBiologyPublicRun({} as any,{initialState:s.initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow('MODEL_HANDLE');
 while(await s.runtime.settle()){}const sourceRecord=records(s.runtime.snapshot().outputs,1412)[0],fields=new Map(sourceRecord.fields);fields.set(3n,u(1));expect(()=>decode(enc(record(sourceRecord.schema,fields)))).toThrow('source role');
 const altered=structuredClone(s.frames);altered[0].receipt=false;await expect(restoreBiologyPublicRun(s.source,{initialState:s.initialState,orderedInputs:orderedBytes(altered),save:s.runtime.save()})).rejects.toThrow('SAVE_IDENTITY');
},120000);
it('rolls back contested free-choice RNG and preserves immutable earlier expression',async()=>{const s=await setup();for(let i=0;i<8;i++)await s.runtime.settle();const before=s.runtime.snapshot();await expect(s.runtime.settleForConformance({onBoundary(b,e){if(b==='after-trace-validation'&&e?.phase===60n)throw Error('after contested draw');}})).rejects.toThrow();expect(s.runtime.snapshot().randomAddresses).toEqual(before.randomAddresses);expect(s.runtime.snapshot().outputs).toEqual(before.outputs);},120000);
