/** Pure component comparisons, never a public source or model qualification. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/MULTISOURCE_COMPARISON_REV1.json';assert(!fs.existsSync(output));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const {compareMultisourceCoverage:compare}=await server.ssrLoadModule('/src/campaign3/multisourceComparison.ts');
 const {receivingRecord:r,receivingSchema:schema}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts');
 const {bodyOptionsOutput,mixedCandidateOutput,mixedRawOutput,mixedReasonOutput,receivingCoverageComponent}=await server.ssrLoadModule('/src/campaign3/receivingTransforms.ts');
 const {C,id,occurrence,positivePressure,taskSource,def}=await server.ssrLoadModule('/src/test/receivingFixtures.ts');
 const {canonicalEncode:enc,set,map,record,unsigned:u,rational}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {ONE,ZERO,readQ,readDistribution,convolve,expectation,absolute,analyzeOptions}=await server.ssrLoadModule('/src/campaign2/cognitiveMath.ts');
 const f=(r,n)=>r.fields.get(BigInt(n)),q=(n,d=1)=>Q.of(BigInt(n),BigInt(d)),show=x=>x.numerator+'/'+x.denominator;
 const sig=(source,ground,family,basis,n=1,d=2,role='Base')=>({source,ground,family,role,strength:q(n,d),basis:basis.map(a=>[a,ONE])});
 const fixtures=[
  ['single',[sig('a','body','Body',['a'],3,4)]],
  ['duplicate',[sig('a','body','Body',['a'],3,4),sig('b','body','Body',['a'])]],
  ['independent',[sig('a','body','Body',['a'],3,4),sig('b','body','Body',['b'])]],
  ['aggregate-third',[sig('a','body','Body',['a'],3,4),sig('b','body','Body',['b']),sig('c','body','Body',['a','b'],1,4)]],
  ['cross-shared',[sig('a','task','Task',['a'],3,4),sig('b','body','Body',['a'])]],
  ['cross-independent',[sig('a','task','Task',['a'],3,4),sig('b','body','Body',['b'])]],
  ['cross-duplicate',[sig('a','task','Task',['a'],3,4),sig('b','body','Body',['a']),sig('c','body','Body',['a'],1,4)]],
  ['cross-opposed',[sig('a','task','Task',['a'],3,4),sig('b','body','Body',['a'],-1,2)]],
  ['cross-role-shared',[sig('a','task','Task',[],3,4),sig('b','task','Task',['a'],1,2,'Situation'),sig('c','body','Body',['a'])]],
  ['cross-role-independent',[sig('a','task','Task',[],3,4),sig('b','task','Task',['a'],1,2,'Situation'),sig('c','body','Body',['b'])]],
  ['orphan-modifier',[sig('a','task','Task',['a'],1,2,'Situation'),sig('b','body','Body',['a'])]],
  ['orphan-removed',[sig('b','body','Body',['a'])]],
  ['empty-basis',[sig('a','body','Body',[],3,4),sig('b','body','Body',[])]]
 ];
 const task=taskSource('one'),pd=id(1027,'definition/embodied-pressure');
 const body=bodyOptionsOutput(occurrence(1132,3),positivePressure(),pd,()=>[{instructionId:id(1027,'definition/embodied-response-a'),pressureDefinitionId:pd,actionId:id(1027,'definition/protocol-contact-one')}]);
 const candidates=mixedCandidateOutput(occurrence(1132,16),r(491,[task.candidates,body]));
 const template=mixedRawOutput(occurrence(1133,17),r(498,[candidates,task.raw]),pd),option=r(395,[C,id(1027,'definition/protocol-contact-one')]),opponent=r(395,[C,id(1027,'definition/protocol-contact-two')]);
 const atom=name=>r(399,[u(1),r(237,[u(1),occurrence(1115,90+name.charCodeAt(0)-97)])]);
 const taskGround=f(f(f(template,3).items.find(v=>!f(v,1).fields.has(4n)),1),2);
 const bodyGround=f(f(f(template,3).items.find(v=>f(v,1).fields.has(4n)),1),2);
 function encodedSignal(s,strength=s.strength,basis=s.basis){
  const source=r(495,[option,s.family==='Task'?taskGround:bodyGround,u(s.role==='Base'?1:2),...(s.family==='Body'?[id(1027,'component/source-'+s.source)]:[])]);
  return r(496,[source,rational(strength.numerator,strength.denominator),r(400,[map(basis.map(([a,w])=>[atom(a),rational(w.numerator,w.denominator)]))])]);
 }
 function compile(signals){const fields=new Map(template.fields);fields.set(3n,set(signals));return f(mixedReasonOutput(occurrence(1134,18),record(schema(499n),fields),def('task-reason-dice')),3).items;}
 function probe(nuclei){
  let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;
  for(const n of nuclei){const d=readDistribution(f(n,7));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}
  const other=new Map(Array.from({length:8},(_,i)=>[BigInt(i+1),q(1,8)]));
  const result=analyzeOptions([{key:option,distribution,reasonMass},{key:opponent,distribution:other,reasonMass:absolute(expectation(other))}],q(1,10),q(1,10));
  return {nuclei:nuclei.length,probability:show(result.probabilities[0].probability),mode:result.mode,distribution:[...distribution].sort(([a],[b])=>a<b?-1:1).map(([n,p])=>[String(n),show(p)])};
 }
 const laws=['GroundAggregate','GroundPairwise','GroundUncovered','FamilyNormalized'],rows=[];let parity=0;
 for(const [name,signals] of fixtures){
  const original=compile(signals.map(s=>encodedSignal(s))),cases=[];
  for(const law of laws){
   const result=compare(signals,law);
   assert.deepEqual(compare([...signals].reverse(),law),result);
   const effective=signals.flatMap(s=>{const w=result.witnesses.find(w=>w.source===s.source),value=w.effective.multiply(q(w.sign));return value.equals(ZERO)?[]:[encodedSignal(s,value,[])];});
   const compiled=compile(effective),decision=probe(compiled);
   if(law==='GroundAggregate'){
    assert.deepEqual(decision,probe(original));
    for(const role of ['Base','Situation'])for(const ground of new Set(signals.map(s=>s.ground))){
     const partition=signals.filter(s=>s.ground===ground&&s.role===role);if(!partition.length)continue;
     const actual=receivingCoverageComponent(partition.map(s=>encodedSignal(s)));
     assert.equal(show(actual.net),show(result.totals.find(t=>t.ground===ground)[role==='Base'?'base':'situation']));parity++;
    }
   }
   cases.push({law,totals:result.totals.map(t=>({...t,base:show(t.base),situation:show(t.situation)})),witnesses:result.witnesses.map(w=>({...w,basis:w.basis.map(([a,q])=>[a,show(q)]),magnitude:show(w.magnitude),normalization:show(w.normalization),overlap:show(w.overlap),effective:show(w.effective)})),decision});
  }
  const descriptionDice=signals.every(s=>s.role==='Base')?probe(signals.flatMap(s=>compile([encodedSignal(s)]))):null;
  rows.push({name,signals:signals.map(s=>({...s,strength:show(s.strength),basis:s.basis.map(([a,w])=>[a,show(w)])})),canonicalComponentSignals:signals.map(s=>Buffer.from(enc(encodedSignal(s))).toString('hex')),cases,descriptionDice});
 }
 const get=(name,law)=>rows.find(r=>r.name===name).cases.find(c=>c.law===law);
 assert.equal(get('aggregate-third','GroundAggregate').witnesses.find(w=>w.source==='c').effective,'0/1');
 assert.equal(get('aggregate-third','GroundPairwise').witnesses.find(w=>w.source==='c').effective,'1/8');
 assert.deepEqual(get('cross-shared','GroundAggregate').decision,get('cross-independent','GroundAggregate').decision);
 assert.deepEqual(get('orphan-modifier','GroundAggregate').decision,get('orphan-removed','GroundAggregate').decision);
 assert.notDeepEqual(get('orphan-modifier','FamilyNormalized').totals,get('orphan-removed','FamilyNormalized').totals);
 const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
 const receipt={status:'EXECUTED COMPONENT COMPARISON; PUBLIC MULTISOURCE REMAINS OPEN',contract:'multisource-coverage-comparison/0.1-candidate',corpusObligation:'PHEN-MULTI-001 1.0.0-draft, corpus/0.29.0',models:'No public ModelIdentity/RunIdentity; these are internal numerical component operands.',fixtureCount:rows.length,coverageLawRuns:rows.length*laws.length,descriptionDiceRuns:rows.filter(r=>r.descriptionDice).length,referencePartitionParityChecks:parity,distributionProbe:'Exact existing reason-dice calibration and analytical probability kernel, compared with one fixed independent d8 option. No RNG draw or sampled inference.',rows,limits:['Synthetic component evidence atoms are not admitted source facts.','Task base with nonempty observational support is a diagnostic comparison operand, not the accepted task producer.','Body negative strength is a numerical sign control, not an admitted deficit producer.','DescriptionDice applies only to Base-only fixtures.','No schema allocation, source contract, public corpus qualification or final normalization law is implied.'],sources:['docs/formal/MULTISOURCE_COVERAGE_COMPARISON.md','src/campaign3/multisourceComparison.ts','src/campaign3/receivingTransforms.ts','src/campaign2/cognitiveMath.ts','src/test/receivingFixtures.ts','scripts/compare-multisource-coverage.mjs'].map(fp),counters:{highestAllocated:706,allocatedSinceVerdictOrCorpusMember:0}};
 fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({status:receipt.status,fixtures:rows.length,lawRuns:receipt.coverageLawRuns,descriptionDice:receipt.descriptionDiceRuns,parity}));
}finally{await server.close();}
