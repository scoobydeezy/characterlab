import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {tolerancePotential,challengeTolerance,LAWS} from '../campaign3/toleranceEffect';
import {toleranceKey,otherToleranceKey,toleranceInitial,toleranceInputs} from './toleranceFixtures';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
it('all bounded magnitudes/doses agree with independent cross-multiplied arithmetic',()=>{
 for(const law of LAWS)for(let t=0n;t<=10n;t++)for(let d=0n;d<=10n;d++){
  const q=tolerancePotential(law,t,Q.of(d));
  const [n,k]=law==='Reciprocal'?[d,1n+t]:law==='Linear'?[d*(10n-t),10n]:[d,1n];
  expect(q.numerator*k).toBe(n*q.denominator);
 }
});
it('invalid domains fail rather than clamp',()=>{
 for(const t of [-1n,11n])expect(()=>tolerancePotential('Linear',t,Q.of(1n))).toThrow();
 for(const d of [-1n,11n])expect(()=>tolerancePotential('Linear',0n,Q.of(d))).toThrow();
});
it('a matched repeated public exposure reduces later physical effect, not naive exposure',async()=>{
 const model=await prepareCampaign2Model(firstTraceModel());
 const run=async(count:number)=>{const x=await createCampaign2Run(model,{initialState:toleranceInitial(),orderedInputs:toleranceInputs([count,count,count,count]),runSeed:new Uint8Array(32)});while(await x.settleNextInstant());return x.snapshot().state;};
 const a=await run(1),b=await run(0);
 const challenge=(s:Uint8Array)=>challengeTolerance(s,toleranceKey,'Reciprocal',Q.of(1n),Q.of(0n));
 expect(challenge(a).potential.equals(Q.of(1n,5n))).toBe(true);expect(challenge(b).potential.equals(Q.of(1n))).toBe(true);
 const saturated=challengeTolerance(a,toleranceKey,'Reciprocal',Q.of(1n),Q.of(10n));expect(saturated.applied.equals(Q.of(0n))).toBe(true);expect(saturated.overflow.equals(saturated.potential)).toBe(true);
 expect(challengeTolerance(a,otherToleranceKey,'Reciprocal',Q.of(1n),Q.of(0n)).potential.equals(Q.of(1n))).toBe(true);
},30000);
it('other adaptation leaves alone cannot create tolerance',()=>{
 for(const law of LAWS)expect(challengeTolerance(toleranceInitial(true),toleranceKey,law,Q.of(1n),Q.of(0n)).potential.equals(Q.of(1n))).toBe(true);
});
