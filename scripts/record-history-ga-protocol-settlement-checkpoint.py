from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-protocol-settlement-rev1';I=P/'campaign3-history-source-roles-rev165'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['actualSchedulerTests']==11 and c['freshTests']==44 and i['assignedSources']==9986
cp=P/'CAMPAIGN3_HISTORY_GA_PROTOCOL_SETTLEMENT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Formation protocol and owner settlement history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Twenty-five sources;795 JSON string leaves;491 narrative/178
backing occurrences.44 current tests across seven files pass,including11 actual
scheduler fixtures. Fourteen current implementation/test/substrate hashes are recorded.
These historical test receipts identify names/paths/results,not an exact old checkout;
current execution is not attributed to an unspecified historical implementation.

Twelve historical receipts contain178 test occurrences across repeated cohorts.
Every name matches the current suite except the rejected AF-D in-place retry premise.
That initial5/6 receipt is preserved;the corrected test requires a failed scheduler to
remain terminal. The OJ-F13/14 receipt also remains:it assumed the first canonical unit
was alpha and read beta17 instead of42. Corrected fixture retains both and finds alpha
explicitly. Neither correction changed scheduler or retention policy. Other revision
notes concern TypeScript fixture shape;no fresh TypeScript pass is claimed here.

The placement decision genuinely distinguished authoritative canonical root A from a
new authoritative metadata log/replay B. Its explicit resolution records A accepted
by supplied planning ruling. Historical DECISION REQUIRED is therefore superseded,
not a current blocker. Preserve B for future chronology/compaction comparison.
Protocol lives in normal AuthoritativeState with its own exact authority,not memory,
Knowledge,evidence,diagnostic trace or mutable ContinuingRunInputs. Save132 stays intact.

Admission membership and successful formation are separate facts. Never-successful
admitted sources consume lifetime capacity;revisiting costs no new slot but cannot
form twice after success. Fixed-universe governance and bounded dynamic enrollment
are distinct components. Their64 ceiling is not public N. Whole union rejects N+1
atomically;content loss and restore cannot free slots or change N. The public boundary
must authenticate origins/subjects before enrollment and before empty formation skips
work,without giving persistent writes to the evidence producer.

Generic nonremoval and expected-old authority checks do not prevent authorized history
reset. The transition validator checks prior history against its own prior domain before
incoming membership,then derives and compares exact candidate metadata. It rejects
erased enrollment/success,changed identity/time,invented loss/survival,extra fields and
skipped enrollment. Incoming sources cannot repair already-invalid B0. Canonical sorting
is representation only. The earlier25-test cohort lacks the added PT-G case in26.

The owner join validates prior live memory and new formations against kind/identity/
original time,then runs actual recency retention. Only the issuing transaction's frozen
one-use result handle can finish;copied,foreign,repeated or closed handles reject.
Survivors come from the actual owner result,not a caller replacement list. Protocol
records partial/complete-loss disposition without deciding retention or reading child
content. Result handles are neither saved authority nor new occurrence identities.

Actual scheduler fixtures exercise empty enrollment without acquisition/output,
immediate total loss with retained success history,positive survival,N+1 rejection,
two-candidate commonB0 reconciliation and reversed terminal order at matched identities.
Late failure restores state,clock,queue,allocator,outputs and committed trace;failed
runs cannot retry in place. The trusted130 protocol hook in these fixtures is explicitly
different from the public write-free evidence producer. Primitive fixture state and
generic state-value reconstruction do not prove typed public origin/PRJ,Save132 byte
loading,full factory restart or all FJ-A..J. Those limits remain intact.

SourceREV165:9,986 assigned/1,387 unassigned;20,476 narrative/184,206 backing;
920 outside-census artifacts. Prior roles/artifacts preserved;counts not adequacy.
Next remaining ordinary-memory/retained-read and research-authority history.
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
route='''HQ-011 IN PROGRESS: formation protocol/owner settlement history reconciled.
Start CAMPAIGN3_HISTORY_GA_PROTOCOL_SETTLEMENT_CHECKPOINT.md.
25 sources;44 current tests including11 actual scheduler fixtures PASS.
Two failed historical premises preserved;178 report occurrences are repeated cohorts.
Canonical root A accepted;log/replay B retained. Admission/success/content stay distinct.
Prior validation,actual owner handles and rollback verified;no public Save132 claim.
SourceREV165:9986 assigned/1387 unassigned;20476 narrative/184206 backing;920 artifacts.
Next ordinary-memory/retained-read and research-authority history;adequacy remains open.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
