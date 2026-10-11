from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev242/check.json');assert c['assignedSources']==11034
cp=P/'CAMPAIGN3_HISTORY_PERSISTENCE_AUTHORITY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Original persistence authority reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three original authority documents preserve75 exact narrative occurrences. The
accepted revision2 shape independently justifies Save132 fields8/9/10 as exact empty
lists from admitted execution closure, including unexercised branches. Immutable REG
anchors remain model-owned; original input remains separately required. The retracted
revision1 REG-copy proposal was not runtime behavior. Silent execution, schema support
and build presence do not establish a model's admitted capabilities or metadata.

The original bounded no-RNG PERSIST-A..H verdict retains its own evidence. Its700
negative public calls were one test covering175 descriptor omissions and version
increments at prepare/restore, not700 tests or all malformed layouts. The16 focused
tests and earlier936 historical result stay separate. Preserve the audit-helper
dataRecord error before report generation; no production semantics changed.

PERSIST-I's original positive precondition was a real accepted production RNG seam
supported by the build but absent from the committed model. The old schema-catalog
assay did not satisfy it. Later cognitive persistence proved actual RNG complete-prefix
restore, separately from the later post-cutoff supported-module-graph experiment in
campaign3-history-persist-i-rev1/proof.json. That experiment supplied the absent-consumer
contrast with complete old-model/save bytes, actual production draws and two detected
substitutions. Its rejected mutation-anchor runner remains preserved. The bounded
module-graph result does not establish old-binary reproduction, arbitrary plugin/build
independence, external coupling or scaling. Original DEFERRED prose is preserved as
chronology; later evidence is linked without retroactively changing earlier claims.

Source REV242:11,034 assigned /339 unassigned;190,979 narrative /211,997 backing;
1,239 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Source gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-persistence-authority-rev1','campaign3-history-source-roles-rev242'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: original persistence authority and later evidence reconciled.
Start CAMPAIGN3_HISTORY_PERSISTENCE_AUTHORITY_CHECKPOINT.md.
Three sources;75 original narrative occurrences. No-RNG qualification, actual RNG
prefix restore and subsequent absent-consumer module-graph proof remain separate.
Source REV242:11034 assigned /339 unassigned;190979 narrative /211997 backing;
1239 backing resources. Values post-cutoff reviews retain separate denominators.
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
