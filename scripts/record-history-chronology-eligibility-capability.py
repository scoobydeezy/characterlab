"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-eligibility-capability-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==607
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_ELIGIBILITY_CAPABILITY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Identity eligibility capability correction chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines4403–4525,are reconciled against eligibility qualification
and findings,with native identity admission as a scoped successor.23 original
occurrences join584 reviewed:607 reviewed /889 pending. Exact identities,text and
locations remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /
212699 backing;2804 resources. Whole-log source assignment remains open.

Passing outputs and numerical comparisons did not establish restricted input access.
The first cohort excluded world permission from output but passed full input objects
to decision/qualification. REV2 builds fresh safe context and isolates execution.
Every row/snapshot matches; source-bound identities change. Preserve the old source,
closure/report and checker as superseded authority evidence.104 executions/624 checks
are two52-case cohorts.60 affected tests/build were rerun;328 reference tests reused
unchanged evidence. No fresh reference run or broader behavior coverage is claimed.

Equal probes include balanced evidence and nonzero subthreshold standing; neither is
absence of learning. Work/Home share referents despite actual motive differences.
Controlled refusal pressure is not an enacted coercive interaction. Instruction,
forced movement,failed execution and trivial repetition remain distinct. Full-history
Refold does not qualify compression. Later native source admission has its own scope.
Three material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line4403,then
consolidated gaps,post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/58 factories;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
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
route='''HQ-011 IN PROGRESS: eligibility restricted-capability chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_ELIGIBILITY_CAPABILITY_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;607 reconciled/889 pending.
Passing outputs versus restricted inputs and superseded authority evidence preserved.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line4403,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
