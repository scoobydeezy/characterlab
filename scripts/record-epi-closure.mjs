// Single-use forward bookkeeping; previous audit and experiment receipts survive.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/check-epi-closure.mjs'],{stdio:'inherit'});
const p='docs/planning/',read=f=>fs.readFileSync(f,'utf8'),verdict='VER-C3-EPI-001',report=p+'CAMPAIGN3_EPI_QUALIFICATION.md';
assert(!read(p+'VERDICT_LEDGER.md').includes('## `'+verdict+'`'),'already recorded');
fs.appendFileSync(p+'VERDICT_LEDGER.md',`\n\n## \`${verdict}\` — Exact hidden saturation through learning and encoding

- **Date:**2026-09-21; LOCAL DISPOSITION; bounded EPI COMPLETE.
- **Contract:**epi-public/0.1-candidate;897..912/schema1; namespace1159.
- **Corpus:**PHEN-EPI-001/1.3.0-draft, unchanged corpus0.29.0.
- **Evidence:**CAMPAIGN3_EPI_QUALIFICATION.md;6 models,72 runs,240 exact prefix
  restores/continuations; EPI_PUBLIC_EXPERIMENT_REV1.json and closure receipt.
- **Verdict:**RETAINED epistemic distinction: before19/20, potential1/10 versus4/5
  yield identical admitted1/20 evidence through six character output kinds and
  two retained owners. Truth/overflow differ. Both deliberate leak controls are
  detected; lawful permitted-measurement changes affect encoding and learning.
- **Comparison limit:**leak profiles are diagnostic violations, not lawful
  psychological competitors or a salience-necessity proof. Exact/lattice candidates
  remain distinct; no general numerical law, memory topology or reduction selected.
- **Causality:**prior130 encoding is frozen before independent140 writers; later50
  sees learning and retained encoding separately. Unknown belief can coexist with
  known encoding; missing observations remain distinct.
- **Validation:**49 affected/328 reference tests, build/type/boundary PASS. Earlier
  rejected seed receipt preserved. No full active-suite claim.
- **Obligations:**RO-C3-018 exact EPI clause discharged within the declared roster;
  REASON/DECISION/COMMIT remain active. RO-C3-007 and010 retain broader source,
  consumer, surprise, retention and scalar inference limits.
- **Reopen:**new consumer/source, permitted sensor or hedonic signal, evidence
  linkability, horizon or ordering. No owner decision pending.
- **Counters:**912/0 (16 allocated this increment).
`);
const rf=p+'RESEARCH_OBLIGATIONS.json',registry=JSON.parse(read(rf)),ids=['RO-C3-007','RO-C3-010','RO-C3-018'];
for(const id of ids){const o=registry.obligations.find(o=>o.id===id);o.verdicts.push(verdict);o.evidence.push(report,p+'EPI_IMPLEMENTATION_FINDINGS.md',p+'EPI_PUBLIC_EXPERIMENT_REV1.json',p+'EPI_VALIDATION_CLOSURE_REV1.json');}
const debt=registry.obligations.find(o=>o.id==='RO-C3-018');
debt.established+=' VER-C3-EPI-001 discharges the exact saturation pair through the declared observation/SEM/learning/encoding/later-probe roster:6 models/72 runs/240 prefix continuations.';
debt.unresolved='Joined REASON/DECISION/COMMIT clause-complete comparisons remain unqualified. Bounded LEARN and EPI are complete. Additional EPI consumers/sources/horizons remain conditional under RO-C3-007; broader scalar inference is RO-C3-010.';
debt.owner='REASON compiler first; DECISION arbitration and COMMIT lifecycle/social owners for their separate clauses';
debt.closureRequirement='LEARN four-case public comparison and exact bounded EPI receiving roster are discharged by VER-C3-LEARN-001/EPI-001. Freeze and execute remaining exact comparator/domain/horizon comparisons; preserve public/component distinctions.';
const horizon=registry.obligations.find(o=>o.id==='RO-C3-007');horizon.established+=' EPI separately qualifies evidence-aware scalar surprise/encoding with fixed attention/role/Need operands and latest-slot retention; no GA bytes are widened.';horizon.unresolved+=' New EPI consumer, sensor/hedonic evidence, arbitrary role/source/linkability, retention or receiving horizon must reopen its qualification; leak controls do not prove numerical salience necessity.';
registry.obligations.find(o=>o.id==='RO-C3-010').established+=' EPI qualifies prior-relative encoding as an independent consumer of the same safe lower-bound sample, with belief and encoding retained separately.';
registry.verdictReviews.push({verdict,obligations:ids});registry.reportReviews.push({path:report,obligations:ids});fs.writeFileSync(rf,JSON.stringify(registry,null,2)+'\n');
fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before bounded EPI closure —2026-09-21\n\n'+read(p+'CURRENT.md'));
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded EPI COMPLETE / QUALIFIED. Campaign3 remains NOT EXIT-READY.**
Start at [EPI qualification](CAMPAIGN3_EPI_QUALIFICATION.md), VER-C3-EPI-001 and
[forward coverage register](CAMPAIGN3_EXIT_AUDIT_REV4.json). No owner ruling.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **912** |
| Allocated since last verdict/corpus member | **0** (16 this increment) |
| Research obligations | **4 active / 17 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 26 verdicts** |
| Coverage dispositions | **13 bounded / 3 accepted prior / 5 partial / 0 blocked** |
| Frozen models / public runs / prefix continuations | **6 / 72 / 240** |
| Affected / reference tests | **49 / 328** |

Exact before19/20, potential1/10 versus4/5 gives identical character observations,
SEM, surprise/salience, learning, retained encoding and later probes. Both hidden
leak controls are detected. Permitted measurement changes remain effective.
Encoding freezes the old belief before independent140 writers. Raw research
outputs include truth; only the checked character projection is epistemically safe.

RO-C3-018 retains REASON/DECISION/COMMIT; BODY ownership, BIO and broader Brief
coverage remain active. Additional EPI consumers/sources/horizons are RO-C3-007;
scalar inference remains RO-C3-010. Final-history RO-C3-021 is unsatisfied.
Earlier qualifications stand; no whole Campaign3 or full active-suite claim.

**Next:** REASON exact joined comparator/domain readiness under the escalation
policy, followed by remaining risk-ranked gaps. Corpus digest unchanged:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
fs.appendFileSync(p+'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md',`\n\n## Forward coverage update — bounded EPI,2026-09-21

VER-C3-EPI-001 closes the exact saturation pair through the declared receiving
roster; see CAMPAIGN3_EPI_QUALIFICATION.md. REV4 records13 bounded/3 prior/5 partial/
0 blocked. Earlier REV1/2/3 snapshots remain dated evidence. Additional consumers,
sources and horizons reopen EPI; no general salience/memory law is chosen.
Campaign3 NOT EXIT-READY. Next REASON joined comparator readiness. Counters912/0.
`);
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\nVER-C3-EPI-001 qualifies the bounded receiving roster and resets counters912/0.\n');
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## Bounded EPI port/control disposition —2026-09-21

VER-C3-EPI-001 ports MEC-003 measurement, MEC-006 evidence-aware surprise and
MEC-007 independent-budget encoding into the exact saturation receiving fixture.
MEC-002 Gated learning is retained under the accepted LEARN approximation;
MEC-004/005 fixed admitted classification/attention are explicit controlled inputs.
EXP-002/007/008 and RET-003/004/006/014 preserve censoring/hidden-truth constraints.
SUB-008/009/011 preserve source, ordering and deterministic transaction boundaries.
PotentialLeak/OverflowLeak are diagnostic controls, not legitimate alternatives;
previous serious EAM/GA and LEARN candidates remain available. No source imports,
new generic Need formula, general surprise-law selection or memory reduction.
RO-C3-007/010 preserve broader limits; RO-C3-018 EPI debt discharged.912/0.
`);
console.log('Recorded EPI verdict/obligations/current checkpoint.');
