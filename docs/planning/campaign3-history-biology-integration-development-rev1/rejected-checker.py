"""Reconcile biological integration boundaries and preserved development cohorts."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-biology-integration-history-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/planning/BIOLOGICAL_PUBLIC_INTEGRATION_AUDIT.md': 'Functional18-behavior component used unchanged numerical TaskKey/Commitment nuclei privately; this was not typed public admission of biological Needs. Later native successor supplies homeostatic/hedonic/adopted-goal/protective source types and disjoint mutation owners without loosening frozen task vocabularies. Component JSON expression is not automatic public identity evidence. Later native qualification supersedes public-admission debt only within its finite profile; general identity/source joins retain their own gates.', 'docs/planning/BIOLOGY_PUBLIC_EXTERNAL_REVIEW_DISPOSITION.md': 'External review accepted within28 models/58 distinct public runs/270 selected prefixes, preserving53 component trajectories separately from2389 component prefixes. Current withdrawal, learned consumption harm and anticipated future withdrawal are three operands; forecast unqualified. Cue necessity applies only to Full, with KnownAccess retained. Biological pressure contributes reasons, not automatic choice/identity/Addicted trait/self-belief. NoReliefLearning affects both valuation and reinforced access, not pure relief ablation. No minimal axes, clinical calibration or unrestricted voluntary authorship claim; historical intake counters differ from current review.', 'docs/planning/biological-development-rev1/BIOLOGICAL_DYNAMICS_CONTRACT.md': 'Preserved pre-correction development contract, not successful qualification bytes. Exact lattice1000/ties-even, common prior reads, independent resources/regulators/tolerance/sensitization/satiation/displacement and denied sensor null remain. Later accepted contract appends elapsed/consequence separation: passive kinetics only elapsed, action effects without repeated decay, pre-adaptation consequenceState sensed120 and adaptation committed140. Whole-step world challenge cannot substitute for integrated ordering. Physical control/execution challenges are not intent commands; no clinical or minimal-variable law follows.', 'docs/planning/biological-development-rev1/BIOLOGICAL_INTEGRATION_CONTRACT.md': 'Rejected early integration contract preserves original sequence and fixed-neutral pleasure assumption. Later pre-freeze additions correct passive/action timing, consequence-before-adaptation, positive pleasure change rather than residual pleasure, acquired neutral target with BaselinePleasure comparator and cue-history access with KnownAccess comparator. Prior completed appraisal supplies delayed named stress pulse at next consequence boundary, not its own appraisal/earlier choice. Sensor calibration supports false observations without cognition reading truth. Development defects remain failures, not qualified trajectories. Biological identity learning, causal efficacy inference and natural exploration not granted.', 'docs/planning/biology-public-development-rev1/docs/formal/BIOLOGY_PUBLIC_CONTRACT.md': 'First public performance cohort contract: authenticated14-stage native pipeline, distinct physical/adaptation/learning/goals/affect ownership, unconditional reservations and observer-safe views. Interruption before first completed replay row is not behavioral failure or qualification. Exact contract bytes equal REV2 preserved contract; later accepted contract appends intrinsic-byte admission correction. Private task-shaped numerical intermediates never classify public biological sources.12..96 tick profile and selected native prefix proof do not establish organ-level biology or general forecasting.', 'docs/planning/biology-public-development-rev2/docs/formal/BIOLOGY_PUBLIC_CONTRACT.md': 'Second preserved public contract shares exact bytes with REV1 but belongs to a different source/execution cohort. Partial results and actual large-save property-enumeration failure remain separate from later successful REV3. Current contract appends strict plain Uint8Array intrinsic storage copy, rejects Buffer/subclass/proxy, ignores extra properties without invoking them, decodes external save once and compares replay whole bytes. This fixes incidental host enumeration ceiling without weakening state/queue/trace/RNG equality or changing biological laws.', 'docs/planning/biology-public-bookkeeping-rev1/docs/planning/CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md': 'Preserved bookkeeping snapshot with expanded blank lines and old closureREV1 link. Nonblank text differs from current qualification only at closureREV1 toREV2 reference, mechanically checked; not a second experiment or new behavior evidence. Preserve28models58runs270unique prefixes versus59 row executions273checks due duplicate row35 exclusive-create rejection.53 trajectories/2389component prefixes remain separate. Late first ComparisonCase wrapper and both failed/interrupted cohorts remain disclosed. Correct-forward current closure link does not retroactively change old bytes.', 'docs/planning/biology-public-development-rev1/PRESERVATION.json': 'Twenty exact source copies authenticate interrupted performance cohort. Four workers interrupted before first complete replay row; redundant serialization was removed with explicit successor source identity. No behavioral failure or successful qualification inferred. Nonfatal HMR warnings separate. Every artifact hash verified; available source bytes do not prove all execution results or fresh tests.', 'docs/planning/biology-public-development-rev2/PRESERVATION.json': 'Twenty-one exact source copies authenticate partial large-save-failure cohort. Reflect.ownKeys on long save exceeded property enumeration ceiling: actual public admission defect, not biological candidate rejection. Partial partition pointer is not completed matrix. All copies freshly hash verified, preserved source identity distinct from later intrinsic-byte correction. No historical writer rerun or old report substitution.'}
ip=P/'campaign3-history-source-roles-rev251/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
chain=[ref(p) for p in [P/'CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION.md',P/'CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md',P/'BIOLOGICAL_SYSTEM_DOMAIN_FINDINGS.md',P/'BIOLOGY_PUBLIC_DEVELOPMENT_FINDINGS.md',Path('docs/formal/BIOLOGICAL_DYNAMICS_CONTRACT.md'),Path('docs/formal/BIOLOGICAL_INTEGRATION_CONTRACT.md'),Path('docs/formal/BIOLOGY_PUBLIC_CONTRACT.md')]]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='BIOLOGICAL INTEGRATION HISTORY AND REJECTED COHORT',judgment=n,acceptanceChain=chain))
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def kind(source,pointer=''):
 return 'BACKING' if source.endswith('.json') and (pointer.startswith('/artifacts/') or pointer=='/partialResult') else 'NARRATIVE'
leaves=[];bindings=[];preserved=[]
back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
for p in notes:
 if not p.endswith('.json'):continue
 v=load(p)
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in v['artifacts']:
  actual=ref(x['preserved']);assert actual['sha256']==x['sha256']
  bindings.append(dict(receipt=p,original=x['path'],actual=actual))
  if actual['path'] not in entries and actual['path'] not in back:
   preserved.append(dict(**actual,method='EXISTING EXACT REJECTED BIOLOGY COHORT SOURCE; NO NEW COPY'));back.add(actual['path'])
old=P/'biology-public-bookkeeping-rev1/docs/planning/CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md';new=P/'CAMPAIGN3_BIOLOGY_PUBLIC_QUALIFICATION.md'
def nonblank(p):return [x for x in p.read_text(encoding='utf-8-sig').splitlines() if x.strip()]
assert [x.replace('BIOLOGY_PUBLIC_CLOSURE_REV1.json','BIOLOGY_PUBLIC_CLOSURE_REV2.json') for x in nonblank(old)]==nonblank(new)
a=P/'biology-public-development-rev1/docs/formal/BIOLOGY_PUBLIC_CONTRACT.md';b=P/'biology-public-development-rev2/docs/formal/BIOLOGY_PUBLIC_CONTRACT.md'
assert a.read_bytes()==b.read_bytes()
for old,current in [(a,Path('docs/formal/BIOLOGY_PUBLIC_CONTRACT.md')),(P/'biological-development-rev1/BIOLOGICAL_DYNAMICS_CONTRACT.md',Path('docs/formal/BIOLOGICAL_DYNAMICS_CONTRACT.md')),(P/'biological-development-rev1/BIOLOGICAL_INTEGRATION_CONTRACT.md',Path('docs/formal/BIOLOGICAL_INTEGRATION_CONTRACT.md'))]:
 assert current.read_bytes().startswith(old.read_bytes())
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='NINE BIOLOGY INTEGRATION HISTORY SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=preserved,exactBindings=bindings,schema=ref(O/'schema.json'),limits=['Planning and captured hashes do not establish completed replay; later qualifications preserve component/native distinctions.','Later bounded completion supersedes routing only within named profiles, not all ideal-loop phenomena.','No runtime/test/build rerun, source gap closure, law/model/verdict/corpus/obligation status change or historical adequacy claim.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS BIOLOGY INTEGRATION HISTORY',sources=len(sources),originalNarrativeOccurrences=sum(x['category']=='NARRATIVE' for x in rows),originalBackingOccurrences=sum(x['category']=='BACKING' for x in rows),stringLeaves=len(leaves),exactBindings=len(bindings),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
