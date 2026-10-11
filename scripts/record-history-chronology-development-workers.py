"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-development-workers-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==265
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_DEVELOPMENT_WORKERS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Development worker chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines6248–6466,are reconciled against exact harness findings,
operational memory receipts,implementation scope and later native qualification.
37 occurrences join228 reviewed:265 reviewed /1231 pending. Original identities,
text and locations remain. Whole log assignment stays open; source REV313 remains
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.

REV2 changed the final trusted-trace reader,not public/input/state validation or actual
Save132 replay. REV3 disabled batch filesystem watching. The3.209-second probe measures
startup,not full matrix throughput.94 REV1 restores and99 REV2 receipts overlap:
113 unique predecessor prefixes were preserved and reexecuted within the final668.
They are not193 distinct cases or extra cases beyond final qualification.

The173-prefix operational stop preceded the1536MB cap; eight later allocation failures
left280 successful prefixes and four completed programs. Some tool stack output was
truncated; summary and separately captured parts remain distinct evidence. Four4096MB
workers subsequently queued the same12 partitions. Recovery resolves matrix execution
status without proving low-memory or long-horizon scalability. Production/model identities
and failed receipts remain unchanged. Archived sessions are not current live jobs.

Three material distinctions retain owners,blocked claims and reopen conditions.
No runtime suite,original writer or old worker was rerun. Next: chronology before
line6248,then consolidated gaps,post-cutoff joins and independent adequacy. HQ-012
unstarted. Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 producers/
58 factories;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
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
route='''HQ-011 IN PROGRESS: development worker chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_DEVELOPMENT_WORKERS_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;265 reconciled/1231 pending.
Preserve overlapping restore lineage,operational failures and historical session scope.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line6248,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
