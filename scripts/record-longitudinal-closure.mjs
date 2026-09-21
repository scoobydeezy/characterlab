import fs from 'node:fs';import assert from 'node:assert/strict';
const p='docs/planning/',receipt=JSON.parse(fs.readFileSync(p+'LONGITUDINAL_VALIDATION_CLOSURE_REV2.json'));assert.equal(receipt.status,'PASS');const registry=JSON.parse(fs.readFileSync(p+'RESEARCH_OBLIGATIONS.json'));assert(!registry.obligations.some(o=>o.id==='RO-C3-017'));
const verdict='VER-C3-LONG-001',report=p+'CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md',related=['RO-C3-009','RO-C3-013','RO-C3-016','RO-C3-017'],runs=receipt.publicRuns,restores=receipt.prefixRestores,tests=receipt.affectedTests,reference=receipt.referenceTests,advancing=restores-runs;
fs.writeFileSync(report,`# Bounded LONGITUDINAL qualification — 2026-09-21

**Disposition: COMPLETE / QUALIFIED under ${verdict}. LOCAL DISPOSITION; no owner ruling.**
**Stages A–E:** accepted successor, intact acquisition, competitors, public replay,
bounded verdict. Contract: longitudinal-public/0.2-candidate. Corpus0.29.0 unchanged.
PHEN-LONG-001 is qualified only in the declared finite three-family profile, not whole
Brief12.15, general autobiographical development or the whole campaign.

| Counter | Value |
|---|---|
| Highest allocated record type | 883 |
| Allocated since latest verdict/corpus member | 0 (21 this increment) |
| Qualified models / frozen files | 15 / 75 |
| Public runs / whole-prefix restores and continuations | ${runs} / ${restores} |
| Advancing / terminal continuation equalities | ${advancing} / ${runs} |
| Affected / reference tests | ${tests} / ${reference} |

## What the experiment establishes

One actor, one clock, one authoritative state and one atomic scheduler compose actual
biography acquisition, instructed practice and admitted directional relationship
learning. Initial identity/skill/relationship state is empty or zero. Public inputs
supply opportunities and controlled observations, never prelearned state. The retained
reason/dice/arbitration/intent/expression/qualification/ordered identity fold executes;
later matching standing changes effective choice probabilities. Practice follows
intent, plan, attempt and execution; skill changes separately from observed reports.

At the acquired-history checkpoint, identity is nonzero, skill is1/2 and two admitted
cooperations coexist. A committed gap expires all recent character episodes while
the compact model retains those learned distinctions. There is no full relationship
journal or archived-output reader behind the compact character state. Minimal identity
qualification contributions remain; this is not compression of every memory family.

Biography-only, skill-only and relationship-only controls exactly match their target
projections throughout the same input timeline. A skill-only interference subtracts
1/4 without altering identity or relationship. Renewed practice restores skill to1/2;
removing early practice instead leaves1/4 after the same later practice. Both have
already lost recent episodes. A matched difficulty1/4 probe succeeds with retained
skill but fails after rust or without early practice. This is actual execution, not
an inference from different capacity numbers alone.

StickyRupture and LatestInteraction remain distinct candidates. Reordering cooperation
and breach discriminates the latter; a positive person claim does not erase rupture.
Fixed positive displays under different physical social events produce identical
current diagnostic views and permit mistaken interpersonal history. Denial and mere
witnessing do not establish own participation. An absent estimate is distinct from
a false estimate. Later claims do not rewrite retained historical episode values or
frozen DecisionExpressions. Early addressed seeds can produce distinct biographies.

## Stage C representation and retention result

FullHistory and CompactRelationship agree on identity, skill, relationship projections
and effective biography decisions under both rupture laws across the tested horizon.
FullHistory retains its relationship detail journal. CompactRelationship holds an
incrementally updated count/rupture summary and only unexpired episodes. Their
accessible detail deliberately differs: equal learned projections are not equal
memories. Individual relationship records are NOT REQUIRED for these fixed future
folds over this horizon. No general episodic, person-model or relationship reduction
follows, and a later provenance-sensitive query would reopen the comparison.

EpisodicOnly loses relationship influence when its episodes expire. DestructiveSharedSlot
retains only the most recently updated acquired family and loses earlier identity/
skill when relationship learning writes its shared slot. These controls reject the
tested shortcuts; they do not prove that every alternative compact representation
fails. KeepAll and NoLearning are retained controls. NoRust and HalfAtGap are competing
event-sampled skill laws; neither is a general continuous forgetting/rust model.

## Evidence, ownership and boundaries

The main frozen matrix contains29 runs; a separate prospective plan adds three
execution/reacquisition probes. Every committed prefix, including S0 and terminal,
is restored by full re-execution and exact whole-save equality, then advanced one
instant or checked as a terminal no-op. Current view equality also holds on restore.
See LONGITUDINAL_PUBLIC_EXPERIMENT_REV2.json, LONGITUDINAL_EXECUTION_PROBE_REV1.json
and LONGITUDINAL_VALIDATION_CLOSURE_REV2.json for exact results and commitments.

Read domains and sole mutation authorities are audited. Every17 stage kinds plus
commit have reached-fault rollback after acquired history, including actual practice
and memory writes. Additional commit faults exercise actual identity/RNG changes and
episode deletion. State, queues, allocator, outputs, draws and trace restore together.
Forged saves, injected learned state, malformed originals, unknown fields, wrong
occurrence families and getter ingress reject. TypeScript, build and boundary checks
pass. No full active-suite claim.

The method named observerView exports a **holder-scoped research diagnostic**: it
includes actual competence. It is not evidence or a self-belief interface. Probe876
has no downstream consumers. Only probe, execution and procedural update read actual
skill; biography cognition cannot use it as knowledge. Hidden-interaction-truth
noninterference is qualified with skill inputs held fixed. No general privacy,
authentication, self-assessment or character-facing diagnostic admission is claimed.

## Failed construction and predecessor preserved

LONG-IMPL-001 preserves the adapter error where inherited capacity2 selected one task;
the contract required two. Correcting to capacity3 restored actual uncertainty and
identity acquisition without changing inherited semantics or model declarations.
LONG-FIND-002 preserves the separately frozen0.1 model cohort and a16-instant pair:
identity was acquired, but symmetric standing and unit1/4 failed the effective-choice
gate. All15 predecessor models remain admitted for replay. The two original terminal
save hashes are reproduced exactly by the final implementation.

The0.2 successor applies standing according to contrasting fixed choice alignment
and uses unit1/16. It is a named local matching/calibration candidate, not a general
identity law. LONG-FIND-003 preserves the original nondiscriminating practice difficulty
and separately frozen execution probes. LONG-SCOPE-004 preserves the diagnostic-versus-
knowledge limit. See LONGITUDINAL_IMPLEMENTATION_FINDINGS.md.

## North Star transfer and obligations

RETAINED: multiple acquired families can coexist without sharing a writable store;
losing episodic detail need not erase every acquired consequence of experience.
History compression must preserve the future questions it claims to answer, and
must be tested against lost-detail and relearning cases over the same horizon.

RO-C3-017 conditionally preserves longer horizons, alternate schedules, coupled
retention/recall/reconstruction, defining memories, developmental change, richer
social provenance and skill/identity feedback, capability self-belief and genuinely
character-facing evidence views. RO-C3-009/013/016 retain their broader obligations;
this narrow successor does not discharge them wholesale. No owner ruling is pending.
The next natural checkpoint is a Campaign3 coverage/exit-readiness audit against all
mandatory corpus clauses and outstanding obligations, not an automatic campaign PASS.
`,{flag:'wx'});
registry.scope='Seeded from Campaign3 verdicts and qualification reports, extended through VER-C3-LONG-001. Not a completed audit of all historical or Campaign0–2 limitations.';
registry.obligations.push({id:'RO-C3-017',title:'Longitudinal composition beyond the finite retained-summary profile',status:'CONDITIONAL',distinction:'Retained episodic detail, acquired identity/skill/relationship state, separate mutation ownership, and research diagnostics versus character knowledge',established:`${verdict} qualifies biography plus skill and relationship in one public timeline with15 models,${runs} runs and${restores} whole-prefix restores/continuations. Individual episodes expire while compact learned state survives; isolation, destructive storage, interference, relearning and actual execution probes discriminate.`,unresolved:'General lifelong/developmental behavior, arbitrary history compression, defining-memory individuality, reconstructive recall, source trust/provenance-sensitive relational queries, coupled family retention laws, capability self-belief, social-action/skill/identity feedback, broader identity matching and psychological calibration remain open. The observerView method is a holder-scoped research diagnostic that includes actual competence, not an admitted character evidence interface.',verdicts:[verdict],evidence:[report,p+'LONGITUDINAL_READINESS.md',p+'LONGITUDINAL_IMPLEMENTATION_FINDINGS.md',p+'LONGITUDINAL_STANDING_FAILURE_REV1.json',p+'LONGITUDINAL_WORKSPACE_CONSTRUCTION_FAILURE_REV1.json',p+'LONGITUDINAL_EXECUTION_PROBE_REV1.json',p+'LONGITUDINAL_PUBLIC_EXPERIMENT_REV2.json',p+'LONGITUDINAL_VALIDATION_CLOSURE_REV2.json','src/test/longitudinalPublic.test.ts','src/test/longitudinalBoundary.test.ts','src/test/longitudinalInspection.test.ts'],owner:'Longitudinal composition, memory/identity, procedural learning and relationship seams',reopenTrigger:'A longer/different temporal horizon, retention schedule or coupled family law; a new provenance-sensitive query, defining-memory/reconstruction/developmental phenomenon; proposed deletion of an acquired-family distinction; or admission of diagnostic actual competence to character cognition.',blocks:['Whole Brief12.15, lifelong equivalence or whole Campaign3 qualification','General compression or architecture-box deletion from finite fold equality','Treating research diagnostic competence as character knowledge','Universal signed identity matching, forgetting or rust laws'],doesNotBlock:'Completed bounded LONGITUDINAL and earlier bounded domains; Campaign3 coverage/exit-readiness audit.',closureRequirement:'Accept the appropriate successor contracts and compare matched public acquisition/retention horizons, isolated/composed/destructive controls, real detail loss and relearning, explicit evidence boundaries and all-prefix replay. Preserve LONG-IMPL-001 and LONG-FIND-002/003 counterexamples and LONG-SCOPE-004 diagnostic limits. Qualify every newly claimed family, feedback and horizon independently.',closure:null});
for(const id of related.slice(0,3)){const o=registry.obligations.find(o=>o.id===id);assert(o);o.verdicts.push(verdict);o.evidence.push(report);}
registry.verdictReviews.push({verdict,obligations:related});registry.reportReviews.push({path:report,obligations:related});fs.writeFileSync(p+'RESEARCH_OBLIGATIONS.json',JSON.stringify(registry,null,2)+'\n');
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`${verdict}\` — Acquired families across actual detail loss and relearning

- **Recorded:** 2026-09-21, LOCAL DISPOSITION; bounded LONGITUDINAL COMPLETE.
- **Contract:** longitudinal-public/0.2-candidate; records863..883, namespace1157;
  existing typed cognitive occurrences retain their meanings. Corpus0.29.0 unchanged.
- **Evidence:**15 frozen models/75 files,${runs} public runs,${restores} complete-prefix
  restores and continuation equalities (${advancing} advancing,${runs} terminal),
  ${tests} affected tests,${reference} reference tests, TypeScript/build/boundary checks.
  See CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md and LONGITUDINAL_VALIDATION_CLOSURE_REV2.json.
- **Witnesses:** actual biography/dice/identity plus skill and relationship acquisition;
  independent-family preservation; actual episode loss with surviving learned state;
  skill interference/relearning and discriminating execution; fallible social history;
  evidence gating, history order and committed gap interventions.
- **Competitors:** FullHistory, CompactRelationship, EpisodicOnly, DestructiveSharedSlot,
  isolated families, NoLearning, KeepAll, NoRust/HalfAtGap, two rupture laws, StandingOff.
- **Verdict:** RETAINED acquired-family ownership and learned structure beyond recent
  episodes. Rich relationship journal NOT REQUIRED for the fixed folds/horizon, with
  different accessible detail explicitly preserved. General compression/lifelong and
  psychological law claims UNRESOLVED. No architecture box is deleted.
- **Preservation:**15 nondiscriminating0.1 models remain frozen; two failed-gate public
  terminal saves replay exactly. Workspace capacity error, symmetric standing/calibration,
  nondiscriminating execution difficulty and diagnostic-versus-knowledge limits remain
  durable findings. No whole active-suite or Campaign3 PASS.
- **Obligations:** RO-C3-009/013/016/017 CONDITIONAL; no owner ruling pending.
- **Counters:** highest883; allocated since verdict0 (21 this increment).
`);
const prior=fs.readFileSync(p+'CURRENT.md','utf8');fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before LONGITUDINAL closure — 2026-09-21\n\n'+prior);
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated 2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded LONGITUDINAL is COMPLETE / QUALIFIED. No owner ruling is open.**
Start at [the qualification](CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md) and
[${verdict}](VERDICT_LEDGER.md). Earlier bounded domains stay complete.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **883** |
| Allocated since last verdict/corpus member | **0** (21 this increment) |
| Research obligations | **0 active / 17 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 23 verdicts** |
| Frozen qualified models / public runs | **15 / ${runs}** |
| Whole-prefix restores / continuation equalities | **${restores} / ${restores}** |
| Affected tests / preserved reference tests | **${tests} / ${reference}** |

Public biography, procedural skill and relationship learning coexist in one actor,
state and scheduler. Actual episode loss can leave compact learned structure intact;
interference and relearning distinguish retention models and later execution. Full
and compact relationship histories match their declared learned projections, while
their accessible details differ. Episodic-only and shared-slot shortcuts fail.

All17 stages and commit roll back; all prefixes restore and continue exactly.
The failed0.1 standing cohort remains frozen and its paired terminal saves replay.
The public inspection view includes actual skill: it is a holder-scoped research
diagnostic, not a character-knowledge/evidence interface. General compression,
developmental/lifelong claims and whole Campaign3 remain open under RO-C3-017 and
earlier obligations. TypeScript/build/boundary/research checks pass; no full-suite claim.

**Next natural large checkpoint:** Campaign3 coverage/exit-readiness audit against
mandatory corpus clauses and unresolved obligations. No further implementation is
implied by this bounded closure; do not declare whole Campaign3 complete automatically.

Corpus digest unchanged:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
const ledger=fs.readFileSync(p+'SEAM_LEDGER.md','utf8'),historical=ledger.indexOf('## Historical checkpoint');assert(historical>=0);fs.writeFileSync(p+'SEAM_LEDGER.md',`# Seam Ledger

**Current routing, 2026-09-21:** [state index](CURRENT.md), [LONGITUDINAL qualification](CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md), [verdict ledger](VERDICT_LEDGER.md). Corpus0.29.0 has21 members. Bounded LONGITUDINAL and earlier domains are complete; zero owner rulings. Counters883/0. Research obligations:0 active/17 conditional/0 unowned.

${verdict} qualifies biography plus skill and relationship across actual episode
loss, interference and relearning. Full/compact learned projections agree over the
declared horizon; episodic-only/shared-slot controls fail. RO-C3-017 retains wider
retention, development and knowledge-boundary obligations. Next: Campaign3 coverage/
exit-readiness audit; whole Campaign3 remains unqualified.

`+ledger.slice(historical));
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## 2026-09-21 — bounded LONGITUDINAL disposition

LONGITUDINAL_READINESS.md and ${verdict} port EXP-011/012 and MEC-012..018 through
actual reasons/dice/frozen expression/qualification/ordered identity and matching
standing feedback. P3-009/MEC-019 preserve instructed attempt/execution and independent
procedural learning; P3-006/007/012 preserve fallible directional history and rupture.
MEC-008/009/010 remain separate recall/association/reinforcement controls: the bounded
age cutoff and incremental relational fold do not replace them. EXP-013/P3-010 wider
lifecycle/development and RET-013 historical immutability remain preserved. No reference
import or architecture deletion. RO-C3-009/013/016/017 retain broader obligations.
The0.1 symmetric-standing failure, capacity adapter error, execution-threshold finding
and research-diagnostic boundary are preserved. Transfer: acquired structure may
outlast individual episodes, but compression must earn the future queries it preserves.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md',`\nLONGITUDINAL qualification uses the separately frozen0.2 successor; the0.1 cohort
remains replayable. Allocation bytes and record meanings are unchanged. ${verdict}
resets counters to883/0. No general compression or knowledge-view admission follows.\n`);
const agent=fs.readFileSync('AGENTS.md','utf8'),start=agent.indexOf('Campaign 3 is active: start at docs/planning/CURRENT.md'),end=agent.indexOf('`GENERAL_ATTENTION_RESUME_BRIEF.md`',start);assert(start>=0&&end>start);fs.writeFileSync('AGENTS.md',agent.slice(0,start)+`Campaign 3 is active: start at docs/planning/CURRENT.md and
CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md in that directory. Bounded LONGITUDINAL is
COMPLETE: ${verdict},15 models,${runs} public runs,${restores} whole-prefix restores/
continuations; counters883/0. Earlier bounded domains remain complete. RO-C3-017
preserves wider retention/development/knowledge boundaries; RO-C3-009/013/016 remain
conditional. No architecture distinction is deleted; no owner ruling is pending.
The inspection view includes actual competence and is not character evidence.
Next natural checkpoint: Campaign3 coverage/exit-readiness audit against all mandatory
corpus clauses. Do not silently equate bounded domain closures with whole Campaign3 PASS.
`+agent.slice(end));
const campaignPath='CharacterLab — Reference Architecture Build & Research Campaign Plan.md',campaign=fs.readFileSync(campaignPath,'utf8');assert(campaign.includes('Next natural frontier: PHEN-LONG-001 readiness and historical intake.'));fs.writeFileSync(campaignPath,campaign.replace('Next natural frontier: PHEN-LONG-001 readiness and historical intake.',`Bounded LONGITUDINAL is complete under ${verdict}:15 models,${runs} runs and${restores}
whole-prefix restores/continuations. See docs/planning/CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md.
Biography, skill and relationship coexist across actual episode loss/interference/
relearning; RO-C3-017 preserves broader scope. Next natural checkpoint: Campaign3
coverage/exit-readiness audit against mandatory corpus clauses and obligations.`));
console.log('Recorded '+verdict+' and RO-C3-017; counters883/0');
