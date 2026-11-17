import {it,expect,vi} from 'vitest';
import {createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {personPath,personMean,PERSON_OWNER} from '../assembled/social';
import * as relationship from '../assembled/relationship';
import {compileRelationshipModel,relationshipRecipe} from '../campaign3/relationshipModel';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u} from './fixtures/assembledRelationshipCompletion';
import {correspondence,alternatives} from './fixtures/assembledRelationshipComparison';
import {start,state,history,reports,at,effective} from './assembledRelationshipCompletion.test';
import {capture,through} from './assembledMultiReceipts.test';
it('comparison151: native owned receipts preserve original fold, cache/refold equivalence and person-only failure',async()=>{
 const x=await start(),old=await compileRelationshipModel(relationshipRecipe({law:2}));await through(x.r,9n);
 for(const instant of[4,7,9]){const report=at(x,instant),h=items(report[3],'list').length?report[3]:undefined,c=correspondence(h,old.settings),p=capture(x.r,x.b,BigInt(instant)),a=alternatives(p.raw,report,c.cached,x.b.s);
  expect(a.stored.nuclei).toEqual(p.ns);expect(a.stored.analysis).toEqual(p.analytical);
  expect(a.personOnly.analysis.probabilities).not.toEqual(p.analytical.probabilities);
  if(instant===9){expect(f(c.sticky,2n)).toBe(true);expect(c.cached.rupture).toBe(false);}
 }
 const ts=outputs(x.r.snapshot().trace,160n),owned=ts.flatMap(t=>items(f(t,11n),'list').map(v=>rec(v,147n))).filter(r=>uint(f(rec(f(r,2n),140n),1n))===848n);expect(owned.length).toBeGreaterThan(0);
 const component=await compileCharacterState(await compileCharacterModel(x.b.s)),h=history(x)!,path=relationship.relationshipPath(C,target),initial=component.initialState(x.b.d.initialState);
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path,expected:{presence:false},newValue:h}]},PERSON_OWNER)).toThrow();
 expect(()=>component.stateModel.read(state(x),relationship.relationshipPath(target,C))).toThrow('foreign path');
 expect(()=>component.stateModel.applyPatch(state(x),{operations:[{kind:'set',path,expected:{presence:true,value:h},newValue:h}]},relationship.REL_OWNER)).toThrow('history rewrite');
 await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value:h}]).canonicalValue())})).rejects.toThrow('initial');
 console.info('M151 COMPARISON PASS actual history -> original LatestInteraction fold; cached/refold same native nuclei/probability; person-only fails all3 probes; StickyRupture retained; authority/foreign/S0 rejected');
},590000);
it('boundary151: hidden kind, denied participation, explanation and contact controls retain distinct causes',async()=>{
 const base=await start(),hidden=await start('hidden'),denied=await start('denied'),negative=await start('negativeExplanation'),contact=await start('contact');
 for(const x of[base,hidden,denied,negative,contact])await through(x.r,11n);
 bytes(base.r.snapshot().state,hidden.r.snapshot().state);for(const instant of[4,7,9])expect(capture(hidden.r,hidden.b,BigInt(instant)).data).toEqual(capture(base.r,base.b,BigInt(instant)).data);
 expect(history(denied)).toBeUndefined();expect(personMean(state(denied).read(personPath(C,target)).value)).toEqual(personMean(state(base).read(personPath(C,target)).value));
 expect(at(negative,7)[5]).toBe(true);expect(at(base,7)[5]).toBe(true);expect(personMean(state(negative).read(personPath(C,target)).value)).toEqual(Q.of(1n,2n));expect(personMean(state(base).read(personPath(C,target)).value)).toEqual(Q.of(3n,4n));
 expect(history(contact)).toEqual(history(base));expect(at(contact,11)[7]).toBe(true);expect(at(contact,11)[8]).toBe(false);expect(at(base,11)[7]).toBe(false);expect(at(base,11)[8]).toBe(true);
 console.info('M151 BOUNDARY PASS hidden full state/native decisions exact; denied history absent/person equal; explanation changes belief not rupture; contact-only changes feasibility/missing signal');
},590000);
it('persistence151: exact repeat and acquired/ruptured saves continue with every owned history through101',async()=>{
 const x=await start(),repeat=await createCharacterRun(x.m,x.b.d);for(let n=0;x.r.snapshot().clock<2n;n++){expect(n).toBeLessThan(96);expect(await x.r.settleNextInstant()).toBe(true);expect(await repeat.settleNextInstant()).toBe(true);exact(x.r,repeat);}
 const early=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()});exact(x.r,early);
 for(let n=0;x.r.snapshot().clock<7n;n++){expect(n).toBeLessThan(96);expect(await x.r.settleNextInstant()).toBe(true);for(const r of[repeat,early]){expect(await r.settleNextInstant()).toBe(true);exact(x.r,r);}}
 const late=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()});exact(x.r,late);let done=false;
 for(let n=0;n<96;n++){const more=await x.r.settleNextInstant();for(const r of[repeat,early,late]){expect(await r.settleNextInstant()).toBe(more);exact(x.r,r);}if(!more){done=true;break;}}
 expect(done).toBe(true);expect(x.r.snapshot().clock).toBe(101n);expect(relationship.relationshipHistory(history(x))).toHaveLength(4);
 console.info('M151 PERSISTENCE PASS repeat/save2/save7; full state/output/trace/save through101; own history retained');
},590000);
it('rollback151: failed receipt adoption leaves the whole prior instant and history unchanged',async()=>{
 const x=await start();await through(x.r,4n);const before=x.r.snapshot(),original=relationship.appendRelationship;let reached=false;
 const spy=vi.spyOn(relationship,'appendRelationship').mockImplementation((...args)=>{const value=original(...args);reached=true;throw Error('M151 after relationship append');});
 try{await expect(x.r.settleNextInstant()).rejects.toThrow('M151 after relationship append');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...x.r.snapshot(),status:before.status}).toEqual(before);expect(relationship.relationshipHistory(history(x))).toHaveLength(2);
 console.info('M151 ROLLBACK PASS full instant5, earlier owned cooperation retained');
},590000);
