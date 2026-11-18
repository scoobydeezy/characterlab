import {it,expect} from 'vitest';
import {current,items,list} from './fixtures/assembledDefiningControls';
import {text,exact} from './fixtures/assembledDefining';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {live17,live4000,focal,report,reports,state,through,finish,type Run} from './assembledDefining.test';
import {GOAL_MEANING,SPATIAL_MEANING} from '../assembled/goalMeaning';
import {RETAINED_ATTRIBUTION} from '../assembled/retainedAttribution';
import {SIGNIFICANCE,named,directions} from '../assembled/significance';
import {RECALL} from '../assembled/memory';
// Physical tasks/no people; body30/rate10/width1; four perceived trials; seed0.
// Original17/18..30/3998/3999/4000/5001 sequence, recall16/workspace20.
// No learned S0. Delivery permission false; High/Low/Absent and AgeOnly as declared.
async function start(mode:Parameters<typeof current>[0]='High',law='SignificanceFirst',hidden=false){
 const b=current(mode,law,hidden),m=await prepareCharacterModel(b.s);return {b,m,run:await createCharacterRun(m,b.d)};
}
const memory=(r:Run)=>state(r).entries().filter(e=>e.path.rootStateTypeId===346n);
const safe=(r:Run)=>[RECALL,RETAINED_ATTRIBUTION,GOAL_MEANING,SIGNIFICANCE,SPATIAL_MEANING].map(tag=>reports(r,tag));
it('direction164: actual deterioration protects old memory with exact save17 continuation',async()=>{
 const a=await start('Low');await through(a.run,17n);
 const meaning=live17(a.run,'Low');expect(named(meaning[5],'direction')).toEqual(text('MovingFarther'));
 const old=focal(a.run)!;expect(directions(items(old.value,'list')[7])).toEqual(['MovingFarther']);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 console.info('M164 LOW17 live Supported/Assessed deterioration, acquired MovingFarther; exact save17');
 let saw=false;
 for(let n=0;n<192;n++){const more=await a.run.settleNextInstant();expect(await restored.settleNextInstant()).toBe(more);exact(a.run,restored);expect(a.run.runIdentity()).toEqual(restored.runIdentity());
  if(a.run.snapshot().clock===4000n){for(const r of [a.run,restored]){live4000(r,true);expect(focal(r)!.value).toEqual(old.value);}saw=true;}
  if(!more){expect(saw).toBe(true);expect(a.run.snapshot().clock).toBe(5001n);console.info('M164 DIRECTION PASS old15 MovingFarther credit survives, actual15/3999 recall -> MovingFarther4000; immutable content; every later canonical boundary/save/identity exact through5001');return;}
 }throw Error('M164 continuation cap');
},590000);
it('nulls164: absent goal differs from credited AgeOnly yet neither protects old15',async()=>{
 const absent=await start('Absent'),age=await start('High','AgeOnly');
 for(const x of [absent,age])await through(x.run,17n);
 const m=live17(absent.run,'Absent');expect(named(m[5],'kind')).toEqual(text('QualificationUnavailable'));expect(named(named(m[5],'assessment'),'kind')).toEqual(text('Unavailable'));
 expect(directions(items(focal(absent.run)!.value,'list')[7])).toEqual([]);
 expect(named(live17(age.run)[5],'direction')).toEqual(text('MovingCloser'));expect(directions(items(focal(age.run)!.value,'list')[7])).toEqual(['MovingCloser']);
 console.info('M164 NULL17 actual Supported attribution in both; absent goal unavailable/no credit; AgeOnly receives actual MovingCloser credit');
 for(const x of [absent,age]){await through(x.run,4000n);live4000(x.run,false);expect(focal(x.run)).toBeUndefined();}
 expect(report(absent.run,SPATIAL_MEANING,4000)[2]).toEqual(report(age.run,SPATIAL_MEANING,4000)[2]);
 for(const x of [absent,age]){await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);}
 console.info('M164 NULLS PASS absent and AgeOnly both lose15, actual3998/3999 recall -> SameDistance4000; equal spatial goal; queues5001. M163 High/Wide retained as reference/known-neutral controls.');
},590000);
it('privacy164: hidden reserve changes do not change acquired defining memory or live appraisal',async()=>{
 const a=await start(),b=await start('High','SignificanceFirst',true);
 expect(a.b.s).toEqual(b.b.s);expect(a.b.d.orderedInputs).toEqual(b.b.d.orderedInputs);expect(a.b.d.runSeed).toEqual(b.b.d.runSeed);expect(a.b.d.initialState).not.toEqual(b.b.d.initialState);
 for(const x of [a,b]){await through(x.run,17n);expect(named(live17(x.run)[5],'direction')).toEqual(text('MovingCloser'));}
 expect(memory(a.run)).toEqual(memory(b.run));expect(safe(a.run)).toEqual(safe(b.run));
 for(const x of [a,b]){await through(x.run,4000n);live4000(x.run,true);}
 expect(memory(a.run)).toEqual(memory(b.run));expect(safe(a.run)).toEqual(safe(b.run));
 for(const x of [a,b]){await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);}
 expect(memory(a.run)).toEqual(memory(b.run));expect(safe(a.run)).toEqual(safe(b.run));
 console.info('M164 PRIVACY PASS initial body30/30.5 differs; whole acquired-memory and named cumulative recall/attribution/goal/significance/spatial reports equal17/4000/5001; actual15/3999 consumed; physical state/trace/identity excluded explicitly.');
},590000);
