import {fatigueFrame} from './fixtures/assembledFatigue';
import {fatiguePath,fatigueJournal} from '../assembled/fatigue';
import {cognitiveRecord as cr} from '../campaign2/cognitiveCodecs';
import {embodiedRecord as er} from '../campaign3/embodiedCodecs';
import {sharedWorkspace} from '../assembled/workspace';
import {EPISODE,MEMORY_RECALL} from '../assembled/memory';
import {BODY_OBSERVER,BODY_CHANNEL} from '../assembled/body';
import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,signed,typedIdentifier,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../substrate/state';
import * as stateModule from '../substrate/state';
import {simInstant} from '../substrate/time';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,FATIGUE_RULES,FATIGUE_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {createControlExecution} from '../assembled/controlExecution';
import {CONTROL_VIEW,CONTROL_OPTIONS,WORKSPACE_OWNER,controlGoalPath,controlAllocation} from '../assembled/control';
import {RUMINATION,RUMINATION_OBSERVATION,RUMINATION_INSTRUCTION,RUMINATION_INSTRUCT,RUMINATION_LEARN,RUMINATION_VERSION,RUMINATION_SOURCE,RUMINATION_OBSERVE,RUMINATION_OWNER,compileRumination,ruminationPath,ruminationJournal,ruminationCondition,ruminationAllocation,ruminationDisplay,createRuminationExecution,type RuminationSettings} from '../assembled/rumination';
import {habitPath,habitJournal,rewardPath} from '../assembled/habit';
import {fixture,concernFrame,decode,items,key,enc} from './fixtures/assembledRumination';
import {outputs,signedValue,through,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import {target} from './fixtures/assembledHabit';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {compileRuminationModel,compileRuminationInputs,ruminationRecipe} from '../campaign3/ruminationModel';
import {createRuminationRuntime} from '../campaign3/ruminationRuntime';
import {ruminationCases,ruminationInputs} from './ruminationFixtures';
const settingRow=items(items(decode(fixture().s.registry),'list')[39],'list');
const settings:RuminationSettings={task:settingRow[1],law:'EveryOpportunity'};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const view=(r:Run,at:number)=>reports(r,CONTROL_VIEW).find(v=>uint(v[1])===BigInt(at))!;
const options=(r:Run,at:number)=>reports(r,CONTROL_OPTIONS).find(v=>uint(v[1])===BigInt(at))!;
const decision=(r:Run,at:number)=>outputs(r.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===BigInt(at))!;
function outcome(r:Run,at:number){const d=decision(r,at);expect(d).toBeDefined();const result=rec(f(d,4n),419n),kind=uint(f(result,1n));return {kind,chosen:kind===3n?rec(f(result,2n),420n):undefined};}
function live(r:Run,at:number){
 const v=view(r,at);expect(v).toBeDefined();expect(v[2]).toBe(true);expect(v[3]).toBe(true);expect(uint(v[8])+BigInt(items(v[12],'list')[8]===true)+uint(v[7])).toBe(1n);expect(items(v[11],'list')[3]).toBe(false);
 const trace=outputs(r.snapshot().trace,160n).find(t=>txt(f(t,6n))===RUMINATION_VERSION&&uint(f(rec(f(t,4n),130n),3n))===70n&&signedValue(f(rec(f(t,4n),130n),2n))===BigInt(at))!;
 expect(trace).toBeDefined();const before=rec(items(f(trace,12n),'list')[0],398n),candidates=items(f(before,3n),'list');
 expect(candidates.some(v=>key(f(rec(f(rec(v,397n),1n),395n),2n))===key(target))).toBe(true);
 const draws=outputs(r.snapshot().trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===BigInt(at)).flatMap(t=>items(f(t,14n),'list'));expect(draws).toHaveLength(0);
 const workspace=outputs(r.snapshot().trace,160n).find(t=>txt(f(t,6n))===RUMINATION_VERSION&&uint(f(rec(f(t,4n),130n),3n))===40n&&signedValue(f(rec(f(t,4n),130n),2n))===BigInt(at))!;
 expect(workspace).toBeDefined();const read=items(f(workspace,11n),'list').map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(ruminationPath(C))))!;
 expect(read).toBeDefined();const condition=items(v[12],'list');expect(f(read,3n)).toBe(condition[2]);if(condition[2])expect(f(read,4n)).toEqual(condition[9]);
 const resolution=outcome(r,at);if(resolution.chosen)expect(f(resolution.chosen,8n)).toEqual(u(1));
 return v;
}
const journal=(r:Run)=>ruminationJournal(state(r).read(ruminationPath(C)).value,C,settings);
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);}
function exact(a:Run,b:Run){for(const k of ['state','outputs','trace'] as const)bytes(a.snapshot()[k],b.snapshot()[k]);bytes(a.save(),b.save());expect(b.snapshot().clock).toBe(a.snapshot().clock);}
it('witness: recurrent concern occupies shared control; interruption rebounds until perceived resolution',async()=>{
 const A=fixture(),B=fixture({interrupt:false});expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);bytes(A.d.runSeed,B.d.runSeed);
 const model=await prepareCharacterModel(A.s),a=await createCharacterRun(model,A.d),b=await createCharacterRun(model,B.d);
 await through(a,4n);await through(b,4n);
 const history=habitJournal(state(a).read(habitPath(C)).value),reward=state(a).read(rewardPath(C));expect(history.length).toBeGreaterThan(0);
 expect(habitJournal(state(b).read(habitPath(C)).value)).toEqual(history);const concern=journal(a);expect(concern).toHaveLength(1);
 let save:Uint8Array|undefined;
 for(const at of [5,7,9,11]){
  await through(a,BigInt(at));await through(b,BigInt(at));
  for(const [r,interrupted] of [[a,true],[b,false]] as const){
   const v=live(r,at),diag=items(v[12],'list'),withhold=at===11||at===7&&interrupted;
   console.info('M56 LIVE '+at+' arm='+interrupted+' spare='+uint(v[8])+' concern='+diag.slice(2,9).map(String).join('/'));
   expect(diag[2]).toBe(true);expect(diag[3]).toBe(at<11);expect(diag[7]).toBe(!withhold);expect(diag[8]).toBe(!withhold);expect(v[9]).toBe(withhold);
   const o=outcome(r,at);expect(o.kind).toBe(withhold?1n:3n);if(o.chosen)expect(f(rec(f(o.chosen,1n),395n),2n)).toEqual(target);
   expect(habitJournal(state(r).read(habitPath(C)).value)).toEqual(history);expect(state(r).read(rewardPath(C))).toEqual(reward);
   expect(journal(r)).toHaveLength(at<9?1:2);expect(journal(r)[0]).toEqual(concern[0]);
  }
  if(at===7){save=a.save();expect(journal(a)).toEqual(concern);}
 }
 const restored=await restoreCharacterRun(A.s,{initialState:A.d.initialState,orderedInputs:A.d.orderedInputs,save:save!});expect(restored.snapshot().clock).toBe(7n);bytes(restored.save(),save!);await through(restored,11n);exact(a,restored);
 console.info('M56 WITNESS Auto A5 both; interruption withholds7; A9 rebound; both withhold11. Habit/reward unchanged. Save7 ->11 exact state/output/trace/save.');
},600000);


it('original: native concern observations and all four recurrence laws retain exact predicates',async()=>{
 const cases=ruminationCases();let frames=0;
 for(const [candidate,law] of [[1,'EveryOpportunity'],[2,'NoRecurrence'],[3,'StaticLoad'],[4,'Alternating']] as const)
 for(const name of ['main','denied','nonrecipient','boardDenied','externalLoad'] as const){
  const xs=cases[name],m=await compileRuminationModel(ruminationRecipe({candidate,law:1})),input=await compileRuminationInputs(m,enc(m.initial.canonicalValue()),ruminationInputs(xs),new Uint8Array(32).fill(7)),r=createRuminationRuntime(m,input);while(await r.settle()){}
  const apps=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1318n),obs=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1328n);
  expect(apps).toHaveLength(xs.length);expect(obs).toHaveLength(xs.length);const rows:CanonicalValue[]=[];
  for(let i=0;i<xs.length;i++){
   const x=xs[i],a=rec(apps[i],1318n),interrupt=(x.interrupt??false)&&(x.board??true),c=ruminationCondition(rows.length?list([text(RUMINATION),list(rows)]):undefined,C,{...settings,law},BigInt(x.at),interrupt);
   expect(c.access).toBe(f(a,7n));expect(c.interrupted).toBe(f(a,8n));expect(c.occupied).toBe(f(a,9n));
   expect(rows.map(v=>items(v,'list')[5])).toEqual(items(f(rec(f(a,6n),1329n),1n),'list').map(v=>f(rec(v,1328n),3n)));
   const display=ruminationDisplay({display:BigInt(x.display??0),visible:x.seen??true,recipient:x.recipient??true,interrupt,board:x.board??true,truth:x.truth??true});
   expect(f(rec(obs[i],1328n),3n)).toEqual(list(display===undefined?[]:[u(display)]));
   if(display!==undefined)rows.push(list([text(RUMINATION_OBSERVATION),typedIdentifier(1164,u(i)),C,settings.task,u(x.at),list([u(display)])]));frames++;
  }
 }
 console.info('M56 ORIGINAL '+frames+' native frames: four laws x main/denied/nonrecipient/board-denied/external-load, exact retained evidence, access/interruption/load and observation projection.');
},300000);

it('epistemic: hidden truth, denied onset/resolution/instruction and external load remain distinct',async()=>{
 const model=await prepareCharacterModel(fixture().s),a=await createCharacterRun(model,fixture({truth:true}).d),b=await createCharacterRun(model,fixture({truth:false}).d);
 await through(a,7n);await through(b,7n);for(const r of [a,b]){live(r,5);live(r,7);expect(outcome(r,5).kind).toBe(3n);expect(outcome(r,7).kind).toBe(1n);}
 bytes(a.snapshot().state,b.snapshot().state);bytes(a.snapshot().outputs,b.snapshot().outputs);
 const denied=await createCharacterRun(model,fixture({onset:false}).d);await through(denied,5n);expect(journal(denied)).toHaveLength(0);expect(items(live(denied,5)[12],'list')[2]).toBe(false);expect(outcome(denied,5).kind).toBe(1n);
 const resolution=await createCharacterRun(model,fixture({resolution:false}).d);await through(resolution,11n);expect(journal(resolution)).toHaveLength(1);expect(items(live(resolution,11)[12],'list')[3]).toBe(true);expect(outcome(resolution,11).kind).toBe(3n);
 const board=await createCharacterRun(model,fixture({board:false}).d);await through(board,7n);expect(items(live(board,7)[12],'list')[6]).toBe(false);expect(outcome(board,7).kind).toBe(3n);expect(journal(board)).toHaveLength(1);
 const external=await createCharacterRun(model,fixture({external:true}).d);await through(external,7n);
 const v=view(external,7),diag=items(v[12],'list');expect(v[3]).toBe(true);expect(v[4]).toBe(true);expect(uint(v[8])).toBe(0n);expect(diag[6]).toBe(true);expect(diag[7]).toBe(false);expect(diag[8]).toBe(false);expect(v[9]).toBe(false);expect(outcome(external,7).kind).toBe(3n);expect(journal(external)).toHaveLength(1);
 console.info('M56 EPISTEMIC cognitive state/output bytes unaffected by private truth; denied onset unknown; denied resolution persists; denied instruction recurs; external card consumes its own slot.');
},600000);

it('boundaries: one journal authority, authenticated stages, domain checks and atomic late rollback',async()=>{
 const {s,d}=fixture(),model=await compileCharacterModel(s),component=await compileCharacterState(model),initial=component.initialState(d.initialState),inputs=await compileCharacterInputs(model,component,d),m=await prepareCharacterModel(s);
 const path=ruminationPath(C),observation=list([text(RUMINATION_OBSERVATION),typedIdentifier(1164,u(1)),C,settings.task,u(4),list([u(1)])]),value=list([text(RUMINATION),list([observation])]),patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:value}]};
 expect(()=>component.stateModel.applyPatch(initial,patch,WORKSPACE_OWNER)).toThrow();
 const learned=component.stateModel.applyPatch(initial,patch,RUMINATION_OWNER).state;
 expect(()=>component.stateModel.applyPatch(learned,{operations:[{kind:'set',path,expected:{presence:true,value},newValue:value}]},RUMINATION_OWNER)).toThrow('append');
 await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value}]).canonicalValue())})).rejects.toThrow('initial rumination');
 const rows=items(decode(d.orderedInputs),'list'),source=rows.find(v=>key(items(v,'list')[2])===key(RUMINATION_SOURCE))!,a=items(source,'list');
 for(const bad of [source,list([signed(101),...a.slice(1)]),list([a[0],u(120),...a.slice(2)]),list([a[0],a[1],RUMINATION_OBSERVE,a[3],a[4]]),concernFrame(2,3),list([...a.slice(0,4),list([u(1)])])])
  await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,bad]))})).rejects.toThrow();
 expect(()=>compileRumination(list([text(RUMINATION),settings.task,text('Retirement')]),[{task:settings.task}])).toThrow();
 expect(()=>compileRumination(list([text(RUMINATION),text('foreign'),text('EveryOpportunity')]),[{task:settings.task}])).toThrow();
 const old={...s,rulesVersion:FATIGUE_RULES,registrySchemaVersion:FATIGUE_REGISTRY,registry:enc(list(items(decode(s.registry),'list').slice(0,39)))};
 await expect(createCharacterRun(await prepareCharacterModel(old),d)).rejects.toThrow('rumination source');
 const core=createControlExecution(C,target,component.stateModel,[],model.modelIdentity.value,inputs.runIdentity.value,32,'SevereThreshold'),owner=createRuminationExecution(C,settings,component.stateModel,[inputs.ruminationEvents[0]],model.modelIdentity.value,inputs.runIdentity.value).extend(core),start=inputs.ruminationEvents[0];let runtime=1n;
 const context={event:start,state:initial,instant:simInstant(4n),allocateRuntimeId:()=>runtime++};owner.begin(4n);
 const first=owner.execute(context),children=first.emittedEvents.map((e,i)=>({...e,eventId:10000n+BigInt(i),eventSequence:10000n+BigInt(i),causalParentEventIds:[start.eventId]})),[instruct,observe]=children;
 expect(()=>owner.execute({...context,event:observe})).toThrow('unauthenticated');
 expect(()=>first.traceFactory(children.map(e=>({...e,causalParentEventIds:[]})))).toThrow('mismatch');first.traceFactory(children);
 const instruction=owner.execute({...context,event:instruct});instruction.traceFactory([]);
 const second=owner.execute({...context,event:observe}),learn={...second.emittedEvents[0],eventId:10002n,eventSequence:10002n,causalParentEventIds:[observe.eventId]};second.traceFactory([learn]);
 expect(()=>owner.prepare([{...learn,causalParentEventIds:[]}],initial)).toThrow('unauthenticated');const stage=owner.prepare([learn],initial);stage.execute({...context,event:learn});expect(()=>stage.execute({...context,event:learn})).toThrow('stage order');const final=stage.finish(initial);expect(ruminationJournal(final.read(path).value,C,settings)).toHaveLength(1);expect(stage.traces()).toHaveLength(1);owner.prepareCommit();owner.close();
 const r=await createCharacterRun(m,d);await through(r,3n);const before=r.snapshot(),apply=stateModule.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===1330n)){expect(result.state.read(path).presence).toBe(true);reached=true;throw Error('M56 after concern140');}return result;});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M56 after concern140');expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)bytes(r.snapshot()[k],before[k]);expect(r.snapshot().clock).toBe(before.clock);expect(state(r).read(path).presence).toBe(false);expect(state(r).read(controlGoalPath(C)).presence).toBe(false);}finally{spy.mockRestore();}
 console.info('M56 BOUNDARIES version/source/bootstrap, unique owner, append, child authentication and late140 whole-instant rollback PASS.');
},600000);


it('capacity: requested recurrence never overbooks the shared slots or reinforces recall',()=>{
 const journal=list([text(RUMINATION),list([list([text(RUMINATION_OBSERVATION),typedIdentifier(1164,u(1)),C,settings.task,u(4),list([u(1)])])])]);
 const instruction=(interrupted:boolean)=>list([text(RUMINATION_INSTRUCTION),typedIdentifier(1164,u(2)),C,u(5),interrupted]);
 // Structural handoff fixture: one already-retrieved episode, no extra simulation.
 const sample=er(461,[typedIdentifier(1115,u(1)),BODY_OBSERVER,BODY_CHANNEL,signed(3),er(462,[q(10,1),q(11,1)]),text('test/capacity')]);
 const episode=list([text(EPISODE),typedIdentifier(1125,u(1)),sample,list([]),list([]),signed(3)]);
 const workspace=cr(381,[typedIdentifier(1128,u(1)),C,typedIdentifier(1027,text('definition/task-workspace')),list([]),cr(380,[u(1)])]);
 const delivery={character:C,event:{eventId:1n,eventSequence:1n,dueAt:simInstant(5n),phase:20n,eventTypeId:MEMORY_RECALL,payload:BODY_CHANNEL,dependencies:list([]),causalParentEventIds:[]},episodes:[episode]};
 for(const cap of [0,1,2])for(const interrupted of [false,true]){
  const r=ruminationAllocation(journal,C,settings,5n,instruction(interrupted),cap),selected=items(items(sharedWorkspace(workspace,cap,5n,[delivery],Number(r.selected),32).report,'list')[4],'list');
  expect(r.selected).toBe(!interrupted&&cap>0);expect(r.actualAccess).toBe(r.selected);
  expect(selected).toHaveLength(Math.min(1,cap-Number(r.selected)));expect(selected.length+Number(r.selected)).toBeLessThanOrEqual(cap);
 }
 const full=controlAllocation(6,4,true,true,true,true,true,32);expect(full.spare).toBe(0);
 const request=ruminationAllocation(journal,C,settings,5n,instruction(false),full.spare);expect(request.access).toBe(true);expect(request.selected).toBe(false);
 for(const [law,access,occupied] of [['NoRecurrence',false,false],['StaticLoad',false,true],['EveryOpportunity',true,true],['Alternating',true,true]] as const){
  const c=ruminationAllocation(journal,C,{...settings,law},5n,instruction(false),1);expect(c.actualAccess).toBe(access);expect(c.selected).toBe(occupied);
 }
 expect(ruminationCondition(journal,C,{...settings,law:'Alternating'},6n,false).access).toBe(false);
 expect(ruminationAllocation(journal,C,{...settings,law:'StaticLoad'},5n,instruction(true),1).selected).toBe(true);
 expect(()=>ruminationAllocation(journal,C,settings,5n,instruction(false),-1)).toThrow();
 expect(()=>ruminationCondition(journal,C,settings,4n,false)).toThrow('prior');
 expect(ruminationJournal(journal,C,settings)).toHaveLength(1);
 console.info('M56 CAPACITY zero/one/two slots; recurrence vs recall; external saturation; candidate distinctions; no evidence mutation.');
});


it('joined: fatigue and concern share learning140 and disclose consumed instruction/evidence',async()=>{
 const {s,d}=fixture();d.orderedInputs=enc(list([...items(decode(d.orderedInputs),'list'),fatigueFrame(4,2)]));
 const r=await createCharacterRun(await prepareCharacterModel(s),d);await through(r,5n);
 expect(journal(r)).toHaveLength(1);expect(fatigueJournal(state(r).read(fatiguePath(C)).value,C)).toHaveLength(1);expect(state(r).read(controlGoalPath(C)).presence).toBe(true);
 const v=view(r,5),diag=items(v[12],'list');expect(items(v[11],'list')[3]).toBe(true);expect(diag[8]).toBe(true);expect(v[9]).toBe(false);
 const ts=outputs(r.snapshot().trace,160n),instruction=reports(r,RUMINATION_INSTRUCTION).find(x=>uint(x[3])===5n)!,receipt=list(instruction);
 expect(diag[10]).toEqual(receipt);
 const source=ts.find(t=>key(f(rec(f(t,4n),130n),5n))===key(RUMINATION_INSTRUCT)&&signedValue(f(rec(f(t,4n),130n),2n))===5n)!;
 expect(source).toBeDefined();const sourceEvent=uint(f(rec(f(source,4n),130n),1n));
 for(const phase of [40n,70n]){
  const t=ts.find(t=>txt(f(t,6n))===RUMINATION_VERSION&&uint(f(rec(f(t,4n),130n),3n))===phase&&signedValue(f(rec(f(t,4n),130n),2n))===5n)!;
  expect(t).toBeDefined();expect(items(f(t,9n),'list').some(x=>key(x)===key(instruction[1]))).toBe(true);
  if(phase===40n){
   const reads=items(f(t,11n),'list').map(x=>rec(x,147n)),read=reads.find(x=>key(f(x,2n))===key(statePathValue(ruminationPath(C))))!;
   expect(f(read,4n)).toEqual(diag[9]);
   const children=items(f(t,18n),'list').map(x=>rec(x,130n));expect(children.length).toBeGreaterThan(0);
   const appraisal=children.find(e=>uint(f(e,3n))===50n)!;expect(appraisal).toBeDefined();expect(items(f(appraisal,8n),'list').map(uint)).toContain(sourceEvent);
  }
 }
 const after4=ts.filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===5n&&key(f(rec(f(t,4n),130n),5n))===key(RUMINATION_LEARN));
 expect(after4).toHaveLength(1);expect(f(rec(f(after4[0],16n),144n),1n)).toEqual(list([]));
 console.info('M56 JOINED fatigue/concern/goal writes coexist; control trace consumes safe instruction and exact journal; emitted causal parents include instruction; missing report makes no concern patch.');
},600000);
