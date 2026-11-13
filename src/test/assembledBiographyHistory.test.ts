import {it,expect} from 'vitest';
import {walk} from './fixtures/campaign2Cognitive';
import {fixture,create,learning,probe,live,refold,reinterpret,enumerate,capture,learned,standing,ablation,rec,f,uint,items,key,decode,enc,list,q,readQ,ZERO,signedValue,snap,through,finish,exact,bytes,qualificationParts,fraction,Q,formationSignals,type CanonicalValue} from './fixtures/assembledBiographyHistory';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {bounded} from '../campaign2/cognitiveMath';
import {factoredPriority} from '../assembled/priority';
it('M107 admission preflight for the complete repeated calendar',async()=>{
 const b=fixture();expect(bounded(factoredPriority(Q.of(13n,20n),Q.of(5n,6n)))).toEqual(Q.of(143n,383n));
 expect(Q.of(143n,383n).compare(Q.of(37n,100n))).toBeGreaterThan(0);expect(Q.of(143n,383n).compare(Q.of(3n,8n))).toBeLessThan(0);
 const counts=new Map<string,number>();for(const row of items(decode(b.d.orderedInputs),'list')){const a=items(row,'list'),t=key(a[2]);counts.set(t,(counts.get(t)??0)+1);}
 await createCharacterRun(await prepareCharacterModel(b.s),b.d);console.info('M107 admitted complete calendar; source counts '+JSON.stringify([...counts]));
},120000);
for(const start of [0,2,4,6])it('M107 history seeds '+start+'..'+(start+1),async()=>{
 for(let seed=start;seed<start+2;seed++){
  const {b,run}=await create(fixture(seed)),expressions:CanonicalValue[]=[],trajectory:{at:string;chosen:string;c:string;before:string;after:string;authorship:string;contrary:boolean;weakened:boolean;reversed:boolean}[]=[];let prior=ZERO;
  for(const [i,at]of learning.entries()){
   await through(run,at);const p=live(run,at),l=refold(run);expect(l.journal).toHaveLength(i+1);
   const qual=qualificationParts(l.journal[i]),c=readQ(qual.contribution);expect(qual.resolution).toEqual(p.d);expect(qual.accepted).toBe(true);expect(c.equals(ZERO)).toBe(false);
   for(let j=0;j<i;j++)expect(key(qualificationParts(l.journal[j]).expression)).toBe(key(expressions[j]));expressions.push(qual.expression);
   expect(readQ(items(p.report,'list')[1])).toEqual(prior);expect(formationSignals(p.input[0],i===0?undefined:p.input[1]).output).toEqual(p.source);expect(standing(p.raw)).toEqual(standing(p.source));
   const sign=prior.compare(ZERO),contrary=sign!==0&&c.compare(ZERO)!==sign,after=l.formation.P,abs=(v:Q)=>v.compare(ZERO)<0?v.multiply(Q.of(-1n)):v;
   trajectory.push({at:String(at),chosen:key(f(p.data,1n)),c:fraction(c),before:fraction(prior),after:fraction(after),authorship:fraction(readQ(f(p.data,7n))),contrary,weakened:contrary&&after.compare(ZERO)===sign&&abs(after).compare(abs(prior))<0,reversed:contrary&&after.compare(ZERO)!==0&&after.compare(ZERO)!==sign});prior=after;
  }
  await through(run,probe);const p=live(run,probe),l=refold(run);expect(l.journal).toHaveLength(8);expect(l.formation.P).toEqual(prior);
  for(let i=0;i<8;i++)expect(key(qualificationParts(l.journal[i]).expression)).toBe(key(expressions[i]));
  const wrong=reinterpret(run,p),without=ablation(p,b.s);expect(standing(without.raw)).toHaveLength(0);expect(without.ns).toHaveLength(2);
  for(const n0 of p.ns){const n=rec(n0,407n),strength=readQ(f(rec(f(n,2n),406n),2n)),candidate=f(rec(f(n,1n),404n),1n),actual=items(f(p.data,2n),'list').find(v=>key(f(rec(v,421n),1n))===key(candidate))!;
   expect(readQ(f(rec(actual,421n),2n)).compare(Q.of(1n,2n))).toBe(strength.compare(ZERO));
   expect(f(rec(without.ns.find(v=>key(f(rec(v,407n),1n))===key(f(n,1n)))!,407n),10n)).toEqual({kind:'unsigned',value:0n});
  }
  if(seed===0){const actual=await enumerate(p,b.s),absent=await enumerate(p,b.s,without.context);for(const v of items(f(p.data,2n),'list'))expect(actual.sum.get(key(f(rec(v,421n),1n)))).toEqual(readQ(f(rec(v,421n),2n)));expect([...absent.sum.values()]).toEqual([Q.of(1n,2n),Q.of(1n,2n)]);console.info('M107 SAMPLER '+(actual.cases+absent.cases)+' exact weighted cases');}
  await finish(run);expect(learned(run).formation.P).toEqual(prior);for(let i=0;i<8;i++)expect(key(qualificationParts(learned(run).journal[i]).expression)).toBe(key(expressions[i]));
  console.info('M107 COMPLETED HISTORY '+JSON.stringify({seed,trajectory,finalP:fraction(prior),reinterpretation:fraction(wrong),probeProbabilities:p.probabilities.map(v=>fraction(readQ(v))),frozen:8,terminal:101}));
 }
},570000);
it('M107 pressure and hidden truth on repeated history',async()=>{
 const normal=await create(fixture()),hidden=await create(fixture(0,false,true)),pressure=await create(fixture(0,true));
 for(const at of [...learning,probe]){
  for(const x of [normal,hidden,pressure])await through(x.run,at);
  const a=live(normal.run,at),b=live(hidden.run,at),p=live(pressure.run,at);expect(a.d).toEqual(b.d);expect(learned(normal.run)).toEqual(learned(hidden.run));
  expect(learned(pressure.run).journal).toHaveLength(0);expect(learned(pressure.run).formation.entries).toHaveLength(0);expect(standing(p.raw)).toHaveLength(0);expect(p.probabilities.map(readQ)).toEqual([Q.of(1n,2n),Q.of(1n,2n)]);if(at===10n)expect(p.d).toEqual(a.d);
 }
 for(const x of [normal,hidden,pressure])await finish(x.run);console.info('M107 CONTROLS PASS hidden truth/pressure; full calendars101');
},570000);
it('M107 repeat and restore preserve acquired history through later changes',async()=>{
 const b=fixture(),a=await create(b,12n),repeat=await create(b,12n);expect(learned(a.run).journal).toHaveLength(2);exact(a.run,repeat.run);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 const times:bigint[]=[];for(let count=0;count<32;count++){
  const next=await a.run.settleNextInstant();expect(await repeat.run.settleNextInstant()).toBe(next);expect(await restored.settleNextInstant()).toBe(next);
  const x=a.run.snapshot(),save=a.run.save(),identity=a.run.runIdentity();for(const r of [repeat.run,restored]){const y=r.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(save,r.save());bytes(identity,r.runIdentity());}
  if(!next){expect(x.clock).toBe(101n);console.info('M107 PERSISTENCE PASS save12, all subsequent settlements '+times.join(',')+' and exhaustion');return;}times.push(x.clock);
 }throw Error('M107 continuation settle cap');
},570000);

it('M107 inspect inherited task declarations',()=>{walk(decode(fixture().s.registry),v=>{if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n){const body=f(v,4n);if(typeof body!=='boolean'&&body.kind==='record'&&body.schema.typeId===370n)console.info('M107 TASK '+JSON.stringify({id:f(v,1n),from:f(body,5n),deadline:f(body,6n)},(_,v)=>typeof v==='bigint'?String(v):v));}return v;});});
