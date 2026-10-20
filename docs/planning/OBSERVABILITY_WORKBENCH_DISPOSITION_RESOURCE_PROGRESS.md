# Disposition browser horizon and diagnostic size qualification

2026-10-20. IN PROGRESS. This work addresses the required runtime controls and
resource checks. It does not replace all-program coverage or the integrated demo.

Current routing supersedes the tab24 run below: missed turn-scoped handoff marking
closed that tab before terminal acceptance. Its last observed prefix was10 Working;
`workbench-disposition-horizon-ui-rev1/interruption.json` preserves the failure.
The native evidence and completed pause1 receipt remain intact, but the interrupted
run has no terminal receipt. Replacement browser2/tab27 on the same4202 build
repeats pause1, then runs toward18. Revision2's freeze, paused observation and
validation are in `workbench-disposition-horizon-ui-rev2`; its verifier is
`scripts/check-workbench-disposition-horizon-ui-v2.mjs`. Final terminal/mode/history
observations must come from this replacement run, not be stitched to tab24.

## Original Plastic/Main browser run

Browser2/tab24 at127.0.0.1:4202 runs the isolated
`characterlab-disposition-choice-rev1` build served by preview session88884.
It shares the exact source freeze with the choice revision2 audit. The separate
`workbench-disposition-horizon-ui-rev1/freeze.json` binds all sources and its own
verifier, `scripts/check-workbench-disposition-horizon-ui.mjs`.

Run followed immediately by Pause completed exactly one native instant. The UI
returned Ready at prefix1 with Pause disabled. `paused.json` and
`pause-validation.json` establish that all five displayed model/run/state/save/
projection identities match the authenticated original prefix1 snapshot.

Run then resumed toward terminal18. Last recorded observation was prefix3 Working.
`start.json` and `started.png` record initiation only. Preserve tab24 with
markHandoff on continuation turns. Do not reload, reset, switch its top-level
experiment, replace its served build or infer terminal success from elapsed time.

After the UI reaches Complete, collect `browser.json` with the preserved paused
observation, terminal prefix/status/five hashes, disabled Step/Run states and180
Timeline options. Visit Character, Experiment, Reasoning, Timeline, Compare and
Architecture, recording each pressed mode and displayed alerts. Finally select
historical decision19 in Timeline, capture its exact record and unchanged five
hashes, and save/inspect `terminal.png`. Run the final verifier with sufficient
Node heap for parsing the original terminal snapshot. Only its completed receipt
establishes this bounded full-horizon browser result.

Mode availability does not prove every panel's content, heap usage or all-program
browser resource behavior. No latency, heap or responsiveness budget is claimed.

## Exact diagnostic byte census

The choice revision1 verifier failed at prefix14 because serializing two snapshots
into one string exceeded Node's string-size limit. That failure remains preserved;
revision2 uses incremental hashes of every value without narrowing the corpus.

Session94905 completed `scripts/check-workbench-disposition-snapshot-sizes.mjs`.
It authenticates all285 original compressed archives against the comparison
receipt, streams each full gzip decode, counts actual UTF-8 bytes and hashes the
complete decoded stream. It never parses a whole snapshot or concatenates the
corpus. Frozen verifier and parent-receipt bindings are in
`workbench-disposition-snapshot-sizes-rev1`. Its completed receipt covers all285
snapshots:41,218,393,463 decoded bytes in total. The largest is482,251,239 bytes at
program13/prefix18. There are118 snapshots over128MiB and63 over256MiB.
`verification.json` checks the complete15x19 census, original compressed file
lengths, independent gzip ISIZE fields modulo2^32, aggregates, source verifier
identity and parent-receipt binding. It does not repeat decompression.

Serialized diagnostic bytes are not JS string length, parsed-object memory, live
heap, browser memory or native checkpoint bytes. The census will inform resource
work; it does not itself establish a safe browser limit or authorize truncating
authoritative work or diagnostic history. Every original field/event is retained.
Campaign3 semantics, all18 conditional obligations and historical-source limits
remain unchanged.

LOCAL DISPOSITION: a retained compressed evidence archive fitting Git's file-size
rule does not imply that its decoded diagnostic snapshot fits a practical display
or serialization budget. Keep the exact archives and all fields. The observed
combined-string verifier failure and these measured sizes require avoiding whole-
pair string construction in audit work. Browser rendering/retention changes must
follow actual browser evidence and preserve exact historical inspection; the byte
census alone does not justify a heap claim, arbitrary truncation or semantic change.

2026-10-20 browser resource update: horizon revision2 tab27 returned the browser's
This page crashed page for4202. Last verified prefix16 Working; no terminal PASS.
See workbench-disposition-horizon-ui-rev2/browser-crash.json. Preserve pause1 and
failed attempt; investigate resource behavior before another full-horizon attempt.
Native replay continues independently, now program5/15 prefix0 after program4
terminal18 PASS. The cause of the browser crash is not established by byte census.

## 2026-10-20 terminal text census and paging foundation

LOCAL DISPOSITION: full-horizon browser acceptance is still unproved after the
revision2 page crash. Do not restart the same run merely to obtain a green result.
`workbench-disposition-string-census-rev1` authenticates original baseline and
largest-snapshot terminal archives against the prior receipt and byte census.
Each contains all180 original events. Exact UTF-8 string-value content:

| Terminal program | Total string bytes | Unique string bytes | Repeated bytes |
| --- | ---: | ---: | ---: |
| Plastic/Main | 408126835 | 275532773 | 132594062 |
| Plastic/ConstitutionPositive | 451393527 | 304186754 | 147206773 |

Baseline mechanismProjection alone is118980230 bytes; timeline output123503828,
reads71646468, input42580901. Object keys/envelope overhead are excluded. These
are content sizes, not allocated heap, physical string sharing, or a crash-cause
finding. Exact deduplication alone still leaves hundreds of MB of unique text.
The verification receipt freezes current adapter/worker/client/UI call sites and
confirms unchanged158 native replay and277 batch sources.

Prepared `canonicalTextStream.ts` emits the existing exactText JSON format directly
from canonical values without building the intermediate readable tree. Its pager
returns at most65536 UTF-16 code units and explicit offset/total/next offset; every
character remains addressable. It rejects invalid/out-of-range requests. Joining
pages preserves exact text, including split surrogate pairs; offsets are code units,
not bytes or Unicode character counts. Per-page traversal still visits the whole
value to measure total length. Large primitive strings still use JSON.stringify.
No constant-memory or browser resource guarantee is asserted.

Two tests PASS: all canonical types/escaping/empty containers/record order, one-unit
through65536-unit page boundaries; actual admitted Disposition prefix1 saved state
and full historical trace equal existing exactText and do not alter checkpoint.
TypeScript and boundary check PASS. Pager is prepared, not wired into the browser.

Next resource implementation: a separate compact inspection adapter/worker route,
using the same native factory and run identities, should return revision identity,
event headers and path descriptors at each committed prefix. Fetch selected exact
records/text pages on demand and bind requests to saveHash so advancement cannot
silently substitute a new revision. Preserve every event and native save; retaining
history in the worker is not permission to truncate it. Existing comparison/factor
projections must receive their required exact selected records and retain qualified
semantics. Verify parity against original archived snapshots, then full-horizon
browser mode/content/history and actual resource behavior. Avoid changing the live
replay adapter until its current source-bound run completes; new modules can reuse
unchanged native code. All18 conditional obligations and source limits survive.

## 2026-10-20 revision-bound paged adapter and worker

LOCAL DISPOSITION: add a separate inspection route using unchanged accepted native
factory/model/calendar/seed, while the original replay run retains its source freeze.
`DispositionPagedRun` publishes only identity/constitution/law/prefix metadata,
all event headers and state paths. It retains canonical state, complete trace and
mechanism projection internally. `textPage(saveHash, selector, offset, limit)`
selects current state, mechanism projection or any historical event's raw trace
record/input/output/draws/quantization/reads/diffs. Stale revisions, unknown targets,
invalid bounds and concurrent commands fail explicitly. All original events remain
addressable; no UI projection enters native state. Native checkpoint format and
128MB save bound remain the original contract.

Bounded parity test PASS prefixes0/1/2: five native identity hashes, full headers,
state descriptors, selected text pages and total lengths, every event's full source
record/read/diff formatting oracle, unchanged checkpoint, restore1, detached summary
and old event0 output after advancement. Worker command test PASS create/advance,
page reply, stale/bounds/overlap rejection, checkpoint and restore. TypeScript and
boundary checks PASS. A readonly trace-property type error is retained in
workbench-disposition-paged-development-rev1; corrected declaration changes no runtime.

Full baseline native qualification RUNNING: session7413,
`scripts/check-workbench-disposition-paged.mjs`, root
`workbench-disposition-paged-rev1`. Prefix0/1 passed at start; target19 prefixes,
180 headers. It authenticates original archives, compares all metadata/identities,
all paths/headers and sampled projection/state/first-last-event pages. A terminal
receipt is required. This does not claim every page or all15 programs. Process
memory observations include parsing the original audit archive and cannot prove
browser memory bounds. Do not edit its frozen sources while live; UI modules not
bound by this new freeze may be developed independently. Keep original replay28212
and browser BatchV8 running. Poll exact handles rather than infer completion.

The paged worker/client are prepared but no existing six-mode UI has been replaced.
Next: integrate a revision-labelled paged text surface and event navigation with the
worker, preserving historical selections; bridge required qualified factor and
architecture reports without fetching an entire text snapshot. Then qualify browser
full-horizon content/replay/resource behavior. Retained canonical decoding/native
snapshot construction can still be large; this change does not prove those costs
are solved. All Campaign3 qualifications and18 conditional obligations survive.

## 2026-10-20 paged browser integration

Added `DISPOSITION · paged resource qualification` to the inspection selector. This
explicit qualification session uses the prepared paged worker; it is not a claim
that the required six modes have all migrated. Existing six-mode sessions remain
available. All15 original programs are selectable for fresh creation. Controls
support Step/Run/Pause, checkpoint capture/restore, state path and historical event
selection, and4096-unit exact pages. Draft selection never relabels displayed text.
Each loaded page names its exact saveHash and selector. Advance preserves that page
and disables further requests for its stale revision; exact restore re-enables it.
Switching experiments requests pause at the next native boundary.

`workbench-disposition-paged-ui-rev1` bounded browser PASS prefixes0/1/2: initial,
first/second/previous exact projection pages; keyboard Next; stable historical page
through advance; exact restore1; event19 output; all five native identities match
original authenticated archives. Screenshot inspected. TypeScript/build592 modules,
boundary and research checks PASS. Initial router JSX closing-brace typo was fixed
before the source freeze and build. No semantic or native-source change.

Full paged browser horizon RUNNING browser2/tab33 at4209, preview session67726.
`workbench-disposition-paged-horizon-ui-rev1` freezes parent evidence and start;
Run starts from authenticated restored prefix1 toward18. Keep tab33 handoff-marked.
Do not reload, replace its served build, or infer completion from elapsed time.
When Complete, capture status, five hashes, disabled Step/Run, all180 event options,
and the retained event19 output page with its original prefix1 revision. Then load
historical event19 at terminal revision and verify exact text plus terminal hashes;
inspect screenshot and write a terminal verifier receipt. Broader six-mode,
all-program, resource/latency and factor/architecture migration remain open.
Native paged baseline audit7413 was last observed prefix10/18; original replay28212
program5/15 prefix12/18. Both remain independently live and source-frozen.

## 2026-10-20 canonical factor and activity readers

Prepared `inspectDispositionCanonicalReasons` returns the exact existing qualified
reason-diagnostics shape directly from admitted canonical output. It retains strict
stage/version/operand-result lineage, distinct constitution/plastic/standing/effective/
feedback, qualification count and all compiled nuclei/coverage/distributions. It
formats only requested result subtrees, not the complete output and history. Lineage
still encodes canonical values for equality; no constant-memory claim is made.

Prepared `canonicalActivityIndex` reads trace147/148 records and authoritative state
paths directly. It preserves the original activity rows/counts/event links and exact
path labels without formatting entire event inputs/outputs or read/diff payloads.
`equalCanonicalText` compares streaming readable text, preserving the existing meaning
of changed values: signed1, unsigned1 and text1 render equally even though their
canonical encodings differ. This is diagnostic equality, not native state equivalence.

`workbench-disposition-canonical-diagnostics-rev1` freezes sources and records PASS:
three tests, factor parity four original programs at prefixes1/2, all activity rows
for three programs at prefixes0/1/2, malformed lineage/type/stage and duplicate-ID
controls,64 equality pairs, unchanged checkpoints. TypeScript/boundary checks PASS.
These finite probes do not establish full-horizon or all-program coverage. Existing
scope text and18 conditional obligations survive; no new psychological verdict.

Original replay, batch, paged native and paged browser source sets are unchanged.
Readers are prepared for worker-side diagnostic requests after those relevant freezes
finish. Integrating them must preserve event/revision identities, exact factor tables,
source links, architecture ownership distinctions and historical selections. Do not
substitute this bounded parity result for terminal browser resource qualification.
Paged browser last observed prefix6 Working; native paged audit prefix13 PASS.

## 2026-10-20 architecture report bridge

Extracted the existing box correspondence into `dispositionArchitectureFromActivity`.
The full-snapshot path delegates to this mapping; `dispositionCanonicalArchitecture`
feeds it the direct canonical activity index. The existing three character-state
boxes, truth-side execution support, event links, counts, scope and identity fields
remain identical. Canonical state/trace and identity must come from the same trusted
worker revision; this helper does not authenticate unrelated caller data.

The architecture inspector now delegates its report markup and selected-box controls
to `DispositionArchitectureReportPanel`, so a worker-computed report can be rendered
without a complete diagnostic snapshot. Live paged adapter/worker/UI sources were
not changed. Connecting this report to the paged worker remains due.

`workbench-disposition-canonical-architecture-bridge-rev1` PASS two tests: nine native
comparisons (baseline/Refold/inactive-probes, prefixes0/1/2) against independently
retained authenticated reports, and shared-mapping replay of all285 reports across
15 programs from their authenticated activity rows. The latter verifies box mapping,
not a fresh canonical activity census over all285 native prefixes. Checkpoints remain
unchanged. TypeScript, isolated593-module build, boundary and research checks PASS.
Initial wrong receipt-field lookup and test Node-typing failure are retained in the
development folder. Dynamic Node loading remains test-only. No native semantic or
research obligation change; all18 conditional obligations survive.

Four live qualification source sets remain exact. Paged browser tab33 last observed
prefix10 Working; native paged audit7413 prefix15 PASS. Neither is terminal evidence.
Full six-mode migration, complete factor/source coverage and browser resource scope
remain open. The original architecture ownership and zero-activity cautions persist.

## 2026-10-20 canonical resolution linkage

Prepared `dispositionCanonicalResolution` consumes exact canonical reason/decision/
intent outputs, draw records and committed event headers. It preserves the original
resolution report's shape and scope, parent/phase/time lineage, reason-context and
chosen-intent joins, nucleus calibration, face/contribution arithmetic, complete draw
and tie accounting, analytical probabilities, mode and chosen candidate. It uses
streaming readable equality for joins and serializes only result fields, without
formatting/reparsing each complete native output. The canonical factor reader still
encodes its exact operand-result comparison; no heap bound is inferred.

`workbench-disposition-canonical-resolution-rev1` bounded parity PASS: original
baseline/Refold/inactive-probes at prefixes1/2, every retained reasons event, exact
original resolution and score-matrix equality, malformed profile/duplicate reason/
parent lineage and applicable missing-draw controls, unchanged checkpoints.
TypeScript and boundary checks PASS. No full-horizon/all-program mode coverage,
player disclosure, independent causal necessity or browser performance claim.

This prepares the remaining decision-link report for worker-side execution while
all four live source sets stay unchanged. Worker integration must bind the minimal
canonical event envelope to one exact saveHash and continue to expose full source
records through paging; it must not replace provenance with only this summary.
Original semantics and all18 conditional obligations remain intact.

## 2026-10-20 resolution renderer and score matrix integration

`DispositionResolutionReportPanel` now accepts a qualified report directly. The
existing Reasoning resolution inspector delegates to it and includes the prepared
score matrix. Original resolution, tie and chosen-candidate details remain intact;
matrices show exact signed face/standing/situational components and recorded totals.
This is score arithmetic, not the required latent-state vector/matrix or complete
choice explanation. Automatic and absent resolutions retain no-draw availability.

`workbench-disposition-resolution-render-rev1` PASS all270 authenticated resolutions,
1248 cells/416 totals/42 Auto/20 absent, exact embedded resolution and matrix,
accessible cell labels, synthetic opposing-color and malformed-arithmetic controls.
`workbench-disposition-score-matrix-ui-rev1` browser PASS baseline1: six cells/two
totals and exact reports, keyboard matrix→decision19 and matrix→reason18 links,
exact native events, unchanged five identities and unchanged matrix on return.
Expanded candidate/nucleus screenshot inspected. TypeScript,596-module isolated
build, boundary/research/index size checks PASS. Retain tab34/4210, preview37685.
The pre-existing resolution-ui-rev1 evidence was detected and preserved untouched;
new browser evidence uses the distinct score-matrix-ui-rev1 directory.

Native paged baseline audit7413 completed with terminal receipt PASS19 prefixes/
180 headers, all identities/state descriptors and sampled text. verification.json
independently joins every prefix saveHash to original public run0 and checks counts,
summary lengths and file hashes. Terminal summary is14850 JSON bytes; payload text
remains available separately. This is not a heap bound or every-page proof. The
esbuild cancellation printed during Vite server cleanup followed completed checks,
written terminal receipt and process exit0; no qualification failure was inferred.
Paged browser tab33 remains independently running and source-bound. Do not change
its adapter/worker/client/UI sources before terminal capture and verification.
All18 conditional obligations and source restrictions remain unchanged.

## 2026-10-20 canonical stored-state preparation

Prepared dispositionCanonicalStoredState reads the accepted constitution1457/1453
and plastic1458/1454 leaves directly from canonical state. Exact fractions, native
paths, diagnostic plot coordinates and Refold absence retain the existing chart
semantics. It explicitly copies six identity fields; the owning worker must bind
them to the same native revision. It is not a standalone save authenticator.
These two stored scalars do not satisfy the general latent-state vector requirement
or establish effective disposition, identity standing or character self-knowledge.

Source inspection of revision1 found that spreading a TypeScript-narrowed identity
would still copy the full runtime snapshot. That revision and finding are retained.
Revision2 explicitly selects identity fields and checks the returned key set and
bounded JSON length. The first parity run is not acceptance of corrected source;
its successor test result governs revision2. No full-state reader or live paged
worker source has changed. State restoration may still clone canonical values; no
constant-memory or heap claim follows from the smaller diagnostic result.

Revision2 acceptance: test PASS nine programs/eighteen prefix0/1 observations,
including all seven laws and both constitutional signs; sixteen original comparison
chart branch matches, exact snapshot field fractions/paths, invalid law/identity/
ownership controls, unchanged checkpoints, six identity keys and <4096 JSON code
units per result. TypeScript/boundary/research PASS;18 conditional obligations remain.
All four live source sets remain exact. This is tooling work, not a Campaign3 verdict
amendment. Full-horizon parity and paged worker/UI integration remain due.

## 2026-10-20 canonical inspection dispatch

Prepared dispositionCanonicalInspection provides one worker-side request boundary
for stored-state, Architecture, reasons and resolution reports. Requests carry the
expected saveHash. Prefix/clock/completion/count checks and exact native header joins
precede dispatch; stale requests and mismatched event labels are rejected. Canonical
event headers, outputs and draws are read directly from the native trace. Returned
metadata explicitly selects seven identity fields and preserves the requested event.
Raw source paging remains separately required; compact reports do not replace it.

This function consumes trusted native state/trace and is not an external checkpoint
authenticator. Comparing caller-supplied hashes does not prove supplied state bytes.
It prepares the worker integration without changing any of the four live source
sets. The paged worker, client and six-mode UI still need to call it after the live
horizon qualification completes. No runtime law or character disclosure is added.
A development typecheck found a wrong test import name; corrected source is frozen
under workbench-disposition-canonical-inspection-rev1 and the error is retained in
workbench-disposition-canonical-inspection-development-rev1.

Corrected dispatcher qualification PASS baseline/Refold/inactive-probes at0/1/2:
four report types match their existing readers; stale revision, malformed prefix,
unknown event, mismatched canonical header and wrong-stage selections reject.
Returned identities contain only seven named fields. Historical reason/resolution
reports and checkpoints remain unchanged. TypeScript/boundaries/research PASS;
all18 conditional obligations remain. Worker integration and full-horizon report
qualification remain due. This is tooling work, not a Campaign3 verdict amendment.

## 2026-10-20 paged terminal acceptance verifier

Prepared check-workbench-disposition-paged-horizon-ui.mjs and froze its exact bytes
plus parent, start and oracle receipt identities before terminal browser capture.
The verifier requires baseline complete18, all five original native hashes, all180
event option identities/labels, disabled step/run controls and no alerts. It checks
the exact historical event19 page against original prefix1 and verifies that explicit
reload at18 preserves that text while changing its displayed revision and enabling
paging. Original prefix18 and prefix1 archives are authenticated against the retained
comparison receipt. Source parents must still match their frozen identities.

Self-test PASS one synthetic valid capture and12 rejecting controls (hash, revision,
text, stale paging, missing/mislabelled event, incomplete status, enabled advance,
error alert, wrong selection and stale post-load status). These synthetic controls
do not create or establish browser qualification. The actual browser capture and
screenshot remain due; the running tab33 must stay intact. Full six-mode behavior,
all-program coverage, terminal checkpoint restore and heap/latency bounds remain
separate gates. No Campaign3 verdict, obligation closure or law selection.

## 2026-10-20 reusable Reasoning report renderer

DispositionReasonReportPanel now accepts a detached reason diagnostic, and the
existing Reasoning panel delegates its operand/nucleus display to this renderer.
The original event selector, researcher explanations, resolution, task sources,
provenance, factor sources, calibration and raw event remain in the parent panel.
This prepares the canonical worker report path without replacing its provenance
views or implying that the complete paged migration has been connected.

workbench-disposition-reason-render-rev1 PASS all109 retained bounded diagnostic
reports (100 emitted/9 absent,200 nuclei across23 prefix snapshots). Server rendering
preserves five exact operands, all seven nucleus terms, exact candidate keys,
coverage and mechanical distributions, complete embedded report and scope. No-report
and no-emission cases have no invented table. Source reports remain unchanged.
This is the existing bounded cohort, not full15-program or browser qualification.
All four live source sets remain exact. No new player language, character knowledge,
runtime law or Campaign3 verdict; all18 conditional obligations remain.

TypeScript and isolated597-module production build PASS; existing large-chunk
warnings remain. Boundary/research checks PASS. No fresh browser qualification
is inferred from server rendering or this structural extraction.

## 2026-10-20 canonical factor sources and paged read references

Prepared dispositionCanonicalFactorSources reads admitted canonical raw signals,
evidence bases and nucleus coverage directly. Source keys, signed strengths, basis,
coverage arithmetic, compiled terms and distributions retain their exact existing
factor-report meaning. The canonical dispatcher adds a factorSources selection and
binds the returned report and read selection to its existing save-revision envelope.

The new report is explicitly disposition-factor-sources/0.2. Evaluation read values
are not embedded in this compact report: readSources lists each native trace-list
index, canonical path and presence; readSelection names the original event reads
record for paging at the envelope saveHash. These are references, not missing values
or a source-to-state causal attribution. The original0.1 report remains unchanged.
This prepares integration; the current paged worker and UI do not yet expose it.

Revision1 failed because the reader inferred canonical collection kinds from the
old readable JSON arrays; its test helper also failed TypeScript record narrowing.
Revision2 fixed map-shaped evidence weights and the helper, but inspection of the
complete failure stack found set-shaped raw signals too. Both original revisions
and the findings are retained; neither has an accepted qualification receipt.
Revision3 handles the actual native set/map declarations and tests duplicate source
keys using distinct signal values, preserving canonical set uniqueness itself.
No native law, evidence basis or state ownership was changed.

Revision3 acceptance: both canonical-factor and dispatcher tests PASS, baseline/
Refold/inactive-probes through2. Nine cumulative reason observations preserve exact
raw rows/bases/coverage/nuclei; every read reference agrees with the original exact
read value. Invalid presence, duplicate source key and raw-context mismatch reject;
synthetic absence and unchanged checkpoints pass. Existing dispatcher history tests
also pass. TypeScript/boundary/research PASS; all four live source sets unchanged.
All18 conditional obligations remain. Full-horizon and paged UI connection are due.

## 2026-10-20 paged factor-source report renderer

Prepared DispositionCanonicalFactorSourcesPanel accepts the version0.2 factor report
with its owning program/run/prefix/save revision and requested event. It shows the
exact source identities, bases, overlap accounting and native read references.
The read action passes that source saveHash and the exact event reads selector.
A historical report remains visible unchanged, with paging disabled and guarded
until its checkpoint is restored or a current report is requested. Identity/version
mismatch or explicit source error withholds the factor interpretation.

workbench-disposition-paged-factor-render-rev1 PASS native baseline1, joined to the
original public save hash: exact coverage/read-reference table, complete embedded
report, source callback arguments and unchanged checkpoint. Synthetic stale/error/
mismatch/absent/undefined cases preserve the stated behavior; stale direct callback
invocation is guarded. These are function/server-render checks, not browser clicks.
TypeScript and boundary checks PASS. The component is prepared for the paged worker
integration and is not yet mounted in that UI. Full-horizon factor qualification,
character-language disclosure and complete linked provenance remain separate work.
No Campaign3 verdict or conditional-obligation change.

## 2026-10-20 canonical calibration linkage

Extracted dispositionCalibrationFromFactors preserves the existing diagnostic
calculation of signed role totals, bounded nets, relevance, die bands, context-based
modifier units, truncation/capping, polarity and exact score masses. The existing
formatted-event reader checks its original context join before calling this helper.
The new dispositionCanonicalCalibration checks the native input envelope and exact
context equality before using the same helper with canonical factor accounting.
The revision dispatcher exposes this as a calibration selection.

This remains source-bound diagnostic reconstruction beneath the accepted contracts,
not a newly recorded runtime quantization event or a change to calibration laws.
The canonical factor path uses read references, so calibration does not need full
formatted evaluation read values. Native data and exact raw records remain the
sources; this report does not grant character knowledge or player disclosure.
The live paged worker/UI connection remains due.

Qualification PASS: shared arithmetic matches all270 authenticated frozen calibration
reports from15 programs, using independently retained factors and the recorded
learning flags. Separately, fresh baseline/Refold/inactive-probes through2 match the
frozen results through both readers and dispatcher; changed input context and wrong
version reject, checkpoints unchanged. The270-report test does not prove fresh
canonical context lineage across all horizons. TypeScript and597-module isolated
build PASS with existing large-chunk warnings; boundary/research PASS. All four
live source sets remain unchanged. No Campaign3 verdict or obligation change.
