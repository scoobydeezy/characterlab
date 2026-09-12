import fs from 'node:fs';import assert from 'node:assert/strict';
const q=JSON.parse(fs.readFileSync('docs/planning/ATTENTION_COMPONENT_QUALIFICATION_REV1.json'));assert.equal(q.status,'ATTENTION SELECTION AND SELECTED-ONLY ACCESS COMPONENT QUALIFIED');
let p='docs/planning/CURRENT.md',s=fs.readFileSync(p,'utf8'),a=s.indexOf('**Current work:**'),b=s.indexOf('[Post-EMB coverage reconciliation]');s=s.slice(0,a)+`**Current checkpoint:** [attention selection/access component qualified](CAMPAIGN3_ATTENTION_COMPONENT_CHECKPOINT.md)
under [attention-selection-component/0.1-candidate](../formal/ATTENTION_SELECTION_COMPONENT.md).
AC-A..L pass at component scope: 11 tests, five current-source substitutions and
453 unchanged EMB fingerprints. The full active run passes ${q.activeTests} tests in
${q.activeFiles} files. [Exact qualification receipt](ATTENTION_COMPONENT_QUALIFICATION_REV1.json).

The implementation validates actual SEM derivation, uses Actor/Target/Participant
priorities and gives its consumer only selected binding/claim bytes. It allocates no
identity, adds no public/persisted record and has no state writes. The residual-pool
experiment remains deferred; unsupported Cause/Incidental are not invented.

**Next public gate:** [ATTN closure revision2](CAMPAIGN3_ATTENTION_CLOSURE_REV2.md)
requires the exact observer-event producer projection/input grammar, symbolic public
carriers/registration/roles/output/work inventory, separate allocation and model freeze,
then phase40 runtime admission, trace, rollback and replay. AT2-A..N remain NOT PASSED.
No public attention factory, whole ATTN, encoding/access or corpus qualification is
implied. Earlier drafts and test failure receipts remain historical.

`+s.slice(b);fs.writeFileSync(p,s);
p='docs/formal/OPEN_DECISIONS.md';s=fs.readFileSync(p,'utf8');s=s.replace('Eight SEM component checks pass; NOT shape accepted.','[Selection/access component qualified](../planning/CAMPAIGN3_ATTENTION_COMPONENT_CHECKPOINT.md) under attention-selection-component/0.1-candidate: AC-A..L pass, no public records or allocation. Public whole shape NOT accepted.');fs.writeFileSync(p,s);
p='docs/planning/SEAM_LEDGER.md';s=fs.readFileSync(p,'utf8');s=s.replace('Unimplemented; explicitly tracked. Perception/Attention remains in canonical topology','[Selection/access component qualified](CAMPAIGN3_ATTENTION_COMPONENT_CHECKPOINT.md); public attention/encoding remains unimplemented. Perception/Attention remains in canonical topology');fs.writeFileSync(p,s);
