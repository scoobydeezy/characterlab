/** Data-only materialization proposal. No prepared model, evaluator, run or scheduler. */
import allocation from '../../docs/formal/MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,list,set,map,text,unsigned as u,signed,typedIdentifier,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {statePathPatternValue} from '../substrate/state';
import {memoryModelSource,memoryWrapperDeclarations,MEMORY_BUNDLE} from './memoryModelSource';
import {recordRole} from './firstModelCandidate';
import {predictionRecord as r,predictionNamed as named,predictionAddedSchemas,decodePrediction} from './predictionCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel,type RecordValue} from './canonicalData';
export const PREDICTION_VERSION='measurement-prediction/0.2-candidate';
export const PREDICTION_APPLICATION='measurement-prediction-application-registration/0.1-candidate';
export const PREDICTION_READ='measurement-prediction-read-registration/0.2-candidate';
export const PREDICTION_TARGET='measurement-prediction-target-projection/0.1-candidate';
export const PREDICTION_OPPORTUNITY='measurement-prediction-opportunity/0.1-candidate';
export const PREDICTION_APPLICATION_ABLATION='measurement-prediction-application-ablation/0.1-candidate';
export const PREDICTION_READ_ABLATION='measurement-prediction-read-ablation/0.1-candidate';
export const PREDICTION_RULES='rules/campaign2-measurement-prediction/0.1-candidate';
export const PREDICTION_REGISTRY='campaign2-measurement-prediction-registry/0.1-candidate';
export const PREDICTION_NUMERIC='numeric/measurement-prediction-exact/0.1-candidate';
export const PREDICTION_PROFILES=Object.freeze({orderedInput:'campaign2-probe-ordered-input/0.1-candidate',trace:'campaign2-measurement-prediction-trace-binding/0.1-candidate',persistence:'campaign2-measurement-prediction-persistence/0.1-candidate'});
export const PREDICTION_BUNDLE=Object.freeze([...MEMORY_BUNDLE,PREDICTION_VERSION,PREDICTION_APPLICATION,PREDICTION_READ,PREDICTION_TARGET,PREDICTION_OPPORTUNITY,PREDICTION_APPLICATION_ABLATION,PREDICTION_READ_ABLATION,PREDICTION_PROFILES.trace,PREDICTION_PROFILES.persistence]);
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),empty=()=>set([]),ref=(n:number)=>r(254,[u(n),u(1)]);
const role=(n:number,validator?:string|null)=>named(263,{RequiredNamespace:u(n),...(validator?{DomainValidatorId:id(1021,validator)}:{})});
const replace=(v:RecordValue,n:number,x:CanonicalValue)=>record(v.schema,new Map([...v.fields].map(([i,a])=>[i,i===BigInt(n)?x:a])));
const pairs=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='map')invalidModel('review requires map');return v.entries;};
const pattern=(root:number)=>statePathPatternValue({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
const roster=pattern(268),prediction=pattern(362),subject=id(1028,'ResolvedCharacterSubject'),seam=id(1036,'seam/measurement-prediction');
const definition=id(1027,'definition/measurement-prediction'),opportunity=id(1027,'definition/measurement-prediction-opportunity');
const application='MeasurementPredictionApplicationTransition',read='MeasurementPredictionReadTransition';
const entry=(stable:CanonicalValue,version:string,value:CanonicalValue,kind='registry/transition-registration')=>r(171,[stable,id(1023,kind),text(version),value]);
const find=(xs:readonly CanonicalValue[],name:string)=>{const values=xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(id(1027,name)));if(values.length!==1)invalidModel('review requires singleton '+name);return rec(values[0],171n);};
const m2=r(343,[list([u(2),u(2),u(2)]),roster,u(1),role(1002,'validator/character-qualification'),subject]);
const idn=r(266,[u(1),roster,u(1),role(1002,'validator/character-qualification'),subject]);
const target=(accessor:string)=>r(363,[subject,definition,prediction,id(1028,accessor)]);
const input=r(274,[ref(342),named(275,{VariantTag:u(2),ProducingTransitionKind:id(1009,'MeasurementEpisodeEvidenceTransition')}),u(1)]);
const ingress=r(276,[id(1001,'event/measurement-prediction-application'),u(1),u(140),u(1),u(1)]);
function applicationRegistration(enabled:boolean){return r(364,[seam,text(enabled?PREDICTION_VERSION:PREDICTION_APPLICATION_ABLATION),definition,input,set(enabled?[roster,prediction]:[roster]),empty(),enabled?named(322,{VariantTag:u(2),MutationAuthority:id(1025,'authority/belief-expectation'),WritableFamilies:set([id(1031,'belief-expectation')])}):named(322,{VariantTag:u(1)}),ingress,set([m2]),enabled?set([target('accessor/measurement-prediction-prior')]):empty()]);}
function readRegistration(enabled:boolean){return r(368,[seam,text(enabled?PREDICTION_VERSION:PREDICTION_READ_ABLATION),definition,ref(365),opportunity,set(enabled?[roster,prediction]:[roster]),enabled?set([r(367,[ref(366)])]):empty(),r(273,[u(1)]),set([idn]),enabled?set([target('accessor/measurement-prediction-read')]):empty()]);}
export function predictionModelReviewSource(available=true,permitted=true,formation=true,memoryRead=true,apply=true,predictionRead=true){
 if([available,permitted,formation,memoryRead,apply,predictionRead].some(x=>typeof x!=='boolean'))invalidModel('review controls must be exact booleans');
 const wrappers=memoryWrapperDeclarations(),base=memoryModelSource(available,permitted,formation?wrappers.formation:wrappers.formationAblated,memoryRead?wrappers.recall:wrappers.recallAblated);
 const slots=items(decodePrediction(base.registry),'list'),old=items(slots[0],'set');
 const singleton=find(old,'definition/transition-admission'),ad=rec(f(singleton,4n),279n);
 const updated=replace(singleton,4,r(279,[f(ad,1n),map([...pairs(f(ad,2n)),[id(1009,application),id(1026,'route/character-learning')]]),map([...pairs(f(ad,3n)),[ref(366),r(278,[u(1),role(1127)])]])]));
 const topology=find(old,'definition/campaign2-state-families');
 const families=pairs(f(rec(f(topology,4n),284n),1n)).map(([k,v])=>[k,key(k)===key(id(1031,'belief-expectation'))?replace(rec(v,285n),2,named(286,{VariantTag:u(2),RootStateTypeId:u(362),LeafFields:map([[id(1032,'leaf/measurement-prediction'),u(1)]])})):v] as const);
 const topo=replace(topology,4,r(284,[map(families)]));
 const channel=rec(f(rec(f(find(old,'definition/regulatory-diagnostic-probe'),4n),331n),3n),332n);
 const rows=[entry(definition,PREDICTION_VERSION,r(359,[f(channel,1n),f(channel,3n),f(channel,5n),u(64)]),'registry/measurement-prediction'),entry(id(1009,application),PREDICTION_APPLICATION,applicationRegistration(apply)),entry(id(1009,read),PREDICTION_READ,readRegistration(predictionRead)),entry(opportunity,PREDICTION_OPPORTUNITY,r(369,[id(1009,'MeasurementEpisodeEvidenceTransition'),id(1001,'event/measurement-prediction-application'),id(1001,'event/measurement-prediction-read'),definition,signed(1)]),'registry/measurement-prediction-opportunity')];
 const descriptors=predictionAddedSchemas().map(s=>r(172,[u(s.typeId),u(s.schemaVersion),text(s.name),list(s.fields.map(x=>r(173,[u(x.id),text(x.name),x.required])))]));
 const roles=allocation.roles.map(x=>recordRole(x.recordTypeId,x.fieldId,role(x.requiredNamespace,x.domainValidatorId)));
 const owner=r(154,[id(1025,'authority/belief-expectation'),set([r(153,[prediction,r(152,[u(3),u(361)]),false])])]);
 return {...base,rulesVersion:PREDICTION_RULES,registrySchemaVersion:PREDICTION_REGISTRY,numericProfileVersion:PREDICTION_NUMERIC,registry:enc(list([set([...old.filter(v=>v!==singleton&&v!==topology),updated,topo,...descriptors,...rows]),slots[1],replace(rec(slots[2],155n),2,set([...items(f(rec(slots[2],155n),2n),'set'),owner])),slots[3],set([...items(slots[4],'set'),r(261,[prediction,r(260,[u(2),u(360)])])]),set([...items(slots[5],'set'),...roles])]))};
}
