/** M54: one holder; three physical tasks; body30/rate10/width1.
 * Body, visual position and trial-context channels live. Same model/goals/seed0;
 * only historical permitted x15 changes1->0. No final-choice claim or law switch. */
import {it,expect} from 'vitest';
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {SPATIAL_MEANING,SPATIAL_MEANING_VERSION,GOAL_MEANING} from '../assembled/goalMeaning';
import {SIGNIFICANCE,named,directions} from '../assembled/significance';
import {POSITION_SOURCE} from '../assembled/positionPerception';
import {RETAINED_ATTRIBUTION} from '../assembled/retainedAttribution';
import {RECALL,isPositionEpisodePath} from '../assembled/memory';
import {fixture,decode,items,key,enc} from './fixtures/assembledSpatialMeaning';
import {signedValue,outputs,type Run} from './fixtures/assembledComparison';
import {dataField as f,dataRecord as rec,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';

type Snapshot=ReturnType<Run['snapshot']>;
function history(x:0|1,denied=false){
 const {s,d}=fixture(),rows=items(decode(d.orderedInputs),'list');let changed=0;
 d.orderedInputs=enc(list(rows.map(v=>{
  const a=items(v,'list');if(signedValue(a[0])!==15n||key(a[2])!==key(POSITION_SOURCE))return v;
  changed++;const p=items(a[3],'list'),pos=[...items(p[1],'list')];
  expect(pos[0]).toEqual(u(1));pos[0]=u(x);if(denied)pos[4]=false;
  return list([...a.slice(0,3),list([p[0],list(pos),p[2]]),a[4]]);
 })));expect(changed).toBe(1);return {s,d};
}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function same(a:Snapshot,b:Snapshot){expect(a.clock).toBe(b.clock);expect(a.status).toBe(b.status);for(const k of ['state','outputs','trace'] as const)bytes(a[k],b[k]);}
const reports=(s:Snapshot,tag:string)=>items(decode(s.outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const last=(s:Snapshot,tag:string)=>reports(s,tag).at(-1)!;
const assessment=(p:readonly CanonicalValue[])=>named(p[5],'assessment');
const target=(s:Snapshot)=>restoreAuthoritativeState(decode(s.state)).entries().find(e=>isPositionEpisodePath(e.path)&&signedValue(items(e.value,'list')[5])===15n);
async function advance(r:Run,from:number,to:number){for(let n=from;n<to;n++)expect(await r.settleNextInstant()).toBe(true);const s=r.snapshot();expect(s.clock).toBe(BigInt(to));return s;}
const ages=(p:readonly CanonicalValue[])=>items(p[4],'list').map(v=>signedValue(items(items(v,'list')[1],'list')[5]));
function completeAttribution(s:Snapshot){
 const a=last(s,RETAINED_ATTRIBUTION),m=last(s,GOAL_MEANING);
 expect(items(a[3],'list')).toHaveLength(4);
 for(const g of items(a[3],'list'))expect(named(g,'kind')).toEqual(text('Grouped'));
 expect(named(a[4],'kind')).toEqual(text('Result'));const result=named(a[4],'result');
 expect(items(named(result,'consumed'),'list')).toHaveLength(16);
 expect(named(assessment(m),'kind')).toEqual(text('Assessed'));expect(named(m[5],'kind')).toEqual(text('Qualifies'));
 expect(named(m[5],'direction')).toEqual(text('MovingCloser'));expect(m[7]).toEqual(list(a));
 return result;
}
function tracePath(s:Snapshot){
 const traces=outputs(s.trace,160n),spatial=traces.filter(t=>txt(f(t,6n))===SPATIAL_MEANING_VERSION&&signedValue(f(rec(f(t,4n),130n),2n))===33n);
 expect(spatial).toHaveLength(1);const p=last(s,SPATIAL_MEANING),t=spatial[0];
 expect(items(f(t,12n),'list')[0]).toEqual(p[3]);expect(f(t,13n)).toEqual(list([list(p)]));expect(items(f(t,11n),'list')).toHaveLength(1);
 // The claimed appraisal/attribution/consolidation path is deterministic.
 const path=traces.filter(t=>[40n,50n,140n].includes(uint(f(rec(f(t,4n),130n),3n))));
 expect(path.length).toBeGreaterThan(0);for(const t of path)expect(items(f(t,14n),'list')).toHaveLength(0);
 for(const slot of items(p[4],'list')){const episode=items(slot,'list')[1];expect(reports(s,RECALL).some(r=>signedValue(r[1])===33n&&key(r[2])===key(episode))).toBe(true);}
}
it('witness: one perceived historical difference crosses the full same-law path',async()=>{
 const A=history(1),B=history(0);expect(A.s).toEqual(B.s);for(const k of ['initialState','runSeed'] as const)bytes(A.d[k],B.d[k]);
 const ar=items(decode(A.d.orderedInputs),'list'),br=items(decode(B.d.orderedInputs),'list');expect(ar.length).toBe(br.length);
 const changed=ar.flatMap((v,i)=>key(v)===key(br[i])?[]:[i]);expect(changed).toHaveLength(1);
 const ai=items(ar[changed[0]],'list'),bi=items(br[changed[0]],'list');expect(signedValue(ai[0])).toBe(15n);
 const ap=items(ai[3],'list'),bp=items(bi[3],'list'),av=items(ap[1],'list'),bv=items(bp[1],'list');
 expect(av[0]).toEqual(u(1));expect(bv[0]).toEqual(u(0));expect(av.slice(1)).toEqual(bv.slice(1));expect(ap[0]).toEqual(bp[0]);expect(ap[2]).toEqual(bp[2]);expect(ai.filter((_,i)=>i!==3)).toEqual(bi.filter((_,i)=>i!==3));
 const model=await prepareCharacterModel(A.s),identity=characterModelIdentity(model),a=await createCharacterRun(model,A.d),b=await createCharacterRun(model,B.d);bytes(characterModelIdentity(model),identity);
 const a17=await advance(a,0,17),b17=await advance(b,0,17),ra=completeAttribution(a17),rb=completeAttribution(b17);
 console.info('M54 LIVE17: both four grouped trials,16 consumed operands and Assessed/Qualifies reserve meaning.');
 expect(named(ra,'disposition')).toEqual(text('Supported'));expect(named(rb,'disposition')).toEqual(text('Unavailable'));
 const ea=target(a17)!,eb=target(b17)!;expect(ea).toBeDefined();expect(eb).toBeDefined();
 expect(directions(items(ea.value,'list')[7])).toEqual(['MovingCloser']);expect(directions(items(eb.value,'list')[7])).toEqual([]);
 expect(reports(a17,SIGNIFICANCE)).toHaveLength(1);expect(reports(b17,SIGNIFICANCE)).toHaveLength(0);
 const a33=await advance(a,17,33),b33=await advance(b,17,33),pa=last(a33,SPATIAL_MEANING),pb=last(b33,SPATIAL_MEANING);
 expect(named(assessment(pa),'kind')).toEqual(text('Assessed'));expect(named(assessment(pb),'kind')).toEqual(text('Assessed'));
 console.info('M54 LIVE33: both current spatial appraisals Assessed.');
 expect(pa[2]).toEqual(pb[2]);const state=(s:Snapshot)=>restoreAuthoritativeState(decode(s.state)).entries();
 for(const root of [373n,455n])expect(state(a33).filter(e=>e.path.rootStateTypeId===root)).toEqual(state(b33).filter(e=>e.path.rootStateTypeId===root));
 expect(target(a33)!.value).toEqual(ea.value);expect(target(b33)).toBeUndefined();
 expect(ages(pa)).toEqual([15n,32n]);expect(ages(pb)).toEqual([31n,32n]);
 expect(named(assessment(pa),'relation')).toEqual(text('MovingFarther'));expect(named(assessment(pb),'relation')).toEqual(text('SameDistance'));
 for(const s of [a33,b33])tracePath(s);
 console.info('M54 WITNESS same model/S0/goals/seed/reference SF; only permitted x15=1/0 differs. Supported/Unsupported -> acquired credit/no credit -> end15 survives/lost -> actual recall15,32/31,32 -> Farther/Same. Equal current body/goals and all later inputs; no draws on claimed path.');
},600000);
it('continuation: changed history repeats exactly through memory pressure',async()=>{
 const {s,d}=history(0),a=await createCharacterRun(await prepareCharacterModel(s),d),a17=await advance(a,0,17);
 completeAttribution(a17);const save=a.save(),b=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save});same(a17,b.snapshot());bytes(save,b.save());
 const a33=await advance(a,17,33),b33=await advance(b,17,33);same(a33,b33);bytes(a.save(),b.save());
 const p=last(b33,SPATIAL_MEANING);expect(named(assessment(p),'kind')).toEqual(text('Assessed'));expect(named(assessment(p),'relation')).toEqual(text('SameDistance'));
 console.info('M54 CONTINUATION changed history save17 reconstructed exactly; state/output/trace/save33 byte-equal. Reference arm continuation retained from unchanged M53.');
},600000);
it('epistemic: denied historical positions cannot affect meaning or credit',async()=>{
 const A=history(1,true),B=history(0,true),model=await prepareCharacterModel(A.s),a=await createCharacterRun(model,A.d),b=await createCharacterRun(model,B.d);
 const sa=await advance(a,0,17),sb=await advance(b,0,17);
 for(const tag of [RETAINED_ATTRIBUTION,GOAL_MEANING,SPATIAL_MEANING,SIGNIFICANCE])expect(reports(sa,tag)).toEqual(reports(sb,tag));
 for(const s of [sa,sb]){expect(target(s)).toBeUndefined();expect(reports(s,SIGNIFICANCE)).toHaveLength(0);expect(named(named(last(s,RETAINED_ATTRIBUTION)[4],'result'),'disposition')).toEqual(text('Unavailable'));}
 console.info('M54 DENIAL hidden x15=1/0 yields identical attribution/reserve/spatial reports, no end15 memory or significance. Missing perception stays missing.');
},600000);
