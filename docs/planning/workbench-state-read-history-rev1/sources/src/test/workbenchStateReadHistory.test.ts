import {it,expect} from 'vitest';
import type {TimelineEvent} from '../workbench/contracts';
import {recordedStateReadHistory as inspect} from '../workbench/stateReadHistory';
const event=(id:string,reads:TimelineEvent['reads']=[],diffs:TimelineEvent['diffs']=[]):TimelineEvent=>({id,instant:'1',phase:'1',stage:'test',parents:[],reads,diffs,input:'',output:'',draws:'',quantization:''});
const diff=(before:string,after:string,path='p')=>({path,label:path,before,after,changed:before!==after});
const read=(exact:string,path='p')=>({path,label:path,exact});
it('uses preceding trace order, including unchanged writes, without same-event or future leakage',()=>{
 const events=[event('99',[],[diff('0','1')]),event('2',[],[diff('1','1')]),event('1',[read('1')],[diff('1','2')]),event('0',[],[diff('2','3')])];
 const before=JSON.stringify(events),h=inspect(events,'1');expect(h.reads[0].priorMutation?.event.id).toBe('2');expect(h.reads[0].priorMutation?.changed).toBe(false);expect(h.reads[0].relation).toBe('exact-value-match');
 expect(inspect(events.slice(0,3),'1')).toEqual(h);expect(JSON.stringify(events)).toBe(before);
 h.reads[0].priorMutation!.event.id='mutated';expect(events[1].id).toBe('2');
});
it('preserves missing provenance, mismatches, removal/absence and repeated reads',()=>{
 const events=[event('1',[],[diff('7','Absent'),diff('2','4','q')]),event('2',[read('Absent'),read('0'),read('3','q'),read('9','missing')])];
 const h=inspect(events,'2');expect(h.reads.map(r=>r.relation)).toEqual(['exact-value-match','value-mismatch','value-mismatch','no-prior-recorded-mutation']);expect(h.reads[2].priorMutation?.after).toBe('4');expect(h.reads[3].priorMutation).toBeNull();
 expect(inspect([event('1')],'1').reads).toEqual([]);
});
it('rejects ambiguous identities, duplicate mutations, inconsistent flags and retention overflow',()=>{
 expect(()=>inspect([event('1'),event('1')],'1')).toThrow('Duplicate event');
 expect(()=>inspect([event('1',[],[diff('0','1'),diff('1','2')])],'1')).toThrow('Duplicate mutation');
 expect(()=>inspect([event('1',[],[{...diff('0','1'),changed:false}])],'1')).toThrow('flag');
 expect(()=>inspect([],'1')).toThrow('absent');
 expect(()=>inspect(Array.from({length:10001},(_,i)=>event(String(i))),'0')).toThrow('10000');
 expect(()=>inspect([event('1',Array.from({length:50001},()=>read('0')))],'1')).toThrow('50000');
});
