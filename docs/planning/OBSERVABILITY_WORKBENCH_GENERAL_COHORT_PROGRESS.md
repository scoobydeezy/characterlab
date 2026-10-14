# General attention frozen cohort qualification

2026-10-13. IN PROGRESS. Required PHEN-MEM-001/full ATTN instrument coverage uses
the accepted General Attention cohort, not merely the Campaign2 measurement-memory
fixture. Prior two-recipe seed0 qualification remains preserved.

GeneralWorkbenchRun now accepts either the original byte-number seed or an exact
64-character lowercase hex seed. Numeric checkpoints retain version0.1 and original
property order for exact export compatibility. Hex checkpoints use version0.2;
version/seed-domain mismatches and malformed inputs reject. Restore still authenticates
the original whole-prefix save before native restoration. Worker/client creation
forwards the complete seed. The UI default remains seed0 pending separate UI work.

Ten focused tests PASS: original adapter/export/transport tests, exact frozen baseline
model/run identity, complete restored tail, malformed seeds, legacy representation,
and actual worker rejection/seed forwarding. Test sessions8935 and seed-worker command
completed exit0. Build4457 COMPLETE exit0,408 modules with existing chunk warning.
Evidence restore/research PASS with18 conditional obligations unchanged.

`check-workbench-general-cohort.mjs` runs all43 frozen recipes with exact seed01..20,
original S0/calendar and direct public execution. Each quiescent save must match in
full; state/output/trace commitments and event counts are retained per prefix. Original
model/run identities must equal FREEZE.json. Each completed model is saved separately;
the final receipt is written only after all models and source hashes pass. This audit
does not claim all-model restore, browser, batch, language or Campaign4 entry acceptance.

Current process: command session68884, node PID35904 observed live. First5/43
PASS:each12 prefixes/153 events. Final receipt remains absent. Do not restart based
on an observation timeout. Poll the same handle and preserve any failure evidence.
Audited sources must remain unchanged until completion. Incremental audit artifacts
remain uncommitted until completion; the tested seed-support change is committed separately.

## Exact-seed browser control

GeneralWorkbench now exposes draft numeric/hex input and Use frozen cohort seed.
Fresh creation applies the draft; import and checkpoint restore synchronize the
displayed active seed and recipe. Existing default seed0 remains unchanged.
Browser verified that choosing the frozen seed leaves the active run hashes unchanged,
creating it matches completed native baseline prefixes0/1, creating numeric7 changes
run identity without changing initial model/state, and restoring the captured frozen
prefix restores all four hashes and the seed display. Full screenshot inspected.
workbench-general-seed-ui-rev1 freezes7 sources/2 captures; its receipt explicitly
uses completed model-00 from the still-running cohort audit, not a final cohort receipt.
Build36984 COMPLETE exit0,408 modules with existing chunk warning. Evidence restore
and research PASS;18 conditional obligations unchanged. No full43-model browser,
file download/import or all-model continuation claim.
