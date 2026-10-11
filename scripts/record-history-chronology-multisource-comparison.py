"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-multisource-comparison-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==1288
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_MULTISOURCE_COMPARISON_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Multisource comparison chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines1095–1239,are reconciled against the numerical comparison,
expressibility audit and obligation-seed authority.28 occurrences join1260 reviewed:
1288 reviewed /208 pending. Exact identities,text and locations remain. REV313 stays
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.
Whole-log role stays open.

Role-blind normalization preserves ground labels but permits an orphan modifier to
weaken a separate motive. Collective overlap differences survive even where calibrated
probabilities agree. The13 synthetic fixtures use actual kernels and exact enumeration;
they do not authenticate public sources. Typed occurrence IDs and independent opaque
labels cannot supply source authority or statistical independence.

The obligation seed covered eight then-current Campaign3 verdicts/eight reports;
fourteen named verdicts was the broader denominator. Zero unowned entries and passing
bookkeeping fault checks did not establish historical scientific completeness. The
original build preceded the final weighted-overlap test addition; production code was
unchanged, but that ordering remains explicit. Five material distinctions retain
owners,blocked claims and reopen conditions. No new law or reduction selected.

No runtime suite or original writer rerun. Next chronology before line1095,then
consolidated gaps,post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
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
route='''HQ-011 IN PROGRESS: multisource-comparison chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_MULTISOURCE_COMPARISON_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;1288 reconciled/208 pending.
Synthetic comparison,orphan influence and limited obligation-seed scope preserved.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line1095,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
