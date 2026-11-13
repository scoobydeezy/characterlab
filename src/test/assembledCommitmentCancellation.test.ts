/** M97: fixed M94 standing calendar, three physical tasks/no social dependencies.
 * Body30/cap100/rate10, delivery90@9, seed0, existing live reading channels.
 * One permitted/denied cancellation request A@10. No law/gain/seed search. */
import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,COMMITMENT_RULES,COMMITMENT_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {COMMITMENT_REQUEST,COMMITMENT_CANCEL,COMMITMENT_VERSION} from '../assembled/commitment';
import {GOAL_OWNER} from '../assembled/priority';
import {formationValue} from '../assembled/formation';
import {identityJournal} from '../assembled/identityEligibility';
import {receivingRecord as rec,decodeCognitive as decode,cognitiveRecord as r} from '../assembled/codecs';
import {decodeEmbodied} from '../campaign3/embodiedCodecs';
import * as stateKernel from '../substrate/state';
import {list,text,unsigned as u,signed,type CanonicalValue,canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import {dataItems as items,dataKey as key,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {standingProbe,capture,through,snap,q,sid} from './fixtures/assembledReasonReference';
import {formationStatePath,jp,standing} from './fixtures/assembledStandingSources';
import {taskA,taskB} from './fixtures/assembledDecisionRegimes';
import {outputs,draws,type Run} from './fixtures/assembledComparison';
import {bytes} from './fixtures/assembledAffectReceiving';
const path={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:taskA}]};
const state=(run:Run)=>stateKernel.restoreAuthoritativeState(decode(run.snapshot().state));
const status=(run:Run)=>state(run).read(path).value!;
const history=(run:Run)=>{const s=state(run);return {formation:formationValue(s.read(formationStatePath).value),journal:identityJournal(s.read(jp).value),history:s.read({...jp,fieldId:1n}).value};};
const request=(permitted=true,hidden=false)=>list([signed(10),u(30),COMMITMENT_REQUEST,list([taskA,permitted,hidden]),list([])]);
function fixture(permitted=true,hidden=false,include=true){const b=standingProbe();return {s:{...b.s,rulesVersion:COMMITMENT_RULES,registrySchemaVersion:COMMITMENT_REGISTRY},d:{...b.d,orderedInputs:enc(list([...items(decode(b.d.orderedInputs),'list'),...(include?[request(permitted,hidden)]:[])]))}};}
async function create(b=fixture(),at=12n){const run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return run;}
const nuclei=(ns:readonly CanonicalValue[],task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(rec(n,407n),1n),404n),3n))===key(f(rec(task,371n),2n)));
const signals=(raw:CanonicalValue,task:CanonicalValue)=>items(f(rec(raw,403n),3n),'set').filter(s=>key(f(rec(f(rec(s,402n),1n),401n),2n))===key(task));
function exact(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
it('M97 behavior: cancellation settles after the current decision and removes later pressure',async()=>{
 const yes=fixture(),no=fixture(false),a=await create(yes,9n),b=await create(no,9n);expect(status(a)).toEqual(r(372,[u(1)]));expect(status(b)).toEqual(r(372,[u(1)]));
 await through(a,10n);await through(b,10n);const x=capture(a,yes.s,10n),y=capture(b,no.s,10n);expect(nuclei(x.ns,taskA)).toHaveLength(1);expect(nuclei(y.ns,taskA)).toHaveLength(1);expect(x.raw).toEqual(y.raw);expect(x.data).toEqual(y.data);expect(uint(f(x.data,8n))).toBe(1n);expect(draws(a,10n)).toEqual([]);expect(draws(b,10n)).toEqual([]);
 const learned=history(a);expect(learned.formation.entries).toHaveLength(1);expect(learned.formation.P.compare(ZERO)).toBeGreaterThan(0);expect(learned).toEqual(history(b));expect(status(b)).toEqual(r(372,[u(1)]));expect(rec(status(a),372n).schema.schemaVersion).toBe(2n);expect(f(rec(status(a),372n),1n)).toEqual(u(4));expect(f(rec(status(a),372n),2n)).toEqual(signed(10));
 const traces=outputs(snap(a).trace,160n),terminal=traces.find(t=>key(f(t,6n))===key(text(COMMITMENT_VERSION))&&key(f(rec(f(t,4n),130n),5n))===key(COMMITMENT_CANCEL)&&key(f(rec(f(t,4n),130n),2n))===key(signed(10))&&uint(f(rec(f(t,4n),130n),3n))===140n)!;expect(terminal).toBeDefined();expect(items(f(terminal,11n),'list')).toHaveLength(1);expect(items(f(terminal,17n),'list')).toHaveLength(1);const event=rec(f(terminal,4n),130n);expect(items(f(event,8n),'list')).toEqual([f(rec(status(a),372n),3n)]);
 await through(a,12n);await through(b,12n);const cancelled=capture(a,yes.s,12n),active=capture(b,no.s,12n);expect(nuclei(cancelled.ns,taskA)).toHaveLength(0);expect(signals(cancelled.raw,taskA)).toHaveLength(0);expect(nuclei(active.ns,taskA)).toHaveLength(1);expect(signals(active.raw,taskA).some(s=>readQ(f(rec(s,402n),2n)).compare(ZERO)>0)).toBe(true);expect(nuclei(cancelled.ns,taskB)).toHaveLength(1);expect(standing(cancelled.raw).length).toBeGreaterThan(0);expect(cancelled.produced).toHaveLength(0);expect(cancelled.rejected.map(v=>items(v,'list')[1])).toEqual([text('NotSelected'),text('NotSelected')]);expect(active.probabilities).toEqual([q(55,64),q(9,64)]);expect(cancelled.probabilities).toEqual([q(1,1)]);expect(history(a)).toEqual(learned);expect(history(b)).toEqual(learned);
 const hidden=fixture(true,true),h=await create(hidden),hp=capture(h,hidden.s,12n);expect(hp.raw).toEqual(cancelled.raw);expect(hp.data).toEqual(cancelled.data);expect(history(h)).toEqual(learned);
 console.info('M97 BEHAVIOR PASS choice10 live/equal Auto0draws; cancellation140; unchanged genuine identity; probability12 A55/64,B9/64 -> only B1; hidden/denied controls; actual executions.');
},570000);
it('M97 boundaries: old versions stay closed, terminal identity cannot be forged or reused',async()=>{
 const b=fixture(false,false,false),a=await create(b),old=standingProbe(),legacy=await create(old);bytes(a.snapshot().state,legacy.snapshot().state);bytes(a.snapshot().outputs,legacy.snapshot().outputs);
 const model=await compileCharacterModel(b.s),component=await compileCharacterState(model),initial=component.initialState(b.d.initialState),cancelled=r(372,[u(4),signed(10),u(1)],2);
 expect(()=>decodeEmbodied(enc(cancelled))).toThrow();const previous=await compileCharacterModel(old.s);expect(()=>previous.content.validateRecordRoles(enc(cancelled))).toThrow('successor');await expect(compileCharacterModel({...b.s,registrySchemaVersion:old.s.registrySchemaVersion})).rejects.toThrow('version bundle');
 const replaceInitial=new stateKernel.AuthoritativeState(initial.entries().map(e=>key(stateKernel.statePathValue(e.path))===key(stateKernel.statePathValue(path))?{...e,value:cancelled}:e));await expect(createCharacterRun(await prepareCharacterModel(b.s),{...b.d,initialState:enc(replaceInitial.canonicalValue())})).rejects.toThrow('initial tasks');
 const patch={operations:[{kind:'set' as const,path,expected:{presence:true,value:r(372,[u(1)])},newValue:cancelled}]};expect(()=>component.stateModel.applyPatch(initial,patch,sid(1025,'authority/belief-expectation'),{writableRoots:[373n],targetPaths:[path]})).toThrow();
 const terminal=await create(fixture());const terminalState=state(terminal);expect(()=>component.stateModel.applyPatch(terminalState,{operations:[{kind:'set',path,expected:{presence:true,value:status(terminal)},newValue:r(372,[u(1)])}]},GOAL_OWNER,{writableRoots:[373n],targetPaths:[path]})).toThrow('terminal commitment');
 const prepared=await prepareCharacterModel(b.s),baseRows=items(decode(b.d.orderedInputs),'list');for(const added of [[request(),request()],[list([signed(10),u(140),COMMITMENT_CANCEL,list([taskA,true,false]),list([])])],[list([signed(10),u(30),COMMITMENT_REQUEST,list([taskA,u(1),false]),list([])])]])await expect(createCharacterRun(prepared,{...b.d,orderedInputs:enc(list([...baseRows,...added]))})).rejects.toThrow();
 await expect(createCharacterRun(await prepareCharacterModel(old.s),fixture().d)).rejects.toThrow('version');await expect(restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:terminal.save()})).rejects.toThrow();
 console.info('M97 BOUNDARIES PASS no-command0.80/0.81 exact state/output; old codec/model rejects new status; wrong owner, invented initial state, resurrection, duplicate/generated/malformed/versioned input and edited restore rejected');
},570000);
it('M97 persistence: every settlement preserves cancellation; a failed owner write rolls back',async()=>{
 const b=fixture(),a=await create(b,9n),repeat=await create(b,9n);exact(a,repeat);const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);const clocks:bigint[]=[];
 for(let i=0;;i++){expect(i).toBeLessThan(32);const stepped=[];for(const run of [a,repeat,restored])stepped.push(await run.settleNextInstant());expect(stepped[1]).toBe(stepped[0]);expect(stepped[2]).toBe(stepped[0]);exact(a,repeat);exact(a,restored);if(!stepped[0])break;clocks.push(a.snapshot().clock);expect(f(rec(status(a),372n),1n)).toEqual(u(4));}expect(a.snapshot().clock).toBe(101n);expect(clocks).toContain(10n);expect(clocks).toContain(12n);
 const fault=await create(b,9n),before=fault.snapshot(),original=stateKernel.applyStatePatch;let reached=false;const spy=vi.spyOn(stateKernel,'applyStatePatch').mockImplementation((...args)=>{const result=original(...args);if(args[1].operations.some(o=>o.kind==='set'&&typeof o.newValue!=='boolean'&&o.newValue.kind==='record'&&o.newValue.schema.typeId===372n&&o.newValue.schema.schemaVersion===2n)){reached=true;throw Error('M97 after cancellation patch');}return result;});try{await expect(fault.settleNextInstant()).rejects.toThrow('M97 after cancellation patch');}finally{spy.mockRestore();}expect(reached).toBe(true);expect({...fault.snapshot(),status:before.status}).toEqual(before);expect(fault.diagnostic()).toBeDefined();
 console.info('M97 CONTINUATION PASS9 -> '+clocks.join(',')+'; exact full saves; cancellation-patch fault restores public snapshot');
},570000);
