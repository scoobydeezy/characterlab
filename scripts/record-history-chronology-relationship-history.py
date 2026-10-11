"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-relationship-history-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==787
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_RELATIONSHIP_HISTORY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Relationship history chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines3459–3589,are reconciled against reliance,familiarity/valence,
attachment and betrayal qualifications.26 occurrences join761 reviewed:787 reviewed /
709 pending. Exact identities,text and locations remain. REV313 stays11372 assigned /
1 unassigned;199699 narrative /212699 backing;2804 resources. Whole-log role stays open.

Reliance estimates can share consumer outputs despite unknown or mixed evidence.
Fresh replay/new tests and inherited authority receipts retain separate scope. Familiar
appearance does not establish identity or positive valence; projection independence
is not raw-record equality. Whole privacy comparisons retain exact byte equality.

Perceived meaningful dependence differs from matched benefit and present practical
utility. Derived Bond is a candidate,not an authored universal attachment primitive.
Its source is controlled evidence,not enacted caregiving. Later incident explanation
can remove betrayal without rewriting historical failure or restoring cooperation.
Observer-admission chronology is not privileged verification of real promise timing.
All four profiles' prospective distributions remain distinct from enacted interaction.
Four material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line3459,then
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
route='''HQ-011 IN PROGRESS: relationship-history chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_RELATIONSHIP_HISTORY_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;787 reconciled/709 pending.
Reliance,familiarity,perceived dependence and incident attribution retain distinct scope.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line3459,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
