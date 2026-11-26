import {it,expect} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Evidence hash.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless archive.
import {deflateRawSync} from 'node:zlib';
import {fixture,start,cases,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory,type Case,type CanonicalValue} from './fixtures/assembledHabitControlCurrent';
import {habitPath,rewardPath,habitJournal,rewardValue,cueStrength} from '../assembled/habit';
import {actionRewardSubject} from '../assembled/actionReward';
import {ACTION_BODY} from '../assembled/actionBody';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {readQ} from '../campaign2/cognitiveMath';
type X=Awaited<ReturnType<typeof open>>;type Run=X['r'];
const file='docs/planning/ASSEMBLED_CHARACTER_M289_EVIDENCE.json',hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
const pack=(v:Uint8Array)=>({sha256:hash(v),length:v.length,deflateBase64:deflateRawSync(v).toString('base64')});
function put(k:string,v:unknown){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{candidate:'0.166',plan:'f0ed57a2'};e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}
async function open(name:Case){return start(fixture(name));}
const tag=(v:CanonicalValue,label:string)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(label));
const fraction=(v:CanonicalValue)=>{const a=readQ(v);return a.numerator+'/'+a.denominator;};
const cache=new WeakMap<ReturnType<Run['snapshot']>,{state:ReturnType<typeof restoreAuthoritativeState>;trace:ReturnType<typeof rec>[]}>();
function view(r:Run){const s=r.snapshot();let v=cache.get(s);if(!v){v={state:restoreAuthoritativeState(decode(s.state)),trace:items(decode(s.trace),'list').map(v=>rec(v,160n))};cache.set(s,v);}return v;}
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const projections=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
const rows=(r:Run,n:number)=>view(r).trace.filter(t=>key(f(event(t),2n))===key(signed(n)));
const outputs=(r:Run,n:number)=>rows(r,n).flatMap(projections);
function learned(x:X){return x.b.actions.map(action=>{const subject=actionRewardSubject(C,action),hp=view(x.r).state.read(habitPath(subject)),bp=view(x.r).state.read(rewardPath(subject)),journal=habitJournal(hp.value,1000000n,'informed'),belief=rewardValue(bp.value,1000000n,'informed');return {journal,belief,hp,bp};});}
function brief(x:X){return learned(x).map(v=>({count:v.journal.length,mean:v.belief?.mean===undefined?null:String(v.belief.mean),strength:fraction(q(cueStrength(v.journal,true,1,1000000n,'informed').numerator,cueStrength(v.journal,true,1,1000000n,'informed').denominator)),samples:v.belief?.samples.map(v=>{const a=items(v,'list');return {at:String(uint(a[2])),performed:a[4],amount:String(uint(a[6]))};})??[]}));}
function exact(a:Run,b:Run){expect(a.snapshot().clock).toBe(b.snapshot().clock);for(const field of ['state','outputs','trace']as const)expect(hash(a.snapshot()[field])).toBe(hash(b.snapshot()[field]));expect(hash(a.save())).toBe(hash(b.save()));}
async function through(r:Run,n:number,other?:Run){for(let i=0;r.snapshot().clock<BigInt(n);i++){expect(i).toBeLessThan(128);expect(await r.settleNextInstant()).toBe(true);if(other){expect(await other.settleNextInstant()).toBe(true);exact(r,other);}}expect(r.snapshot().clock).toBe(BigInt(n));}
async function finish(r:Run,other?:Run){for(let i=0;i<128;i++){const more=await r.settleNextInstant();if(other){expect(await other.settleNextInstant()).toBe(more);exact(r,other);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M289 settle cap');}

import {CONTROL_VIEW,CONTROL_OPTIONS,controlGoalPath,maintenancePath} from '../assembled/control';
import {READINESS} from '../assembled/sleepControl';
import {compileReward,rewardSource,rewardSense,REWARD_PAIRED_SENSING} from '../assembled/rewardExperience';
import {informedExpectation,OBSERVED_OBS} from '../assembled/habit';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
function capture(x:X,n:number){
 const os=outputs(x.r,n),cs=os.filter(v=>tag(v,'assembled-action-reward/candidates'));expect(cs,'live candidate stage').toHaveLength(1);
 const c=items(cs[0],'list');expect(readQ(c[2]).numerator,'live task motive').toBeGreaterThan(0n);
 const candidates=items(c[4],'list').map(v=>items(v,'list'));expect(candidates.map(v=>v[4])).toEqual([true,true]);expect(candidates.map(v=>v[6])).toEqual([true,true]);
 expect(fraction(candidates[0][3])).toBe(x.b.other?'0/1':'15/16');
 const candidateTrace=rows(x.r,n).find(t=>projections(t).some(v=>key(v)===key(cs[0])))!;
 const reads=items(f(candidateTrace,11n),'list').map(v=>f(rec(v,147n),2n));
 for(const action of x.b.actions)for(const p of [habitPath(actionRewardSubject(C,action)),rewardPath(actionRewardSubject(C,action))])expect(reads).toContainEqual(statePathValue(p));
 const controls=os.filter(v=>tag(v,CONTROL_OPTIONS));expect(controls,'actual control consumer').toHaveLength(1);
 const control=items(controls[0],'list'),view=items(control[2],'list'),held=x.b.controlled&&n<11;
 expect(view[2],'active control goal').toBe(held);expect(view[3],'maintained goal').toBe(held);expect(view[9],'live inhibition').toBe(held);
 expect(uint(view[8]),'actual spare workspace').toBeGreaterThanOrEqual(1n);
 const readiness=view.find(v=>tag(v,READINESS));expect(readiness,'live physiological readiness').toBeDefined();
 const ready=items(readiness!,'list');expect(ready[1]).toEqual(text('Known'));expect(ready[3]).toBe(true);
 const removed=items(control[3],'list');expect(removed).toHaveLength(held?1:0);
 if(held)expect(f(rec(f(rec(removed[0],397n),1n),395n),2n)).toEqual(x.b.actions[0]);
 const controlTrace=rows(x.r,n).find(t=>projections(t).some(v=>key(v)===key(controls[0])))!;expect(controlTrace).toBeDefined();
 const controlInput=items(f(controlTrace,12n),'list')[0],before=items(f(rec(controlInput,398n),3n),'list');expect(before.some(v=>key(f(rec(f(rec(v,397n),1n),395n),2n))===key(x.b.actions[0]))).toBe(true);
 const workspaceTrace=rows(x.r,n).find(t=>projections(t).some(v=>key(v)===key(control[2])))!;
 const controlReads=items(f(workspaceTrace,11n),'list').map(v=>f(rec(v,147n),2n));
 for(const p of[controlGoalPath(C),maintenancePath(C)])expect(controlReads).toContainEqual(statePathValue(p));
 const ds=os.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n);expect(ds).toHaveLength(1);
 const d=rec(ds[0],409n),status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'chosen native resolution').toBe(3n);
 const chosen=rec(f(status,2n),420n),ctx=rec(f(d,3n),408n);expect(items(f(ctx,3n),'list').length,'live competing reasons').toBeGreaterThan(0);
 const action=(v:CanonicalValue)=>x.b.actions.findIndex(a=>key(a)===key(v)),choice=action(f(rec(f(chosen,1n),395n),2n));
 const probabilities=items(f(chosen,2n),'list').map(v=>({action:action(f(rec(f(rec(v,421n),1n),395n),2n)),value:fraction(f(rec(v,421n),2n))}));
 const pA=probabilities.find(v=>v.action===0)?.value??'0/1',pB=probabilities.find(v=>v.action===1)?.value??'0/1';
 if(held){expect(pA).toBe('0/1');expect(pB).toBe('1/1');expect(choice).toBe(1);}else expect(pA).not.toBe('0/1');
 const effects=os.filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list'));expect(effects).toHaveLength(1);expect(effects[0][3]).toEqual(x.b.actions[choice]);expect(effects[0][5]).toEqual(text('Applied'));
 return {at:n,motive:fraction(c[2]),habit:fraction(candidates[0][3]),held,spare:String(uint(view[8])),removed:removed.length,probabilities,choice,resolution:hash(enc(d))};
}
it('domain289: current sensor and bounded mean cannot separate positive history from positive estimate',()=>{
 const b=fixture('free'),d=compileReward(items(decode(b.s.registry),'list')[57],true,true,true,true,true);
 expect(d.resolution).toBe(10);
 const source=rewardSource(list([text(REWARD_PAIRED_SENSING),true,list([signed(0),signed(-999)]),true,list([b.actions[0]]),list([])]),d);
 expect(rewardSense(1000,d,source,'Consequence')).toBe(0);
 let cases=0,liveHabit=0;const rows=[];
 for(let n=1;n<=16;n++)for(let pos=0;pos<n;pos++){
  const observations=Array.from({length:n},(_,i)=>list([text(OBSERVED_OBS),typedIdentifier(1164,u(i+1)),u(i+1),list([true]),true,i===pos,u(i===pos?10:0)]));
  const belief=rewardValue(informedExpectation(observations,1000000n),1000000n,'informed')!,h=cueStrength(observations,true,1,1000000n,'informed');
  expect(belief.mean).toBeGreaterThanOrEqual(1n);if(h.compare(Q.of(1n,2n))>=0)liveHabit++;
  rows.push({n,positivePosition:pos,mean:String(belief.mean),h:h.numerator+'/'+h.denominator});cases++;
 }
 expect(cases).toBe(136);expect(liveHabit).toBe(16);
 const zeros=Array.from({length:16},(_,i)=>list([text(OBSERVED_OBS),typedIdentifier(1164,u(i+1)),u(i+1),list([true]),true,false,u(0)]));
 expect(cueStrength(zeros,true,1,1000000n,'informed')).toEqual(Q.of(0n));
 put('domain',{resolution:10,minPositive:10,maxSamples:16,tinyGainObserved:0,cases,liveHabit,rows,scope:'current nonnegative observed domain; monotone mean with >=one positive; no general reduction'});
});
it.each(cases)('native289_%s',async(name)=>{
 const x=await open(name);for(const a of learned(x)){expect(a.journal).toHaveLength(0);expect(a.belief).toBeUndefined();}
 await through(x.r,7);const before=learned(x);
 expect(before.map(v=>v.journal.length)).toEqual([4,0]);
 for(let n=4;n<=7;n++){const effects=outputs(x.r,n).filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list'));expect(effects).toHaveLength(1);expect(effects[0][3]).toEqual(x.b.actions[0]);expect(effects[0][5]).toEqual(text('Applied'));}
 expect(brief(x)[0].samples.map(v=>Number(v.amount))).toEqual([1000,1000,1000,1000]);
 await through(x.r,8);expect(learned(x).map(v=>v.journal)).toEqual(before.map(v=>v.journal));
 const acquired=brief(x);expect(acquired.map(v=>v.mean)).toEqual(['800','1000']);expect(acquired[0].strength).toBe('15/16');
 const prefix=x.r.save();let restored:Run|undefined;
 if(name==='controlled'){restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:prefix}));exact(x.r,restored);}
 const probes=[];for(const n of[9,10,11]){await through(x.r,n,restored);probes.push(capture(x,n));expect(brief(x)).toEqual(acquired);}
 await finish(x.r,restored);put(name,{registry:hash(x.b.s.registry),source:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),acquired,probes,prefix8:name==='controlled'?pack(prefix):undefined,restored:name==='controlled',terminal:pack(x.r.save())});console.info('M289 PASS',name,JSON.stringify(probes));
},560000);
it('repeat289: complete controlled run repeats exactly',async()=>{
 const prior=JSON.parse(readFileSync(file,'utf8')).controlled,x=await open('controlled');await through(x.r,8);expect(hash(x.r.save())).toBe(prior.prefix8.sha256);await finish(x.r);expect(hash(x.r.save())).toBe(prior.terminal.sha256);put('repeat',{prefix8:prior.prefix8.sha256,terminal:prior.terminal.sha256,pass:true});
},560000);
