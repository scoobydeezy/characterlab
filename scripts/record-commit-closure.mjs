// Single-use, evidence-gated bounded qualification and routing.
import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/check-commit-closure.mjs'],{stdio:'inherit'});
const p='docs/planning/',read=f=>fs.readFileSync(f,'utf8'),verdict='VER-C3-COMMIT-001',report=p+'CAMPAIGN3_COMMIT_QUALIFICATION.md';assert(!read(p+'VERDICT_LEDGER.md').includes('## `'+verdict+'`'));
fs.writeFileSync(report,`# Public COMMIT checkpoint —2026-09-21

**Disposition: QUALIFIED / LOCAL DISPOSITION. Bounded COMMIT COMPLETE.**
**Stage: E, verdict VER-C3-COMMIT-001. Owner decision pending: no.**
Implements commit-public/0.1-candidate,952..970/schema1,namespace1162.

| Counter | Value |
|---|---|
| Highest allocated record type |970|
| Allocated since this verdict |0 (19 this increment)|

## What changed
PHEN-COMMIT-001/1.0.0-draft now joins strong fixed identity, actual lifecycle,
concrete source identity and selective observer learning. Four frozen models share
one actor, two concrete governed task instances and two observers. The training
prelude executes actual reasons, addressed choice, intent, frozen expression and
qualification; the accepted ordered identity fold appends one earned contribution.
No authored trait bonus or imported learned state is accepted. The entire identity
history is then held byte-identical across lifecycle probes and all four models.

The receiving calibration uses identity K1/100 and standing unit1/10,cap3. Both
active A and recurrent B receive the actual earned+3 standing modifier. The base
pressure remains1/10. Standing does not generate a motive when no instance is active.
Registered lifecycle source30 schedules its owner write at140; current context40
and choice60/80 use prior committed state. Adoption and retirement affect the next
instant, preserving the accepted causal order instead of rewriting earlier choices.

## Exact results and competitors

| Lifecycle state | Lifecycle baseline | Preserved distinction |
|---|---|---|
| No instance |0 reasons|Strong identity alone creates no commitment motive|
| A active |1 reason,referent A,standing+3|Pressure belongs to this concrete instance|
| A cancelled |0 reasons; identity unchanged|Retirement removes pressure without erasing identity|
| New B active |1 reason,referent B,standing+3|B differs from A; terminal A remains stored|
| B still active |1 reason,referent B|Stable continuation, no A resurrection|

The recorded baseline counts are0,1,0,1,1. Creation stores A/version1/Active;
cancellation stores A/version2/Retired with its cause; recurrence adds distinct
B/version1/Active. Active decisions execute through the retained arbitration and
frozen expression path. Probe choices are Auto; only the training prelude learns.

CoreNeed's fixed recurring-drive proxy produces1,1,1,1,1 using a separate Need
referent, including before any commitment exists. It is a bounded erroneous
commitment-as-Need hypothesis through the common receiver, not a new physiological
Need qualification. Immortal produces0,1,1,2,2 by retaining retired A and then
adding B. ReusedId gives the old A referent at recurrence, explicitly reactivating
A/version3 and never creating B. Each loses a required state while retaining the
same actual training contribution and identity history as the baseline.

## Positive social witnesses and epistemic boundary
Communication110 projects a selected instance's prior-committed status. Only
permitted recipients receive the identified observation120/evidence130 and update
their own instance-keyed LastObservation at140. Observer A learns active A while B
remains unknown; later B learns active recurrence B without receiving A's knowledge.
Swapped recipients swap the learning; both recipients both learn. A permitted
retirement message updates A to Retired. Without it, A can retain a stale Active
belief after private cancellation; no automatic social synchronization occurs.

Private lifecycle versus no lifecycle yields identical observer inspection views
despite different actor reasons. Hidden scalar changes preserve psychological
outputs and state. Probe occurrence ordinals are research allocation artifacts,
not private-state knowledge; observer inspection projects the probe's time, observer
and known claims without that ordinal. Actual permitted observation support IDs
remain intact. Observers cannot access the actor's private instances, identity,
decision transcripts or raw RNG through this closed view. Unknown output kinds reject.

## Evidence and preservation
COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json was frozen before public execution.
Four models/16 image files are in campaign3-commit-model-rev1. Ten public runs
execute six instants each, yielding70 exact whole-prefix restores/next continuations:
60 advancing,10 terminal. Four main model runs plus private,absent,both,swapped,
retired-witness and hidden baseline interventions form the registered matrix.
Whole-save equality covers lifecycle/identity/observer state, queue, allocations,
outputs, trace and committed addressed RNG history.

The first focused suite passes27 tests. The preservation suite passes144 affected
tests covering COMMIT, SOCIAL, inherited task lifecycle/boundaries and cognitive
arbitration/math; all328 historical reference tests pass. Every one of18 reached
registered stages plus final commit has an injected rollback check; training-only
qualification/identity faults occur in the prelude, other faults after earned
identity and actual adoption. Wrong owners, illegal transitions, foreign schemas,
invented initial state, edited originals and modified saved RNG ledgers reject.
TypeScript, production build and reference boundaries pass. Prior LEARN/EPI/REASON/
DECISION closure integrity is unchanged. No full active-suite rerun is claimed.
COMMIT_VALIDATION_CLOSURE_REV1.json binds final source and receipts.

COMMIT_IMPLEMENTATION_FINDINGS.md preserves causal timing, occurrence opacity and
bounded proxy limits. No failed COMMIT test/model cohort required replacement;
earlier seams' failed artifacts remain untouched. No historical reference source
was changed or imported into active source.

## North Star transfer, scope and obligations
Durable identity may strengthen how a character responds to an obligation while
that obligation's existence remains a separate, finite fact. Retirement should
remove its motive, not remove the character's identity. Recurrence is a new concrete
instance, and other characters know only what they were permitted to observe.

This is cancellation of two controlled instances and truthful identified messages,
not general commitment theory, belief calibration or language. Partial fulfillment,
beneficiaries, delegation, series identity, lifecycle consequences, source trust,
uncertain recognition and richer social inference remain conditional under
RO-C3-014/020. The chosen+3 calibration does not establish learning speed or a
universal standing-modifier scale. No Need, identity or social box is reduced.

RO-C3-018 is CLOSED / RESOLVED_BY_EXPERIMENT: its five named retained-corpus debts
LEARN,EPI,REASON,DECISION,COMMIT now each have bounded public verdicts. This does not
close BODY ownership, BIO or the broader Brief-family obligations. Counts are
3 active/17 conditional/1 closed/0 unowned. RO-C3-021 final historical reconciliation
remains unsatisfied. Corpus0.29.0 membership/digest and all15 Brief families remain.

Forward audit REV7 changes COMMIT coverage:16 bounded,3 accepted prior,2 partial,
0 blocked. This revision changes coverage, so the revision cap’s unchanged-disposition
condition does not apply. Whole Campaign3 remains NOT EXIT-READY. Next: BODY's matched stored-meter
versus reference ownership comparison under RO-C3-008, followed by remaining BIO
and broader-family work ranked by invalidation risk.
`,{flag:'wx'});
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`${verdict}\` — Concrete obligations retire without erasing earned identity

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded COMMIT COMPLETE.
- **Contract:**commit-public/0.1-candidate;952..970/schema1;namespace1162.
- **Corpus:**PHEN-COMMIT-001/1.0.0-draft; unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_COMMIT_QUALIFICATION.md;4 models,10 public runs,70 exact
  prefix continuations;144 affected and328 reference tests.
- **Verdict:**RETAINED concrete lifecycle gating, terminal A/new B identity,
  separate persistent earned standing and observer-specific admitted knowledge.
  Baseline counts0/1/0/1/1; CoreNeed1/1/1/1/1; Immortal0/1/1/2/2; ReusedId repeats A.
- **Limits:**fixed+3 receiving calibration, cancellation, two concrete instances,
  controlled truthful communication; no general Need/commitment/identity/social law.
- **Obligations:**RO-C3-018 resolved by its five bounded public verdicts;
  RO-C3-014/020 preserve wider lifecycle, source, identity and calibration limits.
- **Reopen:**partial fulfillment, beneficiaries, delegation, series identity,
  lifecycle consequences, new evidence/recognition source or representation reduction.
- **Counters:**970/0 (19 this increment). No owner ruling.
`);
const registry=JSON.parse(read(p+'RESEARCH_OBLIGATIONS.json')),ids=['RO-C3-014','RO-C3-018','RO-C3-020'];for(const id of ids){const o=registry.obligations.find(o=>o.id===id);o.verdicts.push(verdict);o.evidence.push(report,p+'COMMIT_IMPLEMENTATION_FINDINGS.md',p+'COMMIT_PUBLIC_EXPERIMENT_REV1.json',p+'COMMIT_VALIDATION_CLOSURE_REV1.json');}
const debt=registry.obligations.find(o=>o.id==='RO-C3-018');debt.established+=' VER-C3-COMMIT-001 completes strong fixed earned identity, concrete lifecycle and positive selective-witness comparisons:4 models/10 public runs/70 prefix continuations.';debt.status='CLOSED';debt.unresolved='No remaining debt within this entry’s five named bounded corpus comparisons. BODY ownership, whole BIO and broader families remain separate RO-C3-008/009/019; general calibration and social extensions remain RO-C3-014/020.';debt.owner='Retained-corpus preservation owner; no immediate work under this resolved entry';debt.closureRequirement='Satisfied by VER-C3-LEARN-001, VER-C3-EPI-001, VER-C3-REASON-001, VER-C3-DECISION-001 and VER-C3-COMMIT-001. Preserve exact public/component scope and reopen if a required distinction is reduced or new mandatory clauses invalidate the bounded comparisons.';debt.closure={disposition:'RESOLVED_BY_EXPERIMENT',rationale:'All five named retained-corpus comparison debts have public frozen-model experiments and exact continuation evidence. Closure is limited to this entry; other active campaign obligations remain.',evidence:['LEARN','EPI','REASON','DECISION','COMMIT'].map(n=>p+`CAMPAIGN3_${n}_QUALIFICATION.md`)};
registry.obligations.find(o=>o.id==='RO-C3-014').established+=' COMMIT adds concrete-instance LastObservation through positive selective, swapped, both-recipient and retirement messages; private lifecycle remains unavailable to nonrecipients.';
const limits=registry.obligations.find(o=>o.id==='RO-C3-020');limits.established+=' COMMIT holds genuinely earned identity fixed while testing live-instance pressure and distinct recurrence.';limits.unresolved+=' COMMIT partial fulfillment, conflicting beneficiaries, delegation, recurring-series identity, lifecycle consequences and general modifier calibration remain unqualified.';
registry.verdictReviews.push({verdict,obligations:ids});registry.reportReviews.push({path:report,obligations:ids});fs.writeFileSync(p+'RESEARCH_OBLIGATIONS.json',JSON.stringify(registry,null,2)+'\n');
fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before bounded COMMIT closure —2026-09-21\n\n'+read(p+'CURRENT.md'));
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded COMMIT COMPLETE / QUALIFIED. Campaign3 remains NOT EXIT-READY.**
Start at [COMMIT qualification](CAMPAIGN3_COMMIT_QUALIFICATION.md), VER-C3-COMMIT-001
and [forward coverage register](CAMPAIGN3_EXIT_AUDIT_REV7.json). No owner ruling.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **970** |
| Allocated since last verdict/corpus member | **0** (19 this increment) |
| Research obligations | **3 active / 17 conditional / 0 unowned** |
| Closed obligations | **1: RO-C3-018, resolved by experiment** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 29 verdicts** |
| Coverage dispositions | **16 bounded / 3 accepted prior / 2 partial / 0 blocked** |
| Frozen models / public runs / prefix continuations | **4 / 10 / 70** |
| Affected / reference tests | **144 / 328** |

Actual earned identity supplies+3 standing and stays fixed across none/active/
retired/new recurrence. Baseline counts0/1/0/1/1; all three required controls fail.
Positive permitted witnesses learn the correct concrete instance. Nonrecipients
do not acquire private state; unobserved retirement may leave belief stale.

RO-C3-018's LEARN/EPI/REASON/DECISION/COMMIT debts are resolved. BODY ownership,
BIO and broader Brief coverage remain ACTIVE; RO-C3-014/020 preserve broader
lifecycle/social/calibration limits. Final-history RO-C3-021 remains unsatisfied.

**Next:** BODY stored-meter/reference ownership comparison under RO-C3-008,
then remaining BIO and broader-family coverage by invalidation risk. No full-suite
or whole Campaign3 claim. Corpus digest:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## Joined COMMIT lifecycle/identity/witness disposition —2026-09-21
VER-C3-COMMIT-001 and CAMPAIGN3_COMMIT_QUALIFICATION.md retain MEC-020/EXP-013
active-only concrete instance pressure and distinct recurrence under fixed earned
identity. MEC-012..018 execute actual source/dice/choice/identity prelude and standing
feedback; no authored trait bonus replaces it. RET-010/011 remain explicit failing
CoreNeed/Immortal controls; ReusedId fails recurrence identity. SOCIAL's controlled
identified LastObservation extends to per-observer/per-instance statuses. Unobserved
retirement can leave stale knowledge. SUB-004/008/009 preserve addressed draws,
rollback and exact prefixes. RO-C3-018 is resolved; RO-C3-014/020 retain wider
lifecycle/source/calibration limits. No reference edits/imports; counters970/0.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\nVER-C3-COMMIT-001 qualifies the bounded public successor; counters970/0.\n');
console.log('Recorded bounded COMMIT closure and resolved RO-C3-018.');
