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
const output=p+'CAMPAIGN3_EXIT_AUDIT_REV7.json';
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
 BIO:[P,'VER-C3-PRE-IDENTITY-001; VER-C3-LONG-001','CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md','Acquired feedback and early divergence do not discharge exact third-seed coupling, sustained contradiction and every named alternative.',[9]],
 COMMIT:[Q,'VER-C3-COMMIT-001','CAMPAIGN3_COMMIT_QUALIFICATION.md','Strong earned +3 standing stays fixed through absent/live/retired/new-instance probes and selective positive witnesses:4 models/10 runs/70 prefix continuations. Cancellation and controlled truthful communication only; broader lifecycle, source and calibration limits remain.',[14,18,20]],
 ATTN:[Q,'VER-C3-GA-001; VER-C3-ATTN-001','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','Declared visual/body/panel footprint and cue domain only; law choice, sources and broad affect open.',[2,3,4,5,6,7]],
 BODY:[P,'VER-C3-EMB-001','CAMPAIGN3_EMBODIED_QUALIFICATION.md','Kinetics/aliasing/receiving qualified; matched stored-meter/reference ownership comparison remains owed.',[8]],
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
 [P,B,B,Q,Q,P,P,P,P,P], [P,Q,Q,P,P,P,Q,Q,B],
 [Q,Q,P,B,Q,P,B,P], [Q,Q,B,B,B,B,B,B,Q],
 [P,Q,B,B,B,B,P,B], [Q,Q,Q,Q,Q,Q,Q,Q],
 [P,Q,B,B,B,B,P,B,B,B,B], [B,B,B,P,B,B,Q,B],
 [B,B,B,B,P,P,B,B,B,Q], [P,P,B,P,Q,B,B,P],
 [P,P,P,B,B,B,B,Q,Q], [Q,Q,Q,P,P,P,P,B],
 [B,P,Q,Q,Q,P,Q,P,Q,Q,P,Q]
];
const familySources=[['BODY','ADAPT'],['BODY','MULTI'],['MEM','SEM','ATTN','LONG'],['LEARN','BELIEF','AFFECT'],['AFFECT','ATTN'],['WORK','HABIT'],['WORK','COMMIT'],['SKILL','LONG'],['HABIT','ADAPT'],['SOCIAL'],['REL'],['BIO','LONG'],['SOCIAL'],['DECISION','SKILL','SOCIAL'],['LONG']];
const familyLimits=[
 'Kinetics/hidden-source controls exist. Repeated constitutive adaptation versus tolerance and sleep/intoxication/control effects are not qualified by the reserve fixture.',
 'Task/body independent motives and shared options execute; general importance/urgency and alternative-strategy ownership remain bounded or absent.',
 'GA accessibility and finite SEM recognition do not establish defining/fuzzy/reconstructed recollection or broad affect-biased recall. LONG removes detail rather than reconstructing it.',
 'BELIEF and controlled AFFECT mitigation supply fallible estimates, contradiction and contingency operands. General attribution correction and scalar inference beyond the qualified lower-bound LEARN domain remain unqualified.',
 'Factor and grounded-response contrasts qualify bounded appraisal; general fear/social affect, deliberate reappraisal and salience/retrieval integration remain partial or absent.',
 'WORK qualifies finite distraction/protection and reminders. Habit resistance, inhibition/load, monitoring, fatigue, rumination and deliberate reappraisal are not implemented by that cache experiment.',
 'Retention and cue/expiry exist. Multiple strategies, strategy abandonment, procrastination, delay valuation and competing temporal goals require their own accepted public setup.',
 'SKILL qualifies performance belief/competence/impairment/practice; LONG adds event-sampled rust and execution after episode loss. These are bounded instances, not latent competence inference or automaticity laws.',
 'HABIT is availability under a neutral alternative. No joint dependence, substitute, craving, withdrawal, relapse or deliberate inhibition witness; ADAPT alone is not an addiction phenomenon.',
 'Two observers of one commitment are qualified. No general disposition/current-intent dissociation, second-order belief, fear-as-guilt or trust/hearsay inference.',
 'REL qualifies history specificity and a controlled rupture. No multidimensional affection/respect/comfort dissociation, grief, causal blame correction or reliance learning.',
 'Acquired identity feedback is effective in bounded fixtures. Cross-context generality, coercion exclusion, observer-specific self-concept, sustained transformation and dispositional adaptation remain incomplete.',
 'Controlled truthful/false statements and selective access are inputs. Target choice to lie/conceal, failed deception, emotional leakage and linguistic misunderstanding are not independently qualified.',
 'Intent/attempt/outcome and competence failure execute. External-actor intervention with differential witnessing and later causal explanation is not the joined experiment provided by a disable flag.',
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
const reportNames=fs.readdirSync(path.join(root,p)).filter(n=>/^(CAMPAIGN3_|GENERAL_ATTENTION_|GA_).*QUALIFICATION.*\.md$/.test(n));
const supplemental=[
 'CAMPAIGN3_FINAL_HISTORY_GATE.md','LEARN_IMPLEMENTATION_FINDINGS.md','LEARN_READINESS.md','EPI_IMPLEMENTATION_FINDINGS.md','EPI_READINESS.md','REASON_IMPLEMENTATION_FINDINGS.md','REASON_READINESS.md','DECISION_IMPLEMENTATION_FINDINGS.md','DECISION_COMPONENT_CHECKPOINT.md','COMMIT_IMPLEMENTATION_FINDINGS.md',
 'CAMPAIGN2_COMPLETION_REVIEW.md','CAMPAIGN2_COGNITIVE_QUALIFICATION.md','CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md',
 'CAMPAIGN3_ENTRY_READINESS.md','CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md','REFERENCE_MECHANISM_LEDGER.md',
 'CAMPAIGN3_BELIEF_PLAN.md','MULTISOURCE_EXPRESSIBILITY_AUDIT_2026_09_20.md','CAMPAIGN3_AFFECT_READINESS.md',
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
assert.equal(result.counts.bounded,16);assert.equal(result.counts.prior,3);assert.equal(result.counts.partial,2);assert.equal(result.counts.blocked,0);
result.snapshotRevision=7;
result.counters.highestAllocatedRecordType=970;
result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV6.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV6.json'),disposition:'Preserved pre-COMMIT inventory; REV7 changes COMMIT coverage without changing the corpus or historical snapshots. Revision-cap unchanged-disposition condition does not apply.'};
result.finalHistoricalGate={path:p+'CAMPAIGN3_FINAL_HISTORY_GATE.md',obligation:'RO-C3-021',status:'NOT SATISFIED',blocks:'Final Campaign3 exit; not admitted bounded implementation.'};
assert(registry.obligations.some(o=>o.id===result.finalHistoricalGate.obligation));
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,output),JSON.stringify(result,null,2)+'\n');
else assert.deepEqual(JSON.parse(read(output)),result,'Audit source inventory or denominator changed; review dispositions before regenerating.');
console.log('PASS: documentation audit denominator, source hashes, evidence paths and obligation references '+JSON.stringify(result.counts));
