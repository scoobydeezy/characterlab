"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-embarrassment-bridge-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==413
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_EMBARRASSMENT_BRIDGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Embarrassment and defining-memory bridge chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Five frozen entries,lines5419–5605,are reconciled against chosen-reappraisal and
embarrassment public qualifications,embarrassment component evidence and the defining
bridge with its meaning/public successors.38 original occurrences join375 reviewed:
413 reviewed /1083 pending. Source-role REV313 remains11372 assigned /1 unassigned;
199699 narrative /212699 backing;2804 resources. Whole-log assignment remains open.

Embarrassment,competing participation goals,attempted withdrawal,actual physical
presence and display remain separate. Failed withdrawal is not chosen participation.
The coarse phenotype alone did not discriminate affect influence; fine calibration
and matched controls supply that bounded evidence without retiring CoarseUnit.
Known zero,missing judgment and hidden truth remain distinct.

Native implementation headings do not turn repeated component counts into native
runs. Rejected phase115 failed before the intended fault points; accepted0.2 uses
parent-ordered completion/display110 and actual reached rollback. The frozen copied
frame wording is an erratum,not an embarrassment frame owner. Reappraisal framing
is not physical protection or a general planning claim.

The defining bridge separates retention from selection: capacity8 preserves the old
episode without recalling it. SignificanceFirst earns bounded usefulness at capacity1;
idle clocks do not establish active long-horizon behavior. Later meaning and public
successors close named gaps while retaining carried-cue and scheduled-baseline limits.
Three material distinctions retain owners,blocked claims and reopen conditions.

No runtime suite or original writer rerun. Next chronology before line5419,then
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
route='''HQ-011 IN PROGRESS: embarrassment/defining-bridge chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_EMBARRASSMENT_BRIDGE_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;413 reconciled/1083 pending.
Affect,intent,presence,display and retained-versus-selected memory remain distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line5419,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
