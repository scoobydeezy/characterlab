import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {startVitest} from 'vitest/node';
const output='docs/planning/CONTRASTIVE_ATTRIBUTION_REVIEW_REV1.json';assert(!fs.existsSync(output));
const source='src/campaign3/contrastiveAttribution.ts',tests='src/test/contrastiveAttribution.test.ts';
const faults=[
 ['inclusive-contrast','l.compare(u)>0','l.compare(u)>=0','CA-D'],
 ['optimistic-stroke-bound','r.trial.after!.lower.subtract(r.trial.before!.upper)','r.trial.after!.upper.subtract(r.trial.before!.lower)','CA-C'],
 ['ignore-baseline','if(trials.some(t=>!t.before!.lower.equals(baseline.lower)||!t.before!.upper.equals(baseline.upper)))return unavailable();','','CA-G'],
 ['ignore-replication','if(strokes.length!==2||controls.length!==2)return unavailable();','','CA-G'],
 ['omit-positive-change','l.compare(zero)>0&&','','CA-I'],
 ['accept-sparse-points','&&Array.from({length:n},(_,i)=>Object.hasOwn(a,i)).every(Boolean)','','CA-E']
];
const results=[];
for(const [name,removed,inserted,witness] of faults){
 let substitutions=0;const temp=`docs/planning/.contrastive-${name}.json`;assert(!fs.existsSync(temp));
 const v=await startVitest('test',[tests],{config:false,watch:false,pool:'forks',minWorkers:1,maxWorkers:1,reporters:['json'],outputFile:temp},{plugins:[{name:'contrastive-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/'+source)){assert.equal(code.split(removed).length-1,1);substitutions++;return code.replace(removed,inserted);}}}]});
 try{await v.close();const report=JSON.parse(fs.readFileSync(temp));assert.equal(substitutions,1);const failed=report.testResults.flatMap(r=>r.assertionResults).filter(r=>r.status==='failed');assert(failed.some(r=>r.fullName.includes(witness)),name+' missed '+witness);results.push({name,removed,inserted,witness,detected:true,failed:failed.map(r=>r.fullName)});}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
const baseline='docs/planning/CONTRASTIVE_ATTRIBUTION_TESTS_REV2.json',b=JSON.parse(fs.readFileSync(baseline));assert(b.success&&b.numPassedTests===9);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({status:'CA-A..I QUALIFIED AT COMPONENT SCOPE ONLY',faults:results,sources:[source,tests,'docs/formal/CONTRASTIVE_ATTRIBUTION_COMPONENT.md','scripts/review-contrastive-attribution.mjs'].map(fp),baseline:fp(baseline),limits:['Four trials are component arguments, not authenticated retained history.','The hidden-history label test establishes function-level invariance only, not a public false-attribution producer.','No physiological effect magnitude, consolidation state, model or corpus qualification.']},null,2)+'\n');process.exitCode=0;
