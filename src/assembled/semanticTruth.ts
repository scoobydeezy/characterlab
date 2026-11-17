/** semantic-truth/0.1: governed world facts project into the existing observation channel. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {EventRoleId as R,compileEventBindings,materializeEventBindings,type EventRoleId,type EventTypeBindingSchema,type ReferentDomainValidator,type EventBindingRequest} from '../semanticBinding/eventBindings';
import {worldEventTruthValue} from '../semanticBinding/semanticEvidenceCodecs';
import {roleChannel} from './encoding';
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
type Settings={truth?:SemanticTruthSettings;multiUnit?:boolean;sharedBindings?:boolean;wideRoles?:boolean;wideUnits?:boolean};
const isTruth=(v:CanonicalValue)=>{const a=items(v,'list');return a.length>0&&typeof a[0]!=='boolean'&&a[0].kind==='text'&&a[0].value===TRUTH_CHANNEL;};
function declared(v:CanonicalValue,settings:SemanticTruthSettings){
 const a=items(v,'list');need(a.length===3&&txt(a[0])===TRUTH_CHANNEL,'source channel');const schema=settings.schemas.find(s=>s.eventTypeId===txt(a[1]));need(schema,'undeclared event type');
 const rows=items(a[2],'list').map(v=>{const x=items(v,'list');need(x.length===4,'binding source fields');const code=uint(x[0]),eventRoleId=truthRole(code),referent=settings.referents.find(r=>r.semanticReferentId===key(x[1]));need(referent,'undeclared referent');const precision=uint(x[2]),group=uint(x[3]);need(group<=5n,'perceived group');return {request:{eventRoleId,semanticReferent:referent!} satisfies EventBindingRequest,code,precision,group,observed:permittedRoleCode(code,precision)};});
 need(rows.length>=1&&rows.length<=16,'truth binding capacity');compileEventBindings(schema!,rows.map(r=>r.request),0n,settings.validators);
 const visible=rows.filter(r=>r.observed!==undefined).sort((a,b)=>a.group<b.group?-1:a.group>b.group?1:a.observed!<b.observed!?-1:1);
 need(visible.length>=1&&visible.length<=6&&visible[0].group===0n,'permitted focal binding/capacity');
 const groups=visible.filter(r=>r.group!==0n).map(r=>r.group);need(new Set(groups).size===groups.length,'only focal group may repeat');
 return {schema:schema!,rows,visible};
}
export function sourceRole(v:CanonicalValue,settings:Settings){
 if(!isTruth(v))return roleChannel(v,!!settings.multiUnit,!!settings.sharedBindings,!!settings.wideRoles,!!settings.wideUnits);
 need(settings.truth,'truth source version');const {visible}=declared(v,settings.truth!),first=visible[0];
 return roleChannel(list([u(first.code),u(first.observed!),list(visible.slice(1).map(r=>list([true,u(r.code),u(r.observed!),r.group===0n])))]),true,true,true,true);
}
/** Truth products are returned only to the source handler's trace projection. */
export function materializeTruth(v:CanonicalValue,settings:Settings,allocate:()=>bigint,at:bigint):CanonicalValue[]{
 if(!isTruth(v))return [];need(settings.truth,'truth source version');const {schema,rows}=declared(v,settings.truth!);
 const worldEventOrdinal=allocate(),result=materializeEventBindings(schema,rows.map(r=>r.request),allocate,settings.truth!.validators);
 return [worldEventTruthValue({worldEventOrdinal,eventTypeId:result.eventTypeId,occurredAt:at,bindings:result.bindings})];
}
