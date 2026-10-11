"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-identity-admission-belief-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==584
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_IDENTITY_ADMISSION_BELIEF_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Identity admission and represented-belief chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Five frozen entries,lines4526–4717,are reconciled against native identity admission,
represented-belief component qualification and findings,with later native belief and
wrapper qualification as scoped successors.30 original occurrences join554 reviewed:
584 reviewed /912 pending. Exact identities,text and locations remain. REV313 stays
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.
Whole-log source assignment remains open.

Task and biological identity channels retain separate meaning and actor histories.
Biological pressure or success alone is not identity evidence. Coarse unit1 was
structurally inert; explicit fine calibration changes probabilities in3/8 seeds while
all8 sampled sequences remain equal. Receiving influence is not source eligibility
or demonstrated sampled-action divergence. Tested Task5/Biological12 does not qualify
admitted64-instant scaling. Later wrapper repair addresses serial-publication limits.

Represented self/observer belief consumes each holder's admitted evidence and can be
unknown while standing remains present. Positive persistence after a contrary act
changes the estimate and retains that act; it does not ignore evidence. Equal means
can conceal different retained histories. Unknown,known0 and sample count remain
separate from neutral truth or calibrated confidence. No extra source-choice bonus.

The first component cohort passed37/222 despite a separate validation-timeout receipt.
Changing identity-bearing test/harness limits required a preserved successor refreeze
and full rerun.74 executions do not expand37-case behavioral coverage. Later native
appraisal needs explicit prior140 timing. Three material distinctions retain owners,
blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line4526,then
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
route='''HQ-011 IN PROGRESS: identity-admission/represented-belief chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_IDENTITY_ADMISSION_BELIEF_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;584 reconciled/912 pending.
Eligibility,receiving influence,holder evidence and validation cohorts remain distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line4526,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
