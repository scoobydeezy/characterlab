import fs from 'node:fs';import assert from 'node:assert/strict';
const p='docs/planning/',receipt=JSON.parse(fs.readFileSync(p+'RELATIONSHIP_VALIDATION_CLOSURE_REV2.json'));assert.equal(receipt.status,'PASS');
const registry=JSON.parse(fs.readFileSync(p+'RESEARCH_OBLIGATIONS.json'));assert(!registry.obligations.some(o=>o.id==='RO-C3-016'));
registry.scope='Seeded from Campaign 3 verdicts and qualification reports, extended through VER-C3-REL-001. Not a completed audit of all historical or Campaign 0-2 limitations.';
registry.obligations.push({id:'RO-C3-016',title:'Relationships beyond finite directional cooperation and rupture history',status:'CONDITIONAL',distinction:'Current person estimate, admitted dyadic history, relational appraisal, contact feasibility and prospective response',established:'VER-C3-REL-001 qualifies bounded PHEN-REL-001 with11 models,24 runs,256 complete-prefix restores/continuations. Equal current person estimates with different own histories change effective contact responses; a positive explanation changes estimate without erasing rupture; absence preserves history. Derived and stored summaries have equal observer views under both laws and processing orders.',unresolved:'General relationship formation/repair, trust/comfort/respect/attachment/reliance dimensions, ordinary recognition and causal attribution correction, asymmetric attachment, reconciliation, grief, long separation, richer person-model/history alternatives, compression, enacted reciprocal interaction, privacy tooling and identity/body/control integration remain unqualified. A complete-history cache equivalence does not delete architecture distinctions.',verdicts:['VER-C3-REL-001'],evidence:[p+'RELATIONSHIP_READINESS.md',p+'RELATIONSHIP_IMPLEMENTATION_FINDINGS.md',p+'RELATIONSHIP_CALIBRATION_AUDIT_REV1.json',p+'RELATIONSHIP_PUBLIC_EXPERIMENT_FAILURE_REV1.json',p+'RELATIONSHIP_PUBLIC_EXPERIMENT_REV2.json',p+'RELATIONSHIP_VALIDATION_CLOSURE_REV2.json',p+'CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md','src/test/relationshipPublic.test.ts','src/test/relationshipBoundary.test.ts'],owner:'Relationship learning, person-model, social appraisal, memory and interaction seams',reopenTrigger:'A new relational dimension or source/recognition/attribution domain, proposed person-model/relationship reduction, forgetting/compression, longer separation, attachment asymmetry, repair/grief, enacted reciprocal action or identity/body/control coupling.',blocks:['Whole Brief12.11 or universal relationship qualification','Treating witnessed shared-world events as another observer\'s personal history','Deleting relationship/person-model distinctions or discarding history based on summary equivalence','General ORD-002/TRC-003 closure'],doesNotBlock:'Completed bounded RELATIONSHIP, HABIT, SOCIAL, SKILL, WORKSPACE/CONTROL, AFFECT, BELIEF, BODY/MULTISOURCE and GA; PHEN-LONG-001 readiness.',closureRequirement:'Accept successor contracts and preserve matched person estimates with changed admitted own history, nonrecipient isolation, hidden-truth equivalence, rupture/explanation/absence distinctions and explicit/derived/person-only comparisons. Qualify each new attribution, relationship dimension, interaction and retention clause independently. Preserve SharedHistory\'s directional and simultaneous-participant failures and REL-FIND-005: the frozen0.1 zero-modifier cohort failed the behavioral gate despite changed appraisal records.',closure:null});
registry.verdictReviews.push({verdict:'VER-C3-REL-001',obligations:['RO-C3-016']});registry.reportReviews.push({path:p+'CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md',obligations:['RO-C3-016']});fs.writeFileSync(p+'RESEARCH_OBLIGATIONS.json',JSON.stringify(registry,null,2)+'\n');
const prior=fs.readFileSync(p+'CURRENT.md','utf8');fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before RELATIONSHIP closure — 2026-09-21\n\n'+prior);
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated 2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded RELATIONSHIP is COMPLETE / QUALIFIED. No owner ruling is open.**
Start with [the qualification](CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md) and
[VER-C3-REL-001](VERDICT_LEDGER.md). Earlier bounded Campaign3 domains stay complete.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **862** |
| Allocated since last verdict/corpus member | **0** (21 this increment) |
| Research obligations | **0 active / 16 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 22 verdicts** |
| Frozen RELATIONSHIP models / public runs | **11 / 24** |
| Whole-prefix restores / continuation equalities | **256 / 256** |
| Affected tests / preserved reference tests | **86 / 328** |

Equal current person estimates can accompany different admitted interpersonal histories
and different effective contact responses. Positive explanation changes a current estimate
without automatically repairing rupture. Absence changes feasibility without erasing
history. Witnessing another's interaction does not create one's own dyadic history.

DerivedHistory and StoredSummary have byte-equal observer views under both rupture laws
and both processing orders. A separate stored summary is NOT REQUIRED in the complete
finite-history domain. No general person-model/relationship reduction or compression
claim follows. RO-C3-016 preserves wider relational, attribution, grief and integration
questions; RO-C3-014/015 remain intact. Whole Brief12.11/Campaign3 remains open.

256 continuation checks comprise232 advancing and24 terminal equalities. TypeScript,
build, boundary and research checks pass. No full active-suite claim. Findings preserve
analytical/effective probability distinction, stable authored RNG roots, SharedHistory's
simultaneous-participant failure and rollback during an actual history/cache mutation.

**Next natural large frontier:** PHEN-LONG-001 readiness—public biography acquisition
plus at least two of skill, habit and relationship across retention/interference/relearning.
That implementation has not started. Do not reopen bounded closures without a trigger.

Corpus digest unchanged:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
let agents=fs.readFileSync('AGENTS.md','utf8'),start=agents.indexOf('Campaign 3 is active: start at'),end=agents.indexOf('`GENERAL_ATTENTION_RESUME_BRIEF.md`',start);assert(start>=0&&end>start);agents=agents.slice(0,start)+`Campaign 3 is active: start at docs/planning/CURRENT.md and
CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md in that directory. Bounded RELATIONSHIP is
COMPLETE: VER-C3-REL-001,11 models,24 runs,256 whole-prefix restores/continuations;
counters862/0. Earlier bounded GA, BODY/MULTISOURCE, BELIEF, AFFECT, WORKSPACE/CONTROL,
SKILL, SOCIAL and HABIT stay complete. RO-C3-016 preserves wider relationship,
attribution, grief, memory/compression and integration limits. Derived and cached
relationship summaries agree in this profile; no architecture distinction is deleted.
ORD-002/TRC-003 have bounded snapshot/projection coverage, not global closure;
ORD-001/005 remain open outside qualified profiles. No owner ruling is pending.
Next natural frontier: PHEN-LONG-001 readiness and historical intake. Do not reopen
completed bounded domains or implement from an external review alone.
`+agents.slice(end);fs.writeFileSync('AGENTS.md',agents);
let seams=fs.readFileSync(p+'SEAM_LEDGER.md','utf8'),h=seams.indexOf('## Historical checkpoint summaries');assert(h>0);seams=`# Seam Ledger

**Current routing, 2026-09-21:** [state index](CURRENT.md), [RELATIONSHIP qualification](CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md), and [verdict ledger](VERDICT_LEDGER.md). Corpus0.29.0 has21 members. Bounded RELATIONSHIP and earlier Campaign3 domains are complete; zero owner rulings. Counters862/0. Research obligations:0 active/16 conditional/0 unowned.

Current person estimates and admitted dyadic history remain distinct under VER-C3-REL-001.
Matched estimates/different histories change contact responses; explanation, rupture
and absence remain distinct. Derived/cache equivalence is bounded; RO-C3-016 retains
broader claims. PHEN-LONG-001 readiness is next; implementation not started.

`+seams.slice(h);const marker='| Admitted action history → cue-dependent';assert(seams.includes(marker));seams=seams.replace(marker,'| Admitted dyadic history + current person estimate → relational appraisal/response | relationship-public/0.2-candidate; VER-C3-REL-001 | [Qualified bounded PHEN-REL-001](CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md):11 models,24 runs,256 restores; matched estimates/different histories; observer isolation, rupture/explanation/absence | RO-C3-016 retains broader relationship dimensions, attribution, grief, enacted interaction and compression. |\n'+marker);fs.writeFileSync(p+'SEAM_LEDGER.md',seams);
const campaign='CharacterLab — Reference Architecture Build & Research Campaign Plan.md';let cp=fs.readFileSync(campaign,'utf8');const marker2='Next natural frontier: PHEN-REL-001 readiness and historical intake.';assert(cp.includes(marker2));cp=cp.replace(marker2,`Bounded RELATIONSHIP is complete under VER-C3-REL-001:11 models,24 runs and256
complete-prefix restores/continuation equalities. See
docs/planning/CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md. Equal person estimates with
different own histories change effective contact responses; derived/stored summaries
agree. RO-C3-016 preserves broader relationship, attribution, grief and integration.
Next natural frontier: PHEN-LONG-001 readiness and historical intake.`);fs.writeFileSync(campaign,cp);
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## 2026-09-21 — bounded RELATIONSHIP disposition

RELATIONSHIP_READINESS.md and VER-C3-REL-001 port P3-006 observer-local evidence,
P3-007 derived relational appraisal candidates and P3-012 bounded rupture. P3-008
embarrassment/jealousy and P3-012 grief/loss remain future phenomena. MEC-004 is a
controlled identity channel; MEC-008/009/010 general memory/association alternatives
remain distinct from this finite journal. MEC-011/EXP-004 preserve contact feasibility
versus historical appraisal. MEC-012..018 reason/modifier/dice/identity controls remain
preserved; modifiers never generate motivation from zero. MEC-019 marks response
selection as prospective, not executed interaction. EXP-008 hidden-truth equivalence
passes. RO-C3-016 preserves broader integration and attribution/repair claims.
SharedHistory's nonrecipient leak and simultaneous-participant ordering failure are
durable diagnostic findings. Derived/cache equality does not delete relationship
history or reduce it to the tested current person estimate.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md',`\n\n## RELATIONSHIP successor — 2026-09-21

[RELATIONSHIP_PUBLIC_ALLOCATION_TABLE.json](RELATIONSHIP_PUBLIC_ALLOCATION_TABLE.json)
accepts842..862/schema1, occurrence namespace1156 under
[relationship-public/0.2-candidate](RELATIONSHIP_PUBLIC_CONTRACT_REV2.md). Root848 belongs
to authority/relationship-history, root850 to authority/person-model, optional root852
to authority/relationship-summary. Existing808 keys identify each holder/local target.
Content861 enumerates48 authored1038 probe roots for observer/order-stable random
addresses. Profile occurrences are not implicit SEM experiences or ObservationRef237.
No predecessor allocation/frozen bytes change. Counters862/21 before verdict,862/0 after.
`);
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`VER-C3-REL-001\` — Dyadic history beyond current person estimates

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded RELATIONSHIP COMPLETE.
- **Contract:** relationship-public/0.2-candidate; records842..862, namespace1156.
  Independently keyed history/person/cache authorities; fixed identity/body0,skill1.
- **Corpus:** bounded PHEN-REL-0011.0.0-draft, unchanged corpus0.29.0. No whole
  Brief12.11, general ordering/privacy, or Campaign3 qualification.
- **Evidence:**11 frozen models/55 files,24 public runs,256 whole-prefix restores
  and continuations (232 advancing,24 terminal), including observer-view equality.
  See CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md and RELATIONSHIP_VALIDATION_CLOSURE_REV2.json.
- **Witnesses:** exactly matched same-observer person estimate/different admitted
  history changes effective contact response; rupture survives positive explanation;
  absence changes feasibility without erasure; witnesses do not inherit participants'
  histories; hidden-source and nonrecipient exact view equality. Analytical score-win
  and effective Auto/roll probabilities are distinguished. No executed-action claim.
- **Competitors:** DerivedHistory/StoredSummary, PersonEstimateOnly, StickyRupture/
  LatestInteraction. SharedHistory and DirectTruth fail named contrasts; SharedHistory
  also fails transactionally with two simultaneous participants. Reverse-order semantic
  views and actual draws agree under frozen authored probe roots.
- **Verdict:** RETAINED history-relative appraisal distinct from the tested current
  person estimate. Separate stored summary NOT REQUIRED in the complete finite journal
  domain. General relational dimensions/learning/repair laws UNRESOLVED. No architecture
  deletion, general person-model reduction, episodic equivalence or compression claim.
- **Validation:**86 affected tests,328 reference tests, TypeScript/build/boundary;
  all17 stages plus commit reached-fault rollback during an actual rupture/cache change.
  Own-key and forbidden-view audits pass. The0.1 cohort failed effective-response
  discrimination because unit1 truncated bounded modifiers to0. It remains frozen
  and replayable; the0.2 successor uses existing unit1/4 calibration. Findings are preserved in
  RELATIONSHIP_IMPLEMENTATION_FINDINGS.md. No full active-suite claim.
- **Obligation:** RO-C3-016 CONDITIONAL for richer dimensions, recognition/attribution,
  asymmetric attachment, reconciliation, grief, longer separation, memory/compression,
  enacted reciprocal interaction and identity/body/control integration. No owner ruling.
- **Counters:** highest862; allocated since verdict0 (21 this increment).
`);
console.log('Recorded bounded RELATIONSHIP; counters862/0; obligations0/16/0.');


