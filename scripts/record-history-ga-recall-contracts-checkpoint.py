from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-recall-contracts-rev1';I=P/'campaign3-history-source-roles-rev169'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshOriginalMutations']==15 and c['freshTests']==29 and i['assignedSources']==10078
cp=P/'CAMPAIGN3_HISTORY_GA_RECALL_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Recall contract history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**.17 sources;560 JSON string leaves;272 narrative/114 backing
occurrences;13 exact original source/test/formal/reviewer bindings. No missing
source version or new archive in this batch. No production change.

29 fresh tests pass across canonical event recall,partition projection,partition
selection,independent graph membership and body recall. All15 original substitutions
fail their designated witnesses. Eight direct-access baseline cases are reused from
the previous24-test receipt. Original source commitments match;other dependencies
execute current versions. Six historical reports contain107 overlapping occurrences.
Repeated Vitest instances emitted MaxListenersExceededWarning;all runners terminated.

Direct contribution is cue strength on episodically retained keys. Learned spread is
exact solved activation minus exact seed,including positive-length return cycles.
Sum before one final rounding:quarter plus quarter at scale2 yields half;zero-graph
fifth cue has zero learned spread even if total quantization rounds down. Never clip
a negative residual or subtract an exact cue from rounded activation. Unit coefficients
remain a reference candidate,not final psychological calibration.

Independent graph membership cannot create episodes. Local zero contribution for an
episodic-only key means no influence from this graph,not negative evidence,unknown
observation or zero importance. All distinct retained keys remain in the averaging
denominator:activation3/5 for a among a,b yields3/10. The original kernel still rejects
unknown keys without the explicit composition. Graph-only cueing may mediate retrieval
of existing survivors but cannot reconstruct missing content or manufacture targets.

Event recall consumes actual presentation history and a separately admitted unit cue.
Missing history is empty,not synthesized from acquisition time. Absent cue validates
static calibration but reads no memory,graph or history. Present with zero scores
retains existing topK behavior;no new positivity threshold. Canonical acquisition ties
and inverse translation preserve identity;the decimal-label mutant fails closed rather
than returning a silently misidentified acquisition. Diagnostics and recalled content
omit retention metadata and do not write use,significance,graph or presentation state.

The historical CER-B assertion failed expected-false in REV1 (19/20),while REV2 passed
20/20. Its exact failure is preserved. Those receipts do not identify the intervening
implementation/test change,so this audit does not invent a production bug or fix story.
The current six-case canonical suite and original mutation checks are separate evidence.

Body recall uses binary cue matching and original acquisition recency,not group/view
count,intensity,importance or event scores. It returns all surviving co-acquired groups,
including noncued groups,without asserting current physiology. Zero bytes remain evidence;
missing groups stay missing;reads do not refresh time. The pure Absent branch validates
supplied memory. That is not a public read grant:the public producer must gate its state
reader independently,as the earlier publication audit verifies in its own scope.

Partitions use independent slot prefixes without borrowing or merged scores. Supplied
ranked identities are not remembered payload,workspace or presentation. Projection
validates the complete supplied owner value before filtering,including sibling state,
and admits only strictly prior acquisitions. Use/significance metadata is removed before
ranking. Protection-only changes leave actual body ranking equal. This trusted component
validation does not authorize broader public reads. Actual PRJ/IDN,source/subject binding,
canonical return shape and Save132 remain separate qualifications.

SourceREV169:10,078 assigned/1,295 unassigned;22,130 narrative/184,870 backing;
920 outside-census artifacts. Earlier roles/artifacts preserved;counts not adequacy.
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
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: recall contracts and projection history reconciled.
Start CAMPAIGN3_HISTORY_GA_RECALL_CONTRACTS_CHECKPOINT.md.
17 sources;29 current tests/15 original mutations PASS;13 exact source bindings.
Preserve historical CER-B failure;reports do not establish its intervening fix.
Graph-only knowledge cannot create episodes;component validation is not read authority.
SourceREV169:10078 assigned/1295 unassigned;22130 narrative/184870 backing;920 artifacts.
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
