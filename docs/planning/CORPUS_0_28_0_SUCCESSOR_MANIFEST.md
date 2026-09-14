# Prepared corpus successor — `corpus/0.28.0`

**Status: EXECUTED 2026-09-14.** `corpus/0.28.0` is published at digest
`1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`, computed by the
project's own `cenc/1` encoder after first reproducing the accepted 0.27.0 digest from its
ten members. See `CORPUS_0_28_0_PROMOTION_REV1.json` and
`scripts/promote-corpus-0-28-0.mjs`. The text below is the plan that was carried out and is
retained as the historical record; `PHENOMENON_CORPUS.md` is now the governing manifest.

Original status, preserved: **PREPARED, NOT PUBLISHED.** Created 2026-09-14 by the owner-directed correction
pass. This document does **not** modify `PHENOMENON_CORPUS.md`, and `corpus/0.27.0`
remains the governing corpus at digest
`3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276` until the promotion
procedure below is executed by the project's own tooling.

**~~The `CorpusManifestDigest` is deliberately left unset.~~ — SUPERSEDED 2026-09-14;
the digest is now computed and recorded in the header above.** The rule it stated still
holds and was followed: the digest is
`SHA256(cenc/1 set of CorpusManifestEntry records)` (type 174, schema version 1), it can
only be produced by the project's encoder, and it was never hand-written. The encoder was
validated by reproducing the accepted 0.27.0 digest from its ten members before any new
value was trusted.

---

## Why publish a successor now

Campaign 3's declared output is a list of discriminating gaps (Campaign Plan §6).
Eleven complete-format proposals have existed in `CAMPAIGN3_CORPUS_INTAKE_DRAFT.md`
since 2026-09-10 and have been audited twice (`CAMPAIGN3_PRE_ENTRY_AUDIT.json`,
`CAMPAIGN3_DISCOVERY_AUDIT_REV2.json`). Three now carry executed partial evidence
(`CAMPAIGN3_POST_EMB_COVERAGE.md`). They are held out of the manifest pending "corpus
review and an intentional successor manifest" — which is correct process, gated on
nothing external.

The governing principle:

> **Corpus membership asserts that an obligation exists. It does not assert that the
> obligation passes.**

`CAMPAIGN3_ENTRY_READINESS.md` already states the consequence of getting this wrong:
*"An absent fixture has UNKNOWN discriminating power, not zero importance."* That
principle currently lives in a planning document while the manifest Campaign 4 will
rank from still says ten. Promoting these eleven with honest `BLOCKED` / `PARTIAL`
status is what makes a Campaign 4 reduction ranking legitimate.

Nothing here weakens an obligation. Every requirement in the intake draft carries over
unchanged, including the ones that cannot currently be executed.

---

## Proposed manifest — 21 members

Existing ten members are **unchanged in ID, version and obligation**. Eleven new members
take `1.0.0-draft` and the dispositions recorded in `CAMPAIGN3_ENTRY_READINESS.md` and
`CAMPAIGN3_POST_EMB_COVERAGE.md`.

| PhenomenonId | Version | Brief family | Historical intake | Status at publication |
|---|---|---|---|---|
| `PHEN-ADAPT-001` | `1.11.0` | 12.1 | `P3-012` | **PASS** (bounded, unchanged) |
| `PHEN-BIO-001` | `1.0.0-draft` | 12.12 | `MEC-017/018`, `EXP-011/012` | PARTIAL |
| `PHEN-COMMIT-001` | `1.0.0-draft` | 12.7 | `MEC-020`, `EXP-013` | PARTIAL; epistemic setup BLOCKED |
| `PHEN-DECISION-001` | `1.0.0-draft` | 12.14 | `MEC-015`–`019`, `EXP-010` | PARTIAL; clause-complete NOT RUN |
| `PHEN-DET-001` | `1.0.0-draft` | cross-cutting | `SUB-004/008/009` | ACCEPTED PRIOR SCOPE |
| `PHEN-EPI-001` | `1.3.0-draft` | cross-cutting | `EXP-002/008`, `RET-006/014` | ACCEPTED PRIOR SCOPE |
| `PHEN-LEARN-001` | `1.0.0-draft` | 12.4 | `MEC-001/002`, `EXP-002` | BLOCKED in current public profile |
| `PHEN-MEM-001` | `1.0.0-draft` | 12.3 | `MEC-010`, `EXP-006` | BLOCKED for whole phenomenon |
| `PHEN-REASON-001` | `1.0.0-draft` | — | `MEC-012`–`016`, `EXP-009/014` | PARTIAL/component; public BLOCKED |
| `PHEN-SEM-001` | `1.12.0-draft` | 12.3 | `MEC-004`, `RET-014` | ACCEPTED Campaign 1 scope |
| **`PHEN-ATTN-001`** | `1.0.0-draft` | 12.3 / 12.6 | `MEC-005/007/008`, `EXP-007/015`, `CTL-004`, `RET-001` | **PARTIAL** — active selection witnessed; encoding footprint and later probe BLOCKED |
| **`PHEN-BODY-001`** | `1.0.0-draft` | 12.1 / 12.2 | `CTL-001`, `MEC-003/006`, `P3-009/010` | **PARTIAL** — kinetics and observer resolution witnessed; longitudinal comparison and three-model contrast outstanding |
| **`PHEN-MULTI-001`** | `1.0.0-draft` | 12.2 | `SUB-007`, `MEC-013/014`, `EXP-009/014` | **PARTIAL** — two heterogeneous families witnessed; cross-family shared fact BLOCKED |
| **`PHEN-BELIEF-001`** | `1.0.0-draft` | 12.4 | `P3-001/002/003`, `MEC-001/002` | **BLOCKED** — no belief seam; `ORD-001` open |
| **`PHEN-AFFECT-001`** | `1.0.0-draft` | 12.5 | `P3-004/005/008/011` | **BLOCKED** — no factorized appraisal; `ORD-005` open |
| **`PHEN-WORK-001`** | `1.0.0-draft` | 12.6 | `MEC-011`, `P3-011` | **BLOCKED** — no control competition |
| **`PHEN-SKILL-001`** | `1.0.0-draft` | 12.8 / 12.14 | `MEC-019`, `P3-009` | **BLOCKED** — execution is not skill-dependent |
| **`PHEN-SOCIAL-001`** | `1.0.0-draft` | 12.10 | `P3-006/007/008`, `EXP-008` | **BLOCKED** — no social seam; `ORD-002` open |
| **`PHEN-HABIT-001`** | `1.0.0-draft` | 12.9 | `P3-012`, `CTL-001` | **BLOCKED** — no habit/reinforcement contract |
| **`PHEN-REL-001`** | `1.0.0-draft` | 12.11 | `P3-006/007/008/012` | **BLOCKED** — no relationship state |
| **`PHEN-LONG-001`** | `1.0.0-draft` | 12.15 | `EXP-011/012/013`, `MEC-018` | **BLOCKED** — no longitudinal horizon |

Coverage after publication: **13 of 15 Brief families have at least one named member**
(12.13 Communication and, arguably, 12.15's full combination remain unrepresented by a
dedicated executable fixture). Before publication: six.

### `PhenomenonId` assignment note — resolved 2026-09-14

**`PHEN-ATTN-001`.** An earlier draft of this manifest proposed `PHEN-ATTN-002` to avoid
visual resemblance to the `ATTN-001` seam/decision identifier. That was wrong and is
corrected here: `ATTN-001` and `PHEN-ATTN-001` are different typed namespaces, the
`PHEN-` prefix already supplies the phenomenon namespace, and skipping the ordinal would
encode a **fake historical fact** — it would imply that some `PHEN-ATTN-001` exists or
once existed. That is precisely the kind of identity meaning this project forbids
inferring from a neighbouring namespace.

The authoritative check was run before assignment: no `PHEN-ATTN-*` entry or reservation
exists in the corpus manifest or anywhere in the staged allocation material, and every
existing family uses `-001` for its first member. If a genuine reservation is later found
in the authoritative allocation inventory, stop and re-assign then — but not for
resemblance.

**Standing rule, adopted from this correction:** never skip an ordinal merely to avoid
resemblance to an identifier in another typed namespace. An ordinal gap requires an
actual reservation or history reason. It is recorded in `CHECKPOINT_TEMPLATE.md`.

All other IDs follow the existing short-stem convention.

---

## Requirements carried over unchanged

Each new member's **Required setup domain, Interventions, Observable obligation, Causal
counterfactual obligation, Epistemic obligation, Historical/developmental horizon, Exact
comparison rule, Required trace fields, Applicable seams and Reopen conditions** are the
complete-format text already written in `CAMPAIGN3_CORPUS_INTAKE_DRAFT.md`. Promotion
copies that text into `PHENOMENON_CORPUS.md` verbatim. **Do not paraphrase, soften, or
drop a clause to make a disposition easier to reach** — in particular:

- `PHEN-ATTN-001` keeps the matched sparse/dense encoding pair and the later retrieval probe.
- `PHEN-MULTI-001` keeps the cross-family shared-fact and sign-intervention clauses.
- `PHEN-COMMIT-001` keeps its positive permitted-witness branch; private-state exclusion does not substitute for it.
- `PHEN-BODY-001` keeps the stored-meter and authored-reference three-model comparison.

---

## Ordering requirement — verdicts before the digest

The two owed verdicts (`VER-C3-EMB-001`, `VER-C3-ATTN-001`) were written **before** this
manifest is compiled, and that ordering is required rather than incidental:

```text
execute bounded experiments
        |
record exact verdicts and limits
        |
finalize promoted phenomenon identities and versions
        |
compile corpus 0.28.0 manifest
        |
compute digest / pin bytes
```

The manifest and digest are an intentional commitment, and changing membership or a
version afterward requires another aggregate-version change. Settling the upstream
dispositions first is what prevents discovering that a verdict's wording implies a
slightly different phenomenon boundary than the frozen membership assumes. Both verdicts
are now recorded; `VER-C3-ATTN-001` states explicitly that `PHEN-ATTN-001` is **not**
passed and that its encoding-footprint and retrieval-probe clauses remain BLOCKED.

## Promotion procedure

1. Review this manifest. The `PhenomenonId` question is settled above (`PHEN-ATTN-001`);
   confirm against the authoritative allocation inventory before computing the digest.
2. Copy each new member's complete-format entry from `CAMPAIGN3_CORPUS_INTAKE_DRAFT.md`
   into `PHENOMENON_CORPUS.md`, preserving the existing ten entries byte-for-byte.
3. Set `CorpusVersion: corpus/0.28.0` and update the manifest table.
4. **Compute `CorpusManifestDigest` with the project's own `cenc/1` encoder** over the
   `CorpusManifestEntry` record set, following the pattern of
   `scripts/audit-phen-adapt-corpus-promotion.mjs`. Record the computed value.
5. Write a promotion receipt (`scripts/` audit, JSON) verifying that the ten preserved
   entries are unchanged and that the digest commits to the full 21-member manifest.
6. Record the version change in `VERDICT_LEDGER.md` and `SEAM_LEDGER.md`, and note in
   `CAMPAIGN3_CORPUS_INTAKE_DRAFT.md` that the eleven proposals are now members.
7. Update the corpus counter in `CURRENT.md`.

Verdicts already recorded against `corpus/0.27.0` keep that version and digest. Adding
members does not invalidate them; it changes what future verdicts must declare coverage
against.

---

## What this explicitly does not do

- It does not claim any new member passes. Ten of the eleven are `BLOCKED` or `PARTIAL`.
- It does not unblock any seam, authorize any implementation, or accept any mechanism.
- It does not change `corpus/0.27.0`, its digest, or any verdict resting on it.
- It does not modify `PHENOMENON_CORPUS.md`. That is step 2 above, done by the project.
