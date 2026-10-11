// Supplemental present-source evidence; no historical receipt or production edit.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const out='docs/planning/campaign3-history-cognitive-appraisal-rev2';
assert(!fs.existsSync(out));fs.mkdirSync(out);
const source='src/campaign2/cognitiveTransforms.ts',raw=fs.readFileSync(source,'utf8');
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const paths=fs.readdirSync('src',{recursive:true}).filter(x=>x.endsWith('.ts')||x.endsWith('.tsx')).map(x=>'src/'+x.replaceAll('\\','/')).sort();
paths.push('scripts/check-history-cognitive-appraisal-followup.mjs');const before=paths.map(fp);
const cases=[
 {name:'incompatible-symmetric',mean:5,intervals:[[0,2],[8,10]],tags:[4,2],distances:[3,3]},
 {name:'incompatible-asymmetric',mean:5,intervals:[[0,2],[9,10]],tags:[4,2],distances:[3,4]},
];
// Literal expected intensities, independent of the production rational expression.
const intensities={0:['0/1','0/1','0/1'],1:['0/1','1/20','1/10'],3:['0/1','3/20','3/10'],4:['0/1','1/5','2/5'],5:['0/1','1/4','1/2'],10:['0/1','1/2','1/1']};
const variants=[
 {name:'baseline'},
 {name:'affect-as-base',from:'emit(1,p,empty);',to:'emit(1,p.add(x),empty);'},
 {name:'copied-independent-observation',from:'r(399,[u(1),v])',to:"r(399,[u(1),r(237,[u(1),{kind:'typedIdentifier',namespaceId:1115n,payload:u(999)}])])"},
];
const results=[];const invalidOperands=[];
for(const variant of variants){
 if(variant.from)assert.equal(raw.split(variant.from).length,2,'exact mutation anchor '+variant.name);
 const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom',plugins:variant.from?[{name:'isolated-appraisal-mutation',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source))return {code:code.replace(variant.from,variant.to),map:null};}}]:[]});
 try{
  const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
  const {cognitiveRecord:r}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts'),m=await server.ssrLoadModule('/'+source);
  const {semanticReferentFromAuthoredContent:ref}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts'),{governedContentDefinitionId:def}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
  const f=(v,i)=>v.fields.get(BigInt(i)),id=(ns,s)=>c.typedIdentifier(ns,c.text(s)),occ=ns=>c.typedIdentifier(ns,c.unsigned(1));
  const C=ref(def('character/bridge-subject')),tasks=['a','b'].map((name,i)=>({key:r(371,[C,ref(def('content/task-'+name))]),specId:id(1027,'definition/task-'+name),activeFrom:1n,deadline:BigInt(10+i)}));
  const show=q=>`${q.numerator}/${q.denominator}`,rowResults=[];
  for(const item of cases)for(let gainIndex=0;gainIndex<3;gainIndex++)for(const enabled of [false,true])for(const count of [0,1,2]){
   const label=`${item.name}/gain${gainIndex}/enabled${enabled}/tasks${count}`;
   try{
    const selected=tasks.slice(0,count),criteria=selected.map((t,i)=>({...t,taskKey:t.key,minimum:Q.of(BigInt(item.intervals[i][0])),maximum:Q.of(BigInt(item.intervals[i][1]))}));
    const prediction=item.mean===null?undefined:r(361,[c.rational(item.mean,1),c.set([r(237,[c.unsigned(1),occ(1115)])])]);
    const w=m.workspaceOutput(occ(1128),C,id(1027,'definition/task-workspace'),r(378,[id(1027,'definition/measurement-prediction'),c.unsigned(3),true,true]),selected,2n,{status:()=>r(372,[c.unsigned(1)]),prediction:()=>prediction}).output;
    const wBefore=c.canonicalEncode(w),a=m.appraisalOutput(occ(1129),w,criteria),aBefore=c.canonicalEncode(a),definition=r(385,[c.rational(gainIndex,2),enabled]);
    const concern=m.concernOutput(occ(1130),a,definition),assessments=f(a,3).items,responses=f(concern,3).items;
    assert.equal(assessments.length,count);assert.equal(responses.length,count);assert.deepEqual(c.canonicalEncode(f(a,2)),wBefore);assert.deepEqual(c.canonicalEncode(f(concern,2)),aBefore);
    for(let i=0;i<count;i++){
     const assessment=f(assessments[i],2),response=f(responses[i],2);
     assert.deepEqual(c.canonicalEncode(f(assessments[i],1)),c.canonicalEncode(tasks[i].key));assert.deepEqual(c.canonicalEncode(f(responses[i],1)),c.canonicalEncode(tasks[i].key));
     assert.equal(f(assessment,1).value,BigInt(item.tags[i]));
     if([2,4].includes(item.tags[i]))assert.equal(show(f(assessment,2)),`${item.distances[i]}/1`);
     if(!enabled||item.mean===null){assert.equal(f(response,1).value,1n);assert.equal(response.fields.size,1);}
     else{assert.equal(f(response,1).value,2n);assert.equal(show(f(response,2)),intensities[item.distances[i]][gainIndex]);}
    }
    assert.deepEqual(c.canonicalEncode(w),wBefore);assert.deepEqual(c.canonicalEncode(a),aBefore);
    for(const baseEnabled of [false,true]){
     const motive=m.motiveOutput(occ(1131),concern,r(392,[c.rational(1,10),baseEnabled]));
     const candidates=m.candidateOutput(occ(1132),motive,true,task=>({instructionId:id(1027,'definition/task-instruction-one'),actionId:id(1027,'definition/protocol-contact-one')}));
     const rawResult=m.rawSignalOutput(occ(1133),candidates,false,Q.of(1n,10n),()=>{throw Error('forbidden standing read');}).output;
     const signals=f(rawResult,3).items;
     const bases=signals.filter(v=>f(f(v,1),3).value===1n);
     assert.equal(bases.length,baseEnabled?count:0,'affect must not generate base motives');
     for(const base of bases)assert.equal(show(f(base,2)),'1/10');
     const contextual=signals.filter(v=>f(f(v,1),3).value===2n);
     assert.equal(contextual.length,enabled&&gainIndex>0?count:0);
     const expectedBasis=r(400,[c.map([[r(399,[c.unsigned(1),r(237,[c.unsigned(1),occ(1115)])]),c.rational(1,1)]])]);
     for(const signal of contextual)assert.deepEqual(c.canonicalEncode(f(signal,3)),c.canonicalEncode(expectedBasis),'new appraisal/concern occurrences must not become additional observation evidence');
    }
    rowResults.push({label,status:'PASS'});
   }catch(error){if(error.code!=='ERR_ASSERTION')throw error;rowResults.push({label,status:'ASSERTION_FAILURE',message:error.message});}
  }
  assert.equal(rowResults.length,36);
  if(!variant.from)assert(rowResults.every(x=>x.status==='PASS'));
  else assert(rowResults.some(x=>x.status==='ASSERTION_FAILURE'),'mutant must fail executed assertion');
  if(!variant.from){
   const selected=tasks.slice(0,1),criteria=[{taskKey:selected[0].key,specId:selected[0].specId,minimum:Q.of(4n),maximum:Q.of(6n)}];
   const workspace=mean=>m.workspaceOutput(occ(1128),C,id(1027,'definition/task-workspace'),r(378,[id(1027,'definition/measurement-prediction'),c.unsigned(3),true,true]),selected,2n,{status:()=>r(372,[c.unsigned(1)]),prediction:()=>r(361,[c.rational(mean,1),c.set([r(237,[c.unsigned(1),occ(1115)])])])}).output;
   const valid=workspace(5),appraisal=m.appraisalOutput(occ(1129),valid,criteria);
   const negatives=[
    ['gain-negative',()=>m.concernOutput(occ(1130),appraisal,r(385,[c.rational(-1,2),true]))],
    ['gain-above-one',()=>m.concernOutput(occ(1130),appraisal,r(385,[c.rational(3,2),true]))],
    ['forecast-negative',()=>m.appraisalOutput(occ(1129),workspace(-1),criteria)],
    ['forecast-above-domain',()=>m.appraisalOutput(occ(1129),workspace(11),criteria)],
    ['criterion-negative',()=>m.appraisalOutput(occ(1129),valid,[{...criteria[0],minimum:Q.of(-1n)}])],
    ['criterion-above-domain',()=>m.appraisalOutput(occ(1129),valid,[{...criteria[0],maximum:Q.of(11n)}])],
    ['criterion-reversed',()=>m.appraisalOutput(occ(1129),valid,[{...criteria[0],minimum:Q.of(7n)}])],
    ['criterion-missing',()=>m.appraisalOutput(occ(1129),valid,[])],
    ['criterion-wrong-reference',()=>m.appraisalOutput(occ(1129),valid,[{...criteria[0],specId:id(1027,'definition/task-b')}])],
   ];
   for(const [name,run] of negatives){let caught;try{run();}catch(e){caught=e;}assert(caught,'invalid operand must reject: '+name);assert.equal(caught.code,'INVALID_CONFIGURATION');invalidOperands.push({name,status:'EXPECTED_REJECTION',code:caught.code,message:caught.message});}
  }
  results.push({...variant,rows:rowResults});
 }finally{await server.close();}
}
assert.deepEqual(paths.map(fp),before);
fs.writeFileSync(out+'/receipt.json',JSON.stringify({status:'CURRENT COMPONENT SUPPLEMENT PASS; NOT HISTORICAL OR WHOLE TA QUALIFICATION',sourceFingerprints:before,cases,expectedIntensities:intensities,results,invalidOperands,limits:['36 additional incompatible-goal component cases,72 base/evidence checks, nine invalid-operand rejections and two in-memory source mutants. No production file changed; no historical receipt overwritten.','Tests use synthetic admitted-shaped workspace operands, not public source admission or a new model.','Parent authentication, direct retirement exclusion, truth capability and publication rollback retain separate scoped evidence; not arbitrary trusted-host noninterference or whole public qualification.']},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({baselineCases:36,baseEvidenceChecks:72,invalidOperands:invalidOperands.length,mutants:2,failedAssertions:results.slice(1).map(x=>({name:x.name,count:x.rows.filter(r=>r.status==='ASSERTION_FAILURE').length}))}));
