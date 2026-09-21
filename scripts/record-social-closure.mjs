import fs from 'node:fs';import assert from 'node:assert/strict';
const p='docs/planning/',receipt=JSON.parse(fs.readFileSync(p+'SOCIAL_VALIDATION_CLOSURE_REV1.json'));assert.equal(receipt.status,'PASS');
const registry=JSON.parse(fs.readFileSync(p+'RESEARCH_OBLIGATIONS.json'));assert(!registry.obligations.some(o=>o.id==='RO-C3-014'));
registry.scope='Seeded from Campaign 3 verdicts and qualification reports, extended through VER-C3-SOCIAL-001. Not a completed audit of all historical or Campaign 0-2 limitations.';
registry.obligations.push({id:'RO-C3-014',title:'Social inference beyond the controlled two-observer commitment profile',status:'CONDITIONAL',distinction:'Target private state, observer-permitted communication, observer-owned person belief, source correlation and relationship history',established:'VER-C3-SOCIAL-001 qualifies bounded PHEN-SOCIAL-001 with 18 frozen models, 26 runs and 127 complete-prefix restores/continuation equalities. Fixed displays hide private commitment; selective fallible explanations alter only recipient belief; repeated receipts do not supply independent corroboration.',unresolved:'Ordinary recognition, trust/source quality, uncertain correlation, hearsay, richer person states and dispositions, nested beliefs, relationship history, downstream social appraisal/actions, reciprocal interaction and general privacy tooling remain unqualified. Snapshot ordering and closed observer projection do not close general ORD-002/TRC-003.',verdicts:['VER-C3-SOCIAL-001'],evidence:[p+'SOCIAL_READINESS.md',p+'SOCIAL_IMPLEMENTATION_FINDINGS.md',p+'SOCIAL_PUBLIC_EXPERIMENT_REV1.json',p+'SOCIAL_VALIDATION_CLOSURE_REV1.json',p+'CAMPAIGN3_SOCIAL_QUALIFICATION.md','src/test/socialPublic.test.ts','src/test/socialBoundary.test.ts'],owner:'Person-model, communication, interaction-ordering and epistemic projection seams',reopenTrigger:'A new communication or recognition channel, hidden source correlation, source reliability, another person-model proposition, nested or reciprocal inference, relationship coupling, social appraisal/action or a new projection consumer.',blocks:['Whole Brief12.10/12.13 or universal SOCIAL qualification','General ORD-002/TRC-003 closure','Treating communication as truth transfer or person belief as relationship history'],doesNotBlock:'Completed bounded SOCIAL, SKILL, WORKSPACE/CONTROL, AFFECT, BELIEF, BODY/MULTISOURCE and GA; PHEN-HABIT-001 readiness.',closureRequirement:'Accept successor contracts and run private-only/access-only/explanation-only pairs preserving observer isolation, mistaken inference and correction, false explanation, correlation and alternative learners. Qualify newly exercised ordering, recognition, relationship and privacy clauses independently.',closure:null});
registry.verdictReviews.push({verdict:'VER-C3-SOCIAL-001',obligations:['RO-C3-014']});registry.reportReviews.push({path:p+'CAMPAIGN3_SOCIAL_QUALIFICATION.md',obligations:['RO-C3-014']});fs.writeFileSync(p+'RESEARCH_OBLIGATIONS.json',JSON.stringify(registry,null,2)+'\n');
const prior=fs.readFileSync(p+'CURRENT.md','utf8');fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before SOCIAL closure — 2026-09-21\n\n'+prior);
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated 2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded SOCIAL is COMPLETE / QUALIFIED. No owner ruling is open.**
Start with [the qualification](CAMPAIGN3_SOCIAL_QUALIFICATION.md) and
[VER-C3-SOCIAL-001](VERDICT_LEDGER.md). Earlier bounded Campaign3 domains stay complete.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **816** |
| Allocated since last verdict/corpus member | **0** (14 this increment) |
| Research obligations | **0 active / 14 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 20 verdicts** |
| Frozen SOCIAL models / public runs | **18 / 26** |
| Whole-prefix restores / continuation equalities | **127 / 127** |
| Affected tests / preserved reference tests | **67 / 328** |

Observer-owned estimates follow permitted evidence rather than target-private truth.
Selective explanations can correct one observer while the other's complete view
remains byte-identical. Explanations can also be false. Repeated visible receipts do
not independently corroborate. SourceGroupedMean, LastStatement and NoLearning remain
distinct; global belief, private truth reading and presentation counting fail controls.

The profile uses controlled identity and one fixed commitment proposition. ORD-002
is bounded-qualified for snapshot fan-out; TRC-003 for a closed observer projection.
General simultaneous interaction and privacy tooling stay open. RO-C3-014 preserves
trust, hearsay, uncertain correlation, richer social inference and relationship limits.
No whole Brief12.10/12.13 or Campaign3 completion is claimed.

127 continuation checks comprise101 advancing and26 terminal equalities. TypeScript,
build, boundary and research checks pass. Initial fixture/evaluator failures remain
documented in SOCIAL_IMPLEMENTATION_FINDINGS.md. No full active-suite claim.

**Next natural large frontier:** PHEN-HABIT-001 readiness and historical intake,
then relationship and longitudinal history. That implementation has not started.
Do not reopen completed bounded domains without a named phenomenon or trigger.

Corpus digest unchanged:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
let agents=fs.readFileSync('AGENTS.md','utf8'),start=agents.indexOf('Campaign 3 is active: start at'),end=agents.indexOf('`GENERAL_ATTENTION_RESUME_BRIEF.md`',start);assert(start>=0&&end>start);agents=agents.slice(0,start)+`Campaign 3 is active: start at docs/planning/CURRENT.md and
CAMPAIGN3_SOCIAL_QUALIFICATION.md in that directory. Bounded SOCIAL is COMPLETE:
VER-C3-SOCIAL-001,18 frozen models,26 public runs,127 whole-prefix restores and
continuation equalities; counters816/0. GA, BODY/MULTISOURCE, BELIEF, AFFECT,
WORKSPACE/CONTROL and SKILL stay complete. RO-C3-014 preserves wider social inference,
recognition, trust, relationships, reciprocal interaction and privacy tooling.
ORD-002/TRC-003 have bounded snapshot/projection coverage, not global closure;
ORD-001/005 remain open outside qualified profiles. No owner ruling is pending.
Next natural frontier: PHEN-HABIT-001 readiness and historical intake. Do not reopen
completed bounded domains or implement from an external review alone.
`+agents.slice(end);fs.writeFileSync('AGENTS.md',agents);
let seams=fs.readFileSync(p+'SEAM_LEDGER.md','utf8'),h=seams.indexOf('## Historical checkpoint summaries');assert(h>0);seams=`# Seam Ledger

**Current routing, 2026-09-21:** [state index](CURRENT.md), [SOCIAL qualification](CAMPAIGN3_SOCIAL_QUALIFICATION.md), and [verdict ledger](VERDICT_LEDGER.md). Corpus0.29.0 has21 members. Bounded SOCIAL and prior Campaign3 domains are complete; zero owner rulings. Counters816/0. Research obligations:0 active/14 conditional/0 unowned.

Independent person estimates, private-state noninterference and fallible selective
communication are retained under VER-C3-SOCIAL-001. ORD-002/TRC-003 have bounded
snapshot/projection coverage only. RO-C3-014 preserves wider social/integration claims.
PHEN-HABIT-001 readiness is next; implementation not started.

`+seams.slice(h);const marker='| Practice → actual skill';assert(seams.includes(marker));seams=seams.replace(marker,'| Private commitment → permitted display → observer-owned person estimate | social-public/0.1-candidate; VER-C3-SOCIAL-001 | [Qualified bounded PHEN-SOCIAL-001](CAMPAIGN3_SOCIAL_QUALIFICATION.md):18 models,26 runs,127 restores; fallible correction and exact nonrecipient isolation | RO-C3-014 retains trust, recognition, relationships, reciprocal ordering and wider projection. |\n'+marker);fs.writeFileSync(p+'SEAM_LEDGER.md',seams);
const campaign='CharacterLab — Reference Architecture Build & Research Campaign Plan.md';let cp=fs.readFileSync(campaign,'utf8');const marker2='Next natural frontier: PHEN-SOCIAL-001 readiness and historical intake.';assert(cp.includes(marker2));cp=cp.replace(marker2,`Bounded SOCIAL is complete under VER-C3-SOCIAL-001:18 models,26 runs and127
complete-prefix restores/continuation equalities. See
docs/planning/CAMPAIGN3_SOCIAL_QUALIFICATION.md. Private commitment, permitted display,
observer-owned belief and correlation remain distinct. RO-C3-014 preserves broader
social inference, relationships, recognition, reciprocal ordering and privacy tooling.
Next natural frontier: PHEN-HABIT-001 readiness and historical intake.`);fs.writeFileSync(campaign,cp);
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## 2026-09-21 — bounded SOCIAL disposition

SOCIAL_READINESS.md and VER-C3-SOCIAL-001 port P3-006's observer-specific person models,
wrong inference, correction and correlation; EXP-008 hidden-state noninterference;
MEC-001/002/006 evidence controls; MEC-019/020 public outcome/private commitment.
MEC-004 is an explicit identity-establishing control only. P3-007 trust/suspicion and
P3-008 social affect remain future candidates under RO-C3-014, not silently omitted.
MEC-012..018 reason/dice/expression/identity controls remain preserved. No reference
imports or reduction to relationship history. Communication is evidence for each
recipient's own model; it neither copies private truth nor synchronizes observers.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md',`\n\n## SOCIAL successor — 2026-09-21

[SOCIAL_PUBLIC_ALLOCATION_TABLE.json](SOCIAL_PUBLIC_ALLOCATION_TABLE.json) accepts
records803..816, schema1, occurrence namespace1154 under
[social-public/0.1-candidate](SOCIAL_PUBLIC_CONTRACT.md). Root810 is owned by
authority/person-model with separate holder/local-target keys. Target task373 is
read-only in this profile. Occurrences are profile-local, not implicit SEM experiences.
No predecessor allocations or frozen bytes change. Counters816/14 before verdict,
816/0 after VER-C3-SOCIAL-001.
`);
fs.appendFileSync('docs/formal/OPEN_DECISIONS.md',`\n\n## Bounded SOCIAL ordering and projection — 2026-09-21

SOCIAL_PUBLIC_CONTRACT.md and VER-C3-SOCIAL-001 accept and qualify immutable source
snapshot fan-out, disjoint observer updates and reversed-order semantic equality.
This discharges ORD-002's prerequisite for this first multi-character fixture only.
Reciprocal decisions and conflicting simultaneous interactions remain OPEN.
ObserverView814 passes forbidden-field and full-read-path audits, discharging TRC-003
for this closed projection. Research save/trace remains omniscient; general UI tooling,
authentication and new consumers remain OPEN. RO-C3-014 preserves both broader scopes.
LOCAL DISPOSITION under the escalation policy; no owner ruling was required.
`);
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`VER-C3-SOCIAL-001\` — Observer-owned person models and fallible communication

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded SOCIAL COMPLETE.
- **Contract:** social-public/0.1-candidate; records803..816, namespace1154;
  authority/person-model with independently keyed observers. Target task373 unchanged.
- **Corpus:** bounded PHEN-SOCIAL-0011.0.0-draft, corpus0.29.0's unchanged21 members.
  No whole Brief12.10/12.13 or Campaign3 claim.
- **Evidence:**18 frozen models/90 files,26 runs,127 complete-prefix restores and
  continuation equalities (101 advancing,26 terminal). See
  CAMPAIGN3_SOCIAL_QUALIFICATION.md and SOCIAL_VALIDATION_CLOSURE_REV1.json.
- **Witnesses:** fixed displays/opposite private commitment yield exact observer views;
  selective truthful or false explanation changes recipient belief only; wrong initial
  inference and later correction; unknown/zero; visible receipt deduplication; reversed
  observer processing with semantic equality. Exact input interventions are audited.
- **Competitors:** SourceGroupedMean, LastStatement, NoLearning remain distinct.
  GlobalPersonModel, DirectPrivateReader and PresentationCounting fail named contrasts.
- **Verdict:** RETAINED observer ownership, epistemic separation, fallible evidence and
  source correlation. UNRESOLVED general social-learning laws; no global belief or
  relationship reduction. Controlled identity channel and one fixed commitment only.
- **Validation:**67 affected tests,328 reference tests, TypeScript/build/boundary checks;
  every stage and commit rollback after learning; closed observer projection and exact
  own-key reads. Initial fixture/evaluator failures retained in SOCIAL_IMPLEMENTATION_FINDINGS.md.
  No full active-suite claim. ORD-002/TRC-003 bounded-qualified, globally OPEN.
- **Obligation:** RO-C3-014 CONDITIONAL for richer recognition, trust, hearsay, uncertain
  correlation, target states, relationships, social action, reciprocal interaction and
  privacy tooling. No architectural decision or owner ruling pending.
- **Counters:** highest816; allocated since verdict0 (14 this increment).
`);
console.log('Recorded bounded SOCIAL; counters816/0; obligations0/14/0.');
