import {formationValue} from '../assembled/formation';
import {formationStatePath,jp} from './fixtures/assembledStandingSources';
import {ZERO,readQ} from '../campaign2/cognitiveMath';
import {it,expect} from 'vitest';
import {witnessFixture,taskC,taskD,decode,rec,f,key,items,list,u,signed,enc,type Mode} from './fixtures/assembledCommitmentWitness';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {restoreAuthoritativeState} from '../substrate/state';
import {WPROBE,WOBS,WEVID,WUPDATE,WITNESS,commitmentObserverView,witnessPath} from '../assembled/commitmentWitness';
import {through,bytes} from './fixtures/assembledAffectReceiving';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import type {CanonicalValue} from '../substrate/canonicalEncoding';
const learned=(r:Run)=>{const s=restoreAuthoritativeState(decode(r.snapshot().state));return [s.read(formationStatePath).value!,s.read(jp).value!,s.read({...jp,fieldId:1n}).value!];};
const out=(r:Run)=>items(decode(r.snapshot().outputs),'list');
async function start(mode:Mode='primary',hidden=false){const b=witnessFixture(mode,hidden),m=await compileCharacterModel(b.s),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);return {b,run,recipients:m.communication!.recipients};}
const known=(run:Run,h:CanonicalValue,t:CanonicalValue)=>restoreAuthoritativeState(decode(run.snapshot().state)).read(witnessPath(h,t)).value;
const metadata=(v:CanonicalValue|undefined)=>v?items(v,'list')[4]:undefined;
const tagged=(run:Run,tag:string)=>out(run).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key({kind:'text',value:tag}));
function choice(run:Run,at:bigint,task?:CanonicalValue){const d=outputs(run.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===at)!;expect(d).toBeDefined();const ns=items(f(rec(f(d,3n),408n),3n),'list');expect(ns).toHaveLength(task?1:0);if(task){const raw=rec(f(rec(f(d,3n),408n),2n),403n),standing=items(f(raw,3n),'set').filter(v=>{const source=rec(f(rec(v,402n),1n),401n);return key(f(source,2n))===key(task)&&key(f(source,3n))===key(u(3));});expect(standing.some(v=>readQ(f(rec(v,402n),2n)).compare(ZERO)>0)).toBe(true);expect(f(rec(f(d,4n),419n),1n)).toEqual(u(3));expect(f(rec(f(rec(ns[0],407n),1n),404n),3n)).toEqual(f(rec(task,371n),2n));expect(outputs(run.snapshot().outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d))).toBe(true);}return d;}
function exact(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
it('M100 native witnesses distinguish unknown, observed absence, stale active and observed retirement',async()=>{
 const {run,recipients:h}=await start();await through(run,11n);const earned=learned(run),formed=formationValue(earned[0]);expect(formed.entries.length).toBeGreaterThan(0);expect(formed.P.compare(ZERO)).toBeGreaterThan(0);
 await through(run,12n);choice(run,12n);expect(metadata(known(run,h[0],taskC))).toEqual(list([u(0),u(0),u(0)]));expect(known(run,h[1],taskC)).toBeUndefined();
 await through(run,14n);choice(run,14n,taskC);const active=known(run,h[0],taskC);expect(metadata(active)).toEqual(list([u(1),u(1),u(0)]));
 await through(run,16n);choice(run,16n);expect(known(run,h[0],taskC)).toEqual(active);expect(known(run,h[1],taskC)).toBeUndefined();
 await through(run,18n);choice(run,18n,taskD);expect(metadata(known(run,h[1],taskD))).toEqual(list([u(1),u(1),u(0)]));expect(known(run,h[0],taskD)).toBeUndefined();
 await through(run,19n);choice(run,19n,taskD);expect(metadata(known(run,h[0],taskD))).toEqual(list([u(1),u(1),u(0)]));expect(known(run,h[0],taskC)).toEqual(active);
 await through(run,20n);expect(learned(run)).toEqual(earned);expect(metadata(known(run,h[0],taskC))).toEqual(list([u(2),u(2),u(4)]));
 const probes=tagged(run,WPROBE).map(v=>items(v,'list'));expect(items(probes.find(a=>key(a[1])===key(signed(12))&&key(a[2])===key(h[0]))![3],'list')).toHaveLength(0);expect(items(probes.find(a=>key(a[1])===key(signed(14))&&key(a[2])===key(h[0]))![3],'list').map(metadata)).toEqual([list([u(0),u(0),u(0)])]);
 expect(tagged(run,WOBS)).toHaveLength(6);expect(tagged(run,WEVID)).toHaveLength(6);expect(tagged(run,WUPDATE)).toHaveLength(6);
 const traces=outputs(run.snapshot().trace,160n).filter(t=>key(f(t,6n))===key({kind:'text',value:WITNESS}));expect(traces).toHaveLength(36);for(const t of traces){const e=rec(f(t,4n),130n),phase=(f(e,3n) as {value:bigint}).value;if(phase===110n)expect(items(f(t,11n),'list')).toHaveLength(1);if(phase===120n||phase===130n)expect(items(f(t,11n),'list')).toHaveLength(0);}
 for(let i=0;i<2;i++){const v=commitmentObserverView(out(run),h,i);expect(v.length).toBeGreaterThan(6);expect(v.every(x=>{const row=items(x,'list');return key(row[0])===key({kind:'text',value:WPROBE})?key(row[2])===key(h[i]):key(items(row[1],'list')[1])===key(h[i]);})).toBe(true);}expect(()=>commitmentObserverView(out(run),h,2)).toThrow();
 console.info('M100 NATIVE PASS actual C/D decisions; observed absence; selective unknown/stale knowledge; distinct keys; later Cancelled/version2; exact observation/evidence/update counts and trace phases');
},570000);
it('M100 persistence repeats and restores witness knowledge through the full calendar',async()=>{
 const {b,run:a}=await start(),{run:bRun}=await start();await through(a,14n);await through(bRun,14n);exact(a,bRun);const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);const clocks:bigint[]=[];
 for(let n=0;;n++){expect(n).toBeLessThan(32);const next=[];for(const r of [a,bRun,restored])next.push(await r.settleNextInstant());expect(next[1]).toBe(next[0]);expect(next[2]).toBe(next[0]);exact(a,bRun);exact(a,restored);if(!next[0])break;clocks.push(a.snapshot().clock);}expect(a.snapshot().clock).toBe(101n);console.info('M100 PERSISTENCE PASS14 -> '+clocks.join(',')+'; every full save/state/output/trace/run identity exact');
},570000);
it('M100 access controls swap or share actual reports without changing actor cognition',async()=>{
 const {run:a,recipients:h}=await start('swapped'),{run:b}=await start('both');await through(a,20n);await through(b,20n);expect(metadata(known(a,h[1],taskC))).toEqual(list([u(2),u(2),u(4)]));expect(known(a,h[0],taskC)).toBeUndefined();for(const r of [a,b])choice(r,19n,taskD);for(const h0 of h)expect(metadata(known(b,h0,taskC))).toEqual(list([u(2),u(2),u(4)]));expect(outputs(a.snapshot().outputs,409n)).toEqual(outputs(b.snapshot().outputs,409n));console.info('M100 ACCESS PASS swapped/both recipients; same actual decisions');
},570000);
it('M100 privacy keeps absent and private instances indistinguishable; hidden truth is inert',async()=>{
 const {run:a,recipients:h}=await start('private'),{run:b}=await start('absent');await through(a,20n);await through(b,20n);choice(a,14n,taskC);choice(b,14n);for(let i=0;i<2;i++)expect(commitmentObserverView(out(a),h,i)).toEqual(commitmentObserverView(out(b),h,i));expect(tagged(a,WOBS)).toHaveLength(0);expect(tagged(b,WOBS)).toHaveLength(0);
 const {run:x}=await start(),{run:y}=await start('primary',true);await through(x,20n);await through(y,20n);bytes(x.snapshot().state,y.snapshot().state);bytes(x.snapshot().outputs,y.snapshot().outputs);expect(key(decode(x.snapshot().trace))).not.toEqual(key(decode(y.snapshot().trace)));console.info('M100 PRIVACY PASS no-message views equal despite different actor reasons; hidden scalar changes trace only');
},570000);
