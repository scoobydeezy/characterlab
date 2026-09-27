/** Accepted embodied receiving character-side transformations. No state, world,
 * registry, execution permission, or truth capability enters these operands. */
import {canonicalEncode as enc,list,set,map,record,unsigned as u,signed,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {receivingRecord as r,receivingSchema,decodeReceiving} from './receivingCodecs';
import {ZERO,ONE,absolute,bounded,readQ,qValue,distributionValue,choiceAlignment} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
const raw=(type:number,fields:Record<number,CanonicalValue>)=>decodeReceiving(enc(record(receivingSchema(BigInt(type)),new Map(Object.entries(fields).map(([n,v])=>[BigInt(n),v])))));
const pairs=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='map')return fail('map required');return v.entries;};
const sorted=(xs:CanonicalValue[])=>xs.sort((a,b)=>key(a)<key(b)?-1:key(a)>key(b)?1:0);
const id=(ns:number,value:string)=>typedIdentifier(ns,text(value));
export interface AdoptedBodyInstruction {readonly instructionId:CanonicalValue;readonly pressureDefinitionId:CanonicalValue;readonly actionId:CanonicalValue;}
export function bodyOptionsOutput(occurrence:CanonicalValue,pressure:CanonicalValue,pressureDefinition:CanonicalValue,readAdopted:()=>readonly AdoptedBodyInstruction[]){
 const p=rec(pressure,464n),result=rec(f(p,4n),481n),active=uint(f(result,1n))===1n&&readQ(f(result,2n)).compare(ZERO)>0;
 const adopted=active?[...readAdopted()]:[];if(adopted.length>2||new Set(adopted.map(v=>key(v.instructionId))).size!==adopted.length)fail('adopted body instruction cardinality');
 const origins=adopted.map(v=>{if(key(v.pressureDefinitionId)!==key(pressureDefinition))fail('instruction pressure binding mismatch');return r(488,[r(395,[f(p,2n),v.actionId]),v.instructionId]);});
 return r(489,[occurrence,pressure,list(sorted(origins))]);
}
export function mixedCandidateOutput(occurrence:CanonicalValue,join:CanonicalValue){
 const j=rec(join,491n),task=rec(f(j,1n),398n),body=rec(f(j,2n),489n),subject=f(rec(f(body,2n),464n),2n);
 const candidates=new Map<string,{candidate:CanonicalValue;task:CanonicalValue[];body:CanonicalValue[]}>();
 function add(candidate:CanonicalValue,kind:'task'|'body',origins:readonly CanonicalValue[]){if(key(f(rec(candidate,395n),1n))!==key(subject))fail('mixed candidate subject');const k=key(candidate),entry=candidates.get(k)??{candidate,task:[],body:[]};entry[kind].push(...origins);candidates.set(k,entry);}
 for(const v of items(f(task,3n),'list')){const x=rec(v,397n);add(f(x,1n),'task',items(f(x,2n),'set'));}
 for(const v of items(f(body,3n),'list')){const x=rec(v,488n);add(f(x,1n),'body',[f(x,2n)]);}
 return r(492,[occurrence,join,list([...candidates].sort(([a],[b])=>a<b?-1:1).map(([,x])=>r(490,[x.candidate,set(x.task),set(x.body)])))]);
}
/** New source-key grammar, same exact aggregate-coverage law. The declared
 * competing receiver bypasses coverage explicitly; it is never a reference flag. */
function coveredRole(signals:readonly CanonicalValue[],law:'aggregate'|'no-coverage'){
 const trace:CanonicalValue[]=[];let net=ZERO;
 for(const sign of [1,-1]){
  const xs=signals.map(v=>{const x=rec(v,496n);return {source:f(x,1n),strength:readQ(f(x,2n)),basis:pairs(f(rec(f(x,3n),400n),1n))};}).filter(x=>x.strength.compare(ZERO)===sign).sort((a,b)=>absolute(b.strength).compare(absolute(a.strength))||(key(a.source)<key(b.source)?-1:1));
  const aggregate=new Map<string,Q>();
  for(const x of xs){const weights=new Map(x.basis.map(([k,v])=>[key(k),readQ(v)]));if([...weights.values()].some(w=>w.compare(ZERO)<=0))fail('positive evidence weight required');let intersection=ZERO,union=ZERO;
   for(const k of new Set([...weights.keys(),...aggregate.keys()])){const a=weights.get(k)??ZERO,b=aggregate.get(k)??ZERO;intersection=intersection.add(a.compare(b)<0?a:b);union=union.add(a.compare(b)>0?a:b);}
   const overlap=law==='no-coverage'||union.equals(ZERO)?ZERO:intersection.divide(union),independence=ONE.subtract(overlap),magnitude=absolute(x.strength),effective=magnitude.multiply(independence);
   net=net.add(effective.multiply(Q.of(BigInt(sign))));trace.push(r(500,[x.source,qValue(magnitude),qValue(overlap),qValue(independence),qValue(effective)]));
   for(const [k,w] of weights)if(w.compare(aggregate.get(k)??ZERO)>0)aggregate.set(k,w);
  }
 }
 return {net:bounded(net),trace};
}
/** Numerical control surface only. It grants no admitted producer, model or
 * instruction authority. Public singleton support remains narrower. */
export function receivingCoverageComponent(signals:readonly CanonicalValue[]){
 if(signals.length>5)fail('coverage component bound');
 return coveredRole(signals.map(v=>decodeReceiving(enc(rec(v,496n)))),'aggregate');
}
function rawOutput(occurrence:CanonicalValue,join:CanonicalValue,pressureDefinition:CanonicalValue,law:'aggregate'|'no-coverage'){
 const j=rec(join,498n),mixed=rec(f(j,1n),492n),candidateJoin=rec(f(mixed,2n),491n),task=rec(f(j,2n),403n),body=rec(f(candidateJoin,2n),489n),pressure=rec(f(body,2n),464n);
 if(key(f(task,2n))!==key(f(candidateJoin,1n)))fail('actual task candidate source mismatch');
 const options=items(f(mixed,3n),'list').map(v=>f(rec(v,490n),1n)),signals:CanonicalValue[]=[],grounds=new Map<string,CanonicalValue>();
 const taskOptions=rec(f(candidateJoin,1n),398n);
 for(const v of items(f(taskOptions,3n),'list'))for(const o of items(f(rec(v,397n),2n),'set')){const g=raw(494,{1:u(1),2:f(rec(o,396n),1n)});grounds.set(key(g),g);}
 for(const v of items(f(task,3n),'set')){const x=rec(v,402n),source=rec(f(x,1n),401n),g=raw(494,{1:u(1),2:f(source,2n)});grounds.set(key(g),g);signals.push(r(496,[r(495,[f(source,1n),g,f(source,3n)]),f(x,2n),f(x,3n)]));}
 const bodyOrigins=items(f(body,3n),'list');let bodyGround:CanonicalValue|undefined;
 if(bodyOrigins.length){const sample=rec(f(pressure,3n),461n),p=readQ(f(rec(f(pressure,4n),481n),2n));if(p.compare(ZERO)<=0)fail('body source is not positive');
  bodyGround=raw(494,{1:u(2),3:r(493,[f(pressure,2n),pressureDefinition])});grounds.set(key(bodyGround),bodyGround);
  const evidence=raw(237,{1:u(1),2:f(sample,1n)}),basis=r(400,[map([[r(399,[u(1),evidence]),qValue(ONE)]])]);
  for(const v of bodyOrigins){const x=rec(v,488n);signals.push(r(496,[r(495,[f(x,1n),bodyGround,u(1),f(x,2n)]),qValue(p),basis]));}
 }
 const taskMeaning=new Map(pairs(f(task,4n)).map(([k,v])=>[key(k),v]));
 const meanings=[...grounds].sort(([a],[b])=>a<b?-1:1).map(([,ground])=>r(497,[ground,map(options.map(option=>{
  const meaning=uint(f(rec(ground,494n),1n))===1n?taskMeaning.get(key(option))??qValue(ZERO):qValue(coveredRole(signals.filter(v=>{const s=rec(f(rec(v,496n),1n),495n);return key(f(s,1n))===key(option)&&key(f(s,2n))===key(ground)&&uint(f(s,3n))!==3n;}),law).net);return [option,meaning] as const;
 }))]));
 return r(499,[occurrence,join,set(signals),list(meanings)]);
}
export const mixedRawOutput=(occurrence:CanonicalValue,join:CanonicalValue,pressureDefinition:CanonicalValue)=>rawOutput(occurrence,join,pressureDefinition,'aggregate');
export const noCoverageMixedRawOutput=(occurrence:CanonicalValue,join:CanonicalValue,pressureDefinition:CanonicalValue)=>rawOutput(occurrence,join,pressureDefinition,'no-coverage');
function reasonOutput(occurrence:CanonicalValue,input:CanonicalValue,definition:CanonicalValue,law:'aggregate'|'no-coverage'){
 const context=rec(input,499n),d=rec(definition,437n),bands=rec(f(d,1n),438n),threshold=readQ(f(d,2n));
 const groups=new Map<string,{candidate:CanonicalValue;ground:CanonicalValue;signals:CanonicalValue[]}>(),seen=new Set<string>();
 for(const v of items(f(context,3n),'set')){const s=rec(f(rec(v,496n),1n),495n),k=key(list([f(s,1n),f(s,2n)]));if(seen.has(key(s)))fail('duplicate mixed raw source');seen.add(key(s));const g=groups.get(k)??{candidate:f(s,1n),ground:f(s,2n),signals:[]};g.signals.push(v);groups.set(k,g);}
 const nuclei:CanonicalValue[]=[];
 const modifier=(value:Q,definition:CanonicalValue)=>{const d=rec(definition,439n),q=value.divide(readQ(f(d,1n))),cap=uint(f(d,2n)),n=q.numerator/q.denominator;return n>cap?cap:n< -cap?-cap:n;};
 for(const g of groups.values()){
  const role=(n:bigint)=>coveredRole(g.signals.filter(v=>uint(f(rec(f(rec(v,496n),1n),495n),3n))===n),law),base=role(1n);if(base.net.equals(ZERO))continue;
  const standing=role(3n),situation=role(2n),relevance=absolute(base.net).add(absolute(standing.net)).add(absolute(situation.net));if(relevance.compare(threshold)<0)continue;
  let die=4n;for(let i=1;i<=5;i++)if(absolute(base.net).compare(readQ(f(bands,BigInt(i))))>=0)die=[4n,6n,8n,10n,12n][i-1];
  const h=modifier(standing.net,f(d,3n)),x=modifier(situation.net,f(d,4n)),sign=base.net.compare(ZERO)>0?1n:-1n,dist=new Map<bigint,Q>();for(let face=1n;face<=die;face++)dist.set(sign*(face+h+x),Q.of(1n,die));
  const body=uint(f(rec(g.ground,494n),1n))===2n,nk=r(502,[g.candidate,g.ground,id(1040,body?'EmbodiedFuelDeficit':'Commitment'),u(sign>0?1:2)]);
  nuclei.push(r(503,[nk,r(501,[qValue(base.net),qValue(standing.net),qValue(situation.net),list([...base.trace,...standing.trace,...situation.trace])]),qValue(relevance),u(die),signed(h),signed(x),distributionValue(dist)]));
 }
 return r(504,[occurrence,input,list(nuclei.sort((a,b)=>key(f(rec(a,503n),1n))<key(f(rec(b,503n),1n))?-1:1))]);
}
export const mixedReasonOutput=(occurrence:CanonicalValue,input:CanonicalValue,definition:CanonicalValue)=>reasonOutput(occurrence,input,definition,'aggregate');
export const noCoverageMixedReasonOutput=(occurrence:CanonicalValue,input:CanonicalValue,definition:CanonicalValue)=>reasonOutput(occurrence,input,definition,'no-coverage');
export function receivingExpressionOutput(occurrence:CanonicalValue,intent:CanonicalValue){const resolution=rec(f(rec(intent,509n),2n),508n),chosen=f(rec(f(rec(f(resolution,4n),507n),2n),506n),1n),context=rec(f(rec(f(resolution,3n),504n),2n),499n);
 const expressions=items(f(context,4n),'list').map(v=>{const g=rec(v,497n),meaning=new Map(pairs(f(g,2n)).map(([k,v])=>[key(k),readQ(v)]));return r(510,[f(g,1n),qValue(choiceAlignment(chosen,meaning))]);});
 return r(511,[occurrence,intent,list(expressions),text('embodied-choice-expression/0.1-candidate')]);
}
