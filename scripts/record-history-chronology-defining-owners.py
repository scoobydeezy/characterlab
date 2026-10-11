"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-defining-owners-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==375
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_DEFINING_OWNERS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Defining-memory owner chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Six frozen entries,lines5606–5837,are reconciled against component meaning and native
acquisition/input/lifecycle/memory/current-assessment authorities plus final public
qualification.42 occurrences join333 reviewed:375 reviewed /1121 pending. Original
identities,text and locations remain. Source-role REV313 stays11372 assigned /1
unassigned;199699 narrative /212699 backing;2804 resources. Whole log remains open.

Same acquired evidence can earn opposite historical meaning under different goals;
known neutral,missing and overlapping-interval uncertainty remain distinct. Repeated
uncertain intervals do not imply SameDistance. Later current reports cannot rewrite
historical credit or restore lost event content. Actual rehearsal use is not an
arbitrary significance flag. Component stages and owner projections are not native runs.

Native goal adoption37/140,active38,avoids a future write feeding earlier appraisal.
Inherited deadlines100 and final presentation settlement are explicit native additions,
not retroactive changes to component receipts. Successor commitments include actual
S0,calendar,registrations and budget+1. Source cutoff precedes scheduler creation;
no live state/queue splice or acquired-state injection is silently admitted.

Prior attribution37 is reused only while intervening memory stays unchanged. Current
assessment receives a scheduled historical baseline; its survival after retention loss
is not recall. Missing reports cannot be replaced with historical After. Protocol bytes
belong to runtime invariant evidence,not cognitive reads. All failed and pending test
cohorts remain distinguishable from final passing native evidence.

Four material distinctions retain owners,blocked claims and reopen conditions.
No runtime suite or original writer rerun. Next: chronology before line5606,then
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
route='''HQ-011 IN PROGRESS: defining-memory owner chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_DEFINING_OWNERS_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;375 reconciled/1121 pending.
Historical/current meaning,native lifecycle and carried baseline remain distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line5606,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
