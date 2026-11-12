import {it,expect} from 'vitest';
import {create,mapping,rec,f,items,readQ,definition,key} from './fixtures/assembledStandingSources';
const fraction=(v:ReturnType<typeof readQ>)=>v.numerator+'/'+v.denominator;
it('M90 setup: unchanged M89 operands before declaring probe',async()=>{
 const a=await create(),p=mapping(a.run),dice=rec(definition(a.b.s),437n);
 console.info('M90 SETUP '+JSON.stringify({
 threshold:fraction(readQ(f(dice,2n))),standingUnit:fraction(readQ(f(rec(f(dice,3n),439n),1n))),
 meanings:[...p.semantics.values()].map(fraction),P:fraction(p.formation.P),
 nuclei:p.ns.map(v=>{const n=rec(v,407n),roles=rec(f(n,2n),406n);return {key:key(f(n,1n)),roles:[1n,2n,3n,5n].map(i=>fraction(readQ(f(roles,i)))),die:String((f(n,4n) as {value:bigint}).value),modifiers:[5n,6n,8n].map(i=>String((f(n,i) as {value:bigint}).value))};}),
 sources:items(f(p.raw,6n),'list').map(v=>{const d=items(v,'list'),s=rec(d[2],402n);return {label:d[0],source:key(f(s,1n)),strength:fraction(readQ(f(s,2n)))};})
 }));
 expect(p.ns).toHaveLength(2);
},570000);

/** M90: three physical tasks/no people; body30/cap100/rate10, delivery90 at9.
 * Same M89 acquisition10, seed0, permitted channels and terminal101.
 * At12 only B urgency19/20, importance retained3/5; pressure10 excludes learning.
 * No authored psychological state, changed calibration or alternate runtime. */
import {vi} from 'vitest';
import {fixture as prior,capture,learned,standing,withoutStanding,correspondence,
 snap,through,decode,enc,list,q,signed,uint,fp} from './fixtures/assembledStandingSources';
import {PRIORITY_DISPLAY} from '../assembled/priority';
import {taskB} from './fixtures/assembledDecisionRegimes';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileDescribedReasons} from '../assembled/reasons';
import * as formation from '../assembled/formation';
import {exact,bytes} from './fixtures/assembledAffectReceiving';
import {transcript} from './fixtures/assembledDecisionAlternatives';
import {statePathValue} from '../substrate/state';
import {absolute} from '../campaign2/cognitiveMath';

function fixture(pressure=false,hidden=false){
 const b=prior(true,pressure,hidden);let changed=0;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')];
  if(key(row[0])===key(signed(12))&&key(row[2])===key(PRIORITY_DISPLAY)){
   const p=items(row[3],'list');row[3]=list([p[0],list(items(p[1],'list').map(v=>{
    const t=[...items(v,'list')];if(key(t[0])===key(taskB)){
     expect(t[1]).toEqual(list([]));expect(t[3]).toEqual(list([q(1,1)]));
     expect(t[4]).toBe(true);t[3]=list([q(19,20)]);changed++;
    }return list(t);
   }))]);
  }return list(row);
 });
 expect(changed).toBe(1);return {s:b.s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
async function createProbe(pressure=false,hidden=false,at=12n){
 const b=fixture(pressure,hidden),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);
 await through(run,at);return {b,run};
}
let eligible:Awaited<ReturnType<typeof createProbe>>,excluded:Awaited<ReturnType<typeof createProbe>>;
it('M90 native: earned standing activates a weak reason and changes exact probabilities',async()=>{
 eligible=await createProbe();excluded=await createProbe(true);
 const a=mapping(eligible.run),b=capture(excluded.run),A=capture(eligible.run,10n),B=capture(excluded.run,10n);
 expect(A.d).toEqual(B.d);expect(transcript(A.data)).toEqual(transcript(B.data));
 expect(learned(excluded.run).formation.entries).toHaveLength(0);
 expect(learned(excluded.run).journal).toHaveLength(0);
 expect(standing(b.raw)).toHaveLength(0);
 expect(withoutStanding(a.raw)).toEqual(withoutStanding(b.raw));
 for(const i of [1n,2n,4n,5n])expect(f(a.raw,i)).toEqual(f(b.raw,i));
 const ordinary=(raw:typeof a.raw)=>items(f(raw,6n),'list').filter(v=>uint(f(rec(f(rec(items(v,'list')[2],402n),1n),401n),3n))!==3n);
 expect(ordinary(a.raw)).toEqual(ordinary(b.raw));
 for(const p of [a,b]){
  expect(items(f(rec(f(p.raw,2n),398n),3n),'list')).toHaveLength(2);
  expect(p.value).toHaveLength(0);
  // Liveness precedes the behavioral assertion: B's actual base exists in both.
  const base=items(f(p.raw,3n),'set').map(v=>rec(v,402n)).find(v=>{
   const k=rec(f(v,1n),401n);return key(f(k,2n))===key(taskB)&&uint(f(k,3n))===1n;
  });expect(base,'live compared raw base').toBeDefined();expect(f(base!,2n)).toEqual(q(117,200));
  expect(uint(f(p.data,8n))).toBe(1n);
 }
 const dice=rec(definition(eligible.b.s),437n);
 expect(dice).toEqual(definition(excluded.b.s));expect(f(dice,2n)).toEqual(q(37,100));
 expect(f(rec(f(dice,3n),439n),1n)).toEqual(q(1,4));
 const compiled=[a,b].map(p=>compileDescribedReasons(p.raw,dice,3,'Jaccard',true));
 compiled.forEach((c,i)=>expect(c.nuclei).toEqual([a,b][i].ns));
 const BRow=(report:ReturnType<typeof compileDescribedReasons>['report'])=>items(items(report,'list')[1],'list').map(v=>items(v,'list')).find(v=>key(f(rec(v[0],404n),3n))===key(f(rec(taskB,371n),2n)))!;
 const rowA=BRow(compiled[0].report),rowB=BRow(compiled[1].report);
 expect(rowA).toBeDefined();expect(rowB).toBeDefined();
 expect(rowA[1]).toEqual({kind:'text',value:'Active'});expect(rowB[1]).toEqual({kind:'text',value:'BelowThreshold'});
 expect(rowB[2]).toEqual(q(117,317));
 expect(readQ(rowA[2]).compare(readQ(f(dice,2n)))).toBeGreaterThan(0);
 expect(a.ns).toHaveLength(2);expect(b.ns).toHaveLength(1);
 const added=rec(a.ns.find(v=>key(f(rec(f(rec(v,407n),1n),404n),3n))===key(f(rec(taskB,371n),2n)))!,407n);
 expect(f(rec(f(added,2n),406n),1n)).toEqual(q(117,317));
 expect(f(added,5n)).toEqual(signed(0));expect(f(added,6n)).toEqual(signed(0));
 expect(readQ(f(rec(f(added,2n),406n),2n)).numerator).toBeLessThan(0n);
 expect(absolute(readQ(f(rec(f(added,2n),406n),2n)))).toEqual(readQ(q(1163075625,289372632533)));
 correspondence(a,eligible.b.s);correspondence(b,excluded.b.s);
 expect(a.probabilities).toEqual([q(55,64),q(9,64)]);
 expect(b.probabilities).toEqual([q(1,1),q(0,1)]);
 expect(f(a.data,1n)).toEqual(f(b.data,1n));
 expect(transcript(a.data)).toHaveLength(0);expect(transcript(b.data)).toHaveLength(0);
 expect(items(f(a.trace,11n),'list').map(v=>f(rec(v,147n),2n))).toEqual([statePathValue(fp)]);
 for(const p of [a,b])expect(p.traces.some(t=>key(f(t,12n))===key(p.raw)),'actual compiler consumes raw').toBe(true);
 console.info('M90 NATIVE PASS '+JSON.stringify({P:fraction(a.formation.P),base:fraction(readQ(rowB[2])),eligibleRelevance:fraction(readQ(rowA[2])),threshold:'37/100',nuclei:[a.ns.length,b.ns.length],probabilities:[a,b].map(p=>p.probabilities.map(v=>fraction(readQ(v)))),mode:'Auto',sameChosen:true,draws:0,negativeStandingActivates:true,allOtherRawSourcesEqual:true}));
},570000);
it('M90 hidden diagnostic: unchanged evidence preserves learning and decisions',async()=>{
 const a=eligible??await createProbe(),hidden=await createProbe(false,true),p=mapping(a.run),h=mapping(hidden.run);
 expect(p.formation).toEqual(h.formation);expect(p.journal).toEqual(h.journal);
 expect(p.raw).toEqual(h.raw);expect(p.data).toEqual(h.data);
 console.info('M90 HIDDEN PASS actual qualification, disposition, sources and decision unchanged');
},570000);
it('M90 persistence: exact continuation and post-standing atomic rollback',async()=>{
 const a=await createProbe(false,false,10n),b=await createProbe(false,false,10n);exact(a.run,b.run);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 const checkpoints:bigint[]=[];let witnessed=false;
 for(let n=0;;n++){
  expect(n).toBeLessThan(32);const results=[];
  for(const run of [a.run,b.run,restored])results.push(await run.settleNextInstant());
  expect(results[1]).toBe(results[0]);expect(results[2]).toBe(results[0]);
  const x=a.run.snapshot();for(const run of [b.run,restored]){
   const y=run.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);
   for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);
   bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());
  }
  if(!results[0])break;checkpoints.push(x.clock);
  if(x.clock===12n){
   witnessed=true;
   // Direct settling bypasses through()'s snapshot-cache invalidation. Read x,
   // the current snapshot already used for every exact-byte comparison above.
   const decision=items(decode(x.outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&key(f(v,2n))===key(signed(12)));
   expect(decision,'current settled decision12').toBeDefined();
   const status=rec(f(rec(decision!,409n),4n),419n);expect(uint(f(status,1n))).toBe(3n);
   expect(items(f(rec(f(status,2n),420n),2n),'list').map(v=>f(rec(v,421n),2n))).toEqual([q(55,64),q(9,64)]);
  }
 }
 expect(witnessed).toBe(true);expect(a.run.snapshot().clock).toBe(101n);
 for(const run of [a.run,b.run,restored])expect(run.diagnostic()).toBeUndefined();
 const fault=await createProbe(false,false,11n),before=fault.run.snapshot(),original=formation.formationSignals;let reached=false;
 const spy=vi.spyOn(formation,'formationSignals').mockImplementation((...args)=>{
  const output=original(...args);if(standing(output.output).length){reached=true;throw Error('M90 after standing source');}return output;
 });
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M90 after standing source');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);
 console.info('M90 PERSISTENCE PASS repeat10 and restore10 every settlement '+checkpoints.join(',')+'; post-standing atomic rollback');
},570000);
