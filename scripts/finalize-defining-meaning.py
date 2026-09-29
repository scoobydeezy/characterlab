from pathlib import Path
import json,subprocess
p=Path('docs/planning');verdict='VER-C3-DEFINING-MEANING-001';refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']
r=json.loads((p/'RESEARCH_OBLIGATIONS.json').read_text());assert not any(v['verdict']==verdict for v in r['verdictReviews']);r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
reports=['CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md','DEFINING_MEANING_FINDINGS.md','DEFINING_MEANING_PLAN_REV1.json','DEFINING_MEANING_RESULT_REV1.json','DEFINING_MEANING_CLOSURE_REV1.json','DEFINING_MEMORY_PUBLIC_READINESS.md','defining-meaning-development-rev1/PRESERVATION.json']
for n in reports:r['reportReviews'].append({'path':'docs/planning/'+n,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' VER-C3-DEFINING-MEANING-001 qualifies component meaning/use integration:4 models/68 cases/308 repeated stages;15 new/28 affected/328 reference tests/build;1484/0. Same actually recalled evidence under High/Low/Wide/Absent goals gives progress/deterioration/neutral/unavailable; actual attribution gates historical credit. Three rehearsals each publish8 event+8 body and consume16 children. Later reports affect current interpretation without restoring lost event content.'
  o['unresolved']+=' Native source/scheduler continuation remains required before full defining-memory closure. Preserve failed assumption that equal uncertain distance intervals prove SameDistance; accepted IndeterminateRelation is unchanged. No new source trust, identity-to-importance, current-credit revocation, narrative self-concept, routine consolidation or active-long-horizon law. Next DEFINING_MEMORY_PUBLIC_READINESS.md; no Brief promotion or comparator retirement.'
(p/'RESEARCH_OBLIGATIONS.json').write_text(json.dumps(r,indent=2)+'\n')
summary='4 models/68 component cases/308 repeated stages;15 new/28 affected/328 reference tests/build;1484/0. Same acquired history yields different goal-relative meaning; actual counted rehearsal changes access; later evidence preserves historical event content/credit. Native continuation OPEN.'
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write('\n\n## `'+verdict+'` — defining memory: admitted meaning and use (2026-09-27)\n\nBOUNDED COMPONENT INTEGRATION QUALIFIED / LOCAL DISPOSITION, defining-meaning/0.1-candidate.\n'+summary+'\nPreserve IndeterminateRelation versus SameDistance failure; no inherited law changed. RO005/006/007/009/010/019/020/021. Evidence CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md and DEFINING_MEANING_CLOSURE_REV1.json. Next DEFINING_MEMORY_PUBLIC_READINESS.md; no owner ruling or full defining-memory closure.\n')
for name in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/name).open('a',encoding='utf8') as f:f.write('\n\n### Defining memory: meaning/use integration — 2026-09-27\n'+verdict+': '+summary+'\nRetain goal-distance qualification, actual attribution, historical credit, presentation history, later current assessment and retained event content. Do not collapse identical uncertain ranges to known equality. Wrapper52/55 unchanged; no native continuation or law retirement. See DEFINING_MEANING_FINDINGS.md.\n')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — defining meaning/use\n'+summary+' Next docs/planning/DEFINING_MEMORY_PUBLIC_READINESS.md under the escalation policy; no owner ruling.\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved defining-memory bridge checkpoint — 2026-09-27\n\n'+f.read_text())
f.write_text('''# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Defining meaning/use COMPONENT COMPLETE — VER-C3-DEFINING-MEANING-001.**
**Full defining-memory closure waits for native continuation.** LOCAL DISPOSITION.
Start CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md and DEFINING_MEANING_CLOSURE_REV1.json;
defining-meaning/0.1-candidate. No owner ruling pending.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1484** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /88 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Component integration | **4 models /68 cases /308 repeated stages** |
| Validation | **15 new /28 affected /328 reference tests; build passed** |
| Native wrapper inventory | **52 producers /55 factories; unchanged** |

Same acquired GA37 history plus High/Low/Wide/Absent goals yields progress,
deterioration, neutral and unavailable meaning through actual qualification/attribution.
Three rehearsals publish/use real children and settle counted presentations. Current
later report does not rewrite historical credit or restore lost event content.
Preserve the12-pass/3-fail development cohort: repeated uncertain intervals are
IndeterminateRelation, not SameDistance. Existing laws and bridge remain unchanged.

Next DEFINING_MEMORY_PUBLIC_READINESS.md: typed original/source, actual owned scheduler
continuation, empty-S0 acquired lineage and whole-prefix Save132. No further component
matrix substitutes for this gate. No standing/self-concept or long-horizon claim.
No clause promotion. RO019 ACTIVE; RO021 final history unsatisfied; RO022 future-wrapper
trigger remains. AuditREV70; Campaign3 NOT EXIT-READY.
''')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** defining-memory bridge','**Prior routing (2026-09-27):** defining-memory bridge',1);s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-27):** defining meaning/use COMPONENT COMPLETE:
VER-C3-DEFINING-MEANING-001. Start CURRENT.md and CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md.
4 models/68 cases/308 repeated component stages;15 new/28 affected/328 reference tests/
build;1484/0. Same acquired evidence, different goals; actual counted rehearsal; later
report preserves old event/credit. Preserve uncertain-interval equality test failure.
Native continuation OPEN; full defining-memory closure waits for that gate. Wrapper52/55
unchanged; no Brief promotion. AuditREV70:110 bounded/20 partial/2 blocked. Next
DEFINING_MEMORY_PUBLIC_READINESS.md; no owner ruling.
''',1);f.write_text(s)
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('\n\n## REV70 — defining meaning/use component integration, 2026-09-27\n'+summary+'\nBrief12.3-2 remains BLOCKED for native continuation.110 bounded/20 partial/2 blocked;88 verdicts. Preserve interval-uncertainty finding.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev69.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes());s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV69.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV70.json'").replace('result.snapshotRevision=69;','result.snapshotRevision=70;')
s=s.replace('const inventory=',"""// REV70: meaning/use gap closed; native continuation remains.
families[2].rationale+=' VER-C3-DEFINING-MEANING-001 supplies4 models/68 cases/308 repeated component stages: same acquired evidence under different goals earns meaning; actual presentation/use is counted; later reports preserve historical content. Equal uncertain distance ranges remain indeterminate. Native continuation remains open, so clause2 stays BLOCKED.';
supplemental.push('CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md','DEFINING_MEANING_FINDINGS.md','DEFINING_MEANING_CLOSURE_REV1.json','DEFINING_MEMORY_PUBLIC_READINESS.md','defining-meaning-development-rev1/PRESERVATION.json');
const inventory=""",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV69.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV69.json'),disposition:'Defining meaning/use component4/68/308;15 new/28 affected/328 reference tests/build;1484/0.88 verdicts,110 bounded/20 partial/2 blocked. Native continuation open; no clause promotion.'};"+s[b:];f.write_text(s)
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
