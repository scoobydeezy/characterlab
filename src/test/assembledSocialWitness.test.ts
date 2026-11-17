import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
import {sid} from '../assembled/skill';
import {personPath,personMean,personHistory,SOCIAL_PEOPLE} from '../assembled/social';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {compileSocialWitness,SW,SW_PROBE,SW_OBS,SW_UPDATE,socialObserverView} from '../assembled/socialWitness';
import {fixture,promote,prior,rec,f,uint,items,key,decode,list,text,signed,q,outputs,bytes,exact,C,target,type Mode,type CanonicalValue} from './fixtures/assembledSocialWitness';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const cache=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let s=cache.get(r);if(!s){s=r.snapshot();cache.set(r,s);}return s;};
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>items(decode(snap(r).outputs),'list');
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more)return;}throw Error('M149 settle cap');}
const tagged=(r:Run,tag:string)=>out(r).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const prepared=new Map<string,ReturnType<typeof prepareCharacterModel>>();
async function start(mode:Mode='main',privateCommitment=true,reverse=false){const b=fixture(mode,privateCommitment,reverse),slots=items(decode(b.s.registry),'list'),s=compileSocialWitness(slots[50],items(items(slots[18],'list')[2],'list'),[b.taskA]),k=key(decode(b.s.registry));let m=prepared.get(k);if(!m){m=prepareCharacterModel(b.s);prepared.set(k,m);}const r=await createCharacterRun(await m,b.d);return {b,r,s};}
const mean=(x:Awaited<ReturnType<typeof start>>,i:number)=>{const o=x.s.observers[i];return personMean(state(x.r).read(personPath(o.holder,o.target)).value);};
const view=(x:Awaited<ReturnType<typeof start>>,i:number)=>socialObserverView(out(x.r),x.s,i);
it('primary149: real commitment and two independent observers share native state, causal trace and continuing decisions',async()=>{
 const x=await start();
 expect(state(x.r).read({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:x.b.taskA}]}).presence).toBe(true);
 for(const [at,n,d]of [[2n,0n,1n],[3n,1n,2n],[5n,2n,3n]] as const){await through(x.r,at);expect(mean(x,0)).toEqual(Q.of(n,d));expect(mean(x,1)).toEqual(Q.of(0n));}
 await through(x.r,6n);
 const truth=tagged(x.r,SW+'/truth');expect(truth.every(t=>t[3]===true),'actual commitment remains Open throughout correction horizon').toBe(true);expect(truth.every(t=>t[4]===true)).toBe(true);
 const probe=tagged(x.r,SW_PROBE);for(const [at,expected]of [[2,undefined],[3,Q.of(0n)],[5,Q.of(1n,2n)],[6,Q.of(2n,3n)]] as const){
  const row=probe.find(p=>key(p[1])===key(signed(at))&&key(p[2])===key(x.s.observers[0].holder))!;
  expect(row[3]).toEqual(expected?q(expected.numerator,expected.denominator):list([]));
 }
 const tr=outputs(snap(x.r).trace,160n).filter(t=>key(f(t,6n))===key(text(SW)));expect(tr).toHaveLength(24);
 for(const t of tr){const e=rec(f(t,4n),130n),phase=uint(f(e,3n)),reads=items(f(t,11n),'list');
  if(phase===110n){expect(reads).toHaveLength(1);expect(key(f(rec(reads[0],147n),2n))).toBe(key(statePathValue({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:x.b.taskA}]})));}
  else for(const read of reads){const path=rec(f(rec(read,147n),2n),140n);expect(uint(f(path,1n))).toBe(810n);}
  if(phase!==140n)expect(items(f(t,17n),'list')).toHaveLength(0);
  if(phase!==30n){const parents=items(f(e,8n),'list');expect(parents).toHaveLength(1);expect(tr.some(p=>key(f(rec(f(p,4n),130n),1n))===key(parents[0]))).toBe(true);}
 }
 for(let i=0;i<2;i++){const o=x.s.observers[i],h=personHistory(state(x.r).read(personPath(o.holder,o.target)).value);expect(h).toHaveLength(i?1:3);expect(h.every(v=>key(items(v,'list')[1])===key(o.holder)&&key(items(v,'list')[2])===key(o.target))).toBe(true);}
 expect(()=>socialObserverView(out(x.r),x.s,2)).toThrow('view selector');
 expect(outputs(snap(x.r).outputs,433n).length).toBeGreaterThan(0);
 console.info('M149 PRIMARY PASS real Open373; misleading0, independent corrections1/2,2/3; other observer0; prior-time probes; shared810; native action present;24 witness trace stages');
},590000);
it('privacy149: hidden commitment, access and explanations preserve entire nonrecipient views through full continuation',async()=>{
 const a=await start(),hidden=await start('main',false),denied=await start('denied'),falseReport=await start('false');
 for(const x of[a,hidden,denied,falseReport])await through(x.r,6n);
 expect(tagged(hidden.r,SW+'/truth')[0][3]).toBe(false);expect(mean(hidden,0)).toEqual(Q.of(2n,3n));
 for(let i=0;i<2;i++)expect(view(hidden,i)).toEqual(view(a,i));
 for(const x of[denied,falseReport]){expect(view(x,1)).toEqual(view(a,1));expect(mean(x,0)).toEqual(Q.of(0n));expect(view(x,0)).not.toEqual(view(a,0));}
 for(const x of[a,hidden,denied,falseReport])await finish(x.r);
 for(let i=0;i<2;i++)expect(view(hidden,i)).toEqual(view(a,i));for(const x of[denied,falseReport])expect(view(x,1)).toEqual(view(a,1));
 console.info('M149 PRIVACY PASS opposite real commitment; denied/false explanations; complete own views equal through101 despite divergent actor cognition; no dice in recipient path');
},590000);
it('correlation149: repeated/missing/silent/swapped/both and reverse processing retain source and ownership semantics',async()=>{
 for(const [mode,a,b]of [['duplicate',Q.of(1n,2n),Q.of(0n)],['missing',undefined,undefined],['silent',undefined,undefined],['swapped',Q.of(0n),Q.of(2n,3n)],['both',Q.of(2n,3n),Q.of(2n,3n)]] as const){const x=await start(mode);await through(x.r,6n);expect(mean(x,0)).toEqual(a);expect(mean(x,1)).toEqual(b);}
 const a=await start(),b=await start('main',true,true);for(const x of[a,b])await through(x.r,6n);
 for(let i=0;i<2;i++)expect(view(b,i)).toEqual(view(a,i));bytes(snap(a.r).state,snap(b.r).state);
 console.info('M149 CORRELATION PASS duplicate1/2, receipt0 and silence unknown, swapped/both access, reversed update order with exact views/state');
},590000);
it('persistence149: exact repeat and two observer checkpoints survive every later boundary',async()=>{
 const x=await start(),b=x.b,m=await prepareCharacterModel(b.s),repeat=await createCharacterRun(m,b.d);for(const r of[x.r,repeat])await through(r,3n);exact(x.r,repeat);
 const early=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:x.r.save()});exact(x.r,early);
 for(const at of[4n,5n]){for(const r of[x.r,repeat,early])await through(r,at);exact(x.r,repeat);exact(x.r,early);}
 const late=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:x.r.save()});exact(x.r,late);await finish(x.r,[repeat,early,late]);
 console.info('M149 PERSISTENCE PASS complete snapshots/save exact at3/5 and every later instant through101');
},590000);
it('consumer149: rich perception and live native social appraisal still change exact production decision probability on0.111',async()=>{
 const bs=[promote(prior()),promote(prior('denied'))],m=await prepareCharacterModel(bs[0].s),ps:Q[]=[];
 for(const [i,b]of bs.entries()){
  const r=await createCharacterRun(m,b.d);await through(r,4n);const expected=i?Q.of(0n):Q.of(2n,3n);expect(personMean(state(r).read(personPath(C,target)).value)).toEqual(expected);
  const social=tagged(r,SOCIAL_PEOPLE+'/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
  expect(items(social[4],'list'),'live person appraisal').toEqual([q(expected.numerator,expected.denominator)]);
  const joint=tagged(r,JOINT_APPRAISAL).at(-1)!;for(const task of[b.taskA,b.taskB])expect(items(joint[4],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(task))).toHaveLength(5);
  const d=outputs(snap(r).outputs,409n).find(v=>key(f(v,2n))===key(signed(4)))!,result=rec(f(d,4n),419n);expect(uint(f(result,1n))).toBe(3n);
  const data=rec(f(result,2n),420n),isB=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')),row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>isB(f(v,1n)));ps.push(uint(f(data,8n))===1n?Q.of(isB(f(data,1n))?1n:0n):row?readQ(f(row,2n)):Q.of(0n));
  const intent=outputs(snap(r).outputs,425n).find(v=>key(f(v,2n))===key(d))!,plan=outputs(snap(r).outputs,431n).find(v=>key(f(v,2n))===key(intent))!,attempt=outputs(snap(r).outputs,432n).find(v=>key(f(v,2n))===key(plan))!;
  expect(outputs(snap(r).outputs,433n).some(v=>key(f(v,2n))===key(attempt))).toBe(true);
 }
 expect(ps).toEqual([Q.of(47n,72n),Q.of(1n,2n)]);console.info('M149 CONSUMER PASS same0.111 reference law; recognized evidence -> live appraisal -> exact P(B)47/72 vs1/2 ->intent/attempt/outcome');
},590000);
