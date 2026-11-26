import {it,expect,afterEach,vi} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless compression.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hash.
import {createHash} from 'node:crypto';
import {fixture,start,through,finish,rec,f,uint,items,key,decode,enc,list,text,u,signed,sid,taskA,taskB,countPath,countStatus,countProgress,countWorld,cachedMemory,restorePreparedCharacterRun,type Run,type CanonicalValue} from './fixtures/assembledTemporalOriginal';
import {temporalCases} from './temporalGoalFixtures';
import type {Frame} from '../campaign3/temporalGoalConflict';
import {restoreAuthoritativeState,AuthoritativeState} from '../substrate/state';
import {HORIZON,HORIZON_EVAL,compileHorizon} from '../assembled/horizon';
import {COUNT} from '../assembled/countedGoal';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {COUNT_SETTLEMENT_RULES,COUNT_SETTLEMENT_REGISTRY,compileCharacterModel} from '../assembled/model';
import {fixture as counted} from './fixtures/assembledCountedGoal';
import {DeterministicScheduler} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
const plan=JSON.parse(readFileSync('docs/planning/TEMPORAL_PLAN_REV1.json','utf8')) as {runs:{law:string;name:string;input:Frame[]}[]},views=JSON.parse(readFileSync('docs/planning/TEMPORAL_VIEWS_REV1.json','utf8'));
const native=plan.runs.filter(v=>v.law==='HorizonRelative'||v.law==='NoTemporalBias'),file='docs/planning/ASSEMBLED_CHARACTER_M278_EVIDENCE.json';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b,{level:9}).toString('base64')});
const saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
function put(k:string,v:unknown){const d=saved();if(d[k])expect(d[k]).toEqual(v);else{d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}}
const unzip=(v:{hash:string;bytes:number;deflate:string})=>{const b=new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));expect(hash(b)).toBe(v.hash);expect(b.length).toBe(v.bytes);return b;};
const records=(vs:readonly CanonicalValue[],type:bigint)=>vs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
const reports=(vs:readonly CanonicalValue[],label:string)=>vs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const fraction=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('rational');return String(v.numerator)+'/'+String(v.denominator);};
function goals(r:Run){const s=restoreAuthoritativeState(decode(r.snapshot().state));return [taskA,taskB].map(t=>{const v=s.read(countStatus(t)).value;return {status:v?['Absent','Open','Fulfilled','DeadlineMissed','Cancelled'][Number(uint(f(rec(v,372n),1n))) ]:'Absent',progress:Number(countProgress(s.read(countPath(t)).value).count),physical:Number(countWorld(s.read(countPath(t,true)).value).count)};});}
const actionIndex=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='typedIdentifier'||typeof v.payload==='boolean'||v.payload.kind!=='text')throw Error('action identity');return v.payload.value.endsWith('one')||v.payload.value.endsWith('/short')?0:1;};
const horizons=(out:readonly CanonicalValue[])=>reports(out,PRIORITY_MOTIVE).flatMap(p=>items(p[2],'list').map(v=>items(v,'list')).map(v=>{expect(v[6],'live horizon report').toBeDefined();return items(v[6],'list');}));
const decision=(v:CanonicalValue)=>{const d=rec(v,409n),c=rec(f(d,3n),408n),status=rec(f(d,4n),419n),kind=Number(uint(f(status,1n))),data=kind===3?rec(f(status,2n),420n):undefined;
 return {kind,nuclei:items(f(c,3n),'list').length,choice:data?actionIndex(f(rec(f(data,1n),395n),2n)):-1,probability:data?items(f(data,2n),'list').map(v=>{const row=rec(v,421n);return {task:actionIndex(f(rec(f(row,1n),395n),2n)),p:fraction(f(row,2n))};}).sort((a,b)=>a.task-b.task):[],bytes:hash(enc(d))};};
let active:Run|undefined;afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active){let capture;try{capture={save:zip(active.save())};}catch{capture={diagnostic:active.diagnostic()?zip(active.diagnostic()!):null};}put('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure')).length,{name:ctx.task.name,...capture});}active=undefined;});
for(const [index,run]of native.entries())it('temporal278 cohort '+Math.floor(index/7)+' '+run.law+'/'+run.name,async()=>{
 expect(run.input).toEqual(temporalCases()[run.name as keyof ReturnType<typeof temporalCases>]);
 const x=await start(fixture(run.input,run.law as 'HorizonRelative'|'NoTemporalBias'));active=x.r;
 const ticks=[];let offset=0,prior=goals(x.r);
 for(let at=1;at<=8;at++){
  await through(x.r,at);const all=items(decode(x.r.snapshot().outputs),'list'),out=all.slice(offset);offset=all.length;
  const after=goals(x.r),ds=records(out,409n).map(decision),hs=horizons(out).map(a=>({task:key(a[2])===key(taskA)?0:key(a[2])===key(taskB)?1:2,base:fraction(a[4]),factor:fraction(a[5]),value:fraction(a[6])})),obs=reports(out,COUNT+'/observation').flatMap(a=>items(a[2],'list').map(v=>{const z=items(v,'list');return {task:key(z[0])===key(taskA)?0:1,success:z[3]===true};}));
  const workspace=records(out,381n).flatMap(v=>items(f(v,4n),'list').map(t=>key(f(rec(t,379n),1n))===key(taskA)?0:key(f(rec(t,379n),1n))===key(taskB)?1:2));
  for(let i=0;i<2;i++){
   expect(after[i].progress-prior[i].progress).toBe(obs.filter(v=>v.task===i&&v.success&&prior[i].status==='Open').length);
   if(prior[i].status==='Fulfilled'||prior[i].status==='Cancelled'||prior[i].status==='DeadlineMissed')expect(after[i]).toEqual(prior[i]);
   if(after[i].status==='Fulfilled')expect(after[i].progress).toBe(i===0?1:3);
   if(at>= (i===0?5:8))expect(ds.some(d=>d.choice===i)).toBe(false);
  }
  const original=views.views.find((v:{law:string;name:string})=>v.law===run.law&&v.name===run.name).snapshot.rows[at-1];
  for(const h of hs.filter(v=>v.task<2)){expect(h.value,'native temporal valuation').toBe(original.values[h.task]);}
  if(at===2&&['main','shortWeak','longWeak','unknownFuture','unavailableFuture','forecastCorrection','missingReceipt','hiddenBlocked','falseReceipt','trueReceipt','blockedLong'].includes(run.name)){expect(ds).toHaveLength(1);expect(ds[0].nuclei).toBe(2);}
  if(at>1){const p=run.input[at-2];for(let i=0;i<2;i++)if(!p.visible||!(i===0?p.accessShort:p.accessLong))expect(workspace).not.toContain(i);}
  ticks.push({at,before:prior,after,workspace,decisions:ds,horizon:hs,receipts:obs,original:{before:original.goalsBefore,after:original.goalsAfter,values:original.values,intent:original.intent,receipt:original.receipt,available:original.available,access:original.access,decision:decision(decode(Uint8Array.from(original.resolution.match(/../g), (s:string)=>parseInt(s,16))))}});prior=after;
 }
 await finish(x.r);const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}));expect(restored.save()).toEqual(x.r.save());expect(await restored.settleNextInstant()).toBe(false);
 put(run.law+'/'+run.name,{input:run.input,source:zip(x.b.d.orderedInputs),registry:zip(x.b.s.registry),initial:hash(x.b.d.initialState),parameters:hash(x.b.s.parameters),ticks,save:zip(x.r.save()),terminalRestore:true});
 console.info('M278',run.law,run.name,JSON.stringify(ticks.map(t=>({at:t.at,choice:t.decisions[0]?.choice??-1,goals:t.after}))));
},590000);
it('temporal278 admission and original source identity',async()=>{
 expect(native).toHaveLength(25);expect(plan.runs).toHaveLength(27);
 expect(compileHorizon(list([text(HORIZON)]))).toBe(1);
 for(const bad of [0,3])expect(()=>compileHorizon(list([text(HORIZON),u(bad)]),true)).toThrow();
 expect(()=>compileHorizon(list([text(HORIZON),u(2)]))).toThrow();
 const b=fixture(temporalCases().main,'HorizonRelative');await expect(compileCharacterModel({...b.s,rulesVersion:COUNT_SETTLEMENT_RULES,registrySchemaVersion:COUNT_SETTLEMENT_REGISTRY})).rejects.toThrow('horizon');
 const c=await compileCharacterModel(b.s);expect(c.horizonLaw).toBe(1);expect((await compileCharacterModel(fixture(temporalCases().main,'NoTemporalBias').s)).horizonLaw).toBe(2);
 put('source-identity',{plan:hash(new Uint8Array(readFileSync('docs/planning/TEMPORAL_PLAN_REV1.json'))),views:hash(new Uint8Array(readFileSync('docs/planning/TEMPORAL_VIEWS_REV1.json'))),initial:zip(b.d.initialState),parameters:zip(b.s.parameters),seed:zip(b.d.runSeed)});
});

it('temporal278 saved-cohortA nonvacuous valuation and meaning',()=>{
 const d=saved(),correspondences=[];
 for(const run of native.slice(0,14)){
  const name=run.law+'/'+run.name,row=d[name];expect(row,name).toBeDefined();
  const save=rec(decode(unzip(row.save)),132n),out=items(f(save,12n),'list'),hs=horizons(out),ds=records(out,409n).map(decision),prior=views.views.find((v:{law:string;name:string})=>v.law===run.law&&v.name===run.name).snapshot.rows;
  let checked=0;for(const h of hs){const task=key(h[2])===key(taskA)?0:key(h[2])===key(taskB)?1:2;if(task===2)continue;expect(fraction(h[6])).toBe(prior[Number(uint(h[1]))-1].values[task]);checked++;}
  for(const tick of row.ticks)for(const task of tick.workspace.filter((n:number)=>n<2))expect(hs.some(h=>Number(uint(h[1]))===tick.at&&key(h[2])===key([taskA,taskB][task]))).toBe(true);
  if(run.name==='main'){expect(checked).toBeGreaterThan(0);expect(ds[0].nuclei).toBe(2);expect(row.ticks.at(-1).after.map((v:{status:string})=>v.status)).toEqual(['Fulfilled','Fulfilled']);}
  correspondences.push({name,checkedValues:checked,ticks:row.ticks.map((t:{at:number;after:unknown},i:number)=>({at:t.at,native:t.after,original:prior[i].goalsAfter,nativeDecision:i>=1&&i<=6?ds[i-1]:null,originalDecision:decision(decode(Uint8Array.from(prior[i].resolution.match(/../g),(s:string)=>parseInt(s,16))))}))});
 }
 const safe=(name:string)=>{const save=rec(decode(unzip(d['HorizonRelative/'+name].save)),132n);return {state:restoreAuthoritativeState(f(save,5n)).entries().filter(e=>e.path.rootStateTypeId!==1611n),outputs:f(save,12n)};};expect(safe('missingReceipt')).toEqual(safe('hiddenBlocked'));
 put('validated-cohortA',{correspondences,fullHiddenObserver:true});
});
