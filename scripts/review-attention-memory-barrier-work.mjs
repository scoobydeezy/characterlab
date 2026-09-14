import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const out='docs/planning/ATTENTION_MEMORY_BARRIER_WORK_REVIEW_REV1.json';assert(!fs.existsSync(out),'write once');
const stages=structuredClone(JSON.parse(fs.readFileSync('docs/planning/ATTENTION_MEMORY_STAGE_INVENTORY_REV1.json')).stages);
stages.find(s=>s.name==='retain').next=['form','associate','seed-presentation'];
for(const name of ['form','associate','seed-presentation']){const s=stages.find(s=>s.name===name);s.next=[];s.requiredCompletedParent='retain';s.batch='exact common-parent formation triple';}
const counts={source0:{events:13,outputs:7,slots:7},source1:{events:5,outputs:5,slots:5},deadline:{events:1,outputs:0,slots:0},formation:{events:16,outputs:20,slots:17},cue:{events:14,outputs:20,slots:18}};
const p={stages,counts,formationCount:4,cueCount:4,expected:{events:139,outputs:172,slots:152,maxInstant:16}};
function check(p){const by=new Map(p.stages.map(s=>[s.name,s]));assert.deepEqual(by.get('retain').next,['form','associate','seed-presentation']);
 for(const name of ['form','associate','seed-presentation']){assert.equal(by.get(name).next.length,0,'phase140 member emitted child');assert.equal(by.get(name).requiredCompletedParent,'retain','sibling parent mismatch');}
 for(const s of p.stages.filter(s=>s.phase===140))assert.equal(s.next.length,0,'nonterminal barrier');
 assert.equal(p.formationCount,4);assert.equal(p.cueCount,4);
 const total={};for(const field of ['events','outputs','slots']){total[field]=p.counts.source0[field]+p.counts.source1[field]+p.counts.deadline[field]+p.formationCount*p.counts.formation[field]+p.cueCount*p.counts.cue[field];assert.equal(total[field],p.expected[field],'incorrect whole-run '+field);}
 total.maxInstant=Math.max(...Object.values(p.counts).map(c=>c.events));assert.equal(total.maxInstant,p.expected.maxInstant);return total;
}
const totals=check(p),faults=[];
for(const [name,mutate] of [['restore-writer-chain',p=>p.stages.find(s=>s.name==='form').next=['associate']],['omit-sibling',p=>p.stages.find(s=>s.name==='retain').next.pop()],['change-parent',p=>p.stages.find(s=>s.name==='associate').requiredCompletedParent='form'],['omit-deadline',p=>p.counts.deadline.events=0],['omit-future-reads',p=>p.counts.source1.events=3],['remove-source-padding-budget',p=>p.counts.source0.slots=5]]){const copy=structuredClone(p);mutate(copy);let reason;try{check(copy);}catch(e){reason=e.message;}assert(reason,'undetected '+name);faults.push({name,detected:true,reason});}
const tests=JSON.parse(fs.readFileSync('docs/planning/ATTENTION_MEMORY_BARRIER_TESTS_REV1.json'));assert(tests.success&&tests.numPassedTests===4&&tests.numFailedTests===0);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const sources=['docs/planning/ATTENTION_MEMORY_BARRIER_AND_WORK_REVIEW_REV1.md','docs/planning/ATTENTION_MEMORY_BARRIER_TESTS_REV1.json','src/test/attentionMemoryBarrier.test.ts','src/substrate/scheduler.ts','src/campaign2/adaptationRuntime.ts','src/campaign2/probeExecution.ts','src/campaign2/memoryExecution.ts','src/campaign2/predictionExecution.ts','src/campaign2/taskExecution.ts','scripts/review-attention-memory-barrier-work.mjs'];
fs.writeFileSync(out,JSON.stringify({status:'DRAFT BARRIER CORRECTION AND WORK ENVELOPE REVIEWED',...p,totals,faults,schedulerFixtureTests:4,sources:sources.map(fp),limits:['Arithmetic/graph review and actual scheduler fixtures, not public runtime or model qualification.','Prior chained stage edges superseded; original reviewed artifacts retained.','Per-instant16 and whole-run139/172/152 require the proposed separated fixture grammar.']},null,2)+'\n');console.log({totals,faults:faults.length,schedulerFixtureTests:4});
