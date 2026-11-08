import {it,expect} from 'vitest';
import {list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {isSocialEpisodePath,MEMORY_RECALL} from '../assembled/memory';
import {AFFECT_RECALL,ACQUISITION_MEMORY_VERSION,unpackAffectCue} from '../assembled/affectMemory';
import {personPath,personHistory,personMean} from '../assembled/social';
import {REAPPRAISAL_APPRAISAL,reappraisalPath,REAPPRAISAL_SOURCE} from '../assembled/reappraisal';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {WORKSPACE} from '../assembled/workspace';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {fixture,decode,items,key,target,type Mode} from './fixtures/assembledAffectCorrespondence';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
const cache=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let s=cache.get(r);if(!s){s=r.snapshot();cache.set(r,s);}return s;};
async function step(r:Run){cache.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(30);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(30);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const reports=(r:Run,label:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const social=(r:Run)=>reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(p=>key(p[2])===key(target))!;
const mean=(r:Run)=>items(social(r)[4],'list')[0];
const audit=(r:Run)=>reports(r,AFFECT_RECALL).find(a=>signedValue(a[1])===4n);
const frac=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
const json=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
async function create(law='UncontrolledGain',mode:Mode='main',graph=true,k=1,at=4n){const b=fixture(law,mode,graph,k),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
function live(r:Run){
 expect(personHistory(belief(r))).toHaveLength(2);expect(personMean(belief(r))!.equals(readQ(q(1,2)))).toBe(true);
 expect(social(r),'live social appraisal').toBeDefined();expect(items(social(r)[4],'list')).toHaveLength(1);
 expect(audit(r),'live recall').toBeDefined();expect(items(audit(r)![4],'list'),'two retained candidates').toHaveLength(2);
}
function projected(r:Run){
 const a=audit(r)!;expect(a).toBeDefined();const byId=new Map(episodes(r).map(e=>{const x=items(e.value,'list');return [uint(id(x[1]).payload),signedValue(x[5])];}));
 return {gain:frac(a[3]),scores:items(a[4],'list').map(v=>{const x=items(v,'list');return {at:byId.get(uint(x[0])),base:frac(x[1]),pull:frac(x[2]),score:frac(x[3])};}).sort((a,b)=>Number(a.at!-b.at!)),winner:items(a[5],'list').map(v=>byId.get(uint(items(v,'list')[0]))),mean:frac(mean(r))};
}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
const traces=(r:Run)=>outputs(snap(r).trace,160n),event=(v:ReturnType<typeof traces>[number])=>rec(f(v,4n),130n);
function ancestry(r:Run){
 const a=audit(r)!,carry=unpackAffectCue(a[2],4n),ts=traces(r),source=ts.find(t=>uint(f(event(t),1n))===carry.source&&key(f(t,13n))===key(items(a[2],'list')[2]));
 expect(source,'actual prior affect source event and exact report').toBeDefined();expect(signedValue(f(event(source!),2n))).toBe(3n);
 expect(uint(f(event(source!),3n))).toBe(50n);expect(items(f(source!,11n),'list')).toHaveLength(2);
 const recall=ts.find(t=>key(f(event(t),5n))===key(MEMORY_RECALL)&&signedValue(f(event(t),2n))===4n)!;
 expect(f(recall,6n)).toEqual(text(ACQUISITION_MEMORY_VERSION));expect(items(f(event(recall),8n),'list')).toContainEqual(u(carry.source!));expect(items(f(recall,11n),'list')).toHaveLength(2);
 const selected=items(reports(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);
 expect(items(social(r)[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));
 expect(items(reports(r,JOINT_APPRAISAL).at(-1)![6],'list').slice(1)).toContainEqual(list(social(r)));
 console.info('M65 ANCESTRY '+json({source:carry.source,recall:uint(f(event(recall),1n)),carry:carry.carry,selected:items(selected[0],'list')[0]}));
}
it('M65 live paired current-composition affect handoff and consumed judgment',async()=>{
 const {r:a}=await create('UncontrolledGain','main',true,1,3n),{r:b}=await create('NoFeedback','main',true,1,3n);
 expect(episodes(a)).toEqual(episodes(b));expect(episodes(a).map(e=>items(e.value,'list')[4])).toEqual([list([{kind:'signed',value:2n}]),list([{kind:'signed',value:3n}])]);
 await through(a,4n);await through(b,4n);for(const r of [a,b]){live(r);expect(unpackAffectCue(audit(r)![2],4n).carry?.status).toBe('Known');}
 const pa=projected(a),pb=projected(b);console.info('M65 PAIRED '+json([pa,pb]));
 expect(pa).toEqual({gain:'2/1',scores:[{at:1n,base:'7/12',pull:'1/8',score:'5/6'},{at:2n,base:'5/6',pull:'0/1',score:'5/6'}],winner:[1n],mean:'1/1'});
 expect(pb).toEqual({gain:'1/1',scores:[{at:1n,base:'7/12',pull:'1/8',score:'17/24'},{at:2n,base:'5/6',pull:'0/1',score:'5/6'}],winner:[2n],mean:'0/1'});
 expect(belief(a)).toEqual(belief(b));expect(audit(a)![2]).toEqual(audit(b)![2]);for(const r of [a,b])ancestry(r);
 console.info('M65 CONNECTION PASS current acquisition history causes tie-mediated reference win; historical M43 strict score is not reproduced. No choice or whole-member claim.');
},540000);
it('M65 known zero unknown late current and hidden-truth controls',async()=>{
 const {r:primary}=await create();
 for(const mode of ['zero','unknown','late','current','hidden'] as const){
  const {r}=await create('UncontrolledGain',mode);live(r);const p=projected(r);console.info('M65 CONTROL '+mode+' '+json(p));
  expect(p.winner).toEqual(['zero','unknown','late'].includes(mode)?[2n]:[1n]);
  const carry=unpackAffectCue(audit(r)![2],4n).carry!;
  if(mode==='zero'){expect(carry.status).toBe('Known');expect(carry.uncontrolled).toBe('0/1');}
  if(mode==='unknown'||mode==='late'){expect(carry.status).toBe('Unavailable');expect(p.gain).toBe('1/1');}
  if(mode==='late')expect(items(reports(r,REAPPRAISAL_APPRAISAL).at(-1)![6],'list')).toEqual([q(1,1),q(1,1)]);
  if(mode==='current'){expect(items(reports(r,REAPPRAISAL_APPRAISAL).at(-1)![6],'list')).toEqual([q(1,2),q(1,2)]);expect(p.gain).toBe('2/1');}
  if(mode==='hidden'){
   expect(episodes(r)).toEqual(episodes(primary));expect(social(r)).toEqual(social(primary));expect(reports(r,WORKSPACE)).toEqual(reports(primary,WORKSPACE));
   expect(state(r).read(reappraisalPath(C))).toEqual(state(primary).read(reappraisalPath(C)));
   const physical=(x:Run)=>traces(x).filter(t=>key(f(event(t),5n))===key(REAPPRAISAL_SOURCE)).map(t=>f(event(t),6n));expect(physical(r)).not.toEqual(physical(primary));
  }
  ancestry(r);
 }
 console.info('M65 SOURCE CONTROLS PASS known zero is not unknown; current evidence cannot replace prior carry; changed hidden world cannot change cognition.');
},540000);
it('M65 exact continuation and denied empty-edge zero-capacity controls',async()=>{
 const {b,m,r:a}=await create('UncontrolledGain','main',true,1,3n),repeat=await createCharacterRun(m,b.d);await through(repeat,3n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 for(const r of [a,repeat,restored]){await through(r,4n);live(r);expect(projected(r).mean).toBe('1/1');await finish(r);}exact(a,repeat);exact(a,restored);
 for(const [name,mode,graph,k]of [['denied','denied',true,1],['graph','main',false,1],['slots','main',true,0]] as const){
  const {r}=await create('UncontrolledGain',mode,graph,k);expect(episodes(r)).toHaveLength(2);expect(personHistory(belief(r))).toHaveLength(2);
  if(name==='denied'){expect(audit(r)).toBeUndefined();expect(mean(r)).toEqual(q(1,2));}
  else{live(r);const p=projected(r);expect(p.mean).toBe(name==='graph'?'0/1':'1/2');if(name==='graph')expect(p.scores.every(s=>s.pull==='0/1')).toBe(true);if(name==='slots')expect(p.winner).toEqual([]);}
  console.info('M65 ACCESS '+name+' mean='+frac(mean(r)));
 }
 console.info('M65 PERSISTENCE PASS exact repeat/restore3->101 state/output/trace/save/run identity. Access controls preserve unknown/no recall distinctions.');
},540000);
