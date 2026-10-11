"""Record goal carrier and qualification-projection history."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-goal-carriers-rev1';I=P/'campaign3-history-source-roles-rev151'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshTests']==42
cp=P/'CAMPAIGN3_HISTORY_GA_GOAL_CARRIERS_CHECKPOINT.md';assert not cp.exists(),'Do not append chronology twice.'
cp.write_text('''# Goal carriers and qualification projection — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Fourteen whole sources; 1,107 JSON string leaves;
135 narrative and57 backing occurrences;29 exact bindings with no new exclusion.

Two original inventory builders reproduce their full committed outputs: revision1
has20 records/61 fields; revision2 has21/63. Both original structural reviewers
reproduce all12 mutants each. Revision3 changes only the delivery record's Carry
to optional and adds SourceAt, plus its documented absence metadata. The revision2
reviewer is not claimed to accept revision3's new optional grammar.

The representation correction is supported by a fresh witness: physical interval462
rejects zero width and accepts positive width, while the goal component accepts a
point desired interval. Similar field layouts do not make those domains interchangeable.
OriginalAddress reuses the compiler's zero-based unsigned event index; correct shape
never substitutes for exact run, schedule, subject and producer authentication.

Narrow projection preserves qualification direction, negative reason or exact absence
cause without carrying numerical assessment, desired range or source payload. Different
numerical bases can yield the same projection. Full distance/position information could
otherwise reconstruct an earlier sample despite having no RawSample field. The four
original projection mutants are freshly detected: copied assessment, erased deterioration,
collapsed absence and indeterminate-as-no-change. Each retained mutant report has one
expected failure among seven assertions; these are controls, not production regressions.

All42 current assertions pass: seven qualification/projection, four scheduler-handoff
and31 source-composition tests. They contain all19 named assertions in the historical
receipt. The current composition includes23 later controls and is not asserted to be
the original loaded implementation. Supplied later use remains an explicit comparator;
actual-read use is separate. The handoff fixture crosses goal withdrawal, rolls back
producer/receiver commit failures, continues trusted snapshots and cannot restore a
lost target. Its trusted tuples and snapshots do not qualify canonical public ingress,
Save132 or complete-prefix authentication. No fresh TypeScript check is claimed.

The old maintenance-goal source was reconstructed by removing the later, separately
versioned deadline function. Its bytes exactly match SHA
`d69e73dc8a05ddfa2aa571d0f5d907a5e5203607c5899ee9d8fe8e729c0d23f3`.
This is labeled a reconstruction, not a recovered Git blob or independent chronology.
Original receipts and source commitments remain unchanged.

SourceREV151:9,790 assigned /1,583 unassigned;17,473 narrative /183,089 backing;
917 outside-census artifacts. Counts are accounting, not adequacy. Prior assignments
and916 artifacts remain unchanged. No production code, model, record allocation,
verdict, corpus or obligation status changed. All processes are terminal.

Next: GA identity-role inventory revisions and their field/namespace corrections,
then output/occurrence and complete registration packaging. Component provenance
and earlier source exclusions remain explicit. Formula343/Values90/15, formula pin
and legacy-log provenance still require final HQ-011 adequacy. HQ012 is unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21;exitAuditREV111 unchanged.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';r=load(rp);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[(I/n).as_posix() for n in ['index.json','check.json']]+[cp.as_posix()];added=0
for p in paths:
 if p in existing:continue
 r['reportReviews'].append(dict(path=p,obligations=obs));added+=1
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: GA goal-carrier/projection history reconciled.
Start CAMPAIGN3_HISTORY_GA_GOAL_CARRIERS_CHECKPOINT.md.
14 sources;24 original structural faults,four projection mutants and42 current tests PASS.
All19 historical named assertions retained;current composition has23 later controls.
Two exact inventory reconstructions;point-goal versus positive-width sample witness.
One SHA-exact pre-deadline goal source reconstruction;29 bindings;no new unavailable source.
Narrow qualification is not numerical assessment or producer authentication.
SourceREV151:9790 assigned/1583 unassigned;17473 narrative/183089 backing;917 outside-census artifacts.
Next GA identity-role inventory revisions, output/occurrence and full registration packaging.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacylog and earlier
historical exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108verdicts;55/58wrappers;132bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
head=old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0];cur.write_text(head+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle);s=s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1);a.write_text(s,encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=added,exactChronology=True)))
