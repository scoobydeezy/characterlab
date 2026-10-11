from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-personstate-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/PERSONSTATE_PUBLIC_CONTRACT.md': 'Accepted0.2: learned conduct impression and fallible current cue separate; current cue replaces even when absent, no stale intention. Actual target reasons/dice intent70/expression80/execution110 precede observer appraisal130 and conduct learning140. Fixed default policy is research control, not earned personality. Split/Pooled/HistoryOnly/CueOnly/PrivateGoalOracle retained; appraisal consumer, no observer action.', 'docs/planning/PERSON_STATE_DISSOCIATION_READINESS.md': 'Prospective distinction and comparisons, not evidence by itself. Observer impression acquired from conduct rather than copied private trait. Same history/different cue and hidden context comparisons; controlled identity/report channel, no natural intention recognition or universal timescale. Actual accepted consumer is appraisal/affect.', 'docs/planning/CAMPAIGN3_PERSONSTATE_QUALIFICATION.md': 'VER-C3-PERSONSTATE-001:8 models28 runs168 prefixes140 advancing28 terminal;35/328 tests/build historical. Prior two helps/one decline gives2/3 impression while A incorrectly estimates current intent0 and B1. Goal-only reverses adverse meaning without changing estimates/action. Missing/neutral/negative and failed conduct distinct. Five-request later safe views, balanced exact1/2 dice and private Oracle retained. No earned disposition law or observer action.', 'docs/planning/PERSONSTATE_DEVELOPMENT_FINDINGS.md': 'Three material construction/proof limits: record renumbering accidentally changes inherited occurrence namespaces before execution; four-request terminal intervention lacks later privacy evidence; passing0.1 appraisal50 precedes intent70, testing prediction rather than already-formed intent inference. Fifth request and0.2 appraisal130 repair different gaps. Old source/models/plan preserved, interrupted aggregate not PASS; no new allocation.', 'docs/planning/personstate-rev1/PERSONSTATE_PUBLIC_CONTRACT.md': 'Superseded0.1 authority: appraisal50 precedes target decision60/intent70. Whole document compared to successor; inference laws/source/ownership/limits retained but ordering inadequate for intended present-intention phenomenon. Corrected0.2 explicitly revises temporal ordering. Old contract not qualified despite passing tests.', 'docs/planning/personstate-rev1/PERSONSTATE_PUBLIC_ALLOCATION_TABLE.json': 'Superseded0.1 allocation metadata bound to preserved contract; exact record IDs1148..1164 and namespace1173 retained in0.2. Versioned semantics change without new records; allocation identity does not establish behavioral equivalence.', 'docs/planning/PERSONSTATE_PUBLIC_PLAN_REV2.json': 'Original28-run/eight-model prospective roster for0.1. Authenticate old path bindings against exact preservation archives, unchanged inputs but distinct successor model/run identities. Interrupted public aggregate has no PASS; never add prospective runs to qualified28.', 'docs/planning/PERSONSTATE_PUBLIC_PLAN_REV2.json': 'Corrected0.2 prospective28-run/eight-model roster binds final contract/code/five-request fixtures and original experiment/comparison commitments. Refrozen identities reflect changed timing; same scope wording does not erase predecessor flaw.', 'docs/planning/PERSONSTATE_PUBLIC_RESULT_REV2.json': 'Qualified28-row168-prefix aggregate from four workers. Fresh decoded stored assertions confirm original contrasts/whole later views and output hashes, not new simulation. Historical140 advance28 terminal remain distinct.', 'docs/planning/PERSONSTATE_CLOSURE_REV1.json': 'Original closure freshly validates final models/allocations/source/plan/result/workers,35/328 tests/build and52 preservation artifacts. Historical1164/0. Integrity and stored contrasts do not rerun168 restores or fault tests.', 'docs/planning/PERSONSTATE_PRESERVATION_REV1.json': '52 exact archived artifacts preserve namespace error, four-request fixture/harness, superseded0.1 source/contract/model bytes/plan/tests. Authenticate all hashes, including nested11-artifact preservation. No prior public qualification invented.', 'docs/planning/personstate-rev1/PRESERVATION.json': 'Eleven exact old sources plus pointers to original plan/models/tests. Explicit interrupted aggregate, no public PASS. Earlier35 passing tests did not establish desired causal ordering; later0.2 refreeze required.', 'docs/planning/PERSONSTATE_TESTS_REV1.json': 'Historical35 PASS under initial fixture; terminal-only hidden intervention cannot establish later provenance safety. Same suite lineage, not35 additional independent final tests.', 'docs/planning/PERSONSTATE_TESTS_REV2.json': 'Historical35 PASS after fifth-request extension but before appraisal ordering correction. Test explicitly expected appraisal50, which precedes formed intent70. Green suite not desired current-intention phenomenon.', 'docs/planning/PERSONSTATE_TESTS_REV3.json': 'Final historical35 PASS includes22 stages plus commit, three contested faults, actual appraisal130/intent70/execution110 phases, ownership/input/save and behavior/privacy. Replaces earlier35 cohorts; not freshly rerun.', 'docs/planning/PERSONSTATE_REFERENCE_TESTS_REV1.json': 'Historical328 PASS reference assertions; labels/paths/timings are backing to reviewed mechanisms, not new person-state findings or fresh suite execution.', 'docs/planning/PERSONSTATE_BUILD_REV1.json': 'Historical PASS for five-request fixture/source before corrected0.2 timing; successful build does not prove intended psychological phenomenon.', 'docs/planning/PERSONSTATE_BUILD_REV2.json': 'Historical final0.2 boundary/TypeScript/Vite PASS, not fresh build.', 'docs/planning/personstate-public-workers-rev2/0.json': 'Worker partition0: modulo4 roster and row identities, output/two observer-view hashes and complete aggregate authenticated. Fresh28-view original assertions retain wrong current intent despite2/3 impression, later privacy, no stale cue and contested dice; not fresh168-prefix runtime replay.', 'docs/planning/personstate-public-workers-rev2/1.json': 'Worker partition1: modulo4 roster and row identities, output/two observer-view hashes and complete aggregate authenticated. Fresh28-view original assertions retain wrong current intent despite2/3 impression, later privacy, no stale cue and contested dice; not fresh168-prefix runtime replay.', 'docs/planning/personstate-public-workers-rev2/2.json': 'Worker partition2: modulo4 roster and row identities, output/two observer-view hashes and complete aggregate authenticated. Fresh28-view original assertions retain wrong current intent despite2/3 impression, later privacy, no stale cue and contested dice; not fresh168-prefix runtime replay.', 'docs/planning/personstate-public-workers-rev2/3.json': 'Worker partition3: modulo4 roster and row identities, output/two observer-view hashes and complete aggregate authenticated. Fresh28-view original assertions retain wrong current intent despite2/3 impression, later privacy, no stale cue and contested dice; not fresh168-prefix runtime replay.'}
specs['docs/planning/PERSONSTATE_PUBLIC_PLAN_REV1.json']='Superseded0.1 prospective28-run/eight-model roster. All original path bindings authenticate against exact preserved source or unchanged current files. Same inputs but distinct0.2 model/run identities; interrupted aggregate has no public PASS. Do not add prospective runs to qualified28.'
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'PERSONSTATE_CLOSURE_REV1.json'),ref('scripts/qualify-personstate-public.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='PERSONSTATE AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'PERSONSTATE_PUBLIC_RESULT_REV2.json');plan=load(P/'PERSONSTATE_PUBLIC_PLAN_REV2.json')
assert v['planSha256']==ref(P/'PERSONSTATE_PUBLIC_PLAN_REV2.json')['sha256']
assert len(v['results'])==len(plan['runs'])==28 and sum(r['prefixes'] for r in v['results'])==168
for i,r in enumerate(v['results']):
 assert set(r)==set('law pressure goal name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('PERSONSTATE_TESTS_REV3.json',35),('PERSONSTATE_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for n in ['PERSONSTATE_TESTS_REV1.json','PERSONSTATE_TESTS_REV2.json']:
 t=load(P/n);assert t['success'] and t['numPassedTests']==35 and t['numFailedTests']==0
for n in ['PERSONSTATE_PRESERVATION_REV1.json','personstate-rev1/PRESERVATION.json']:
 for a in load(P/n)['artifacts']:assert ref(a['path'])==a
oldplan=load(P/'PERSONSTATE_PUBLIC_PLAN_REV1.json')
for a in oldplan['artifacts']:
 candidates=[Path(a['path']),P/'personstate-rev1'/Path(a['path']).name]
 assert any(c.exists() and ref(c)['sha256']==a['sha256'] for c in candidates),a['path']
assert len(oldplan['runs'])==28
for old,new in zip(oldplan['runs'],plan['runs']):
 for k in ['law','pressure','goal','name','orderedInputs']:assert old[k]==new[k]
 for k in ['modelIdentity','runIdentity']:assert old[k]!=new[k]
old=(P/'personstate-rev1/personstateModel.ts').read_text();new=Path('src/campaign3/personstateModel.ts').read_text()
assert "['appraise-a',50]" in old and "['appraise-a',130]" in new
assert new.index("['execute',110]")<new.index("['appraise-a',130]")<new.index("['learn-a',140]")
old=(P/'personstate-development-rev1/personstateMath.ts').read_text();new=Path('src/campaign3/personstateMath.ts').read_text()
assert old.replace('occ(1162)','occ(1128)').replace('occ(1163)','occ(1129)').replace('occ(1164)','occ(1130)')==new
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-011','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='TWENTY TWO PERSONSTATE SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh28 stored-view contrasts, not28-run/168-prefix replay or35/328 tests/build.','Superseded0.1 appraisal50 predicts future choice; accepted0.2 appraisal130 follows formed intent70.','Authored policy is not earned personality; current cues are controlled reports, not natural recognition.','Five-request privacy witness corrects terminal-only proof limitation; no observer action qualification.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
