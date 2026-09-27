/** Six-signal canonical-source extension under multisource-public/0.1-candidate.
 * No old receiving ancestry is fabricated. */
import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ZERO,ONE,absolute,bounded,readQ,qValue,distributionValue} from '../campaign2/cognitiveMath';
import {multisourceRecord as r} from './multisourcePublicCodecs';
const min=(a:Q,b:Q)=>a.compare(b)<0?a:b,max=(a:Q,b:Q)=>a.compare(b)>0?a:b;
function overlap(a:ReadonlyMap<string,Q>,b:ReadonlyMap<string,Q>){let intersection=ZERO,union=ZERO;for(const k of new Set([...a.keys(),...b.keys()])){intersection=intersection.add(min(a.get(k)??ZERO,b.get(k)??ZERO));union=union.add(max(a.get(k)??ZERO,b.get(k)??ZERO));}return union.equals(ZERO)?ZERO:intersection.divide(union);}
export function multisourceCoverage(signals:readonly CanonicalValue[],law:bigint){
 if(signals.length>6||law<1n||law>5n)throw Error('MULTISOURCE_COVERAGE_DOMAIN');
 const seen=new Set<string>();
 const rows=signals.map(v=>{const s=rec(v,721n),source=rec(f(s,1n),720n),basisValue=f(rec(f(s,3n),400n),1n);if(typeof basisValue==='boolean'||basisValue.kind!=='map')throw Error('MULTISOURCE_BASIS');
  if(seen.has(key(source)))throw Error('MULTISOURCE_DUPLICATE_SOURCE');seen.add(key(source));
  const basis=new Map(basisValue.entries.map(([k,v])=>[key(k),readQ(v)]));if([...basis.values()].some(v=>v.compare(ZERO)<=0||v.compare(ONE)>0))throw Error('MULTISOURCE_BASIS_WEIGHT');
  const strength=readQ(f(s,2n));if(strength.equals(ZERO)||absolute(strength).compare(ONE)>0)throw Error('MULTISOURCE_STRENGTH');
  if(law===5n&&uint(f(source,3n))!==1n)throw Error('MULTISOURCE_DESCRIPTION_DICE_BASE_ONLY');
  return {source,option:f(source,1n),ground:f(source,2n),role:uint(f(source,3n)),family:uint(f(rec(f(source,2n),494n),1n)),basis,strength};
 });
 const families=new Map<string,Set<bigint>>();
 for(const s of rows)for(const atom of s.basis.keys()){const k=key(s.option)+'/'+atom,values=families.get(k)??new Set<bigint>();values.add(s.family);families.set(k,values);}
 const groups=new Map<string,typeof rows>();for(const s of rows){const k=key(list([s.option,s.ground,...(law===5n?[s.source]:[])])),g=groups.get(k)??[];g.push(s);groups.set(k,g);}
 return [...groups].sort(([a],[b])=>a<b?-1:1).map(([,group])=>{
  const witnesses:CanonicalValue[]=[];const totals=[1n,2n].map(role=>{let net=ZERO;
   for(const sign of [1,-1]){const sorted=group.filter(s=>s.role===role&&s.strength.compare(ZERO)===sign).map(s=>{
    const normalization=law===4n&&s.basis.size?[...s.basis].reduce((sum,[atom,w])=>sum.add(w.divide(Q.of(BigInt(families.get(key(s.option)+'/'+atom)!.size)))),ZERO).divide([...s.basis.values()].reduce((a,b)=>a.add(b),ZERO)):ONE;
    return {...s,normalization,magnitude:absolute(s.strength),scaled:absolute(s.strength).multiply(normalization)};
   }).sort((a,b)=>b.scaled.compare(a.scaled)||(key(a.source)<key(b.source)?-1:1));
   const aggregate=new Map<string,Q>(),prior:Map<string,Q>[]=[];
   for(const s of sorted){const shared=law===3n||law===5n?ZERO:law===2n?prior.reduce((a,b)=>max(a,overlap(s.basis,b)),ZERO):overlap(s.basis,aggregate),effective=s.scaled.multiply(ONE.subtract(shared));
    net=net.add(effective.multiply(Q.of(BigInt(sign))));witnesses.push(r(723,[s.source,qValue(s.magnitude),qValue(s.normalization),qValue(shared),qValue(effective)]));
    for(const [atom,weight] of s.basis)aggregate.set(atom,max(weight,aggregate.get(atom)??ZERO));prior.push(s.basis);
   }
  }return {net,bounded:bounded(net)};});
  return {option:group[0].option,ground:group[0].ground,description:law===5n?group[0].source.fields.get(5n):undefined,base:totals[0].bounded,situation:totals[1].bounded,meaning:bounded(totals[0].net.add(totals[1].net)),witnesses};
 });
}
export function multisourceReasonStage(occurrence:CanonicalValue,raw:CanonicalValue,dice:CanonicalValue,law:bigint){
 const context=rec(raw,722n),d=rec(dice,437n),bands=rec(f(d,1n),438n),threshold=readQ(f(d,2n)),modifierDef=rec(f(d,4n),439n);
 const nuclei:CanonicalValue[]=[];
 for(const g of multisourceCoverage(items(f(context,3n),'list'),law)){
  if(g.base.equals(ZERO))continue;const relevance=absolute(g.base).add(absolute(g.situation));if(relevance.compare(threshold)<0)continue;
  let die=4n;for(let i=1;i<=5;i++)if(absolute(g.base).compare(readQ(f(bands,BigInt(i))))>=0)die=[4n,6n,8n,10n,12n][i-1];
  const divided=g.situation.divide(readQ(f(modifierDef,1n))),unclipped=divided.numerator/divided.denominator,cap=uint(f(modifierDef,2n)),modifier=unclipped>cap?cap:unclipped< -cap?-cap:unclipped,sign=g.base.compare(ZERO)>0?1n:-1n;
  const nk=r(724,[g.option,g.ground,u(sign>0n?1:2),...(g.description?[g.description]:[])]),distribution=new Map<bigint,Q>();for(let face=1n;face<=die;face++)distribution.set(sign*(face+modifier),Q.of(1n,die));
  nuclei.push(r(725,[nk,qValue(g.base),qValue(g.situation),qValue(relevance),u(die),signed(modifier),f(rec(distributionValue(distribution),424n),1n),list(g.witnesses)]));
 }
 nuclei.sort((a,b)=>key(f(rec(a,725n),1n))<key(f(rec(b,725n),1n))?-1:1);
 return r(726,[occurrence,raw,list(nuclei)]);
}
