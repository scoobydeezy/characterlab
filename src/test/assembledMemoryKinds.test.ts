import {it,expect,vi} from 'vitest';
import {fixture170} from './fixtures/assembledMemoryKinds';
import {items,key,list,enc} from './fixtures/assembledDefiningControls';
import {C,text,signed,u,exact,bytes} from './fixtures/assembledDefining';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {state,through,finish,reports,report,focal,live17,type Run} from './assembledDefining.test';
import {isPositionEpisodePath,isBodyEpisodePath,RECALL} from '../assembled/memory';
import {RETENTION,compileRetentionDeclaration,retentionCapacities,retainedEpisodeIds} from '../assembled/retention';
import * as retentionModule from '../assembled/retention';
import {FINAL_RECALL} from '../assembled/rehearsal';
import {directions,named} from '../assembled/significance';
import {SPATIAL_MEANING} from '../assembled/goalMeaning';
import {retainSignificanceFirst,retainSharedProtectionTier} from '../campaign3/significanceFirstRetention';
import {retainWithUseProtection} from '../campaign3/useProtectedRetention';
import {retainByRecency} from '../campaign3/recencyRetention';
import type {MemoryUseLaw} from '../assembled/memoryUse';
// Four actual trials1..16, body30/rate10/width1, seed0; no people or learnedS0.
// Actual position sources22/23, independent body8/event2 pressure, goal17/final4000.
// Only reserve goal High/Wide differs; same matching queryK2, spatialgoal18, full5001.
async function start(o:Parameters<typeof fixture170>[0]={}){const b=fixture170(o),m=await prepareCharacterModel(b.s);return {b,m,run:await createCharacterRun(m,b.d)};}
function memories(r:Run){const e=state(r).entries();return {body:e.filter(x=>isBodyEpisodePath(x.path)),event:e.filter(x=>isPositionEpisodePath(x.path)),bodyState:e.filter(x=>x.path.rootStateTypeId===455n)};}
function trained(r:Run,high=true){live17(r,high?'High':'Wide');const v=focal(r)!.value;expect(directions(items(v,'list')[7])).toEqual(high?['MovingCloser']:[]);expect(items(v,'list')[9]).toBe(false);const m=memories(r);expect(m.body).toHaveLength(8);expect(m.event).toHaveLength(8);return v;}
function liveFinal(r:Run,high:boolean){
 const a=report(r,SPATIAL_MEANING,4000),assessment=named(a[5],'assessment');
 expect(named(assessment,'kind')).toEqual(text('Assessed'));
 expect(named(assessment,'relation')).toEqual(text(high?'MovingFarther':'SameDistance'));
 const operands=items(a[4],'list').map(v=>items(v,'list')[1]),pub=reports(r,RECALL).filter(v=>key(v[1])===key(signed(4000)));
 expect(operands.map(v=>items(v,'list')[5])).toEqual([signed(high?15:22),signed(23)]);
 for(const v of operands)expect(pub.some(x=>key(x[2])===key(v))).toBe(true);
 expect(items(report(r,FINAL_RECALL,4000)[5],'list')).toHaveLength(2);
}
it('primary170: event pressure retains meaningful history without displacing bodily memories',async()=>{
 const a=await start(),b=await start({goal:'Wide'});
 await through(a.run,17n);const old=trained(a.run);
 await through(b.run,17n);trained(b.run,false);
 for(const x of [a,b]){
  await through(x.run,23n);const m=memories(x.run);expect(m.body).toHaveLength(8);expect(m.event).toHaveLength(2);
  const audit=report(x.run,RETENTION,23);expect(audit[3]).toEqual(u(8));expect(audit[8]).toEqual(u(2));
  const kinds=items(audit[7],'list').map(v=>items(v,'list').at(-1));expect(kinds).toContainEqual(text('body'));expect(kinds).toContainEqual(text('event'));
  await through(x.run,4000n);liveFinal(x.run,x===a);
 }
 expect(items(focal(a.run)!.value,'list').slice(0,9)).toEqual(items(old,'list').slice(0,9));
 expect(memories(a.run).bodyState).toEqual(memories(b.run).bodyState);
 for(const x of [a,b]){await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);}
 console.info('M170 PRIMARY PASS actual8body/8position acquisitions17; pressure23 leaves8body/2position each; live4000 High15/23 MovingFarther vs Wide22/23 SameDistance, actual recalled operands and equal body; full5001.');
},540000);
it('continuation170: zero event capacity loses actual positions and preserves body plus every restored boundary',async()=>{
 const a=await start({eventCapacity:0});await through(a.run,17n);trained(a.run);
 const b=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,b);
 await through(a.run,22n);await through(b,22n);exact(a.run,b);
 const m=memories(a.run);expect(m.body).toHaveLength(8);expect(m.event).toHaveLength(0);expect(report(a.run,RETENTION,22)[8]).toEqual(u(0));
 await finish(a.run,[b]);expect(a.run.snapshot().clock).toBe(5001n);
 for(const r of [a.run,b]){expect(items(report(r,FINAL_RECALL,4000)[5],'list')).toHaveLength(0);expect(named(named(report(r,SPATIAL_MEANING,4000)[5],'assessment'),'kind')).toEqual(text('Unavailable'));const m=memories(r);expect(m.body).toHaveLength(8);expect(m.event).toHaveLength(0);}
 console.info('M170 CONTINUATION PASS significant old15 genuinely acquired then lost under event0;8body remain; final access empty/explicitly Unavailable; original-input save17 and every later state/output/trace/save/run byte through5001.');
},590000);
it('boundaries170: original mixed-kind laws, capacity admission and actual event-only removal rollback',async()=>{
 const kernels={SignificanceFirst:retainSignificanceFirst,SharedProtection:retainSharedProtectionTier,UseOnly:retainWithUseProtection,AgeOnly:retainByRecency};let count=0;
 for(const tied of [true,false])for(let sig=0;sig<4;sig++)for(let use=0;use<4;use++)for(let body=0;body<=1;body++)for(let event=0;event<=1;event++){
  const rows=Array.from({length:2},(_,i)=>({acquisition:BigInt(i+1),acquiredAt:tied?1n:BigInt(i+1),kind:i?'event' as const:'body' as const,significant:!!(sig&(1<<i)),useProtection:!!(use&(1<<i))}));
  const old=rows.map(r=>({id:r.acquisition,acquiredAt:r.acquiredAt,kind:r.kind==='body'?'Interoceptive' as const:'EventContinuant' as const,units:[{key:'episode',views:[enc(list([]))],useProtection:r.useProtection,outcomeSignificanceDirections:r.significant?['MovingFarther' as const]:[]}]}));
  for(const law of Object.keys(kernels) as MemoryUseLaw[]){expect(retainedEpisodeIds(rows,4n,{diagnostic:0,body,event},law)).toEqual(kernels[law](old,4n,{Interoceptive:body,EventContinuant:event}).acquisitions.map(x=>x.id));count++;}
 }
 expect(count).toBe(512);
 const decl=(initial=8,later=2)=>list([text(RETENTION),u(0),u(8),u(1),list([list([signed(22),u(0),u(8),u(later)])]),u(initial)]);
 const d=compileRetentionDeclaration(decl(),true,true);expect(retentionCapacities(d,21n)).toEqual({diagnostic:0,body:8,event:8});expect(retentionCapacities(d,22n)).toEqual({diagnostic:0,body:8,event:2});
 expect(()=>compileRetentionDeclaration(decl(),true)).toThrow();expect(()=>compileRetentionDeclaration(decl(),false,true)).toThrow();
 expect(()=>compileRetentionDeclaration(decl(1025),true,true)).toThrow();expect(()=>compileRetentionDeclaration(decl(8,1025),true,true)).toThrow();
 expect(()=>retainedEpisodeIds([{acquisition:1n,acquiredAt:1n,kind:'event'}],2n,{body:8,diagnostic:0})).toThrow();
 let hit=false;const original=retentionModule.prepareEpisodicRetention,spy=vi.spyOn(retentionModule,'prepareEpisodicRetention').mockImplementation((...args)=>{const p=original(...args);if(!p)return p;return {...p,finish(s){const next=p.finish(s);if(p.anchor.dueAt===22n){const es=next.entries();expect(es.filter(e=>isPositionEpisodePath(e.path))).toHaveLength(0);expect(es.filter(e=>isBodyEpisodePath(e.path))).toHaveLength(8);hit=true;throw Error('170 after actual event-only removal');}return next;}};});
 try{const a=await start({eventCapacity:0});await through(a.run,17n);trained(a.run);const before=a.run.snapshot();await expect(a.run.settleNextInstant()).rejects.toThrow('170 after actual event-only removal');expect(hit).toBe(true);const after=a.run.snapshot();expect(after.clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);}
 finally{spy.mockRestore();}
 console.info('M170 BOUNDARIES PASS512 exact original mixed-kind kernel comparisons, threshold/admission/legacy negatives; actual post-event-only-removal fault restores entire state/output/trace/clock.');
},290000);
