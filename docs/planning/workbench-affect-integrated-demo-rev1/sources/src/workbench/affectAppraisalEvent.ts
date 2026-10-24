import type {TimelineEvent} from './contracts';
/** Exact top-level output join. Nested copies in downstream records are not emitters. */
export function affectAppraisalEvent(events:readonly TimelineEvent[],provenance:string){
 const appraisal=JSON.parse(provenance);if(appraisal?.record!=='AffectAppraisal#754/1'||typeof appraisal['At [2]']!=='string')throw Error('Invalid appraisal event source');
 const matches:TimelineEvent[]=[];
 for(const event of events){if(event.stage!=='appraise'||event.phase!=='50'||event.instant!==appraisal['At [2]'])continue;
  const outputs=JSON.parse(event.output);if(!Array.isArray(outputs))throw Error('Invalid appraisal event outputs');
  for(const output of outputs)if(output?.record==='AffectAppraisal#754/1'&&JSON.stringify(output)===JSON.stringify(appraisal))matches.push(event);
 }
 if(matches.length!==1)throw Error(matches.length?'Ambiguous appraisal emitter':'Appraisal emitter is not present in this timeline');
 if(events.filter(e=>e.id===matches[0].id).length!==1)throw Error('Ambiguous event identity');
 return matches[0];
}
