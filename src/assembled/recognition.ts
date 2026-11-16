/** assembled-recognition/0.1: governed finite cue channel; no selected identity input. */
import {list,set,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {validateSemanticReferent,semanticReferentValue} from '../substrate/referentOrigin';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {semanticRecordValue as sr,semanticTypedId,observerIdValue,restorePerceptualReferentId} from '../semanticBinding/semanticCodecs';
import {semanticStateAuthorityRegistryValue,candidateCatalogEntryPath} from '../semanticBinding/semanticStateAuthority';
import {RECOGNITION_CONTRACT_VERSION as VERSION,type RecognitionResolutionRecord,type RecognitionCandidateCatalogEntry} from '../semanticBinding/recognition';
import {BODY_OBSERVER} from './body';
import {socialSetting} from './social';
export const RECOGNITION='assembled-recognition/0.1',OBSERVER=txt(BODY_OBSERVER.payload);
export {VERSION};
export const demand=(b:boolean,s:string)=>{if(!b)invalidModel('recognition '+s);};
export const RECOGNITION_CATALOG='assembled-recognition-catalog/0.1';
export function compileRecognition(v:CanonicalValue,target:CanonicalValue,configurable=false){
 const a=items(v,'list');let entries:{candidate:CanonicalValue;templates:string[]}[];
 const validTemplates=(xs:string[])=>xs.every(x=>x.length>0&&x.length<=80)&&new Set(xs).size===xs.length;
 if(configurable){
  demand(a.length===3&&txt(a[0])===RECOGNITION_CATALOG,'catalog declaration');
  demand(key(a[2])===key(semanticStateAuthorityRegistryValue()),'authority manifest');
  entries=items(a[1],'list').map(v=>{const x=items(v,'list');demand(x.length===2,'catalog entry');validateSemanticReferent(x[0]);const templates=items(x[1],'list').map(txt);demand(templates.length>=1&&templates.length<=4&&validTemplates(templates),'catalog templates');return {candidate:x[0],templates:[...templates].sort()};});
  demand(entries.length>=1&&entries.length<=8,'catalog capacity');demand(new Set(entries.map(e=>key(e.candidate))).size===entries.length,'duplicate candidate');demand(entries.some(e=>key(e.candidate)===key(target)),'missing target');
  entries.sort((a,b)=>key(a.candidate)<key(b.candidate)?-1:1);
 }else{
  demand(a.length===4&&txt(a[0])===RECOGNITION,'declaration');validateSemanticReferent(a[1]);demand(key(a[1])!==key(target),'distinct candidates');const templates=items(a[2],'list').map(txt);demand(templates.length===2&&validTemplates(templates),'templates');demand(key(a[3])===key(semanticStateAuthorityRegistryValue()),'authority manifest');
  entries=[{candidate:target,templates:[templates[0]]},{candidate:a[1],templates:[templates[1]]}];
 }
 const bindings=entries.flatMap(e=>e.templates.map(template=>({candidate:e.candidate,template})));
 return {candidates:entries.map(e=>e.candidate),templates:[...new Set(bindings.map(e=>e.template))],bindings};
}
export type RecognitionSettings=ReturnType<typeof compileRecognition>&{readonly sharedFiles?:boolean;readonly multiUnit?:boolean;readonly sharedBindings?:boolean};
export function recognitionSource(v:CanonicalValue,settings:RecognitionSettings){const a=items(v,'list');demand(a.length===6&&txt(a[0])===RECOGNITION,'source grammar');socialSetting(a[1]);validateSemanticReferent(a[2]);demand(typeof a[3]==='boolean','continuity');const form=items(a[4],'list');demand(form.length<=1&&form.every(x=>typeof x==='boolean'),'appearance');const signals=items(a[5],'list').map(v=>{const x=items(v,'list');demand(x.length===2&&typeof x[1]==='boolean'&&settings.templates.includes(txt(x[0])),'template signal');return {template:txt(x[0]),support:x[1]===true};});demand(signals.length<=settings.templates.length&&new Set(signals.map(x=>x.template)).size===signals.length,'duplicate/excess signal');return {social:a[1],continuity:a[3]===true,form:form[0] as boolean|undefined,signals};}
export function catalogEntries(settings:RecognitionSettings){return settings.candidates.map(candidate=>({path:candidateCatalogEntryPath(OBSERVER,key(candidate)),value:sr('RecognitionCandidateCatalogEntry',{ObserverId:observerIdValue(OBSERVER),CandidateSemanticReferentId:candidate,CandidateDomain:u(1),RecognitionTemplateIds:set(settings.bindings.filter(b=>key(b.candidate)===key(candidate)).map(b=>semanticTypedId('RecognitionTemplateId',text(b.template)))),CatalogEntryVersion:text(VERSION)})}));}
export function readCatalog(v:CanonicalValue):RecognitionCandidateCatalogEntry{const x=rec(v,228n);return {observerId:txt(id(f(x,1n)).payload),candidateSemanticReferentId:key(f(x,2n)),candidateDomain:'Person',recognitionTemplateIds:items(f(x,4n),'set').map(v=>txt(id(v).payload)).sort(),catalogEntryVersion:txt(f(x,5n))};}
const ordinal=(v:CanonicalValue)=>uint(id(v).payload);
export function readResolution(v:CanonicalValue):RecognitionResolutionRecord{const x=rec(v,236n),resolution=rec(f(x,5n),235n);return {recognitionResolutionId:ordinal(f(x,1n)),experienceId:ordinal(f(x,2n)),observerId:txt(id(f(x,3n)).payload),perceptualReferentId:restorePerceptualReferentId(f(x,4n)),resolution:uint(f(resolution,1n))===1n?{kind:'asserted-candidate',candidateSemanticReferentId:key(f(resolution,2n))}:{kind:'withdrawn'},recognitionRuleId:txt(id(f(x,6n)).payload),evaluatedRecognitionCueEvidenceIds:items(f(x,7n),'set').map(ordinal),revisesRecognitionResolutionId:x.fields.has(8n)?ordinal(f(x,8n)):undefined,occurredAt:uint(f(x,9n)),recognitionVersion:txt(f(x,10n))};}
export const resolvedValue=(r:RecognitionResolutionRecord|undefined)=>r?.resolution.kind==='asserted-candidate'?semanticReferentValue(r.resolution.candidateSemanticReferentId):list([]);
