// External historical control; never imported by active source.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/COGNITIVE_COVERAGE_REFERENCE_REV1.json';assert(!fs.existsSync(output));
const paths=['src/campaign2/cognitiveMath.ts','src/campaign2/cognitiveCodecs.ts','reference/src/kernel/evidenceOverlap.ts','reference/src/kernel/rational.ts','scripts/compare-cognitive-coverage-reference.mjs'];
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const {cognitiveRecord:r,cognitiveNamed:named}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts'),{consolidateCoverage,readQ}=await server.ssrLoadModule('/src/campaign2/cognitiveMath.ts');
 const {Rational:R}=await server.ssrLoadModule('/reference/src/kernel/rational.ts'),{consolidateCorrelated}=await server.ssrLoadModule('/reference/src/kernel/evidenceOverlap.ts');
 const {semanticReferentFromAuthoredContent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts'),{governedContentDefinitionId}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
 const ref=s=>semanticReferentFromAuthoredContent(governedContentDefinitionId(s)),C=ref('character/bridge-subject'),key=v=>Buffer.from(c.canonicalEncode(v)).toString('hex');
 const source=i=>r(401,[r(395,[C,c.typedIdentifier(1027,c.text('definition/protocol-contact-one'))]),r(371,[C,ref('content/task-'+i)]),c.unsigned(1)]);
 const show=q=>'p'in q?`${q.p}/${q.q}`:`${q.numerator}/${q.denominator}`;
 const cases=[[[3,[1,0]],[2,[0,1]],[1,[1,1]]],[[3,[1,1,1]],[1,[1,1,0]]],[[2,[2,1]],[1,[1,3]]],[[1,[]],[1,[]]],[[2,[1]],[1,[1]]],[[1,[1,0]],[1,[0,1]]]];
 const results=[];
 for(const [index,rows]of cases.entries())for(const reversed of [false,true]){
  const operands=rows.map(([m,weights],i)=>({sourceKey:source(i),magnitude:Q.of(BigInt(m)),basis:r(400,[c.map(weights.flatMap((w,j)=>w?[[named(399,{VariantTag:c.unsigned(1),ObservationReference:r(237,[c.unsigned(1),c.typedIdentifier(1115,c.unsigned(j+1))])}),c.rational(w,1)]]:[]))])}));
  const prior=rows.map(([m,weights],i)=>({id:key(source(i)),magnitude:R.of(m),basis:{weights:new Map(weights.flatMap((w,j)=>w?[[String(j),R.of(w)]]:[]))}}));
  const actual=consolidateCoverage(reversed?operands.reverse():operands).results,expected=consolidateCorrelated(reversed?prior.reverse():prior);
  assert.deepEqual(actual.map(v=>[key(v.fields.get(1n)),... [2n,3n,4n,5n].map(i=>show(readQ(v.fields.get(i))))]),expected.map(v=>[v.id,...[v.rawMagnitude,v.overlapWithPrior,v.independentFraction,v.effective].map(show)]));
  results.push({case:index,reversed,status:'PASS'});
 }
 assert.deepEqual(paths.map(fp),before);fs.writeFileSync(output,JSON.stringify({status:'HISTORICAL AGGREGATE COVERAGE DIFFERENTIAL PASS',sourceFingerprints:before,results,scope:'Actual pure components: collective redundancy, larger-aggregate subset, unequal weights, empty/identical/disjoint bases, canonical tie order and permutations. Canonical source bytes supply the historical string tie key.',limits:'Synthetic mathematical operands only. No public source admission or multi-source task profile is asserted.'},null,2)+'\n');
}finally{await server.close();}
