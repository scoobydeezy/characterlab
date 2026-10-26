# Assembled character model contract

Version: **assembled-character-model/0.1-candidate**, 2026-10-25.
Authority: owner-approved M2 D1/S1–S4/A1–A3. Written before implementation.
This replaces digest-cohort admission for the first assembled configuration domain.
It adds no psychological equation or new phenomenon claim. Later domains extend this
contract and the same composition; they cannot select a separate runtime.

## Domain and identity

The public source is the existing nine-field, plain-data model declaration:
rulesVersion, contentSchemaVersion, registrySchemaVersion, parameterSchemaVersion,
numericProfileVersion, randomAlgorithmVersion, content, registry, parameters.
No accessors, callbacks, extra fields or caller identity are accepted. Snapshot all
caller bytes before awaiting. Canonical encoding, rational normalization and the
closed schema inventory remain CENC1 and the accepted cognitive allocation table.

Required versions: rules/assembled-character/0.1-candidate;
assembled-character-registry/0.1-candidate; content/0.2-candidate;
campaign2-parameters/0.1-candidate; numeric/task-cognitive-exact/0.1-candidate;
the substrate RANDOM_ALGORITHM_VERSION. The new rules/registry identities bind
this contract and fixed dependency semantics. Every supplied declaration byte and
version participates in model identity; S0/input/seed participate in run identity.
No membership lookup in FREEZE.models and no recipe metadata exist in this compiler.

## First configurable fields

The receiving topology below is fixed; these fields vary independently subject to
all listed invariants. No preset names or per-scenario selectors are inputs.

| Declaration | Configurable fields and exact domain |
|---|---|
| Task specifications definition/task-a and definition/task-b (370) | Desired minimum/maximum fields3/4: canonical rationals, 0 <= minimum <= maximum <=10. Activation/deadline fields5/6: integers, 0 <= activation < deadline. No finite list of allowable fractions or times. |
| definition/task-concern (385) | Gain field1: exact rational in[0,1]. Existing enabled flag remains fixed. |
| definition/task-motive (392) | Pressure field1: exact rational in(0,1]. Existing enabled flag remains fixed. |
| definition/task-workspace (378) | Capacity field2: integer0..3 with the existing shared slot semantics (0 selects none,1 selects one without forecast,2 one with forecast,3 two with forecast). |
| Parameter manifest (one133 record) | Maximum work: positive integer. Exhaustion rejects an instant atomically; a low ceiling is a legal resource configuration, not a promise of completion. |

All other fields are immutable declarations of this first composition, including
reason/dice thresholds, identity K, enabled producers, reference kinds and targets.
Preparing a model validates every configurable field even when its producer would
not execute. Invalid criteria/windows/capacities/gains receive field-specific errors.

## Explicit disposition of nested A2 restrictions

The canonical content and registry in campaign2-task-cognitive-model at db0ca7a8
specify the fixed starting topology. They are reused as immutable declarations,
not as an accepted-model list. Compare every unchanged content/registry field
against that topology after validating the configurable slots above; erase only
those explicitly named slots for this structural comparison. Duplicate keys,
missing/excess rows, changed schema inventories, phases, roles, write scopes,
references, producer bindings or any other undeclared variation reject preparation.
This is a closed first topology with continuous/discrete parameter domains; it is
not arbitrary content/holder/task-count admission. All final assembly requirements
remain open until the contract and composition support them.

| Existing restriction | Disposition in this version |
|---|---|
| Exactly one qualified character, two tasks and workspace targets | Retained topology invariant. Task/spec mapping is bijective; criterion is the shared prediction definition. All task/instruction/action references must resolve to the declared kinds. |
| Inherited character content equality | Retained explicitly. The prediction/memory/regulation component is compiled once as an unchanged internal component, never a second run. Its fixed character and channel declarations cannot be overridden. |
| One holder, observer and CommitmentFidelity channel | Retained. Initial observer bridge, task keys and instruction bindings must match the declared holder; no arbitrary-holder or channel claim. |
| fixture-pulse unit, closed protocol and ADAPT producer/rules | Retained fixed physical/observation topology and accepted equations. Cognitive parameters cannot alter these joins. |
| Learned memory/prediction/identity initially empty, adopted tasks Open | Retained authenticity invariant. No caller-authored learned intermediate. Restore must execute the original prefix, not install a decoded learned state. |
| Source digest must match one of21 recipes | Removed, with no replacement digest list or invented recipe. Invariant admission above is the entire source domain. |

Compile governed content and references, structural ownership/read scopes, canonical
roles and parameter domains before publishing a model. Compile ingress before that
publication too. The unchanged state validators enforce path/value/reference
invariants on creation, reads, writes and restore. Unsupported schemas and ambiguous
or overlapping write authorities reject. No run is a capability to change laws.

## Successor composition and preservation

One prepared model binds one state, scheduler/allocator, common instant transaction,
addressed RNG ledger, trace and checkpoint. Successor boundary files live under
src/assembled; old C2 sources and their105-file dependency closure stay byte-identical.
The frozen M1 alias moves to m1Control.ts; its test changes its import only.

Bounded port: the C2 public factory, state refinements, ingress binding, cognitive
execution adapter and runtime composition glue. State/ingress/execution currently
name the frozen compiler's recipe-bearing TypeScript return type, although their
bodies consume no recipe. Successor adapters name the new model directly and retain
their original bodies. No fabricated recipe, assertion to a frozen-model type,
module augmentation or public callback bypasses admission. Mathematical transforms,
arbitration, state/ownership, observation/SEM and scheduler kernels remain shared.
The large adaptationRuntime is reused unchanged, not copied; its single scheduler
receives this one fixed composition. Later joins version its wiring when necessary.

## Persistence and predeclared proof

Quiescent saves retain accepted schema132 and complete trace schema160. Restore
snapshots data, prepares the declared successor, binds original S0/input/seed, replays
whole instants and requires full canonical save equality. It preserves the replay's
private associations/RNG ledger. Old C2 saves are not silently migrated.

Compare unchanged source(), deadlineSource(), equalCriteriaSource() and data() from
src/test/fixtures/campaign2Cognitive.ts against frozen C2. New model/run identities
must differ; every state/output byte, clock, status and diagnostic must agree at every
settled boundary. Trace comparison substitutes ONLY top-level160 fields2/3 with
the corresponding control identities after asserting the successor fields contain
its actual identities. All other trace fields, including reads/writes, source joins,
phases, event order, outputs, quantization and complete random draws, compare exactly.
Save format is checked by exact repeat/restore within the successor, not by masking
unknown cross-model differences. Original event ordinals, purpose and semantic
subject/reason bindings are unchanged; coupled address tuples/seed therefore select
the same random draws. A changed address, queue or trace is a failure, not normalized.
Cap32 settled instants is a failure if reached; no input truncation.

Non-preset witness fixed before code: A interval[7/3,19/3], window[0,13);
B[8/3,23/3], window[2,17); gain2/5, pressure3/5, capacity3, work ceiling100000.
Same original six events and zero32-byte seed. Verify its old-version source is
rejected by the unchanged C2 factory, and its successor prepares, reaches exhaustion,
repeats exactly and restores after the second settled instant. Compare full identity,
snapshot, save and diagnostics at every boundary, including terminal no-op. Require
real learned state and decision outputs so merely preparing/no-op execution cannot pass.

Negative controls: invalid/reversed criterion, bad window, gain/pressure/capacity/work
limit, wrong-kind reference, duplicate registry identity, overlapping authority,
unsupported schema, modified undeclared topology, foreign observer, authored learned
S0, mismatched model/input and altered save. Also prove caller mutation/accessors
cannot swap declarations and a tiny work ceiling rolls back rather than committing
part of an instant. Foundation conformance selection/budgets are in CURRENT.md.

D2 evidence condition: M2a uses no R3 choice. L-row selections remain labelled
engineering default, no verdict establishing superiority; this source retains C2
semantics as a scaffold, not an asserted realization of the eventual reference laws.
After pass, stop at the M2a result. M3 must separately implement the early interaction.
