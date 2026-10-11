from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev246/check.json');assert c['assignedSources']==11049
cp=P/'CAMPAIGN3_HISTORY_TOPOLOGY_PLANS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical topology planning reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Two plans preserve127 exact original narrative occurrences. Logical family completeness
is not materialized storage completeness. An unmaterialized family has no dummy root or
authority; every materialized leaf still needs an owner even without an active writer.
The original two-family ADAPT slice was not an implementation of all ten logical families.
Actual skill and believed capability remain on separate routes with separate evidence.
Person-model belief is not recognition knowledge, and consolidation is a producer rather
than a single authority that merges values, habits, relationships and associations.

Regulatory adaptation can have one authority with independently addressable leaf families.
The hidden-exposure witness requires checking both other authorities and other leaves
within the target authority. A witness obligation is existential; it does not require
every event to write memory, identity and adaptation. Candidate/PORT entries preserve
comparison duties without selecting a universal law. Commitments retain upstream lifecycle
identity instead of becoming permanent Need pressure or acquired-identity evidence.

The later workplan explicitly corrected its first belief dependency:140 learning read in
a later cycle did not require immediate-lane ORD001 first. Lifecycle, historical arithmetic,
shape, allocation, model and generated runtime qualifications remain separate. Final bounded
Campaign2 completion supersedes earlier unfinished/power-cycle routing, not broad ideal-loop
or Campaign3 phenomena. Its historical446 fingerprints and24 receipts are not freshly
reproduced source evidence here. RNG replay and the later absent-consumer module-graph
experiment retain separate scopes. Existing source gaps and conditional distinctions remain.

Source REV246:11,049 assigned /324 unassigned;191,335 narrative /212,032 backing;
1,241 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-topology-plans-rev1','campaign3-history-source-roles-rev246'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: historical topology planning reconciled.
Start CAMPAIGN3_HISTORY_TOPOLOGY_PLANS_CHECKPOINT.md.
Two sources;127 original narrative occurrences. Logical/materialized families, route
separation and within-authority leaf spill retained; later completion remains bounded.
Source REV246:11049 assigned /324 unassigned;191335 narrative /212032 backing;
1241 backing resources. Values post-cutoff reviews retain separate denominators.
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
