# Current work — M63 acquisition-to-accessibility (2026-11-07)

Newly retained social experience must be accessible before its first recall.
M62 found GAP-MEM-ACQ; M63 repairs that handoff in the same episodic owner.
Base d72d5249. Earlier .61 behavior and M62 evidence remain controls.

## Bounded card — committed before implementation
One capability: acquisition contributes the original recency term, independently
of recall capacity; later reinforcement remains actual-publication-only.
Rules/registry0.63, unchanged44 slots; affect-memory contract0.2 successor.
Read immutable acquiredAt plus existing later-publication field4 as
[acquiredAt,...publicationTimes] at the original canonical recall kernel.
This is a representation mapping, not a second store or a new accessibility law.
No old version changes; no graph/owner/framework/calibration/dice/UI changes.
Original kernel permits32 history entries; successor source ceiling31 reserves
acquisition. Existing input admission already permits at most8 social sources.
No legal current input is lost; no history truncation.
Applicable MEC-010/EXP-006, PHEN-MEM-001:2..11, RO-C3-005/006/007/020 preserved.

## Files and comparisons
Production: model.ts, affectMemory.ts, memory.ts, runtime.ts (src/assembled).
Tests: one new assembledAcquisitionMemory.test.ts, reusing M62 fixture.
Formal: append explicit0.2 successor to existing affect-memory contract.
Planning: CURRENT, AGENTS, existing register, one result and one check log.
At most4 production+1 test files; no modification of earlier test fixtures.
Use M62 main/omitted/hidden source, full current composition, seed0, fixed laws.
Scenario: one holder, three physical tasks, reserve30/rate10, coat stand-in;
only perceived social channel, no sensing/choice or initial learned state.
Set recall delay3, K1; K0/K2 required controls. Acquisition at1/2, cues at3/5.
Before first recall4: two retained episodes, empty publication histories.
At4 base A1/4 B1/3 in K0/K1/K2; K1 selects B; K0 publishes none.
At5 K1 B base1/4+1/2=3/4; K2 reinforces both, K0 remains acquisition-only.
Main at6 retrieves B; omitted access3 has no recall6.
At8 B main=1/7+1/5+1/4+1/3=389/420; omitted=1/7+1/5+1/4=83/140.
A stays acquisition-only1/8 under K1. Same content, selected-only writes.
Live recall/candidate reads required before comparison. No choice claim.
Use original kernel on explicit acquisition histories as independent mapping
control; retain .61 M62 native regression including exact tie.

## Checks and stop
Serial verification1800s total,600s per command; failures count. No extension.
Types; focused native arithmetic/trace/K controls; hidden truth; exact repeat
and restore3->101; injected failure after actual publication proves rollback;
input bound and version rejection; old M62 native; boundary/research checks.
Check105 frozen dependency blobs and unchanged historical source trees instead
of re-running full frozen suite. Stage and check git size before commits.
Evidence <=20 files/5MiB; AGENTS<=120/CURRENT<=80/work order<=250/register64KiB.
Done iff acquisition mapping, selective later updates, privacy/rollback and
exact continuation pass. Otherwise retain precise failure; do not change gate.
MEMORY remains open for original source/comparison correspondence afterward.
No other area, new verdict, obligation closure or full corpus acceptance.
