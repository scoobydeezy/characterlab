import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,ACTION_BODY_RULES,ACTION_BODY_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {SKILL,PHASE,SKILL_ACTUAL,SKILL_UPDATE,PRACTICE_SETTING,PRACTICE,SKILL_OWNER,PHASE_OWNER,skillPath,phasePath,skillValue,practiced,q,sid} from '../assembled/skill';
import {createSkillExecution} from '../assembled/skillExecution';
import {ACTION_BODY} from '../assembled/actionBody';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {canonicalEncode as enc,list,text,signed,unsigned,rational,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {createDevelopmentRun,type DevelopmentFrame} from '../campaign3/developmentComponent';
import {adaptSkill} from '../campaign3/skillMath';
import {skillRecord as old} from '../campaign3/skillCodecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {skillSource,skillData,mapSkillInputs} from './fixtures/assembledSkill';
import {outputs} from './fixtures/assembledInteraction';
import {workLimit} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
const readFraction=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);};
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const state=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state)),skill=(run:Run)=>skillValue(state(run).read(skillPath(C)).value);
const cognition=(run:Run)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId>=381n&&v.schema.typeId<=433n);
const traces=(run:Run)=>outputs(run.snapshot().trace,160n),event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n),name=(t:CanonicalValue)=>txt(id(f(rec(t,160n),7n)).payload);
const at=(t:CanonicalValue,time:number)=>key(f(event(t),2n))===key(signed(time));
const draws=(run:Run)=>new Map(traces(run).flatMap(t=>items(f(t,14n),'list')).map(v=>[key(f(rec(v,411n),1n)),v]));
const choice=(run:Run,index=2)=>{const d=outputs(run.snapshot().outputs,409n)[index],r=rec(f(d,4n),419n);expect(uint(f(r,1n))).toBe(3n);return txt(id(f(rec(f(rec(f(r,2n),420n),1n),395n),2n)).payload);};
async function through(run:Run,time:bigint){for(let i=0;run.snapshot().clock<time;i++){expect(i).toBeLessThan(32);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(time);}
async function finish(run:Run){for(let i=0;await run.settleNextInstant();i++)expect(i).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
const exact=(a:Run,b:Run)=>{expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(b.runIdentity()).toEqual(a.runIdentity());};
function scheduled(t:CanonicalValue):ScheduledEvent {const e=event(t),time=f(e,2n);if(typeof time==='boolean'||time.kind!=='signed')throw Error('time');return {eventId:uint(f(e,1n)),dueAt:simInstant(time.value),phase:uint(f(e,3n)),eventSequence:uint(f(e,4n)),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(uint)};}

describe('M11 procedural integration',()=>{
 it('fixed16-seed matrix: practiced skill changes execution then sensed body and later actual choice',async()=>{
  const m=await prepareCharacterModel(skillSource());let changes=0,shared=0;
  for(let seed=0;seed<16;seed++){const runs:Run[]=[];for(const phase of [0,4]){const run=await createCharacterRun(m,skillData(phase,seed));await through(run,3n);const x=reports(run,SKILL_ACTUAL)[0];expect(x[3]).toEqual(rational(0,1));expect(x.slice(6,9)).toEqual([true,false,true]);expect(q(skill(run).K)).toEqual(phase===0?rational(1,2):rational(1,8));expect(skill(run).count).toBe(1n);await through(run,5n);runs.push(run);}
   const [a,b]=runs;expect(cognition(a)).toEqual(cognition(b));expect(state(a).entries().filter(e=>![455n,785n].includes(e.path.rootStateTypeId))).toEqual(state(b).entries().filter(e=>![455n,785n].includes(e.path.rootStateTypeId)));for(const run of runs){expect(choice(run,0)).toBe('definition/protocol-contact-two');expect(choice(run,1)).toBe('definition/protocol-contact-two');}
   expect(reports(a,SKILL_ACTUAL)[1][7]).toBe(true);expect(reports(b,SKILL_ACTUAL)[1][7]).toBe(false);expect(txt(reports(a,ACTION_BODY)[1][5])).toBe('Applied');expect(txt(reports(b,ACTION_BODY)[1][5])).toBe('Blocked');
   for(const [i,run]of runs.entries()){await through(run,7n);const j=reports(run,JOINT_APPRAISAL)[2],sample=rec(j[2],461n);expect(f(sample,4n)).toEqual(signed(7));expect(f(rec(f(sample,5n),462n),2n)).toEqual(rational(i===0?90:10,1));expect(txt(items(j[5],'list')[1])).toBe('Current');expect(items(j[4],'list').map(v=>items(v,'list')[4])).toEqual(i===0?[rational(1,20),rational(1,5)]:[rational(11,120),rational(11,30)]);expect(skill(run).count).toBe(1n);await finish(run);}
   for(const [address,draw]of draws(a))if(draws(b).has(address)){expect(draws(b).get(address)).toEqual(draw);shared++;}if(choice(a)!==choice(b))changes++;console.info('M11 seed '+seed+' later='+JSON.stringify(runs.map(r=>choice(r)))+' draws='+JSON.stringify(runs.map(r=>draws(r).size)));
  }console.info('M11 later choices differ='+changes+'/16; overlapping actual draw pairs='+shared);expect(changes).toBeGreaterThan(0);
 },540000);
 it('controls: unsensed skill/body differences cannot enter cognition through old recalled context',async()=>{
  const m=await prepareCharacterModel(skillSource()),a=await createCharacterRun(m,skillData(0,7,{sense7:false})),b=await createCharacterRun(m,skillData(4,7,{sense7:false}));await finish(a);await finish(b);expect(a.snapshot().state).not.toEqual(b.snapshot().state);expect(cognition(a)).toEqual(cognition(b));expect(reports(a,JOINT_APPRAISAL)).toEqual(reports(b,JOINT_APPRAISAL));expect(draws(a)).toEqual(draws(b));expect(txt(items(reports(a,JOINT_APPRAISAL)[2][5],'list')[1])).toBe('RecalledContext');
 },90000);
 it('controls: no/blocked practice and absent choice cannot manufacture skill; impairment recovers without unlearning',async()=>{
  const m=await prepareCharacterModel(skillSource());for(const o of [{practice:false},{permitted:false}]){const r=await createCharacterRun(m,skillData(0,7,o));await finish(r);expect(skill(r).count).toBe(0n);expect(state(r).read(skillPath(C)).presence).toBe(false);expect(reports(r,SKILL_ACTUAL).every(x=>x[7]===false)).toBe(true);}
  const r=await createCharacterRun(m,skillData(0,7,{impairment5:rational(1,2)}));await through(r,3n);const learned=state(r).read(skillPath(C));await through(r,5n);expect(reports(r,SKILL_ACTUAL)[1][7]).toBe(false);expect(state(r).read(skillPath(C))).toEqual(learned);await through(r,7n);expect(reports(r,SKILL_ACTUAL)[2][7]).toBe(true);expect(state(r).read(skillPath(C))).toEqual(learned);await finish(r);
  const n=await createCharacterRun(await prepareCharacterModel(skillSource(0)),skillData());await finish(n);expect(reports(n,SKILL_ACTUAL)).toHaveLength(0);expect(reports(n,SKILL_UPDATE)).toHaveLength(0);expect(state(n).read(skillPath(C)).presence).toBe(false);
 },150000);
 it('controls: accepted Development arithmetic, saturation and retained serious laws remain distinguishable',async()=>{
  const m=await prepareCharacterModel(skillSource()),run=await createCharacterRun(m,skillData(0,7,{allPractice:true,phases:[0,0,0]}));await finish(run);expect(q(skill(run).K)).toEqual(rational(1,1));expect(skill(run).count).toBe(3n);
  const frames:DevelopmentFrame[]=[0,0,0].map(phase=>({phase,exercise:true,practice:true,permitted:true,difficulty:4,report:null,choice:'None',significance:0,pressure:0,setting:'Work',seed:7}));const control=createDevelopmentRun({curve:'Ramp',learning:true,formation:false,constitution:0},frames);while(await control.step()){}const updates=reports(run,SKILL_UPDATE),actual=reports(run,SKILL_ACTUAL);for(const [i,row]of control.rows().entries()){expect(key(updates[i][2])).toBe(key(q(readFraction(row.skillBefore))));expect(key(updates[i][3])).toBe(key(q(readFraction(row.skillAfter))));expect(actual[i][7]).toBe(row.executed);}
  const prior=old(784,[rational(0,1),unsigned(0)]),practice=old(798,[typedIdentifier(1153,unsigned(1)),typedIdentifier(1153,unsigned(2)),true,true,rational(0,1)]);const base={initial:0,executionLaw:1,permanent:false,beliefLaw:1};const linear=adaptSkill({...base,practiceLaw:1},prior,practice),residual=adaptSkill({...base,practiceLaw:2},prior,practice);expect(f(linear.next,1n)).toEqual(rational(1,4));expect(f(residual.next,1n)).toEqual(rational(1,2));expect(q(practiced(Q.of(0n),0n,4).after)).toEqual(rational(1,8));
  // Multiplicative versus subtractive impairment at a declared threshold, not a new selected law.
  expect(Q.of(1n,2n).multiply(Q.of(1n,2n)).compare(Q.of(1n,4n))).toBe(0);expect(Q.of(1n,2n).subtract(Q.of(1n,2n)).compare(Q.of(1n,4n))).toBe(-1);
 },90000);
 it('controls: repeat and restore after practice preserve every later whole boundary and actual RNG',async()=>{
  const s=skillSource(),m=await prepareCharacterModel(s),d=skillData(0,7),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);for(let i=0;;i++){expect(i).toBeLessThan(32);const more=await a.settleNextInstant();for(const r of [b,restored]){expect(await r.settleNextInstant()).toBe(more);exact(a,r);}if(!more)break;}expect(draws(a).size).toBeGreaterThan(0);
 },180000);
 it('controls: malformed sources, phase reversal, foreign writers and supplied acquired state reject',async()=>{
  const s=skillSource(),m=await prepareCharacterModel(s),d=skillData(),rows=items(decode(d.orderedInputs),'list'),source=rows.find(v=>key(items(v,'list')[2])===key(PRACTICE_SETTING))!;
  for(const [index,value]of [[1,unsigned(5)],[2,rational(-1,1)],[3,rational(2,1)],[4,unsigned(1)]] as const){const a=items(source,'list'),p=items(a[3],'list');const bad=list(a.map((v,i)=>i===3?list(p.map((v,j)=>j===index?value:v)):v));await expect(createCharacterRun(m,mapSkillInputs(d,v=>key(v)===key(source)?bad:v))).rejects.toThrow();}
  await expect(createCharacterRun(m,skillData(4,0,{phases:[4,0,4]}))).rejects.toThrow('reversal');await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,source]))})).rejects.toThrow('duplicate');await expect(prepareCharacterModel({...s,rulesVersion:ACTION_BODY_RULES,registrySchemaVersion:ACTION_BODY_REGISTRY})).rejects.toThrow('slot count');
  await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...rows,list([signed(3),unsigned(140),PRACTICE,list([]),list([])])]))})).rejects.toThrow();
  const compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),initial=component.initialState(d.initialState),p=skillPath(C),value=list([text(SKILL),rational(1,2),unsigned(1)]);
  for(const entry of [{path:p,value},{path:phasePath(C),value:list([text(PHASE),unsigned(0)])}])await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),entry]).canonicalValue())})).rejects.toThrow('initial skill/development');
  expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:p,expected:{presence:false},newValue:value}]},PHASE_OWNER,{writableRoots:[785n],targetPaths:[p]})).toThrow();
  expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:p,expected:{presence:false},newValue:list([text(SKILL),rational(0,1),unsigned(1)])}]},SKILL_OWNER,{writableRoots:[785n],targetPaths:[p]})).toThrow();
  const missing=await createCharacterRun(m,mapSkillInputs(d,v=>key(v)===key(source)?undefined:v));await through(missing,2n);await expect(missing.settleNextInstant()).rejects.toThrow('current setting');
  const legal=await createCharacterRun(m,skillData(1,7,{difficulty:rational(1,3)}));await through(legal,3n);expect(q(skill(legal).K)).toEqual(rational(13,32));
 },90000);
 it('controls: late common-stage failure rolls back practice; private forged children reject',async()=>{
  const s=skillSource(),d=skillData(),run=await createCharacterRun(await prepareCharacterModel(s),d);await through(run,3n);const ts=traces(run).filter(t=>at(t,3)),ids=[...new Set(ts.map(t=>key(f(event(t),1n))))],pr=ts.find(t=>name(t)==='event/assembled-practice')!;expect(pr).toBeDefined();expect(ids.indexOf(key(f(event(pr),1n)))).toBeLessThan(ids.length-1);expect(items(f(pr,17n),'list')).toHaveLength(1);
  const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(ids.length-1))),d);await through(failed,2n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(failed.diagnostic()).toBeDefined();console.info('M11 rollback '+ids.length+' events; limit'+(ids.length-1));
  const model=await compileCharacterModel(s),component=await compileCharacterState(model),sources=traces(run).filter(t=>name(t)==='event/assembled-practice-setting').map(scheduled),owner=createSkillExecution(C,component.stateModel,sources,model.modelIdentity.value,decode(run.runIdentity()));owner.begin(3n);const initial=component.initialState(d.initialState);expect(()=>owner.execute({state:initial,event:{...sources[0],payload:list([])},instant:simInstant(3n),allocateRuntimeId(){throw Error('no allocation');}})).toThrow('unbound');expect(()=>owner.prepare([scheduled(pr)],initial)).toThrow('unbound');
  const context={state:initial,event:sources[0],instant:simInstant(3n),allocateRuntimeId(){throw Error('no allocation');}},phase=owner.execute(context).nextState,producer=scheduled(ts.find(t=>name(t)==='event/assembled-action-body-effect')!),assessment=owner.assess({...context,state:phase,event:producer},true);
  expect(()=>owner.observeEffect(producer,[list([])])).toThrow('association');const plan=owner.observeEffect(producer,[assessment.output]),child=scheduled(pr);expect(()=>owner.prepareCommit()).toThrow('unfinished');expect(()=>plan.bind([{...child,payload:list([])}])).toThrow('mismatch');plan.bind([child]);expect(()=>plan.bind([child])).toThrow('lifecycle');expect(()=>owner.prepare([{...child,causalParentEventIds:[]}],phase)).toThrow('unbound');const stage=owner.prepare([child],phase);stage.execute({...context,state:phase,event:child});expect(()=>stage.execute({...context,state:phase,event:child})).toThrow('lifecycle');const learned=stage.finish(phase);expect(q(skillValue(learned.read(skillPath(C)).value).K)).toEqual(rational(1,2));expect(()=>owner.observeEffect(producer,[assessment.output])).toThrow('missing');owner.prepareCommit();owner.close();
 },90000);
});
