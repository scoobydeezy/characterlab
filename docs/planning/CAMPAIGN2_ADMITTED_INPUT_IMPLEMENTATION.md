# Campaign-2 admitted-input implementation checkpoint

2026-09-06. Implements incremental `transition-admission/0.4-candidate`,
`projection/0.3-candidate-addendum`, `identity-binding/0.5-candidate`, and fixed
`character-learning-evidence/0.5-candidate` execution constraints. No allocation changes.

## Review disposition

Origin 1037/1122 and content-definition 1038 remain accepted and frozen. Origin/IDN codecs
and PRJ state validation remain accepted incremental implementation. REG and V04 construction
remain accepted in direction. The review requests no new symbolic decision. Factory activation
and global VAL/PRJ/IDN/REG/EVID qualification remain unpassed.

## Implemented boundary

`transitionIngressV04.ts` owns a noncanonical per-instant generation association and privately
mints opaque admitted-input objects. `admittedInput.ts` exports only the type and authenticated
reader; it exposes no minting operation. Raw events, raw canonical payloads and expired objects
cannot substitute for the capability. Nothing is serialized and no ID is allocated for admission.

The internal trusted SEM-adapter entry observes actual freeze outputs at phase 14/124; committed
producer rules select consumers. Registered EVID production requires its admitted execution.
Children are generated in canonical source-identity/consumer order. The scheduler's actual
allocated children must match the full planned event topology before associations are published.
Entry matches event ID, sequence, type, phase, time, exact payload, dependencies and immediate
parent against that association. Merely scheduling a matching-looking payload is insufficient.
Missing/duplicate/unbound child topology fails even without consumer execution. Finish/abort
invalidate capabilities; associations are local implementation data, not a new provenance graph.

The fixed EVID specialization retains consequence-only input, phase 130, empty ReadDomain,
singleton E/L outputs and character-learning membership. It issues output identities by calling
the internal shared-allocator capability with fixed namespace 1116/1117 and rejects outputs whose
identity differs from the allocation for that execution. Nested E/L source bytes must equal the
admitted payload. NoStateWrites failure precedes output closure; terminal L legitimately has no child.

`requiredProjection.ts` checks model-time source/target required fields, exact role compatibility,
one map-key wildcard, family key/value grammar, ReadDomain coverage and accessor uniqueness.
IDN roster access requires exactly its subject requirement. Static direct, legacy derived and
alternate dynamic roster access are forbidden. Construction accepts an admitted capability only;
its brand/liveness and registration check precede selector extraction and state operations.
The transition-visible projection exposes only field reads. Full source wrappers remain in the
separate adapter-side ActualReadRecords, with the existing accessor/transformation identity.

Generic origin/IDN/REG remain family-polymorphic. Their compilers depend on generic compiled
CONTENT, not the first-profile compiler. A namespace-23000 character control qualifies in generic
CONTENT/IDN/REG while the namespace-1038 same-text character is unequal. First-profile policy stays
in contentProfile.ts; new-family codec grammar does not narrow generic StableId slots.

## Frozen implementation controls and current evidence

These are implementation-local FCT labels, not new canonical IDs or whole-contract verdicts.

| Control | Component evidence |
|---|---|
| FCT-G | Invalid/absent generated relation fails INPUT_NOT_ADMITTED before simulated selector/read/semantic-output occurrence allocation; real scheduler injection preserves allocator state; raw-capability projection leaves instrumented reads at zero |
| FCT-H | Independent byte-valid source/event resemblance before an actual generation association cannot enter; complete authenticated SEM adapter source provenance remains an integration gate |
| FCT-I | Independently scheduled consumer or changed parent/ID cannot impersonate a generated child; real scheduler negative and duplicate-generation mutant preserve typed failure and rollback |
| FCT-J | E/L use scheduler allocator calls; missing, forged or prior-looking output ordinals fail execution allocation equality; replay/restore qualification still requires the complete factory |
| FCT-K | Raw event/payload cannot pass the capability reader or dynamic projector; no public capability mint; wrappers absent from the transition-facing projection |
| FCT-L | Non-1038 generic character content works through REG and IDN; first-profile restriction remains separate |

Existing construction and output controls remain. Current focused tests include exact E/L source
nesting, terminal closure, missing/duplicate ingress, capability expiry, required missingness,
IDN alternate-access rejection and role compatibility. Scheduler trace-allocation binding now
preserves TRANSITION_INGRESS_VIOLATION specifically; genuine trace failures keep their old code.

## Remaining integration obligations

The SEM entry and allocated-child binding are internal trusted-adapter capabilities. Component
tests deliberately exercise them; no public factory exposes them. Full fixed OBS/SEM adapter
binding, the complete original source manifest and all inherited SEM mutants remain required.
The real scheduler test covers one bounded EVID chain, not the complete Campaign-2 runtime.

The complete factory must own begin/finish/abort at the accepted instant lifecycle, verify all
mandatory ingress before commit and invalidate on every later failure. Its state/patch adapter
must derive NoStateWrites checks from actual returned state/patches, not caller assertions.
Static projection combination and all inherited PRJ/IDN vectors still require full integration.
No completeness claim follows from the currently exercised required top-level selector schemas.

Next: remaining PRJ/IDN controls, V06/ADAPT construction, fixed FCT-4 adapters and phase-140
settlement; then the concrete RulesVersion/bundle/profile binding, restricted create/restore
facade and independent integrated qualification. No canonical activation or global gate PASS.

Validation: full source suite 45 files / 362 tests PASS; TypeScript/Vite build PASS.
The final NoStateWrites refinement (actual patch/state values in place of flags) then passed
TypeScript and all ten admission/projection tests. Four allocation audits remain PASS
(60/40/43/37 checks). Reference source and all frozen allocation bytes are unchanged.

## Review acceptance — 2026-09-06

Checkpoint ACCEPTED. FCT-G, H, I, J, K and L each have COMPONENT PASS disposition.
This is not integrated factory qualification and does not pass global EVID/PRJ/IDN/VAL gates.
Admission failure means zero semantic-output occurrence allocation, no projected read artifact,
no semantic output and no generated downstream child. The injected event may already have an
EventId; whole-instant rollback separately removes allocations staged during failure.
Generation order remains canonical encoded typed source identity, then canonical TransitionKind.
No new symbolic or numeric change follows from this review. Later bootstrap inspection is
recorded separately in CAMPAIGN2_ORDERED_INPUT_ENCODING_DECISION.md.
