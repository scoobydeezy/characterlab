// Research control only. No canonical task/Reason implementation or allocation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url);
const output=new URL('docs/planning/CAMPAIGN2_TASK_IDENTITY_ACTIVATION_EXPLORATION.json',root);
if(fs.existsSync(output))throw new Error('Preserve prior report; choose a new revision.');
const paths=['reference/src/model/diceCompiler.ts','reference/src/model/reasonNucleus.ts','reference/src/kernel/evidenceOverlap.ts','reference/src/kernel/discreteDistribution.ts','reference/src/kernel/rational.ts'];
const hash=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=paths.map(hash);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try {
 const {Rational:R}=await server.ssrLoadModule('/reference/src/kernel/rational.ts');
 const {compileReasonDice}=await server.ssrLoadModule('/reference/src/model/diceCompiler.ts');
 const {EMPTY_EVIDENCE_BASIS:empty,evidenceBasisOf}=await server.ssrLoadModule('/reference/src/kernel/evidenceOverlap.ts');
 const q=(n,d=1)=>R.of(n,d),show=x=>`${x.p}/${x.q}`;
 const params={thresholds:{d4:q(1,5),d6:q(2,5),d8:q(3,5),d10:q(4,5),d12:q(1)},thetaReason:q(3,10),modifierFamilies:new Map([
  ['StandingIdentity',{familyId:'StandingIdentity',unit:q(1),maxMagnitude:3}],
  ['RecentExperience',{familyId:'RecentExperience',unit:q(1),maxMagnitude:3}],
 ])};
 const signal=(option,role,strength,basis)=>({signalId:`${option}:${role}`,optionKey:option,motiveChannel:'Commitment',referent:`task:${option}`,sourceRole:role,signedStrength:strength,basis});
 function run(standing,retired=false,equalSituation=false){
  const sources=new Map(['A','B'].map(option=>[option,[
   ...(!retired?[signal(option,'MotiveGenerating',q(1,10),empty)]:[]),
   signal(option,'SituationalEvidence',option==='A'||equalSituation?q(3,10):q(0),evidenceBasisOf([['one-shared-forecast',q(1)]])),
   signal(option,'StandingDisposition',standing,evidenceBasisOf([['one-standing-identity',q(1)]])),
  ]]));
  return [...compileReasonDice(sources,params)].map(([option,nuclei])=>({option,nuclei:nuclei.map(n=>({base:show(n.baseMotiveStrength),activation:show(n.reasonRelevance),baseDie:n.baseDie,standingModifier:n.standingModifier,situationalModifier:n.situationalModifier}))}));
 }
 const beforeStanding=run(q(0)),insufficientStanding=run(q(1,4)),afterStanding=run(q(1,3)),retired=run(q(1,3),true),symmetric=run(q(1,3),false,true);
 assert.deepEqual(beforeStanding.map(x=>x.nuclei.length),[1,0]);
 assert.deepEqual(insufficientStanding.map(x=>x.nuclei.length),[1,0]);
 assert.deepEqual(afterStanding.map(x=>x.nuclei.length),[1,1]);
 assert.deepEqual(retired.map(x=>x.nuclei.length),[0,0]);
 assert.deepEqual(symmetric[0].nuclei,symmetric[1].nuclei);
 for(const x of afterStanding)assert.equal(x.nuclei[0].base,'1/11');
 assert.deepEqual(paths.map(hash),before);
 const report={status:'EXECUTED HISTORICAL COMPONENT EXPLORATION; NOT CAMPAIGN2 QUALIFICATION',sourceFingerprints:before,parameters:{rawBase:'1/10',consolidatedBase:'1/11',rawSituationA:'3/10',rawSituationB:'0/1',rawStandingBefore:'0/1',insufficientRawStanding:'1/4',rawStandingAfter:'1/3',activationThreshold:'3/10',modifierUnit:'1/1'},beforeStanding,insufficientStanding,afterStanding,retired,symmetric,initialRejectedAssumption:'The first attempted1/4 raw standing witness did not activate B. Actual historical role consolidation applies boundedResponse before relevance;1/11+1/5 is below3/10. Corrected1/3 raw standing gives1/11+1/4 above3/10.',conclusion:'Equal standing contributions can activate only the previously inactive nucleus when situation differs. Consolidated base motives remain unchanged; modifiers cannot resurrect a missing base.',limitations:['Signals are explicit research component inputs, not generated Campaign2 psychological intermediates.','No identity evidence accumulation, qualification, efficacy, option generation, RNG or full arbitration is exercised.','Parameters exhibit a mathematical possibility; they are not selected production calibration.','RecentExperience is the historical compiler slot; a new concern source requires its own semantic modifier/provenance contract.','No claim that equal shifts change an already-symmetric contest.']};
 fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({output:output.pathname,beforeActive:1,afterActive:2,retiredActive:0,status:report.status}));
}finally{await server.close();}
