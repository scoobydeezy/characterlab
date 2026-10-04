# Campaign-2 inherited vector crosswalk — first audit

2026-09-07. **All rows remain qualification work; this is not a vector PASS report.**
Every EVID-A..T, REG-A..R and AD-E1..13 row below identifies relevant existing evidence
and the part still requiring direct verification or review. A passing related test is not
assumed to prove the complete frozen challenge. These 51 rows do not yet cover ADAPT A–D,
packaging, all PRJ/IDN vectors, or the inherited Campaign-1 OBS/SEM corpus.

Exact challenges remain authoritative in [EVID](EVID_001_DRAFT_RESOLUTION.md),
[REG](REG_001_DRAFT_RESOLUTION.md) and [ADAPT E](ADAPT_001_RULE_INTERPRETER_DRAFT.md).
`node scripts/audit-campaign2-vector-crosswalk.mjs` checks identifier coverage and evidence
file existence, not runtime semantics. Its report must never be read as passing these gates.

Evidence keys (test files are under `src/test/`):

- **Admission**: `campaign2TransitionAdmission.test.ts`.
- **Trace**: `campaign2TraceBinding.test.ts` and `CAMPAIGN2_BRIDGE_SUBSTITUTION_PROOF.json`.
- **Factory**: `campaign2Factory.test.ts`, `campaign2ModelAdmissionParity.test.ts`, and `CAMPAIGN2_TRACE_CONTINUATION_PROOF.json`.
- **Codec**: `campaign2Codecs.test.ts`.
- **PRJ**: `CAMPAIGN2_PRJ_SUBSTITUTION_PROOF.json` and Admission's generic projection fixture.
- **REG**: `campaign2RegulatoryReference.test.ts` and `CAMPAIGN2_REG_PERSISTENCE_MUTATION_PROOF.json`.
- **Persistence**: `campaign2PersistenceDerivations.test.ts` and Factory.
- **Domains**: `campaign2AdaptationDomains.test.ts`.
- **ADAPT**: `campaign2IndependentAdaptation.test.ts`, `CAMPAIGN2_INDEPENDENT_GATE_PROOF.json`, `campaign2MutationEvidence.test.ts`.
- **Construction mutations**: `CAMPAIGN2_EVID_REG_CONSTRUCTION_PROOF.json`; AD-E5 uses `campaign2FrozenGateOrder.test.ts`.
- **EVID rollback**: `campaign2EvidRollback.test.ts`, actual frozen factory with test-only internal fault injection and scheduler snapshot inspection.
- **EVID persistence**: `campaign2EvidPersistence.test.ts`, empty-input silence, zero-count positive and actual archived E/L create/restore rejection.
- **Generic EVID scope**: `campaign2GenericRoster.test.ts` and `CAMPAIGN2_FCT_C_PROOF.json`; production data-only semantic execution, roster invariance and twelve exact capability rejections.
- **Roster scope**: `campaign2RosterScope.test.ts`, valid generic roster versus bounded profile rejection; accepted scope in CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md.
- **Batch**: `campaign2BatchWitnesses.test.ts` and `CAMPAIGN2_BATCH_MUTATION_PROOF.json`, five exact count/collision/read-order tests and four detected mutants.
- **Exact REG**: `campaign2RegExactWitnesses.test.ts`, Scale=1 boundary/time witnesses and first-instant-hook rollback with saved-time construction rejection.

## EVID

| Vector | Relevant component evidence | Remaining exact challenge / review |
|---|---|---|
| EVID-A | Admission fresh identities and explicit both-stage 0/2-distinct/2-identical/wrong-schema output rejection; Trace pair | Complete allocation-to-ingress failure-stage mapping and closure review |
| EVID-B | Admission forged event; current-lane freeze has no EVID dispatch, injected consumer rejects before allocation; wrong producer version fails construction | Full forged-label/producer cross-product with semantic-execution counters |
| EVID-C | Admission occurrence field/role; altered observer/time/occurrence payloads reject before allocation, without consuming valid admission | Full binding/classification mutation matrix and Campaign-1 byte preservation |
| EVID-D | Trace unbound first-profile observer and zero reads; PRJ missing-source failure | Review pairing without moving later PRJ failure into EVID |
| EVID-E | Trace nested observer and safe-source invariance | Generic A/B/absent roster invariance now fixes X/registration/allocators and yields identical E/L; two-observer convergence and exact top-level field rejection remain |
| EVID-F | Admission zero-read specialization and PRJ isolation | Direct host-state bypass was found and fixed by isolating production EVID operands. Both stages reject state/event/trace/parent/content/registry requests; exact IDN projection rejects construction. Remaining nested-reference and complete projection variants require review |
| EVID-G | Trace hidden-count invariance and truth-provenance substitution | Full hidden truth/facet/ancestry and every nested opaque-handle challenge |
| EVID-H | Admission forged source/event and parent checks | Explicit complete forbidden-schema/producer/lane/input cross-product |
| EVID-I | Admission missing/duplicate/unbound child topology | Both-stage output-versus-ingress failure precedence and misrouting variants |
| EVID-J | Both-stage patch/state-replacement/missing-state-pair rejection precedes bad-output validation; valid completion remains usable; two no-write mutants detected | Valid globally writable unchanged-value patch and complete publication/fault mapping |
| EVID-K | Trace zero EVID reads | Fixed-X belief/value/recognition variations; no admission of new cognitive-state semantics |
| EVID-L | Canonical nonempty event-classification/explicit-false carrier survives both E/L copies; erasure mutant detected | Full producer-derived missing facets/unresolved roles/false continuity/segmentation matrix; canonical fixture does not prove classifier producibility |
| EVID-M | Empty-input actual factory and restore make no reservation call or output; zero-count source reserves and produces X/E/L with byte-identical character state; empty trusted freeze emits no children | Silent-observation producer branch is unavailable in the fixed always-pulse profile; broader SEM reservation derivation remains outside this witness |
| EVID-N | EVID rollback: failures after E allocation, E child binding, L allocation and phase-140 trace validation preserve exact state/queue/allocators/outputs/trace/clock; terminal Failed and save rejection | Review exact frozen challenge mapping; final trace fault is not every possible final invariant failure |
| EVID-O | Actual archived E/L rejected as initial work and pending restored work (native event and source-label disguise), before runtime construction; saved archive retained exactly and next E/L IDs match uninterrupted continuation | Review combined before/after and fresh-process witnesses; no general delayed evidence route is admitted |
| EVID-P | Trace same-safe-pulse count invariance; ADAPT state differs | Hidden-exposure-only branch and complete independent ancestry comparison |
| EVID-Q | Admission/Codec/Factory malformed registry and no-write checks | Exact every-field registry/route/output closure and identity-change mapping |
| EVID-R | Admission real scheduler allocation | Shifted allocation bijection and reordered canonical construction, earlier-phase/150 guards |
| EVID-S | Eight EVID mutations: cardinality, occurrence extraction, zero/two children, payload equality, patch/state no-write checks, classification erasure | Duplicate-domain acceptance and full forbidden-input/stage/code crosswalk |
| EVID-T | Admission exact predecessor embedding | Explicit DecisionExpression-family masquerade negative, no generic source escape |

## REG

| Vector | Relevant component evidence | Remaining exact challenge / review |
|---|---|---|
| REG-A | REG repeat queries; Persistence anchor-only identity change | Rate/domain-only identity counterparts and same-model exact reference bytes |
| REG-B | REG immutable authored reference API | Paired learned-D/prior-effective-reference invariance with fixed declarations |
| REG-C | REG has declaration-only inputs | Direct body/state-read interpreter mutation and fixed-input witness |
| REG-D | Codec exact fields | Explicit Unit injection before arithmetic with stage observation |
| REG-E | Domains key/role/domain precedence | V1/V2 wrong-key integration mutant with equal scales/bounds |
| REG-F | Exact REG: Scale=1, [0,100], R0=80, D=-81 gives REG_ADAPTED_REFERENCE_OUT_OF_RANGE | Review complete frozen witness mapping |
| REG-G | Exact REG: same fixture, D=21/30 give REG_ADAPTED_REFERENCE_OUT_OF_RANGE | Review complete frozen witness mapping |
| REG-H | Exact REG: same fixture, D=-80/-30/20 return Valid | Review complete frozen witness mapping |
| REG-I | Exact REG: constant/dynamic providers, D=0/10 histories, same-clock exact snapshot/save restore and equal reference/validation; observed TIME anchors remain authored | Review combined replay and allocator preservation evidence; direct reference queries use the same compiled declaration provider |
| REG-J | Exact REG: positive/negative A→B→C, repeated C, A→C; observed exact TIME remainders, independent expected values and unchanged anchor/declaration bytes | Review complete witness mapping; remainder visibility is test-only instrumentation, not a REG public accessor |
| REG-K | Exact REG: value Scale=1, Rate=1/TIME Scale=Int64.MaxValue, 80→81; repeated/reordered queries and zero-rate 80 control, declaration bytes unchanged | Review complete frozen witness mapping |
| REG-L | Exact REG: same prepared model, D=0/10 initial histories at T=0, R0=80 and effective 80/90 from actual retained state; zero-count settlement preserves state and provider bytes | Review complete witness mapping; effective arithmetic remains caller-side, not a provider mutation |
| REG-M | Runtime arithmetic/bound mutants plus nine exact-check construction mutations | Namespace/domain/role checks and body/key/callback variants; full positive/negative branch review |
| REG-N | REG malformed domain/reference/anchor/endpoint tests | Duplicate-character and complete construction-prefix mapping |
| REG-O | Exact 80→81/D=20 invalidity; first instant hook rejects before ingress, full state/clock/queue/allocator/output/trace rollback; saved-time restore rejects before runtime construction | Both runtime failures assert ADAPTATION_REFERENCE_OUT_OF_RANGE; AC-H now adds a real committed decrement, successful just before the boundary and rejected before ingress at the boundary; skipping the early hook remains a mutation gap |
| REG-P | ADAPT whole-instant rollback; declaration-only REG | Same-T write/query sequence with explicit allocator/cache/anchor invariance |
| REG-Q | REG shared parameter owner negative | Both equal/unequal bytes and multi-character single-variable positive control |
| REG-R | REG namespace/owner checks | Inert-copy positive and complete key/value/anchor wrong-family matrix |

## ADAPT E

| Vector | Relevant component evidence | Remaining exact challenge / review |
|---|---|---|
| AD-E1 | ADAPT zero/nonzero corpus and Step=2 identity witness | Batch proves exact n=3/q=6 and n=0 paired topology/allocator positions; zero-count filtering mutant detected; remaining full-vector review |
| AD-E2 | Gate corpus includes false-gate evaluations | Wrong-referent empty dispatch plus state-dependent applicability mutants |
| AD-E3 | Step identity witness, Domains malformed rule tests | Each key/gate/membership/match operand and orphan/name-table mutation matrix |
| AD-E4 | Domains five maps and key precedence; Trace five-leaf writes | Every applicable wrong exact target after accepted validation prefix |
| AD-E5 | Exact two-rule tolerance=1/load=2 witness, reversed committed identity order, three absent reads; staged-write mutant detected | Review complete 7j evidence; no global ADAPT verdict implied |
| AD-E6 | Domains same-instant collision controls | Batch proves zero-count/false-gate collisions before projection reads with full rollback and noncolliding permutation; collision-check mutant detected; remaining review |
| AD-E7 | Gate five reads; PRJ accessor/source checks | Batch proves same-path distinct-accessor target/gate segments across absent/zero-count/false-gate cases; reverse/omit instrumentation mutants detected. Cross-evaluation sharing and declaration/capability negatives remain |
| AD-E8 | ADAPT decrement/no-op corpus; exact 6 + 3×(-2) single tolerance Remove and restored state equal to absent target | Explicit absent Remove negative and complete equal-value/zero-Set rejection mapping |
| AD-E9 | ADAPT bounds corpus; Domains unbounded/baseline checks | Exact carrier and clamp/second-leaf mutation inventory |
| AD-E10 | REG bounds and saved-time checks | Pre-repair settlement invalidity and exact unknown-variable mapping |
| AD-E11 | Trace safe-output equality under different counts | Both-direction EVID/AAI input rejection and ordinal/ancestry operand mutants |
| AD-E12 | ADAPT/Trace late failure rollback | Full reads/evaluation/staged-output/patch-union fault matrix including queue/allocators |
| AD-E13 | Domains construction overlap checks | Both matches/all key variants, different Gate/Step, disjoint positives and later collision |

## Priority after this audit

Close the remaining missing witnesses before assigning vector passes. Extend EVID-S's
negative mutations, REG-M's remaining checks, and the full EVID admission/capability matrix.
Keep generic PRJ fixtures and frozen first-profile qualification distinct. No missing
test here authorizes new cognitive state, canonical semantics or a release verdict.
