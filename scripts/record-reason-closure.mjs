// Single-use qualification bookkeeping, gated by the final evidence integrity check.
import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/check-reason-closure.mjs'],{stdio:'inherit'});
const p='docs/planning/',read=f=>fs.readFileSync(f,'utf8'),verdict='VER-C3-REASON-001',report=p+'CAMPAIGN3_REASON_QUALIFICATION.md',closure=JSON.parse(read(p+'REASON_VALIDATION_CLOSURE_REV1.json')),passed=closure.tests[0].passed;
assert(!read(p+'VERDICT_LEDGER.md').includes('## `'+verdict+'`'),'already recorded');
fs.writeFileSync(report,`# Joined REASON checkpoint —2026-09-21

**Disposition: QUALIFIED / LOCAL DISPOSITION. Bounded REASON COMPLETE.**
**Stage: E, verdict VER-C3-REASON-001. Owner decision pending: no.**
Implements reason-public/0.3-candidate, records913..929/schema1, namespace1160.

| Counter | Value |
|---|---|
| Highest allocated record type | 929 |
| Allocated since this verdict | 0 (17 this increment) |

## What changed

PHEN-REASON-001/1.0.0-draft now has a joined public comparison covering exact
option/motive/referent keys, separate source roles/signs, collective redundancy,
zero-base exclusion, weak-motive rescue and one base die per resolved lawful key.
Five separately frozen models implement Aggregate, PooledChannel, PairwiseOnly,
PerFactDie and IdentityIndependentDie. No earlier C2, GA or MULTISOURCE bytes change.

Governed adopted-task mappings associate two permitted panel observations with
explicit motive/referent identities. The observations pass through actual current
SEM staging at10/14. Aggregate descriptions cite those same actual sample IDs;
they do not get a new independent fact by being described again. Raw source51 and
compilation52 retain complete descriptors, role/sign coverage and rejection traces.
No original accepts an authored signal, evidence basis, nucleus or learned identity.

Standing is acquired through actual two-option task choice, C2 dice and addressed
arbitration, intent, frozen expression, qualification and the sole identity writer.
The probe reads that history without updating it. All five models receive identical
raw sources and identical acquired history in every matched public case, verified
by exact record comparisons in the preservation suite. Training is common across
compilers. Qualification occurrence atoms remain distinct from panel observations.

## Exact findings and Stage C competitors

| Contrast | Aggregate result | Discriminating comparison |
|---|---|---|
| Same motive/referent, two independent samples | One nucleus; base17/29, d6 | PerFactDie creates two nuclei |
| Change only motive or referent | Two distinct active keys | PooledChannel collapses them to one |
| Bases3/4 on{1},2/3 on{2}, then1/4 on{1,2} | Last effective contribution0; base remains17/29 | PairwiseOnly adds1/8; base37/61, crossing to d8 |
| Zero base plus acquired standing | No nucleus | IdentityIndependentDie produces one from standing alone |
| Weak raw1/10 plus matching standing | Base stays1/11; one d4+1 activates | Without standing or with a different referent, no active nucleus |
| Weak base plus situation or context | Both can rescue; role totals remain distinct | Neither can manufacture a zero-base reason |
| Opposite base contributions | Resolve signed net before threshold; exact cancellation gives no die | No independent positive/negative dice in the lawful grouping |
| Avoid with standing modifier | Sign applies to the entire die-plus-modifier distribution | Exact negative of the matched Approach distribution |

The acquired standing fold uses declared K=1/100; bounded standing is68027/146054
in the one-training-step witness, giving integer modifier+1. This calibration makes
the receiving distinction measurable; it does not establish how quickly real
identity should form. The historical identity fold/rounding and authorship pipeline
remain unchanged. Pairwise is a cheaper serious hypothesis that fails this exact
collective-redundancy requirement. Pooled/per-fact/identity-die alternatives remain
explicit failing controls, not discarded provenance.

## Evidence and preservation

Model-rev3 contains5 models/20 image files. REASON_PUBLIC_EXPERIMENT_PLAN_REV3.json
was frozen before execution. REASON_PUBLIC_EXPERIMENT_REV3.json records115 public
runs and350 exact save-prefix restores/next continuations:235 advancing,115 terminal.
Twenty-three cases per model include hidden-state noninterference, denied channels,
untrained standing, two training choices across probes, signs, roles and key changes.
Whole-save comparison includes the explicit committed RNG address projection;
restoration also rebuilds the live session through exact prefix execution.

${passed} affected tests include21 REASON tests, all-case matched-source/history
equality, inherited reason math/arbitration, MULTISOURCE parity/coverage and LONG
public regressions.328 historical reference tests, TypeScript, production build,
reference boundary and obligation checks pass. Nine stages and final commit have
reached-fault rollback after actual learned history; malformed originals/state,
foreign schemas, duplicate descriptions, wrong owners and edited saves reject.
No full active-suite rerun is claimed. Closure hashes bind the executed source,
model/plan/result and validation receipts.

The preservation total combines66 passing checks from the concurrent suite with
one successful targeted retry. The latter exceeded the default5000ms while other
suites ran, so its explicit timeout became30000ms. Both receipts are linked by
REASON_PRESERVATION_TESTS_REV2.json; this is not a claim of a single67/67 run.

REASON_IMPLEMENTATION_FINDINGS.md preserves two failed cohorts. REV1 used an
unregistered current freeze phase and passed8/19 tests. REV2 corrected the phases
but passed16/19: one separated source was below activation and the new adapter's
explicit saved RNG-address projection was empty. REV3 strengthens matched source
fixtures and restores that projection; it does not lower the compiler threshold.
Old contracts, models, plans and test receipts remain intact and old models are
rejected by current admission. The corrected focused run passed19/19 before the
additional all-case parity and rejected-cohort tests were added.

## Scope and North Star transfer

The transfer is independent motivation without evidence multiplication: describing
one experience again must not silently add authority, and acquired standing may
modify an existing reason without creating a second motive. This supports Brief
12.2 motivational conflict and12.12 earned identity while preserving distinct
motivation, evidence, standing, reasons and arbitration boxes.

The symbolic task/panel mapping is an explicitly controlled identity-establishing
source. It is not learned motive recognition, general causal attribution, ordinary
language understanding or a solution to nonparticipant referents. Context modulation
is a separately traced bounded modifier here, not a universal contextual mechanism.
This qualifies one compilation plus the necessary acquired standing history, not
the full future behavior of arbitrary agents or all-domain cognition.

Aggregate weighted Jaccard remains a candidate: larger-union subset residuals,
arbitrary renaming/ties, general cross-role normalization and new source families
remain open. Ordinary input-array permutation is stable; no arbitrary identifier
renaming invariance is claimed. Direction is resolved after signed consolidation
in this profile; direction-as-identity alternatives and broad modifier/bracket
calibration remain unresolved. No reduction or universal reason law is selected.

## Obligations and next gate

RO-C3-018's exact bounded REASON clause is discharged; DECISION/COMMIT remain ACTIVE.
RO-C3-001 conditionally retains broader correlation/source laws, RO-C3-020 preserves
direction, attribution and calibration limits, and RO-C3-009 remains ACTIVE for the
unfulfilled whole BIO contrasts.4 active/17 conditional/0 unowned remain. Final
historical reconciliation RO-C3-021 is unsatisfied. No owner ruling is pending.

Corpus0.29.0 membership/digest is unchanged. Forward audit REV5 records14 bounded/
3 accepted prior/4 partial/0 blocked; earlier snapshots remain historical evidence.
This revision changes the coverage disposition, so the revision-cap rule's
unchanged-disposition condition is not triggered. Campaign3 is NOT EXIT-READY.
Next: DECISION's exact always/never/decorative/opaque comparator matrix, under the
same escalation policy and accepted model gates.
`,{flag:'wx'});
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`${verdict}\` — Independent reasons without duplicate evidence or identity dice

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded REASON COMPLETE.
- **Contract:**reason-public/0.3-candidate;913..929/schema1; namespace1160.
- **Corpus:**PHEN-REASON-001/1.0.0-draft, unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_REASON_QUALIFICATION.md;5 frozen models,115 public runs,
  350 exact prefix continuations; matched raw sources/history across every case.
- **Verdict:**RETAINED exact motive/referent/role distinctions and one base die
  per resolved reason. Aggregate collective redundancy contributes0; PairwiseOnly
  admits1/8. PooledChannel collapses separate motives/referents; PerFactDie adds
  description dice; IdentityIndependentDie violates zero-base exclusion.
- **Standing:**actual choice/expression/qualification history rescues a genuine
  weak motive with d4+1; neither standing nor situation creates a zero-base reason.
- **Limits:**controlled task/panel mapping; one compilation plus acquired history.
  UNRESOLVED universal coverage, direction identity, new roles/referents, arbitrary
  renaming and numeric calibration. No architectural reduction.
- **Preservation:**two failed model/plan/test cohorts retained and rejected;
  ${passed} affected/328 reference tests, type/build/boundary checks pass.
- **Obligations:**RO-C3-018 REASON clause discharged; DECISION/COMMIT still active.
  RO-C3-001/009/020 retain broader source, BIO, direction and calibration limits.
- **Reopen:**new source/role, causal nonparticipant, identity representation,
  coverage ordering or reduction. No owner decision pending.
- **Counters:**929/0 (17 allocated this increment).
`);
const rf=p+'RESEARCH_OBLIGATIONS.json',registry=JSON.parse(read(rf)),ids=['RO-C3-001','RO-C3-009','RO-C3-018','RO-C3-020'];
for(const id of ids){const o=registry.obligations.find(o=>o.id===id);o.verdicts.push(verdict);o.evidence.push(report,p+'REASON_IMPLEMENTATION_FINDINGS.md',p+'REASON_PUBLIC_EXPERIMENT_REV3.json',p+'REASON_VALIDATION_CLOSURE_REV1.json');}
const debt=registry.obligations.find(o=>o.id==='RO-C3-018');debt.established+=' VER-C3-REASON-001 supplies the joined exact semantic/coverage/role/modifier comparison with5 models/115 runs/350 prefix continuations.';debt.unresolved='Joined DECISION and COMMIT clause-complete comparisons remain unqualified. Bounded LEARN/EPI/REASON are complete; broader receiving laws remain RO-C3-001/020 and whole BIO remains RO-C3-009.';debt.owner='DECISION arbitration first; COMMIT lifecycle/social owner for its separate clauses';debt.closureRequirement='LEARN, bounded EPI and joined REASON are discharged by their C3 verdicts. Freeze and execute exact DECISION/COMMIT comparators, domains and horizons; preserve public/component distinctions.';
registry.obligations.find(o=>o.id==='RO-C3-001').established+=' REASON joins exact motive/referent/source-role and collective coverage comparisons with actual acquired standing; matched raw bytes are preserved across all five compilers.';
registry.obligations.find(o=>o.id==='RO-C3-009').established+=' REASON acquires actual qualified choice history and demonstrates weak-motive rescue versus zero-base exclusion at declared K=1/100; this is a bounded receiving witness, not whole BIO qualification.';
registry.obligations.find(o=>o.id==='RO-C3-020').established+=' REASON preserves and corrects failed phase/activation/save cohorts; signed direction is resolved before one-die compilation, without claiming direction-key or calibration necessity.';
registry.verdictReviews.push({verdict,obligations:ids});registry.reportReviews.push({path:report,obligations:ids});fs.writeFileSync(rf,JSON.stringify(registry,null,2)+'\n');
fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before bounded REASON closure —2026-09-21\n\n'+read(p+'CURRENT.md'));
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded REASON COMPLETE / QUALIFIED. Campaign3 remains NOT EXIT-READY.**
Start at [REASON qualification](CAMPAIGN3_REASON_QUALIFICATION.md), VER-C3-REASON-001
and [forward coverage register](CAMPAIGN3_EXIT_AUDIT_REV5.json). No owner ruling.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **929** |
| Allocated since last verdict/corpus member | **0** (17 this increment) |
| Research obligations | **4 active / 17 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 27 verdicts** |
| Coverage dispositions | **14 bounded / 3 accepted prior / 4 partial / 0 blocked** |
| Frozen models / public runs / prefix continuations | **5 / 115 / 350** |
| Affected / reference tests | **${passed} / 328** |

Joined REASON preserves exact motive/referent identity, role/sign partitions,
collective redundancy, zero-base exclusion and genuine weak-motive rescue. Actual
qualified choice history supplies standing. Four named alternatives are
distinguished under identical raw sources/history. Two failed cohorts survive.

RO-C3-018 retains DECISION/COMMIT; BODY ownership, BIO and broader Brief coverage
remain active. RO-C3-001/020 retain general correlation, direction and calibration
limits. Final-history RO-C3-021 remains unsatisfied. No full active-suite claim.

**Next:** DECISION's exact always/never/decorative/opaque comparator matrix under
the escalation policy, followed by remaining risk-ranked gaps. Corpus digest:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
fs.appendFileSync(p+'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md',`\n\n## Forward coverage update — bounded REASON,2026-09-21

VER-C3-REASON-001 supplies the joined semantic/coverage/modifier comparisons with
actual acquired standing. REV5 records14 bounded/3 prior/4 partial/0 blocked.
Earlier snapshots and the two failed REASON cohorts remain intact. Broad source,
direction, correlation and identity laws remain unresolved. Campaign3 NOT EXIT-READY.
Next DECISION comparator matrix; counters929/0. See CAMPAIGN3_REASON_QUALIFICATION.md.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\nCorrected reason-public/0.3-candidate retains the same913..929 allocation.\nVER-C3-REASON-001 qualifies the joined bounded comparison and resets counters929/0.\n');
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## Joined REASON port/control disposition —2026-09-21

VER-C3-REASON-001 and CAMPAIGN3_REASON_QUALIFICATION.md join MEC-012 exact semantic
keys, MEC-013 separate source roles, MEC-014 role/sign coverage then bounding,
MEC-015/016 actual dice/modifiers and weak-base rescue. EXP-009/014 now execute
together through permitted source observations and actual acquired standing.
MEC-017/018 supply genuine choice/expression/qualification/identity history;
MEC-022 preserves the two failed model/plan/test cohorts and their calibrations.
PooledChannel, PairwiseOnly, PerFactDie and IdentityIndependentDie remain explicit
comparators. No generic coverage law, direction identity or numeric calibration
is settled. Larger-union subset residual and arbitrary renaming limits survive
under RO-C3-001/020; whole BIO remains RO-C3-009. No reference imports or edits.929/0.
`);
console.log('Recorded bounded REASON closure.');
