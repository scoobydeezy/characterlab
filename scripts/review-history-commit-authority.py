from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-commit-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'docs/formal/COMMIT_PUBLIC_CONTRACT.md':'Accepted commit-public/0.1:one actor,two concrete task instances,two observers,empty state,initial training then lifecycle probes,max8instants<=16. Training actual reasons/arbitration/expression/qualification earns identity;subsequent probes cannot update it. K1/100 andunit1/10 cap3 receiving calibration. Source30 schedules140lifecycle,context40 andcommunication110 readprior committed status. Three separate lifecycle/identity/observer owners. Fourmodels Lifecycle/CoreNeed/Immortal/ReusedId explicit laws,not relabeling. LastObservation receives only identified truthful permitted messages;no automatic synchronization,absent knowledge distinct reportedabsence. Research/private/RNG outside closed observer view. No general commitment/Need/identity/social law.',
(P/'CAMPAIGN3_COMMIT_QUALIFICATION.md').as_posix():'VER-C3-COMMIT-001:4models16files10runs70prefixes60advance10terminal;27focused144affected328reference historical. Fixed earned identity underallmodels/probes. Baseline counts0/1/0/1/1,activeA thennewBstanding+3;terminalA retained. CoreNeed1/1/1/1/1 erroneous recurringproxy;Immortal0/1/1/2/2;ReusedIdreactivatesA/version3. Selective/swapped/both/retired witnesses learnexactinstance;private lifecycle unobserved,staleActive lawful. Inspection removesprobe researchordinal only;actualsupport retained. RO018fiveboundeddebts closed,not allBrief/corpus/exit. Broader partialfulfillment/delegation/trust/seriesidentity conditional.',
(P/'COMMIT_IMPLEMENTATION_FINDINGS.md').as_posix():'FirstCOMMITcohort27focused passes;no failedcohort replacement invented. Earnedidentity heldfixed notauthoredtrait;probeAuto/noadditional learning. Adoption/cancellation nextinstant,communication priorstate;no retroactivechoice orprivate belief synchronization. Observerprobe ordinal omitted as researchallocation artifact,not knowledge;supportIDs intact andclosedroster. CoreNeed proxy notphysiology,ReusedId explicitalternative notbaseline terminalmutation. Truthful symboliccommunication notgeneral language/trust/recognition;calibration notlearning speed.',
(P/'COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen10model/run/originalinput commitments:4mainmodels plus6baseline interventions private/absent/both/swapped/retired/hidden.7gates distinguish earnedidentity/lifecycle/control/actualdecision/positivewitness/privateequivalence/prefix evidence. Contract/allocation/model/fixture hashesbound;gates scientific obligations,not findings inferred fromnames.',
(P/'COMMIT_PUBLIC_EXPERIMENT_REV1.json').as_posix():'10ordered joins70prefix totals checked. Typedprobes carry identity/count/referent/standing/serializedinstances;observations holder/task/status. Decoded955 records verify A1ActiveCreated toA2RetiredCancelled,distinctB1ActiveCreated withterminalA retained;ReusedId A3Active withoutB. Trainingexactequal acrossmodels andidentityheldfixed. Private/absentobserver hashes andhidden psychologicalstate/output equal;positive selectivecontrols responsive. No freshsimulation/prefix replay inferred fromstoredhashes.',
(P/'COMMIT_VALIDATION_CLOSURE_REV1.json').as_posix():'Exact original read-only closure reproduces4models16files10runs70prefixes144affected328reference historical tests andsource/contract/plan/result/findings/build bindings.27focusedfirstreceipt checked. Scope boundedlifecycle/fixedearnedstanding/instance-selectivecommunication,not generaltheory. No freshtests,rollback orruntime.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='COMMIT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'COMMIT_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/COMMIT_PUBLIC_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'COMMIT_PUBLIC_EXPERIMENT_REV1.json');assert v['runs']==len(v['results'])==10 and v['restores']==sum(r['prefixes'] for r in v['results'])==70
for r in v['results']:
 assert set(r)==set('law name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256 training probes observations'.split())
 for q in r['probes']:assert set(q)==set('at identity count referents standing instances'.split())
 for o in r['observations']:assert set(o)==set('observer task status'.split())
plan=load(P/'COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json')
for r in plan['runs']:assert set(r)==set('law name modelIdentity runIdentity orderedInputs'.split())

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-014','RO-C3-018','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='SIX COMMIT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh10run/70prefix replay or tests.','Receiving calibration is not identity learning-speed or general Need law.','Controlled truthful communication and finite instances do not qualify language/trust/series identity.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=6,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
