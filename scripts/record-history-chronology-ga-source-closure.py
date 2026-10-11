"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-ga-source-closure-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==1496
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_GA_SOURCE_CLOSURE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# GA source chronology and complete occurrence coverage — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Eight frozen ranges, lines1–157, complete review of the source/owner progression and
historical preface.33 occurrences join1463 reviewed:1496 reviewed /0 pending. The
union of reviewed IDs equals the original occurrence inventory exactly, without
duplicates. Exact text, source hashes and locations remain. This completes chronology
coverage, not whole-source authority assignment or independent scientific adequacy.
REV313 stays11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 resources. The frozen log remains unchanged.

Later bounded perception owners use last windows and actual SEM state while source
admission owns replay limits. Earlier full-sweep reconstruction remains a scoped
component comparator rather than a permanent cognitive archive requirement. Actual
consumed memory and observed panel companions replace supplied credit and stage labels;
focal timing and nondiscriminating controls remain explicit.

The historical1827-test receipt included reference files despite its active-source
label. Later1679 and119 receipts have different source coverage and are not additive.
Graph key/matrix reindexing, experience reservation ordering, codec composition and
fixture failures retain correct-forward evidence. Prior concern remains lawful input;
future consequences cannot rewrite earlier encoding. Seven distinctions retain owners,
blocked claims and reopen conditions. No law or reduction selected.

No runtime suite or original writer rerun. Next: consolidate chronology/source-role
dispositions and source gaps, reconcile post-cutoff joins, then independently assess
universe and scientific adequacy. HQ-012 unstarted;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 producers/58 factories;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=json.loads(rpath.read_text(encoding='utf-8-sig'))
obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for p in sorted(O.glob('*.json'))]+[cp.as_posix()]
for p in paths:
    assert p not in existing
    r['reportReviews'].append(dict(path=p,obligations=obs))
    for o in r['obligations']:
        if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: ga-source-closure chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_GA_SOURCE_CLOSURE_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;1496 reconciled/0 pending.
Exact full occurrence coverage; source-role and scientific adequacy gates remain open.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Complete occurrence coverage does not itself assign the whole-source role.
Next chronology/source-role consolidation,gap refresh,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
