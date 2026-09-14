# Checkpoint template and discipline

Adopted 2026-09-14 by the owner-directed correction pass. Use this for every Campaign 3
checkpoint from here.

## The four rules

1. **`CURRENT.md` is replaced, never appended.** It is a state index. Chronology goes to
   `CAMPAIGN3_LOG.md`. If `CURRENT.md` contains two blocks claiming to be current, it has
   failed. It reached 52 KB, one heading, 21 "latest/current/earlier checkpoint" blocks
   and 33 "remains OPEN" lines before this rule existed.

2. **Report the two program counters at every checkpoint.** They are the early warning
   for specification outrunning research:
   - highest permanently allocated record type;
   - **record types allocated since the last verdict or corpus member.**

   **Threshold: past 50 on the second counter, the next work item must be an experiment
   or a corpus promotion, not another allocation.** This is a stop condition.

3. **Revision cap: 5.** When any artifact reaches revision 5 without a change in
   disposition, stop and ask whether it is load-bearing or ritual. An artifact *derived*
   from manifests should be generated and diffed, not reviewed as a document. The worked
   example is the GA identity-role crosswalk: seventeen revisions, ~34 near-duplicate
   build/review scripts, with REV16 and REV17 identical in size five minutes apart and
   REV17 reporting no change.

4. **Never skip an ordinal to avoid resemblance to an identifier in another typed
   namespace.** An ordinal gap requires an actual reservation or history reason. Typed
   namespaces are independent: `ATTN-001` (seam/decision) and `PHEN-ATTN-001`
   (phenomenon) may coexist, and assigning `PHEN-ATTN-002` "for clarity" would encode a
   fake historical fact — that some `PHEN-ATTN-001` exists or once existed. Check the
   authoritative allocation inventory; if it shows no reservation, take the ordinal.
   This rule was adopted 2026-09-14 after exactly that error was caught in the
   `corpus/0.28.0` draft manifest. It saves later archaeology over gaps that never had
   a cause.

## Template

```markdown
# <Seam> checkpoint — <date>

**Disposition:** LOCAL DISPOSITION | OWNER RULING REQUIRED | QUALIFIED | OPEN
**Stage (Brief §9):** A make seam exist | B intact path | C competing model | D replay | E verdict

## Counters
| Counter | Value |
|---|---|
| Highest allocated record type | |
| Allocated since last verdict/corpus member | |  <!-- >50 ⇒ next item is an experiment -->

## What changed
<two or three sentences; no restatement of prior checkpoints>

## Evidence
<tests passed / faults detected, with the receipt filename>

## Stage C competitor
<the named alternative model for this seam — required BEFORE allocation, not after>

## North Star transfer
<which §30 archetype or §12 family clause this serves, and how>

## Next gate
<one item>

## Owner decision pending
<yes + link to CAMPAIGN3_PENDING_OWNER_DECISIONS.md, or "no">
```

## Why "Stage C competitor" is on the template

Brief §9 has five stages: **A** make the seam exist, **B** make the intact path work,
**C** create a competing model, **D** replay the same corpus, **E** assign a verdict.
At the correction pass's outset, Campaign 3 had been running Stage A almost exclusively,
and the EMB and ATTN bounded qualifications lacked verdict entries. Those entries are
now recorded as `VER-C3-EMB-001` and `VER-C3-ATTN-001`; the discipline still applies.
Naming the competitor before allocation —
rather than deferring it to a closure plan — is what keeps a seam falsifiable while it is
still cheap to change.

Note that mutation testing is not Stage C. Detecting that you broke your own
implementation establishes test sensitivity, not mechanism necessity. This correction is
already recorded in `CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md` and should not be
re-litigated; it just needs to stay visible on the template.

## Why "North Star transfer" is on the template

`src/campaign3/` now contains a substantial visual-search apparatus. Its destination is
correctly aimed at `PHEN-ATTN-001` / `PHEN-MEM-001` / `EXP-006` / `EXP-015`, but a
fixture that cannot state which §30 archetype it stands in for is at risk of becoming its
own world. One paragraph per checkpoint keeps that honest and is cheap. If the paragraph
is hard to write, shrink the fixture rather than closing it.
