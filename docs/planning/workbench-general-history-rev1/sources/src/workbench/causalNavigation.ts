import type {TimelineEvent} from './contracts';
export const CAUSAL_NAVIGATION_VERSION='recorded-parent-navigation/0.1';
export function recordedCausalHistory(events:readonly TimelineEvent[],selected:string){
 if(events.length>10000)throw Error('Causal navigation unavailable: more than 10000 retained events.');
 const byId=new Map<string,TimelineEvent>();let links=0;
 for(const event of events){if(byId.has(event.id))throw Error('Causal navigation requires unique event IDs.');byId.set(event.id,event);links+=event.parents.length;if(links>50000)throw Error('Causal navigation unavailable: more than 50000 recorded parent links.');}
 const root=byId.get(selected);if(!root)throw Error('Selected event is not retained in this timeline.');
 const visited=new Set<string>(),missing=new Set<string>(),edges:{parent:string;child:string}[]=[],queue=[{id:selected,distance:0}],nodes:{event:TimelineEvent;distance:number}[]=[];
 for(let i=0;i<queue.length;i++){
  const item=queue[i];if(visited.has(item.id))continue;visited.add(item.id);
  if(visited.size>1000)throw Error('Causal navigation unavailable: ancestor traversal exceeds 1000 IDs.');
  const event=byId.get(item.id);if(!event){missing.add(item.id);continue;}
  nodes.push({event,distance:item.distance});
  for(const parent of new Set(event.parents)){edges.push({parent,child:event.id});queue.push({id:parent,distance:item.distance+1});}
 }
 const degrees=new Map(nodes.map(n=>[n.event.id,0])),children=new Map<string,string[]>();
 for(const edge of edges)if(degrees.has(edge.parent)){degrees.set(edge.child,degrees.get(edge.child)!+1);children.set(edge.parent,[...(children.get(edge.parent)??[]),edge.child]);}
 const ready=[...degrees].filter(([,d])=>d===0).map(([id])=>id);let consumed=0;
 for(let i=0;i<ready.length;i++){consumed++;for(const child of children.get(ready[i])??[]){const d=degrees.get(child)!-1;degrees.set(child,d);if(d===0)ready.push(child);}}
 return {version:CAUSAL_NAVIGATION_VERSION,selected,nodes,edges,missing:[...missing],cyclic:consumed<nodes.length,children:events.filter(e=>e.parents.includes(selected)).map(e=>({id:e.id,stage:e.stage,instant:e.instant}))};
}
