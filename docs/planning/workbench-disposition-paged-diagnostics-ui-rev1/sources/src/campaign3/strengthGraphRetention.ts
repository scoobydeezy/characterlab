/** strength-graph-retention-component/0.1-candidate. Complete resolved batch only. */
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode,list,text} from '../substrate/canonicalEncoding';
import {normalizeGraphZeroState} from './graphZeroState';
import {applyGraphEdgeLoss,type DirectedEdgeLoss} from './graphEdgeLoss';
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
export function retainGraphByStrength(keys:readonly string[],weights:readonly (readonly Q[])[],scale:bigint,capacity:Readonly<{nodes:number;edges:number}>){
 const graph=normalizeGraphZeroState(keys,weights,scale);
 // Validate capacities through the shared plan contract on the always-feasible empty graph.
 applyGraphEdgeLoss([],[],scale,[],capacity);
 const candidates=graph.weights.flatMap((row,i)=>row.flatMap((weight,j)=>weight.numerator===0n?[]:[{i,j,weight,source:graph.keys[i],target:graph.keys[j],address:canonicalEncode(list([text(graph.keys[i]),text(graph.keys[j])]))}]));
 candidates.sort((a,b)=>a.weight.compare(b.weight)||compare(a.address,b.address));
 const degree=graph.keys.map((_,i)=>candidates.filter(e=>e.i===i||e.j===i).length);
 let nodes=graph.keys.length,edges=candidates.length;
 const losses:DirectedEdgeLoss[]=[];
 for(const edge of candidates){
  if(nodes<=capacity.nodes&&edges<=capacity.edges)break;
  losses.push(Object.freeze({source:edge.source,target:edge.target}));edges--;
  if(--degree[edge.i]===0)nodes--;if(--degree[edge.j]===0)nodes--;
 }
 const result=applyGraphEdgeLoss(graph.keys,graph.weights,scale,losses,capacity);
 return Object.freeze({...result,losses:Object.freeze(losses)});
}
