// Documentation evidence inventory, not an experiment runner or psychological oracle.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const p='docs/planning/';
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
const report=p+'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md';
const output=p+'CAMPAIGN3_EXIT_AUDIT_REV27.json';
const corpusPath=p+'PHENOMENON_CORPUS.md';
const briefPath='CharacterLab — Ideal Character Research Program Brief.md';
const Q='QUALIFIED BOUNDED', P='PARTIAL', B='BLOCKED', A='ACCEPTED PRIOR SCOPE';
// Human audit dispositions. Whole fields keep exact text so partial compound
// requirements cannot be silently reduced to their easiest executable subclause.
const members={
 DET:[A,'VER-C0-RNG-001; VER-C0-ORD-001', 'CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md','Registered address/replay fixtures and later prefix restores; no new aggregate run or external coupling claim.',[18]],
 ADAPT:[A,'Accepted PHEN-ADAPT-001/1.11.0', 'CAMPAIGN2_COMPLETION_REVIEW.md','Four-rule common-B0 pair and exact route/path controls only; preserve all public/component distinctions.',[18]],
 EPI:[Q,'VER-C3-EPI-001','CAMPAIGN3_EPI_QUALIFICATION.md','Exact19/20 saturation pair through declared observation/SEM/learning/encoding/later-probe roster,6 models/72 runs/240 prefix continuations. New consumers/sensors/sources/horizons reopen; no general surprise or memory-law necessity claim.',[7,10,18]],
 SEM:[A,'SEM-001J; semantic-binding/0.1-candidate','SEAM_LEDGER.md','Accepted finite three-observer Campaign1 gate; broader recognition/ontology are not implied.',[20]],
 LEARN:[Q,'VER-C3-LEARN-001','CAMPAIGN3_LEARN_QUALIFICATION.md','Exact four-case lower-bound public realization,6 models/39 runs/580 prefix continuations. General scalar inference, upper bounds, decay and repeated-established-prior precision remain unresolved.',[10,18]],
 MEM:[Q,'VER-C3-GA-001','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','Recency/decay/selective reinforcement/K/tie finite witnesses; no reconstruction or long-horizon compression.',[5,6,7,20]],
 REASON:[Q,'VER-C3-REASON-001','CAMPAIGN3_REASON_QUALIFICATION.md','Joined exact keys/role-sign coverage/collective redundancy/zero-base exclusion/weak rescue with actual acquired standing;5 models/115 runs/350 prefix continuations. Controlled task/panel mapping; general correlation, direction identity and calibration remain unresolved.',[1,9,18,20]],
 DECISION:[Q,'VER-C3-DECISION-001','CAMPAIGN3_DECISION_QUALIFICATION.md','Three exact regimes, five named public comparators, same authoritative roll under significance change, safe post-attempt history and whole-prefix replay:6 models/174 runs/360 continuations. Two-option reason-mass significance and balanced opaque marginal only; broader calibration/control/grammar remain unresolved.',[18,20]],
 BIO:[Q,'VER-C3-BIO-001','CAMPAIGN3_BIO_QUALIFICATION.md','Exact early-only coupling, fixed third-seed probe, sustained contrary authorship and named controls:6 composed component candidates/13 cases/260 component prefixes plus13 canonical identity-bound reruns. Refold equality retains full frozen evidence; no new public RNG admission, general identity or compression claim.',[9,20]],
 COMMIT:[Q,'VER-C3-COMMIT-001','CAMPAIGN3_COMMIT_QUALIFICATION.md','Strong earned +3 standing stays fixed through absent/live/retired/new-instance probes and selective positive witnesses:4 models/10 runs/70 prefix continuations. Cancellation and controlled truthful communication only; broader lifecycle, source and calibration limits remain.',[14,18,20]],
 ATTN:[Q,'VER-C3-GA-001; VER-C3-ATTN-001','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','Declared visual/body/panel footprint and cue domain only; law choice, sources and broad affect open.',[2,3,4,5,6,7]],
 BODY:[Q,'VER-C3-EMB-001; VER-C3-BODY-001','CAMPAIGN3_BODY_OWNERSHIP_QUALIFICATION.md','Existing EMB kinetics/aliasing/receiving plus matched ownership comparison:16 public source runs/5 component candidates/79 source prefixes. Stored body behind sensor and current-evidence cache match sampled pressure; direct urgency and reference substitution fail. No general physiology, Need ontology or integrated public reduction.',[8,20]],
 BELIEF:[Q,'VER-C3-BELIEF-001','CAMPAIGN3_BELIEF_QUALIFICATION.md','Fixed-truth false display/correction, goal-only and opportunity contrasts; confidence is evidence weight, not correctness.',[10]],
 AFFECT:[Q,'VER-C3-AFFECT-001','CAMPAIGN3_AFFECT_QUALIFICATION.md','Independent factor/competing response/later-appraisal contrasts only; no unique dimensionality, broad feedback or regulatory impulse proof.',[11]],
 WORK:[Q,'VER-C3-WORK-001','CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md','Finite overloaded cards, maintained access and cue/expiry; distractor supplement holds all other priorities fixed.',[12]],
 SKILL:[Q,'VER-C3-SKILL-001','CAMPAIGN3_SKILL_QUALIFICATION.md','Single adopted exercise; actual skill/performance belief/impairment are distinct; Auto choice is not confidence-sensitive planning.',[13]],
 SOCIAL:[Q,'VER-C3-SOCIAL-001','CAMPAIGN3_SOCIAL_QUALIFICATION.md','Two observers, controlled identity/statement channel and fixed target commitment; no language generation or general mentalizing.',[14]],
 MULTI:[Q,'VER-C3-MULTI-002','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md','Public shared/independent and collective support under named laws; role-aware normalization and arbitrary renaming unresolved.',[1]],
 HABIT:[Q,'VER-C3-HABIT-001','CAMPAIGN3_HABIT_QUALIFICATION.md','Availability-mediated persistence/reversal under neutral opponent; not strong counter-reasons, compulsion or addiction.',[15]],
 REL:[Q,'VER-C3-REL-001','CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md','Own history/current estimate, rupture/contact/absence under fixed laws; correction of current claim is not repair or attribution correction.',[16]],
 LONG:[Q,'VER-C3-LONG-001','CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md','Biography+skill+relationship acquire and coexist; actual episode loss and fixed fold equality; diagnostic actual skill is not character knowledge.',[9,13,16,17]]
};
const ro=n=>`RO-C3-${String(n).padStart(3,'0')}`;
const corpus=read(corpusPath);
const headings=[...corpus.matchAll(/^## `(PHEN-([A-Z]+)-001)`[^\n]*$/gm)];
assert.equal(headings.length,21);
const metadata=new Set(['Version','Fixture amendment status','Historical intake','Brief coverage','Brief family','Status at promotion','Executable fixture update, 2026-09-20']);
const corpusMembers=headings.map((h,i)=>{
 const end=i+1<headings.length?headings[i+1].index:corpus.indexOf('## ',h.index+h[0].length);
 const section=corpus.slice(h.index,end<0?undefined:end);
 const spec=members[h[2]];assert(spec,h[2]);
 const fields=[...section.matchAll(/\*\*([^*\n]+):\*\*/g)];
 const clauses=fields.flatMap((m,j)=>{
  if(metadata.has(m[1]))return [];
  const text=section.slice(m.index+m[0].length,fields[j+1]?.index??section.length).trim().replace(/\n---\s*$/,'').trim();
  const tracking=['Applicable seams','Reopen conditions'].includes(m[1]);
  return [{key:`${h[1]}:${j+1}`,label:m[1],sourceLine:corpus.slice(0,h.index+m.index).split('\n').length,text,status:tracking?'TRACKED':spec[0],rationale:tracking?'Preservation/reopening constraint; never counted as a behavioral pass.':spec[3],evidence:[p+spec[2],p+'VERDICT_LEDGER.md'],obligations:spec[4].map(ro)}];
 });
 assert(clauses.some(c=>c.label==='Required setup domain'));
 assert(clauses.some(c=>c.label==='Exact comparison rule'));
 return {id:h[1],version:section.match(/\*\*Version:\*\*\s*`([^`]+)`/)?.[1],status:spec[0],authority:spec[1],rationale:spec[3],sourceText:section.trim(),clauses};
});
const familyStatuses=[
 [Q,Q,Q,P,Q,B,B,P], [Q,P,Q,Q,Q,P],
 [P,B,Q,Q,Q,Q,Q,Q,P,P], [P,Q,Q,P,Q,P,Q,Q,Q],
 [Q,Q,P,B,Q,P,B,P], [Q,Q,Q,Q,B,B,B,Q,Q],
 [Q,Q,Q,Q,B,B,P,B], [Q,Q,Q,Q,Q,Q,Q,Q],
 [P,Q,B,B,B,B,P,B,B,B,B], [Q,Q,Q,Q,Q,Q,Q,Q],
 [B,B,B,B,P,P,B,B,B,Q], [P,P,B,P,Q,B,B,P],
 [Q,Q,Q,Q,Q,Q,Q,Q,Q], [Q,Q,Q,Q,P,Q,Q,Q],
 [B,P,Q,Q,Q,P,Q,P,Q,Q,P,Q]
];
const familySources=[['BODY','ADAPT'],['BODY','MULTI'],['MEM','SEM','ATTN','LONG'],['LEARN','BELIEF','AFFECT'],['AFFECT','ATTN'],['WORK','HABIT'],['WORK','COMMIT'],['SKILL','LONG'],['HABIT','ADAPT'],['SOCIAL'],['REL'],['BIO','LONG'],['SOCIAL'],['DECISION','SKILL','SOCIAL'],['LONG']];
const familyLimits=[
 'Kinetics/hidden-source controls exist. Repeated constitutive adaptation versus tolerance and sleep/intoxication/control effects are not qualified by the reserve fixture.',
 'Task/body independent motives and shared options execute; general importance/urgency and alternative-strategy ownership remain bounded or absent.',
 'GA accessibility and finite SEM recognition retain their bounded scope. VER-C3-RECOLLECT-001 adds routine detail loss and category-based reconstruction that can differ from truth, preserving frozen observation and provenance tags. VER-C3-FAMILIAR-001 adds person/place feature familiarity after detail loss and familiar-but-different comparison, with no instance identity claim. General defining-memory retention, identity recognition, affect bias and downstream consumers remain unqualified.',
 'BELIEF and controlled AFFECT mitigation supply fallible estimates, contradiction and contingency operands. VER-C3-INFER-001 adds correction of the same observer-local obstruction proposition from new admitted reports, preserving past expression and mistaken correction under hidden truth. General cause discovery, alternative diagnosis, calibrated trust and scalar inference beyond the lower-bound LEARN profile remain unqualified.',
 'Factor and grounded-response contrasts qualify bounded appraisal; general fear/social affect and salience/retrieval integration remain partial or absent; instructed conditional reappraisal is separately bounded in Brief12.6 clause8.',
 'WORK qualifies finite distraction/protection and reminders. VER-C3-CONTROL-001 adds maintained-goal inhibition and failure under a neutral-card load with fixed habit, goal, belief and competence; release exposes preserved habit. VER-C3-REAPPRAISAL-001 adds instructed prospective conditional framing with unchanged belief and later derived affect. Monitoring, fatigue, rumination, learned control, spontaneous reappraisal and downstream action integration remain unqualified.',
 'VER-C3-GOAL-001 qualifies separately owned adopted goal and mutable strategy: switching, no-route gap, resumption and actual route-B completion. Perceived fulfillment follows admitted evidence even when false or externally caused. Prior retention/cue scope stands. Procrastination, delay valuation, general forgetting and competing temporal goals remain unqualified.',
 'SKILL qualifies performance belief/competence/impairment/practice; LONG adds event-sampled rust and execution after episode loss. These are bounded instances, not latent competence inference or automaticity laws.',
 'HABIT is availability under a neutral alternative. No joint dependence, substitute, craving, withdrawal, relapse or deliberate inhibition witness; ADAPT alone is not an addiction phenomenon.',
 'Two observers of one commitment are qualified. VER-C3-ATTRIBUTED-001 adds mistaken target-belief attribution and bounded second-order belief consumed by actual explanation choice, preserving own versus target actual versus attributed belief. Latest/majority report competitors and hidden-target whole-view controls remain explicit. VER-C3-PERSONSTATE-001 adds mixed conduct impression and mistaken current-intent inference under a stable default-policy control. Corrected consequence appraisal130 follows actual intent70; goal-relative SplitExposure affect is derived before conduct learning140. General personality, calibrated confidence, natural recognition, recursive mentalizing, downstream observer action and learned trust remain unqualified. VER-C3-FEAR-GUILT-001 adds controlled innocent nervousness, context-relative mistaken attribution and later revision, with independent observer goals, whole later-view privacy and a truth Oracle. Candidate weights do not qualify calibration, causal discovery, guilt emotion or moral identity. VER-C3-PERSON-GOAL-001 adds adopted desired state versus ordinary strategy, visible failed attempts, ambiguity, mistaken route classification and later goal-inference correction; no calibrated inverse planning, learned affordances or downstream observer action. VER-C3-HEARSAY-001 adds named testimony/direct perception, sincere mistake, visible report-ticket deduplication and later correction. Direct evidence remains fallible; no learned trust, hidden-source correlation, global reputation or new chosen speech policy.',
 'REL qualifies history specificity and a controlled rupture. No multidimensional affection/respect/comfort dissociation, grief, causal blame correction or reliance learning.',
 'Bounded acquired feedback, resistance to one contrary contribution and sustained reversal are qualified. Identity belief is not the standing fold. Cross-context generality, coercion exclusion, observer-specific self-concept, general reversal/recovery and dispositional adaptation remain incomplete.',
 'VER-C3-COMM-001 adds actual disclosure/concealment choice through inherited reasons/dice, independent delivery and recipient-owned learning. VER-C3-LYING-001 adds belief-relative deliberately contrary assertion and failed lying, including accidentally true lies, absent receipt and resistant prior history. VER-C3-DISPLAY-001 adds private distress with chosen reassurance and independent accidental emotional leakage, preserving SplitExposure coordinates and separate assertion/cue recipient estimates. VER-C3-INTERPRET-001 adds misunderstood explanation under two fixed conventions: intended meaning, received glyph/context, interpreted meaning and belief remain separate. All nine communication clauses have bounded witnesses across separate profiles, not a joint integration qualification. Physiological or learned display, inhibition, listener mentalizing, trust/fusion and general language/pragmatics remain unqualified.',
 'Actual frozen intent, governed external obstruction, selective witnessing and later fallible report-based obstruction attribution now execute together under corrected VER-C3-AGENCY-001/agency-public0.3; prior cohorts missed later nonrecipient occurrence leakage and exact intent phase admission. Cross-episode expectation learning, efficacy, blame and coercion remain unqualified.',
 'LONG composes biography, skill and relationship acquisition, fixed retention/interference and relearning. It does not jointly qualify all twelve long-run ingredients or lifelong individuality.'
];
const brief=read(briefPath);
const briefHeads=[...brief.matchAll(/^## 12\.(\d+) ([^\n]+)$/gm)];assert.equal(briefHeads.length,15);
const families=briefHeads.map((h,i)=>{
 const end=brief.indexOf('\n## ',h.index+h[0].length);
 const section=brief.slice(h.index,end<0?undefined:end);
 const items=[...section.matchAll(/^- ([^\n]+(?:\n(?!\n|- |#)[^\n]+)*)/gm)];
 assert.equal(items.length,familyStatuses[i].length,`Brief12.${i+1} denominator changed`);
 return {family:`12.${i+1}`,title:h[2],status:P,rationale:familyLimits[i],sourceText:section.trim(),clauses:items.map((m,j)=>({id:`BRIEF-12.${i+1}-${j+1}`,text:m[1].trim(),sourceLine:brief.slice(0,h.index+m.index).split('\n').length,status:familyStatuses[i][j],evidence:familySources[i].map(k=>p+members[k][2]),rationale:familyLimits[i],obligations:[ro(19),...new Set(familySources[i].flatMap(k=>members[k][4].map(ro)))]}))};
});
for (const clause of families[3].clauses) { clause.evidence.push(p+'CAMPAIGN3_INFERENCE_CORRECTION_QUALIFICATION.md'); clause.obligations.push(ro(14),ro(20)); }
for (const clause of families[5].clauses) { clause.evidence.push(p+'CAMPAIGN3_CONTROL_QUALIFICATION.md'); clause.obligations.push(ro(20)); }
for (const clause of families[6].clauses) { clause.evidence.push(p+'CAMPAIGN3_GOAL_STRATEGY_QUALIFICATION.md'); clause.obligations.push(ro(20)); }
for (const clause of families[13].clauses) clause.evidence.push(p+'CAMPAIGN3_AGENCY_QUALIFICATION.md');
for (const clause of families[5].clauses) { clause.evidence.push(p+'CAMPAIGN3_REAPPRAISAL_QUALIFICATION.md'); clause.obligations.push(ro(10),ro(11)); }
for (const clause of families[2].clauses) { clause.evidence.push(p+'CAMPAIGN3_RECOLLECTION_QUALIFICATION.md'); clause.obligations.push(ro(17)); }
for (const clause of families[2].clauses) clause.evidence.push(p+'CAMPAIGN3_FAMILIARITY_QUALIFICATION.md');
for (const clause of families[12].clauses) { clause.evidence.push(p+'CAMPAIGN3_COMMUNICATION_QUALIFICATION.md'); clause.obligations.push(ro(20)); }
for (const clause of families[12].clauses) clause.evidence.push(p+'CAMPAIGN3_LYING_QUALIFICATION.md');
for (const clause of families[12].clauses) { clause.evidence.push(p+'CAMPAIGN3_EMOTIONAL_DISPLAY_QUALIFICATION.md'); clause.obligations.push(ro(11)); }
for (const clause of families[12].clauses) clause.evidence.push(p+'CAMPAIGN3_INTERPRETATION_QUALIFICATION.md');
for (const clause of families[9].clauses) { clause.evidence.push(p+'CAMPAIGN3_ATTRIBUTED_QUALIFICATION.md'); clause.obligations.push(ro(20)); }
for (const clause of families[9].clauses) { clause.evidence.push(p+'CAMPAIGN3_PERSONSTATE_QUALIFICATION.md'); clause.obligations.push(ro(11)); }
for (const clause of families[9].clauses) clause.evidence.push(p+'CAMPAIGN3_FEAR_GUILT_QUALIFICATION.md');
for (const clause of families[9].clauses) clause.evidence.push(p+'CAMPAIGN3_PERSON_GOAL_QUALIFICATION.md');
for (const clause of families[9].clauses) clause.evidence.push(p+'CAMPAIGN3_HEARSAY_QUALIFICATION.md');
const reportNames=fs.readdirSync(path.join(root,p)).filter(n=>/^(CAMPAIGN3_|GENERAL_ATTENTION_|GA_).*QUALIFICATION.*\.md$/.test(n));
const supplemental=[
 'RELATIONSHIP_DIMENSIONS_READINESS.md','HEARSAY_IMPLEMENTATION_FINDINGS.md',
 'REPUTATION_HEARSAY_READINESS.md','PERSON_GOAL_IMPLEMENTATION_FINDINGS.md',
 'PERSON_GOAL_INFERENCE_READINESS.md','FEAR_GUILT_DEVELOPMENT_FINDINGS.md',
 'FEAR_GUILT_ATTRIBUTION_READINESS.md','PERSONSTATE_DEVELOPMENT_FINDINGS.md',
 'PERSON_STATE_DISSOCIATION_READINESS.md','ATTRIBUTED_DEVELOPMENT_FINDINGS.md',
 'ATTRIBUTED_KNOWLEDGE_READINESS.md',
 'CAMPAIGN3_FINAL_HISTORY_GATE.md','LEARN_IMPLEMENTATION_FINDINGS.md','LEARN_READINESS.md','EPI_IMPLEMENTATION_FINDINGS.md','EPI_READINESS.md','REASON_IMPLEMENTATION_FINDINGS.md','REASON_READINESS.md','DECISION_IMPLEMENTATION_FINDINGS.md','DECISION_COMPONENT_CHECKPOINT.md','COMMIT_IMPLEMENTATION_FINDINGS.md','BODY_OWNERSHIP_FINDINGS.md','BIO_COMPARISON_FINDINGS.md','AGENCY_IMPLEMENTATION_FINDINGS.md','CONTROL_IMPLEMENTATION_FINDINGS.md',
 'CAMPAIGN2_COMPLETION_REVIEW.md','CAMPAIGN2_COGNITIVE_QUALIFICATION.md','CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md',
 'CAMPAIGN3_ENTRY_READINESS.md','CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md','REFERENCE_MECHANISM_LEDGER.md',
 'COMMUNICATION_INTERPRETATION_READINESS.md','EMOTIONAL_DISPLAY_DEVELOPMENT_FAILURE_REV1.json','EMOTIONAL_DISPLAY_READINESS.md','DELIBERATE_LYING_READINESS.md','AFFECT_REGULATION_READINESS.md','CAMPAIGN3_BELIEF_PLAN.md','MULTISOURCE_EXPRESSIBILITY_AUDIT_2026_09_20.md','CAMPAIGN3_AFFECT_READINESS.md',
 'WORK_DISTRACTOR_DESIGN_FINDING.md','SKILL_IMPLEMENTATION_FINDINGS.md','SOCIAL_IMPLEMENTATION_FINDINGS.md','HABIT_IMPLEMENTATION_FINDINGS.md','RELATIONSHIP_IMPLEMENTATION_FINDINGS.md','LONGITUDINAL_IMPLEMENTATION_FINDINGS.md',
 'MULTISOURCE_CONSTRUCTION_FINDING_REV1.json','MULTISOURCE_CODEC_BOUNDARY_FINDING_REV1.json',
 'GENERAL_ATTENTION_ASSOCIATION_RETENTION_DECISION.md','GENERAL_ATTENTION_DIRECT_CUE_MEMBERSHIP_DECISION.md','GENERAL_ATTENTION_DIRECT_CUE_MEMBERSHIP_RESOLUTION.md','GENERAL_ATTENTION_GRAPH_ORPHAN_DECISION.md','GENERAL_ATTENTION_GRAPH_ORPHAN_RESOLUTION.md',
 'VERDICT_LEDGER.md','SEAM_LEDGER.md','PHENOMENON_CORPUS.md'
];
const inventory=[...new Set([...reportNames,...supplemental].map(n=>p+n).concat([briefPath,'reference/RESEARCH.md',report]))].sort().map(file=>({path:file,sha256:sha(file),inspection:file==='reference/RESEARCH.md'?'Selected Phase2.97 closure/attribution/calibration/reduction sections; not whole historical log':'Coverage/limits/findings audit; linked raw receipts retain their reported public/component scope, not freshly reexecuted.'}));
const ledger=read(p+'VERDICT_LEDGER.md');
const verdicts=[...ledger.matchAll(/^## `?(VER-[A-Z0-9-]+)/gm)].map(m=>m[1]);
const result={version:1,date:'2026-09-21',disposition:'NOT EXIT-READY',scope:'Documentation coverage audit, not behavioral execution or all-history completeness certification.',corpus:{version:'0.29.0',digest:'5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d',members:corpusMembers},brief:{source:briefPath,families},inventory,verdicts,report,counts:{members:corpusMembers.length,corpusFields:corpusMembers.reduce((n,m)=>n+m.clauses.length,0),families:families.length,briefCases:families.reduce((n,f)=>n+f.clauses.length,0),bounded:corpusMembers.filter(m=>m.status===Q).length,prior:corpusMembers.filter(m=>m.status===A).length,partial:corpusMembers.filter(m=>m.status===P).length,blocked:corpusMembers.filter(m=>m.status===B).length},counters:{highestAllocatedRecordType:896,allocatedSinceVerdict:0}};
const registry=JSON.parse(read(p+'RESEARCH_OBLIGATIONS.json'));
for(const c of [...corpusMembers.flatMap(m=>m.clauses),...families.flatMap(f=>f.clauses)]){
 assert(c.text&&c.rationale&&c.evidence.length&&c.obligations.length);
 c.evidence.forEach(f=>assert(fs.existsSync(path.join(root,f)),f));
 c.obligations.forEach(id=>assert(registry.obligations.some(o=>o.id===id),id));
}
assert.equal(result.counts.bounded,18);assert.equal(result.counts.prior,3);assert.equal(result.counts.partial,0);assert.equal(result.counts.blocked,0);
result.snapshotRevision=27;
result.date='2026-09-24';
result.counters.highestAllocatedRecordType=1206;
result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV26.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV26.json'),disposition:'Adds only bounded hearsay/direct observation for Brief12.10 clause8:5 models,23 runs,138 prefixes. Named testimony, direct perception and source belief remain distinct; visible-ticket deduplication is not hidden-correlation discovery. All8 social clauses now have separate bounded witnesses, not joint integration. Complete132-clause denominator retained.'};
result.finalHistoricalGate={path:p+'CAMPAIGN3_FINAL_HISTORY_GATE.md',obligation:'RO-C3-021',status:'NOT SATISFIED',blocks:'Final Campaign3 exit; not admitted bounded implementation.'};
assert(registry.obligations.some(o=>o.id===result.finalHistoricalGate.obligation));
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,output),JSON.stringify(result,null,2)+'\n');
else assert.deepEqual(JSON.parse(read(output)),result,'Audit source inventory or denominator changed; review dispositions before regenerating.');
console.log('PASS: documentation audit denominator, source hashes, evidence paths and obligation references '+JSON.stringify(result.counts));
