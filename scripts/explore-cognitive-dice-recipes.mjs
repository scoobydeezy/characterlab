// Research on actual historical compiler/resolver, not canonical runtime qualification.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/COGNITIVE_DICE_RECIPE_EXPLORATION_REV1.json';assert(!fs.existsSync(output));
const paths=['reference/src/model/diceCompiler.ts','reference/src/model/decision.ts','reference/src/model/identity.ts','reference/src/kernel/evidenceOverlap.ts','scripts/explore-cognitive-dice-recipes.mjs'];
const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')}),before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {Rational:R}=await server.ssrLoadModule('/reference/src/kernel/rational.ts');
 const {compileReasonDice}=await server.ssrLoadModule('/reference/src/model/diceCompiler.ts');
 const {resolveReasonDiceExpressions:resolve}=await server.ssrLoadModule('/reference/src/model/decision.ts');
 const {EMPTY_EVIDENCE_BASIS:empty,evidenceBasisOf}=await server.ssrLoadModule('/reference/src/kernel/evidenceOverlap.ts');
 const q=(n,d=1)=>R.of(n,d),show=x=>`${x.p}/${x.q}`;
 const base=[q(1,5),q(2,5),q(3,5),q(4,5),q(1)];
 const recipes=[['baseline',base,q(1),4],['context-integer',base,q(1,10),4],['die-six',[q(1,100),q(1,20),q(1,10),q(1,5),q(3,10)],q(1),6],['die-eight',[q(1,100),q(1,50),q(1,20),q(1,10),q(1,5)],q(1),8],['die-ten',[q(1,100),q(1,50),q(3,100),q(1,20),q(1,10)],q(1),10],['die-twelve',[q(1,100),q(1,50),q(3,100),q(1,25),q(1,20)],q(1),12]];
 const cases=[];
 for(const [name,thresholds,unit,faces] of recipes){
  const signals=new Map(['A','B'].map((o,i)=>[o,[{signalId:o+':base',optionKey:o,motiveChannel:'Commitment',referent:'task:'+o,sourceRole:'MotiveGenerating',signedStrength:q(1,10),basis:empty},{signalId:o+':concern',optionKey:o,motiveChannel:'Commitment',referent:'task:'+o,sourceRole:'SituationalEvidence',signedStrength:q(4+i,10),basis:evidenceBasisOf([['observation/control',q(1)]])}]]));
  const compiled=compileReasonDice(signals,{thresholds:Object.fromEntries(['d4','d6','d8','d10','d12'].map((k,i)=>[k,thresholds[i]])),thetaReason:q(37,100),modifierFamilies:new Map([['StandingIdentity',{familyId:'StandingIdentity',unit:q(1),maxMagnitude:3}],['RecentExperience',{familyId:'RecentExperience',unit,maxMagnitude:3}]])});
  assert.deepEqual([...compiled.values()].map(ns=>ns.length),[1,1]);assert([...compiled.values()].every(ns=>ns[0].baseDie===faces));
  const result=resolve({decisionId:'control/dice-recipes',actor:'control/actor',options:['A','B'].map(actionKey=>({actionDef:{actionKey}}))},compiled,q(1,2),q(1,2),'fixed-control-seed');
  cases.push({name,faces,modifiers:[...compiled.values()].map(ns=>ns[0].situationalModifier),contest:show(result.contest),authorshipPotential:show(result.authorshipPotential),mode:result.resolutionMode});
 }
 const context=cases.find(c=>c.name==='context-integer');assert.deepEqual(context.modifiers,[2,3]);assert.equal(context.contest,'9/16');assert.equal(context.authorshipPotential,'81/176');
 assert.notEqual(context.mode,cases[0].mode);
 assert.deepEqual(paths.map(fp),before);
 fs.writeFileSync(output,JSON.stringify({status:'HISTORICAL COMPONENT RESEARCH ONLY',sourceFingerprints:before,cases,limits:['Proposed task concern operands, not generated canonical workspace/appraisal records.','Historical selection uses its own RNG; no new substrate draw or persistence claim.','The actual first-profile compiler and every public recipe still require implementation and tests.']},null,2)+'\n');
 console.log(JSON.stringify(cases));
}finally{await server.close();}
