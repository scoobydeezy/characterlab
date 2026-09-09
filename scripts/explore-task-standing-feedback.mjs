// Research composition only: historical decision/identity operations, no canonical cognitive seam.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/TASK_EARNED_FEEDBACK_CALIBRATION_REV2.json';
assert(!fs.existsSync(output),'preserve prior report');
const paths=['reference/src/model/cognitiveSignals.ts','reference/src/model/decision.ts','reference/src/model/diceCompiler.ts','reference/src/model/identity.ts','reference/src/kernel/evidenceOverlap.ts','scripts/explore-task-standing-feedback.mjs'];
const hash=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(hash);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',plugins:[{name:'expose-reference-control',transform(code,id){if(id.replaceAll('\\','/').endsWith('/reference/src/model/cognitiveSignals.ts'))return code+'\nexport {commitmentStandingIdentitySignals};';}}]});
try{
 const {Rational:R}=await server.ssrLoadModule('/reference/src/kernel/rational.ts');
 const {compileReasonDice}=await server.ssrLoadModule('/reference/src/model/diceCompiler.ts');
 const {resolveReasonDiceExpressions}=await server.ssrLoadModule('/reference/src/model/decision.ts');
 const {alignment,identityFeedbackRawInfluences,updateIdentityEvidence,identityStrength}=await server.ssrLoadModule('/reference/src/model/identity.ts');
 const {EMPTY_EVIDENCE_BASIS:empty,evidenceBasisOf}=await server.ssrLoadModule('/reference/src/kernel/evidenceOverlap.ts');
 const q=(n,d=1)=>R.of(n,d),show=x=>`${x.p}/${x.q}`,P=q(1,10),K=q(1,10),polarity={commitment:{CommitmentFidelity:1}};
 const params={thresholds:{d4:q(1,5),d6:q(2,5),d8:q(3,5),d10:q(4,5),d12:q(1)},thetaReason:q(37,100),modifierFamilies:new Map([['StandingIdentity',{familyId:'StandingIdentity',unit:q(1),maxMagnitude:3}],['RecentExperience',{familyId:'RecentExperience',unit:q(1),maxMagnitude:3}]])};
 const semantic=m=>new Map(['A','B'].map((o,i)=>[o,new Map([['commitment',R.boundedResponse(P.add(q(4+i).sub(m).max(q(0)).div(q(10))))]])]));
 const {commitmentStandingIdentitySignals:standingSignals}=await server.ssrLoadModule('/reference/src/model/cognitiveSignals.ts');
 const compile=(m,state)=>compileReasonDice(new Map(['A','B'].map((o,i)=>{
  const pulls=standingSignals({actionDef:{actionKey:o}},[{fulfillingAction:o,motiveChannel:'Commitment',commitmentKey:'task:'+o}],new Map([['CommitmentFidelity',state]]),K,{CommitmentFidelity:['Commitment']}).map(s=>({strength:s.signedStrength}));
  const signals=[{signalId:o+':base',optionKey:o,motiveChannel:'Commitment',referent:'task:'+o,sourceRole:'MotiveGenerating',signedStrength:P,basis:empty},{signalId:o+':concern',optionKey:o,motiveChannel:'Commitment',referent:'task:'+o,sourceRole:'SituationalEvidence',signedStrength:q(4+i).sub(m).max(q(0)).div(q(10)),basis:evidenceBasisOf([['forecast-support-control',q(1)]])},...pulls.map(p=>({signalId:o+':standing',optionKey:o,motiveChannel:'Commitment',referent:'task:'+o,sourceRole:'StandingDisposition',signedStrength:p.strength,basis:evidenceBasisOf([['expression-support-control',q(1)]])}))];
  return [o,signals];
 })),params);
 const zero=()=>({support:q(0),opposition:q(0)}),count=compiled=>['A','B'].map(o=>compiled.get(o)?.length??0);
 const resolve=(compiled,decisionId,seed)=>resolveReasonDiceExpressions({decisionId,actor:'character/control',options:['A','B'].map(actionKey=>({actionDef:{actionKey}}))},compiled,q(1,2),q(1,2),seed);
 const cases=[];
 for(let seed=0;seed<32;seed++){
  let state=zero(),contacts=0;const history=[];
  for(let cycle=0;cycle<3;cycle++){
   const compiled=compile(q(0),state);assert.deepEqual(count(compiled),[1,1]);
   const resolution=resolve(compiled,`decision/${cycle}`,`research-seed/${seed}`),chosen=resolution.chosenOption;
   const a=alignment(chosen,'CommitmentFidelity',semantic(q(0)),polarity),e=a.mul(resolution.authorshipPotential);
   state=updateIdentityEvidence(state,e);contacts+=chosen==='A'?1:2;
   history.push({chosen,alignment:show(a),authorshipPotential:show(resolution.authorshipPotential),expression:show(e),support:show(state.support),opposition:show(state.opposition)});
  }
  // Hypothesized permitted protocol consequences: two exact observations0 and contacts/10.
  const mean=q(contacts,20),ablated=compile(mean,zero()),feedback=compile(mean,state),pre=resolve(ablated,'later','later-seed'),post=resolve(feedback,'later','later-seed');
  cases.push({seed,history,contacts,hypothesizedLaterMean:show(mean),strength:show(identityStrength(state,K)),olderAlignmentScaledComparisonPulls:['A','B'].map(o=>identityFeedbackRawInfluences(o,semantic(mean),new Map([['CommitmentFidelity',state]]),polarity,K).map(p=>show(p.strength))),withoutFeedback:count(ablated),withFeedback:count(feedback),withoutMode:pre.resolutionMode,withMode:post.resolutionMode});
 }
 assert(cases.every(x=>x.contacts>=3&&x.contacts<=6));
 const shifted=cases.filter(x=>x.withoutMode!==x.withMode);
 // Report failures of the proposed witness honestly; existence is a research result, not a gate.
 assert.deepEqual(paths.map(hash),before);
 fs.writeFileSync(output,JSON.stringify({status:'EXECUTED HISTORICAL RESEARCH; NOT CANONICAL IDENTITY QUALIFICATION',sourceFingerprints:before,parameters:{base:'1/10',gain:'1/1',thetaReason:'37/100',identityK:'1/10',thetaRoll:'1/2',thetaPlayer:'1/2',modifierUnit:'1/1'},cases,shiftedCases:shifted.length,limitations:['All three choices and identity updates use the actual historical components, including quantization and the actual Phase2.97 commitmentStandingIdentitySignals builder exposed in memory without editing reference files.','The semantic map from task concern to commitment meaning and expression qualification are proposed operands; DEC-001 is not closed.','Later means are derived hypothetical protocol outcomes, not executed generated actions or current prediction evidence.','Source/evidence strings are research-only controls, never canonical provenance.','The sampled seeds do not prove universal boundary movement. A profile requiring a witness must name its committed seed and actual generated path.','Identity is initially empty here; the older alignment-scaled projection is only a comparison; production initial reference must retain the Phase2.97 direct-strength mapping.']},null,2)+'\n');
 console.log(JSON.stringify({cases:cases.length,shiftedCases:shifted.length,output}));
}finally{await server.close();}
