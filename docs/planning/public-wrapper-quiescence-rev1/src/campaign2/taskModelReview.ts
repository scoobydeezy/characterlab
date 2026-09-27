/** Task successor declaration proposal only. No model capability, run or handler. */
import allocation from '../../docs/formal/TASK_COMMITMENT_CORRECTION_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,list,set,map,text,unsigned as u,signed,rational,typedIdentifier,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {statePathPatternValue} from '../substrate/state';
import {recordRole} from './firstModelCandidate';
import {predictionModelReviewSource,PREDICTION_BUNDLE,PREDICTION_PROFILES} from './predictionModelReview';
import {taskRecord as r,taskNamed as named,taskAddedSchemas,decodeTask} from './taskCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel,type RecordValue} from './canonicalData';

export const TASK_VERSION='task-commitment/0.2-candidate';
export const TASK_KIND='task-content-kind/0.1-candidate';
export const TASK_DOMAIN='task-domain-validator/0.1-candidate';
export const TASK_MEASUREMENT='task-measurement-registration/0.1-candidate';
export const TASK_DEADLINE='task-deadline-registration/0.1-candidate';
export const TASK_TARGET='task-target-projection/0.1-candidate';
export const TASK_ROUTES='prospective-transition-routes/0.1-candidate';
export const TASK_TOPOLOGY='prospective-family-topology/0.1-candidate';
export const TASK_RULES='rules/campaign2-task-commitment/0.1-candidate';
export const TASK_REGISTRY='campaign2-task-commitment-registry/0.1-candidate';
export const TASK_NUMERIC='numeric/task-commitment-exact/0.1-candidate';
export const TASK_PROFILES=Object.freeze({orderedInput:PREDICTION_PROFILES.orderedInput,trace:'campaign2-task-commitment-trace-binding/0.1-candidate',persistence:'campaign2-task-commitment-persistence/0.1-candidate'});
export const TASK_BUNDLE=Object.freeze([...PREDICTION_BUNDLE,TASK_VERSION,TASK_KIND,TASK_DOMAIN,TASK_MEASUREMENT,TASK_DEADLINE,TASK_TARGET,TASK_ROUTES,TASK_TOPOLOGY,TASK_PROFILES.trace,TASK_PROFILES.persistence]);
export type TaskSpecimen='overlapping'|'coincident'|'recurrence';
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),ref=(n:number)=>r(254,[u(n),u(1)]);
const role=(n:number,validator?:string|null)=>named(263,{RequiredNamespace:u(n),...(validator?{DomainValidatorId:id(1021,validator)}:{})});
const replace=(value:RecordValue,field:number,next:CanonicalValue)=>record(value.schema,new Map([...value.fields].map(([i,v])=>[i,i===BigInt(field)?next:v]))) as RecordValue;
const pairs=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='map')invalidModel('task review requires map');return v.entries;};
const pattern=(root:number)=>statePathPatternValue({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
const entry=(stable:CanonicalValue,version:string,value:CanonicalValue,kind='registry/transition-registration')=>r(171,[stable,id(1023,kind),text(version),value]);
const find=(values:readonly CanonicalValue[],name:string)=>{const matches=values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(id(1027,name)));if(matches.length!==1)invalidModel('task review singleton '+name);return rec(matches[0],171n);};

export function taskModelReviewSource(specimen:TaskSpecimen='overlapping',available=true,permitted=true,formation=true,memoryRead=true,apply=true,predictionRead=true){
 if(!['overlapping','coincident','recurrence'].includes(specimen))invalidModel('unknown task specimen');
 const base=predictionModelReviewSource(available,permitted,formation,memoryRead,apply,predictionRead);
 const slots=items(decodeTask(base.registry),'list'),old=items(slots[0],'set'),priorContent=items(decodeTask(base.content),'set');
 if(priorContent.length!==1)invalidModel('task review requires one prior character');
 const holder=f(rec(priorContent[0],170n),1n),specIds=['definition/task-a','definition/task-b'].map(s=>id(1027,s));
 const windows=specimen==='recurrence'?[[4,6,1,4],[4,6,4,7]]:specimen==='coincident'?[[4,6,1,5],[5,7,1,5]]:[[4,6,1,5],[5,7,1,6]];
 const taskContent=specIds.map((spec,i)=>{const delegated=list([spec]);return r(170,[id(1038,i?'content/task-b':'content/task-a'),id(1004,'semantic-kind/task-commitment'),delegated,list([]),list([]),list([]),delegated,delegated,list([]),delegated,delegated,list([holder]),delegated,list([]),list([]),delegated]);});
 const specs=windows.map(([lo,hi,from,deadline],i)=>entry(specIds[i],TASK_VERSION,r(370,[holder,id(1027,'definition/measurement-prediction'),rational(lo,1),rational(hi,1),signed(from),signed(deadline)]),'registry/task-commitment-spec'));
 const roster=pattern(268),task=pattern(373),seam=id(1036,'seam/task-commitment'),subject=id(1028,'ResolvedCharacterSubject'),accessor=id(1028,'accessor/task-commitment-prior');
 const write=named(322,{VariantTag:u(2),MutationAuthority:id(1025,'authority/prospective-commitments'),WritableFamilies:set([id(1031,'prospective-commitments')])});
 const measurement=r(375,[seam,text(TASK_VERSION),r(274,[ref(342),named(275,{VariantTag:u(2),ProducingTransitionKind:id(1009,'MeasurementEpisodeEvidenceTransition')}),u(1)]),set([roster,task]),set([]),write,r(276,[id(1001,'event/task-measurement-settlement'),u(1),u(140),u(1),u(1)]),set([r(343,[list([u(2),u(2),u(2)]),roster,u(1),role(1002,'validator/character-qualification'),subject])]),set([r(374,[subject,set(specIds),task,accessor])])]);
 const deadline=r(376,[seam,text(TASK_VERSION),ref(371),id(1001,'event/task-deadline'),set([task]),set([]),write,task,accessor]);
 const admission=find(old,'definition/transition-admission'),ad=rec(f(admission,4n),279n),route=id(1026,'route/prospective-control');
 const updated=replace(replace(admission,3,text(TASK_ROUTES)),4,r(279,[set([...items(f(ad,1n),'set'),route]),map([...pairs(f(ad,2n)),...[id(1009,'TaskMeasurementSettlementTransition'),id(1009,'TaskDeadlineSettlementTransition')].map(t=>[t,route] as const)]),f(ad,3n)]));
 const topology=find(old,'definition/campaign2-state-families'),topo=replace(replace(topology,3,text(TASK_TOPOLOGY)),4,r(284,[map([...pairs(f(rec(f(topology,4n),284n),1n)),[id(1031,'prospective-commitments'),r(285,[route,named(286,{VariantTag:u(2),RootStateTypeId:u(373),LeafFields:map([[id(1032,'leaf/task-commitment'),u(1)]])})])]])]));
 const rows=[...specs,entry(id(1009,'TaskMeasurementSettlementTransition'),TASK_MEASUREMENT,measurement),entry(id(1009,'TaskDeadlineSettlementTransition'),TASK_DEADLINE,deadline),entry(id(1004,'semantic-kind/task-commitment'),TASK_KIND,r(329,[ref(170)]),'registry/semantic-kind'),entry(id(1021,'validator/task-qualification'),TASK_DOMAIN,r(330,[id(1004,'semantic-kind/task-commitment')]),'registry/domain-validator')];
 const descriptors=taskAddedSchemas().map(s=>r(172,[u(s.typeId),u(s.schemaVersion),text(s.name),list(s.fields.map(f=>r(173,[u(f.id),text(f.name),f.required])))]));
 const roles=allocation.roles.map(x=>recordRole(x.recordTypeId,x.fieldId,role(x.requiredNamespace,x.domainValidatorId)));
 const owner=r(154,[id(1025,'authority/prospective-commitments'),set([r(153,[task,r(152,[u(3),u(372)]),false])])]);
 return {...base,rulesVersion:TASK_RULES,registrySchemaVersion:TASK_REGISTRY,numericProfileVersion:TASK_NUMERIC,content:enc(set([...priorContent,...taskContent])),registry:enc(list([set([...old.filter(v=>v!==admission&&v!==topology),updated,topo,...rows,...descriptors]),slots[1],replace(rec(slots[2],155n),2,set([...items(f(rec(slots[2],155n),2n),'set'),owner])),slots[3],set([...items(slots[4],'set'),r(261,[task,r(260,[u(2),u(371)])])]),set([...items(slots[5],'set'),...roles])]))};
}
