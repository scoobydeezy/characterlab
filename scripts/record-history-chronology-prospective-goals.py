"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-prospective-goals-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==734
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_PROSPECTIVE_GOALS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Prospective goal chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines3727–3866,are reconciled against procrastination,delayed
benefit,intention forgetting and temporal-goal qualification.28 occurrences join706:
734 reviewed /762 pending. Exact identities,text and locations remain. REV313 stays
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.
Whole-log source assignment remains open.

Postponement retains a positive work reason; missing access/cancellation differ.
Future opening is not sufficient completion capacity. Preserve late-adoption failure
and corrected0.2 admission. Promised benefit,waiting,actual delivery and learned receipt
remain separate; repeated receipt does not add evidence and missing is not known0.
Candidate available/uncertain weights are1 and1/2,not calibrated confidence.

An Open goal may coexist with inaccessible or lost instruction content. Reminder can
recover retained routes but never diagnostic archive bytes. A sole nonmatching memory
can win top-K at zero score; preserve that failed test expectation and the later model
identity correction. Component reexecution does not establish public save authority.
Independent goals retain reasons/progress/lifecycle after contest. DropLoser and
SharedRetirement coincide in the primary failure,so it cannot uniquely diagnose them.
Four material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line3727,then
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
route='''HQ-011 IN PROGRESS: prospective-goal chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_PROSPECTIVE_GOALS_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;734 reconciled/762 pending.
Future capacity,delivery,retained/lost instruction and independent lifecycle remain distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line3727,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
