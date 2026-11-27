import {it,expect} from 'vitest';
import {cases,start,through,rec,f,uint,items,key,decode,enc,list,text,at,cachedMemory,type Case,type CanonicalValue} from './fixtures/assembledSatisfierCurrent';
import {capture,learned,hash,exact,finish,original,fullProbability} from './assembledRewardReportSet.test';
import {safe} from './assembledIntoxicationCohort.test';
import {restorePreparedCharacterRun} from '../assembled/character';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {habitPath,rewardPath} from '../assembled/habit';
import {actionRewardSubject} from '../assembled/actionReward';
import {C} from './fixtures/assembledSatisfierCurrent';
import {statePathValue} from '../substrate/state';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateRawSync,inflateRawSync} from 'node:zlib';
const file='docs/planning/ASSEMBLED_CHARACTER_M292_EVIDENCE.json';
const read=(p=file)=>JSON.parse(readFileSync(p,'utf8'));
const put=(name:string,v:unknown)=>{const e=existsSync(file)?read():{candidate:'0.167',plan:'78eb74f4'};expect(e[name],'preserve existing evidence').toBeUndefined();e[name]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');};
const pack=(b:Uint8Array)=>({sha256:hash(b),length:b.length,deflateBase64:deflateRawSync(b).toString('base64')});
const unpack=(p:{deflateBase64:string})=>new Uint8Array(inflateRawSync(Uint8Array.from(atob(p.deflateBase64),c=>c.charCodeAt(0))));
const quant=(v:string|null)=>{if(v===null)return null;const [n,d]=v.split('/').map(BigInt);return String(roundEven(n*1000n,d));};
const fraction=(v:string)=>{const x=Q.of(BigInt(v),1000n);return x.numerator+'/'+x.denominator;};
const tag=(v:CanonicalValue,s:string)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(s));
type X=Awaited<ReturnType<typeof start>>;
function receiving(x:X,n:number){
 const ts=items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n)).filter(t=>at(f(rec(f(t,4n),130n),2n))===BigInt(n));
 const project=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
 const ct=ts.find(t=>project(t).some(v=>tag(v,'assembled-action-reward/candidates')))!;expect(ct,'actual candidate trace').toBeDefined();
 const reads=items(f(ct,11n),'list').map(v=>f(rec(v,147n),2n));
 for(const action of x.b.actions)for(const path of[habitPath,rewardPath])expect(reads).toContainEqual(statePathValue(path(actionRewardSubject(C,action))));
 const planner=ts.flatMap(project).find(v=>tag(v,STRATEGY_EVAL))!;expect(planner,'live planner').toBeDefined();
 const row=items(items(planner,'list')[3],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(x.b.task));expect(row).toBeDefined();
 const routes=items(row![2],'list').map(v=>key(items(v,'list')[0]));
 expect(routes).toEqual(x.b.name==='unavailable'?[key(text('KnownUnavailable')),key(text('KnownUnavailable'))]:x.b.name==='correctedConcentrated'?[key(text('KnownAvailable')),key(text('KnownAvailable'))]:[key(text('KnownUnavailable')),key(text('KnownAvailable'))]);
 return {candidateTrace:hash(enc(ct)),routes};
}
it.each(cases)('native292_%s',async(name)=>{
 const x=await start(name),concentrated=!['diversified','unavailable'].includes(name);
 for(const v of learned(x)){expect(v.count).toBe(0);expect(v.mean).toBe(null);}
 const prior=read('docs/planning/ASSEMBLED_CHARACTER_M'+(name==='correctedConcentrated'?'250':'249')+'_EVIDENCE.json')[name];
 expect(hash(x.b.original.s.registry)).toBe(prior.native.mapping.registry);
 expect(hash(x.b.original.d.initialState)).toBe(prior.native.mapping.initial);
 expect(hash(x.b.original.d.orderedInputs)).toBe(prior.native.mapping.inputs);
 await through(x.run,7n);const trained=learned(x);
 expect(trained.map(v=>v.count)).toEqual(concentrated?[4,0]:[2,2]);
 const practice=[4,5,6,7].map(n=>capture(x,n));
 expect(practice.map(p=>p.chosen)).toEqual(concentrated?[0,0,0,0]:[0,1,0,1]);
 for(const p of practice)expect(p.effects).toEqual([{action:p.chosen,status:'Applied'}]);
 await through(x.run,8n);const acquired=learned(x);
 expect(acquired.map(v=>v.count)).toEqual(trained.map(v=>v.count));
 const means=name==='correctedConcentrated'?['800','0']:concentrated?['1000',name==='knownAlternative'?'1000':name==='knownFailure'?'0':null]:['1000','1000'];
 expect(acquired.map(v=>v.mean)).toEqual(means);
 const prefix=x.run.save();let restored:typeof x.run|undefined;
 if(name==='diversified'){restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:prefix}));exact(x.run,restored);}
 const control=await original(name,'MeanHistory'),probes=[];
 for(const n of[9,10,11]){
  while(x.run.snapshot().clock<BigInt(n)){expect(await x.run.settleNextInstant()).toBe(true);if(restored){expect(await restored.settleNextInstant()).toBe(true);exact(x.run,restored);}}
  const p=capture(x,n);console.info('M292 probe',name,n,JSON.stringify(p));const evidence=receiving(x,n),c=control.rows[n-4];
  expect(p.motive).toBe('1/1');expect(p.beliefs).toEqual(c.belief.map(quant));expect(p.habit).toEqual(c.habit);expect(p.admitted).toEqual(c.admitted);
  expect(p.chosen).toBe(c.chosen);expect(fullProbability(p.probabilities)).toEqual(fullProbability(c.probabilities));
  const bases=p.signals.filter(v=>v.role===1);
  expect(bases.map(v=>[v.action,v.value])).toEqual(p.admitted.flatMap((yes,j)=>yes&&p.beliefs[j]!==null&&p.beliefs[j]!=='0'?[[j,fraction(p.beliefs[j]!)]]:[]));
  if(n===9)for(const b of bases)expect(b.supports.slice().sort()).toEqual(acquired[b.action].supports.slice().sort());
  expect(p.effects).toEqual(p.chosen<0?[]:[{action:p.chosen,status:'Applied'}]);
  for(const field of['beliefs','habit','admitted','chosen','probabilities'])expect(p[field as keyof typeof p]).toEqual(prior.probes[n-9][field]);
  probes.push({...p,...evidence});
 }
 let done=false;for(let i=0;i<128;i++){const more=await x.run.settleNextInstant();if(restored){expect(await restored.settleNextInstant()).toBe(more);exact(x.run,restored);}if(!more){done=true;break;}}expect(done).toBe(true);expect(x.run.diagnostic()).toBeUndefined();
 const observer=['deniedInfo','absentInfo'].includes(name)?pack(safe(x.run,items(decode(x.run.snapshot().outputs),'list'))):undefined;
 put(name,{registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),source:{registry:hash(x.b.original.s.registry),initial:hash(x.b.original.d.initialState),inputs:hash(x.b.original.d.orderedInputs)},receiving:x.b.receiving,practice,trained,acquired,probes,control,prefix8:name==='diversified'?pack(prefix):undefined,restored:!!restored,terminal:pack(x.run.save()),observer});
 if(name==='absentInfo'){const e=read();expect(e.deniedInfo.acquired).toEqual(acquired);expect(hash(unpack(e.deniedInfo.observer))).toBe(observer!.sha256);put('privacy',{acquiredEqual:true,completePermittedStreamEqual:true,hash:observer!.sha256,bytes:observer!.length});}
 console.info('M292 PASS',name,JSON.stringify({means,actions:probes.map(p=>p.chosen)}));
},560000);
it('repeat292: independent diversified prefix and terminal',async()=>{
 const e=read().diversified,x=await start('diversified');await through(x.run,8n);expect(hash(x.run.save())).toBe(e.prefix8.sha256);await finish(x);expect(hash(x.run.save())).toBe(e.terminal.sha256);put('repeat',{pass:true,prefix8:e.prefix8.sha256,terminal:e.terminal.sha256});
},560000);
