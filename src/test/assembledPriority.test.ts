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
import {createImportanceRun,type Frame,type Law} from '../campaign3/importanceUrgency';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {prioritySource,priorityData,priorityFrame,mapPriorityInputs} from './fixtures/assembledPriority';
import {taskKeys} from './fixtures/assembledStrategy';
import {outputs} from './fixtures/assembledInteraction';
import {workLimit,changeDefinition} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
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
describe('M13 assembled priority',()=>{
 // Owner amendment9f851e57: preserve48 original runs and add32 fixed runs.
 for(const amended of [false,true])it(amended?'matrix added32: retained importance changes actual choice with current urgency1':'matrix original48: retain collision null control and other original cells',async()=>{
  const m=await prepareCharacterModel(prioritySource()),changed:number[]=[],receipts:unknown[]=[];let matched=0,domains=0,unmatchedA=0,unmatchedB=0;
  const fractions=(xs:CanonicalValue[])=>xs.map(v=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('fraction');return v.numerator+'/'+v.denominator;});
  const distributions=(run:Run,i:number)=>items(f(outputs(run.snapshot().outputs,408n)[i],3n),'list').map(v=>f(rec(v,407n),7n));
  const dice=(run:Run,i:number)=>items(f(outputs(run.snapshot().outputs,408n)[i],3n),'list').map(v=>Number(uint(f(rec(v,407n),4n))));
  for(let seed=0;seed<16;seed++){
   const options=amended?{urgency5:rational(1,1)}:{};
   const a=await createCharacterRun(m,priorityData(rational(1,1),rational(0,1),seed,options)),b=await createCharacterRun(m,priorityData(rational(1,2),rational(1,1),seed,options));
   await through(a,3n);await through(b,3n);expect(operand(a,3)[3]).toEqual(rational(1,2));expect(operand(b,3)[3]).toEqual(rational(1,2));expect(cognition(a)).toEqual(cognition(b));expect(state(a).read(skillPath(C))).toEqual(state(b).read(skillPath(C)));
   await through(a,5n);await through(b,5n);expect(operand(a,5)[3]).toEqual(amended?rational(1,1):rational(1,2));expect(operand(b,5)[3]).toEqual(amended?rational(1,2):rational(1,4));
   if(amended){expect.soft(probability(a,1)).not.toEqual(probability(b,1));expect.soft(distributions(a,1)).not.toEqual(distributions(b,1));}
   else {expect.soft(probability(a,1)).toEqual(probability(b,1));expect.soft(distributions(a,1)).toEqual(distributions(b,1));expect.soft(choice(a,1)).toEqual(choice(b,1));}
   if(choice(a,1)!==choice(b,1))changed.push(seed);
   const ad=draws(a,5),bd=draws(b,5);let seedMatched=0,seedDomains=0;
   for(const [address,x]of ad){const y=bd.get(address);if(!y){unmatchedA++;continue;}if(key(f(x,4n))===key(f(y,4n))&&key(f(x,5n))===key(f(y,5n))){expect(y).toEqual(x);matched++;seedMatched++;}else{domains++;seedDomains++;}}
   for(const address of bd.keys())if(!ad.has(address))unmatchedB++;
   for(const run of [a,b])expect(uint(f(outputs(run.snapshot().outputs,433n)[1],3n))).toBe(choice(run,1)==='one'?1n:2n);
   const cells=[{I:'1',U:'0',run:a},{I:'1/2',U:'1',run:b}];
   if(!amended&&seed<8)for(const [I,U,labelI,labelU]of [[rational(1,1),rational(1,1),'1','1'],[rational(1,2),rational(0,1),'1/2','0']] as const){const run=await createCharacterRun(m,priorityData(I,U,seed));await through(run,5n);expect(operand(run,3)[3]).toEqual(labelI==='1'?rational(1,1):rational(1,4));cells.push({I:labelI,U:labelU,run});}
   const seedReceipts=[];
   for(const cell of cells){await finish(cell.run);expect(operand(cell.run,7)[2]).toEqual(list([]));expect(operand(cell.run,7)[3]).toEqual(rational(0,1));const receipt={seed,I:cell.I,U3:cell.U,U5:amended?'1':'0',choices:[0,1,2].map(i=>choice(cell.run,i)),motive35:fractions([operand(cell.run,3)[3],operand(cell.run,5)[3]]),dice3:dice(cell.run,0),dice5:dice(cell.run,1),probability3:fractions(probability(cell.run,0)),probability5:fractions(probability(cell.run,1))};receipts.push(receipt);seedReceipts.push(receipt);}
   console.info('M13 '+(amended?'added32':'original48')+' '+JSON.stringify({receipts:seedReceipts,matchedDraws:seedMatched,changedDomains:seedDomains}));
  }
  console.info('M13 '+(amended?'added32':'original48')+' complete '+JSON.stringify({runs:receipts.length,changedSeeds:changed,matchedDraws:matched,changedDomains:domains,unmatchedA,unmatchedB}));
  if(amended){expect(changed.length).toBeGreaterThan(0);expect(domains).toBeGreaterThan(0);}else{expect(changed).toEqual([]);expect(domains).toBe(0);expect(unmatchedA+unmatchedB).toBe(0);}
  expect(matched).toBeGreaterThan(0);expect(receipts).toHaveLength(amended?32:48);
 },540000);
 it('controls: finite component correspondence and meaningful retained comparators',async()=>{
  const frames=(I:number,U:number):Frame[]=>[U,0,0,1000,0,0].map((u,i)=>({at:i+1,adopt:i?null:I,adoptionVisible:true,urgency:i===2?null:u,urgencyVisible:true,hiddenUrgency:0}));
  for(const I of [0,500,1000])for(const U of [0,1000]){const rows=frames(I,U),old=createImportanceRun('Factored',rows,7);while(await old.step()){}for(const row of old.observerView().rows)expect(q(factoredPriority(Q.of(BigInt(I),1000n),row.urgency===null?undefined:Q.of(BigInt(row.urgency),1000n)))).toEqual(rational(row.strength,1000));}
  const results=new Map<Law,number[]>();for(const law of ['Factored','RefoldImportance','ImportanceOnly','UrgencyOnly','FrozenProduct'] as Law[]){const run=createImportanceRun(law,frames(500,1000),7);while(await run.step()){}results.set(law,run.observerView().rows.map(r=>r.strength));}
  expect(results.get('RefoldImportance')).toEqual(results.get('Factored'));expect(results.get('Factored')!.slice(0,2)).toEqual([500,250]);expect(results.get('FrozenProduct')!.slice(0,2)).toEqual([500,500]);expect(results.get('ImportanceOnly')![0]).toBe(250);expect(results.get('UrgencyOnly')![1]).toBe(0);
 });
 it('controls: denied or missing evidence, known zero and unrelated body modifiers stay distinct',async()=>{
  const m=await prepareCharacterModel(prioritySource());const hiddenA=await createCharacterRun(m,priorityData(rational(1,1),rational(1,1),7,{adoptionVisible:false,urgencyVisible:false})),hiddenB=await createCharacterRun(m,priorityData(rational(0,1),rational(0,1),7,{adoptionVisible:false,urgencyVisible:false}));await finish(hiddenA);await finish(hiddenB);expect(cognition(hiddenA)).toEqual(cognition(hiddenB));expect(state(hiddenA).canonicalValue()).toEqual(state(hiddenB).canonicalValue());expect(reports(hiddenA,PRIORITY_OBS)).toEqual(reports(hiddenB,PRIORITY_OBS));expect(state(hiddenA).read(importancePath(taskKeys()[0])).presence).toBe(false);
  const zero=await createCharacterRun(m,priorityData(rational(0,1),rational(1,1),7,{body:10})),absent=await createCharacterRun(m,priorityData(null,rational(1,1),7,{body:10}));await through(zero,3n);await through(absent,3n);expect(operand(zero,3)[1]).toEqual(list([rational(0,1)]));expect(operand(absent,3)[1]).toEqual(list([]));expect(operand(zero,3)[3]).toEqual(rational(0,1));expect(operand(absent,3)[3]).toEqual(rational(0,1));const target=f(rec(taskKeys()[0],371n),2n),nuclei=items(f(outputs(zero.snapshot().outputs,408n)[0],3n),'list');expect(nuclei.every(v=>key(f(rec(f(rec(v,407n),1n),404n),3n))!==key(target))).toBe(true);
  const gapData=mapPriorityInputs(priorityData(rational(1,1),rational(1,1),7,{urgency7:rational(1,1)}),row=>key(items(row,'list')[2])===key(PRIORITY_DISPLAY)&&key(items(row,'list')[0])===key(signed(5))?undefined:row),gap=await createCharacterRun(m,gapData);await finish(gap);expect(operand(gap,5)[2]).toEqual(list([]));expect(operand(gap,7)[3]).toEqual(rational(1,1));expect(q(importanceValue(state(gap).read(importancePath(taskKeys()[0])).value!).I)).toEqual(rational(1,1));
 },120000);
 it('controls: repeat and restore retain importance and exact subsequent trace, state, RNG and save',async()=>{
  const s=prioritySource(),d=priorityData(rational(1,2),rational(1,1)),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);for(let i=0;await a.settleNextInstant();i++){expect(i).toBeLessThan(32);expect(await b.settleNextInstant()).toBe(true);expect(await restored.settleNextInstant()).toBe(true);exact(a,b);exact(a,restored);}expect(await restored.settleNextInstant()).toBe(false);
 },120000);
 it('controls: legal non-preset, absent selection and expiry respect goal lifecycle',async()=>{
  const source=prioritySource(),d=priorityData(rational(3,10),rational(1,5)),run=await createCharacterRun(await prepareCharacterModel(source),d);await through(run,3n);expect(operand(run,3)[3]).toEqual(rational(9,50));
  const rows=items(decode(d.orderedInputs),'list'),choiceRow=items(rows.find(row=>key(items(row,'list')[2])===key(sid(1001,'event/deliberation-opportunity')))!,'list'),late=await createCharacterRun(await prepareCharacterModel(source),{...d,orderedInputs:enc(list([...rows,list([signed(10),...choiceRow.slice(1)])]))});await finish(late);expect(items(reports(late,PRIORITY_MOTIVE).find(x=>uint(x[1])===10n)![2],'list')).toHaveLength(0);expect(state(late).read(importancePath(taskKeys()[0])).presence).toBe(true);expect(choice(late,3)).toBe('None');
  const none=await createCharacterRun(await prepareCharacterModel(changeDefinition(source,'definition/task-workspace',2n,unsigned(0))),d);await through(none,3n);expect(items(reports(none,PRIORITY_MOTIVE)[0][2],'list')).toHaveLength(0);expect(outputs(none.snapshot().outputs,433n)).toHaveLength(0);
 },90000);
 it('controls: admission, immutable same-owner fields, authenticated children and late rollback',async()=>{
  const s=prioritySource(),d=priorityData(),model=await compileCharacterModel(s),component=await compileCharacterState(model),m=await prepareCharacterModel(s),initial=component.initialState(d.initialState),task=taskKeys()[0],p=importancePath(task),value=list([text(PRIORITY),rational(1,1),{kind:'typedIdentifier',namespaceId:1164n,payload:unsigned(1)},unsigned(1)]);
  await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path:p,value}]).canonicalValue())})).rejects.toThrow('initial importance');expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:p,expected:{presence:false},newValue:value}]},SKILL_OWNER,{writableRoots:[373n],targetPaths:[p]})).toThrow();const learned=component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:p,expected:{presence:false},newValue:value}]},GOAL_OWNER,{writableRoots:[373n],targetPaths:[p]}).state;expect(()=>component.stateModel.applyPatch(learned,{operations:[{kind:'set',path:p,expected:{presence:true,value},newValue:value}]},GOAL_OWNER,{writableRoots:[373n],targetPaths:[p]})).toThrow('immutable');
  const rows=items(decode(d.orderedInputs),'list'),source=rows.find(row=>key(items(row,'list')[2])===key(PRIORITY_DISPLAY)&&key(items(row,'list')[0])===key(signed(1)))!,a=items(source,'list'),payload=items(a[3],'list'),dataRows=items(payload[1],'list'),r=items(dataRows[0],'list');
  for(const [index,bad]of [[0,sid(1030,'foreign')],[1,list([rational(-1,1)])],[1,list([rational(2,1)])],[2,unsigned(1)],[3,list([unsigned(1)])],[4,unsigned(0)]] as [number,CanonicalValue][]){const changed=[...r];changed[index]=bad;const invalid=list([...a.slice(0,3),list([payload[0],list([list(changed),...dataRows.slice(1)])]),a[4]]);await expect(createCharacterRun(m,mapPriorityInputs(d,v=>key(v)===key(source)?invalid:v))).rejects.toThrow();}
  await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,source]))})).rejects.toThrow('duplicate');await expect(createCharacterRun(m,mapPriorityInputs(d,v=>key(v)===key(source)?list([signed(2),...a.slice(1)]):v))).rejects.toThrow('adoption time');await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,list([signed(3),unsigned(140),PRIORITY_LEARN,list([]),list([])])]))})).rejects.toThrow();
  const run=await createCharacterRun(m,d);await through(run,1n);const ts=traces(run),ids=[...new Set(ts.map(t=>key(f(event(t),1n))))],formation=ts.find(t=>name(t)==='event/assembled-priority-learn')!;expect(items(f(formation,17n),'list')).toHaveLength(2);const first140=ts.find(t=>uint(f(event(t),3n))===140n)!;expect(ids.indexOf(key(f(event(first140),1n)))).toBeLessThan(ids.length-1);const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(ids.length-1))),d),before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);console.info('M13 common-stage rollback '+ids.length+' events; limit'+(ids.length-1));
  const inputs=await compileCharacterInputs(model,component,d),owner=createPriorityExecution(C,component.tasks.map(t=>t.key),component.stateModel,inputs.priorityEvents,model.modelIdentity.value,inputs.runIdentity.value);owner.begin(1n);const original=inputs.priorityEvents.find(e=>e.dueAt===1n)!,observed=scheduled(ts.find(t=>name(t)==='event/assembled-priority-observe')!),evidence=scheduled(ts.find(t=>name(t)==='event/assembled-priority-evidence')!),formationEvent=scheduled(formation);let next=uint(id(reports(run,PRIORITY_OBS)[0][1]).payload);const context={state:initial,event:original,instant:simInstant(1n),allocateRuntimeId(){return next++;}};
  expect(()=>owner.execute({...context,event:observed})).toThrow('unbound');const admitted=owner.execute(context);expect(()=>admitted.traceFactory([{...observed,payload:list([])}])).toThrow('mismatch');admitted.traceFactory([observed]);expect(()=>admitted.traceFactory([observed])).toThrow('lifecycle');const obs=owner.execute({...context,event:observed});obs.traceFactory([evidence]);expect(()=>owner.execute({...context,event:observed})).toThrow('unbound');const evid=owner.execute({...context,event:evidence});evid.traceFactory([formationEvent]);expect(()=>owner.prepare([{...formationEvent,causalParentEventIds:[]}],initial)).toThrow('unbound');const stage=owner.prepare([formationEvent],initial);stage.execute({...context,event:formationEvent});expect(()=>stage.execute({...context,event:formationEvent})).toThrow('lifecycle');expect(stage.finish(initial).read(p).presence).toBe(true);owner.prepareCommit();owner.close();
 },150000);
});
