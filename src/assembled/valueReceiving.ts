import {receivingRecord as rec} from './codecs';
/** One genuine Value ground, using the shared reason and arbitration path. */
import {list,set,map,text,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataItems as items,dataField as f,dataKey as key,dataUnsigned as uint,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {absolute,readQ,qValue,compileReasonNuclei} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r} from './codecs';
import {compileAssembledReasons} from './reasons';
import {VALUES_APPRAISAL,VALUES,valuesState,type Values} from './values';
import {sid} from './skill';
export const VALUE_RECEIVING='assembled-character-value-receiving/0.1-candidate',VALUE_MOTIVE='assembled-value-motive/0.1';
export function jointValue(value:Q,need:Q,mode:'Joint'|'ValuesOnly'|'NeedOnly'='Joint'){
 if(!['Joint','ValuesOnly','NeedOnly'].includes(mode)||[value,need].some(v=>absolute(v).compare(Q.of(1n))>0)||value.numerator*need.numerator<0n)invalidModel('Value receiver aligned unit domain');
 return mode==='NeedOnly'?need:mode==='Joint'&&absolute(need).compare(absolute(value))>0?need:value;
}
export const VALUE_PROVENANCE='assembled-character-value-receiving/0.2-candidate',VALUE_MOTIVE_PROVENANCE='assembled-value-motive/0.2';
/** Exact prior learned observations, not a claim of statistical independence. */
function receiptSupport(appraisal:CanonicalValue,task:CanonicalValue,receipts:readonly CanonicalValue[]){
 const a=items(appraisal,'list');if(a.length!==12||key(a[0])!==key(text(VALUES_APPRAISAL))||receipts.length>8||receipts.length>Number(uint(a[11])))invalidModel('Value support appraisal');
 let last=0n,sum=0n;const seen=new Set<string>();
 for(const receipt of receipts){const x=items(receipt,'list');if(x.length!==2||x[1]!==true)invalidModel('Value support linked receipt');
  const o=items(x[0],'list');if(o.length!==8||key(o[0])!==key(text('assembled-performance-observation/0.1'))||key(o[3])!==key(task)||typeof o[6]!=='boolean'||typeof o[7]!=='boolean')invalidModel('Value support observation');
  const occurrence=id(o[1]),at=uint(o[2]);if(occurrence.namespaceId!==1164n||uint(occurrence.payload)<=0n||at<=last||at>=uint(a[2])||seen.has(key(o[1])))invalidModel('Value support identity/time');
  last=at;seen.add(key(o[1]));sum+=o[6]===true?1n:-1n;
 }
 if(!Q.of(sum,BigInt(receipts.length)+1n).equals(readQ(a[5])))invalidModel('Value support fold');
 return receipts.map(v=>items(items(v,'list')[0],'list')[1]);
}
export function valueMotive(appraisal:CanonicalValue,config:Values,support?:readonly CanonicalValue[]){
 const a=items(appraisal,'list');if(a.length!==12||key(a[0])!==key(text(VALUES_APPRAISAL))||typeof a[3]!=='boolean')invalidModel('generated Value appraisal required');
 const prior=readQ(a[5]),effective=jointValue(a[3]?prior:Q.of(0n),Q.of(0n)),route=config.routes.find(r=>key(r.task)===key(config.task))!;
 if(support){if(support.length)valuesState(list([text(VALUES),list(support),qValue(prior)]),config);receiptSupport(appraisal,config.task,support);}
 return list([text(support?VALUE_MOTIVE_PROVENANCE:VALUE_MOTIVE),config.task,route.plans[Number(config.route)].actionId,a[3],qValue(prior),list([]),qValue(effective),appraisal,...(support?[list(support)]:[])]);
}
export function valueRaw(input:CanonicalValue,motive:CanonicalValue){
 const raw=rec(input,403n),m=items(motive,'list');const cited=m.length===9&&key(m[0])===key(text(VALUE_MOTIVE_PROVENANCE));
 if(m.length!==(cited?9:8)||!cited&&key(m[0])!==key(text(VALUE_MOTIVE))||items(m[5],'list').length)invalidModel('Value motive domain');
 const supports=cited?receiptSupport(m[7],m[1],items(m[8],'list')):[];
 if(cited){const a=items(m[7],'list');if(key(a[3])!==key(m[3])||key(a[5])!==key(m[4])||key(qValue(jointValue(m[3]===true?readQ(m[4]):Q.of(0n),Q.of(0n))))!==key(m[6]))invalidModel('Value motive association');}
 const effective=readQ(m[6]),signals:CanonicalValue[]=[];
 for(const option of items(f(rec(f(raw,2n),398n),3n),'list')){const o=rec(option,397n),candidate=rec(f(o,1n),395n);if(key(f(candidate,2n))!==key(m[2])||!items(f(o,2n),'set').some(v=>key(f(rec(v,396n),1n))===key(m[1])))continue;
  if(effective.numerator!==0n)signals.push(r(402,[r(401,[candidate,m[1],unsigned(1)]),qValue(effective),r(400,[map(supports.map(receipt=>[r(399,[unsigned(3),receipt],2),q(1,1)]))])]));
 }
 if(signals.length>1)invalidModel('Value source multiplicity');
 return r(403,[f(raw,1n),f(raw,2n),f(raw,3n),f(raw,4n),set(signals)],2);
}
export function valueReasons(raw:CanonicalValue,definition:CanonicalValue,maxDomain=3){
 const context=rec(raw,403n);if(context.schema.schemaVersion!==2n)invalidModel('Value source context version');
 const goals=compileAssembledReasons(items(f(context,3n),'set'),definition,maxDomain),signals=items(f(context,5n),'set');
 const modifier=r(439,[q(1,1),unsigned(3)]),valueDice=r(437,[r(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),modifier,modifier]);
 const values=compileReasonNuclei(signals,valueDice).map(v=>{const n=rec(v,407n),k=rec(f(n,1n),404n);return r(407,[r(404,[f(k,1n),sid(1040,'Value'),f(k,3n),f(k,4n)],2),...Array.from({length:6},(_,i)=>f(n,BigInt(i+2)))]);});
 return [...goals,...values].sort((a,b)=>key(f(rec(a,407n),1n))<key(f(rec(b,407n),1n))?-1:1);
}
