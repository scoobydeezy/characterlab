from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev252/check.json');assert c['assignedSources']==11100
cp=P/'CAMPAIGN3_HISTORY_BIOLOGY_INTEGRATION_HISTORY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical biological integration reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Nine sources preserve146 original narrative occurrences and129 JSON string leaves,
including short statuses, paths and hashes. All41 public development source bindings
match their preserved bytes. Thirty-seven existing source copies are newly indexed;
no archive was reconstructed or historical writer rerun.

The early biological contracts preserve assumptions corrected before qualification:
passive kinetics and action consequences must be separated, consequence sensing precedes
new adaptation, and learned pleasure uses admitted positive change instead of residual
pleasure. Acquired neutral target and fixed-baseline pleasure remain separate candidates.
Delayed appraised stress cannot affect its own appraisal or earlier choice.

The functional component reused task-shaped numerical intermediates privately. Native
qualification supplies correctly typed public biological reasons and distinct owners;
it does not classify body pressures as adopted commitments or automatic identity evidence.
Current withdrawal, consumption-harm belief and anticipated future withdrawal remain
separate; the forecast is unqualified. KnownAccess prevents a universal cue-necessity
claim, and NoReliefLearning is not a pure valuation ablation.

The first public cohort was interrupted for serialization cost before a completed replay
row. The second exposed a real long-save admission failure, corrected with an intrinsic
byte adapter and the later contract clarification. Both source cohorts remain distinct
from successful qualification.270 selected native prefixes are not2389 component prefixes;
59 row executions/273 checks include a duplicate and earn only58 runs/270 unique tuples.
The preserved bookkeeping report differs in nonblank text only at its old closureREV1
link, corrected forward toREV2; that is not a new experiment.

The first audit checker incorrectly required raw-byte prefix equality between LF archives
and CRLF/mixed current contracts. Its rejected source and finding are preserved. Corrected
text comparison verifies appended clarifications while raw hashes remain separate. The
dependent extender also stopped on the missing review; no partial index was published.

Source REV252:11,100 assigned /273 unassigned;191,872 narrative /212,202 backing;
1,292 indexed backing resources. No new source gap, runtime/test/build rerun, model, law,
allocation, verdict, corpus or obligation status change. Formula provenance, legacy log,
post-cutoff joins and independent adequacy remain open. HQ012 unstarted; Campaign3
NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-biology-integration-history-rev1','campaign3-history-biology-integration-development-rev1','campaign3-history-source-roles-rev252'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: biological integration and rejected source cohorts reconciled.
Start CAMPAIGN3_HISTORY_BIOLOGY_INTEGRATION_HISTORY_CHECKPOINT.md.
Nine sources;146 original narrative occurrences;129strings;41exact source bindings.
37 existing source copies indexed;rejected line-ending audit checker preserved.
Source REV252:11100 assigned /273 unassigned;191872 narrative /212202 backing;
1292 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open;no global deduplication or absence claim.
Next remaining material support,post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
