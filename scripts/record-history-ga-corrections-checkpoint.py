"""Publish first-review correction evidence with historical sources preserved."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-corrections-rev1';I=P/'campaign3-history-source-roles-rev149'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshFaults']==17 and c['freshPairedWitnesses']==5
cp=P/'CAMPAIGN3_HISTORY_GA_CORRECTIONS_CHECKPOINT.md';assert not cp.exists(),'Do not append chronology twice.'
text=f'''# GA component development corrections — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Ten whole sources, 295 JSON string leaves, 13 narrative
and 88 backing occurrences, with 19 exact source bindings.

The original mathematics, selected-encoding and marker-tracking implementations
were reconstructed by reversing their documented corrections. Each reconstructed
file exactly matches its original receipt's SHA. They are labeled reconstructions,
not recovered Git blobs or independent proof of when the changes occurred. All
three original reviewers were then replayed with those exact sources: 17 fault
probes reproduce every original baseline and mutant result. Earlier receipts remain
unchanged. No unavailable source binding was added by this batch.

Five fresh paired witnesses demonstrate what the original checks missed:

- Mutating an exposed role rational changed the next target strength from243/1243
  to0 in the old encoder. A fresh returned role copy prevents that internal alias;
  the detached returned value itself may still be mutable.
- Mutating the shared one constant changed the later response to1/100 rather than
  1/2. Mutating shared zero changed empty-history accessibility to99 rather than0.
  Freezing the private constants prevents both cross-call effects.
- A sparse raw array passed the old arithmetic boundary and produced an output
  hole. The corrected component rejects it as a non-dense array.
- Sparse tracking failed with a TypeError in the old implementation and rejects
  at the explicit dense-list boundary after correction. Both versions preserve the
  complete private snapshot and accept an empty dense retry with the same original
  observation. This is earlier rejection, not a repaired partial-state publication.

The three original reviews passed their narrower tests while those additional
properties remained untested. Forward reviews preserve all17 original fault rows
and add the correction controls; no original PASS is inflated into proof of complete
isolation. The five historical test receipts contain37 assertions, all preserved
in the prior batch's72 passing tests. That72-test execution is reused, not rerun.

These are representation, input-admission and component-isolation corrections.
They select no psychological law, change no accepted version or global ExactRational
behavior, and establish no public memory writer, source authority or persistence.
UnitBudget's missing normalization witness and the later SmallBudget comparison
remain distinct from these fixes. Disabled channels and absent evidence remain
distinct from known zero.

SourceREV149: {i['assignedSources']} assigned / {i['unassignedWithinThisIndex']} unassigned;
{i['originalNarrativeOrFindingOccurrences']} narrative / {i['originalBackingOccurrences']} backing;
{i['explicitArchivesOutsideCensus']} outside-census artifacts. Prior assignments and913 artifacts
are unchanged. Counts are accounting, not adequacy. No production, model, allocation,
verdict, corpus or obligation status changed. All processes are terminal.

Next: later GA source, acquisition/recall, feedback, presentation, attribution and
retention registration history. Start GA_SOURCE_STAGE_CLOSURE_REV1.md and the
corresponding stage-closure packets. Keep symbolic acceptance, component execution
and later public qualification separate. Earlier formula/legacy-log and historical
source exclusions remain for final HQ-011 adequacy. HQ012 is unstarted; Campaign3
is NOT EXIT-READY.108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21;
exitAuditREV111 unchanged.
'''
cp.write_text(text,encoding='utf-8',newline='\n')
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
head=old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]
route=f'''HQ-011 IN PROGRESS: GA component development corrections reconciled.
Start CAMPAIGN3_HISTORY_GA_CORRECTIONS_CHECKPOINT.md.
10 sources; fresh17 original fault probes and5 paired correction witnesses PASS.
Three SHA-exact pre-correction reconstructions;19 bindings;no new unavailable source.
Role/constant aliases changed later unchanged-input calls; sparse raw admitted holes.
Old sparse tracking already rejected without state publication; early guard distinct.
37 historical assertions preserved in prior72-test execution,reused not rerun.
SourceREV149:{i['assignedSources']} assigned/{i['unassignedWithinThisIndex']} unassigned;{i['originalNarrativeOrFindingOccurrences']} narrative/{i['originalBackingOccurrences']} backing;{i['explicitArchivesOutsideCensus']} outside-census artifacts.
Next GA_SOURCE_STAGE_CLOSURE_REV1.md and acquisition/recall,feedback,presentation,
attribution/retention packets. All jobs terminal. No owner ruling or obligation closure.
Formula343/Values90/15 separate;formula pin,legacylog,GAprovenance andearlier historical
exclusions OPEN. Counts notadequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108verdicts;55/58wrappers;132bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
cur.write_text(head+route,encoding='utf-8',newline='\n');a=Path('AGENTS.md');text=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=text.index(needle);text=text[:pos]+needle+'\n'+route+'\n'+text[pos:].replace('**Current routing','**Prior routing',1);a.write_text(text,encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=added,exactChronology=True)))
