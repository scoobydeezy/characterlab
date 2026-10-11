from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-source-profiles-rev1';B=P/'campaign3-history-universe-rev1'
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
common='Bounded symbolic grammar only; no new identity,storage,numeric allocation,source implementation,public codec/model or psychological qualification. Current87 declaration/source tests are separate later evidence,not historical builder runtime execution.'
notes={
'GA_SOURCE_PROFILE_DECLARATIONS_REV1.md':'Committed declarations replace closure-captured fixtures. Scene object1002 is governed attention-scene-object with exact membership,not character or perceptual file/continuity. Authored role1003 differs from causal role; permitted safe role cannot be inferred from position/panel. Scene0..10 frames each0..3items,panel0..16 frames; strict increasing times and248 binding schema. No authored significance/baseline/selected winner/assessment/acquisition. Body/visual selection and cue flags independent but require corresponding requested sources;goal assessment additionally requires consequence evidence,adopted goal and admitted prior-memory read. Ordered original address/time/bytes authenticate separately. Three-item maximum was grammar proposal,not then-current single-point runtime capability. No hidden referent sorting; one-point8/9/10 sweeps retained controls.',
'GA_SOURCE_PROFILE_DECLARATIONS_REV1.json':'Eight-record source/original inventory reproduced exactly. Scene/panel/profile/use/original records retain governed reference closure and no callback. Observer-safe ordering explicitly independent of hidden referent identity. Selection and cue remain distinct consumers;literal use plan supplies neither result nor occurrence. Bounds and identity aliases are grammar obligations,not executed frame coverage.',
'GA_SOURCE_PROFILE_DECLARATIONS_REV2.json':'Exact successor preserves all prior records except adding required DefinitionId ExecutionPolicy to ObservationUsePlan;version and cited calibration source updated,with explanatory executionPolicy. Immutable policy transports exact purpose/calibration to registered stages; original time alone cannot select hidden capacity. Earlier nine-fault reviewer is REV1-only and is not claimed to enforce the added field. Concrete policy substitution tests belong to separately recorded current compiler evidence.',
'GA_SOURCE_PROFILE_DECLARATIONS_REVIEW_REV1.json':'Nine original mutants reproduced: truth marker/file conflation,event role/causal role confusion,default Actor,missing tenth competitor slot,cue/selection coupling,authored assessment result,new frame ID,callback and hidden identity ordering. Structural rejection does not qualify multi-item materialization,exact model schedules/work,membership or completed-parent admission.'}
replay=load(O/'replay.json');assert len(replay['rows'][1]['faults'])==9
for row in replay['rows']:
 for k in ['script','output']:assert ref(row[k]['path'])==row[k]
assert ref(replay['successor']['path'])==replay['successor']
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev156/index.json')['roleAssignments']}
roles=[];strings={};bindings=[]
for n,j in notes.items():
 p=(P/n).as_posix();assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='SYMBOLIC SOURCE PROFILE HISTORY; DECLARATION/RUNTIME DISTINCTION',judgment=j+' '+common,acceptanceChain=[ref(O/'replay.json'),ref(P/'campaign3-history-ga-compiler-rev1/tests.json')]))
 if p.endswith('.json'):
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
  narrative=u['source'].endswith('.md') or ptr in ['/status','/executionPolicy'] or any(k in ptr.split('/') for k in ['invariants','limits','compiler'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='SOURCE PROFILE HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,preservedArtifacts=[],limits=[common,'Execution-policy successor delta is inspected separately; no false claim that prior reviewer covers it. Remaining authority and source-role adequacy open.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshSymbolicFaults=9,recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
