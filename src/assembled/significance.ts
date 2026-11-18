/** Actual focal goal/attribution join; metadata remains on the existing episode. */
import {list,text,signed,canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataText as txt,dataKey as key,dataRecord as rec,dataField as f,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {SchedulerContractError} from '../substrate/scheduler';
import {applyQualifiedSignificance,type SignificanceDirection} from '../campaign3/directionalSignificanceState';
import {EPISODE,POSITION_EPISODE,validatePositionEpisode} from './memory';
import {RETAINED_ATTRIBUTION,validateAttributionCue} from './retainedAttribution';
import {BODY_OBSERVER} from './body';
export const SIGNIFICANCE='assembled-outcome-significance/0.1',SIGNIFICANCE_VERSION='assembled-character-significance/0.1-candidate';
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','significance '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
export const named=(v:CanonicalValue,k:string)=>{const rows=items(v,'list').filter(x=>eq(items(x,'list')[0],text(k)));if(rows.length!==1)return fail('named field '+k);return items(rows[0],'list')[1];};
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n)return fail('time');return v.value;};
export function compileSignificance(v:CanonicalValue){if(!eq(v,list([text(SIGNIFICANCE)])))fail('declaration');}
export function directions(v:CanonicalValue):SignificanceDirection[]{const a=items(v,'list').map(txt),order=['MovingCloser','MovingFarther'];if(a.length>2||new Set(a).size!==a.length||a.some(x=>!order.includes(x))||a.some((x,i)=>i>0&&order.indexOf(x)<order.indexOf(a[i-1])))fail('direction set');return a as SignificanceDirection[];}
export function assertSignificanceUpdate(before:CanonicalValue,after:CanonicalValue){const a=validatePositionEpisode(before),b=validatePositionEpisode(after);if(![8,9,10,11].includes(a.length)||b.length!==a.length||a.slice(8).some((v,i)=>!eq(v,b[i+8]))||a.slice(0,7).some((v,i)=>!eq(v,b[i]))||directions(a[7]).some(d=>!directions(b[7]).includes(d)))fail('immutable episode/monotonic directions');}
function context(workspace:CanonicalValue,attribution:CanonicalValue){
 const w=items(workspace,'list'),a=items(attribution,'list'),C=f(rec(w[3],381n),2n),at=time(w[1]);
 if(a.length!==5||txt(a[0])!==RETAINED_ATTRIBUTION||time(a[1])!==at)fail('current attribution');
 if(!items(a[2],'list').length)return {w,a,C,at,group:undefined};
 const focal=validateAttributionCue(a[2],C,at),groups=items(a[3],'list').filter(g=>txt(named(g,'kind'))==='Grouped'&&time(named(g,'afterExperience'))===focal.consequence);
 if(groups.length>1)fail('ambiguous focal group');return {w,a,C,at,group:groups[0]};
}
export function focalBodyPair(workspace:CanonicalValue,attribution:CanonicalValue){const {w,group}=context(workspace,attribution);if(!group)return [];
 const selected=items(w[4],'list'),pair=['beforeExperience','afterExperience'].map(k=>selected.filter(v=>{const e=items(items(v,'list')[1],'list');return txt(e[0])===EPISODE&&eq(signed(uint(id(f(rec(e[3],227n),1n)).payload)),named(group,k));}));
 return pair.every(p=>p.length===1)?pair.map(p=>p[0]):[];
}
/** Caller supplies only the real phase50 report and real phase40 result from this instant. */
export function qualifiedSignificance(workspace:CanonicalValue,attribution:CanonicalValue,meaning:CanonicalValue){
 const {w,a,C,at,group}=context(workspace,attribution),m=items(meaning,'list');
 if(m.length!==8||!eq(m[1],signed(at))||!eq(m[3],workspace)||!eq(m[7],attribution))fail('goal/attribution join');
 if(!items(a[2],'list').length)return [];
 if(!eq(m[4],list(focalBodyPair(workspace,attribution))))fail('focal goal pair');
 if(!group||txt(named(a[4],'kind'))!=='Result')return [];
 const r=named(a[4],'result');
 if(!eq(named(r,'at'),signed(at))||!eq(named(r,'character'),text(key(C)))||!eq(named(r,'observer'),text(txt(BODY_OBSERVER.payload)))||!eq(named(r,'consequence'),named(group,'afterExperience'))||txt(named(r,'transformationVersion'))!=='attribution-production/0.1-candidate')fail('result subject/focus');
 if(txt(named(r,'disposition'))!=='Supported'||txt(named(m[5],'kind'))!=='Qualifies')return [];
 const direction=txt(named(m[5],'direction')) as SignificanceDirection;if(!['MovingCloser','MovingFarther'].includes(direction))fail('qualification direction');
 const targets=items(named(r,'targets'),'list'),consumed=items(named(r,'consumed'),'list');if(targets.length!==1||!consumed.some(c=>eq(c,targets[0])))fail('attributed child');
 const candidates=items(w[4],'list').map(v=>items(v,'list')[1]).filter(v=>{const e=items(v,'list');return txt(e[0])===POSITION_EPISODE&&eq(signed(uint(id(e[1]).payload)),named(targets[0],'acquisition'));});
 if(candidates.length!==1||txt(named(targets[0],'unit'))!=='episode')fail('selected target');
 const episode=candidates[0],e=validatePositionEpisode(episode);if(![8,9,10,11].includes(e.length)||time(e[5])>=at||!eq(signed(uint(id(f(rec(e[3],227n),1n)).payload)),named(group,'endExperience')))fail('focal end');
 return [{episode,direction}];
}
export function creditSignificance(episode:CanonicalValue,direction:SignificanceDirection,C:CanonicalValue,at:bigint){
 const a=validatePositionEpisode(episode);if(![8,9,10,11].includes(a.length)||time(a[5])>=at)fail('prior versioned episode');
 const acquisition=uint(id(a[1]).payload),observer=txt(BODY_OBSERVER.payload),character='holder';
 // The exact canonical holder was checked in qualifiedSignificance and the state key.
 // Original algebra accepts short local symbols; this adapter has one scoped holder.
 if(id(C).namespaceId!==1002n)fail('character namespace');
 const memory=[{id:acquisition,acquiredAt:time(a[5]),kind:'EventContinuant' as const,units:[{key:'episode',views:[enc(list(a.slice(0,7)))],useProtection:false,outcomeSignificanceDirections:directions(a[7])}]}];
 const result=applyQualifiedSignificance({observer,character,memory},[{observer,character,direction,targets:[{acquisition,unit:'episode'}]}],at),next=list([...a.slice(0,7),list(result[0].units[0].outcomeSignificanceDirections.map(text)),...a.slice(8)]);assertSignificanceUpdate(episode,next);return next;
}
