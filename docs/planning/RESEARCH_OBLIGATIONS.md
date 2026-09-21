# Research obligation bookkeeping

Adopted 2026-09-20. LOCAL DISPOSITION. Counters **706 / 0**; no owner ruling.

[RESEARCH_OBLIGATIONS.json](RESEARCH_OBLIGATIONS.json) is the canonical obligation
index. Verdicts remain the evidence authority; this index neither selects laws nor
changes corpus requirements, accepted contracts or frozen receipts.

Every new or amended Campaign 3 verdict or qualification must create/reference its
material obligations in `verdictReviews` or `reportReviews`, or give an explicit
`noneRemainingReason`. Record established findings separately from unresolved
hypotheses. An owner is the responsible seam/campaign, not a request for an owner
ruling. A failing candidate's regression test preserves the counterexample; it does
not by itself prove that future producers satisfy the corresponding constraint.

`ACTIVE` means work belongs to the current frontier. `CONDITIONAL` means a named
future claim or trigger requires reconsideration; it creates no immediate work.
`CLOSED` requires a disposition, rationale and linked evidence: resolved by
experiment, explicitly retained distinction, or retired by evidence. Deferral is
not closure: keep the obligation conditional with a named destination and trigger.
Retention closes only the named preservation question, not an untested necessity
claim. Split an entry if part is settled and part remains open.

| Entry | Preserved question | Initial state |
|---|---|---|
| RO-C3-001 | Shared evidence, independent motives and orphan-modifier influence | ACTIVE |
| RO-C3-002 | Separate concern feedback arms and competing response laws | CONDITIONAL |
| RO-C3-003 | Retrieval response ceiling versus fixture crossover | CONDITIONAL |
| RO-C3-004 | Salience/resource laws and representation footprint | CONDITIONAL |
| RO-C3-005 | Use versus significance protection | CONDITIONAL |
| RO-C3-006 | Selection/access comparator equalities | CONDITIONAL |
| RO-C3-007 | Broader GA source and horizon limits | CONDITIONAL |
| RO-C3-008 | Body/Need ownership and receiving scope | CONDITIONAL |
| RO-C3-009 | Earned identity versus retained history | CONDITIONAL |
| RO-C3-010 | Bounded belief versus general inference, confidence and causal learning | CONDITIONAL (added at VER-C3-BELIEF-001) |
| RO-C3-011 | AFFECT factor sources, grounded response and later feedback | CONDITIONAL after VER-C3-AFFECT-001 (initially ACTIVE) |

The seed covers all eight current Campaign 3 verdicts and eight named reports,
including historical qualification support documents. It is not a claim that every
historical note or Campaign 0–2 limitation has been audited. Existing reference
mechanism/corpus obligations remain binding; link them rather than replacing them.

Before Campaign 3 exit, audit material findings against verdicts, qualifications
and their cited evidence: **zero unaccounted-for material findings**. A later campaign
may inherit conditional work; that does not waive a current mandatory corpus gate.
Before Campaign 4 merges/retires a mechanism, record the relevant obligation IDs
and how the proposed claim satisfies their closure requirements or excludes their
uncovered scope. An empty relevance set requires a written rationale.

Run `npm run check:research` (also included in `npm test`). It checks all Campaign 3
verdict headings, recognized Campaign 3/GA qualification filenames, indexed report
paths, owners, reciprocal references, closure evidence and CURRENT counts. Register
reports with other names explicitly. `--self-test` exercises bookkeeping failures.
The check verifies structure and file existence, not scientific completeness or the
adequacy of evidence. Do not treat a green check as a research verdict.

**Stage C comparator / North Star transfer:** no new model in this bookkeeping pass;
preserve the named GA and MULTISOURCE competitors so later reduction cannot silently
erase separately traceable motivation, evidence, encoding and accessibility.
**Current routing:** common-evidence, bounded BELIEF and bounded AFFECT public work
are complete. See CURRENT.md;0 active/11 conditional/0 unowned. Broader receiving,
belief and affect/control/feedback laws remain conditional, not closed.
