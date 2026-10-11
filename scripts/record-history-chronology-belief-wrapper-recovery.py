"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-belief-wrapper-recovery-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==554
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_BELIEF_WRAPPER_RECOVERY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Identity-belief,wrapper and recovery chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Six frozen entries,lines4718–4984,are reconciled against native identity-belief,
public-wrapper and identity-recovery qualifications and findings.52 original
occurrences join502 reviewed:554 reviewed /942 pending. Exact identities,text and
locations remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /
212699 backing;2804 resources. Whole-log source assignment remains open.

Serial all-prefix success did not prove coherent wrapper publication. Deterministic
microtask probes exposed scheduler/RNG tears that polling missed; embodied instead
had overlapping ingress cleanup. Both failure types and original harness mistakes
remain. Repaired cases repeat prior behavior,not add psychological coverage. Historical
preserved-source checks certify old serial receipts; current repaired behavior has
separate evidence. New wrappers retain the explicit reopening obligation.

Independent holder beliefs consume admitted reports. Native appraisal uses prior140;
component post-update correspondence needs its explicit temporal mapping. Negative
oracle/alias controls do not authorize private access. Short identity recovery differs
across standing,self belief and observers; changed probabilities need not change the
sampled act. Insignificant acts remain history without qualifying as identity evidence.
Known-neutral recovery is not positive recovery or long-horizon adaptation.

RO021 ACTIVE prose was inaccurate; canonical CONDITIONAL status retains its mandatory
unsatisfied exit trigger. Correcting routing changes no obligation disposition.
Four material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line4718,then
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
route='''HQ-011 IN PROGRESS: identity-belief/wrapper/recovery chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_BELIEF_WRAPPER_RECOVERY_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;554 reconciled/942 pending.
Serial/publication evidence,holder appraisal timing and recovery measures remain distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line4718,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
