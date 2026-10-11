from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev253/check.json');assert c['assignedSources']==11112
cp=P/'CAMPAIGN3_HISTORY_BODY_ATTENTION_DECISIONS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical body attention decisions — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Twelve sources preserve126 exact original narrative occurrences. Five paired decisions
and supplied planning resolutions settle historical choices without new owner questions:
separate body acquisition, signal-per-opportunity units, synthetic three-local-reserve
sources, direct signal/acquisition-recency recall and independent current cue admission.

Those are separate commitments. Multiple views of one signal share a slot but preserve
their exact contradictory/censored evidence; grouping is not averaging or integration.
Same-time distinct sensing opportunities do not merge. Three physical reserve fixtures
are not three universal Need meters or canonical physiology. Sample-counting acquisition,
shared resources and distinct sensory responses over one reserve remain comparators.

A current authenticated cue can recall old memory when new acquisition capacity is zero.
Permission alone cannot produce evidence. Recency recall must retain older eligible
acquisitions that lose slots; otherwise retention would make the ranking proof tautological.
A cue for alpha can return surviving co-acquired beta without asserting beta present now.
Presentation-history accessibility remains a different body-recall law, requiring its own
use authentication; it is not discharged by acquired retention protection.

The two component checkpoints preserve14 tests/5 faults and13 tests/5 faults in their
respective scopes. Retained numeric-zero bytes do not prove a public numeric-zero cue,
and a supplied version string does not authenticate source completion. Later source,
branch and registration work supplies the path toward bounded GA qualification. Earlier
rulings and components are not retroactively relabeled as public runtime proofs. The
whole bounded GA verdict does not canonize independent human attention resources.

Source REV253:11,112 assigned /261 unassigned;191,998 narrative /212,202 backing;
1,292 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-body-attention-decisions-rev1','campaign3-history-source-roles-rev253'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: body attention decisions and resolutions reconciled.
Start CAMPAIGN3_HISTORY_BODY_ATTENTION_DECISIONS_CHECKPOINT.md.
Twelve sources;126 original narrative occurrences. Separate acquisition, signal units,
synthetic sources and cue/recall laws retain component/public and comparator boundaries.
Source REV253:11112 assigned /261 unassigned;191998 narrative /212202 backing;
1292 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open;no global deduplication or absence claim.
Next remaining material support,post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
