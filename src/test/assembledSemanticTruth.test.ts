import {SEMANTIC_TRUTH_VERSION,compileSemanticTruth,sourceRole,materializeTruth,permittedRoleCode,truthRole} from '../assembled/semanticTruth';
import * as truth from '../assembled/semanticTruth';
import {content,channel,binding,rule,schema,ref,currentScene,consequenceScene} from './fixtures/assembledSemanticTruth';
import {SCENE_WIDTH_ENCODING} from '../assembled/encoding';
import {projectEventRoleEvidence,compileEventBindings} from '../semanticBinding/eventBindings';
import {ROLE_DOMAIN_ENCODING,SCENE_WIDTH_VERSION,observedRole,compileEncoding} from '../assembled/encoding';
import {currentSource,CURRENT_SEM_SOURCE} from '../assembled/semanticLanes';
import {encounterSource} from '../assembled/encounter';

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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSemanticTruth';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M140 full queue cap');}
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


const traceAt=(r:Run,p:bigint)=>outputs(snap(r).trace,160n).find(v=>{const e=rec(f(v,4n),130n);return key(f(v,6n))===key(text(SEMANTIC_TRUTH_VERSION))&&key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===p;})!;
const projected=(r:Run,p:bigint,t:bigint)=>items(f(traceAt(r,p),13n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
const roleName=(b:CanonicalValue)=>id(f(rec(f(rec(b,224n),5n),223n),2n)).payload;
function structure(r:Run,mode:ReturnType<typeof fixture>['mode']){
 const current=projected(r,14n,227n)[0],cb=items(f(current,5n),'set'),world=projected(r,0n,210n)[0],wb=items(f(world,4n),'set');
 expect(wb).toHaveLength(6);expect(cb).toHaveLength(mode==='omitted'?4:5);
 expect(new Set(cb.map(b=>key(f(rec(b,224n),4n)))).size).toBe(mode==='multi'||mode==='omitted'?4:5);
 expect(wb.map(v=>id(f(rec(v,211n),2n)).payload)).toContainEqual(text(R.Action));
 const roleRecords=cb.map(v=>rec(f(rec(v,224n),5n),223n));expect(roleRecords.filter(v=>uint(f(v,1n))===2n)).toHaveLength(mode==='unresolved'?1:0);
 expect(roleRecords.filter(v=>uint(f(v,1n))===1n).map(v=>id(f(v,2n)).payload)).not.toContainEqual(text(R.Action));
 const cons=projected(r,110n,210n)[0];expect(items(f(cons,4n),'set')).toHaveLength(5);
 const truthIds=[world,cons].flatMap(w=>[uint(id(f(w,1n)).payload),...items(f(w,4n),'set').map(b=>uint(id(f(rec(b,211n),1n)).payload))]);expect(new Set(truthIds).size).toBe(13);
 expect(outputs(snap(r).outputs,210n)).toHaveLength(0);expect(outputs(snap(r).outputs,211n)).toHaveLength(0);
 for(const name of['action.skip-rope','action.walk','person.mina','person.glen','person.darius','location.library','object.lead-pipe']){expect(key(out(r)).includes(key(ref(name)))).toBe(false);expect(key(decode(snap(r).state)).includes(key(ref(name)))).toBe(false);}
 const full=projected(r,124n,227n)[0],bindings=items(f(full,5n),'set'),claims=projected(r,125n,240n),a=reports(r,SCENE_WIDTH_ENCODING).find(a=>uint(f(rec(a[4],227n),3n))===2n)!;
 expect(bindings).toHaveLength(5);expect(claims).toHaveLength(4);expect(items(a[5],'list')).toEqual(claims);
 expect(a[3]).toEqual(items(items(f(traceAt(r,125n),12n),'list')[1],'list')[2]);
 const audit=items(a[6],'list').map(v=>items(v,'list'));expect(audit.filter(v=>v[3]===true).map(v=>v[1])).toEqual([list([text(mode==='preserved'?'causal-role/actor':'causal-role/target')])]);
 const positive=mode!=='preserved';expect(validateEncoding(list(a),full)).toBe(positive);expect(episodes(r).map(v=>v[5])).toEqual((positive?[1,2]:[1]).map(signed));
 return {world,cons,current,full};
}
it('primary140: governed event precision changes retained experience and actual choice',async()=>{
 const a=await create(),b=await create('preserved');for(const x of[a,b]){await through(x.r,2n);structure(x.r,x.b.mode);await through(x.r,21n);}
 expect(judgment(a.r,a.b,0).equals(Q.of(1n,2n))).toBe(true);expect(judgment(b.r,b.b,1).equals(Q.of(1n))).toBe(true);
 for(const x of[a,b])await finish(x.r);
 console.info('M140 PRIMARY PASS governed six-binding current truth -> five perceived files; actual shared allocated truth210/211 only in trace; coarsened vs preserved other Actor -> focal negative vs positive recall -> live P1/2 vs1 with belief1/2; actual execution/full queues');
},590000);
it('boundaries140: repeatable/multi-role, omission and unresolved evidence stay distinct natively',async()=>{
 for(const mode of['multi','omitted','unresolved'] as const){const x=await create(mode);await through(x.r,2n);structure(x.r,mode);await through(x.r,21n);expect(judgment(x.r,x.b,0).equals(Q.of(1n,2n))).toBe(true);await finish(x.r);}
 console.info('M140 BOUNDARIES PASS native same referent Actor/Companion distinct bindings/shared file; repeatable Companions; omitted vs unresolved evidence; actual memory/choice/full queues');
},590000);
it('privacy140: changed hidden truth is absent from every character prefix',async()=>{
 const a=await create(),b=await create('hidden');let unequal=false;for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(snap(a.r).clock===2n){const x=structure(a.r,a.b.mode),y=structure(b.r,b.b.mode);expect(x.current).toEqual(y.current);expect(x.full).toEqual(y.full);expect(x.world).not.toEqual(y.world);expect(x.cons).not.toEqual(y.cons);unequal=true;}if(!more)break;expect(n).toBeLessThan(95);}expect(unequal).toBe(true);
 console.info('M140 PRIVACY PASS hidden Action/referent changes alter truth trace and preserve every safe state/output prefix and both envelopes; no truth identity copied');
},590000);
it('continuation140: governed truth allocation and both perception lanes restore and roll back exactly',async()=>{
 const {b,m,r}=await create(),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);structure(r,b.mode);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=truth.materializeTruth;let calls=0;
 const spy=vi.spyOn(truth,'materializeTruth').mockImplementation((...args)=>{const result=original(...args);if(args[3]===2n&&++calls===2)throw Error('M140 after consequence truth allocation');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M140 after consequence truth allocation');expect(calls).toBe(2);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M140 CONTINUATION PASS repeat/save2/every later boundary/full queue; post110 truth allocation failure rolls current lane/state/files/trace/global IDs back; exact recovery');
},590000);
it('grammar140: governed domain/cardinality and role precision match accepted SEM',async()=>{
 const settings={truth:compileSemanticTruth(content())},track={observerId:'observer/control',observerTrackSequence:0n};let count=0;
 for(let r=1n;r<=10n;r++)for(let p=0n;p<=3n;p++){
  const original=()=>projectEventRoleEvidence({eventBindingId:7n,eventRoleId:truthRole(r),semanticReferent:{semanticReferentId:key(ref('person.mina')),domainTags:['entity']}},track,{kind:(['omit','preserve','coarsen-to-participant','unresolved'] as const)[Number(p)]});
  if(r===10n&&p!==0n){expect(()=>permittedRoleCode(r,p)).toThrow('Action');continue;}
  if(p===2n&&[6n,7n].includes(r)){expect(original).toThrow();expect(()=>permittedRoleCode(r,p)).toThrow();continue;}
  const x=original(),n=permittedRoleCode(r,p);expect(n===undefined?undefined:observedRole(n,true)).toEqual(x?.eventRoleEvidence);count++;
 }expect(count).toBe(35);
 expect(()=>sourceRole(currentScene('coarsened'),{})).toThrow('version');
 const good=channel('event-type/strike',[binding(6,'object.lead-pipe')]);expect(()=>sourceRole(good,settings)).not.toThrow();expect(()=>sourceRole(channel('event-type/drink',[binding(6,'object.cup')]),settings)).not.toThrow();
 const invalid=[channel('event-type/drink',[binding(6,'object.lead-pipe')]),channel('event-type/strike',[binding(6,'object.decorative-hammer')]),channel('event-type/strike',[binding(6,'object.cup')]),channel('event-type/strike',[]),channel('event-type/strike',[binding(6,'object.lead-pipe'),binding(6,'object.lead-pipe')]),channel('event-type/fixed-action',[binding(1,'person.mina'),binding(10,'action.walk',0)]),channel('undeclared',[binding(1,'person.mina')]),channel('event-type/strike',[binding(6,'undeclared')]),channel('event-type/strike',[binding(11,'object.lead-pipe')])];
 for(const v of invalid)expect(()=>sourceRole(v,settings)).toThrow();
 expect(()=>sourceRole(channel('event-type/strike',[list([...items(binding(6,'object.lead-pipe'),'list'),text('qualifier')])]),settings)).toThrow();
 const originalContent=items(content(),'list'),schemas=items(originalContent[2],'list');
 expect(()=>compileSemanticTruth(list([originalContent[0],originalContent[1],list([...schemas,schema('bad',[rule(11)])])]))).toThrow();
 expect(()=>compileSemanticTruth(list([originalContent[0],originalContent[1],list([...schemas,schema('bad',[rule(10)],'action.walk')])]))).toThrow('redundant');
 let n=100n;const w=materializeTruth(good,settings,()=>n++,2n);expect(n).toBe(102n);expect(w).toHaveLength(1);expect(uint(id(f(rec(w[0],210n),1n)).payload)).toBe(100n);
 const b=fixture();await expect(createCharacterRun(await prepareCharacterModel(b.legacy.s),b.d)).rejects.toThrow();
 console.info('M140 GRAMMAR PASS all40 role/precision cases including5 rejection controls; original governed broad AND narrow domains/cardinality/duplicates/fixed Action/undeclared/qualifier/old-version controls; real typed allocation');
},590000);
