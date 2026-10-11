from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-graph-decisions-rev1';I=P/'campaign3-history-source-roles-rev168'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshOriginalMutations']==5 and c['freshTests']==24 and i['assignedSources']==10061
cp=P/'CAMPAIGN3_HISTORY_GA_GRAPH_DECISIONS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Graph decision and normalization history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**.15 sources;236 JSON string leaves;189 narrative/54 backing
occurrences;five exact source bindings,no missing source version or new archive.

24 current tests pass across normalization,scarcity boundary,orphan lifecycle,
older orphan-cue discrimination and direct/learned composition. Five original
zero-state substitutions fail their named witnesses. The original normalization,
math,test,formal and reviewer commitments all match;other dependencies execute
current versions. Four old reports contain41 overlapping occurrences,not41 new
independent tests. Prior retention/owner receipts are reused without rerunning them.

The older graph-gated cue fixture remains valid:isolated cued a contributes zero-hop
activation1 and changes the winner from recent-other to old-cued. Removing the node
while also dropping this direct contribution is not equivalent. The later composition
separates direct cue matching from learned spread. Its isolated-node removal preserves
retained-target contributions,including direct cues. These tests compare contributions,
not graph diagnostic rows or complete state hashes. Preserving both results prevents
silently turning a historical counterexample into either a current defect or a reason
to retain unnecessary graph membership.

Structural emptiness requires both incoming and outgoing exact zero,and no accepted
node-local payload. A zero row alone is insufficient:an incoming one-way relation can
still contribute1/2. A representable1/100000 edge preserves both endpoints. No epsilon,
weak-edge loss,renormalization or timestamp refresh follows. Normalization belongs
after the complete graph-owner batch,never during reads or between sibling learning
contributions. GZ-F contrasts supplied intermediate/final graphs;it does not itself
prove public scheduling. Future familiarity/exposure/confidence/prior fields reopen
the emptiness predicate. Dormant membership remains an alternative requiring its own
lifecycle,not an implicitly accepted learned-state field.

Explicit zero-padding of a later supplied learning domain is arithmetically equal to
retaining a zero-state node. That proves neither public source admission nor recovery
of forgotten content. Independently admitted later evidence must justify the key.

Accepted directed-edge loss charges one slot per positive entry and one per incident
node. The capacities are independently relevant. Actual symmetric coactivation can
produce asymmetric .67/.80 weights. A directed loss preserves4/15 influence that
whole-node loss removes;that is a supplied loss comparison,not an executed victim
planner. Reverse edges are independent,no removed mass redistributes,and no new edge
occurrence identity is introduced. Whole-node eviction remains the coarser comparator.

Accepted strength priority uses existing resolved weights with canonical ties and a
fixed shortest prefix satisfying both capacities. It does not optimize deletion count
or protect bridges/new edges. The proposed old .8 versus new .1 recency comparison is
not an executed alternate model. Edge-specific learning time needs independently
accepted refresh semantics;graph timestamps and episodic age cannot substitute.
Supplied victim reversal is separate from the conditional selective-weakening producer
witness,as the later scope resolution states. No new mechanism is authorized here.

The two historical significance proposals are accounted against their accepted
resolutions and later scoped tests. Directional presence and survival priority are
separate choices. Small qualifying consequences outranking repeated use is an explicit
coarse candidate,not a theorem of directional storage. Shared-bit and shared-tier
alternatives remain. Proposed withdrawal/rollback/authentication vectors do not become
executed merely because the packet was accepted;current owner evidence has its own
limits. Old DECISION REQUIRED and General Attention OPEN headings are dated routing,
not new owner blockers or grounds to discard the original limits.

SourceREV168:10,061 assigned/1,312 unassigned;21,858 narrative/184,756 backing;
920 outside-census artifacts. Earlier roles/artifacts preserved;counts not adequacy.
Next remaining retained-read/mechanism and research-authority history. Formula343/
Values90/15,formula pin,legacy log and prior exclusions remain separate. HQ012 unstarted;
exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. All jobs terminal. No production,allocation,model,
verdict,corpus or obligation status changes.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
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
route='''HQ-011 IN PROGRESS: graph decisions and zero-state normalization reconciled.
Start CAMPAIGN3_HISTORY_GA_GRAPH_DECISIONS_CHECKPOINT.md.
15 sources;24 current tests/five original mutations PASS;five exact source bindings.
Preserve older graph-gated cue counterexample and later separated direct-cue equality.
Zero-padding is not public reacquisition;node-local state reopens emptiness predicate.
SourceREV168:10061 assigned/1312 unassigned;21858 narrative/184756 backing;920 artifacts.
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
