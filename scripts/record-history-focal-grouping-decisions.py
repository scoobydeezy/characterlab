from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev255/check.json');assert c['assignedSources']==11131
cp=P/'CAMPAIGN3_HISTORY_FOCAL_GROUPING_DECISIONS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical focal grouping and handoff decisions — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Eight sources preserve82 exact original narrative occurrences. The focal episode is
one of four admitted trials, with its candidate committed before consequence. Fifth-
episode transfer remains a separate hypothesis. Focal-last is a fixture arrangement,
not identity or a universal causal ordering rule. Corroborating trials do not all earn
focal credit. Array position and semantic-key equality cannot assign that role.

Grouping is semantic evidence: the same observation multiset can produce different
contrast results under different pairing. Explicit perceived context was selected
locally under the escalation policy, withdrawing the old owner-blocker label. Existing
SEM event-file identity carries context; hidden loops, dispatch ancestry and numeric
ordinals cannot supply meaning. General unguided segmentation remains a comparator.

Consequence-time qualification is committed and carried to later attribution without
reading later goals to rewrite history. The later projection correction is load-bearing:
full appraisal distances and goal ranges could reconstruct forgotten samples. Only narrow
qualification/provenance travels; the queue cannot back up lost trial evidence or rescue
a lost focal child. Same-valued foreign results and uncompleted parents do not authenticate.

The17 grouping tests and four scheduler handoff tests retain component/fixture scope.
The handoff REV2 includes retained view bytes omitted by REV1. The1827-test broad run
started before final fixture changes; separate targeted receipts cover those changes.
Trusted continuation is not adversarial public save/restore. Later bounded GA closure
supersedes routing only in its own scope, not general segmentation or causal transfer.

Source REV255:11,131 assigned /242 unassigned;192,257 narrative /212,202 backing;
1,292 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-focal-grouping-decisions-rev1','campaign3-history-source-roles-rev255'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: focal grouping and historical handoff decisions reconciled.
Start CAMPAIGN3_HISTORY_FOCAL_GROUPING_DECISIONS_CHECKPOINT.md.
Eight sources;82 original narrative occurrences. Explicit context, focal membership,
narrow carry and historical concern preserve source and persistence boundaries.
Source REV255:11131 assigned /242 unassigned;192257 narrative /212202 backing;
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
