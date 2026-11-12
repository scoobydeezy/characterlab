import {it,expect,vi} from 'vitest';
import {compileCharacterModel,CONTEXT_REASON_RULES,CONTEXT_REASON_REGISTRY} from '../assembled/model';
import {restoreCharacterRun} from '../assembled/character';
import * as reasons from '../assembled/reasons';
import {fixture as evidence} from './fixtures/assembledReasonEvidence';
import {fixture as context,sourceCorrespondence as contextSource,projection} from './fixtures/assembledContextReasons';
import {mapping,learned,standing,withoutStanding} from './fixtures/assembledStandingSources';
import {exact,bytes} from './fixtures/assembledAffectReceiving';
import {promote,create,capture,sourceCorrespondence,standingProbe,replace,snap,through,decode,enc,items,key,rec,r,f,uint,q,list,set,text,u,signed,definition} from './fixtures/assembledReasonReference';
let collective:Awaited<ReturnType<typeof create>>;
it('M94 collective: one reference retains full support without redundant weight',async()=>{
 const a=await create(promote(evidence(2)));collective=await create(promote(evidence(3)));
 const b=capture(collective.run,collective.b.s),p=capture(a.run,a.b.s);sourceCorrespondence(b);
 expect(b.samples).toHaveLength(2);expect(b.produced).toHaveLength(3);expect(p.produced).toHaveLength(2);
 expect(set(p.ns.map(projection))).toEqual(set(b.ns.map(projection)));expect(p.probabilities).toEqual(b.probabilities);expect(b.probabilities).toEqual([q(55,64),q(9,64)]);
 const coverage=b.groups.flatMap(g=>items(g[3],'list').map(v=>items(v,'list'))),combined=coverage.find(v=>key(items(v[0],'list')[0])===key(text('combined')))!;
 expect(combined).toBeDefined();expect(combined[4]).toEqual(q(1,1));expect(combined[6]).toEqual(q(0,1));
 const legacy={...collective.b,s:{...collective.b.s,rulesVersion:CONTEXT_REASON_RULES,registrySchemaVersion:CONTEXT_REASON_REGISTRY}},old=await create(legacy);
 const {capture:decision}=await import('./fixtures/assembledValueProvenance');const prior=decision(old.run,10n);
 expect(prior.raw).toEqual(b.raw);expect(f(rec(f(rec(prior.ns[0],407n),2n),406n),1n)).toEqual(q(257,377));
 expect(f(rec(f(rec(b.ns[0],407n),2n),406n),1n)).toEqual(q(121,181));
 const permuted=replace(b.raw,6n,list([...items(f(b.raw,6n),'list')].reverse()));expect(reasons.compileDescribedReasons(permuted,definition(collective.b.s),3,'SourceCoverage',true)).toEqual(b.compiled);
 console.info('M94 COLLECTIVE PASS residual0 base121/181; old0.79 base257/377 on identical sources; ordinary input permutation exact');
},570000);
it('M94 connected: context and earned standing still influence the actual decision',async()=>{
 const a=await create(promote(context())),b=await create(promote(context(true))),p=capture(a.run,a.b.s),z=capture(b.run,b.b.s);
 contextSource(p);expect(p.probabilities).not.toEqual(z.probabilities);
 expect(p.ns.map(v=>f(rec(f(rec(v,407n),2n),406n),5n))).toContainEqual(q(-1,5));expect(p.ns.map(v=>f(rec(v,407n),8n))).toContainEqual(signed(-2));
 const yes=await create(standingProbe(),12n),no=await create(standingProbe(true),12n),y=capture(yes.run,yes.b.s,12n),n=capture(no.run,no.b.s,12n);
 const history=mapping(yes.run);expect(history.formation.entries).toHaveLength(1);expect(learned(no.run).formation.entries).toHaveLength(0);
 expect(standing(n.raw)).toHaveLength(0);expect(withoutStanding(y.raw)).toEqual(withoutStanding(n.raw));
 expect(y.ns).toHaveLength(2);expect(n.ns).toHaveLength(1);expect(y.probabilities).toEqual([q(55,64),q(9,64)]);expect(n.probabilities).toEqual([q(1,1),q(0,1)]);
 console.info('M94 CONNECTED PASS context distinct -1/5/-2 changes probability; genuine D3 standing rescues weak reason, B0 ->9/64');
},570000);
it('M94 boundaries: hidden truth, denied evidence and version bundles',async()=>{
 const b=collective??await create(promote(evidence())),p=capture(b.run,b.b.s);
 const hidden=await create(promote(evidence(3,[true,true],true))),denied=await create(promote(evidence(3,[false,false]))),h=capture(hidden.run,hidden.b.s),d=capture(denied.run,denied.b.s);
 expect(h.raw).toEqual(p.raw);expect(h.data).toEqual(p.data);expect(d.produced).toHaveLength(0);expect(d.rejected).toHaveLength(3);expect(d.probabilities).toEqual([q(23,32),q(9,32)]);
 const model=await compileCharacterModel(b.b.s);expect([model.referenceReasons,model.sourceCoverage,model.contextReasons,model.valueProvenance]).toEqual([true,true,true,true]);
 await expect(compileCharacterModel({...b.b.s,registrySchemaVersion:CONTEXT_REASON_REGISTRY})).rejects.toThrow('version bundle');
 for(const value of [p.raw,...p.ns])model.content.validateRecordRoles(enc(value));
 console.info('M94 BOUNDARIES PASS hidden cognition exact; denial changes probability; closed0.80 bundle');
},570000);
it('M94 persistence: every settlement and whole-instant rollback',async()=>{
 for(const [fixture,at] of [[promote(evidence()),9n],[standingProbe(),10n]] as const){
  const a=await create(fixture,at),b=await create(fixture,at);exact(a.run,b.run);
  const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
  const clocks:bigint[]=[];
  for(let i=0;;i++){expect(i).toBeLessThan(32);const steps=[];for(const run of [a.run,b.run,restored])steps.push(await run.settleNextInstant());expect(steps[1]).toBe(steps[0]);expect(steps[2]).toBe(steps[0]);
   const x=a.run.snapshot();for(const run of [b.run,restored]){const y=run.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());}
   if(!steps[0])break;clocks.push(x.clock);
  }expect(a.run.snapshot().clock).toBe(101n);console.info('M94 CONTINUATION '+at+' -> '+clocks.join(','));
 }
 const fault=await create(promote(evidence()),9n),before=fault.run.snapshot(),original=reasons.compileDescribedReasons;let reached=false;
 const spy=vi.spyOn(reasons,'compileDescribedReasons').mockImplementation((...args)=>{const result=original(...args);reached=true;throw Error('M94 after compilation');});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M94 after compilation');}finally{spy.mockRestore();}
 expect(reached).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);
 console.info('M94 ROLLBACK PASS complete instant');
},570000);
