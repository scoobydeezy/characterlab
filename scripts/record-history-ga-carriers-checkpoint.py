from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-carriers-rev1';I=P/'campaign3-history-source-roles-rev158'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaults']==19 and i['assignedSources']==9884
cp=P/'CAMPAIGN3_HISTORY_GA_CARRIERS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Requested and visual carrier history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Eleven sources;791 JSON string leaves;81 narrative/12
backing occurrences;20 exact bindings/three unavailable historical component versions.
No new archive. Requested carrier builder and both baseline reviewers reproduce
exactly,including19 symbolic faults. No current runtime or public replay was run.

Requested unavailable differs from unrequested. Safe products match actual requested
channels/holder/time;panel and visual can share one event detection while body alone
cannot create one. Unsampled panel does not retire active context. Perception receives
no truth binding,physical reason or registry resolver. Empty selection still enrolls
formation protocol;cue-only sensing does not. Selected encoding retains its actual
witness subset and preselection divisor;positive,known zero and unavailable differ.

Three corrections remain explicit rather than being hidden by successor PASS labels:

- The visual draft's supersession of delayed EncodingJoinInput was too broad.
  No-feedback is the immediate baseline. Authenticated earlier concern delivered
  before encoding is lawful;the baseline mutation cannot disprove that comparator.
- One experience ID/envelope did not prove reservation ordering. The component had
  labeled a late call phase10/120 after binding. The corrected path reserves after
  actual safe sampling,before tracking/binding;freeze14/124 reuses it. The successor
  transports optional1106,not a new reservation record. GSO-K is cited historical
  component evidence;this structural replay does not execute its runtime controls.
- Visual selection lacked actual role-claim transport. Its successor adds0..3 actual
  phase15/125 claims and preserves selected-only encoding. The same revision corrects
  acquisition ownership:positive producer130 allocates and owner140 reuses it.
  Source authenticity and atomic rollback remain separate public obligations.

Exact record deltas confirm only ReservedExperience and Claims are added to their
respective successor carriers. Earlier reviewers are not described as validating
these new fields. Three component hashes cited by the initial visual packet remain
unavailable after recorded local filename/archive/all-ref Git path searches. The
visual builder and old-component-content claims are excluded;the exact visual packet
and unchanged SEM registry suffice for the narrower original structural reviewer.

SourceREV158:9,884 assigned/1,489 unassigned;18,160 narrative/183,437 backing;
919 outside-census artifacts. Prior roles/artifacts unchanged;counts not adequacy.
Next calibration/execution-policy declarations and remaining authority/material
reconciliation. Formula343/Values90/15,formula pin,legacy log and historical exclusions
remain separate. HQ012 unstarted;exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
No production/model/allocation/verdict/corpus/obligation status changed. Jobs terminal.
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
route='''HQ-011 IN PROGRESS: requested/visual carrier history reconciled.
Start CAMPAIGN3_HISTORY_GA_CARRIERS_CHECKPOINT.md.
Eleven sources;exact requested builder/two baseline reviewers;19 original faults PASS.
Preserve lawful prior concern,early experience reservation,actual claim transport
and phase130 allocation/140 reuse corrections. Old reviewers do not cover new fields.
20 exact bindings/three unavailable old component versions;no new archive/runtime run.
SourceREV158:9884 assigned/1489 unassigned;18160 narrative/183437 backing;919 artifacts.
Next calibration/execution-policy declarations and remaining authority/material audit.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
