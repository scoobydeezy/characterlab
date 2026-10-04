# PHEN-ADAPT consolidation review — revision 1

2026-09-08. The missing joined parent intervention witness now passes under the unchanged frozen
positive memory model. No production code, allocation, semantic contract or model bytes changed.

## Disposition

| Surface | Current disposition |
|---|---|
| measurement-episodic-memory/0.1-candidate | User-qualified in bounded scope |
| MEM-PACK-A..G; MEMR-A..P | User verdict PASS; accepted scope splits preserved |
| ADAPT-9a | Prior user verdict PASS |
| ADAPT-9b | PASS: newly executed same-S0 joined witness satisfies the user's conditional gate |
| Parent ADAPT control9 | PASS: qualified9a plus completed9b |
| PHEN-ADAPT-001 | OPEN, submitted for consolidation review; not silently promoted |
| PHEN-MEM-001 | OPEN / NOT CLAIMED |
| ADAPT whole-contract/factory/VAL blanket qualification | Not inferred from control9 |
| Campaign2 | OPEN / ACTIVE |

## Exact intervention identity

Both timelines use the same production-prepared ModelIdentity, canonical initial state and32-byte
zero RunSeed. S0 contains only the governed IDN roster; all adaptation and memory are initially
absent, their canonical baseline. The complete original input manifests have identical event types,
timing, phases, identities and all non-intervention payload fields:

| Instant | Timeline0 | Timeline1 |
|---|---|---|
| 2, phase110 | Authored actual exposure count0 | Authored actual exposure count1 |
| 4, phase110 | Same diagnostic probe input | Same diagnostic probe input |
| 5, phase20 | Generated identical content-free recall cue | Generated identical content-free recall cue |

The harness normalizes only304/1→305/3 (ActualContactCount) and compares the entire input manifests.
RunIdentity fields1/2/4 (ModelIdentity, initial-state digest, seed) match. Only field3, the
ordered-input digest, differs. No psychological intermediate, retained D, episode or recall is
authored into either initial state or original inputs. No random draws occur, so coupling is empty.

## Joined result and causal trace

The frozen profile has four applicable regulatory rules, not a D-only rule set. Count0 emits one
dispatch and four NoStateChange evaluations. Count1 emits the same applicable rule set and four
StateChange evaluations at the exact governed tolerance, sensitization, D and load paths. All four
values become1. Exact path-set equality excludes any other key/leaf mutation; every non-target
state leaf remains equal. This preserves the frozen model rather than manufacturing a D-only one.

The harness queries the committed family and transition-route declarations. All eight registered
character-learning families remain equal before the revealing probe. The complete derived
learning-output closure remains equal and is inhabited by actual269/270 outputs. Immediate203
and227 also remain equal. Zero count is an executed event with matching allocation topology.

At instant4, the actual probe has exactly one read:302/3 at the governed CharacterId/variable key.
Timeline0 reads absent baseline D=0. Timeline1 reads precisely the299 value written by the earlier
adaptation diff, D=1. The actual permitted measurement is5 versus51/10. The test then checks exact
content preservation through203→337→342→345 and later352. Episode owner/evidence keys match;
their content differs. The sole persistent mutation at instant4 is the346 episode insertion.
All EVID269/270 records remain equal even after the revealing measurement.

The causal accounting uses **two different kinds of edge**:

1. Scheduler parent edges connect the exposure root to its adaptation transition, and the later
   probe root to observation→carriage→M1→formation. The future recall event is a child of carriage.
2. Exact state write/read dependencies connect the earlier adaptation result to the later probe's
   D read, and the formation write to the later recall's episode read.

The probe is a separate original-input root. The report does not invent a scheduler-parent edge
from exposure to probe or from formation to the recall cue. These joins are omniscient research
trace evidence; no hidden exposure provenance or truth lookup enters the recalled evidence.

Both runs save after formation and before recall. Mandatory original-S0 prefix restore reproduces
the saved bytes and then the complete uninterrupted final saves. Recall reads IDN plus the exact
episode, returns the corresponding historical352, and changes no persistent state. Entire event
identity/timing/phase/sequence/parent topology and all allocator positions match between timelines.

## Evidence and validation

- [Machine report](CAMPAIGN2_ADAPT_PARENT_PAIR_PROOF.json):52 named successful checks plus structural
  assertions, exact canonical model/input/state/recall bytes, derived route closure and causal joins.
- `src/test/helpers/adaptParentPair.ts`: shared research assertions, using public factory/create/
  restore APIs; registry decoding is read-only closure inspection. No internal runtime mutation.
- `src/test/campaign2AdaptParentPair.test.ts`: integrated regression test.
- `node scripts/prove-campaign2-adapt-parent-pair.mjs`: separate process regenerates the report.
- Focused regression:2 files /34 tests PASS (33 qualified memory tests plus parent pair).
- Additional explicit dispatch/result assertions subsequently pass in the report runner;
  TypeScript check PASS. The previous599-test full suite and2 later witnesses remain historical
  evidence; no new full-suite count is claimed.

## Consolidation against the existing gates

| Parent obligation | Evidence to consolidate; scope preserved |
|---|---|
| Exact intervention/identities and matched allocation | New whole-input/RunIdentity pair; same-S0; complete scheduler/allocator matching |
| Hidden interval and inhabited route closure (4/4a) | New queried eight-family/output closure, equal immediate203/227/269/270; prior EVID/SEM and factory qualification evidence |
| Exact mutation authority/path/key and baseline normal form (1–3a,7g/7g′,7l/m) | New four exact paths and absent zero baseline; existing mutation, WRT, untouched-state and invariant proofs |
| Typed dispatch, no-op, collisions and frozen pre-write evaluation (7h–k) | New same four-rule dispatch/results; existing batch and gate mutation proofs retained |
| Both-affected source and no retroactive observation (8,10) | Prior bridge/trace/SEM qualification corpus; immediate outputs equal in the joined pair; no lane reopening added |
| Later permitted difference and persistent usable response (9) | Qualified probe9a, carriage, memory and this joined9b witness |
| Persistence and atomic abort (11,12) | New pending-recall restore in both joined histories; qualified memory overflow/rollback/prefix controls and inherited mutation proofs |
| Capability/hidden-source alternatives | Accepted probe, EVC and MEMR exclusion/ablation corpus; their public/component qualifications are preserved |

Relevant inherited records are CAMPAIGN2_FCT6_QUALIFICATION.md, CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md,
CAMPAIGN2_PROBE_QUALIFICATION_REVIEW.md, CAMPAIGN2_MEASUREMENT_EVIDENCE_QUALIFICATION_REVIEW.md and
CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md. Historical factory gate matrices/crosswalks retain
their original pending statements; this pass does not silently declare every inherited vector PASS.

Requested review: consolidate the completed parent-pair result with the frozen implementation and
mutation corpus, and determine the bounded PHEN-ADAPT-001 disposition. Control9 no longer lacks
the integrated history. Any remaining whole-phenomenon qualification requirement should be named
against those existing gates, without reopening the accepted memory model or weakening the setup.

Reference intake: SUB-008 trace/state-dependency replay, SUB-009 paired intervention discipline and
SUB-011 correct-forward evidence accounting retain their PORT/CONTRACT dispositions. No historical
mechanism is imported or retired. The retained decision dice/identity pipeline, the full traversable
North-Star topology and remaining P0 seams are still Campaign2 work, independent of this verdict.


## User review disposition and specification alignment — 2026-09-08

The joined witness and ADAPT-9a/9b/control9 are explicitly ACCEPTED/PASS. The user finds the
composed PHEN-ADAPT corpus sufficient except for the accepted historical one-rule fixture
restriction. The frozen model/proof correctly use four independent single-path exposure rules.

The requested [correct-forward amendment](../formal/PHEN_ADAPT_FIXTURE_AMENDMENT.md) now supplies
same-rule-set, expected changed-path-set and distinguished D-path language, with control3's
non-discriminating scope stated explicitly. Corpus draft1.11/aggregate0.27 and its manifest audit
are ready for explicit acceptance. No new runtime/model/allocation or behavioral proof is needed.
PHEN-ADAPT remains WITHHELD pending that specification-alignment acceptance; this replaces the
previous open-ended consolidation request with the sole blocker identified by the user.


## Accepted fixture amendment and PHEN-ADAPT PASS — 2026-09-08

The user ACCEPTS PHEN_ADAPT_FIXTURE_AMENDMENT rev1 and PASSES PHEN-ADAPT-001 in the bounded
frozen-model scope. ADAPT-9a/9b and parent control9 remain PASS. The four matched single-path
rules, independently specified changed-path sets, distinguished D path, control3 limited scope,
exact-path/key/WRT protections and accepted component scopes remain binding. Historical1.10/
corpus0.26 and the original ADAPT acceptance source are preserved. No blanket ADAPT/factory/VAL
qualification, PHEN-MEM PASS or Campaign2 completion is inferred.

One serialization conflict requires reconciliation: the accepted review digest181ce571... commits
PHEN-ADAPT1.11.0-draft; the explicitly requested1.11.0 promotion compiles to3cb09115.... Both exact
manifests are retained in PHEN_ADAPT_CORPUS_PROMOTION_REVIEW.json. See
PHEN_ADAPT_ACCEPTANCE_AND_CORPUS_VERSION_REVIEW.md. The research PASS is recorded now; only the
current canonical version/digest pair awaits the user's choice. No runtime/model/allocation changes.


## Approved canonical promotion — 2026-09-08

The user approves and freezes PHEN-ADAPT-001/1.11.0 with corpus/0.27.0 and current canonical
digest3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276.
The version/digest reconciliation is CLOSED. PHEN-ADAPT remains PASS in bounded frozen-model scope.
The reviewed1.11.0-draft commitment181ce571... is preserved: superseded reviewed draft, not current,
not invalid, not an alias. Historical corpus0.26/42dc6304... is unchanged. The original review/audit
JSON files retain their exact bytes; PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json records the accepted
promotion separately. The canonical member promotion changes no fixture semantics, model, runtime
or allocation and requires no additional behavioral proof. Blanket ADAPT/factory/VAL qualification
is not inferred. PHEN-MEM-001 and Campaign2 remain OPEN. Current verification command:
node scripts/audit-phen-adapt-corpus-promotion.mjs.
