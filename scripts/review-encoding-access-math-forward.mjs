import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/ENCODING_ACCESS_MATH_REVIEW_REV2.json';assert(!fs.existsSync(output));
const changes=[
 ['independent-footprint','return values.map(boundedEncodingResponse)','return values.map(x=>x.divide(one.add(sum(values))))','independent'],
 ['shared-reinterpreted','return values.map(x=>denom.numerator?x.divide(denom):zero);','return values.map(x=>denom.numerator?x.multiply(budget).divide(denom):zero);','shared'],
 ['truncation','roundEven(x.numerator*p.scale,x.denominator)','x.numerator*p.scale/x.denominator','round'],
 ['remainder-tie','compareKeys(labels[a.j],labels[b.j])','compareKeys(labels[b.j],labels[a.j])','mass'],
 ['beta-endpoint',"if(beta.compare(one)>=0)fail('beta must be below one');",'','beta'],
 ['future-history','at>now||','','future'],
 ['summed-pull','.divide(Q.of(BigInt(e.retainedKeys.length)))','','pull'],
];
async function probe(change){let substitutions=0;const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',plugins:change?[{name:'encoding-math-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/src/campaign3/encodingAccessMath.ts')){assert.equal(code.split(change[1]).length-1,1);substitutions++;return code.replace(change[1],change[2]);}}}]:[]});try{const m=await server.ssrLoadModule('/src/campaign3/encodingAccessMath.ts'),{ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts'),q=(n,d=1)=>Q.of(BigInt(n),BigInt(d)),one=q(1),zero=q(0),str=x=>x.numerator+'/'+x.denominator;
 const independent=str(m.encodingBudget(['a','b'],[one,one],'independent')[0]),shared=str(m.encodingBudget(['a','b'],[one,one],'historical-shared',q(1,5))[0]),round=m.associationCandidate(['a','b'],[[zero,q(1,2)],[zero,zero]],[one,one],{scale:10n,eta:q(1,10),lambda:one,elapsed:one}).rows[0].quantized[1].toString(),mass=m.associationCandidate(['d','c','b','a'],Array.from({length:4},()=>[zero,zero,zero,zero]),[one,one,one,one],{scale:5n,eta:one,lambda:zero,elapsed:zero}).rows[0].mass.map(String).join(',');
 let beta=false,future=false;try{m.spreadingActivation([],[],[],one,10n);}catch{beta=true;}try{m.presentationAccessibility([1n],0n,q(1,2),1);}catch{future=true;}
 const pull=str(m.rankAccessibleEpisodes([{key:'episode',retainedKeys:['a','b'],presentations:[0n]}],new Map([['a',one],['b',one]]),0n,{lambda:one,exponent:1,omegaB:one,omegaA:one,k:1}).scored[0].pull);
 return {independent,shared,round,mass,beta,future,pull,substitutions};
 }finally{await server.close();}}
const baseline=await probe();assert.deepEqual(baseline,{independent:'1/2',shared:'1/2',round:'4',mass:'0,1,2,2',beta:true,future:true,pull:'1/1',substitutions:0});const results=[];
for(const change of changes){const actual=await probe(change);assert.equal(actual.substitutions,1);assert.notDeepEqual(actual[change[3]],baseline[change[3]]);results.push({name:change[0],removed:change[1],inserted:change[2],baseline:baseline[change[3]],actual:actual[change[3]],detected:true});}
const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});const tests=JSON.parse(fs.readFileSync('docs/planning/ENCODING_COMPONENT_TESTS_REV2.json'));assert(tests.success&&tests.numPassedTests===28);
fs.writeFileSync(output,JSON.stringify({status:'EAM-A..L QUALIFIED AT MATHEMATICS COMPONENT SCOPE',tests:12,faults:results,baseline,sources:['src/campaign3/encodingAccessMath.ts','src/test/encodingAccessMath.test.ts','docs/formal/ENCODING_ACCESS_MATH.md','docs/planning/GENERAL_ATTENTION_CLOSURE_PLAN.md','scripts/review-encoding-access-math-forward.mjs'].map(fp),evidence:fp('docs/planning/ENCODING_COMPONENT_TESTS_REV2.json'),limits:['No public evidence producer, canonical record, persistent writer, source/subject binding, retrieval event or corpus promotion. General attention remains OPEN.']},null,2)+'\n');console.log({componentTests:12,detectedFaults:results.length,public:'NOT QUALIFIED'});

