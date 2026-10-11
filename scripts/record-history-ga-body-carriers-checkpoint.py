from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-body-carriers-rev1';I=P/'campaign3-history-source-roles-rev160'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshSymbolicFaults']==22 and i['assignedSources']==9898
cp=P/'CAMPAIGN3_HISTORY_GA_BODY_CARRIERS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Body and surviving-child carrier history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 / 0**. Nine sources;575 JSON string leaves;83 narrative/28 backing
occurrences;18 exact bindings;no new archive or unavailable source.

Three original builders and two reviewers reproduce exactly,including22 structural
fault checks. These verify field/reachability/bound distinctions,not source authenticity,
actual state writes,loss execution or persistence. No runtime tests were added or run.

Body selection and cue consume the same safe source independently. Requested unavailable
samples remain different from unrequested channels;present zero remains evidence.
Panel/visual support may justify the shared experience without positive body evidence.
An actual empty selector owns1143,while its view borrows it and zero groups form nothing.
Cue carries signal/support/provenance,not intervals,context,selection ID or resolver.
Absent cue avoids memory read without waiving source/subject admission.

BodyREV2 required context on retained views but omitted its producer input. REV3 adds
only optional PerceivedTrialContextEvidence to BodyOpportunityEvidence. Actual
panel/experience/event/observer/time/support and completed producer bytes must match;
equal-looking context or experience ID alone cannot reconstruct observed stage. The
cue output stays unchanged. Selected views carry only own sample and actual companion,
not an archive of unselected source. Context grouping is not causal attribution.

A successful formation has one acquisition identity and separate selection provenance.
Its immutable trace-side evidence remains distinct from retained memory,which stores
only surviving children. No initial envelope,extra episode/child/fragment identity or
forgotten sibling resolver is admitted. Body children gain no visual strength/role/graph
fields. Fresh content has no self-authored credit;retained metadata is Boolean use and
directional presence,not count/score. Empty ordinary memory,graph and presentation
remain independently owned. Final child loss removes retained acquisition while
payload-free protocol history preserves formation without recovering content.

The proposed32 shared acquisition/source limit bounds pre-retention work;three children
per acquisition implies96 per-kind ceiling,but event/body do not each receive a separate
32-acquisition pool. These are construction bounds,not psychological capacities.
SourceREV160:9,898 assigned/1,475 unassigned;18,274 narrative/183,469 backing;
920 outside-census artifacts. Prior roles/artifacts unchanged;counts not adequacy.
Next body-source branch and remaining owner/carrier history;authority audit remains open.
Formula343/Values90/15,formula pin,legacy log and prior exclusions remain separate.
HQ012 unstarted;exitAuditREV111 unchanged;Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21. Jobs terminal.
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
route='''HQ-011 IN PROGRESS: body/surviving-child carrier history reconciled.
Start CAMPAIGN3_HISTORY_GA_BODY_CARRIERS_CHECKPOINT.md.
Nine sources;three exact builders/two reviewers;22 original symbolic faults PASS.
Body context attachment omission repaired;cue remains narrow. Acquisition/selection
and trace formation/retained survivors remain distinct;no forgotten-envelope archive.
18 exact bindings;no new archive/exclusion/runtime run. Shared32 pre-retention bound.
SourceREV160:9898 assigned/1475 unassigned;18274 narrative/183469 backing;920 artifacts.
Next body-source branch and remaining owner/carrier history;authority adequacy open.
All jobs terminal. Formula343/Values90/15 separate;formula pin,legacy log and prior
exclusions OPEN. Counts not adequacy. HQ012 unstarted;exitAuditREV111 unchanged.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling or obligation closure.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
