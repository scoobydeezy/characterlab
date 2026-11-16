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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledRoleBinding';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M129 full queue cap');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function structure(r:Run,mode:'separate'|'shared'|'duplicate'|'denied'){
 const a=reports(r,ROLE_ENCODING).find(a=>uint(f(rec(a[4],227n),3n))===2n)!;expect(a,'native encoding').toBeDefined();
 const bindings=items(f(rec(a[4],227n),5n),'set').map(v=>rec(v,224n)),claims=items(a[5],'list').map(v=>rec(v,240n)),audit=items(a[6],'list').map(v=>items(v,'list'));
 expect(bindings).toHaveLength(mode==='denied'?1:2);expect(new Set(bindings.map(b=>key(f(b,1n)))).size).toBe(bindings.length);
 expect(new Set(bindings.map(b=>key(f(b,3n)))).size).toBe(1);
 expect(new Set(bindings.map(b=>key(f(b,4n)))).size).toBe(mode==='separate'?2:1);
 expect(new Set(claims.map(c=>key(f(c,1n)))).size).toBe(claims.length);
 for(const c of claims)expect(items(a[3],'list').map(uint)).toContain(uint(id(f(c,1n)).payload));
 if(mode==='shared'){expect(claims).toHaveLength(2);expect(audit).toHaveLength(1);expect(audit[0][2]).toEqual(text('MultipleRoles'));expect(audit[0][3]).toBe(false);expect(items(a[8],'list')).toHaveLength(0);}
 else {expect(items(a[8],'list')).toHaveLength(1);expect(audit.filter(a=>a[3]===true)).toHaveLength(1);}
 if(mode==='duplicate'){expect(claims).toHaveLength(1);expect(items(f(claims[0],8n),'set')).toHaveLength(2);}
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
it('kernel129: distinct occurrences, one causal companion per role/carrier and actual nonconsecutive reserved identities',()=>{
 const settings={capacity:1,attention:'role-calibrated' as const,multiUnit:true,sharedBindings:true,budgetLaw:'historical-shared' as const,budgetCalibration:'UnitBudget' as const};
 const f=attentionFixture([[R.Target],[R.Participant],[R.Target]],[0n,1n,0n]),a=items(encodeExperience(f.experience,settings,[101n,501n,301n]).value,'list'),claims=items(a[5],'list').map(v=>rec(v,240n));
 expect(claims).toHaveLength(2);expect(claims.map(c=>uint(id(fld(c,1n)).payload))).toEqual([101n,501n]);expect(items(fld(claims[0],8n),'set')).toHaveLength(2);expect(items(a[8],'list')).toHaveLength(1);
 expect(validateEncoding(list(a),preRecognitionSemanticExperienceValue(f.experience))).toBe(true);
 const mixed=attentionFixture([[R.Target],[R.Actor],[R.Participant]],[0n,1n,0n]),b=items(encodeExperience(mixed.experience,settings,[101n,501n,301n]).value,'list'),ids=items(b[5],'list').map(c=>uint(id(fld(rec(c,240n),1n)).payload));
 expect(ids).toEqual([101n,301n,501n]);expect(items(b[6],'list').map(v=>items(v,'list')[2])).toContainEqual(text('MultipleRoles'));expect(validateEncoding(list(b),preRecognitionSemanticExperienceValue(mixed.experience))).toBe(false);
 expect(()=>encodeExperience(mixed.experience,settings,[101n,101n,301n])).toThrow('reserved claim identities');
 const changed=[...b];changed[3]=list([u(101),u(501),u(302)]);expect(()=>validateEncoding(list(changed),preRecognitionSemanticExperienceValue(mixed.experience))).toThrow('canonical factors/refs');
 expect(encodingMatchesModel(list(a),{...settings,sharedBindings:false})).toBe(false);
 for(const extra of[list([true,u(2),u(2)]),list([true,u(2),u(2),u(1)])])expect(()=>roleChannel(list([u(2),u(2),list([extra])]),true,true)).toThrow();
 expect(()=>roleChannel(list([u(2),u(2),list([list([true,u(2),u(2),true])])]),true,false)).toThrow();
 console.info('M129 KERNEL PASS interleaved carrier groups; exact actual IDs101/301/501; duplicate role has two supporting occurrences and one claim; collisions, forged factors and old grammar rejected');
 function fld(...args:Parameters<typeof import('../campaign2/canonicalData').dataField>){return args[0].fields.get(args[1])!;}
});
it('primary129: co-carrier exclusion changes retained experience and live choice with identical current belief',async()=>{
 const separate=await create(),shared=await create('shared'),duplicate=await create('duplicate');
 for(const x of[separate,shared,duplicate]){await through(x.r,2n);structure(x.r,x.b.mode as 'separate'|'shared'|'duplicate');}
 for(const x of[separate,shared,duplicate])await through(x.r,21n);
 const p=[judgment(separate.r,separate.b,0),judgment(shared.r,shared.b,1),judgment(duplicate.r,duplicate.b,0)];
 console.info('M129 probability(action two), separate/shared/duplicate: '+p.map(x=>x.numerator+'/'+x.denominator).join(' / '));
 expect(p[0].equals(p[1]),'actual choice probability changes').toBe(false);expect(p[0]).toEqual(p[2]);
 for(const x of[separate,shared,duplicate])await finish(x.r);
 console.info('M129 PRIMARY PASS actual bindings -> attention -> episode -> recall -> live appraisal/reasons/distribution/attempt; belief1/2; complete queues');
},590000);
it('continuation129: repeated carrier survives exact repeat/save2 and transaction rollback',async()=>{
 const {b,m,r}=await create('duplicate'),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=encoding.encodeExperience;let reached=false;
 const spy=vi.spyOn(encoding,'encodeExperience').mockImplementation((...args)=>{const result=original(...args);if(args[0].occurredAt===2n){reached=true;throw Error('M129 after role encoding');}return result;});
 try{await expect(advance(fault)).rejects.toThrow('M129 after role encoding');expect(reached).toBe(true);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 const old=await compileCharacterState(await compileCharacterModel(b.legacy.s));expect(()=>old.stateModel.validateState(state(r))).toThrow();
 console.info('M129 CONTINUATION PASS repeat/save2 every later settled boundary/full queue; post-binding encoding fault rolls whole instant back; restored prefix exact; old version rejects annex');
},590000);
it('privacy129: hidden physical roles/truth cannot change cognition and denied co-carrier evidence remains absent',async()=>{
 const a=await create('shared'),hidden=await create('hidden');
 for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(hidden.r)).toBe(more);bytes(snap(a.r).state,snap(hidden.r).state);bytes(snap(a.r).outputs,snap(hidden.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create('denied');await through(denied.r,2n);structure(denied.r,'denied');await through(denied.r,21n);judgment(denied.r,denied.b,0);await finish(denied.r);
 console.info('M129 PRIVACY PASS physical truth/roles inert through every full-queue boundary; denied extra cannot bind/exclude negative memory or change its recalled judgment');
},590000);
