from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev285/check.json');assert c['assignedSources']==11278
cp=P/'CAMPAIGN3_HISTORY_SUPERSEDED_MODEL_FREEZES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Superseded model freeze preservation — 2026-10-08

**LOCAL DISPOSITION — four development freezes reconciled; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts unchanged.

CONTROL's seven first identities preserve the failed use of HABIT's one-reason
codec for a two-reason contest. Fifteen rollback checks did not exercise the later
loaded contest. The qualified successor adds an explicit typed chain; it neither
weakens HABIT nor retroactively qualifies this freeze.

PERSONSTATE's eight first identities preserve appraisal50 before target intent70.
This predicted a future choice rather than inferring an already formed intent.
Initial test passage did not prove the intended phenomenon. Corrected0.2 appraises
at130 and commits new identities; the old public aggregate had no PASS.

REASON's first five identities preserve the unregistered phase24 failure (8/19
tests passed). Its next five preserve corrected10/14 ordering but an underpowered
raw1/2 source, bounded to1/3 below37/100 (16/19 passed). The saved draw-address
projection was also empty despite live RNG and trace draws. REV3 repairs fixture
calibration and ledger serialization under unchanged compiler laws/thresholds.
All five identity bytes differ across REV1/2; allocation commitment is unchanged.
Neither earlier freeze inherits the qualified successor's PASS.

All25 model-identity image texts match the frozen identity hex. All108 binding
occurrences /107 distinct pairs match exact bytes. REV1 search checked current
paths and outside-census backing and left three gaps. REV2 expands to indexed
census copies and finds exact CONTROL contract/allocation and PERSONSTATE contract
bytes in their preserved development directories. Both search receipts remain;
these three gaps are resolved, not waived or replaced by successor source bytes.
Future missing-source consolidation must include census copies as well as backing.

Four sources preserve four original narrative occurrences and all266 string leaves.
One hundred existing model images newly indexed. Source REV285:11,278 assigned /
95 unassigned;194,649 narrative /212,205 backing;1,585 backing resources.
No runtime replay, original writer, model, law, verdict, allocation, corpus or
obligation status changed. Earlier gaps, post-cutoff joins and independent adequacy
remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded
clauses;55 /58 wrappers;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-001','RO-C3-012','RO-C3-014','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-superseded-model-freezes-rev1','campaign3-history-superseded-model-freezes-rev2','campaign3-history-source-roles-rev285'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four superseded development freezes reconciled.
Start CAMPAIGN3_HISTORY_SUPERSEDED_MODEL_FREEZES_CHECKPOINT.md.
25 identity images/108 exact bindings; three initial gaps recovered in census copies.
CONTROL arity, PERSONSTATE timing and two REASON failures remain preserved.
Source REV285:11278 assigned /95 unassigned;194649 narrative /212205 backing;
1585 backing resources. No retrospective public PASS or runtime rerun.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Search both census and backing copies for old gaps. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
