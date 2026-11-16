import {ROLE_STAGES_VERSION} from '../assembled/semanticLanes';
import {deriveEncodingRoles,encodeExperienceFromRoles,type PreparedEncodingRoles} from '../assembled/encoding';
import {fullExperienceValue} from '../assembled/semanticAppearance';
import * as provenance from '../semanticBinding/evidenceProvenance';
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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSemanticRoles';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M136 full queue cap');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function structure(r:Run,mode:'separate'|'shared'|'denied'){
 const a=reports(r,ROLE_ENCODING).find(a=>uint(f(rec(a[4],227n),3n))===2n)!;expect(a,'native encoding').toBeDefined();
 const bindings=items(f(rec(a[4],227n),5n),'set').map(v=>rec(v,224n)),claims=items(a[5],'list').map(v=>rec(v,240n)),audit=items(a[6],'list').map(v=>items(v,'list'));
 expect(bindings).toHaveLength(mode==='denied'?1:2);expect(new Set(bindings.map(b=>key(f(b,1n)))).size).toBe(bindings.length);
 expect(new Set(bindings.map(b=>key(f(b,3n)))).size).toBe(1);
 expect(new Set(bindings.map(b=>key(f(b,4n)))).size).toBe(mode==='separate'?2:1);
 expect(new Set(claims.map(c=>key(f(c,1n)))).size).toBe(claims.length);
 for(const c of claims)expect(items(a[3],'list').map(uint)).toContain(uint(id(f(c,1n)).payload));
 if(mode==='shared'){expect(claims).toHaveLength(2);expect(audit).toHaveLength(1);expect(audit[0][2]).toEqual(text('MultipleRoles'));expect(audit[0][3]).toBe(false);expect(items(a[8],'list')).toHaveLength(0);}
 else {expect(items(a[8],'list')).toHaveLength(1);expect(audit.filter(a=>a[3]===true)).toHaveLength(1);}
 expect(episodes(r).map(a=>a[5])).toEqual((mode==='shared'?[1]:[1,2]).map(signed));
 return a;
}
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

const traceAt=(r:Run,p:bigint)=>outputs(snap(r).trace,160n).find(v=>{const e=rec(f(v,4n),130n);return key(f(v,6n))===key(text(ROLE_STAGES_VERSION))&&key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===p;})!;
const projected=(r:Run,p:bigint,t:bigint)=>items(f(traceAt(r,p),13n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
function companions(r:Run){
 const current=projected(r,15n,240n),later=projected(r,125n,240n),fullCurrent=projected(r,14n,227n)[0],fullLater=projected(r,124n,227n)[0];
 expect(current.length).toBeGreaterThan(0);expect(fullCurrent).toBeDefined();expect(fullLater).toBeDefined();
 expect(key(f(fullCurrent,1n))).not.toBe(key(f(fullLater,1n)));
 for(const [xs,full] of[[current,fullCurrent],[later,fullLater]] as const){
  const bindings=items(f(full,5n),'set').map(v=>rec(v,224n)),ids=new Set(bindings.map(b=>key(f(b,1n))));
  expect(items(f(full,6n),'set')).toHaveLength(6);expect(items(f(full,7n),'set')).toHaveLength(3);
  for(const c of xs){expect(f(c,2n)).toEqual(f(full,1n));expect(f(c,3n)).toEqual(f(full,2n));for(const v of items(f(c,8n),'set')){const ref=rec(v,237n);expect(uint(f(ref,1n))).toBe(4n);expect(ids.has(key(f(ref,5n))),'actual safe binding basis').toBe(true);}}
 }
 const assessment=reports(r,ROLE_ENCODING).find(a=>uint(f(rec(a[4],227n),3n))===2n)!;expect(items(assessment[5],'list')).toEqual(later);
 const consumed=items(items(f(traceAt(r,125n),12n),'list')[1],'list');expect(consumed[2]).toEqual(assessment[3]);
 for(const request of items(consumed[3],'list')){const a=items(request,'list');expect(a[2]).toEqual(text('transition/derive-character-causal-role'));expect(a[3]).toEqual(text('SameExperience'));expect(items(a[4],'list')).toEqual([list([text('perceived-binding'),text('perceived-binding/0.1-candidate'),text('semantic-binding/0.1-candidate#SEM-001C')])]);expect(items(a[5],'list').length).toBeGreaterThan(0);}
 const stages=outputs(snap(r).trace,160n).filter(v=>key(f(v,6n))===key(text(ROLE_STAGES_VERSION))&&key(f(rec(f(v,4n),130n),2n))===key(signed(2))).map(v=>uint(f(rec(f(v,4n),130n),3n)));
 expect(stages).toEqual([0n,10n,11n,12n,13n,14n,15n,20n,21n,110n,120n,121n,122n,123n,124n,125n,126n,127n,130n,140n]);
 return {current,later,fullCurrent,fullLater};
}
it('primary136: actual lane companions drive selected encoding, remembered appraisal and choice',async()=>{
 const separate=await create(),shared=await create('shared');
 for(const x of[separate,shared]){await through(x.r,2n);structure(x.r,x.b.mode as 'separate'|'shared');companions(x.r);}
 const frozen=[separate,shared].map(x=>outputs(snap(x.r).outputs,227n));
 for(const [i,x]of[separate,shared].entries()){await through(x.r,21n);expect(outputs(snap(x.r).outputs,227n).slice(0,frozen[i].length)).toEqual(frozen[i]);}
 const p=[judgment(separate.r,separate.b,0),judgment(shared.r,shared.b,1)];expect(p[0].equals(Q.of(1n,2n))).toBe(true);expect(p[1].equals(Q.of(1n))).toBe(true);
 for(const x of[separate,shared])await finish(x.r);
 console.info('M136 PRIMARY PASS actual15/125 claims and exact basis; same125 IDs/records consumed130; immutable envelopes; role grouping -> selected encoding -> recall -> live appraisal/reasons/decision/execution P1/2 vs1 with belief1/2; full queues');
},590000);
it('continuation136: causal companions and actual consumer survive exact restore and role-stage rollback',async()=>{
 const {b,m,r}=await create('shared'),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);companions(r);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=encoding.deriveEncodingRoles;let calls=0;
 const spy=vi.spyOn(encoding,'deriveEncodingRoles').mockImplementation((...args)=>{const result=original(...args);if(args[0].occurredAt===2n&&++calls===2)throw Error('M136 after consequence role production');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M136 after consequence role production');expect(calls).toBe(2);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M136 CONTINUATION PASS repeat/save2/all later boundaries; failure after125 rolls both lanes/allocators back; exact recovered queue');
},590000);
it('boundaries136: actual native requests enforce exact provenance and reject stale or forged companions',async()=>{
 const saved:PreparedEncodingRoles[]=[],original=encoding.deriveEncodingRoles;
 const spy=vi.spyOn(encoding,'deriveEncodingRoles').mockImplementation((...args)=>{const r=original(...args);if(args[0].occurredAt===2n)saved.push(r);return r;});
 let x:Awaited<ReturnType<typeof create>>;try{x=await create();await through(x.r,2n);}finally{spy.mockRestore();}
 expect(saved).toHaveLength(2);const [current,later]=saved,settings=(await compileCharacterModel(x!.b.s)).encoding!;companions(x!.r);
 expect(Object.isFrozen(later)).toBe(true);expect(Object.isFrozen(later.claims[0])).toBe(true);expect(Object.isFrozen(later.requests)).toBe(true);
 expect(()=>encodeExperienceFromRoles(later.experience,settings,current)).toThrow('experience binding');
 for(const forged of[{...later,ids:later.ids.map(()=>later.ids[0])},{...later,claims:later.claims.map(c=>({...c,observerId:'foreign'}))},{...later,claims:later.claims.map(c=>({...c,experienceId:c.experienceId+1n}))},{...later,claims:later.claims.map(c=>({...c,causalRoleId:'causal-role/cause' as const}))}])expect(()=>encodeExperienceFromRoles(later.experience,settings,forged)).toThrow();
 type Request=Parameters<typeof provenance.deriveCausalRoleEvidence>[1];const request=later.requests[0],model=provenance.compileCausalRoleModel('native-M136-control',[provenance.INITIAL_CAUSAL_ROLE_RULE]);
 const changes:((r:Request)=>Request)[]=[
 r=>({...r,readDomain:{...r.readDomain,transitionKindId:'unadmitted'}}),
 r=>({...r,readDomain:{...r.readDomain,temporalScope:'SameWindow'}}),
 r=>({...r,evidenceOccurrences:r.evidenceOccurrences.map(o=>({...o,recordSchemaVersion:'unadmitted'}))}),
 r=>({...r,evidenceOccurrences:r.evidenceOccurrences.map(o=>({...o,producingEpistemicSeamVersion:'unadmitted'}))}),
 r=>({...r,evidenceOccurrences:r.evidenceOccurrences.map(o=>({...o,observerId:'foreign'}))}),
 r=>({...r,evidenceOccurrences:r.evidenceOccurrences.map(o=>({...o,occurredAt:o.occurredAt+1n}))}),
 r=>({...r,evidenceOccurrences:r.evidenceOccurrences.map(o=>({...o,scope:{...o.scope,experienceId:o.scope.experienceId!+1n}}))}),
 r=>({...r,evidenceOccurrences:r.evidenceOccurrences.map(o=>({...o,scope:{...o.scope,carrier:{kind:'continuant-in-event' as const,perceptualReferentId:r.perceptualReferentId,perceptualEventReferentId:{...r.perceptualEventReferentId,observerEventSequence:r.perceptualEventReferentId.observerEventSequence+1n}}}}))}),
 r=>({...r,evidenceOccurrences:r.evidenceOccurrences.map(o=>({...o,ref:{kind:'causal-role' as const,causalRoleEvidenceId:999n}}))}),
 r=>({...r,evidenceOccurrences:r.evidenceOccurrences.map(o=>({...o,truthHandle:'hidden-ancestry'}))})
 ];
 for(const change of changes)expect(()=>provenance.deriveCausalRoleEvidence(model,change(structuredClone(request)),999n)).toThrow();
 await finish(x!.r);const absent=await create('none');await through(absent.r,2n);expect(companions(absent.r).later).toHaveLength(0);expect(episodes(absent.r).map(a=>a[5])).toEqual([signed(1)]);await finish(absent.r);
 console.info('M136 BOUNDARIES PASS captured actual provenance: schema/seam/observer/time/experience/window/carrier/recursive-ref/truth-field reject; immutable roles; current/forged IDs/role claims reject; native zero-role companion');
},590000);
it('privacy136: hidden roles and truth cannot change causal companions and denied bindings stay absent',async()=>{
 const a=await create('shared'),b=await create('hidden');for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create('denied');await through(denied.r,2n);structure(denied.r,'denied');expect(companions(denied.r).later).toHaveLength(1);await through(denied.r,21n);judgment(denied.r,denied.b,0);await finish(denied.r);
 console.info('M136 PRIVACY PASS hidden physical roles/truth inert in all safe prefixes; denied extra gives one actual binding/claim, no exclusion, negative recalled judgment');
},590000);
