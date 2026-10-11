from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev276/check.json');assert c['assignedSources']==11251
cp=P/'CAMPAIGN3_HISTORY_GOAL_FORMATION_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical goal and formation controls — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Four receipts preserve11 original narrative occurrences and all177 JSON string
leaves, recording36 detected faults.33 binding occurrences represent32 distinct
path/hash pairs;23 match current/indexed exact bytes and10 remain explicitly
unresolved. Later qualified source bytes do not replace historical identities.

All24 formation/context fault records are retained exactly in the later production
boundary REV5. The separately defended outer-map replay substitution remains
excluded from detected faults because the inner capability is consumed. Empty
selection, missing evidence, per-acquisition identity, positive children, prepared
context and strict prior concern remain distinct component requirements.

Goal distance requires metric rather than merely numeric ordinal domains and strict
interval separation. SameDistance requires identical exact singletons; identical
uncertain ranges remain indeterminate. Independent endpoint positions preserve
equal-distance side crossings. Missing/inactive evidence is unavailable; malformed
or foreign-domain evidence rejects. No midpoint or rounded estimate substitutes.

Both closer and farther can qualify. The deterioration-only comparator excludes
progress as policy, not uncertainty. Qualification grants neither supported
attribution nor extant-target credit, significance storage or retention authority.
Deadline guards preserve terminal withdrawal and its history; scheduling, once-only
ingress, projection and persistence remain separate public obligations.

Source REV276:11,251 assigned /122 unassigned;194,155 narrative /212,205 backing;
1,459 indexed backing resources. No historical writers or runtime tests rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-goal-formation-controls-rev1','campaign3-history-source-roles-rev276'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four goal/formation control receipts reconciled.
Start CAMPAIGN3_HISTORY_GOAL_FORMATION_CONTROLS_CHECKPOINT.md.
11 original narrative occurrences;177 string leaves;36 stored fault controls.
23 exact bindings;10 unresolved occurrences;all24 formation controls retained in REV5.
Source REV276:11251 assigned /122 unassigned;194155 narrative /212205 backing;
1459 backing resources. Qualification is separate from attribution and credit.
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
