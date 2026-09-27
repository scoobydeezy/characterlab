/** multisource-coverage-comparison/0.1-candidate. Numerical experiment only. */
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO, ONE, absolute, bounded} from '../campaign2/cognitiveMath';

export const MULTISOURCE_COMPARISON_VERSION='multisource-coverage-comparison/0.1-candidate';
export type CoverageLaw='GroundAggregate'|'GroundPairwise'|'GroundUncovered'|'FamilyNormalized';
export interface ComparisonSignal {
 readonly source:string;
 readonly ground:string;
 readonly family:'Task'|'Body';
 readonly role:'Base'|'Situation';
 readonly strength:Q;
 readonly basis:readonly (readonly [string,Q])[];
}
const sum=(xs:readonly Q[])=>xs.reduce((a,b)=>a.add(b),ZERO);
const min=(a:Q,b:Q)=>a.compare(b)<0?a:b;
const max=(a:Q,b:Q)=>a.compare(b)>0?a:b;
const label=(s:string)=>typeof s==='string'&&/^[a-zA-Z0-9/_-]{1,80}$/.test(s);
const overlap=(a:ReadonlyMap<string,Q>,b:ReadonlyMap<string,Q>)=>{
 let intersection=ZERO,union=ZERO;
 for(const k of new Set([...a.keys(),...b.keys()])){
  intersection=intersection.add(min(a.get(k)??ZERO,b.get(k)??ZERO));
  union=union.add(max(a.get(k)??ZERO,b.get(k)??ZERO));
 }
 return union.equals(ZERO)?ZERO:intersection.divide(union);
};
export function compareMultisourceCoverage(input:readonly ComparisonSignal[],law:CoverageLaw){
 if(!['GroundAggregate','GroundPairwise','GroundUncovered','FamilyNormalized'].includes(law)||input.length>5)throw Error('comparison domain');
 const sources=new Set<string>(),families=new Map<string,string>();
 const signals=input.map(s=>{
  if(!label(s.source)||!label(s.ground)||sources.has(s.source)||!['Task','Body'].includes(s.family)||!['Base','Situation'].includes(s.role)||!(s.strength instanceof Q)||s.strength.equals(ZERO)||absolute(s.strength).compare(ONE)>0||s.basis.length>4)throw Error('comparison signal');
  sources.add(s.source);
  if(families.has(s.ground)&&families.get(s.ground)!==s.family)throw Error('ground family mismatch');
  families.set(s.ground,s.family);
  const basis=new Map<string,Q>();
  for(const [atom,weight] of s.basis){if(!label(atom)||basis.has(atom)||!(weight instanceof Q)||weight.compare(ZERO)<=0||weight.compare(ONE)>0)throw Error('comparison basis');basis.set(atom,Q.of(weight.numerator,weight.denominator));}
  return {...s,strength:Q.of(s.strength.numerator,s.strength.denominator),basis};
 });
 const atomFamilies=new Map<string,Set<string>>();
 for(const s of signals)for(const atom of s.basis.keys()){const set=atomFamilies.get(atom)??new Set<string>();set.add(s.family);atomFamilies.set(atom,set);}
 const witnesses:{source:string;ground:string;family:string;role:string;sign:number;basis:readonly (readonly [string,Q])[];magnitude:Q;normalization:Q;overlap:Q;effective:Q}[]=[];
 const totals:{ground:string;family:string;base:Q;situation:Q}[]=[];
 for(const ground of [...families.keys()].sort()){
  const roleTotals=new Map<string,Q>();
  for(const role of ['Base','Situation']){
   let net=ZERO;
   for(const sign of [1,-1]){
    const rows=signals.filter(s=>s.ground===ground&&s.role===role&&s.strength.compare(ZERO)===sign).map(s=>{
     const weights=[...s.basis.values()],normalization=law==='FamilyNormalized'&&weights.length?sum([...s.basis].map(([k,w])=>w.divide(Q.of(BigInt(atomFamilies.get(k)!.size))))).divide(sum(weights)):ONE;
     return {...s,magnitude:absolute(s.strength),normalization,scaled:absolute(s.strength).multiply(normalization)};
    }).sort((a,b)=>b.scaled.compare(a.scaled)||(a.source<b.source?-1:1));
    const aggregate=new Map<string,Q>(),prior:Map<string,Q>[]=[];
    for(const s of rows){
     const shared=law==='GroundUncovered'?ZERO:law==='GroundPairwise'?prior.reduce((p,b)=>max(p,overlap(s.basis,b)),ZERO):overlap(s.basis,aggregate);
     const effective=s.scaled.multiply(ONE.subtract(shared));net=net.add(effective.multiply(Q.of(BigInt(sign))));
     witnesses.push({source:s.source,ground,family:s.family,role,sign,basis:[...s.basis].sort(([a],[b])=>a<b?-1:1),magnitude:s.magnitude,normalization:s.normalization,overlap:shared,effective});
     for(const [k,w] of s.basis)aggregate.set(k,max(w,aggregate.get(k)??ZERO));prior.push(s.basis);
    }
   }
   roleTotals.set(role,bounded(net));
  }
  totals.push({ground,family:families.get(ground)!,base:roleTotals.get('Base')!,situation:roleTotals.get('Situation')!});
 }
 return {version:MULTISOURCE_COMPARISON_VERSION,law,witnesses,totals};
}
