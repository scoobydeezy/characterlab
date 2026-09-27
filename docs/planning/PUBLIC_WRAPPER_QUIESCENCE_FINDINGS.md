# Public wrapper quiescence audit — preserved findings, 2026-09-26

RO-C3-022 CLOSED by VER-C3-PUBLIC-QUIESCENCE-001. LOCAL DISPOSITION; no owner ruling.
Counters 1450 / 0. No psychological clause promotion.

The inventory starts from every native Campaign3 runtime using createCanonicalSave
(47), plus General Attention's manual Save132 producer and Campaign2's shared
adaptation runtime. Public factory routing is checked separately. Component-only
research runners are not silently promoted to native factories.

## Confirmed failures and controls

The raw continuation arrays in identity Task, identity Biological and Biology public
allowed a save after scheduler commit but before ledger commit. The first two
biological fixtures do not draw until instant9; their first eight accepted saves
were consistent, and instants9..12 exposed the tear. Exact probes and every ordinary
completed save hash are retained in public-wrapper-quiescence-rev1/*-probe-rev1.json.

The older CognitiveRandomSession-based runtimes already reject continuation-ledger
reads while their oracle is live. Their superficially similar post-scheduler commit
does not establish a torn-save defect. Read-boundary probes, including receiving
and multisource, exercise that independent defense. Some scheduler-only snapshots
can publish a complete scheduler transaction without reading the pending ledger.

Embodied had a different defect: no wrapper-level concurrent-call barrier. A second
settlement at the scheduler-to-cleanup boundary began before the old ingress was
closed; cleanup then interfered with the new call. The preserved receipt records
Failed status and an undefined ingress abort error. This is a lifecycle defect,
not a torn-save or psychological finding. An adapter applies the same whole-operation
barrier to its older scheduler-named API.

The selected repair preserves all formulas, state roots, schema/model/run bytes and
ordinary settlement order. It blocks mixed publication and overlapping cleanup.
See docs/formal/PUBLIC_WRAPPER_QUIESCENCE_CONTRACT.md.

## Evidence preservation and harness findings

PRESERVATION.json retains 1,108 pre-repair source/dependency artifacts. The existing
closure receipts are immutable. Run scripts/check-preserved-public-wrapper-evidence.mjs
to verify those historical receipts against that explicitly preserved graph. Its
read-only source mapping is for historical evidence checks only, not current tests
or behavior qualification. Direct old checkers still target their original live
paths; current repaired sources are qualified separately.

The first audit harness used Personstate instead of the exported PersonState name.
That HARNESS_ERROR receipt is retained; the corrected revision probes the real
runtime. It is not a runtime failure.

The first new boundary-test cohort passed4/failed2. Both failures assumed the
biological fixture drew at instant1. The guard assertions passed, but the fixture
did not yet have competing motives. The original test is preserved alongside its
receipt. Revision2 moves that check to instant9, retaining the nonempty-ledger
assertion; all6 tests pass. Do not count this correction as new behavioral coverage.

The complete identity/biology successor matrix is frozen before qualification:
same84 identity and58 biology cases,698 originally selected prefix continuations.
Embodied adds the same7 original cases and49 whole-prefix comparisons/restores.
The repair does not broaden their original biological or identity claims.

All149 cases/747 prefix checks,74 affected/328 reference tests, build and the
49-producer inventory checker pass. Closure: PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json.
No architectural escalation is needed.
