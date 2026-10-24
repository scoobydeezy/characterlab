import {PROPOSITIONS} from '../campaign3/affectModel';
import {readable} from './canonical';
import {affectBeliefStateProjection} from './affectBeliefStateProjection';
import type {AffectSnapshot} from './affectSession';

type ObjectValue=Record<string,unknown>;
const object=(v:unknown):ObjectValue=>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid belief support record');return v as ObjectValue;};
function identity(v:unknown){const r=object(v);if(typeof r.namespace!=='string'||typeof r.identity!=='string')throw Error('Invalid belief support identity');return `${r.namespace}:${r.identity}`;}
const propositions=PROPOSITIONS.map(p=>identity(readable(p)));

/** Joins recorded support to admitted samples in the selected original history.
 * Does not inspect physical-frame input or add psychological causal claims. */
export function affectBeliefSupport(snapshot:AffectSnapshot,eventId:string|null){
 const state=affectBeliefStateProjection(snapshot),revision=state.history.find(r=>r.eventId===eventId);
 if(!revision)throw Error('Unknown belief support revision');
 const end=eventId===null?-1:snapshot.timeline.findIndex(e=>e.id===eventId);
 if(eventId!==null&&end<0)throw Error('Missing belief support mutation');
 const history=snapshot.timeline.slice(0,end+1);
 const applications=history.flatMap(event=>{
  if(event.stage!=='apply')return[];const outputs:unknown=JSON.parse(event.output);if(!Array.isArray(outputs))throw Error('Invalid apply output');
  return outputs.filter(v=>object(v).record==='BeliefApplication#742/1').map(value=>({event,value:object(value)}));
 });
 const observations=history.flatMap(event=>{
  if(event.stage!=='observe')return[];const outputs:unknown=JSON.parse(event.output);if(!Array.isArray(outputs))throw Error('Invalid observation output');
  return outputs.filter(v=>object(v).record==='AffectSafeObservation#750/1').map(value=>({event,value:object(value)}));
 });
 const rows=revision.vector.map((component,index)=>({name:component.name,path:component.path,exact:component.exact,
  support:(component.estimate?.support??[]).map((support:unknown)=>{
   const id=identity(support);
   const matches=applications.filter(({value})=>{const evidence=object(value['Evidence [2]']),sample=object(evidence['Sample [2]']);return value['Applied [5]']===true&&identity(sample['SampleId [1]'])===id&&identity(sample['Proposition [3]'])===propositions[index];});
   const sources=matches.map(({event,value})=>{
    const evidence=object(value['Evidence [2]']),sample=object(evidence['Sample [2]']);
    if(evidence.record!=='BeliefLearningEvidence#741/1'||sample.record!=='BeliefSafeSample#737/1')throw Error('Unknown belief support schema');
    const posterior=object(value['Posterior [4]']);if(!Array.isArray(posterior['Support [3]'])||!posterior['Support [3]'].some(s=>identity(s)===id))throw Error('Applied sample absent from posterior support');
    const candidates=observations.filter(o=>identity(o.value['Observation [1]'])===id&&o.value['At [2]']===sample['At [4]']&&history.indexOf(o.event)<history.indexOf(event));
    const admitted=candidates.map(o=>{
     for(const [a,b] of [['Opportunity [5]','Opportunity [6]'],['MonitoringComplete [6]','MonitoringComplete [7]'],['ReportedOutcome [7]','ReportedOutcome [8]']])if(sample[a]!==o.value[b])throw Error('Belief sample differs from admitted observation');
     return{eventId:o.event.id,at:o.event.instant,observation:o.value};
    });
    return{eventId:event.id,at:event.instant,application:value,sample,observations:admitted,observationStatus:admitted.length===1?'unique recorded observation':admitted.length===0?'unavailable in selected history':'multiple recorded matches'};
   });
   return{id,support,sources,status:sources.length===1?'unique recorded application':sources.length===0?'unavailable in selected history':'multiple recorded matches'};
  })}));
 return{version:'affect-belief-support/0.1',identity:{runHash:snapshot.runHash,saveHash:snapshot.saveHash},eventId,at:revision.at,rows,
  scope:'Recorded support identities joined to applied learning samples for the same registered proposition, then to earlier emitted admitted observations with matching report, opportunity and monitoring fields. Missing or multiple matches remain explicit. Initial-state support has no inferred source. Links are recorded provenance, not complete experience ancestry, causal necessity, physical truth or player disclosure.'};
}
