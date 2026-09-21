# CharacterLab agent directives

Read this file before planning or implementing work in this repository.

## Campaign 3 local decisions and escalation

Follow `docs/planning/CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md` (user directive,
effective 2026-09-13). Resolve conservative bounded choices locally using accepted
architectural precedent, preserve meaningful comparators and report LOCAL DISPOSITION.
Behavioral differences, finite fixture scope and deterministic representation choices
alone are not owner blockers. Escalate only under that policy's architectural criteria.

Items that **do** meet those criteria are tracked in
`docs/planning/CAMPAIGN3_PENDING_OWNER_DECISIONS.md`. **Zero are open.** `OD-C3-001`
(concern -> attention feedback) was RATIFIED WITH SCOPE AMENDMENT on 2026-09-14: the
ratified precedent is a *transient character-state -> attention* seam, `TaskConcern` is
NOT the general Affect representation, `residual x (1-q)` / `omegaA = 1+q` is Candidate A
only. The comparison obligation is discharged by `VER-C3-CONCERN-001/002`;
encoding suppression and retrieval amplification remain distinct, and A/B/C are
retained candidates, not settled laws. No owner ruling is pending.

## Research obligation preservation

Every new or amended Campaign 3 verdict/qualification must create or reference its
material obligations in `docs/planning/RESEARCH_OBLIGATIONS.json`, or record an
explicit none-remaining rationale there. Follow `RESEARCH_OBLIGATIONS.md` in that
directory. Conditional debt is not immediate work or an owner ruling; deferral does
not close it. Before a reduction, check obligations naming the affected distinction.
Run `npm run check:research`; Campaign 3 exit requires zero unaccounted-for material
findings, without waiving mandatory corpus gates.

## Architectural authority

1. `CharacterLab — Ideal Character Architecture North Star.md` defines the required character capabilities, invariants, and research posture.
2. `CHARACTER_ARCHITECTURE.md` is the sole canonical topology: boxes, edges, state ownership, and causal ordering.
3. `CharacterLab — Ideal Character Research Program Brief.md` defines the research method, proof burden, and campaign rules.
4. `docs/formal/` defines versioned executable semantics beneath those conceptual authorities. An implementation must name the seam-contract version it implements.
5. `CharacterLab — Reference Architecture Build & Research Campaign Plan.md` owns active sequence without overriding accepted formal readiness gates.
6. `docs/planning/` records active seam status, phenomena, preservation obligations, and verdict evidence.
7. Phase briefs, historical findings, and implementation plans under `reference/` are hypothesis and control sources only.

When documents conflict, resolve the conflict upward through this hierarchy. Do not silently choose whichever formula or diagram is easiest to implement.

Authority is also scoped by subject. The Research Program Brief outranks formal documents on research method, proof burden, and campaign admissibility; it does **not** override an accepted seam contract's exact mathematics, domains, quantization, ordering, or trace schema. Conversely, a formal seam contract may instantiate the North Star and Architecture Map but may not redefine their required phenomena, causal boxes, or epistemic boundaries. A genuine cross-scope conflict must be resolved by amending the higher conceptual document or the lower formal contract explicitly, never by local implementation choice.

## Active direction

**Work order (2026-09-14, owner-directed correction pass):**
`docs/planning/CAMPAIGN3_WORK_ORDER_2026_09_14.md` governs the next increment. It
reorders GA work only; it reopens no contract, allocation, model byte or digest.
Sequence: (1) run the salience-law comparison as pure arithmetic and record a verdict;
(2) publish corpus `0.28.0` from the prepared successor manifest; (3) write the owed
EMB and ATTN verdict entries; (4) adopt `CHECKPOINT_TEMPLATE.md`; (5) resolve the concern-feedback owner ruling; (6) resume GA registration and model
closure. Items 1–6 are COMPLETE. The bounded GA implementation and qualification
closed on 2026-09-20; see `docs/planning/GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md`
and `VER-C3-GA-001`. The subsequent large bounded public BODY/MULTISOURCE checkpoint
is also COMPLETE: `docs/planning/CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md` and
`VER-C3-MULTI-002`. It has43 distinct models,62 public runs and227 prefix restores.
Records707..733/namespace1149 implement that contract; its closure counters were733/0.
RO-C3-001 is CONDITIONAL after discharging its immediate public-source debt; general
receiving laws remain unresolved. Preserve the rejected construction cohort and codec
regression receipts. No whole MULTISOURCE, general Need or Campaign3 PASS is implied.
The 2026-09-14 preflight/bookkeeping pass does
not start or split that implementation pass.
The "Resume here" sequence in `GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13.md` and the
ordering in `GENERAL_ATTENTION_CLOSURE_PLAN.md` are superseded on ordering only; their
technical content stands.

`docs/planning/CURRENT.md` is now a one-page state index that is **replaced, never
appended**; its prior chronology is preserved verbatim in `CAMPAIGN3_LOG.md`.
Report the two program counters (highest allocated record type; record types allocated
since the last verdict or corpus member) at every checkpoint. Past 50 on the second, the
next work item must be an experiment or a corpus promotion, not another allocation.

Campaign 3 is active: start at docs/planning/CURRENT.md and
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
`GENERAL_ATTENTION_RESUME_BRIEF.md`
preserves the completed pass's instructions. `CAMPAIGN3_ENTRY_READINESS.md`
preserves the dated entry audit with current routing; the seam ledger labels its
current bounded coverage separately from historical summaries. Missing phenomena are BLOCKED
or PARTIAL, not passed by Campaign2 completion. ATTN-001 and EMB-001 own newly explicit
debts. PHEN-BIO-001 means biography and keeps its immutable ID. Corpus `0.29.0` has
21 members; PHEN-ATTN-001 1.1.0 adds the qualified bounded GA fixture, preserving
the other twenty members. Corpus0.28.0's eleven additions entered as three PARTIAL
and eight BLOCKED. Membership is not qualification. Broad source/feedback extensions still
require accepted contracts; do not implement them from the external review alone.
`CAMPAIGN3_BODY_RESEARCH_FRONTIER.md` opened that investigation and its BODY scope is
now bounded-qualified; the work order above supersedes it as the current entry point.
Missing coverage blocks affected verdicts, not all bounded research.

Preserved Campaign 2 checkpoint (2026-09-09): Campaign 2 is complete in the bounded thin-scaffold
scope of `docs/planning/CAMPAIGN2_COMPLETION_REVIEW.md`. The cognitive pipeline and
complete-prefix RNG persistence are qualified under their exact frozen versions.
Campaign 3's expanded corpus is now admitted, not already passed. The Campaign 1 narrative
below is historical; current seam/decision dispositions are in the formal register
and the latest planning receipts. Preserve their public/component limits and all
unresolved broader decisions. Do not restart old Campaign 1 or Phase 3 plans.

CharacterLab is undergoing a ground-zero architectural refoundation.

The active implementation belongs in `src/`. It begins only after the relevant deterministic substrate and seam contracts exist. The first implementation target is the North-Star Reference Scaffold: a thin, deterministic, end-to-end causal topology whose candidate distinctions can be ablated, substituted, merged, derived, compressed, or retracted.

Campaign 0 passed on 2026-09-01. Its immutable candidate-era identifiers remain accepted contracts. Campaign 1 is active. Exact bounded measurement under `observation/0.1-candidate` passed its vectors and closed `MATH-006`, but its concept-token path is only a restricted identity-establishing-channel control. Amended `SEM-001A` is accepted: `PerceptualReferentId` is an observer-relative continuant-file for perceived people, discrete objects, places, or spatial regions; continuity may be objectively wrong, allocation is independent per observer, and ordinals are opaque. `SEM-001B` and `CV-SEM-023..030` fix truth binding occurrences, governed roles, event-specific cardinality/narrowing, and role-evidence precision. `SEM-001C` and `CV-SEM-031..040` fix separate fallible event-files and event-grouped perceived bindings. `SEM-001D` and `CV-SEM-041..050` fix six independent continuant appearance facets, optional exact booleans, feature missing/false, sole facet authority, provenance, rollback, and output boundaries. Accepted `SEM-001E` and `CV-SEM-051..060` fix separate event-pattern facets, scoped typed event-feature evidence, a definitionally necessary rope-skipping-pattern conjunction, sole facet authority, append-only historical classification, typed Action-role projection asymmetry, and replacement of historical direct truth-action projection. Accepted `SEM-001F` and `CV-SEM-061..070` fix observer-owned recognition candidates, mapped identity claims, typed cues, exact unique-uncontradicted support, immutable evaluations, append-only assert/replace/withdraw resolution chains, false-tracking preservation, and recognition output boundaries. Accepted `SEM-001G` and `CV-SEM-071..080` fix closed schema/version-admitted character evidence references, consumer-specific typed `ReadDomain` admissibility, same-observer safe linkability, occurrence opacity, separate omniscient/character provenance graphs, proposition-local future evidence quality, and nonrecursive multi-role character-relative causal-role evidence. Accepted `SEM-001H` and `CV-SEM-081..090` fix strict current/consequence truth cutoffs, conditional bijective experience reservation, immutable experience/recognition-input staging, canonical independent classification, perceived-outcome learning, adaptation separation, `ORD-001` isolation, and exact two-lane phases under `ordering-phases/2-candidate`, with phase 150 non-schedulable. Accepted `SEM-001I.1` fixes the canonical schema inventory, including exact occurrence keys, recognition-knowledge character-state ownership, trace-only recognition evaluations, self-sufficient resolution state, typed occurrence allocation, revision-topology history, and explicit transition result identities. Accepted `SEM-001I.2` freezes record types `210..259`, the reviewed typed-ID namespaces and occurrence namespaces through `1115`, finite values, and manifest-governed union layouts; namespace `1004` remains genuinely available and absent from the registry. Perceived event pattern remains distinct from learned action-schema recognition. The parent `SEM-001` remains the P0 blocker: `SEM-001I.3` codecs/persistence proof and the `SEM-001J` integrated gate remain unresolved. Implement the permanent allocation only through its accepted table; do not implement downstream learning until the parent closes. Visibility never implies recognition; classification, tracking, recognition, and appraisal remain separate; truth handles and unobserved truth facets stay trace-side. `ONT-001` owns later ontology/inheritance/affordance semantics.

Do not automatically resume the former Phase 3A → 3B → 3C plan.

## Historical implementation boundary

The complete pre-refoundation implementation is preserved under `reference/src/`.

- Treat `reference/` as read-only historical evidence and a source of control implementations.
- Do not import any module from `reference/` into `src/`.
- Do not copy a historical mechanism into `src/` merely because it already exists.
- Reuse requires an explicit architectural reason and must preserve the new seam contract rather than the historical module shape.
- Do not modify `reference/` unless the task explicitly concerns historical reproducibility or a reference-only correction.
- Run `npm run test:reference` when validating the preserved implementation.

Git history and `reference/` preserve the past. New work must not make the historical tree canonical by accident.

## Fresh-source rules

- `npm test` targets only tests under the new `src/` tree.
- No character-model primitive is authoritative merely because it existed before refoundation.
- Keep truth, evidence, memory, recognition, belief, appraisal, affect, motivation, reasons, decision, intent, expression, execution, and consolidation separately traceable until experiments earn a reduction.
- Prefer explicit competing implementations over compatibility flags threaded through the historical model.
- Record reduction verdicts with their tested phenomenon corpus.
- Treat `../vivarium/Docs/CharacterLabMathematicalReference.md` as a formula inventory, not authority. Import only through the formula-intake ledger and a versioned formal seam contract.
- Preserve the Phase 2.9–2.97 unresolved-Decision dice grammar and reinforcing identity loop as mandatory initial reference implementations and controls. Port them through new seam contracts; do not omit, replace with opaque weighted randomness, or discard their regression experiments without an explicit reduction experiment and verdict.
- Before designing or implementing any seam, consult `docs/planning/REFERENCE_MECHANISM_LEDGER.md`. Every applicable historical mechanism or finding must receive an explicit port, control, corpus, candidate, supersession, or retirement decision. Do not silently drop it merely because active source started clean.
