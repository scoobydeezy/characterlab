from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev182/check.json');assert c['assignedSources']==10341
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_INVENTORIES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical cognitive inventory revisions — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

Eleven symbolic inventory/grammar/reference/role/shape artifacts reconciled:
63 original narrative and95 backing occurrences; all3,498 string leaves accounted,
including short field types, tags and names.42 source bindings match exact bytes.
The accepted shape's31 components retain their independently reviewed source roles.

Revision chain:43 records129 fields;59/184 adds16 output records and resolution
OccurredAt;59/183 removes copied StandingIdentityRead and adds MotiveChannel;
77/247 adds18 registration/calibration/quantization records and removes unused
RandomComparisonRole;76/244 removes pure internal CoverageContribution and explicitly
records the separate373 successor. No numeric allocation is implied by symbolic order.
Some earlier unresolved lists retain wording for already-added shapes; their exact
checkpoint text is preserved rather than treated as current absence.

GrammarREV2 differs fromREV1 by removal of that internal record and source/correction
metadata. Seven unions retain17 branches with disjoint required/forbidden payloads.
Both reference audits still bind grammarREV1 (77/247); their only mutual change is
Seam1019->1036, Event1008->1001, Transition1020->1009. This corrects draft labels,
not production numbers. Final structural audit targets grammarREV2 and matches all
52 scalar positions,32 collection positions and14 one-output identity families.
Record references form a finite nonrecursive graph; enum names are not record edges.
Collections, contextual RNG, fixed-member checks and runtime provenance remain
separate from scalar265 metadata. Structural coverage is not behavioral qualification.

Three new checker-development failures are retained with their exact script bytes:
unclosed-parenthesis syntax error; treating forbidden-field membership as ordered;
and treating enum(WorkspaceForecast) as a recursive record reference. Corrected checks
preserve required field order, compare forbidden membership and exclude enum/identity
references from record-edge traversal. None is counted as a scientific finding,
production defect or detected source mutation. No old report/source was rewritten.

SourceREV182:10,341 assigned/1,032 unassigned;130,869 narrative/211,245 backing;
1,190 indexed archives. Next exact allocation/model declaration audits and earlier
runtime receipts, preserving their correction/freeze identities.80 exit-inventory
identities plus one older scheduler identity remain unresolved. Formula provenance,
legacy log, Values90/15 and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. No fresh runtime suite/build, new model/allocation/verdict/law,
corpus promotion or obligation closure. RO019 ACTIVE;RO021 mandatory UNSATISFIED;
RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-cognitive-inventories-rev1','campaign3-history-source-roles-rev182'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:11 cognitive symbolic/grammar/shape artifacts reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_INVENTORIES_CHECKPOINT.md.
63 narrative/95 backing occurrences;3498 string leaves;42 exact source bindings.
Four inventory deltas/three alias corrections preserved. Final76 records244 fields,
52 scalars32 collections14 outputs17 branches;all31 prose components reviewed.
Three checker-development failures preserved;no scientific/runtime failure claim.
SourceREV182:10341 assigned/1032 unassigned;130869 narrative/211245 backing;
1190 archives.80 exit-inventory gaps plus one scheduler identity OPEN.
Next allocation/model audits and earlier runtime receipts/correction chains.
Formula provenance,legacy log,Values90/15 and independent adequacy OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
