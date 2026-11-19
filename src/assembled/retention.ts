import {POSITION_PRESENTATION_VERSION} from './positionPresentation';
import {APPEARANCE_EPISODE,fragmentAppearance,isAppearancePath,appearancePath,appearanceEpisode} from './familiarity';
import {EFFECT_EPISODE,isEffectEpisodePath,effectEpisodePath,validateEffectEpisode} from './effectEvidence';
import {directions,assertSignificanceUpdate,SIGNIFICANCE_VERSION} from './significance';
import {POSITION_EPISODE,POSITION_MEMORY_VERSION,POSITION_USE_VERSION,assertPositionUseUpdate,isPositionEpisodePath,positionEpisodePath,validatePositionEpisode} from './memory';
import {assertBodyUseUpdate,type MemoryUseLaw} from './memoryUse';
import {assertPresentationUpdate} from './affectMemory';
import {MEMORY_PRESENTATION} from './memory';
/** assembled-character-retention/0.1: same episodic owner, explicit kind budgets.
 * Bounded port of the unprotected SignificanceFirst tier; no authored credit. */
import {canonicalEncode as enc,list,text,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,statePathValue,type StatePath,type StatePathPattern,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {traceRecordValue} from '../substrate/trace';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {dataItems as items,dataField as f,dataRecord as rec,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import {memoryRecord as r} from '../campaign2/memoryCodecs';
import {bodyId} from './body';
import {EPISODE,EPISODIC_OWNER,MEMORY_FORMATION,bodyEpisodePath,isBodyEpisodePath,isSocialEpisodePath,socialEpisodePath,SOCIAL_EPISODE} from './memory';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const RETENTION='assembled-episodic-retention/0.1';
export function compileRetentionDeclaration(v:CanonicalValue,pressureEnabled=false){
 const a=items(v,'list');if(a.length!==(pressureEnabled?5:4)||txt(a[0])!==RETENTION||uint(a[1])>1024n||uint(a[2])>1024n||uint(a[3])<1n||uint(a[3])>100n)invalidModel('retention requires capacities0..1024 and body recall delay1..100');
 const pressure=pressureEnabled?items(a[4],'list').map(v=>{const p=items(v,'list');if(p.length!==3||typeof p[0]==='boolean'||p[0].kind!=='signed'||p[0].value<0n||p[0].value>1000000n||uint(p[1])>1024n||uint(p[2])>1024n)invalidModel('retention pressure entry');return Object.freeze({at:(p[0] as {value:bigint}).value,diagnostic:Number(uint(p[1])),body:Number(uint(p[2]))});}):undefined;
 if(pressure&&(pressure.length>16||pressure.some((p,i)=>i>0&&p.at<=pressure[i-1].at)))invalidModel('retention pressure order/count');
 return Object.freeze({diagnostic:Number(uint(a[1])),body:Number(uint(a[2])),recallDelay:uint(a[3]),...(pressure?{pressure:Object.freeze(pressure)}:{})});
}
export type RetentionDeclaration=ReturnType<typeof compileRetentionDeclaration>;
export function retentionCapacities(d:RetentionDeclaration,at:bigint){let limits={diagnostic:d.diagnostic,body:d.body};for(const p of d.pressure??[])if(p.at<=at)limits={diagnostic:p.diagnostic,body:p.body};return limits;}
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','assembled retention: '+s);};
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n)return fail('acquisition time');return v.value;};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
const address=(id:bigint)=>enc(list([unsigned(id),text('episode')]));
export interface UncreditedEpisode {readonly acquisition:bigint;readonly acquiredAt:bigint;readonly kind:'diagnostic'|'body';readonly useProtection?:boolean;readonly significant?:boolean}
/** Exact tier comparator; useProtection is PRIOR committed metadata, never candidate credit. */
export function retainedEpisodeIds(rows:readonly UncreditedEpisode[],now:bigint,capacity:{diagnostic:number;body:number},law:MemoryUseLaw='AgeOnly'){
 if(!['SignificanceFirst','SharedProtection','UseOnly','AgeOnly'].includes(law))fail('retention law');
 const seen=new Set<bigint>();if(typeof now!=='bigint'||now<0n)fail('clock');
 for(const row of rows){if(typeof row.acquisition!=='bigint'||row.acquisition<0n||seen.has(row.acquisition)||typeof row.acquiredAt!=='bigint'||row.acquiredAt<0n||row.acquiredAt>now||!['diagnostic','body'].includes(row.kind)||row.useProtection!==undefined&&typeof row.useProtection!=='boolean'||(row.useProtection===true||row.significant===true)&&row.acquiredAt===now||row.significant!==undefined&&typeof row.significant!=='boolean')fail('duplicate/invalid episode');seen.add(row.acquisition);}
 const survivors:bigint[]=[],tier=(r:UncreditedEpisode)=>law==='SignificanceFirst'?(r.significant?0:r.useProtection?1:2):law==='SharedProtection'?(r.significant||r.useProtection?0:1):law==='UseOnly'?(r.useProtection?0:1):0;
 for(const kind of ['diagnostic','body'] as const){if(!Number.isSafeInteger(capacity[kind])||capacity[kind]<0||capacity[kind]>1024)fail('capacity');const ranked=rows.filter(r=>r.kind===kind).sort((a,b)=>tier(a)!==tier(b)?tier(a)-tier(b):a.acquiredAt!==b.acquiredAt?(a.acquiredAt>b.acquiredAt?-1:1):compare(address(a.acquisition),address(b.acquisition)));survivors.push(...ranked.slice(0,capacity[kind]).map(r=>r.acquisition));}
 return survivors.sort((a,b)=>compare(enc(unsigned(a)),enc(unsigned(b))));
}
const domain:StatePathPattern={rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]};
function holder(path:StatePath,C:CanonicalValue){const selector=path.selectors[0];if(path.rootStateTypeId!==346n||path.fieldId!==1n||path.selectors.length!==1||selector?.kind!=='mapKey')return fail('episode removal path');const k=selector.key,c=(isAppearancePath(path)||isEffectEpisodePath(path)||isBodyEpisodePath(path)||isSocialEpisodePath(path)||isPositionEpisodePath(path))?items(k,'list')[1]:f(rec(k,344n),1n);if(!eq(c,C))fail('foreign episode holder');}
/** Only removal is extended; all existing formation validators/owners stay in force. */
export function withRetentionState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue){
 const authority=new StateAuthorityRegistry([{pattern:domain,validateValue:()=>{fail('retention is removal only');},removalAllowed:true}],[{mutationAuthorityId:EPISODIC_OWNER,patterns:[domain]}]);
 return Object.freeze({...base,applyPatch(state:AuthoritativeState,patch:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
  const removals=patch.operations.filter(o=>o.kind==='remove'&&o.path.rootStateTypeId===346n);if(!removals.length)return base.applyPatch(state,patch,owner,scope);
  if(removals.length!==patch.operations.length)fail('mixed removal operation');
  for(const op of removals){holder(op.path,C);base.validatePath(op.path);base.read(state,op.path);if(scope&&(!scope.writableRoots.includes(346n)||!scope.targetPaths.some(p=>eq(statePathValue(p),statePathValue(op.path)))))fail('removal scope');}
  const result=applyStatePatch(state,patch,owner,authority);base.validateState(result.state);return result;
 }});
}
function episode(entry:{path:StatePath;value:CanonicalValue},C:CanonicalValue):UncreditedEpisode&typeof entry{
 holder(entry.path,C);let acquisition:CanonicalValue,acquiredAt:bigint,kind:'diagnostic'|'body';
 if(isAppearancePath(entry.path)){const a=appearanceEpisode(entry.value);acquisition=a[1];acquiredAt=time(a[5]);kind='body';}
 else if(isEffectEpisodePath(entry.path)){const a=validateEffectEpisode(entry.value,C);acquisition=a[1];acquiredAt=time(a[5]);kind='body';}
 else if(isPositionEpisodePath(entry.path)){const a=validatePositionEpisode(entry.value);acquisition=a[1];acquiredAt=time(a[5]);kind='body';}
 else if(isBodyEpisodePath(entry.path)||isSocialEpisodePath(entry.path)){const a=items(entry.value,'list');if(!(a.length===6||a.length===7&&txt(a[0])===EPISODE&&typeof a[6]==='boolean'||[7,8].includes(a.length)&&txt(a[0])===SOCIAL_EPISODE)||![EPISODE,SOCIAL_EPISODE].includes(txt(a[0])))fail('body episode schema');acquisition=a[1];acquiredAt=time(a[5]);kind='body';}
 else{const e=rec(f(rec(entry.value,345n),1n),342n),source=rec(f(e,2n),337n);acquisition=f(e,1n);acquiredAt=time(f(rec(f(source,2n),203n),5n));kind='diagnostic';}
 const occurrence=id(acquisition);if(occurrence.namespaceId!==1125n)fail('acquisition identity');return {...entry,acquisition:uint(occurrence.payload),acquiredAt,kind,significant:isPositionEpisodePath(entry.path)&&items(entry.value,'list').length>=8?directions(items(entry.value,'list')[7]).length>0:false,useProtection:isSocialEpisodePath(entry.path)&&items(entry.value,'list').length===8?items(entry.value,'list')[7] as boolean:isBodyEpisodePath(entry.path)&&items(entry.value,'list').length===7?items(entry.value,'list')[6] as boolean:isPositionEpisodePath(entry.path)&&items(entry.value,'list').length>=10?items(entry.value,'list')[9] as boolean:false};
}
/** Called only AFTER both existing formation producers/targets are authenticated. */
export function prepareEpisodicRetention(events:readonly ScheduledEvent[],B0:AuthoritativeState,C:CanonicalValue,d:RetentionDeclaration,stateModel:ReturnType<typeof compileCampaign2StateModel>,model:CanonicalValue,run:CanonicalValue,law?:MemoryUseLaw,presentation?:(event:ScheduledEvent)=>CanonicalValue,significanceEnabled=false){
 const formations=events.filter(e=>eq(e.eventTypeId,MEMORY_FORMATION)||txt(e.eventTypeId.payload)==='event/measurement-episode-formation');if(!formations.length)return undefined;
 const at=formations[0].dueAt,anchor=formations.at(-1)!,limits=retentionCapacities(d,at);
 const prior=B0.entries().filter(e=>e.path.rootStateTypeId===346n&&e.path.fieldId===1n).map(e=>episode(e,C));
 const fresh=formations.map(event=>{if(event.phase!==140n||event.dueAt!==at)fail('formation phase/time');let entry:{path:StatePath;value:CanonicalValue};
  if(eq(event.eventTypeId,MEMORY_FORMATION)){const a=items(event.payload,'list');entry={path:txt(a[0])===APPEARANCE_EPISODE?appearancePath(C,a[2]):txt(a[0])===EFFECT_EPISODE?effectEpisodePath(C,f(rec(a[2],900n),1n)):txt(a[0])===POSITION_EPISODE?positionEpisodePath(C,a[3]):txt(a[0])===SOCIAL_EPISODE?socialEpisodePath(C,a[2]):bodyEpisodePath(C,f(rec(a[2],461n),1n)),value:event.payload};}
  else{const source=rec(f(rec(event.payload,342n),2n),337n);entry={path:{rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'mapKey',key:r(344,[C,f(source,1n)])}]},value:r(345,[event.payload])};}
  const result=episode(entry,C);if(result.acquiredAt!==at||result.significant||result.useProtection)fail('fresh acquisition time');return result;
 });
 const updated=prior.map(e=>{if(isAppearancePath(e.path)&&fresh.some(x=>isAppearancePath(x.path))){const a=appearanceEpisode(e.value);return at-time(a[5])>=3n?{...e,value:fragmentAppearance(e.value)}:e;}const changes=events.filter(v=>eq(v.eventTypeId,MEMORY_PRESENTATION)).map(v=>presentation?presentation(v):items(v.payload,'list')[1]).filter(v=>uint(id(items(v,'list')[1]).payload)===e.acquisition);if(changes.length>1)fail('duplicate presentation');if(!changes.length)return e;if(isPositionEpisodePath(e.path)){if(items(e.value,'list').length>=10)assertPositionUseUpdate(e.value,changes[0]);else assertSignificanceUpdate(e.value,changes[0]);}else if(isBodyEpisodePath(e.path))assertBodyUseUpdate(e.value,changes[0]);else assertPresentationUpdate(e.value,changes[0],!!law);return {...e,value:changes[0]};});
 const rows=[...updated,...fresh],paths=new Set(rows.map(e=>key(statePathValue(e.path))));if(paths.size!==rows.length)fail('duplicate episode path');
 const retained=retainedEpisodeIds(rows,at,limits,law),survivors=new Set(retained),lost=rows.filter(e=>!survivors.has(e.acquisition)).sort((a,b)=>compare(enc(statePathValue(a.path)),enc(statePathValue(b.path))));
 const audit=list([text(RETENTION),signed(at),unsigned(limits.diagnostic),unsigned(limits.body),list(lost.map(e=>unsigned(e.acquisition))),list(retained.map(unsigned)),...(law?[text(law),list(rows.map(e=>list([unsigned(e.acquisition),e.useProtection??false,...(significanceEnabled?[e.significant??false]:[])])))]:[])]);
 const reads:ActualReadRecord[]=prior.map(e=>({accessorId:bodyId(1028,'accessor/episodic-retention-prior'),path:e.path,presence:true,value:stateModel.read(B0,e.path).value,derivedSources:[]}));
 const patch:StatePatch={operations:lost.map(e=>({kind:'remove' as const,path:e.path,expectedOldValue:e.value}))};let complete=false,diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[];
 return {anchor,audit,finish(candidate:AuthoritativeState){if(complete)fail('settlement reused');complete=true;const actual=candidate.entries().filter(e=>e.path.rootStateTypeId===346n&&e.path.fieldId===1n);if(actual.length!==rows.length||actual.some(e=>!rows.some(r=>eq(statePathValue(r.path),statePathValue(e.path))&&eq(r.value,e.value))))fail('formed episode union mismatch');
   const applied=stateModel.applyPatch(candidate,patch,EPISODIC_OWNER,{writableRoots:[346n],targetPaths:lost.map(e=>e.path)});diffs=applied.diffs;const after=applied.state.entries().filter(e=>e.path.rootStateTypeId===346n&&e.path.fieldId===1n).map(e=>episode(e,C));
   if(after.length!==retained.length||after.some(e=>!survivors.has(e.acquisition))||after.filter(e=>e.kind==='body').length>limits.body||after.filter(e=>e.kind==='diagnostic').length>limits.diagnostic)fail('retention invariant');return applied.state;
  },trace(){if(!complete)fail('trace before completed retention');return traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:anchor,seamId:bodyId(1036,'seam/assembled-episodic-retention'),seamVersion:d.pressure?.length?'assembled-character-retention/0.6-candidate':law==='SharedProtection'||law==='UseOnly'?'assembled-character-retention/0.5-candidate':rows.some(e=>isPositionEpisodePath(e.path)&&items(e.value,'list').length===11)?POSITION_PRESENTATION_VERSION:rows.some(e=>isPositionEpisodePath(e.path)&&items(e.value,'list').length>=10)?POSITION_USE_VERSION:rows.some(e=>isAppearancePath(e.path))?'assembled-character-familiarity/0.1-candidate':significanceEnabled?SIGNIFICANCE_VERSION:rows.some(e=>isPositionEpisodePath(e.path))?POSITION_MEMORY_VERSION:law?'assembled-character-retention/0.4-candidate':events.some(e=>eq(e.eventTypeId,MEMORY_PRESENTATION))?'assembled-character-retention/0.3-candidate':rows.some(e=>isSocialEpisodePath(e.path))?'assembled-character-retention/0.2-candidate':'assembled-character-retention/0.1-candidate',recordKind:anchor.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:[domain],actualReadRecords:reads,inputProjection:list(events.filter(e=>formations.includes(e)||eq(e.eventTypeId,MEMORY_PRESENTATION)).map(e=>list([unsigned(e.eventId),e.payload,...(law&&presentation&&eq(e.eventTypeId,MEMORY_PRESENTATION)?[presentation(e)]:[])]))),outputProjection:audit,randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:[],invariantResults:[]});}};
}
