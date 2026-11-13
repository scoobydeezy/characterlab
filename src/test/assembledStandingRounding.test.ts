import {factoredPriority} from '../assembled/priority';
import {bounded} from '../campaign2/cognitiveMath';
import {it,expect,vi} from 'vitest';
import {standingPlan,standingDistribution,standingSample,ROUNDING_SPAN,STANDING_ROUNDING_VERSION} from '../assembled/standingRounding';
import {createAssembledRandomSession} from '../assembled/random';
import {compileDescribedReasons} from '../assembled/reasons';
import {compileCharacterModel,ROUNDING_REGISTRY,WITNESS_REGISTRY} from '../assembled/model';
import {prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {decisionHistoryView,decisionPresentationView,ROUNDING_DECISION_VIEW_VERSION} from '../assembled/decisionView';
import {decodeCognitive,randomDrawRecord} from '../assembled/codecs';
import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {RandomRunOracle} from '../substrate/random';
import {outputs} from './fixtures/assembledComparison';
import {fixture,create,coupling,mapped,ablation,enumerate,replace,capture,learned,standing,snap,through,exact,bytes,definition,r,rec,f,uint,items,key,decode,enc,list,set,text,u,signed,q,readQ,ZERO,ONE,readDistribution,Q} from './fixtures/assembledStandingRounding';
const si=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('signed');return v.value;};
let candidate:Awaited<ReturnType<typeof create>>,control:Awaited<ReturnType<typeof create>>;
it('M103 exact law: symmetric bounded rounding retains integer and zero endpoints',()=>{
 for(const v of [Q.of(0n),Q.of(1n,256n),Q.of(-1n,256n),Q.of(1n,12n),Q.of(-1n,12n),Q.of(1n,4n),Q.of(-1n,4n),Q.of(3n,4n),Q.of(-3n,4n),Q.of(1n),Q.of(-1n)]){
  const p=standingPlan(v,Q.of(1n,4n),3n),minus=standingPlan(v.multiply(Q.of(-1n)),Q.of(1n,4n),3n);
  expect(minus).toEqual({base:-p.base,upper:-p.upper,threshold:p.threshold});
  const d=standingDistribution(4n,1n,0n,0n,p);expect([...d.values()].reduce((a,b)=>a.add(b),ZERO)).toEqual(ONE);
  const mean=Q.of(p.base).multiply(ONE.subtract(Q.of(p.threshold,ROUNDING_SPAN))).add(Q.of(p.upper).multiply(Q.of(p.threshold,ROUNDING_SPAN)));
  const raw=v.divide(Q.of(1n,4n)),target=raw.compare(Q.of(3n))>0?Q.of(3n):raw.compare(Q.of(-3n))<0?Q.of(-3n):raw,diff=target.subtract(mean);
  expect((diff.compare(ZERO)<0?diff.multiply(Q.of(-1n)):diff).compare(Q.of(1n,ROUNDING_SPAN))).toBeLessThan(0);
  if(!p.threshold){expect(standingSample(p.base,p.upper,0n)).toBe(p.base);expect(()=>standingSample(p.base,p.upper,0n,0n)).toThrow();}
  else {expect(standingSample(p.base,p.upper,p.threshold,p.threshold-1n)).toBe(p.upper);expect(standingSample(p.base,p.upper,p.threshold,p.threshold)).toBe(p.base);}
  expect([...standingDistribution(4n,-1n,0n,0n,p)]).toEqual([...d].map(([k,w])=>[-k,w]));
 }
 expect(()=>standingPlan(ONE,ZERO,3n)).toThrow();expect(()=>standingPlan(ONE,ONE,4n)).toThrow();
 expect(()=>standingSample(0n,1n,ROUNDING_SPAN,0n)).toThrow();expect(()=>standingSample(0n,2n,1n,0n)).toThrow();
 console.info('M103 KERNEL PASS signed mean error<2^-32, normalization, integer/cap/zero/Avoid and threshold boundaries');
});
it('M103 native gate: acquired standing changes rolling probabilities between already-live reasons',async()=>{
 const a=await create(),b=await create(fixture(false)); // outcomes are not used to select a contrast/map
 const ca=coupling(a.run),cb=coupling(b.run,false);
 candidate=await create(mapped(a.b,ca));control=await create(mapped(b.b,cb));
 const p=capture(candidate.run),old=capture(control.run),la=learned(candidate.run),lb=learned(control.run);
 console.info('M103 PRECONDITION '+JSON.stringify({mode:String(uint(f(p.data,8n))),oldMode:String(uint(f(old.data,8n))),nuclei:p.ns.length,oldNuclei:old.ns.length,P:String(la.formation.P.numerator)+'/'+la.formation.P.denominator}));
 expect(p.ns).toHaveLength(2);expect(old.ns).toHaveLength(2);expect(uint(f(p.data,8n))).not.toBe(1n);expect(uint(f(old.data,8n))).not.toBe(1n);
 expect(la.formation.entries).toHaveLength(1);expect(la.formation.P.compare(ZERO)).toBeGreaterThan(0);expect(la.formation.P).toEqual(lb.formation.P);
 const early=capture(candidate.run,10n);expect(standing(early.raw)).toHaveLength(0);expect(items(f(early.data,9n),'list')).toHaveLength(0);expect(uint(f(early.data,8n))).toBe(1n);
 const absent=ablation(p,candidate.b.s),oldAbsent=ablation(old,control.b.s,false);
 expect(absent.ns).toHaveLength(2);expect(oldAbsent.ns).toHaveLength(2);expect(standing(absent.raw)).toHaveLength(0);
 expect(compileDescribedReasons(p.raw,definition(candidate.b.s),3,'SourceCoverage',true,true).nuclei).toEqual(p.ns);
 for(let i=0;i<2;i++){
  const n=rec(p.ns[i],407n),o=rec(old.ns[i],407n),z=rec(absent.ns[i],407n),roles=rec(f(n,2n),406n);
  expect(n.schema.schemaVersion).toBe(3n);expect(uint(f(n,10n))).toBeGreaterThan(0n);expect(f(n,5n)).toEqual(signed(0));
  for(const field of [1n,4n,5n,6n,8n])expect(f(n,field)).toEqual(f(o,field));
  expect(readQ(f(roles,2n)).numerator).not.toBe(0n);for(const field of [1n,3n,5n])expect(f(roles,field)).toEqual(f(rec(f(z,2n),406n),field));
  expect(f(o,7n)).toEqual(f(rec(oldAbsent.ns[i],407n),7n));expect(f(n,7n)).not.toEqual(f(z,7n));
 }
 const pa=await enumerate(p,candidate.b.s),pz=await enumerate(p,candidate.b.s,absent.context),po=await enumerate(old,control.b.s);
 for(const v of items(f(p.data,2n),'list'))expect(pa.sum.get(key(f(rec(v,421n),1n)))).toEqual(readQ(f(rec(v,421n),2n)));
 for(const v of items(f(old.data,2n),'list'))expect(po.sum.get(key(f(rec(v,421n),1n)))).toEqual(readQ(f(rec(v,421n),2n)));
 expect(pz.sum).toEqual(po.sum);
 for(const n0 of p.ns){const n=rec(n0,407n),action=key(f(rec(f(n,1n),404n),1n)),strength=readQ(f(rec(f(n,2n),406n),2n));expect(pa.sum.get(action)!.compare(pz.sum.get(action)!)).toBe(strength.compare(ZERO));}
 const ds=items(f(p.data,9n),'list').map(v=>rec(v,422n)),ods=items(f(old.data,9n),'list').map(v=>rec(v,422n));
 expect(ds).toHaveLength(2);
 for(let i=0;i<2;i++){
  const d=ds[i],od=ods[i],face=randomDrawRecord(f(d,5n)),of=randomDrawRecord(f(od,5n)),rd=randomDrawRecord(items(f(d,9n),'list')[0]),n=rec(p.ns[i],407n);
  expect(f(face,2n)).toEqual(f(of,2n));expect(f(face,3n)).toEqual(f(of,3n));expect(uint(f(rd,4n))).toBe(ROUNDING_SPAN);
  expect(f(face,2n)).not.toEqual(f(rd,2n));expect(items(f(d,9n),'list')).toHaveLength(1);
  expect(si(f(d,10n))).toBe(standingSample(si(f(n,5n)),si(f(n,9n)),uint(f(n,10n)),uint(f(rd,3n))));
  expect(si(f(d,7n))).toBe((uint(f(rec(f(n,1n),404n),4n))===1n?1n:-1n)*(uint(f(d,6n))+si(f(d,10n))+si(f(d,4n))+si(f(d,8n))));
 }
 const traces=outputs(candidate.run.snapshot().trace,160n),t=traces.find(t=>key(f(t,13n))===key(p.d))!;
 expect(f(t,6n)).toEqual(text(STANDING_ROUNDING_VERSION));expect(items(f(t,14n),'list').slice(0,4)).toEqual(ds.flatMap(d=>[f(d,5n),...items(f(d,9n),'list')]));
 const all=items(decode(candidate.run.snapshot().outputs),'list'),history=decisionHistoryView(all,traces);
 expect(items(history,'list')[0]).toEqual(text(ROUNDING_DECISION_VIEW_VERSION+'/history'));
 const player=replace(p.d,4n,r(419,[u(3),replace(p.data,8n,u(3))])),view=decisionPresentationView([player]);
 expect(items(view,'list')[0]).toEqual(text(ROUNDING_DECISION_VIEW_VERSION+'/player'));
 expect(items(items(items(view,'list')[1],'list')[0],'list')[2]).toBeDefined();
 const formatted=(m:Map<string,Q>)=>[...m.values()].map(x=>x.numerator+'/'+x.denominator);
 console.info('M103 NATIVE PASS '+JSON.stringify({withStanding:formatted(pa.sum),withoutStanding:formatted(pz.sum),classes:pa.cases+pz.cases+po.cases,matchedFaces:2,roundingDraws:2,fullProducerConsumer:true,sampledChoiceClaim:false}));
},570000);
it('M103 controls: pressure exclusion, hidden truth, model admission and RNG capabilities',async()=>{
 const pressured=await create(fixture(true,true)),hidden=await create(fixture(true,false,true)),p=capture(pressured.run);
 expect(learned(pressured.run).formation.entries).toHaveLength(0);expect(standing(p.raw)).toHaveLength(0);
 const base=await create(fixture());const actual=capture(base.run);bytes(base.run.snapshot().state,hidden.run.snapshot().state);expect(actual.raw).toEqual(capture(hidden.run).raw);expect(actual.data).toEqual(capture(hidden.run).data);
 const model=await compileCharacterModel(base.b.s),oldModel=await compileCharacterModel({...base.b.s,rulesVersion:control.b.s.rulesVersion,registrySchemaVersion:WITNESS_REGISTRY});
 expect(()=>oldModel.content.validateRecordRoles(enc(actual.ns[0]))).toThrow('successor');
 expect(()=>model.content.validateRecordRoles(enc(actual.ns[0]))).not.toThrow();
 await expect(prepareCharacterModel({...base.b.s,registrySchemaVersion:WITNESS_REGISTRY})).rejects.toThrow('version bundle');
 await expect(create(mapped(fixture(false),coupling(base.run)))).rejects.toThrow('rounding map');
 const n=rec(actual.ns[0],407n);expect(()=>decodeCognitive(enc(replace(n,10n,u(ROUNDING_SPAN))))).toThrow('standing plan');
 const zeroRoles=replace(rec(f(n,2n),406n),1n,q(0,1));expect(zeroRoles).toBeDefined();
 // Recompile actual operands with base signals removed: standing must not create a motive.
 const raw=actual.raw,descriptions=items(f(raw,6n),'list').filter(v=>uint(f(rec(f(rec(items(v,'list')[2],402n),1n),401n),3n))!==1n);
 const zr=r(403,[f(raw,1n),f(raw,2n),set(items(f(raw,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))!==1n)),f(raw,4n),f(raw,5n),list(descriptions)],3);
 expect(compileDescribedReasons(zr,definition(base.b.s),3,'SourceCoverage',true,true).nuclei).toHaveLength(0);
 const session=createAssembledRandomSession(base.b.d.runSeed,undefined,3,true,true);session.begin();const draws=session.forResolution(f(actual.d,1n),actual.context);
 await expect(draws.rounding!(replace(n,10n,u(1)))).rejects.toThrow('foreign');
 const first=await draws.rounding!(n);await expect(draws.rounding!(n)).rejects.toThrow('repeated');session.close();expect(session.committedAddressKeys()).toEqual([]);
 session.begin();const next=await session.forResolution(f(actual.d,1n),actual.context).rounding!(n);expect(next).toEqual(first);session.prepareCommit();session.commit();session.close();expect(session.committedAddressKeys()).toHaveLength(1);
 await expect(draws.rounding!(n)).rejects.toThrow();const disabled=createAssembledRandomSession(base.b.d.runSeed);disabled.begin();await expect(disabled.forResolution(f(actual.d,1n),actual.context).rounding!(n)).rejects.toThrow('disabled');disabled.close();
 console.info('M103 CONTROLS PASS pressure/hidden/zero-base, successor grammar/map, foreign/repeated/expired/disabled capability and aborted-ledger replay');
},570000);
it('M103 continuation and rollback retain every rounding draw and frozen expression',async()=>{
 const b=fixture(),a=await create(b,11n),repeat=await create(b,11n);exact(a.run,repeat.run);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 const clocks:bigint[]=[];for(let n=0;;n++){expect(n).toBeLessThan(32);const x=[];for(const run of [a.run,repeat.run,restored])x.push(await run.settleNextInstant());expect(x[1]).toBe(x[0]);expect(x[2]).toBe(x[0]);exact(a.run,repeat.run);exact(a.run,restored);if(!x[0])break;clocks.push(a.run.snapshot().clock);}
 expect(a.run.snapshot().clock).toBe(101n);
 const fault=await create(b,11n),before=fault.run.snapshot(),original=RandomRunOracle.prototype.drawBounded;let hit=false;
 const spy=vi.spyOn(RandomRunOracle.prototype,'drawBounded').mockImplementation(async function(this:RandomRunOracle,address,span){const draw=await original.call(this,address,span);if(span===ROUNDING_SPAN){hit=true;throw Error('M103 after actual rounding draw');}return draw;});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M103 after actual rounding draw');}finally{spy.mockRestore();}
 expect(hit).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);
 console.info('M103 CONTINUATION PASS11 -> '+clocks.join(',')+'; full saves/state/output/trace/identity; public rollback after actual rounding draw (private ledger covered separately)');
},570000);

it('M103 diagnostic unchanged failed frame: report consumed operands without another contrast',async()=>{
 const a=await create(fixture(true,false,false,false)),p=capture(a.run),rows=p.ns.map(v=>{const n=rec(v,407n),roles=rec(f(n,2n),406n);return {key:key(f(n,1n)).slice(-32),die:String(uint(f(n,4n))),strengths:[1n,2n,3n,5n].map(i=>{const x=readQ(f(roles,i));return x.numerator+'/'+x.denominator;}),h:String(si(f(n,5n))),x:String(si(f(n,6n))),c:String(si(f(n,8n))),threshold:String(uint(f(n,10n)))};});
 const arb=items(items(decode(a.b.s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key({kind:'typedIdentifier',namespaceId:1027n,payload:text('definition/task-arbitration')}))!;
 console.info('M103 UNCHANGED FAILED-FRAME DIAGNOSTIC '+JSON.stringify({rows,probabilities:p.probabilities.map(v=>{const x=readQ(v);return x.numerator+'/'+x.denominator;}),mode:String(uint(f(p.data,8n))),contest:(()=>{const x=readQ(f(p.data,4n));return x.numerator+'/'+x.denominator;})(),rollThreshold:(()=>{const x=readQ(f(rec(f(rec(arb,171n),4n),440n),1n));return x.numerator+'/'+x.denominator;})(),draws:items(f(p.data,9n),'list').length}));
 expect(uint(f(p.data,8n))).toBe(1n);expect(p.ns).toHaveLength(2);
},570000);

it('M103 configured-boundary diagnosis: approved urgency change cannot reach the predicted die band',()=>{
 const amended=fixture(),original=fixture(true,false,false,false);
 const aa=items(decode(amended.d.orderedInputs),'list'),oo=items(decode(original.d.orderedInputs),'list');
 expect(aa.length).toBe(oo.length);const changed=aa.map((v,i)=>key(v)!==key(oo[i])?i:-1).filter(i=>i>=0);
 expect(changed).toHaveLength(1);const a=items(aa[changed[0]],'list'),o=items(oo[changed[0]],'list');
 for(const i of [0,1,2,4])expect(a[i]).toEqual(o[i]);expect(a[0]).toEqual(signed(12));
 const ap=items(a[3],'list'),op=items(o[3],'list');expect(ap[0]).toEqual(op[0]);
 const ar=items(ap[1],'list'),or=items(op[1],'list');let changes=0;
 ar.forEach((row,i)=>{const r=items(row,'list'),before=items(or[i],'list');r.forEach((v,j)=>{if(key(v)!==key(before[j])){expect(j).toBe(3);expect(v).toEqual(list([q(4,5)]));expect(before[j]).toEqual(list([q(1,1)]));changes++;}});});expect(changes).toBe(1);
 const dice=rec(definition(amended.s),437n),cuts=[1n,2n,3n,4n,5n].map(i=>readQ(f(rec(f(dice,1n),438n),i)));
 expect(cuts).toEqual([Q.of(1n,5n),Q.of(2n,5n),Q.of(3n,5n),Q.of(4n,5n),ONE]);
 const motive=factoredPriority(ONE,Q.of(4n,5n)),base=bounded(motive);
 expect(motive).toEqual(Q.of(9n,10n));expect(base).toEqual(Q.of(9n,19n));
 expect(base.compare(cuts[1])).toBeGreaterThan(0);expect(base.compare(cuts[2])).toBeLessThan(0);
 console.info('M103 CONFIGURATION DIAGNOSIS: only approved urgency changed; actual priority I*(1+U)/2 gives9/10, bounded9/19; d6 begins2/5. Predicted4/9/d4 was wrong in both equation and band. No new simulation/contrast.');
});
