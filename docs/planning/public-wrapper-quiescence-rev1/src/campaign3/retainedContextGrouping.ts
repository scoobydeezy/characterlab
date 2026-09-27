/** retained-context-grouping/0.1-candidate; authenticated recalled children remain upstream. */
import {copyPerceivedTrialContext,type PerceivedTrialContext} from './perceivedTrialContext';
import {canonicalEncode,bytesToHex} from '../substrate/canonicalEncoding';
import {perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
type Context=PerceivedTrialContext['context'];
const key=(c:Context)=>bytesToHex(canonicalEncode(perceptualEventReferentIdValue(c)));
/** No full SemanticExperience, source archive, state access or inferred stage is required. */
export function groupRetainedPositionTrial(observer:string,context:Context|null,input:readonly PerceivedTrialContext[]){
 if(typeof observer!=='string'||!observer)throw Error('TRIAL_OBSERVER');
 if(!Array.isArray(input)||input.length>16||Array.from({length:input.length},(_,i)=>Object.hasOwn(input,i)).some(v=>!v))throw Error('TRIAL_BOUND');
 const seen=new Set<bigint>(),rows=input.map(c=>{const r=copyPerceivedTrialContext(c);if(r.context.observerId!==observer)throw Error('TRIAL_OBSERVER');if(seen.has(r.experience))throw Error('TRIAL_DUPLICATE_EXPERIENCE');seen.add(r.experience);return r;});
 const unavailable=(reason:'MissingContext'|'IncompleteContext'|'AmbiguousRole')=>Object.freeze({kind:'Unavailable' as const,reason});
 if(context===null)return unavailable('MissingContext');
 if(context.observerId!==observer)throw Error('TRIAL_OBSERVER');const contextKey=key(context);
 const matching=rows.filter(r=>key(r.context)===contextKey),byRole=(role:string)=>matching.filter(r=>r.panel.sample.stage===role);
 const before=byRole('Before'),after=byRole('After'),motion=byRole('Motion').sort((a,b)=>a.panel.sample.at<b.panel.sample.at?-1:a.panel.sample.at>b.panel.sample.at?1:0);
 if(before.length>1||after.length>1||motion.length>2)return unavailable('AmbiguousRole');
 if(before.length!==1||after.length!==1||motion.length!==2)return unavailable('IncompleteContext');
 if(before[0].panel.sample.at>motion[0].panel.sample.at||motion[0].panel.sample.at>=motion[1].panel.sample.at||motion[1].panel.sample.at>=after[0].panel.sample.at)throw Error('TRIAL_ORDER');
 return Object.freeze({kind:'Grouped' as const,context:Object.freeze({...before[0].context}),beforeExperience:before[0].experience,startExperience:motion[0].experience,endExperience:motion[1].experience,afterExperience:after[0].experience});
}
