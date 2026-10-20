/** graph-edge-loss-component/0.1-candidate: explicit plans, never victim selection. */
import {ExactRational as Q} from '../substrate/exactMath';
import {normalizeGraphZeroState} from './graphZeroState';
export type DirectedEdgeLoss=Readonly<{source:string;target:string}>;
export function applyGraphEdgeLoss(keys:readonly string[],weights:readonly (readonly Q[])[],scale:bigint,losses:readonly DirectedEdgeLoss[],capacity:Readonly<{nodes:number;edges:number}>){
 const graph=normalizeGraphZeroState(keys,weights,scale);
 if(!Number.isInteger(capacity.nodes)||capacity.nodes<0||capacity.nodes>32||!Number.isInteger(capacity.edges)||capacity.edges<0||capacity.edges>992)throw new Error('GRAPH_LOSS_CAPACITY');
 if(!Array.isArray(losses)||losses.length>992)throw new Error('GRAPH_LOSS_PLAN');
 const matrix=graph.weights.map(row=>[...row]),seen=new Set<number>();
 for(let n=0;n<losses.length;n++){
  const loss=losses[n];if(!loss||typeof loss.source!=='string'||typeof loss.target!=='string')throw new Error('GRAPH_LOSS_ADDRESS');
  const i=graph.keys.indexOf(loss.source),j=graph.keys.indexOf(loss.target);
  if(i<0||j<0||graph.weights[i][j].numerator===0n)throw new Error('GRAPH_LOSS_NOT_POSITIVE');
  const address=i*32+j;if(seen.has(address))throw new Error('GRAPH_LOSS_DUPLICATE');seen.add(address);matrix[i][j]=Q.of(0n);
 }
 const result=normalizeGraphZeroState(graph.keys,matrix,scale);
 const edges=result.weights.reduce((n,row)=>n+row.filter(v=>v.numerator!==0n).length,0);
 if(result.keys.length>capacity.nodes||edges>capacity.edges)throw new Error('GRAPH_LOSS_INSUFFICIENT_PLAN');
 return Object.freeze({...result,usage:Object.freeze({nodes:result.keys.length,edges})});
}
