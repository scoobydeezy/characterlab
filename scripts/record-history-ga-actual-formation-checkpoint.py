from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-actual-formation-rev1';I=P/'campaign3-history-source-roles-rev163'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshCurrentMutationFaults']==17 and c['freshTests']==24 and i['assignedSources']==9945
cp=P/'CAMPAIGN3_HISTORY_GA_ACTUAL_FORMATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Actual selection, formation and use history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Twenty-six sources;2,355 JSON string leaves;1,093 narrative/
399 backing occurrences;34 exact bindings and16 unavailable references to12 versions.
No new recovered archive. Missing intermediate implementations remain explicitly
excluded from exact historical reproduction;current code is not substituted as proof.

24 fresh tests pass across body selection,contextual body selection/formation and
visual formation. Seventeen originalREV3 mutations apply exactly once to current
sources and fail their designated witnesses. Two original substitutions no longer
match current code:context aliasing and skipped prior-concern feedback. They were
not replaced,executed or counted as fresh passes. A separate base-encode control
removes its outer selected-map deletion;VF-C still rejects replay through the consumed
inner capability. That defended substitution is not a detected fault and does not
claim coverage of every later encoding adapter. All reports are preserved;runner
terminal success accompanies a nonfatal listener-count warning.

Thirteen historical test receipts contain508 occurrences,not508 independent fresh
cases. The previous42-test goal/composition receipt is reused without rerun.
Historical169-test/25-file affected regression remains report-only in this batch.
Fresh name matches are recorded separately from prior matches and report-only cases.

Three development cohorts and seven failed assertions remain visible:
- Initial body-selection fixture failed all five tests because it omitted or conflated
  the required three physical mappings. Corrected fixture preserves the contract and
  uses two declared A views;no validator was weakened.
- Missing all observed panel context fell through to FocusUnavailable instead of
  GroupingUnavailable. Requiring four complete observed groups before focal lookup
  corrected the boundary;the initial27/28 and later28/28 reports both remain.
- Initial calibrated visual report failed VF-I rational equality50/51,followed by
 51/51. Current VF-I exercises explicit sparse/dense and null controls. Missing old
  implementation bytes prevent attributing that historical correction to a particular
  source edit or treating the later pass as selection of one psychological law.

Actual1143 selector provenance now precedes acquisition;every completed selection
owns an audit even when it forms nothing. Missing samples cannot become observed
unavailable. Eight body acquisitions plus one empty body cue selection and nine
visual audits account for18 sources;acquisition identity is allocated separately.

Retained stage comes from the actual observed panel companion,not a caller label,
array position or hidden episode key. Exact experience/event/observer/time/support/
producer and plain-data checks run before allocation,but structural matching is not
an authenticity certificate. Absent stage cannot be reconstructed;context alone
cannot overcome empty selection. Lawful visual acquisition can survive missing stage.

Body and visual producers consume selected-only one-use capabilities. Positive groups
or children share one later acquisition;empty,zero or unavailable visual candidates
produce no evidence. Provisional formation is not committed memory:the later owner
must reuse admitted identity and settle its batch. Allocation failure publishes
nothing and consumes the local capability;whole-instant retry/allocator rollback
remain runtime responsibilities. Supplied missing-coordinate projection stays distinct
from actual capacity-zero,known-zero and unresolved-role cases.

The actual-use retention witness selects earlier stroke endpoint3,qualified at4.
At71 actual attribution consumes16 retained children,including endpoint63;only focal3
receives significance72. Withdrawal70 does not rewrite the prior assessment. New73
receives no invented use credit. With identical actual-used memory/capacities,
significance-first keeps3 while shared-protection or disabled/nonqualifying significance
keeps63 by recency. Focal-last actual-read equality and the old supplied-use sensitivity
comparator remain distinct. Old focal-last qualification64 is not an alias for4.

SourceREV163:9,945 assigned/1,428 unassigned;19,841 narrative/183,987 backing;
920 outside-census artifacts. Prior roles/artifacts preserved;counts not adequacy.
Next remaining owner/protocol/retained-read history,then authority adequacy.
Formula343/Values90/15,formula pin,legacy log and prior exclusions remain separate.
HQ012 unstarted;exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21. All jobs terminal.
No production/model/allocation/verdict/corpus/obligation status changed.
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
route='''HQ-011 IN PROGRESS: actual selection/formation/use history reconciled.
Start CAMPAIGN3_HISTORY_GA_ACTUAL_FORMATION_CHECKPOINT.md.
26 sources;24 fresh tests/17 original mutations on current sources PASS.
Two old substitutions inapplicable;one defended base-encode replay control passes.
Three development cohorts/seven failed assertions preserved;169-suite report-only.
34 exact bindings/16 unavailable references to12 versions;no historical substitution.
SourceREV163:9945 assigned/1428 unassigned;19841 narrative/183987 backing;920 artifacts.
Next remaining owner/protocol/retained-read history;authority adequacy remains open.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
