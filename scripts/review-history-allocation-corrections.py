"""Correct-forward semantic allocation errors, distinct from runtime qualification."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-allocation-corrections-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
pred=F/'MEASUREMENT_PREDICTION_CORRECTION_ALLOCATION_TABLE.json';task=F/'TASK_COMMITMENT_CORRECTION_ALLOCATION_TABLE.json';pbase=F/'MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json';tbase=F/'TASK_COMMITMENT_ALLOCATION_TABLE.json'
p=load(pred);t=load(task);old=load(tbase)
expected={**old,'version':'task-commitment-allocation/0.2-candidate','semanticVersion':'task-commitment/0.2-candidate','authority':'docs/formal/TASK_COMMITMENT_KEY_ROLE_CORRECTION.md','mapKeyRoles':[],'supersedesRoleClosure':old['version'],'correction':'Remove two invalid StateMapKey declarations; use unchanged371 RecordField roles after exact key grammar.','sourceFingerprints':old['sourceFingerprints']+[ref(tbase),ref(F/'TASK_COMMITMENT_KEY_ROLE_CORRECTION.md'),ref(F/'CAMPAIGN2_PERMANENT_ALLOCATION.md')]};assert t==expected
assert [(r['rootStateTypeId'],r['keyFieldId']) for r in old['mapKeyRoles']]==[(373,1),(373,2)];assert [(r['fieldId'],r['requiredNamespace'],r['domainValidatorId']) for r in t['roles'] if r['recordTypeId']==371]==[(1,1002,'validator/character-qualification'),(2,1002,'validator/task-qualification')]
assert len(next(r for r in t['records'] if r['typeId']==373)['fields'])==1
base=load(pbase);c2=load(F/'CAMPAIGN2_ALLOCATION_TABLE.json');names={r['typeId']:r['name'] for r in c2['records']};assert names[275]=='TransitionInputProducerV04' and names[278]=='OccurrenceIdentityRule'
output=copy.deepcopy(next(r for r in base['records'] if r['typeId']==367));reg=copy.deepcopy(next(r for r in base['records'] if r['typeId']==368));assert output['fields'][1]['type']=='275/1' and reg['fields'][6]['type']=='set<367/1>'
output['schemaVersion']=2;output['fields'][1].update(required=False,retired=True,presence='must-be-absent');reg['schemaVersion']=2;reg['fields'][6]['type']='set<367/2>'
draft=P/'MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION_DRAFT.json';d=load(draft);assert d['records']==[output,reg]
assert p=={**d,'version':'measurement-prediction-correction-allocation/0.1-candidate','status':'PERMANENT AND FROZEN','acceptance':'agent self-review; correct-forward schema revision','reviewedDraftArtifact':ref(draft)}
assert p['sharedOccurrenceRule']==dict(recordTypeId=366,schemaVersion=1,identityFieldId=1,requiredNamespace=1127,domainValidatorId=None,ruleRecordTypeId=278,registryRecordTypeId=279,registryFieldId=3)
for k in ['namespaces','members','roles','occurrenceIdentities','unionVariants','finiteValues']:assert p[k]==[]
assert p['excludedSchemas']==[dict(typeId=367,schemaVersion=1),dict(typeId=368,schemaVersion=1)]
judgments={
 'prediction':'Producer275 was wrongly treated as an occurrence rule; existing278 under279/3 is sole occurrence authority for366/1 namespace1127. Correct-forward367/2 reserves retired field2 with forced absence;368/2 references367/2. Old schema1 artifacts remain historical/excluded for corrected profile. IDs/names preserved, no duplicate registration rule or new identity system. Numeric consistency had missed semantic-reference meaning; this audit verifies correction, not PRED runtime gates or later campaign status.',
 'task':'Record key371 under373/1 requires existing RecordField roles, not StateMapKey constraints indexing key components. Old373/2 was not a real field allocation. Remove two invalid role declarations, retain7 records/34 fields/14 members/10 scalar roles/three variants. No reinterpretation of264 or upstream WRT/VAL authority. Broad old role-ownership PASS is withdrawn only for those declarations. TC-A..L NOT PASSED is historical correction-stage scope, not a current campaign verdict.'}
specs={}
for q in [pred,F/'MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION.md',F/'MEASUREMENT_PREDICTION_CORRECTION_ALLOCATION.md',F/'MEASUREMENT_PREDICTION_CORRECTION_ALLOCATION_AUDIT.json',draft,P/'MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION_AUDIT.json']:specs[q.as_posix()]=judgments['prediction']
for q in [task,F/'TASK_COMMITMENT_KEY_ROLE_CORRECTION.md',F/'TASK_COMMITMENT_CORRECTION_ALLOCATION_AUDIT.json']:specs[q.as_posix()]=judgments['task']
manifest=load(P/'public-wrapper-quiescence-rev1/PRESERVATION.json');pairs={}
for q in [pred,task]:
 a=next(a for a in manifest['artifacts'] if a['original']==q.as_posix());assert sha(q)==a['sha256']==sha(a['archive']);specs[a['archive']]=specs[q.as_posix()]+' Exact archived grammar alias retains separate pre-repair source identity, not new behavioral evidence.';pairs[a['archive']]=q.as_posix()
bindings=[]
def scan(v):
 if isinstance(v,dict):
  if 'path'in v and 'sha256'in v:
   actual=v['path']
   if actual=='docs/formal/CANONICAL_RECORD_REGISTRY.md' and v['sha256']=='6f95e9f59ce3a66e4acd6de9cdc1b1a77e4893ca537a6286577d54717ea82474':actual=(O/'CANONICAL_RECORD_REGISTRY.historical.md').as_posix()
   assert sha(actual)==v['sha256'];bindings.append(dict(path=v['path'],sha256=v['sha256'],resolvedPath=actual))
  for x in v.values():scan(x)
 elif isinstance(v,list):
  for x in v:scan(x)
for q in specs:
 if q.endswith('.json'):scan(load(q))
pa=load(F/'MEASUREMENT_PREDICTION_CORRECTION_ALLOCATION_AUDIT.json');da=load(P/'MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION_AUDIT.json');ta=load(F/'TASK_COMMITMENT_CORRECTION_ALLOCATION_AUDIT.json')
assert pa['checks']==da['checks'] and pa['newNumericIds']==0 and pa['runtimeQualification']==da['runtimeQualification']=='NONE';assert da['priorPreservationCount']==166
assert ta['newStateMapKeyRoles']==0 and ta['unchanged']==dict(records=7,fields=34,members=14,recordFieldRoles=10,statusVariants=3)
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for q,j in specs.items():
 assert sha(q)==entries[q]['sha256'];roles.append(dict(**ref(q),role='WHOLE CORRECTIVE AUTHORITY / ALLOCATION / AUDIT',judgment=j,acceptanceChain=[ref(pred),ref(task),ref(pbase),ref(tbase)]))
 if q.endswith('.json'):strings.update({(q,ptr):text for ptr,text in walk(load(q))})
units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],u['location']['pointer']]==u['text']
  units.append(u)
lookup={(u['source'],json.dumps(u['location'],sort_keys=True),u['text']):u['id'] for u in units};rows=[]
for u in units:
 ptr=u['location'].get('pointer','');narrative=u['source'].endswith('.md') or ptr.startswith(('/checks','/runtime','/acceptance','/status','/correction','/historicalError','/excluded'))
 r=dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='CORRECTION / AUTHORITY / LIMIT' if narrative else 'TYPED CORRECTION BACKING',judgment=specs[u['source']])
 if u['source'] in pairs:r['originalOccurrenceId']=lookup[pairs[u['source']],json.dumps(u['location'],sort_keys=True),u['text']]
 rows.append(r)
obs=['RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='11 CORRECTIVE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,sourceBindings=bindings,historicalRecovery=ref(O/'development.json'),stringLeaves=len(strings),obligations=obs,limits=['No fresh runtime mutation tests or behavioral qualification.','Existing old allocation tables referenced for exact reconstruction are not whole-reviewed here.','Historical NOT PASSED labels are stage-specific; later qualifications require their own evidence.']))
v=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('CORRECTION') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),sourceBindings=len(bindings),archiveOccurrenceJoins=sum('originalOccurrenceId'in r for r in rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',v);print(json.dumps(v))
