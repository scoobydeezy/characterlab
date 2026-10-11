"""Record partial log review; do not promote a whole-source disposition."""
from pathlib import Path
import json

P=Path('docs/planning')
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_PREPARATION_CHECKPOINT.md'
assert not cp.exists()
cp.write_text('''# Historical chronology review started — 2026-10-11

**LOCAL DISPOSITION — continue HQ-011; no owner ruling. Counters1519 /0.**

The completed ADAPT review passed research checks, all ten bookkeeping fault checks,
and36,280 preservation hash bindings. Source-role REV313 remains unchanged:
11,372 assigned /1 unassigned;199,699 narrative /212,699 backing occurrences;
2,804 outside-census resources. The remaining source is the frozen campaign log.

The manifest's445,946-byte log snapshot contains1,496 original occurrences across
165 top-level sections. A review-candidate index preserves every original identity,
text and location.215 occurrences match paragraphs elsewhere after newline-only
normalization;611 contain filename candidates. These counts confer no acceptance.
The unresolved token list includes range/fragment notation and the deliberately
nonselecting research registry, so it is not a missing-artifact verdict.

The final three entries,lines7520–7626,are reviewed against their exact qualifications,
bookkeeping findings and exit-readiness authority:19 occurrences,1,477 still pending.
Personal loss remains a component witness with controlled adoption and masked later
outcomes; the corrected index is not another480-run cohort. Regulatory reduction
preserves body-only failure alongside ScalarThreat success and prior scalar retrieval
equality. General psychological vector necessity remains unearned. The later132
bounded clauses do not grant campaign exit or unrelated native admission.

The false stale-count formatting failure and verbatim-log whitespace limitation remain
separate nonbehavioral findings. No runtime or original writer was rerun; no scientific
source or original chronology bytes changed. The whole log remains unassigned.

Next: review remaining chronology against scoped source authorities, then consolidate
unresolved historical bindings, post-cutoff joins and independent scientific adequacy.
HQ-012 stays unstarted until HQ-011 closure is earned. Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 producers/58 factories;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No new qualification or allocation.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json'
r=json.loads(rpath.read_text(encoding='utf-8-sig'))
obs=['RO-C3-019','RO-C3-020','RO-C3-021']
paths=[p.as_posix() for d in ['campaign3-history-chronology-candidates-rev1','campaign3-history-chronology-tail-rev1'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
existing={x['path'] for x in r['reportReviews']}
for p in paths:
    assert p not in existing
    r['reportReviews'].append(dict(path=p,obligations=obs))
    for o in r['obligations']:
        if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: chronology inventory and final three dated entries reviewed.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_PREPARATION_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;19 reconciled/1477 pending.
Body-only reduction failure preserves psychological scalar successes; no exit inference.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next remaining chronology,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
