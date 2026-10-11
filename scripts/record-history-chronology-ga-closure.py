"""Record partial chronology progress without promoting the whole source."""
from pathlib import Path
import json

P=Path('docs/planning');O=P/'campaign3-history-chronology-ga-closure-rev1'
c=json.loads((O/'check.json').read_text(encoding='utf-8'))
assert c['cumulativeReviewed']==1310
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_GA_CLOSURE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# General Attention closure chronology — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Four frozen entries,lines963–1094,are reconciled against bounded GA qualification
and corpus promotion.22 occurrences join1288 reviewed:1310 reviewed /186 pending.
Exact identities,text and locations remain. REV313 stays11372 assigned /1 unassigned;
199699 narrative /212699 backing;2804 resources. Whole-log role stays open.

GA closed its seven bounded obligations with43 public models/36 comparisons. Ten
reexecutions and two complete-prefix restores with five successors each preserve
their finite scope. Internal rollback hooks are not public fault inputs. The derived
92-invocation bound is distinct from observed maximum21 and earlier local estimate80.

Stable focal encoding can coexist with changed recall scores; equal winners do not
erase association or access differences. Three protection policies retain identical
memory on the finite credit fixture, leaving significance-first necessity unresolved.
TaskConcern qualifies the transient feedback seam without selecting general Affect.

Rejected images and the failed mixed-module regression remain historical failures.
Later stable-suite passage does not rewrite them. Corpus0.29 promotion preserves the
actual runs'0.28 identities. Three absent verdict entries were honestly recorded on
September20, correcting the earlier claim without backdating. Six material distinctions
retain owners,blocked claims and reopen conditions. No new law or reduction selected.

No runtime suite or original writer rerun. Next chronology before line963,then
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
route='''HQ-011 IN PROGRESS: ga-closure chronology reconciled.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_GA_CLOSURE_CHECKPOINT.md.
Frozen log1496 occurrences/165 sections;1310 reconciled/186 pending.
Bounded GA,retention equalities,promotion identity and ledger correction preserved.
Source REV313 unchanged:11372 assigned /1 unassigned;199699 narrative /212699 backing;
2804 backing resources. Partial log review does not assign its whole-source role.
Next chronology before line963,consolidated gaps,post-cutoff joins and independent adequacy.
HQ-012 unstarted. Campaign3 NOT EXIT-READY. No runtime suite rerun.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
