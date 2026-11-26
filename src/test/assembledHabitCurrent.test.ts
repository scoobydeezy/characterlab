import {it,expect} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Evidence hash.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless archive.
import {deflateRawSync} from 'node:zlib';
import {fixture,start,cases,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,cachedMemory,type Case,type CanonicalValue} from './fixtures/assembledHabitCurrent';
import {habitPath,rewardPath,habitJournal,rewardValue,cueStrength} from '../assembled/habit';
import {actionRewardSubject} from '../assembled/actionReward';
import {ACTION_BODY} from '../assembled/actionBody';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {readQ} from '../campaign2/cognitiveMath';
type X=Awaited<ReturnType<typeof open>>;type Run=X['r'];
const file='docs/planning/ASSEMBLED_CHARACTER_M288_EVIDENCE.json',hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
const pack=(v:Uint8Array)=>({sha256:hash(v),length:v.length,deflateBase64:deflateRawSync(v).toString('base64')});
function put(k:string,v:unknown){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{candidate:'0.166',plan:'a575bfcb'};e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}
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
async function finish(r:Run,other?:Run){for(let i=0;i<128;i++){const more=await r.settleNextInstant();if(other){expect(await other.settleNextInstant()).toBe(more);exact(r,other);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M288 settle cap');}
function capture(x:X,n:number){
 const os=outputs(x.r,n),cs=os.filter(v=>tag(v,'assembled-action-reward/candidates'));expect(cs,'live candidate evaluation').toHaveLength(1);
 const c=items(cs[0],'list');expect(readQ(c[2]).numerator,'live task motive').toBeGreaterThan(0n);
 const candidates=items(c[4],'list').map(v=>items(v,'list')),expected=['trained','reversed','other-cue'].includes(x.b.name);
 expect(candidates.map(v=>v[4]),'known available routes').toEqual([true,true]);
 expect(candidates.map(v=>v[6])).toEqual([expected,false]);
 const strength=x.b.name==='trained'?'15/16':x.b.name==='reversed'?'3/16':'0/1';
 expect(fraction(candidates[0][3])).toBe(strength);
 const trace=rows(x.r,n).find(t=>projections(t).some(v=>key(v)===key(cs[0])))!;
 const reads=items(f(trace,11n),'list').map(v=>f(rec(v,147n),2n));
 for(const action of x.b.actions)for(const p of [habitPath(actionRewardSubject(C,action)),rewardPath(actionRewardSubject(C,action))])expect(reads).toContainEqual(statePathValue(p));
 const ds=os.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n);expect(ds).toHaveLength(1);
 const d=rec(ds[0],409n),status=rec(f(d,4n),419n),ctx=rec(f(d,3n),408n),raw=rec(f(ctx,2n),403n),chosen=uint(f(status,1n))===3n?rec(f(status,2n),420n):undefined;
 const action=(v:CanonicalValue)=>x.b.actions.findIndex(a=>key(a)===key(v)),choice=chosen?action(f(rec(f(chosen,1n),395n),2n)):-1;
 const effects=os.filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list'));
 expect(choice).toBe(expected?0:-1);expect(effects.length).toBe(expected?1:0);
 if(expected){expect(effects[0][3]).toEqual(x.b.actions[0]);expect(effects[0][5]).toEqual(text('Applied'));expect(items(f(ctx,3n),'list').length).toBeGreaterThan(0);}
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n)).filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(x.b.task)&&uint(f(k,3n))===1n;});
 expect(signals.map(v=>fraction(f(v,2n)))).toEqual(expected?[x.b.name==='reversed'?'2/5':'4/5']:[]);
 return {at:n,motive:fraction(c[2]),strength:fraction(candidates[0][3]),admitted:candidates.map(v=>v[6]),choice,signals:signals.map(v=>fraction(f(v,2n))),probabilities:chosen?items(f(chosen,2n),'list').map(v=>({action:action(f(rec(f(rec(v,421n),1n),395n),2n)),value:fraction(f(rec(v,421n),2n))})):[],resolution:hash(enc(d))};
}
it.each(cases)('native288_%s',async(name)=>{
 const x=await open(name);expect(x.r.snapshot().clock).toBe(0n);
 for(const a of learned(x)){expect(a.journal).toHaveLength(0);expect(a.belief).toBeUndefined();}
 await through(x.r,7);const before=learned(x),trained=brief(x),denied=name==='denied-training';
 expect(trained.map(v=>v.count)).toEqual([denied?0:4,0]);
 const amounts=name==='untrained'?[0,0,0,0]:name==='reversed'?[1000,1000,0,0]:[1000,1000,1000,1000];
 expect(trained[0].samples.map(v=>Number(v.amount))).toEqual(denied?[]:amounts);
 for(let n=4;n<=7;n++){const effects=outputs(x.r,n).filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list'));expect(effects).toHaveLength(1);expect(effects[0][3]).toEqual(x.b.actions[0]);expect(effects[0][5]).toEqual(text('Applied'));}
 for(const observation of before[0].journal){const a=items(observation,'list'),at=Number(uint(a[2]));expect(rows(x.r,at).some(t=>projections(t).some(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.some(y=>typeof y!=='boolean'&&y.kind==='list'&&y.items.some(z=>key(z)===key(observation))))),'actual observed receipt before learning').toBe(true);}
 await through(x.r,8);const after=learned(x),acquired=brief(x);
 expect(after.map(v=>v.journal)).toEqual(before.map(v=>v.journal));
 const mean=name==='untrained'||denied?'0':name==='reversed'?'400':'800';
 expect(acquired.map(v=>v.mean)).toEqual([mean,'0']);
 for(const a of acquired)expect(a.samples.at(-1)).toEqual({at:'8',performed:false,amount:'0'});
 const prefix=x.r.save();let restored:Run|undefined;
 if(name==='trained'){restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:prefix}));exact(x.r,restored);}
 const probes=[];for(const n of[9,10,11]){await through(x.r,n,restored);probes.push(capture(x,n));expect(brief(x)).toEqual(acquired);}
 await finish(x.r,restored);put(name,{registry:hash(x.b.s.registry),source:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),receiving:x.b.receiving,trained,acquired,probes,prefix8:name==='trained'?pack(prefix):undefined,restored:name==='trained',terminal:pack(x.r.save())});console.info('M288 PASS',name,JSON.stringify({mean,strength:acquired[0].strength,probes}));
},560000);
it('repeat288: independent trained run matches complete saved evidence',async()=>{
 const prior=JSON.parse(readFileSync(file,'utf8')).trained,x=await open('trained');await through(x.r,8);expect(hash(x.r.save())).toBe(prior.prefix8.sha256);await finish(x.r);expect(hash(x.r.save())).toBe(prior.terminal.sha256);put('repeat',{prefix8:prior.prefix8.sha256,terminal:prior.terminal.sha256,pass:true});
},560000);
