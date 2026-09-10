// Primary-agent reviewed vector crosswalk. Checks evidence identity and coverage;
// the explicit witnesses/scopes below are the research judgment, not inferred from counts.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const folder='docs/planning',output=folder+'/CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.json',document=folder+'/CAMPAIGN3_EMBODIED_BOUNDED_QUALIFICATION.md';assert(!fs.existsSync(output));assert(!fs.existsSync(document));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),read=p=>JSON.parse(fs.readFileSync(p));
const shape=read(folder+'/CAMPAIGN3_EMBODIED_SHAPE_REVIEW_REV1.json'),execution=read(folder+'/embodied-execution-rev3/REVIEW.json'),regression=read(folder+'/EMBODIED_REGRESSION_RECONCILIATION_REV2.json'),mutants=read(folder+'/EMBODIED_RUNTIME_MUTANTS_REV3.json'),roles=read(folder+'/EMBODIED_ROLE_MUTANTS_REV1.json');
for(const receipt of [execution,mutants,roles])for(const source of receipt.sources)assert.deepEqual(fp(source.path),source);
for(const source of [...regression.currentTestFiles,...regression.sharedSource,...regression.newSource])assert.deepEqual(fp(source.path),source);
for(const a of execution.artifacts)assert.deepEqual(fp(a.path),a);
assert.equal(read(folder+'/EMBODIED_TARGETED_TESTS_REV2.json').success,true);assert.equal(mutants.results.length,12);assert.equal(execution.results.length,7);assert.equal(regression.tests,1110);
const notes={
 EMB:[
 'Exact rate1/rate2 arithmetic; public baseline/slower trajectories; stored-level substitution detected.',
 'Exact thirds component plus public extra-query/direct-query state equality; queries never reanchor.',
 'Public q2 depletion, delivery5 and next q4; exact component and debt substitution.',
 'Exact e5/e9 component; public baseline/overflow share saturated state and character outputs.',
 'Public q41/q49 with width20 yields byte-equal character outputs; hidden trace differs.',
 'Public resolution-only model contrast changes evidence/pressure with byte-equal body state.',
 'Actual exact bin and codec components cover0/interior/capacity ties and invalid widths; bounded cohort lacks a public capacity sample.',
 'Public denied/unavailable produce absence, no SEM and only source roster reads.',
 'Live PRJ and wrong-subject exclusion; two qualified bodies in actual component; pure pressure has no identity operand.',
 'Public phase10/14/60 before110 and later sample; frozen earlier evidence unchanged.',
 'Empty non-writer patches, actual WRT controls and45 whole-instant rollback boundaries.',
 'Every whole-instant public prefix restores to exact final bytes; changed model/S0 rejects.'
 ],
 EOBS:[
 'Actual old203/204 serializer rejects finite two-endpoint interval; new462 succeeds.',
 'Old valid effect evidence cannot enter exact opportunity source admission; no numeric relabeling.',
 'Data-only facade and original authentication exclude raw payloads, caller IDs and copied traces.',
 'Real SEM substitution/support/payload binding controls reject under live opportunity.',
 'Top-level PRJ plus fixed observer exclusion, exact role/path grammar and no alternate roster accessor.',
 'Pressure arithmetic receives only upper bound and H; body-read substitution rejects at capability guard.',
 'Actual old evidence consumer rejects new schema/seam; old model factory and decoder exclude EMB.',
 'Absence lacks SEM/support; Unavailable is distinct from Known zero in actual codecs and outputs.',
 'Both unavailable causes produce byte-equal output; source body capability and quantization are absent.',
 'Public hidden-initial, rate and overflow comparisons preserve pressure when admitted sample matches.',
 'Source reuse/changed sequence, child replay, occurrence reuse substitution and atomic rollback.',
 'Public branch-neutral budgets; private padding omission substitution fails without fake227.',
 'Actual IDN/direct reads, empty non-writer patches and preserved authoritative families.',
 'Current-lane timing and complete-prefix restore preserve historical sample bytes.',
 'Real SEM reservation, assembly and freeze of empty semantic sets plus singleton216 support.'
 ],
 EING:[
 'Exact declaration graph rejects branch/layout changes; real PRJ compiled before activation.',
 'Only original459/478 admission; forged sequence, raw sample and extra public capability reject.',
 'Genuine same-observer SEM substitution and premature settlement reject.',
 'Matching support identity cannot authorize altered sample bytes at allocated-child binding.',
 'Public absence produces no227; output closure forbids additional learning outputs or Known zero.',
 'Denied/unavailable comparison gives identical outputs and zero source body reads.',
 'Present branch failure aborts; injected boundary failures and malformed state never become absence.',
 'All39-event/18-runtime budgets; skipped-padding and extra-delivery-allocation substitutions detected.',
 'Each changed allocated child coordinate rejects before publication; canonical parent also checked.',
 'Reuse/expired token, pre-ingress settlement, mid-instant save and archived generated child reject.',
 '45 scheduler boundaries cover source, SEM, binding, pressure, final checks and staged writer rollback.',
 'All prefix saves continue exactly; missing/extra/changed original source rows reject.',
 'Different admitted model/S0 cannot reinterpret saved output; complete live prefix is replayed.',
 'Singleton observer exclusion plus shared PRJ isolation; read-then-redact substitution fails. No public multi-observer claim.'
 ],
 EREG:[
 'Old PRJ rejects new layout; actual EMB source/present/absent layouts compile through shared PRJ.',
 'Unbranded/expired source and registration mismatch fail before projection.',
 'Exact266 requirement, key grammar, content singleton and absent caller CharacterId.',
 'Actual two-qualified-body component has equal anchors; wrong bound target rejects; public second body excluded.',
 'Permission false retains only the actual IDN trace read.',
 'Malformed/missing initial body fails; no fallback, repair or initial clamp.',
 'Caller model/run byte snapshots and shared direct-binding isolation preserve selected target.',
 'Exact unit/capacity/parameter/body/reference graph checks in actual declaration compiler.',
 'Closed choice/union/occurrence rules and trace occurrence/allocation checks reject malformed/reused output.',
 'Pressure has only IDN ReadDomain; pure operator has no registry/body capability; body-read mutant fails.',
 'Direct trace reads report exact454 anchor without invented derived q; trace verifier checks actual facts.',
 'Model/parameter mismatch restore rejection and public query-state byte equality.'
 ],
 EREP:[
 'Exact e5/e9 component and public overflow64 comparison: same saturation, hidden overflow difference.',
 'Actual writer proposal plus WRT apply reanchors zero delivery; negative amount rejected. Zero is component-only in this cohort.',
 'Public tied deliveries consume staged predecessors; stale expected prior fails actual WRT component.',
 'Two-body target component, wrong authority/removal/key controls and inherited WRT owning-stage controls.',
 'Only original478 can enter writer; private child graph and public input grammar exclude pressure/intent forgery.',
 'Public source/SEM/pressure ordering precedes tied deliveries; later observation may change.',
 'Zero writer child/runtime budget checked; extra writer ordinal substitution fails.',
 'Complete trace-only decomposition; public overflow contrast leaves character outputs unchanged.',
 '45-boundary rollback and work7 failure undo earlier same-instant body patches.',
 'Pending sample and delivery closure checked against scratch prefix; removing either rejects.',
 'Exact direct anchor trace plus incompatible model/parameter restore rejection.',
 'Ordered distinct tied events retain separate IDs/history; no outcome-based identity aliasing.'
 ],
 ECOMP:[
 'Actual verifier rejects missing/additional/coherently wrong bin operation; omission mutant fails.',
 'Denied/unavailable has no operation or source body capability; read-then-redact mutant fails.',
 'Real bin/codec components protect interior and capacity endpoint rules.',
 'Closed source/SEM/pressure records reject hidden-field or wrong-output additions; all trace fields checked.',
 'Wrong C/hidden q operation, extra/invented read and metadata drift reject against execution facts.',
 'Public hidden-initial and exact41/49 alias: equal character outputs with different trace InputLevel.'
 ],
 EROLE:[
 'Wrong namespaces in both definition-ID collections reject at actual compiler/codec boundary.',
 'Missing/wrong-kind/wrong-version targets reject in declaration tests and materialization review.',
 'Actual VAL-qualified two-body component plus unqualified/nonidentity key rejection and public exclusion.',
 'Actual TransitionKind stable member compiles; DefinitionId alias rejects.',
 'Two independent source substitutions remove collection qualification or map-key qualification; recursive field VAL remains active.'
 ]};
const groups={EMB:['embodiedContrasts','embodiedFactory','embodiedOwnership','embodiedRuntime'],EOBS:['embodiedDeclarations','embodiedCodecs','embodiedAdmission','embodiedBinding','embodiedContrasts','embodiedTrace'],EING:['embodiedDeclarations','embodiedAdmission','embodiedBinding','embodiedRuntime','embodiedFactory','embodiedContrasts'],EREG:['embodiedAdmission','embodiedBinding','embodiedDeclarations','embodiedOwnership','embodiedFactory','embodiedTrace','projectionBindingIsolation'],EREP:['embodiedOwnership','embodiedContrasts','embodiedRuntime','embodiedFactory','wrt001WriteValidationOrder','mutationAuthorityIdentity'],ECOMP:['embodiedTrace','embodiedCodecs','embodiedContrasts'],EROLE:['embodiedDeclarations','embodiedOwnership']};
const rows=[];for(const [prefix,witnesses] of Object.entries(notes))for(const [i,witness] of witnesses.entries()){
 const id=prefix+'-'+String.fromCharCode(65+i),frozen=shape.proofVectors.find(v=>v.id===id);assert(frozen,id);const tests=groups[prefix].map(n=>'src/test/'+n+'.test.ts');for(const test of tests)assert(fs.existsSync(test));rows.push({id,status:'PASS IN BOUNDED PUBLIC/COMPONENT COMPOSITION',witness,tests,source:frozen.source,obligation:frozen.exactLine});
}
assert.equal(rows.length,76);assert.equal(new Set(rows.map(r=>r.id)).size,76);
const deferred=shape.proofVectors.filter(v=>!rows.some(r=>r.id===v.id));assert.deepEqual(deferred.map(v=>v.id),['EMB-M','EMB-N','EMB-O']);
const text=`# Bounded EMB reserve subprofile — qualified\n\n2026-09-10. Primary-agent adversarial review under the user's autonomous-work instruction.\n**The accepted bounded reserve/current observation/support-only SEM/option-free pressure/\nexternal replenishment implementation is COMPLETE AND QUALIFIED.**\nParent EMB-001, BODY, MULTISOURCE and final Need ownership remain open.\n\n## Exact scope\n\nThis accepts execution of the nine seam versions listed in\n\`../formal/EMBODIED_RESERVE_SHAPE_ACCEPTANCE.md\`, under the corrected frozen cohort\n\`campaign3-embodied-model-rev2/FREEZE.json\` and its exact RulesVersion bundle.\nBaseline model digest is \`cae46fcb4da4c9711ee24153854ca2eb976ec9dcad9a2394acb5861489007844\`.\nThe earlier field1 pressure cohort remains superseded historical evidence, never an alias.\nNo number, model bytes, corpus member or higher architectural decision changes here.\n\nAll76 frozen implementation obligations pass in the explicit public/component\ncomposition below. EPACK-A..I pass through the exact declaration reviews, live public\nfactory, identity reconciliation, work7/work8 comparison and source459 negative control.\nThis does not assert that every generic positive is reachable in the singleton cohort.\nThe accepted witness explicitly permits component-positive/profile-exclusion proof.\n\nCapacity-sample ties and rate1/3 arithmetic use actual components; the public cohort\nprovides trajectory/query controls. Zero delivery uses the actual writer proposal and\nWRT application, while the public definitions contain only positive deliveries.\nTwo qualified bodies exist in the actual VAL/state component witness; public content\nremains singleton. Shared PRJ/WRT owning-stage controls supplement profile exclusion.\nNo multi-observer public run, general kinetics, efficacy knowledge, option generation,\nreceiving law, pressure learning or behavioral BODY phenomenon is claimed.\nOmniscient state/trace validation still checks authoritative state; the absence claim\nis specifically zero **source/pressure capability** access to body state, not a ban on\ntrusted host validation. No hidden quantity crosses into character output.\n\n## Current evidence\n\n* \`embodied-execution-rev3/REVIEW.json\`: seven public runs,63 originals,42 committed\n  boundaries,273 events; current canonical artifacts equal the earlier execution bytes.\n* \`EMBODIED_TARGETED_TESTS_REV2.json\`:47 current EMB tests pass, including45 rollback\n  injections, all committed save prefixes, archive tampering and all19 trace fields.\n* \`EMBODIED_REGRESSION_RECONCILIATION_REV2.json\`:1,110 current tests across127 files\n  covered by the full regression run plus the corrected/current EMB rerun. The full\n  run had one new test-harness list/set mistake, now corrected; it is not relabeled\n  as a clean single full run.\n* \`EMBODIED_RUNTIME_MUTANTS_REV3.json\`:12 current-source alternatives detected.\n* \`EMBODIED_ROLE_MUTANTS_REV1.json\`: two independent EROLE-E source substitutions\n  detected while recursive record-field VAL remains active.\n* Type checking and reference-boundary checking pass. The earlier qualification\n  receipt's439 unchanged entries remain intact; seven historical references to two\n  intentionally extended source files are separately recorded. No historical frozen\n  data artifact is rewritten.\n\nThese are implementation/fault controls, not a reduction verdict retiring CTL-001 or\nsettling physiology versus stored Need. MEC-003/004, P3-009/010/011, SUB-003/008/011 and\nall prior preservation obligations keep their accepted dispositions. Existing\ncharacter-learning families remain absent/unchanged; only455 is writable.\n\n## Per-vector crosswalk\n\nTest groups are enumerated per row in the JSON companion with original frozen text.\n\n| Vector | Qualifying witness and scope |\n|---|---|\n${rows.map(r=>`| ${r.id} | ${r.witness} |`).join('\n')}\n\n## Next boundary\n\nEMB-M receiving, EMB-N adopted action knowledge and EMB-O motivational overlap remain\nDEFERRED by this qualification. They require their own accepted symbolic composition,\nseparate allocation/model gates and executed comparisons. The next research work is\nthe observer-safe action-knowledge/embodied-source bridge into genuine shared-option\nreceiving, preserving independent grounds as well as duplicated support. The current\noption-free pressure cannot be renamed a complete behavioral embodied motive.\n`;
fs.writeFileSync(document,text);
const evidence=[folder+'/CAMPAIGN3_EMBODIED_SHAPE_REVIEW_REV1.json',folder+'/campaign3-embodied-model-rev2/FREEZE.json',folder+'/embodied-execution-rev3/REVIEW.json',folder+'/EMBODIED_TARGETED_TESTS_REV2.json',folder+'/EMBODIED_REGRESSION_RECONCILIATION_REV2.json',folder+'/EMBODIED_RUNTIME_MUTANTS_REV3.json',folder+'/EMBODIED_ROLE_MUTANTS_REV1.json',document];
fs.writeFileSync(output,JSON.stringify({status:'BOUNDED EMB SUBPROFILE COMPLETE AND QUALIFIED',reviewer:'Primary-agent self-review under user authorization; no external verdict claimed',rows,deferred,packaging:'EPACK-A..I PASS in stated bounded composition',evidence:evidence.map(fp),sources:execution.sources,script:fp('scripts/qualify-embodied-bounded-profile.mjs'),limits:['Parent EMB-001 remains open','EMB-M..O deferred','No BODY/MULTISOURCE, final Need ownership or corpus promotion']},null,2)+'\n');console.log(JSON.stringify({qualified:rows.length,deferred:deferred.map(v=>v.id),tests:regression.tests}));
