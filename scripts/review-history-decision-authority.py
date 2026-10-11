from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-decision-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'DECISION_COMPARATOR_PREFLIGHT.md').as_posix():'Component-only intake preserves accepted reason-dice/arbitration. Six laws,three regimes,16seeds,two permissions;fixed reason-mass significance,not general subjective importance. Explicit Always/Never/Decorative/Opaque/IntentEqualsOutcome controls are not fabricated canonical409 records. Public admission,persistence,consequence history andsafe projection remain owed at this dated stage.',
(P/'DECISION_COMPONENT_CHECKPOINT.md').as_posix():'576component cases/576fresh replays historical,not public/prefix evidence. Exact three regimes31/32 vs1/32 Auto,balanced Quiet/PlayerFacing;16seeds equal low/high transcript andchoice. Decorative divergent0,3,8,9,12,14;opaque one-draw balanced marginal lacks reason attribution. Prevented execution preserves baseline intent/expression. Failed3/4 tie extraction read423field2 instead of3;29successor component/inherited checks. Dated PARTIAL andRO018ACTIVE later superseded bypublic closure,currentRO018CLOSED.',
'docs/formal/DECISION_PUBLIC_CONTRACT.md':'Accepted decision-public/0.1:6fixed recipes,empty history,8instants<=64. Current10/14 admits contextual evidence;raw51/reasons52/choice60/intent70/expression80/plan90/attempt100/world110/observation120/consequence124/history140. Permission only world execution;history consumes admitted outcome. d4 or d4+3 with thresholdRoll1/2,Player3/4. Opaque rejects unbalanced unresolved distributions;diagnostic alternatives use935,not forged409. Safe944 excludes random words/addresses while retaining reasons/intent. Player949 projects actualfaces without redraw,not character evidence. History finite append-only;IntentEqualsOutcome drops historicalexpression only after admitted failure,not hidden truth. Failed runs cannot save;quiescent prefixes require full equality. No general significance/multioption/memory law.',
(P/'CAMPAIGN3_DECISION_QUALIFICATION.md').as_posix():'VER-C3-DECISION-001:6models24files174public runs360prefixes186advance174terminal;72affected328reference historical. Three regimes distinguishAuto/Quiet/PlayerFacing;equal low/high draw transcripts andselection. All5controls lose named obligation. Pre-attempt intent/expression invariant topermission;outcomes differ andbaseline history persists. Hidden/invisible evidence controls preserve safeviews,includingcollapse control when outcome unavailable. Missingcurrent evidence not observedzero.72affected includes22public;failed8/22 corrected rollback test not weakened substrate. Broader significance/uncertainty/control/grammar/memory unresolved;historicalactive statuses not current.',
(P/'DECISION_IMPLEMENTATION_FINDINGS.md').as_posix():'Component3/4 failed wrong tie extraction;production arbitration correct. Public8/22 failed14requests forcontinuation saves after reached rollback inFailed state,correctly rejected. Diagnostic committed-address copy supports checks andexplicit failed-save rejection;not character evidence. TypeScript helper/mode fixes before public tests not behavioral receipts. Significance reason-mass proxy,opaque exact onlybalanced,collapse uses admitted failure,history not general memory/identity.',
(P/'DECISION_COMPONENT_PLAN_REV1.json').as_posix():'Frozen Cartesian6laws3regimes16seeds2permissions=576component cases;7source hashes currentmatch. Scope explicitlynotpublic;exact model admission/prefix evidence cannot be inferred from operands.',
(P/'DECISION_COMPONENT_EXPERIMENT_REV1.json').as_posix():'576unique complete Cartesian rows andoriginal stored scientific assertion block checked;declares0publicruns0prefix restores. Historical576fresh replays not rerun now. Low/high transcript/choice,permission intent/expression/outcome andsixdecorative divergence seeds retained. Exact probabilities/metrics/drawcounts anddigest results are typed backing,not newprose findings.',
(P/'DECISION_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen174model/run/original-input commitments,29cases each6laws. Main3regimes4seeds2permissions plus5controls. Scientific gates distinct from historical results;seed andinput bytes preserved inordered joins.',
(P/'DECISION_PUBLIC_EXPERIMENT_REV1.json').as_posix():'174ordered result/input joins,360prefix count andoriginal public closure assertions verified. Typed decisions/draws/intent/expression/history/observations preserve contrasts.6hiddenoutputs andinvisibleconsequence state/character hashes equal;continued history3. Stored hashes not replacement fororiginal byte replay orfresh execution. No component576count inflation.',
(P/'DECISION_VALIDATION_CLOSURE_REV1.json').as_posix():'Exact original read-only closure reproduces6models24images174runs360prefixes72affected328reference historical test/source/contract/plan/result/failure bindings. Boundedpublicclaim explicitlyexcludes generalsignificance/multioption/memory. No freshsimulation/tests;failedcomponent/public receipts checked independently.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='DECISION AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'DECISION_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/DECISION_PUBLIC_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'DECISION_PUBLIC_EXPERIMENT_REV1.json');assert v['runs']==len(v['results'])==174 and v['restores']==sum(r['prefixes'] for r in v['results'])==360
for r in v['results']:assert set(r)==set('law name seed modelIdentity runIdentity orderedInputs prefixes saveSha256 stateSha256 characterSha256 outputsSha256 mode probabilities draws chosen intent expression historicalExpressions observations historyCount'.split())
plan=load(P/'DECISION_PUBLIC_EXPERIMENT_PLAN_REV1.json')
for r in plan['runs']:assert set(r)==set('law name seed modelIdentity runIdentity orderedInputs'.split())
c=load(P/'DECISION_COMPONENT_EXPERIMENT_REV1.json');assert len(c['rows'])==c['cases']==576 and c['publicRuns']==c['prefixRestores']==0
for r in c['rows']:assert set(r)==set('law regime seed permitted mode probabilities margin contest conflictMass stake authorship chosen transcript draws intent expression outcome'.split())

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error','/gates','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-018','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='TEN DECISION SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh576component/174public execution or360prefix replay/tests.','Opaque marginal balanced-only;significance reason-mass proxy;no general memory/identity.','Failed-save rejection preserved;diagnostic address projection not character evidence.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=10,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
