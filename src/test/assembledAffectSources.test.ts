import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {ACQUISITION_RULES,ACQUISITION_REGISTRY} from '../assembled/model';
import {SHARED_AFFECT_APPRAISAL,SHARED_AFFECT_VERSION,REAPPRAISAL_SOURCE,reappraisalPath,reappraisalKnowledge} from '../assembled/reappraisal';
import {AFFECT_RECALL,SHARED_AFFECT_MEMORY_VERSION,unpackAffectCue} from '../assembled/affectMemory';
import {MEMORY_RECALL,isSocialEpisodePath} from '../assembled/memory';
import {restoreAuthoritativeState} from '../substrate/state';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {personPath} from '../assembled/social';
import {fixture,decode,items,key,enc,target,type Mode} from './fixtures/assembledAffectSources';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import * as publication from '../campaign3/recollectionProduction';
const snapshots=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let s=snapshots.get(r);if(!s){s=r.snapshot();snapshots.set(r,s);}return s;};
async function step(r:Run){snapshots.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(32);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(32);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const reports=(r:Run,tag:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const report=(r:Run)=>reports(r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===3n)!;
const audit=(r:Run)=>reports(r,AFFECT_RECALL).find(a=>signedValue(a[1])===4n)!;
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const es=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>Number(signedValue(a[5])-signedValue(b[5])));
const frac=(v:CanonicalValue)=>{const a=readQ(v);return a.numerator+'/'+a.denominator;};
const json=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
const trace=(r:Run)=>outputs(snap(r).trace,160n),event=(t:ReturnType<typeof trace>[number])=>rec(f(t,4n),130n);
async function create(mode:Mode='main',law='UncontrolledGain',at=4n){const b=fixture(mode,law),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
function projection(r:Run){
 const a=report(r);expect(a,'live completed source report3').toBeDefined();
 const provenance=items(a[7],'list'),factors=items(provenance[4],'list'),query=audit(r);expect(query,'actual later recall4').toBeDefined();
 const episodes=es(r),byId=new Map(episodes.map(v=>[uint(id(v[1]).payload),signedValue(v[5])]));
 const scores=items(query[4],'list').map(v=>items(v,'list')).sort((a,b)=>Number(byId.get(uint(a[0]))!-byId.get(uint(b[0]))!));expect(scores).toHaveLength(2);
 return {a,provenance,factors,query,scores,status:txt(a[5]),gain:frac(query[3]),selected:items(query[5],'list').map(v=>byId.get(uint(items(v,'list')[0])))};
}
function live(r:Run){const p=projection(r);expect(p.status).toBe('Known');expect(p.factors.every(v=>typeof v!=='boolean'&&v.kind!=='list')).toBe(true);
 const joint=items(p.provenance[1],'list'),row=items(joint[4],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(p.provenance[0]));expect(row,'mapped task actually selected').toHaveLength(5);
 expect(p.factors[1]).toEqual(row![1]);expect(p.factors[2]).toEqual(row![2]);expect(p.factors[3]).toEqual(q(0,1));
 return p;
}
function check(r:Run,law='UncontrolledGain'){
 const p=live(r),[likelihood,severity,vulnerability,control]=p.factors.map(readQ);
 const exposure=likelihood.multiply(severity).multiply(Q.of(1n).add(vulnerability)).divide(Q.of(2n)),uncontrolled=exposure.multiply(Q.of(1n).subtract(control));
 expect(items(p.a[6],'list').map(frac)).toEqual([exposure,uncontrolled].map(v=>v.numerator+'/'+v.denominator));
 const gain=law==='NoFeedback'?Q.of(1n):Q.of(1n).add(uncontrolled);expect(readQ(p.query[3]).equals(gain)).toBe(true);
 for(const row of p.scores)expect(readQ(row[3]).equals(readQ(row[1]).add(gain.multiply(readQ(row[2]))))).toBe(true);
 const carry=unpackAffectCue(p.query[2],4n);expect(items(p.query[2],'list')[2]).toEqual(list(p.a));expect(carry.carry?.at).toBe(3);
 const source=trace(r).find(t=>uint(f(event(t),1n))===carry.source&&key(f(t,13n))===key(list(p.a)))!;
 expect(source,'exact producing event/report').toBeDefined();expect(f(source,6n)).toEqual(text(SHARED_AFFECT_VERSION));
 expect(items(f(source,12n),'list')[2]).toEqual(p.provenance[1]);expect(items(f(source,11n),'list')).toHaveLength(2);
 const recalled=trace(r).find(t=>key(f(event(t),5n))===key(MEMORY_RECALL)&&signedValue(f(event(t),2n))===4n&&key(f(event(t),6n))===key(p.query[2]))!;
 expect(f(recalled,6n)).toEqual(text(SHARED_AFFECT_MEMORY_VERSION));expect(items(f(event(recalled),8n),'list')).toContainEqual(u(carry.source!));
 expect(()=>unpackAffectCue(p.query[2],3n)).toThrow('prior');
 console.info('M66 LIVE '+json({factors:p.factors.map(frac),affect:items(p.a[6],'list').map(frac),gain:p.gain,score:p.scores.map(v=>frac(v[3])),selected:p.selected,source:carry.source}));
 return p;
}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
it('M66 live shared body and goal operands reach actual later retrieval scores',async()=>{
 const {r:a}=await create(),{r:b}=await create('high'),{r:w}=await create('wide');
 const pa=check(a),pb=check(b),pw=check(w);
 expect(readQ(pa.factors[1]).compare(Q.of(0n))).toBeGreaterThan(0);expect(pa.factors[1]).toEqual(pb.factors[1]);
 expect(readQ(pa.factors[2]).compare(readQ(pb.factors[2]))).toBeGreaterThan(0);
 expect(readQ(pa.scores[0][3]).compare(readQ(pb.scores[0][3]))).toBeGreaterThan(0);
 expect(pw.factors[1]).toEqual(q(0,1));expect(pw.gain).toBe('1/1');
 for(const r of [a,b,w]){expect(report(r)[2]).toEqual(report(a)[2]);expect(state(r).read(personPath(C,target))).toEqual(state(a).read(personPath(C,target)));}
 expect(pa.selected).toEqual([2n]);expect(pb.selected).toEqual([2n]);expect(pw.selected).toEqual([2n]);
 const {r:na}=await create('main','NoFeedback'),{r:nb}=await create('high','NoFeedback'),pna=check(na,'NoFeedback'),pnb=check(nb,'NoFeedback');
 expect(report(na)[6]).not.toEqual(report(nb)[6]);expect(pna.scores).toEqual(pnb.scores);
 console.info('M66 CONNECTION PASS shared goal/body -> completed affect -> actual score; NoFeedback removes score contrast. Fixed winning memory remains B: null retained.');
},540000);
it('M66 unknown deferred denied-body and hidden-truth remain distinct',async()=>{
 const {r:main}=await create();
 for(const mode of ['unknown','present','deniedBody','hidden'] as const){const {r}=await create(mode),p=projection(r);
  if(mode==='hidden'){check(r);expect(p.a).toEqual(report(main));expect(p.query).toEqual(audit(main));expect(state(r).read(reappraisalPath(C))).toEqual(state(main).read(reappraisalPath(C)));
   const source=(x:Run)=>trace(x).filter(t=>key(f(event(t),5n))===key(REAPPRAISAL_SOURCE)).map(t=>f(event(t),6n));expect(source(r)).not.toEqual(source(main));
  }else{
   expect(p.status).toBe(mode==='present'?'Deferred':'Unavailable');expect(p.gain).toBe('1/1');expect(items(p.a[6],'list')).toEqual([]);
   expect(unpackAffectCue(p.query[2],4n).carry?.status).toBe(p.status);
   if(mode==='present')expect(txt(p.provenance[3])).toContain('component not integrated');
  }
  console.info('M66 STATUS '+mode+' '+json({status:p.status,reason:txt(p.provenance[3]),gain:p.gain}));
 }
},540000);
it('M66 persistence rollback and version boundaries',async()=>{
 const {b,m,r:a}=await create('main','UncontrolledGain',3n),repeat=await createCharacterRun(m,b.d);await through(repeat,3n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 const fault=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()}),before=snap(fault),publish=publication.publishRecollections;
 const spy=vi.spyOn(publication,'publishRecollections').mockImplementation((view,allocate)=>{publish(view,allocate);throw Error('M66 after-publication fault');});
 try{await expect(step(fault)).rejects.toThrow('M66 after-publication fault');expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 for(const r of [a,repeat,restored]){await through(r,4n);check(r);await finish(r);}exact(a,repeat);exact(a,restored);
 const old={...b.s,rulesVersion:ACQUISITION_RULES,registrySchemaVersion:ACQUISITION_REGISTRY};
 await expect(createCharacterRun(await prepareCharacterModel(old),b.d)).rejects.toThrow('source grammar');
 const learned=state(a).read(reappraisalPath(C)).value;expect(()=>reappraisalKnowledge(learned,C)).toThrow('observation holder');expect(reappraisalKnowledge(learned,C,true).mitigation).toBe(1n);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const x=[...items(v,'list')];if(key(x[2])===key(REAPPRAISAL_SOURCE)){const p=[...items(x[3],'list')];p[9]=list([u(3),true]);x[3]=list(p);}return list(x);});
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list(rows))})).rejects.toThrow('mitigation catalogue');
 console.info('M66 PERSISTENCE/BOUNDARIES PASS exact repeat/restore3->101; actual publication rollback; old/new evidence grammar separated; invalid catalogue rejected.');
},540000);
