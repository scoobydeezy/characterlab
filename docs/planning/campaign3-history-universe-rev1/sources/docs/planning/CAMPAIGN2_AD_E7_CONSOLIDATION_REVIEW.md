# Campaign2 AD-E7 projection lifetime consolidation

Date: 2026-09-09. Status: correction and whole-vector bounded consolidation proposed;
AD-E7 remains OPEN pending review.

## New remaining-control evidence

`campaign2ReadEvidence.test.ts` now has10 tests. The seven accepted read-evidence
controls remain; three additions target the gaps identified in the binding review.

**Actual object sharing:** the constructor fault returns the very same real
ContractReadProjection instance for the first two regulatory rule evaluations.
The test verifies object identity equality across both constructor results. The
second rule fails TRACE_VALIDATION_FAILURE at the accepted per-rule instrumentation
guard; no original state change occurs. This changes the live projection object,
not its subsequently staged trace. No new sharing-specific guard was needed.

**Executor binding exclusion:** public prepareCampaign2Model rejects each extra
projectionBindings, readProjection, actualReadRecords and enumerateState input with
INVALID_CONFIGURATION; none of the supplied hooks executes. Existing FCT-A/F
data-only and authenticated-model tests remain the broader public boundary evidence.
Internal test interception of constructors or reads is not a supported public API.

**Active interleaving:** under a valid committed model with each rule gated on its
own target, a read interceptor first performs A's real target read, then attempts
to execute B before returning to A's gate read. Before correction, B executed; the
test failed because the nested call did not throw. Existing token order was not
sufficient: the cursor already pointed at B while A was active.

## Narrow lifecycle correction

The batch in `adaptationEvaluation.ts`, implementing `adaptation-input/0.31-candidate`,
now maintains a private active flag around executeNext and result staging, released
in finally. A nested execute fails ADAPTATION_STAGE_VIOLATION before cursor advance,
allocation or reads. finish also rejects while an evaluation is active, including
the last evaluation when the cursor has already reached the batch length.

The test catches the injected forbidden attempt to inspect the boundary, then lets
the legitimate outer evaluation continue. It proves the nested attempt caused no
additional read: the observed sequence remains one target at that point and becomes
five complete target/gate pairs across the normal batch. It also attempts finish
during the last target read, requiring rejection before its gate and result staging.
These are internal fault controls, not public error-recovery authorization. A failure
propagating through the real runtime still follows C's terminal whole-instant path.

The new guard does not introduce a scheduler phase, error family, schema, profile,
allocation, new read oracle or changed WRT precedence. It enforces the already frozen
non-interleaving requirement. No arithmetic or model-language decision is requested.

## Whole frozen-vector crosswalk

| AD-E7 obligation | Evidence and scope |
|---|---|
| Fresh immutable projection per rule | Accepted five-distinct-instance control; accepted private binding snapshot; same frozen batch state; no anonymous derive function is used by ADAPT |
| No actual sharing | New identical-object constructor fault rejected on second rule, separately from accepted staged-evidence substitution |
| No rebinding | Accepted direct/derived-member/nested-path source alias controls; no rebind API; no arbitrary closure-purity inference |
| No executor binding | New named public configuration negatives, zero hook calls; existing FCT-A/F data-only/authenticated model surface; fixed ADAPT code constructs target/gate bindings from admitted input and committed rules |
| No interleaving or premature publication | New A-target/B-attempt/A-gate and active-final-evaluation finish challenges; both new guards required by current-source assay |
| Exact rule read segments/post-hoc order | Accepted per-rule target then optional gate comparison and staged structured/encoded snapshots; omitted, reversed, wrong-accessor and cross-execution evidence substitutions reject |
| Same path, distinct accessors | Existing batch witness executes absent/nonzero, absent/zero and present/false-gate cases with exactly two ordered reads; no accessor collapse |
| Declaration OutputAccessor uniqueness | Actual compileRequiredProjections rejects static/static, dynamic/dynamic and static/dynamic collisions; accepted component evidence, no duplicate tests added here |
| Undeclared read/accessor | Owning generic CV-READ-001: ILLEGAL_READ at out-of-domain binding construction; UNKNOWN_ACCESSOR for forged reads; fixed public ADAPT profile exposes no caller read hook |
| Cross-character confinement | Accepted exact-domain component rejects other-character binding and resists alias redirection; public model retains one-character admission and no binding override; accepted E4 generic qualified-subject/one-character-exclusion evidence remains separate |
| Enumeration/wildcard exposure | Accepted generic projection interface and read-only required-projection API expose no state/bindings/entries/keys/rebind; new public enumerateState hook rejected; generic declared wildcard domains remain legal |
| Owning PRJ mappings | Generic ILLEGAL_READ/UNKNOWN_ACCESSOR, required-projection REQUIRED_PROJECTION_VALUE_ABSENT, declaration INVALID_CONFIGURATION, key INVALID_PATH and CANONICAL_ROLE_VIOLATION; ADAPTATION_STAGE_VIOLATION/TRACE_VALIDATION_FAILURE do not replace those owners |

Component/public composition does not mean an arbitrary unknown or second-character binding was publicly executed.
The public boundary excludes such injection; real owning components qualify the
generic permission/error branches. No profile is widened for qualification.

## Validation and proof history

`CAMPAIGN2_READ_EVIDENCE_PROOF_REV2.json` is an additive current-source report:
10-test baseline PASS; nested-execution guard removal DETECTED; active-finish guard
removal DETECTED; per-rule instrumentation check removal DETECTED; staged-read
comparison removal DETECTED. Anchors are unique, a named witness must fail, unhandled
errors are excluded, and source/test fingerprints remain unchanged during the assay.
The original seven-test report is preserved as history, not overwritten.

TypeScript checking PASS. The targeted final suite has **80 tests PASS in eight files** and covers read evidence, batch,
mutation boundary, exact REG, transition admission, public factory, binding isolation
and generic state. No new full-suite count is inferred from the earlier accepted
98-file/697-test run. Other substrate/evaluator-sensitive mutation reports remain
historical until deliberately refreshed for whole B/FCT.

Reference preservation continues SUB-008 trace/atomicity and SUB-009 explicit
controls. No historical mechanism is imported or retired; frozen artifacts and
canonical allocations remain unchanged.

## Requested disposition

Accept the narrow active-execution/finish correction and AD-E7 in the finite matrix
and explicit public/component composition above. Anonymous closure purity, universal
hostile-code reflection and arbitrary future projection languages remain unqualified.
AD-E7 stays OPEN until review. AD-E3/4/8/9/10/13 remain PASS. AD-E11/12 and whole
B/FCT remain OPEN. VAL QUALIFIED, bounded no-RNG PERSIST-A..H PASS, conditional/
deferred PERSIST-I and PHEN-ADAPT PASS unchanged. Campaign2 remains OPEN.
