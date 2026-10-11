from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-body-ownership-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
'docs/formal/BODY_OWNERSHIP_COMPARISON_CONTRACT.md':'Accepted body-ownership-comparison/0.1:component comparison driven by unchanged publicEMB,not integrated factory/new stateowner. Meter normalized physiological level with sensor boundary;IndependentNeed samelevel directurgency violatingcontrol;REGconstant80 reference notcurrentreserve;Cache replaced fromcurrentadmittedpressure includingUnavailable. Capacity100/threshold60,width10or20,rates1or1/2,adaptation0;selected exact10^-6 lattice identity notgeneralquantization. Source10/pressure60 beforedelivery110. SameS0=80 attime0,positive samples differ79/79.5. Scheduledquery equivalence nothysteresis/priorhistory/betweenopportunity dynamics orrootdeletion.',
(P/'CAMPAIGN3_BODY_OWNERSHIP_QUALIFICATION.md').as_posix():'VER-C3-BODY-001:16public source runs6existing source models5component candidates79prefixes63advance16terminal;47affected328reference historical. MeterBehindSensor/Cache matchadmittedpressure;directNeed failsalias41/49 andavailability;REGfailsreserve substitution only. Kinetic-fast pressure0,1/6,0,1/6 vsnodelivery0,1/6,1/3,2/3;at31 unaffected bysameinstantdelivery. Storedrepresentation notpsychologicalauthority. No newfactory/choice/actionefficacy/learning claim;componentreplay distinct canonicalsourceprefix. RO008immediatecomparison discharged,broaderdynamic conditional;no mechanism retired.',
(P/'BODY_OWNERSHIP_FINDINGS.md').as_posix():'Storedmeter seriousbodyrepresentation,not extraNeed authority;Cache fullcurrentreplacement observationallyredundant onlysampledqueryset. IndependentNeed bypassessensor/availability. REGoperatingpoint substitution failure leavesproperreference roleintact;untested expressiveauthoredtrajectory mightmatch butnotqualified. Initialsample80 shorthand meansS0,notillegal time0original orsamepositivetimebody. Componentunitmotive probe notregisteredchoice. Prefreeze unnarrowedunion TypeScript correction;firstmatrix/testspass,no discardedbehavioralcohort. HistoricalCTL001 portselectedlatticeonly,no sourceimport/urgency/MPSgeneralization.',
(P/'BODY_OWNERSHIP_PLAN_REV1.json').as_posix():'Frozen16source recipes bindS0/originalinputs,6EMB modelimages andcomponent/source/contract hashes;5candidate names not5newpublicmodels. One currentartifact embodiedRuntime hashchanged afterwrapperrepair;exacthistoricalbytes preserved inpublic-wrapper-quiescence archive. Historicalclosure resolvesonlythat hashagainstauthenticatedarchive;currentruntimebehavior remainsseparate.',
(P/'BODY_OWNERSHIP_RESULT_REV1.json').as_posix():'16storedresult rows79prefixes63advance16terminal;all5candidate probes shareeachactualpublicsource run. Typedexactbody/sample/interval/pressure/meter/cache/reference/ground/effects preservealias/availability/kinetics/delivery/partition contrasts. Originalscientificassertion block rechecked;no80independentsource executions ornewcanonicalcomponent saves. Originalsource state/output/trace/save digests retained,no freshsimulation.',
(P/'BODY_OWNERSHIP_CLOSURE_REV1.json').as_posix():'Fulloriginalclosure receipt equality verified withoneexplicit archivedruntime hash substitution;current-sourcefailure preserved.47affected328reference historicaltests andallotheroriginalhashes match. Historicalreconciliation notcurrentruntimeequivalence. No generaldynamicNeed/storage reduction;component/public scope retained.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='BODY OWNERSHIP AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'BODY_OWNERSHIP_CLOSURE_REV1.json'),ref('docs/formal/BODY_OWNERSHIP_COMPARISON_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'BODY_OWNERSHIP_RESULT_REV1.json');assert v['sourceRuns']==len(v['results'])==16 and v['prefixes']==sum(r['prefixes'] for r in v['results'])==79
for r in v['results']:
 assert set(r)==set('name model runIdentity initial rate width adaptation referenceDeclaration prefixes advancing probes effects sourceState sourceOutputs sourceTrace save meterFinal'.split())
 for q in r['probes']:assert set(q)==set('at body sample interval mediated meter independent reference cached meterLevel referenceLevel ground cacheAt'.split())
 for e in r['effects']:assert set(e)==set('at amount before after applied overflow'.split())
 assert set(r['meterFinal'])=={'at','level'}
plan=load(P/'BODY_OWNERSHIP_PLAN_REV1.json')
for r in plan['runs']:assert set(r)==set('name model initialState orderedInputs'.split())

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];v=dict(status='SIX BODY OWNERSHIP SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Historical runtime archive hash used onlyfororiginal receipt check;no currentbehavior claim.','No fresh16run/79prefix execution or tests.','Scheduled cache/meter equivalence notgeneralNeed dynamics orrootelimination.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=6,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
