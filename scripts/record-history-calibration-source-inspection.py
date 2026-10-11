from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev278/check.json');assert c['assignedSources']==11255
cp=P/'CAMPAIGN3_HISTORY_CALIBRATION_SOURCE_INSPECTION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Calibration correction and concern source inspection — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Two receipts preserve9 original narrative occurrences and all36 string leaves.
All12 source bindings match exact current/indexed bytes; no new source gap.

Fresh structural comparison confirms three Calibration fields change from
GovernedContentDefinitionId to existing DefinitionId, with corresponding role
family/requirement changes.136 other fields and four map-key positions remain
unchanged. The successor role packet removes old review/fault/source claims:
old mutation receipts are not transferred to new bytes. These identities are
distinct, not aliases. Purpose, referenced schema and executing model membership
still require compiler checks; no allocation or frozen model changed.

The concern-source inspection is explicitly a draft, not passed ACS-A..L evidence.
Capacity2 permits one task and forecast; capacity1 does not donate an extra slot.
Preactivation measurement avoids silently completing the known-zero task. Actual
prediction application precedes workspace by a committed instant. The existing
whole cognitive adapter continues beyond concern, so a terminal restriction needs
its own governed successor. Measurement/task/prediction descendants and deadlines
remain genuine work; three local stages are not the total source budget.
Later GA evidence qualifies its bounded source separately, not these draft bytes.

Source REV278:11,255 assigned /118 unassigned;194,183 narrative /212,205 backing;
1,463 indexed backing resources. No historical writers or runtime tests rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-calibration-source-inspection-rev1','campaign3-history-source-roles-rev278'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: calibration correction/source inspection reconciled.
Start CAMPAIGN3_HISTORY_CALIBRATION_SOURCE_INSPECTION_CHECKPOINT.md.
9 original narrative occurrences;36 string leaves;12 exact bindings;no new gaps.
Three changed calibration fields/136 unchanged/four unchanged map keys verified.
Source REV278:11255 assigned /118 unassigned;194183 narrative /212205 backing;
1463 backing resources. Source design remains distinct from executed public proof.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN;HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
