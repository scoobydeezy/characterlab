# CharacterLab agent directives

## Start here

Read [CURRENT.md](docs/planning/CURRENT.md), then
[ASSEMBLED_CHARACTER_WORK_ORDER.md](docs/planning/ASSEMBLED_CHARACTER_WORK_ORDER.md).
The active direction is assembly of one continuing character.
Workbench/UI development and Campaign 4 are stopped pending assembly acceptance.
This checkout is the preserved Workbench line; implementation starts from
`788e1a89ce44ffe9f8c2b56d9078ee1b6b44d535` using work-order milestone M0.
Do not execute historical TODOs, resume old audits, or retain/revisit browser tabs.
Old instructions are archived in `docs/planning/archive/2026-10-25-workbench-routing/`.

## Authority

Resolve conflicts by subject and the following hierarchy:

1. `CharacterLab — Ideal Character Architecture North Star.md`: capabilities/invariants.
2. `CHARACTER_ARCHITECTURE.md`: canonical topology, state ownership and causal ordering.
3. `CharacterLab — Ideal Character Research Program Brief.md`: method and proof burden.
4. `docs/formal/`: exact accepted, versioned executable semantics.
5. `CharacterLab — Reference Architecture Build & Research Campaign Plan.md`: sequence.
6. `docs/planning/`: work order, scoped evidence, obligations and current status.
7. `reference/`: historical hypotheses and controls, not current architectural authority.

The Research Brief governs research method, not an accepted contract's exact math,
domains, quantization or schema. Formal contracts cannot redefine required phenomena,
boxes or epistemic boundaries. Resolve cross-scope conflicts by explicit amendment.
Name the implemented contract version. No primitive becomes authoritative by existing.

## Assembly boundaries and escalation

Follow the work order's single-model, single-state, single-scheduler requirements.
No hidden per-phenomenon pipelines or new standalone phenomenon factories.
Scenarios configure the same mechanisms; they do not dispatch to substitute psychology.
The pinned denominator remains 21 corpus members / 15 families / 132 clauses.
Intermediate breadth is not completion. No UI or reduction is authorized by a milestone pass.

Apply `docs/planning/CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md` for routine choices.
Assembly additionally requires the M0 baseline/comparison review, M2 classified
mechanism-register review and owner rulings on genuine alternative laws.
Escalate ontology/authority conflicts, equally supported incompatible laws, unearned
reductions, or changes to the pinned scope/completion rule. Do not escalate mere
deterministic representation choices or differences with an established disposition.
Never silently select the easiest law or average competing laws.
OD-C3-001 remains ratified within its transient-state-to-attention scope:
TaskConcern is not general Affect; A/B/C remain candidates, not settled laws.

## Work limits

One active milestone and one long-running validation job. Before coding, CURRENT.md
must contain its bounded card: observable capability, scope, contracts/files,
predeclared comparison, checks and failure risks, runtime/output budget, done condition.
Follow the work order's limits: 3 capabilities, 12 production/test files per package,
20 evidence files / 5 MiB by default. Split or request an explicit budget amendment;
never discard material evidence or shrink final scope to fit a limit.
No verifier chains, recursive source copies, catalog revision chains, source holds,
browser qualification or speculative audit tracks. Passing checks ends verification
unless a new change/failure supplies a concrete reason to rerun.
Five unchanged-disposition revisions or two attempts at the same unchanged blocker:
stop and explain the decision needed. Do not create more paperwork to bypass the stop.
Keep AGENTS.md <=120 lines, CURRENT.md <=80, the work order <=250.
Git stores history; keep one baseline, one register, one compact result per milestone.

## Research and artifact preservation

Keep accepted contracts, frozen bytes/hashes, controls, meaningful comparators and
failed/corrected evidence. Do not rewrite history to make a successor look accepted.
Every new/amended Campaign 3 verdict or qualification must reference material
obligations, or a none-remaining rationale, in `docs/planning/RESEARCH_OBLIGATIONS.json`.
Follow `RESEARCH_OBLIGATIONS.md`; run `npm run check:research` when applicable.
Conditional debts remain conditional until triggered; deferral does not close them.
Before reductions, check obligations naming the affected distinction.
Before any seam implementation, consult `REFERENCE_MECHANISM_LEDGER.md` and preserve
each applicable mechanism as port, control, corpus, candidate, superseded or retired.
Preserve the addressed dice and reinforcing identity controls through accepted seams.

Keep tracked files below 50,000,000 bytes. Stage only intended changes and run
`npm run check:git-size` before committing.
Large preserved evidence lives losslessly in `evidence-archives/`; restore it with
`npm run evidence:restore` after cloning and before research checks.
Do not broadly ignore JSON, drop evidence, or change original hashes/paths.
Use Git references instead of new copies of the entire source tree.

## Historical implementation

`reference/` is read-only unless explicitly working on historical reproducibility.
Do not import it into `src/` or copy a mechanism merely because it exists there.
Active simulation tests target `src/`; use `npm run test:reference` when changing or
validating historical implementation. Treat the Vivarium mathematical reference as
a formula inventory, not authority. Preserve traceability between truth, evidence,
memory, recognition, belief, appraisal, affect, motivation, reasons, decision, intent,
expression, execution and consolidation until an explicit experiment earns reduction.
