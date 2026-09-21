import fs from 'node:fs';import assert from 'node:assert/strict';
const p='docs/planning/',receipt=JSON.parse(fs.readFileSync(p+'HABIT_VALIDATION_CLOSURE_REV1.json'));assert.equal(receipt.status,'PASS');
const registry=JSON.parse(fs.readFileSync(p+'RESEARCH_OBLIGATIONS.json'));assert(!registry.obligations.some(o=>o.id==='RO-C3-015'));
registry.scope='Seeded from Campaign 3 verdicts and qualification reports, extended through VER-C3-HABIT-001. Not a completed audit of all historical or Campaign 0-2 limitations.';
registry.obligations.push({id:'RO-C3-015',title:'Habit beyond availability-mediated acquisition and reversal',status:'CONDITIONAL',distinction:'Acquired action history, current explicit expectation, candidate availability, deliberate preference, identity, skill and physiological adaptation',established:'VER-C3-HABIT-001 qualifies bounded PHEN-HABIT-001 with 12 models,23 runs,291 complete-prefix restores/continuation equalities. Rewarded action history preserves target availability after corrective evidence makes expectation neutral; later observed negative action outcomes remove it. DerivedHistory and StoredSummary produce equal safe behavioral bytes under all three laws; a separate stored summary is not required in this domain.',unresolved:'General habit acquisition/extinction/threshold and reward laws, stronger deliberate counter-reasons, inhibition/control, broader cues/attribution, partial schedules, episodic or associative alternatives, compression, long horizons, identity/body/skill integration, substitutes, dependence, tolerance, withdrawal, craving and relapse remain unqualified. No architecture-box deletion or general memory/habit reduction follows.',verdicts:['VER-C3-HABIT-001'],evidence:[p+'HABIT_READINESS.md',p+'HABIT_IMPLEMENTATION_FINDINGS.md',p+'HABIT_PUBLIC_EXPERIMENT_REV1.json',p+'HABIT_VALIDATION_CLOSURE_REV1.json',p+'CAMPAIGN3_HABIT_QUALIFICATION.md','src/test/habitPublic.test.ts','src/test/habitBoundary.test.ts'],owner:'Habit learning, candidate construction, explicit expectation, control and embodied adaptation seams',reopenTrigger:'A stronger counter-motive or control demand, new cue or reward/source domain, partial reinforcement schedule, a proposed history compression or memory/habit reduction, identity/body/skill coupling, addiction/dependence or longer retention horizon.',blocks:['Whole Brief12.9 or general addiction qualification','Interpreting candidate availability as compulsive preference','Deleting habit/episodic/association/identity distinctions from the architecture on the basis of cache equivalence'],doesNotBlock:'Completed bounded HABIT, SOCIAL, SKILL, WORKSPACE/CONTROL, AFFECT, BELIEF, BODY/MULTISOURCE and GA; PHEN-REL-001 readiness.',closureRequirement:'Accept successor contracts and compare acquired-history effects under equal current belief and other contributors. Preserve current-reward-only, explicit-belief-only, NoHistory, serious learning laws and derived/stored alternatives. Independently qualify stronger preference/control, richer memory, body and addiction clauses when triggered.',closure:null});
registry.verdictReviews.push({verdict:'VER-C3-HABIT-001',obligations:['RO-C3-015']});registry.reportReviews.push({path:p+'CAMPAIGN3_HABIT_QUALIFICATION.md',obligations:['RO-C3-015']});fs.writeFileSync(p+'RESEARCH_OBLIGATIONS.json',JSON.stringify(registry,null,2)+'\n');
const prior=fs.readFileSync(p+'CURRENT.md','utf8');fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before HABIT closure — 2026-09-21\n\n'+prior);
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated 2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded HABIT is COMPLETE / QUALIFIED. No owner ruling is open.**
Start with [the qualification](CAMPAIGN3_HABIT_QUALIFICATION.md) and
[VER-C3-HABIT-001](VERDICT_LEDGER.md). Earlier bounded Campaign3 domains stay complete.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **841** |
| Allocated since last verdict/corpus member | **0** (25 this increment) |
| Research obligations | **0 active / 15 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 21 verdicts** |
| Frozen HABIT models / public runs | **12 / 23** |
| Whole-prefix restores / continuation equalities | **291 / 291** |
| Affected tests / preserved reference tests | **75 / 328** |

Admitted repeated action history changes cue-dependent candidate availability after
explicit expectation is corrected to neutral. Later observed unrewarded actions remove
that tendency. Hidden reward alone cannot correct safe history or expectation.
Residual and Linear laws differ in persistence; NoHistory and belief-only miss the
acquired-history contrast. CurrentRewardOnly fails hidden-truth noninterference.

DerivedHistory and StoredSummary have equal safe behavioral outputs under all three
laws. A separate stored tendency summary is NOT REQUIRED in this bounded domain;
no general habit/memory reduction or architecture-box deletion follows.

The result is availability-mediated persistence against a neutral alternative, not
compulsion against stronger reasons. Skill/identity/body contributors are fixed.
RO-C3-015 preserves broader habit, memory, control, integration and addiction limits.
Whole Brief12.9 and Campaign3 remain open.291 continuation checks comprise268 advancing
and23 terminal equalities. TypeScript/build/boundary/research checks pass. No full
active-suite claim. Findings are preserved in HABIT_IMPLEMENTATION_FINDINGS.md.

**Next natural large frontier:** PHEN-REL-001 readiness—dyadic history under equal
current person estimates. That implementation has not started. Longitudinal history
remains later work; do not reopen bounded closures without a named trigger.

Corpus digest unchanged:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
let agents=fs.readFileSync('AGENTS.md','utf8'),start=agents.indexOf('Campaign 3 is active: start at'),end=agents.indexOf('`GENERAL_ATTENTION_RESUME_BRIEF.md`',start);assert(start>=0&&end>start);agents=agents.slice(0,start)+`Campaign 3 is active: start at docs/planning/CURRENT.md and
CAMPAIGN3_HABIT_QUALIFICATION.md in that directory. Bounded HABIT is COMPLETE:
VER-C3-HABIT-001,12 frozen models,23 runs,291 complete-prefix restores/continuation
equalities; counters841/0. Earlier bounded GA, BODY/MULTISOURCE, BELIEF, AFFECT,
WORKSPACE/CONTROL, SKILL and SOCIAL stay complete. RO-C3-015 retains general habit,
memory/control/integration and addiction limits. Derived and cached tendency are
equivalent in this profile; no general memory reduction or architecture deletion.
ORD-002/TRC-003 have bounded SOCIAL snapshot/projection coverage, not global closure;
ORD-001/005 remain open outside qualified profiles. No owner ruling is pending.
Next natural frontier: PHEN-REL-001 readiness and historical intake. Do not reopen
completed bounded domains or implement from an external review alone.
`+agents.slice(end);fs.writeFileSync('AGENTS.md',agents);
let seams=fs.readFileSync(p+'SEAM_LEDGER.md','utf8'),h=seams.indexOf('## Historical checkpoint summaries');assert(h>0);seams=`# Seam Ledger

**Current routing, 2026-09-21:** [state index](CURRENT.md), [HABIT qualification](CAMPAIGN3_HABIT_QUALIFICATION.md), and [verdict ledger](VERDICT_LEDGER.md). Corpus0.29.0 has21 members. Bounded HABIT and prior Campaign3 domains are complete; zero owner rulings. Counters841/0. Research obligations:0 active/15 conditional/0 unowned.

Acquired history and explicit expectation remain distinct under VER-C3-HABIT-001.
History-dependent availability persists after correction, then changes with negative
experience. Derived/cache equivalence is bounded; RO-C3-015 retains broader claims.
PHEN-REL-001 readiness is next; implementation not started.

`+seams.slice(h);const marker='| Private commitment → permitted display';assert(seams.includes(marker));seams=seams.replace(marker,'| Admitted action history → cue-dependent candidate availability | habit-public/0.1-candidate; VER-C3-HABIT-001 | [Qualified bounded PHEN-HABIT-001](CAMPAIGN3_HABIT_QUALIFICATION.md):12 models,23 runs,291 restores; equal expectation/different acquired availability; derived/cache equality | RO-C3-015 retains stronger preference/control, memory alternatives, integration and addiction. |\n'+marker);fs.writeFileSync(p+'SEAM_LEDGER.md',seams);
const campaign='CharacterLab — Reference Architecture Build & Research Campaign Plan.md';let cp=fs.readFileSync(campaign,'utf8');const marker2='Next natural frontier: PHEN-HABIT-001 readiness and historical intake.';assert(cp.includes(marker2));cp=cp.replace(marker2,`Bounded HABIT is complete under VER-C3-HABIT-001:12 models,23 runs and291
complete-prefix restores/continuation equalities. See
docs/planning/CAMPAIGN3_HABIT_QUALIFICATION.md. Acquired history affects availability
independently of corrected expectation; derived and cached representations agree.
RO-C3-015 preserves stronger counter-reasons/control, memory equivalence, integration
and addiction. Next natural frontier: PHEN-REL-001 readiness and historical intake.`);fs.writeFileSync(campaign,cp);
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## 2026-09-21 — bounded HABIT disposition

HABIT_READINESS.md and VER-C3-HABIT-001 port EXP-003 context-conditioned action
availability and P3-012 acquisition/reversal. Historical flat-tag strengths remain
retired; Residual/Linear learning are explicit candidates. MEC-001/002/006 and CTL-002
preserve separate evidence-dependent expectation. MEC-008/009/010 association,
episodic accessibility and retrieval reinforcement remain distinct alternatives,
not silently identified with this profile's safe journal. MEC-012..019 reasons/dice,
intent/expression and identity controls are preserved; identity is fixed in this fixture.
CTL-009 universal options is not canonical: candidate availability is explicitly tested.
CTL-001 embodied Need, CTL-008 addiction and CTL-010 general experienced Reward remain
broader comparisons under RO-C3-015. No reference import or universal habit reduction.
DerivedHistory/StoredSummary equivalence earns a bounded NOT REQUIRED verdict for
the separate cached summary, not for historical influence itself.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md',`\n\n## HABIT successor — 2026-09-21

[HABIT_PUBLIC_ALLOCATION_TABLE.json](HABIT_PUBLIC_ALLOCATION_TABLE.json) accepts
records817..841, schema1, occurrence namespace1155 under
[habit-public/0.1-candidate](HABIT_PUBLIC_CONTRACT.md). Root821 belongs to
authority/habit-history, root823 to authority/reward-expectation, optional root825
to authority/habit-summary. Occurrences are profile-local, not implicit SEM experience
or ObservationRef237. No prior allocation or frozen bytes change. Counters841/25 before
verdict,841/0 after VER-C3-HABIT-001.
`);
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`VER-C3-HABIT-001\` — Acquired action availability after reward correction

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded HABIT COMPLETE.
- **Contract:** habit-public/0.1-candidate; records817..841, namespace1155.
  Separate history, expectation and optional derived-summary owners.
- **Corpus:** bounded PHEN-HABIT-0011.0.0-draft in unchanged corpus0.29.0.
  No whole Brief12.9 or Campaign3 claim.
- **Evidence:**12 frozen models/60 files,23 public runs,291 complete-prefix restores
  and continuations (268 advancing,23 terminal). See CAMPAIGN3_HABIT_QUALIFICATION.md
  and HABIT_VALIDATION_CLOSURE_REV1.json; exact single-field interventions audited.
- **Witnesses:** equal corrected expectation but different acquired candidate
  availability; persistence then change under negative observed action results;
  cue-specific retrieval; invisible execution without learning; false positive reports;
  hidden-reward noninterference and distinct unknown/negative state. Skill1, identity0
  and body-adaptation0 remain inspectable fixed controls, not dynamically integrated.
- **Competitors:** DerivedHistory/StoredSummary, Residual/Linear/NoHistory,
  ExplicitBeliefOnly and labelled violating CurrentRewardOnly. Two serious learning
  laws differ on later probabilities. Derived and cached safe behavior is byte-equal
  for all three laws. All comparison models remain frozen and replayable.
- **Verdict:** RETAINED acquired-history contribution independent of current belief;
  separate stored tendency summary NOT REQUIRED in this bounded domain. General
  learning/reward/threshold laws UNRESOLVED. No architecture-box deletion, general
  memory/habit equivalence or compulsive preference claim. Persistence operates through
  candidate availability under a neutral alternative, using inherited exact arbitration.
- **Validation:**75 affected tests,328 reference tests, TypeScript/build/boundary;
  all14 stages plus commit rollback after acquisition/correction, including random
  draws and intermediate cache mismatch. Failed initial type/evaluator checks retained
  in HABIT_IMPLEMENTATION_FINDINGS.md. No full active-suite claim.
- **Obligation:** RO-C3-015 CONDITIONAL for stronger reasons/control, richer cues,
  attribution and schedules, episodic alternatives, compression/long horizons,
  identity/body/skill integration and addiction/dependence/withdrawal/relapse.
  No architectural owner ruling pending.
- **Counters:** highest841; allocated since verdict0 (25 this increment).
`);
console.log('Recorded bounded HABIT; counters841/0; obligations0/15/0.');
