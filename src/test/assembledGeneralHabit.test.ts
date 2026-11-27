import {it,expect} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Evidence hash.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless archive.
import {deflateRawSync} from 'node:zlib';
import {fixture,start,prior,promote,cases,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory,type Case,type CanonicalValue} from './fixtures/assembledGeneralHabit';
import {habitPath,rewardPath,habitJournal,rewardValue,cueStrength} from '../assembled/habit';
import {actionRewardSubject} from '../assembled/actionReward';
import {ACTION_BODY} from '../assembled/actionBody';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {readQ} from '../campaign2/cognitiveMath';
type X=Awaited<ReturnType<typeof open>>;type Run=X['r'];
const file='docs/planning/ASSEMBLED_CHARACTER_M290_EVIDENCE.json',hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
const pack=(v:Uint8Array)=>({sha256:hash(v),length:v.length,deflateBase64:deflateRawSync(v).toString('base64')});
function put(k:string,v:unknown){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{candidate:'0.167',plan:'786a0989'};e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}
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
async function finish(r:Run,other?:Run){for(let i=0;i<128;i++){const more=await r.settleNextInstant();if(other){expect(await other.settleNextInstant()).toBe(more);exact(r,other);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M290 settle cap');}


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
 const motive=rewardMotive(input,x.b.other);console.info('M290 liveness',x.b.name,n,fraction(q(motive.numerator,motive.denominator)),fraction(c[2]));
 expect(motive.numerator,'live other-task motive').toBeGreaterThan(0n);expect(readQ(c[2]).numerator,'reward task quiet').toBe(0n);
 const hasHabit=x.b.name!=='remote'&&x.b.name!=='other-cue',offers=items(items(c[5],'list')[1],'list');
 expect(offers).toHaveLength(hasHabit?1:0);if(hasHabit){const o=items(offers[0],'list');expect(o[0]).toEqual(x.b.actions[0]);expect(o[1]).toEqual(x.b.other);expect(o[3]).toBe(true);}
 const reads=items(f(candidateTrace,11n),'list').map(v=>f(rec(v,147n),2n));
 for(const action of x.b.actions)expect(reads).toContainEqual(statePathValue(habitPath(actionRewardSubject(C,action))));
 const controls=os.filter(v=>tag(v,CONTROL_OPTIONS));expect(controls).toHaveLength(1);
 const control=items(controls[0],'list'),cv=items(control[2],'list'),held=x.b.name==='controlled'&&n<11;
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
function seamControls(x:X){
 const t=rows(x.r,9).find(t=>projections(t).some(v=>tag(v,'assembled-action-reward/candidates')))!;
 const [input,planner,cue]=items(f(t,12n),'list'),slots=items(decode(x.b.s.registry),'list');
 const routes=compileStrategy(slots[12],items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decode(x.b.s.content),8),d=compileReward(slots[57],true,true,true,true,true);
 const read=(p:Parameters<typeof statePathValue>[0])=>{const v=view(x.r).state.read(p);const record=items(f(t,11n),'list').map(v=>rec(v,147n)).find(v=>equal(f(v,2n),statePathValue(p)))!;return {...v,record:{accessorId:f(record,1n),path:p,presence:v.presence,value:v.value,derivedSources:[]} as any};};
 const run=(a=input,p=planner,c=cue,missing=false)=>actionRewardCandidates(C,d,routes,path=>{const v=read(path);return missing&&path.rootStateTypeId===821n?{...v,value:undefined}:v;},a,p,c,{practice:false},9n,1000000n,true);
 const count=(v:ReturnType<typeof run>)=>items(items(items(v.report,'list')[5],'list')[1],'list').length;
 const live=run();expect(count(live)).toBe(1);expect(key(run(live.output).output)).toBe(key(live.output));
 expect(count(run(input,planner,undefined as any,true))).toBe(0);
 const unseen=list(items(cue,'list').map((v,i)=>i===3?list([]):v));expect(count(run(input,planner,unseen))).toBe(0);
 for(const state of ['Unknown','KnownUnavailable']){
  const p=list(items(planner,'list').map((v,i)=>i===3?list(items(v,'list').map(v=>{const a=items(v,'list');return equal(a[0],x.b.other)?list(a.map((v,i)=>i===2?list(items(v,'list').map((v,i)=>i===0?list([text(state),...items(v,'list').slice(1)]):v)):v)):v;})):v));
  expect(count(run(input,p))).toBe(0);
 }
 const motive=rec(f(rec(input,398n),2n),394n),zero=replace(motive,3n,list(items(f(motive,3n),'list').map(v=>equal(f(rec(v,393n),1n),x.b.other)?replace(v,2n,q(0,1)):v)));
 expect(count(run(replace(input,2n,zero)))).toBe(0);
 put('seam',{duplicateIdempotent:true,missingHistory:true,hiddenCue:true,unknownUnavailable:true,zeroMotive:true,capturedInput:pack(enc(input)),capturedPlanner:pack(enc(planner))});
}
it.each(cases)('native290_%s',async(name)=>{
 const x=await open(name);for(const a of learned(x)){expect(a.journal).toHaveLength(0);expect(a.belief).toBeUndefined();}
 await through(x.r,8);const acquired=brief(x);
 expect(acquired.map(v=>v.mean)).toEqual(['200','1000']);expect(acquired.map(v=>v.count)).toEqual([4,0]);
 expect(acquired[0].strength).toBe(name==='remote'?'1/16':'1/2');
 expect(acquired[0].samples.map(v=>v.amount)).toEqual(name==='remote'?['1000','0','0','0','0']:['0','0','0','1000','0']);
 for(const n of[4,5,6,7]){const effects=outputs(x.r,n).filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list'));expect(effects).toHaveLength(1);expect(effects[0][3]).toEqual(x.b.actions[0]);expect(effects[0][5]).toEqual(text('Applied'));}
 const prefix=x.r.save();let restored:Run|undefined;
 if(name==='controlled'){restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:prefix}));exact(x.r,restored);}
 const probes=[];for(const n of[9,10,11]){await through(x.r,n,restored);probes.push(capture(x,n));expect(brief(x)).toEqual(acquired);if(name==='recent'&&n===9)seamControls(x);}
 await finish(x.r,restored);put(name,{registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),source:hash(x.b.d.orderedInputs),acquired,probes,prefix8:pack(prefix),restored:!!restored,terminal:pack(x.r.save())});
 console.info('M290 PASS',name,JSON.stringify(probes));
},560000);
it('repeat290: independent recent run matches complete evidence',async()=>{
 const prior=JSON.parse(readFileSync(file,'utf8')).recent,x=await open('recent');await through(x.r,8);expect(hash(x.r.save())).toBe(prior.prefix8.sha256);await finish(x.r);expect(hash(x.r.save())).toBe(prior.terminal.sha256);put('repeat',{pass:true,prefix8:prior.prefix8.sha256,terminal:prior.terminal.sha256});
},560000);
it('retained290: old control exact and promoted reward-only semantic agreement',async()=>{
 const e=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M289_EVIDENCE.json','utf8')).free;
 const b=prior('free'),old=await start(b);await finish(old.r);expect(hash(old.r.save())).toBe(e.terminal.sha256);
 const fresh=await start(promote(b));await finish(fresh.r);
 const decisions=(r:Run)=>[9,10,11].map(n=>{const os=outputs(r,n),d=rec(os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n)!,409n),chosen=rec(f(rec(f(d,4n),419n),2n),420n);return {at:n,probabilities:items(f(chosen,2n),'list').map(v=>({action:key(f(rec(f(rec(v,421n),1n),395n),2n)),value:fraction(f(rec(v,421n),2n))})),choice:key(f(rec(f(chosen,1n),395n),2n))};});
 const a=decisions(old.r),c=decisions(fresh.r);expect(c.map(v=>v.probabilities)).toEqual(a.map(v=>v.probabilities));
 put('retained',{oldExact:true,oldTerminal:e.terminal.sha256,old:a,current:c,terminal:pack(fresh.r.save())});
},560000);
