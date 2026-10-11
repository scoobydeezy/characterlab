from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-memory-decisions-rev1';I=P/'campaign3-history-source-roles-rev171'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshTests']==6 and i['assignedSources']==10107
cp=P/'CAMPAIGN3_HISTORY_GA_MEMORY_DECISIONS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Memory resource decision history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**.16 sources;45 JSON string leaves;214 narrative/9 backing
occurrences. Six current supplied-operand witnesses pass across association/episode
loss and mixed recall scaling. Three old reports contain9 overlapping occurrences.
Prior60 retention,24 graph,29 recall and37 memory-publication test receipts are reused
without rerun. No new production,model,source archive or historical byte-parity claim.

Independent graph lifecycle supersedes graph=retained-files coupling. All four
membership states remain legal. Learned structure carries no episode payload or source
resolver;node membership does not establish familiarity or causal knowledge. Once
lawfully formed,learning is not cancelled merely by same-barrier episode loss;failed
instant still commits neither. Coupled loss remains a comparator through graph authority.
The4/15 influence witness reverses two surviving topK2 targets' ranking,not exclusion
or chosen action. Graph-only activation never manufactures a lost episode.

Direct cue contribution is independent of persistent graph membership and counts
zero-hop once. The old isolated-node counterexample remains valid for its coupled
path. An adapter supplying graph zeros does not itself implement raw direct matching.
Temporary computational union membership creates no state,identity or graph-capacity
use. Actual admitted current cue is still required;retained evidence does not self-cue.
Later exact direct/spread and public-read proofs retain their separately qualified scope.

One ordinary-memory authority owns nonborrowing event/body retention partitions.
Shared identity/history does not imply a shared psychological scale. Genuine capacity
pressure must cause modeled loss;work-bound rejection and retain-all fixtures do not
qualify forgetting. Shared cross-kind competition remains an explicit alternative.
Consolidation needs a bounded owned resource class,no hidden dictionary or trace resolver.

Complete semantic-child loss preserves every view of a surviving group,including
contradictory views. Serialization,view count and byte footprint are not cognitive
costs. Partial remainder keeps identity,time and exact content;last-child loss removes
current recall target without identity reuse. Whole-acquisition retirement and within-
unit degradation remain separate alternatives. The accepted loss rule chooses no
importance law or survival priority.

Recency is an original-acquisition-time baseline. Canonical ties are mechanical and
full-barrier planning must not become handler-order append/evict. Age is not refreshed
by recall,presentation,processing or prior survival. Zero capacity loses all. Recency
alone cannot satisfy acquired importance. Required old-used/new-unused,self-rehearsal
and old-outcome-significant comparisons remain distinct. Binary actual-use protection
cannot be earned by retrieval bookkeeping alone,does not accumulate on repetition and
cannot grant immortality or resurrect lost children. Graded reinforcement remains
an explicit competitor;use alone does not supply concern-relative significance.

Independent recall slots likewise do not imply separate consciousness or deny later
distraction. The actual ranker preserves body ordering while scaling .4/.2 to .8/.4
changes a sharedK1 winner against event .6. This demonstrates a missing cross-kind
calibration,not physiology. Shared recall remains viable with an explicit common law.
The six partition cases previously reviewed enforce supplied prefixes,not public
remembered-content admission. Frozen numbered public witnesses in these rulings are
requirements,not results of earlier append-only fixtures or these six new tests.

SourceREV171:10,107 assigned/1,266 unassigned;22,514 narrative/184,919 backing;
920 outside-census artifacts. Earlier roles/artifacts preserved;counts not adequacy.
Next remaining mechanism/source history and independent authority adequacy. Current
formula citation erratum stands;historical identity,legacy log,Values90/15 and prior
exclusions remain open. HQ012 unstarted;exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21. No allocation,verdict,
corpus or obligation status changes. All jobs terminal.
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
route='''HQ-011 IN PROGRESS: memory resource decision history reconciled.
Start CAMPAIGN3_HISTORY_GA_MEMORY_DECISIONS_CHECKPOINT.md.
16 sources;six current supplied-operand tests PASS;prior scoped suites reused.
Cost,loss,survival and recall remain separate;ranking reversal is not chosen action.
SourceREV171:10107 assigned/1266 unassigned;22514 narrative/184919 backing;920 artifacts.
Next remaining mechanism/source history and independent authority adequacy.
Formula current-use erratum stands;historical identity,missing legacy log,Values90/15
and prior exclusions OPEN. HQ012 unstarted;exitAuditREV111 unchanged. All jobs terminal.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
