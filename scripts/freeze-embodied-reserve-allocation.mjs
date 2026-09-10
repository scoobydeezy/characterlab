// Permanence step after a separate successful numeric review. No runtime activation.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const proposalPath='docs/planning/EMBODIED_RESERVE_ALLOCATION_DRAFT.json';
const reviewPath='docs/planning/EMBODIED_RESERVE_ALLOCATION_REVIEW_REV1.json';
const x=read(proposalPath),review=read(reviewPath);
assert.equal(review.status,'MECHANICAL NUMERIC REVIEW PASS; NOT YET PERMANENT');
for(const f of [...review.reviewedArtifacts,...x.sourceFingerprints,x.shape])assert.deepEqual(fp(f.path),f);
const outputs=['docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json','docs/formal/EMBODIED_RESERVE_PERMANENT_ALLOCATION.md','docs/formal/EMBODIED_RESERVE_ALLOCATION_FREEZE_AUDIT.json'];
for(const p of outputs)assert(!fs.existsSync(p),'preserve frozen artifact');
const frozen=read('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json');for(const f of frozen.checks)assert.deepEqual(fp(f.path),{path:f.path,sha256:f.sha256});
const accepted={...x,version:'embodied-reserve-allocation/0.1-candidate',status:'PERMANENT AND FROZEN',acceptance:{date:'2026-09-10',reviewer:'Primary agent separate numeric review under user autonomous-work authorization; no external review claimed',review:fp(reviewPath)},reviewedDraftArtifacts:review.reviewedArtifacts};
fs.writeFileSync(outputs[0],JSON.stringify(accepted,null,2)+'\n');
fs.writeFileSync(outputs[1],[
'# EMB-001 permanent numeric allocation','',
'**embodied-reserve-allocation/0.1-candidate — ACCEPTED, PERMANENT AND FROZEN.**',
'2026-09-10. Separate agent numeric review accepts the one-to-one realization of',
'[bounded whole symbolic shape](EMBODIED_RESERVE_SHAPE_ACCEPTANCE.md). This is an',
'internal review under the user’s autonomous-work instruction, not an external verdict.','',
'The [complete machine table](EMBODIED_RESERVE_ALLOCATION_TABLE.json) is the exact',
'allocation. The independently checked [human tables](../planning/EMBODIED_RESERVE_ALLOCATION_DRAFT.md)',
'remain preserved as the reviewed proposal; their historical draft status is not rewritten.','',
'| Surface | Permanent assignment |','|---|---|',
'| Record types | 453..484, schema1;32 records/128 fields in accepted order |',
'| PressureOccurrenceId | 1142, unsigned runtime ordinal using the existing shared allocator |',
'| Exact members | 43:27 vocabulary,12 witness instances,4 unsigned-pair union members |',
'| PressureResult481 | Known=1, Unavailable=2 |',
'| LevelChainCarrier482 | Present=1, Unavailable=2 |',
'| PresentWithFrozenSupport475 field11 | ExactSingletonSameOpportunity=1 |',
'| UnavailableOpportunityResult476 field8 | NoPresentEvidenceNoReservation=1 |','',
'Record roles:40 direct positions,1 state-map key and2 fixed-compiler collection',
'checks. Character qualification remains required. Full kind/version resolution is',
'required beyond DefinitionId namespace admission. Physical root455/field1 maps',
'qualified CharacterId to ReserveAnchor454. This does not invent a logical-family',
'or leaf member that was absent from the accepted shape.','',
'Sample outputs461/463 reuse ObservationId1115; pressure464 uses1142. SEM experience',
'continues using1106. EmbodiedSample is the closed461/463 schema alias, with no extra',
'wrapper/tag. The private carrier, anchor, finite interval, replenishment result and',
'trace-only LevelBinQuantization484 gain no occurrence namespaces.','',
'UnionVariantId1024 members use canonical unsigned pairs [481,1], [481,2], [482,1],',
'[482,2]. Existing259 declarations contain payload fields only, excluding discriminator1;',
'whole-record required/forbidden fields remain explicit in the table.','',
'The exact fuel member is ObservationUnitId1039("unit/embodied-fuel-stock"). It is',
'admitted only by its new profile. The old fixture-pulse singleton remains unchanged.',
'No conversion, SI, REG unit, UnitDefinition, unit registry or DomainValidator is added.','',
'No renumbering, reuse or insertion by shifting. Numeric adjacency carries no semantic',
'meaning. Future allocations append. Proposed failure names remain symbolic strings,',
'not newly allocated numeric error enums. No historical fixture namespace is promoted.','',
'The numeric review independently parsed the displayed tables and checked accepted',
'shape coverage, role/occurrence mappings, collisions and79 actual canonical declaration',
'round trips. All446 prior frozen fingerprints were preserved. Those round trips cover',
'members and registry declarations, not the new semantic-domain codecs or public execution.','',
'Next: complete model/content/role packaging and exact RulesVersion commitments.',
'All76 EMB implementation obligations remain FROZEN, NOT PASSED. EMB-M..O, whole',
'EMB-001, BODY+MULTISOURCE and Campaign3 remain open. No runtime/model activation,',
'new corpus member or behavior qualification is implied by permanent allocation.',''
].join('\n'));
fs.writeFileSync(outputs[2],JSON.stringify({status:'NUMERIC ACCEPTANCE AND FREEZE PASS',version:accepted.version,review:fp(reviewPath),reviewedDraftArtifacts:review.reviewedArtifacts,counts:review.counts,canonicalDeclarationRoundTrips:review.canonicalDeclarationRoundTrips,preservedChecks:frozen.checks.length,frozenArtifacts:outputs.slice(0,2).map(fp),script:fp('scripts/freeze-embodied-reserve-allocation.mjs'),runtime:'NOT PASSED',modelPackaging:'OPEN',parentEmb:'OPEN'},null,2)+'\n');
console.log(JSON.stringify({status:'PERMANENT AND FROZEN',records:'453..484',namespace:1142,members:43,preserved:frozen.checks.length}));
