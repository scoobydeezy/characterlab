/** Restricted source and compiler operands; no world, archive, RNG or state reader. */
import {list,map,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,readQ,qValue,absolute,bounded,foldIdentityHistory,distributionValue} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {receivingRecord as old} from './receivingCodecs';
import {cognitiveNamed} from '../campaign2/cognitiveCodecs';
import {reasonRecord as r} from './reasonCodecs';
const min=(a:Q,b:Q)=>a.compare(b)<0?a:b,max=(a:Q,b:Q)=>a.compare(b)>0?a:b;
export function reasonRaw(occurrence:CanonicalValue,descriptions:readonly CanonicalValue[],samples:readonly CanonicalValue[],history:CanonicalValue){
 const signals:CanonicalValue[]=[],rejected:CanonicalValue[]=[],contributions=items(f(rec(history,414n),1n),'list'),fold=foldIdentityHistory(contributions,Q.of(1n,100n));
 for(const value of descriptions){const d=rec(value,916n),role=uint(f(d,5n)),gain=readQ(f(d,6n)),channels=items(f(d,7n),'set'),support=channels.map(channel=>samples.find(v=>key(f(rec(v,917n),4n))===key(channel)));
  if(role!==3n&&(channels.length===0||support.some(v=>v===undefined))){rejected.push(r(927,[d,u(1)]));continue;}
  if(role===3n&&contributions.length===0){rejected.push(r(927,[d,u(3)]));continue;}
  const admitted=role===3n?[]:support as CanonicalValue[],strength=gain.multiply(role===3n?fold.strength:admitted.map(v=>readQ(f(rec(v,917n),5n))).reduce(min));
  if(strength.equals(ZERO)){rejected.push(r(927,[d,u(2)]));continue;}
  const atoms=role===3n?contributions.map(v=>cognitiveNamed(399,{VariantTag:u(2),QualificationOccurrenceId:f(rec(v,413n),1n)})):admitted.map(v=>old(399,[u(1),old(237,[u(1),f(rec(v,917n),1n)])]));
  const fields=new Map<bigint,CanonicalValue>([[1n,d],[2n,qValue(strength)],[3n,old(400,[map(atoms.map(atom=>[atom,qValue(ONE)]))])],[4n,list(admitted)]]);if(role===3n)fields.set(5n,history);signals.push(r(919,fields));
 }
 return {output:r(920,[occurrence,list(signals),list(rejected)]),quantizationOperations:descriptions.some(v=>uint(f(rec(v,916n),5n))===3n)?fold.operations:[]};
}
function overlap(a:ReadonlyMap<string,Q>,b:ReadonlyMap<string,Q>){let intersection=ZERO,union=ZERO;for(const k of new Set([...a.keys(),...b.keys()])){intersection=intersection.add(min(a.get(k)??ZERO,b.get(k)??ZERO));union=union.add(max(a.get(k)??ZERO,b.get(k)??ZERO));}return union.equals(ZERO)?ZERO:intersection.divide(union);}
export function compileJoinedReasons(occurrence:CanonicalValue,raw:CanonicalValue,dice:CanonicalValue,law:number){
 if(![1,2,3,4,5].includes(law))throw Error('REASON_LAW');
 const signals=items(f(rec(raw,920n),2n),'list'),seen=new Set<string>();
 const rows=signals.map(value=>{const s=rec(value,919n),d=rec(f(s,1n),916n),id=key(f(d,1n));if(seen.has(id))throw Error('REASON_DUPLICATE_SOURCE');seen.add(id);const b=f(rec(f(s,3n),400n),1n);if(typeof b==='boolean'||b.kind!=='map')throw Error('REASON_BASIS');const strength=readQ(f(s,2n));if(strength.equals(ZERO))throw Error('REASON_ZERO_SIGNAL');return {d,role:Number(uint(f(d,5n))),strength,basis:new Map(b.entries.map(([a,w])=>[key(a),readQ(w)]))};});
 const groups=new Map<string,typeof rows>();
 for(const row of rows){const d=row.d,separate=law===4||law===5&&row.role===3,k=key(list([f(d,2n),...(law===2?[]:[f(d,3n),f(d,4n)]),...(separate?[f(d,1n)]:[])])),group=groups.get(k)??[];group.push(row);groups.set(k,group);}
 const nuclei:CanonicalValue[]=[],rejected:CanonicalValue[]=[],def=rec(dice,437n),bands=rec(f(def,1n),438n),threshold=readQ(f(def,2n));
 for(const [,unsorted] of [...groups].sort(([a],[b])=>a<b?-1:1)){
  const group=[...unsorted].sort((a,b)=>key(f(a.d,1n))<key(f(b.d,1n))?-1:1),first=group[0],witnesses:CanonicalValue[]=[];
  const totals=[1,2,3,4].map(role=>{let net=ZERO;
   for(const sign of [1,-1]){const selected=group.filter(s=>(law===5&&s.role===3?1:s.role)===role&&s.strength.compare(ZERO)===sign).sort((a,b)=>absolute(b.strength).compare(absolute(a.strength))||(key(f(a.d,1n))<key(f(b.d,1n))?-1:1)),aggregate=new Map<string,Q>(),prior:Map<string,Q>[]=[];
    for(const row of selected){const shared=law===4?ZERO:law===3?prior.reduce((v,b)=>max(v,overlap(row.basis,b)),ZERO):overlap(row.basis,aggregate),magnitude=absolute(row.strength),effective=magnitude.multiply(ONE.subtract(shared));net=net.add(effective.multiply(Q.of(BigInt(sign))));witnesses.push(r(921,[row.d,qValue(magnitude),qValue(shared),qValue(effective),u(sign>0?1:2),u(role)]));for(const [atom,weight] of row.basis)aggregate.set(atom,max(weight,aggregate.get(atom)??ZERO));prior.push(row.basis);}
   }return bounded(net);
  });
  const [base,situation,standing,context]=totals,relevance=totals.map(absolute).reduce((a,b)=>a.add(b),ZERO),sign=base.compare(ZERO)<0?-1n:1n,separate=law===4||law===5&&first.role===3,nucleusKey=r(922,[f(first.d,2n),f(first.d,3n),f(first.d,4n),u(sign>0n?1:2),...(separate?[f(first.d,1n)]:[])]);
  if(base.equals(ZERO)||relevance.compare(threshold)<0){rejected.push(r(928,[nucleusKey,u(base.equals(ZERO)?1:2),qValue(relevance),qValue(base),list(witnesses)]));continue;}
  let die=4n;for(let i=1;i<=5;i++)if(absolute(base).compare(readQ(f(bands,BigInt(i))))>=0)die=[4n,6n,8n,10n,12n][i-1];
  const modifier=(value:Q,field:bigint)=>{const d=rec(f(def,field),439n),scaled=value.divide(readQ(f(d,1n))),raw=scaled.numerator/scaled.denominator,cap=uint(f(d,2n));return raw>cap?cap:raw< -cap?-cap:raw;};
  const h=modifier(standing,3n),x=modifier(situation,4n),c=modifier(context,4n),distribution=new Map<bigint,Q>();for(let face=1n;face<=die;face++)distribution.set(sign*(face+h+x+c),Q.of(1n,die));
  nuclei.push(r(923,[nucleusKey,qValue(base),qValue(standing),qValue(situation),qValue(context),qValue(relevance),u(die),signed(h),signed(x),signed(c),distributionValue(distribution),list(witnesses)]));
 }
 return r(924,[occurrence,raw,list(nuclei),list(rejected)]);
}
