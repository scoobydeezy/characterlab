"""HQ011 factory authority chronology and retained defect controls."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-cognitive-rev1'
SOURCE='docs/formal/OPEN_DECISIONS.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a=1,z=None):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);z=z or len(ls)
 return dict(path=str(p).replace('\\','/'),sha256=sha(p),startLine=a,endLine=z,text=''.join(ls[a-1:z]))
specs=[
 (1802,'Prediction correction','Self-reviewed measurement-prediction0.2 corrects producer275 versus occurrence278; shared279 map sole authority. Earlier367/368 schemas excluded, never used by runtime.','Allocation and exact-mean exploration not runtime; no current-lane producer or ORD001 closure. Unknown differs from learned zero.'),
 (1830,'Prediction qualified','Exact frozen profile qualifies public/component crosswalk and refreshed affected proofs.','No belief timing, confidence, appraisal/reward/value or action-efficacy meaning; RNG persistence still deferred at this date.'),
 (1845,'Task shape/allocation','Prospective task authority and370..376 allocation accepted under autonomous self-review.','Not runtime or workspace/motive/planning qualification; no new occurrence namespace.'),
 (1860,'Task key correction','Two erroneous StateMapKey declarations inside record key removed; ten RecordField roles retained. Corrected192-model review distinct.','Task-local correction not global PRJ/VAL/WRT change; construction tests not runtime qualification.'),
 (1876,'Task runtime qualified','TC A..L qualify exact0.2 profile with lifecycle/public/component limits. Prior receipts refreshed into successors.','Live-list historical instrumentation not canonical workspace or reason/dice/identity replacement. Baseline974 and24 focused not one998-test run.'),
 (1899,'Cognitive drafts','Direct-strength standing required initial port; alignment-scaled alternative retained. Empty-identity32/32 exploration and seven RNG checks component only.','No generated cognition/PERSIST-I qualification or allocation from draft59/184 inventory.'),
 (1915,'Cognitive shape/allocation','Task cognitive shape and separate377..452 allocation accepted, including373/schema2 instruction. Earlier fields/bytes preserved; redundant coverage wrapper removed.','Runtime still not passed at shape. ContextModulating future source retained; general DEC/ORD unresolved.'),
 (1940,'Campaign2 bounded completion','Thin reference scaffold complete by authorized internal review, with exact cognitive and persistence receipts. Later dispositions supersede dated pending prose in scope.','Not whole ideal loop, Campaign3 corpus completion, universal necessity or external review. General same-event timing and wider decision remain separate.'),
 (1957,'Attention lifecycle and credit','Acquisition first then distinct append-only outcome consolidation; fallible observer attribution gates credit, unavailable not zero.','B resolves lifecycle not law. No conscious causal belief requirement; experiential association remains future comparator.'),
 (1967,'Interoceptive topology','Separate acquisition with within-body contention and selected-only durable memory; safe grouping and signal-per-opportunity units. Synthetic three-reserve source distinct physical/signal names.','Shared resources comparator retained; no timestamp opportunity identity, pressure aggregation or canonical physiology. Component scope at this historical checkpoint.'),
 (1977,'Reopen boundary','New source/state/evidence/math/randomness/profile semantics reopen bounded qualification.','No inferred broad decision closure or corpus member.'),
 (1982,'BELIEF later qualification','Fallible evidence, consequence140 update and later50 appraisal qualified.','ORD001 same-event timing stays open; scalar candidate does not require covariance. Broader inference preserved by RO010.'),
 (1992,'SOCIAL later qualification','Immutable fan-out and disjoint updates give reversed-order semantic equality; closed observer projection passes read/field controls.','Not reciprocal/conflicting ordering or general privacy/authentication. Omniscient research save/trace distinct; RO014 retains wider scope.')]

assert sha(SOURCE)==sha(B/'sources'/SOURCE)
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 1802<=u['location']['startLine']<=2001:continue
  assert u['location']['endLine']<=2001
  _,name,judgment,reopen=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  e=excerpt(B/'sources'/SOURCE,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
  rows.append(dict(occurrenceId=u['id'],source=e,decision=name,judgment=judgment,reopen=reopen,obligations=['RO-C3-020','RO-C3-021']))
lines=Path(B/'sources'/SOURCE).read_bytes().decode('utf-8-sig').splitlines()
assert {n for r in rows for n in range(r['source']['startLine'],r['source']['endLine']+1)}=={n for n in range(1802,2002) if lines[n-1].strip()}
prior=load(P/'campaign3-history-factory-rev1/review.json')['rows']
assert not {r['occurrenceId'] for r in rows}&{r['occurrenceId'] for r in prior}
manifest=load(O/'source-manifest.json')
for x in manifest['files']:assert sha(x['path'])==x['sha256'],x['path']
t=load(O/'tests.json');assert t['success'] and t['numPassedTests']==25 and t['numFailedTests']==t['numPendingTests']==0
assert len(t['testResults'])==4 and all(a['status']=='passed' for f in t['testResults'] for a in f['assertionResults'])
r=dict(status='HQ011 COGNITIVE/REGISTER TAIL REVIEWED; WIDER AUDIT OPEN',rows=rows,
 evidence=[excerpt(P/'CAMPAIGN2_COMPLETION_REVIEW.md'),excerpt(P/'CAMPAIGN2_COGNITIVE_QUALIFICATION.md'),excerpt(P/'CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md'),excerpt(P/'CAMPAIGN2_PERSIST_I_SCOPE_ADDENDUM.md')],
 preservedFindings=['Prediction producer/occurrence confusion and task map-key/record-field confusion corrected forward without rewriting prior allocation.',
 'Missing identity participant before common-stage prior reads was corrected; later rollback alone was insufficient.',
 'A save test initially changed the wrong field and was non-discriminating; temporary assay-anchor failures were not passes.',
 'Successor RNG prefix restore is qualified, including genuine zero-meaning draws; original cross-build absent-consumer requirement remains a distinct evidence-mapping question in HQ011, not a rescinded successor verdict.'],
 tests=dict(path=(O/'tests.json').as_posix(),sha256=sha(O/'tests.json'),passed=25,files=4,titles=[a['fullName'] for f in t['testResults'] for a in f['assertionResults']]),
 sourceManifestSha256=sha(O/'source-manifest.json'),obligations=['RO-C3-007','RO-C3-008','RO-C3-005','RO-C3-019','RO-C3-020','RO-C3-021'],
 limits=['Formal register1802..2001 only; its entire tail is accounted, not the entire authority universe or all earlier register introductory paragraphs.',
 'Fresh focused tests only, not full historical source substitutions, entire public recipe matrix, reference suite or build.',
 'Source audits and mutation controls are not universal psychological necessity. Same seed across models is not address coupling; prefix replay is not scaling or antirollback proof.'],
 nextGate='Continue HQ011 verdict/qualification claim spine and exact PERSIST-I cross-build trigger evidence mapping; do not infer whole authority adequacy from completing register tail.')

def validate(v):
 assert v==r
 for e in [x['source'] for x in v['rows']]+v['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert sha(v['tests']['path'])==v['tests']['sha256']
validate(r);faults=[]
for mode in ['omitted-occurrence','bounded-as-universal','lost-rejected-packet','false-test-total','lost-split-scope']:
 v=copy.deepcopy(r)
 if mode=='omitted-occurrence':v['rows'].pop()
 elif mode=='bounded-as-universal':v['rows'][0]['judgment']='All persistence including future RNG is universally qualified'
 elif mode=='lost-rejected-packet':v['preservedFindings'].pop(0)
 elif mode=='false-test-total':v['tests']['passed']=328
 else:v['rows'][-1]['reopen']='Generic evidence proves arbitrary public profiles'
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',r)
c=dict(status=r['status'],originalOccurrences=len(rows),decisionGroups=len(specs),indexedWholeOccurrenceLinks=485+len(rows),freshTests=25,boundSourceFiles=len(manifest['files']),faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
