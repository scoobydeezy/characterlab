# AFFECT appraisal carry: original diagnostic limitation

2026-10-23. LOCAL DISPOSITION. Workbench inspection finding; no new psychological
verdict, law selection, comparator retirement or Campaign 4 acceptance.

The accepted `affect-public/0.1-candidate` execution captures committed safe outputs
before settling each instant. Appraisal selects the last completed frozen observation
and the last earlier Known appraisal. Feedback uses that appraisal only when enabled.
The original `affectRuntime.ts` implements those operands with `committedCarry`.

Its trace construction instead assigns `carry = name === 'appraise' ? outputs : []`,
where `outputs` is the current handler's emitted output list. Consequently the
diagnostic input projection contains the current appraisal, rather than the prior
carry described by the nearby comment. This is not evidence that execution used
current or future cognitive operands. It is a limitation on interpreting this trace
field as an ingress receipt.

`workbench-affect-appraisal-carry-rev2/receipt.json` verifies four complete original
snapshots (baseline, hidden, feedback-2, zero-baseline): 44 appraisals, 40 selected
contexts, three available known priors, one enabled feedback use. All44 input
projections match current outputs and disagree with the earlier carry. Selection
reconstructed from strictly earlier top-level committed outputs matches the recorded
context and feedback, and remains identical in prefix-restricted history.

Original snapshot hashes, runtime sources, and failed/corrected checker revisions
are preserved. Revision1 failed only because a rejection-message regex expected
uppercase Feedback; revision2 accepts the actual lowercase message. No runtime fix
or historical byte rewrite was made. Both live source holds remain intact.

The workbench may show this **reconstructed selection**, original source-event links,
and the explicit trace limitation. It must not call the diagnostic input an exact
earlier-carry receipt or infer completeness from arbitrary truncated histories.

RO-C3-011 retains this distinction for future affect/trace completeness claims. The
Workbench entry review must account for it. Any repair needs a versioned successor
trace/adapter qualification with exact identity and replay consequences disclosed;
it must preserve the original models, saves, traces, comparators and this finding.
The existing conditional obligation remains conditional; this finding grants no
waiver of required workbench entry gates and creates no owner ruling.
