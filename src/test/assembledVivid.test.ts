import {it,expect} from 'vitest';
import {fixture as prior,items,decode,key,enc,list,text,signed,u,exact,bytes,outputs,rec,f,uint,C,target,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {SOCIAL_SOURCE,SOCIAL_OBSERVATION} from '../assembled/social';
import {VIVID_RULES,VIVID_REGISTRY} from '../assembled/model';
import {VIVID,appearanceEpisode,isAppearancePath,FAMILIARITY} from '../assembled/familiarity';
import {RECOLLECTION} from '../assembled/recollection';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {PerceptualFeatureId as CF} from '../semanticBinding/perceptualClassification';
import {sensoryPresentation} from '../campaign3/vividRecollection';
export type Mode156='clear'|'weak'|'partial'|'unspecified'|'deniedQuality'|'deniedEpisode'|'hidden'|'hiddenDenied';
export function fixture156(mode:Mode156='clear'){
 const b=prior(mode==='hidden'?'hidden':'same'),rows=items(decode(b.d.orderedInputs),'list'),template=items(rows.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list');
 const events=[1,2,4,5].map(at=>{const a=[...template],p=[...items(a[3],'list')],src=[...items(p[1],'list')];a[0]=signed(at);src[4]=u(at);src[5]=!(mode==='deniedEpisode'&&at===1);p[1]=list(src);
 const lanes=items(p[4],'list'),features=items(lanes[0],'list').map(v=>{const x=[...items(v,'list')];if(key(x[0])===key(text(CF.ObservedBluntForm)))x[2]=at===1;return list(x);});
 const quality=[CF.ObservedMetallicSurface,CF.ObservedElongatedForm,CF.ObservedBluntForm].map((feature,i)=>list([text(feature),u(mode==='weak'||mode==='hiddenDenied'?1:2),at===1&&mode!=='deniedQuality'&&mode!=='hiddenDenied'&&(mode!=='partial'||i===0)]));
 p[4]=list([list(features),lanes[1],...(mode==='unspecified'?[]:[list(quality)])]);a[3]=list(p);return list(a);});
 return {...b,s:{...b.s,rulesVersion:VIVID_RULES,registrySchemaVersion:VIVID_REGISTRY},d:{...b.d,orderedInputs:enc(list([...rows.filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE)),...events]))},mode};
}
export type Run156=Awaited<ReturnType<typeof createCharacterRun>>;
export async function start156(mode:Mode156='clear'){const b=fixture156(mode),m=await prepareCharacterModel(b.s),run=await createCharacterRun(m,b.d);return {b,m,run};}
export const state156=(run:Run156)=>restoreAuthoritativeState(decode(run.snapshot().state));
export const imprints156=(run:Run156)=>state156(run).entries().filter(e=>isAppearancePath(e.path));
export const tagged156=(run:Run156,tag:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
export function report156(run:Run156,at:number){const rows=tagged156(run,VIVID).filter(a=>key(a[1])===key(signed(at)));expect(rows,'one actual live sensory recollection').toHaveLength(1);return rows[0];}
export async function through156(run:Run156,at:bigint){for(let i=0;run.snapshot().clock<at;i++){expect(i).toBeLessThan(96);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(at);}
export async function finish156(run:Run156,peers:Run156[]=[]){for(let i=0;i<96;i++){const more=await run.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(more);exact(run,p);}if(!more)return;}throw Error('M156 queue cap');}
export function original156(out:readonly CanonicalValue[]){const facets=items(out[3],'list').map(v=>{const a=items(v,'list');return {kind:'visual' as const,value:a[1]===true,clarity:Number(uint(a[2]))};}),published=items(out[2],'list').length===1;
 expect(text(sensoryPresentation(facets,published,'PerceptualFidelity'))).toEqual(out[4]);
 return {detail:sensoryPresentation(facets,published,'DetailCount'),access:sensoryPresentation(facets,published,'AccessOnly')};}
it('primary156: actual admitted clarity changes recent recollection while genuine fidelity loss leaves one facet',async()=>{
 const a=await start156(),b=await start156('weak');await through156(a.run,1n);await through156(b.run,1n);
 const first=imprints156(a.run)[0];expect(first).toBeDefined();expect(appearanceEpisode(first.value)).toHaveLength(10);
 const observation=tagged156(a.run,SOCIAL_OBSERVATION)[0];expect(items(items(observation[2],'list')[1],'list')).toHaveLength(3);
 await through156(a.run,2n);await through156(b.run,2n);const clear=report156(a.run,2),weak=report156(b.run,2);
 expect(clear[4]).toEqual(text('Vivid'));expect(weak[4]).toEqual(text('Weak'));expect(clear[2]).toEqual(weak[2]);
 const values=(o:readonly CanonicalValue[])=>items(o[3],'list').map(v=>items(v,'list').slice(0,2));expect(values(clear)).toEqual(values(weak));expect(values(clear)).toHaveLength(3);expect(original156(weak).detail).toBe('Vivid');
 const frozen=list(clear);await through156(a.run,4n);expect(report156(a.run,4)[4]).toEqual(text('Vivid'));const lost=appearanceEpisode(state156(a.run).read(first.path).value!);expect(items(lost[9],'list')).toEqual([list([u(2)]),list([]),list([])]);expect(lost[8]).toEqual(list([]));expect(lost.slice(0,8)).toEqual(appearanceEpisode(first.value).slice(0,8));
 await through156(a.run,5n);expect(report156(a.run,5)[4]).toEqual(text('Fragmentary'));expect(items(report156(a.run,5)[3],'list')).toHaveLength(1);expect(original156(report156(a.run,5)).access).toBe('Vivid');
 expect(tagged156(a.run,VIVID).map(list)).toContainEqual(frozen);
 await finish156(a.run);await finish156(b.run);expect(tagged156(a.run,FAMILIARITY)).toEqual(tagged156(b.run,FAMILIARITY));expect(tagged156(a.run,RECOLLECTION)).toEqual(tagged156(b.run,RECOLLECTION));
 for(const run of[a.run,b.run])for(const out of tagged156(run,VIVID))original156(out);
 const tr=outputs(a.run.snapshot().trace,160n).find(t=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'&&v.items.some(x=>key(x)===key(frozen));});expect(tr).toBeDefined();expect(items(f(tr!,11n),'list').length).toBeGreaterThan(0);expect(items(f(tr!,12n),'list')).toHaveLength(2);
 console.info('M156 PRIMARY PASS actual quality observation->same C1/attention->retained fidelity; clear/weak same values/access; actual3->1 sensory loss; semantic familiarity/reconstruction unchanged; captured original readouts');
},540000);
it('continuation156: independent repeat and saves on both sides of fidelity loss preserve every later canonical boundary',async()=>{
 const x=await start156(),repeat=await createCharacterRun(x.m,x.b.d);await through156(x.run,1n);await through156(repeat,1n);exact(x.run,repeat);
 const restore=(save:Uint8Array)=>restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save});
 const before=await restore(x.run.save());while(x.run.snapshot().clock<4n){expect(await x.run.settleNextInstant()).toBe(true);for(const p of[repeat,before]){expect(await p.settleNextInstant()).toBe(true);exact(x.run,p);}}
 const after=await restore(x.run.save());exact(x.run,after);await finish156(x.run,[repeat,before,after]);expect(report156(x.run,5)[4]).toEqual(text('Fragmentary'));
 console.info('M156 CONTINUATION PASS independent repeat/save1/save4 full state/output/trace/save/identity at every later settlement and full queues');
},540000);
it('contrasts156: missing partial denied quality and hidden sources never invent vividness',async()=>{
 for(const [mode,band] of [['partial','Fragmentary'],['unspecified','Empty'],['deniedQuality','Empty'],['deniedEpisode','Unavailable']] as const){const x=await start156(mode);await finish156(x.run);expect(report156(x.run,2)[4],mode).toEqual(text(band));for(const out of tagged156(x.run,VIVID))original156(out);}
 for(const pair of [['clear','hidden'],['deniedQuality','hiddenDenied']] as const){const a=await start156(pair[0]),b=await start156(pair[1]);for(let i=0;i<96;i++){const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);bytes(a.run.snapshot().state,b.run.snapshot().state);bytes(a.run.snapshot().outputs,b.run.snapshot().outputs);if(!more)break;if(i===95)throw Error('privacy queue cap');}}
 console.info('M156 CONTRASTS PASS partial/missing/denied clarity and denied acquisition; fixed-display hidden truth and denied-but-changed quality preserve whole safe state/output');
},540000);
export {items,decode,key,enc,list,text,signed,u,exact,bytes,outputs,rec,f,uint,C,target,CF};
export type {CanonicalValue};
