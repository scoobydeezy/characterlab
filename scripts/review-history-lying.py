from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-lying-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={'docs/formal/LYING_PUBLIC_CONTRACT.md': 'Accepted lying-public0.1: acquired latest private belief, adopted informing/misdirection tasks, actual inherited choice, belief-relative intended assertion70 and expression80 before delivery110. Intended listener target is not current listener knowledge. Unknown permits abstract template choice but no instantiated assertion or lie. Three independent holder leaves; private30 current, recipient140 later40. Six laws/eight models, controlled Boolean channel, fixed seed13. No honesty trait, language, trust, mind-reading or identity update.', 'docs/planning/DELIBERATE_LYING_READINESS.md': 'Stage A proposal, no qualification by itself. Honest error differs from deliberate contrary content and declared purpose. Preserve two-choice grammar rather than widen to disclosure/concealment/lie; concealment stays separate qualified comparison. Accepted contract refines unknown case: abstract template can be chosen but assertion absent, no lie counted. Listener-belief model remains separate. Planned comparisons later supported only in bounded contract scope.', 'docs/planning/CAMPAIGN3_LYING_QUALIFICATION.md': 'VER-C3-LYING-001:8 models30 runs143 prefixes113 advance30 terminal;31 focused328 reference/build historical. Same belief/opposite purposes produce opposite intended assertions. Misleading belief supports accidentally true lie and false honest statement. Failure preserves whole intent/expression without recipient evidence. EvidenceMean2/3 resists final targetfalse, LastReceipt0; not universal persuasion. NoLearning receives without updating. Hidden truth/nonrecipient equalities hold decisive and contested; no general trust/strategy/identity claim.', 'docs/planning/LYING_PUBLIC_PLAN_REV1.json': 'Prospective30 exact model/run/original commitments with eight ModelIdentities, ExperimentIdentity/ComparisonCase and all source/contract/allocation/freeze bindings. Declared scope correctly names chosen belief-relative assertion and failed lying. Fixed seed13 without outcome search; labels and canonical bytes backing, not proof alone.', 'docs/planning/LYING_PUBLIC_RESULT_REV1.json': 'Complete30-row143-prefix aggregate reconstructed from four disjoint worker partitions. Fresh decoded stored outputs reexecute original lying contrasts and verify output/two-observer bytes against hashes; not fresh runtime or prefix replay.113 advancing30 terminal remain historical scope. TruthDefinedContent and PrivateCopy expose boundary violations; IntentAsDelivery teaches after failure. Actual contrary intent different from success or recipient belief.', 'docs/planning/LYING_CLOSURE_REV1.json': 'Original closure freshly passes all30 joins, worker view hashes/totals, eight-model freeze,15 allocations1083..1097 namespace1169,31/328 tests/build and source bindings. Fresh stored-view assertions separately recorded; closure integrity does not rerun scheduler or tests.', 'docs/planning/LYING_TESTS_REV1.json': 'Historical31 passed:8 behavior/timing/privacy tests,18 stage faults plus commit,3 contested faults and combined holder/handle/save checks. Unknown assertion absent, acquired resistant history, actual belief-relative content and preserved intent emphasized. Titles are finite historical assertions, not general dialogue or persuasion evidence.', 'docs/planning/LYING_REFERENCE_TESTS_REV1.json': 'Historical328 passed reference assertions; repeated titles/timings/paths/metadata backing to reviewed mechanisms, not new lying findings or fresh execution. No source/precision/identity limitations retired.', 'docs/planning/LYING_BUILD_REV1.json': 'Historical dated npm build exit0 PASS summary. Not a fresh build or detailed transcript.', 'docs/planning/lying-public-workers-rev1/0.json': 'Stored worker partition 0: modulo4 run membership and totals authenticated, all output and two recipient-view bytes match row hashes. Four partitions cover30 unique runs and reconstruct aggregate. Fresh original assertions over decoded bytes preserve belief/purpose/intent/delivery/receipt/learning distinctions. No fresh simulations or independent new finding from serialized descriptions.', 'docs/planning/lying-public-workers-rev1/1.json': 'Stored worker partition 1: modulo4 run membership and totals authenticated, all output and two recipient-view bytes match row hashes. Four partitions cover30 unique runs and reconstruct aggregate. Fresh original assertions over decoded bytes preserve belief/purpose/intent/delivery/receipt/learning distinctions. No fresh simulations or independent new finding from serialized descriptions.', 'docs/planning/lying-public-workers-rev1/2.json': 'Stored worker partition 2: modulo4 run membership and totals authenticated, all output and two recipient-view bytes match row hashes. Four partitions cover30 unique runs and reconstruct aggregate. Fresh original assertions over decoded bytes preserve belief/purpose/intent/delivery/receipt/learning distinctions. No fresh simulations or independent new finding from serialized descriptions.', 'docs/planning/lying-public-workers-rev1/3.json': 'Stored worker partition 3: modulo4 run membership and totals authenticated, all output and two recipient-view bytes match row hashes. Four partitions cover30 unique runs and reconstruct aggregate. Fresh original assertions over decoded bytes preserve belief/purpose/intent/delivery/receipt/learning distinctions. No fresh simulations or independent new finding from serialized descriptions.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='LYING AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'closure-check.json'),ref(O/'view-check.json'),ref(P/'LYING_CLOSURE_REV1.json'),ref('scripts/qualify-lying-public.mjs')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'LYING_PUBLIC_RESULT_REV1.json');plan=load(P/'LYING_PUBLIC_PLAN_REV1.json')
assert v['planSha256']==ref(P/'LYING_PUBLIC_PLAN_REV1.json')['sha256']
assert len(v['results'])==len(plan['runs'])==30
assert sum(r['prefixes'] for r in v['results'])==143
for i,r in enumerate(v['results']):
 assert set(r)==set('law pressure name modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 outputSha256 observerSha256'.split())
 for k,val in plan['runs'][i].items():assert r[k]==val
 assert len(r['observerSha256'])==2
for n,count in [('LYING_TESTS_REV1.json',31),('LYING_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/n);assert t['success'] and t['numPassedTests']==count
 leaves=[a for f in t['testResults'] for a in f['assertionResults']]
 assert len(leaves)==count and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
for i in range(4):
 w=load(P/f'lying-public-workers-rev1/{i}.json');assert set(w)=={'planSha256','results','restores','advancing','views'}
 assert w['restores']==sum(r['prefixes'] for r in w['results'])
 assert len(w['views'])==len(w['results'])
 for _,x in w['views']:assert set(x)=={'outputs','observerViews'} and len(x['observerViews'])==2

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='THIRTEEN LYING SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['Fresh30 stored-view decode/contrast checks, not30-run/143-prefix runtime replay or31/328 tests/build.','Belief-relative contrary purpose can accidentally match truth; received assertion need not achieve intended belief.','No listener model, general persuasion, trust or learned honesty identity inferred.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=13,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
