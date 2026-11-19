/** M186 plans e6d71665/90a68d2c: current prior-affect cognitive receiver. */
import {it,expect,vi} from 'vitest';
import {fixture} from './fixtures/assembledAffectMemoryCurrent';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {restoreCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {isSocialEpisodePath,MEMORY_RECALL} from '../assembled/memory';
import {AFFECT_RECALL,unpackAffectCue} from '../assembled/affectMemory';
import {reappraisalPath,REAPPRAISAL_SOURCE,SHARED_AFFECT_APPRAISAL} from '../assembled/reappraisal';
import {personPath,personHistory,personMean} from '../assembled/social';
import {associationGraph,associationPath,associationUnits} from '../assembled/learnedAssociation';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {affectRetrievalGain} from '../campaign3/affectRetrieval';
import {recallCanonicalEventAcquisitions} from '../campaign3/canonicalEventRecall';
import * as publication from '../campaign3/recollectionProduction';
import {BODY_SAMPLE} from '../assembled/body';
import {STRESS,stressPath,stressAnchor} from '../assembled/regulatoryStress';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M186 time');return v.value;};
const frac=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
const json=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>Number(at(a[5])-at(b[5])));
const traces=(r:Run)=>outputs(r.snapshot().trace,160n),event=(v:ReturnType<typeof rec>)=>rec(f(v,4n),130n);
const audit=(r:Run)=>reports(r,AFFECT_RECALL).find(a=>at(a[1])===26n);
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let n=0;await r.settleNextInstant();n++)expect(n).toBeLessThan(96);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
async function create(...args:Parameters<typeof fixture>){return startMemory(fixture(...args));}
function prior(r:Run,status='Known'){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===10n);expect(a,'live physical appraisal10').toBeDefined();
 expect(a![5]).toEqual(text(status));
 const sampleTrace=traces(r).find(t=>at(f(event(t),2n))===10n&&key(f(event(t),5n))===key(BODY_SAMPLE))!;expect(sampleTrace,'current physical sample10').toBeDefined();
 const ops=items(f(sampleTrace,15n),'list');expect(ops).toHaveLength(2);expect(ops[0]).toEqual(list([text('assembled-calibrated-sensing/0.1-candidate'),q(0,1),signed(0),q(0,1),q(0,1)]));
 const sample=rec(items(f(sampleTrace,13n),'list')[0],461n);expect(f(sample,6n)).toEqual(text('embodied-level-observation/0.2-candidate'));expect([f(rec(f(sample,5n),462n),1n),f(rec(f(sample,5n),462n),2n)]).toEqual([q(0,1),q(1,1)]);
 const decision=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===10n);expect(decision,'live decision10').toBeDefined();
 expect(uint(f(rec(f(decision!,4n),419n),1n))).toBe(1n);expect(outputs(r.snapshot().outputs,426n)).toHaveLength(0);
 console.info('M186 PRIOR '+json(a!.slice(5,7)));return a!;
}
function probe(r:Run,expected:bigint,law='UncontrolledGain'){
 const a=audit(r);expect(a,'live social retrieval26').toBeDefined();const cue=unpackAffectCue(a![2],26n);
 const ts=traces(r),tr=ts.find(t=>at(f(event(t),2n))===26n&&key(f(event(t),5n))===key(MEMORY_RECALL)&&items(f(t,13n),'list').some(v=>key(v)===key(list(a!))))!;
 expect(tr,'actual social query trace').toBeDefined();
 const reads=items(f(tr,11n),'list').map(v=>rec(v,147n)),gr=reads.find(v=>uint(f(rec(f(v,2n),140n),1n))===631n)!;expect(gr).toBeDefined();
 const graph=associationGraph(f(gr,4n),{nodes:30,edges:870}),mem=reads.map(v=>f(v,4n)).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-social-episode/0.1'))).map(v=>items(v,'list'));
 expect(mem).toHaveLength(2);expect(mem.map(m=>associationUnits(m[6],m[3]).length)).toEqual([2,2]);expect(graph.keys.length).toBeGreaterThan(0);
 const gain=affectRetrievalGain(cue.carry?.status==='Deferred'?{...cue.carry,status:'Unavailable'}:cue.carry,26,law as 'UncontrolledGain'|'NoFeedback');
 expect(a![3]).toEqual(qValue(gain));expect(cue.source).toBeDefined();
 const source=ts.find(t=>uint(f(event(t),1n))===cue.source&&key(f(t,13n))===key(items(a![2],'list')[2]))!;expect(source,'actual earlier affect trace contribution').toBeDefined();expect(at(f(event(source),2n))).toBe(10n);expect(items(f(event(tr),8n),'list')).toContainEqual(u(cue.source!));
 const kernel=recallCanonicalEventAcquisitions({cue:{kind:'Present',key:cue.track!},now:26n,graph,memory:mem.map(m=>({id:uint(id(m[1]).payload),acquiredAt:at(m[5]),units:associationUnits(m[6],m[3]).map(x=>({key:x.key,views:[enc(list(m))]}))})),presentations:new Map(mem.map(m=>[uint(id(m[1]).payload),[at(m[5]),...items(m[4],'list').map(at)]])),calibration:{beta:Q.of(1n,2n),scale:1000n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:gain,k:1}});
 expect(list(kernel.scores.map(s=>list([u(s.acquisition),qValue(s.base),qValue(s.pull),qValue(s.score)])))).toEqual(a![4]);
 const selected=items(a![5],'list').map(v=>items(v,'list'));expect(selected).toHaveLength(1);expect(selected.map(v=>uint(v[0]))).toEqual(kernel.recalled.map(v=>v.id));
 const chosen=mem.find(m=>uint(id(m[1]).payload)===uint(selected[0][0]))!;
 console.info('M186 RANK '+json({gain:frac(a![3]),scores:kernel.scores,winner:at(chosen[5])}));
 const social=reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(v=>key(v[2])===key(target))!;
 expect(social,'live social appraisal').toBeDefined();expect(items(social[4],'list')).toHaveLength(1);
 const belief=state(r).read(personPath(C,target)).value;expect(personHistory(belief)).toHaveLength(2);expect(personMean(belief)).toEqual(Q.of(1n,2n));
 const joint=reports(r,JOINT_APPRAISAL).at(-1)!;expect(items(joint[6],'list').slice(1)).toContainEqual(list(social));
 const workspace=reports(r,WORKSPACE).find(a=>at(a[1])===26n)!;expect(workspace).toBeDefined();const pub=selected[0][1];
 expect(uint(pub)).not.toBe(uint(selected[0][0]));expect(items(social[6],'list')[3]).toEqual(list([chosen[1]]));const delivered=items(workspace[4],'list').find(v=>key(items(v,'list')[0])===key(chosen[1]));expect(delivered).toBeDefined();expect(items(delivered!,'list')[2]).toEqual(f(event(tr),1n));expect(items(delivered!,'list')[1]).toEqual(list(chosen));
 console.info('M186 PROBE '+json({law,carry:cue.carry,gain:frac(a![3]),scores:kernel.scores.map(s=>({at:at(mem.find(m=>uint(id(m[1]).payload)===s.acquisition)![5]),base:s.base,pull:s.pull,score:s.score})),winner:at(chosen[5]),mean:frac(items(social[4],'list')[0])}));
 expect(at(chosen[5])).toBe(expected);expect(items(social[4],'list')).toEqual([q(expected===10n?1:0,1)]);
 return a!;
}
function stress11(r:Run,source:readonly CanonicalValue[],expected:number){
 const applied=reports(r,STRESS+'/applied').find(a=>at(a[1])===11n)!;expect(applied,'live strictly later physical consumer').toBeDefined();const packet=items(applied[2],'list');expect(at(packet[2])).toBe(10n);expect(packet[4]).toEqual(list(source));expect(uint(applied[6])).toBe(BigInt(expected));expect(stressAnchor(applied[4])).toEqual({at:11n,level:expected});
 const producer=traces(r).find(t=>key(f(t,13n))===key(list(source)))!;expect(producer).toBeDefined();expect(packet[3]).toEqual(f(event(producer),1n));expect(stressAnchor(state(r).read(stressPath(C)).value!)).toEqual({at:11n,level:expected});
}
it('final186 primary affect changes learned retrieval and actual appraisal',async()=>{
 const high=await create(),zero=await create('safe'),off=await create('risk','NoFeedback');
 expect(high.b.s).toEqual(zero.b.s);bytes(high.b.d.initialState,zero.b.d.initialState);bytes(high.b.d.initialState,off.b.d.initialState);bytes(high.b.d.orderedInputs,off.b.d.orderedInputs);
 const onSlots=items(decode(high.b.s.registry),'list'),offSlots=[...items(decode(off.b.s.registry),'list')],policy=[...items(offSlots[29],'list')];expect(policy[1]).toEqual(text('NoFeedback'));policy[1]=text('UncontrolledGain');offSlots[29]=list(policy);expect(offSlots).toEqual(onSlots);
 for(let n=0;high.run.snapshot().clock<8n;n++){expect(n).toBeLessThan(96);for(const x of[high,zero,off])expect(await x.run.settleNextInstant()).toBe(true);for(const x of[zero,off]){expect(x.run.snapshot().clock).toBe(high.run.snapshot().clock);bytes(x.run.snapshot().state,high.run.snapshot().state);bytes(x.run.snapshot().outputs,high.run.snapshot().outputs);}}expect(high.run.snapshot().clock).toBe(8n);
 const danger:ReturnType<ReturnType<typeof state>['read']>[]=[];
 for(const x of[high,zero,off]){await through(x.run,10n);const p=prior(x.run);expect(p[6]).toEqual(list([q(x===zero?0:199,x===zero?1:400),q(x===zero?0:199,x===zero?1:400)]));danger.push(state(x.run).read(reappraisalPath(C)));await through(x.run,12n);stress11(x.run,p,x===zero?0:249);expect(episodes(x.run).map(e=>at(e[5]))).toEqual([10n,11n]);expect(episodes(x.run).map(e=>items(e[4],'list'))).toEqual([[],[]]);}
 for(const x of[zero,off]){expect(episodes(x.run)).toEqual(episodes(high.run));expect(state(x.run).read(associationPath(C))).toEqual(state(high.run).read(associationPath(C)));}
 for(const x of[high,zero,off])await through(x.run,26n);
 const a=probe(high.run,10n),b=probe(zero.run,11n),c=probe(off.run,11n,'NoFeedback');
 expect(unpackAffectCue(a[2],26n).carry?.status).toBe('Known');expect(readQ(a[3]).compare(Q.of(1n))).toBeGreaterThan(0);expect(b[3]).toEqual(q(1,1));expect(unpackAffectCue(b[2],26n).carry?.status).toBe('Known');expect(c[2]).toEqual(a[2]);
 for(const [i,x]of[high,zero,off].entries()){await finish(x.run);expect(state(x.run).read(reappraisalPath(C)),'stress and recall never become danger evidence').toEqual(danger[i]);}
 console.info('M186 PRIMARY PASS current0.129; matched actual history/graph, prior-only gain599/400 vs1, social/joint appraisal1 vs0; zero-calibration observation0.2; stress11=249/0/249 without danger evidence; all queues101');
},540000);

it('final186 controls distinguish unknown denied and later evidence',async()=>{
 const unknown=await create('denied'),later=await create('later'),denied=await create('socialDenied');
 for(const x of[unknown,later,denied]){await through(x.run,10n);prior(x.run,x===unknown?'Unavailable':'Known');await through(x.run,26n);}
 const a=probe(unknown.run,11n),b=probe(later.run,10n);
 expect(unpackAffectCue(a[2],26n).carry?.status).toBe('Unavailable');expect(a[3]).toEqual(q(1,1));
 expect(unpackAffectCue(b[2],26n).carry?.status).toBe('Known');expect(readQ(b[3]).compare(Q.of(1n))).toBeGreaterThan(0);
 const original=reports(later.run,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===10n)!,current=reports(later.run,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===26n)!;
 expect(current).toBeDefined();expect(current[6]).not.toEqual(original[6]);expect(items(b[2],'list')[2]).toEqual(list(original));
 expect(audit(denied.run)).toBeUndefined();expect(episodes(denied.run).map(e=>at(e[5]))).toEqual([11n]);
 for(const x of[unknown,later,denied])await finish(x.run);
 console.info('M186 CONTROLS PASS unknown != known-zero; source denied gives no social recall26; current changed appraisal cannot rewrite authentic prior10; full queues101');
},540000);
it('final186 exact continuation privacy and post-publication rollback',async()=>{
 const x=await create(),h=await create('hidden'),repeat=await create(),r=x.run;
 for(let n=0;r.snapshot().clock<12n;n++){expect(n).toBeLessThan(96);for(const p of[r,h.run,repeat.run])expect(await p.settleNextInstant()).toBe(true);exact(r,repeat.run);expect(h.run.snapshot().clock).toBe(r.snapshot().clock);bytes(r.snapshot().state,h.run.snapshot().state);bytes(r.snapshot().outputs,h.run.snapshot().outputs);}expect(r.snapshot().clock).toBe(12n);
 exact(r,repeat.run);bytes(r.snapshot().state,h.run.snapshot().state);bytes(r.snapshot().outputs,h.run.snapshot().outputs);
 expect(items(decode(x.b.d.orderedInputs),'list')).not.toEqual(items(decode(h.b.d.orderedInputs),'list'));
 const restored=cachedMemory(await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:r.save()}));exact(r,restored);
 // Compare the first restored successor25, then fault the actual publication26.
 for(const p of[r,h.run,repeat.run,restored])await through(p,25n);
 exact(r,repeat.run);exact(r,restored);bytes(r.snapshot().state,h.run.snapshot().state);bytes(r.snapshot().outputs,h.run.snapshot().outputs);
 const fault=cachedMemory(await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:r.save()}));
 const before=fault.snapshot(),saved=fault.save(),original=publication.publishRecollections;let reached=false;
 const spy=vi.spyOn(publication,'publishRecollections').mockImplementation((view,allocate)=>{const result=original(view,allocate);reached=true;throw Error('M186 after-publication fault');});
 try{await expect(fault.settleNextInstant()).rejects.toThrow('M186 after-publication fault');expect(reached).toBe(true);const after=fault.snapshot();expect(after.clock).toBe(before.clock);for(const field of['state','outputs','trace']as const)bytes(after[field],before[field]);}finally{spy.mockRestore();}
 const recovered=cachedMemory(await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved}));exact(r,recovered);
 for(let n=0;n<96;n++){
  const more=await r.settleNextInstant();
  for(const p of[repeat.run,restored,recovered]){expect(await p.settleNextInstant()).toBe(more);exact(r,p);}
  expect(await h.run.settleNextInstant()).toBe(more);bytes(r.snapshot().state,h.run.snapshot().state);bytes(r.snapshot().outputs,h.run.snapshot().outputs);
  if(r.snapshot().clock===26n&&more){probe(r,10n);expect(audit(h.run)).toEqual(audit(r));}
  if(!more)break;if(n===95)throw Error('M186 full continuation cap');
 }
 expect(r.snapshot().clock).toBe(101n);for(const p of[r,repeat.run,restored,recovered,h.run])expect(p.diagnostic()).toBeUndefined();
 console.info('M186 PERSISTENCE PASS every later state/output/trace/save/run byte repeat and public save12 through101; hidden safe state/output equal; actual publication fault rolls back and recovers exactly');
},540000);
