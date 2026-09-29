from pathlib import Path
import json, subprocess

p=Path('docs/planning')
refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']
reports=['DEFINING_NATIVE_REHEARSAL_CHECKPOINT.md','DEFINING_NATIVE_REHEARSAL_CHECK_REV1.json','defining-rehearsal-development-rev1/PRESERVATION.json']
assert json.loads((p/reports[1]).read_text())['status']=='NATIVE REHEARSAL IMPLEMENTATION CHECKS PASS'
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text())
for n in reports:
 path='docs/planning/'+n
 assert not any(x['path']==path for x in r['reportReviews'])
 r['reportReviews'].append({'path':path,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' Native rehearsal/final-recall successor now carries actual cue/focal37 to rank/publication39..41, actual supported attribution and use/presentation settlement. Three16-publication batches; final k1 publication settles only history632.68 owner continuations match memory/history/scores/winners;3 native profiles;27 primary prefixes freshly repeated; post39 atomic rollback. Important35 is retained but unselected at capacity8; absent cue and complete event loss yield no final publication.10 new/54 affected/328 reference tests/build. No new verdict;1492/8.'
  o['unresolved']+=' This discharges prior rehearsal/final-recall handler placeholders only. All68 complete native continuations and public original-input Save132/restore/fault/wrapper gate remain OPEN. Carried query37 is a bounded source control, not fresh perception or learned rehearsal intent. Empty associative graph remains the component comparison profile; acquired graph631 is unchanged, not retired. Final native presentation settlement is explicit beyond the frozen component. Preserve the6-pass/1-fail native development cohort: wrong ScheduledEvent171/field3 test projection corrected to130/field2; capacity-zero native control was reached only in the final cohort. No new worldAfter or importance law.'
f.write_text(json.dumps(r,indent=2)+'\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:
 out.write('\n\n## Preserved native current-assessment checkpoint before rehearsal/final recall — 2026-09-28\n\n'+f.read_text())
f.write_text('''# Current research entry point

**Updated 2026-09-28. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Native defining-memory integration IN PROGRESS. No new verdict.**
Start DEFINING_NATIVE_REHEARSAL_CHECKPOINT.md and DEFINING_MEMORY_PUBLIC_READINESS.md.
VER-C3-DEFINING-MEANING-001 remains the latest accepted psychological qualification.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1492** |
| Allocated since last verdict/corpus member | **8** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /88 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Native rehearsal/final recall | **3 profiles;27 primary prefixes freshly repeated** |
| Owner comparison coverage | **68 continuations: memory/history/scores/winner** |
| Validation | **10 new /54 affected /328 reference tests; build passed** |
| Native wrapper inventory | **52 producers /55 factories; unchanged** |

Actual cue/focal37 generates carried recall requests. Three actual16-publication
rehearsals at39..41 feed supported attribution, use and presentation owners. Final
k1 recall settles only the selected presentation. Important35 stays retained but
unselected at capacity8; absent cue and complete event loss produce no publication.
Post39 rollback includes all owners, outputs, trace, queue and allocators.
The carried query is not fresh perception or learned rehearsal intent. Empty graph
is an explicit component comparator; actual graph631 remains unchanged. Preserve
ScheduledEvent171/130 test-only failure and the unreached initial zero-cap control.
Records1491..1492 added; no namespace, authority, verdict reset or clause promotion.

Next all68 complete native cases and public typed admission/original-input Save132,
then native restore/fault qualification and wrapper extension. Internal handlers
now support rehearsal0/3 and matching/absent final cue; owner coverage is not68 native
runs. Final native presentation settlement deliberately extends the frozen component.
worldAfter remains diagnostic; current baseline remains a scheduled operand.
RO019 ACTIVE; RO021 final history unsatisfied; RO022 reopens on a new wrapper.
AuditREV76; Campaign3 NOT EXIT-READY. No architectural owner ruling.
''')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-28):** native defining-memory implementation','**Prior routing (2026-09-28):** native defining-memory implementation',1)
s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_NATIVE_REHEARSAL_CHECKPOINT.md. Actual carried query37
feeds three16-publication rehearsals, supported attribution/use/presentation and
final k1 recall with actual presentation settlement.3 native profiles/27 repeated
primary prefixes;68 owner continuations;10 new/54 affected/328 reference tests/build.
Retained35 can remain unselected; absent cue/lost events yield no publication.1492/8.
Preserve test-only ScheduledEvent171/130 failure. Carried query is not fresh perception
or learned rehearsal intent; empty graph is a retained comparator. Next68 complete
native cases/public Save132/restore/fault/wrapper gate. No full closure or owner ruling.
AuditREV76:110/20/2;88 verdicts; wrapper52/55 unchanged.
''',1);f.write_text(s)
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as out:
 out.write('\n\n## REV76 — native rehearsal and final-recall implementation progress\nActual carried query37 supplies three rehearsal batches and final recall/presentation.3 native profiles/27 repeated primary prefixes;68 owner continuations;10 new/54 affected/328 reference tests/build. Original ownership; post39 rollback; retained-but-unselected, absent-cue and complete-loss controls. Empty graph/carried-query scope and test-only ScheduledEvent171/130 failure preserved.1492/8; no verdict or clause promotion. Full native/public gate OPEN;110 bounded/20 partial/2 blocked,88 verdicts.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev75.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV75.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV76.json'").replace('result.snapshotRevision=75;','result.snapshotRevision=76;').replace('result.counters.highestAllocatedRecordType=1490;','result.counters.highestAllocatedRecordType=1492;').replace('result.counters.allocatedSinceVerdict=6;','result.counters.allocatedSinceVerdict=8;')
s=s.replace('const inventory=',"supplemental.push('DEFINING_NATIVE_REHEARSAL_CHECKPOINT.md','DEFINING_NATIVE_REHEARSAL_CHECK_REV1.json','defining-rehearsal-development-rev1/PRESERVATION.json');\nconst inventory=",1)
a=s.index('result.predecessor=');b=s.index('\n',a)
s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV75.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV75.json'),disposition:'Native rehearsal/final-recall implementation only:3 profiles/27 repeated primary prefixes;68 owner continuations;10 new/54 affected/328 reference tests/build. Full gate OPEN.1492/8.'};"+s[b:]
f.write_text(s)
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
