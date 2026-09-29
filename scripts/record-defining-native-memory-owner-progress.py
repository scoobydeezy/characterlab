from pathlib import Path
import json,subprocess
p=Path('docs/planning');refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];reports=['DEFINING_NATIVE_MEMORY_OWNER_CHECKPOINT.md','DEFINING_NATIVE_MEMORY_OWNER_CHECK_REV1.json']+['defining-memory-owner-development-rev'+str(n)+'/PRESERVATION.json' for n in [1,2,3,4,5]]
assert json.loads((p/'DEFINING_NATIVE_MEMORY_OWNER_CHECK_REV1.json').read_text())['status']=='NATIVE MEMORY OWNER IMPLEMENTATION CHECKS PASS'
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text())
for n in reports:
 path='docs/planning/'+n;assert not any(x['path']==path for x in r['reportReviews']);r['reportReviews'].append({'path':path,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' Native meaning/memory-owner implementation connects actual37 attribution delivery to adopted-goal assessment38 and terminal significance, then capacity loss42 through original memory/history/protocol authorities.48 owner cases match component meaning/memory/history. Two native profiles discriminate High from absent interpretation goal despite live training goal. Primary25 prefixes freshly repeat; post-retention fault rolls back all owners.13 new/49 affected/328 reference tests/build. No new verdict;1489/5.'
  o['unresolved']+=' Actual rehearsal/use, current assessment, final recall/presentation and public Save132 gate remain OPEN. Prior supported attribution37 is reused at38 only with unchanged intervening memory; no fresh38 attribution claim. worldAfter remains diagnostic. Preserve five development cohorts: syntax, overbroad context projection, inherited trace child1488 rejection, and raw protocol580 invariant rejection, and test comparison of successor state through the frozen GA-only decoder. Protocol read is exact canonical bytes outside cognitive reads. No new owner or retention law.'
f.write_text(json.dumps(r,indent=2)+'\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved native lifecycle checkpoint before memory-owner integration — 2026-09-28\n\n'+f.read_text())
f.write_text("""# Current research entry point

**Updated 2026-09-28. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Native defining-memory integration IN PROGRESS. No new verdict.**
Start DEFINING_NATIVE_MEMORY_OWNER_CHECKPOINT.md and DEFINING_MEMORY_PUBLIC_READINESS.md.
VER-C3-DEFINING-MEANING-001 remains the latest accepted psychological qualification.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1489** |
| Allocated since last verdict/corpus member | **5** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /88 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Native memory-owner development | **2 profiles;25 primary prefixes freshly repeated** |
| Owner comparison coverage | **48 goal/law/capacity cases** |
| Validation | **13 new /49 affected /328 reference tests; build passed** |
| Native wrapper inventory | **52 producers /55 factories; unchanged** |

Actual37 attribution delivery now joins adopted-goal meaning38 and terminal credit,
followed by retention42 through the original memory/history/protocol owners. High retains
old endpoint35; absent interpretation goal retains139 despite the still-live training
goal. Atomic post-retention rollback passes. Protocol read bytes stay in runtime invariant
evidence. Preserve all five development cohorts and successor inherited trace decoder.
Records1488/1489 added; no namespace or verdict reset.

Next actual39..41 rehearsal/attribution/use/presentation, current assessment43, final
recall/presentation and all68 case coverage. This profile explicitly rejects rehearsal3
and absent cue; its final horizon is a clock witness. Then public typed admission,
original-input Save132, native prefix/fault qualification and wrapper extension.
Prior37 attribution reuse assumes unchanged intervening memory; worldAfter is diagnostic.
RO019 ACTIVE; RO021 final history unsatisfied; RO022 reopens on a new wrapper.
AuditREV74; Campaign3 NOT EXIT-READY. No owner ruling.
""")
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-28):** native defining-memory implementation','**Prior routing (2026-09-28):** native defining-memory implementation',1);s=s.replace('## Active direction\n',"""## Active direction

**Current routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_NATIVE_MEMORY_OWNER_CHECKPOINT.md. Actual attribution37
feeds goal-relative meaning/credit38 and retention42 through original memory/history/
protocol owners.2 native profiles;25 primary prefixes freshly repeated;48 owner cases;
13 new/49 affected/328 reference tests/build. High retains35; absent interpretation goal
retains139 despite live training goal. Atomic retention rollback.1489/5; wrapper52/55.
Preserve all five development cohorts and successor trace codec. Next actual rehearsal,
current assessment, final recall/presentation,68-case coverage and public Save132 gate.
No full closure; prior attribution reuse bounded to unchanged intervening memory.
AuditREV74:110/20/2;88 verdicts. No owner ruling.
""",1);f.write_text(s)
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as out:out.write('\n\n## REV74 — native meaning/memory-owner implementation progress\nActual attribution37 joins meaning/credit38 and retention42.2 native profiles/25 primary prefixes freshly repeated;48 owner cases;13 new/49 affected/328 reference tests/build. Original memory/history/protocol authorities; post-retention rollback. Five development cohorts preserved.1489/5; no new verdict, full native closure or clause promotion.110 bounded/20 partial/2 blocked and88 verdicts remain.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev73.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes());s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV73.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV74.json'").replace('result.snapshotRevision=73;','result.snapshotRevision=74;').replace('result.counters.highestAllocatedRecordType=1487;','result.counters.highestAllocatedRecordType=1489;').replace('result.counters.allocatedSinceVerdict=3;','result.counters.allocatedSinceVerdict=5;');s=s.replace('const inventory=',"supplemental.push('DEFINING_NATIVE_MEMORY_OWNER_CHECKPOINT.md','DEFINING_NATIVE_MEMORY_OWNER_CHECK_REV1.json',...[1,2,3,4,5].map(n=>'defining-memory-owner-development-rev'+n+'/PRESERVATION.json'));\nconst inventory=",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV73.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV73.json'),disposition:'Native meaning/memory-owner implementation only:2 profiles/25 repeated primary prefixes;48 owner cases;13 new/49 affected/328 reference tests/build. Full gate OPEN.1489/5.'};"+s[b:];f.write_text(s)
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
