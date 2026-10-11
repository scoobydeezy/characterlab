"""Review symbolic identity-role history as bounded declaration evidence."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');O=P/'campaign3-history-ga-identity-roles-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fps(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fps(x)
 elif isinstance(v,list):
  for x in v:yield from fps(x)
notes={
1:'Initial66 records/72 scalar positions/82 boundaries. Optional scalars retain roles; collections require element checks and composite records recurse. Perceptual files212/213 are records,not namespace IDs. Character1002 qualification does not replace PRJ; goal referent1002 requires a different kind/holder/spec-origin coupling. Observer1000 differs from both. RetainedEncodingUnit is explicitly pending and state-map keys absent. No invented feedback/use/target namespace or cognitive protocol access.',
2:'Adds16 visual records:82/86/116. RetainedEncodingUnit changes from explicitly pending inherited boundary to declared recursive fields. SEM detection/track/role/binding/selected records retain their actual record roles rather than becoming scalar namespaces. Nested selected evidence grants no unselected source access. State keys remain pending.',
3:'Adds12 root/window and eight narrow concern records:102/98/141. Six concrete scalar root keys receive StateMapKey modes; composite goal/formation keys still recurse and protocol singleton has none. Concern1130/Response386 remain distinct. The phrase physical root keys is corrected in REV4: these are cognitive/perception storage roots,not PhysicalBody reclassification.',
4:'Adds nine reserve records:111/106/152. LocalReserveId physical vocabulary differs from observer-safe InteroceptiveSignalId. Actual physical key is composite Character plus Reserve,recursing rather than scalar StateMapKey. Existing anchor454 and replenishment479 retained. Exact compiled holder/key membership and physical writer authority remain separate gates. Corrects REV3 wording without changing six cognitive/perception owners.',
5:'Adds five requested-source records:116/112/162. Existing observer/observation roles and event detection215 are inherited; its nested occurrence1113 is not event-feature1102. Root inventory REV2 expands possible graph bound to30 for ten sweeps; no state-role or physical-key ownership change. Wrapper transport grants neither fresh occurrence nor truth resolution.',
6:'Adds eight source/original declarations:124/122/168. SceneObjectReferent reuses1002 with origin and exact scene membership,not character qualification or observer file identity. EventRole1003 is not CausalRole1019. Definition1027 namespace alone cannot authorize arbitrary kind lookup. Source definitions do not gain cognitive read authority.',
7:'Adds five source-stage wrappers:129/127/185. Direct observer fields support existing projection,not a new roster or copied authoritative CharacterId. World210 boundary is sampling-only; later samples/use plans/tracks are separate. Correct identity namespace alone never grants epistemic access or validates actual production.',
8:'Visual carrier REV2 adds only the actual causal-role claims boundary to VisualSelectionInput:129/127/186. One1111 per produced claim is a separately cited component fact,not freshly executed by the crosswalk. Unresolved source allocates none; producer-phase15/125 authentication remains required. No new identity/state role.',
9:'Requested-source REV2 adds optional ReservedExperience using existing1106:129/128/186. Optional record-field role is not a new reservation identity or duplicate envelope. Early actual allocation/source authenticity and one-envelope closure are separate runtime claims.24 historical faults reproduced; actual mutations retained.',
10:'Adds three acquisition/recall input wrappers:132/131/189. Owners receive actual AcquisitionFormationEvidence,not earlier positive candidate. Direct observers preserve PRJ without copied CharacterId.25 structural faults do not qualify21 registrations or whole work. Concern fault label now mutates1132 rather than1129; both are wrong for1130 and separately probed.',
11:'Adds three prior-concern wrappers:135/134/192. TaskWorkspace381 and TaskAppraisal384 remain inherited records,not opaque payloads or new outputs. Direct observer and narrow delivery shape do not establish completed producer/nested-holder equality or public AJB admission.',
12:'Adds ten goal/attribution wrappers and consumes explicit-absence carrier:145/148/201. Optional consequence/result/carry roles retain their underlying identity/record classifications when present. SourceAt remains a time primitive,not an occurrence. Exact completed-output membership,absent-vs-missing delivery and memory-writer permission remain separate.',
13:'Adds calibration/execution-policy declarations:157/157/201. Nine new identity slots reuse Definition1027. Goal baseline and ordinary body recall have separate policies even when numeric capacities coincide. This does not settle calibrated laws,definition-kind binding,whole model admission or integrated behavior.',
14:'Adds retention control/observer input:159/162/201. Four definition references use1027 and observer1000. No survivor list or acquisition-authoring authority introduced. Runtime retention batching and public gates require their own evidence.',
15:'Adds explicit event presentation plan:160 records but unchanged162 scalar positions/201 boundaries. Its ordered-original address is a primitive,not another identity. Unchanged role counts do not imply unchanged behavior or qualification of actual presentation.',
16:'Adds three registration carrier records:163/165/208. Seam1036 and EventType1001 are distinct from runtime occurrence families. Projection266/write authorization322/read patterns149 inherit existing contracts; no alternate subject roster. Structural compiler-field coverage does not execute owners or admit arbitrary handlers.',
17:'Registration carrier REV2 adds omitted physical replenishment stage and phase110 while identity positions/boundaries remain byte-equal to REV16:163/165/208. Therefore a complete-looking role inventory cannot prove complete causal topology. Stage omission and its source/test repair remain separately preserved registration history. No new allocation,law or public qualification.'}
prior=load(P/'campaign3-history-source-roles-rev151/index.json');assigned={r['path'] for r in prior['roleAssignments']};specs={}
for i,note in notes.items():
 for name in [f'GA_IDENTITY_ROLE_CLOSURE_REV{i}.md',f'GA_IDENTITY_ROLE_CLOSURE_REV{i}.json',f'GA_IDENTITY_ROLE_REVIEW_REV{i}.json']:
  p=(P/name).as_posix();assert p not in assigned
  specs[p]=f'Revision{i} historical symbolic declaration evidence. '+note+' Original artifact preserved; exact reconstruction and original fault execution do not prove public codec,holder,producer,owner or persistence enforcement.'
replay=load(O/'replay.json');assert len(replay['rows'])==17 and sum(len(r['faults']) for r in replay['rows'])==390
for f in fps(replay):assert ref(f['path'])==f
label=load(O/'label-drift.json');assert [r['namespace'] for r in label['rows']]==[1129,1132,1129,1132] and all(r['rejected'] for r in label['rows'])
for f in fps(label):assert ref(f['path'])==f
expectedCounts=[(66,72,82,9),(82,86,116,11),(102,98,141,13),(111,106,152,16),(116,112,162,16),(124,122,168,19),(129,127,185,22),(129,127,186,23),(129,128,186,24),(132,131,189,25),(135,134,192,26),(145,148,201,28),(157,157,201,30),(159,162,201,31),(160,162,201,31),(163,165,208,33),(163,165,208,33)]
previous=None;deltas=[];counts=[];mutations={};bindings=[];strings={};entries={e['path']:e for e in load(B/'manifest.json')['entries']}
for i in range(1,18):
 c=load(P/f'GA_IDENTITY_ROLE_CLOSURE_REV{i}.json');r=load(P/f'GA_IDENTITY_ROLE_REVIEW_REV{i}.json')
 assert set(c)=={'version','status','recordCount','positions','boundaries','stateMapKeyRoles','stateMapKeyDisposition','sources'}
 assert set(r)=={'status','records','identityPositions','recordBoundaries','faults','sources','limits'}
 actual=(c['recordCount'],len(c['positions']),len(c['boundaries']),len(r['faults']));assert actual==expectedCounts[i-1];counts.append(dict(revision=i,records=actual[0],positions=actual[1],boundaries=actual[2],faults=actual[3]))
 assert r['records']==actual[0] and r['identityPositions']==actual[1] and r['recordBoundaries']==actual[2]
 assert replay['rows'][i-1]['faults']==r['faults']
 assert all(set(x)=={'name','rejected'} and x['rejected'] for x in r['faults'])
 for x in c['positions']:
  assert set(x) in [{'identity','mode','namespace','path'},{'identity','mode','namespace','path','validator'},{'identity','mode','path','symbolicFamily'}]
  assert x['mode'] in ['CanonicalRecordField','StateMapKey','FixedCompilerCollectionElement']
 for x in c['boundaries']:assert set(x) in [{'mode','path','record','source'},{'mode','path','record'}] and x['mode'] in ['InheritedRecordRoles','RecurseDeclaredRecord']
 for x in c['stateMapKeyRoles']:assert set(x) in [{'root','field','role','requiredNamespace'},{'root','field','role','requiredNamespace','domainValidator'}]
 if previous:
  delta=dict(revision=i,groups={})
  for k in ['positions','boundaries']:
   a={x['path']:x for x in previous[k]};b={x['path']:x for x in c[k]};assert len(a)==len(previous[k]) and len(b)==len(c[k]);assert not set(a)-set(b)
   changed=[dict(before=a[path],after=b[path]) for path in sorted(set(a)&set(b)) if a[path]!=b[path]]
   assert len(changed)==(1 if i==2 and k=='boundaries' else 0)
   if changed:assert changed[0]['before']['path']=='PositiveEventChildEvidence.Encoding'
   delta['groups'][k]=dict(added=[b[path] for path in sorted(set(b)-set(a))],changed=changed)
  if i>3:assert previous['stateMapKeyRoles']==c['stateMapKeyRoles']
  deltas.append(delta)
 previous=c
 script=Path('scripts/review-ga-identity-role-closure'+('' if i==1 else '-rev'+str(i))+'.mjs').read_text()
 for name,body in re.findall(r"\['([^']+)',p=>(.*?)\](?:,|\n)",script):mutations.setdefault(name,{}).setdefault(body,[]).append(i)
assert len(mutations)==33 and sum(len(x) for x in mutations.values())==34
assert set(mutations['reuse-appraisal-id-for-concern'])=={"row(p,'ConcernOccurrenceId').namespace=1129","row(p,'ConcernOccurrenceId').namespace=1132"}
# Verify the named correction's limited scope independently of role counts.
root=load(P/'GA_STATE_ROOT_KEY_INVENTORY_REV2.json');assert len(root['stateMapKeyRoles'])==6
assert {r['classification'] for r in root['roots'] if r['root'] in {x['root'] for x in root['stateMapKeyRoles']}}=={'episodic-memory','associations','prospective-commitments','Perception'}
reg1=load(P/'GA_REGISTRATION_CARRIER_REV1.json');reg2=load(P/'GA_REGISTRATION_CARRIER_REV2.json')
stage=lambda p:next(f['type']['values'] for r in p['records'] if r['name']=='GeneralStageRegistration' for f in r['fields'] if f['name']=='Stage')
assert stage(reg2)==stage(reg1)+['local-reserve-replenishment'];assert set(reg2['primitives']['PhaseOrdinal']['members'])-set(reg1['primitives']['PhaseOrdinal']['members'])=={110}
c16=load(P/'GA_IDENTITY_ROLE_CLOSURE_REV16.json');c17=load(P/'GA_IDENTITY_ROLE_CLOSURE_REV17.json')
for k in ['recordCount','positions','boundaries','stateMapKeyRoles','stateMapKeyDisposition']:assert c16[k]==c17[k]
support=[ref(P/n) for n in ['GA_STATE_ROOT_KEY_INVENTORY_REV2.json','GA_REGISTRATION_CARRIER_REV1.json','GA_REGISTRATION_CARRIER_REV2.json','GA_LOCAL_REPLENISHMENT_STAGE_REV1.md']]+[ref('docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json')]
chain=[ref(O/'replay.json'),ref(O/'label-drift.json')]+support;roles=[]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='SYMBOLIC GA IDENTITY ROLE HISTORY; SUPERSEDED INVENTORY AND PRESERVED DISTINCTIONS',judgment=j,acceptanceChain=chain))
 if not p.endswith('.json'):continue
 v=load(p)
 for ptr,s in walk(v):strings[p,ptr]=s
 for f in fps(v):assert ref(f['path'])==f;bindings.append(dict(source=p,**f))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr in ['/status','/stateMapKeyDisposition'] or ptr.startswith('/limits/') or u['text']=='earlier positive visual wrapper; explicit closure pending'
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='17 GA IDENTITY ROLE REVISIONS RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,revisionCounts=counts,roleDeltas=deltas,mutationVariants=mutations,preservedArtifacts=[],obligations=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['51 whole sources,17 exact symbolic builder/reviewer reconstructions;390 fault executions cover33 labels/34 actual mutation bodies,not390 independent phenomena.','REV3 physical-root wording corrected by REV4; cognition/perception ownership unchanged. Actual physical composite key remains separate.','Equal REV16/17 role inventories coexist with an omitted-stage correction: role coverage cannot prove causal topology completeness.','No new runtime tests or public qualification. Input carrier semantics and replenishment development/test history remain separately reviewable; full historical adequacy remains open.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,exactInventoryReconstructions=17,freshSymbolicFaultExecutions=390,uniqueFaultLabels=33,uniqueMutationBodies=34,freshNamespaceProbes=4,recoveredArtifacts=0,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
