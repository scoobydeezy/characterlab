# Native Values contract — 2026-10-04

ACCEPTED LOCAL DISPOSITION; values-public/0.1-candidate. Implements the bounded
values-component/0.2-candidate laws without changing predecessor profiles.
This contract and closed allocation precede implementation. No native qualification.

Four laws: Accumulated, Refold, Latest, NoConsolidation. Empty initial journal;
stored projection absent for Refold, otherwise equal to the component projection.
One controlled actor, Care category and admitted outcome channel. Original timeline
has1..65 strictly increasing instants in1..65. Each original carries zero/one receipt
and zero/one probe. Receipt domains are component domains; new receipts correspond
to their original instant, exact duplicate receipts may refer to an earlier instant.
Probes correspond to the current instant. Source is admitted typed evidence, not a
physical-world producer; private truth and authored final preference are forbidden.

Source40 authenticates originals, emits safe probe to reasons52 and admitted receipt
to consolidation140. Reasons52 reads only prior journal/projection and emits choice60.
Choice60 uses existing reason/arbitration mathematics and explicit probe seed; no
choice preserves NoCandidates/NoReasons. The inherited Task deadline65 remains.
Consolidation140 alone owns journal and optional projection. Earlier same-instant
consumers cannot see that update. Empty branches still execute all four stages.

History1513 and projection1514 are separate typed values; roots1516/1517 carry sole
writer declarations. Refold has no1517 leaf. Every write/read is registered; generated
events authenticate parent, phase and payload. Native trace contains actual reads,
patch/diffs, outputs and children. RNG addresses commit only after whole-instant
success, with publication guards covering cleanup.

Receiver preserves component Task carriers and complete-overlap rule. Typed1519 binds
probe, Value projection and inherited reasons. It is not an identity modifier or
general provenance fusion. Choice1515 publishes resolution plus operands, with no
physical execution or implicit learning. New records may enter only declared open
canonical trace/save slots, never arbitrary inherited typed fields.

Model binds exact parameters and authority/read/write/phase registry. Originals,
empty initial marker and32 zero run-seed bytes bind RunIdentity. Probe seeds0..255
are explicit inputs. Save132 includes native queue/state/outputs/traces, allocators
and committed addresses. Restore replays complete original instants and requires
whole-save equality; no saved state is installed. Failed instants roll back and keep
native Failed status. Safe projection excludes runtime IDs and trace. Factory
quiescence and caller-copy guarantees are mandatory.

Records1509..1519/schema1 allocated by VALUES_PUBLIC_ALLOCATION_TABLE.json; reuse1155
for inherited fixture occurrence coordinates. Counters1519/11. No wrapper qualification
inferred. Require component equality, prospective reads, duplicates/conflicts, Refold
root absence, input/registry/save forgery rejection, prefix continuation, reached-phase
faults, in-flight read/save/concurrent-step rejection, full matrix and wrapper extension.
RO010/019/020/021; RO022's existing scope stays closed, new extension must be checked.
