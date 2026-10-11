from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev305/check.json');assert c['assignedSources']==11350
cp=P/'CAMPAIGN3_HISTORY_BIOLOGY_MAIN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Main functional biological evidence — 2026-10-11

**LOCAL DISPOSITION — original stored evidence reconciled, without wider qualification.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The main roster contains24 model identities/52 runs across11 retained laws. Main and
noLoad retain all eight seeds; other named scenarios use their declared finite seeds
and horizons. Configuration/initial state, model identity and run identity stay separate.
All36 source bindings match; eight existing exact resources join the backing index.

An independent exact-Fraction pass recalculates146,432 pre-consequence belief cells
from earlier admitted receipts, including unknown values, mean/latest, NoLearning and
NoReliefLearning. All2,288 expressions equal their frozen intent/choice/grounds. Stored
observer views omit world/state; probability totals and draw ranges are checked.
Four main seeds return under load and four do not; matched noLoad and later restored
control withhold. False sensed pleasure changes pursuit despite identical final body
state; the coupled-network resource action sequence equals the independent control.
These results preserve serious competitors and do not establish universal necessity.

The read-only closure checker passes against original artifacts and stored trajectories.
It checks dated33-test/328-reference/build receipts; those suites were not rerun.
Main stores2,340 prefix hashes:2,288 advancing boundaries and52 terminal. The original
harness restores each prefix for one successor and runs a full tail only from initial0.
Hashes do not reconstruct complete saves or prove fresh replay. Canonical identity rows
are matched here, not freshly regenerated; freeze timing remains historical evidence.

The constitutional pair yields combined25 models/53 distinct runs/54 execution rows,
2,389 distinct prefixes/2,438 recorded checks. The18-behavior component closure is not
native public admission, clinical calibration, minimal biological domains, natural
exploration or whole Campaign3. Failed exploratory cohorts retain their own review.

All106,415 string leaves retain source pointers, lengths and hashes; short values are
included. Long strings are not copied into another oversized result. Two original
narrative occurrences remain exact. No original source or runtime change.
REV305:11,350 assigned /23 unassigned;198,180 narrative /212,699 backing;
2,782 backing resources. Remaining sources, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-009','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-biology-main-rev1','campaign3-history-source-roles-rev305'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: main biological plan/results/closure reconciled.
Start CAMPAIGN3_HISTORY_BIOLOGY_MAIN_CHECKPOINT.md.
24 models/52 runs;146432 belief cells rederived/2288 expressions checked.
36 source bindings; eight new backing resources. Stored prefixes are not fresh replay.
Source REV305:11350 assigned /23 unassigned;198180 narrative /212699 backing;
2782 backing resources. Original sources unchanged; no new runtime execution.
Next: failed biological exploration/public plan lineage, remaining formal sources and final adequacy.
Recheck earlier gaps against expanded backing index; dependent claims/post-cutoff joins remain open.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
