from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-registration-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
common='Historical expressibility and bounded current compiler controls; no claim that symbolic review or synthetic binding equality establishes full public source/model/owner/persistence admission.'
notes={
'GA_ACCESSOR_CLOSURE_REV1.md':'Eight projections distinguish roster-qualified character owners from observer windows. Full prior ledger belongs to owner; recall erases retention metadata and partitions actual evidence; graph/presentation/physical/protocol state not bundled into recall. Present empty leaf differs from missing state; absent cue suppresses owner reads but not character roster admission. Current GAP-B deliberately uses missing episode leaf to prove no read; it is not whole-state admission accepting missing roots. Sharing body projection does not share baseline budget/occurrence. Owner B0 and validated survivor descriptor remain distinct from sibling tentative state. Current eight GAP and four RPP tests prove bounded holder/root/domain/cue/time/detachment and erasure controls,not canonical metadata or whole public rollback in isolation.',
'GA_REGISTRATION_CARRIER_REV1.json':'Three symbolic records;66-stage wrapper binds exact schema/phase/projection/definitions/ReadDomain and existing322 write authorization. Fourteen purpose tags preserve independent BodyRecall/GoalBaselineRecall. Output bound0..32 is not actual slot authorization. Fixed reviewed handlers,not callbacks; phase140 cannot acquire protocol authority. Exact original builder reproduced. The initial write representation is later superseded by separate V02 for non-learning explicit paths; frozen704 is not reinterpreted.',
'GA_REGISTRATION_CARRIER_REV2.json':'Only Stage enum adds local-reserve-replenishment and PhaseOrdinal adds110 relative to REV1; remaining records/constraints identical. No new identity or allocation. Carrier expressibility does not give inherited322 a path-set grammar or prove physical authority. Later write-scope correction uses distinct successor.',
'GA_REGISTRATION_CARRIER_REVIEW_REV1.json':'Reviewer consumes carrierREV2/topologyREV2/crosswalkREV17; nine original shape mutants reproduced. Subject-bearing wrappers expose direct first ObserverId or inherited377; that does not authenticate actual observer,roster,producer or nested holder. Current seven GR tests compare all67 templates and full canonical fields to synthetic implementation-owned bindings; bindings themselves require prior semantic validation.',
'GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.md':'Existing322 is WriteCapabilityV06 using authority plus Campaign2 family IDs,not explicit149 paths. Family membership does not automatically force learning route. Preserve704/1; distinct successor changes only write union and adds path capability. Read-only uses322 ReadOnly; cognitive owners keep accepted family authorization; perception,physical and two non-learning goal owners use explicit paths. No protocol root,hidden family extension or false ReadOnly writer. Storage authorization is not new psychology.',
'GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.json':'Two-record successor: authority1025 plus nonempty1..16 StatePathPattern149 set; V02 otherwise identical to old registration.67 stage policies partition ReadOnly/LearningFamilies/ExactPaths. Five path stages are current/consequence tracking,goal command/deadline,and reserve replenishment. Their routes/roots remain unchanged. No numeric allocation or model activation in this proposal.',
'GA_REGISTRATION_WRITE_SCOPE_REVIEW_REV1.json':'Eight original mutants reproduce rejection of frozen-name rewrite,ReadDomain widening,empty paths,family/path confusion,union alias,physical learning route,perception ReadOnly lie and protocol writer. Three scalar roles and eight recursive boundaries express the successor,not enforce exact runtime path membership. Public compiler and model gates remain separate.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};assigned={r['path'] for r in load(P/'campaign3-history-source-roles-rev154/index.json')['roleAssignments']}
replay=load(O/'replay.json');assert sum(len(r['faults']) for r in replay['rows'])==17
for row in replay['rows']:
 for k in ['script','output']:assert ref(row[k]['path'])==row[k]
for f in replay['inputs']+[replay['tests']]:assert ref(f['path'])==f
test=load(replay['tests']['path']);assert test['numTotalTests']==test['numPassedTests']==19 and test['numFailedTests']==0
a=load(P/'GA_REGISTRATION_CARRIER_REV1.json');b=load(P/'GA_REGISTRATION_CARRIER_REV2.json')
stage=lambda p:next(f for r in p['records'] if r['name']=='GeneralStageRegistration' for f in r['fields'] if f['name']=='Stage')['type']['values']
assert stage(b)==stage(a)+['local-reserve-replenishment']
bb=json.loads(json.dumps(b));stage(bb).pop();bb['primitives']['PhaseOrdinal']['members'].remove(110)
for k in ['records','inherited','primitives','constraints','newIdentityFamilies','numericAllocations']:assert a[k]==bb[k]
correction=load(P/'GA_REGISTRATION_WRITE_SCOPE_CORRECTION_REV1.json');assert len(correction['stages'])==67
assert {s['name'] for s in correction['stages'] if s['writeMode']=='ExactPaths'}=={'current-track','consequence-track','goal-command-owner','goal-deadline-owner','local-reserve-replenishment'}
roles=[];bindings=[];strings={}
for n,j in notes.items():
 p=(P/n).as_posix();assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='GA ACCESSOR/REGISTRATION HISTORY; DISTINCT WRITE AUTHORIZATION',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json')]))
 if not p.endswith('.json'):continue
 v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in v['sources']:assert ref(f['path'])==f;bindings.append(dict(source=p,**f))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr=='/status' or any(k in ptr.split('/') for k in ['limits','constraints','inherited'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='GA ACCESSOR/REGISTRATION HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],limits=[common,'Current19 tests do not reproduce historical full-suite or component-version environments. Compiler progressREV1/2/3 and concrete declaration/source/runtime evidence remain separately reviewed gates.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshPassingAssertions=19,originalSymbolicFaults=17,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
