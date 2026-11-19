import {applyQualifiedUnitUse} from '../campaign3/useProtectedRetention';
import {it,expect,vi} from 'vitest';
import {fixture172,type EarlyOptions} from './fixtures/assembledEarlyDefining';
import {items,key,list,decode,enc} from './fixtures/assembledDefiningControls';
import {text,signed,u,exact,bytes} from './fixtures/assembledDefining';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {state,through,finish,reports,report,type Run} from './assembledDefining.test';
import {isPositionEpisodePath,isBodyEpisodePath,POSITION_EPISODE,RECALL} from '../assembled/memory';
import * as memoryModule from '../assembled/memory';
import {directions,named} from '../assembled/significance';
import {RETAINED_ATTRIBUTION} from '../assembled/retainedAttribution';
import {GOAL_MEANING} from '../assembled/goalMeaning';
import {REPORTED_MEANING} from '../assembled/reportedMeaning';
import {ATTRIBUTION_USE,FINAL_RECALL} from '../assembled/rehearsal';
import {positionHistory} from '../assembled/positionPresentation';
import {REPORTED_MEANING_RULES,REPORTED_MEANING_REGISTRY} from '../assembled/model';
// No social task; body30/rate10/width1, real alternating trials, seed0, no learned S0.
// Test-only snapshot cache, invalidated BEFORE every attempted transition.
// No simulation/trace truncation; exact full saves remain uncached.
export function cache172(run:Run):Run{let snapshot:ReturnType<Run['snapshot']>|undefined;return Object.freeze({...run,snapshot(){return snapshot??(snapshot=run.snapshot());},async settleNextInstant(){snapshot=undefined;return run.settleNextInstant();}});}
export async function start172(o:EarlyOptions={}){const b=fixture172(o),m=await prepareCharacterModel(b.s);return {b,m,run:cache172(await createCharacterRun(m,b.d))};}
export function memory172(r:Run){return state(r).entries().filter(e=>isPositionEpisodePath(e.path)||isBodyEpisodePath(e.path));}
export function positions172(r:Run){return memory172(r).filter(e=>isPositionEpisodePath(e.path));}
export const acquired172=(v:ReturnType<typeof positions172>[number])=>Number((items(v.value,'list')[5] as {value:bigint}).value);
export function live172(r:Run,goal='High'){
 const a=report(r,RETAINED_ATTRIBUTION,21),m=report(r,GOAL_MEANING,21),result=named(a[4],'result');
 expect(items(a[2],'list')[3]).toEqual(signed(4));expect(items(a[3],'list')).toHaveLength(4);
 expect(named(result,'disposition')).toEqual(text('Supported'));expect(items(named(result,'consumed'),'list')).toHaveLength(16);expect(m[7]).toEqual(list(a));
 const old=positions172(r).find(e=>acquired172(e)===3)!;expect(old).toBeDefined();
 expect(directions(items(old.value,'list')[7])).toEqual(goal==='High'?['MovingCloser']:goal==='Low'?['MovingFarther']:[]);
 const use=reports(r,ATTRIBUTION_USE).filter(v=>key(v[1])===key(signed(21)));expect(use).toHaveLength(16);
 const recalls=reports(r,RECALL);for(const receipt of use){expect(receipt[4]).toEqual(list(a));expect(recalls.some(v=>key(v[1])===key(signed(21))&&key(v[2])===key(receipt[5]))).toBe(true);}
 const all=memory172(r);expect(all).toHaveLength(16);
 for(const e of all){const v=items(e.value,'list');expect(v[key(v[0])===key(text(POSITION_EPISODE))?9:6]).toBe(true);}
 const history=positions172(r).map(e=>positionHistory(e.value).slice(1));for(const h of history)expect(h).toEqual(history[0]);
 return m;
}
export function final172(r:Run,at=50){const events=positions172(r),byId=new Map(events.map(e=>[key(items(e.value,'list')[1]),acquired172(e)])),query=report(r,FINAL_RECALL,at);
 return items(query[5],'list').map(v=>{const match=events.find(e=>key((items(e.value,'list')[1] as {payload:typeof v}).payload)===key(v));expect(match).toBeDefined();return acquired172(match!);});
}
it('primary172: original early significance beats newer actual use under the reference law',async()=>{
 for(const o of [{},{law:'SharedProtection'},{goal:'Wide'}] as EarlyOptions[]){
  const a=await start172(o);await through(a.run,21n);live172(a.run,o.goal);
  await through(a.run,37n);expect(positions172(a.run).map(acquired172)).toEqual([!o.law&&!o.goal?3:15]);
  expect(memory172(a.run).filter(e=>isBodyEpisodePath(e.path))).toHaveLength(8);
  await through(a.run,38n);const current=report(a.run,REPORTED_MEANING,38);expect(named(current[5],'kind')).toEqual(text(o.goal?'DoesNotQualify':'Qualifies'));
  await through(a.run,50n);expect(final172(a.run)).toEqual([!o.law&&!o.goal?3:15]);await finish(a.run);expect(a.run.snapshot().clock).toBe(5001n);
 }
 console.info('M172 PRIMARY PASS early actual3 significance vs newer used15; High SF3, High Shared15, Wide SF15; actual consumed16, current report, finalK1 and full5001.');
},540000);
it('rehearsal172: significant early memory remains retained but unselected under broad capacity',async()=>{
 const a=await start172({goal:'Low',capacity:8,rehearsals:3});await through(a.run,21n);live172(a.run,'Low');
 const consumed=reports(a.run,ATTRIBUTION_USE).filter(v=>key(v[1])===key(signed(21))).map(v=>v[5]);
 const occurrence=(v:typeof consumed[number])=>(items(v,'list')[1] as {payload:{value:bigint}}).payload.value;
 const original=applyQualifiedUnitUse(consumed.map(v=>{const a=items(v,'list');return {id:occurrence(v),acquiredAt:(a[5] as {value:bigint}).value,kind:(key(a[0])===key(text(POSITION_EPISODE))?'EventContinuant':'Interoceptive') as 'EventContinuant'|'Interoceptive',units:[{key:'episode',views:[enc(v)],useProtection:a[key(a[0])===key(text(POSITION_EPISODE))?9:6] as boolean}]};}),consumed.map(v=>({acquisition:occurrence(v),unit:'episode'})),21n);
 expect(original.every(v=>v.units.every(u=>u.useProtection))).toBe(true);expect(original).toHaveLength(16);
 for(const t of [34,35,36]){await through(a.run,BigInt(t));const result=named(report(a.run,RETAINED_ATTRIBUTION,t)[4],'result');expect(named(result,'disposition')).toEqual(text('Supported'));expect(items(named(result,'consumed'),'list')).toHaveLength(16);expect(reports(a.run,ATTRIBUTION_USE).filter(v=>key(v[1])===key(signed(t)))).toHaveLength(16);}
 await through(a.run,37n);expect(positions172(a.run)).toHaveLength(8);expect(directions(items(positions172(a.run).find(e=>acquired172(e)===3)!.value,'list')[7])).toEqual(['MovingFarther']);
 await through(a.run,50n);expect(final172(a.run)).toEqual([15]);await finish(a.run);
 console.info('M172 REHEARSAL PASS Low early3 significant, retained8 but final15; three authentic consumed16 rehearsals, full5001.');
},390000);
it('continuation172: original-input save21 preserves every later canonical boundary',async()=>{
 const a=await start172({goal:'Low',capacity:8,rehearsals:3});await through(a.run,21n);live172(a.run,'Low');const b=cache172(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,b);await finish(a.run,[b]);expect(a.run.snapshot().clock).toBe(5001n);expect(final172(a.run)).toEqual([15]);
 console.info('M172 CONTINUATION PASS original-input21, every later state/output/trace/save/run byte through5001 including use/rehearsal/current report.');
},590000);
it('negative172: unsupported natural use is empty and actual post-consumer fault rolls back',async()=>{
 const original=memoryModule.createEpisodicExtension;let hit=false;
 const spy=vi.spyOn(memoryModule,'createEpisodicExtension').mockImplementation((...args)=>{const h=original(...args);return {...h,observeRehearsal(e,outs){const result=h.observeRehearsal(e,outs);if(e.dueAt===21n&&e.phase===50n){hit=true;throw Error('172 after actual consumed use');}return result;}};});
 try{const a=await start172();await through(a.run,20n);const before=a.run.snapshot();await expect(a.run.settleNextInstant()).rejects.toThrow('172 after actual consumed use');expect(hit).toBe(true);const after=a.run.snapshot();for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);expect(after.clock).toBe(before.clock);}finally{spy.mockRestore();}
 // One actual unsupported opportunity: no delivery at34 in the no-rehearsal arm.
 const a=await start172();await through(a.run,34n);expect(reports(a.run,ATTRIBUTION_USE).filter(v=>key(v[1])===key(signed(34)))).toHaveLength(0);expect(named(report(a.run,RETAINED_ATTRIBUTION,34)[4],'kind')).not.toEqual(text('Result'));await finish(a.run);
 console.info('M172 NEGATIVE PASS actual post-consumer rollback; no natural delivery => no attribution use, full5001.');
},540000);
