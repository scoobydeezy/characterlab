from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-significance-decisions-rev1';I=P/'campaign3-history-source-roles-rev170'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshTests']==27 and i['assignedSources']==10091
cp=P/'CAMPAIGN3_HISTORY_GA_SIGNIFICANCE_DECISIONS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Significance and focal attribution decision history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**.13 sources;182 JSON string leaves;170 narrative/40 backing
occurrences.27 current tests pass:6 target boundary,5 focal,9 retained use and7 goal
qualification/projection. Three historical reports contain40 overlapping occurrences.
No new source archive,production change or historical implementation authentication.

The first audit wrapper expected24 tests because it counted only four original
qualification cases. The actual suite includes three later projection controls.
All27 tests passed before the wrapper's count assertion failed. Preserve the original
checker and its receipt. A first finalizer then referenced nonexistent goal-carriers
replay.json;no replay artifact was written. The successor uses the actual review.json
and validates the existing27-test result without rerunning or replacing it. Both audit
errors are separate from the preserved historical target-order fixture failure.

The source-choice ruling selected concern-relative consequences first,not surprise.
Supported attribution gives eligibility,not significance or a write. Use can be earned
on an Unavailable result and therefore cannot stand for significant consequence.
Concern at lawful assessment time matters;later concern changes do not rewrite the
committed assessment. Missing is not zero,physical magnitude is not significance,and
false-but-supported attribution can credit an objectively wrong target without a
truth veto. TaskConcern,pressure,REG or a sample cannot be relabeled into the new concern.

Both determinate closer and farther qualify under the accepted coarse candidate.
Deterioration-only and positional significance remain independent alternatives.
SameDistance,indeterminate and missing remain distinct;equal-distance side crossing
is preserved but does not qualify. Tiny versus large and outside-to-outside progress
separate the candidate from magnitude and boundary-only laws. The three later narrow
projection tests preserve direction/nonqualification/absence without numeric assessment
or goal-state recovery. They are not retroactive additions to the original18-case report.
Four historical qualification mutants remain report-only in this batch.

Consumed evidence,attributed targets and significance basis are separate roles.
Credit only exact currently surviving attributed children;no sibling or stationary
comparison credit by membership. Duplicate targets normalize once. Whole-acquisition
context spread remains a comparator. Supplied boundary validation checks owner,extant
child and canonical address consistency,not causal-target production. The historical
REV1 expected numeric order and failed;the accepted resolution records correction of
fixture expectation to canonical byte order with implementation unchanged. REV2 passes
10/10;the current six boundary cases are independently identified.

One focal consequence/child is detached before actual retained-use evaluation.
Supported returns it,Unavailable none;supporting same-key stroke and stationary operands
may earn use without targethood. Session-local one-shot tokens prevent copied/foreign/
repeated finishes,but finish supplies candidates,not public committed writes. Cross-
episode retrospective spread is different from sibling-context spread. This ruling
leaves focal membership in the four trials unresolved;no fifth trial is inferred.
Supplied focus/consequence symbols cannot authenticate connection evidence or source
origin. Later actual source and owner receipts retain their own scope and limitations.

SourceREV170:10,091 assigned/1,282 unassigned;22,300 narrative/184,910 backing;
920 outside-census artifacts. Earlier roles/artifacts preserved;counts not adequacy.
The current formula citation erratum remains in force;historical identity,missing
legacy log,Values90/15 and prior exclusions remain open. Next remaining mechanism/
source history and independent authority adequacy. HQ012 unstarted;exitAuditREV111
unchanged;Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. No allocation,model,verdict,corpus or obligation status changes.
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
route='''HQ-011 IN PROGRESS: significance and focal attribution decisions reconciled.
Start CAMPAIGN3_HISTORY_GA_SIGNIFICANCE_DECISIONS_CHECKPOINT.md.
13 sources;27 current component tests PASS;historical canonical-order failure preserved.
Audit24-versus27 count and missing finalizer path errors preserved;no baseline rerun.
Consumed evidence,target and qualification stay separate;supplied focus is not provenance.
SourceREV170:10091 assigned/1282 unassigned;22300 narrative/184910 backing;920 artifacts.
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
