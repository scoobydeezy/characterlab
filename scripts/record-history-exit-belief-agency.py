from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-belief-agency-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(O/'check.json')['occurrencesCount']==2109
cp=P/'CAMPAIGN3_HISTORY_EXIT_BELIEF_AGENCY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical belief and agency rationale reconciliation — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling. Counters **1519 / 0**.

Reviewed 15 rationale texts and all 2,109 occurrences for Brief12.4 and12.14 across
111 snapshots: two family summaries and seventeen clauses. Exact source hashes,
JSON pointers and status/text transition history are preserved. Existing qualification
and replay reviews are bound as support; their experiments were not freshly rerun.

The family summaries contain historical missing-capability language after later
clause qualification. The successor interpretation is now explicit: REV93 supplies
bounded uncertainty plus externally evaluated accuracy; REV97 supplies a controlled
two-cause diagnostic experiment; REV98 supplies cross-episode interference expectation
from distinct observed attempts. These supersede the corresponding missing-clause
statements, without qualifying general probability calibration, cause discovery,
trust, integrated native expectation-driven action or whole-family composition.
Family PARTIAL labels do not cancel the exact seventeen bounded clause witnesses.
Conversely, seventeen bounded clauses do not qualify joint family integration.

Agency0.1/0.2 limitations remain visible: later nonrecipient occurrence leakage and
exact intent-phase admission required the0.3 correction. INFER corrects reports about
one episode; it does not alone diagnose incompetence or learn a shared expectation.
The reinforcement discrepancy sequence remains a diagnostic of existing learning,
not a new surprise state. Interference retains denied-pair and post-report timing
findings and separate native/component replay surfaces.

The first checker expected only the two unassigned support paths seen in REV111.
Walking all historical revisions exposed a third: CAMPAIGN2_COGNITIVE_QUALIFICATION.md.
It stopped before writing reports. The preserved successor checks the exact three
paths, including CAMPAIGN3_IDENTITY_AGENCY_PARTIAL_COVERAGE_AUDIT.md and
IDENTITY_AGENCY_PARTIAL_COVERAGE_CHECK_REV1.json. All three still require whole-source
review. No historical qualification, audit or source-role index was rewritten.

Together with the prior corpus review,43 of181 original queue texts are reconciled;
138 remain, plus the other schema prose. The separate TRACKED corpus text remains
accounted for outside that original queue. No complete audit source is promoted.
SourceREV171 remains10,107 assigned/1,266 unassigned;22,514 narrative/184,919 backing;
920 outside-census artifacts. Next reconcile the remaining family/Brief rationale
chains and inherited support, then complete independent source adequacy.

Original snapshot and existing evidence-review hashes verify. No new runtime test,
build, simulation, law, verdict or corpus freshness claim. Research bookkeeping is
checked separately. Formula historical identity, missing legacy log, Values90/15 and
prior exclusions remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21;1519/0. RO019 ACTIVE; RO021 mandatory
and UNSATISFIED; RO022 CLOSED. No obligation status change.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:belief/agency rationale transitions reconciled.
Start CAMPAIGN3_HISTORY_EXIT_BELIEF_AGENCY_CHECKPOINT.md.
15 texts/2109 occurrences/two families/17 clauses;original111 snapshots unchanged.
Explicit successor interpretation of stale summary gaps atREV93/97/98;no joint pass.
Initial support-count failure preserved;third inherited Campaign2 source retained.
43/181 queue texts reviewed;138 remain plus other schema/inherited support.
SourceREV171 unchanged:10107 assigned/1266 unassigned;22514 narrative/184919 backing;
920 artifacts. Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
Independent adequacy/HQ012 unstarted. Campaign3 NOT EXIT-READY.
1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
