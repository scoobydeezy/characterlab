import {it,expect,vi} from 'vitest';
import {current,items,key,enc,list,decode} from './fixtures/assembledDefiningControls';
import {C,text,signed,u,q,exact,rec,f} from './fixtures/assembledDefining';
import {changeDefinition} from './fixtures/assembledCharacter';
import {POSITION_PRESENTATION_RULES,POSITION_PRESENTATION_REGISTRY,POSITION_USE_RULES,POSITION_USE_REGISTRY,compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {state,through,finish,reports,report,type Run} from './assembledDefining.test';
import {SPATIAL_MEANING} from '../assembled/goalMeaning';
import {named,directions} from '../assembled/significance';
import {POSITION_EPISODE,RECALL,isPositionEpisodePath,assertPositionUseUpdate,MEMORY_PRESENTATION} from '../assembled/memory';
import * as memoryModule from '../assembled/memory';
import {POSITION_PRESENTATION,POSITION_ACCESS,positionHistory,rankPositionPresentations,appendPositionPresentations,type PositionAccessLaw} from '../assembled/positionPresentation';
import {BODY_SAMPLE,BODY_OWNER} from '../assembled/body';
import {POSITION,POSITION_SOURCE} from '../assembled/positionPerception';
import {sid} from '../assembled/skill';
import {ExactRational as Q} from '../substrate/exactMath';
import {recallCanonicalEventAcquisitions} from '../campaign3/canonicalEventRecall';
import {presentationAccessibility} from '../campaign3/encodingAccessMath';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {rational,type CanonicalValue} from '../substrate/canonicalEncoding';
// Physical/no social tasks; body30/rate0/width1, seed0. Four normal perceptions,
// goal active12, no earlier appraisal/use/significance. All learned history is native.
function fixture(law:PositionAccessLaw='PresentationFrequency'){
 const b=current('Absent'),slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')];body[2]=q(0,1);slots[6]=list(body);
 slots[9]=list([items(slots[9],'list')[0],u(2),text(law)]);
 slots[32]=list([items(slots[32],'list')[0],list([]),u(1),text('BothDirections'),u(101)]);
 slots[37]=list([text(SPATIAL_MEANING),list([q(0,1),q(0,1)]),u(12),text('BothDirections'),u(1),u(101)]);
 let s={...b.s,rulesVersion:POSITION_PRESENTATION_RULES,registrySchemaVersion:POSITION_PRESENTATION_REGISTRY,registry:enc(list(slots))};
 for(const n of ['definition/task-a','definition/task-b','definition/configurable-garden'])s=changeDefinition(s,n,6n,signed(100));
 const original=items(decode(b.d.orderedInputs),'list'),sample=items(original.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 const frame=original.filter(v=>key(items(v,'list')[0])===key(signed(17))&&(key(items(v,'list')[1])===key(u(30))||key(items(v,'list')[2])===key(sid(1001,'event/deliberation-opportunity'))));
 if(!frame.length)throw Error('166 actual opportunity frame');
 const rows=[[1,0],[2,2],[10,5],[11,5]].map(([at,x])=>list([signed(at),u(10),POSITION_SOURCE,list([text(POSITION),list([u(x),u(0),u(1),true,true,u(1)]),list([])]),list([])]));
 rows.push(list([signed(11),...sample.slice(1)]),...frame.map(v=>list([signed(12),...items(v,'list').slice(1)])));
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
async function start(law:PositionAccessLaw='PresentationFrequency'){const b=fixture(law),m=await prepareCharacterModel(b.s);return {b,m,run:await createCharacterRun(m,b.d)};}
const positions=(r:Run)=>state(r).entries().filter(e=>isPositionEpisodePath(e.path));
const at=(r:Run,t:number)=>positions(r).find(e=>key(items(e.value,'list')[5])===key(signed(t)))!;
const id=(v:CanonicalValue)=>(items(v,'list')[1] as {payload:{value:bigint}}).payload.value;
const qv=(v:Q)=>rational(v.numerator,v.denominator);
function live(r:Run,frequency:boolean){
 const m=report(r,SPATIAL_MEANING,12),assessment=named(m[5],'assessment');expect(named(assessment,'kind')).toEqual(text('Assessed'));
 expect(named(assessment,'relation')).toEqual(text(frequency?'MovingFarther':'SameDistance'));
 const operands=items(m[4],'list').map(v=>items(v,'list')[1]);expect(operands.map(v=>items(v,'list')[5])).toEqual([signed(frequency?1:10),signed(frequency?10:11)]);
 for(const operand of operands)expect(reports(r,RECALL).some(v=>key(v[1])===key(signed(12))&&key(v[2])===key(operand))).toBe(true);
}
function originalComparison(records:readonly CanonicalValue[],r:Run){
 const cue=text('common-position-channel'),rows=records.map(v=>({acquisition:id(v),acquiredAt:(items(v,'list')[5] as {value:bigint}).value,history:positionHistory(v)}));
 const actual=rankPositionPresentations(rows,12n,2,'PresentationFrequency');
 const original=recallCanonicalEventAcquisitions({cue:{kind:'Present',key:cue},memory:records.map(v=>({id:id(v),acquiredAt:(items(v,'list')[5] as {value:bigint}).value,units:[{key:cue,views:[enc(list(items(v,'list').slice(0,7)))]}]})),graph:{keys:[],weights:[]},presentations:new Map(rows.map(v=>[v.acquisition,v.history])),now:12n,calibration:{beta:Q.of(0n),scale:100n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:Q.of(1n),k:2}});
 expect(actual.selected).toEqual(original.recalled.map(v=>v.id));
 const audit=report(r,POSITION_ACCESS,12);expect(items(audit[4],'list')).toEqual(actual.selected.map(u));
 for(const score of actual.scores){const old=original.scores.find(v=>v.acquisition===score.acquisition)!;expect(score.base.equals(old.base)&&score.pull.equals(old.pull)&&score.score.equals(old.score)).toBe(true);
  const native=items(audit[3],'list').find(v=>key(named(v,'acquisition'))===key(signed(score.acquisition)))!;expect(named(native,'base')).toEqual(qv(score.base));expect(named(native,'score')).toEqual(qv(score.score));}
}
it('primary166: actual presentation frequency changes recall and live spatial appraisal',async()=>{
 const a=await start(),b=await start('RecencyOnly');for(const x of [a,b])await through(x.run,11n);
 expect(positionHistory(at(a.run,1).value)).toEqual([1n,2n,3n,11n]);expect(positionHistory(at(b.run,1).value)).toEqual([1n,2n,3n]);
 for(const x of [a,b])for(const e of positions(x.run)){expect(items(e.value,'list')[9]).toBe(false);expect(directions(items(e.value,'list')[7])).toEqual([]);}
 const captured=positions(a.run).map(e=>e.value),restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 for(const x of [a,b])await through(x.run,12n);await through(restored,12n);exact(a.run,restored);live(a.run,true);live(b.run,false);originalComparison(captured,a.run);
 expect(positionHistory(at(a.run,11).value)).toEqual([11n]);expect(items(at(a.run,11).value,'list')[9]).toBe(false);
 for(const t of [1,2,10,11])expect(items(at(a.run,t).value,'list').slice(0,7)).toEqual(items(at(b.run,t).value,'list').slice(0,7));
 for(const x of [a,b])for(const e of positions(x.run)){
  const occurrence=id(e.value),presented=reports(x.run,RECALL).filter(v=>key(items(v[2],'list')[0])===key(text(POSITION_EPISODE))&&id(v[2])===occurrence).map(v=>(v[1] as {value:bigint}).value);
  expect(positionHistory(e.value)).toEqual([(items(e.value,'list')[5] as {value:bigint}).value,...presented]);
  const receipts=reports(x.run,POSITION_PRESENTATION).filter(v=>key(v[2])===key(items(e.value,'list')[1]));
  expect(receipts.reduce((n,v)=>n+items(v[3],'list').length,0)).toBe(presented.length);
 }
 expect(state(a.run).entries().filter(e=>e.path.rootStateTypeId===455n)).toEqual(state(b.run).entries().filter(e=>e.path.rootStateTypeId===455n));
 await finish(a.run,[restored]);await finish(b.run);expect(a.run.snapshot().clock).toBe(101n);expect(b.run.snapshot().clock).toBe(101n);
 console.info('M166 PRIMARY PASS actual histories -> original-kernel exact rank ->1/10 Farther vs10/11 Same at12; unselected11 retained/uncredited; actual publication receipts; immutable content/equal body; save11 exact full tail101');
},590000);
it('boundary166: receiving domain, authentic history and post-write rollback',async()=>{
 const history=[0n,...Array<bigint>(1023).fill(1n)],long=rankPositionPresentations([{acquisition:1n,acquiredAt:0n,history}],2n,1,'PresentationFrequency');
 expect(long.scores[0].base.equals(Q.of(1n,3n).add(Q.of(1023n,2n)))).toBe(true);
 let sum=Q.of(0n);for(let i=0;i<history.length;i+=32)sum=sum.add(presentationAccessibility(history.slice(i,i+32),2n,Q.of(1n),1));expect(sum.equals(long.scores[0].base)).toBe(true);
 const many=Array.from({length:1024},(_,i)=>({acquisition:BigInt(i+1),acquiredAt:0n,history:i===1023?[0n,1n]:[0n]}));
 expect(rankPositionPresentations(many,2n,1,'PresentationFrequency').selected).toEqual([1024n]);expect(rankPositionPresentations(many,2n,0,'PresentationFrequency').selected).toEqual([]);
 expect(rankPositionPresentations([{acquisition:2n,acquiredAt:0n,history:[0n]},{acquisition:1n,acquiredAt:0n,history:[0n]}],2n,2,'PresentationFrequency').selected).toEqual([1n,2n]);
 for(const h of [[0n,2n],[0n,1n,0n],Array<bigint>(1025).fill(0n)])expect(()=>rankPositionPresentations([{acquisition:1n,acquiredAt:0n,history:h}],2n,1,'PresentationFrequency')).toThrow();
 expect(()=>rankPositionPresentations([...many,{...many[0],acquisition:1025n}],2n,1,'PresentationFrequency')).toThrow();
 let fault=false,hit=false,forgery=false;const make=memoryModule.createEpisodicExtension;
 const spy=vi.spyOn(memoryModule,'createEpisodicExtension').mockImplementation((...args)=>{const x=make(...args);return {...x,prepare(events,B0){
  const pub=events.find(e=>e.dueAt===11n&&key(e.eventTypeId)===key(MEMORY_PRESENTATION));
  if(pub&&!forgery){expect(()=>x.prepare([{...pub,eventId:pub.eventId+100000n}],B0)).toThrow('unassociated');forgery=true;}
  const prepared=x.prepare(events,B0);return {...prepared,finish(s){const next=prepared.finish(s);if(fault&&events.some(e=>e.dueAt===11n)){
   const old=next.entries().find(e=>isPositionEpisodePath(e.path)&&key(items(e.value,'list')[5])===key(signed(1)))!;expect(positionHistory(old.value)).toEqual([1n,2n,3n,11n]);hit=true;throw Error('166 after presentation write');
  }return next;}};}};});
 try{
  const a=await start();await through(a.run,11n);expect(forgery).toBe(true);const old=at(a.run,1),cm=await compileCharacterModel(a.b.s),component=await compileCharacterState(cm);
  const batch=appendPositionPresentations(old.value,12n,2);expect(positionHistory(batch)).toEqual([1n,2n,3n,11n,12n,12n]);
  expect(()=>component.stateModel.applyPatch(state(a.run),{operations:[{kind:'set',path:old.path,expected:{presence:true,value:old.value},newValue:batch}]},BODY_OWNER)).toThrow();
  const mutated=[...items(old.value,'list')];mutated[10]=list([signed(1),signed(2),signed(4),signed(11)]);expect(()=>assertPositionUseUpdate(old.value,list(mutated))).toThrow();
  expect(()=>appendPositionPresentations(old.value,11n,1)).toThrow();
  const initial=restoreAuthoritativeState(decode(a.b.d.initialState));expect(()=>component.initialState(enc(new AuthoritativeState([...initial.entries(),old]).canonicalValue()))).toThrow();
  const slots=[...items(decode(a.b.s.registry),'list')];slots[9]=list(items(slots[9],'list').slice(0,2));
  const prior=await compileCharacterState(await compileCharacterModel({...a.b.s,rulesVersion:POSITION_USE_RULES,registrySchemaVersion:POSITION_USE_REGISTRY,registry:enc(list(slots))}));expect(()=>prior.stateModel.validateState(state(a.run))).toThrow('version');
  fault=true;const broken=await createCharacterRun(a.m,a.b.d);await through(broken,10n);const before=broken.snapshot(),save=broken.save();
  await expect(broken.settleNextInstant()).rejects.toThrow('166 after presentation write');expect(hit).toBe(true);expect({...broken.snapshot(),status:before.status}).toEqual(before);fault=false;
  const recovered=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save});await through(recovered,11n);exact(a.run,recovered);
  await through(a.run,12n);await through(recovered,12n);exact(a.run,recovered);live(a.run,true);await finish(a.run,[recovered]);expect(a.run.snapshot().clock).toBe(101n);
  console.info('M166 BOUNDARIES PASS1024 candidates/history, original exact chunk algebra, no truncation, zero/ties/domain negatives; authentic batch/source, owner/content/S0/version guards; actual post-write rollback and exact full recovery101');
 }finally{spy.mockRestore();}
},590000);

it('coalescence166: actual significance use and presentations share the existing memory update',async()=>{
 const b=current('High'),slots=[...items(decode(b.s.registry),'list')];slots[9]=list([...items(slots[9],'list'),text('PresentationFrequency')]);
 const s={...b.s,rulesVersion:POSITION_PRESENTATION_RULES,registrySchemaVersion:POSITION_PRESENTATION_REGISTRY,registry:enc(list(slots))},r=await createCharacterRun(await prepareCharacterModel(s),b.d);
 await through(r,16n);const before=at(r,15).value;expect(directions(items(before,'list')[7])).toEqual([]);expect(items(before,'list')[9]).toBe(false);
 await through(r,17n);const after=at(r,15).value;
 const meaning=report(r,'assembled-goal-meaning/0.1',17);
 expect(named(named(meaning[5],'assessment'),'kind')).toEqual(text('Assessed'));
 expect(directions(items(after,'list')[7])).toEqual(['MovingCloser']);expect(items(after,'list')[9]).toBe(true);
 expect(positionHistory(after)).toEqual([...positionHistory(before),17n]);
 expect(items(after,'list').slice(0,7)).toEqual(items(before,'list').slice(0,7));expect(items(after,'list')[8]).toEqual(items(before,'list')[8]);
 for(const tag of [POSITION_PRESENTATION,'assembled-position-use/0.1','assembled-outcome-significance/0.1'])expect(reports(r,tag).filter(v=>key(v[1])===key(signed(17))&&key(v[2])===key(items(after,'list')[1]))).toHaveLength(1);
 await finish(r);expect(r.snapshot().clock).toBe(5001n);
 console.info('M166 COALESCENCE PASS live actual significance/use/presentation17 on old15, immutable content/annex, three separate receipts, full original horizon5001');
},590000);
