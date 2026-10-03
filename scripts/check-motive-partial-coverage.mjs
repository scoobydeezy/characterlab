// Reverify prior evidence; this is not a new simulation.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const p='docs/planning/',read=n=>JSON.parse(fs.readFileSync(p+n)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const name of ['substitution','goal-strategy'])execFileSync(process.execPath,['scripts/check-'+name+'-closure.mjs'],{stdio:'inherit'});
const views=read('SUBSTITUTION_VIEWS_REV1.json').views,rows=name=>views.find(v=>v.name===name&&v.law==='LatestHistory').snapshot.rows.slice(5);
for(const row of rows('bothAvailable')){assert.equal(row.demand,1);assert.deepEqual(row.admitted,[true,true]);assert.deepEqual(row.values,['1/1','1/1']);assert([0,1].includes(row.intent));assert(row.attempt&&row.expression);}
assert.deepEqual(rows('diversified').map(r=>r.intent),[1,1,1]);assert.equal(rows('restoredA').at(-1).intent,0);
for(const name of ['concentrated','noDemand','unavailable'])assert(rows(name).every(r=>r.intent===-1));
const source=fs.readFileSync('src/campaign3/dependenceSubstitutes.ts','utf8');assert(source.includes('r(401,[OPTIONS[i],TASK,u(1)])'));assert(source.includes("set([r(396,[TASK,"));
const intake=read('PARTIAL_COVERAGE_INTAKE_REV2.json');assert.equal(intake.clauses.length,20);assert.equal(intake.clauses.filter(c=>c.disposition==='NOT YET AUDITED').length,16);
const files=['CAMPAIGN3_MOTIVE_PARTIAL_COVERAGE_AUDIT.md','PARTIAL_COVERAGE_INTAKE_REV2.json','SUBSTITUTION_CLOSURE_REV1.json','GOAL_STRATEGY_CLOSURE_REV1.json','CAMPAIGN3_EXIT_AUDIT_REV85.json','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md','../formal/DEPENDENCE_SUBSTITUTES_CONTRACT.md','../formal/BIOLOGICAL_INTEGRATION_CONTRACT.md','../formal/BODY_OWNERSHIP_COMPARISON_CONTRACT.md'];
const result={status:'PASS',scope:'Existing coverage evidence only; no fresh simulation/tests/build or new verdict.',audited:['BRIEF-12.2-2','BRIEF-12.2-6'],promoted:['BRIEF-12.2-6'],counts:{bounded:114,partial:18,blocked:0},counters:[1508,0],files:[...files.map(n=>({path:p+n,sha256:sha(p+n)})),{path:'scripts/check-motive-partial-coverage.mjs',sha256:sha('scripts/check-motive-partial-coverage.mjs')}]};
const out=p+'MOTIVE_PARTIAL_COVERAGE_CHECK_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);console.log('PASS motive coverage: multiple actions bounded; importance/urgency partial.');
