import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import * as witness from '../assembled/socialWitness';
import * as social from '../assembled/social';
import {sid} from '../assembled/skill';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,exact,u,type CanonicalValue} from './fixtures/assembledSocialWitness';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state)),out=(r:Run)=>items(decode(r.snapshot().outputs),'list');
async function setup(privateCommitment=true){const b=fixture('main',privateCommitment),compiled=await compileCharacterModel(b.s),m=await prepareCharacterModel(b.s);return {b,m,s:compiled.socialWitness!,stateModel:(await compileCharacterState(compiled)).stateModel};}
it('violations149: native global copying and direct private readers break observer isolation; duplicate write is rejected',async()=>{
 const b=await setup(),baseline=await createCharacterRun(b.m,b.b.d);await through(baseline,6n);
 const original=witness.createSocialWitness;
 const global=vi.spyOn(witness,'createSocialWitness').mockImplementation((...args)=>{const factory=original(...args);return {extend(base){const h=factory.extend(base);return {...h,prepare(...xs:Parameters<typeof h.prepare>){const p=h.prepare(...xs);if(!xs[0].some(e=>key(e.eventTypeId)===key(witness.SW_LEARN)))return p;return {...p,finish(...ys:Parameters<typeof p.finish>){
  const next=p.finish(...ys),[a,z]=args[1].observers,history=social.personHistory(next.read(social.personPath(a.holder,a.target)).value);if(!history.length)return next;
  const path=social.personPath(z.holder,z.target),bad=list([text(social.SOCIAL),list(history.map(v=>{const o=[...items(v,'list')];o[1]=z.holder;o[2]=z.target;return list(o);}))]);
  return new AuthoritativeState([...next.entries().filter(e=>!(e.path.rootStateTypeId===810n&&key((e.path.selectors[0] as {key:CanonicalValue}).key)===key(list([z.holder,z.target])))),{path,value:bad}]);
 }};}};}};});
 try{const wrong=await createCharacterRun(b.m,b.b.d);await through(wrong,6n);expect(witness.socialObserverView(out(wrong),b.s,1)).not.toEqual(witness.socialObserverView(out(baseline),b.s,1));const z=b.s.observers[1];expect(social.personMean(state(wrong).read(social.personPath(z.holder,z.target)).value)).toEqual(Q.of(2n,3n));}finally{global.mockRestore();}
 const reader=vi.spyOn(witness,'createSocialWitness').mockImplementation((...args)=>{const factory=original(...args);return {extend(base){const h=factory.extend(base);return {...h,execute(context){const result=h.execute(context);if(key(context.event.eventTypeId)===key(witness.SW_QUERY)){
  const value=context.state.read({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:args[1].task}]}).value,truth=value!==undefined&&uint(f(rec(value,372n),1n))===1n;
  for(let i=0;i<result.outputs.length;i++){const row=[...items(result.outputs[i],'list')];row[3]=q(truth?1:0,1);result.outputs[i]=list(row);}
 }return result;}};}};});
 try{const hidden=await setup(false),a=await createCharacterRun(b.m,b.b.d),z=await createCharacterRun(hidden.m,hidden.b.d);for(const r of[a,z])await through(r,3n);for(let i=0;i<2;i++)expect(witness.socialObserverView(out(a),b.s,i)).not.toEqual(witness.socialObserverView(out(z),hidden.s,i));}finally{reader.mockRestore();}
 const person=social.personUpdate,duplicate=vi.spyOn(social,'personUpdate').mockImplementation((prior,o)=>{
  const a=items(o,'list');if(b.s.observers.some(x=>key(x.holder)===key(a[1]))&&social.personHistory(prior).some(v=>key(items(v,'list')[4])===key(a[4])&&key(items(v,'list')[5])===key(a[5])))return list([text(social.SOCIAL),list([...social.personHistory(prior),o])]);return person(prior,o);
 });
 try{const bad=fixture('duplicate'),r=await createCharacterRun(b.m,bad.d);await through(r,3n);const before=r.snapshot();await expect(through(r,5n)).rejects.toThrow('source grouping');expect({...r.snapshot(),status:before.status}).not.toEqual(before);expect(social.personHistory(state(r).read(social.personPath(b.s.observers[0].holder,b.s.observers[0].target)).value)).toHaveLength(2);}finally{duplicate.mockRestore();}
 console.info('M149 VIOLATIONS PASS deliberately untraced global copy contaminates B; private read changes fixed-evidence probes; presentation-counting write rejected by shared source-group owner. Test-only corruptions are never model options.');
},590000);
it.each(['observation','learning'])('rollback149: both observer branches and shared work roll back after %s',async boundary=>{
 const b=await setup(),original=witness.createSocialWitness;let hit=0;
 const spy=vi.spyOn(witness,'createSocialWitness').mockImplementation((...args)=>{const factory=original(...args);return {extend(base){const h=factory.extend(base);return {...h,
 execute(context){const result=h.execute(context);if(boundary==='observation'&&context.event.dueAt===3n&&key(context.event.eventTypeId)===key(witness.SW_OBSERVE)){hit++;throw Error('M149 fault');}return result;},
 prepare(...xs:Parameters<typeof h.prepare>){const p=h.prepare(...xs);if(boundary!=='learning'||!xs[0].some(e=>e.dueAt===3n&&key(e.eventTypeId)===key(witness.SW_LEARN)))return p;return {...p,finish(...ys:Parameters<typeof p.finish>){p.finish(...ys);hit++;throw Error('M149 fault');}};}
 };}};});
 let save:Uint8Array;
 try{const r=await createCharacterRun(b.m,b.b.d);await through(r,2n);save=r.save();const before=r.snapshot();await expect(r.settleNextInstant()).rejects.toThrow('M149 fault');expect(hit).toBe(1);expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(b.b.s,{initialState:b.b.d.initialState,orderedInputs:b.b.d.orderedInputs,save:save!}),clean=await createCharacterRun(b.m,b.b.d);for(const r of[restored,clean])await through(r,6n);exact(clean,restored);
 console.info('M149 ROLLBACK '+boundary+' all snapshots unchanged; valid prefix resumes exact');
},590000);
it('admission149: ownership, learned S0, foreign proposition/observer, malformed and contradictory receipts reject',async()=>{
 const b=await setup(),rows=items(decode(b.b.d.orderedInputs),'list'),sourceRows=rows.filter(v=>key(items(v,'list')[2])===key(witness.SW_SOURCE));
 const edit=(index:number,payload:CanonicalValue)=>enc(list(rows.map(v=>v===sourceRows[index]?list([...items(v,'list').slice(0,3),payload,list([])]):v)));
 for(const payload of[list([]),list([text('foreign'),...items(items(sourceRows[0],'list')[3],'list').slice(1)]),list([b.b.taskA,u(3),u(4),u(1),true,true,true])])await expect(createCharacterRun(b.m,{...b.b.d,orderedInputs:edit(0,payload)})).rejects.toThrow();
 const r=await createCharacterRun(b.m,b.b.d);await through(r,3n);await expect(createCharacterRun(b.m,{...b.b.d,initialState:r.snapshot().state})).rejects.toThrow();
 const o=b.s.observers[0],path=social.personPath(o.holder,o.target),value=state(r).read(path).value!;
 expect(()=>b.stateModel.read(state(r),social.personPath(o.holder,b.s.observers[1].target))).toThrow('foreign path');
 expect(()=>b.stateModel.applyPatch(state(r),{operations:[{kind:'set',path,expected:{presence:true,value},newValue:list([text(social.SOCIAL),list([...social.personHistory(value),...social.personHistory(value)])])}]},sid(1025,'authority/wrong'))).toThrow();
 expect(()=>witness.socialObserverView(out(r),b.s,-1)).toThrow();
 const slots=items(decode(b.b.s.registry),'list'),decl=items(slots[50],'list'),os=items(decl[3],'list');
 await expect(prepareCharacterModel({...b.b.s,registry:enc(list([...slots.slice(0,50),list([...decl.slice(0,3),list([os[0],os[0]])])]))})).rejects.toThrow('observer mapping');
 const changed=[...items(items(sourceRows[2],'list')[3],'list')];changed[2]=u(4);changed[3]=u(2);
 const conflict=await createCharacterRun(b.m,{...b.b.d,orderedInputs:edit(2,list(changed))});await through(conflict,4n);const before=conflict.snapshot();await expect(conflict.settleNextInstant()).rejects.toThrow('receipt changed');expect({...conflict.snapshot(),status:before.status}).toEqual(before);
 console.info('M149 ADMISSION PASS malformed/versioned source/proposition, unknown observer, forbidden own-key access, acquired S0, duplicate identity and contradictory receipt all reject; conflicting instant rolls back');
},590000);
