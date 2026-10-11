from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-calibration-rev1';I=P/'campaign3-history-source-roles-rev159'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaults']==12 and i['assignedSources']==9889
cp=P/'CAMPAIGN3_HISTORY_GA_CALIBRATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# GA calibration and execution policy history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Five sources;231 JSON string leaves;31 narrative/four backing
occurrences;13 exact bindings;one recovered historical encoder,no missing bytes.

Twelve original symbolic calibration faults reproduce exactly. The original spatial
encoder dependency is recovered from Git6d54d35f3c612154658c6f9316f6f7e04071865b
with SHA6f54c4523faed79ffe00c29a242b1ee226a3880553921f4a9f124d73dcb02096.
The historical reviewer reads those exact bytes for its source check;it does not
execute numerical encoding. Six current execution-policy tests pass,and both policy
implementation/test files match the historical review commitments.

Sensing alone performs zero definition lookups. Selection and cue slots bind
independently;ordinary body recall and baseline resolve separately despite sharing
a definition kind. Visual selection requires selector,spatial and encoding definitions;
visual cue only event access. Goal assessment requires baseline and qualification.
Wrong kinds,namespaces,extras and hostile descriptors reject before lookup;caller or
resolver mutation cannot alter the detached returned identities. Trusted kind lookup
still does not establish governed definition values,versions or public registration.

The twelve parameter shapes preserve mechanism ownership:body recall has no graph
parameter,retention uses independent child slots and B0 metadata,graph30/870 differs
from kernel32,and completed-source enrollment/horizon are work constraints. Existing
Unlimited selection can select three without widening capacity enum0..2. Four encoding
laws and two qualification laws remain comparisons;historical hybrid is not silently
recast as conserved resource allocation. Prior concern1-q/1+q remains CandidateA under
the ratified scope,not a general settled Affect law. Disabled feedback keeps provenance
checks. Numeric floor/footprint claims retain their separate component/public evidence.

SourceREV159:9,889 assigned/1,484 unassigned;18,191 narrative/183,441 backing;
920 outside-census artifacts. Prior roles/artifacts unchanged;counts not adequacy.
Next body/surviving-child carrier history and remaining authority/material audit.
Formula343/Values90/15,formula pin,legacy log and prior exclusions remain separate.
HQ012 unstarted;exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
No production/model/allocation/verdict/corpus/obligation status changed. Jobs terminal.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: calibration/execution policy history reconciled.
Start CAMPAIGN3_HISTORY_GA_CALIBRATION_CHECKPOINT.md.
Five sources;12 original symbolic faults/six exact-source current policy tests PASS.
Separate recall capacities,encoding laws,retention and graph bounds preserved.
Feedback formula remains CandidateA.13 exact bindings;one Git-recovered encoder.
Reviewer hashes that old module but does not execute numeric encoding/public runtime.
SourceREV159:9889 assigned/1484 unassigned;18191 narrative/183441 backing;920 artifacts.
Next body/surviving-child carrier history and remaining authority/material audit.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
