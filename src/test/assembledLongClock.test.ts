import {it,expect,vi} from 'vitest';
import {foundation,fixture as defining,C,items,key,enc,list,text,signed,u,rec,f,type CanonicalValue} from './fixtures/assembledDefining';
import {changeDefinition} from './fixtures/assembledCharacter';
import {LONG_CLOCK_RULES,LONG_CLOCK_REGISTRY,compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {compileSourceClock} from '../assembled/sourceClock';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {cognitiveRecord as r,decodeCognitive,cognitiveSchemaByType} from '../assembled/codecs';
import {COMMITMENT_REQUEST,COMMITMENT_CANCEL} from '../assembled/commitment';
import * as commitment from '../assembled/commitment';
import {DELIBERATION_EVENT,PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {typedIdentifier,record} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
import {GOAL_OWNER} from '../assembled/priority';
export const upgrade=(s:ReturnType<typeof foundation>['s'])=>({...s,rulesVersion:LONG_CLOCK_RULES,registrySchemaVersion:LONG_CLOCK_REGISTRY});
const state=(r:Awaited<ReturnType<typeof createCharacterRun>>)=>restoreAuthoritativeState(decodeCognitive(r.snapshot().state));
const equal=(a:Awaited<ReturnType<typeof createCharacterRun>>,b:Awaited<ReturnType<typeof createCharacterRun>>)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());expect(a.runIdentity()).toEqual(b.runIdentity());};
async function through(r:Awaited<ReturnType<typeof createCharacterRun>>,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Awaited<ReturnType<typeof createCharacterRun>>,peers:Awaited<ReturnType<typeof createCharacterRun>>[]=[]){for(let n=0;n<32;n++){const more=await r.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(more);equal(r,p);}if(!more)return;}throw Error('clock163 queue cap');}

it('admission163: exact public domain, original source authority and versioned cancellation grammar',async()=>{
 // Foundation body10/seed0; inherited two social tasks and unknown third; this
 // adapter test supplies only governed original cues/probes, no social reports.
 const b=foundation(),m=await compileCharacterModel(upgrade(b.s)),c=await compileCharacterState(m);expect(m.timeLimit).toBe(1000000n);
 const old=await compileCharacterModel(b.s);expect(old.timeLimit).toBe(100n);
 const a=items(items(decodeCognitive(b.d.orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(DELIBERATION_EVENT))!,'list');
 const cue=(at:bigint)=>list([signed(at),...a.slice(1)]);
 const probe=(at:bigint)=>list([signed(at),u(110),PROBE_SOURCE_EVENT,r(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])]);
 for(const at of [100n,101n,4000n,1000000n]){
  const x=await compileSourceClock(m,c,[cue(at)],b.d),e=x.base.initialEvents[0];expect(e.dueAt).toBe(at);
  const live=x.beginCognitive(at);for(const bad of [{...e,eventId:99n},{...e,eventSequence:99n},{...e,dueAt:simInstant(at+1n)},{...e,phase:110n},{...e,payload:list([])},{...e,payload:r(377,[typedIdentifier(1000,text('observer/forged')),f(rec(e.payload,377n),2n)])},{...e,causalParentEventIds:[1n]}])expect(()=>live.admit(bad)).toThrow();
  live.admit(e);expect(()=>live.admit(e)).toThrow();live.close();expect(()=>live.admit(e)).toThrow();
  Object.assign(x.base.initialEvents[0],{payload:list([])});expect(()=>x.beginCognitive(at).admit(x.base.initialEvents[0])).toThrow();
  if(at>100n)await expect(compileSourceClock(old,c,[cue(at)],b.d)).rejects.toThrow();
 }
 for(const at of [0n,1000001n])await expect(compileSourceClock(m,c,[cue(at)],b.d)).rejects.toThrow();
 await expect(compileSourceClock(m,c,[probe(1000000n)],b.d)).rejects.toThrow();
 const p=await compileSourceClock(m,c,[probe(999999n)],b.d),pe=p.base.initialEvents[0];p.beginProbe(999999n).admit(pe);expect(()=>p.beginCognitive(999999n).admit(pe)).toThrow();
 await expect(compileSourceClock(m,c,[cue(4000n),probe(4000n)],b.d)).rejects.toThrow('exclusive');
 await expect(compileSourceClock(m,c,Array.from({length:101},(_,i)=>cue(BigInt(i+1))),b.d)).rejects.toThrow('100');
 const malformed=[list([signed(4000),u(110),...a.slice(2)]),list([signed(4000),...a.slice(1,4),list([C])]),list([signed(4000),u(40),DELIBERATION_EVENT,list([]),list([])])];
 for(const row of malformed)await expect(compileSourceClock(m,c,[row],b.d)).rejects.toThrow();
 const bad=r(372,[u(4),signed(100),u(1)],2);expect(decodeCognitive(enc(bad))).toEqual(bad);
 expect(()=>r(372,[u(4),signed(101),u(1)],2)).toThrow();for(const at of [0n,1000001n])expect(()=>r(372,[u(4),signed(at),u(1)],3)).toThrow();
 const late=r(372,[u(4),signed(4000),u(1)],3);expect(decodeCognitive(enc(late))).toEqual(late);expect(()=>old.content.validateRecordRoles(enc(late))).toThrow('successor');m.content.validateRecordRoles(enc(late));
 const original=defining();await expect(compileCharacterInputs(old,c,original.d)).rejects.toThrow();
 console.info('M163 ADMISSION PASS exact bounds, probe follow-up bound, private authenticated originals, old domains,372/2 preserved and372/3 model-gated');
},250000);

it('cancel163: late live cancellation, denied control, exact continuation and whole-instant rollback',async()=>{
 // Body10/seed0; no social evidence/choice source. All actual tasks Open, deadlines
 // explicitly5000; both maintenance goals expire5001. Only permission differs.
 const b=foundation();let s=upgrade(b.s);for(const name of ['task-a','task-b','configurable-garden'])s=changeDefinition(s,'definition/'+name,6n,signed(5000));
 const cm=await compileCharacterModel(s),c=await compileCharacterState(cm),model=await prepareCharacterModel(s),t=c.tasks[0];
 const data=(permitted=true)=>({...b.d,orderedInputs:enc(list([list([signed(4000),u(30),COMMITMENT_REQUEST,list([t.key,permitted,false]),list([])])]))});
 const a=await createCharacterRun(model,data()),repeat=await createCharacterRun(model,data()),denied=await createCharacterRun(model,data(false));
 for(const run of [a,repeat,denied])await through(run,1n);
 for(const run of [a,denied])expect(f(rec(state(run).read(t.path).value!,372n),1n)).toEqual(u(1));
 for(const run of [a,repeat,denied])await through(run,4000n);equal(a,repeat);
 const cancelled=state(a).read(t.path).value!;expect(cancelled).toEqual(r(372,[u(4),signed(4000),f(rec(cancelled,372n),3n)],3));
 expect(f(rec(state(denied).read(t.path).value!,372n),1n)).toEqual(u(1));
 expect(enc(c.stateModel.restoreState(a.snapshot().state).canonicalValue())).toEqual(a.snapshot().state);
 expect(()=>c.stateModel.applyPatch(state(a),{operations:[{kind:'set',path:t.path,expected:{presence:true,value:cancelled},newValue:r(372,[u(1)])}]},GOAL_OWNER)).toThrow('terminal');
 const restored=await restoreCharacterRun(s,{initialState:b.d.initialState,orderedInputs:data().orderedInputs,save:a.save()});equal(a,restored);
 await finish(a,[repeat,restored]);await finish(denied);expect(a.snapshot().clock).toBe(5001n);
 const make=commitment.createCommitmentLifecycle;let hit=false;const spy=vi.spyOn(commitment,'createCommitmentLifecycle').mockImplementation((...args)=>{const h=make(...args);return {...h,extend(base){const x=h.extend(base);return {...x,prepare(es,B0){const stage=x.prepare(es,B0);return {...stage,finish(st){const next=stage.finish(st);if(es.some(e=>e.dueAt===4000n&&key(e.eventTypeId)===key(COMMITMENT_CANCEL))){expect(f(rec(next.read(t.path).value!,372n),1n)).toEqual(u(4));hit=true;throw Error('M163 after real cancellation');}return next;}};}};}};});
 let saved:Uint8Array|undefined;
 try{const failed=await createCharacterRun(model,data());await through(failed,1n);const before=failed.snapshot();saved=failed.save();await expect(failed.settleNextInstant()).rejects.toThrow('M163 after real cancellation');expect(hit).toBe(true);expect({...failed.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(s,{initialState:b.d.initialState,orderedInputs:data().orderedInputs,save:saved!});await finish(recovered);equal(recovered,a);
 console.info('M163 CANCEL PASS live Open ->372/3 at4000; denied unchanged; exact repeat/save4000/full expiry5001; fault after write rolls back and recovered full bytes match');
},290000);
