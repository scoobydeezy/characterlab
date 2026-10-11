"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-defining-public-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==333
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_DEFINING_PUBLIC_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Defining-memory public chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Five frozen entries from line5838 through the spanning next-audit header6042–6043
are reconciled against exact rehearsal,internal-native,public-implementation and
public-qualification authorities.34 occurrences join299 reviewed:333 reviewed /
1163 pending. Original text,locations and identities remain. Source-role REV313 stays
11372 assigned /1 unassigned;199699 narrative /212699 backing;2804 resources.
Whole log assignment remains open.

The68 owner continuations,68 internal native programs,376 selected stages,three
focused public restores and full1680-prefix public matrix have distinct proof scopes.
Actual public restore replays original empty S0 and inputs; it does not inject saved
learned state. Final native presentation settlement explicitly extends the component's
omission. Retaining an important event does not guarantee it is selected.

Public qualification preserves one successor per prefix,with a separate focused
continuation39→4000. Its comparison identity was derived from the frozen manifest
and actual baseline identities,not a separate pre-execution packet. Final research
adequacy must assess that actual chronology; this review does not rewrite it.

Carried query,rehearsal opportunities,empty graph,scheduled current baseline and
worldAfter diagnostics remain controls. They do not qualify fresh perception,learned
rehearsal intent,new physical-world dissociation,general ageing or autobiographical
identity. All retention candidates and development failures remain. Archived running
instructions are superseded by completed receipts,not evidence of live jobs now.

Four material distinctions retain owners,blocked claims and reopen conditions.
No runtime suite or original writer rerun. Next: chronology before line5838,then
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
route='''HQ-011 IN PROGRESS: defining-memory public chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_DEFINING_PUBLIC_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;333 reconciled/1163 pending.
Keep owner/internal/public evidence and actual comparison-identity chronology distinct.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line5838,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
