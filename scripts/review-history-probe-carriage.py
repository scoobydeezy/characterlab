"""HQ011 probe/carriage authority chronology and retained defect controls."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-probe-carriage-rev1'
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
 (819,'Probe target and revisions','First permitted difference at203 from exact R0+D; availability/permission explicit. X/E/L equal at matched support. Correct truth n versus observation q, parent chain and private five-advance budget.','Drafting/directional acceptance is not whole shape or implementation.9a observation differs from9b cognition; scalar-bearing cognitive consumer needs its own seam.'),
 (842,'Probe shape / proposed allocation','Whole shape accepted including InputOnly restore clarification;224 allocation checks support a proposal.','A..P frozen not passed; no permanent numbers, implementation or parent closure yet.'),
 (856,'Probe allocation frozen','331..335/1123 and members permanent after exactly three governed type259 variants repair the layout-only table.','240 mechanical checks do not qualify runtime; packaging and model freeze remain separate.'),
 (869,'Probe packaging / materialization','Exact bindings and positions0..5 accepted; isolated compiler produces named digest.','Fresh reproduction, tests and build are component evidence; concrete freeze and authoritative runtime still pending.'),
 (878,'Probe model frozen / accessor gap','Seven-artifact packet frozen; runtime authorized under probe rules. Exact D read lacks a named accessor.','Do not invent member or silently change trace/model; source component alone is not public activation.'),
 (890,'Accessor symbol / successor required','Symbol accepted; retaining .1 RulesVersion/ModelIdentity for new read trace explicitly rejected.','Member and .2 successor remain proposals. Keep historical .1 immutable despite unchanged arithmetic.'),
 (903,'Accessor permanent / successor materialized','Member and trace/rules .2 accepted; only identity field1 changes, six component artifacts remain equal.','Concrete successor freeze still required before authoritative trace; materialization is not runtime proof.'),
 (913,'Probe .2 runtime / temporal gap','Successor frozen; accessor controls execute under .2. Constant public REG excludes valid generic temporal witness.','No retroactive .1 trace activation or widened compiler; whole probe and F split not yet qualified here.'),
 (929,'F split / detached arithmetic','F requires generic temporal REG plus actual consumer AND frozen public exclusion. Detached R0/D arithmetic rejects forbidden capabilities; rollback/recovery evidence expands.','Time-only change is not adaptation. Positive generic witness is not a temporal public model; full A..P still open at this point.'),
 (943,'Output-closure defect repaired','Extra learning output initially committed because producer validation missed exact count. Per-slot cardinality/type and ordered archive producer projection now reject.','Retain the failed claim and repair; frozen contracts/model unchanged. Partial verification is not whole probe closure.'),
 (956,'Probe qualification submitted','Matched-allocation scalar, read/carriage, numeric and SEM source-audit substitutions assembled.','Submission is not acceptance; source audits are bounded implementation evidence, not new runtime laws.'),
 (964,'Probe runtime qualified','A..P and accessor PASS;9a permitted5 versus51/10 while matched X/E/L equal. F generic/public split and G public/generic signed/public exclusion retained.','No9b, parent9, PHEN or whole Campaign2 closure. L is scoped; no broader learning, physiology, performance or scalar-bearing X/E/L claim.'),
 (981,'Carriage target / revision1','Observer-owned transient exact203 plus safe unit proposed; persistent cognition unchanged.','New producer/route proposal later withdrawn; target is not shapes, allocations or ADAPT9b.'),
 (994,'Carriage revision2','No new route; shared ingress generates actual intake child and profile owns suppressed padding. Exact occurrence role and six/eight topology proposed.','Whole shape withheld; proposed shared admission version subsequently corrected, no implementation authority.'),
 (1008,'Carriage version correction','Shared singleton stays V04 cardinality1; occurrence entries extend committed data. Separate NoStateWrites registration extension V07 proposed.','No latest-version selection/fallback; preserve V04/V06 rows and rejected shared-V07 proposal.'),
 (1023,'Carriage shape / allocation proposal','Shape accepts separate V07 and authenticated observer-measurement producer only.336..341/1124 proposed.','195 audit checks do not freeze numbers. No new producer union, route, write, state root or observation identity.'),
 (1041,'Carriage allocation frozen','336..341, occurrence family and six members frozen; existing authority/model packets preserved.','Packaging only authorized; EVC runtime gates remain not passed.'),
 (1057,'Ordered-input packaging correction','New input profile withdrawn; reuse exact accepted probe input profile. Phase120 envelope successor-owned, padding not V07.','Whole packaging withheld until correction accepted; identity/profile reuse does not authorize runtime.'),
 (1071,'Carriage packaging / model review','Whole packaging accepted; exact bundle and slot deltas materialized with four variants and prior preservation.','Component PACK findings only; V07 dispatch/topology/restore not implemented here, no blanket PASS.'),
 (1088,'Carriage frozen / implementation','Model and controls frozen; actual V07 ingress, detached intake, padding, trace/archive implemented. Restore dispatch omission corrected and retained.','Qualification requested, not yet accepted at this record. No persistent cognition or extra allocation earned.'),
 (1110,'Carriage runtime qualified','EVC/PACK accepted. Generic R0/D decomposition equality through actual production chain plus public changed-anchor exclusion; transient observer-owned337 safely carries scalar.','Present-only diagnostic domain and frozen first profile only. Bounded source equivalence is not exhaustive manifests. No memory/learning/9b/parent/PHEN/Campaign closure.')]
assert sha(SOURCE)==sha(B/'sources'/SOURCE)
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 819<=u['location']['startLine']<=1134:continue
  assert u['location']['endLine']<=1134
  _,name,judgment,reopen=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  e=excerpt(B/'sources'/SOURCE,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
  rows.append(dict(occurrenceId=u['id'],source=e,decision=name,judgment=judgment,reopen=reopen,obligations=['RO-C3-020','RO-C3-021']))
lines=Path(B/'sources'/SOURCE).read_bytes().decode('utf-8-sig').splitlines()
assert {n for r in rows for n in range(r['source']['startLine'],r['source']['endLine']+1)}=={n for n in range(819,1135) if lines[n-1].strip()}
prior=load(P/'campaign3-history-campaign2-admission-rev1/review.json')['rows']
assert not {r['occurrenceId'] for r in rows}&{r['occurrenceId'] for r in prior}
manifest=load(O/'source-manifest.json')
for x in manifest['files']:assert sha(x['path'])==x['sha256'],x['path']
t=load(O/'tests.json');assert t['success'] and t['numPassedTests']==34 and t['numFailedTests']==t['numPendingTests']==0
assert len(t['testResults'])==4 and all(a['status']=='passed' for f in t['testResults'] for a in f['assertionResults'])
r=dict(status='HQ011 PROBE/CARRIAGE BATCH REVIEWED; WIDER AUDIT OPEN',rows=rows,
 evidence=[excerpt(P/'CAMPAIGN2_PROBE_QUALIFICATION_REVIEW.md'),excerpt(P/'CAMPAIGN2_MEASUREMENT_EVIDENCE_QUALIFICATION_REVIEW.md')],
 preservedFindings=['Extra learning output initially committed; exact producer output count/type and ordered archive closure repaired it.',
 'Carriage restore omitted its configuration and selected old probe trace binding; corrected explicitly without model/contract changes.',
 'Original carriage full parallel run had four five-second contention timeouts; unchanged-timeout two-worker rerun passed. Environment/config-access failures are not semantic passes.'],
 tests=dict(path=(O/'tests.json').as_posix(),sha256=sha(O/'tests.json'),passed=34,files=4,titles=[a['fullName'] for f in t['testResults'] for a in f['assertionResults']]),
 sourceManifestSha256=sha(O/'source-manifest.json'),obligations=['RO-C3-007','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],
 limits=['Formal register819..1134 only; episodic formation/recall and later parent qualification remain unreviewed in this batch.',
 '34 fresh focused tests, not full historical mutation/source-audit suites, fresh-process rematerialization, full regression, reference suite or build.',
 'Observation, transient cognitive carriage and persistent responding cognition are separate earned claims; no production, contract, allocation, verdict or corpus change.'],
 nextGate='Continue HQ011 at formal register1135: episodic measurement formation/recall, composed persistence and joined ADAPT qualification.')
def validate(v):
 assert v==r
 for e in [x['source'] for x in v['rows']]+v['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert sha(v['tests']['path'])==v['tests']['sha256']
validate(r);faults=[]
for mode in ['omitted-occurrence','observation-as-cognition','lost-output-defect','false-test-total','lost-split-scope']:
 v=copy.deepcopy(r)
 if mode=='omitted-occurrence':v['rows'].pop()
 elif mode=='observation-as-cognition':v['rows'][0]['judgment']='Probe qualifies persistent learning'
 elif mode=='lost-output-defect':v['preservedFindings'].pop(0)
 elif mode=='false-test-total':v['tests']['passed']=328
 else:v['rows'][-1]['reopen']='Generic evidence proves arbitrary public profiles'
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',r)
c=dict(status=r['status'],originalOccurrences=len(rows),decisionGroups=len(specs),indexedWholeOccurrenceLinks=309+len(rows),freshTests=34,boundSourceFiles=len(manifest['files']),faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
