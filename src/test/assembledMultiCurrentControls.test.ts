import {it,expect} from 'vitest';
import {start,fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,u,set,type CanonicalValue} from './fixtures/assembledMultiCurrent';
import {capture,through} from './assembledMultiReceipts.test';
import {rows,originalCorrespondence} from './fixtures/assembledMultiComparison';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {RECEIPT_REASONS} from '../assembled/receiptReasonSources';
it('multi223 evidence: denied and hidden evidence, opposite sign and zero remain distinct',async()=>{
 const base=await start('first'),hidden=await start('first',true,false),denied=await start('first',false),negative=await start('negative'),zero=await start('zero');
 for(const x of[base,hidden,denied,negative,zero])await through(x.r,8n);
 const [a,h,d,n,z]=[base,hidden,denied,negative,zero].map(x=>capture(x.r,x.b));
 expect(originalCorrespondence(a.raw,base.b.s),'complete original-domain comparison includes both genuine families').toBeGreaterThan(0);
 expect(h.raw).toEqual(a.raw);expect(h.data).toEqual(a.data);
 expect(d.tag(PERFORMANCE_OBS)).toHaveLength(0);expect(d.produced).toHaveLength(0);expect(d.rejected.map(v=>items(v,'list')[1])).toContainEqual(text('MissingEvidence'));
 expect(z.produced).toHaveLength(0);expect(z.rejected.map(v=>items(v,'list')[1])).toContainEqual(text('Zero'));
 const neg=rows(n.raw).find(r=>key(r.d[0])===key(text('receiptFirst')))!;expect(neg.strength).toEqual(readQ(q(-3,4)));expect(neg.basis).toEqual(rows(a.raw).find(r=>key(r.d[0])===key(text('receiptFirst')))!.basis);
 expect(n.probabilities).not.toEqual(a.probabilities);expect(z.probabilities).not.toEqual(a.probabilities);
 console.info('M223 BOUNDARY PASS hidden raw/decision exact; denied missing; knownZero separate; opposite sign reaches probability',a.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),n.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),z.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator));
},590000);
it('multi223 family: only acquired Value linkage changes the second family, never the shared fact',async()=>{
 const yes=await start('last'),no=await start('last',true,true,false);for(const x of[yes,no])await through(x.r,8n);const a=capture(yes.r,yes.b),b=capture(no.r,no.b);
 expect(b.tag(PERFORMANCE_OBS)).toEqual(a.tag(PERFORMANCE_OBS));expect(f(b.raw,3n)).toEqual(f(a.raw,3n));expect(items(f(a.raw,5n),'set')).toHaveLength(1);expect(items(f(b.raw,5n),'set')).toHaveLength(0);
 expect(a.probabilities).not.toEqual(b.probabilities);expect(a.analytical.mode).toBe('Auto');expect(b.analytical.mode).toBe('PlayerFacingRoll');
 for(const x of [yes,no]){
  const control=cachedMemory(await createCharacterRun(await prepareCharacterModel(x.b.old.s),x.b.old.d));await through(control,8n);const old=capture(control,x.b.old),now=capture(x.r,x.b);
  const semantic=(raw:CanonicalValue)=>rows(raw).map(r=>[r.d[0],r.family,r.ground,r.role.toString(),r.strength.numerator.toString(),r.strength.denominator.toString(),r.basis.size]).sort((x,y)=>JSON.stringify(x)<JSON.stringify(y)?-1:1);
  expect(semantic(now.raw)).toEqual(semantic(old.raw));expect(now.probabilities).toEqual(old.probabilities);expect(now.analytical.mode).toBe(old.analytical.mode);
  console.info('M223 VERSION CORRESPONDENCE',x.b.s.rulesVersion, 'same source labels/families/grounds/roles/strengths/support sizes and probabilities as0.112');
 }
 console.info('M223 FAMILY PASS identical permitted receipts and Commitment signals; Value only present/absent; native probabilities',a.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),b.analytical.probabilities.map(p=>p.probability.numerator+'/'+p.probability.denominator),'modes',a.analytical.mode,b.analytical.mode);
},590000);

it('multi223 absent descriptors differ from known-zero rejected support',async()=>{
 const x=await start('none');await through(x.r,8n);const p=capture(x.r,x.b);
 expect(p.produced).toHaveLength(0);expect(p.rejected).toHaveLength(0);expect(items(f(p.raw,5n),'set')).toHaveLength(1);
 console.info('M223 NONE PASS no descriptors/rejections, separately acquired Value still live');
},590000);
type Run=Awaited<ReturnType<typeof start>>['r'];
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:Run,b:Run)=>{const {state:xs,outputs:xo,trace:xt,...xm}=a.snapshot(),{state:ys,outputs:yo,trace:yt,...ym}=b.snapshot();expect(ym).toEqual(xm);bytes(xs,ys);bytes(xo,yo);bytes(xt,yt);bytes(a.save(),b.save());};
it('multi223 persistence keeps acquired sources and all settled bytes through terminal',async()=>{
 const x=await start(),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(x.r,6n);await through(repeat,6n);exact(x.r,repeat);
 const acquired=restoreAuthoritativeState(decode(x.r.snapshot().state)),initial=restoreAuthoritativeState(decode(x.b.d.initialState)),receipt=acquired.entries().find(e=>e.path.rootStateTypeId===1000n&&e.path.fieldId===3n)!;expect(receipt).toBeDefined();
 await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),receipt]).canonicalValue())})).rejects.toThrow('initial strategy state must be absent');
 const reports=items(decode(x.r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(RECEIPT_REASONS))).map(v=>items(v,'list'));
 expect(items(reports.find(v=>key(v[1])===key(signed(4)))![2],'list')).toHaveLength(0);const at6=items(reports.find(v=>key(v[1])===key(signed(6)))![2],'list');expect(at6).toHaveLength(1);expect(items(items(items(at6[0],'list')[2],'list')[0],'list')[2]).toEqual(u(4));
 const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}));exact(x.r,restored);
 let done=false;for(let n=0;n<96;n++){const more=await x.r.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);exact(x.r,r);}if(!more){done=true;break;}}
 expect(done).toBe(true);expect(x.r.snapshot().clock).toBe(101n);capture(x.r,x.b);
 console.info('M223 PERSISTENCE PASS acquired receipt only strictly later; learned S0 rejected; repeat/save6 every full state/output/trace/save through101');
},590000);

it('multi223 migration preserves original actions starting state and source declarations',()=>{
 const b=fixture('first'),old=items(decode(b.old.s.registry),'list'),now=items(decode(b.s.registry),'list');expect(now).toHaveLength(59);
 for(let i=0;i<52;i++)if(![0,6,8,9,10,11,50].includes(i))expect(now[i]).toEqual(old[i]);
 const defs=items(now[0],'set');for(const d of items(old[0],'set'))expect(defs).toContainEqual(d);
 for(const i of [10,11])for(const v of items(items(old[i],'list')[i===10?2:1],i===10?'set':'list'))expect(items(items(now[i],'list')[i===10?2:1],i===10?'set':'list')).toContainEqual(v);
 const before=restoreAuthoritativeState(decode(b.old.d.initialState)),after=restoreAuthoritativeState(decode(b.d.initialState));
 for(const e of before.entries())expect(after.read(e.path)).toEqual(before.read(e.path));
 const added=after.entries().filter(e=>!before.read(e.path).presence);expect(added.map(e=>[e.path.rootStateTypeId,e.path.fieldId])).toEqual([[455n,2n],[455n,3n],[455n,4n]]);
 const observers=items(items(old[50],'list')[3],'list'),current=items(items(now[50],'list')[3],'list');expect(current.map(v=>list(items(v,'list').slice(0,3)))).toEqual(observers);
 console.info('M223 MIGRATION PASS original action/procedure definitions and all starting values preserved; only three physical anchors added; passive observer identities retained');
});
