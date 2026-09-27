import {expect,it} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors as project,AFFECT_CANDIDATES,type AffectFactors,type AffectCandidate} from '../campaign3/affectFactorComparison';
const factors=(p=1,s=1,v=1,c=0):AffectFactors=>({likelihood:Q.of(BigInt(p),2n),severity:Q.of(BigInt(s),2n),vulnerability:Q.of(BigInt(v),2n),control:Q.of(BigInt(c),2n)});
const coordinates=(f:AffectFactors,c:AffectCandidate)=>{const x=project(f,c);if(x.status!=='Known')throw Error('fixture');return x.coordinates;};
it('retains exact historical formula and full-control residual without selecting it as a law',()=>{
 expect(coordinates(factors(2,2,2,0),'HistoricalProduct')).toEqual([Q.of(1n)]);
 expect(coordinates(factors(2,2,2,2),'HistoricalProduct')).toEqual([Q.of(1n,2n)]);
 expect(coordinates(factors(2,2,2,2),'SplitExposure')).toEqual([Q.of(1n),Q.of(0n)]);
});
it('covers all binary factorial cells and each half-factor intervention exactly',()=>{
 for(const p of [0,2])for(const s of [0,2])for(const v of [0,2])for(const c of [0,2]){
  const f=factors(p,s,v,c),[e,u]=coordinates(f,'SplitExposure');
  expect(e).toEqual(Q.of(BigInt(p*s*(2+v)),16n));expect(u).toEqual(Q.of(BigInt(p*s*(2+v)*(2-c)),32n));
  expect(coordinates(f,'ScalarUncontrolled')).toEqual([u]);
 }
 const baseline=factors(2,2,2,0);for(const key of ['likelihood','severity','vulnerability','control'] as const){const altered={...baseline,[key]:Q.of(1n,2n)};expect(coordinates(altered,'HistoricalProduct')).not.toEqual(coordinates(baseline,'HistoricalProduct'));}
});
it('exhibits scalar collision without claiming a required psychological distinction',()=>{
 const a=factors(2,2,2,1),b=factors(1,2,2,0);
 expect(coordinates(a,'ScalarUncontrolled')).toEqual(coordinates(b,'ScalarUncontrolled'));
 expect(coordinates(a,'SplitExposure')).not.toEqual(coordinates(b,'SplitExposure'));
 expect(coordinates(a,'HistoricalProduct')).not.toEqual(coordinates(b,'HistoricalProduct'));
});
it('keeps unknown separate from known zero and rejects invalid factors even beside an unknown',()=>{
 for(const c of AFFECT_CANDIDATES){expect(project({...factors(),control:undefined},c)).toEqual({status:'Unavailable'});expect(project(factors(0),c).status).toBe('Known');}
 expect(()=>project(factors(0),'status' as AffectCandidate)).toThrow('CANDIDATE');
 expect(()=>project({...factors(),control:undefined,severity:Q.of(2n)},'HistoricalProduct')).toThrow('DOMAIN');
});
it('preserves monotonicity across a rational grid and no control effect on exposure',()=>{
 for(const c of AFFECT_CANDIDATES)for(const k of ['likelihood','severity','vulnerability','control'] as const){let prev:readonly Q[]|undefined;for(let i=0;i<=8;i++){const next=coordinates({...factors(),[k]:Q.of(BigInt(i),8n)},c);if(prev)next.forEach((q,j)=>expect(k==='control'?q.compare(prev![j])<=0:q.compare(prev![j])>=0).toBe(true));prev=next;}}
 expect(coordinates(factors(1,1,1,0),'SplitExposure')[0]).toEqual(coordinates(factors(1,1,1,2),'SplitExposure')[0]);
});
it('rejects accessor/extra fields without invoking getters and leaves operands unchanged',()=>{
 let called=false;expect(()=>project({...factors(),get control(){called=true;return Q.of(0n);}},'HistoricalProduct')).toThrow('FIELDS');expect(called).toBe(false);
 expect(()=>project({...factors(),truth:true} as AffectFactors,'HistoricalProduct')).toThrow('FIELDS');
 const original=factors(),before=structuredClone(original);project(original,'SplitExposure');expect(structuredClone(original)).toEqual(before);
});
