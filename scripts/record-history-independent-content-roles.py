from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev212/check.json');assert c['assignedSources']==10854
cp=P/'CAMPAIGN3_HISTORY_INDEPENDENT_CONTENT_ROLES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Independent content and role receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Four original/refreshed proof receipts reconciled:26 original narrative/18 backing
occurrences and7,566 complete JSON string leaves. Ten exact source/oracle bindings
resolve. The original validator source was recovered byte-for-byte from Git commit
42c2713ce044a04d53c294032462dd6ac25446e0 and added to the archive index.
No additional source gap was found in this batch.

Each content cohort has572 baseline cases:44 accepted and528 rejected. A separate
read-only topological-elimination calculation verifies all531 directed graphs through
three nodes,including self edges;30 graphs admit. Accepted byte hashes agree. Seven
mutations retain one selected disagreement each;these are not572 stored mutated
results. Two mutations preserve acceptance while changing canonical content bytes.
The original one-site dangling-reference omission remains not distinguished because
later DFS traversal still rejected;the later two-site substitution is separate.

Each role cohort has234 exact baseline agreements. Seven mutations retain disagreement
counts12/2/11/72/64/12/24. Those sets overlap and must not be added as independent
behavior coverage. Direct qualification and recursive canonical role admission retain
different structural-error precedence. Full typed identity differs from payload-only
equality;namespace-only roles do not acquire character qualification implicitly.

Original and refreshed payloads match except validator source commitments. Oracle
files match their recorded hashes. Byte recovery does not establish execution time.
Independent semantics share canonical transport;neither report qualifies an independent
decoder,arbitrary graphs or recursive record/map-key traversal. These new checks
validate stored rows and graph classifications,not a fresh production/oracle/mutation run.

SourceREV212:10,854 assigned/519 unassigned;186,674 narrative/211,757 backing;
1,196 indexed archives. Prior source-gap inventories,formula provenance,legacy log,
remaining support,post-cutoff joins and independent adequacy remain open. No model,
law,allocation,verdict,corpus or obligation status changed. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-independent-content-roles-rev1','campaign3-history-source-roles-rev212'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:four independent content/role receipts reconciled.
Start CAMPAIGN3_HISTORY_INDEPENDENT_CONTENT_ROLES_CHECKPOINT.md.
26 narrative/18 backing;7566 strings;10 exact bindings;original validator recovered.
531 graph classifications recomputed;572content/234role rows retain finite proof limits.
SourceREV212:10854 assigned/519 unassigned;186674 narrative/211757 backing;
1196 archives. Values post-cutoff reviews retain separate denominators.
Open identities:thirteen ADAPT-associated,two composition,two Values,seven cognitive,80 exit-inventory,one prior scheduler.
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
