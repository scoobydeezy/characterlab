/** Original retained attribution over actual shared-workspace operands only. */
import {list,text,signed,unsigned,canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec,dataField as f,dataText as txt,dataIdentity as id,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {SchedulerContractError} from '../substrate/scheduler';
import {restorePerceptualEventReferentId} from '../semanticBinding/semanticCodecs';
import {bindPerceivedTrialContext,type PerceivedTrialContext} from '../campaign3/perceivedTrialContext';
import {groupRetainedPositionTrial} from '../campaign3/retainedContextGrouping';
import {prepareAttributionProduction,produceAttributionResult,closeAttributionProduction} from '../campaign3/attributionProduction';
import type {AttributionTrial} from '../campaign3/contrastiveAttribution';
import type {prepareFocalPositionPairAttributionUse,PositionPairTrial} from '../campaign3/retainedAttributionUse';
import {decodeEmbodied} from '../campaign3/embodiedCodecs';
import {exact} from '../campaign3/embodiedMath';
import {EPISODE,POSITION_EPISODE,positionExperience,validatePositionEpisode} from './memory';
import {BODY_OBSERVER} from './body';
import {meaningValue} from './goalMeaning';
export const RETAINED_ATTRIBUTION='assembled-retained-attribution/0.1',BODY_CONTEXT='assembled-body-context/0.1',ATTRIBUTION_VERSION='assembled-character-retained-attribution/0.1-candidate';
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','retained attribution '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n)return fail('time');return v.value;};
const occurrence=(v:CanonicalValue,ns:bigint)=>{const a=id(v);if(a.namespaceId!==ns)fail('occurrence');return uint(a.payload);};
export function compileRetainedAttribution(v:CanonicalValue){if(!eq(v,list([text(RETAINED_ATTRIBUTION)])))fail('declaration');}
export function readBodyContext(v:CanonicalValue,at:bigint){const a=items(v,'list');if(a.length!==7||txt(a[0])!==BODY_CONTEXT||time(a[1])!==at||uint(a[4])>7n||!['Before','Motion','After'].includes(txt(a[5])))fail('body context');const context=restorePerceptualEventReferentId(a[2]);if(context.observerId!==txt(BODY_OBSERVER.payload))fail('body observer');return {context,panel:{observation:occurrence(a[3],1115n),sample:{kind:'Present' as const,at,glyph:Number(uint(a[4])),stage:txt(a[5]) as 'Before'|'Motion'|'After'}},tracking:uint(a[6])};}
export function bindBodyContext(v:CanonicalValue,experience:CanonicalValue){const x=positionExperience(experience),c=readBodyContext(v,x.occurredAt);return bindPerceivedTrialContext({experience:x.experienceId,context:c.context,panel:c.panel},x);}
export const isAttributionCue=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length===4&&eq(v.items[0],text(RETAINED_ATTRIBUTION));
export function validateAttributionCue(v:CanonicalValue,C:CanonicalValue,at:bigint){if(!isAttributionCue(v))fail('cue');const a=items(v,'list');if(!eq(a[1],C)||time(a[3])>=at)fail('cue holder/time');return {consequence:occurrence(a[2],1106n),sourceAt:time(a[3])};}
export function bodyContextCue(C:CanonicalValue,experience:CanonicalValue,audit:CanonicalValue){const a=items(audit,'list');if(a.length!==6)return undefined;const c=bindBodyContext(a[5],experience);return c.panel.sample.kind==='Present'&&c.panel.sample.stage==='After'?list([text(RETAINED_ATTRIBUTION),C,f(rec(experience,227n),1n),signed(c.panel.sample.at)]):undefined;}
/** The current delivery authenticates focus; missing retained operands stay missing. */
export function deriveRetainedAttribution(workspace:CanonicalValue,deliveryInput:CanonicalValue,at:bigint,allocate:()=>bigint){
 const w=items(workspace,'list'),C=f(rec(w[3],381n),2n),observer=txt(BODY_OBSERVER.payload),cues=items(deliveryInput,'list').filter(v=>isAttributionCue(f(rec(items(v,'list')[1],130n),6n))).map(v=>{const d=items(v,'list'),e=rec(d[1],130n);if(!eq(d[0],C)||time(f(e,2n))!==at||uint(f(e,3n))!==20n||txt(id(f(e,5n)).payload)!=='event/assembled-memory-recall')fail('current cue delivery');return f(e,6n);});
 if(cues.length>1)fail('multiple focal consequences');const focal=cues.length?{observer,...validateAttributionCue(cues[0],C,at)}:null;
 const groups:ReturnType<typeof groupRetainedPositionTrial>[]=[];
 const view=prepareAttributionProduction({observer,character:key(C),at,focal},():Parameters<typeof prepareFocalPositionPairAttributionUse>|null=>{
  const rows:{episode:CanonicalValue;a:readonly CanonicalValue[];companion:PerceivedTrialContext;kind:'Interoceptive'|'EventContinuant'}[]=[];
  for(const slot of items(w[4],'list')){const episode=items(slot,'list')[1],a=items(episode,'list');if(time(a[5])>=at)fail('prior operand');
   if(txt(a[0])===EPISODE){const audit=items(a[4],'list');if(audit.length!==6)continue;const companion=bindBodyContext(audit[5],a[3]);if(companion.panel.sample.kind==='Present'&&companion.panel.sample.stage!=='Motion')rows.push({episode,a,companion,kind:'Interoceptive'});}
   else if(txt(a[0])===POSITION_EPISODE){validatePositionEpisode(episode);const o=items(a[2],'list'),p=items(o[5],'list');if(p.length!==3||txt(p[2])!=='Motion')continue;const x=positionExperience(a[3]),companion=bindPerceivedTrialContext({experience:x.experienceId,context:restorePerceptualEventReferentId(items(a[4],'list')[0]),panel:{observation:occurrence(p[0],1115n),sample:{kind:'Present',at:x.occurredAt,glyph:Number(uint(p[1])),stage:'Motion'}}},x);rows.push({episode,a,companion,kind:'EventContinuant'});}
  }
  const contexts=[...new Map(rows.map(r=>[r.companion.context.observerEventSequence,r.companion.context])).values()].sort((a,b)=>a.observerEventSequence<b.observerEventSequence?-1:1);
  // Do not pick a convenient subset if the recalled context is ambiguous or overfull.
  if(rows.length>16)return null;
  for(const context of contexts)groups.push(groupRetainedPositionTrial(observer,context,rows.map(r=>r.companion)));
  if(rows.length!==16||groups.length!==4||groups.some(g=>g.kind!=='Grouped'))return null;
  const address=(experience:bigint)=>{const r=rows.find(r=>r.companion.experience===experience);if(!r)fail('grouped operand absent');return {address:{acquisition:occurrence(r!.a[1],1125n),unit:'episode'},view:0};};
  const trials:PositionPairTrial[]=groups.map(g=>{if(g.kind!=='Grouped')return fail('group');return {motion:{kind:'RetainedPositionPair',start:address(g.startExperience),end:address(g.endExperience)},before:{kind:'Retained',...address(g.beforeExperience)},after:{kind:'Retained',...address(g.afterExperience)}};});
  const focalTrial=groups.findIndex(g=>g.kind==='Grouped'&&g.afterExperience===focal!.consequence);if(focalTrial<0)return null;
  const memory=rows.map(r=>({id:occurrence(r.a[1],1125n),acquiredAt:time(r.a[5]),kind:r.kind,units:[{key:'episode',views:[enc(r.episode)],useProtection:false}]}));
  const project:Parameters<typeof prepareFocalPositionPairAttributionUse>[1]=<K extends 'motion'|'before'|'after'>(bytes:Uint8Array,field:K)=>{if(field==='motion')return fail('body projection field');const a=items(decodeEmbodied(bytes),'list');if(txt(a[0])!==EPISODE)fail('body projection');const interval=rec(f(rec(a[2],461n),5n),462n);return {lower:exact(f(interval,1n)),upper:exact(f(interval,2n))} as AttributionTrial[K];};
  return [{memory,now:at,admitted:memory.map(m=>({acquisition:m.id,unit:'episode'})),trials,focalTrial},project,bytes=>{const a=validatePositionEpisode(decodeEmbodied(bytes)),o=items(a[2],'list'),v=items(o[4],'list');return {at:time(o[1]),position:[Number(uint(v[1])),Number(uint(v[2]))]};}];
 });
 try{return list([text(RETAINED_ATTRIBUTION),signed(at),cues[0]??list([]),list(groups.map(meaningValue)),meaningValue(produceAttributionResult(view,allocate))]);}finally{closeAttributionProduction(view);}
}
