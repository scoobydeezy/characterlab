from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev304/check.json');assert c['assignedSources']==11347
cp=P/'CAMPAIGN3_HISTORY_BIOLOGY_CONSTITUTION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Biological constitutional comparison — 2026-10-11

**LOCAL DISPOSITION — isolated stored comparison verified.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

The two48-frame configurations differ only in reward tolerance acquisition gain250
versus125. Initial body, frames, goals and all other configuration agree. Gain250
exactly reuses Full/main/seed7, including model/run identity, complete final snapshot
and all49 prefix hashes. Gain125 adds one model/run. Thus98 recorded checks add49
new distinct tuples; combined main/pair identities total25 models and53 runs.

First complete sensory/cognitive row and first eight instructed intents agree.
Hidden first tolerance is150 versus75; next sensed reward is910 versus940 and
pleasure500 versus540. The isolated contrast supports constitutional acquisition
under the admitted-practice setup, not spontaneous exploration, personality change,
clearance differences, clinical calibration or a universal dopamine law.

The original main-plan, historical harness and pair-plan commitments match. The
FROZEN BEFORE QUALIFICATION label remains a historical chronology claim; byte equality
alone does not prove timing. Stored prefix hashes do not reconstruct complete saves
or constitute fresh restores. No original writer, runtime, test suite or source changed.
Main trajectories, rejected exploration and native public admission remain separate
review scopes; this pair does not silently qualify their full dependencies.

Two source roles preserve one original narrative occurrence and all2,659 string
leaves. One existing exact harness joins the backing index; no source gap.
REV304:11,347 assigned /26 unassigned;198,178 narrative /212,699 backing;
2,774 backing resources. Remaining source support, dependent claims, post-cutoff joins
and independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-009','RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-biology-constitution-rev1','campaign3-history-source-roles-rev304'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: biological constitutional comparison reconciled.
Start CAMPAIGN3_HISTORY_BIOLOGY_CONSTITUTION_CHECKPOINT.md.
Only gain250/125 differs; first sensory row/eight instructed intents match, later effects diverge.
One exact reused run/one new run;98 recorded checks/49 new distinct prefixes.
Three source hashes match; source REV304:11347 assigned /26 unassigned;
198178 narrative /212699 backing;2774 backing resources. No runtime replay.
Next: remaining biology/formal sources, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Recheck earlier gaps against expanded backing index. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
