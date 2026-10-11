"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-tolerance-relapse-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==679
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_TOLERANCE_RELAPSE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Tolerance,absence,craving and relapse chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines4003–4139,are reconciled against tolerance,absence,craving
and relapse qualification/findings,with continuous biology as a scoped later successor.
25 occurrences join654 reviewed:679 reviewed /817 pending. Exact identities,text and
locations remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /
212699 backing;2804 resources. Whole-log source assignment remains open.

Accumulating tolerance does not prove attenuated effect until a consumer uses it.
Reserve clipping differs from efficacy. Acquired displacement,current condition and
support produce an absence gap; ordinary shortfall alone is not withdrawal. Physical
challenge diagnostics are not admitted experience. Preserve the wrong-model reference
and unexecuted typing-failure cohort without rewriting original source evidence.

Craving uses admitted body pressure and relief belief,with fixed access/restraint
controls. It does not choose action or establish earned inhibition. Safe-input aliases
legitimately share identities:56 runs/60 comparisons/300 checks/280 distinct prefixes.
No identity salts or discarded aliases repair that pre-freeze counting assumption.
The later CONTROL relapse witness executes a brief return after actual withholding,
with retained and maintained goal; it does not prove physiological recovery,sustained
relapse or learned control. Buffer rejection preceded settlement and was corrected
without relaxing the exact byte boundary or changing original identities.
Three material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line4003,then
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
route='''HQ-011 IN PROGRESS: tolerance/absence/craving/relapse chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_TOLERANCE_RELAPSE_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;679 reconciled/817 pending.
Physical effects,admitted urge,identity aliases and executed transient return remain distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line4003,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
