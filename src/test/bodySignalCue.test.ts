import {describe,it,expect} from 'vitest';
import {typedIdentifier,text,unsigned,signed,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {admitBodySignalCue as admit} from '../campaign3/bodySignalCue';
import {recallBodyByAcquisitionRecency as recall} from '../campaign3/bodyRecall';
import {selectInteroceptiveSignals as select,consumeInteroceptiveSignals as consume,type SignalSelectionInput} from '../campaign3/interoceptiveSignalSelection';
const observer=typedIdentifier(1000,text('observer/fixture')),channel=typedIdentifier(1005,text('channel/alpha'));
const sample=(present=true,lo=0):CanonicalValue=>present?r(461,[typedIdentifier(1115,unsigned(1)),observer,channel,signed(2),r(462,[rational(lo,1),rational(lo+1,1)]),text('embodied-level-observation/0.1-candidate')]):r(463,[typedIdentifier(1115,unsigned(1)),observer,channel,signed(2),text('embodied-level-observation/0.1-candidate')]);
const input=(samples=[sample()]):SignalSelectionInput=>({opportunityId:17n,observer,at:2n,declarations:[{channel,signal:'alpha'}],samples});
const memory=[{id:812n,acquiredAt:1n,kind:'Interoceptive' as const,units:[{key:'alpha',views:[new Uint8Array([42])]}]}];
const limits={maxSignals:1,maxViewsPerSignal:1,maxBytesPerSignal:4096,capacity:0};
describe('independent current body cue',()=>{
 it('BC-A: actual zero-valued observation recalls old memory while acquisition selects nothing',()=>{const source=input(),before=structuredClone(memory);expect(consume(select(source,limits).view).groups).toEqual([]);const result=admit(source,2n,true);expect(result.cue).toEqual({kind:'Present',signals:['alpha']});expect(result.provenance.opportunityId).toBe(source.opportunityId);expect(recall(memory,result.cue,2n,1).recalled[0].id).toBe(812n);expect(memory).toEqual(before);});
 it('BC-B: acquisition-gated comparator fails at zero capacity and converges when selection is enabled',()=>{const source=input();for(const capacity of [0,1]){const groups=consume(select(source,{...limits,capacity}).view).groups;const coupled=groups.length?{kind:'Present' as const,signals:groups.map(g=>g.signal)}:{kind:'Absent' as const};expect(recall(memory,coupled,2n,1).recalled).toHaveLength(capacity);expect(recall(memory,admit(source,2n,true).cue,2n,1).recalled).toHaveLength(1);}});
 it('BC-C: permission without actual present evidence cannot cue; denied actual evidence cannot cue',()=>{for(const [source,permitted] of [[input([]),true],[input([sample(false)]),true],[input(),false]] as const)expect(admit(source,2n,permitted).cue).toEqual({kind:'Absent'});});
 it('BC-D: stale, foreign observer, duplicate and undeclared observations reject',()=>{for(const source of [{...input(),at:1n},{...input(),observer:typedIdentifier(1000,text('other'))},input([sample(),sample()]),{...input(),declarations:[]}])expect(()=>admit(source,2n,true)).toThrow();});
 it('BC-E: value magnitude does not change signal eligibility; provenance contains no sample payload',()=>{const a=admit(input(),2n,true),b=admit(input([sample(true,90)]),2n,true);expect(a.cue).toEqual(b.cue);expect(Object.keys(a.provenance).sort()).toEqual(['at','observer','opportunityId','supportingObservationIds']);expect(a.provenance.supportingObservationIds).toHaveLength(1);});
});
