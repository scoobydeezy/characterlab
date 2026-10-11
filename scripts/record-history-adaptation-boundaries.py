from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev206/check.json');assert c['assignedSources']==10823
cp=P/'CAMPAIGN3_HISTORY_ADAPTATION_BOUNDARIES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Adaptation boundary review reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Six historical AD-E3/7/9/10 review documents reconciled:119 original narrative
occurrences. Dated pending requests remain distinct from forward acceptance and
later factory authority. This prose review does not independently refresh raw
mutation evidence or repair unresolved historical source identities.

Three real defects retain separate findings and correction boundaries:

- Staged read evidence could be omitted,reordered or substituted before publication.
  Per-rule instrumentation and private canonical staging checks address association;
  the owning projection still establishes returned values.
- Caller-owned bindings could redirect reads after validation. Private snapshots
  remove the alias; captured derive functions are not sandboxed or proven pure.
- Cursor ordering allowed nested B execution while A remained active. An active
  evaluation guard rejects nested execution and premature finish before new reads.

Actual shared-object rejection differs from staged-evidence substitution. Public
binding/enumeration hooks are excluded; internal fault interception does not become
an admitted public API. Exact-domain confinement does not ban declared wildcards.
The697-test earlier suite and later80-test targeted suite have different scopes;
ordinary passing tests cannot refresh source-sensitive mutation reports.

AD-E3 preserves public commitment interventions versus structural generic identities
and earlier richer-profile exclusion. AD-E9 preserves exact endpoints,zero removal,
no-op absence and unbounded bigint specimens without universal arithmetic claims.
AD-E10 keeps authored R0,retained D and validated R0+D separate; invalid retained
reference fails before repair ingress. Its named whole-runtime rollback witness is
not the full AD-E12 matrix. Component unknown-variable mapping and earlier public
admission rejection remain separate. No production semantics or profile was widened.

SourceREV206:10,823 assigned/550 unassigned;185,662 narrative/211,678 backing;
1,193 indexed archives. Remaining file counts do not measure material adequacy.
Open identity groups remain:five ADAPT,two composition,two Values,seven cognitive,
80 exit-inventory and one scheduler. Formula provenance,legacy log,remaining material
support,post-cutoff joins and independent adequacy remain open. Next raw ADAPT read,
binding,magnitude and reference proof receipts require their own exact-source review.

No runtime,test,build,model,law,allocation,verdict,corpus or obligation status changed.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-adaptation-boundaries-rev1','campaign3-history-source-roles-rev206'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:six ADAPT boundary review documents reconciled.
Start CAMPAIGN3_HISTORY_ADAPTATION_BOUNDARIES_CHECKPOINT.md.
119 original narrative occurrences;read-evidence,alias and interleaving defects distinct.
Finite component/public exclusion,magnitude/reference and rollback scopes preserved.
SourceREV206:10823 assigned/550 unassigned;185662 narrative/211678 backing;
1193 archives. Values post-cutoff reviews retain separate denominators.
Open identities:five ADAPT,two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
Next raw read/binding/magnitude/reference proofs,remaining material support and adequacy.
Formula provenance,legacy log and post-cutoff joins remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
