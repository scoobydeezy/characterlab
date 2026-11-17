import {SEMANTIC_EVENTS_RULES,SEMANTIC_EVENTS_REGISTRY} from '../assembled/model';
import {SEMANTIC_EVENTS_ENCODING,SEMANTIC_EVENTS_VERSION,deriveEncodingRoles,compileEncoding} from '../assembled/encoding';
import {TRUTH_SCENE,sourceRole} from '../assembled/semanticTruth';
import {SOCIAL_SOURCE} from '../assembled/social';
import {CURRENT_SEM_SOURCE} from '../assembled/semanticLanes';
import {encodeMultiEventAttention} from '../assembled/wideAttention';
import {prepareAttentionPool,selectAttention} from '../campaign3/attentionSelection';
import {encodeSelectedBudgetControl} from '../campaign3/selectedEncodingBudgetControl';
import {associationUnits} from '../assembled/learnedAssociation';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import * as encoding from '../assembled/encoding';
import {ROLE_ENCODING,encodeExperience,validateEncoding,encodingMatchesModel,roleChannel} from '../assembled/encoding';
import {isSocialEpisodePath} from '../assembled/memory';
import {personPath,personMean} from '../assembled/social';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {unsigned as u} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {sid} from '../assembled/skill';
import {attentionFixture} from './attentionFixtures';
import {EventRoleId as R} from '../semanticBinding/eventBindings';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {fixture as priorFixture,channel,schema,rule,ref,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSemanticTruth';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M141 full queue cap');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function judgment(r:Run,b:ReturnType<typeof fixture>,expected:number){
 expect(personMean(state(r).read(personPath(C,target)).value)).toEqual({numerator:1n,denominator:2n});
 const social=reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
 expect(items(social[4],'list'),'live remembered social factor').toHaveLength(1);
 const joint=reports(r,JOINT_APPRAISAL).at(-1)!;
 for(const task of[b.taskA,b.taskB])expect(items(joint[4],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(task)),'live task appraisal').toHaveLength(5);
 expect(items(social[4],'list')).toEqual([q(expected,1)]);
 const selected=items(reports(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);expect(items(social[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));expect(items(joint[6],'list').slice(1)).toContainEqual(list(social));
 const d=outputs(snap(r).outputs,409n).find(v=>key(f(v,2n))===key(signed(21)))!;expect(d,'actual decision21').toBeDefined();
 const result=rec(f(d,4n),419n);expect(uint(f(result,1n)),'live resolved choice').toBe(3n);
 const context=rec(f(d,3n),408n);expect(items(f(context,3n),'list').length,'actual grounds').toBeGreaterThan(0);
 const data=rec(f(result,2n),420n),isB=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')),row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>isB(f(v,1n))),p=uint(f(data,8n))===1n?Q.of(isB(f(data,1n))?1n:0n):row?readQ(f(row,2n)):Q.of(0n);
 const intent=outputs(snap(r).outputs,425n).find(v=>key(f(v,2n))===key(d))!,plan=outputs(snap(r).outputs,431n).find(v=>key(f(v,2n))===key(intent))!,attempt=outputs(snap(r).outputs,432n).find(v=>key(f(v,2n))===key(plan))!;expect(outputs(snap(r).outputs,433n).some(v=>key(f(v,2n))===key(attempt)),'actual execution').toBe(true);
 return p;
}


type Mode='merged'|'split'|'worlds'|'worldOrder'|'hiddenWorlds';
function fixture(mode:Mode='merged'){
 const b=priorFixture(mode==='hiddenWorlds'?'hidden':'coarsened'),slots=[...items(decode(b.s.registry),'list')],config=items(slots[30],'list');slots[30]=list([text(SEMANTIC_EVENTS_ENCODING),...config.slice(1)]);
 const content=items(slots[48],'list');slots[48]=list([content[0],content[1],list([...items(content[2],'list'),schema('event-type/social-focal',[rule(2)]),schema('event-type/social-other',[rule(1),rule(7),rule(6),rule(8)])]);
 const s={...b.s,rulesVersion:SEMANTIC_EVENTS_RULES,registrySchemaVersion:SEMANTIC_EVENTS_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(CURRENT_SEM_SOURCE)&&['worlds','worldOrder','hiddenWorlds'].includes(mode)){const p=[...items(a[3],'list')],c=items(p[6],'list');p[6]=channel('event-type/action-occurrence',items(c[2],'list').map(v=>{const r=items(v,'list');return uint(r[0])===5n&&uint(r[3])===1n?list([...r,u(1)]):v;}));a[3]=list(p);return list(a);}
 if(key(a[2])!==key(SOCIAL_SOURCE)||key(a[0])!==key(signed(2)))return v;
 const p=[...items(a[3],'list')],c=items(p[7],'list'),bindings=items(c[2],'list').map(v=>{const r=[...items(v,'list')];if(uint(r[0])===1n){r[3]=u(0);r.push(u(mode==='merged'?0:1));}return list(r);});
 p[7]=channel('event-type/social-scene',bindings);
 if(['worlds','worldOrder','hiddenWorlds'].includes(mode)){const focal=channel('event-type/social-focal',bindings.filter(v=>uint(items(v,'list')[0])===2n)),other=channel('event-type/social-other',bindings.filter(v=>uint(items(v,'list')[0])!==2n));p[7]=list([text(TRUTH_SCENE),list(mode==='worldOrder'?[other,focal]:[focal,other])]);}
 a[3]=list(p);return list(a);});
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},mode,legacy:b};
}
const traceAt=(r:Run,p:bigint)=>outputs(snap(r).trace,160n).find(v=>{const e=rec(f(v,4n),130n);return key(f(v,6n))===key(text(SEMANTIC_EVENTS_VERSION))&&key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===p;})!;
const projected=(r:Run,p:bigint,t:bigint)=>items(f(traceAt(r,p),13n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
function structure(r:Run,mode:Mode){
 const split=mode!=='merged',current=projected(r,14n,227n)[0],full=projected(r,124n,227n)[0],bindings=items(f(full,5n),'set'),claims=projected(r,125n,240n),a=reports(r,SEMANTIC_EVENTS_ENCODING).find(a=>uint(f(rec(a[4],227n),3n))===2n)!;
 expect(items(f(current,4n),'set')).toHaveLength(['worlds','worldOrder','hiddenWorlds'].includes(mode)?2:1);expect(items(f(full,4n),'set')).toHaveLength(split?2:1);expect(bindings).toHaveLength(5);
 expect(new Set(bindings.map(b=>key(f(rec(b,224n),4n)))).size).toBe(4);expect(claims).toHaveLength(4);expect(items(a[5],'list')).toEqual(claims);
 expect(a[3]).toEqual(items(items(f(traceAt(r,125n),12n),'list')[1],'list')[2]);
 const audit=items(a[6],'list').map(v=>items(v,'list'));expect(audit).toHaveLength(split?5:4);expect(audit.filter(v=>v[3]===true)).toHaveLength(split?1:0);
 if(split){expect(audit.filter(v=>v[3]===true)[0][1]).toEqual(list([text('causal-role/target')]));const selected=items(a[8],'list').map(v=>items(v,'list'));expect(selected).toHaveLength(1);expect(selected[0]).toHaveLength(8);
  const chosen=claims.find(c=>key(id(f(c,6n)).payload)===key(text('causal-role/target')))!;
  expect(selected[0][7]).toEqual(characterEvidenceRefValue({kind:'causal-role',causalRoleEvidenceId:uint(id(f(chosen,1n)).payload)}));
  expect(claims.filter(c=>key(f(c,5n))===key(f(chosen,5n)))).toHaveLength(2);expect(associationUnits(list(a),full)).toHaveLength(1);
 }else expect(audit.map(v=>v[2])).toContainEqual(text('MultipleRoles'));
 expect(validateEncoding(list(a),full)).toBe(split);expect(episodes(r).map(v=>v[5])).toEqual((split?[1,2]:[1]).map(signed));
 expect(projected(r,110n,210n)).toHaveLength(['worlds','worldOrder','hiddenWorlds'].includes(mode)?2:1);
 return {current,full};
}
it('primary141: perceived event merge versus split changes actual memory and choice',async()=>{
 const merged=await create(),split=await create('split');for(const x of[merged,split]){await through(x.r,2n);structure(x.r,x.b.mode);await through(x.r,21n);}
 expect(judgment(merged.r,merged.b,1).equals(Q.of(1n))).toBe(true);expect(judgment(split.r,split.b,0).equals(Q.of(1n,2n))).toBe(true);
 for(const x of[merged,split])await finish(x.r);
 console.info('M141 PRIMARY PASS same truth/roles/shared carrier; merged MultipleRoles vs split event-scoped Target; exact125->130 selected claim -> graph/memory/recall -> live P1 vs1/2 with belief1/2; actual execution/full queues');
},590000);
it('privacy141: two world events do not dictate perceived grouping or character provenance',async()=>{
 const a=await create('worlds'),b=await create('worldOrder'),c=await create('hiddenWorlds');let checked=false;
 for(let n=0;n<96;n++){const more=await advance(a.r);for(const p of[b.r,c.r]){expect(await advance(p)).toBe(more);bytes(snap(a.r).state,snap(p).state);bytes(snap(a.r).outputs,snap(p).outputs);}
  if(snap(a.r).clock===2n){const x=structure(a.r,a.b.mode);for(const p of[b,c])expect(structure(p.r,p.b.mode)).toEqual(x);expect(projected(a.r,110n,210n)).not.toEqual(projected(b.r,110n,210n));checked=true;}
  if(snap(a.r).clock===21n)expect(judgment(a.r,a.b,0).equals(Q.of(1n,2n))).toBe(true);
  if(!more)break;expect(n).toBeLessThan(95);
 }expect(checked).toBe(true);
 console.info('M141 PRIVACY PASS two governed worlds; reordered truth event allocation and hidden Action/referents alter trace only; identical safe prefixes/two-file envelopes/actual choice/full queues');
},590000);
it('continuation141: two event files and exact selected claim survive repeat, restore and rollback',async()=>{
 const {b,m,r}=await create('split'),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);structure(r,b.mode);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=encoding.deriveEncodingRoles;let calls=0;
 const spy=vi.spyOn(encoding,'deriveEncodingRoles').mockImplementation((...args)=>{const result=original(...args);if(args[0].occurredAt===2n&&++calls===2)throw Error('M141 after both event files and roles');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M141 after both event files and roles');expect(calls).toBe(2);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M141 CONTINUATION PASS two-event repeat/save2/every later boundary/full queues; post122+125 fault rolls both event allocations/state/lanes back; exact recovery');
},590000);

const settings141={capacity:1,attention:'role-calibrated' as const,multiUnit:true,sharedBindings:true,wideRoles:true,wideUnits:true,multiEvents:true,budgetLaw:'historical-shared' as const,budgetCalibration:'UnitBudget' as const};
function twoEvents(shared=false){
 const b=attentionFixture([[R.Actor],[R.Target]]),first=b.experience.perceptualEventReferentIds[0],second={...first,observerEventSequence:1n};
 const experience={...b.experience,perceptualEventReferentIds:[first,second],perceivedBindings:b.experience.perceivedBindings.map((v,i)=>i?{...v,perceptualEventReferentId:second,...(shared?{perceptualReferentId:b.experience.perceivedBindings[0].perceptualReferentId}:{})}:v)};
 return deriveEncodingRoles(experience,settings141,[100n,101n]);
}
it('correspondence141: original selection and globally shared factors with exact event provenance',()=>{
 const patterns=[[R.Actor],[R.Target],[R.Participant],[R.Instrument],[R.Beneficiary],[R.Actor,R.Target]],cases=[[]] as (typeof patterns[number])[][];
 for(let size=1;size<=3;size++){const add=(prefix:typeof patterns)=>{if(prefix.length===size){cases.push(prefix);return;}for(const p of patterns)add([...prefix,p]);};add([]);}
 let comparisons=0;
 for(const roles of cases){const b=attentionFixture(roles);for(const capacity of[0,1,2]){
  const original=selectAttention(prepareAttentionPool(b.experience,b.claims),capacity),actual=encodeMultiEventAttention(b.experience,b.claims,capacity,'historical-shared','role-calibrated','UnitBudget');
  expect(actual.audit).toEqual(original.audit);expect(actual.result).toEqual(encodeSelectedBudgetControl(original.view,'historical-shared','role-calibrated','UnitBudget'));comparisons++;
 }}expect(comparisons).toBe(777);
 const p=twoEvents(),actual=encodeMultiEventAttention(p.experience,p.claims,2,'historical-shared','role-calibrated','SmallBudget');expect(actual.audit.filter(a=>a.selected)).toHaveLength(2);
 expect(actual.result.rows.map(r=>r.strength)).toEqual([Q.of(100n,181n),Q.of(81n,181n)]);expect(actual.result.rows.reduce((a,b)=>a.add(b.strength),Q.of(0n)).equals(Q.of(1n))).toBe(true);
 const shared=twoEvents(true);expect(()=>encodeMultiEventAttention(shared.experience,shared.claims,2,'historical-shared','role-calibrated','UnitBudget')).toThrow('multiple selected roles per continuant');
 expect(encodeMultiEventAttention(shared.experience,shared.claims,1,'historical-shared','role-calibrated','UnitBudget').result.rows).toHaveLength(1);
 expect(()=>deriveEncodingRoles(p.experience,{...settings141,multiEvents:false},p.ids)).toThrow('domain');
 const third={...p.experience.perceptualEventReferentIds[0],observerEventSequence:2n};expect(()=>encodeMultiEventAttention({...p.experience,perceptualEventReferentIds:[...p.experience.perceptualEventReferentIds,third]},p.claims,1,'historical-shared','role-calibrated','UnitBudget')).toThrow('finite experience domain');
 expect(()=>encodeMultiEventAttention(p.experience,p.claims.map((c,i)=>i?{...c,perceptualEventReferentId:third}:c),1,'historical-shared','role-calibrated','UnitBudget')).toThrow();
 console.info('M141 CORRESPONDENCE PASS777 original audits/selected references/bytes/raw/final factors; two-event cap2 has one SmallBudget total1; exact event provenance; duplicate selected carrier and old/third-event guards');
},590000);
it('admission141: event groups, version and capacity constraints are explicit before execution',async()=>{
 const b=fixture('split'),model=await compileCharacterModel(b.s),row=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')).find(a=>key(a[2])===key(SOCIAL_SOURCE)&&key(a[0])===key(signed(2)))!,source=items(row[3],'list')[7];
 expect(()=>sourceRole(source,model.recognition!)).not.toThrow();expect(()=>sourceRole(source,{...model.recognition!,selectionCapacity:2})).toThrow('capacity2');
 const c=items(source,'list'),invalid=channel('event-type/social-scene',items(c[2],'list').map(v=>{const r=items(v,'list');return r.length===5?list([...r.slice(0,4),u(2)]):v;}));expect(()=>sourceRole(invalid,model.recognition!)).toThrow('group/event');
 expect(()=>sourceRole(list([text(TRUTH_SCENE),list([source,source,source])]),model.recognition!)).toThrow('world event count');
 const config=items(items(decode(b.s.registry),'list')[30],'list');expect(()=>compileEncoding(list(config),true,true,true,true,true)).toThrow('declaration');
 await expect(createCharacterRun(await prepareCharacterModel(b.legacy.s),b.d)).rejects.toThrow();
 console.info('M141 ADMISSION PASS explicit source event0/1, world count, old-version and capacity2 shared-carrier restrictions; no duplicate-strength law introduced');
},590000);
