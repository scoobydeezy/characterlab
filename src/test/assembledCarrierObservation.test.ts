import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {CARRIER_OBSERVATION_VERSION} from '../assembled/recognition';
import * as recognition from '../semanticBinding/recognition';
import {resolutionHistory} from '../assembled/recognitionState';
import {sourceRole} from '../assembled/semanticTruth';
import {SOCIAL_SOURCE} from '../assembled/social';
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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledCarrierObservation';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M142 full queue cap');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function judgment(r:Run,b:ReturnType<typeof fixture>,expected:number,beliefDenominator=2){
 expect(personMean(state(r).read(personPath(C,target)).value)).toEqual({numerator:1n,denominator:BigInt(beliefDenominator)});
 const social=reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
 expect(items(social[4],'list'),'live social factor').toHaveLength(1);
 const joint=reports(r,JOINT_APPRAISAL).at(-1)!;
 for(const task of[b.taskA,b.taskB])expect(items(joint[4],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(task)),'live task appraisal').toHaveLength(5);
 expect(items(social[4],'list')).toEqual([q(expected,1)]);
 const selected=items(reports(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(b.mode==='companion'?0:1);expect(items(social[6],'list')[3]).toEqual(list(selected.map(v=>items(v,'list')[0])));expect(items(joint[6],'list').slice(1)).toContainEqual(list(social));
 const d=outputs(snap(r).outputs,409n).find(v=>key(f(v,2n))===key(signed(22)))!;expect(d,'actual decision22').toBeDefined();
 const result=rec(f(d,4n),419n);expect(uint(f(result,1n)),'live resolved choice').toBe(3n);
 const context=rec(f(d,3n),408n);expect(items(f(context,3n),'list').length,'actual grounds').toBeGreaterThan(0);
 const data=rec(f(result,2n),420n),isB=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')),row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>isB(f(v,1n))),p=uint(f(data,8n))===1n?Q.of(isB(f(data,1n))?1n:0n):row?readQ(f(row,2n)):Q.of(0n);
 const intent=outputs(snap(r).outputs,425n).find(v=>key(f(v,2n))===key(d))!,plan=outputs(snap(r).outputs,431n).find(v=>key(f(v,2n))===key(intent))!,attempt=outputs(snap(r).outputs,432n).find(v=>key(f(v,2n))===key(plan))!;expect(outputs(snap(r).outputs,433n).some(v=>key(f(v,2n))===key(attempt)),'actual execution').toBe(true);
 return p;
}


const traceAt=(r:Run,p:bigint)=>outputs(snap(r).trace,160n).find(v=>{const e=rec(f(v,4n),130n);return key(f(v,6n))===key(text(CARRIER_OBSERVATION_VERSION))&&key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===p;})!;
const projected=(r:Run,p:bigint,t:bigint)=>items(f(traceAt(r,p),13n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t).map(v=>rec(v,t));
function structure(r:Run,mode:string){
 const full=projected(r,124n,227n)[0],focal=f(projected(r,121n,217n)[0],3n);
 const c=items(f(full,6n),'set').map(v=>rec(v,225n)),events=items(f(full,7n),'set');
 expect(new Set(c.map(v=>key(f(v,4n)))).size).toBe(4);expect(c.some(v=>f(v,6n)===false)).toBe(true);expect(events).toHaveLength(6);
 const evaluations=projected(r,127n,234n),resolutions=projected(r,127n,236n),cues=projected(r,126n,232n);
 expect(evaluations).toHaveLength(5);expect(resolutions).toHaveLength(1);expect(cues).toHaveLength(1);
 expect(f(resolutions[0],4n)).toEqual(f(cues[0],4n));
 // Exact carrier, not referent equality or a nearby recognized companion, binds the report.
 expect(key(f(resolutions[0],4n))===key(focal)).toBe(mode!=='companion');
 expect(resolutionHistory(state(r)).filter(x=>x.occurredAt===2n&&x.resolution.kind==='asserted-candidate').length).toBeGreaterThan(0);
 expect(episodes(r).map(v=>v[5])).toEqual((mode==='companion'?[1]:[1,2]).map(signed));
 return full;
}
it('primary142: cue carrier isolates recognition and changes live focal report decision',async()=>{
 const a=await create(),b=await create('companion');for(const x of[a,b]){await through(x.r,2n);structure(x.r,x.b.mode);await through(x.r,22n);}
 expect(judgment(a.r,a.b,0).equals(Q.of(1n,2n))).toBe(true);
 expect(judgment(b.r,b.b,1,1).equals(Q.of(1n))).toBe(true);
 for(const x of[a,b])await finish(x.r);
 console.info('M142 PRIMARY PASS per-carrier features/recognition -> focal-only report -> belief1/2 vs1 -> memory/appraisal/live P1/2 vs1/actual execution/full queues');
},590000);
it('privacy142: denied carrier features and cues plus hidden truth preserve safe prefixes',async()=>{
 const a=await create(),b=await create('denied'),c=await create('hidden');let checked=false;
 for(let n=0;n<96;n++){const more=await advance(a.r);for(const p of[b.r,c.r]){expect(await advance(p)).toBe(more);bytes(snap(a.r).state,snap(p).state);bytes(snap(a.r).outputs,snap(p).outputs);}
 if(snap(a.r).clock===2n){const full=structure(a.r,'focal');expect(structure(b.r,'denied')).toEqual(full);expect(structure(c.r,'hidden')).toEqual(full);checked=true;}
 if(!more)break;expect(n).toBeLessThan(95);
 }expect(checked).toBe(true);console.info('M142 PRIVACY PASS denied per-carrier feature/cue and hidden truth changes preserve all safe prefixes/full queues');
},590000);
it('continuation142: all carrier records survive repeat restore and recognition rollback',async()=>{
 const {b,m,r}=await create(),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);structure(r,'focal');
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=recognition.evaluateContinuantRecognition;let calls=0;
 const spy=vi.spyOn(recognition,'evaluateContinuantRecognition').mockImplementation((...args)=>{const result=original(...args);if(args[1].experience.occurredAt===2n&&++calls===7)throw Error('M142 after frozen carrier evaluations');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M142 after frozen carrier evaluations');expect(calls).toBe(7);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M142 CONTINUATION PASS exact repeat/save2/every later boundary/full queues; second-lane recognition failure rolls all carrier state/allocations back; exact recovery');
},590000);
it('admission142: carrier feature and cue ownership are explicit before execution',async()=>{
 const b=fixture(),m=await compileCharacterModel(b.s),row=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')).find(a=>key(a[2])===key(SOCIAL_SOURCE)&&key(a[0])===key(signed(2)))!,source=items(row[3],'list')[7],c=items(source,'list');
 expect(()=>sourceRole(source,m.recognition!)).not.toThrow();
 const mutate=(fn:(r:CanonicalValue[])=>CanonicalValue[])=>list([c[0],c[1],list(items(c[2],'list').map(v=>list(fn([...items(v,'list')]))))]);
 expect(()=>sourceRole(mutate(r=>r.length===6&&uint(r[3])===1n?[...r.slice(0,3),u(0),...r.slice(4)]:r),m.recognition!)).toThrow('shared carrier');
 expect(()=>sourceRole(mutate(r=>r.length===6&&uint(r[3])===2n?[...r.slice(0,4),u(0),r[5]]:r),m.recognition!)).toThrow('secondary-event');
 expect(()=>sourceRole(source,{...m.recognition!,carrierDetails:false})).toThrow('binding source');
 console.info('M142 ADMISSION PASS distinct carrier/event feature authority and old-version guards');
},590000);
