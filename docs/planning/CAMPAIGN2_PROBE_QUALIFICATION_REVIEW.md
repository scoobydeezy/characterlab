# First diagnostic probe — qualification review packet

2026-09-07. **RUNTIME QUALIFIED — USER ACCEPTED 2026-09-07.**

PROBE-A..P and PROBE-ACCESSOR-A..E PASS. ADAPT-9a PASS. ADAPT-9b, parent control 9,
PHEN-ADAPT-001, the ADAPT-001 formal campaign verdict and Campaign 2 remain OPEN.
The original proposed crosswalk below is retained as review history; this disposition controls.

Requested disposition: accept the bounded diagnostic probe's assembled PROBE-A..P evidence,
retaining the explicitly accepted F split and narrow generic numeric-domain scope. This is a
runtime/research qualification verdict, not another symbolic, allocation or model-byte freeze.

Executable seam: `regulatory-diagnostic-probe/0.1-candidate`.
Rules: `rules/campaign2-regulatory-probe/0.2-candidate`.
Trace: `campaign2-probe-trace-binding/0.2-candidate`.
Frozen ModelDigest: `fda39ae4a8d82cbf531b41ce35c9af7ebb2ec5c7f233c4f7adbd7e6d7eba80e9`.

## Evidence crosswalk

All paths below are under `src/test/` unless linked. “Proposed PASS” means the listed executed
evidence is submitted for the whole-vector verdict; it does not retroactively erase earlier
partial dispositions in the [qualification history](CAMPAIGN2_PROBE_RUNTIME_QUALIFICATION.md).

| Vector | Proposed disposition and evidence |
|---|---|
| A | PASS: `campaign2ProbeRuntime.test.ts` couples actual exposure histories, same model/probe/time/R0; n=50/51 and q=5 and q=51/10. Mutation removing D is detected. |
| B | PASS: exact one/zero actual read, absent D=0, exact accessor/path tests; detached arithmetic rejects ten unavailable capabilities. [Isolation mutations](CAMPAIGN2_PROBE_ISOLATION_MUTATION_PROOF.json) reject other maps, arbitrary/unselected root, other C/V and duplicate read. REG receives no state handle. |
| C | PASS: `campaign2ProbeIrrelevantState.test.ts` varies each other valid persistent map under the public model with fixed D; every output stays byte-identical and each whole state is unchanged. Matched scalar baseline repeats the same occurrence allocation. |
| D | PASS: four separately committed availability/permission variants have exact required output/read counts. Availability/permission removal mutants are detected. |
| E | PASS: hidden-D pairs in all suppressed variants preserve complete permitted outputs and the later visible sentinel. All four variants preserve allocator checkpoints and sentinel identities. |
| F | PASS — accepted split scope: `campaign2ProbeTemporalScope.test.ts` retains F1 generic accepted REG + production consumer and F2 exact public exclusion. Time-only change is explicitly not adaptation evidence. |
| G | PASS in declared scope: frozen positive fixture plus generic accepted signed REG domain/production consumer tests negative, zero, fractional, endpoints and out-of-range rejection. [Numeric mutations](CAMPAIGN2_PROBE_NUMERIC_MUTATION_PROOF.json) detect clipping, saturation, threshold and gain. Truth producer admits only 334, not generic effect truth 200; dedicated channel 332 is committed. No probe state write. The broader signed declaration is explicitly rejected by the frozen public compiler. |
| H | PASS for the accepted observation-only target: paired actual histories have equal earlier permitted projections; first later permitted difference is 203. Matched X/E/L remain equal. No cognitive-divergence claim. |
| I | PASS: frozen successor verification preserves all 45 earlier packet files. Bounded fixed-pulse later-challenge regression remains insensitive to D. |
| J | PASS: `campaign2ProbeChildAuthority.test.ts` exercises exact child association, altered payload/identity/time/phase/kind/parents/dependencies, replay and closed authority. Model and source tests reject forged definition and widened declarations; SEM freeze substitutions reject. A distinct future opportunity restores and runs correctly. |
| K | PASS: 32 event-slot trace failures plus 18 failures after real allocator advances roll back full state/clock/queue/output/trace/allocators. Recovery is exact. [Two-process continuation](CAMPAIGN2_PROBE_CONTINUATION_PROOF.json) gives identical complete save, including probe and later sentinel. Runtime and archived output closure substitutions reject. |
| L | PASS in this slice: existing zero-read/zero-write EVID admission is retained; raw observation and truth cannot become freeze inputs; extra or substituted learning output rejects. Other persistent maps are unchanged. Source/transition admission retains the exclusion of AutomaticAdaptationInput from the learning route. |
| M | PASS: focused public matched-allocation scalar witness keeps X/E/L identical; four production scalar-carriage mutants are detected. [SEM source audit](CAMPAIGN2_PROBE_SEM_ISOLATION_AUDIT.json) rejects classification, dereference, hashing, embedding and metadata carriage in this exact constructor. It does not prohibit future explicitly accepted SEM semantics. |
| N | PASS: four-branch runtime budget/sentinel witnesses plus [padding audit](CAMPAIGN2_PROBE_PADDING_AUDIT.json) of void/private/result-discarding consumption. Capture/return/compare/expose mutations reject; transactional allocation failures include padding. |
| O | PASS for the only accepted policy: exact fixed slot budget, fixed event matrix, no public override, altered-budget and allocator-derived-budget audit mutants reject. RulesVersion/model identity gating is explicit. No alternate policy or new model is implemented by this vector. |
| P | PASS: public facade lacks schedule/cancel/allocation; handler source emission rejects with the exact origin failure; original manifest and exact pending source bytes are required on restore. Component authority rejects forged/reused/expired source admission. |

PROBE-ACCESSOR-A..E remain PASS. The above review must not widen their scope or reinterpret probe .1.

## Limits and preserved failed findings

Source audits are qualification checks for the committed implementation, not new runtime
validators or independent implementations of the mechanism. Runtime substitution reports name
their actual source fingerprints and executed baseline. Tests are finite controls, not a proof
that arbitrary hostile source replacements are impossible.

The output-closure defect discovered in pass 3 is retained: an extra learning output initially
committed because trace binding inspected only the first output. Exact per-slot cardinality/type
and archive projection closure corrected it; the formerly successful substitution now rejects.
The detached arithmetic boundary correction and fixture-authoring failures remain in the history.

Last full regression: 84 files / 549 tests PASS after the output-closure correction. The new
focused scalar-isolation test subsequently passes, as do twelve isolation mutations, four numeric
mutations and six SEM source-audit substitutions. Build/type check passes with the new test.
No production code changed during this final evidence pass. Frozen model bytes and the exact
continuation-save bytes were verified in pass 3 and remain unmodified.

## Decision boundary

If accepted, this supports only the first diagnostic, observer-accessible later difference
(ADAPT-9a). ADAPT-9b, parent control 9, PHEN-ADAPT and Campaign 2 remain open. It earns no
physiological/performance law, reward, appraisal, learning update, or scalar-bearing X/E/L seam.
Further work on inherited factory/VAL/persistence coverage can proceed independently. Any next
phenomenon that requires cognitive divergence needs its own explicit research target and seam;
this packet deliberately does not choose one.

## Accepted scope clarifications

PROBE-F = PASS iff F1 (generic accepted temporal REG + production probe consumer) and F2
(frozen public exclusion) pass. No temporal public ModelIdentity was required or executed.

PROBE-G = PASS iff G1 (frozen public positive fixture), G2 (generic signed-domain accepted REG
+ production probe consumer: negative/zero/fraction/endpoints/out-of-range), and G3 (public
exclusion of those broader declarations) pass. All three are retained. The frozen public model
was not exercised over G2's broader domain.

PROBE-L: PASS for the accepted regulatory-diagnostic-probe seam; no broader Campaign-2 learning
semantics inferred. PROBE-M preserves equal X/E/L for fixed support and different permitted
scalar. Future cognitive evidence carriage requires an explicitly accepted target and seam.

Retained regulatory adaptation can alter a later diagnostic truth-side operating point and,
through explicitly permitted observation, produce the first later observer-accessible difference
while hidden/suppressed cases remain noninterfering. This is ADAPT-9a, not cognitive divergence.
