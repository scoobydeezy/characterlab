// Supplemental present-source evidence; no historical receipt or production edit.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const out='docs/planning/campaign3-history-cognitive-appraisal-rev1';
assert(!fs.existsSync(out));fs.mkdirSync(out);
const source='src/campaign2/cognitiveTransforms.ts',raw=fs.readFileSync(source,'utf8');
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const paths=fs.readdirSync('src',{recursive:true}).filter(x=>x.endsWith('.ts')||x.endsWith('.tsx')).map(x=>'src/'+x.replaceAll('\\','/')).sort();
paths.push('scripts/check-history-cognitive-appraisal.mjs');const before=paths.map(fp);
const cases=[
 {name:'known-zero-below',mean:0,intervals:[[4,6],[5,7]],tags:[2,2],distances:[4,5]},
 {name:'lower-endpoint',mean:4,intervals:[[4,6],[5,7]],tags:[3,2],distances:[0,1]},
 {name:'upper-endpoint',mean:6,intervals:[[4,6],[5,7]],tags:[3,3],distances:[0,0]},
 {name:'above-and-within',mean:7,intervals:[[4,6],[5,7]],tags:[4,3],distances:[1,0]},
 {name:'upper-domain',mean:10,intervals:[[4,6],[5,7]],tags:[4,4],distances:[4,3]},
 {name:'unknown',mean:null,intervals:[[4,6],[5,7]],tags:[1,1],distances:[null,null]},
 {name:'maximum-below',mean:0,intervals:[[10,10],[10,10]],tags:[2,2],distances:[10,10]},
 {name:'maximum-above',mean:10,intervals:[[0,0],[0,0]],tags:[4,4],distances:[10,10]},
 {name:'known-neutral',mean:0,intervals:[[0,0],[0,0]],tags:[3,3],distances:[0,0]},
];
// Literal expected intensities, independent of the production rational expression.
const intensities={0:['0/1','0/1','0/1'],1:['0/1','1/20','1/10'],3:['0/1','3/20','3/10'],4:['0/1','1/5','2/5'],5:['0/1','1/4','1/2'],10:['0/1','1/2','1/1']};
const variants=[
 {name:'baseline'},
 {name:'unknown-as-known-zero',from:'f(d,2n)!==true||tag===1n?r(386,[u(1)])',to:'f(d,2n)!==true?r(386,[u(1)]):tag===1n?r(386,[u(2),qValue(ZERO)])'},
 {name:'disabled-as-known-zero',from:'f(d,2n)!==true||tag===1n?r(386,[u(1)])',to:'f(d,2n)!==true?r(386,[u(2),qValue(ZERO)]):tag===1n?r(386,[u(1)])'},
 {name:'ignore-gain',from:'gain.multiply(tag===3n?ZERO:readQ(f(assessment,2n)))',to:'ONE.multiply(tag===3n?ZERO:readQ(f(assessment,2n)))'},
 {name:'wrong-domain-span',from:'.divide(Q.of(10n))',to:'.divide(Q.of(1n))'},
];
const results=[];
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
    rowResults.push({label,status:'PASS'});
   }catch(error){if(error.code!=='ERR_ASSERTION')throw error;rowResults.push({label,status:'ASSERTION_FAILURE',message:error.message});}
  }
  assert.equal(rowResults.length,162);
  if(!variant.from)assert(rowResults.every(x=>x.status==='PASS'));
  else assert(rowResults.some(x=>x.status==='ASSERTION_FAILURE'),'mutant must fail executed assertion');
  results.push({...variant,rows:rowResults});
 }finally{await server.close();}
}
assert.deepEqual(paths.map(fp),before);
fs.writeFileSync(out+'/receipt.json',JSON.stringify({status:'CURRENT COMPONENT SUPPLEMENT PASS; NOT HISTORICAL OR WHOLE TA QUALIFICATION',sourceFingerprints:before,cases,expectedIntensities:intensities,results,limits:['162 baseline component cases and four in-memory source mutants. No production file changed; no historical receipt overwritten.','Tests use synthetic admitted-shaped workspace operands, not public source admission or a new model.','TA parent authentication, state capabilities, publication rollback and broader proposed mutants require separately scoped evidence; no universal noninterference or whole TA pass.']},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({baselineCases:162,mutants:4,failedAssertions:results.slice(1).map(x=>({name:x.name,count:x.rows.filter(r=>r.status==='ASSERTION_FAILURE').length}))}));
