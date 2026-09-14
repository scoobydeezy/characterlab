import {describe,it,expect} from 'vitest';
import {recallBodyByAcquisitionRecency as recall} from '../campaign3/bodyRecall';
import type {TimedAcquisition} from '../campaign3/recencyRetention';
import {fragmentRetainedUnits} from '../campaign3/retentionFragmentation';
const acq=(id:bigint,at:bigint,signals=['alpha']):TimedAcquisition=>({id,acquiredAt:at,kind:'Interoceptive',units:signals.map(key=>({key,views:[new Uint8Array([0]),new Uint8Array([17])]}))});
const cue={kind:'Present' as const,signals:['alpha']};
describe('direct signal / acquisition-recency body recall',()=>{
 it('BR-A: older matching acquisition remains retained but unrecalled under contention',()=>{const memory=[acq(90n,1n),acq(20n,5n),acq(1n,8n)],before=structuredClone(memory),result=recall(memory,cue,10n,2);expect(result.recalled.map(a=>a.id)).toEqual([1n,20n]);expect(result.eligible).toEqual([1n,20n,90n]);expect(memory).toEqual(before);});
 it('BR-B: matching is binary; additional groups/views do not outweigh a newer acquisition',()=>{const old=acq(1n,1n,['alpha','beta']),newer=acq(2n,2n);expect(recall([old,newer],{kind:'Present',signals:['alpha','beta']},3n,1).recalled[0].id).toBe(2n);});
 it('BR-C: acquisition-level recall exposes surviving co-acquired groups, not just cue matches',()=>{const result=recall([acq(1n,1n,['alpha','beta'])],cue,2n,1);expect(result.recalled[0].units.map(u=>u.key)).toEqual(['alpha','beta']);});
 it('BR-D: no current cue cannot be manufactured from retained content; zero-valued retained bytes remain evidence',()=>{const memory=[acq(1n,1n)];expect(recall(memory,{kind:'Absent'},2n,1).recalled).toEqual([]);expect(recall(memory,cue,2n,1).recalled[0].units[0].views[0][0]).toBe(0);expect(recall(memory,{kind:'Present',signals:['other']},2n,1).recalled).toEqual([]);});
 it('BR-E: fragmentation neither rejuvenates acquisition nor returns removed groups',()=>{const original=acq(1n,1n,['alpha','beta']),fragment=fragmentRetainedUnits([original],[{acquisition:1n,unit:'beta'}],{EventContinuant:0,Interoceptive:2}).acquisitions[0];const result=recall([{...fragment,acquiredAt:original.acquiredAt},acq(2n,8n)],cue,10n,2);expect(result.recalled.map(a=>a.id)).toEqual([2n,1n]);expect(result.recalled[1].acquiredAt).toBe(1n);expect(result.recalled[1].units.map(u=>u.key)).toEqual(['alpha']);});
 it('BR-F: exact acquisition-time ties use canonical IDs independent of input order',()=>{const a=acq(2n,1n),b=acq(1n,1n);expect(recall([a,b],cue,2n,1).recalled[0].id).toBe(1n);expect(recall([b,a],cue,2n,1).recalled[0].id).toBe(1n);});
 it('BR-G: zero slots is modeled exclusion; future times and malformed cues reject',()=>{expect(recall([acq(1n,1n)],cue,2n,0).recalled).toEqual([]);expect(()=>recall([acq(1n,3n)],cue,2n,1)).toThrow();expect(()=>recall([],{kind:'Present',signals:['alpha','alpha']},2n,1)).toThrow();});
 it('BR-H: repeated reads do not refresh time; returned bytes cannot mutate memory',()=>{const memory=[acq(1n,1n)],first=recall(memory,cue,9n,1);first.recalled[0].units[0].views[0][0]=99;expect(recall(memory,cue,10n,1).recalled[0].acquiredAt).toBe(1n);expect(memory[0].units[0].views[0][0]).toBe(0);});
});
