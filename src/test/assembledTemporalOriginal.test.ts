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
const native=plan.runs.filter(v=>v.law==='HorizonRelative'||v.law==='NoTemporalBias'),file='docs/planning/ASSEMBLED_CHARACTER_M279_EVIDENCE.json';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b,{level:9}).toString('base64')});
const current=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
const saved=()=>({...JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M278_EVIDENCE.json','utf8')),...current()});
function put(k:string,v:unknown){const d=current();if(d[k])expect(d[k]).toEqual(v);else{d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}}
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

const fromHex=(s:string)=>decode(Uint8Array.from(s.match(/../g)!,x=>parseInt(x,16)));
function nucleusDetails(v:CanonicalValue){return items(f(rec(f(rec(v,409n),3n),408n),3n),'list').map(v=>{const n=rec(v,407n),k=rec(f(n,1n),404n),roles=rec(f(n,2n),406n),signedNumber=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('signed');return String(v.value);};return {task:actionIndex(f(rec(f(k,1n),395n),2n)),base:fraction(f(roles,1n)),standing:fraction(f(roles,2n)),situation:fraction(f(roles,3n)),relevance:fraction(f(n,3n)),die:Number(uint(f(n,4n))),standingModifier:signedNumber(f(n,5n)),situationModifier:signedNumber(f(n,6n))};}).sort((a,b)=>a.task-b.task);}
it('temporal279 complete correspondence and controls',()=>{
 const d=saved();const mapped:{name:string;ticks:{at:number;after:{status:string;progress:number}[];native:{nuclei:number;choice:number;probability:{task:number;p:string}[]};valuations:{task:number;value:string;factor:string}[]}[]}=[];
 for(const run of native){
  const name=run.law+'/'+run.name,row=d[name];expect(row,name).toBeDefined();const save=rec(decode(unzip(row.save)),132n),out=items(f(save,12n),'list'),hs=horizons(out),actual=records(out,409n),prior=views.views.find((v:{law:string;name:string})=>v.law===run.law&&v.name===run.name).snapshot.rows;
  const ticks=row.ticks.map((t:{at:number;before:{status:string;progress:number}[];after:{status:string;progress:number}[];workspace:number[];receipts:unknown[]},i:number)=>{
   const old=prior[i],v=i>=1&&i<=6?actual[i-1]:undefined,now=v?decision(v):{kind:1,nuclei:0,choice:-1,probability:[]},oldValue=fromHex(old.resolution),before=t.before.map(g=>({status:g.status,progress:g.progress})),after=t.after.map(g=>({status:g.status,progress:g.progress}));
   if(v)expect(hash(enc(v))).toBe(row.ticks[i].decisions[0].bytes);
   const valuations=hs.filter(h=>Number(uint(h[1]))===t.at&&[taskA,taskB].some(task=>key(task)===key(h[2]))).map(h=>{const task=key(h[2])===key(taskA)?0:1;expect(fraction(h[6])).toBe(old.values[task]);return {task,value:fraction(h[6]),factor:fraction(h[5])};});
   for(const task of t.workspace.filter(n=>n<2))expect(valuations.some(h=>h.task===task)).toBe(true);
   if(i>0){const source=run.input[i-1];for(let task=0;task<2;task++)if(!source.visible||!(task===0?source.availableShort:source.availableLong)||!(task===0?source.accessShort:source.accessLong))expect(now.choice).not.toBe(task);}
   return {at:t.at,before,after,originalBefore:old.goalsBefore,originalAfter:old.goalsAfter,native:now,original:{...decision(oldValue),choice:old.intent},nativeNuclei:v?nucleusDetails(v):[],originalNuclei:nucleusDetails(oldValue),valuations};
  });mapped.push({name,ticks});
 }
 const get=(name:string)=>mapped.find(x=>x.name===name)!;
 const first=(name:string)=>get(name).ticks[1].native;
 expect(first('HorizonRelative/main').nuclei).toBe(2);expect(first('NoTemporalBias/main').nuclei).toBe(2);
 expect(first('HorizonRelative/main').probability).not.toEqual(first('NoTemporalBias/main').probability);
 for(const weak of ['shortWeak','longWeak'])expect(first('NoTemporalBias/'+weak).probability).not.toEqual(first('NoTemporalBias/main').probability);
 const safe=(name:string)=>{const s=rec(decode(unzip(d['HorizonRelative/'+name].save)),132n);return {state:restoreAuthoritativeState(f(s,5n)).entries().filter(e=>e.path.rootStateTypeId!==1611n),outputs:f(s,12n)};};
 for(const [a,b]of [['missingReceipt','hiddenBlocked'],['falseReceipt','trueReceipt'],['deniedAdoption','hiddenAdoption']])expect(safe(a)).toEqual(safe(b));
 const corrected=get('HorizonRelative/forecastCorrection').ticks;expect(corrected[1].valuations.find(v=>v.task===1)?.factor).toBe('1/4');expect(corrected[2].valuations.find(v=>v.task===1)?.factor).toBe('1/1');
 const main=get('HorizonRelative/main');expect(main.ticks[1].after[1].status).toBe('Open');expect(main.ticks[2].native.choice).toBe(1);expect(main.ticks[4].after[1].status).toBe('Fulfilled');
 const diagnostics=plan.runs.filter(v=>v.law==='DropLoser'||v.law==='SharedRetirement').map(v=>{const old=views.views.find((x:{law:string;name:string})=>x.law===v.law&&x.name===v.name).snapshot;expect(old.goals[1].status).toBe('Cancelled');return {law:v.law,input:v.input,oldFinal:old.goals,oldRows:old.rows.map((r:{at:number;intent:number;retiredByControl:number[]})=>({at:r.at,intent:r.intent,retiredByControl:r.retiredByControl})),nativeReference:'HorizonRelative/main',disposition:'Preserved invalid lifecycle-collapse diagnostic; shared reference retains losing goal and completes it.'};});
 expect(diagnostics).toHaveLength(2);put('correspondence',{mapped,diagnostics,wholeObserverPairs:3,originalRows:200});
},590000);
it('temporal279 main repeat continuation and rollback',async()=>{
 const x=await start(fixture(temporalCases().main,'HorizonRelative'));active=x.r;await through(x.r,1);const checkpoint=x.r.save(),repeat=await start(x.b);await through(repeat.r,1);expect(repeat.r.save()).toEqual(checkpoint);const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:checkpoint})),continuations=[];
 for(let i=0;i<128;i++){const a=await repeat.r.settleNextInstant(),b=await restored.settleNextInstant();expect(b).toBe(a);expect(restored.save()).toEqual(repeat.r.save());continuations.push(hash(repeat.r.save()));if(!a)break;if(i===127)throw Error('continuation cap');}expect(repeat.r.save()).toEqual(unzip(saved()['HorizonRelative/main'].save));
 const faults=[];for(const commit of [false,true]){const r=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:checkpoint}));let reached=false;
 const regular=DeterministicScheduler.prototype.settleNextInstant,spy=vi.spyOn(DeterministicScheduler.prototype,'settleNextInstant').mockImplementation(async function(this:DeterministicScheduler<unknown>){const before=this.exportQuiescentSnapshot();if(before.queue[0]?.dueAt!==2n)return regular.call(this);try{return await this.settleNextInstantForConformance({onBoundary(boundary,event){if(commit?boundary==='before-commit':boundary==='after-trace-validation'&&!!event&&key(event.eventTypeId)===key(sid(1001,'event/task-motive'))){reached=true;throw Error('M279 injected fault');}}});}finally{const after=this.exportQuiescentSnapshot();expect(enc((after.state as AuthoritativeState).canonicalValue())).toEqual(enc((before.state as AuthoritativeState).canonicalValue()));expect(after.allocators).toEqual(before.allocators);expect(after.queue.map(scheduledEventValue)).toEqual(before.queue.map(scheduledEventValue));expect(after.outputs).toEqual(before.outputs);expect(after.committedTrace).toEqual(before.committedTrace);expect(after.clock).toBe(before.clock);expect(after.status).toBe('Failed');}});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M279 injected fault');expect(reached).toBe(true);faults.push({commit,reached,diagnostic:hash(r.diagnostic()!)});}finally{spy.mockRestore();}}
 put('main-continuation',{checkpoint:zip(checkpoint),continuations,faults,terminal:hash(repeat.r.save())});
},590000);
it('temporal279 correction continuation and old policy carry',async()=>{
 const x=await start(fixture(temporalCases().forecastCorrection,'HorizonRelative'));active=x.r;await through(x.r,1);const checkpoint=x.r.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:checkpoint})),continuations=[];
 for(let i=0;i<128;i++){const a=await x.r.settleNextInstant(),b=await restored.settleNextInstant();expect(b).toBe(a);expect(restored.save()).toEqual(x.r.save());continuations.push(hash(x.r.save()));if(!a)break;if(i===127)throw Error('continuation cap');}expect(x.r.save()).toEqual(unzip(saved()['HorizonRelative/forecastCorrection'].save));
 const b=counted(),old=await start({s:{...b.s,rulesVersion:COUNT_SETTLEMENT_RULES,registrySchemaVersion:COUNT_SETTLEMENT_REGISTRY},d:b.d});await finish(old.r);const oldEvidence=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M277_EVIDENCE.json','utf8'));expect(old.r.save()).toEqual(unzip(oldEvidence.continuation.carry));
 const now=await start({s:{...b.s,rulesVersion:x.b.s.rulesVersion,registrySchemaVersion:x.b.s.registrySchemaVersion},d:b.d});await finish(now.r);expect(now.r.snapshot().state).toEqual(old.r.snapshot().state);expect(now.r.snapshot().outputs).toEqual(old.r.snapshot().outputs);
 put('correction-carry',{checkpoint:zip(checkpoint),continuations,terminal:hash(x.r.save()),oldExactSave:hash(old.r.save()),currentCarry:zip(now.r.save())});
},590000);

it('temporal279 classified findings from captured dice',()=>{
 const all=saved().correspondence.mapped,findings=[];let checked=0;
 const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a,rat=(n:number,d:number)=>{const g=gcd(n,d);return (n/g)+'/'+(d/g);};
 for(const run of all){let priorDivergence=false;for(const t of run.ticks){
  const n=t.nativeNuclei as {task:number;base:string;standing:string;situation:string;die:number;standingModifier:string;situationModifier:string}[];
  for(const x of n){expect(x.standingModifier).toBe('0');expect(x.situationModifier).toBe('0');const old=t.originalNuclei.find((o:{task:number})=>o.task===x.task);if(old){expect(x.base).toBe(old.base);expect(x.standing).toBe(old.standing);expect(x.situation).toBe(old.situation);}}
  const probabilities=n.map((x,i)=>{if(n.length===1)return {task:x.task,p:'1/1'};expect(n).toHaveLength(2);const other=n[1-i];let wins=0;for(let a=1;a<=x.die;a++)for(let b=1;b<=other.die;b++)wins+=a>b?2:a===b?1:0;return {task:x.task,p:rat(wins,2*x.die*other.die)};});expect(t.native.probability).toEqual(probabilities);checked++;
  const sameBefore=JSON.stringify(t.before)===JSON.stringify(t.originalBefore),sameProbability=JSON.stringify(t.native.probability)===JSON.stringify(t.original.probability),sameChoice=t.native.choice===t.original.choice,sameAfter=JSON.stringify(t.after)===JSON.stringify(t.originalAfter);
  if(!sameProbability||!sameChoice||!sameAfter){
   if(sameBefore&&!sameProbability){expect(run.name).toBe('HorizonRelative/longWeak');expect(t.at).toBe(2);expect(n.map(x=>[x.base,x.die])).toEqual([['1/2',6],['1/17',4]]);expect(t.originalNuclei.map((x:{base:string;die:number})=>[x.base,x.die])).toEqual([['1/2',12],['1/17',4]]);findings.push({name:run.name,at:t.at,classification:'Interaction',cause:'Adopted global calibration: identical bounded bases1/2 and1/17; d6/d4 versus historical d12/d4. Short probability2/3 versus5/6. No changed appraisal, role or goal law.'});}
   else if(sameBefore){expect(sameProbability).toBe(true);expect(sameChoice).toBe(false);findings.push({name:run.name,at:t.at,classification:'Equivalent',cause:'No cross-model coupling claimed. Actual draw selects another admitted positive ground.'});priorDivergence=true;}
   else {expect(priorDivergence).toBe(true);findings.push({name:run.name,at:t.at,classification:'Interaction',cause:'Earlier differently sampled choice -> own received work -> own goal state -> next eligible grounds. Actual captured counts/statuses prove the chain; no goal is retired by losing.'});}
  }
 }
 }
 expect(checked).toBe(200);expect(findings.filter(x=>x.cause.startsWith('Adopted'))).toHaveLength(1);
 put('classified-findings',{checkedConditionalDistributions:checked,findings,remaining:'none',referencePhenomena:'Main completes both independently; access/availability/adoption/retirement/receipt and meaningful strength/forecast effects pass. No per-member tuning.',diagnosticControls:2});
});
