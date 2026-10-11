from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev198/check.json');assert c['assignedSources']==10733
cp=P/'CAMPAIGN3_HISTORY_TEST_RECEIPTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical test receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

214 remaining census Vitest exports reconciled as historical execution receipts:
51,136 exact original narrative occurrences and79,274 complete string leaves,
including short statuses and empty diagnostics. Every source matches its original
census digest. All assertion counters agree with the actual assertion arrays.
The original exports retain exact numeric durations, timestamps and snapshot data.
Hashing does not attest the historical time of execution.

31 failed reports retain129 failed assertions and full stacks. The18,735 passing
assertion occurrences repeat suites across receipts; this is neither a distinct-test
denominator nor fresh current coverage. Test labels express intent, not independent
proof of the labeled psychological proposition. These exports have no executable
source fingerprint manifest of their own. Context reviews explain bounded findings
without retroactively attributing every receipt to current source bytes.

ATTENTION_CONCERN_RETAINED_COMPONENT_TESTS_REV1 says success=true with zero tests.
It supplies no positive test evidence. REASON_REPLAY_RETRY_REV1 lists21 assertions
but only one passed and20 were skipped. Together with the earlier66 passes and one
timeout, it supports the already documented composite validation; it is not21 passes
or a single67-test rerun. There are164 reports whose reported suite count differs
from their result-file array length. Both values remain separately recorded.

Actual agency observer-ID leakage and association matrix-order defects remain
distinct from fixture errors, correct admission rejections and timeouts. Preserved
fixture findings include malformed seeds, invalid thresholds, wrong tie extraction,
noncanonical provenance, absent rational denominators and save attempts after failed
runs. The LEARN rounded expectation was wrong by one millionth; its production
ties-to-even result was correct. None authorizes weakening validators or deleting
failed cohorts. Different EMB1104/1072 scopes and targeted retries are not silently
treated as identical whole-suite reruns. Context reviews own the narrower correction
claims; these receipts do not broaden them.

No runtime,test,mutant,build or historical writer was rerun. No model,law,allocation,
verdict,corpus or obligation status changed. SourceREV198:10,733 assigned/640
unassigned;184,073 narrative/211,639 backing;1,192 indexed archives. Role assignment
is not claim adequacy. Open exact identities remain two composition,two Values,
seven cognitive,80 exit-inventory and one scheduler groups, with formula provenance,
legacy log,remaining material support and independent adequacy still owed.

Next: remaining material support and post-cutoff delta joins, then independent
adequacy under HQ011. HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;
108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-test-receipts-rev1','campaign3-history-source-roles-rev198'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:214 historical test receipts reconciled.
Start CAMPAIGN3_HISTORY_TEST_RECEIPTS_CHECKPOINT.md.
51136 original narrative occurrences;31 failed cohorts preserved.
Zero-test success excluded;targeted retry1pass/20skipped;counts not additive coverage.
SourceREV198:10733 assigned/640 unassigned;184073 narrative/211639 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
