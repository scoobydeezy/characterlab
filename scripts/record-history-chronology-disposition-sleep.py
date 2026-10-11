"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-disposition-sleep-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==502
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_DISPOSITION_SLEEP_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Disposition and sleep/control chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Five frozen entries,lines4985–5191,are reconciled against disposition component/native
qualifications and findings plus sleep/control qualification and findings.41 original
occurrences join461 reviewed:502 reviewed /994 pending. Exact original identities,
text and locations remain. REV313 stays11372 assigned /1 unassigned;199699 narrative /
212699 backing;2804 resources. Whole-log source assignment remains open.

Constitution,plastic adaptation,standing and original qualified biography remain
separate. Refold relies on retained original history; JointMax equality and JointAdd
amplification do not establish two independently necessary effects or general fusion.
Rejected unexecuted planREV1 confused equal numeric biography with equal causal traces.
Native typed lineage does not grant represented self-knowledge or testimony access.
Experiment/comparison identity packaging occurred during execution against the frozen
roster; preserve that timing for independent final method adequacy.

The rejected sleep fixture had empty identity and confounded training with sleep relief.
Corrected acquisition earns nonzero identity and known zero sleep relief before the
intervention. Later sleep changes control/access without rewriting prior expressions.
Learning-disabled probes do not prove immunity to future learning. Unknown and biased
zero remain distinct; maintained support differs from adoption.52 selected prefixes
are not exhaustive coverage. Historical worker routing does not imply current liveness.
Four material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line4985,then
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
route='''HQ-011 IN PROGRESS: disposition/sleep-control chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_DISPOSITION_SLEEP_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;502 reconciled/994 pending.
Plastic/standing lineage,identity packaging timing and rejected sleep fixture preserved.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line4985,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
