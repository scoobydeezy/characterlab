import type {CanonicalValue} from '../substrate/canonicalEncoding';
import type {TimelineEvent} from './contracts';
import {dispositionCanonicalFactorSources} from './dispositionCanonicalFactorSources';
import {explainDispositionFactorSources,type DispositionLanguageAudience} from './dispositionExplanations';
/** Evaluation-time researcher report. Non-researcher requests do not inspect canonical payloads. */
export function explainDispositionCanonicalFactors(event:Pick<TimelineEvent,'id'|'instant'|'phase'|'stage'>,output:CanonicalValue,reads:CanonicalValue,seamVersion:string,audience:DispositionLanguageAudience){
 if(seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified disposition language seam');
 if(audience!=='researcher')return explainDispositionFactorSources(event,seamVersion,audience);
 return explainDispositionFactorSources(event,seamVersion,audience,dispositionCanonicalFactorSources(event,output,reads));
}
