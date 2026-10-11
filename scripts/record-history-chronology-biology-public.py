"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-biology-public-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==632
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_BIOLOGY_PUBLIC_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Biological public integration chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines4264–4402,are reconciled against biological public qualification,
scope,development findings and external-review disposition,with later wrapper repair
as a scoped successor.25 occurrences join607 reviewed:632 reviewed /864 pending.
Exact identities,text and locations remain. REV313 stays11372 assigned /1 unassigned;
199699 narrative /212699 backing;2804 resources. Whole-log assignment remains open.

The first interrupted cohort was not a behavioral failure or public qualification.
REV2 exposed an actual large-save enumeration failure; REV3 uses a local intrinsic-byte
adapter with legacy helpers preserved. Late intermediate comparison packaging and
final pre-execution packaging retain their different timing. Duplicate row35 completed
but exclusive creation prevented overwrite:59 executions/273 checks do not expand
58 unique runs/270 native prefixes. Those prefixes are not2389 component prefixes.

Matched dependence evidence begins with actual acquired history under controlled
sensor calibration,not synthetic initialization or a claim of unbiased acquisition.
Current withdrawal,consumption-harm belief and anticipated future-abstinence discomfort
remain separate. Forecasting is unqualified. Full cue absence does not prove universal
cue necessity; KnownAccess remains. NoReliefLearning affects both valuation and access,
so it is not a pure valuation ablation. Native expression is not automatic identity.
Four material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line4264,then
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
route='''HQ-011 IN PROGRESS: biological public-integration chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_BIOLOGY_PUBLIC_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;632 reconciled/864 pending.
Large-save/duplicate cohorts,matched acquisition and withdrawal/forecast limits preserved.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line4264,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
