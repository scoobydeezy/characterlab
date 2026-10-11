from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-body-need-affect-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(O/'check.json')['occurrencesCount']==2792
cp=P/'CAMPAIGN3_HISTORY_EXIT_BODY_NEED_AFFECT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical embodiment, need and affect reconciliation — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling. Counters **1519 / 0**.

Reviewed34 rationale texts across2,792 exact occurrences:2,775 for Brief12.1,12.2
and12.5 (three family summaries/22 clauses), plus17 uses of the same retrieval
rationale in BRIEF-12.3-9. The initial checker stopped before reports because it
expected all repeated text to stay within the three families. Its successor explicitly
inspects the memory clause's affect-biased retrieval context and binds its evidence;
this does not accept the rest of the memory family. Both checker sources remain.

Historical reserve-only limits are superseded by separate sleep/control,
intoxication/control and tolerance evidence. Tolerance closes the disjunctive
repeated-exposure clause without claiming general sensitization. Sleep preserves
original nonzero acquired history; functional intoxication recovery is not complete
clearance. Explicit interval uncertainty atREV93 is stronger than merely lossy or
false sensing. Fixed midpoint/different quality affects a declared consumer while
hidden-source whole views stay equal; intervals are not calibrated probability.

REV92 supplies same-motive retained importance/current urgency, with fixed competing
reasons and later divergence after equal initial strength. Refold matches cached
Factored views using full history; FrozenProduct failure is not proof against every
scalar representation. Alternate-action substitution remains component-only; native
goal-route corroboration does not confer native admission on that experiment.

Chosen reappraisal and embarrassment each retain their component/public distinction
and later exact admission closure. Preserve equal projection coordinates, coarse
calibration equality, helper failures and rejected phase115 native embarrassment.
Threat with chosen continuation is distinct from execution failure or literal flight.
Actual prior affect alters retrieval at fixed memory/encoding/cue in component scope;
that does not qualify encoding/salience or native Save132 integration.

Most importantly, REV111 defeats body-only regulatory substitution: identical physical
history/sensation with different admitted harm evidence changes threat and strictly
later stress. Successful psychological ScalarThreat and earlier ScalarUncontrolled
retrieval reductions remain. Regulatory insufficiency does not establish vector
necessity or impossibility of arbitrary scalar encoding. No consumer or law was
invented or selected by this review. Stale family statements about uncertainty,
importance/urgency, retrieval and reduction now have explicit clause-scoped successor
interpretations; broader generality and joint family integration remain unearned.

Nine supporting source paths remain unassigned, explicitly listed in review.json:
Campaign2 completion plus four partial-coverage audits and their check reports for
body, motive, affect and memory. This does not waive their source review. Original111
snapshot hashes and existing scoped evidence-review hashes verify; no original audit
or source-role index changed.110 of181 queue texts are reconciled;71 remain, plus
other schema prose, inherited supports and independent adequacy.

SourceREV171 stays10,107 assigned/1,266 unassigned;22,514 narrative/184,919 backing;
920 outside-census artifacts. No new runtime simulation, test, build, verdict or corpus
freshness claim. Research bookkeeping is checked separately. Formula historical
identity, missing legacy log, Values90/15 and exclusions remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21;
1519/0. RO019 ACTIVE;RO021 mandatory and UNSATISFIED;RO022 CLOSED.
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
route='''HQ-011 IN PROGRESS:body/need/affect rationale chains reconciled.
Start CAMPAIGN3_HISTORY_EXIT_BODY_NEED_AFFECT_CHECKPOINT.md.
34 texts/2792 occurrences;three families plus17 explicit memory-clause uses.
Regulatory insufficiency preserves successful psychological scalar reductions.
Shared-context checker failure preserved;9 inherited support sources still unassigned.
110/181 queue texts reviewed;71 remain plus other schema/inherited support.
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
