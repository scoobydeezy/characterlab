from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev274/check.json');assert c['assignedSources']==11239
cp=P/'CAMPAIGN3_HISTORY_PRODUCTION_BOUNDARY_REVISIONS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical production-boundary revision chain — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Five receipts preserve20 original narrative occurrences and all1,103 JSON string
leaves. The revision chain records41,49,50,60 and62 detected faults:262 occurrences
over62 distinct cases. Exact comparison confirms all earlier controls remain
unchanged in each successor. Repetition is not independent scientific evidence.

The separately defended outer-map-deletion substitution remains excluded from
detected faults: the inner prepared capability still prevents replay. This does
not prove both guards necessary or make the unchanged behavior a test failure.

Formation retains selection/acquisition/experience distinctions, positive child
filtering, prepared context and strict prior concern. Later controls preserve
independent cues and retention comparators that ignore significance without erasing
its owned source state. Actual retention loss reaches the owner protocol. Credit
does not retroactively change current retention. Presentation seeds/history,
association elapsed time and graph clocks remain distinct; carrier overflow is
rejected before retention can hide it. Canonical graph key ordering must reindex
the matrix so that edge meaning survives sorting.

146 binding occurrences represent43 distinct path/hash pairs;125 match exact
current/indexed bytes and21 remain explicitly unresolved. Missing historical
versions limit source-exact reproducibility. Later bounded qualification does not
replace their hashes. These receipts retain trusted component payload/PRJ and
public admission limitations; they do not independently establish public ownership.

Source REV274:11,239 assigned /134 unassigned;194,114 narrative /212,205 backing;
1,430 indexed backing resources. No historical writers or runtime tests rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-production-boundary-revisions-rev1','campaign3-history-source-roles-rev274'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: five production-boundary revisions reconciled.
Start CAMPAIGN3_HISTORY_PRODUCTION_BOUNDARY_REVISIONS_CHECKPOINT.md.
20 original narrative occurrences;1103 string leaves;262 detections/62 distinct cases.
125 exact bindings;21 unresolved binding occurrences;defended substitution not counted.
Source REV274:11239 assigned /134 unassigned;194114 narrative /212205 backing;
1430 backing resources. Earlier controls preserved exactly across successor revisions.
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
