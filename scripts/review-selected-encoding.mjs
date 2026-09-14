import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/SELECTED_ENCODING_REVIEW_REV1.json';assert(!fs.existsSync(output));
const faults=[
 ['flatten-role','selectedEncoding.ts',"['causal-role/target',Q.of(9n,10n)]","['causal-role/target',Q.of(1n)]",'target'],
 ['ignore-attention-ablation','selectedEncoding.ts',"attentionLaw === 'disabled-attention' ? Q.of(1n)","attentionLaw === 'disabled-attention' ? role",'disabled'],
 ['ignore-budget-law','selectedEncoding.ts',',budgetLaw,Q.of(1n),',",'independent',Q.of(1n),",'flat'],
 ['retain-selection-capability','attentionSelection.ts','views.delete(view);\n    const seen','// fault: retain capability\n    const seen','revoked'],
 ['infer-need-zero','selectedEncoding.ts',"need:'Disabled' as const","need:'ObservedZero' as const",'need'],
];
async function probe(fault){let substitutions=0;const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',plugins:fault?[{name:'selected-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/src/campaign3/'+fault[1])){assert.equal(code.split(fault[2]).length-1,1);substitutions++;return code.replace(fault[2],fault[3]);}}}]:[]});try{
 const {encodeSelectedEvidence:encode}=await server.ssrLoadModule('/src/campaign3/selectedEncoding.ts'),a=await server.ssrLoadModule('/src/campaign3/attentionSelection.ts'),{attentionFixture}=await server.ssrLoadModule('/src/test/attentionFixtures.ts');
 const f=attentionFixture(),p=a.prepareAttentionPool(f.experience,f.claims),view=()=>a.selectAttention(p,2).view,q=x=>x.numerator+'/'+x.denominator;
 const v=view(),normal=encode(v,'independent','role-calibrated'),target=q(normal.rows[1].strength),disabled=q(encode(view(),'independent','disabled-attention').rows[1].strength),flat=q(encode(view(),'retired-flat','role-calibrated').rows[0].strength);let revoked=false;try{a.selectedReferences(v);}catch{revoked=true;}
 return {target,disabled,flat,revoked,need:normal.need,substitutions};
 }finally{await server.close();}}
const baseline=await probe();assert.deepEqual(baseline,{target:'243/1243',disabled:'27/127',flat:'1/1',revoked:true,need:'Disabled',substitutions:0});const results=[];
for(const fault of faults){const actual=await probe(fault);assert.equal(actual.substitutions,1);assert.notDeepEqual(actual[fault[4]],baseline[fault[4]]);results.push({name:fault[0],file:fault[1],removed:fault[2],inserted:fault[3],baseline:baseline[fault[4]],actual:actual[fault[4]],detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),p='docs/planning/SELECTED_ENCODING_TESTS_REV1.json',tests=JSON.parse(fs.readFileSync(p));assert(tests.success&&tests.numPassedTests===8);
fs.writeFileSync(output,JSON.stringify({status:'SEC-A..H QUALIFIED AT COMPONENT SCOPE',tests:8,faults:results,baseline,sources:['src/campaign3/selectedEncoding.ts','src/campaign3/attentionSelection.ts','src/campaign3/encodingAccessMath.ts','src/test/selectedEncoding.test.ts','docs/formal/SELECTED_ENCODING_COMPONENT.md','scripts/review-selected-encoding.mjs'].map(fp),evidence:fp(p),limits:['No public encoding record, subject projection, persistent state or corpus qualification.','Three units at raw strength <=3/10 imply sum <=9/10, below the shared budget1 threshold. These footprint comparisons do not discriminate its normalization branch.','Need and surprise channels disabled, not observed zero. No Incidental or spatial source admitted.']},null,2)+'\n');console.log({tests:8,faults:results.length});
