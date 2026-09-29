from pathlib import Path
import json,subprocess
p=Path('docs/planning');result=json.loads((p/'EMBARRASSMENT_PUBLIC_RESULT_REV1.json').read_text())
assert result['status']=='PASS' and result['runs']==69 and result['prefixes']==483
report=p/'CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md';assert not report.exists(),'Do not rerun finalization'
report.write_text("""# Native embarrassment integration — 2026-09-27

**BOUNDED NATIVE QUALIFIED — VER-C3-EMBARRASSMENT-PUBLIC-001. LOCAL DISPOSITION.**
Stages A–E close the component's immediate public integration gate under
embarrassment-public/0.2-candidate. No architectural ruling required.

| Measure | Qualified scope |
|---|---|
| Native models / distinct runs |6 /69|
| Every complete native prefix |483:414 advancing /69 terminal|
| Actual scheduled events per run |72: six instants, twelve stages each|
| Native / reference tests |22 /328; build passed|
| Wrapper audit |52 producers /55 factories|
| New record allocation |1468..1484; existing namespace1165|
| Highest allocation / since verdict |1484 /0|

## Exact preserved behavior through the public runtime

All69 component cases reproduce every goal, report history, estimate, affect coordinate,
raw signal, reason, probability, chosen action, intent, DecisionExpression, plan,
attempt, execution, completion, cue and observation exactly. Native physical presence
matches the component at every instant; committed RNG addresses match as well. The
six native models retain Contextual, Latest, JudgmentOnly, NoAffectReasons, CoarseUnit
and ScalarUncontrolled. No component or predecessor source is rewritten.

Five of eight fine-calibration primary seeds continue participating with positive
embarrassment and a positive avoidance base. Removing only participation importance
preserves beliefs and affect and selects withdrawal in every paired seed. Failed
withdrawal preserves its intended action but leaves physical presence true. The fine
modifier changes withdrawal probability from1/3 to1/2 and changes seed2's action;
CoarseUnit's equality with NoAffectReasons is preserved. These remain bounded calibration
candidates, not a general emotion scale or universal action rule.

False or denied reports, unknown versus known nonnegative evaluation, known unseen
incident, known no mismatch, zero reputation relevance, missing opportunity and zero
bases preserve their component distinctions. Mean and Latest retain the same reports
but differ after contradiction. Correction admitted after decision4 changes appraisal5,
never the earlier decision. DisplayOff preserves private affect and DecisionExpression
while suppressing the independent cue. Cue zero remains distinct from absence.

## Native ownership, order and observer boundary

Typed original1469 admits the sixteen controlled source fields, with exact domain,
clock, opportunity, goal-adoption and seed constraints. Prepared handles are opaque;
all supplied byte arrays are copied. Exact profile/content/registry admission binds
the model. Empty declared S0 derives three independent owned leaves: goals1471,
report history1474 and physical participation1476. Only context, learning and completion
respectively may mutate them. Cross-writers reject. Learned reports validate their
proposition-specific occurrence coordinates and strictly increasing own tickets.

Actual events are context40 -> appraise50 -> reasons52 -> decision60 -> intent70 ->
expression80 -> plan90 -> attempt100 -> complete110 -> display110 -> observe120 ->
learn140. The two110 events are distinct, parent-authenticated execution steps. No
choice is precomputed at52, no expression emitted at60 and no current report learned
before appraisal. Every stage reserves one runtime coordinate. Completion, physical
transition and visible cue are separately typed; affect or relief supplies no report.

Physical transition1484 is diagnostic and excluded from observer projection. Safe
outputs contain no original truth, model/run identity, roots or trace patches. Whole
safe projections remain byte-identical under changed hidden world facts and changed
denied report content, including later provenance. The native path uses pure inherited
math and actual scheduler transitions, never a preselected component action.

## Replay, failure and publication

The pre-execution plan freezes the complete implementation graph and canonical model,
run, experiment and comparison identities. All483 S0..S6 native saves restore by
fresh original execution and whole Save132 byte equality, then match the exact next
save or terminal no-op. Trace, state, queue, allocators, output and committed RNG are
included. Restore parses only enough structure to bound complete12-event prefixes;
it never installs parsed state. Altered originals, foreign models, partial traces,
forged saves and invalid handles/initial state/seed reject.

Twenty-two native tests include every reached phase plus commit after acquisition,
actual trace phases, exact component rows/presence/RNG, all foreign writers, caller
mutation, safe views and whole-wrapper microtask/concurrency barriers. Native failure
rolls back all committed state and stays Failed; component retry semantics do not leak.
The publication guard spans the outer RNG commit and cleanup. All328 reference tests
and build pass. EMBARRASSMENT_WRAPPER_EXTENSION_REV1.json independently qualifies52
producers/55 factories while exact hash-checked scopes preserve earlier51/50/49 audits.
RO022's new-wrapper trigger is discharged for this addition and reopens for future ones.

## Preserved development and precise limits

Native0.1 incorrectly assigned display115, outside the scheduler's registered phases.
That rejected cohort (21 failed/one passed test) and its contract/allocation/source
bytes remain in embarrassment-public-development-rev1. It did not establish reached
fault coverage. Version0.2 uses a separate display110 child after complete110, preserving
order without changing the scheduler, schema fields or psychological rules. All reached
faults were rerun successfully under the corrected native contract.

EMBARRASSMENT_PUBLIC_FINDINGS.md also records a frozen summary-string erratum: the
result checker's copied phrase "next-instant frame" is inapplicable. This model has
no frame state; the next-instant effect is appraisal of newly learned reports. The
accepted contract, actual state/event schemas and exact rows govern the claim. Frozen
metadata is preserved transparently rather than rewritten after commitment.

Native integration adds no new psychological law or Brief clause promotion. The
component's coarse calibration, complete-factor unknown policy, controlled norm/report
source, graded nonphysiological cue and coinciding affect coordinates remain bounded.
No general cultural/clinical taxonomy, norm discovery, source trust, learned social
strategy, recipient interpretation, identity update or Task/Biological join is implied.

North Star transfer: native execution must preserve the independence of social belief,
private affect, visible cue, competing motives, actual choice and achieved participation.
An actor remaining because it chose another goal differs from remaining after failed
withdrawal. Observer safety must survive the native provenance and persistence path.

MEC001/002/003/004/011..020/022 and P3-001/004/005/008/011 keep component dispositions;
no comparator retired. RO010/011/012/019/020 retain broader research limits, RO021 final
history remains mandatory, and RO022 retains future-wrapper reopening. AuditREV68:
110 bounded/20 partial/2 blocked among132 clauses/15 families;86 named verdicts.
Corpus0.29.0 remains21 members. Campaign3 NOT EXIT-READY. Next DEFINING_MEMORY_READINESS.md.
""",encoding='utf8')
subprocess.run(['node','scripts/check-embarrassment-public-closure.mjs','--write'],check=True)
verdict='VER-C3-EMBARRASSMENT-PUBLIC-001';refs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];memory=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-019','RO-C3-020','RO-C3-021']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text());r['date']='2026-09-27';r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
reports=['CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md','EMBARRASSMENT_PUBLIC_FINDINGS.md','EMBARRASSMENT_PUBLIC_PLAN_REV1.json','EMBARRASSMENT_PUBLIC_RESULT_REV1.json','EMBARRASSMENT_PUBLIC_CLOSURE_REV1.json','EMBARRASSMENT_WRAPPER_EXTENSION_REV1.json','embarrassment-public-development-rev1/PRESERVATION.json']
for n in reports:r['reportReviews'].append({'path':'docs/planning/'+n,'obligations':refs})
r['reportReviews'].append({'path':'docs/planning/DEFINING_MEMORY_READINESS.md','obligations':memory})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' VER-C3-EMBARRASSMENT-PUBLIC-001 discharges immediate native embarrassment admission:6 models/69 runs/483 native prefixes, exact component rows/RNG/physical presence, three independent owners and twelve actual stages.22 native/328 reference tests/build;1484/0. Wrapper inventory52/55 preserves prior51/50/49. Rejected display115 development is preserved; corrected0.2 uses parent-ordered complete110/display110 without changing scheduler or psychology.'
  o['unresolved']+=' Component-era embarrassment native-open statements are historical after this scoped closure. Controlled norm/report semantics, complete-factor unknown handling, coarse modifier equality, general cultural/clinical/physiological affect, source trust, learned social strategy and Task/Biological joins remain unqualified. The frozen result-summary framing phrase is an explicit metadata erratum, not frame-state qualification. Final history and future-wrapper reopening remain mandatory.'
 if o['id'] in memory:o['evidence'].append('docs/planning/DEFINING_MEMORY_READINESS.md')
f.write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
summary='VER-C3-EMBARRASSMENT-PUBLIC-001:6 models/69 runs/483 native prefixes;22+328 tests/build;1484/0. Exact component rows/RNG and physical presence, typed sources, three owners, twelve actual stages and Save132/publication qualified.52/55 wrapper inventory; earlier sources unchanged.'
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write('\n\n## `'+verdict+'` — bounded native embarrassment (2026-09-27)\n\nQUALIFIED NATIVE / LOCAL DISPOSITION, embarrassment-public/0.2-candidate.\n'+summary+'\nPreserve rejected display115 cohort and summary-string erratum. No general norm/physiology or new clause promotion. RO010/011/012/019/020/021/022. Evidence CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md and EMBARRASSMENT_PUBLIC_CLOSURE_REV1.json. Next DEFINING_MEMORY_READINESS.md; no owner ruling.\n')
for n in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/n).open('a',encoding='utf8') as f:f.write('\n\n### Native embarrassment — 2026-09-27\n'+summary+'\nMEC001/002/003/004/011..020/022 and P3-001/004/005/008/011 retain component dispositions; no mechanism retired. Actual decision/expression, cue and physical participation remain distinct. Version0.2 complete110/display110 repairs unregistered115 locally, preserving the rejected cohort. No general social/physiological or Task/Biological claim. Next DEFINING_MEMORY_READINESS.md.\n')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — native embarrassment integration\n'+summary+' Next docs/planning/DEFINING_MEMORY_READINESS.md; no owner ruling or Campaign3 exit.\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved native embarrassment implementation — 2026-09-27\n\n'+f.read_text())
f.write_text("""# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Native embarrassment COMPLETE — VER-C3-EMBARRASSMENT-PUBLIC-001.**
LOCAL DISPOSITION; no architectural blocker. Start CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md
and EMBARRASSMENT_PUBLIC_CLOSURE_REV1.json; embarrassment-public/0.2-candidate.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1484** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /86 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Native experiment | **6 models /69 runs /483 prefixes** |
| Validation | **22 native /328 reference tests; build passed** |
| Native wrapper inventory | **52 producers /55 factories** |

All component rows, RNG and physical presence match. Typed originals, independent
report/goal/presence owners, twelve scheduled stages, Failed rollback and Save132
replay close the native gate. Complete110 precedes separate display110 by authenticated
parentage. Preserve rejected phase115 cohort and frozen summary-string erratum; no
frame state exists here. Earlier component models/calibrations and sources unchanged.

Next DEFINING_MEMORY_READINESS.md: audit old defining episode retention/access/significance
against existing GA, recollection and biography evidence before adding machinery.
RO019 ACTIVE; RO021 final history unsatisfied; RO022 reopens on future wrappers.
AuditREV68; Campaign3 NOT EXIT-READY. No new clause promotion or owner ruling.
""",encoding='utf8')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** embarrassment without avoidance COMPONENT','**Prior routing (2026-09-27):** embarrassment without avoidance COMPONENT',1)
s=s.replace('## Active direction\n',"""## Active direction

**Current routing (2026-09-27):** native embarrassment COMPLETE:
VER-C3-EMBARRASSMENT-PUBLIC-001. Start CURRENT.md and
CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md.6 models/69 runs/483 native prefixes;
22 native/328 reference tests/build;1484/0. Three owners, twelve scheduled stages,
exact component rows/RNG/physical presence. Native0.2 uses parent-ordered complete110/
display110; preserve rejected115 cohort and summary-string erratum (no frame state).
Wrapper inventory52/55; prior sources unchanged. AuditREV68:110 bounded/20 partial/
2 blocked. Next DEFINING_MEMORY_READINESS.md; no owner ruling.
""",1);f.write_text(s,encoding='utf8')
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('\n\n## REV68 — native embarrassment, 2026-09-27\n'+summary+'\nBrief12.5-4 gains native evidence without a new clause promotion:110 bounded/20 partial/2 blocked;86 verdicts. Next old-defining-memory intake. No Campaign3 exit.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev67.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV67.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV68.json'").replace('result.snapshotRevision=67;','result.snapshotRevision=68;').replace('result.counters.highestAllocatedRecordType=1467;','result.counters.highestAllocatedRecordType=1484;')
s=s.replace('const inventory=',"""// REV68: native embarrassment closes its immediate admission gate.
{const clause=families[4].clauses[3];clause.evidence.push(p+'CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md',p+'EMBARRASSMENT_PUBLIC_CLOSURE_REV1.json');clause.rationale+=' VER-C3-EMBARRASSMENT-PUBLIC-001 closes native admission:6/69/483, exact component rows/RNG/presence, three writers, actual scheduled phases, Save132 and wrapper publication. Corrected0.2 uses complete110/display110; rejected115 cohort preserved. No broader psychological claim.';clause.obligations=[...new Set([...clause.obligations,ro(22)])];}
families[4].rationale+=' REV68 closes native embarrassment admission; earlier component-native-open prose is historical for that bounded profile.';
supplemental.push('CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md','EMBARRASSMENT_PUBLIC_FINDINGS.md','EMBARRASSMENT_PUBLIC_CLOSURE_REV1.json','EMBARRASSMENT_WRAPPER_EXTENSION_REV1.json','embarrassment-public-development-rev1/PRESERVATION.json','DEFINING_MEMORY_READINESS.md');
const inventory=""",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV67.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV67.json'),disposition:'Native embarrassment admission closed:6/69/483,22+328 tests/build,1484/0.86 verdicts;110 bounded/20 partial/2 blocked, no new clause promotion or Campaign3 exit.'};"+s[b:]
s=s.replace("result.publicWrapperGate={path:p+'CHOSEN_REAPPRAISAL_WRAPPER_EXTENSION_REV1.json',obligation:'RO-C3-022',status:'CLOSED',scope:'Declared51-producer/54-factory inventory; prior50 and original49 audits retained. Reopen on new wrapper ownership.'};","result.publicWrapperGate={path:p+'EMBARRASSMENT_WRAPPER_EXTENSION_REV1.json',obligation:'RO-C3-022',status:'CLOSED',scope:'Declared52-producer/55-factory inventory; prior51/50/49 audits retained. Reopen on new wrapper ownership.'};")
f.write_text(s,encoding='utf8')
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
