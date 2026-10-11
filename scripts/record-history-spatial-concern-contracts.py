from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev192/check.json');assert c['assignedSources']==10419
cp=P/'CAMPAIGN3_HISTORY_SPATIAL_CONCERN_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Spatial and prior-concern contract reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Eight component contracts reconciled with38 exact original narrative occurrences.
Selected child evidence, preselection allocation and prior-concern carriage retain
separate authority. This is source/claim review, not fresh runtime or test execution.

A selected capability retains only selected binding/claim closure, detached factors
and a bounded preselection peripheral count. The divisor is not recomputed from
winners. Any attempted consumption, including invalid joins or feedback/law checks,
consumes the capability. Structural consistency cannot authenticate fabricated
completed sources. Positive projection earns neither acquisition identity nor memory
admission; zero and unavailable rows stay evaluation-only under the intact law.
The retired-flat comparator's known-zero-to-positive behavior remains explicit.

Earlier concern is lawful input to a later acquisition; that acquisition's own later
consequence cannot determine its encoding retroactively. The visual carrier scope
correction preserves that distinction. Selection/role eligibility do not change when
Candidate A modifies peripheral allocation. Retrieval amplification is a separate arm.

The component formula P*(1-q),omegaA=1+q and peripheral zero at q=1 are Candidate A,
not final generic affect psychology. OD002 requires independent encoding/retrieval
responses and nonzero residual for the intended next candidate. A/B/C stay retained;
C6 is fixture-relative and does not promise to beat arbitrary recency advantages.
TaskConcern is a bounded source, not the general Affect representation. Known zero,
Unavailable and NoSelectedTask retain distinct source status despite baseline equality.
Matching subject/time fields do not discharge actual delivery/parent authentication.

The standalone visual cue uses the actual observer event counter after the panel
context ends. An active unsampled panel context is rejected, never silently closed
or replaced by a fabricated unavailable observation. Broader overlap/segmentation
and general public producer completeness are not earned by these component contracts.

SourceREV192:10,419 assigned/954 unassigned;131,740 narrative/211,268 backing;
1,192 indexed archives. Values post-cutoff reviews retain separate denominators.
Two Values/seven cognitive/80 exit-inventory/one scheduler identities,formula provenance,
legacy log,remaining material support and independent adequacy remain open. HQ012
unstarted;Campaign3 NOT EXIT-READY. No model/law/allocation/verdict/corpus/obligation
change.1519/0;108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-spatial-concern-contracts-rev1','campaign3-history-source-roles-rev192'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:eight spatial/prior-concern contracts reconciled.
Start CAMPAIGN3_HISTORY_SPATIAL_CONCERN_CONTRACTS_CHECKPOINT.md.
38 original narrative occurrences;earlier concern differs from retroactive consequence.
Candidate A hard-zero retained as comparator;encoding/retrieval arms remain distinct.
SourceREV192:10419 assigned/954 unassigned;131740 narrative/211268 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
