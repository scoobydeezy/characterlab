// External historical differential control. Active source imports no reference module.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/COGNITIVE_MATH_REFERENCE_COMPARISON_REV2.json';assert(!fs.existsSync(output));
const paths=['src/campaign2/cognitiveMath.ts','src/campaign2/cognitiveCodecs.ts','reference/src/model/diceCompiler.ts','reference/src/model/identity.ts','reference/src/kernel/evidenceOverlap.ts','scripts/compare-cognitive-math-reference-rev2.mjs'];
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const math=await server.ssrLoadModule('/src/campaign2/cognitiveMath.ts'),{cognitiveRecord:r}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
 const {Rational:R}=await server.ssrLoadModule('/reference/src/kernel/rational.ts'),{compileReasonDice}=await server.ssrLoadModule('/reference/src/model/diceCompiler.ts'),{updateIdentityEvidence,identityStrength}=await server.ssrLoadModule('/reference/src/model/identity.ts'),{EMPTY_EVIDENCE_BASIS:empty}=await server.ssrLoadModule('/reference/src/kernel/evidenceOverlap.ts');
 const {semanticReferentFromAuthoredContent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts'),{governedContentDefinitionId}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
 const f=(v,i)=>v.fields.get(BigInt(i)),id=(ns,p)=>c.typedIdentifier(ns,p),ref=s=>semanticReferentFromAuthoredContent(governedContentDefinitionId(s)),C=ref('character/bridge-subject'),candidate=r(395,[C,id(1027,c.text('definition/protocol-contact-one'))]),task=r(371,[C,ref('content/task-a')]);
 const show=x=>x instanceof R?`${x.p}/${x.q}`:`${x.numerator}/${x.denominator}`;
 const q=(n,d=1)=>Q.of(BigInt(n),BigInt(d)),rq=x=>R.of(x.numerator,x.denominator),value=x=>c.rational(x.numerator,x.denominator),basis=r(400,[c.map([])]);
 let diceCases=0,activeCases=0;
 for(const base of [q(-1),q(-1,10),q(0),q(1,10),q(1)])for(const standing of [q(-1,2),q(0),q(1,2)])for(const context of [q(-1,2),q(0),q(1,2)])for(const unit of [q(1),q(1,10)])for(const threshold of [q(0),q(37,100),q(2)]){
  const strengths=[base,context,standing],signals=strengths.map((strength,i)=>r(402,[r(401,[candidate,task,c.unsigned(i+1)]),value(strength),basis]));
  const cuts=[q(1,5),q(2,5),q(3,5),q(4,5),q(1)],definition=r(437,[r(438,cuts.map(value)),value(threshold),r(439,[value(unit),c.unsigned(3)]),r(439,[value(unit),c.unsigned(3)])]);
  const actual=math.compileReasonNuclei(signals,definition),oldSignals=strengths.map((strength,i)=>({signalId:'s'+i,optionKey:'A',motiveChannel:'Commitment',referent:'task',sourceRole:['MotiveGenerating','SituationalEvidence','StandingDisposition'][i],signedStrength:rq(strength),basis:empty}));
  const expected=compileReasonDice(new Map([['A',oldSignals]]),{thresholds:Object.fromEntries(['d4','d6','d8','d10','d12'].map((name,i)=>[name,rq(cuts[i])])),thetaReason:rq(threshold),modifierFamilies:new Map([['StandingIdentity',{familyId:'StandingIdentity',unit:rq(unit),maxMagnitude:3}],['RecentExperience',{familyId:'RecentExperience',unit:rq(unit),maxMagnitude:3}]])}).get('A')??[];
  assert.equal(actual.length,expected.length);diceCases++;
  if(actual.length){activeCases++;const a=actual[0],e=expected[0];assert.equal(f(a,4).value,BigInt(e.baseDie));assert.equal(f(a,5).value,BigInt(e.standingModifier));assert.equal(f(a,6).value,BigInt(e.situationalModifier));assert.equal(show(math.readQ(f(a,3))),show(e.reasonRelevance));assert.equal(show(math.readQ(f(f(a,2),1))),show(e.baseMotiveStrength));
   const current=[...math.readDistribution(f(a,7))].map(([n,p])=>[Number(n),show(p)]).sort((a,b)=>a[0]-b[0]);const old=[...e.distribution.pmf].map(([n,p])=>[Number(n),show(p)]).sort((a,b)=>a[0]-b[0]);assert.deepEqual(current,old);
  }
 }
 const histories=[[q(1,2000000),q(1,2000000)],[q(1,1000000),q(1,2000000)],[q(-1,3),q(1,5),q(-1,7),q(1,11)],...Array.from({length:8},(_,mask)=>Array.from({length:3},(_,i)=>q(mask&(1<<i)?1:-1,35)))];
 for(const history of histories){let previous={support:R.ZERO,opposition:R.ZERO};history.forEach(e=>{previous=updateIdentityEvidence(previous,rq(e));});const rows=history.map((e,i)=>r(413,[id(1138,c.unsigned(i+1)),id(1135,c.unsigned(i+1)),c.signed(i+1),value(e)])),actual=math.foldIdentityHistory(rows,q(1,10));assert.equal(show(actual.support),show(previous.support));assert.equal(show(actual.opposition),show(previous.opposition));assert.equal(show(actual.strength),show(identityStrength(previous,R.of(1,10))));}
 assert.deepEqual(paths.map(fp),before);
 fs.writeFileSync(output,JSON.stringify({status:'ACTUAL COMPONENT DIFFERENTIAL PASS; NOT FULL COGNITIVE QUALIFICATION',sourceFingerprints:before,diceCases,activeCases,identityHistories:histories.length,scope:['actual historical dice compiler against current codec-backed nucleus computation','negative/zero/positive bases, opposing modifiers, activation and floor','exact score mass and whole-expression sign','actual historical ordered identity quantization/strength across ties and opposing histories'],limits:['Raw controls are external mathematical operands, not public task-source occurrences.','No generated choice, qualified expression, RNG integration or persistence executes here.']},null,2)+'\n');console.log(JSON.stringify({diceCases,activeCases,identityHistories:histories.length,status:'DIFFERENTIAL PASS'}));
}finally{await server.close();}

