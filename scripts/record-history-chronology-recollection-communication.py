"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-recollection-communication-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==929
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_RECOLLECTION_COMMUNICATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Recollection, familiarity and communication chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Three frozen entries,lines2746–2881,are reconciled against recollection,familiarity
and communication qualifications.27 occurrences join902 reviewed:929 reviewed /
567 pending. Exact identities,text and locations remain. REV313 stays11372 assigned /
1 unassigned;199699 narrative /212699 backing;2804 resources. Whole-log role stays open.

Tagged reconstruction does not restore lost observations or turn queries into evidence.
Surviving feature signatures support familiarity without identifying an individual;
similarity,coverage and peripheral detail retain independent meaning. Neither profile
qualifies general recognition,calibrated confidence or downstream action.

Chosen disclosure remains separate from delivery and recipient learning. Honest false
belief is not deliberate lying; silence supplies no Boolean sample. The interrupted
serial4-run/20-prefix cohort is preserved separately from the completed27-run/130-prefix
successor. Recollection runtime passage likewise does not erase its readonly build
failure; corrected source repeated the matrix with unchanged model identities.
Four material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line2746,then
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
route='''HQ-011 IN PROGRESS: recollection-communication chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_RECOLLECTION_COMMUNICATION_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;929 reconciled/567 pending.
Reconstructed detail,feature familiarity and chosen communication retain distinct scope.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line2746,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
