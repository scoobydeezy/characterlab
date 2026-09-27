/** Compiler-owned conservative bounds over the admitted finite topology.
 * Generalized simultaneous roots overcount these exact source calendars on
 * purpose. Output declarations count records, not merely distinct schemas. */
import topology from '../../docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json';
import {PROBE_EVENT_NAMES} from '../campaign2/probeExecution';
import {generalRegistrationTemplates} from './generalRegistration';
import {invalidModel as fail} from '../campaign2/canonicalData';

export function deriveGeneralWorkBudget(){
 const templates=generalRegistrationTemplates(),names=new Set(templates.map(t=>t.name));
 const edges=new Map<string,Set<string>>();
 const edge=(from:string,to:string)=>{if(!names.has(from)||!names.has(to))fail('GA work unknown stage');const parents=edges.get(to)??new Set<string>();if(parents.has(from))fail('GA work duplicate edge');parents.add(from);edges.set(to,parents);};
 for(const stage of topology.stages)for(const child of stage.next??[])edge(stage.name,child);
 for(const child of topology.conditionalEdges)edge(child.from,child.to);
 const joins=new Set(['retained-attribution','significance-join']);
 const replacement=new Map([['prior-concern-visual-encoding','current-visual-encoding'],['prior-concern-event-rank','current-event-rank']]);
 function lane(feedback:boolean){
  const counts=new Map<string,number>(),visiting=new Set<string>();
  function count(name:string):number{
   const prior=counts.get(name);if(prior!==undefined)return prior;
   if(visiting.has(name))return fail('GA work graph cycle');visiting.add(name);
   const inactive=feedback?[...replacement.values()].includes(name):replacement.has(name),parents=edges.get(name);
   const value=inactive?0:!parents?.size?1:joins.has(name)?Number([...parents].some(p=>count(p)>0)):[...parents].reduce((sum,p)=>sum+count(p),0);
   visiting.delete(name);counts.set(name,value);return value;
  }
  let work=0,outputs=0,slots=0;
  const stages=templates.map(t=>{const invocations=count(t.name),outputMaximum=t.outputs.reduce((sum,o)=>sum+o.maximum,0);
   // Fresh top-level records; nested world bindings and sampling reservations
   // are additional slots. ReservedOwned consumes the earlier reservation.
   const slotMaximum=t.outputs.filter(o=>o.identityMode===1).reduce((sum,o)=>sum+o.maximum,0)+(t.name==='world'?3:0)+(t.name.endsWith('-sample')?16:0);
   work+=invocations;outputs+=invocations*outputMaximum;slots+=invocations*slotMaximum;
   return {stage:t.name,invocations,outputMaximum,slotMaximum};
  });return {work,outputs,slots,stages};
 }
 const baseline=lane(false),feedback=lane(true);
 if(baseline.work!==80||feedback.work!==80)fail('GA reviewed logical work drift');
 // Eight original probe stages include both padding stages. The successful
 // branch additionally admits intake, M1 and prediction. Task deadline is a
 // separate original. Summing mutually exclusive probe branches is conservative.
 // At most one output per probe stage plus intake/M1 (ten). Ordinal caps:
 // source1 + observation2 (including reservation) + padding1+1 + intake1 + M1 1.
 const inherited={work:PROBE_EVENT_NAMES.length+3+1,outputs:10,slots:7};
 return Object.freeze({baseline,feedback,inherited,
  work:BigInt(Math.max(baseline.work,feedback.work)+inherited.work),
  outputs:BigInt(Math.max(baseline.outputs,feedback.outputs)+inherited.outputs),
  slots:BigInt(Math.max(baseline.slots,feedback.slots)+inherited.slots)});
}
