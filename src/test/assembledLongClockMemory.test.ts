import {it,expect} from 'vitest';
import {fixture,items,key,signed,text,exact,enc,list,decode} from './fixtures/assembledDefining';
import {LONG_CLOCK_RULES,LONG_CLOCK_REGISTRY} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {live17,live4000,focal,report,state,through,finish} from './assembledDefining.test';
import {SPATIAL_MEANING} from '../assembled/goalMeaning';
import {BODY_DELIVERY} from '../assembled/body';
import {named,directions} from '../assembled/significance';
// Original M157 physical tasks, body30/rate10/width1, seed0, original four trials,
// meaning17, pressure18..30, appearance3998/3999, appraisal4000, expiry5001.
// Explicit legacy source-schema migration: two-field deliveries gain false, so no
// new effect evidence is granted. Original times/amounts/laws/parameters stay fixed.
const upgraded=(mode:'High'|'Wide'='High')=>{
 const b=fixture(mode),rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];
  if(key(a[2])===key(BODY_DELIVERY)){const p=items(a[3],'list');expect(p).toHaveLength(2);a[3]=list([...p,false]);}return list(a);});
 return {...b,s:{...b.s,rulesVersion:LONG_CLOCK_RULES,registrySchemaVersion:LONG_CLOCK_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
};
async function start(mode:'High'|'Wide'='High'){const b=upgraded(mode),m=await prepareCharacterModel(b.s);return {b,m,run:await createCharacterRun(m,b.d)};}
it('primary163: original M157 significance protects old memory that changes live appraisal4000',async()=>{
 const a=await start(),b=await start('Wide');await through(a.run,17n);await through(b.run,17n);
 expect(named(live17(a.run)[5],'direction')).toEqual(text('MovingCloser'));expect(named(live17(b.run,'Wide')[5],'kind')).toEqual(text('DoesNotQualify'));
 const old=focal(a.run)!;expect(directions(items(old.value,'list')[7])).toEqual(['MovingCloser']);expect(directions(items(focal(b.run)!.value,'list')[7])).toEqual([]);
 console.info('M163 LIVE17 original four-trial attribution and acquired High/Wide significance; no learned S0');
 await through(a.run,4000n);await through(b.run,4000n);live4000(a.run,true);live4000(b.run,false);expect(focal(a.run)!.value).toEqual(old.value);expect(focal(b.run)).toBeUndefined();
 expect(state(a.run).entries().filter(e=>e.path.rootStateTypeId===455n)).toEqual(state(b.run).entries().filter(e=>e.path.rootStateTypeId===455n));
 expect(report(a.run,SPATIAL_MEANING,4000)[2]).toEqual(report(b.run,SPATIAL_MEANING,4000)[2]);
 await finish(a.run);await finish(b.run);expect(a.run.snapshot().clock).toBe(5001n);expect(b.run.snapshot().clock).toBe(5001n);
 console.info('M163 PRIMARY PASS unchanged original15 survives pressure -> actual recall/workspace4000 -> MovingFarther vs SameDistance; old content immutable/current body and spatial goal equal; complete queues5001');
},590000);
it('continuation163: independent High repeat and save17 preserve every later canonical boundary',async()=>{
 const a=await start(),repeat=await createCharacterRun(a.m,a.b.d);await through(a.run,17n);await through(repeat,17n);live17(a.run);exact(a.run,repeat);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 for(let n=0;n<192;n++){const more=await a.run.settleNextInstant();for(const other of [repeat,restored]){expect(await other.settleNextInstant()).toBe(more);exact(a.run,other);expect(a.run.runIdentity()).toEqual(other.runIdentity());}
  if(a.run.snapshot().clock===4000n)for(const r of [a.run,repeat,restored])live4000(r,true);
  if(!more){expect(a.run.snapshot().clock).toBe(5001n);console.info('M163 CONTINUATION PASS independent repeat/save17; every later state/output/trace/save/identity exact through5001');return;}
 }throw Error('M163 continuation cap');
},590000);
