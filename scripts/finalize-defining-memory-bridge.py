from pathlib import Path
import json,subprocess
p=Path('docs/planning');verdict='VER-C3-DEFINING-MEMORY-BRIDGE-001';refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-019','RO-C3-020','RO-C3-021']
r=json.loads((p/'RESEARCH_OBLIGATIONS.json').read_text());assert not any(v['verdict']==verdict for v in r['verdictReviews']);r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
reports=['CAMPAIGN3_DEFINING_MEMORY_BRIDGE_QUALIFICATION.md','DEFINING_MEMORY_BRIDGE_FINDINGS.md','DEFINING_MEMORY_PLAN_REV1.json','DEFINING_MEMORY_RESULT_REV1.json','DEFINING_MEMORY_BRIDGE_CLOSURE_REV1.json','DEFINING_MEMORY_INTEGRATION_READINESS.md','defining-memory-development-rev1/PRESERVATION.json']
for n in reports:r['reportReviews'].append({'path':'docs/planning/'+n,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' VER-C3-DEFINING-MEMORY-BRIDGE-001: actual GA acquisition37/38 followed by4 retention models/288 component continuations/864 deterministic stage comparisons. At capacity1 significance-first retains and publishes the time5 episode while age/use/shared retain time35; capacity8 retains old content without selecting it.13+328 tests/build; no allocation,1484/0.'
  o['unresolved']+=' Full defining-memory frontier remains OPEN: different goal-relative meaning at equal age/use, false later evidence, exact rehearsal counts, standing interventions, ordinary consolidation and native continuation are not qualified. Idle clock jumps are not long-horizon activity. No Brief promotion or retirement of simpler laws. Next DEFINING_MEMORY_INTEGRATION_READINESS.md.'
(p/'RESEARCH_OBLIGATIONS.json').write_text(json.dumps(r,indent=2)+'\n')
summary='4 retained-law models/288 component cases/864 deterministic stage comparisons;13 focused/328 reference tests/build;1484/0. Acquired significance changes old-episode survival and actual recollection under capacity pressure; retained-but-not-recalled remains distinct. Full defining-memory frontier OPEN.'
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write('\n\n## `'+verdict+'` — defining-memory retention/recollection bridge (2026-09-27)\n\nBOUNDED COMPARISON QUALIFIED / LOCAL DISPOSITION. defining-memory-experiment/0.1-candidate.\n'+summary+'\nActual GA37/38 source, unchanged retention/recollection kernels; no new native admission or clause promotion. Preserve Set/List adapter failure and mismatched-cue ranking limit. RO005/006/007/009/019/020/021. Evidence CAMPAIGN3_DEFINING_MEMORY_BRIDGE_QUALIFICATION.md and DEFINING_MEMORY_BRIDGE_CLOSURE_REV1.json. Continue DEFINING_MEMORY_INTEGRATION_READINESS.md; no owner ruling.\n')
for name in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/name).open('a',encoding='utf8') as f:f.write('\n\n### Defining-memory bridge — 2026-09-27\n'+verdict+': '+summary+'\nGA use/significance tier equality now discriminates under tighter capacity. SharedProtection/UseOnly/AgeOnly still coincide in this matrix; no law retired. Component continuation only; wrapper52/55 unchanged. See DEFINING_MEMORY_BRIDGE_FINDINGS.md and DEFINING_MEMORY_INTEGRATION_READINESS.md.\n')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — defining-memory bridge\n'+summary+' Continue docs/planning/DEFINING_MEMORY_INTEGRATION_READINESS.md; no owner ruling or Campaign3 exit.\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved native embarrassment checkpoint — 2026-09-27\n\n'+f.read_text())
f.write_text('''# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Defining-memory bridge QUALIFIED — VER-C3-DEFINING-MEMORY-BRIDGE-001.**
**Full old-but-defining-memory frontier remains OPEN.** LOCAL DISPOSITION.
Start CAMPAIGN3_DEFINING_MEMORY_BRIDGE_QUALIFICATION.md and
DEFINING_MEMORY_BRIDGE_CLOSURE_REV1.json; defining-memory-experiment/0.1-candidate.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1484** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /87 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Component comparison | **4 models /288 cases /864 repeated stages** |
| Validation | **13 focused /328 reference tests; build passed** |
| Native wrapper inventory | **52 producers /55 factories; unchanged** |

Actual GA37/38 acquisition supplies earned significance and equally used history.
Capacity1 separates SignificanceFirst from AgeOnly/UseOnly/SharedProtection; actual
published recall carries original time5 evidence. Capacity8 preserves the episode
without selecting it. Absent cue does not read; unrelated cue may still recall under
the existing ranking law. Preserve rejected Set/List adapter cohort.

Next DEFINING_MEMORY_INTEGRATION_READINESS.md: different admitted meaning at equal
age/use, fallible later evidence, standing distinction and native continuation.
Idle probes/component replay do not qualify long-horizon activity or Save132.
No clause promotion. RO019 ACTIVE; RO021 final history unsatisfied; RO022 future-wrapper
trigger remains. AuditREV69; Campaign3 NOT EXIT-READY. No owner ruling pending.
''')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** native embarrassment','**Prior routing (2026-09-27):** native embarrassment',1);s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-27):** defining-memory bridge QUALIFIED:
VER-C3-DEFINING-MEMORY-BRIDGE-001. Full old-defining-memory frontier OPEN. Start
CURRENT.md and CAMPAIGN3_DEFINING_MEMORY_BRIDGE_QUALIFICATION.md.4 models/288 component
cases/864 repeated stages;13 focused/328 reference tests/build;1484/0. Actual GA37/38
history; significance-first protects and recalls old event under pressure, capacity8
retains it without selecting. Preserve Set/List adapter failure and unrelated-cue
ranking limit. No new native admission or clause promotion; wrapper52/55 unchanged.
AuditREV69:110 bounded/20 partial/2 blocked. Next DEFINING_MEMORY_INTEGRATION_READINESS.md;
no owner ruling.
''',1);f.write_text(s)
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('\n\n## REV69 — defining-memory bridge, 2026-09-27\n'+summary+'\nBrief12.3-2 remains BLOCKED pending the explicit integration/readiness gate.110 bounded/20 partial/2 blocked,87 verdicts. No full-frontier closure.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev68.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes());s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV68.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV69.json'").replace('result.snapshotRevision=68;','result.snapshotRevision=69;')
s=s.replace('const inventory=',"""// REV69: discriminating bridge, not full old-defining-memory closure.
families[2].rationale+=' VER-C3-DEFINING-MEMORY-BRIDGE-001 supplies4 retention models/288 component cases with actual acquired GA significance and published recollection. Capacity pressure distinguishes significance-first while retaining access/retention separation. Different-meaning source interventions and native continuation remain open; clause2 stays BLOCKED.';
supplemental.push('CAMPAIGN3_DEFINING_MEMORY_BRIDGE_QUALIFICATION.md','DEFINING_MEMORY_BRIDGE_FINDINGS.md','DEFINING_MEMORY_BRIDGE_CLOSURE_REV1.json','DEFINING_MEMORY_INTEGRATION_READINESS.md','defining-memory-development-rev1/PRESERVATION.json');
const inventory=""",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV68.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV68.json'),disposition:'Defining-memory component bridge4/288/864;13+328 tests/build;1484/0.87 verdicts,110 bounded/20 partial/2 blocked. Full frontier remains open; no clause promotion.'};"+s[b:];f.write_text(s)
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
