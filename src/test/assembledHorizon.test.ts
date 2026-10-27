import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {createPriorityExecution} from '../assembled/priorityExecution';
import {PRIORITY,PRIORITY_OBS,PRIORITY_MOTIVE,PRIORITY_DISPLAY,PRIORITY_OBSERVE,PRIORITY_EVIDENCE,PRIORITY_LEARN,GOAL_OWNER,importancePath,importanceValue,factoredPriority} from '../assembled/priority';
import {skillPath,q,sid,SKILL_OWNER} from '../assembled/skill';
import {canonicalEncode as enc,list,text,signed,unsigned,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {createTemporalRun,type Law} from '../campaign3/temporalGoalConflict';
import {temporalCases} from './temporalGoalFixtures';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {prioritySource,priorityData,priorityFrame,mapPriorityInputs} from './fixtures/assembledPriority';
import {taskKeys} from './fixtures/assembledStrategy';
import {outputs} from './fixtures/assembledInteraction';
import {workLimit,changeDefinition} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
import {HORIZON,HORIZON_OBS,HORIZON_EVAL,HORIZON_DISPLAY,HORIZON_LEARN,forecastPath,forecastValue,horizonFactor} from '../assembled/horizon';
import {createHorizonExecution} from '../assembled/horizonExecution';
import {KNOWLEDGE_OWNER,DISPLAY,STRATEGY} from '../assembled/strategy';
import {horizonSource,horizonData,horizonFrame} from './fixtures/assembledHorizon';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const cognition=(r:Run)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId>=381n&&v.schema.typeId<=433n);
const traces=(r:Run)=>outputs(r.snapshot().trace,160n),event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n),name=(t:CanonicalValue)=>txt(id(f(rec(t,160n),7n)).payload);
function scheduled(t:CanonicalValue):ScheduledEvent{const e=event(t),time=f(e,2n);if(typeof time==='boolean'||time.kind!=='signed')throw Error('time');return {eventId:uint(f(e,1n)),dueAt:simInstant(time.value),phase:uint(f(e,3n)),eventSequence:uint(f(e,4n)),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(uint)};}
const choice=(r:Run,i:number)=>{const result=rec(f(outputs(r.snapshot().outputs,409n)[i],4n),419n);return uint(f(result,1n))!==3n?'None':txt(id(f(rec(f(rec(f(result,2n),420n),1n),395n),2n)).payload).endsWith('one')?'one':'two';};
const probability=(r:Run,i:number)=>{const resolution=outputs(r.snapshot().outputs,409n)[i],data=rec(f(rec(f(resolution,4n),419n),2n),420n);return items(f(data,2n),'list').map(v=>f(rec(v,421n),2n));};
const operand=(r:Run,at:number,task=taskKeys()[0])=>items(items(reports(r,PRIORITY_MOTIVE).find(x=>uint(x[1])===BigInt(at))![2],'list').find(v=>key(items(v,'list')[0])===key(task))!,'list');
const draws=(r:Run,at:number)=>new Map(traces(r).filter(t=>key(f(event(t),2n))===key(signed(at))).flatMap(t=>items(f(t,14n),'list')).map(v=>[key(f(rec(v,411n),1n)),rec(v,411n)]));
async function through(r:Run,time:bigint){for(let i=0;r.snapshot().clock<time;i++){expect(i).toBeLessThan(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(time);}
async function finish(r:Run){for(let i=0;await r.settleNextInstant();i++)expect(i).toBeLessThan(32);expect(r.snapshot().clock).toBe(10n);expect(r.diagnostic()).toBeUndefined();}
const exact=(a:Run,b:Run)=>{expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());};
const factor=(r:Run,at:number)=>items(operand(r,at)[6],'list')[5];
const forecast=(r:Run)=>state(r).read(forecastPath(taskKeys()[0]));
const status=(r:Run,task=taskKeys()[0])=>uint(f(rec(state(r).read({...forecastPath(task),rootStateTypeId:373n,fieldId:1n}).value!,372n),1n));
describe('M14 assembled horizon',()=>{
 it('matrix32: future opening changes present choice, preserves loser and permits later pursuit',async()=>{
  const m=await prepareCharacterModel(horizonSource()),changed:number[]=[],pursued:number[]=[],receipts:unknown[]=[];let matched=0,domains=0,unmatchedA=0,unmatchedB=0;
  const fractions=(xs:CanonicalValue[])=>xs.map(v=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('fraction');return v.numerator+'/'+v.denominator;});
  const distribution=(run:Run,i:number)=>items(f(outputs(run.snapshot().outputs,408n)[i],3n),'list').map(v=>f(rec(v,407n),7n));
  for(let seed=0;seed<16;seed++){
   const a=await createCharacterRun(m,horizonData(true,seed)),b=await createCharacterRun(m,horizonData(false,seed));await through(a,3n);await through(b,3n);
   expect(factor(a,3)).toEqual(rational(1,4));expect(factor(b,3)).toEqual(rational(1,1));expect(operand(a,3)[3]).toEqual(rational(1,4));expect(operand(b,3)[3]).toEqual(rational(1,1));expect.soft(distribution(a,0)).not.toEqual(distribution(b,0));expect.soft(probability(a,0)).not.toEqual(probability(b,0));
   if(choice(a,0)!==choice(b,0))changed.push(seed);const deferred=choice(a,0)==='two';if(deferred)expect(status(a)).toBe(1n);
   for(const run of [a,b]){const loser=taskKeys()[choice(run,0)==='one'?1:0];expect(status(run,loser)).toBe(1n);}
   const ad=draws(a,3),bd=draws(b,3);let sm=0,sd=0;for(const [address,x]of ad){const y=bd.get(address);if(!y){unmatchedA++;continue;}if(key(f(x,4n))===key(f(y,4n))&&key(f(x,5n))===key(f(y,5n))){expect(y).toEqual(x);matched++;sm++;}else{domains++;sd++;}}for(const address of bd.keys())if(!ad.has(address))unmatchedB++;
   await finish(a);await finish(b);for(const run of [a,b]){expect(factor(run,5)).toEqual(rational(1,1));for(const i of [0,1,2])expect(uint(f(outputs(run.snapshot().outputs,433n)[i],3n))).toBe(choice(run,i)==='one'?1n:2n);}
   if(deferred&&[1,2].some(i=>choice(a,i)==='one'))pursued.push(seed);
   const receipt={seed,available:[0,1,2].map(i=>choice(a,i)),unavailable:[0,1,2].map(i=>choice(b,i)),probability3:[fractions(probability(a,0)),fractions(probability(b,0))],matchedDraws:sm,changedDomains:sd};receipts.push(receipt);console.info('M14 pair '+JSON.stringify(receipt));
  }
  console.info('M14 matrix complete '+JSON.stringify({runs:32,changedSeeds:changed,laterPursuitSeeds:pursued,matchedDraws:matched,changedDomains:domains,unmatchedA,unmatchedB}));expect(changed.length).toBeGreaterThan(0);expect(pursued.length).toBeGreaterThan(0);expect(receipts).toHaveLength(16);
 },540000);
 it('controls: original eight-frame valuation and retained lifecycle diagnostics',async()=>{
  for(const law of ['HorizonRelative','NoTemporalBias'] as Law[]){const r=createTemporalRun(law,temporalCases().main);while(await r.step()){}for(const row of r.snapshot().rows){const prior=row.forecastBefore===0?undefined:{openingAt:5n,available:row.forecastBefore===2,support:list([]),observedAt:1n};const H=law==='NoTemporalBias'?Q.of(1n):horizonFactor(prior,BigInt(row.at));expect(row.values[1]).toBe(H.numerator+'/'+H.denominator);}}
  for(const law of ['DropLoser','SharedRetirement'] as Law[]){const r=createTemporalRun(law,temporalCases().main);while(await r.step()){}expect(r.snapshot().goals.some(g=>g.status==='Cancelled')).toBe(true);if(law==='DropLoser')expect(r.snapshot().rows[1].retiredByControl).toHaveLength(1);}
  expect(q(horizonFactor(undefined,3n))).toEqual(rational(1,1));
 });
 it('controls: prior-only correction, missing retention, nonpreset boundary and actual read provenance',async()=>{
  const m=await prepareCharacterModel(horizonSource());const corrected=await createCharacterRun(m,horizonData(true,7,[horizonFrame(1,true,9),horizonFrame(3,false,9)])),missing=await createCharacterRun(m,horizonData(true,7,[horizonFrame(1,true,9),horizonFrame(3,null)])),nonpreset=await createCharacterRun(m,horizonData(true,7,[horizonFrame(1,true,4)])),unknown=await createCharacterRun(m,horizonData(null));
  for(const run of [corrected,missing,nonpreset,unknown])await through(run,5n);
  expect(factor(corrected,3)).toEqual(rational(1,4));expect(factor(corrected,5)).toEqual(rational(1,1));expect(factor(missing,5)).toEqual(rational(1,4));expect(forecastValue(forecast(missing).value!).observedAt).toBe(1n);expect(forecastValue(forecast(corrected).value!).observedAt).toBe(3n);expect(factor(nonpreset,3)).toEqual(rational(1,4));expect(factor(nonpreset,5)).toEqual(rational(1,1));expect(factor(unknown,3)).toEqual(rational(1,1));expect(forecast(unknown).presence).toBe(false);
  const t=traces(corrected).find(t=>name(t)==='event/task-motive'&&key(f(event(t),2n))===key(signed(3)))!;expect(items(f(t,11n),'list').length).toBeGreaterThan(0);expect(items(f(t,9n),'list')).toContainEqual(items(items(operand(corrected,3)[6],'list')[3],'list')[3]);
 },120000);
 it('controls: denied forecasts preserve cognition, zero and missing urgency stay inert',async()=>{
  const m=await prepareCharacterModel(horizonSource()),a=await createCharacterRun(m,horizonData(true,7,[horizonFrame(1,true,99,false)])),b=await createCharacterRun(m,horizonData(false,7,[horizonFrame(1,false,1,false)]));await finish(a);await finish(b);expect(cognition(a)).toEqual(cognition(b));expect(state(a).canonicalValue()).toEqual(state(b).canonicalValue());expect(reports(a,HORIZON_OBS)).toEqual(reports(b,HORIZON_OBS));expect(forecast(a).presence).toBe(false);
  const zero=await createCharacterRun(m,horizonData(true,7,undefined,{},rational(0,1))),missing=await createCharacterRun(m,horizonData(true,7,undefined,{},rational(1,1),null));for(const run of [zero,missing]){await through(run,3n);expect(operand(run,3)[3]).toEqual(rational(0,1));expect(factor(run,3)).toEqual(rational(1,4));}
 },120000);
 it('controls: repeat and prefix restore preserve every later whole boundary',async()=>{
  const s=horizonSource(),d=horizonData(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);for(let i=0;await a.settleNextInstant();i++){expect(i).toBeLessThan(32);expect(await b.settleNextInstant()).toBe(true);expect(await restored.settleNextInstant()).toBe(true);exact(a,b);exact(a,restored);}expect(a.snapshot().clock).toBe(10n);expect(await restored.settleNextInstant()).toBe(false);
 },120000);
 it('controls: forecast cannot supply a missing route or revive expired goals',async()=>{
  const s=horizonSource(),d=horizonData(),m=await prepareCharacterModel(s),noRoute=mapPriorityInputs(d,row=>{const a=items(row,'list');if(key(a[2])!==key(DISPLAY))return row;const payload=items(a[3],'list');return list([...a.slice(0,3),list([payload[0],list(items(payload[1],'list').map(v=>{const x=items(v,'list');return list([...x.slice(0,3),false,...x.slice(4)]);} ))]),a[4]]);}),r=await createCharacterRun(m,noRoute);await through(r,3n);expect(choice(r,0)).toBe('None');expect(outputs(r.snapshot().outputs,433n)).toHaveLength(0);expect(status(r)).toBe(1n);
  const rows=items(decode(d.orderedInputs),'list'),decision=items(rows.find(row=>key(items(row,'list')[2])===key(sid(1001,'event/deliberation-opportunity')))!,'list'),late=await createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,list([signed(10),...decision.slice(1)])]))});await finish(late);expect(choice(late,3)).toBe('None');expect(items(reports(late,PRIORITY_MOTIVE).find(x=>uint(x[1])===10n)![2],'list')).toHaveLength(0);
 },90000);
 it('controls: closed admission, knowledge ownership, authenticated children and atomic late fault',async()=>{
  const s=horizonSource(),d=horizonData(),model=await compileCharacterModel(s),component=await compileCharacterState(model),m=await prepareCharacterModel(s),initial=component.initialState(d.initialState),p=forecastPath(taskKeys()[0]),value=list([text(HORIZON),unsigned(5),true,{kind:'typedIdentifier',namespaceId:1164n,payload:unsigned(1)},unsigned(1)]),patch={operations:[{kind:'set' as const,path:p,expected:{presence:false as const},newValue:value}]};
  await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path:p,value}]).canonicalValue())})).rejects.toThrow('initial strategy');expect(()=>component.stateModel.applyPatch(initial,patch,SKILL_OWNER)).toThrow();const learned=component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER).state;expect(()=>component.stateModel.applyPatch(learned,{operations:[{kind:'set',path:p,expected:{presence:true,value},newValue:value}]},KNOWLEDGE_OWNER)).toThrow('order');
  const rows=items(decode(d.orderedInputs),'list'),source=rows.find(row=>key(items(row,'list')[2])===key(HORIZON_DISPLAY))!,a=items(source,'list'),payload=items(a[3],'list'),dataRows=items(payload[1],'list'),r=items(dataRows[0],'list');
  for(const [i,bad]of [[0,sid(1030,'foreign')],[1,list([unsigned(0),true])],[1,list([unsigned(101),true])],[1,list([unsigned(5),unsigned(1)])],[1,list([unsigned(5)])],[2,unsigned(1)]] as [number,CanonicalValue][]){const x=[...r];x[i]=bad;await expect(createCharacterRun(m,mapPriorityInputs(d,v=>key(v)===key(source)?list([...a.slice(0,3),list([payload[0],list([list(x)])]),a[4]]):v))).rejects.toThrow();}
  for(const at of [0,101])await expect(createCharacterRun(m,mapPriorityInputs(d,v=>key(v)===key(source)?list([signed(at),...a.slice(1)]):v))).rejects.toThrow('time');
  await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,source]))})).rejects.toThrow('duplicate');await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,list([signed(3),unsigned(140),HORIZON_LEARN,list([]),list([])])]))})).rejects.toThrow();
  const run=await createCharacterRun(m,d);await through(run,1n);const ts=traces(run),ids=[...new Set(ts.map(t=>key(f(event(t),1n))))],formation=ts.find(t=>name(t)==='event/assembled-horizon-learn')!;expect(items(f(formation,17n),'list')).toHaveLength(1);const first140=ts.find(t=>uint(f(event(t),3n))===140n)!;expect(ids.indexOf(key(f(event(first140),1n)))).toBeLessThan(ids.length-1);const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(ids.length-1))),d),before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);console.info('M14 common-stage rollback '+ids.length+' events; limit'+(ids.length-1));
  const inputs=await compileCharacterInputs(model,component,d),owner=createHorizonExecution(C,component.tasks.map(t=>t.key),component.stateModel,inputs.horizonEvents,model.modelIdentity.value,inputs.runIdentity.value);owner.begin(1n);const original=inputs.horizonEvents[0],observed=scheduled(ts.find(t=>name(t)==='event/assembled-horizon-observe')!),evidence=scheduled(ts.find(t=>name(t)==='event/assembled-horizon-evidence')!),formationEvent=scheduled(formation);let next=uint(id(reports(run,HORIZON_OBS)[0][1]).payload);const context={state:initial,event:original,instant:simInstant(1n),allocateRuntimeId(){return next++;}};
  expect(()=>owner.execute({...context,event:observed})).toThrow('unbound');const admitted=owner.execute(context);expect(()=>admitted.traceFactory([{...observed,causalParentEventIds:[]}])).toThrow('mismatch');admitted.traceFactory([observed]);expect(()=>admitted.traceFactory([observed])).toThrow('lifecycle');const obs=owner.execute({...context,event:observed});obs.traceFactory([evidence]);expect(()=>owner.execute({...context,event:observed})).toThrow('unbound');const evid=owner.execute({...context,event:evidence});evid.traceFactory([formationEvent]);expect(()=>owner.prepare([{...formationEvent,causalParentEventIds:[]}],initial)).toThrow('unbound');const stage=owner.prepare([formationEvent],initial);stage.execute({...context,event:formationEvent});expect(()=>stage.execute({...context,event:formationEvent})).toThrow('lifecycle');expect(stage.finish(initial).read(p).presence).toBe(true);owner.prepareCommit();owner.close();
 },150000);
});
