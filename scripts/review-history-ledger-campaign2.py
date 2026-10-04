"""Join duplicated scoped claims while preserving distinct ledger occurrences."""
from pathlib import Path
import json,hashlib,re,posixpath,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ledger-campaign2-rev1';O.mkdir(exist_ok=True)
SOURCE='docs/planning/VERDICT_LEDGER.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a=1,z=None):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);z=z or len(ls)
 return dict(path=str(p).replace('\\','/'),sha256=sha(p),startLine=a,endLine=z,text=''.join(ls[a-1:z]))
def norm(s,source):
 def link(m):
  target=m[1]
  return ']('+posixpath.normpath(posixpath.join(posixpath.dirname(source),target))+')'
 return re.sub(r'\]\(([^)]*)\)',link,s.replace('\r\n','\n')).strip()
prior=[];bindings=[]
for name in ['probe-carriage','memory-parent','factory','cognitive']:
 path=P/f'campaign3-history-{name}-rev1/review.json';v=load(path)
 bindings.append(dict(path=path.as_posix(),sha256=sha(path)))
 for r in v['rows']:prior.append((path.as_posix(),r))
manual=[
 (108,118,'Probe qualification','Accepted observation-only9a with exact permitted scalar difference and equal X/E/L; generic temporal/signed controls retain public exclusions.','Output-closure failure retained; no cognitive9b or broad psychological reduction inferred.'),
 (664,676,'Task shape','Shape and permanent allocation distinct from runtime.190-fingerprint parity audit was historical construction evidence.','Later correction withdraws two role-position claims; do not silently preserve their original PASS.'),
 (677,690,'Task role withdrawal','Explicitly withdraw StateMapKey373/1 and373/2 role-ownership PASS; record-key371 uses RecordField roles.17 construction tests/192 combinations are scoped.','No upstream semantics or numeric assignments change, no model freeze or runtime proof from that cohort.'),
 (755,767,'Cognitive pause','Frozen model and plan-leaf addition;23 codec/math tests and270 dice/11 history comparisons are component evidence.','Historical power-cycle pause is superseded by completion, not a current stop instruction. No runtime/RNG qualification from pure math.'),
 (768,799,'Campaign2 completion','Authorized internal review qualifies thin scaffold,21 recipes,17 substitutions and public64/65,27/26 boundaries;1063 active and328 reference are dated suite totals.','No external review or general necessity. Successor RNG restore separate from original cross-build gap, now boundedly discharged by PERSIST-I checkpoint. Broader timing/context/coupling remain scoped; historical corpus0.27 not current0.29.')]
rows=[];matched=0
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 108<=u['location']['startLine']<=799:continue
  assert u['location']['endLine']<=799
  e=excerpt(B/'sources'/SOURCE,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
  hits=[(p,r) for p,r in prior if norm(r['source']['text'],'docs/formal/OPEN_DECISIONS.md')==norm(u['text'],SOURCE)]
  if hits:
   assert len(hits)==1
   p,r=hits[0];matched+=1
   disposition=dict(claim=r['decision'],judgment=r['judgment'],reopen=r['reopen'],reviewedCorrespondence=dict(path=p,occurrenceId=r['occurrenceId'],source=r['source']),basis='Same scoped historical decision republished in ledger; only line endings/relative-link resolution normalized for comparison. Original bytes and identities remain separate; no elevation of authority or wholesale source acceptance.')
  else:
   selected=[s for s in manual if s[0]<=u['location']['startLine']<=s[1]];assert len(selected)==1,u['location']
   _,_,name,judgment,reopen=selected[0]
   disposition=dict(claim=name,judgment=judgment,reopen=reopen,basis='Separately reviewed ledger-specific wording, not inferred from title or approximate text match.')
  rows.append(dict(occurrenceId=u['id'],source=e,**disposition,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
lines=(B/'sources'/SOURCE).read_bytes().decode('utf-8-sig').splitlines()
assert {n for r in rows for n in range(r['source']['startLine'],r['source']['endLine']+1)}=={n for n in range(108,800) if lines[n-1].strip()}
assert len(rows)==119 and matched==103
old=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes().startswith(old)
evidence=[excerpt(p) for p in ['docs/formal/TASK_COMMITMENT_KEY_ROLE_CORRECTION.md','docs/planning/CAMPAIGN2_AUTONOMOUS_PAUSE_CHECKPOINT.md','docs/planning/CAMPAIGN2_COMPLETION_REVIEW.md','docs/planning/CAMPAIGN2_COGNITIVE_QUALIFICATION.md','docs/planning/CAMPAIGN3_HISTORY_PERSIST_I_CHECKPOINT.md']]
suite=P/'COGNITIVE_FINAL_SUITE_RECEIPT_REV1.json';t=load(suite)
assert [(x['name'],x['tests']) for x in t['results']]==[('active',1063),('reference',328)]
r=dict(status='HQ011 CAMPAIGN2 LEDGER CLAIMS ACCOUNTED IN SCOPE; WIDER AUDIT OPEN',rows=rows,priorReviews=bindings,evidence=evidence,
 historicalSuite=dict(path=suite.as_posix(),sha256=sha(suite),results=t['results'],scope='Dated evidence only; original fingerprints are not asserted equal to all current production files. No fresh suite rerun.'),
 preservedDistinctions=['119 ledger occurrences are separate publication identities, not119 new findings.103 explicit content/link-resolved correspondences;16 separately reviewed units.',
 'Shape/allocation/model/runtime/phenomenon/corpus gates remain distinct; proposals and rejected cohorts stay preserved.',
 'Same-S0 causal intervention, explicit four-rule fixture amendment, non-discriminating control3 and draft/final corpus identity remain separate.',
 'Source corrections/read aliasing/interleaving retain their failures and finite scope. Earlier OPEN text is superseded only by named later qualification.',
 'Task role audit explicitly withdrew two erroneous role-position PASS claims. Historical pause is not active; bounded completion does not close broader ideal behavior.'],
 obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],nextGate='Ledger800 onward: VER-C3-PRE-IDENTITY-001 and concern001/002 including scope annotation, then GA.')
def validate(v):
 assert v==r
 for x in v['rows']:assert x['source']==excerpt(x['source']['path'],x['source']['startLine'],x['source']['endLine'])
 for p in v['priorReviews']:assert sha(p['path'])==p['sha256']
validate(r);faults=[]
for mode in ['omit-ledger-unit','erase-role-withdrawal','lose-original-identity','historical-tests-as-fresh']:
 v=copy.deepcopy(r)
 if mode=='omit-ledger-unit':v['rows'].pop()
 elif mode=='erase-role-withdrawal':next(x for x in v['rows'] if x['source']['startLine']==679)['judgment']='Both original roles remain valid'
 elif mode=='lose-original-identity':v['rows'][0]['occurrenceId']=''
 else:v['historicalSuite']['scope']='Fresh current suite PASS'
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',r)
c=dict(status=r['status'],originalOccurrences=len(rows),explicitCorrespondences=matched,separatelyReviewed=len(rows)-matched,indexedWholeOccurrenceLinks=541+len(rows),freshBehavioralTests=0,faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
