from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-reserve-bridge-rev1';I=P/'campaign3-history-source-roles-rev162'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshCurrentMutationFaults']==10 and c['freshTests']==13 and i['assignedSources']==9919
cp=P/'CAMPAIGN3_HISTORY_GA_RESERVE_BRIDGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Local-reserve bridge and source schedule history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Fourteen sources;768 JSON string leaves;380 narrative/91 backing
occurrences;11 exact bindings and7 unavailable intermediate source/test bindings.

13 fresh cue/selection baseline tests pass. Ten original sample-bridge/opportunity
mutation definitions are applied once each to explicitly hashed current sources;
every original designated witness fails as expected. These are separately identified
current fault checks,not reproduction of unavailable historical implementation bytes.
All generated mutation reports are preserved. The terminal runner exits successfully;
its listener-count warning does not replace or negate the individual assertions.

The prior31 source/observation/recall/panel and42 goal/composition test receipts are
reused without rerun. Six historical baseline receipts contain152 test occurrences
but53 distinct exact names,all accounted for. Source baseline grows7 to8 tests;
bridgeREV1/REV2 repeat the same37 names,opportunity adds four branch tests for41,
and physical schedule contains22 composition cases includingSC-V.

Seven cited intermediate versions remain unavailable after directed local filename,
all-ref Git path history and prior-archive search;one was already recorded inREV161.
Exact historical implementation-content claims are excluded. Six older physical-source
mutations remain report-only,with their original definitions,witnesses and reported
failures preserved. Current passing tests do not substitute for missing bytes.

The schedule correction is material:the old host fixture calculated a replenishment
from hidden body state immediately before same-instant current sensing. Fixed external
preparations7@20,17@40,17@60 at phase110 now precede current21/41/61 phase10. Initial21@0
with rate1 already yields20@1;zero delivery remains a separate control. Outcomes
13/3/3/13 at4/24/44/64 phase110 precede consequence120. These inputs stay fixed under
physiology interventions instead of silently restoring the desired baseline. Four
Before bins remain[20,21]. SC-V checks literals/baselines;component execution is not
public scheduler/owner/patch/trace qualification.

The bridge validates the complete requested-channel set before allocating actual
observations. Unrequested channels are not sampled. Exact new producer version and
safe signal companion do not authenticate a public original,PRJ subject or completion;
the outer transaction still owns allocator rollback. Matching codec/version alone is
insufficient provenance. Selection and cue share evidence without sharing capacity.

Direction acceptance also corrects the initial draft:actual admitted present evidence,
not permission alone,justifies experience. Same-time distinct opportunities and
current/consequence retain separate identities;multiple views share one opportunity.
Support-only227 can name unselected observations but grants no numeric lookup.
Fallible attribution cannot be inferred from shared experience. Body acquisition
belongs to ordinary memory lifecycle,not a sidecar. Historical1143 reuse was unresolved
then;later reviewed carriers distinguish selection provenance from acquisition identity.
No current owner blocker is created by that historical wording.

SourceREV162:9,919 assigned/1,454 unassigned;18,748 narrative/183,588 backing;
920 outside-census artifacts. Prior roles/artifacts preserved;counts not adequacy.
Next remaining actual producer/owner/carrier history,then authority adequacy.
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
route='''HQ-011 IN PROGRESS: local-reserve bridge/source schedule history reconciled.
Start CAMPAIGN3_HISTORY_GA_RESERVE_BRIDGE_CHECKPOINT.md.
14 sources;13 fresh baseline tests/10 original mutations on current sources PASS.
Prior31/42 suites reused;152 historical test occurrences/53 distinct names accounted.
11 exact bindings/seven unavailable intermediate versions;six old faults report-only.
Fixed earlier deliveries replace hidden same-instant repair;public provenance separate.
SourceREV162:9919 assigned/1454 unassigned;18748 narrative/183588 backing;920 artifacts.
Next remaining actual producer/owner/carrier history;authority adequacy remains open.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
