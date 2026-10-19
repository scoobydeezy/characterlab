import {it,expect} from 'vitest';
import {recordedCausalHistory} from '../workbench/causalNavigation';
import type {TimelineEvent} from '../workbench/contracts';
import {ValuesWorkbenchRun} from '../workbench/valuesAdapter';
const event=(id:string,parents:string[]=[]):TimelineEvent=>({id,parents,instant:id,phase:'1',stage:'test',reads:[],diffs:[],input:'',output:'',draws:'',quantization:''});
it('retains shared ancestors, direct edges, shortest distances and external boundaries',()=>{
 const events=[event('0'),event('1',['0']),event('2',['0','external']),event('3',['1','2']),event('4',['3'])];
 const result=recordedCausalHistory(events,'3');
 expect(result.nodes.map(n=>[n.event.id,n.distance])).toEqual([['3',0],['1',1],['2',1],['0',2]]);
 expect(result.edges).toHaveLength(5);expect(result.missing).toEqual(['external']);expect(result.cyclic).toBe(false);expect(result.children.map(e=>e.id)).toEqual(['4']);
});
it('reports cycles without recursion and rejects ambiguous or oversized input',()=>{
 expect(recordedCausalHistory([event('a',['b']),event('b',['a'])],'a').cyclic).toBe(true);
 expect(()=>recordedCausalHistory([event('a'),event('a')],'a')).toThrow('unique');
 expect(()=>recordedCausalHistory([], 'a')).toThrow('not retained');
 const chain=Array.from({length:1001},(_,i)=>event(String(i),i?[String(i-1)]:[]));
 expect(()=>recordedCausalHistory(chain,'1000')).toThrow('1000 IDs');
 expect(()=>recordedCausalHistory(Array.from({length:10001},(_,i)=>event(String(i))),'0')).toThrow('10000 retained');
 expect(()=>recordedCausalHistory([event('0',Array(50001).fill('missing'))],'0')).toThrow('50000');
});
it('joins every native Values event and preserves historical ancestry after later execution',async()=>{
 const run=await ValuesWorkbenchRun.create();let historical:ReturnType<typeof recordedCausalHistory>|undefined;
 for(let prefix=1;prefix<=4;prefix++){
  await run.advance();const before=run.checkpoint(),snapshot=run.snapshot();
  for(const selected of snapshot.timeline){
   const history=recordedCausalHistory(snapshot.timeline,selected.id);
   expect(history.cyclic).toBe(false);expect(history.missing).toEqual([]);
   for(const edge of history.edges)expect(snapshot.timeline.find(e=>e.id===edge.child)?.parents).toContain(edge.parent);
  }
  if(prefix===2){const reason=snapshot.reasons[0];expect(reason.eventId).toBeTruthy();historical=recordedCausalHistory(snapshot.timeline,reason.eventId);}
  if(prefix===4&&historical){const later=recordedCausalHistory(snapshot.timeline,historical.selected);expect(later.nodes).toEqual(historical.nodes);expect(later.edges).toEqual(historical.edges);}
  expect(run.checkpoint()).toEqual(before);
 }
},600000);
