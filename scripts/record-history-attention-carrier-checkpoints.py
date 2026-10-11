from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev257/check.json');assert c['assignedSources']==11144
cp=P/'CAMPAIGN3_HISTORY_ATTENTION_CARRIER_CHECKPOINTS.md';assert not cp.exists()
cp.write_text('''# Historical attention carrier checkpoints — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Six sources preserve72 exact original narrative occurrences. Early storage inventories
are proposals, not permanent meanings: their SelectionId episode address and four-entry
ledger were later superseded by explicit acquisition and loss semantics. Bounded owner
reads solve candidate enumeration without granting unlogged state scans or an archive
resolver. Ranking, presentation, retention metadata and surviving evidence stay distinct.

The early uniform three-unit encoding case never exceeded shared budget1; it could not
exercise normalization or disprove footprint dependence. Separate arithmetic and later
public footprint evidence retain their own scopes. SpatialPeripheral is not Incidental,
and Need/surprise-disabled components do not qualify those source mechanisms.

Preserve sparse-list and rational/role alias corrections, the first codec's omitted EMB
registry, the added physical replenishment stage and primitive-validator typing repair.
These were implementation findings, not new psychological laws. Structural carrier and
registry checks cannot authenticate a public producer or grant a cognitive read.67 stage
templates and218 symbolic member names are not runtime work bounds or authority grants.

Later bounded GA qualification supersedes unfinished routing only within its declared
scope. No old test/model/contract bytes are changed, and component counts are not counted
as fresh whole-suite execution. Same-run concern feedback and full public rollback/replay
remain separately evidenced from the early internal adapters.

Source REV257:11,144 assigned /229 unassigned;192,411 narrative /212,202 backing;
1,292 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-attention-carrier-checkpoints-rev1','campaign3-history-source-roles-rev257'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: attention carrier and storage checkpoints reconciled.
Start CAMPAIGN3_HISTORY_ATTENTION_CARRIER_CHECKPOINTS.md.
Six sources;72 original narrative occurrences. Draft storage, structural admission,
normalization coverage and corrected implementation omissions retain bounded scope.
Source REV257:11144 assigned /229 unassigned;192411 narrative /212202 backing;
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
