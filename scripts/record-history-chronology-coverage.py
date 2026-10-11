"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-coverage-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==176
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_COVERAGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Chronological coverage audit claims — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Six frozen entries,lines6659–6869,are reconciled against exact audit authorities
and their later scoped qualification successors.42 occurrences join134 previously
reviewed:176 reviewed /1320 pending. Source-role REV313 remains unchanged:
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.
The whole log remains unassigned. Original source text,locations and identities stand.

Memory consolidation's episode/category distinction prevents crediting recall as new
summary evidence in the declared profile; it is not general correlated-evidence fusion.
Repeated prediction residuals are readouts of existing expectation/admitted outcomes,
not new surprise state or a replacement learning law. Evidence support remains distinct
from calibrated accuracy. Positive threat with chosen obligation continuation is the
bounded fear-without-flight interpretation; literal locomotor flight and clinical fear
remain unqualified. Scalar successes survive later body-only reduction failure.

Separate identity channels did not establish cross-context transfer; entered pressure
did not enact coercion; testimony about one event did not teach cross-episode expectation.
The later distinct successors resolve those specific missing witnesses without pooling
actors or granting native admission. Likewise,scheduled LONG opportunities were not
character routines,instructions not adopted goals,and episode expiry not personal loss.
Later joined goal/routine/habit/loss components earn their declared integration scopes.

Importance and urgency remain independently meaningful even when current reason
strengths match. RefoldImportance preserves the tested behavior from complete history
without a cached importance cell; that does not erase the semantic distinction or prove
history compression. All five models and seed0 stochastic equality remain preserved.

These coverage audits reused evidence; this reconciliation adds no runtime,test/build
or original-writer execution. Five material distinctions retain owners,blocked claims
and reopening conditions. No law,comparator or obligation is retired. All20 partials
audited was a historical review milestone,not campaign exit; the work order permits
bounded reordering and does not require a single giant runtime.

Next: chronology before line6659,then consolidated gaps,post-cutoff joins and independent
adequacy. HQ-012 unstarted. Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55 producers/58 factories;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=json.loads(rpath.read_text(encoding='utf-8-sig'))
obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
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
route='''HQ-011 IN PROGRESS: six coverage-audit chronology entries reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_COVERAGE_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;176 reconciled/1320 pending.
Audit-only closures and later scoped experiments remain separate; preserve reduction limits.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line6659,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
