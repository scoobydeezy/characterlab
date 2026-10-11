# Named-run participation aggregation

2026-10-11. Workbench IN PROGRESS. This provides an aggregation contract and UI;
it does not complete the required21-member corpus coverage or Campaign4 entry gate.

`participation-cohort/0.1` retains full source participation reports and exact
model/run/state/save/prefix identities for selected named experiments. At most64 runs
and10000 paths per run are admitted. Repeated run identities, duplicate paths, invalid
counts and unsupported report versions fail explicitly. No records are truncated.

One selected cumulative prefix is retained per run. The UI capture command explicitly
replaces an earlier prefix of the same run rather than summing its history twice.
Unequal horizons remain in each observation. Removing an audit member affects the
diagnostic collection only. Native sessions are unchanged.

Alignment requires both an identical seam version and identical model hash, then exact
path identity. Different model laws remain separate groups even when paths have the
same bytes. Within each group, every path has an explicit observation or null for every
member. Null means not observed in retained state/reads/diffs, not zero activity. Totals
and observed/unobserved denominators remain distinct. No semantic correspondence,
causal necessity, inactivity/removal finding or canonical subsystem mapping is inferred.

The General attention UI preserves the selected collection while creating fresh recipes,
exposes per-model/path/per-run observations and prepares a versioned JSON export. The
collection is session-local. Its export is diagnostic evidence, not an importable native
save. The existing authenticated native export remains separate.

Validation:

- Three cohort tests plus two existing participation tests pass: missing observations,
  cross-model separation, detached results, duplicate cumulative prefixes, invalid
  counts, unequal horizons and the64-run bound.
- The first production build found Windows resolving `ParticipationCohort` to the
  similarly named `.ts` data module. The UI was renamed `AuditCohortInspector.tsx`.
  Corrected build/reference boundary passes. The first native verifier then failed
  its source check on the removed filename and emitted no acceptance receipt. After
  confirmed process failure, its path was corrected and the verifier rerun.
- `workbench-cohort-rev1/receipt.json` binds the retained independently verified baseline
  report and a fresh association-decay run checked against all12 frozen native prefixes.
  The two named runs remain two exact model groups. Six source versions are preserved.
- Browser capture replaces baseline prefix0 with prefix11 without increasing the member
  count, then adds association-decay. Full prepared cohort content is compared with
  the independent aggregate in `browser-check.json`. Browser uses keyboard controls and
  the development server; native download and pointer-only workflows remain unqualified.
  The complete287545-character report matches. Mobile client/scroll widths are375/375.
  Section screenshot crops were displaced by page/viewport scrolling; those observations
  remain preserved alongside a full-page capture without crop assumptions.
- Evidence restore/research checks pass:0 active/18 conditional/4 closed/0 unowned;
  103 C3 verdicts/4317 reports. No native semantics or research qualification changed.

LOCAL DISPOSITION: aggregate exact instrument evidence without treating different models
as semantically identical. Full corpus execution/enrollment, canonical subsystem mapping,
controlled causal comparisons, language audits, six-mode integration and the complete
Campaign4 entry demonstration remain required. No owner ruling is needed.
