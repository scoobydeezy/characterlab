"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-intoxication-reappraisal-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==461
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_INTOXICATION_REAPPRAISAL_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Intoxication and chosen-reappraisal chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Six frozen entries,lines5192–5418,are reconciled against intoxication qualification
and findings plus chosen-reappraisal component/native qualification and findings.
48 occurrences join413 reviewed:461 reviewed /1035 pending. Exact original identities,
text and locations remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /
212699 backing;2804 resources. Whole-log source assignment remains open.

Control and execution recover separately under the same constitutional perturbation.
Recovered function is not complete bodily clearance. Strict biological execution and
inclusive inhibition thresholds retain their exact contracts; the SKILL comparator
is not silently substituted. Known biased zero differs from unknown. Whole observer
masking must account for downstream sensations changed by actual action outcomes.
Original nonzero biography remains fixed in learning-disabled probes,without claiming
immunity to later lawful learning. Selected prefixes do not become exhaustive coverage.

A regulation goal differs from a fixed threat concern. Knowing a frame does not imply
helpfulness; choice,attempt,completion,frame installation and later affect remain
separate. Relief is not evidence or physical protection. Component transaction replay
and later native authority/Save132 evidence remain separate even where counts match.
Historical worker routing is not live execution. First passing component tests and
later native helper failure are preserved without inventing a failed component cohort.
Three material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line5192,then
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
route='''HQ-011 IN PROGRESS: intoxication/chosen-reappraisal chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_INTOXICATION_REAPPRAISAL_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;461 reconciled/1035 pending.
Control/execution recovery and conditional framing/evidence remain distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line5192,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
