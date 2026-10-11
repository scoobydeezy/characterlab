"""Publish the early GA component-history review after tests and fault replay finish."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-ga-components-rev1';I=P/'campaign3-history-source-roles-rev148'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');i=load(I/'check.json');assert c['freshTests']==72 and c['freshFaults']==28
cp=P/'CAMPAIGN3_HISTORY_GA_COMPONENTS_CHECKPOINT.md';assert not cp.exists(),'Do not append chronology twice.'
text=f'''# Early GA component history — 2026-10-07

**LOCAL DISPOSITION — no owner ruling required.** HQ-011 remains open.
Counters **1519 /0**. Seventeen whole sources/878 JSON string leaves;
87 narrative/269 backing occurrences and70 exact source bindings.

Fresh72 tests in11 current-source files pass, matching the original assertion
multiset:49 component checks plus23 retained attention checks. The latter retain
their finite public-selector scope; they do not qualify public encoding or learned
memory. Fresh28 original fault probes also reproduce every baseline and mutant
result exactly:7 mathematics,6 tracking,5 spatial,5 selected encoding and5 isolation/
budget controls. No fault assertion or original receipt was weakened or overwritten.

The fault replay pins the SHA-exact historical attention-selection implementation
and original eight-sweep marker tracker. Current tracker code has separate fixed
nine- and ten-sweep successors, so it is not silently substituted for old bytes.
The eight-sweep source was reconstructed by reversing those factory/limit extensions;
its SHA exactly matches the original qualification. This is labeled reconstruction,
not Git recovery. The original September11 closure plan was recovered as an exact
Git blob. All70 bindings resolve; no new unavailable-source exclusion in this batch.

Preserve the original witness gap: UnitBudget1 with at mostthree raw3/10 Actors
never reaches the shared-law normalizing branch. SmallBudget1/5 supplies the actual
contrast: two/three Actors yield1/2 versus1/3. Hybrid keeps important Actor3/13,
leavingzero remaining budget; one/two low Participants get1 versus1/2 each. Its total
can exceed1 and the declared budget. Neither label authorizes clipping or replacing
x/max(B,sumx) withB*x/max(B,sumx). All four named laws remain distinct controls.

Encoding strength and graph competition are separate. Independent/Hybrid keep
strength3/13 and edge5/100; Shared changes strength1/2→1/3 and edge25/100→11/100.
Flat keeps strength1 while overflow changes the edge1→1/2. Exact spreading solve
precedes quantization; beta0 stays a local comparator. Mean associative pull differs
from sum, and successful presentation is a later writer obligation. The component's
synthetic cue and hypothetical additional timestamp do not establish actual recall,
reinforcement authentication, state ownership or persistence.

SpatialPeripheral means known position outside a declared rectangle, not Incidental
causal role. Unknown position receives no allocation and consumes no pool; knownzero
is explicit. The complete spatial pool is allocated before selection. Selected
encoding consumes the actual capability once, even on invalid calibration; R andA
remain distinct despite equal baseline values, and Need/Surprise are Disabled rather
thanObservedZero. Homogeneous3/10 is a calibration, not inferred category evidence.

Tracking uses actual SEM continuants and unique current/prior observed glyphs;
physical identity swaps can preserve mistaken continuity. Missing/colliding glyphs
fragment without inventing truth repair. Dense-list correction is an earlier rejection
boundary: the prior implementation also rejected sparse input later without publishing
state. Isolation controls separately preserve immutable constants, detached role
factors and dense arithmetic inputs. No new psychological owner follows from these fixes.

The current closure plan's September14 ordering correction and September20 bounded
closure supersede its old routing. Preserve the methodological finding that163record
allocations/67templates/17crosswalk revisions preceded the owed arithmetic comparison.
The later ratified feedback edge stays transient character-state→attention;
TaskConcern is not general Affect and A/B/C remain unresolved alternatives.

SourceREV148:{i['assignedSources']}assigned/{i['unassignedWithinThisIndex']}unassigned;
{i['originalNarrativeOrFindingOccurrences']}narrative/{i['originalBackingOccurrences']}backing;
{i['explicitArchivesOutsideCensus']}outside-census artifacts. Prior roles and911 backing artifacts
unchanged. Counts remain accounting,not adequacy. No production/model/allocation/
verdict/corpus/obligation change. All processes terminal. Next earlier component
development receipts and the later symbolic owner/source/feedback/retention history;
do not call that whole history closed from these17sources. Earlier formula/legacy-log
and historical provenance exclusions remain. HQ012unstarted;Campaign3NOTEXITREADY;
108verdicts;132bounded;55/58wrappers;corpus0.29.0/21;exitAuditREV111 unchanged.
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
route=f'''HQ-011 IN PROGRESS: earlyGA component claim history reconciled.
Start CAMPAIGN3_HISTORY_GA_COMPONENTS_CHECKPOINT.md.
17sources/878JSONstrings;fresh72tests/28originalfaultprobes PASS;70exactbindings.
Historicalattention/trackingpinned forfaults;exactoldclosureplanGit andSHA-exact
pre-successor trackingreconstruction preserved. No newunavailablebinding.
UnitBudget witnessgap/SmallBudget contrast/hybridnonconservation,graphoverflow versus
strength,Unknown/Disabled/zero andspatial-versuscausalrole distinctions retained.
SourceREV148:{i['assignedSources']}assigned/{i['unassignedWithinThisIndex']}unassigned;{i['originalNarrativeOrFindingOccurrences']}narrative/{i['originalBackingOccurrences']}backing;{i['explicitArchivesOutsideCensus']}outside-census artifacts.
Next earliercomponent developmentreceipts,then symbolicowner/source/feedback/retention
history. Alljobs terminal. No owner ruling orobligationclosure. Counts notadequacy.
Formula343/Values90/15 separate;formula pin,legacylog,GAprovenance andearlierhistorical
exclusions OPEN. HQ012unstarted;exitAuditREV111unchanged. Campaign3NOTEXITREADY.
1519/0;108verdicts;55/58wrappers;132bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
'''
cur.write_text(head+route,encoding='utf-8',newline='\n');a=Path('AGENTS.md');text=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-07):**';pos=text.index(needle);text=text[:pos]+needle+'\n'+route+'\n'+text[pos:].replace('**Current routing','**Prior routing',1);a.write_text(text,encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=added,exactChronology=True)))
