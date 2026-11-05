import {vi} from 'vitest';
import {typedIdentifier,signed} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePathValue} from '../substrate/state';
import * as stateModule from '../substrate/state';
import {simInstant} from '../substrate/time';
import {compileCharacterModel,SPATIAL_MEANING_RULES,SPATIAL_MEANING_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {createControlExecution} from '../assembled/controlExecution';
import {WORKSPACE_OWNER,controlGoalPath} from '../assembled/control';
import {FATIGUE,FATIGUE_OWNER,FATIGUE_SOURCE,FATIGUE_OBSERVE,compileFatigue,fatigueCondition,fatigueGrade,createFatigueExecution} from '../assembled/fatigue';
import {fatigueFrame} from './fixtures/assembledFatigue';
import {compileFatigueModel,compileFatigueInputs,fatigueRecipe} from '../campaign3/fatigueModel';
import {createFatigueRuntime} from '../campaign3/fatigueRuntime';
import {fatigueCases,fatigueInputs} from './fatigueFixtures';
import {it,expect} from 'vitest';
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {CONTROL_VIEW,CONTROL_OPTIONS} from '../assembled/control';
import {FATIGUE_OBSERVATION,FATIGUE_VERSION,fatiguePath,fatigueJournal} from '../assembled/fatigue';
import {habitPath,habitJournal} from '../assembled/habit';
import {fixture,decode,items,key,enc} from './fixtures/assembledFatigue';
import {outputs,signedValue,through,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import {target} from './fixtures/assembledHabit';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const view=(r:Run,at:number)=>reports(r,CONTROL_VIEW).find(v=>uint(v[1])===BigInt(at))!;
const options=(r:Run,at:number)=>reports(r,CONTROL_OPTIONS).find(v=>uint(v[1])===BigInt(at))!;
const decision=(r:Run,at:number)=>outputs(r.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===BigInt(at))!;
function outcome(r:Run,at:number){const d=decision(r,at);expect(d).toBeDefined();const result=rec(f(d,4n),419n),kind=uint(f(result,1n));return {kind,chosen:kind===3n?rec(f(result,2n),420n):undefined};}
function live(r:Run,at:number){
 const v=view(r,at);expect(v).toBeDefined();expect(v[2]).toBe(true);expect(v[3]).toBe(true);expect(uint(v[8])).toBeGreaterThanOrEqual(1n);
 const trace=outputs(r.snapshot().trace,160n).find(t=>txt(f(t,6n))===FATIGUE_VERSION&&uint(f(rec(f(t,4n),130n),3n))===70n&&signedValue(f(rec(f(t,4n),130n),2n))===BigInt(at))!;
 expect(trace).toBeDefined();const before=rec(items(f(trace,12n),'list')[0],398n),candidates=items(f(before,3n),'list');
 expect(candidates.some(v=>key(f(rec(f(rec(v,397n),1n),395n),2n))===key(target))).toBe(true);
 const draws=outputs(r.snapshot().trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===BigInt(at)).flatMap(t=>items(f(t,14n),'list'));expect(draws).toHaveLength(0);
 const workspace=outputs(r.snapshot().trace,160n).find(t=>txt(f(t,6n))===FATIGUE_VERSION&&uint(f(rec(f(t,4n),130n),3n))===40n&&signedValue(f(rec(f(t,4n),130n),2n))===BigInt(at))!;
 expect(workspace).toBeDefined();const read=items(f(workspace,11n),'list').map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(fatiguePath(C))))!;
 expect(read).toBeDefined();const condition=items(v[11],'list');expect(f(read,3n)).toBe(condition[1]);if(condition[1])expect(f(read,4n)).toEqual(condition[4]);
 const resolution=outcome(r,at);if(resolution.chosen)expect(f(resolution.chosen,8n)).toEqual(u(1));
 return v;
}
const journal=(r:Run)=>fatigueJournal(state(r).read(fatiguePath(C)).value,C);
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);}
function exact(a:Run,b:Run){for(const k of ['state','outputs','trace'] as const)bytes(a.snapshot()[k],b.snapshot()[k]);bytes(a.save(),b.save());expect(b.snapshot().clock).toBe(a.snapshot().clock);}
it('witness: experienced fatigue impairs live inhibition and observed recovery restores it',async()=>{
 const A=fixture(),B=fixture({physical:0});expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);bytes(A.d.runSeed,B.d.runSeed);
 const model=await prepareCharacterModel(A.s),a=await createCharacterRun(model,A.d),b=await createCharacterRun(model,B.d);
 await through(a,4n);await through(b,4n);
 const history=habitJournal(state(a).read(habitPath(C)).value);expect(history.length).toBeGreaterThan(0);expect(habitJournal(state(b).read(habitPath(C)).value)).toEqual(history);
 expect(journal(a)).toHaveLength(1);expect(journal(b)).toHaveLength(1);const save=a.save();
 for(const at of [5,7]){
  await through(a,BigInt(at));await through(b,BigInt(at));const av=live(a,at),bv=live(b,at);
  console.info('M55 LIVE '+at+' maintained/spare/offered target/no dice in both arms');
  expect(av[9]).toBe(false);expect(bv[9]).toBe(true);expect(items(av[11],'list')[3]).toBe(true);expect(items(bv[11],'list')[3]).toBe(false);
  const ao=outcome(a,at),bo=outcome(b,at);expect(ao.kind).toBe(3n);expect(ao.chosen).toBeDefined();expect(f(rec(f(ao.chosen!,1n),395n),2n)).toEqual(target);expect(bo.kind).not.toBe(3n);
  expect(items(options(a,at)[3],'list')).toHaveLength(0);expect(items(options(b,at)[3],'list').length).toBeGreaterThan(0);
  expect(journal(a)).toHaveLength(1);expect(journal(b)).toHaveLength(1);
 }
 await through(a,9n);await through(b,9n);for(const r of [a,b]){expect(live(r,9)[9]).toBe(true);expect(outcome(r,9).kind).not.toBe(3n);expect(journal(r)).toHaveLength(2);expect(habitJournal(state(r).read(habitPath(C)).value).slice(0,history.length)).toEqual(history);}
 console.info('M55 WITNESS severe permits actual target5/7; rested withholds; both withhold9 after recovery. Original acquired habit retained.');
 const restored=await restoreCharacterRun(A.s,{initialState:A.d.initialState,orderedInputs:A.d.orderedInputs,save});expect(restored.snapshot().clock).toBe(4n);bytes(restored.save(),save);await through(restored,9n);exact(a,restored);
 console.info('M55 CONTINUATION save4 ->9 state/output/trace/save exact');
},600000);

it('original: native fatigue observations and control candidates retain exact predicates',async()=>{
 const cases=fatigueCases();let frames=0;
 for(const [candidate,law] of [[1,'SevereThreshold'],[2,'NoFatigue'],[4,'AnyFatigue']] as const)for(const name of ['main','mild','falseFatigue'] as const){
  const xs=cases[name],m=await compileFatigueModel(fatigueRecipe({candidate,law:1})),input=await compileFatigueInputs(m,enc(m.initial.canonicalValue()),fatigueInputs(xs),new Uint8Array(32).fill(7)),r=createFatigueRuntime(m,input);while(await r.settle()){}
  const apps=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1339n),obs=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1349n);
  expect(apps).toHaveLength(xs.length);expect(obs).toHaveLength(xs.length);let rows:CanonicalValue[]=[];
  for(let i=0;i<xs.length;i++){const x=xs[i],a=rec(apps[i],1339n),condition=fatigueCondition(rows.length?list([text(FATIGUE),list(rows)]):undefined,C,law);
   expect(condition.known).toBe(f(a,8n));expect(condition.impaired).toBe(f(a,7n));if(condition.known)expect(condition.grade).toBe(uint(f(a,9n)));
   const grade=fatigueGrade({physical:BigInt(x.physical??0),display:BigInt(x.display??0),visible:x.seen??false,recipient:x.recipient??true});
   expect(f(rec(obs[i],1349n),3n)).toEqual(list(grade===undefined?[]:[u(grade)]));
   if(grade!==undefined)rows.push(list([text(FATIGUE_OBSERVATION),typedIdentifier(1164,u(i)),C,u(x.at),list([u(grade)])]));frames++;
  }
 }
 // MotorOnly remains an independent original execution control.
 const xs=cases.motorChallenge,m=await compileFatigueModel(fatigueRecipe({candidate:3})),input=await compileFatigueInputs(m,enc(m.initial.canonicalValue()),fatigueInputs(xs),new Uint8Array(32).fill(7)),r=createFatigueRuntime(m,input);while(await r.settle()){}
 const os=r.snapshot().outputs;for(const a of os.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1339n))expect(f(rec(a,1339n),7n)).toBe(false);
 expect(f(rec(os.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1348n)[3],1348n),3n)).toBe(false);
 console.info('M55 ORIGINAL '+frames+' native observation/control comparisons; MotorOnly forced execution failure retained');
},300000);

it('epistemic: fixed evidence hides physical truth; denied and mild onsets preserve control',async()=>{
 const model=await prepareCharacterModel(fixture().s),a=await createCharacterRun(model,fixture({physical:2,display:3}).d),b=await createCharacterRun(model,fixture({physical:0,display:3}).d);
 await through(a,7n);await through(b,7n);for(const r of [a,b]){expect(live(r,5)[9]).toBe(false);expect(live(r,7)[9]).toBe(false);}
 bytes(a.snapshot().state,b.snapshot().state);bytes(a.snapshot().outputs,b.snapshot().outputs);
 for(const options of [{recipient:false},{visible:false},{physical:1}]){
  const r=await createCharacterRun(model,fixture(options).d);await through(r,5n);const v=live(r,5),condition=items(v[11],'list');
  expect(v[9]).toBe(true);expect(condition[1]).toBe(options.physical===1);expect(condition[3]).toBe(false);expect(journal(r)).toHaveLength(options.physical===1?1:0);
  expect(outcome(r,5).kind).not.toBe(3n);
 }
 console.info('M55 EPISTEMIC fixed display3 with physical0/2 gives exact cognitive outputs/state through7; denied/absent unknown, mild known but unimpaired');
},600000);

it('boundaries: admission, one journal authority, authenticated stages and atomic late rollback',async()=>{
 const {s,d}=fixture(),model=await compileCharacterModel(s),component=await compileCharacterState(model),initial=component.initialState(d.initialState),inputs=await compileCharacterInputs(model,component,d),m=await prepareCharacterModel(s);
 const path=fatiguePath(C),observation=list([text(FATIGUE_OBSERVATION),typedIdentifier(1164,u(1)),C,u(4),list([u(2)])]),value=list([text(FATIGUE),list([observation])]),patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:value}]};
 expect(()=>component.stateModel.applyPatch(initial,patch,WORKSPACE_OWNER)).toThrow();
 const learned=component.stateModel.applyPatch(initial,patch,FATIGUE_OWNER).state;
 expect(()=>component.stateModel.applyPatch(learned,{operations:[{kind:'set',path,expected:{presence:true,value},newValue:value}]},FATIGUE_OWNER)).toThrow('append');
 await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value}]).canonicalValue())})).rejects.toThrow('initial fatigue');
 const rows=items(decode(d.orderedInputs),'list'),source=rows.find(v=>key(items(v,'list')[2])===key(FATIGUE_SOURCE))!,a=items(source,'list');
 for(const bad of [source,list([signed(101),...a.slice(1)]),list([a[0],u(120),...a.slice(2)]),list([a[0],a[1],FATIGUE_OBSERVE,a[3],a[4]]),fatigueFrame(2,3)]){
  await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,bad]))})).rejects.toThrow();
 }
 expect(()=>compileFatigue(list([text(FATIGUE),text('MotorOnly')]))).toThrow();
 const old={...s,rulesVersion:SPATIAL_MEANING_RULES,registrySchemaVersion:SPATIAL_MEANING_REGISTRY,registry:enc(list(items(decode(s.registry),'list').slice(0,38)))};
 await expect(createCharacterRun(await prepareCharacterModel(old),d)).rejects.toThrow('fatigue source');
 // Exercise private child authentication independently of the public rejection.
 const core=createControlExecution(C,target,component.stateModel,[],model.modelIdentity.value,inputs.runIdentity.value,32,'SevereThreshold'),owner=createFatigueExecution(C,component.stateModel,[inputs.fatigueEvents[0]],model.modelIdentity.value,inputs.runIdentity.value).extend(core),start=inputs.fatigueEvents[0];let runtime=1n;
 const context={event:start,state:initial,instant:simInstant(4n),allocateRuntimeId:()=>runtime++};owner.begin(4n);
 const first=owner.execute(context),observe={...first.emittedEvents[0],eventId:10000n,eventSequence:10000n,causalParentEventIds:[start.eventId]};
 expect(()=>owner.execute({...context,event:observe})).toThrow('unauthenticated');
 expect(()=>first.traceFactory([{...observe,causalParentEventIds:[]}])).toThrow('mismatch');first.traceFactory([observe]);
 const second=owner.execute({...context,event:observe}),learn={...second.emittedEvents[0],eventId:10001n,eventSequence:10001n,causalParentEventIds:[observe.eventId]};second.traceFactory([learn]);
 expect(()=>owner.prepare([{...learn,causalParentEventIds:[]}],initial)).toThrow('unauthenticated');const stage=owner.prepare([learn],initial);stage.execute({...context,event:learn});expect(()=>stage.execute({...context,event:learn})).toThrow('stage order');const final=stage.finish(initial);expect(fatigueJournal(final.read(path).value,C)).toHaveLength(1);expect(stage.traces()).toHaveLength(1);owner.prepareCommit();owner.close();
 // Throw after the real root1351 patch, so goal4 and fatigue140 both roll back.
 const r=await createCharacterRun(m,d);await through(r,3n);const before=r.snapshot(),apply=stateModule.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===1351n)){expect(result.state.read(path).presence).toBe(true);reached=true;throw Error('M55 after fatigue140');}return result;});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M55 after fatigue140');expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)bytes(r.snapshot()[k],before[k]);expect(r.snapshot().clock).toBe(before.clock);expect(state(r).read(path).presence).toBe(false);expect(state(r).read(controlGoalPath(C)).presence).toBe(false);}finally{spy.mockRestore();}
 console.info('M55 BOUNDARIES version/source/bootstrap, unique owner, append, child authentication and late140 whole-instant rollback PASS');
},600000);
