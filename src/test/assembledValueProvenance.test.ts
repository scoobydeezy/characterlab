import {it,expect,vi} from 'vitest';
import {record,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileCharacterModel} from '../assembled/model';
import {cognitiveRecord as r} from '../assembled/codecs';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {valueMotive,valueRaw,VALUE_MOTIVE_PROVENANCE} from '../assembled/valueReceiving';
import * as receiving from '../assembled/valueReceiving';
import {VALUES_APPRAISAL} from '../assembled/values';
import {nativeProjection} from './fixtures/assembledReasonCorrespondence';
import {transcript} from './fixtures/assembledDecisionAlternatives';
import {exact,bytes} from './fixtures/assembledAffectReceiving';
import {fixture,create,capture,citation,reports,snap,through,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed} from './fixtures/assembledValueProvenance';
let learned:Awaited<ReturnType<typeof create>>,unlinked:Awaited<ReturnType<typeof create>>;
it('M87 native: actual learned receipts support the later Value and change probabilities',async()=>{
 learned=await create();unlinked=await create(false);const legacy=await create(true,true,false,true);
 for(const run of [learned.run,unlinked.run,legacy.run]){const first=capture(run,10n);expect(first.value).toHaveLength(0);expect(f(rec(f(first.data,1n),395n),2n)).toEqual({kind:'typedIdentifier',namespaceId:1027n,payload:text('definition/protocol-contact-one')});}
 const a=citation(learned.run),b=capture(unlinked.run),c=capture(legacy.run);
 const bm=reports(unlinked.run,VALUE_MOTIVE_PROVENANCE).find(v=>uint(items(v[7],'list')[2])===12n)!;expect(bm[4]).toEqual(q(0,1));expect(items(bm[8],'list')).toEqual([]);expect(b.value).toHaveLength(0);
 expect(a.probabilities).not.toEqual(b.probabilities);expect(a.probabilities).toEqual(c.probabilities);
 expect(key(set(a.ns.map(nativeProjection)))).toBe(key(set(c.ns.map(nativeProjection))));
 expect(f(rec(a.value[0],402n),2n)).toEqual(f(rec(c.value[0],402n),2n));expect(f(rec(f(rec(c.value[0],402n),3n),400n),1n)).toEqual({kind:'map',entries:[]});
 expect(f(a.raw,3n)).toEqual(f(c.raw,3n));expect(uint(f(a.data,8n))).toBe(uint(f(c.data,8n)));
 console.info('M87 NATIVE '+JSON.stringify({probabilities:a.probabilities.map(key),unlinked:b.probabilities.map(key),mode:Number(uint(f(a.data,8n))),draws:transcript(a.data).length,unlinkedDraws:transcript(b.data).length,legacyEqual:true,receiptCount:a.receipts.length}));
},570000);
it('M87 privacy and grammar: absent evidence stays absent; only exact prior receipts are cited',async()=>{
 const hidden=await create(true,true,true),denied=await create(true,false),normal=learned??await create();
 const a=citation(normal.run),b=citation(hidden.run),c=capture(denied.run);expect(a.value).toEqual(b.value);expect(a.probabilities).toEqual(b.probabilities);expect(c.value).toHaveLength(0);
 expect(reports(denied.run,VALUE_MOTIVE_PROVENANCE).find(v=>uint(items(v[7],'list')[2])===12n)![4]).toEqual(q(0,1));
 const model=await compileCharacterModel(normal.b.s),app=a.m[7],config=model.values!,receipt=items(a.receipts[0],'list'),observation=items(receipt[0],'list');
 expect(valueMotive(app,config,a.receipts)).toEqual(list(a.m));
 const mutate=(i:number,v:CanonicalValue)=>list([list(observation.map((x,j)=>j===i?v:x)),true]);
 for(const invalid of [[...a.receipts,...a.receipts],[list([receipt[0],false])],[mutate(2,u(12))],[mutate(1,typedIdentifier(1115,u(1)))],[mutate(3,list([]))],[]])expect(()=>valueMotive(app,config,invalid)).toThrow();
 const changed=[...items(app,'list')];changed[5]=q(1,3);expect(()=>valueMotive(list(changed),config,a.receipts)).toThrow('fold');
 expect(()=>r(399,[u(3),typedIdentifier(1115,u(1))],2)).toThrow('receipt atom');expect(()=>r(399,[u(3),typedIdentifier(1164,u(0))],2)).toThrow('receipt atom');expect(()=>r(399,[u(2),typedIdentifier(1164,u(1))],2)).toThrow('receipt atom');
 const old=await compileCharacterModel(fixture(true,true,false,true).s);expect(()=>old.content.validateRecordRoles(enc(a.raw))).toThrow('successor model');expect(()=>old.content.validateRecordRoles(enc(a.atom))).toThrow('successor model');expect(decode(enc(a.raw))).toEqual(a.raw);
 expect(()=>valueRaw(a.raw,list([]))).toThrow('Value motive domain');
 const wrong=[...a.m];wrong[4]=q(1,3);expect(()=>valueRaw(a.raw,list(wrong))).toThrow('association');
 console.info('M87 PRIVACY/GRAMMAR PASS hidden diagnostic equality; denied report no Value; exact prior linked/task/fold/identity support; old nested admission rejects');
},570000);
it('M87 persistence and rollback: cited evidence survives exact continuation without partial source commits',async()=>{
 const a=await create(true,true,false,false,11n),b=await create(true,true,false,false,11n);exact(a.run,b.run);
 const resumed=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,resumed);
 for(const run of [a.run,b.run,resumed])await through(run,12n);exact(a.run,b.run);exact(a.run,resumed);citation(a.run);
 const continued:bigint[]=[];
 for(let n=0;;n++){
  expect(n).toBeLessThan(32);const settled=[];for(const run of [a.run,b.run,resumed])settled.push(await run.settleNextInstant());
  expect(settled[1]).toBe(settled[0]);expect(settled[2]).toBe(settled[0]);const x=a.run.snapshot();
  for(const run of [b.run,resumed]){const y=run.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());}
  if(!settled[0])break;continued.push(x.clock);
 }
 expect(a.run.snapshot().clock).toBe(101n);for(const run of [a.run,b.run,resumed])expect(run.diagnostic()).toBeUndefined();
 console.info('M87 exact remaining settled checkpoints '+continued.join(','));
 const fault=await create(true,true,false,false,11n),before=fault.run.snapshot(),original=receiving.valueRaw;let called=false;
 const spy=vi.spyOn(receiving,'valueRaw').mockImplementation((...args)=>{const result=original(...args);if(items(args[1],'list').length===9&&uint(items(items(args[1],'list')[7],'list')[2])===12n){called=true;throw Error('M87 after cited raw');}return result;});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M87 after cited raw');}finally{spy.mockRestore();}
 expect(called).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);expect(()=>fault.run.save()).toThrow('only an active quiescent run');
 console.info('M87 PERSISTENCE PASS repeat11/restore11->12->terminal101 exact state/output/trace/save; post-source failure rolls whole instant back');
},570000);
