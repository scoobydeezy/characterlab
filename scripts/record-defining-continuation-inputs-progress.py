from pathlib import Path
import json,subprocess
p=Path('docs/planning');refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];reports=['DEFINING_CONTINUATION_INPUTS_CHECKPOINT.md','DEFINING_CONTINUATION_INPUTS_CHECK_REV1.json']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text())
for n in reports:
 path='docs/planning/'+n;assert not any(x['path']==path for x in r['reportReviews']);r['reportReviews'].append({'path':path,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' Continuation input/interpretation-owner development preserves68 historical/current qualification projections with8 new/36 affected/328 reference tests and build. Separate goal/report projection excludes world/retention controls. Local native ordering adopts at37/140, active38; inherited100 deadlines remain within long horizons. No new verdict.'
  o['unresolved']+=' Pure owner transitions and stage plans are not native registered handlers, state authority or public source admission. Preserve distinct goal identity/adoption metadata and required final presentation settlement. Same-scheduler wiring, acquired-evidence authentication, trace/terminal owners, public Save132 and prefix/fault gate remain OPEN.'
f.write_text(json.dumps(r,indent=2)+'\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved acquisition checkpoint before continuation inputs — 2026-09-28\n\n'+f.read_text())
f.write_text("""# Current research entry point

**Updated 2026-09-28. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Native defining-memory integration IN PROGRESS. No new verdict.**
Start DEFINING_CONTINUATION_INPUTS_CHECKPOINT.md and DEFINING_MEMORY_PUBLIC_READINESS.md.
VER-C3-DEFINING-MEANING-001 remains the latest accepted psychological qualification.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1484** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /88 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Continuation development | **68 matching qualification projections;8 new/36 affected tests** |
| Validation | **328 reference tests; build passed** |
| Native acquisition, preserved | **19 instants /20 repeated complete prefixes** |
| Native wrapper inventory | **52 producers /55 factories; unchanged** |

Typed continuation source plan and pure interpretation goal/report owner now implemented.
Strict parameter domains, immutable inputs, separate safe report projection and explicit
missing evidence pass. LOCAL DISPOSITION: adopt at37/140, active38; preserve inherited
training-goal/task expiry100 for long horizons. Final recall requires actual presentation
settlement. Record these native differences; do not rewrite component evidence.

Next wire the plan and owners into the SAME successor scheduler from S0: typed state
roots, trace/handler registration, actual acquired-evidence access, memory/history/protocol
terminal ownership. Then public admission, original-input Save132, reached fault/prefix
checks and wrapper extension. Neither source plans nor pure owners qualify native closure.
No new allocation/clause promotion. RO019 ACTIVE; RO021 final history unsatisfied;
RO022 reopens on a new wrapper. AuditREV72; Campaign3 NOT EXIT-READY. No owner ruling.
""")
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** native defining-memory implementation','**Prior routing (2026-09-27):** native defining-memory implementation',1);s=s.replace('## Active direction\n',"""## Active direction

**Current routing (2026-09-28):** native defining-memory implementation IN PROGRESS.
Start CURRENT.md and DEFINING_CONTINUATION_INPUTS_CHECKPOINT.md. Typed source plan and
pure interpretation owner:68 matching qualification projections,8 new/36 affected/328
reference tests/build. LOCAL DISPOSITION adoption37/140 active38; inherited100 deadlines
preserved within horizon. Final native recall must settle presentation history. No new
verdict/allocation/native qualification;1484/0; wrapper52/55. Acquisition evidence unchanged.
Next same-scheduler registered handlers/roots, actual evidence and terminal memory owners,
trace, public admission/Save132 and native prefix/fault gate. AuditREV72:110/20/2;88 verdicts.
No owner ruling. Pure transitions are not registered native ownership.
""",1);f.write_text(s)
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as out:out.write('\n\n## REV72 — continuation input/owner implementation progress\nTyped source plan and pure interpretation owner retain68 component qualification projections.8 new/36 affected/328 reference tests/build pass. Explicit adoption37/140 active38, inherited deadline100 and final presentation settlement requirements. Native registration and public gate OPEN. No new verdict/allocation/clause promotion;1484/0,88 verdicts,110 bounded/20 partial/2 blocked.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev71.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes());s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV71.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV72.json'").replace('result.snapshotRevision=71;','result.snapshotRevision=72;');s=s.replace('const inventory=',"supplemental.push('DEFINING_CONTINUATION_INPUTS_CHECKPOINT.md','DEFINING_CONTINUATION_INPUTS_CHECK_REV1.json');\nconst inventory=",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV71.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV71.json'),disposition:'Continuation input/owner development:68 matching qualification projections,8 new/36 affected/328 reference tests/build. No native closure or clause promotion.1484/0.'};"+s[b:];f.write_text(s)
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
