// In-memory competing-source substitutions against actual production tests.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/COGNITIVE_SOURCE_SUBSTITUTIONS_REV1.json';assert(!fs.existsSync(output));
const math='src/campaign2/cognitiveMath.ts',transform='src/campaign2/cognitiveTransforms.ts',execution='src/campaign2/cognitiveExecution.ts',observation='src/campaign2/protocolObservation.ts';
const tests={math:'src/test/campaign2CognitiveMath.test.ts',transform:'src/test/campaign2CognitiveTransforms.test.ts',model:'src/test/campaign2CognitiveModel.test.ts',arbitration:'src/test/campaign2CognitiveArbitration.test.ts'};
const mutants=[
 ['donate-reserved-forecast-slot',transform,'transform','eligible.slice(0,capacity===3n?2:1)','eligible.slice(0,capacity>=2n?2:1)'],
 ['unknown-forecast-becomes-zero',transform,'transform','let forecast=r(380,[u(1)])','let forecast=r(380,[u(2),r(361,[qValue(ZERO),set([])])])'],
 ['appraisal-ignores-observed-forecast',transform,'transform','readQ(f(rec(f(forecast,2n),361n),1n))','Q.of(5n)'],
 ['base-ablation-deletes-options',transform,'transform',"if(enabled)for(const value of items(f(w,4n),'list'))", "if(enabled&&items(f(rec(motive,394n),3n),'list').length)for(const value of items(f(w,4n),'list'))"],
 ['plan-alias-duplicates-lottery-ticket',transform,'transform','k=key(candidate),group=candidates.get(k)','k=key(list([candidate,task])),group=candidates.get(k)'],
 ['standing-enters-nonidentity-meaning',transform,'transform','pressure=pressure.add(p).add(x)','pressure=pressure.add(p).add(x).add(fold.strength)'],
 ['raw-I-scaled-by-local-meaning',transform,'transform','emit(3,fold.strength,standingBasis)','emit(3,fold.strength.multiply(bounded(p.add(x))),standingBasis)'],
 ['duplicate-empty-basis-source',math,'math','o.magnitude.compare(ZERO)<0||seen.has(key(o.sourceKey))','o.magnitude.compare(ZERO)<0'],
 ['discard-aggregate-evidence-history',math,'math','for(const [k,w] of o.weights)aggregate.set(k,max(aggregate.get(k)??ZERO,w));','aggregate.clear();for(const [k,w] of o.weights)aggregate.set(k,w);'],
 ['context-resurrects-zero-base',math,'math','if(base.net.equals(ZERO))continue;',''],
 ['omit-active-d4-floor',math,'math','let die=4n;','let die=0n;'],
 ['avoid-sign-only-on-die',math,'math','dist.set(sign*(face+h+x),Q.of(1n,die))','dist.set(sign*face+h+x,Q.of(1n,die))'],
 ['winner-only-probability-list',math,'math','probabilities:options.map((o,i)=>({key:o.key,probability:probabilities[i]}))','probabilities:[{key:ranked[0].key,probability:ONE}]'],
 ['independently-rounded-increments',math,'math','integer=roundEven(input.numerator*1000000n,input.denominator)','integer=roundEven(prior.numerator*1000000n,prior.denominator)+roundEven(increment.numerator*1000000n,increment.denominator)'],
 ['omit-append-duplicate-priority',math,'math','if(prior.some(v=>{const old=rec(v,413n);return key(f(old,1n))===key(qualification)||key(f(old,2n))===key(decision);}))','if(false)'],
 ['skip-prepared-identity-seal',execution,'model','!identitySealed||!p','!p'],
 ['allow-protocol-truth-reference',observation,'arbitration','fields.set(10n,list([]));',''],
];
const paths=[...new Set([...mutants.map(m=>m[1]),...Object.values(tests)]),'scripts/prove-cognitive-substitutions.mjs'],fp=()=>paths.map(path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')})),before=fp();
async function run(test,mutant){let transformed=0;const listeners=new Set(process.listeners('unhandledRejection'));
 const v=await startVitest('test',[test],{config:false,watch:false,run:true,include:['src/test/**/*.test.ts'],minWorkers:1,maxWorkers:1,testTimeout:30000,reporters:[{onFinished(){}}]},
 {plugins:mutant?[{name:'cognitive-adversarial-source',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+mutant[1]))return;assert.equal(code.split(mutant[3]).length-1,1,'one exact substitution anchor');transformed++;return code.replace(mutant[3],mutant[4]);}}]:[]});assert(v);
 try{assert.equal(v.state.getUnhandledErrors().length,0);const cases=[];function walk(t){if(t.type==='test')cases.push({name:t.name,status:t.result?.state});for(const c of t.tasks??[])walk(c);}for(const f of v.state.getFiles())walk(f);assert(cases.length>0,'compile failure is not detection');const failed=cases.filter(c=>c.status==='fail');if(mutant){assert.equal(transformed,1);assert(failed.length>0,mutant[0]+' survived');}else assert.equal(failed.length,0);
 return {name:mutant?.[0]??test,status:mutant?'DETECTED':'PASS',tests:cases,source:mutant?.[1],from:mutant?.[3],to:mutant?.[4]};
 }finally{await v.close();for(const l of process.listeners('unhandledRejection'))if(!listeners.has(l))process.removeListener('unhandledRejection',l);}
}
const baselines=[];for(const test of Object.values(tests))baselines.push(await run(test));const results=[];for(const mutant of mutants){results.push(await run(tests[mutant[2]],mutant));console.log(mutant[0]+': DETECTED');}
assert.deepEqual(fp(),before);fs.writeFileSync(output,JSON.stringify({status:'FINITE SOURCE SUBSTITUTIONS DETECTED',baselines,results,sourceFingerprints:before,scope:'Actual pure components plus actual generated-source/sealing control. Avoid and aggregate multi-source coverage retain component scope; no public source widening.'},null,2)+'\n');process.exitCode=0;
