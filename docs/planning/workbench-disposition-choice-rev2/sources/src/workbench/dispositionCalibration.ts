import type {TimelineEvent} from './contracts';
import {ExactRational as Q} from '../substrate/exactMath';
import {dispositionFactorSources} from './dispositionFactorSources';
const q=(s:string)=>{if(! /^-?\d+\/[1-9]\d*$/.test(s)||s.length>256)throw Error('Invalid calibration fraction');const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);};
const text=(x:Q)=>`${x.numerator}/${x.denominator}`,abs=(x:Q)=>Q.of(x.numerator<0n?-x.numerator:x.numerator,x.denominator);
/** Source-bound reconstruction beneath disposition-public/0.1-candidate.
 * It checks reported results; it is not a newly recorded runtime quantization event. */
export function dispositionCalibration(event:TimelineEvent,seamVersion:string){
 if(seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified disposition calibration version');
 const factors=dispositionFactorSources(event);
 const header={version:'disposition-calibration-inspection/0.1',seamVersion,eventId:event.id,instant:event.instant,
  source:'dispositionPublicMath.dispositionReasons + cognitiveMath.compileReasonNuclei; disposition-adaptation/0.1-candidate; reason-dice/0.1-candidate'};
 if(!factors.emitted)return {...header,emitted:false as const,nuclei:[]};
 const input=JSON.parse(event.input),reasons=JSON.parse(event.output)[1],context=input[0];
 if(!Array.isArray(input)||input.length!==3||input[1]!==true||context?.record!=='IdentitySafeContext#1429/1'||typeof context['Learning [6]']!=='boolean'||JSON.stringify(context)!==JSON.stringify(reasons['Context [2]']))throw Error('Calibration context lineage mismatch');
 const learning=context['Learning [6]'],unit=Q.of(1n,learning?1n:16n),cutoffs=['1/10','1/5','3/5','4/5','9/10'],dies=[4,6,8,10,12];
 const nuclei=factors.nuclei.map(n=>{
  const roles=(['base','standing','situational'] as const).map(role=>{
   const contributions=factors.rows.filter(r=>r.role===role).flatMap(r=>r.coverage.filter(c=>c.nucleus===n.index).map(c=>({sourceKey:r.key,signedEffective:text(q(c.effective).multiply(Q.of(q(r.strength).numerator<0n?-1n:1n)))})));
   const total=contributions.reduce((sum,c)=>sum.add(q(c.signedEffective)),Q.of(0n)),bounded=total.divide(Q.of(1n).add(abs(total)));
   const recorded=role==='base'?n.baseNet:role==='standing'?n.standingNet:n.situationalNet;
   if(!bounded.equals(q(recorded)))throw Error('Calibration role-net mismatch');
   const scaled=bounded.divide(unit),truncated=scaled.numerator/scaled.denominator,clamped=truncated>3n?3n:truncated< -3n?-3n:truncated;
   if(role!=='base'&&String(clamped)!==(role==='standing'?n.standingModifier:n.situationalModifier))throw Error('Calibration modifier mismatch');
   return {role,contributions,signedTotal:text(total),boundedNet:text(bounded),modifier:role==='base'?null:{unit:text(unit),scaled:text(scaled),truncated:String(truncated),cap:'3',result:String(clamped)}};
  });
  const base=q(n.baseNet),relevance=roles.reduce((sum,r)=>sum.add(abs(q(r.boundedNet))),Q.of(0n));
  if(base.numerator===0n||!relevance.equals(q(n.relevance)))throw Error('Calibration activation mismatch');
  let die=4;const bands=cutoffs.map((cutoff,i)=>{const crossed=abs(base).compare(q(cutoff))>=0;if(crossed)die=dies[i];return {cutoff,die:dies[i],crossed};});
  if(String(die)!==n.baseDie)throw Error('Calibration die-band mismatch');
  const polarity=base.numerator<0n?-1n:1n,direction=JSON.parse(n.key)['Direction [4]'];
  if(direction!==(polarity<0n?'2':'1'))throw Error('Calibration polarity mismatch');
  const masses=(n.distribution as {'Masses [1]':string[][]})['Masses [1]'],expected=new Map<string,string>();
  for(let face=1;face<=die;face++)expected.set(String(polarity*(BigInt(face)+BigInt(n.standingModifier)+BigInt(n.situationalModifier))),`1/${die}`);
  if(masses.length!==die||new Set(masses.map(m=>m[0])).size!==die||masses.some(([score,p])=>!expected.has(score)||!q(p).equals(q(expected.get(score)!))))throw Error('Calibration score-distribution mismatch');
  return {index:n.index,key:n.key,roles,relevance:text(relevance),activationThreshold:'0/1',basePolarity:polarity<0n?'opposing':'supporting',bands,die,
   standingModifier:n.standingModifier,situationalModifier:n.situationalModifier,masses:[...expected].sort((a,b)=>BigInt(a[0])<BigInt(b[0])?-1:1).map(([score,mass])=>({score,mass}))};
 });
 return {...header,emitted:true as const,learning,modifierUnit:text(unit),nuclei,
  scope:'Exact reconstruction from recorded raw coverage, evaluation context and version-bound calibration. Role net = signed effective total / (1 + absolute total). Modifiers truncate toward zero then cap at ±3. Each score = base polarity × (die face + standing modifier + situational modifier). These are mechanical score masses, not character uncertainty or causal necessity. Runtime quantization trace remains distinct.'};
}
