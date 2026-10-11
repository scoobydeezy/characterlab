"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-grief-control-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==761
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_GRIEF_CONTROL_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Grief,performance,rumination and fatigue chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines3590–3726,are reconciled against grief,performance,rumination
and fatigue qualifications.27 occurrences join734 reviewed:761 reviewed /735 pending.
Exact identities,text and locations remain. REV313 stays11372 assigned /1 unassigned;
199699 narrative /212699 backing;2804 resources. Whole-log assignment remains open.

Believed enduring loss,current absence and practical utility remain separate. Grief
response distributions are prospective,not enacted mourning or a general time course.
Performance feedback produces actual route switching without identifying the cause
of failure. Success after switching does not establish better efficacy when the
apparatus simultaneously removes the blocker. Visit-local counting prevents stale
failures from being treated as new evidence.

Recurrent access consumes cognition without adding evidence. External load can mimic
its immediate cost; experienced fatigue can impair inhibition without occupying a
slot. Motor failure is another distinct path and can lawfully alter later sensed
outcomes. Stale or false experience remains separate from physical condition.
Rumination's duplicate labels yield22 unique runs/198 prefixes,not23/207 unique
coverage; its bound contract governs over the stale scope caption. Four material
distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line3590,then
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
route='''HQ-011 IN PROGRESS: grief/performance/rumination/fatigue chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_GRIEF_CONTROL_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;761 reconciled/735 pending.
Loss belief,feedback switching,recurrent load and experienced impairment remain distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line3590,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
