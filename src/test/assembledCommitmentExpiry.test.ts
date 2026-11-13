/** M96: three physical tasks, no social dependencies; live inherited body,
 * position/catalogue and two reason-reading channels. Body30/cap100/rate10,
 * delivery90@9; seed0. Only A deadline differs (11 versus original20).
 * Same current0.80 SourceCoverage and D3; no authored psychological state. */
import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import * as stateKernel from '../substrate/state';
import {type StatePath} from '../substrate/state';
import {type CanonicalValue} from '../substrate/canonicalEncoding';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import {TASK_DEADLINE_EVENT} from '../campaign2/taskBootstrap';
import {learned,standing} from './fixtures/assembledStandingSources';
import {standingProbe,capture,through,snap,decode,enc,items,key,rec,r,f,uint,q,list,text,signed} from './fixtures/assembledReasonReference';
import {changeDefinition} from './fixtures/assembledCharacter';
import {mapIdentities} from './fixtures/assembledValueReceiving';
import {outputs,draws,type Run} from './fixtures/assembledComparison';
import {taskA,taskB} from './fixtures/assembledDecisionRegimes';
import {bytes} from './fixtures/assembledAffectReceiving';
const path=(task:CanonicalValue):StatePath=>({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:task}]});
const taskStatus=(run:Run,task:CanonicalValue)=>stateKernel.restoreAuthoritativeState(decode(run.snapshot().state)).read(path(task));
function fixture(expired:boolean,hidden=false){const b=standingProbe(false,hidden);return {...b,s:expired?changeDefinition(b.s,'definition/task-a',6n,signed(11)):b.s};}
async function create(b:ReturnType<typeof fixture>,at=10n){const run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return run;}
const taskSignals=(raw:CanonicalValue,task:CanonicalValue)=>items(f(rec(raw,403n),3n),'set').filter(s=>key(f(rec(f(rec(s,402n),1n),401n),2n))===key(task));
const taskNuclei=(ns:readonly CanonicalValue[],task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(rec(n,407n),1n),404n),3n))===key(f(rec(task,371n),2n)));
function same(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
// Outcome-blind setup: the shared helper reads occurrence, candidate and nucleus
// identities only. No result, probability or learned value chooses a comparison.
async function coupled(){const fixtures=[fixture(false),fixture(true)];const result:typeof fixtures=[];
 for(const b of fixtures){const setup=await create(b),map=mapIdentities(setup);expect(map.entries.length).toBeGreaterThan(0);result.push({...b,d:{...b.d,orderedInputs:enc(list([map.canonicalValue,...items(decode(b.d.orderedInputs),'list')]))}});}
 return result;
}
it('M96 lifecycle: expiry removes pressure and changes the real decision without erasing earned identity',async()=>{
 const [active,expired]=await coupled(),a=await create(active),b=await create(expired);
 for(const run of [a,b]){for(const task of [taskA,taskB])expect(taskStatus(run,task).value).toEqual(r(372,[{kind:'unsigned',value:1n}]));const l=learned(run);expect(l.formation.entries).toHaveLength(1);expect(l.formation.P.compare(ZERO)).toBeGreaterThan(0);expect(l.journal).toHaveLength(1);capture(run,active.s,10n);}
 const before=learned(b);expect(learned(a)).toEqual(before);
 const da=draws(a,10n),db=draws(b,10n);expect(da).toEqual(db);if(!da.length){for(const [run,source] of [[a,active.s],[b,expired.s]] as const)expect(uint(f(capture(run,source,10n).data,8n))).toBe(1n);}
 expect(capture(a,active.s,10n).data).toEqual(capture(b,expired.s,10n).data);
 await through(b,11n);expect(taskStatus(b,taskA).value).toEqual(r(372,[{kind:'unsigned',value:3n}]));expect(learned(b)).toEqual(before);
 const deadline=outputs(snap(b).trace,160n).find(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(11))&&key(f(e,5n))===key(TASK_DEADLINE_EVENT)&&key(f(e,6n))===key(taskA);});
 expect(deadline,'actual shared lifecycle trace').toBeDefined();expect(items(f(deadline!,11n),'list').length).toBeGreaterThan(0);expect(items(f(deadline!,17n),'list')).toHaveLength(1);
 await through(a,12n);await through(b,12n);const p=capture(a,active.s,12n),z=capture(b,expired.s,12n);
 expect(taskNuclei(p.ns,taskA)).toHaveLength(1);expect(taskNuclei(z.ns,taskA)).toHaveLength(0);expect(taskSignals(p.raw,taskA).some(s=>readQ(f(rec(s,402n),2n)).compare(ZERO)>0)).toBe(true);expect(taskSignals(z.raw,taskA)).toHaveLength(0);
 expect(taskNuclei(z.ns,taskB)).toHaveLength(1);expect(standing(z.raw).length).toBeGreaterThan(0);expect(z.produced).toHaveLength(0);expect(z.rejected).toHaveLength(2);expect(z.rejected.every(v=>items(v,'list')[1]&&key(items(v,'list')[1])===key(text('NotSelected')))).toBe(true);
 expect(p.probabilities).not.toEqual(z.probabilities);expect(z.probabilities).toEqual([q(1,1)]);expect(learned(a)).toEqual(before);expect(learned(b)).toEqual(before);
 console.info('M96 LIFECYCLE PASS '+JSON.stringify({trainingDraws:da.length,activeNuclei:p.ns.length,expiredNuclei:z.ns.length,activeProbability:p.probabilities.map(key),expiredProbability:z.probabilities.map(key),identityUnchanged:true,terminalCause:'deadline11',sampledChoiceClaim:false}));
 // Hidden truth uses the same map and all the same permitted readings.
 const hidden=fixture(true,true),h=await create({...hidden,d:{...hidden.d,orderedInputs:enc(list([items(decode(expired.d.orderedInputs),'list')[0],...items(decode(hidden.d.orderedInputs),'list')]))}},12n),hp=capture(h,hidden.s,12n);
 expect(hp.raw).toEqual(z.raw);expect(hp.data).toEqual(z.data);expect(learned(h)).toEqual(before);console.info('M96 PRIVACY PASS hidden truth cannot revive expired commitment or change cognition');
},570000);
it('M96 persistence: terminal record and identity survive every continuation; expiry is atomic',async()=>{
 const b=fixture(true),a=await create(b),repeat=await create(b);same(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});same(a,restored);const clocks:bigint[]=[];
 for(let n=0;;n++){expect(n).toBeLessThan(32);const steps=[];for(const run of [a,repeat,restored])steps.push(await run.settleNextInstant());expect(steps[1]).toBe(steps[0]);expect(steps[2]).toBe(steps[0]);same(a,repeat);same(a,restored);if(!steps[0])break;clocks.push(a.snapshot().clock);expect(taskStatus(a,taskA).value).toEqual(r(372,[{kind:'unsigned',value:3n}]));}
 expect(a.snapshot().clock).toBe(101n);expect(clocks).toContain(11n);expect(clocks).toContain(12n);console.info('M96 CONTINUATION PASS10 -> '+clocks.join(','));
 const fault=await create(b),before=fault.snapshot(),original=stateKernel.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateKernel,'applyStatePatch').mockImplementation((...args)=>{const result=original(...args);if(args[1].operations.some(op=>op.kind==='set'&&key(op.newValue)===key(r(372,[{kind:'unsigned',value:3n}]))&&key(op.path.selectors[0]?.kind==='mapKey'?op.path.selectors[0].key:list([]))===key(taskA))){reached=true;throw Error('M96 after expiry patch');}return result;});
 try{await expect(fault.settleNextInstant()).rejects.toThrow('M96 after expiry patch');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...fault.snapshot(),status:before.status}).toEqual(before);expect(fault.diagnostic()).toBeDefined();console.info('M96 ROLLBACK PASS public state including terminal write/identity/other owners, clock, outputs and trace rolled back');
},570000);
