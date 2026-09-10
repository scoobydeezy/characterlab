# EMB-001 composed review, revision1

2026-09-10. **CORRECTION REQUIRED AND PROPOSED BELOW; WHOLE SHAPE WITHHELD.**
Review scope is the bounded reserve/observation/pressure/external-delivery subprofile,
not general Need ownership or BODY+MULTISOURCE. No implementation or allocation.

Read [typed fields](CAMPAIGN3_EMBODIED_FIELD_TYPE_REVIEW.md),
[dispatch](CAMPAIGN3_EMBODIED_VOCABULARY_DISPATCH_DRAFT.md) and
[witness](CAMPAIGN3_EMBODIED_PROFILE_WITNESS_DRAFT.md) together. This review's explicit
corrections supersede conflicting draft prose, not accepted contracts. Prior receipts
retain their original document hashes and scope.

## 1. Findings

| Finding | Disposition |
|---|---|
| Sensor bins use floor and a special capacity endpoint, but the trace proposal says all quantization operations are empty. | Correct. Exact arithmetic does not eliminate information-losing quantization. Add one trace-only operation per present sample; none on unavailable branches. |
| Trace160 SubjectIds, SourceRecordIds and InvariantResults were not fully specified. | Complete the rows below using existing identities, without allocating trace IDs or adding reads. |
| Arithmetic witness describes7 comparison cases but is not public execution. | Preserve that limit; no EOBS/EING/EREG/EREP PASS. |
| Single observer profile cannot witness a valid different body's redirection or two-observer positive case. | Keep component-positive/profile-exclusion obligation; do not award general IDN isolation from model rejection alone. |
| External replenishment could be mistaken for a body's chosen successful action. | Scope remains external world intervention. No action, skill or causal-efficacy belief is implemented by this writer. |
| First pressure candidate at empty reserve gives5/6 with width10, not1. | Intentional conservative upper-bound response, not a bug or global Need law. Keep observable in the witness. |
| New admission/source schemas do not execute in the current projection compiler. | Explicit packaging/implementation obligation; an old decoder excluding them is correct behavior. |

## 2. Quantization correction

Add symbolic trace-only record **LevelBinQuantization**, ordered required fields:

| Field | Canonical type / meaning |
|---|---|
| InputLevel | rational q from exact body materialization |
| Capacity | positive rational C from bound immutable parameters |
| BinWidth | positive rational w from the committed sensor |
| BinIndex | unsigned k identifying the emitted finite interval |

For0≤q<C, k=floor(q/w). Forq=C, k=C/w-1. Require integral C/w and
0≤k<C/w; emitted interval is exactly[k*w,(k+1)*w]. Thus the capacity-endpoint case
is explicit and cannot silently emit[C,C+w]. The operation is attached to the actual
sample10 TraceRecord under the observation version; no separate transformation ID,
occurrence ID, truth record or permission to dereference it is introduced.

Present sample: QuantizationOperations is exactly the singleton operation. Unavailable
sample: empty, with no body read or fabricated q. All other events: empty. Materializing
the exact reserve and computing rational pressure introduce no further quantization.
The record is allowed only in the owning trace field, never EmbodiedSample,227,
CharacterEvidenceRef, pressure input/output or learned memory. It contains hidden exact
q legitimately because trace is omniscient; character output still contains only the bin.

This adds one new symbolic record to31, giving **32 records/128 typed fields**. It
requires no new identity member, event, runtime ordinal or union tag. Baseline39 domain
events/18 runtime advances and all sample/pressure values remain unchanged. Baseline
now has6 bin-operation records, denied/unavailable0. The historical expectation receipt
did not include trace quantization and is not a complete golden-trace artifact.

## 3. Complete remaining trace fields

Use canonical typed-identifier byte sorting and duplicate removal for SubjectIds and
SourceRecordIds. SourceRecordIds means trace provenance, not character evidence access.

| Row | SubjectIds | SourceRecordIds | Seam/version owner |
|---|---|---|---|
| sample10, either branch | O and the actually projected character C | empty; original event is already in Event | embodied-level-observation |
| slots11..13 | O from exact retained sample | Sample.ObservationId, including unavailable trace metadata | existing SEM-001H lane processing, empty semantic work |
| settlement14, present | O | Sample.ObservationId | existing SEM-001H freeze |
| settlement14, unavailable | O | Sample.ObservationId as trace-only metadata | embodied-level-observation, no claimed SEM freeze |
| pressure60 | O from Sample and C from its actual projection | Sample.ObservationId | embodied-pressure |
| replenishment110 | authenticated world-target C | empty; definition is resolved in committed model and input/event already identifies this intervention | embodied-replenishment |

The empty SEM slots are host topology, not new character processes. On unavailable
slots11..13 use the observation seam/version instead of claiming SEM work occurred;
on present slots11..13 retain SEM-001H. The row discriminator is the already authenticated
carrier branch; version selection is fixed by the profile, not caller-supplied.
No new reads may be made merely to populate these fields. Internal carriers do not
contain C, so internal rows cannot acquire it by an extra roster lookup.

InvariantResults remains an empty canonical list for every row: checks execute but
produce no newly defined invariant-result records. RNG records remain empty. Other
trace fields use the exact input/output/read/patch/child matrix from the replenishment
draft with this quantization correction. `RecordKind` stays actual EventTypeId.

## 4. Adversarial additions — NOT PASSED

| ID | Distinguishing check |
|---|---|
| ECOMP-A | Present sampling with missing/wrong/extra bin operation rejects at trace validation. |
| ECOMP-B | Denied/unavailable sampling produces no bin operation and makes no speculative q read. |
| ECOMP-C | q=C uses last bin; q at another exact boundary uses its upper bin; wrong-index mutant is detected. |
| ECOMP-D | Exporting InputLevel or the operation reference in sample/SEM/pressure fails epistemic/output closure. |
| ECOMP-E | Supplying wrong C, extra roster read or an invented truth source for trace fields rejects. |
| ECOMP-F | Same observer-safe sample can coexist with different trace InputLevel; character equality must remain intact. |

## 5. Whole-shape disposition

The mathematics, epistemic cut, sole physical writer, empty learning writes, conditional
SEM support, source authentication, fixed topology and bounded witness are coherent
in direction after this correction. The packet still needs one consolidated exact
closure pass before shape acceptance: bind the32-record inventory, definition/member
matrix, branch trace-version matrix and all retained proof obligations in one manifest;
check registration/role references end to end, including proposed source-origin and
body dispatch. Do not replace this with a blanket “all checks passed” from JSON audits.

No current implementation defect or Campaign2 reopening was found. This is a defect
in an unaccepted draft trace contract, corrected before implementation. The next pass
should evaluate the corrected whole subprofile and explicitly state which acceptance
scope can be earned independently of non-task receiving and action knowledge.
