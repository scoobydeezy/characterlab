/** perceived-trial-grouping-component/0.1-candidate; trusted admitted role projections. */
import {assemblePreRecognitionExperience,type PreRecognitionSemanticExperience,type PerceptualEventReferentId} from '../semanticBinding/perceptualEventFiles';
type Role='Before'|'Motion'|'After';
/** Two separately observed positions; retained-position-trial-grouping/0.1-candidate. */
export function groupPerceivedPositionTrial(observer:string,context:PerceptualEventReferentId|null,input:readonly {readonly role:Role;readonly experience:PreRecognitionSemanticExperience}[]){
 if(typeof observer!=='string'||!observer)throw Error('TRIAL_OBSERVER');
 if(!Array.isArray(input)||input.length>16||Array.from({length:input.length},(_,i)=>Object.hasOwn(input,i)).some(v=>!v))throw Error('TRIAL_BOUND');
 const seen=new Set<bigint>();
 const rows=input.map(x=>{if(!['Before','Motion','After'].includes(x.role))throw Error('TRIAL_ROLE');const e=assemblePreRecognitionExperience(x.experience);if(e.observerId!==observer)throw Error('TRIAL_OBSERVER');if(seen.has(e.experienceId))throw Error('TRIAL_DUPLICATE_EXPERIENCE');seen.add(e.experienceId);return {role:x.role,experience:e};});
 const unavailable=(reason:'MissingContext'|'IncompleteContext'|'AmbiguousRole')=>Object.freeze({kind:'Unavailable' as const,reason});
 if(context===null)return unavailable('MissingContext');
 if(context.observerId!==observer||typeof context.observerEventSequence!=='bigint'||context.observerEventSequence<0n)throw Error('TRIAL_CONTEXT');
 const matching=rows.filter(r=>r.experience.perceptualEventReferentIds.some(id=>id.observerId===observer&&id.observerEventSequence===context.observerEventSequence));
 const before=matching.filter(r=>r.role==='Before'),after=matching.filter(r=>r.role==='After'),motion=matching.filter(r=>r.role==='Motion').sort((a,b)=>a.experience.occurredAt<b.experience.occurredAt?-1:a.experience.occurredAt>b.experience.occurredAt?1:0);
 if(before.length>1||after.length>1||motion.length>2)return unavailable('AmbiguousRole');
 if(before.length!==1||after.length!==1||motion.length!==2)return unavailable('IncompleteContext');
 // Reuse the accepted one-motion ordering and context checks for each endpoint.
 const start=groupPerceivedTrial(observer,context,[...before,motion[0],...after]),end=groupPerceivedTrial(observer,context,[...before,motion[1],...after]);
 if(start.kind!=='Grouped'||end.kind!=='Grouped')throw Error('TRIAL_POSITION_GROUPING');
 if(motion[0].experience.occurredAt>=motion[1].experience.occurredAt)throw Error('TRIAL_ORDER');
 return Object.freeze({kind:'Grouped' as const,context:start.context,beforeExperience:start.beforeExperience,startExperience:start.motionExperience,endExperience:end.motionExperience,afterExperience:start.afterExperience});
}
export function groupPerceivedTrial(observer:string,context:PerceptualEventReferentId|null,input:readonly {readonly role:Role;readonly experience:PreRecognitionSemanticExperience}[]){
 if(typeof observer!=='string'||!observer)throw Error('TRIAL_OBSERVER');
 if(!Array.isArray(input)||input.length>12||Array.from({length:input.length},(_,i)=>Object.hasOwn(input,i)).some(v=>!v))throw Error('TRIAL_BOUND');
 const seen=new Set<bigint>();
 const rows=input.map(x=>{if(!['Before','Motion','After'].includes(x.role))throw Error('TRIAL_ROLE');const e=assemblePreRecognitionExperience(x.experience);if(e.observerId!==observer)throw Error('TRIAL_OBSERVER');if(seen.has(e.experienceId))throw Error('TRIAL_DUPLICATE_EXPERIENCE');seen.add(e.experienceId);return {role:x.role,experience:e};});
 const unavailable=(reason:'MissingContext'|'IncompleteContext'|'AmbiguousRole')=>Object.freeze({kind:'Unavailable' as const,reason});
 if(context===null)return unavailable('MissingContext');
 if(context.observerId!==observer||typeof context.observerEventSequence!=='bigint'||context.observerEventSequence<0n)throw Error('TRIAL_CONTEXT');
 const matches=rows.filter(r=>r.experience.perceptualEventReferentIds.some(id=>id.observerId===observer&&id.observerEventSequence===context.observerEventSequence));
 const select=(role:Role)=>matches.filter(r=>r.role===role);
 const before=select('Before'),motion=select('Motion'),after=select('After');
 if([before,motion,after].some(xs=>xs.length>1))return unavailable('AmbiguousRole');
 if([before,motion,after].some(xs=>xs.length===0))return unavailable('IncompleteContext');
 if(before[0].experience.occurredAt>motion[0].experience.occurredAt||motion[0].experience.occurredAt>=after[0].experience.occurredAt)throw Error('TRIAL_ORDER');
 return Object.freeze({kind:'Grouped' as const,context:Object.freeze({...context}),beforeExperience:before[0].experience.experienceId,motionExperience:motion[0].experience.experienceId,afterExperience:after[0].experience.experienceId});
}
