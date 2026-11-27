import {it,expect} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Evidence hash.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless archive.
import {deflateRawSync} from 'node:zlib';
import {fixture,start,cases,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory,type Case,type CanonicalValue} from './fixtures/assembledHabitRelearning';
import {habitPath,rewardPath,habitJournal,rewardValue,cueStrength} from '../assembled/habit';
import {actionRewardSubject} from '../assembled/actionReward';
import {ACTION_BODY} from '../assembled/actionBody';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {readQ} from '../campaign2/cognitiveMath';
type X=Awaited<ReturnType<typeof open>>;type Run=X['r'];
const file='docs/planning/ASSEMBLED_CHARACTER_M291_EVIDENCE.json',hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
const pack=(v:Uint8Array)=>({sha256:hash(v),length:v.length,deflateBase64:deflateRawSync(v).toString('base64')});
function put(k:string,v:unknown){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{candidate:'0.167',plan:'dcb186ce'};e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}
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
async function finish(r:Run,other?:Run){for(let i=0;i<128;i++){const more=await r.settleNextInstant();if(other){expect(await other.settleNextInstant()).toBe(more);exact(r,other);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M291 settle cap');}


import {CONTROL_OPTIONS} from '../assembled/control';
import {READINESS} from '../assembled/sleepControl';
import {STRATEGY_EVAL,compileStrategy} from '../assembled/strategy';
import {compileReward} from '../assembled/rewardExperience';
import {actionRewardCandidates,rewardMotive} from '../assembled/actionReward';
import {replace} from './fixtures/assembledCharacter';
const equal=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
function capture(x:X,n:number){
 const os=outputs(x.r,n),cs=os.filter(v=>tag(v,'assembled-action-reward/candidates'));expect(cs).toHaveLength(1);
 const c=items(cs[0],'list'),planner=os.find(v=>tag(v,STRATEGY_EVAL))!,pr=items(items(planner,'list')[3],'list').map(v=>items(v,'list')).find(v=>equal(v[0],x.b.other));
 expect(pr,'live other-task planner').toBeDefined();expect(uint(pr![1]),'retained B plan').toBe(1n);
 expect(items(pr![2],'list').map(v=>key(items(v,'list')[0]))).toEqual([key(text('KnownAvailable')),key(text('KnownAvailable'))]);
 const candidateTrace=rows(x.r,n).find(t=>projections(t).some(v=>equal(v,cs[0])))!,operands=items(f(candidateTrace,12n),'list'),input=operands[0];
 const motive=rewardMotive(input,x.b.other);console.info('M291 liveness',x.b.name,n,fraction(q(motive.numerator,motive.denominator)),fraction(c[2]));
 expect(motive.numerator,'live other-task motive').toBeGreaterThan(0n);expect(readQ(c[2]).numerator,'reward task quiet').toBe(0n);
 const hasHabit=x.b.name!=='untrained'&&x.b.name!=='reversed',offers=items(items(c[5],'list')[1],'list');
 expect(offers).toHaveLength(hasHabit?1:0);if(hasHabit){const o=items(offers[0],'list');expect(o[0]).toEqual(x.b.actions[0]);expect(o[1]).toEqual(x.b.other);expect(o[3]).toBe(true);}
 const reads=items(f(candidateTrace,11n),'list').map(v=>f(rec(v,147n),2n));
 for(const action of x.b.actions)expect(reads).toContainEqual(statePathValue(habitPath(actionRewardSubject(C,action))));
 const controls=os.filter(v=>tag(v,CONTROL_OPTIONS));expect(controls).toHaveLength(1);
 const control=items(controls[0],'list'),cv=items(control[2],'list'),held=false;
 expect(cv[9]).toBe(held);expect(items(control[3],'list')).toHaveLength(held?1:0);
 const ready=items(cv.find(v=>tag(v,READINESS))!,'list');expect(ready[1]).toEqual(text('Known'));expect(ready[3]).toBe(true);
 const ds=os.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n);expect(ds).toHaveLength(1);
 const d=rec(ds[0],409n),status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'actual chosen decision').toBe(3n);
 const chosen=rec(f(status,2n),420n),ctx=rec(f(d,3n),408n),raw=rec(f(ctx,2n),403n);
 expect(items(f(ctx,3n),'list').length,'live reasons').toBeGreaterThan(0);
 const action=(v:CanonicalValue)=>x.b.actions.findIndex(a=>equal(a,v)),choice=action(f(rec(f(chosen,1n),395n),2n));
 const probabilities=items(f(chosen,2n),'list').map(v=>({action:action(f(rec(f(rec(v,421n),1n),395n),2n)),value:fraction(f(rec(v,421n),2n))}));
 const pA=probabilities.find(v=>v.action===0)?.value??'0/1';
 expect(pA==='0/1').toBe(!hasHabit||held);
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n)).filter(v=>{const k=rec(f(v,1n),401n);return equal(f(k,2n),x.b.other)&&uint(f(k,3n))===1n;});
 expect(signals.length).toBe(hasHabit&&!held?2:1);
 const effects=os.filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list'));expect(effects).toHaveLength(1);expect(effects[0][3]).toEqual(x.b.actions[choice]);expect(effects[0][5]).toEqual(text('Applied'));
 return {at:n,motive:motive.numerator+'/'+motive.denominator,offers:offers.length,held,probabilities,choice,signals:signals.map(v=>fraction(f(v,2n))),resolution:hash(enc(d))};
}

import {HABIT_LEARN,HABIT_OWNER,REWARD_OWNER,INFORMED_REWARD} from '../assembled/habit';
function learning(x:X,n:number){
 const all=rows(x.r,n),traces=all.filter(t=>equal(f(event(t),5n),HABIT_LEARN)&&uint(f(event(t),3n))===140n);
 const observations=learned(x).flatMap(v=>v.belief?.samples.filter(o=>uint(items(o,'list')[2])===BigInt(n))??[]);
 const admitted=all.filter(t=>uint(f(event(t),3n))===124n).flatMap(projections).filter(v=>tag(v,INFORMED_REWARD)).flatMap(v=>items(items(v,'list')[3],'list'));
 expect(admitted).toEqual(observations);
 for(const observation of observations)expect(traces.some(t=>items(f(t,12n),'list').some(o=>equal(o,observation))),'authenticated learning operand').toBe(true);
 const diffs=traces.flatMap(t=>items(f(t,17n),'list').map(v=>rec(v,148n)));
 let habits=0,beliefs=0;
 for(const d of diffs){
  const p=f(d,1n),h=x.b.actions.some(a=>equal(p,statePathValue(habitPath(actionRewardSubject(C,a))))),b=x.b.actions.some(a=>equal(p,statePathValue(rewardPath(actionRewardSubject(C,a)))));
  expect(h||b).toBe(true);expect(f(d,6n)).toEqual(h?HABIT_OWNER:REWARD_OWNER);if(h)habits++;else beliefs++;
 }
 const hidden=n===7&&x.b.name!=='reversed'||n===8&&x.b.denied;
 expect(observations.length).toBe(hidden?0:n===8?2:1);
 expect(habits).toBe(hidden||n===8?0:1);expect(beliefs).toBe(observations.length);
 return {at:n,admitted:observations.map(v=>({hash:hash(enc(v)),performed:items(v,'list')[4],amount:String(uint(items(v,'list')[6]))})),habitWrites:habits,beliefWrites:beliefs,trace:traces.map(t=>hash(enc(t))),state:brief(x)};
}
it.each(cases)('native291_%s',async(name)=>{
 const x=await open(name);for(const a of learned(x)){expect(a.journal).toHaveLength(0);expect(a.belief).toBeUndefined();}
 const stages=[];
 for(const n of[4,5,6,7,8]){
  const before=learned(x);await through(x.r,n);const stage=learning(x,n);stages.push(stage);
  const h=name==='untrained'?'0/1':n===4?'1/2':n===5?'3/4':name==='reversed'&&n>=7?'7/16':'7/8';
  expect(stage.state[0].strength).toBe(h);
  if(n===7&&name!=='reversed'||n===8)expect(learned(x).map(v=>v.journal)).toEqual(before.map(v=>v.journal));
  if(n<8){const effects=outputs(x.r,n).filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list'));expect(effects).toHaveLength(1);expect(effects[0][3]).toEqual(x.b.actions[0]);expect(effects[0][5]).toEqual(text('Applied'));}
 }
 const acquired=brief(x),mean=x.b.denied?'1000':name==='untrained'?'0':name==='reversed'?'600':'750';
 expect(acquired.map(v=>v.mean)).toEqual([mean,x.b.denied?null:'1000']);
 expect(acquired.map(v=>v.count)).toEqual([name==='reversed'?4:3,0]);
 const journal=learned(x)[0].journal,alternatives=[1,2,3].map(law=>{const h=cueStrength(journal,true,law,1000000n,'informed');return h.numerator+'/'+h.denominator;});
 expect(alternatives).toEqual(name==='untrained'?['0/1','0/1','0/1']:name==='reversed'?['7/16','1/2','0/1']:['7/8','3/4','0/1']);
 const prefix=x.r.save();let restored:Run|undefined;
 if(name==='reversed'){restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:prefix}));exact(x.r,restored);}
 const probes=[];for(const n of[9,10,11]){await through(x.r,n,restored);const p=capture(x,n);expect(p.probabilities.find(v=>v.action===0)?.value??'0/1').toBe(name==='untrained'||name==='reversed'?'0/1':'1/2');probes.push(p);expect(brief(x)).toEqual(acquired);}
 await finish(x.r,restored);put(name,{registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),source:hash(x.b.d.orderedInputs),stages,acquired,alternatives,probes,prefix8:name==='reversed'?pack(prefix):undefined,restored:!!restored,terminal:pack(x.r.save())});
 if(name==='absent-correction'){const e=JSON.parse(readFileSync(file,'utf8'));expect(e['denied-correction'].acquired).toEqual(acquired);expect(e['denied-correction'].probes.map((v:{resolution:string})=>v.resolution)).toEqual(probes.map(v=>v.resolution));put('privacy',{acquiredEqual:true,resolutionsEqual:true});}
 console.info('M291 PASS',name,JSON.stringify({mean,alternatives,probes}));
},560000);
it('repeat291: independent reversed run matches complete evidence',async()=>{
 const prior=JSON.parse(readFileSync(file,'utf8')).reversed,x=await open('reversed');await through(x.r,8);expect(hash(x.r.save())).toBe(prior.prefix8.sha256);await finish(x.r);expect(hash(x.r.save())).toBe(prior.terminal.sha256);put('repeat',{pass:true,prefix8:prior.prefix8.sha256,terminal:prior.terminal.sha256});
},560000);
