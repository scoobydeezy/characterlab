import {presentationAccessibility} from '../campaign3/encodingAccessMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {it,expect,vi} from 'vitest';
import {fixture168} from './assembledRetentionLaws.test';
import {items,key,enc,list,decode} from './fixtures/assembledDefiningControls';
import {C,text,signed,u,exact,bytes,rec,f,outputs,type CanonicalValue} from './fixtures/assembledDefining';
import {MEMORY_LIMITS_RULES,MEMORY_LIMITS_REGISTRY} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {state,through,finish,reports,report,focal,live17,type Run} from './assembledDefining.test';
import {RECALL,isPositionEpisodePath,MEMORY_RECALL} from '../assembled/memory';
import {RETENTION,compileRetentionDeclaration,retentionCapacities} from '../assembled/retention';
import * as retentionModule from '../assembled/retention';
import {REHEARSAL,FINAL_RECALL,compileRehearsal,readFinalQuery} from '../assembled/rehearsal';
import {positionHistory,rankPositionPresentations} from '../assembled/positionPresentation';
import {directions,named} from '../assembled/significance';
import {SPATIAL_MEANING} from '../assembled/goalMeaning';
// Same real M168 training, body30/rate10, seed0, no people/learned S0.
// Initial32, later pressure18; final position sources removed in all arms.
// The actual anchor17 schedules the only final position query4000. Full tail5001.
export function fixture169(capacity=32,cue=true){
 const b=fixture168(),slots=[...items(decode(b.s.registry),'list')],ret=[...items(slots[8],'list')];
 ret[2]=u(32);ret.push(list([list([signed(18),ret[1],u(capacity)])]));slots[8]=list(ret);
 slots[52]=list([...items(slots[52],'list'),list([signed(4000),u(1),cue])]);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>![3998n,3999n].includes((items(v,'list')[0] as {value:bigint}).value));
 return {...b,s:{...b.s,rulesVersion:MEMORY_LIMITS_RULES,registrySchemaVersion:MEMORY_LIMITS_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
async function start(capacity=32,cue=true){const b=fixture169(capacity,cue),m=await prepareCharacterModel(b.s);return {b,m,run:await createCharacterRun(m,b.d)};}
const positions=(r:Run)=>state(r).entries().filter(e=>isPositionEpisodePath(e.path));
const occurrence=(v:CanonicalValue)=>(items(v,'list')[1] as {payload:{value:bigint}}).payload.value;
function trained(r:Run){live17(r);const e=focal(r)!.value;expect(directions(items(e,'list')[7])).toEqual(['MovingCloser']);expect(items(e,'list')[9]).toBe(false);expect(positions(r)).toHaveLength(8);expect(items(report(r,REHEARSAL,17)[6],'list')).toEqual([signed(4000)]);return e;}
function final(r:Run,expected:number,present=true){
 const q=report(r,FINAL_RECALL,4000);expect(q[3]).toEqual(text(present?'Present':'Absent'));expect(items(q[5],'list')).toHaveLength(expected);
 const publications=reports(r,RECALL).filter(x=>key(x[1])===key(signed(4000)));expect(publications).toHaveLength(expected);
 expect(named(named(report(r,SPATIAL_MEANING,4000)[5],'assessment'),'kind')).toEqual(text('Unavailable'));
 return publications.map(x=>x[2]);
}
it('loss169: genuinely acquired significant memory can be lost under later zero capacity',async()=>{
 const a=await start(0);await through(a.run,17n);const old=trained(a.run);
 await through(a.run,18n);expect(focal(a.run)).toBeUndefined();expect(positions(a.run)).toHaveLength(0);
 const receipt=report(a.run,RETENTION,18);expect(receipt[3]).toEqual(u(0));expect(items(receipt[4],'list')).toContainEqual(u(occurrence(old)));
 await through(a.run,4000n);final(a.run,0);await finish(a.run);expect(a.run.snapshot().clock).toBe(5001n);
 console.info('M169 LOSS PASS actual significant old15 present17, removed18 under zero budget; no final publication4000; full5001.');
},290000);
it('selection169: retained unselected and absent-cue memories receive no presentation credit',async()=>{
 const a=await start(),b=await start(32,false);
 for(const x of [a,b]){await through(x.run,17n);trained(x.run);await through(x.run,31n);}
 const before=positions(a.run).map(e=>e.value),absentBefore=positions(b.run).map(e=>e.value),old=focal(a.run)!.value;
 expect(before).toEqual(absentBefore);expect(before).toHaveLength(8);
 const ranked=rankPositionPresentations(before.map(v=>({acquisition:occurrence(v),acquiredAt:(items(v,'list')[5] as {value:bigint}).value,history:positionHistory(v)})),4000n,1,'PresentationFrequency');
 expect(ranked.selected).toHaveLength(1);expect(ranked.selected).not.toContain(occurrence(old));
 const original=before.map(v=>({id:occurrence(v),score:presentationAccessibility(positionHistory(v),4000n,Q.of(1n),1)})).sort((a,b)=>b.score.compare(a.score));
 expect(original.slice(1).every(v=>original[0].score.compare(v.score)>0)).toBe(true);expect(ranked.selected[0]).toBe(original[0].id);
 for(const x of [a,b])await through(x.run,4000n);
 const selected=final(a.run,1)[0];final(b.run,0,false);expect(occurrence(selected)).toBe(ranked.selected[0]);
 expect(focal(a.run)!.value).toEqual(old);expect(positions(b.run).map(e=>e.value)).toEqual(absentBefore);
 for(const v of before){const after=positions(a.run).find(e=>occurrence(e.value)===occurrence(v))!.value;expect(items(after,'list').slice(0,10)).toEqual(items(v,'list').slice(0,10));expect(positionHistory(after)).toEqual([...positionHistory(v),...(occurrence(v)===occurrence(selected)?[4000n]:[])]);}
 const trace=outputs(b.run.snapshot().trace,160n).filter(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(4000))&&key(f(e,5n))===key(MEMORY_RECALL);});
 expect(trace).toHaveLength(1);expect(items(f(trace[0],11n),'list')).toEqual([]);expect(items(f(trace[0],18n),'list')).toEqual([]);
 for(const x of [a,b]){await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);}
 console.info('M169 SELECTION PASS actual significant old15 retained but unselected; genuine K1 winner matches access law; only published history updates. Absent query zero actual memory reads/emissions/publications, all old bytes retained; full5001.');
},490000);
it('continuation169: one-slot pressure and authentic final query survive every restored boundary',async()=>{
 const a=await start(1);await through(a.run,17n);const old=trained(a.run);
 const b=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,b);
 await through(a.run,18n);await through(b,18n);exact(a.run,b);expect(positions(a.run)).toHaveLength(1);expect(focal(a.run)!.value).toEqual(old);
 await finish(a.run,[b]);expect(a.run.snapshot().clock).toBe(5001n);
 for(const r of [a.run,b]){const publications=final(r,1);expect(occurrence(publications[0])).toBe(occurrence(old));expect(positionHistory(focal(r)!.value)).toEqual([...positionHistory(old),4000n]);}
 console.info('M169 CONTINUATION PASS acquired significance -> real one-slot pressure -> actual old15 final publication; independent original-input save17 and EVERY later byte through5001.');
},590000);
it('boundaries169: schedule/authentication negatives and actual post-removal rollback',async()=>{
 const decl=(rows:CanonicalValue[])=>list([text(RETENTION),u(0),u(32),u(1),list(rows)]);
 const d=compileRetentionDeclaration(decl([list([signed(18),u(0),u(8)])]),true);
 expect(retentionCapacities(d,17n)).toEqual({diagnostic:0,body:32});expect(retentionCapacities(d,18n)).toEqual({diagnostic:0,body:8});
 expect(()=>compileRetentionDeclaration(decl([]))).toThrow();
 for(const entries of [[list([signed(-1),u(0),u(1)])],[list([signed(1000001),u(0),u(1)])],[list([signed(18),u(0),u(1025)])],[list([signed(18),u(0),u(1)]),list([signed(18),u(0),u(2)])],Array.from({length:17},(_,i)=>list([signed(i),u(0),u(1)]))])expect(()=>compileRetentionDeclaration(decl(entries),true)).toThrow();
 const query=(at:number,slots=1)=>list([text(REHEARSAL),signed(17),list([]),list([signed(at),u(slots),true])]);
 expect(()=>compileRehearsal(query(4000))).toThrow();for(const at of [17,1000001])expect(()=>compileRehearsal(query(at),true)).toThrow();expect(()=>compileRehearsal(query(4000,33),true)).toThrow();
 expect(()=>readFinalQuery(list([text(FINAL_RECALL),C,list([]),u(33)]),C,4000n)).toThrow();
 let hit=false;const original=retentionModule.prepareEpisodicRetention,spy=vi.spyOn(retentionModule,'prepareEpisodicRetention').mockImplementation((...args)=>{const p=original(...args);if(!p)return p;return {...p,finish(s){const next=p.finish(s);if(p.anchor.dueAt===18n){expect(next.entries().filter(e=>isPositionEpisodePath(e.path))).toHaveLength(0);hit=true;throw Error('169 after actual retention removal');}return next;}};});
 try{
  const a=await start(0);await through(a.run,17n);trained(a.run);const before=a.run.snapshot();
  const forged={...a.b.d,orderedInputs:enc(list([...items(decode(a.b.d.orderedInputs),'list'),list([signed(4000),u(20),MEMORY_RECALL,list([text(FINAL_RECALL),C,list([]),u(1)]),list([])])]))};
  await expect(createCharacterRun(a.m,forged)).rejects.toThrow();
  await expect(a.run.settleNextInstant()).rejects.toThrow('169 after actual retention removal');expect(hit).toBe(true);const after=a.run.snapshot();
  expect(after.clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);
  console.info('M169 BOUNDARIES PASS pressure/final domains, old bundle rejection, caller-forged query rejection; actual post-removal fault restores full prior state/output/trace/clock. Continuation separately proves pending-query reconstruction.');
 }finally{spy.mockRestore();}
},240000);
