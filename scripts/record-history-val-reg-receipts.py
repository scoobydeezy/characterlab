from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev244/check.json');assert c['assignedSources']==11044
cp=P/'CAMPAIGN3_HISTORY_VAL_REG_RECEIPTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# VAL and regulatory persistence receipts — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Seven receipts preserve36 original narrative and35 backing occurrences; all5842 JSON
string leaves reviewed by schema, including short diagnostics. The crosswalk is an
inventory of23 vectors and13 report links. Its58/0/6 first-model role counts do not
prove absence in other accepted models; the rejected266 deferral remains superseded
by the later public memory-role witness. Five refresh assays retain46 finite mutations
and separate historical/refresh reports. Historical current-source wording is not a
claim about today's production bytes.

All five REG/persistence receipts have identical result payloads with distinct source
fingerprints. An independent Python integer-floor check agrees with all252 stored REG
rows: three rates, two anchors, seven times and six queries. Five persistence observations
remain separate. Eleven mutation disagreement counts are20/12/31/22/12/2/2/2/1/1/1;
these overlap and are not independent phenomena. The rejection-only time-zero assay
initially missed its mutant because runtime construction repeated saved-time validation.
A construction counter distinguishes baseline3->3 from mutant3->4. The edited checkpoint
clock was a boundary challenge, not evidence that the late history was executed.

Twenty-eight exact source/report bindings verified. Two historical files were recovered
as exact raw Git blobs: original factory fd1e681e... and refresh writer7834767c....
The writer differs from today's runner in configuration loading and output destination;
it was read, not executed. Original and REV3 adaptation-runtime gaps cb6adb0f... and
59b67856... remain explicitly linked, both previously recorded. Matching outputs do not
repair missing source bytes. No new source-gap group is introduced.

Source REV244:11,044 assigned /329 unassigned;191,074 narrative /212,032 backing;
1,241 indexed backing resources. No historical runtime/test/build rerun, model, law,
allocation, verdict, corpus or obligation status change. Source gaps, formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-val-reg-receipts-rev1','campaign3-history-source-roles-rev244'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: VAL/REG receipts and exact historical sources reconciled.
Start CAMPAIGN3_HISTORY_VAL_REG_RECEIPTS_CHECKPOINT.md.
Seven sources;36 narrative/35 backing occurrences;5842strings;28exact bindings;
2 exact Git archives;2 repeated source gaps. Rejection-only assay correction preserved.
Source REV244:11044 assigned /329 unassigned;191074 narrative /212032 backing;
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
