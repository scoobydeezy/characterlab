"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-lying-display-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==902
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_LYING_DISPLAY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Lying and display chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines2882–3045,are reconciled against lying and emotional-display
qualifications.33 occurrences join869 reviewed:902 reviewed /594 pending.
Exact identities,text and locations remain. REV313 stays11372 assigned /1 unassigned;
199699 narrative /212699 backing;2804 resources. Whole-log role stays open.

Deliberate contrary assertion follows acquired belief and communicative purpose;
it can accidentally match truth. Unknown content is not a lie. Intended belief
target,physical delivery and actual recipient learning remain distinct. Bounded
resistance to a received assertion does not establish general persuasion theory.

Private affect,chosen semantic assertion and unchosen display remain independent.
A reassurance/cue conflict does not prove deception or guilt. The original calm
intervention also altered control evidence; the corrected fixture isolates current
risk and checks reassurance throughout. Neither fixture correction nor helper/timeouts
changed the runtime or model law. Four material distinctions retain owners,blocked
claims and reopen conditions. Running historical workers are not current live handles.

No runtime suite or original writer rerun. Next chronology before line2882,then
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
route='''HQ-011 IN PROGRESS: lying-display chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_LYING_DISPLAY_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;902 reconciled/594 pending.
Belief-relative lying,separate display channels and causal fixture correction retain scope.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line2882,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
