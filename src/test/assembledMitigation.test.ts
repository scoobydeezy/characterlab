import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {SHARED_AFFECT_RULES,SHARED_AFFECT_REGISTRY} from '../assembled/model';
import {MITIGATION_VERSION,MITIGATION_OBS,SHARED_AFFECT_APPRAISAL,REAPPRAISAL_OBSERVE,reappraisalPath,reappraisalKnowledge} from '../assembled/reappraisal';
import {relativeEfficacy,validateMitigationPacket} from '../assembled/mitigation';
import {AFFECT_RECALL,unpackAffectCue} from '../assembled/affectMemory';
import {MEMORY_RECALL,isSocialEpisodePath} from '../assembled/memory';
import * as substrateState from '../substrate/state';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {fixture,decode,items,key,type Mode} from './fixtures/assembledMitigation';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
const snapshots=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let s=snapshots.get(r);if(!s){s=r.snapshot();snapshots.set(r,s);}return s;};
async function step(r:Run){snapshots.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(32);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(32);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const reports=(r:Run,tag:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const state=(r:Run)=>substrateState.restoreAuthoritativeState(decode(snap(r).state));
const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true);
const frac=(v:CanonicalValue)=>{const a=readQ(v);return a.numerator+'/'+a.denominator;};
const trace=(r:Run)=>outputs(snap(r).trace,160n),event=(t:ReturnType<typeof trace>[number])=>rec(f(t,4n),130n);
async function create(mode:Mode='effective',law='UncontrolledGain',at=10n){const b=fixture(mode,law),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
function projection(r:Run){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===9n)!;
 expect(a,'live completed appraisal9').toBeDefined();
 const provenance=items(a[7],'list'),factors=items(provenance[4],'list'),efficacy=items(provenance[5],'list');
 const query=reports(r,AFFECT_RECALL).find(v=>signedValue(v[1])===10n)!;expect(query,'actual later recall10').toBeDefined();
 const es=state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')),byId=new Map(es.map(v=>[uint(id(v[1]).payload),signedValue(v[5])]));
 const scores=items(query[4],'list').map(v=>items(v,'list')).sort((a,b)=>Number(byId.get(uint(a[0]))!-byId.get(uint(b[0]))!));
 expect(scores).toHaveLength(2);
 return {a,provenance,factors,efficacy,query,scores,status:txt(a[5]),selected:items(query[5],'list').map(v=>byId.get(uint(items(v,'list')[0])))};
}
function live(r:Run,control:number,law='UncontrolledGain'){
 const p=projection(r);expect(p.status).toBe('Known');expect(p.factors).toHaveLength(4);expect(p.factors.every(v=>typeof v!=='boolean'&&v.kind!=='list')).toBe(true);
 expect(p.factors[3]).toEqual(q(control,1));expect(p.efficacy.slice(0,3)).toEqual([q(1,1),q(1-control,1),q(control,1)]);
 const [likelihood,severity,vulnerability,c]=p.factors.map(readQ);expect(likelihood.compare(Q.of(0n))).toBeGreaterThan(0);expect(severity.compare(Q.of(0n))).toBeGreaterThan(0);
 const exposure=likelihood.multiply(severity).multiply(Q.of(1n).add(vulnerability)).divide(Q.of(2n)),uncontrolled=exposure.multiply(Q.of(1n).subtract(c));
 expect(items(p.a[6],'list').map(frac)).toEqual([exposure,uncontrolled].map(v=>v.numerator+'/'+v.denominator));
 const gain=law==='NoFeedback'?Q.of(1n):Q.of(1n).add(uncontrolled);expect(readQ(p.query[3]).equals(gain)).toBe(true);
 for(const row of p.scores)expect(readQ(row[3]).equals(readQ(row[1]).add(gain.multiply(readQ(row[2]))))).toBe(true);
 const carry=unpackAffectCue(p.query[2],10n);expect(items(p.query[2],'list')[2]).toEqual(list(p.a));expect(carry.carry?.at).toBe(9);
 const producer=trace(r).find(t=>uint(f(event(t),1n))===carry.source&&key(f(t,13n))===key(list(p.a)))!;expect(producer).toBeDefined();expect(f(producer,6n)).toEqual(text(MITIGATION_VERSION));
 const recall=trace(r).find(t=>key(f(event(t),5n))===key(MEMORY_RECALL)&&signedValue(f(event(t),2n))===10n&&key(f(event(t),6n))===key(p.query[2]))!;
 expect(items(f(event(recall),8n),'list')).toContainEqual(u(carry.source!));
 expect(()=>unpackAffectCue(p.query[2],9n)).toThrow('prior');
 const k=knowledge(r);expect(k.efficacy!.supports).toHaveLength(2);
 for(const row of k.rows){const a=items(row,'list'),packet=a[8];if(!items(packet,'list').length)continue;
  const x=validateMitigationPacket(packet,uint(a[3]));
  const production=trace(r).find(t=>uint(f(event(t),1n))===x.producer)!;expect(production).toBeDefined();expect(items(f(production,13n),'list')).toContainEqual(packet);
  expect(f(production,6n)).toEqual(text('assembled-character-position-perception/0.2-candidate'));
  const observed=trace(r).find(t=>key(f(event(t),5n))===key(REAPPRAISAL_OBSERVE)&&key(f(t,13n))===key(row))!;expect(observed).toBeDefined();
  expect(items(f(event(observed),8n),'list')).toContainEqual(u(x.producer));expect(items(f(observed,12n),'list')[1]).toEqual(packet);
 }
 console.info('M67 LIVE '+JSON.stringify({control,factors:p.factors.map(frac),affect:items(p.a[6],'list').map(frac),gain:frac(p.query[3]),scores:p.scores.map(v=>frac(v[3])),selected:p.selected.map(String),trialSupports:k.efficacy!.supports.length}));
 return p;
}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
it('M67 observed efficacy changes actual later retrieval with a NoFeedback control',async()=>{
 const {r:a}=await create(),{r:b}=await create('ineffective'),pa=live(a,1),pb=live(b,0);
 expect(pa.factors.slice(0,3)).toEqual(pb.factors.slice(0,3));
 expect(readQ(pb.scores[0][3]).compare(readQ(pa.scores[0][3]))).toBeGreaterThan(0);
 const {r:na}=await create('effective','NoFeedback'),{r:nb}=await create('ineffective','NoFeedback'),pna=live(na,1,'NoFeedback'),pnb=live(nb,0,'NoFeedback');
 expect(pna.a[6]).not.toEqual(pnb.a[6]);expect(pna.scores).toEqual(pnb.scores);
 console.info('M67 CONNECTION PASS observed trials -> learned relative efficacy -> completed affect -> actual retrieval score. No final-choice claim.');
},540000);
it('M67 unknown and hidden evidence controls preserve epistemic boundaries',async()=>{
 const {r:main}=await create(),base=live(main,1);
 for(const mode of ['zeroBaseline','missingAction','deniedMotion','censored','noop','hidden'] as const){
  const {r}=await create(mode),p=projection(r),k=knowledge(r);
  if(mode==='hidden'){live(r,1);expect(p.a).toEqual(base.a);expect(p.query).toEqual(base.query);expect(state(r).read(reappraisalPath(C))).toEqual(state(main).read(reappraisalPath(C)));
   expect(snap(r).trace).not.toEqual(snap(main).trace);
  }else{expect(p.status).toBe('Unavailable');expect(items(p.a[6],'list')).toEqual([]);expect(frac(p.query[3])).toBe('1/1');expect(k.efficacy!.control).toBeUndefined();expect(k.efficacy!.means[0]?.equals(Q.of(mode==='zeroBaseline'?0n:1n))).toBe(true);if(mode!=='zeroBaseline')expect(k.efficacy!.means[1]).toBeUndefined();}
  console.info('M67 CONTROL '+mode+' '+p.status);
 }
 expect(relativeEfficacy(Q.of(1n,2n),Q.of(0n))!.equals(Q.of(1n))).toBe(true);
 expect(Q.of(1n,2n).subtract(Q.of(0n)).equals(Q.of(1n,2n))).toBe(true);
 expect(relativeEfficacy(Q.of(1n,2n),Q.of(1n))!.equals(Q.of(0n))).toBe(true);
 expect(relativeEfficacy(Q.of(0n),Q.of(0n))).toBeUndefined();
},540000);
it('M67 persistence across incomplete trial rollback and version boundaries',async()=>{
 const {b,m,r:a}=await create('effective','UncontrolledGain',5n),repeat=await createCharacterRun(m,b.d);await through(repeat,5n);exact(a,repeat);
 expect(knowledge(a).efficacy!.means[1]).toBeUndefined();
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 const fault=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()}),before=snap(fault),apply=substrateState.applyStatePatch;
 let injected=false;const spy=vi.spyOn(substrateState,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===1000n&&o.path.fieldId===8n)){injected=true;throw Error('M67 after-knowledge-write fault');}return result;});
 try{await expect(step(fault)).rejects.toThrow('M67 after-knowledge-write fault');expect(injected).toBe(true);const after=snap(fault);expect(after.clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);}finally{spy.mockRestore();}
 for(const r of [a,repeat,restored]){await through(r,10n);live(r,1);await finish(r);}exact(a,repeat);exact(a,restored);
 const old={...b.s,rulesVersion:SHARED_AFFECT_RULES,registrySchemaVersion:SHARED_AFFECT_REGISTRY};await expect(createCharacterRun(await prepareCharacterModel(old),b.d)).rejects.toThrow('position perception source');
 expect(()=>reappraisalKnowledge(state(a).read(reappraisalPath(C)).value,C,true)).toThrow('observation holder');
 expect(reports(a,MITIGATION_OBS)).toHaveLength(7);
 console.info('M67 PERSISTENCE PASS exact repeat/restore5->101; actual learning rollback; old grammar rejected.');
},540000);
