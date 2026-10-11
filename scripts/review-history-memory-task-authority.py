"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-task-authority-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/formal/MEASUREMENT_EPISODIC_MEMORY.md': 'Accepted whole-shape composition of M5rev4 and M1..M5; historicalpending superseded only shape scope.14schemas/minimalinventory/controltopology/prefixrestore, no runtimeproof fromheader. Observer-safe historicalepisode notcurrenttruth/belief/appraisal. Soleinsert-onlyformationviaPRJ/IDN and exactauthorizedrecallkey distinct. ExistingStateFamilyRegistryversion unchanged, episodicStorage data changes; projectioncollection serialization laterwrappergate, no globalregistry. No cue/episode/formation/paddingoccurrence/certificate/newwritecapability. Laterallocation/packet/runtime acceptance links preserved; MEMRpending historical, not current owner ruling.', 'docs/formal/TASK_COMMITMENTS.md': 'Formal0.1 symbolic lifecycle supersedes originaldraft in adoptable subset,0..2overlap, no deadlinecopy, field13specdelegation, absentNoChange and disjointhalfopenclock/measurementtargets. Separateholder/task/recurrence and prospectiveowner/route, unchangedtenfamilies. Source342nestedIDN immutabletargetresolution beforestagecollision thenprior, exactrecordedabsencereads. Oneobservation may satisfy two tasks without duplicatingsample. Deadlinesprivatecompiledforallkeys afteroriginalinputs independentadoption, no sourceoccurrence/outputordinal. Required taskmapkeyrole wording explicitly superseded by0.2record-keycorrection, notcurrentpermission for StateMapKey373. Quiescentexpiryafterlegitimatehandler differsREGpreinstantvalidity; wholeprefixauthenticatessupport not237shape. No unrestricted40source fromproposal, laterlifecyclepackaging excludesdeliberation. Historical TCpending closes only later boundedcomponent/publicqualification; dynamicadoption/social/efficacy/motive/identitynotimplied.', 'docs/formal/TASK_COMMITMENT_NUMERIC_PROFILE.md': 'Accepted additive numeric profile for corrected0.2 lifecycle, not broaderpsychology. Inclusive rationalreadinginterval l<=x<=u versushalfopentemporal a<=T<d, exactdeadlineT=d, postsettlementquiescentexpiry. Observationpoints tenths but authoredintervalendpoints anycanonicalrational in0..10, no snapping/conversion/normalization. No pressure/forecast/deadlinecopy/countdown/hostclock. Retainedobservationtime provenance checked. Keyorder no numericmagnitude. Derived17events=14+1+2 under100 is packagingaccounting notthenexecutedruntime, arbitraryoverloadstillfailure/noexemptdeadlines. Prior numeric/modelidentity unchanged; no RNG/calibration/fullTCclaim.'}
ip=P/'campaign3-history-source-roles-rev232/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
chain=[ref(P/'campaign3-history-memory-packaging-rev1/review.json'),ref(P/'campaign3-history-memory-qualification-rev1/review.json'),ref(P/'campaign3-history-task-lifecycle-rev1/review.json'),ref(P/'campaign3-history-task-packaging-rev1/review.json'),ref('docs/formal/TASK_COMMITMENT_KEY_ROLE_CORRECTION.md')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='FORMAL MEMORY/TASK AUTHORITY WITH SCOPED ACCEPTANCE AND CORRECTIONS',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE MEMORY/TASK FORMAL SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Shape acceptance and historical pending vectors retain chronology; later scoped qualification supplies actual evidence.','Task0.1 key-role wording corrected explicitly by0.2, not silently treated as current authority.','Exact rational interval eligibility differs from observation grid, temporalwindow and psychological calibration.','No runtime/test/build rerun, source gap/archive/model/allocation/verdict/corpus/obligation status change; adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS MEMORY/TASK FORMAL AUTHORITY HISTORY',sources=3,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
