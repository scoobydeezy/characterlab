/** Prior derived affect, original event ranking/publication, same episodic owner. */
import {list,text,unsigned,signed,canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataItems as items,dataKey as key,dataText as txt,dataUnsigned as uint,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {affectRetrievalGain,type Carry} from '../campaign3/affectRetrieval';
import {prepareEventRecollections,publishRecollections,takeEventPresentation} from '../campaign3/recollectionProduction';
import {BODY_OBSERVER} from './body';
import {REAPPRAISAL_APPRAISAL} from './reappraisal';
export const AFFECT_MEMORY='assembled-affect-memory/0.1',AFFECT_RECALL=AFFECT_MEMORY+'/recall',PRESENTATION=AFFECT_MEMORY+'/presentation';
export const AFFECT_MEMORY_VERSION='assembled-character-affect-memory/0.1-candidate';
const require=(ok:boolean,s:string)=>{if(!ok)invalidModel('affect memory '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),str=(q:Q)=>`${q.numerator}/${q.denominator}`;
export function compileAffectMemory(v:CanonicalValue,targets:readonly CanonicalValue[],capacity:number){
 const a=items(v,'list');require(a.length===3&&txt(a[0])===AFFECT_MEMORY&&['UncontrolledGain','NoFeedback'].includes(txt(a[1]))&&capacity<=32,'declaration/domain');
 const rows=items(a[2],'list');require(rows.length<=8,'edge capacity');const seen=new Set<string>(),sums=new Map<string,Q>();
 const edges=rows.map(v=>{const e=items(v,'list');require(e.length===5&&targets.some(t=>eq(t,e[0]))&&[1n,2n].includes(uint(e[1]))&&!eq(e[2],e[3])&&[2,3].every(i=>uint(e[i])>=1n&&uint(e[i])<=8n),'edge reference');const w=readQ(e[4]);require(w.compare(Q.of(0n))>=0&&w.compare(Q.of(1n))<=0,'weight');const k=key(list(e.slice(0,4))),row=key(list(e.slice(0,3)));require(!seen.has(k),'duplicate edge');seen.add(k);const sum=(sums.get(row)??Q.of(0n)).add(w);require(sum.compare(Q.of(1n))<=0,'row sum');sums.set(row,sum);return {target:e[0],kind:e[1],from:e[2],to:e[3],weight:w};});
 return {law:txt(a[1]) as 'UncontrolledGain'|'NoFeedback',edges};
}
export type AffectMemory=ReturnType<typeof compileAffectMemory>;
export interface CompletedAffect {report:CanonicalValue;event:bigint}
export const affectCue=(cue:CanonicalValue,source:CompletedAffect|undefined)=>list([text(AFFECT_MEMORY),cue,source?.report??list([]),source?unsigned(source.event):list([])]);
export function unpackAffectCue(v:CanonicalValue,at:bigint){
 const a=items(v,'list');require(a.length===4&&txt(a[0])===AFFECT_MEMORY,'cue');const c=items(a[1],'list');require(c.length===5&&txt(c[0])==='assembled-social-episode/0.1','receipt');const r=items(a[2],'list');let carry:Carry|null=null;
 if(r.length){require(r.length===7&&txt(r[0])===REAPPRAISAL_APPRAISAL&&uint(r[1])<at&&['Known','Unavailable'].includes(txt(r[5])),'prior affect');uint(a[3]);const coords=items(r[6],'list');require(coords.length===(txt(r[5])==='Known'?2:0),'coordinates');carry={at:Number(uint(r[1])),status:txt(r[5]) as Carry['status'],exposure:coords.length?str(readQ(coords[0])):null,uncontrolled:coords.length?str(readQ(coords[1])):null};}else require(items(a[3],'list').length===0,'absent source');
 return {cue:a[1],carry,source:r.length?uint(a[3]):undefined};
}
export function presentationTimes(v:CanonicalValue,acquired:bigint){let last=acquired;const times=items(v,'list');require(times.length<=32,'publication capacity');return times.map(t=>{require(typeof t!=='boolean'&&t.kind==='signed'&&t.value>last,'publication order');last=(t as {value:bigint}).value;return last;});}
export function assertPresentationUpdate(before:CanonicalValue,after:CanonicalValue){const a=items(before,'list'),b=items(after,'list');require([6,7].includes(a.length)&&b.length===a.length&&txt(a[0])==='assembled-social-episode/0.1'&&a.every((v,i)=>i===4||eq(v,b[i])),'immutable episode content');const old=items(a[4],'list'),next=items(b[4],'list');require(next.length===old.length+1&&old.every((v,i)=>eq(v,next[i])),'append one actual presentation');}
export function rankAffectMemories(config:AffectMemory,C:CanonicalValue,payload:CanonicalValue,at:bigint,slots:number,episodes:readonly CanonicalValue[],allocate:()=>bigint){
 const prior=unpackAffectCue(payload,at),gain=affectRetrievalGain(prior.carry,Number(at),config.law),cue=items(prior.cue,'list'),records=new Map<bigint,CanonicalValue>();
 const receipt=(target:CanonicalValue,kind:CanonicalValue,n:CanonicalValue)=>list([text('assembled-social-episode/0.1'),C,target,kind,n]);
 const memory=episodes.filter(v=>{const o=items(items(v,'list')[2],'list');return eq(o[2],cue[2])&&eq(o[4],cue[3]);}).map(v=>{const a=items(v,'list'),o=items(a[2],'list'),acquired=a[5];require(typeof acquired!=='boolean'&&acquired.kind==='signed'&&acquired.value<at,'prior episode');const n=uint(id(a[1]).payload);records.set(n,v);return {id:n,acquiredAt:(acquired as {value:bigint}).value,units:[{key:receipt(o[2],o[4],o[5]),views:[enc(v)]}]};});
 const edges=config.edges.filter(e=>eq(e.target,cue[2])&&eq(e.kind,cue[3])),keys:CanonicalValue[]=[];for(const e of edges)for(const k of [receipt(e.target,e.kind,e.from),receipt(e.target,e.kind,e.to)])if(!keys.some(x=>eq(x,k)))keys.push(k);
 const weights=keys.map(a=>keys.map(b=>edges.find(e=>eq(a,receipt(e.target,e.kind,e.from))&&eq(b,receipt(e.target,e.kind,e.to)))?.weight??Q.of(0n)));
 const prepared=prepareEventRecollections({observer:key(BODY_OBSERVER),character:key(C)},{kind:'Present',key:prior.cue},at,{beta:Q.of(1n,2n),scale:1000n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:gain,k:slots},()=>({memory,graph:{keys,weights},presentations:new Map(memory.map(m=>[m.id,presentationTimes(items(records.get(m.id)!,'list')[4],m.acquiredAt)]))}));
 const publication=publishRecollections(prepared.view,allocate),batch=takeEventPresentation(publication),selected=batch.presentations.map(p=>records.get(p.acquisition)!);
 require(batch.observer===key(BODY_OBSERVER)&&batch.character===key(C)&&batch.at===at,'publication subject/time');
 const updates=selected.map(v=>{const a=[...items(v,'list')];a[4]=list([...items(a[4],'list'),signed(at)]);return list(a);});
 const audit=list([text(AFFECT_RECALL),signed(at),payload,qValue(gain),list(prepared.evaluation.scores.map(s=>list([unsigned(s.acquisition),qValue(s.base),qValue(s.pull),qValue(s.score)]))),list(batch.presentations.map(p=>list([unsigned(p.acquisition),unsigned(p.recollection)]))),list([BODY_OBSERVER,C])]);
 return {selected,updates,audit};
}
