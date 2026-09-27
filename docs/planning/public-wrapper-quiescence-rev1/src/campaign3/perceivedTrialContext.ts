/** perceived-trial-context-carriage/0.1-candidate. Source authenticity remains upstream. */
import {canonicalEncode,bytesToHex} from '../substrate/canonicalEncoding';
import {perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {assemblePreRecognitionExperience,type PreRecognitionSemanticExperience} from '../semanticBinding/perceptualEventFiles';
import type {observeGeneralSourceOpportunity} from './generalSourceOpportunity';
export type PerceivedTrialContext=NonNullable<ReturnType<typeof observeGeneralSourceOpportunity>['context']>;
type PresentContext=PerceivedTrialContext&{panel:PerceivedTrialContext['panel']&{sample:Extract<PerceivedTrialContext['panel']['sample'],{kind:'Present'}>}};
const eventKey=(v:Parameters<typeof perceptualEventReferentIdValue>[0])=>bytesToHex(canonicalEncode(perceptualEventReferentIdValue(v)));
function exact(value:unknown,names:readonly string[]){if(!value||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype)throw Error('TRIAL_CONTEXT_SHAPE');const d=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!d[k]||!('value'in d[k])))throw Error('TRIAL_CONTEXT_SHAPE');}
/** Structural retained-value copy; only bindPerceivedTrialContext checks a live experience join. */
export function copyPerceivedTrialContext(c:PerceivedTrialContext):PresentContext{
 exact(c,['experience','context','panel']);exact(c.context,['observerId','observerEventSequence']);exact(c.panel,['observation','sample']);exact(c.panel.sample,['kind','at','glyph','stage']);
 for(const v of [c.experience,c.panel.observation,c.panel.sample.at])if(typeof v!=='bigint'||v<0n)throw Error('TRIAL_CONTEXT_DOMAIN');
 eventKey(c.context);
 if(c.panel.sample.kind!=='Present'||!Number.isInteger(c.panel.sample.glyph)||c.panel.sample.glyph<0||c.panel.sample.glyph>7||!['Before','Motion','After'].includes(c.panel.sample.stage))throw Error('TRIAL_CONTEXT_DOMAIN');
 return structuredClone(c) as PresentContext;
}
export function bindPerceivedTrialContext(c:PerceivedTrialContext,input:PreRecognitionSemanticExperience):PerceivedTrialContext{
 const retained=copyPerceivedTrialContext(c);
 const e=assemblePreRecognitionExperience(input);
 if(e.transformationVersion!=='semantic-binding/0.1-candidate#SEM-001H'||c.experience!==e.experienceId||c.panel.sample.kind!=='Present'||c.panel.sample.at!==e.occurredAt||c.context.observerId!==e.observerId||!e.perceptualEventReferentIds.some(id=>eventKey(id)===eventKey(c.context))||!e.supportingObservationIds.some(id=>id.observerId===e.observerId&&id.observationId===c.panel.observation))throw Error('TRIAL_CONTEXT_BINDING');
 return retained;
}
