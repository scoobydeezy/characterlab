# Diagnostic probe — model/profile packaging revision 1

2026-09-07. **SHAPE ACCEPTED**, with canonical-position and whole-profile clarifications below.
Model materialization is authorized; authoritative probe runtime remains blocked until model-byte
freeze. [Materialized review packet](campaign2-probe-model/REVIEW_MANIFEST.json).
Depends on accepted regulatory-diagnostic-probe/0.1-candidate and frozen
regulatory-probe-allocation/0.1-candidate. This document proposes executable profile bindings;
it does not change probe mathematics, identity allocation, SEM/EVID or the bounded .2 model.

## Inspection and selected boundary

`src/campaign2/modelPackaging.ts` selects an exact RulesVersion bundle and checks a closed
registry-kind inventory plus exact union entries. `factory.ts` selects the ordered-input,
persistence and trace adapters internally. Existing compilers do not admit probe records or
sources. Appending probe data while retaining those profile versions would misstate their
accepted language. The new profile must be explicitly selected from its RulesVersion, never
inferred from input shape, a caller callback or fallback to the old bounded implementation.

## Proposed exact version binding

| Surface | Proposed binding |
|---|---|
| RulesVersion | rules/campaign2-regulatory-probe/0.1-candidate |
| RegistrySchemaVersion | campaign2-probe-registry/0.1-candidate |
| Ordered input profile | campaign2-probe-ordered-input/0.1-candidate |
| Trace profile | campaign2-probe-trace-binding/0.1-candidate |
| Persistence profile | campaign2-probe-persistence/0.1-candidate |
| ContentSchemaVersion | existing content/0.2-candidate |
| ParameterSchemaVersion | existing campaign2-parameters/0.1-candidate |
| NumericProfileVersion | existing numeric/exact-1 |
| RandomAlgorithmVersion | exact existing bounded .2 value |

The compatibility bundle retains the exact ordered entries in
`docs/formal/CAMPAIGN2_BOUNDED_RULES_02.md`, then appends
regulatory-diagnostic-probe/0.1-candidate and campaign2-probe-trace-binding/0.1-candidate.
Retaining campaign2-trace-binding/0.1-candidate names the unchanged fixed-pulse/EVID/ADAPT
submapping, not permission to dispatch the old whole-model trace compiler on a probe model.
The new profile owns the composed dispatcher. No alternative scalar, padding or route policies.
Budget/event topology changes require accepted RulesVersion changes, never host switches.

## Exact first model and six-slot registry delta

Use the frozen .2 model as the preserved base for declaration reuse. The new model keeps its
content, REG anchor/domain, five adaptation rules, state families/owners, fixed-pulse channels,
parameters, numeric and random artifacts byte-identical where unchanged. Do not overwrite any
old artifact. The new model's registry and RulesVersion differ; its RegistrySchemaVersion differs
as explicitly proposed above. No claim that only one ModelIdentity field changes.

| Registry slot | Proposed contents relative to frozen .2 |
|---|---|
| 0: schema descriptors and RegistryEntry set | Retain all prior entries; add descriptors 331..335, the three exact type-259 entries [335,1..3], and one probe definition entry. |
| 1: phase registry | Byte-identical ordering-phases/2-candidate; no new phase. |
| 2: mutation authorities | Byte-identical; probe has NoStateWrites. |
| 3: read-only family declarations | Byte-identical empty set; no roster/cognitive family. |
| 4: state-key grammar declarations | Byte-identical; existing RegulatoryAdaptationKey/294 reused. |
| 5: identity roles | Retain prior rows; add the eleven exact allocated role rows for 331..335. No role for record-valued 335/4. |

The one added RegistryEntry uses stable definition/regulatory-diagnostic-probe, kind
registry/regulatory-diagnostic-probe, accepted probe version and record 331. Its C and V are the
existing qualified fixture character and regulatory variable. Available=true; ObserverPermitted=true.
Its embedded 332 uses existing observer/bridge-subject, SubjectId=C, model-authored
channel/regulatory-diagnostic-probe in namespace 1005, model-authored
modality/diagnostic-regulatory-probe in namespace 1006, and the frozen unit member
unit/diagnostic-regulatory-level in namespace 1039. Channel identity must differ from the fixed
pulse channel. These model-authored values are concrete fixture choices, not new identity families.

Permission/availability controls change only their explicit definition booleans and therefore
derive separate ModelIdentities. Each exposure-count A/B pair uses the same complete model.
The read path is compiled from the committed 331 C/V by the accepted fixed consumer; it is not
a new freely authored read declaration, state family or configurable function. Union entries
are validated and committed before any carrier codec is available; exact missing/extra/changed
rows reject. The old profile retains its old closed union inventory unchanged.

## Ordered-input and source authority

Reuse the five-position canonical list envelope, not a new record allocation. The new profile
admits exactly the existing authored-adaptation source plus event/regulatory-diagnostic-probe
with record 333. Both are InputOnly under original compiler authority, not public scheduling.
Probe DueAt > initial clock, Phase=110, dependencies/parents empty, at most one probe per instant,
and no adaptation source at that instant. ProbeDefinitionId resolves exactly to the committed
singleton definition. No initial generated probe stage, padding event or EVID event is admitted.

The entire original manifest determines initial source IDs/sequences and RunIdentity. Equal
probe opportunity bytes are used in both counterfactual runs. Example corpus setup: original
exposure at T0=2 with counts 0/1, identical probe at T1=4; R0=50, Scale=10, both effective values
valid. Fixed-pulse observation at T0 stays equal, retained D differs after 140, and the first
observer-accessible difference is the probe's 203. X/E/L remain equal. This is a proposed fixture,
not a run result or PHEN verdict. Later common sentinel controls retain the fixed-pulse source.

## Trace and observation validator closure

The composed trace dispatcher admits exactly the old fixed-pulse/source/SEM/EVID/ADAPT rows plus
the eight allocated probe kinds. Probe-owned rows use the accepted probe mapping, including
actual EventTypeId as RecordKind, exact D RegisteredReadDomain and conditional ActualReadRecords
at 110, no patch/diff, and no padding occurrence. Permitted E/L retain the actual EVID mapping.
The same kind cannot have competing handlers or trace owners. Intra-instant failure rolls back
all outputs, traces, child events and five ordinal advances.

The 203 validator admits the new transformation version only for the exact diagnostic producer
and committed channel: Point, equal reduced rational endpoints n/Scale, precision 1, empty tokens
and SafeSourceReferences. Truth and channel matching occurs on authenticated staged input before
publication. No generic effect compiler or generic 201 mode is widened. Archived observations
validate their canonical shape and committed diagnostic channel/version; historical n must not be
recomputed from current D. Actual producer/equality evidence belongs to the accepted trace/causal
closure, not a new observer-side truth pointer. EVID remains zero-read, unchanged 227→269→270.

## Persistence and materialization gate

Reuse accepted canonical save record/fields, exact boundary-only saves and ordinary allocator
continuation. No padding field, ticket, closure or new persistent character root. The new profile
adds allocated record/union and probe producer validation to the archived output/trace graph and
pending-source validator. Restore reconstructs original source authority by scratch compilation
of the complete manifest, requires exact pending InputOnly subset equality at B, and rejects
missing/extra/changed sources. It does not replay history or use a trace certificate. No pending
probe stage is legal in a successful boundary save. Wrong RulesVersion/profile or missing adapter
rejects before runtime construction; no migration alias to .2.

After packaging acceptance, materialize the new model in a separate artifact directory and record
all six canonical component hashes plus ModelIdentity bytes/digest, old-artifact preservation,
exact registry entry/role/union differences and decode/re-encode parity. No digest is invented
here. Existing artifact compilers require additive support before they can produce this model;
authoritative execution remains gated until commitment and explicit implementation authorization.

Required packaging controls: reject unknown/mixed profile versions and caller-selected adapters;
missing/extra/changed union/descriptor/role entries; wrong fixed definition/unit or unresolved C/V;
initial generated events; source cancellation/restore substitutions; widened state reads; wrong
trace ownership; padding-policy override under the same RulesVersion. Structural permutation of
canonical sets must preserve commitment. Accepted alternative permission booleans must change
ModelIdentity. All PROBE-A..P remain FROZEN, NOT PASSED; no runtime claims in this draft.

Review requested: exact version bundle, six-slot delta, original-source/trace/restore closure and
concrete model vocabulary. No further numeric allocation or diagnostic semantic redesign proposed.

## Acceptance clarifications and frozen packaging controls

The table uses canonical zero-based positions 0..5; earlier 1..6 labels were human ordinals only.
The accepted RulesVersion requires exactly the four new registry/input/persistence/trace profile
bindings in the version table. Retained semantic dependencies never select old whole profiles.
No old-parser fallback, try-bounded-then-probe, runtime extension or probe autodetection is allowed.
One new whole input profile owns both source grammars. One new whole trace profile owns every
event exactly once. One new persistence profile owns complete continuation, including probe output
and source validation. Fields 8/9/10 stay empty only because this closure has no runtime analytical
anchors, random consumers or continuing couplings. Padding adds none.

| Control | Frozen obligation | Current evidence |
|---|---|---|
| PROBE-PACK-A | Exact canonical positions 0..5; shifted/alternate layout rejects. | Review compiler negative control passes. |
| PROBE-PACK-B | Probe rules reject old input/persistence/whole trace; old .2 rejects probe bindings. | Review binding controls pass; authoritative selection remains gated. |
| PROBE-PACK-C | Old authored source uses the new whole input profile's explicit branch, no old-profile fallback. | FROZEN, NOT PASSED; input runtime not implemented. |
| PROBE-PACK-D | Exact descriptor/union/definition/role delta; invalid change rejects or admitted change alters identity. | Structural materialization and missing-union control pass; complete mutation coverage remains open. |
| PROBE-PACK-E | Either committed boolean changes registry and ModelIdentity. | All four review model digests distinct; canonical permutations equal. |
| PROBE-PACK-F | Archived diagnostic bytes never re-derived from current displacement. | FROZEN, NOT PASSED; probe restore not implemented. |

These component findings do not pass PROBE-A..P or any parent campaign gate.
