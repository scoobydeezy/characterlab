import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,time,rec,f,uint,items,key,decode,enc,list,text,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledHabitReversal';
import {habitJournal,habitPath,rewardPath,rewardValue,cueStrength,HABIT_OPTIONS,HABIT_OBS} from '../assembled/habit';
import {ACTION_BODY} from '../assembled/actionBody';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const journal=(r:Run)=>habitJournal(state(r).read(habitPath(C)).value);
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const habit=(r:Run,at:bigint)=>reports(r,HABIT_OPTIONS).find(v=>uint(v[1])===at)!;
const fraction=(v:Q)=>v.numerator+'/'+v.denominator;
const traces=(r:Run)=>outputs(r.snapshot().trace,160n);
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const projection=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
const contributors=(r:Run)=>state(r).entries().filter(e=>[302n,455n,785n,1500n,1503n,415n].includes(e.path.rootStateTypeId));
async function through(r:Run,at:bigint){for(let i=0;r.snapshot().clock<at;i++){expect(i).toBeLessThan(64);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(a:Run,b?:Run){for(let i=0;i<64;i++){const next=await a.settleNextInstant();if(b){expect(await b.settleNextInstant()).toBe(next);exact(a,b);}if(!next){expect(a.diagnostic()).toBeUndefined();return;}}throw Error('settle cap64');}
function inspect(r:Run,at=18n){
 const h=habit(r,at);expect(h,'live habit candidate evaluation').toBeDefined();
 const d=outputs(r.snapshot().outputs,409n).find(v=>time(f(v,2n))===at)!;
 expect(d,'live native resolution').toBeDefined();
 const reason=rec(f(d,3n),408n),ns=items(f(reason,3n),'list'),status=rec(f(d,4n),419n);
 expect(ns.length,'live reasons').toBeGreaterThan(0);expect(uint(f(status,1n)),'chosen native decision').toBe(3n);
 const data=rec(f(status,2n),420n),probabilities=items(f(data,2n),'list').map(v=>rec(v,421n));
 expect(probabilities.reduce((sum,p)=>sum.add(readQ(f(p,2n))),Q.of(0n))).toEqual(Q.of(1n));
 const row=probabilities.find(p=>key(f(rec(f(p,1n),395n),2n))===key(target)),probability=row?readQ(f(row,2n)):Q.of(0n);
 const planner=reports(r,STRATEGY_EVAL).find(v=>uint(v[2])===at)!;
 expect(planner,'live retained planner').toBeDefined();
 const tasks=items(planner[3],'list').map(v=>items(v,'list'));expect(tasks.length).toBeGreaterThan(0);
 for(const t of tasks){expect(uint(t[1]),'retained B').toBe(1n);for(const a of items(t[2],'list'))expect(items(a,'list')[0]).toEqual(text('KnownAvailable'));}
 const produced=traces(r).find(t=>time(f(event(t),2n))===at&&projection(t).some(v=>key(v)===key(list(h))))!;
 expect(produced,'habit report actual producer').toBeDefined();
 const reads=items(f(produced,11n),'list').map(v=>f(rec(v,147n),2n));
 for(const p of [habitPath(C),rewardPath(C)])expect(reads).toContainEqual(statePathValue(p));
 for(const observation of journal(r)){
  expect(reports(r,HABIT_OBS).map(list)).toContainEqual(observation);
  const at=uint(items(observation,'list')[2]),physical=traces(r).filter(t=>time(f(event(t),2n))===at&&uint(f(event(t),3n))===110n).flatMap(projection).find(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(ACTION_BODY)));
  expect(physical,'actual performed action before learning').toBeDefined();expect(items(physical!,'list')[3]).toEqual(target);expect(items(physical!,'list')[5]).toEqual(text('Applied'));
 }
 console.info('M118 observed '+JSON.stringify({at:String(at),history:journal(r).map(v=>({at:String(uint(items(v,'list')[2])),positive:items(v,'list')[5]})),strength:fraction(readQ(h[3])),admitted:h[5],offered:items(h[6],'list').length,nuclei:ns.length,targetProbability:fraction(probability)}));
 return {h,d,ns,data,probability};
}
it('primary118: current reference acquires, retains and reverses a real habit',async()=>{
 let before:ReturnType<typeof contributors>|undefined;
 for(const profile of ['trained','untrained','reversed'] as const){
  const b=fixture(profile),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,15n);
  const controlled=contributors(r);expect(controlled.length).toBeGreaterThan(0);if(before)expect(controlled,'same body/adaptation/skill/development/identity before probe').toEqual(before);else before=controlled;
  expect(rewardValue(state(r).read(rewardPath(C)).value)).toMatchObject({positive:false,at:15n});
  await through(r,18n);const p=inspect(r);
  expect(cueStrength(journal(r),true)).toEqual(profile==='trained'?Q.of(3n,4n):profile==='reversed'?Q.of(3n,8n):Q.of(0n));
  expect(p.h[5]).toBe(profile==='trained');if(profile==='trained'){expect(items(p.h[6],'list').length).toBeGreaterThan(0);expect(p.probability.compare(Q.of(0n))).toBeGreaterThan(0);}else{expect(items(p.h[6],'list')).toHaveLength(0);expect(p.probability).toEqual(Q.of(0n));}
  await through(r,20n);const later=inspect(r,20n);expect(later.h[5]).toBe(profile==='trained');if(profile==='trained')expect(later.probability.compare(Q.of(0n))).toBeGreaterThan(0);else expect(later.probability).toEqual(Q.of(0n));
  await finish(r);console.info('M118 primary '+profile+' exhausted '+r.snapshot().clock);
 }
},560000);
it('cues118: untrained or unseen cue cannot retrieve the trained habit',async()=>{
 for(const profile of ['other-cue','unseen-cue'] as const){const b=fixture(profile),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,18n);const p=inspect(r);
  expect(cueStrength(journal(r),true)).toEqual(Q.of(3n,4n));expect(p.h[3]).toEqual(q(0,1));expect(p.h[5]).toBe(false);expect(p.probability).toEqual(Q.of(0n));await finish(r);
 }
},450000);
it('hidden118: physical reward cannot bypass identical permitted reports',async()=>{
 const runs:Run[]=[];
 for(const amount of [0,10]){const b=fixture('trained',amount,true),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,18n);inspect(r);runs.push(r);}
 expect(reports(runs[0],HABIT_OBS)).toEqual(reports(runs[1],HABIT_OBS));
 expect(journal(runs[0])).toEqual(journal(runs[1]));
 const dice=runs.map(r=>traces(r).flatMap(t=>items(f(t,14n),'list')));expect(dice[0].length,'real common draws').toBeGreaterThan(0);expect(dice[0]).toEqual(dice[1]);console.info('M118 hidden matched draws '+dice[0].length);
 expect(outputs(runs[0].snapshot().outputs,409n)).toEqual(outputs(runs[1].snapshot().outputs,409n));
 expect(state(runs[0]).entries().filter(e=>e.path.rootStateTypeId===455n)).not.toEqual(state(runs[1]).entries().filter(e=>e.path.rootStateTypeId===455n));
 for(const r of runs)await finish(r);
 console.info('M118 hidden truth: distinct physical gains; equal observations/history/all resolutions');
},450000);
it('persistence118: exact repeat and restore15 preserve whole continuation',async()=>{
 const b=fixture('reversed'),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d);
 await through(a,15n);await through(repeat,15n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 await finish(a,restored);await finish(repeat);exact(a,repeat);inspect(a);
 console.info('M118 repeat/restore15 whole state/output/trace/save/identity through '+a.snapshot().clock);
},390000);

it('original118: matched histories preserve the original alternative candidates',async()=>{
 const {compileHabitModel,compileHabitInputs,habitRecipe,OPTIONS}=await import('../campaign3/habitModel');
 const {createHabitRuntime}=await import('../campaign3/habitRuntime');
 const {habitInputs}=await import('./habitFixtures');
 const probabilities=new Map<string,string[]>();
 for(const law of [1,2,3])for(const candidate of [1,2,3,4])for(const profile of ['trained','untrained','reversed']){
  const positive=profile!=='untrained',source=habitRecipe({law,candidate}),model=await compileHabitModel(source);
  const xs=[{at:10,mode:1,reward:true,report:positive?1:2},{at:12,mode:1,reward:true,report:positive?1:2},{at:14,mode:1,reward:true,visible:profile==='reversed',report:2},{at:15,mode:3,reward:false},...([18,20].map(at=>({at,mode:2,reward:true,visible:false})))];
  const input=await compileHabitInputs(model,enc(model.initial.canonicalValue()),habitInputs(xs),new Uint8Array(32)),run=createHabitRuntime(model,input);
  let n=0;while(await run.settle())expect(++n).toBeLessThan(64);
  const out=run.snapshot().outputs,decisions=out.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===830n).map(v=>rec(v,830n));
  const p=decisions.slice(-2).map(d=>{const row=items(f(d,4n),'list').map(v=>rec(v,421n)).find(v=>key(f(v,1n))===key(OPTIONS[0]));return row?fraction(readQ(f(row,2n))):'0/1';});
  probabilities.set(law+'/'+candidate+'/'+profile,p);
  if(law===1&&candidate===1)expect(p).toEqual(profile==='trained'?['1/2','1/2']:['0/1','0/1']);
 }
 for(const law of [1,2,3])for(const profile of ['trained','untrained','reversed'])expect(probabilities.get(law+'/1/'+profile)).toEqual(probabilities.get(law+'/2/'+profile));
 expect(probabilities.get('1/1/trained')).not.toEqual(probabilities.get('1/3/trained'));
 expect(probabilities.get('1/1/untrained')).not.toEqual(probabilities.get('1/4/untrained'));
 console.info('M118 ORIGINAL matched matrix PASS '+JSON.stringify(Object.fromEntries(probabilities)));
},115000);
