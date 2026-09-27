/** Observer-only source projection/grouping for affect-public/0.1-candidate. */
import {unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {createTrialPanelSource,observeTrialPanel,type TrialPanelStage} from './trialPanelSource';
import {createTrialPanelPerception,consumeTrialPanel} from './trialPanelPerception';
import {perceptualEventReferentIdValue,restorePerceptualEventReferentId} from '../semanticBinding/semanticCodecs';
import {groupPerceivedTrial} from './perceivedTrialGrouping';
import {type PreRecognitionSemanticExperience} from '../semanticBinding/perceptualEventFiles';
import {affectRecord as r} from './affectCodecs';
import {beliefRecord} from './beliefCodecs';
import {OBSERVER_NAME,OBSERVER,PROPOSITIONS} from './affectModel';
const stageNames=['Before','Motion','After'] as const;
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('AFFECT_TIME');return v.value;};
export function observeAffectFrame(frame:CanonicalValue,at:bigint,observation:CanonicalValue){
 const v=rec(frame,748n),source=createTrialPanelSource([{at,glyph:Number(uint(f(v,1n))),stage:stageNames[Number(uint(f(v,2n)))-1],visible:f(v,3n)===true,permitted:f(v,4n)===true}]),panel=observeTrialPanel(source,at),permitted=f(v,4n)===true;
 const action=permitted&&f(v,5n)===true?f(v,6n):u(0),outcome=permitted&&f(v,7n)===true;
 const fields=new Map<bigint,CanonicalValue>([[1n,observation],[2n,signed(at)],[3n,u(panel.kind==='Present'?stageNames.indexOf(panel.stage)+1:0)],[4n,u(panel.kind==='Present'?panel.glyph:0)],[5n,action],[6n,outcome&&f(v,8n)===true],[7n,outcome&&f(v,9n)===true],[8n,outcome&&f(v,10n)===true],[9n,permitted?f(v,16n):u(0)]]);
 if(permitted&&f(v,13n)===true)fields.set(10n,f(v,14n));
 // Physical fields11/12/15 never enter the projection.
 return r(750,fields);
}
export function trackAffectObservation(previous:readonly CanonicalValue[],sample:CanonicalValue){
 const token=createTrialPanelPerception(OBSERVER_NAME);let context;
 for(const value of [...previous.map(v=>f(rec(v,751n),2n)),sample]){
  const s=rec(value,750n),at=time(f(s,2n)),stage=Number(uint(f(s,3n))),observation=uint(id(f(s,1n)).payload);
  const result=consumeTrialPanel(token,{observer:OBSERVER_NAME,observation,...(stage?{detection:observation}:{}),sample:stage?{kind:'Present',at,glyph:Number(uint(f(s,4n))),stage:stageNames[stage-1]}:{kind:'Unavailable',at}});
  context=result.context;
  if(value!==sample&&key(s.fields.get(11n)??false)!==key(context?perceptualEventReferentIdValue(context):false))throw Error('AFFECT_PANEL_REPLAY');
 }
 const fields=new Map(rec(sample,750n).fields);if(context)fields.set(11n,perceptualEventReferentIdValue(context));return r(750,fields);
}
export function affectExperienceInput(sample:CanonicalValue,experienceId:bigint):PreRecognitionSemanticExperience{
 const s=rec(sample,750n),context=s.fields.get(11n);
 return {experienceId,observerId:OBSERVER_NAME,occurredAt:time(f(s,2n)),perceptualEventReferentIds:context?[restorePerceptualEventReferentId(context)]:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:OBSERVER_NAME,observationId:uint(id(f(s,1n)).payload)}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'};
}
export function deriveAffectEvidence(previous:readonly CanonicalValue[],current:CanonicalValue,occurrence:CanonicalValue){
 const frozen=rec(current,751n),sample=rec(f(frozen,2n),750n),context=sample.fields.get(11n),fields=new Map<bigint,CanonicalValue>([[1n,occurrence],[2n,current],[3n,{kind:'list',items:[]}]]);
 if(uint(f(sample,3n))!==3n||!context)return r(752,fields);
 const matching=[...previous,current].filter(v=>key(rec(f(rec(v,751n),2n),750n).fields.get(11n)??false)===key(context));
 const rows=matching.map(v=>{const s=rec(f(rec(v,751n),2n),750n),e=rec(f(rec(v,751n),3n),227n);return {role:stageNames[Number(uint(f(s,3n)))-1] as TrialPanelStage,experience:affectExperienceInput(s,uint(id(f(e,1n)).payload))};});
 const grouped=groupPerceivedTrial(OBSERVER_NAME,restorePerceptualEventReferentId(context),rows);
 if(grouped.kind!=='Grouped')return r(752,fields);
 const motion=rec(f(rec(matching.find(v=>uint(f(rec(f(rec(v,751n),2n),750n),3n))===2n)!,751n),2n),750n),glyph=uint(f(sample,4n)),action=uint(f(motion,5n));
 fields.set(3n,{kind:'list',items:matching});
 if(glyph===1n&&action===0n)return r(752,fields);
 const p=PROPOSITIONS[glyph===0n?0:action===1n?1:2];
 fields.set(4n,beliefRecord(737,[f(sample,1n),OBSERVER,p,f(sample,2n),f(sample,6n),f(sample,7n),f(sample,8n)]));
 return r(752,fields);
}
