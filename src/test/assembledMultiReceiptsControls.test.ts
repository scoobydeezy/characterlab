import {it,expect,vi} from 'vitest';
import {createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import * as producer from '../assembled/receiptReasonSources';
import * as receiver from '../assembled/reasons';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {fixture,upgrade,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,exact,u,set} from './fixtures/assembledMultiReceipts';
import {fixture as social} from './fixtures/assembledSocialWitness';
import {rows,originalCorrespondence} from './fixtures/assembledMultiComparison';
import {start,through,capture} from './assembledMultiReceipts.test';
it('boundary150: denied and hidden evidence, opposite sign and zero remain distinct',async()=>{
 const base=await start('first'),hidden=await start('first',true,false),denied=await start('first',false),negative=await start('negative'),zero=await start('zero');
 for(const x of[base,hidden,denied,negative,zero])await through(x.r,8n);
 const [a,h,d,n,z]=[base,hidden,denied,negative,zero].map(x=>capture(x.r,x.b));
 expect(originalCorrespondence(a.raw,base.b.s),'complete original-domain comparison includes both genuine families').toBeGreaterThan(0);
 expect(h.raw).toEqual(a.raw);expect(h.data).toEqual(a.data);
 expect(d.tag(PERFORMANCE_OBS)).toHaveLength(0);expect(d.produced).toHaveLength(0);expect(d.rejected.map(v=>items(v,'list')[1])).toContainEqual(text('MissingEvidence'));
 expect(z.produced).toHaveLength(0);expect(z.rejected.map(v=>items(v,'list')[1])).toContainEqual(text('Zero'));
 const neg=rows(n.raw).find(r=>key(r.d[0])===key(text('receiptFirst')))!;expect(neg.strength).toEqual(readQ(q(-3,4)));expect(neg.basis).toEqual(rows(a.raw).find(r=>key(r.d[0])===key(text('receiptFirst')))!.basis);
 expect(n.probabilities).not.toEqual(a.probabilities);expect(z.probabilities).not.toEqual(a.probabilities);
 console.info('M150 BOUNDARY PASS hidden raw/decision exact; denied missing; knownZero separate; opposite sign reaches probability',a.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),n.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),z.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator));
},590000);
it('continuation150: repeat and save6 preserve all settled bytes through the full calendar',async()=>{
 const x=await start(),repeat=await createCharacterRun(x.m,x.b.d);await through(x.r,6n);await through(repeat,6n);exact(x.r,repeat);
 const acquired=restoreAuthoritativeState(decode(x.r.snapshot().state)),initial=restoreAuthoritativeState(decode(x.b.d.initialState)),receiptEntry=acquired.entries().find(e=>e.path.rootStateTypeId===1000n&&e.path.fieldId===3n)!;expect(receiptEntry).toBeDefined();await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),receiptEntry]).canonicalValue())})).rejects.toThrow('initial strategy state must be absent');
 const early=items(decode(x.r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(producer.RECEIPT_REASONS))).map(v=>items(v,'list'));expect(items(early.find(v=>key(v[1])===key(signed(4)))![2],'list')).toHaveLength(0);const at6=items(early.find(v=>key(v[1])===key(signed(6)))![2],'list');expect(at6).toHaveLength(1);expect(items(items(items(at6[0],'list')[2],'list')[0],'list')[2]).toEqual(u(4));
 const restored=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()});exact(x.r,restored);
 let done=false;for(let n=0;n<96;n++){const more=await x.r.settleNextInstant();for(const r of[repeat,restored]){expect(await r.settleNextInstant()).toBe(more);exact(x.r,r);}if(!more){done=true;break;}}
 expect(done).toBe(true);expect(x.r.snapshot().clock).toBe(101n);capture(x.r,x.b);console.info('M150 CONTINUATION PASS repeat/save6, every state/output/trace/save through101');
},590000);
it('rollback150: raw-source and receiving faults restore the whole instant',async()=>{
 const x=await start();await through(x.r,6n);const save=x.r.save();
 for(const which of ['raw','receiving'] as const){const r=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}),originalRaw=producer.receiptReasonSources,originalReceiver=receiver.compileDescribedReasons;let reached=false;
  const spy=which==='raw'?vi.spyOn(producer,'receiptReasonSources').mockImplementation((...args)=>{const result=originalRaw(...args);if(args[1].dueAt===8n){reached=true;throw Error('M150 raw fault');}return result;}):vi.spyOn(receiver,'compileDescribedReasons').mockImplementation((...args)=>{const result=originalReceiver(...args);reached=true;throw Error('M150 receiving fault');});
  try{for(let n=0;n<96&&!reached;n++){const before=r.snapshot();try{expect(await r.settleNextInstant()).toBe(true);}catch(error){expect(String(error)).toContain('M150 '+which+' fault');expect({...r.snapshot(),status:before.status}).toEqual(before);}}}finally{spy.mockRestore();}expect(reached).toBe(true);
 }
 console.info('M150 ROLLBACK PASS both raw and receiver boundaries');
},590000);
it('admission150: closed source grammar, prior-time provenance and retained SOCIAL on successor',async()=>{
 const b=fixture(),compiled=await compileCharacterModel(b.s),slots=items(decode(b.s.registry),'list'),declaration=items(slots[51],'list'),descriptor=items(items(declaration[1],'list')[0],'list');
 const check=(v:typeof slots[number])=>producer.compileReceiptReasonSources(v,compiled.strategy!,[...compiled.reasonDescriptions!,...compiled.reasonEvidence!.map(d=>d.label)]);
 for(const d of [descriptor.map((v,i)=>i===0?text('primary'):v),descriptor.map((v,i)=>i===4?set([]):v),descriptor.map((v,i)=>i===4?set([u(8)]):v),descriptor.map((v,i)=>i===5?q(2,1):v),descriptor.map((v,i)=>i===6?u(2):v)])expect(()=>check(list([declaration[0],list([list(d)])]))).toThrow();
 expect(()=>check(list([declaration[0],list([list(descriptor),list(descriptor)])]))).toThrow();
 const old=social(),current=upgrade(old),m=await import('../assembled/character'),r=await m.createCharacterRun(await m.prepareCharacterModel(current.s),current.d);await through(r,6n);
 const {restoreAuthoritativeState}=await import('../substrate/state'),{personPath,personMean}=await import('../assembled/social'),s=await compileCharacterModel(current.s),state=restoreAuthoritativeState(decode(r.snapshot().state)),means=s.socialWitness!.observers.map(o=>personMean(state.read(personPath(o.holder,o.target)).value));
 expect(means).toEqual([readQ(q(2,3)),ZERO]);expect(outputs(r.snapshot().outputs,433n).length).toBeGreaterThan(0);
 console.info('M150 ADMISSION/SOCIAL PASS invalid declarations rejected; same0.112 recipient2/3 vs0; actual main decisions retained');
},590000);

it('family150: only acquired Value linkage changes the second family, never the shared fact',async()=>{
 const yes=await start('last'),no=await start('last',true,true,false);for(const x of[yes,no])await through(x.r,8n);const a=capture(yes.r,yes.b),b=capture(no.r,no.b);
 expect(b.tag(PERFORMANCE_OBS)).toEqual(a.tag(PERFORMANCE_OBS));expect(f(b.raw,3n)).toEqual(f(a.raw,3n));expect(items(f(a.raw,5n),'set')).toHaveLength(1);expect(items(f(b.raw,5n),'set')).toHaveLength(0);
 expect(a.probabilities).not.toEqual(b.probabilities);expect(a.analytical.mode).toBe('Auto');expect(b.analytical.mode).toBe('PlayerFacingRoll');
 console.info('M150 FAMILY PASS identical permitted receipts and Commitment signals; Value only present/absent; native probabilities',a.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),b.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),'modes',a.analytical.mode,b.analytical.mode);
},590000);
