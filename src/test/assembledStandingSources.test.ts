import {it,expect,vi} from 'vitest';
import {restoreCharacterRun,prepareCharacterModel} from '../assembled/character';
import {statePathValue} from '../substrate/state';
import {absolute,bounded} from '../campaign2/cognitiveMath';
import * as formation from '../assembled/formation';
import {exact,bytes} from './fixtures/assembledAffectReceiving';
import {transcript} from './fixtures/assembledDecisionAlternatives';
import {fixture,ablateStanding,create,capture,mapping,learned,standing,withoutStanding,correspondence,snap,through,rec,f,uint,q,list,set,text,u,signed,key,items,Q,readQ,qValue,definition,fp,jp} from './fixtures/assembledStandingSources';
let enabled:Awaited<ReturnType<typeof create>>;
it('M89 native mapping: earned standing reaches the current decision but its sampled modifier is zero',async()=>{
 enabled=await create();const a=mapping(enabled.run),la=learned(enabled.run),before=enabled.run.snapshot(),save=enabled.run.save();
 const b=await ablateStanding(a,enabled.b.s);
 const after=enabled.run.snapshot();for(const k of ['state','outputs','trace'] as const)bytes(before[k],after[k]);bytes(save,enabled.run.save());
 await expect(prepareCharacterModel(fixture(false).s)).rejects.toThrow('undeclared topology change');
 expect(standing(b.raw)).toHaveLength(0);expect(withoutStanding(a.raw)).toEqual(withoutStanding(b.raw));expect(f(a.raw,4n)).toEqual(f(b.raw,4n));
 const firstA=capture(enabled.run,10n);expect(standing(firstA.raw)).toHaveLength(0);
 expect(a.value).toHaveLength(0);expect(b.value).toHaveLength(0);expect(a.ns).toHaveLength(2);expect(b.ns).toHaveLength(2);
 correspondence(a,enabled.b.s);correspondence(b,enabled.b.s);
 const dice=rec(definition(enabled.b.s),437n);expect(f(rec(f(dice,3n),439n),1n)).toEqual(q(1,4));
 expect(absolute(la.formation.P).compare(Q.of(1n,2n))).toBeLessThanOrEqual(0);
 for(const meaning of a.semantics.values())expect(absolute(meaning).compare(Q.of(1n))).toBeLessThan(0);
 for(const n0 of a.ns){
  const n=rec(n0,407n),other=rec(b.ns.find(v=>key(f(rec(v,407n),1n))===key(f(n,1n)))!,407n),roles=rec(f(n,2n),406n),old=rec(f(other,2n),406n);
  for(const field of [1n,3n,5n])expect(f(roles,field)).toEqual(f(old,field));
  expect(readQ(f(roles,2n)).numerator).not.toBe(0n);expect(absolute(readQ(f(roles,2n))).compare(Q.of(1n,4n))).toBeLessThan(0);
  expect(readQ(f(n,3n)).compare(readQ(f(other,3n)))).toBeGreaterThan(0);
  for(const field of [4n,5n,6n,7n,8n])expect(f(n,field)).toEqual(f(other,field));expect(f(n,5n)).toEqual(signed(0));
 }
 expect(b.data).toEqual(a.data);expect(uint(f(a.data,8n))).toBe(1n);expect(b.usedDraws).toBe(0);expect(transcript(a.data)).toEqual(transcript(b.data));
 expect(items(f(a.trace,11n),'list').map(v=>f(rec(v,147n),2n))).toEqual([statePathValue(fp)]);
 for(const t of a.traces.filter(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(12))&&uint(f(rec(f(t,4n),130n),3n))===80n))
  expect(items(f(t,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue({...jp,fieldId:1n})))).toBe(false);
 const frac=(v:ReturnType<typeof readQ>)=>v.numerator+'/'+v.denominator;
 console.info('M89 APPROVED CAPTURED-INPUT '+JSON.stringify({qualification:frac(readQ(a.qualification.contribution)),phase:String(uint(items(a.formation.entries[0],'list')[3])),P:frac(a.formation.P),oldFold:frac(a.originalFold.strength),nativeStanding:standing(a.raw).map(v=>frac(readQ(f(rec(v,402n),2n)))),originalStanding:a.control.map(v=>frac(readQ(v))),probabilities:a.probabilities.map(v=>frac(readQ(v))),mode:String(uint(f(a.data,8n))),draws:transcript(a.data).length,firstDraws:transcript(firstA.data).length,standingModifier:0,choiceEffect:false,controlKind:'captured-input-only',disabledModelRejected:true}));
},570000);
it('M89 controls: pressure and hidden diagnostics preserve qualification authority and original history mapping',async()=>{
 const a=enabled??await create(),hidden=await create(true,false,true),pressured=await create(true,true),p=mapping(a.run),h=mapping(hidden.run),z=capture(pressured.run);
 expect(p.formation).toEqual(h.formation);expect(p.journal).toEqual(h.journal);expect(p.raw).toEqual(h.raw);expect(p.data).toEqual(h.data);
 expect(learned(pressured.run).formation.entries).toHaveLength(0);expect(learned(pressured.run).journal).toHaveLength(0);expect(standing(z.raw)).toHaveLength(0);
 const first=capture(pressured.run,10n);expect(first.d).toEqual(capture(a.run,10n).d);expect(transcript(first.data)).toEqual(transcript(capture(a.run,10n).data));
 // Exact bound: finite bounded meanings give |x|<2, hence |a|<2/3.
 // With |P|<=1/2: |P*a|<1/3 and bounded |P*a|<1/4. No rounding search.
 const limit=bounded(Q.of(1n,3n));expect(limit).toEqual(Q.of(1n,4n));
 for(const signal of standing(p.raw)){const strength=absolute(readQ(f(rec(signal,402n),2n)));expect(strength.compare(Q.of(1n,3n))).toBeLessThan(0);expect(bounded(strength).compare(limit)).toBeLessThan(0);}
 console.info('M89 SOURCE '+JSON.stringify({qualification:key(p.qualification.contribution),phase:String(uint(items(p.formation.entries[0],'list')[3])),P:key(qValue(p.formation.P)),oldFold:key(qValue(p.originalFold.strength)),standing:standing(p.raw).map(v=>key(f(rec(v,402n),2n))),modifiers:p.ns.map(v=>key(f(rec(v,407n),5n))),probabilities:p.probabilities.map(key),mode:String(uint(f(p.data,8n)))}));
 console.info('M89 CONTROLS PASS hidden diagnostic equality; pressure excludes formation despite same first choice; empty original history rejects. Conditional bound excludes sampled modifier, NOT relevance rescue or another standing source.');
},570000);
it('M89 persistence: source correspondence survives exact continuation and atomic rollback',async()=>{
 const a=await create(true,false,false,10n),b=await create(true,false,false,10n);exact(a.run,b.run);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 const checkpoints:bigint[]=[];let mapped=false;
 for(let n=0;;n++){
  expect(n).toBeLessThan(32);const results=[];for(const run of [a.run,b.run,restored])results.push(await run.settleNextInstant());expect(results[1]).toBe(results[0]);expect(results[2]).toBe(results[0]);
  const x=a.run.snapshot();for(const run of [b.run,restored]){const y=run.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());}
  if(!results[0])break;checkpoints.push(x.clock);if(x.clock===12n)mapped=true;
 }
 expect(mapped).toBe(true);expect(a.run.snapshot().clock).toBe(101n);for(const run of [a.run,b.run,restored])expect(run.diagnostic()).toBeUndefined();
 const fault=await create(true,false,false,11n),before=fault.run.snapshot(),original=formation.formationSignals;let reached=false;
 const spy=vi.spyOn(formation,'formationSignals').mockImplementation((...args)=>{const output=original(...args);if(standing(output.output).length){reached=true;throw Error('M89 after earned standing source');}return output;});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M89 after earned standing source');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);
 console.info('M89 PERSISTENCE PASS repeat10; restore10 every settled instant '+checkpoints.join(',')+'; post-source whole-instant rollback');
},570000);
