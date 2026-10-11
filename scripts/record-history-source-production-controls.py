from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev272/check.json');assert c['assignedSources']==11226
cp=P/'CAMPAIGN3_HISTORY_SOURCE_PRODUCTION_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical source-production controls — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Ten receipts preserve45 original narrative occurrences,3 backing occurrences and
all294 JSON string leaves. They record51 detected mutation occurrences across
marker transactions, displays, scene joins and nine/ten-sweep profiles. Mutation
code strings, including empty insertion, remain inert backing descriptions.

Fifty-one source-binding occurrences represent45 distinct path/hash pairs.
Thirty-four match exact current/indexed bytes;17 remain explicitly unresolved.
Duplicate composition-test and scene source/test entries are preserved without
counting them as independent source evidence. No fresh source-exact reproducibility
claim is made for unavailable versions; later qualification does not replace hashes.

Transactional tracking preserves provisional previews, full input-prefix replay,
manager ownership, detached inputs and atomic commit/abort. Its nine prefix/suffix
comparisons remain component-input evidence, not authenticated originals or public
save equality. The public adapter's scheduler and canonical-read obligations remain
separate. Controlled sources distinguish permission, visibility, absent evidence,
observed zero and stale frames; actual roles cannot be reconstructed from hidden truth.

Panel/body composition allows either source, reserves one shared experience and
checks exact allocation counts before publication. Scene projection and actual SEM
joins still rely on declared content membership and independently qualified owners.
Nine sweeps times three detections bounds27 files; the later ten-sweep profile bounds30.
Successors do not silently expand the old profiles. No arbitrary preloaded graph or
authenticated downstream use follows from a supplied component comparator.

Source REV272:11,226 assigned /147 unassigned;194,072 narrative /212,205 backing;
1,389 indexed backing resources. No historical writers or runtime tests rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-source-production-controls-rev1','campaign3-history-source-roles-rev272'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: ten source-production control receipts reconciled.
Start CAMPAIGN3_HISTORY_SOURCE_PRODUCTION_CONTROLS_CHECKPOINT.md.
45 original narrative/3 backing occurrences;294 string leaves;51 stored fault controls.
34 exact bindings;17 unresolved binding occurrences remain explicit.
Source REV272:11226 assigned /147 unassigned;194072 narrative /212205 backing;
1389 backing resources. Component prefix replay is not public save qualification.
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
