import {lifecycleSource} from './semanticLifecycle';
import {appearanceSource} from './semanticAppearance';
/** assembled-recognition/0.1: governed finite cue channel; no selected identity input. */
import {list,set,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {validateSemanticReferent,semanticReferentValue} from '../substrate/referentOrigin';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {semanticRecordValue as sr,semanticTypedId,observerIdValue,restorePerceptualReferentId} from '../semanticBinding/semanticCodecs';
import {semanticStateAuthorityRegistryValue,candidateCatalogEntryPath} from '../semanticBinding/semanticStateAuthority';
import {RECOGNITION_CONTRACT_VERSION as VERSION,type RecognitionResolutionRecord,type RecognitionCandidateCatalogEntry} from '../semanticBinding/recognition';
import {BODY_OBSERVER} from './bodyIdentifiers';
import {socialSetting} from './social';
export const RECOGNITION='assembled-recognition/0.1',OBSERVER=txt(BODY_OBSERVER.payload);
export {VERSION};
export const demand=(b:boolean,s:string)=>{if(!b)invalidModel('recognition '+s);};
export const RECOGNITION_DOMAIN='assembled-recognition-domain/0.1',RECOGNITION_SEED_VERSION='assembled-character-recognition-seed/0.1-candidate';
export const RECOGNITION_ACCESS_VERSION='assembled-character-recognition-access/0.1-candidate';
export const RECOGNITION_SYMBOL_DOMAIN='assembled-recognition-symbol-domain/0.1',RECOGNITION_SYMBOL_VERSION='assembled-character-recognition-symbol/0.1-candidate';
export const RECOGNITION_CATALOG='assembled-recognition-catalog/0.1';
export function compileRecognition(v:CanonicalValue,target:CanonicalValue,configurable=false,seededKnowledge=false,symbolKnowledge=false,cueAccess=false,richAppearance=false,semanticLifecycle=false,twoLanes=false,causalCompanions=false){
 const a=items(v,'list');let entries:{candidate:CanonicalValue;templates:string[]}[];
 const validTemplates=(xs:string[])=>xs.every(x=>x.length>0&&x.length<=80)&&new Set(xs).size===xs.length;
 if(configurable){
  demand(a.length===(symbolKnowledge?4:3)&&txt(a[0])===(symbolKnowledge?RECOGNITION_SYMBOL_DOMAIN:seededKnowledge?RECOGNITION_DOMAIN:RECOGNITION_CATALOG),'catalog declaration');
  demand(key(a[2])===key(semanticStateAuthorityRegistryValue()),'authority manifest');
  entries=items(a[1],'list').map(v=>{const x=items(v,'list');demand(x.length===2,'catalog entry');validateSemanticReferent(x[0]);const templates=items(x[1],'list').map(txt);demand(templates.length>=1&&templates.length<=4&&validTemplates(templates),'catalog templates');return {candidate:x[0],templates:[...templates].sort()};});
  demand(entries.length>=1&&entries.length<=8,'catalog capacity');demand(new Set(entries.map(e=>key(e.candidate))).size===entries.length,'duplicate candidate');demand(entries.some(e=>key(e.candidate)===key(target)),'missing target');
  entries.sort((a,b)=>key(a.candidate)<key(b.candidate)?-1:1);
 }else{
  demand(a.length===4&&txt(a[0])===RECOGNITION,'declaration');validateSemanticReferent(a[1]);demand(key(a[1])!==key(target),'distinct candidates');const templates=items(a[2],'list').map(txt);demand(templates.length===2&&validTemplates(templates),'templates');demand(key(a[3])===key(semanticStateAuthorityRegistryValue()),'authority manifest');
  entries=[{candidate:target,templates:[templates[0]]},{candidate:a[1],templates:[templates[1]]}];
 }
 const symbols=symbolKnowledge?items(a[3],'list').map(txt).sort():[];
 demand(!symbolKnowledge||symbols.length>=1&&symbols.length<=8&&validTemplates(symbols),'symbol domain');
 const bindings=entries.flatMap(e=>e.templates.map(template=>({candidate:e.candidate,template})));
 return {...(causalCompanions?{causalCompanions:true}:{}),...(twoLanes?{twoLanes:true}:{}),...(semanticLifecycle?{semanticLifecycle:true}:{}),...(richAppearance?{richAppearance:true}:{}),...(cueAccess?{cueAccess:true}:{}),...(symbolKnowledge?{symbols}:{}),...(seededKnowledge?{seededKnowledge:true}:{}),candidates:entries.map(e=>e.candidate),templates:[...new Set(bindings.map(e=>e.template))],bindings};
}
export type RecognitionSettings=ReturnType<typeof compileRecognition>&{readonly sharedFiles?:boolean;readonly multiUnit?:boolean;readonly sharedBindings?:boolean};
export function recognitionSource(v:CanonicalValue,settings:RecognitionSettings){
 const a=items(v,'list');demand(a.length===6&&txt(a[0])===RECOGNITION,'source grammar');socialSetting(a[1]);validateSemanticReferent(a[2]);const lifecycle=settings.semanticLifecycle?lifecycleSource(a[3]):undefined;demand(!!lifecycle||typeof a[3]==='boolean','continuity');
 const appearance=settings.richAppearance?appearanceSource(a[4]):undefined,form=settings.richAppearance?[]:items(a[4],'list');demand(form.length<=1&&form.every(x=>typeof x==='boolean'),'appearance');
 const all=items(a[5],'list').map(v=>{const x=items(v,'list'),typed=(settings.symbols?.length??0)>0;demand(x.length===(settings.cueAccess?4:typed?3:2),'signal grammar');
 const kind=typed?uint(x[0]):1n,token=txt(x[typed?1:0]),support=x[typed?2:1];demand(typeof support==='boolean'&&[1n,2n].includes(kind)&&(kind===1n?settings.templates:(settings.symbols??[])).includes(token),'signal domain');demand(!settings.cueAccess||typeof x[3]==='boolean','signal permission');return {kind,token,support:support===true,permitted:!settings.cueAccess||x[3]===true};});
 demand(new Set(all.map(x=>x.kind+'/'+x.token)).size===all.length,'duplicate signal');
 const visible=all.filter(x=>x.permitted);
 return {lifecycle,appearance,social:a[1],continuity:lifecycle?items(lifecycle,'list')[0]===true:a[3]===true,form:form[0] as boolean|undefined,
 signals:visible.filter(x=>x.kind===1n).map(x=>({template:x.token,support:x.support})),
 symbols:visible.filter(x=>x.kind===2n).map(x=>({symbol:x.token,support:x.support}))};
}
export function catalogEntries(settings:RecognitionSettings){return settings.candidates.map(candidate=>({path:candidateCatalogEntryPath(OBSERVER,key(candidate)),value:sr('RecognitionCandidateCatalogEntry',{ObserverId:observerIdValue(OBSERVER),CandidateSemanticReferentId:candidate,CandidateDomain:u(1),RecognitionTemplateIds:set(settings.bindings.filter(b=>key(b.candidate)===key(candidate)).map(b=>semanticTypedId('RecognitionTemplateId',text(b.template)))),CatalogEntryVersion:text(VERSION)})}));}
export function readCatalog(v:CanonicalValue):RecognitionCandidateCatalogEntry{const x=rec(v,228n);return {observerId:txt(id(f(x,1n)).payload),candidateSemanticReferentId:key(f(x,2n)),candidateDomain:'Person',recognitionTemplateIds:items(f(x,4n),'set').map(v=>txt(id(v).payload)).sort(),catalogEntryVersion:txt(f(x,5n))};}
const ordinal=(v:CanonicalValue)=>uint(id(v).payload);
export function readResolution(v:CanonicalValue):RecognitionResolutionRecord{const x=rec(v,236n),resolution=rec(f(x,5n),235n);return {recognitionResolutionId:ordinal(f(x,1n)),experienceId:ordinal(f(x,2n)),observerId:txt(id(f(x,3n)).payload),perceptualReferentId:restorePerceptualReferentId(f(x,4n)),resolution:uint(f(resolution,1n))===1n?{kind:'asserted-candidate',candidateSemanticReferentId:key(f(resolution,2n))}:{kind:'withdrawn'},recognitionRuleId:txt(id(f(x,6n)).payload),evaluatedRecognitionCueEvidenceIds:items(f(x,7n),'set').map(ordinal),revisesRecognitionResolutionId:x.fields.has(8n)?ordinal(f(x,8n)):undefined,occurredAt:uint(f(x,9n)),recognitionVersion:txt(f(x,10n))};}
export const resolvedValue=(r:RecognitionResolutionRecord|undefined)=>r?.resolution.kind==='asserted-candidate'?semanticReferentValue(r.resolution.candidateSemanticReferentId):list([]);

/** The domain limits seed knowledge; it never supplies absent learned templates. */
export function validateSeedCatalog(value:CanonicalValue,allowed:CanonicalValue){
 const actual=rec(value,228n),domain=rec(allowed,228n),templates=f(actual,4n),permitted=new Set(items(f(domain,4n),'set').map(key));
 demand(key(value)===key({...domain,fields:new Map([...domain.fields].map(([n,v])=>[n,n===4n?templates:v]))}),'seed catalog identity/schema');
 const known=items(templates,'set');demand(known.every(t=>permitted.has(key(t)))&&new Set(known.map(key)).size===known.length,'seed catalog template domain');
 return readCatalog(value);
}
