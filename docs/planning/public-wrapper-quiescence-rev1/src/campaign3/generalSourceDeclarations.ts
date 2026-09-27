/** Concrete source declarations under general-attention-carrier/0.1-candidate
 * and general-source-schedule-component/0.1-candidate. No runtime admission. */
import {canonicalEncode as enc,list,set,text,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent as referent} from '../substrate/referentOrigin';
import {EventRoleId,EVENT_BINDING_CONTRACT_VERSION} from '../semanticBinding/eventBindings';
import {generalRecord as r,generalId as id,generalDefinitionId as d,generalContentId as c,generalSubject} from './generalBindingProfile';
import {dataRecord as rec,dataField as f,dataIdentity as identity,dataItems as items,dataKey as key,dataUnsigned as uint,dataText as txt,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {createPositionSceneSource,type PositionSceneFrame} from './positionSceneSource';
import {createTrialPanelSource,type TrialPanelFrame} from './trialPanelSource';
import {validateGeneralSourceSchedule,type PlannedObservation} from './generalSourceSchedule';
import {bindObservationExecutionPolicy,type ObservationExecutionPolicy} from './observationExecutionPolicy';

interface Recipe {
 readonly source:{readonly ports:readonly {readonly detected:boolean;readonly role:string;readonly glyph:boolean;readonly position:boolean}[]};
 readonly schedule:{readonly receivers:readonly number[];readonly formations:number;readonly cues:number;readonly initialClock:number};
}
export function buildGeneralSourceEntries(p:Recipe):CanonicalValue[]{
 if(p.schedule.initialClock!==0||p.schedule.receivers.length!==p.schedule.formations+p.schedule.cues)fail('GA source recipe calendar');
 const entries:CanonicalValue[]=[],who=generalSubject();
 const add=(name:string,value:CanonicalValue)=>entries.push(r(171,[d(name),id(1023,'registry/general-attention-definition'),text('general-attention-carrier/0.1-candidate'),value]));
 const roles=[EventRoleId.Actor,EventRoleId.Target,EventRoleId.Participant];
 add('event-schema',r(248,[id(1001,'event/attention-participation-scene'),list([...roles,EventRoleId.Instrument,EventRoleId.Beneficiary].sort().map(role=>r(246,[id(1003,role),u(0),r(245,[u(1),u(3)])]))),text(EVENT_BINDING_CONTRACT_VERSION)]));
 // The source authors one physical marker on cue sweeps. Consumers must still
 // obtain its observer-relative file from actual sensing/tracking, never an index.
 add('scene',r(660,[d('event-schema'),list(p.schedule.receivers.map((at,index)=>r(659,[signed(at),list(['a','b','c'].flatMap((name,i)=>{
  const port=p.source.ports[i];if(!port.glyph||!port.position)fail('GA missing-facet profile excluded');
  if(index>=p.schedule.formations&&name!=='a')return [];
  return [r(658,[referent(c('scene-'+name)),id(1003,roles[i]),r(608,[u([1,5,7][i]),u(index%2)]),u(i),true,port.detected,u(port.role==='Exact'?1:2)])];
 }))])))]));
 add('panel',r(662,[list(p.schedule.receivers.map((at,i)=>r(661,[signed(at),u(Math.floor(i/4)),u([1,2,2,3][i%4]),true,true])))]));
 add('source-profile',r(663,[who.observer,d('body'),d('channels'),d('panel'),d('scene')]));
 add('formation-policy',r(698,new Map([[1n,d('body-selection')],[2n,d('visual-selection')],[3n,d('spatial')],[4n,d('encoding')]])));
 add('cue-policy',r(698,new Map([[5n,d('body-recall')],[7n,d('event-recall')]])));
 add('observation-originals',list(p.schedule.receivers.map((at,i)=>{
  const formation=i<p.schedule.formations;
  const request=r(655,[who.observer,r(650,[who.observer,set(['A','B','C'].map(n=>id(1005,'channel/'+n)))]),true,true]);
  const use=r(664,new Map<bigint,CanonicalValue>([[1n,formation],[2n,formation],[3n,!formation],[4n,!formation],[6n,d(formation?'formation-policy':'cue-policy')]]));
  return r(665,[signed(at),d('source-profile'),request,use,u(1)]);
 })));
 return entries;
}

const equal=(a:CanonicalValue,b:CanonicalValue,message:string)=>{if(key(a)!==key(b))fail('GA source '+message);};
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n)return fail('GA source instant');return v.value;};
const bool=(v:CanonicalValue)=>{if(typeof v!=='boolean')return fail('GA source boolean');return v;};
const symbol=(v:CanonicalValue)=>txt(identity(v).payload);
/** Called after canonical decoding and before exact candidate comparison. Actual
 * component constructors validate physical data; no sensing/allocation occurs. */
export function compileGeneralSourceDeclarations(definitions:ReadonlyMap<string,RecordValue>,qualifyScene:(v:CanonicalValue)=>void){
 const value=(ref:CanonicalValue)=>{const row=definitions.get(key(ref));if(!row)fail('GA source dangling definition');return f(row,4n);};
 const get=(name:string,type:bigint)=>rec(value(d(name)),type),who=generalSubject();
 const profile=get('source-profile',663n);equal(f(profile,1n),who.observer,'observer');
 for(const [field,name,type] of [[2n,'body',646n],[3n,'channels',648n],[4n,'panel',662n],[5n,'scene',660n]] as const){equal(f(profile,field),d(name),'profile reference');rec(value(f(profile,field)),type);}
 const scene=get('scene',660n);equal(f(scene,1n),d('event-schema'),'binding schema reference');rec(value(f(scene,1n)),248n);
 const sceneFrames:PositionSceneFrame[]=items(f(scene,2n),'list').map(v=>{const frame=rec(v,659n);return {at:at(f(frame,1n)),items:items(f(frame,2n),'list').map(v=>{
  const item=rec(v,658n),position=rec(f(item,3n),608n);qualifyScene(f(item,1n));
  return {marker:f(item,1n),role:symbol(f(item,2n)) as EventRoleId,x:uint(f(position,1n)),y:uint(f(position,2n)),glyph:uint(f(item,4n)),visible:bool(f(item,5n)),permitted:bool(f(item,6n)),roleMode:uint(f(item,7n))===1n?'Preserve':'Unresolved'};
 })};});
 const panelFrames:TrialPanelFrame[]=items(f(get('panel',662n),1n),'list').map(v=>{const frame=rec(v,661n);return {at:at(f(frame,1n)),glyph:Number(uint(f(frame,2n))),stage:(['Before','Motion','After'] as const)[Number(uint(f(frame,3n)))-1],visible:bool(f(frame,4n)),permitted:bool(f(frame,5n))};});
 createPositionSceneSource(sceneFrames);createTrialPanelSource(panelFrames);
 const channelNames=items(f(get('channels',648n),1n),'set').map(v=>symbol(f(rec(v,647n),1n)));
 const slots=['bodySelection','visualSelection','spatial','encoding','bodyRecall','goalBaselineRecall','eventRecall','goalQualification'] as const;
 const kinds:Readonly<Record<string,string>>={'696':'GeneralBodySelectionCalibration','519':'AttentionSelectionPolicy/519','687':'GeneralSpatialCalibration','688':'GeneralEncodingCalibration','691':'GeneralBodyRecallCalibration','690':'GeneralEventAccessCalibration','697':'GeneralGoalQualificationCalibration'};
 const originals=items(value(d('observation-originals')),'list');
 const plans:PlannedObservation[]=originals.map(v=>{
  const original=rec(v,665n);equal(f(original,2n),d('source-profile'),'original profile');
  const request=rec(f(original,3n),655n),use=rec(f(original,4n),664n);equal(f(request,1n),who.observer,'request observer');
  const body=request.fields.get(2n);let channels:readonly string[]|null=null;
  if(body!==undefined){const b=rec(body,650n);equal(f(b,1n),who.observer,'body request observer');channels=items(f(b,2n),'set').map(symbol);}
  const plan={at:at(f(original,1n)),lane:(uint(f(original,5n))===1n?'Current':'Consequence') as 'Current'|'Consequence',request:{bodyChannels:channels,panel:bool(f(request,3n)),visual:bool(f(request,4n))},use:{bodySelection:bool(f(use,1n)),visualSelection:bool(f(use,2n)),bodyCue:bool(f(use,3n)),visualCue:bool(f(use,4n)),goalAssessment:use.fields.has(5n)?symbol(f(use,5n)):null}};
  const policy=rec(value(f(use,6n)),698n),bindings=Object.fromEntries(slots.map((slot,i)=>[slot,policy.fields.has(BigInt(i+1))?identity(f(policy,BigInt(i+1))):null])) as unknown as ObservationExecutionPolicy;
  bindObservationExecutionPolicy(plan.use,bindings,ref=>{const definition=value(ref);if(typeof definition==='boolean'||definition.kind!=='record')fail('GA source policy definition');return kinds[String(definition.schema.typeId)]??fail('GA source policy kind');});
  return plan;
 });
 const bounds=get('run-bounds',695n),schedule=validateGeneralSourceSchedule(plans,{initialClock:0n,horizon:at(f(bounds,2n)),channels:channelNames,assessmentDefinitions:[symbol(d('goal'))],lifecycleInstants:[at(f(get('goal',558n),5n)),at(f(get('goal',558n),6n))]});
 if(schedule.observations>Number(uint(f(bounds,1n))))fail('GA source observation bound');
 for(const [surface,frames] of [['visual',sceneFrames],['panel',panelFrames]] as const){
  const requested=plans.filter(p=>p.request[surface]).map(p=>p.at);
  if(frames.length!==requested.length||frames.some((frame,i)=>frame.at!==requested[i]))fail('GA source exact frame coverage');
 }
 for(const plan of plans.filter(p=>p.use.visualCue)){
  const frame=sceneFrames.find(f=>f.at===plan.at)!;
  if(frame.items.filter(i=>i.visible&&i.permitted).length>1)fail('GA source ambiguous visual cue');
 }
 // Detached definitions are reproducible inputs to the later runtime adapter.
 return Object.freeze({counts:Object.freeze({observations:schedule.observations,visualSweeps:schedule.visualSweeps,panelSweeps:schedule.panelSweeps,qualifiedSelectionSlots:schedule.qualifiedSelectionSlots}),
  plans:()=>structuredClone(schedule.entries),sceneFrames:()=>structuredClone(sceneFrames),panelFrames:()=>structuredClone(panelFrames),originalBytes:()=>enc(list(originals))});
}
