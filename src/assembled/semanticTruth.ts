/** semantic-truth/0.1: governed world facts project into the existing observation channel. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {EventRoleId as R,compileEventBindings,materializeEventBindings,type EventRoleId,type EventTypeBindingSchema,type ReferentDomainValidator,type EventBindingRequest} from '../semanticBinding/eventBindings';
import {worldEventTruthValue} from '../semanticBinding/semanticEvidenceCodecs';
import {appearanceSource} from './semanticAppearance';
import {recognitionSignals,type RecognitionSettings} from './recognition';
import {roleChannel} from './encoding';
export const TRUTH_SCENE='assembled-truth-scene/0.1';
export const SEMANTIC_TRUTH='assembled-semantic-truth/0.1',TRUTH_CHANNEL='assembled-truth-role-channel/0.1',SEMANTIC_TRUTH_VERSION='assembled-character-semantic-truth/0.1-candidate';
const roles=[R.Actor,R.Target,R.Participant,R.Recipient,R.Companion,R.Instrument,R.Location,R.Beneficiary,R.AffectedEntity,R.Action] as const;
const need=(v:unknown,s:string)=>{if(!v)invalidModel('semantic truth: '+s);};
const word=(v:CanonicalValue)=>{const s=txt(v);need(s.length>0&&s.length<=120&&s===s.normalize('NFC'),'governed symbol');return s;};
export const truthRole=(n:bigint):EventRoleId=>{need(n>=1n&&n<=10n,'role code');return roles[Number(n)-1];};
/** Carrier-independent SEM-001B precision port; original carrier packaging occurs later. */
export function permittedRoleCode(role:bigint,precision:bigint):bigint|undefined{
 truthRole(role);need(precision>=0n&&precision<=3n,'precision');
 if(precision===0n)return undefined;
 need(role!==10n,'Action cannot bind a continuant');
 if(precision===3n)return 0n;
 if(precision===1n)return role;
 need([1n,2n,3n,4n,5n,8n,9n].includes(role),'role cannot coarsen to Participant');return 3n;
}
export function compileSemanticTruth(v:CanonicalValue){
 const a=items(v,'list');need(a.length===3&&txt(a[0])===SEMANTIC_TRUTH,'content declaration');
 const referents=items(a[1],'list').map(v=>{const x=items(v,'list');need(x.length===2,'referent');validateSemanticReferent(x[0]);const tags=items(x[1],'list').map(word);need(tags.length>0&&tags.length<=16&&tags.every((t,i)=>i===0||tags[i-1]<t),'canonical domain tags');return {semanticReferentId:key(x[0]),domainTags:tags};});
 need(referents.length>=1&&referents.length<=32&&new Set(referents.map(r=>r.semanticReferentId)).size===referents.length,'referent domain');
 const tags=new Set<string>();
 const schemas=items(a[2],'list').map(v=>{const x=items(v,'list');need(x.length===3,'event schema');const eventTypeId=word(x[0]),fixed=items(x[2],'list');need(fixed.length<=1,'fixed action');const fixedActionReferentId=fixed.length?key(fixed[0]):undefined;
 if(fixedActionReferentId)need(referents.some(r=>r.semanticReferentId===fixedActionReferentId&&r.domainTags.includes('action')),'fixed Action referent');
 const rules=items(x[1],'list').map(v=>{const r=items(v,'list');need(r.length===4,'cardinality rule');const eventRoleId=truthRole(uint(r[0])),min=uint(r[1]),max=items(r[2],'list'),narrow=items(r[3],'list');need(min<=16n&&max.length<=1&&narrow.length<=1,'cardinality domain');const maximum=max.length?uint(max[0]):undefined;need(maximum===undefined||maximum>=min&&maximum<=16n,'cardinality range');const tag=narrow.length?word(narrow[0]):undefined;if(tag)tags.add(tag);
 return {eventRoleId,minOccurrences:Number(min),maxOccurrences:maximum===undefined?{kind:'unbounded' as const}:{kind:'finite' as const,value:Number(maximum)},...(tag?{referentDomainNarrowingValidatorId:'assembled-tag/'+tag}:{})};});
 need(rules.length>0&&rules.length<=10&&new Set(rules.map(r=>r.eventRoleId)).size===rules.length,'role rules');
 if(fixedActionReferentId)need(!rules.some(r=>r.eventRoleId===R.Action&&(r.maxOccurrences.kind==='unbounded'||r.maxOccurrences.value>0)),'redundant fixed Action');
 return {eventTypeId,roleCardinalityRules:rules.sort((a,b)=>a.eventRoleId<b.eventRoleId?-1:1),bindingSchemaVersion:'event-type-bindings/0.1-candidate',...(fixedActionReferentId?{fixedActionReferentId}:{})} satisfies EventTypeBindingSchema;
 });
 need(schemas.length>=1&&schemas.length<=8&&new Set(schemas.map(s=>s.eventTypeId)).size===schemas.length,'event schema domain');
 const validators:ReferentDomainValidator[]=[...tags].sort().map(tag=>({validatorId:'assembled-tag/'+tag,accepts:r=>r.domainTags.includes(tag)}));
 return {referents,schemas,validators};
}
export type SemanticTruthSettings=ReturnType<typeof compileSemanticTruth>;
type Settings=Partial<RecognitionSettings>;
function carrierDetails(v:CanonicalValue,settings:Settings){
 const a=items(v,'list');need(a.length===0||settings.carrierDetails&&a.length===2,'carrier detail version/shape');
 if(!a.length)return list([list([list([]),list([])]),list([]),list([])]);
 const cues=recognitionSignals(a[1],settings as RecognitionSettings);
 return list([appearanceSource(a[0]),list(cues.signals.map(c=>list([text(c.template),c.support]))),list(cues.symbols.map(c=>list([text(c.symbol),c.support])))]);
}
const isScene=(v:CanonicalValue)=>{const a=items(v,'list');return a.length>0&&typeof a[0]!=='boolean'&&a[0].kind==='text'&&a[0].value===TRUTH_SCENE;};
const isTruth=(v:CanonicalValue)=>{const a=items(v,'list');return a.length>0&&typeof a[0]!=='boolean'&&a[0].kind==='text'&&a[0].value===TRUTH_CHANNEL;};
function declared(v:CanonicalValue,settings:SemanticTruthSettings,multiEvents=false,details=false){
 const a=items(v,'list');need(a.length===3&&txt(a[0])===TRUTH_CHANNEL,'source channel');const schema=settings.schemas.find(s=>s.eventTypeId===txt(a[1]));need(schema,'undeclared event type');
 const rows=items(a[2],'list').map(v=>{const x=items(v,'list');need(x.length===4||multiEvents&&x.length===5||details&&x.length===6,'binding source fields');const code=uint(x[0]),eventRoleId=truthRole(code),referent=settings.referents.find(r=>r.semanticReferentId===key(x[1]));need(referent,'undeclared referent');const precision=uint(x[2]),group=uint(x[3]);const eventGroup=x.length>=5?uint(x[4]):0n;need(group<=5n&&eventGroup<=(multiEvents?1n:0n),'perceived group/event');return {rawDetails:x.length===6?x[5]:list([]),eventGroup,request:{eventRoleId,semanticReferent:referent!} satisfies EventBindingRequest,code,precision,group,observed:permittedRoleCode(code,precision)};});
 need(rows.length>=1&&rows.length<=16,'truth binding capacity');compileEventBindings(schema!,rows.map(r=>r.request),0n,settings.validators);
 return {schema:schema!,rows};
}
function scene(v:CanonicalValue,settings:Settings){
 need(settings.truth,'truth source version');let parts=[v];
 if(isScene(v)){const a=items(v,'list');need(settings.multiEvents&&a.length===2,'scene version/shape');parts=[...items(a[1],'list')];need(parts.length>=1&&parts.length<=2,'world event count');}
 const events=parts.map(v=>declared(v,settings.truth!,!!settings.multiEvents,!!settings.carrierDetails));
 for(const row of events.flatMap(e=>e.rows))carrierDetails(row.rawDetails,settings);
 const visible=events.flatMap(e=>e.rows).filter(r=>r.observed!==undefined).sort((a,b)=>a.group<b.group?-1:a.group>b.group?1:a.eventGroup<b.eventGroup?-1:a.eventGroup>b.eventGroup?1:a.observed!<b.observed!?-1:1);
 need(visible.length>=1&&visible.length<=6&&visible[0].group===0n&&visible[0].eventGroup===0n,'permitted focal binding/capacity');
 const groups=visible.filter(r=>r.group!==0n).map(r=>r.group);need(new Set(groups).size===groups.length,'only focal group may repeat');
 return {events,visible};
}
function capacityDomain(role:ReturnType<typeof roleChannel>,settings:Settings){
 if(settings.multiEvents&&settings.selectionCapacity===2){
  const units=new Map<bigint,Set<bigint>>();
  for(const r of[{observed:role.observed,eventGroup:0n},...role.additional.filter(r=>r.permitted&&r.sameFocal)]){
   const group=r.eventGroup??0n,claims=units.get(group)??new Set<bigint>();
   if(r.observed!==0n&&r.observed!==8n)claims.add(r.observed===5n?3n:r.observed);units.set(group,claims);
  }
  need([...units.values()].filter(s=>s.size===1&&[1n,2n,3n].includes([...s][0])).length<=1,'capacity2 requires distinct eligible continuants across event files');
 }
 return role;
}
export function sourceRole(v:CanonicalValue,settings:Settings){
 let source=v;
 if(isTruth(v)||isScene(v)){
  const {visible}=scene(v,settings),first=visible[0];need(items(first.rawDetails,'list').length===0,'primary details belong in source header');
  source=list([u(first.code),u(first.observed!),list(visible.slice(1).map(r=>list([true,u(r.code),u(r.observed!),r.group===0n,...(settings.multiEvents?[u(r.eventGroup)]:[]),...(settings.carrierDetails?[r.rawDetails]:[])])))]);
 }
 const role=capacityDomain(roleChannel(source,!!settings.multiUnit,!!settings.sharedBindings,!!settings.wideRoles,!!settings.wideUnits,!!settings.multiEvents,!!settings.carrierDetails),settings),eventFeatures=new Set<bigint>();
 const additional=role.additional.map(r=>{
  const safeDetails=carrierDetails(r.rawDetails,settings),raw=items(r.rawDetails,'list'),appearance=raw.length?items(raw[0],'list'):[],continuant=appearance.length?items(appearance[0],'list'):[],events=appearance.length?items(appearance[1],'list'):[],cues=raw.length?items(raw[1],'list'):[];
  need(!r.sameFocal||!continuant.length&&!cues.length,'shared carrier has one feature/cue authority');
  if(events.length){need(r.eventGroup===1n&&!eventFeatures.has(r.eventGroup),'one secondary-event feature authority');eventFeatures.add(r.eventGroup!);}
  return {...r,safeDetails};
 });
 return {...role,additional};
}
/** Truth products are returned only to the source handler's trace projection. */
export function materializeTruth(v:CanonicalValue,settings:Settings,allocate:()=>bigint,at:bigint):CanonicalValue[]{
 if(!isTruth(v)&&!isScene(v))return [];
 return scene(v,settings).events.map(({schema,rows})=>{const worldEventOrdinal=allocate(),result=materializeEventBindings(schema,rows.map(r=>r.request),allocate,settings.truth!.validators);return worldEventTruthValue({worldEventOrdinal,eventTypeId:result.eventTypeId,occurredAt:at,bindings:result.bindings});});
}
