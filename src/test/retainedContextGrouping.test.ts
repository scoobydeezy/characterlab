import {it,expect} from 'vitest';
import {groupRetainedPositionTrial as group} from '../campaign3/retainedContextGrouping';
import {groupPerceivedPositionTrial as full} from '../campaign3/perceivedTrialGrouping';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {copyPerceivedTrialContext,type PerceivedTrialContext} from '../campaign3/perceivedTrialContext';
const observer='observer/a',context={observerId:observer,observerEventSequence:0n};
// Supplied structural comparison; actual producer composition is covered by SC-A..AC.
const rows=():PerceivedTrialContext[]=>[20n,100n,1n,2n].map((experience,i)=>({experience,context:{...context},panel:{observation:BigInt(i+200),sample:{kind:'Present',at:BigInt(i+1),glyph:0,stage:(['Before','Motion','Motion','After'] as const)[i]}}}));
const complete=(r:PerceivedTrialContext)=>({role:copyPerceivedTrialContext(r).panel.sample.stage,experience:assemblePreRecognitionExperience({experienceId:r.experience,observerId:observer,occurredAt:r.panel.sample.at,perceptualEventReferentIds:[r.context],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:observer,observationId:r.panel.observation}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'})});
function permutations<T>(xs:T[]):T[][]{return xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest])):[[]];}
it('RCG-A: narrow retained companions reproduce the full-experience rule under every input permutation',()=>{
 const r=rows(),expected=full(observer,context,r.map(complete));for(const order of permutations(r))expect(group(observer,context,order)).toEqual(expected);expect(expected).toMatchObject({kind:'Grouped',startExperience:100n,endExperience:1n});
});
it('RCG-B: missing, foreign and ambiguous context cannot be replaced by proximity',()=>{
 const r=rows();expect(group(observer,null,r)).toEqual({kind:'Unavailable',reason:'MissingContext'});expect(group(observer,context,r.slice(1))).toEqual({kind:'Unavailable',reason:'IncompleteContext'});
 r[3].context={...r[3].context,observerEventSequence:1n};expect(group(observer,context,r).kind).toBe('Unavailable');
 const extra=rows()[0];extra.experience=999n;expect(group(observer,context,[...rows(),extra])).toEqual({kind:'Unavailable',reason:'AmbiguousRole'});
});
it('RCG-C: duplicates, observer mismatch and missing source chronology reject',()=>{
 const r=rows();expect(()=>group(observer,context,[...r,r[0]])).toThrow('DUPLICATE');expect(()=>group('observer/b',context,r)).toThrow('OBSERVER');r[2].panel.sample={...r[2].panel.sample,at:2n};expect(()=>group(observer,context,r)).toThrow('ORDER');
 r[2].panel.sample={...r[2].panel.sample,at:3n};r[3].panel.sample={...r[3].panel.sample,at:3n};expect(()=>group(observer,context,r)).toThrow('ORDER');
});
it('RCG-D: retained companion rejects extra fields and getters without resolving any old experience',()=>{
 const r=rows();let calls=0;Object.defineProperty(r[0],'fullExperience',{enumerable:true,get(){calls++;throw Error('archive lookup');}});expect(()=>group(observer,context,r)).toThrow('SHAPE');expect(calls).toBe(0);
 const bad=rows();bad[0].panel.observation=-1n;expect(()=>group(observer,context,bad)).toThrow('DOMAIN');
});
it('RCG-E: returned event-file does not alias retained input; the bound remains16',()=>{
 const r=rows(),result=group(observer,context,r);(r[0].context as {observerEventSequence:bigint}).observerEventSequence=5n;expect(result).toMatchObject({context});expect(()=>group(observer,context,Array.from({length:17},()=>rows()[0]))).toThrow('BOUND');
});
