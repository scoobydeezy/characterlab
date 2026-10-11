"""Review bounded disposition evidence without rewriting historical receipts."""
from pathlib import Path
from fractions import Fraction as F
import hashlib,json,subprocess
P=Path('docs/planning');O=P/'campaign3-history-disposition-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def write(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v

subprocess.run(['node','scripts/check-disposition-closure.mjs'],check=True)
write(O/'closure-check.json',dict(status='PASS',scope='Fresh original read-only closure; historical35 affected/328 reference tests and build not rerun.',closure=ref(P/'DISPOSITION_CLOSURE_REV1.json'),checker=ref('scripts/check-disposition-closure.mjs')))
parts=[load(O/f'replay-part{i}.json') for i in range(3)]
assert all(x['status']=='PASS' and x['cases']==5 and x['prefixes']==95 for x in parts)
assert sorted(x['index'] for p in parts for x in p['checks'])==list(range(15))
assert all(x['checkerSha256']==ref('scripts/replay-history-disposition.mjs')['sha256'] for x in parts)
explore=load(O/'exploration-check.json');assert explore['status']=='PASS' and (explore['attempts'],explore['cases'],explore['rows'])==(31,7,126)

plan=load(P/'DISPOSITION_PLAN_REV2.json');old=load(P/'DISPOSITION_PLAN_REV1.json');assert old['models']==plan['models'] and old['runs']==plan['runs']
assert all(not (P/f'DISPOSITION_RUN_{i}_REV1.json').exists() for i in range(15))
a={x['path']:x['sha256'] for x in old['artifacts']};b={x['path']:x['sha256'] for x in plan['artifacts']}
assert set(a)==set(b) and {p for p in a if a[p]!=b[p]}=={'scripts/check-disposition-adaptation.mjs','scripts/qualify-disposition-adaptation.mjs'}
for x in plan['artifacts']:assert ref(x['path'])['sha256']==x['sha256']
preserved=[ref(p) for p in ['docs/planning/disposition-plan-rev1/check-disposition-adaptation.mjs','docs/planning/disposition-plan-rev1/qualify-disposition-adaptation.mjs','docs/planning/DISPOSITION_EXPLORATION_SOURCE_REV1.ts']]
for x in load(P/'DISPOSITION_PLAN_REVIEW_REV1.json')['files']:assert ref(x['path'])['sha256']==x['sha256']

# Independent exact arithmetic over all recorded contributions; no implementation update helper.
checked=0;cap_rows=0
for entry in plan['runs']:
 r=load(P/f"DISPOSITION_RUN_{entry['index']}_REV2.json");law=entry['law'];base=F(entry['constitution'],8);plastic=F(0);standing=F(0);history=[]
 for i,row in enumerate(r['rows']):
  checked+=1;state=row['state'];frame=row['frame'];assert row['at']==i+1
  assert F(state['constitution'])==base and F(state['before'])==plastic and F(state['effectiveBefore'])==base+plastic
  if law=='StandingOnly':acquired=standing
  elif law=='Neither':acquired=F(0)
  elif law=='JointAdd':acquired=plastic+standing
  elif law=='JointMax':acquired=plastic if abs(plastic)>abs(standing) else standing
  else:acquired=plastic
  assert state['feedback'] is None if not frame['active'] else F(state['feedback'])==base+acquired
  contribution=F(row['contribution'])
  if contribution:
   assert frame['stage']=='Learn' and frame['active'] and frame['significance']==4 and frame['pressure']==0
   history.append(contribution)
   if len(history)%4==0:
    total=sum(history[-4:]);sign=(total>0)-(total<0)
    if law in ['StandingOnly','Neither']:plastic=F(0)
    elif law=='Leaky':plastic=(plastic+F(sign,4))/2
    else:plastic=max(F(-1,4),min(F(1,4),plastic+F(sign,8)))
  assert state['count']==len(history) and F(state['after'])==plastic
  cap_rows+=abs(plastic)==F(1,4)
  if not frame['active']:assert row['chosen'] is None and not row['probabilities'] and row['expression'] is None and not row['addresses']
  standing=F(row['strength'])
 assert r['prefixes'][-1]['saveSha256']==r['saveSha256']
 for i,prefix in enumerate(r['prefixes']):assert prefix['at']==i and prefix['nextSha256']==r['prefixes'][min(i+1,18)]['saveSha256']
assert checked==270 and cap_rows==0
write(O/'arithmetic-check.json',dict(status='PASS',scope='Independent exact arithmetic for immutable constitution, separate prior plastic/standing receiving, batch learning and effective state over all15 recorded cases. No row reaches the declared plastic cap; this cohort does not exercise saturation.',rows=checked,plasticCapRows=cap_rows,checker=ref(__file__)))

specs={
 'docs/formal/DISPOSITIONAL_ADAPTATION_CONTRACT.md':'Accepted component0.1,18 instants and one task-direction channel. Immutable B0, separate A and E=B0+A, four accepted-event batches, Step/Leaky candidates, exact-history Refold. No widening generic ADAPT targets; no native phases/Save132, ageing or seven-axis qualification. Context units1/1 versus1/16 are fixed controls; one precombined empty-basis signal is not general provenance/fusion.',
 'docs/planning/DISPOSITIONAL_ADAPTATION_READINESS.md':'Prospective gap inspection separates constitution, plasticity, effective disposition, standing, represented belief and current goals. Naming an unmaterialized family is not implemented adaptation. Require actual qualified biography, independent-usefulness comparison and conservative existing authority. Broader targets and horizon require explicit successor.',
 'docs/planning/CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION.md':'VER-C3-DISPOSITION-001:9 models15 cases285 component prefixes270 advancing15 terminal;35 affected328 reference/build historical. FourA/eightB learning choices from selected original seed schedule; Step reverses after contrary batches. JointMax equals StandingOnly throughout; JointAdd amplifies shared history, not independent necessity. Refold exact full-row equality preserves conceptual distinction without proving extra scalar storage necessary. No native or general development claim.',
 'docs/planning/DISPOSITION_ADAPTATION_FINDINGS.md':'Preserved exploratory source precedes structural copy/parse optimization; producers still refine, restore installs nothing and checks full replay bytes. PlanREV1 wrongly assumed equal numeric learning biographies implied equal full causal traces; rejected before any qualification. REV2 corrects comparisons while preserving original within-run history and exact Refold equality. Empty-basis combined signal requires native separate operands/lineage later.',
 'docs/planning/DISPOSITION_PUBLIC_READINESS.md':'Prospective public gate: component snapshots/logical order do not qualify native Save132/phase ownership. Separate typed constitution/plastic/standing and original journal; no constitution writer, no motive creation, no general fusion or conscious testimony from diagnostics. Preserve all laws and component semantics while extending wrapper audit explicitly.',
 'docs/planning/DISPOSITION_PLAN_REV1.json':'Frozen but unexecuted manifest; erroneous cross-model full-expression equality assumption caught before qualification. No REV1 worker exists. All model/run identities and cases equal successor; only checker/runner source hashes change.',
 'docs/planning/DISPOSITION_PLAN_REV2.json':'Successor frozen exact originals, nine model/fifteen run commitments, comparison and artifacts. Same cases/laws/IDs as unexecuted predecessor; repairs semantic-versus-trace comparison only. Fresh replay recomputes all commitments before execution.',
 'docs/planning/DISPOSITION_PLAN_REVIEW_REV1.json':'Seven explicit comparisons retain equal numeric learning contributions but unequal full expression bytes for Leaky/StandingOnly/Neither/JointMax/JointAdd; Plastic and Refold equal. Three exact preserved sources and original manifest authenticated. Not a discarded failing psychological cohort.',
 'docs/planning/DISPOSITION_EXPLORATION_REV1.json':'All31 attempted seed/outcome/target records retained, along with original18-frame schedule and seven full cohorts. Fresh reconstruction matches complete object. Witness selection targets fourA/eightB through seeds, not authored action input; no unselected-frequency or population claim. Probe/gap controls remain fixed.',
 'docs/planning/DISPOSITION_RESULT_REV2.json':'Bound cross-case matrix retains state/probability/sample distinctions, candidate equalities, absent evidence/pressure, execution, inactive motives, context return and +/-constitution. All15 original results freshly replay with285 complete component prefixes; seven primary cohorts equal exploration exactly.',
 'docs/planning/DISPOSITION_CLOSURE_REV1.json':'Fresh original closure authenticates unexecuted rejected manifest, exact archives, full result,35 affected328 reference/build and next public debt. Historical1450/0 and component-only scope; no new native producer or selected joint law.',
 'docs/planning/DISPOSITION_BUILD_REV1.json':'Historical successful build with original log/source scope; no fresh build claim.',
 'docs/planning/DISPOSITION_TESTS_REV1.json':'Historical8 new tests: batch delay, immutable baseline, atomic update rollback, quiescent and concurrent rejection, absent/pressured evidence, copied originals/snapshots, strict input and forged-save rejection, stored/derived agreement. Component fault permits later retry; not native Failed lifecycle.',
 'docs/planning/DISPOSITION_INHERITED_TESTS_REV1.json':'Historical27 inherited dice/arbitration/provenance checks, all individual passed leaves authenticated. No fresh rerun or whole active-suite claim.',
 'docs/planning/DISPOSITION_REFERENCE_TESTS_REV1.json':'Historical328 reference tests, all passed leaves authenticated; no broader active-suite or fresh execution claim.',
}
for i in range(15):specs[(P/f'DISPOSITION_RUN_{i}_REV2.json').as_posix()]=f'Frozen component worker{i}: fresh exact full execution,19 complete prefix restores and one successor each, original run/model/input commitments and full receipt equality. Independent batch/receiving arithmetic, immutable constitution and within-run expression preservation. Component snapshot is not native Save132; equal numeric cross-model biographies are not equal causal traces.'
for name,n in [('DISPOSITION_TESTS_REV1.json',8),('DISPOSITION_INHERITED_TESTS_REV1.json',27),('DISPOSITION_REFERENCE_TESTS_REV1.json',328)]:
 t=load(P/name);assert t['success'] and t['numPassedTests']==n and t['numFailedTests']==t['numPendingTests']==0
 leaves=[a for f in t['testResults'] for a in f['assertionResults']];assert len(leaves)==n and all(a['status']=='passed' and not a['failureMessages'] for a in leaves)
t=load(P/'DISPOSITION_BUILD_REV1.json');assert t['status']=='PASS' and t['exitCode']==0
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
chain=[ref(O/n) for n in ['closure-check.json','replay-part0.json','replay-part1.json','replay-part2.json','exploration-check.json','arithmetic-check.json']]+[ref('scripts/replay-history-disposition.mjs'),ref('scripts/replay-history-disposition-exploration.mjs'),ref(P/'DISPOSITION_CLOSURE_REV1.json'),ref('scripts/check-disposition-adaptation.mjs'),ref('scripts/check-disposition-closure.mjs')]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='DISPOSITION COMPONENT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or '/failureMessages/' in ptr or ptr.startswith(('/status','/reason','/claims','/limits','/scope','/finding','/predecessor/disposition'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-009','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']
v=dict(status='DISPOSITION COMPONENT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=preserved,obligations=obs,limits=['Fresh15-case285-prefix component replay; no native Save132 or fresh tests/build.','31 selected-seed exploratory attempts and seven full cohorts reproduce; no population frequency or general calibration claim.','Constitution, plasticity and standing separate; Refold equality and JointMax/StandingOnly equivalence retain unresolved storage/independent-necessity questions.','No native provenance, conscious trait belief, calendar ageing, clinical or general developmental claim.','Rejected unexecuted REV1 is preserved; numerical biography equality is not full causal-trace equality.','All270 recorded rows remain strictly inside the declared +/-1/4 plastic cap. Saturation behavior is not exercised by this cohort; RO017/020 retain that limit for broader-range claims.'])
check=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),checker=ref(__file__))
write(O/'review.json',v);write(O/'check.json',check);print(json.dumps(check))
