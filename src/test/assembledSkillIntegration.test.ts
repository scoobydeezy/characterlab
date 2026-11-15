import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,times,time,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,skillPath,skillValue,type Run,type CanonicalValue,type Profile} from './fixtures/assembledSkillIntegration';
import {SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {ACTION_BODY} from '../assembled/actionBody';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {expectationPath,expectationValue} from '../assembled/performanceExpectation';
import {VALUES_APPRAISAL} from '../assembled/values';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const traces=(r:Run)=>outputs(r.snapshot().trace,160n),event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const projection=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const atRows=(r:Run,at:number)=>traces(r).filter(t=>time(f(event(t),2n))===BigInt(at));
const reported=(r:Run,at:number,label:string)=>atRows(r,at).flatMap(projection).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const fraction=(v:Q|undefined)=>v?v.numerator+'/'+v.denominator:'unknown';
const belief=(r:Run,task:CanonicalValue)=>expectationValue(state(r).read(expectationPath(task,0n)).value);
async function through(r:Run,at:bigint){for(let i=0;r.snapshot().clock<at;i++){expect(i).toBeLessThan(64);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(a:Run,b?:Run){for(let i=0;i<64;i++){const more=await a.settleNextInstant();if(b){expect(await b.settleNextInstant()).toBe(more);exact(a,b);}if(!more){expect(a.snapshot().clock).toBe(101n);expect(a.diagnostic()).toBeUndefined();return;}}throw Error('settle cap64');}
function actual(r:Run,at:number){
 const matches=reported(r,at,SKILL_ACTUAL);expect(matches.length,'live actual skill assessment').toBeGreaterThan(0);
 const a=matches[0];for(const v of matches)expect(v).toEqual(a);
 const d=outputs(r.snapshot().outputs,409n).find(v=>time(f(v,2n))===BigInt(at))!;expect(d,'actual decision').toBeDefined();
 const status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'live chosen intent').toBe(3n);
 expect(f(rec(f(rec(f(status,2n),420n),1n),395n),2n)).toEqual(target);
 const body=reported(r,at,ACTION_BODY)[0];expect(body,'actual physical consumer').toBeDefined();expect(body[3]).toEqual(target);
 expect(body[5]).toEqual(text(a[7]===true?'Applied':'Blocked'));
 const executing=atRows(r,at).find(t=>uint(f(event(t),1n))===uint(a[1])&&items(f(t,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(skillPath(C,a[10])))));
 expect(executing,'actual procedure read').toBeDefined();
 return a;
}
function checkProbe(r:Run,at:number,K:Q,success:boolean,engaged=true){const a=actual(r,at);expect(a[3]).toEqual(q(K.numerator,K.denominator));expect(a[6]).toBe(engaged);expect(a[7]).toBe(success);return a;}
const typedAt=(r:Run,at:number,t:bigint)=>atRows(r,at).flatMap(projection).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t);
it('primary119: competence and confidence separate; temporary impairment recovers',async()=>{
 const runs=new Map<Profile,Run>(),snapshots=new Map<Profile,{intent:CanonicalValue[];expression:CanonicalValue[];plan:CanonicalValue[]}>();
 for(const profile of ['trained-negative','trained-positive','untrained-positive','impaired'] as const){
  const b=fixture(profile),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);
  await through(r,10n);checkProbe(r,10,Q.of(0n),false);
  expect(belief(r,b.tasks[0]).mean).toEqual(Q.of(profile.endsWith('positive')?1n:0n));
  await through(r,12n);checkProbe(r,12,Q.of(0n),false);
  const K=profile==='untrained-positive'?Q.of(0n):Q.of(1n,2n),retained=state(r).read(skillPath(C,b.procedure));
  expect(skillValue(retained.value,b.procedure)).toEqual({K,count:profile==='untrained-positive'?0n:1n});
  const confidence=belief(r,b.tasks[0]).mean;
  for(const at of [14,16,18]){
   await through(r,BigInt(at));checkProbe(r,at,K,profile!=='untrained-positive'&&!(profile==='impaired'&&at===16));
   expect(state(r).read(skillPath(C,b.procedure)),'impairment/recovery does not relearn').toEqual(retained);
   expect(belief(r,b.tasks[0]).mean,'hidden outcomes leave belief unchanged').toEqual(confidence);
  }
  const intent=typedAt(r,16,425n),expression=typedAt(r,16,426n),plan=typedAt(r,16,431n);
  for(const xs of [intent,expression,plan])expect(xs.length).toBeGreaterThan(0);
  snapshots.set(profile,{intent,expression,plan});
  await through(r,20n);checkProbe(r,20,K,profile!=='untrained-positive');
  expect(belief(r,b.tasks[0]).mean).toEqual(profile==='untrained-positive'?Q.of(7n,8n):profile==='trained-positive'?Q.of(1n):Q.of(1n,8n));
  const support=belief(r,b.tasks[0]).supports;expect(support).toHaveLength(2);expect(uint(items(items(support[1],'list')[0],'list')[2])).toBe(20n);
  await through(r,22n);checkProbe(r,22,K,profile!=='untrained-positive');
  const values=reports(r,VALUES_APPRAISAL).find(v=>uint(v[2])===22n)!;expect(values,'later actual appraisal consumer').toBeDefined();expect(values[6]).toEqual(q(belief(r,b.tasks[0]).mean!.numerator,belief(r,b.tasks[0]).mean!.denominator));
  await finish(r);await originalCorrespondence(r);runs.set(profile,r);
  console.info('M119 native '+JSON.stringify({profile,K:fraction(K),before:fraction(confidence),after:fraction(belief(r,b.tasks[0]).mean),success:times.map(t=>actual(r,t)[7]),terminal:String(r.snapshot().clock)}));
 }
 expect(snapshots.get('trained-negative'),'world-only intervention preserves whole intent/expression/plan bytes').toEqual(snapshots.get('impaired'));
 for(const profile of ['trained-negative','trained-positive','untrained-positive','impaired'] as const)expect(reports(runs.get(profile)!,PERFORMANCE_OBS).every(v=>[10n,20n].includes(uint(v[2])))).toBe(true);
 console.info('M119 PRIMARY PASS: acquired skill; false confidence; impairment/recovery; later observed correction');
},560000);
it('controls119: invisible feedback and blocked training preserve their separate boundaries',async()=>{
 for(const profile of ['hidden','blocked'] as const){const b=fixture(profile),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,12n);
  const K=profile==='hidden'?Q.of(1n,2n):Q.of(0n);checkProbe(r,12,Q.of(0n),false,profile!=='blocked');
  expect(skillValue(state(r).read(skillPath(C,b.procedure)).value,b.procedure).K).toEqual(K);
  await through(r,18n);checkProbe(r,18,K,profile==='hidden');
  if(profile==='hidden'){expect(belief(r,b.tasks[0]).mean).toBeUndefined();expect(reports(r,PERFORMANCE_OBS)).toHaveLength(0);}
  else expect(belief(r,b.tasks[0]).supports).toHaveLength(1);
  await finish(r);console.info('M119 CONTROL PASS '+profile);
 }
},390000);
it('persistence119: repeat and restore12 preserve trained impairment and recovery',async()=>{
 const b=fixture('impaired'),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d);
 await through(a,12n);await through(repeat,12n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 await finish(a,restored);await finish(repeat);exact(a,repeat);
 checkProbe(a,16,Q.of(1n,2n),false);checkProbe(a,18,Q.of(1n,2n),true);
 console.info('M119 PERSISTENCE PASS: full state/output/trace/save/identity through101');
},390000);

let originalAttempt:Promise<CanonicalValue>|undefined;
async function originalCorrespondence(r:Run){
 const {compileSkillModel,compileSkillInputs,skillRecipe,DEFAULT_SETTINGS}=await import('../campaign3/skillModel');
 const {createSkillRuntime}=await import('../campaign3/skillRuntime');
 const {skillInputs}=await import('./skillFixtures');
 const {skillRecord:old}=await import('../campaign3/skillCodecs');
 const {skillExecute}=await import('../campaign3/skillMath');
 const {unsigned}=await import('../substrate/canonicalEncoding');
 originalAttempt??=(async()=>{const m=await compileSkillModel(skillRecipe()),i=await compileSkillInputs(m,enc(m.initial.canonicalValue()),skillInputs([{at:1}]),new Uint8Array(32)),run=createSkillRuntime(m,i);while(await run.settle()){}return run.snapshot().outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===795n)!;})();
 const attempt=await originalAttempt;expect(attempt).toBeDefined();
 for(const [index,at] of times.entries()){const a=actual(r,at),src=old(783,[signed(index+1),a[4],a[5],a[6],a[8],false,unsigned(0)]),K=old(784,[a[3],unsigned(0)]),control=rec(skillExecute(DEFAULT_SETTINGS,attempt,src,K,undefined,f(rec(attempt,795n),1n)),796n);
  expect(f(control,6n)).toBe(a[6]);expect(f(control,7n)).toBe(a[7]);expect(f(control,8n)).toBe(a[8]);
 }
 console.info('M119 ORIGINAL EXECUTION PASS: seven actual native operand rows; time10..22 maps1..7; no native state injection');
}
