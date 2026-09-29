from pathlib import Path
import json, subprocess

p=Path('docs/planning')
refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']
reports=['DEFINING_NATIVE_CURRENT_CHECKPOINT.md','DEFINING_NATIVE_CURRENT_CHECK_REV1.json','defining-current-development-rev1/PRESERVATION.json']
assert json.loads((p/reports[1]).read_text())['status']=='NATIVE CURRENT ASSESSMENT IMPLEMENTATION CHECKS PASS'
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text())
for n in reports:
 path='docs/planning/'+n
 assert not any(x['path']==path for x in r['reportReviews'])
 r['reportReviews'].append({'path':path,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' Native current-assessment successor now joins actual meaning38 delivery43/125 with owned report43/120 at assessment43/130. Goal/report reads only; no memory/history/protocol writer. All68 component current projections match;2 native profiles;24 primary prefixes freshly repeated; post43 rollback and missing report after complete event loss pass.9 new/50 affected/328 reference tests/build. No new verdict;1490/6.'
  o['unresolved']+=' This discharges the prior current-assessment implementation placeholder only. The carried Before interval is an explicitly scheduled in-flight operand, not recollection after loss or persistent cognitive protocol access. Rehearsal, final recall/presentation, all68 complete native cases and public original-input Save132 remain OPEN. Preserve the8-pass/1-fail development receipt: test parsed StatePatch144 as operation145; corrected test only. Immutable interpretation goal binding is bounded; no importance revision law or worldAfter consumer.'
f.write_text(json.dumps(r,indent=2)+'\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:
 out.write('\n\n## Preserved native memory-owner checkpoint before current assessment — 2026-09-28\n\n'+f.read_text())
f.write_text('''# Current research entry point

**Updated 2026-09-28. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Native defining-memory integration IN PROGRESS. No new verdict.**
Start DEFINING_NATIVE_CURRENT_CHECKPOINT.md and DEFINING_MEMORY_PUBLIC_READINESS.md.
VER-C3-DEFINING-MEANING-001 remains the latest accepted psychological qualification.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1490** |
| Allocated since last verdict/corpus member | **6** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 /RO-C3-022** |
| Corpus /named verdict entries | **0.29.0 -21 members /88 verdicts** |
| Brief clauses /families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Native current-assessment development | **2 profiles;24 primary prefixes freshly repeated** |
| Owner comparison coverage | **68 current-assessment projections** |
| Validation | **9 new /50 affected /328 reference tests; build passed** |
| Native wrapper inventory | **52 producers /55 factories; unchanged** |

Actual meaning38 emits delivery43/125; owned report43/120 and that delivery parent
current assessment43/130. Current judgment reads only goal/report; historical
qualification and acquired credit survive contrary or missing evidence unchanged.
Missing evidence after complete event loss does not recreate an acquisition.
The scheduled historical baseline is an in-flight operand, not recall after loss.
Preserve the test-only StatePatch144/operation145 development assertion failure.
Record1490 added; no namespace, authority, verdict reset or clause promotion.

Next actual39..41 rehearsal/attribution/use/presentation, final recall/presentation
and all68 complete native cases; then public typed admission, original-input Save132,
native restore/fault gate and wrapper extension. Rehearsal3 and absent final cue
remain explicitly unsupported; the horizon is a clock witness. worldAfter is
diagnostic; immutable goal binding is bounded. RO019 ACTIVE; RO021 final history
unsatisfied; RO022 reopens on a new wrapper. AuditREV75; Campaign3 NOT EXIT-READY.
No architectural owner ruling.
''')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-28):** native defining-memory implementation','**Prior routing (2026-09-28):** native defining-memory implementation',1)
s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_NATIVE_CURRENT_CHECKPOINT.md. Actual meaning38 delivery
joins owned report43 in read-only current assessment43/130.2 native profiles;24 primary
prefixes freshly repeated;68 current owner comparisons;9 new/50 affected/328 reference
tests/build. Contrary/missing evidence preserves historical credit; lost events stay
lost. In-flight baseline is not recall. Preserve StatePatch144/145 test-only finding.
1490/6; wrapper52/55 unchanged. Next rehearsal, final recall/presentation,68 complete
native cases and public Save132 gate. No full closure or owner ruling.
AuditREV75:110/20/2;88 verdicts. Rehearsal3/absent final cue remain unsupported.
''',1);f.write_text(s)
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as out:
 out.write('\n\n## REV75 — native current-assessment implementation progress\nActual meaning38 delivery and report43 join current assessment43/130.2 native profiles/24 repeated primary prefixes;68 owner current projections;9 new/50 affected/328 reference tests/build. Read-only current judgment preserves historical credit and complete event loss; in-flight baseline is not recall. Test-only StatePatch144/145 failure preserved.1490/6; no verdict or clause promotion. Full native/public gate OPEN;110 bounded/20 partial/2 blocked,88 verdicts.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev74.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV74.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV75.json'").replace('result.snapshotRevision=74;','result.snapshotRevision=75;').replace('result.counters.highestAllocatedRecordType=1489;','result.counters.highestAllocatedRecordType=1490;').replace('result.counters.allocatedSinceVerdict=5;','result.counters.allocatedSinceVerdict=6;').replace("result.date='2026-09-27';","result.date='2026-09-28';")
s=s.replace('const inventory=',"supplemental.push('DEFINING_NATIVE_CURRENT_CHECKPOINT.md','DEFINING_NATIVE_CURRENT_CHECK_REV1.json','defining-current-development-rev1/PRESERVATION.json');\nconst inventory=",1)
a=s.index('result.predecessor=');b=s.index('\n',a)
s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV74.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV74.json'),disposition:'Native current-assessment implementation only:2 profiles/24 repeated primary prefixes;68 owner current projections;9 new/50 affected/328 reference tests/build. Full gate OPEN.1490/6.'};"+s[b:]
f.write_text(s)
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
