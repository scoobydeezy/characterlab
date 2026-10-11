from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-retention-policies-rev1';I=P/'campaign3-history-source-roles-rev167'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshOriginalMutations']==36 and c['freshTests']==60 and i['assignedSources']==10046
cp=P/'CAMPAIGN3_HISTORY_GA_RETENTION_POLICIES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Retention policy history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**.34 sources;1,013 JSON string leaves;480 narrative/232 backing
occurrences.29 exact source bindings;two unavailable intermediate directional-state
implementations. No new archive or production change.

60 fresh tests pass across eight component/internal scheduler suites. All36 original
fault substitutions are detected by their designated witnesses on current inputs.
Current source/test hashes are recorded separately from old source commitments.
Missing old versions are excluded from exact historical reproduction claims;current
mutation success cannot authenticate those missing bytes. Ten historical test reports
contain172 overlapping occurrences,not172 independently rerun cases. Repeated Vitest
instances emitted MaxListenersExceededWarning;all runners terminated successfully.

Whole semantic children cost one each,regardless of views or bytes. Event/body pools
never borrow. Explicit fragmentation applies a supplied loss plan;recency/use/significance
policies choose victims separately. Partial loss preserves exact surviving bytes and
original acquisition identity/time;last-child loss removes the acquisition. No policy
returns a hidden archive or lets later credit reconstruct lost content. Scarcity is
actual modeled loss,while an insufficient explicit plan is invalid input.

Recency operates on the complete barrier,not sequential append-and-evict. Original
time and canonical address ties determine order. Protection is binary,child-local and
idempotent;it is not count,decay or rejuvenation. Qualifying use requires an independent
cognitive consumer's committed result,not objective correctness or reward. Cue,recall,
presentation and attribution alone do not earn it. Supplied-target APIs do not prove
authentication or public owner timing. The later ordinary-memory audit separately
establishes current credit overlays only survivors after retention.

Directional significance preserves empty,Closer,Farther and both independently of use.
Absence is not complete history or known neutral importance. The shared bit is a
reduction comparator. The accepted significance/use/neither retention tiers give no
extra within-tier benefit to two directions or added use. Fresh protected candidates
reject. Compact old state has no credit timestamp,so it cannot authenticate prior
credit timing alone. DS-F is pure input atomicity,not scheduler rollback;DS-H changes
evaluation time,not an actual goal withdrawal. Shared-validator refactor reports do
not supply the two missing historical implementations.

Graph loss removes actual directed positive edges and then orphan nodes,preserving
reverse/unrelated weights exactly. Node and edge capacities remain independent;
positive-edge cost is one,not weight. Strength retention removes the shortest prefix
of the fixed weakest-weight/canonical-address order satisfying both capacities.
It is not global minimum deletion,bridge protection,new-edge grace or node optimization.
Edge-learning recency remains a meaningful comparator with unaccepted timestamp semantics.

The accepted weakening scope resolution distinguishes three claims: supplied resolved
weights demonstrate selector victim reversal;uniform EAM without learning cannot
produce selective numeric reversal;future selective producer integration is conditional.
Quantization may create ties or zeros,not reversed numeric ordering.135 actual EAM
combinations test that bounded property. No new weakening mechanism or per-edge override
is authorized merely to manufacture the future witness. RO-C3-020 explicitly retains
the trigger before any stronger producer-integration claim.

The scheduler fixture runs actual learning then retention with common prior B0 for
two participants. Zero graph capacity permits successful peer work. Late failure rolls
back state,queue,clock,allocator,outputs and trace. Reversed participant order preserves
final state,not necessarily trace identity. Active quiescent snapshot continuation
matches committed surfaces after later loss,but is not canonical Save132/public restart.
Fixture zero-padding of named keys is not reacquisition of forgotten content.

Prior declarations coupling memory,graph and presentation membership are superseded
by independent ownership. Older OPEN routing is historical;accepted resolutions close
their immediate choice while preserving comparators and unearned scope.

SourceREV167:10,046 assigned/1,327 unassigned;21,669 narrative/184,702 backing;
920 outside-census artifacts. Prior roles/artifacts preserved;counts are not adequacy.
Next remaining retained-read/mechanism and research-authority history. Formula343/
Values90/15,formula pin,legacy log and prior exclusions remain separate. HQ012 unstarted;
exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. All jobs terminal. No allocation,model,verdict,corpus
or obligation status changes.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
o=next(o for o in r['obligations'] if o['id']=='RO-C3-020')
o['unresolved']+=' HQ011 retention-policy reconciliation: supplied resolved edge weights establish selector victim reversal only. Uniform EAM weakening without learning preserves exact order;quantization may collapse ties/zeros,not selectively reverse numeric order. Before claiming selective weakening producer integration or introducing a relation-specific producer,provide an actual lawful producer witness and preserve the uniform control;the future producer comparison remains conditional and mechanism-dependent. No per-edge override or new mechanism is authorized by this audit. See GENERAL_ATTENTION_GRAPH_WEAKENING_SCOPE_RESOLUTION.md and CAMPAIGN3_HISTORY_GA_RETENTION_POLICIES_CHECKPOINT.md.'
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: retention policy/state/graph-owner history reconciled.
Start CAMPAIGN3_HISTORY_GA_RETENTION_POLICIES_CHECKPOINT.md.
34 sources;60 fresh tests/36 original mutations on current inputs PASS.
29 exact bindings/two unavailable old significance implementations;no new archive.
Use/significance remain independent;supplied edge reversal is not uniform weakening.
Future selective producer comparison stays conditional under RO020.
SourceREV167:10046 assigned/1327 unassigned;21669 narrative/184702 backing;920 artifacts.
Next remaining retained-read/mechanism and research-authority history;adequacy open.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
