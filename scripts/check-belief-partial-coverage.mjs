// Prior evidence audit; no fresh simulation or new learning law.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const p='docs/planning/',read=n=>JSON.parse(fs.readFileSync(p+n)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const n of ['learn','inference-correction','reinforcement'])execFileSync(process.execPath,['scripts/check-'+n+'-closure.mjs'],{stdio:'inherit'});
const views=read('REINFORCEMENT_VIEWS_REV1.json').views,rows=n=>views.find(v=>v.name===n&&v.law==='MeanHistory'&&v.seed===2).snapshot.rows.slice(3);
const full=rows('full'),off=rows('withheld'),fail=rows('failure');
assert.deepEqual(full.map(r=>r.beliefBefore[0]),['1/2','2/3','3/4','4/5','5/6']);
assert(full.every(r=>r.intent===0&&r.receipt===true));assert(off.every(r=>r.receipt===null&&r.beliefBefore.every(b=>b==='1/2')));
assert.equal(full[0].expression,off[0].expression);assert.deepEqual(off.map(r=>r.intent),[0,1,0,0,0]);assert.equal(fail[0].receipt,false);assert.equal(fail[1].beliefBefore[0],'1/3');
const residuals=full.map(r=>{const [n,d]=r.beliefBefore[0].split('/').map(BigInt);return `${d-n}/${d}`;});assert.deepEqual(residuals,['1/2','1/3','1/4','1/5','1/6']);
const intake=read('PARTIAL_COVERAGE_INTAKE_REV4.json');assert.equal(intake.clauses.length,20);assert.equal(intake.clauses.filter(c=>c.disposition==='NOT YET AUDITED').length,10);
const files=['CAMPAIGN3_BELIEF_PARTIAL_COVERAGE_AUDIT.md','PARTIAL_COVERAGE_INTAKE_REV4.json','CAMPAIGN3_EXIT_AUDIT_REV87.json','REINFORCEMENT_CLOSURE_REV1.json','REINFORCEMENT_VIEWS_REV1.json','LEARN_VALIDATION_CLOSURE_REV1.json','INFERENCE_CORRECTION_CLOSURE_REV1.json','CAMPAIGN3_BELIEF_QUALIFICATION.md','BELIEF_VALIDATION_CLOSURE_REV1.json','../formal/BELIEF_PUBLIC_CONTRACT.md'];
const result={status:'PASS',scope:'Prior receipts reverified; residuals are observer-evidence audit readouts, not new character state.',audited:['BRIEF-12.4-1','BRIEF-12.4-4','BRIEF-12.4-6'],promoted:['BRIEF-12.4-6'],residuals,counts:{bounded:116,partial:16,blocked:0},counters:[1508,0],files:[...files.map(n=>({path:p+n,sha256:sha(p+n)})),{path:'scripts/check-belief-partial-coverage.mjs',sha256:sha('scripts/check-belief-partial-coverage.mjs')}]};
const out=p+'BELIEF_PARTIAL_COVERAGE_CHECK_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);console.log('PASS belief coverage: repeated error bounded; uncertainty/accuracy and hidden cause partial.');
