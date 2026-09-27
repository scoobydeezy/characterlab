import {describe,it,expect} from 'vitest';
import {prepareNoDetectionAttentionPool,selectAttention,consumeSelected,selectedReferences} from '../campaign3/attentionSelection';
const input=()=>({observerId:'observer/a',observationId:0n,occurredAt:1n,detections:[] as unknown[]});
describe('no-detection selection component',()=>{
 it('EVS-A: actual selector yields an empty one-use view without an experience',()=>{const selected=selectAttention(prepareNoDetectionAttentionPool(input()),2);expect(selected.audit).toEqual([]);expect(selectedReferences(selected.view)).toEqual([]);expect(consumeSelected(selected.view,[])).toEqual([]);expect(()=>consumeSelected(selected.view,[])).toThrow();});
 it('EVS-B: positive detections, invalid headers and extra source fields reject',()=>{for(const v of [{...input(),detections:[{}]},{...input(),observationId:-1n},{...input(),occurredAt:-1n},{...input(),observerId:''},{...input(),experienceId:3n}])expect(()=>prepareNoDetectionAttentionPool(v)).toThrow();});
 it('EVS-C: executable input and array metadata cannot fabricate an empty branch',()=>{const a=input();Object.defineProperty(a,'detections',{get(){throw Error('getter executed');}});expect(()=>prepareNoDetectionAttentionPool(a)).toThrow('no-detection fields');const b=input();Object.assign(b.detections,{hidden:true});expect(()=>prepareNoDetectionAttentionPool(b)).toThrow('empty array');});
});
