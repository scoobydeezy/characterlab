from pathlib import Path
import json,subprocess
p=Path('docs/planning');refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];reports=['DEFINING_NATIVE_IMPLEMENTATION_CHECKPOINT.md','DEFINING_ACQUISITION_CHECK_REV1.json','defining-acquisition-development-rev1/PRESERVATION.json']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text())
for n in reports:
 path='docs/planning/'+n;assert not any(x['path']==path for x in r['reportReviews']);r['reportReviews'].append({'path':path,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' Native defining-memory acquisition implementation now executes the actual GA predecessor producers from empty S0 through37 under a distinct cutoff commitment. All20 complete prefixes freshly repeat; exact acquired state/outputs match GA37.6 development checks/328 reference tests/build pass. No new verdict or public admission claim.'
  o['unresolved']+=' Same-scheduler continuation handlers, typed goal/report admission, inherited post100 lifecycle, owner/trace expansion, public factory, Save132 and wrapper extension remain OPEN. Preserve dueAt-versus-instant test failure; do not treat acquisition-only checks as native defining-memory closure.'
f.write_text(json.dumps(r,indent=2)+'\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved meaning/use checkpoint before native implementation — 2026-09-27\n\n'+f.read_text())
f.write_text('''# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Native defining-memory integration IN PROGRESS. No new verdict.**
Start DEFINING_NATIVE_IMPLEMENTATION_CHECKPOINT.md and DEFINING_MEMORY_PUBLIC_READINESS.md.
The meaning/use component remains qualified by VER-C3-DEFINING-MEANING-001.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1484** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /88 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Native acquisition development | **19 instants /20 freshly repeated complete prefixes** |
| Validation | **6 development /328 reference tests; build passed** |
| Native wrapper inventory | **52 producers /55 factories; unchanged and rechecked** |

Implemented a successor native acquisition scheduler, empty-S0 through37, with distinct
model/run identity and a source cutoff applied before scheduler creation. Exact acquired
state and outputs match GA37 and feed the meaning adapter. No research JSON in execution,
no live queue/state splice and no learned-state injection. Preserve the test-only
instant/dueAt failure; corrected cutoff, replay and reached rollback checks pass.

Next extend the SAME scheduler with typed interpretation goal/report, actual continuation
handlers, owned writes/terminal batches and trace declarations. Handle inherited deadlines
past100 explicitly. Then opaque public admission, original-input Save132, prefix/fault
checks and wrapper extension. Do not claim full native closure from the prelude.
No new allocation or clause promotion. RO019 ACTIVE; RO021 final history unsatisfied;
RO022 reopens on a new wrapper. AuditREV71; Campaign3 NOT EXIT-READY. No owner ruling.
''')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** defining meaning/use','**Prior routing (2026-09-27):** defining meaning/use',1);s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-27):** native defining-memory implementation IN PROGRESS.
No new verdict. Start CURRENT.md and DEFINING_NATIVE_IMPLEMENTATION_CHECKPOINT.md.
Actual native empty-S0 acquisition through37 implemented:19 instants/20 freshly repeated
complete prefixes; exact GA37 state/outputs;6 development/328 reference tests/build.
Preserve test-only instant/dueAt failure.1484/0; wrapper52/55 unchanged and rechecked.
Next same-scheduler continuation handlers, typed goal/report/owners, inherited lifecycle,
Save132 and public wrapper gate in DEFINING_MEMORY_PUBLIC_READINESS.md. Do not declare
native closure from the prelude. AuditREV71:110 bounded/20 partial/2 blocked;88 verdicts.
No owner ruling.
''',1);f.write_text(s)
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as out:out.write('\n\n## REV71 — native defining-memory implementation progress\nNative acquisition from empty S0 through37 now reproduces the actual prior state/outputs and20 complete prefixes.6 development/328 reference tests/build pass; public wrapper52/55 unchanged. No new verdict, allocation, native continuation closure or clause promotion.110 bounded/20 partial/2 blocked;88 verdicts;1484/0. Continue DEFINING_NATIVE_IMPLEMENTATION_CHECKPOINT.md.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev70.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes());s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV70.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV71.json'").replace('result.snapshotRevision=70;','result.snapshotRevision=71;');s=s.replace('const inventory=',"supplemental.push('DEFINING_NATIVE_IMPLEMENTATION_CHECKPOINT.md','DEFINING_ACQUISITION_CHECK_REV1.json','defining-acquisition-development-rev1/PRESERVATION.json');\nconst inventory=",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV70.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV70.json'),disposition:'Native acquisition implementation progress only:19 instants/20 repeated prefixes,6+328 tests/build. No new verdict or clause promotion; native continuation remains OPEN.1484/0.'};"+s[b:];f.write_text(s)
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
