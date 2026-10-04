"""HQ011: preserve the Campaign2 admission chronology, not blanket acceptance."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-campaign2-admission-rev1'
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
 (461,'EVID shape','Safe source embedded whole; identity-like evaluation, no subject/roster/state/truth reads or learning writes. Consumer ingress is once per source per consumer; exact output closure and whole-instant rollback.','Shape is not EVID A..T passage. State-writing ADAPT needs its own extension; extra legitimate consumers alone do not reopen.'),
 (500,'REG shape','Immutable model declarations provide exact linear R0; no run-owned anchor, reanchor or state write. ADAPT owns retained D and time-only invalidation, without clamping.','Shape is not REG A..R passage or acceptance of ADAPT; VAL remains independently gated.'),
 (522,'PRJ accessor clarification','Permanent accessor family and seam/version/accessor identity required; role is enforced at Campaign2 boundary.','No allocation here; no extra requirement registry or global ActualRead narrowing.'),
 (538,'ADAPT shape','Composed A..F shapes accepted; permanent allocation may proceed.','No implementation or PHEN/mutation qualification; VAL must close before affected canonical reliance.'),
 (559,'G1/G2 proposal','Shared CONTENT kind1004, substrate seam1036 and adaptation0.31 proposed.','Not yet permanent allocation; no global legacy trace migration or new seam registry.'),
 (570,'Campaign2 allocation','Records260..328 and named namespaces frozen after parity checks;1004 now CONTENT.','Construction authorization is not execution evidence; no historical hole reuse or ADAPT qualification.'),
 (591,'VAL draft','Committed closed interpreters replace independent callbacks as proposed direction.','Specialization and allocation missing; shape and A..R not accepted.'),
 (602,'VAL rejected intermediate packet','Direction accepted but missing domain-validator binding and ambiguous CONTENT withhold shape; revised existing-ID definition proposed.','Exact validator declaration/reference closure required; no unsupported-kind fallback or fabricated second-kind positive control.'),
 (620,'VAL shape','Committed model operands determine semantic choices; build support can reject activation without changing identity.','Proposed329/330 still await allocation. Model admission differs from executable release; not runtime qualification.'),
 (643,'VAL allocation','329/330 and two registry members frozen; RequiredSemanticKind belongs to construction.','Malformed declarations and runtime role violations remain distinct; A..W and activation gates still pending.'),
 (659,'Factory design1','Data-only facade; seven-stage internal compilation and restore checks before returning handle.','Manifest, projections and continuation mapping pending; no callbacks, adapter hooks or independent work limit.'),
 (674,'Factory design2 / persistence intake','Direction accepted but implementation design withheld. EVID has zero state/subject reads; initialization differs from WRT mutation.','REG mirror field8 only proposed, not accepted; independent codec work is not whole activation.'),
 (693,'Factory shape / rejected REG mirror','Factory shape and fields9/10 accepted; field8 withheld, then retracted to empty list. REG declarations belong to model, D is validated at T.','Exact RulesVersion/model bundle binding remains FCT5 obligation; shapes do not pass persistence or factory gates.'),
 (710,'Persistence shape / factory design','Fields8/9/10 empty justified over full admitted execution closure, including all branches and fixed infrastructure.','An observed no-draw run is insufficient. FCT1..4 implementation authorized, not activation or FCT5.'),
 (727,'FCT1/2 and origin','Component tests precede full proof. Distinct authored StableId and runtime ordinal origin families accepted; test20/21 promotion rejected.','No old/new SEM byte or identity equivalence; fixtures changed explicitly. Factory, V06 and qualification remain pending.'),
 (754,'FCT3 content proposal','Key grammar, read-only and IDN checks are component evidence; CONTENT-owned definition family proposed.','Do not promote fixture23000/20 or globally narrow type170/1; historical test counts are not new execution receipts.'),
 (770,'Content allocation resolved','Namespace1038 frozen; bounded first profile requires family while generic CONTENT stays polymorphic.','Constructors and REG/V04 tests do not activate whole factory or impose global slot constraint.'),
 (784,'Admitted input component','Opaque admitted capability, consumer ingress, PRJ and EVID allocation exercised; duplicate/forged work rolls back.','Component evidence is not whole SEM/factory/V06/VAL qualification.'),
 (795,'Composed PRJ/V06','One inherited authority mechanism; uniqueness, disjoint storage, grammar/role and roster exclusions tested as components.','Runtime settlement and FCT4 pending; five unscheduled operands lack encoding and canonical-list proposal is not implemented here.'),
 (810,'FCT-C split scope','Generic valid A/B/absent roster invariance, forbidden projection and bounded factory exclusion are independently required.','Rejection alone cannot prove invariance; no new roster-capable public profile, allocation, VAL/ADAPT or whole Campaign2 closure.')]
assert sha(SOURCE)==sha(B/'sources'/SOURCE)
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 461<=u['location']['startLine']<=818:continue
  assert u['location']['endLine']<=818
  _,name,judgment,reopen=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  e=excerpt(B/'sources'/SOURCE,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
  rows.append(dict(occurrenceId=u['id'],source=e,decision=name,judgment=judgment,reopen=reopen,obligations=['RO-C3-020','RO-C3-021']))
lines=Path(B/'sources'/SOURCE).read_bytes().decode('utf-8-sig').splitlines()
assert {n for r in rows for n in range(r['source']['startLine'],r['source']['endLine']+1)}=={n for n in range(461,819) if lines[n-1].strip()}
prior=load(P/'campaign3-history-foundation-decisions-rev1/review.json')['rows']
assert not {r['occurrenceId'] for r in rows}&{r['occurrenceId'] for r in prior}
manifest=load(O/'source-manifest.json')
for x in manifest['files']:assert sha(x['path'])==x['sha256'],x['path']
t=load(O/'tests.json');assert t['success'] and t['numPassedTests']==6 and t['numFailedTests']==t['numPendingTests']==0
assert len(t['testResults'])==3 and all(a['status']=='passed' for f in t['testResults'] for a in f['assertionResults'])
r=dict(status='HQ011 CAMPAIGN2 ADMISSION BATCH REVIEWED; WIDER AUDIT OPEN',rows=rows,
 evidence=[excerpt(P/'CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md'),excerpt(P/'CAMPAIGN2_COMPLETION_REVIEW.md')],
 preservedFinding='Initial projection guard rejected but direct context.state substitution succeeded. Later production evidExecution data-only isolation rejects twelve capability requests independently in E and L, with whole-instant rollback. Generic harness identity is not a public factory profile.',
 tests=dict(path=(O/'tests.json').as_posix(),sha256=sha(O/'tests.json'),passed=6,files=3,titles=[a['fullName'] for f in t['testResults'] for a in f['assertionResults']]),
 sourceManifestSha256=sha(O/'source-manifest.json'),obligations=['RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'],
 limits=['Formal register461..818 only; later probe/memory/qualification records remain open.',
 'Six fresh focused tests, not full historical mutants, Campaign2 suite, reference tests or build. Later completion review is bounded contextual evidence, not retroactive acceptance of intermediate packets.',
 'No production, formal contract, allocation, law, verdict or corpus change; historical findings and conditional debt retained.'],
 nextGate='Continue HQ011 at formal register819: diagnostic regulatory probe and subsequent memory/qualification chain.')
def validate(v):
 assert v==r
 for e in [x['source'] for x in v['rows']]+v['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert sha(v['tests']['path'])==v['tests']['sha256']
validate(r);faults=[]
for mode in ['omitted-occurrence','shape-as-runtime','lost-capability-failure','false-test-total','lost-reopen']:
 v=copy.deepcopy(r)
 if mode=='omitted-occurrence':v['rows'].pop()
 elif mode=='shape-as-runtime':v['rows'][0]['judgment']='All runtime gates passed at shape acceptance'
 elif mode=='lost-capability-failure':v['preservedFinding']='No historical capability failure'
 elif mode=='false-test-total':v['tests']['passed']=328
 else:v['rows'][0]['reopen']=''
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',r)
c=dict(status=r['status'],originalOccurrences=len(rows),decisionGroups=len(specs),indexedWholeOccurrenceLinks=251+len(rows),freshTests=6,boundSourceFiles=len(manifest['files']),faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
