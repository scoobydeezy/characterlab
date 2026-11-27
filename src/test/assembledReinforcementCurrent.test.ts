import {it,expect} from 'vitest';
import {start,through,rec,f,uint,items,key,decode,enc,list,at,cachedMemory,type Arm,type CanonicalValue} from './fixtures/assembledReinforcementCurrent';
import {capture,learned,hash,exact,finish,fullProbability} from './assembledRewardReportSet.test';
import {restorePreparedCharacterRun} from '../assembled/character';
import {compileTimedComparison} from '../assembled/timedComparison';
import {comparisonAddress} from '../assembled/comparison';
import {coupledRandomKeyValue} from '../substrate/random';
import {randomDrawRecord} from '../assembled/codecs';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateRawSync} from 'node:zlib';
const file='docs/planning/ASSEMBLED_CHARACTER_M293_EVIDENCE.json';
const saved=()=>JSON.parse(readFileSync(file,'utf8'));
const put=(k:string,v:unknown)=>{const e=existsSync(file)?saved():{candidate:'0.167',plan:'73c4f064',remainingSeeds:[4,5,6,7]};expect(e[k]).toBeUndefined();e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');};
const pack=(b:Uint8Array)=>({sha256:hash(b),length:b.length,deflateBase64:deflateRawSync(b).toString('base64')});
const rational=(v:string)=>{const [n,d]=v.split('/').map(BigInt);return Q.of(n,d);};
const fraction=(v:string)=>{const q=Q.of(BigInt(v),1000n);return q.numerator+'/'+q.denominator;};
type X=Awaited<ReturnType<typeof start>>;
function observed(x:X,n:number){
 const out=items(decode(x.run.snapshot().outputs),'list'),d=out.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&at(f(v,2n))===BigInt(n))!;
 const expression=out.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===426n&&at(f(rec(f(rec(f(v,2n),425n),2n),409n),2n))===BigInt(n))!;
 expect(d).toBeDefined();expect(expression).toBeDefined();
 const trace=items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n)).filter(t=>at(f(rec(f(t,4n),130n),2n))===BigInt(n)&&uint(f(rec(f(t,4n),130n),3n))===80n);
 const schedule=compileTimedComparison(x.b.header),draws=trace.flatMap(t=>items(f(t,14n),'list')).map(randomDrawRecord);
 expect(draws.length).toBeGreaterThanOrEqual(2);
 const rows=draws.map(d=>{const address=comparisonAddress(f(d,1n)),mapped=schedule.bind(BigInt(n),address.causalRootId).resolve(address);expect(mapped,'every actual draw predeclared').toBeDefined();expect(f(d,2n)).toEqual(coupledRandomKeyValue(mapped!));const first=rec(items(f(d,7n),'list')[0],410n);return {key:key(f(d,2n)),local:key(f(d,1n)),span:String(uint(f(d,4n))),result:String(uint(f(d,3n))),firstCandidate:String(uint(f(first,2n))),record:hash(enc(d))};});
 return {resolution:hash(enc(d)),expression:hash(enc(expression)),draws:rows};
}
async function arm(seed:number,arm:Arm){
 const x=await start(seed,arm);for(const s of learned(x)){expect(s.count).toBe(0);expect(s.mean).toBe(null);}
 await through(x.run,4n);expect(learned(x).map(v=>[v.count,v.mean])).toEqual([[0,'0'],[0,'0']]);
 await through(x.run,6n);const acquired=learned(x);expect(acquired.map(v=>[v.count,v.mean])).toEqual([[1,'500'],[1,'500']]);
 expect([5,6].map(t=>capture(x,t).chosen)).toEqual([0,1]);
 const prefix=x.run.save();let restored:typeof x.run|undefined;
 if(seed===0&&arm==='full'){restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:prefix}));exact(x.run,restored);}
 const probes=[],counts=[1,1];
 for(const n of[7,8,9,10,11]){
  const before=learned(x);
  while(x.run.snapshot().clock<BigInt(n)){expect(await x.run.settleNextInstant()).toBe(true);if(restored){expect(await restored.settleNextInstant()).toBe(true);exact(x.run,restored);}}
  const p=capture(x,n),o=observed(x,n);expect(p.motive,'live task').toBe('1/1');expect(p.admitted).toEqual([true,true]);expect(p.chosen).toBeGreaterThanOrEqual(0);expect(p.effects).toEqual([{action:p.chosen,status:'Applied'}]);
  expect(p.beliefs).toEqual(counts.map(c=>String(roundEven(BigInt(c)*1000n,BigInt(c+1)))));
  const bases=p.signals.filter(v=>v.role===1);expect(bases.map(v=>v.value)).toEqual(p.beliefs.map(v=>fraction(v!)));
  for(const b of bases)expect(b.supports.slice().sort()).toEqual(before[b.action].supports.slice().sort());
  const after=learned(x);
  if(arm==='full'){counts[p.chosen]++;expect(after[p.chosen].samples.at(-1)).toEqual({at:n,attempted:true,amount:'1000'});}
  else expect(after).toEqual(acquired);
  expect(after.map(v=>v.count)).toEqual(counts);expect(after.map(v=>v.mean)).toEqual(counts.map(c=>String(roundEven(BigInt(c)*1000n,BigInt(c+1)))));
  probes.push({...p,...o,after});console.info('M293 probe',seed,arm,n,JSON.stringify({means:p.beliefs,p:fullProbability(p.probabilities),chosen:p.chosen,draws:o.draws.length}));
 }
 let done=false;for(let i=0;i<128;i++){const more=await x.run.settleNextInstant();if(restored){expect(await restored.settleNextInstant()).toBe(more);exact(x.run,restored);}if(!more){done=true;break;}}expect(done).toBe(true);expect(x.run.diagnostic()).toBeUndefined();
 const result={registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),header:pack(enc(x.b.header)),seed,arm,acquired,probes,prefix6:seed===0&&arm==='full'?pack(prefix):undefined,restored:!!restored,terminal:pack(x.run.save())};put(seed+'-'+arm,result);return result;
}
it.each([0,1,2,3])('pair293_seed%s',async(seed)=>{
 const a=await arm(seed,'full'),b=await arm(seed,'withheld');expect(a.registry).toBe(b.registry);expect(a.initial).toBe(b.initial);
 expect(a.probes[0].resolution).toBe(b.probes[0].resolution);expect(a.probes[0].expression).toBe(b.probes[0].expression);
 expect(fullProbability(a.probes[0].probabilities)).toEqual(['1/2','1/2']);
 let shared=0;for(let i=0;i<5;i++){
  const m=new Map(b.probes[i].draws.map(v=>[v.key,v]));let matched=0;
  for(const x of a.probes[i].draws){const y=m.get(x.key);if(!y)continue;matched++;shared++;expect(x.firstCandidate).toBe(y.firstCandidate);if(x.span===y.span)expect(x.result).toBe(y.result);if(i===0)expect(x.record).toBe(y.record);}
  expect(matched).toBeGreaterThanOrEqual(2);expect(fullProbability(b.probes[i].probabilities)).toEqual(['1/2','1/2']);
 }
 const first=a.probes[0].chosen,pa=fullProbability(a.probes[1].probabilities)[first];expect(rational(pa).compare(Q.of(1n,2n)),'experienced success raises later probability').toBeGreaterThan(0);
 const choices=a.probes.map(p=>p.chosen),control=b.probes.map(p=>p.chosen),changed=choices.some((v,i)=>v!==control[i]);
 put('pair-'+seed,{shared,firstProbabilityEqual:true,firstResolutionEqual:true,firstExpressionEqual:true,reinforced:first,nextProbability:pa,choices,withheldChoices:control,changed});
 console.info('M293 PAIR PASS',seed,JSON.stringify({shared,pa,choices,control,changed}));
},560000);
it('repeat293: independent full seed0 prefix and terminal',async()=>{const prior=saved()['0-full'],x=await start(0,'full');await through(x.run,6n);expect(hash(x.run.save())).toBe(prior.prefix6.sha256);await finish(x);expect(hash(x.run.save())).toBe(prior.terminal.sha256);put('repeat',{pass:true,prefix6:prior.prefix6.sha256,terminal:prior.terminal.sha256});},560000);
