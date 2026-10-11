"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-agency-intake-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==1024
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_AGENCY_INTAKE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Agency intake chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Three frozen entries,lines2299–2430,are reconciled against frontier intake,source kernel
and corrected agency qualification.29 occurrences join995 reviewed:1024 reviewed /
472 pending. Exact identities,text and locations remain. REV313 stays11372 assigned /
1 unassigned;199699 narrative /212699 backing;2804 resources. Whole-log role stays open.

Risk ordering preserves every clause but supplies no qualification. The pure source
kernel receives a supplied frozen intent; eight boundary tests do not establish actual
generated choice or public admission. Its provisional next-step intent/expression80
and attempt90 prose does not override final agency0.3 intent70/expression80/plan90/
attempt100/execution110. Actual producer traces and corrected contract govern.

The first passing matrix missed later nonrecipient occurrence leakage. The correction
snapshot and appended0.2 completion remain superseded by final0.3 phase qualification.
Neither no received content nor an earlier passing matrix proves complete later privacy.
Four material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line2299,then
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
route='''HQ-011 IN PROGRESS: agency-intake chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_AGENCY_INTAKE_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;1024 reconciled/472 pending.
Risk routing,source-only tests and superseded phase/provenance claims retain scope.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line2299,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
