import {LEGACY_TIME_LIMIT,assertTimeLimit,type TimeLimit} from './timeDomain';
/** Adopted L6 event-time formation and one personality contribution to reasons. */
import {list,map,set,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {StatePath} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,dataIdentity as id,dataRecord as rec,dataField as f,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue,choiceAlignment,ZERO,ONE} from '../campaign2/cognitiveMath';
import {developmentalGain} from '../campaign3/developmentComponent';
import {cognitiveRecord as r,cognitiveNamed as named} from './codecs';
export const FORMATION='assembled-formation/0.1',FORMATION_UPDATE=FORMATION+'/update',FORMATION_REASONS=FORMATION+'/reasons',FORMATION_VERSION='assembled-character-formation/0.1-candidate';
export const FORMATION_OWNER=typedIdentifier(1025,text('authority/dispositional-formation'));
export const formationPath=(C:CanonicalValue,channel?:CanonicalValue):StatePath=>({rootStateTypeId:1503n,fieldId:1n,selectors:[{kind:'mapKey',key:channel?list([C,channel]):C}]});
const require=(b:boolean,s:string)=>{if(!b)invalidModel('formation '+s);};
export function compileFormation(v:CanonicalValue){const a=items(v,'list');require(a.length===1&&txt(a[0])===FORMATION,'declaration');}
export function formDisposition(prior:Q,c:Q,phase:number){require(prior.compare(Q.of(-1n,2n))>=0&&prior.compare(Q.of(1n,2n))<=0&&c.compare(Q.of(-1n))>=0&&c.compare(ONE)<=0,'value domain');const gain=developmentalGain('Ramp',phase),candidate=prior.add(c.multiply(gain).divide(Q.of(4n))),after=candidate.compare(Q.of(1n,2n))>0?Q.of(1n,2n):candidate.compare(Q.of(-1n,2n))<0?Q.of(-1n,2n):candidate;return {gain,after,delta:after.subtract(prior)};}
export function formationValue(v:CanonicalValue|undefined,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 if(v===undefined)return {entries:[] as CanonicalValue[],P:ZERO};const a=items(v,'list');require(a.length===3&&txt(a[0])===FORMATION,'state grammar');const entries=[...items(a[1],'list')];require(entries.length>0&&entries.length<=16,'capacity');let P=ZERO,last=0n,phase=0n;const ids=new Set<string>();
 for(const entry of entries){const x=items(entry,'list');require(x.length===6,'entry grammar');const occurrence=id(x[0]),time=uint(x[1]),d=uint(x[3]),c=readQ(x[2]);require(occurrence.namespaceId===1138n&&uint(occurrence.payload)>0n&&!ids.has(key(x[0])),'qualification id');require(time>last&&time<=timeLimit&&d>=phase&&d<=4n&&!c.equals(ZERO),'time/phase/contribution');const result=formDisposition(P,c,Number(d));require(key(qValue(result.gain))===key(x[4])&&key(qValue(result.delta))===key(x[5]),'event-time gain/delta');P=result.after;last=time;phase=d;ids.add(key(x[0]));}
 require(P.equals(readQ(a[2])),'fold');return {entries,P};
}
export function appendFormation(prior:CanonicalValue|undefined,qualification:CanonicalValue,at:bigint,c:Q,phase:number,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);const b=formationValue(prior,timeLimit),result=formDisposition(b.P,c,phase),entry=list([qualification,unsigned(at),qValue(c),unsigned(phase),qValue(result.gain),qValue(result.delta)]),value=list([text(FORMATION),list([...b.entries,entry]),qValue(result.after)]);formationValue(value,timeLimit);return {value,entry,...result};}
/** Same unadapted meaning used by frozen expression; never a new motive or meaning. */
export function formationSignals(raw:CanonicalValue,prior:CanonicalValue|undefined,enabled=true,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 const source=rec(raw,403n),options=rec(f(source,2n),398n),meaning=f(source,4n);require(typeof meaning!=='boolean'&&meaning.kind==='map','meaning map');const semantics=new Map((meaning as Extract<CanonicalValue,{kind:'map'}>).entries.map(([c,v])=>[key(c),readQ(v)])),b=formationValue(prior,timeLimit),signals=[...items(f(source,3n),'set')];require(!signals.some(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===3n),'duplicate old standing');
 const basis=r(400,[map(b.entries.map(v=>[named(399,{VariantTag:unsigned(2),QualificationOccurrenceId:items(v,'list')[0]}),qValue(ONE)]))]),directions:CanonicalValue[]=[];
 for(const v of items(f(options,3n),'list')){const option=rec(v,397n),candidate=f(option,1n),alignment=choiceAlignment(candidate,semantics),strength=enabled?b.P.multiply(alignment):ZERO;directions.push(list([candidate,qValue(alignment),qValue(strength)]));if(!strength.equals(ZERO))for(const origin of items(f(option,2n),'set'))signals.push(r(402,[r(401,[candidate,f(rec(origin,396n),1n),unsigned(3)]),qValue(strength),basis]));}
 return {output:r(403,[f(source,1n),f(source,2n),set(signals),meaning]),report:list([text(FORMATION_REASONS),qValue(b.P),enabled,list(directions),list(b.entries.map(v=>items(v,'list')[0]))])};
}
