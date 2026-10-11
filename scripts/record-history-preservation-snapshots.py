from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev270/check.json');assert c['assignedSources']==11210
cp=P/'CAMPAIGN3_HISTORY_PRESERVATION_SNAPSHOTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical failed-development preservation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Five preservation receipts retain five original narrative occurrences and all47
JSON string leaves. All19 named archived files match their exact hashes. Original
absolute paths and uppercase hashes remain unchanged in the original routine
receipts; only local path resolution and hash comparison normalize those forms.

Affect-retrieval preflight failed before any matrix: a filename typo and overlapping
launches are not failed behavioral cases. CONTROL's failed integration exceeded
frozen HABIT one-reason arity; the successor used a distinct typed chain rather
than weakening the old codec. Earlier rollback checks did not cover the later contest.

Longitudinal goal's nonzero acquired standing rounded to zero effective coarse
modifier. FineStanding earned bounded receiving usefulness while retaining the
coarse comparator. Routine's two failed cohorts preserve the unsigned occurrence
adapter rejection and mistaken instant14 resumption assertion. The full later
horizon shows seed0 resuming at15; scheduled availability is not guaranteed action.
Neither snapshot presence nor hash equality makes a failed cohort qualified.

The reproducible git-gap-search.json binds the earlier31 unresolved component
binding occurrences (28 distinct path/hash pairs) to reachable Git commits and
raw/LF/CRLF blob hashes. None matched. This scoped search does not cover renamed
paths, dangling objects or other repositories, and is not a global absence claim.
Original source-exact reproducibility remains unearned for those versions.

Source REV270: 11,210 assigned / 163 unassigned; 193,992 narrative / 212,202 backing;
1,362 indexed backing resources. No historical writer or runtime test was rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY; 108 verdicts; 132 bounded clauses; 55 / 58 wrappers;
corpus0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-012','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-preservation-snapshots-rev1','campaign3-history-source-roles-rev270'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: five failed development preservation receipts reconciled.
Start CAMPAIGN3_HISTORY_PRESERVATION_SNAPSHOTS_CHECKPOINT.md.
Five original narrative occurrences;47 string leaves;19 exact archived bindings.
Git search preserved:31 unresolved occurrences/28 distinct pairs;no exact matches.
Source REV270:11210 assigned /163 unassigned;193992 narrative /212202 backing;
1362 backing resources. Failed cohorts are not retroactively qualified.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
