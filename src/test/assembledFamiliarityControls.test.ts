import {dataIdentity as id} from '../campaign2/canonicalData';
import {fixture as claimFixture} from './fixtures/assembledLongitudinalCompletion';
import {FAMILIARITY_RULES,FAMILIARITY_REGISTRY} from '../assembled/model';
import {it,expect,vi} from 'vitest';
import {BODY_OBSERVER} from '../assembled/bodyIdentifiers';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,PROCEDURAL_LOSS_RULES,PROCEDURAL_LOSS_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import * as memory from '../assembled/memory';
import {APPEARANCE_EPISODE,FAMILIARITY,appearanceEpisode,appearancePath} from '../assembled/familiarity';
import {recognize} from '../campaign3/familiarityMath';
import {familiarityRecord as r} from '../campaign3/familiarityCodecs';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {start,state,episodes,reports,report,through,finish} from './assembledFamiliarity.test';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type CanonicalValue,type Mode} from './fixtures/assembledFamiliarity';
const remap=(v:CanonicalValue,ns:number)=>typedIdentifier(ns,id(v).payload);
function original(rn:Awaited<ReturnType<typeof start>>['r'],out:readonly CanonicalValue[]){
 const trace=outputs(rn.snapshot().trace,160n).find(t=>key(f(t,13n))===key(list([list(out)])))!;
 expect(trace).toBeDefined();const reads=items(f(trace,11n),'list').map(v=>f(rec(v,147n),4n)),p=items(out[2],'list');
 const obs=r(1057,[remap(p[0],1167),BODY_OBSERVER,p[2],p[3],p[4],p[5],p[6]]),mem=r(1059,[list(reads.map(v=>{const a=appearanceEpisode(v);return r(1058,[remap(a[2],1167),a[5],a[4],a[6],a[7],a[8]]);} ))]);
 const at=(p[2] as {value:bigint}).value,results=[1,2,3,4].map(law=>recognize(obs,mem,law,at,typedIdentifier(1167,u(1))));
 expect([4n,5n].map(n=>f(rec(results[0],1062n),n))).toEqual(out.slice(3,5));expect(list(items(f(rec(results[0],1062n),6n),'list').map(v=>remap(v,1115)))).toEqual(out[5]);
 const rows=items(f(rec(results[0],1062n),7n),'list').map(v=>list([1n,2n,3n,4n,5n,6n].map(n=>n===1n?remap(f(rec(v,1061n),n),1115):f(rec(v,1061n),n))));expect(list(rows)).toEqual(out[6]);
 return results.map(v=>uint(f(rec(v,1062n),4n)));
}
it('signatures154: actual partial disjoint missing and category contrasts match original controls',async()=>{
 for(const [mode,status] of [['partial',5n],['novel',3n],['missing',2n],['place',4n],['crossCategory',1n]] as const){
  const x=await start(mode);await finish(x.r);const out=report(x.r,5);expect(uint(out[3]),mode).toBe(status);
  for(const a of reports(x.r))original(x.r,a);
  const candidates=original(x.r,out);
  if(mode==='partial'){expect(candidates[1]).toBe(3n);expect(candidates[2]).toBe(2n);}
  if(mode==='missing')expect(candidates[3]).toBe(3n);
 }
 console.info('M154 SIGNATURES PASS person/place/partial/disjoint/missing/category isolation; original kernels on actual trace operands; ExactOnly/DetailRequired/MissingAsFalse discriminated');
},540000);
it('boundaries154: real fragment rollback and exact recovered continuation; wrong owners versions and forged learned starts reject',async()=>{
 const small=fixture('same',2),limited=await createCharacterRun(await prepareCharacterModel(small.s),small.d);await through(limited,1n);const firstLimited=episodes(limited)[0];expect(firstLimited).toBeDefined();await through(limited,4n);expect(state(limited).read(firstLimited.path).presence).toBe(false);expect(state(limited).entries().filter(e=>e.path.rootStateTypeId===346n&&typeof e.value!=='boolean'&&e.value.kind==='list').length).toBeLessThanOrEqual(2);await finish(limited);
 const x=await start();await through(x.r,1n);const acquired=episodes(x.r)[0],v=acquired.value,c=await compileCharacterState(await compileCharacterModel(x.b.s)),a=appearanceEpisode(v);
 expect(()=>c.stateModel.applyPatch(state(x.r),{operations:[{kind:'set',path:acquired.path,expected:{presence:true,value:v},newValue:list([...a.slice(0,8),list([])])}]},typedIdentifier(1025,text('authority/wrong')))).toThrow();
 expect(()=>c.stateModel.read(state(x.r),appearancePath(target,a[2]))).toThrow('holder');
 expect(()=>c.stateModel.applyPatch(state(x.r),{operations:[{kind:'set',path:acquired.path,expected:{presence:true,value:v},newValue:list([...a.slice(0,6),list([false]),...a.slice(7)])}]},memory.EPISODIC_OWNER)).toThrow('only peripheral');
 const old=await compileCharacterState(await compileCharacterModel({...x.b.s,rulesVersion:PROCEDURAL_LOSS_RULES,registrySchemaVersion:PROCEDURAL_LOSS_REGISTRY}));expect(()=>old.stateModel.validateState(state(x.r))).toThrow('appearance version');
 const initial=c.initialState(x.b.d.initialState);await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),acquired]).canonicalValue())})).rejects.toThrow('initial');
 const make=memory.createEpisodicExtension;let reached=false;
 const spy=vi.spyOn(memory,'createEpisodicExtension').mockImplementation((...args)=>{const component=make(...args);return Object.freeze({...component,observeAppearance(...xs){if(xs[1]&&xs[0].dueAt===1n){expect(()=>component.observeAppearance({...xs[0],payload:list([])},xs[1],xs[2],xs[3],xs[4])).toThrow('source association');const wrong=[...items(xs[1].observation,'list')];wrong[1]=target;const evidence={...xs[1],observation:list(wrong)};expect(()=>component.observeAppearance({...xs[0],payload:list([evidence.observation,evidence.experience])},evidence,xs[2],xs[3],xs[4])).toThrow('source holder');}const out=component.observeAppearance(...xs);if(xs[1]&&xs[0].dueAt===1n)expect(()=>component.observeAppearance(...xs)).toThrow('source lifecycle');return out;},prepare(...xs){const stage=component.prepare(...xs);return {...stage,finish(s){const next=stage.finish(s);if(xs[0].some(e=>e.dueAt===4n)){const first=next.read(acquired.path);if(first.presence&&items(appearanceEpisode(first.value!)[8],'list').length===0){reached=true;throw Error('M154 fragment rollback');}}return next;}};}});});
 let saved:Uint8Array|undefined;
 try{const fault=await createCharacterRun(x.m,x.b.d);await through(fault,1n);
  for(let i=0;i<32;i++){const before=fault.snapshot();saved=fault.save();try{await fault.settleNextInstant();}catch(e){expect(String(e)).toContain('M154 fragment rollback');expect(reached).toBe(true);expect({...fault.snapshot(),status:before.status}).toEqual(before);break;}}
  expect(reached).toBe(true);
 }finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved!});await finish(x.r);await finish(restored);exact(x.r,restored);
 console.info('M154 BOUNDARIES PASS reached actual detail-removal rollback, restored exact full continuation; foreign owner/holder, illegal rewrite, old version and learned S0 rejected');
},540000);

it('claimMemory154: current successor preserves the old claim-memory footprint and whole learned state',async()=>{
 const b=claimFixture('encodedEpisodes'),s={...b.s,rulesVersion:FAMILIARITY_RULES,registrySchemaVersion:FAMILIARITY_REGISTRY};
 const old=await createCharacterRun(await prepareCharacterModel(b.s),b.d),current=await createCharacterRun(await prepareCharacterModel(s),b.d);
 for(let i=0;i<96;i++){const more=await old.settleNextInstant();expect(await current.settleNextInstant()).toBe(more);bytes(old.snapshot().state,current.snapshot().state);expect(episodes(current)).toHaveLength(0);if(!more){expect(reports(current).length).toBeGreaterThan(0);console.info('M154 CLAIM MEMORY PASS whole state at every settlement equals0.113; no second appearance acquisition; actual current familiarity queries/full queues');return;}}
 throw Error('claim control queue cap');
},540000);

it('adapter154: historical observation/source namespaces retain a reversible correspondence',()=>{
 const source=typedIdentifier(1115,u(7));expect(remap(remap(source,1167),1115)).toEqual(source);
 const obs=r(1057,[remap(source,1167),BODY_OBSERVER,signed(5),u(1),list([true]),list([false]),list([])]),mem=r(1059,[list([r(1058,[remap(source,1167),signed(1),u(1),list([true]),list([true]),list([])])])]);
 const result=recognize(obs,mem,1,5n,typedIdentifier(1167,u(8)));expect(f(rec(result,1062n),4n)).toEqual(u(5));expect(f(rec(result,1062n),5n)).toEqual(list([q(1,2)]));
});
