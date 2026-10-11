"""Reconcile measurement carriage historical acceptance and distinguish recorded reproduction from fresh integrity."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-task-lifecycle-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def objects(v,p=''):
 if isinstance(v,dict):
  yield p,v
  for k,x in v.items():yield from objects(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from objects(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','scope','limitations','note','preservedOpen','qualification'])
ip=P/'campaign3-history-source-roles-rev222/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
names=['CAMPAIGN2_TASK_LIFECYCLE_QUALIFICATION.md','CAMPAIGN2_TASK_RUNTIME_REVIEW_1.md','CAMPAIGN2_TASK_LIFECYCLE_SELF_REVIEW_2.md','CAMPAIGN2_TASK_CYCLE_SELF_REVIEW_4.md','CAMPAIGN2_TASK_IDENTITY_ACTIVATION_EXPLORATION.json'];paths=[(P/n).as_posix() for n in names];assert all(p in ix['unassignedCandidatePaths'] for p in paths)
notes={}
notes[paths[0]]='Internal agent adversarial bounded lifecycle qualification, not external planning verdict or intact cognitive cycle. TC-A..L includes real two-kind identity, half-open windows, optional adoption, immutable terminal support, actual M1 satisfaction and forecast exclusion. Collision witness is actual component plus public closed-profile exclusion. Current-source seven mutants and24 focused tests differ from9 preservation,64 control combinations,17 declaration/68 model-state checks and974-test pre-hardening baseline; no fabricated aggregate suite. Reference config-loader failure and explicit-API328-test success distinct. Earlier intentional-mutant inherited shell exit preserved, corrected receipt exits0 after inspections. Historical live-list selection is research instrumentation, not generated pressure/workspace producer. No retained mechanism retired; PERSIST-I remains outside no-RNG lifecycle. Later shared-source refreshes are separate proof identities, not frozen model equality alone.'
notes[paths[1]]='Implementation-in-progress self-review under authorized autonomy. Model-owned deadlines allocated after original sources regardless adoption; exact actual S0 in RunIdentity. Private M1/clocks use registered subject projection, immutable target resolution and B0 priors with owned root373 changes; no motive/truth/occurrence side channel. Two discovered corrections enforce complete target resolution before collision sealing and same-instant observation time, even where public source already guarantees it.20 direct task checks and64 combinations did not prove unfinished whole regression. Pending historical comparisons, bootstrap adversaries and source refreshes close only via later scoped qualification. Full-save prefix validation preserves private associations; cannot use task status to stand in for intact cognition.'
notes[paths[2]]='Withheld shape corrected authored availability/adoption conflation: S0 may contain any declared-key subset, present values Open, absence not zero or implicit adoption. Runtime neither inserts nor removes task keys. Every declared key receives a deadline slot even if absent, preserving same-model coupling without creating character knowledge or motives. Structural target applicability does not read status; absent/terminal prior leaves state unchanged. Explicit one-spec CONTENT delegation replaces ambiguous empty fields; repeated references not independent criteria. Distinct concrete identities, half-open windows, status/time semantics and zero occurrence allocation preserved. Later field13 correction and bounded qualification supersede this proposal, not universal task cognition.'
notes[paths[3]]='Internal cycle design self-review separates adopted tasks, workspace, forecast-relative appraisal, affect and motives. Finite target/path resolution precedes whole-stage collision seal and only then B0 reads. CONTENT ValidationInvariants field13 gets explicit same-spec delegation. Exact parent output/event association is stronger than well-formed nested workspace or trace-ID lookup; no new mid-instant saves. Event-local TaskConcern is not a calibrated Reason modifier or automatically RecentExperience; governed role/provenance and historical consolidation required. Equal standing can activate only previously inactive nucleus when situations differ; first raw1/4 failed because bounded standing1/5 plus base1/11 stays below3/10. Corrected raw1/3 yields1/4 and crosses threshold. Symmetric control remains symmetric; no base after retirement produces no nucleus. No RNG, full arbitration, identity learning or generated source path. Historical motive/correlation/dice/identity mechanisms retained, not task-specific trait invention.'
notes[paths[4]]='Explicit historical research-component inputs, not generated Campaign2 intermediates or selected production calibration. Five exact reference-source fingerprints still match current bytes. Fresh independent Fraction checks verify all recorded base/activation values and threshold outcomes; they do not rerun historical compiler. Equal standing after bounded consolidation changes eligibility with unequal situations, not an already symmetric contest. Zero quantized modifiers coexist with relevance threshold change. Removing motive base leaves no nucleus despite standing/situation; no resurrected retired commitment. Failed raw1/4 assumption retained. No learning, efficacy, option generation, RNG or full arbitration qualification; concern-source mapping remains separately governed.'
explore=load(paths[4]);bindings=[]
for source in explore['sourceFingerprints']:
 assert ref(source['path'])['sha256']==source['sha256'];bindings.append(dict(original=source,actual=ref(source['path'])))
from fractions import Fraction as Q
base=Q(1,11);situation=Q(3,13);threshold=Q(3,10)
assert base+Q(1,5)<threshold<base+Q(1,4)
for label,standing,symmetric,retired in [('beforeStanding',Q(0),False,False),('insufficientStanding',Q(1,5),False,False),('afterStanding',Q(1,4),False,False),('retired',Q(1,4),False,True),('symmetric',Q(1,4),True,False)]:
 rows=explore[label];assert [x['option'] for x in rows]==['A','B']
 for row in rows:
  activation=base+standing+(situation if row['option']=='A' or symmetric else Q(0));eligible=not retired and activation>=threshold
  assert len(row['nuclei'])==int(eligible)
  if eligible:
   n=row['nuclei'][0];assert Q(n['base'])==base and Q(n['activation'])==activation and n['baseDie']==4 and n['standingModifier']==n['situationalModifier']==0
chain=[ref(P/'CAMPAIGN2_TASK_LIFECYCLE_QUALIFICATION.md'),ref(P/'campaign3-history-cognitive-reason-contracts-rev1/review.json')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert ref(p)['sha256']==entries[p]['sha256'];sources.append(dict(**ref(p),role='HISTORICAL TASK LIFECYCLE QUALIFICATION / CORRECTIONS / SCOPED IDENTITY EXPLORATION',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='All exploration JSON strings including short exact rational values and control labels; four Markdown documents preserve every original occurrence.'))
save('review.json',dict(status='FIVE TASK LIFECYCLE AND ACTIVATION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=[],schema=ref(O/'schema.json'),arithmeticCheck='PASS all five two-option cohorts with exact Fraction arithmetic, including failed1/4 and corrected1/3 standing witnesses; historical compiler not rerun.',currentHelper=ref('scripts/explore-task-identity-activation.mjs'),limits=['Stored exploration arithmetic and exact source integrity checked; no historical compiler, runtime, test, build or proof writer rerun.','Internal self-review is not external planning review. Component identity activation is not full generated cognitive cycle or selected calibration.','Historical source refresh claims retain separate receipt identities; frozen models alone do not authenticate changed runtime sources.','No model, law, allocation, verdict, corpus or obligation status change; prior gaps and independent adequacy remain open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS TASK HISTORY AND EXACT ACTIVATION ARITHMETIC',sources=5,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),arithmeticCohorts=5,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
