import {ROLE_DOMAIN_ENCODING,ROLE_DOMAIN_VERSION,observedRole,compileEncoding} from '../assembled/encoding';
import {currentSource,CURRENT_SEM_SOURCE} from '../assembled/semanticLanes';
import {encounterSource} from '../assembled/encounter';
import {matrix} from './fixtures/assembledRoleDomain';
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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledRoleDomain';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M138 full queue cap');}
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


const traceAt=(r:Run,p:bigint)=>outputs(snap(r).trace,160n).find(v=>{const e=rec(f(v,4n),130n);return key(f(v,6n))===key(text(ROLE_DOMAIN_VERSION))&&key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===p;})!;
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
 maximal(r,14n,mode==='denied');
 const full=projected(r,124n,227n)[0],bindings=items(f(full,5n),'set'),claims=projected(r,125n,240n),a=reports(r,ROLE_DOMAIN_ENCODING).find(a=>uint(f(rec(a[4],227n),3n))===2n)!;
 expect(a,'actual0.5 encoding').toBeDefined();expect(items(a[5],'list')).toEqual(claims);const consumed=items(items(f(traceAt(r,125n),12n),'list')[1],'list');expect(a[3]).toEqual(consumed[2]);
 const audit=items(a[6],'list').map(v=>items(v,'list')),eligible=['companion','hidden','denied'].includes(mode);
 if(mode==='matrix'){maximal(r,124n);expect(audit.map(v=>v[2])).toEqual(expect.arrayContaining([text('MultipleRoles'),text('UnsupportedRole')]));}
 else {
  expect(bindings).toHaveLength(1);expect(roleName(bindings[0])).toEqual(text(mode==='instrument'?R.Instrument:mode==='beneficiary'?R.Beneficiary:R.Companion));
  expect(claims).toHaveLength(mode==='beneficiary'?0:1);
  if(claims.length)expect(id(f(claims[0],6n)).payload).toEqual(text(mode==='instrument'?'causal-role/instrument':'causal-role/participant'));
  expect(audit).toHaveLength(1);expect(audit[0][2]).toEqual(text(eligible?'Eligible':mode==='beneficiary'?'MissingRole':'UnsupportedRole'));
 }
 expect(audit.filter(v=>v[3]===true)).toHaveLength(eligible?1:0);
 expect(episodes(r).map(v=>v[5])).toEqual((eligible?[1,2]:[1]).map(signed));
 expect(validateEncoding(list(a),full)).toBe(eligible);
 return {a,full};
}
it('primary138: accepted Companion versus Instrument reaches actual memory, appraisal and choice',async()=>{
 const good=await create('companion'),excluded=await create('instrument');
 const histories=[] as CanonicalValue[][];
 for(const x of[good,excluded]){await through(x.r,2n);structure(x.r,x.b.mode);histories.push(outputs(snap(x.r).outputs,227n));}
 for(const [i,x]of[good,excluded].entries()){await through(x.r,21n);expect(outputs(snap(x.r).outputs,227n).slice(0,histories[i].length)).toEqual(histories[i]);}
 expect(judgment(good.r,good.b,0).equals(Q.of(1n,2n))).toBe(true);expect(judgment(excluded.r,excluded.b,1).equals(Q.of(1n))).toBe(true);
 for(const x of[good,excluded])await finish(x.r);
 console.info('M138 PRIMARY PASS actual six-binding/three-file current matrix; original5 causal claims and unused Beneficiary slot; exact125->130; Companion eligible vs Instrument UnsupportedRole -> negative vs positive recall -> live choice/execution P1/2 vs1 with belief1/2; immutable envelopes/full queues');
},590000);
it('boundaries138: role grammar, six-binding consumer and Beneficiary missing-role control',async()=>{
 const names=[R.Actor,R.Target,R.Participant,R.Recipient,R.Companion,R.Instrument,R.Location,R.Beneficiary,R.AffectedEntity];
 expect(observedRole(0n,true)).toEqual({kind:'unresolved'});
 for(const [i,name]of names.entries())expect(observedRole(BigInt(i+1),true)).toEqual({kind:'exact',eventRoleId:name});
 for(const n of[-1n,10n,11n])expect(()=>observedRole(n,true)).toThrow();expect(()=>observedRole(5n)).toThrow();
 expect(()=>roleChannel(matrix(),true,true,true)).not.toThrow();expect(()=>roleChannel(matrix(),true,true)).toThrow();
 const invalidChannels=[
  list([u(10),u(5),list([])]), list([u(2),u(10),list([])]),
  list([u(2),text('event-role/context'),list([])]),
  list([u(2),u(5),list([list([true,u(2),u(5),true])])])
 ];
 for(const bad of invalidChannels)expect(()=>roleChannel(bad,true,true,true)).toThrow();
 const a=items(matrix(),'list'),extra=items(a[2],'list');
 expect(()=>roleChannel(list([a[0],a[1],list([...extra,list([true,u(2),u(4),true])])]),true,true,true)).toThrow('capacity');
 const separate=list([u(2),u(5),list([list([true,u(2),u(7),false]),list([true,u(2),u(6),false]),list([true,u(2),u(8),false])])]);
 expect(()=>roleChannel(separate,true,true,true)).toThrow('three continuant');expect(()=>roleChannel(list([u(2),u(5),list(extra.map(v=>{const x=items(v,'list');return list([false,...x.slice(1)]);}))]),true,true,true)).not.toThrow();
 const b=fixture(),model=await compileCharacterModel(b.s),current=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')).find(v=>key(v[2])===key(CURRENT_SEM_SOURCE))!;
 expect(()=>currentSource(current[3],model.recognition!)).not.toThrow();
 await expect(createCharacterRun(await prepareCharacterModel(b.legacy.s),b.d)).rejects.toThrow();
 const config=items(items(decode(b.s.registry),'list')[30],'list');expect(()=>compileEncoding(list(config),true,true,true)).toThrow();
 for(const mode of['beneficiary','matrix'] as const){
  const x=await create(mode);await through(x.r,2n);const {a,full}=structure(x.r,mode);
  if(mode==='matrix'){
   const {focalAssociationCue}=await import('../assembled/learnedAssociation');
   expect(()=>focalAssociationCue(full)).toThrow('focal binding');
   const first=items(f(full,5n),'set').map(b=>rec(b,224n)).sort((a,b)=>uint(id(f(a,1n)).payload)<uint(id(f(b,1n)).payload)?-1:1)[0];
   expect(focalAssociationCue(full,true)).toEqual(f(first,4n));
  }
  expect(encodingMatchesModel(list(a),model.encoding!)).toBe(true);
  const bad=[...a];bad[3]=list(items(a[3],'list').map(()=>u(0)));if(mode==='matrix')expect(()=>validateEncoding(list(bad),full)).toThrow();
  const old=[...a];old[0]=text(ROLE_ENCODING);expect(encodingMatchesModel(list(old),model.encoding!)).toBe(false);
  if(mode==='matrix')expect(()=>validateEncoding(list(old),full)).toThrow();
  const altered=[...a];altered[5]=list([...items(a[5],'list'),...(items(a[5],'list').length?[items(a[5],'list')[0]]:[])]);
  if(mode==='matrix')expect(()=>validateEncoding(list(altered),full)).toThrow();
  await through(x.r,21n);expect(judgment(x.r,x.b,1).equals(Q.of(1n))).toBe(true);await finish(x.r);
 }
 console.info('M138 BOUNDARIES PASS all9 roles/unresolved; Action/Context/unknown/duplicate/4-unit/7-binding/old-version rejection; actual six-binding consequence125->130 canonical assessment; forged/old assessment rejection; Beneficiary binding with zero claim/MissingRole; actual positive recall/choice/full queues');
},590000);
it('continuation138: six-binding consequence preserves exact repeat, save and whole-instant rollback',async()=>{
 const {b,m,r}=await create('matrix'),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);structure(r,'matrix');
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=encoding.deriveEncodingRoles;let calls=0;
 const spy=vi.spyOn(encoding,'deriveEncodingRoles').mockImplementation((...args)=>{const result=original(...args);if(args[0].occurredAt===2n&&++calls===2)throw Error('M138 after six-binding consequence roles');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M138 after six-binding consequence roles');expect(calls).toBe(2);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M138 CONTINUATION PASS six-binding output/save; repeat/save2/every later boundary/full queue; post125 fault rolls both lanes/files/allocators back; exact recovery');
},590000);
it('privacy138: role-domain widening never exposes physical roles or denied binding records',async()=>{
 const a=await create(),b=await create('hidden');for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create('denied');await through(denied.r,2n);structure(denied.r,'denied');await through(denied.r,21n);expect(judgment(denied.r,denied.b,0).equals(Q.of(1n,2n))).toBe(true);await finish(denied.r);
 console.info('M138 PRIVACY PASS hidden truth/physical role changes inert at every safe prefix; denied extra creates no binding/file/companion; remaining Companion -> retained negative -> actual choice/full queues');
},590000);
