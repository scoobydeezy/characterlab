from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev259/check.json');assert c['assignedSources']==11152
cp=P/'CAMPAIGN3_HISTORY_ATTRIBUTION_BODY_COMPONENTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical attribution and body components — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Four sources preserve70 exact original narrative occurrences. The attribution draft
separates supported connection, evidence-valued effect and authorized memory update.
Supported supplies neither causal certainty nor an effect magnitude. Its proposed
same-instant target composition does not override the later no-transient-access ruling.

The contrastive component tests strict replicated motion/stationary separation, but
identical supplied inputs with hypothetical hidden explanations are not an actual public
false-attribution source. Support-only SEM still has no event/continuant candidate;
qualified current body pressure does not imply durable memory. The initial unsuffixed
SEM fixture failure remains distinct from the corrected exact-version run.

The sample-level gate counts redundant channels by design. The later signal-level gate
counts declared signal groups, preserving contradictory views without fusion. Neither
component proves physiological diversity merely from names. Actual SEM identity controls
distinguish same-time opportunities and avoid fabricated experiences for absent evidence.
The omitted rational-denominator fixture was corrected without weakening the contract.

Earlier24, combined20 and later27 test counts describe different compositions. Their
source, subject, public admission and restore limitations remain explicit beneath later
bounded GA qualification. No raw archive, hidden source identity or discarded sample can
be substituted for admitted retained evidence. Broader causal and sensory laws stay open.

Source REV259:11,152 assigned /221 unassigned;192,618 narrative /212,202 backing;
1,292 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-attribution-body-components-rev1','campaign3-history-source-roles-rev259'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: attribution and body component histories reconciled.
Start CAMPAIGN3_HISTORY_ATTRIBUTION_BODY_COMPONENTS_CHECKPOINT.md.
Four sources;70 original narrative occurrences. Supplied-operand attribution,
signal diversity, fixture corrections and public source limits remain distinct.
Source REV259:11152 assigned /221 unassigned;192618 narrative /212202 backing;
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
