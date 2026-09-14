import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/ENCODING_ISOLATION_AND_BUDGET_REVIEW_REV1.json';assert(!fs.existsSync(output));
const faults=[
 ['mutable-constants','encodingAccessMath.ts','const zero=Object.freeze(Q.of(0n)),one=Object.freeze(Q.of(1n));','const zero=Q.of(0n),one=Q.of(1n);','constant'],
 ['skip-dense-raw','encodingAccessMath.ts','keys(labels);dense(raw);','keys(labels);','sparse'],
 ['shared-role-object','selectedEncoding.ts','const role = Q.of(calibratedRole.numerator,calibratedRole.denominator);','const role = calibratedRole;','role'],
 ['erase-small-budget','selectedEncodingBudgetControl.ts',"calibration==='UnitBudget'?Q.of(1n):Q.of(1n,5n)","calibration==='UnitBudget'?Q.of(1n):Q.of(1n)",'small'],
 ['erase-important-threshold','selectedEncodingBudgetControl.ts','law,budget,Q.of(1n,4n)','law,budget,Q.of(1n)','hybrid'],
];
async function probe(fault){let substitutions=0;const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',plugins:fault?[{name:'isolation-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/src/campaign3/'+fault[1])){assert.equal(code.split(fault[2]).length-1,1);substitutions++;return code.replace(fault[2],fault[3]);}}}]:[]});try{
 const m=await server.ssrLoadModule('/src/campaign3/encodingAccessMath.ts'),{ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts'),{encodeSelectedEvidence:encode}=await server.ssrLoadModule('/src/campaign3/selectedEncoding.ts'),{encodeSelectedBudgetControl:control}=await server.ssrLoadModule('/src/campaign3/selectedEncodingBudgetControl.ts'),a=await server.ssrLoadModule('/src/campaign3/attentionSelection.ts'),{attentionFixture}=await server.ssrLoadModule('/src/test/attentionFixtures.ts');
 const view=(roles)=>{const f=attentionFixture(roles);return a.selectUnlimitedAttentionControl(a.prepareAttentionPool(f.experience,f.claims),2).view;},q=x=>x.numerator+'/'+x.denominator;
 let sparse=false;try{m.encodingBudget(['a'],new Array(1),'independent');}catch{sparse=true;}
 const small=q(control(view([['event-role/actor'],['event-role/actor']]),'historical-shared','role-calibrated','SmallBudget').rows[0].strength);
 const hybrid=q(control(view([['event-role/actor'],['event-role/participant']]),'historical-hybrid','role-calibrated','SmallBudget').rows[0].strength);
 const first=encode(view(),'independent','role-calibrated');Reflect.set(first.rows[1].role,'numerator',0n);const role=q(encode(view(),'independent','role-calibrated').rows[1].strength);
 const one=m.encodingBudget(['a'],[Q.of(1n)],'retired-flat')[0];Reflect.set(one,'numerator',99n);const constant=q(m.boundedEncodingResponse(Q.of(1n)));
 return {small,hybrid,role,sparse,constant,substitutions};
 }finally{await server.close();}}
const baseline=await probe();assert.deepEqual(baseline,{small:'1/2',hybrid:'3/13',role:'243/1243',sparse:true,constant:'1/2',substitutions:0});const results=[];
for(const fault of faults){const actual=await probe(fault);assert.equal(actual.substitutions,1);assert.notDeepEqual(actual[fault[4]],baseline[fault[4]]);results.push({name:fault[0],file:fault[1],removed:fault[2],inserted:fault[3],baseline:baseline[fault[4]],actual:actual[fault[4]],detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),p='docs/planning/ENCODING_COMPONENT_TESTS_REV2.json',tests=JSON.parse(fs.readFileSync(p));assert(tests.success&&tests.numPassedTests===28);
fs.writeFileSync(output,JSON.stringify({status:'ENCODING ISOLATION CORRECTIONS AND SBC-A..E QUALIFIED AT COMPONENT SCOPE',tests:28,faults:results,baseline,sources:['src/campaign3/encodingAccessMath.ts','src/campaign3/selectedEncoding.ts','src/campaign3/selectedEncodingBudgetControl.ts','src/test/encodingIsolation.test.ts','src/test/selectedEncodingBudgetControl.test.ts','docs/formal/SELECTED_ENCODING_BUDGET_CONTROL.md','scripts/review-encoding-isolation-and-budget.mjs'].map(fp),evidence:fp(p),priorFaults:['docs/planning/ENCODING_ACCESS_MATH_REVIEW_REV2.json','docs/planning/SELECTED_ENCODING_REVIEW_REV2.json'].map(fp),limits:['Source-connected selected-component comparisons, not authenticated public encoding or character-state qualification. No corpus promotion.']},null,2)+'\n');console.log({tests:28,newFaults:results.length});

