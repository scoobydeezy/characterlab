from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev243/check.json');assert c['assignedSources']==11037
cp=P/'CAMPAIGN3_HISTORY_VAL_QUALIFICATION_AUTHORITY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# VAL qualification authority reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Three authority documents preserve59 exact original narrative occurrences. Intermediate
E/M/W acceptance, proposed crosswalk rows and final A..W acceptance retain their own
chronology. Final VAL qualification is bounded to the accepted implementation language
and named finite interventions. Generic CONTENT permutations, PRJ controls, ambient
stand-ins and shared-codec comparisons do not qualify broader public models or universal
compiler/host equivalence. The second-kind positive remains conditional on a separately
accepted kind and binding; commitment of unsupported bytes is not a positive witness.

Preserve the rejected public266 deferral: the original first model had no266 declaration,
but the already accepted memory successor carried it under358 in both recall profiles.
First-model inventory could not establish absence across admitted models. The first
public mutant rejected at frozen-source matching before VAL, correct admission but an
insufficient role-traversal assay. The first production correction moved roles earlier
but violated CONTENT-before-role order. Equal error categories did not excuse that error.

Accepted revision2 validates CONTENT/reference closure using kind entries and an empty
role operand, then full declarations, exact frozen-source matching and role-enabled
CONTENT before state/model/runtime. The dual-defect cycle plus namespace mutation proves
CONTENT error precedence and no full role traversal/publication. Role-only and valid-role
selector controls separately preserve the role boundary and exact matcher. The35-test
and corrected36-test cohorts remain distinct; neither is freshly rerun here. Model and
allocation bytes did not change. Factory qualification and later RNG persistence remain
separate evidence, not consequences of VAL acceptance.

Source REV243:11,037 assigned /336 unassigned;191,038 narrative /211,997 backing;
1,239 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Source gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-val-qualification-authority-rev1','campaign3-history-source-roles-rev243'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: VAL qualification authority and corrected precedence reconciled.
Start CAMPAIGN3_HISTORY_VAL_QUALIFICATION_AUTHORITY_CHECKPOINT.md.
Three sources;59 original narrative occurrences. Rejected266 deferral, matcher-first
insufficient assay and CONTENT-before-role correction preserved; finite scopes retained.
Source REV243:11037 assigned /336 unassigned;191038 narrative /211997 backing;
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
