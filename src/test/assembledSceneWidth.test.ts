import {SCENE_WIDTH_ENCODING} from '../assembled/encoding';
import {selectWideAttention} from '../assembled/wideAttention';
import {prepareAttentionPool,selectAttention,selectedReferences,consumeSelected,closeSelectedView} from '../campaign3/attentionSelection';
import {encodeSelectedBudgetControl} from '../campaign3/selectedEncodingBudgetControl';
import {ROLE_DOMAIN_ENCODING,SCENE_WIDTH_VERSION,observedRole,compileEncoding} from '../assembled/encoding';
import {currentSource,CURRENT_SEM_SOURCE} from '../assembled/semanticLanes';
import {encounterSource} from '../assembled/encounter';
import {scene} from './fixtures/assembledSceneWidth';
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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSceneWidth';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M139 full queue cap');}
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


const traceAt=(r:Run,p:bigint)=>outputs(snap(r).trace,160n).find(v=>{const e=rec(f(v,4n),130n);return key(f(v,6n))===key(text(SCENE_WIDTH_VERSION))&&key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===p;})!;
const projected=(r:Run,p:bigint,t:bigint)=>items(f(traceAt(r,p),13n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
const roleName=(b:CanonicalValue)=>id(f(rec(f(rec(b,224n),5n),223n),2n)).payload;
function maximal(r:Run,phase=14n,denied=false){
 const full=projected(r,phase,227n)[0],bindings=items(f(full,5n),'set'),claims=projected(r,phase+1n,240n),input=items(items(f(traceAt(r,phase+1n),12n),'list')[1],'list'),ids=items(input[2],'list').map(uint);
 expect(bindings).toHaveLength(denied?5:6);expect(new Set(bindings.map(b=>key(f(rec(b,224n),4n)))).size).toBe(denied?2:3);
 expect(new Set(bindings.map(b=>key(f(rec(b,224n),3n)))).size).toBe(1);
 expect(bindings.map(roleName)).toEqual(expect.arrayContaining([R.Actor,R.Companion,R.AffectedEntity,R.Beneficiary,R.Location,...(denied?[]:[R.Instrument])].map(text)));
 expect(claims).toHaveLength(denied?4:5);expect(ids).toHaveLength(denied?5:6);
 const names=claims.map(c=>id(f(c,6n)).payload);expect(names).toEqual(expect.arrayContaining(['actor','affected-entity','participant','location',...(denied?[]:['instrument'])].map(n=>text('causal-role/'+n))));
 const bindingIds=new Set(bindings.map(b=>key(f(rec(b,224n),1n))));
 for(const c of claims){expect(f(c,2n)).toEqual(f(full,1n));expect(ids).toContain(uint(id(f(c,1n)).payload));for(const ref of items(f(c,8n),'set')){const v=rec(ref,237n);expect(uint(f(v,1n))).toBe(4n);expect(bindingIds.has(key(f(v,5n)))).toBe(true);}}
 expect(names).not.toContainEqual(text('causal-role/beneficiary'));expect(names).not.toContainEqual(text('causal-role/context'));
 return full;
}
function structure(r:Run,mode:ReturnType<typeof fixture>['mode']){
 maximal(r);
 const full=projected(r,124n,227n)[0],bindings=items(f(full,5n),'set'),claims=projected(r,125n,240n),a=reports(r,SCENE_WIDTH_ENCODING).find(a=>uint(f(rec(a[4],227n),3n))===2n)!;
 expect(a,'actual0.6 encoding').toBeDefined();expect(items(a[5],'list')).toEqual(claims);
 const consumed=items(items(f(traceAt(r,125n),12n),'list')[1],'list');expect(a[3]).toEqual(consumed[2]);
 const count=mode==='six'?6:mode==='denied'?4:5;
 expect(bindings).toHaveLength(count);expect(new Set(bindings.map(b=>key(f(rec(b,224n),4n)))).size).toBe(count);
 expect(claims).toHaveLength(count-1);expect(items(a[3],'list')).toHaveLength(count);
 const audit=items(a[6],'list').map(v=>items(v,'list'));expect(audit).toHaveLength(count);expect(audit.filter(v=>v[3]===true)).toHaveLength(1);
 expect(audit.filter(v=>v[3]===true)[0][1]).toEqual(list([text(mode==='actor'?'causal-role/actor':'causal-role/target')]));
 expect(audit.map(v=>v[2])).toContainEqual(text('MissingRole'));expect(audit.map(v=>v[2])).toContainEqual(text('UnsupportedRole'));
 const eligible=mode!=='actor';expect(validateEncoding(list(a),full)).toBe(eligible);
 expect(episodes(r).map(v=>v[5])).toEqual((eligible?[1,2]:[1]).map(signed));return {a,full};
}
it('primary139: five-file global competition reaches actual memory, appraisal and choice',async()=>{
 const good=await create(),excluded=await create('actor'),histories=[] as CanonicalValue[][];
 for(const x of[good,excluded]){await through(x.r,2n);structure(x.r,x.b.mode);histories.push(outputs(snap(x.r).outputs,227n));}
 for(const [i,x]of[good,excluded].entries()){await through(x.r,21n);expect(outputs(snap(x.r).outputs,227n).slice(0,histories[i].length)).toEqual(histories[i]);}
 expect(judgment(good.r,good.b,0).equals(Q.of(1n,2n))).toBe(true);expect(judgment(excluded.r,excluded.b,1).equals(Q.of(1n))).toBe(true);
 for(const x of[good,excluded])await finish(x.r);
 console.info('M139 PRIMARY PASS actual five-file competition; exact125->130; focal Target vs other Actor -> negative vs positive recall -> live choice/execution P1/2 vs1 with belief1/2; immutable envelopes/full queues');
},590000);
it('continuation139: six-file scene exact repeat, save and whole-instant rollback',async()=>{
 const {b,m,r}=await create('six'),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);structure(r,'six');
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);while(snap(r).clock<21n){expect(await advance(r)).toBe(true);for(const p of[repeat,restored]){expect(await advance(p)).toBe(true);exact(r,p);}}expect(judgment(r,b,0).equals(Q.of(1n,2n))).toBe(true);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=encoding.deriveEncodingRoles;let calls=0;
 const spy=vi.spyOn(encoding,'deriveEncodingRoles').mockImplementation((...args)=>{const result=original(...args);if(args[0].occurredAt===2n&&++calls===2)throw Error('M139 after six-file consequence roles');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M139 after six-file consequence roles');expect(calls).toBe(2);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M139 CONTINUATION PASS six-file native choice; repeat/save2/every later boundary/full queue; post125 rollback files/counters/both lanes; exact recovery');
},590000);
it('privacy139: wider scenes preserve hidden truth and binding-specific permissions',async()=>{
 const a=await create(),b=await create('hidden');for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create('denied');await through(denied.r,2n);structure(denied.r,'denied');await through(denied.r,21n);expect(judgment(denied.r,denied.b,0).equals(Q.of(1n,2n))).toBe(true);await finish(denied.r);
 console.info('M139 PRIVACY PASS hidden truth/physical roles inert every safe prefix; denied extra produces no binding/file/companion; actual retained recall/choice/full queues');
},590000);

it('correspondence139: exact original-domain attention and encoding with global ingress controls',()=>{
 const patterns=[[R.Actor],[R.Target],[R.Participant],[R.Instrument],[R.Beneficiary],[R.Actor,R.Target]],cases=[[]] as (typeof patterns[number])[][];
 for(let size=1;size<=3;size++){const add=(prefix:typeof patterns)=>{if(prefix.length===size){cases.push(prefix);return;}for(const p of patterns)add([...prefix,p]);};add([]);}
 let comparisons=0;
 for(const roles of cases){const b=attentionFixture(roles);for(const capacity of[0,1,2]){
  const old=selectAttention(prepareAttentionPool(b.experience,b.claims),capacity),wide=selectWideAttention(b.experience,b.claims,capacity);
  expect(wide.audit).toEqual(old.audit);expect(selectedReferences(wide.view)).toEqual(selectedReferences(old.view));
  expect(encodeSelectedBudgetControl(wide.view,'historical-shared','role-calibrated','UnitBudget')).toEqual(encodeSelectedBudgetControl(old.view,'historical-shared','role-calibrated','UnitBudget'));comparisons++;
 }}expect(comparisons).toBe(777);
 const b=attentionFixture([[R.Target],[R.Companion],[R.Location],[R.Instrument],[R.Beneficiary],[R.Recipient]]);
 expect(()=>prepareAttentionPool(b.experience,b.claims)).toThrow('three units');
 for(const capacity of[-1,3,0.5])expect(()=>selectWideAttention(b.experience,b.claims,capacity)).toThrow();
 const x=selectWideAttention(b.experience,b.claims,1);expect(x.audit).toHaveLength(6);expect(x.audit.filter(a=>a.selected).map(a=>a.roles)).toEqual([['causal-role/target']]);
 const refs=selectedReferences(x.view);expect(consumeSelected(x.view,refs)).toHaveLength(refs.length);expect(()=>selectedReferences(x.view)).toThrow();expect(()=>consumeSelected({kind:'SelectedView'},[])).toThrow();
 const y=selectWideAttention(b.experience,b.claims,0);closeSelectedView(y.view);expect(()=>selectedReferences(y.view)).toThrow();
 const first=b.experience.perceivedBindings[0];
 expect(()=>selectWideAttention({...b.experience,perceivedBindings:b.experience.perceivedBindings.map((v,i)=>i===1?{...v,perceivedBindingId:first.perceivedBindingId}:v)},b.claims,1)).toThrow();
 expect(()=>selectWideAttention(b.experience,b.claims.map((v,i)=>i===1?{...v,causalRoleEvidenceId:b.claims[0].causalRoleEvidenceId}:v),1)).toThrow();
 expect(()=>selectWideAttention(b.experience,[...b.claims,{...b.claims[0],causalRoleEvidenceId:999n,perceptualReferentId:{observerId:b.experience.observerId,observerTrackSequence:999n}}],1)).toThrow();
 for(const changes of[{observerId:'observer/foreign'},{occurredAt:2n},{experienceId:999n},{transformationVersion:'forged'}])expect(()=>selectWideAttention(b.experience,b.claims.map((v,i)=>i? v:{...v,...changes}),1)).toThrow();
 expect(()=>selectWideAttention(b.experience,b.claims.slice(1),1)).toThrow();
 const seven=attentionFixture(Array.from({length:7},()=>[R.Actor]));expect(()=>selectWideAttention(seven.experience,seven.claims,1)).toThrow('finite experience domain');
 expect(()=>roleChannel(scene(),true,true,true)).toThrow('three continuant');expect(()=>roleChannel(scene(),true,true,true,true)).not.toThrow();
 const channel=items(scene('six'),'list');expect(()=>roleChannel(list([channel[0],channel[1],list([...items(channel[2],'list'),list([true,u(2),u(3),false])])]),true,true,true,true)).toThrow('capacity');
 expect(()=>compileEncoding(list([text(SCENE_WIDTH_ENCODING),u(1),text('role-calibrated'),text('historical-shared'),text('UnitBudget')]),true,true,true,true)).toThrow();
 console.info('M139 CORRESPONDENCE PASS 777 exact original audits/selected refs/evidence bytes/factors; six-unit global selection; global duplicate/correspondence/forged/expired controls; old4/new7 domain rejection');
},590000);
