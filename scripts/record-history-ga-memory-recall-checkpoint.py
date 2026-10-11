from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-memory-recall-rev1';I=P/'campaign3-history-source-roles-rev166'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshOriginalMutations']==8 and c['freshTests']==37 and i['assignedSources']==10012
cp=P/'CAMPAIGN3_HISTORY_GA_MEMORY_RECALL_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Ordinary memory, recollection and presentation history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Twenty-six sources;1,576 JSON string leaves;713 narrative/
264 backing occurrences;16 exact bindings and3 unavailable older integration tests.

37 fresh tests pass across ordinary memory,significant formation,presentation,
recollection production and observed association recall. Eight original publication
mutations fail their designated witnesses;the original publication source/test bytes
match. The exact recollection carrier builder/reviewer reproduce10 structural faults.
Four older association mutations remain report-only. Prior44 protocol,42 goal/composition
and31 source/read test receipts are reused without rerun. Fourteen historical reports
contain317 overlapping occurrences,not317 independent fresh cases.

Three cited integration-test versions are unavailable after directed local/all-ref
Git path/prior-archive search. Exact old cohort reproduction is excluded;current
behavioral tests are separately hashed. No new archive or production change.

Ordinary memory reads prior committedB0. It validates current use/significance against
old children,then computes retention from old metadata plus fresh uncredited content.
Only afterward does it overlay current credit on actual survivors. Credit cannot
rescue a child in the same instant or resurrect lost content;committed credit affects
the next instant normally. Fresh credit injection rejects. Protocol loss derives from
the actual owner result,including immediate total loss of a fresh successful formation.

Significance-first,shared-protection,use-only and age-only controls change ranking
without erasing ignored metadata. With old significant1,newer used2 and fresh3 under
one slot,they retain1,2,2 and3 respectively. At full capacity metadata agrees. All
preserve commonB0,source/protocol validation,per-kind budgets and one-use result binding.
These witnesses do not select a universal retention law.

Recollection publishes actual winning surviving content,one new occurrence per winner,
without changing acquisition identity or time. A body cue recalls noncued surviving
groups in the winning acquisition too;group-local recall remains a separate comparator.
Body winners do not gain event scores or graph fields. Absent cues perform no state
read;available cues with zero winners allocate nothing. Mutable evaluation cannot alter
private staged winners. Subject comes from accepted projection,not observer identity.

Recall is not presentation,use protection or significance. An actual event publication
has a separate one-use presentation handoff;copies,replay and body publications reject.
Event history seeds at formation,permits distinct same-instant presentation occurrences,
and rejects overflow even if the acquisition will be lost. Complete loss removes history;
partial loss preserves it. Neither history removal nor graph loss recreates episodes.
Public provenance,cross-instant replay,read-domain and persistent-owner authority remain
separate from component checks.

The focal target is reconstructed from surviving observed context whose After experience
matches the carried consequence. Fixed first-profile end-position designation is bound
before attribution;no source-array,last-row or newest lookup. Missing complete group
means unavailable,not recovery from hidden schedule. Ordinary forgetting is not corrupt
input. Start-child use does not implicitly grant sibling outcome significance.

Observed A,B,A+B formations use actual base3/10 strengths3/13 and27/127. Gain5 yields
245 off-diagonal lattice mass and changes the second recalled acquisition fromA@1 toB@2
with identical memory/protocol/history. Gain3 is nondiscriminating;gain4 also distinguishes.
Complete graph loss restores direct recall without losing episodes;cue absence still
blocks recall. Initial3/5 report incorrectly used base1 and failed graph/rank predictions;
corrected6/6 uses actual calibration without changing arithmetic or validators. Both
failures remain preserved. Current seventh control verifies that explicit presentation
updates only winning histories after ranking.

SourceREV166:10,012 assigned/1,361 unassigned;21,189 narrative/184,470 backing;
920 outside-census artifacts. Prior roles/artifacts preserved;counts not adequacy.
Next remaining retained-read/mechanism and research-authority history.
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
route='''HQ-011 IN PROGRESS: ordinary-memory/recall/presentation history reconciled.
Start CAMPAIGN3_HISTORY_GA_MEMORY_RECALL_CHECKPOINT.md.
26 sources;37 fresh tests/eight publication mutations/10 structural faults PASS.
16 exact bindings/three unavailable old integration tests;four old faults report-only.
Current credit cannot rescue same-instant loss;recall is not automatic presentation.
Observed association gain3 control and two initial calibration failures preserved.
SourceREV166:10012 assigned/1361 unassigned;21189 narrative/184470 backing;920 artifacts.
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
