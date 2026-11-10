/** M80 original DECISION regime/trace controls; no production selectors or retuning. */
import {it,expect} from 'vitest';
import {list,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,type Regime} from './fixtures/assembledDecisionRegimes';
import {snap,through,finish,bytes,exact,knowledge,projection,probability,allDraws,frac} from './fixtures/assembledAffectReceiving';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {receivingRecord as rec} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ,readDistribution,expectation,absolute} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {analyzeOptions} from '../assembled/configurationMath';
import {sid} from '../assembled/skill';
import {randomAddressValue,naturalRandomKeyValue} from '../substrate/random';
const modes:Regime[]=['settled','quiet','balanced'];
const definition=(s:ReturnType<typeof fixture>['s'],name:string)=>rec(f(rec(items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!,171n),4n),name==='task-arbitration'?440n:437n);
async function create(regime:Regime,at=10n,control:'normal'|'hidden'|'failed'='normal'){
 const b=fixture(regime,control),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};
}
function live(r:Run,regime:Regime,s:ReturnType<typeof fixture>['s']){
 const i=modes.indexOf(regime),p=projection(r),k=knowledge(r),expectedP=[q(1,1),q(1,2),q(0,1)][i];
 expect(k.efficacy!.cue!.mean,'live learned cue').toEqual(readQ(expectedP));expect(k.efficacy!.cue!.supports).toHaveLength(2);
 expect(p.a[6],'actual consumed U').toEqual(list([q(i===2?0:357,i===1?2000:1000),q(i===2?0:357,i===1?2000:1000)]));
 const def=definition(s,'task-arbitration');expect(f(def,1n)).toEqual(q(1,2));expect(f(def,2n)).toEqual(q(1,2));
 const dice=definition(s,'task-reason-dice');expect(f(dice,2n)).toEqual(q(37,100));expect(f(rec(f(dice,4n),439n),1n)).toEqual(q(1,10));
 for(const task of [taskA,taskB]){const n=p.nucleus(task)[0];expect(f(n,4n)).toEqual({kind:'unsigned',value:4n});expect(f(n,5n)).toEqual(signed(0));expect(f(rec(f(n,2n),406n),1n)).toEqual(q(3,8));}
 expect(p.nucleus(taskA).map(n=>f(n,6n))).toEqual([signed(2-i)]);expect(p.nucleus(taskB).map(n=>f(n,6n))).toEqual([signed(0)]);
 expect(probability(p.data,p.A)).toEqual([Q.of(7n,8n),Q.of(23n,32n),Q.of(1n,2n)][i]);
 expect(f(p.data,4n)).toEqual([q(1,4),q(9,16),q(1,1)][i]);expect(f(p.data,6n)).toEqual(q(5,7));
 expect(f(p.data,7n)).toEqual([q(5,28),q(45,112),q(5,7)][i]);expect(uint(f(p.data,8n))).toBe(BigInt(i+1));
 return p;
}
function drawProof(r:Run,p:ReturnType<typeof projection>){
 const ds=items(f(p.data,9n),'list').map(v=>rec(v,422n)),tie=rec(f(p.data,10n),423n),auto=uint(f(p.data,8n))===1n;
 expect(ds).toHaveLength(auto?0:2);if(auto){expect(uint(f(tie,1n))).toBe(1n);expect(f(p.data,1n)).toEqual(p.A);return;}
 const ledger=allDraws(r),addresses:string[]=[],scores=new Map<string,bigint>();
 for(const d of ds){const nk=rec(f(d,1n),404n),candidate=f(nk,1n),n=p.ns.find(n=>key(f(n,1n))===key(nk))!;expect(n).toBeDefined();
  const draw=rec(f(d,5n),411n);expect(ledger).toContainEqual(draw);const address=f(draw,1n);addresses.push(key(address));
  const c=rec(candidate,395n),expectedAddress={causalRootId:id(f(p.d,1n)),purposeId:sid(1042,'purpose/task-reason-face'),drawIndex:0n,subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(nk,3n))}]};expect(address).toEqual(randomAddressValue(expectedAddress));expect(f(draw,2n)).toEqual(naturalRandomKeyValue(expectedAddress));
  expect(uint(f(draw,4n))).toBe(4n);expect(uint(f(d,6n))).toBe(uint(f(draw,3n))+1n);
  const contribution=BigInt(uint(f(d,6n)))+signedValue(f(n,5n))+signedValue(f(n,6n));expect(signedValue(f(d,7n))).toBe(contribution);scores.set(key(candidate),contribution);
 }
 expect(new Set(addresses).size).toBe(2);
 const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=[p.A,p.B].filter(c=>scores.get(key(c))===top).sort((a,b)=>key(a)<key(b)?-1:1);
 if(leaders.length===1){expect(uint(f(tie,1n))).toBe(1n);expect(f(p.data,1n)).toEqual(leaders[0]);}
 else {expect(uint(f(tie,1n))).toBe(2n);expect(f(tie,2n)).toEqual(list(leaders));const d=rec(f(tie,3n),411n);expect(ledger).toContainEqual(d);const address={causalRootId:id(f(p.d,1n)),purposeId:sid(1042,'purpose/task-decision-tie'),drawIndex:0n,subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(rec(p.A,395n),1n))}]};expect(f(d,1n)).toEqual(randomAddressValue(address));expect(f(d,2n)).toEqual(naturalRandomKeyValue(address));expect(uint(f(d,4n))).toBe(2n);expect(f(p.data,1n)).toEqual(leaders[Number(uint(f(d,3n)))]);expect(f(tie,4n)).toEqual(f(p.data,1n));}
 // Reading the presentation uses only authoritative records; no new random API.
 const before=r.save();const shown=ds.map(d=>({nucleus:f(d,1n),face:f(d,6n),contribution:f(d,7n)}));expect(shown).toHaveLength(2);bytes(before,r.save());
}
function diagnosticControls(p:ReturnType<typeof projection>,regime:Regime){
 const modifier=2-modes.indexOf(regime);let wins=0,ties=0,decorativeDisagreements=0;
 const leader=[p.A,p.B].sort((a,b)=>probability(p.data,b).compare(probability(p.data,a))||(key(a)<key(b)?-1:1))[0];
 for(let a=1;a<=4;a++)for(let b=1;b<=4;b++)for(let t=0;t<2;t++){
  const leaders=a+modifier>b?[p.A]:a+modifier<b?[p.B]:[p.A,p.B].sort((a,b)=>key(a)<key(b)?-1:1);
  const winner=leaders.length===2?leaders[t]:leaders[0];if(key(winner)===key(p.A))wins++;if(leaders.length===2)ties++;
  if(key(winner)!==key(leader))decorativeDisagreements++;
 }
 expect(Q.of(BigInt(wins),32n)).toEqual(probability(p.data,p.A));
 expect(decorativeDisagreements).toBeGreaterThan(0);
 if(regime==='settled')expect(items(f(p.data,9n),'list')).toHaveLength(0); // AlwaysRoll would require two faces.
 else expect(items(f(p.data,9n),'list')).toHaveLength(2); // NeverRoll would suppress both.
 if(regime==='balanced'){
  expect(wins).toBe(16); // Opaque fair binary sampling has this marginal but no independent reason-face account.
  const options=p.ns.map(n=>({key:f(rec(f(n,1n),404n),1n),distribution:readDistribution(f(n,7n)),reasonMass:absolute(expectation(readDistribution(f(n,7n))))}));
  const originalThreshold=analyzeOptions(options,Q.of(1n,2n),Q.of(3n,4n),3);
  expect(originalThreshold.mode).toBe('QuietRoll');expect(uint(f(p.data,8n))).toBe(3n);
 }
 console.info('M80 CAPTURED CONTROL '+JSON.stringify({regime,uniformCases:32,reasonLotteryAWins:wins,tieCases:ties,decorativeDisagreements,componentOnly:true}));
}
function execution(r:Run,p:ReturnType<typeof projection>){
 const intent=outputs(snap(r).outputs,425n).find(v=>key(f(v,2n))===key(p.d))!;expect(intent).toBeDefined();
 const expression=outputs(snap(r).outputs,426n).find(v=>key(f(v,2n))===key(intent))!;expect(expression).toBeDefined();
 const plan=outputs(snap(r).outputs,431n).find(v=>key(f(v,2n))===key(intent))!;
 const attempt=outputs(snap(r).outputs,432n).find(v=>key(f(v,2n))===key(plan))!;
 const outcome=outputs(snap(r).outputs,433n).find(v=>key(f(v,2n))===key(attempt))!;
 for(const v of [plan,attempt,outcome])expect(v).toBeDefined();return {intent,expression,plan,attempt,outcome};
}
it('M80 regimes: actual sources, probabilities, modes and authoritative draws',async()=>{
 let model:ReturnType<typeof fixture>['s']|undefined;
 for(const regime of modes){const x=await create(regime);if(model)expect(x.b.s).toEqual(model);else model=x.b.s;
  const p=live(x.r,regime,x.b.s);drawProof(x.r,p);diagnosticControls(p,regime);const old=execution(x.r,p);
  console.info('M80 NATIVE '+JSON.stringify({regime,analyticalA:probability(p.data,p.A).numerator+'/'+probability(p.data,p.A).denominator,mode:Number(uint(f(p.data,8n))),reasonDraws:items(f(p.data,9n),'list').length,stake:frac(f(p.data,6n)),authorship:frac(f(p.data,7n))}));
  await finish(x.r);expect(outputs(snap(x.r).outputs,426n)).toContainEqual(old.expression);expect(outputs(snap(x.r).outputs,409n)).toContainEqual(p.d);
 }
},540000);
it('M80 boundaries: hidden truth and failed execution preserve the prior decision',async()=>{
 const a=await create('quiet',9n),h=await create('quiet',9n,'hidden'),b=await create('quiet',9n,'failed');
 for(const x of [h,b]){bytes(snap(a.r).state,snap(x.r).state);bytes(snap(a.r).outputs,snap(x.r).outputs);}
 for(const x of [a,h,b])await through(x.r,10n);
 const p=live(a.r,'quiet',a.b.s),hp=live(h.r,'quiet',h.b.s),bp=live(b.r,'quiet',b.b.s);
 for(const other of [hp,bp])expect(other.d).toEqual(p.d);expect(knowledge(h.r)).toEqual(knowledge(a.r));
 expect(allDraws(a.r)).toEqual(allDraws(h.r));expect(allDraws(a.r)).toEqual(allDraws(b.r));
 const e=execution(a.r,p),he=execution(h.r,hp),be=execution(b.r,bp);expect(he).toEqual(e);
 for(const k of ['intent','expression','plan','attempt'] as const)expect(be[k]).toEqual(e[k]);
 expect(uint(f(e.outcome,3n))).toBeGreaterThan(0n);expect(uint(f(be.outcome,3n))).toBe(0n);
 for(const x of [a,h,b]){await finish(x.r);expect(outputs(snap(x.r).outputs,426n)).toContainEqual(e.expression);}
 console.info('M80 BOUNDARIES PASS unchanged actual decision/draws/intent/expression; actual physical outcome differs, hidden truth does not. Safe historical-view gate remains separate.');
},540000);
it('M80 persistence: exact repeat and restore across decision and later recall',async()=>{
 const a=await create('quiet',9n),b=await create('quiet',9n);exact(a.r,b.r);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.r.save()});exact(a.r,restored);
 for(const at of [10n,11n]){for(const r of [a.r,b.r,restored])await through(r,at);exact(a.r,b.r);exact(a.r,restored);}
 for(const r of [a.r,b.r,restored])await finish(r);exact(a.r,b.r);exact(a.r,restored);
 console.info('M80 CONTINUATION PASS exact state/output/trace/save/run identity9->10->11->101.');
},540000);
