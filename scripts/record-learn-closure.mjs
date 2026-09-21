// Single-use forward checkpoint writer. Never overwrites earlier audit/run receipts.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/check-learn-closure.mjs'],{stdio:'inherit'});
const p='docs/planning/';
const read=f=>fs.readFileSync(f,'utf8');
const report=p+'CAMPAIGN3_LEARN_QUALIFICATION.md';
const verdict='VER-C3-LEARN-001';
assert(!read(p+'VERDICT_LEDGER.md').includes('## `'+verdict+'`'),'already recorded');
fs.writeFileSync(report,`# Bounded LEARN qualification — 2026-09-21

**COMPLETE / QUALIFIED in the declared PHEN-LEARN-001 domain.** LOCAL DISPOSITION;
zero owner rulings. Implements learn-public/0.1-candidate, records884..896,
namespace1158. Highest896; allocations since this verdict0 (13 this increment).
Corpus0.29.0 and its21-member digest are unchanged.

## Public evidence

Six frozen models/24 image files compare Gated, UnconditionalPrecision and PointOnly,
each under exact rational and separately named millionth-lattice commit arithmetic.
The model identity's learn-exact-rational/0.1-candidate numeric-family label covers
exact rational operations; the committed NumericProfile selects whether commit
rounding occurs. Lattice runs are not represented as unquantized results.
LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json was frozen before public execution.
LEARN_PUBLIC_EXPERIMENT_REV1.json records39 public runs and580 exact whole-prefix
restores/continuations:541 advancing and39 terminal. Exact byte comparisons precede
receipt hashes. LEARN_VALIDATION_CLOSURE_REV1.json binds models, source, plan and tests.

Public original bounded-effect experiments produce permitted point/lower-bound
samples, actual SEM staging, phase130 evidence, sole-owner140 learning and a later50
probe. Empty initial state acquires the established precision50 priors through25
point observations at precision2. The learner receives no actual potential/overflow.
There is no authored belief, direct point/bound evidence input, current-lane learning,
Need-specific confidence formula or new body ownership model.

| Required contrast | Exact-rational Gated result | Comparison |
|---|---|---|
| Prior2/5,50 then bound1/10 | Entire retained leaf unchanged | UnconditionalPrecision keeps mean but grows precision52 |
| Prior1/20,50 then bound1/10 | Mean27/520, precision52 | PointOnly retains1/20,50 and fails informative-bound learning |
| Fresh nonnegative reference with bound0 | Unknown stays absent; no precision | UnconditionalPrecision manufactures a known0,precision2 leaf |
| Six bounds1/10 then point21/50 | First bound gives1/10,2; next five preserve exact leaf; point gives13/50,4 | UnconditionalPrecision reaches precision12 before point, then51/350,14; final point moves less |

The positive-established zero-bound control also preserves precision50. Hidden
potential1/10 versus4/5 with the same saturated measurement produces identical
complete safe outputs and learned state under all six models; truth traces differ.
Denied observations do not create zero evidence. Two-target source/owner composition
executes. Earlier probes remain unknown until the next instant after learning.

The lattice branch records raw27/520 and committed51923/1000000 for the inconsistent
case. Raw/final numeric witnesses live in application892; the generic trace
quantization list is empty by the explicit contract, not proof that no rounding
occurred. Exact and lattice laws remain distinct candidates.

## Limits and durable finding

Repeated-bound rejection is demonstrated for the exact fresh-prior CaseD. With an
established mean below the same bound, the Gated candidate can repeatedly accept it:
the supplementary six-bound run ends at precision62. This is not universal source
deduplication or calibrated censored-likelihood inference. Accepted bounds still
receive full point-like precision, the historical approximation. Unknown state and
known zero remain different; no confidence-in-correctness interpretation is earned.

Upper bounds, decay, richer posterior distributions, correlated sources, calibrated
uncertainty, surprise consumers, ordinary interoception and broader causal learning
remain RO-C3-010. This experiment qualifies the lower-bound phenomenon, not all
Brief12.4 or the exact broader EPI composed saturation experiment.

RETAINED: permitted classification/measurement, informativeness and precision credit
must remain separately accountable; compatible or zero-information bounds cannot
manufacture precision in this tested domain. PointOnly is a safe but insufficient
alternative; UnconditionalPrecision remains a retired negative control. UNRESOLVED:
general censored update/precision and numeric laws. No architecture reduction.

LEARN_IMPLEMENTATION_FINDINGS.md preserves the failed18/19 first test receipt and
correct-forward lattice assertion fix, plus the repeated-established-prior limit.
No frozen model, contract or input was changed by the fix.

## Validation and handoff

44 affected tests (including19 LEARN),328 reference tests, TypeScript and production
build pass. All six stages and final commit have reached-fault rollback after a
learned prefix. Admission, typed-codec, unrelated-writer, malformed evidence and
whole-save corruption controls pass. No full active-suite rerun is claimed.

RO-C3-018 remains ACTIVE for exact EPI/REASON/DECISION/COMMIT comparisons; its LEARN
public-realization debt is discharged. RO-C3-010 conditionally owns broader scalar
inference and the preserved limitations. The current corpus disposition becomes
12 bounded qualifications/3 accepted prior scopes/6 partial/0 blocked, with no
change in membership. Earlier audit snapshots remain immutable; the forward REV3
register records this bounded change. Campaign3 is NOT EXIT-READY. RO-C3-021's
canonical historical reconciliation remains unsatisfied.

Next natural checkpoint: exact EPI saturation-pair receiving-horizon readiness,
followed by the remaining risk-ranked clause-complete comparisons. No owner ruling.
`,{flag:'wx'});
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`${verdict}\` — Informative scalar censoring without precision manufacture

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded LEARN COMPLETE.
- **Contract:**learn-public/0.1-candidate;884..896/schema1, namespace1158.
- **Corpus:**PHEN-LEARN-0011.0.0-draft in unchanged corpus0.29.0; no whole Brief12.4 pass.
- **Evidence:**CAMPAIGN3_LEARN_QUALIFICATION.md;6 models,39 runs,580 exact prefix
  restores/continuations; LEARN_PUBLIC_EXPERIMENT_REV1.json and closure receipt.
- **Verdict:**RETAINED informativeness/precision and epistemic distinctions;
  UNRESOLVED general update/precision/quantization laws. Gated satisfies the four
  lower-bound contrasts. PointOnly misses inconsistent-bound learning;
  UnconditionalPrecision fails compatible/zero/repeated-bound controls.
- **Limits:**fresh-prior repetition is not universal deduplication; established
  below-bound repetition still grows precision. Full point-like credit for accepted
  bounds remains an approximation. Exact and lattice candidates remain distinct.
- **Preservation:**failed lattice assertion receipt preserved;44 affected/328
  reference tests and build/type/boundary pass. No full active-suite claim.
- **Obligations:**RO-C3-018 LEARN clause discharged; other mandatory gaps stay ACTIVE.
  RO-C3-010 retains upper/decay/source/uncertainty and repeated-bound limitations.
- **Reopen:**new scalar domain, upper bounds, decay, correlation, accepted-bound
  precision requirement or richer posterior. No architectural ruling pending.
- **Counters:**896/0 (13 allocated this increment).
`);
const rf=p+'RESEARCH_OBLIGATIONS.json',registry=JSON.parse(read(rf));
for(const id of ['RO-C3-010','RO-C3-018']){const o=registry.obligations.find(x=>x.id===id);o.verdicts.push(verdict);o.evidence.push(report,p+'LEARN_IMPLEMENTATION_FINDINGS.md',p+'LEARN_PUBLIC_EXPERIMENT_REV1.json',p+'LEARN_VALIDATION_CLOSURE_REV1.json');}
const debt=registry.obligations.find(x=>x.id==='RO-C3-018');
debt.established+=' VER-C3-LEARN-001 discharges the exact four-case lower-bound public-realization debt with6 models/39 runs/580 prefix continuations.';
debt.unresolved='Exact EPI pair through newer receiving horizon and joined REASON/DECISION/COMMIT clause-complete comparisons remain unqualified. Broader scalar inference is RO-C3-010; bounded LEARN is complete.';
debt.owner='EPI receiving first; REASON compiler, DECISION arbitration and COMMIT lifecycle/social owners for their separate clauses';
debt.closureRequirement='LEARN four-case public comparison is discharged by VER-C3-LEARN-001. Freeze and execute each remaining affected member exact comparator/domain/horizon with public versus component evidence labelled; do not infer all predicates from unrelated fixtures.';
const broader=registry.obligations.find(x=>x.id==='RO-C3-010');
broader.established+=' Bounded scalar lower-bound learning is now qualified by VER-C3-LEARN-001.';
broader.unresolved=broader.unresolved.replace('scalar censored inference','general scalar censored inference beyond the qualified lower-bound profile');
broader.unresolved+=' LEARN repeated-bound rejection is fresh-prior-specific; established below-bound means can keep accepting repeated bounds. Full-point precision credit, upper bounds, decay and richer posterior remain unresolved.';
registry.verdictReviews.push({verdict,obligations:['RO-C3-010','RO-C3-018']});registry.reportReviews.push({path:report,obligations:['RO-C3-010','RO-C3-018']});fs.writeFileSync(rf,JSON.stringify(registry,null,2)+'\n');
const old=read(p+'CURRENT.md');fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before bounded LEARN closure — 2026-09-21\n\n'+old);
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded LEARN COMPLETE / QUALIFIED. Campaign3 remains NOT EXIT-READY.**
Start at [LEARN qualification](CAMPAIGN3_LEARN_QUALIFICATION.md), VER-C3-LEARN-001
and [forward coverage register](CAMPAIGN3_EXIT_AUDIT_REV3.json). No owner ruling.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **896** |
| Allocated since last verdict/corpus member | **0** (13 this increment) |
| Research obligations | **4 active / 17 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 25 verdicts** |
| Coverage dispositions | **12 bounded / 3 accepted prior / 6 partial / 0 blocked** |
| Frozen models / public runs / prefix continuations | **6 / 39 / 580** |
| Affected / reference tests | **44 / 328** |

Scalar point/lower-bound evidence now reaches sole-owner learning and later probes.
Gated learning passes the four required contrasts; unconditional precision growth
fails, and PointOnly misses informative bounds. Established priors are acquired
from empty S0. Exact and millionth-lattice candidates remain separately committed.
Repeated-bound credit suppression is fresh-prior-specific; accepted-bound precision
overcredit and general inference remain RO-C3-010. Earlier bounded closures stand.

RO-C3-018 remains ACTIVE for EPI/REASON/DECISION/COMMIT; BODY ownership, BIO and
broader Brief-family obligations remain active. RO-C3-021's canonical historical
reconciliation gate is unsatisfied. No whole Campaign3 or full active-suite claim.

**Next:** exact EPI saturation-pair receiving-horizon readiness under the escalation
policy. Later gap ordering remains risk-based. Corpus digest unchanged:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
fs.appendFileSync(p+'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md',`\n\n## Forward coverage update — bounded LEARN, 2026-09-21

VER-C3-LEARN-001 now supplies the four-case scalar lower-bound public realization;
see CAMPAIGN3_LEARN_QUALIFICATION.md. Current disposition:12 bounded/3 prior/6
partial/0 blocked. The historical table above and REV1/REV2 snapshots remain dated
evidence, not rewritten claims about earlier runs. REV3 carries this scoped change.
General scalar inference and final-history reconciliation remain unresolved;
Campaign3 is NOT EXIT-READY. Next: exact EPI composed-witness readiness.896/0.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\nVER-C3-LEARN-001 qualifies the bounded lower-bound profile and resets counters896/0.\n');
console.log('Recorded bounded LEARN closure; update forward routing and audit snapshot next.');
