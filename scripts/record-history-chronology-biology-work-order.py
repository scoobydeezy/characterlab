"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-biology-work-order-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==654
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_BIOLOGY_WORK_ORDER_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Biological work-order and component chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Three frozen entries,lines4140–4263,are reconciled against costly-reward evidence,
owner biological work order,continuous qualification,domain findings and18-behavior
coverage,with public admission as a later scoped successor.22 occurrences join632:
654 reviewed /842 pending. Exact identities,text and locations remain. REV313 stays
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.
Whole-log source assignment remains open.

Costly-reward feedback changes some trajectories without universally reducing harm.
Primary repetition does not prove history-based access necessity; BeliefAccess remains.
NoActiveReasons is not chosen withholding. The prior audit documentation reconstruction
has no independent pre-overwrite digest; frozen scientific artifacts were unaffected.
Preserve that provenance limitation rather than implying independently proven recovery.

Owner direction changes sequence and requires a continuous integrated behavior set.
The resulting18 behaviors are executable witnesses,not all biology or all cognitive
profiles jointly qualified.25 models/53 distinct runs/2389 distinct prefixes differ
from54 execution rows/2438 checks because one constitutional-pair case is reused.
Causal construction failures remain preserved: current kinetics,action consequences,
consequence sensing,adaptation and delayed appraisal feedback have distinct ordering.
Domain distinctions do not establish irreducible stored axes or clinical calibration.
Four material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line4140,then
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
route='''HQ-011 IN PROGRESS: biological work-order/component chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_BIOLOGY_WORK_ORDER_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;654 reconciled/842 pending.
Behavior denominator,causal failures,nonmonotonic feedback and reconstruction limits preserved.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line4140,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
