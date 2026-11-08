/** M68 comparison only: one0.67 character, M67 trial/social/body schedule.
 * Five declared inputs, seed0; original laws unchanged. Missing reason connection
 * is recorded as a blocker, never promoted to an equivalence pass. */
import {it,expect} from 'vitest';
import {list,text,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture as prior,decode,items,key,enc} from './fixtures/assembledMitigation';
import {changeDefinition} from './fixtures/assembledCharacter';
import {bodyPath} from '../assembled/body';
import {SHARED_AFFECT_APPRAISAL,REAPPRAISAL_SOURCE,reappraisalPath} from '../assembled/reappraisal';
import {AFFECT_RECALL,unpackAffectCue} from '../assembled/affectMemory';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {importancePath} from '../assembled/priority';
import {cognitiveRecord as record,receivingRecord as rec} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
type Case='baseline'|'control'|'likelihood'|'severity'|'vulnerability';
function fixture(mode:Case){
 const b=prior(mode==='control'?'effective':'ineffective');let s=b.s,d=b.d;
 if(mode==='severity')s=changeDefinition(s,'definition/configurable-garden',3n,q(0,1));
 if(mode==='likelihood'){
  let changed=0;const rows=items(decode(d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(REAPPRAISAL_SOURCE)&&signedValue(a[0])===7n){const p=[...items(a[3],'list')];expect(p[2]).toBe(true);expect(p[3]).toBe(true);p[3]=false;a[3]=list(p);changed++;}return list(a);});expect(changed).toBe(1);d={...d,orderedInputs:enc(list(rows))};
 }
 if(mode==='vulnerability'){
  const state=restoreAuthoritativeState(decode(d.initialState)),path=bodyPath(C);
  d={...d,initialState:enc(new AuthoritativeState(state.entries().map(e=>e.path.rootStateTypeId===path.rootStateTypeId?{...e,value:record(454,[q(100,1),f(rec(e.value,454n),2n)])}:e)).canonicalValue())};
 }
 return {s,d};
}
const cache=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let s=cache.get(r);if(!s){s=r.snapshot();cache.set(r,s);}return s;};
async function step(r:Run){cache.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(32);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(32);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const reports=(r:Run,tag:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const frac=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
const trace=(r:Run)=>outputs(snap(r).trace,160n),event=(t:ReturnType<typeof trace>[number])=>rec(f(t,4n),130n);
function actual(r:Run,type:bigint){
 const rows=trace(r).filter(t=>signedValue(f(event(t),2n))===9n).map(t=>f(t,13n)).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
 expect(rows,'actual output type'+type+' at9').toHaveLength(1);return rec(rows[0],type);
}
function projection(r:Run){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===9n)!;expect(a,'live completed affect9').toBeDefined();expect(txt(a[5])).toBe('Known');
 const provenance=items(a[7],'list'),factors=items(provenance[4],'list');expect(factors).toHaveLength(4);for(const v of factors)readQ(v);
 const joint=items(provenance[1],'list');expect(txt(joint[0])).toBe(JOINT_APPRAISAL);expect(reports(r,JOINT_APPRAISAL)).toContainEqual(joint);
 const task=provenance[0],row=items(joint[4],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(task))!;expect(row,'live selected physical task').toHaveLength(5);
 expect(factors[1]).toEqual(row[1]);expect(factors[2]).toEqual(row[2]);
 const concern=actual(r,388n),response=items(f(concern,3n),'list').map(v=>rec(v,387n)).find(v=>key(f(v,1n))===key(task))!;expect(response,'live immediate concern row').toBeDefined();
 const raw=actual(r,403n),reasons=actual(r,408n),signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const mapped=signals.filter(v=>key(f(rec(f(v,1n),401n),2n))===key(task));
 const importance=state(r).read(importancePath(task));
 const query=reports(r,AFFECT_RECALL).find(v=>signedValue(v[1])===10n)!;expect(query,'actual later recall10').toBeDefined();
 const carry=unpackAffectCue(query[2],10n);expect(items(query[2],'list')[2]).toEqual(list(a));expect(carry.carry?.at).toBe(9);
 expect(trace(r).some(t=>uint(f(event(t),1n))===carry.source&&key(f(t,13n))===key(list(a)))).toBe(true);
 const [p,s,v,c]=factors.map(readQ),E=p.multiply(s).multiply(Q.of(1n).add(v)).divide(Q.of(2n)),U=E.multiply(Q.of(1n).subtract(c)),gain=Q.of(1n).add(U);
 expect(items(a[6],'list').map(frac)).toEqual([E,U].map(n=>n.numerator+'/'+n.denominator));expect(readQ(query[3]).equals(gain)).toBe(true);
 const scores=items(query[4],'list').map(v=>items(v,'list'));expect(scores).toHaveLength(2);for(const row of scores)expect(readQ(row[3]).equals(readQ(row[1]).add(gain.multiply(readQ(row[2]))))).toBe(true);
 return {a,factors,joint,task,row,concern,response,raw,reasons,mapped,importance,query,scores};
}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const p of ['state','outputs','trace'] as const)bytes(x[p],y[p]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
it('M68 fixed four-factor correspondence and actual receiver diagnostic',async()=>{
 const cases:Case[]=['baseline','control','likelihood','severity','vulnerability'];
 const results=new Map<Case,ReturnType<typeof projection>>();let prefix:ReturnType<Run['snapshot']>|undefined,baselineBelief:CanonicalValue|undefined;
 const expected:Record<Case,string[]>={baseline:['1/1','7/10','59/60','0/1'],control:['1/1','7/10','59/60','1/1'],likelihood:['0/1','7/10','59/60','0/1'],severity:['1/1','0/1','59/60','0/1'],vulnerability:['1/1','7/10','49/60','0/1']};
 for(const mode of cases){
  const b=fixture(mode),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);
  await through(r,3n);if(mode==='baseline')prefix=snap(r);else if(mode==='control'||mode==='likelihood'){bytes(snap(r).state,prefix!.state);bytes(snap(r).outputs,prefix!.outputs);}
  await through(r,10n);const p=projection(r);results.set(mode,p);expect(p.factors.map(frac)).toEqual(expected[mode]);
  const belief=state(r).read(reappraisalPath(C)).value!;if(mode==='baseline')baselineBelief=belief;else if(mode==='severity'||mode==='vulnerability')expect(belief).toEqual(baselineBelief);
  console.info('M68 CASE '+mode+' '+JSON.stringify({factors:p.factors.map(frac),affect:items(p.a[6],'list').map(frac),gain:frac(p.query[3]),scores:p.scores.map(v=>frac(v[3])).sort(),mappedImportancePresent:p.importance.presence,mappedSignalRoles:p.mapped.map(v=>String(uint(f(rec(f(v,1n),401n),3n)))),reasonCount:items(f(p.reasons,3n),'list').length}));
 }
 const base=results.get('baseline')!;
 for(const mode of ['control','likelihood'] as const){
  const p=results.get(mode)!;expect(p.a[6]).not.toEqual(base.a[6]);expect(p.query[3]).not.toEqual(base.query[3]);
  expect(p.row).toEqual(base.row);expect(p.concern).toEqual(base.concern);expect(p.raw).toEqual(base.raw);expect(p.reasons).toEqual(base.reasons);
  console.info('M68 BLOCKER '+mode+': completed affect/retrieval differ, but actual joint concern/raw/reasons9 remain exact. Mapped ground availability reported separately; no matched-response qualification.');
 }
 const wide=results.get('severity')!;expect(wide.factors[1]).toEqual(q(0,1));expect(base.factors[1]).toEqual(q(7,10));
 console.info('M68 SEMANTIC GAP: severity follows goal interval distance, not an independently governed consequence valuation. Original AFFECT :4..13 stay explicit; diagnostic success is not member acceptance.');
},540000);
it('M68 unchanged baseline exact repeat and restore before appraisal',async()=>{
 const b=fixture('baseline'),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d);
 await through(a,8n);await through(repeat,8n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 for(const r of [a,repeat,restored]){await through(r,10n);projection(r);await finish(r);}exact(a,repeat);exact(a,restored);
 console.info('M68 PERSISTENCE PASS exact repeated/restored state/output/trace/save/run identity8->101.');
},540000);
