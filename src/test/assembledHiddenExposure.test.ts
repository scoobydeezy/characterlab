import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import * as adaptation from '../campaign2/adaptationEvaluation';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {record,rational,set,unsigned as u,typedIdentifier as tid,type CanonicalValue} from '../substrate/canonicalEncoding';
import {CARRIER_OBSERVATION_RULES,CARRIER_OBSERVATION_REGISTRY} from '../assembled/model';
import {fixture,rec,f,items,key,decode,enc,list,text,signed,C} from './fixtures/assembledHiddenExposure';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const records=(r:Run)=>items(decode(r.snapshot().outputs),'list');
const of=(r:Run,n:bigint)=>records(r).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n);
const traces=(r:Run)=>items(decode(r.snapshot().trace),'list').map(v=>rec(v,160n));
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const name=(t:CanonicalValue)=>key(f(event(t),5n));
const named=(r:Run,n:string)=>traces(r).filter(t=>name(t)===key(tid(1001,text('event/'+n))));
const nonAdapt=(r:Run)=>key(list(state(r).entries().filter(e=>e.path.rootStateTypeId!==302n).map(e=>list([statePathValue(e.path),e.value]))));
const equal=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<32;n++){const more=await r.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(more);equal(r,p);}if(!more)return;}throw Error('M146 settle cap');}
const replace=(v:CanonicalValue,k:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[k,x]]));};
it('native146: hidden exposure reaches later permitted observation and actual episodic memory',async()=>{
 const bs=[fixture(0),fixture(1)],m=await prepareCharacterModel(bs[0].s),runs=await Promise.all(bs.map(b=>createCharacterRun(m,b.d)));
 const ids=runs.map(r=>rec(decode(r.runIdentity()),104n));for(const field of [1n,2n,4n])expect(key(f(ids[0],field))).toBe(key(f(ids[1],field)));expect(key(f(ids[0],3n))).not.toBe(key(f(ids[1],3n)));
 expect(runs[0].snapshot().state).toEqual(runs[1].snapshot().state);
 for(const r of runs)await through(r,2n);
 expect(nonAdapt(runs[0])).toBe(nonAdapt(runs[1]));
 const safe=(r:Run)=>key(list(records(r).filter(v=>typeof v==='boolean'||v.kind!=='record'||![307n,324n,325n].includes(v.schema.typeId))));expect(safe(runs[0])).toBe(safe(runs[1]));
 for(let i=0;i<2;i++){const r=runs[i],entries=state(r).entries().filter(e=>e.path.rootStateTypeId===302n);expect(entries.length).toBe(i?4:0);if(i)expect(entries.map(e=>e.path.fieldId).sort()).toEqual([1n,2n,3n,4n]);
  for(const v of of(r,325n))expect(key(f(rec(f(rec(v,325n),6n),327n),1n))).toBe(key(u(i?2:1)));
  expect(of(r,324n)).toHaveLength(1);expect(of(r,325n)).toHaveLength(4);expect(named(r,'authored-adaptation-fact')).toHaveLength(1);expect(named(r,'authored-regulatory-adaptation')).toHaveLength(1);
  const source=named(r,'authored-adaptation-fact')[0],adapt=named(r,'authored-regulatory-adaptation')[0];expect(items(f(source,11n),'list')).toHaveLength(0);expect(items(f(source,17n),'list')).toHaveLength(0);expect(items(f(adapt,17n),'list')).toHaveLength(i?4:0);expect(key(f(event(adapt),8n))).toBe(key(list([f(event(source),1n)])));
 }
 const repeat=await Promise.all(bs.map(b=>createCharacterRun(m,b.d)));for(const r of repeat)await through(r,2n);
 const restored=await Promise.all(bs.map((b,i)=>restoreCharacterRun(b.s,{...b.d,save:runs[i].save()})));
 for(let i=0;i<2;i++){equal(runs[i],repeat[i]);equal(runs[i],restored[i]);for(const r of [runs[i],repeat[i],restored[i]])await through(r,4n);equal(runs[i],repeat[i]);equal(runs[i],restored[i]);
  const obs=of(runs[i],203n);expect(obs).toHaveLength(1);expect(key(f(rec(f(rec(obs[0],203n),6n),204n),2n))).toBe(key(rational(BigInt(50+i),10n)));
  const intake=of(runs[i],337n),m1=of(runs[i],342n);expect(intake).toHaveLength(1);expect(m1).toHaveLength(1);expect(key(f(rec(intake[0],337n),2n))).toBe(key(obs[0]));expect(key(f(rec(m1[0],342n),2n))).toBe(key(intake[0]));
  const episodes=state(runs[i]).entries().filter(e=>e.path.rootStateTypeId===346n);expect(episodes).toHaveLength(1);expect(key(f(rec(episodes[0].value,345n),1n))).toBe(key(m1[0]));
  const read=items(f(named(runs[i],'regulatory-diagnostic-probe')[0],11n),'list');expect(read).toHaveLength(1);const path=rec(f(rec(read[0],147n),2n),140n);expect(key(f(path,1n))).toBe(key(u(302)));expect(key(f(path,2n))).toBe(key(u(3)));
  await finish(runs[i],[repeat[i],restored[i]]);expect(of(runs[i],352n)).toHaveLength(1);
 }
 const topology=(r:Run)=>key(list(traces(r).map(t=>{const e=event(t);return list([1n,2n,3n,4n,5n,7n,8n].map(k=>f(e,k)));})));expect(topology(runs[0])).toBe(topology(runs[1]));expect(traces(runs[0]).every(t=>items(f(t,14n),'list').length===0)).toBe(true);
 console.info('M146 NATIVE PASS count0/1; four live rules; cognitive state equal before reveal; later5 vs51/10 actual observation/intake/episode/recall; matched topology; repeat/save2/every later boundary exact');
},590000);
it('boundary146: hidden-without-probe equality, admission, source authenticity and restore tampering',async()=>{
 const b=fixture(0,false),m=await prepareCharacterModel(b.s),runs=await Promise.all([0,1].map(i=>createCharacterRun(m,fixture(i,false).d)));for(const r of runs)await finish(r);expect(nonAdapt(runs[0])).toBe(nonAdapt(runs[1]));expect(of(runs[0],203n)).toHaveLength(0);expect(of(runs[1],342n)).toHaveLength(0);
 const rows=items(decode(b.d.orderedInputs),'list'),a=items(rows[0],'list'),fact=f(rec(a[3],304n),1n);
 const bad=[list([signed(0),...a.slice(1)]),list([a[0],u(130),...a.slice(2)]),list([...a.slice(0,3),replace(a[3],1n,replace(fact,3n,signed(1))),a[4]]),list([...a.slice(0,3),replace(a[3],1n,replace(fact,1n,tid(1002,text('unknown-holder')))),a[4]])];
 for(const row of bad)await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([row]))})).rejects.toThrow();
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([rows[0],rows[0]]))})).rejects.toThrow();
 const old=await prepareCharacterModel({...b.s,rulesVersion:CARRIER_OBSERVATION_RULES,registrySchemaVersion:CARRIER_OBSERVATION_REGISTRY});await expect(createCharacterRun(old,b.d)).rejects.toThrow();
 const saved=await createCharacterRun(m,fixture(0).d);await through(saved,2n);await expect(restoreCharacterRun(b.s,{...fixture(1).d,save:saved.save()})).rejects.toThrow('commitments differ');
 const model=await compileCharacterModel(b.s),component=await compileCharacterState(model),inputs=await compileCharacterInputs(model,component,b.d),source=inputs.hiddenExposure!,event=source.events[0],instant=source.begin(2n);let allocations=0;const allocator={allocateRuntimeId:()=>BigInt(allocations++)};
 expect(()=>instant.execute({...event,eventId:event.eventId+1n},allocator)).toThrow();expect(()=>instant.execute({...event,eventSequence:event.eventSequence+1n},allocator)).toThrow();expect(allocations).toBe(0);instant.execute(event,allocator);expect(allocations).toBe(1);expect(()=>instant.execute(event,allocator)).toThrow();instant.close();expect(()=>instant.execute(event,allocator)).toThrow();
 console.info('M146 BOUNDARY PASS absent probe does not teach; wrong phase/time/holder/count/duplicate/version and changed manifest reject');
},590000);
it('rollback146: phase140 failure publishes no exposure or partial state and recovers exactly',async()=>{
 const b=fixture(1),m=await prepareCharacterModel(b.s),original=adaptation.compileAdaptationEvaluator;
 const spy=vi.spyOn(adaptation,'compileAdaptationEvaluator').mockImplementation((...args)=>{const engine=original(...args);return {...engine,prepare(...p:Parameters<typeof engine.prepare>){const prepared=engine.prepare(...p);return {...prepared,begin(...a:Parameters<typeof prepared.begin>){const batch=prepared.begin(...a);return {...batch,execute(...e:Parameters<typeof batch.execute>){batch.execute(...e);throw Error('M146 after genuine adaptation evaluation');}};}};}};});
 let before:ReturnType<Run['snapshot']>,save:Uint8Array;
 try{const r=await createCharacterRun(m,b.d);await through(r,1n);before=r.snapshot();save=r.save();await expect(r.settleNextInstant()).rejects.toThrow('M146 after genuine adaptation evaluation');expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(b.s,{...b.d,save:save!}),clean=await createCharacterRun(m,b.d);await through(clean,1n);equal(clean,restored);await finish(clean,[restored]);console.info('M146 ROLLBACK PASS full instant atomic; canonical saved continuation exact');
},590000);
