"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-habit-reinforcement-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==706
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_HABIT_REINFORCEMENT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Habit acquisition,resistance,substitution and reinforcement chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines3867–4002,are reconciled against habit resistance/acquisition,
substitution and reinforcement qualification/findings.27 occurrences join679 reviewed:
706 reviewed /790 pending. Exact identities,text and locations remain. REV313 stays
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.
Whole-log source assignment remains open.

Habit audits replayed existing evidence and corrected coverage omissions. Corroborating
FATIGUE/HABIT receipts and original validation were not all freshly executed. The legacy
HABIT plan lacked explicit row RunIdentity fields; derived runtime identities cannot
be retroactively inserted into its commitments. Suppression preserves acquired history;
retirement,maintenance loss and motor failure remain different explanations.

Substitution uses one shared instructed task and equal prior success totals. Learned
expectation alone explains primary alternative use; after zero correction,different
candidate histories yield no action under NoActiveReasons. That is not chosen idle
or replacement of HABIT neutral choice. Preserve both failed adapter/domain cohorts.
Reinforcement breaks through withheld admitted outcomes while physical delivery remains.
That intervention changes expectation and history; it does not isolate habit strength.
Six sequence divergences and two equalities do not prove monotonic frequency or rising
objective reward. Three material distinctions retain owners,blocked claims and reopen.

No runtime suite or original writer rerun. Next chronology before line3867,then
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
route='''HQ-011 IN PROGRESS: habit acquisition/resistance/substitution/reinforcement chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_HABIT_REINFORCEMENT_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;706 reconciled/790 pending.
Legacy replay,neutral choice,candidate access and expectation-mediated feedback preserved.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line3867,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
