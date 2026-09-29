from pathlib import Path
import json,subprocess
p=Path('docs/planning');refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];reports=['DEFINING_NATIVE_LIFECYCLE_CHECKPOINT.md','DEFINING_NATIVE_LIFECYCLE_CHECK_REV1.json','defining-lifecycle-development-rev1/PRESERVATION.json','defining-lifecycle-development-rev2/PRESERVATION.json']
assert json.loads((p/'DEFINING_NATIVE_LIFECYCLE_CHECK_REV1.json').read_text())['status']=='NATIVE LIFECYCLE IMPLEMENTATION CHECKS PASS'
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text())
for n in reports:
 path='docs/planning/'+n;assert not any(x['path']==path for x in r['reportReviews']);r['reportReviews'].append({'path':path,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' Native lifecycle implementation now acquires GA37 history, adopts a separate interpretation goal, receives a typed report and settles inherited goal/task deadlines100 in one scheduler. One400 profile/23 freshly repeated prefixes,8 new/44 affected/328 reference tests/build. Separate1485/1486 authorities and actual trace diffs; reached post-terminal fault rolls back both partitions. Implementation evidence only; no new verdict. Counters1487/3.'
  o['unresolved']+=' Full native meaning/attribution/significance, rehearsal/use, retention/protocol/history cleanup, current/final recall and public Save132 gate remain OPEN. Twelve goal/report variants are owner tests, not12 native runs. Diagnostic worldAfter has no new physical producer in lifecycle profile. Preserve compiler-map, Map-serialization trace-test and pre-review model-budget/registration findings; final identity supersedes earlier cohort.'
f.write_text(json.dumps(r,indent=2)+'\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved continuation input checkpoint before native lifecycle — 2026-09-28\n\n'+f.read_text())
f.write_text("""# Current research entry point

**Updated 2026-09-28. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Native defining-memory integration IN PROGRESS. No new verdict.**
Start DEFINING_NATIVE_LIFECYCLE_CHECKPOINT.md and DEFINING_MEMORY_PUBLIC_READINESS.md.
VER-C3-DEFINING-MEANING-001 remains the latest accepted psychological qualification.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1487** |
| Allocated since last verdict/corpus member | **3** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /88 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Native lifecycle development | **1 profile /22 instants /23 freshly repeated prefixes** |
| Validation | **8 new /44 affected /328 reference tests; build passed** |
| Native wrapper inventory | **52 producers /55 factories; unchanged** |

One successor scheduler now acquires GA37 history, adopts the distinct interpretation
goal37/140, receives report43/120 and settles inherited training-goal/task expiry100.
Roots1485/1486 have distinct authorities;1487 is the closed lifecycle source. Actual
trace reads/diffs and post-terminal rollback pass. Final model commits registrations,
ownership, actual S0/calendar and budget+1. Preserve both development cohorts.

Next extend via an explicit full successor: actual38 meaning/attribution/significance;
39..41 rehearsal/use/presentation;42 retention and memory/history/protocol reconciliation;
43 current assessment and final recall/presentation. Then public admission, original-input
Save132, native prefix/fault qualification and wrapper extension. Lifecycle-only evidence
cannot qualify the missing memory behavior; no full native closure or Brief promotion.
RO019 ACTIVE; RO021 final history unsatisfied; RO022 reopens on a new wrapper.
AuditREV73; Campaign3 NOT EXIT-READY. No owner ruling needed.
""")
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-28):** native defining-memory implementation','**Prior routing (2026-09-28):** native defining-memory implementation',1);s=s.replace('## Active direction\n',"""## Active direction

**Current routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_NATIVE_LIFECYCLE_CHECKPOINT.md. One scheduler now acquires
GA37, adopts distinct interpretation goal37/140, receives report43/120 and settles inherited
goal/task deadlines100.1 profile/22 instants/23 repeated prefixes;8 new/44 affected/328
reference tests/build. Actual owner traces and post-terminal rollback. Records1485..1487;
1487/3. Preserve both development cohorts and corrected registry/budget commitment.
Next full successor meaning/attribution/credit, rehearsal/use, retention/protocol/history,
current/final recall, public admission/Save132 gate. Lifecycle profile does not qualify
missing memory behavior. Wrapper52/55 unchanged. AuditREV73:110/20/2;88 verdicts.
No owner ruling.
""",1);f.write_text(s)
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as out:out.write('\n\n## REV73 — native defining lifecycle implementation progress\nOne successor scheduler adds distinct interpretation/report owners and retains inherited100 deadlines.1 native profile/22 instants/23 freshly repeated prefixes;8 new/44 affected/328 reference tests/build. Both development cohorts preserved. Records1485..1487;1487/3. No new verdict, full native closure, public save or Brief promotion;110 bounded/20 partial/2 blocked and88 verdicts remain.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev72.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes());s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV72.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV73.json'").replace('result.snapshotRevision=72;','result.snapshotRevision=73;').replace('result.counters.highestAllocatedRecordType=1484;','result.counters.highestAllocatedRecordType=1487;\nresult.counters.allocatedSinceVerdict=3;');s=s.replace('const inventory=',"supplemental.push('DEFINING_NATIVE_LIFECYCLE_CHECKPOINT.md','DEFINING_NATIVE_LIFECYCLE_CHECK_REV1.json','defining-lifecycle-development-rev1/PRESERVATION.json','defining-lifecycle-development-rev2/PRESERVATION.json');\nconst inventory=",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV72.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV72.json'),disposition:'Native lifecycle implementation only:1 profile/23 repeated prefixes;8 new/44 affected/328 reference tests/build. No full native closure or clause promotion.1487/3.'};"+s[b:];f.write_text(s)
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
