import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {LAWS,absenceResponse,challengeAbsence} from '../campaign3/absenceDeficit';
import {absenceInitial,absenceInputs,displacementKey,otherDisplacementKey} from './absenceFixtures';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
it('independent integer oracle covers all finite displacement, baseline and support values',()=>{
 for(const law of LAWS)for(let d=0;d<=10;d++)for(let x=40;x<=60;x++)for(let s=0;s<=10;s++){
  const v=absenceResponse(law,BigInt(d),Q.of(BigInt(x)),Q.of(BigInt(s))),gap=Math.max(0,50+(law==='FixedReference'?0:d)-x-s),response=Math.max(0,gap-(law==='ThresholdGap'?2:0));
  expect(v.gap.numerator).toBe(BigInt(gap));expect(v.gap.denominator).toBe(1n);expect(v.response.numerator*10n).toBe(BigInt(response)*v.response.denominator);
 }
});
it('public acquired displacement creates absence deficit relieved by support without erasing adaptation',async()=>{
 const model=await prepareCampaign2Model(firstTraceModel());
 const states:Uint8Array[]=[];for(const count of [0,1]){const run=await createCampaign2Run(model,{initialState:absenceInitial(),orderedInputs:absenceInputs([count,count,count,count]),runSeed:new Uint8Array(32)});while(await run.settleNextInstant());states.push(run.snapshot().state);}
 const read=(i:number,s:bigint)=>challengeAbsence(states[i],displacementKey,'LinearGap',Q.of(50n),Q.of(s));
 expect(read(0,0n).response.equals(Q.of(0n))).toBe(true);expect(read(1,0n).response.equals(Q.of(2n,5n))).toBe(true);
 expect(read(1,4n).response.equals(Q.of(0n))).toBe(true);expect(read(1,4n).displacement).toBe(4n);
 expect(challengeAbsence(states[1],otherDisplacementKey,'LinearGap',Q.of(50n),Q.of(0n)).displacement).toBe(0n);
},30000);
it('threshold competitor preserves a dead band while ordinary shortfall can exist without adaptation',()=>{
 expect(absenceResponse('LinearGap',1n,Q.of(50n),Q.of(0n)).response.equals(Q.of(1n,10n))).toBe(true);
 expect(absenceResponse('ThresholdGap',1n,Q.of(50n),Q.of(0n)).response.equals(Q.of(0n))).toBe(true);
 expect(absenceResponse('LinearGap',0n,Q.of(48n),Q.of(0n)).response.equals(Q.of(1n,5n))).toBe(true);
 for(const law of LAWS)expect(challengeAbsence(absenceInitial(true),displacementKey,law,Q.of(50n),Q.of(0n)).displacement).toBe(0n);
});
it('rejects inputs outside committed physiological challenge scope',()=>{
 for(const d of [-1n,11n])expect(()=>absenceResponse('LinearGap',d,Q.of(50n),Q.of(0n))).toThrow();
 for(const x of [39n,61n])expect(()=>absenceResponse('LinearGap',0n,Q.of(x),Q.of(0n))).toThrow();
 for(const s of [-1n,11n])expect(()=>absenceResponse('LinearGap',0n,Q.of(50n),Q.of(s))).toThrow();
});
