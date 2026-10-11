from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-habit-authority-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'HABIT_READINESS.md').as_posix():'Historical intake uses existing Habit-to-OptionGen route,not new motive force. DerivedHistory/StoredSummary and Residual/Linear/NoHistory retained. ExplicitBeliefOnly insufficient is not unlawful;CurrentRewardOnly violates observer boundary. Identity/body/skill fixed controls,not reductions. Initial addiction/control deferrals describe this scope,not later campaign progress.',
'docs/formal/HABIT_PUBLIC_CONTRACT.md':'Accepted habit-public/0.1-candidate:one actor/action/idle,two cues,max16opportunities. History821 only admitted performed reports;expectation823 latest report can change from information alone;cache825 folds both cues after history. Residual positive(h+1)/2,negativeh/2;Linear +/-1/4 clamped;NoHistory0. Candidate threshold1/2,availability not extra reason. Fourteen stages fixed;cache equality at committed boundary,rollback covers temporary mismatch. Hidden truth not safe evidence. Full finite journal retained;no general memory/compression/control/addiction law.',
(P/'CAMPAIGN3_HABIT_QUALIFICATION.md').as_posix():'VER-C3-HABIT-001:12models/60files/23runs/291prefixes,268advancing/23terminal;75affected/328reference historical tests. Equal explicit expectation,different history gives target probability1/2 vs0. Later performed negatives alter history;information alone changes expectation. Derived/cache outputs including RNG equal for3laws. Separate summary NOT REQUIRED only with full finite journal/fixed fold;no architecture box retired. Admission does not imply universal conscious-awareness requirement. Broader addiction work later remains separate evidence;RO015 preserves generalization.',
(P/'HABIT_IMPLEMENTATION_FINDINGS.md').as_posix():'Initial type narrowing/readonly-list/record argument and evaluator syntax failures occurred before public execution;preserved historical finding,not newly rerun. HABIT-FIND001 availability-mediated neutral tie is not compulsion or stronger preference. FIND002 history/cache equality is committed-boundary invariant;temporary intra-transaction mismatch must remain unobservable and rollback atomically. Journal is not general episodic recall/skill/identity.',
(P/'HABIT_PUBLIC_EXPERIMENT_PLAN_REV1.json').as_posix():'Frozen23run plan binds12model cohort and exact original input commitments. Declared equal-expectation/history,hidden reward,cue/evidence,law and representation contrasts;researcher labels not cognitive evidence.',
(P/'HABIT_PUBLIC_EXPERIMENT_REV1.json').as_posix():'23stored results/291prefixes. Typed appraisals separate h from optionalBoolean expectation;probabilities/chosen/draw counts and safe/cognitive hashes preserve actual randomized paths. Original scientific assertions and plan joins pass;false reports vs hidden reward,unseen training and cue controls remain. No fresh runtime execution.',
(P/'HABIT_VALIDATION_CLOSURE_REV1.json').as_posix():'Exact original closure reproduces60image hashes,contract/allocation/source commitments and stored75affected/328reference evidence. Decoded intervention fields match;Residual/Linear probabilities differ and Derived/Stored safe hashes equal for3laws. No general habit-to-memory reduction or addiction claim;not fresh tests/prefix replay.'}

entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='HABIT AUTHORITY / FINDING / TYPED EVIDENCE',judgment=j,acceptanceChain=[ref(O/'canonical-check.json'),ref(P/'HABIT_VALIDATION_CLOSURE_REV1.json'),ref('docs/formal/HABIT_PUBLIC_CONTRACT.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
v=load(P/'HABIT_PUBLIC_EXPERIMENT_REV1.json');assert v['runs']==len(v['results'])==23 and v['restores']==sum(len(r['prefixes']) for r in v['results'])==291
for r in v['results']:
 assert set(r)==set('name model prefixes appraisals probabilities chosen randomDraws cognitiveSha256 safeSha256'.split());assert len(r['appraisals'])==len(r['probabilities'])==len(r['chosen'])
 for x in r['appraisals']:assert set(x)=={'h','belief'} and (x['belief'] is None or isinstance(x['belief'],bool))

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reason','/claims','/limits','/limitations','/error'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
obs=['RO-C3-015','RO-C3-019','RO-C3-020','RO-C3-021'];v=dict(status='SEVEN HABIT SOURCES REVIEWED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,limits=['No fresh23-run replay,rollback or tests.','Cache equivalence assumes full journal/fixed folds;no safe compression or general episodic reduction.','Availability persistence is not preference against stronger reasons or compulsion.'])
for n,x in [('review.json',v),('check.json',dict(status='PASS; HQ011 OPEN',sources=7,originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),checker=ref(__file__)))]:
 f=O/n
 if f.exists():assert load(f)==x
 else:f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(load(O/'check.json')))
