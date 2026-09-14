import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json',output='docs/planning/GA_LOGICAL_TOPOLOGY_REVIEW_REV2.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 const physical=p.stages.find(s=>s.name==='local-reserve-replenishment');assert(physical);assert.equal(physical.phase,110);assert.deepEqual(physical.next,[]);assert.deepEqual(physical.route,[]);assert.deepEqual(physical.outputs,['LocalReserveReplenishmentResult']);assert.deepEqual(physical.writes,['LocalReserveState at admitted composite key']);assert.equal(physical.allocation,'None');
 const byName=new Map(p.stages.map(s=>[s.name,s]));assert.equal(byName.size,67);assert.equal(p.stages.length,67);assert.equal(p.wholeModelWorkCeiling,null);assert.deepEqual(p.numericAllocations,[]);
 const edges=p.stages.flatMap(s=>(s.next??[]).map(to=>({from:s.name,to}))).concat(p.conditionalEdges);
 for(const s of p.stages){assert(s.phase>=0&&s.phase<=140&&s.phase!==150);if(s.phase===140){assert.deepEqual(s.next,[]);assert.deepEqual(s.outputs,[]);assert.equal(s.allocation,'None');}for(const to of s.future??[])assert(byName.has(to));}
 for(const e of edges){assert(byName.has(e.from)&&byName.has(e.to));assert(byName.get(e.from).phase<140);assert(byName.get(e.to).phase>=byName.get(e.from).phase);}
 const active=new Set(),done=new Set();function visit(n){assert(!active.has(n),'instant cycle');if(done.has(n))return;active.add(n);for(const e of edges.filter(e=>e.from===n))visit(e.to);active.delete(n);done.add(n);}for(const n of byName.keys())visit(n);
 for(const n of ['goal-baseline-cue','goal-baseline-rank','goal-baseline-recollection'])assert(byName.get(n).definitionPurpose.startsWith('GoalBaselineRecall; never ordinary'));
 assert.deepEqual(byName.get('goal-baseline-recollection').next,['goal-outcome-assessment']);
 for(const e of p.conditionalEdges.filter(e=>e.to==='event-presentation-dispatch')){assert(['current-recollection','consequence-recollection'].includes(e.from));assert(e.gate.includes('Event publication only')&&e.gate.includes('nonempty actual winners'));}
 for(const n of ['event-association-retention','event-presentation-cleanup','ordinary-memory-retention'])assert.deepEqual(byName.get(n).route,['route/character-learning']);
 assert.deepEqual(byName.get('event-association-retention').reads,['GeneralAssociationState']);assert.deepEqual(byName.get('event-presentation-cleanup').writes,['GeneralPresentationState']);
 const edge=(from,to)=>p.conditionalEdges.find(e=>e.from===from&&e.to===to);
 assert(edge('consequence-dispatch','goal-baseline-cue'));assert(edge('current-visual-selection','prior-concern-visual-encoding').gate.startsWith('Replace '));assert(edge('current-visual-cue','prior-concern-event-rank').gate.startsWith('Replace '));
}
validate(original);
const row=(p,n)=>p.stages.find(s=>s.name===n),faults=[['physical-writes-memory',p=>row(p,'local-reserve-replenishment').writes=['GeneralEpisodeState']],['physical-as-learning',p=>row(p,'local-reserve-replenishment').route=['route/character-learning']],
 ['owner-emits-child',p=>row(p,'ordinary-memory-retention').next.push('world')],
 ['unschedulable-phase',p=>row(p,'event-presentation-owner').phase=150],
 ['backward-current-feedback',p=>p.conditionalEdges.push({from:'prior-concern-producer',to:'current-visual-selection'})],
 ['instant-cycle',p=>row(p,'current-visual-encoding').next.push('current-visual-selection')],
 ['baseline-coupled-to-recall',p=>row(p,'goal-baseline-rank').definitionPurpose='BodyRecall'],
 ['baseline-becomes-presentation',p=>row(p,'goal-baseline-recollection').next=['event-presentation-dispatch']],
 ['graph-follows-episode-loss',p=>row(p,'event-association-retention').reads.push('GeneralEpisodeState')],
 ['presentation-writes-use',p=>row(p,'event-presentation-cleanup').writes.push('GeneralEpisodeState')],
 ['presentation-from-body',p=>p.conditionalEdges.find(e=>e.to==='event-presentation-dispatch').gate='Every publication'],
 ['template-count-claimed-as-work-bound',p=>p.wholeModelWorkCeiling=66]
].map(([name,mutate])=>{const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);return {name,rejected:true};});
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'COMPOSED LOGICAL TOPOLOGY REVIEW PASS; PUBLIC GATES OPEN',stageTemplates:67,faults,sources:[source,'scripts/review-ga-logical-topology-rev2.mjs'].map(fp),limits:['Template graph only, not exact public input/parent/definition admission or whole-model work bound.','Future target time, join once-only binding and B0 owner hooks still need runtime execution.']},null,2)+'\n');
