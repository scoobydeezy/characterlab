"""Correct forward after exact recovery of the original task mutation writer."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');O=P/'campaign3-history-task-runtime-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
source=Path('scripts/prove-task-lifecycle.mjs');target='f846295e2fa733de18c09818e5a1309864ac638f0ec703ca45ed9cb3404f1457'
data=source.read_bytes().replace(b'\r\n',b'\n')
assert data.count(b'TASK_LIFECYCLE_RUNTIME_PROOF_REV2.json')==1 and data.count(b'process.exitCode=0;')==1
data=data.replace(b'TASK_LIFECYCLE_RUNTIME_PROOF_REV2.json',b'TASK_LIFECYCLE_RUNTIME_PROOF_REV1.json').replace(b'process.exitCode=0;',b'').rstrip(b'\n')+b'\n'
assert hashlib.sha256(data).hexdigest()==target
out=O/'historical-f846295e2fa7-prove-task-lifecycle.mjs'
if out.exists():assert out.read_bytes()==data
else:out.write_bytes(data)
v=load(O/'review.json');c=load(O/'check.json');u=load(O/'unresolved.json')
remaining=[x for x in u['sources'] if x['sha256']!=target];assert len(remaining)==2
save('unresolved-rev2.json',dict(status='TWO EXACT SOURCE GROUPS REMAIN; ORIGINAL WRITER RECOVERED',predecessor=ref(O/'unresolved.json'),sources=remaining,limits='Earlier five-test preservation source and previously known scheduler snapshot remain unresolved after recorded bounded searches. No global absence claim. Original writer is now recovered by exact hash, not assumed equivalent.'))
save('writer-recovery.json',dict(status='EXACT ORIGINAL TASK MUTATION WRITER RECOVERED',checker=ref(__file__),input=ref(source),output=ref(out),predecessorReview=ref(O/'review.json'),transformation=['Normalize current writer CRLF to LF.','Replace exact output filename REV2 with REV1.','Remove process.exitCode=0; and retain one final LF.'],evidence='Complete resulting bytes match original REV1 writer fingerprint exactly; no execution or historical timestamp proof.',finding='REV2 changes report destination and clears expected failing-mutation process exit status only. Result rows and mutation assertions remain identical. Prior search-only unresolved result preserved, now superseded for this one source.'))
v=copy.deepcopy(v);v['predecessorReview']=ref(O/'review.json');v['checker']=ref(__file__);v['writerRecovery']=ref(O/'writer-recovery.json')
v['exactBindings'].append(dict(receipt=(P/'TASK_LIFECYCLE_RUNTIME_PROOF_REV1.json').as_posix(),original=dict(path=source.as_posix(),sha256=target),actual=ref(out)))
v['preservedArtifacts'].append(dict(**ref(out),method='Exact hash-verified reverse of documented writer destination/expected-mutation-exit correction; writer-recovery.json records complete transformation'))
v['unresolved']=ref(O/'unresolved-rev2.json')
for r in v['sourceRoles']:
 r['acceptanceChain'].append(ref(O/'writer-recovery.json'))
 if r['path'].endswith('TASK_LIFECYCLE_RUNTIME_PROOF_REV1.json'):
  r['judgment']='Stored24-test baseline pass; seven named substitutions detected with failed-test counts3/1/1/1/1/1/1. Baseline excludes64fixed-slot combinations; public and synthetic duplicate-clock targets remain distinct. Whole-instant rollback tests cover seven named injection sites, not arbitrary faults. Exact original writer now recovered by reversing documented output-filename and exit-code changes, complete hash matches. REV2 result rows identical, not another independent behavioral result. Earlier scheduler bytes remain unresolved. No cognition/arbitration/RNG qualification or fresh runtime execution.'
 if r['path'].endswith('TASK_LIFECYCLE_RUNTIME_PROOF_REV2.json'):
  r['judgment']+=' Original writer now recovered exactly; REV2 changes only report destination and expected-mutation exit-code cleanup, not assertions/results.'
v['limits']=['External live-list comparison calls actual reference component but supplies eligibility externally; no canonical cognition join.','Proof revisions share all result rows. Exact writer recovery corrects forward the original bounded-search gap, without rewriting earlier review.','Four exact source artifacts recovered; earlier preservation-test and repeated scheduler source remain unresolved.','Stored24test/7mutant and974/328/5or9 counts retain separate scopes; no runtime/test/build rerun.','No model/law/allocation/verdict/corpus/obligation status change; independent adequacy open.']
save('review-rev2.json',v)
c.update(exactBindings=len(v['exactBindings']),newArchives=len(v['preservedArtifacts']),unresolvedGroups=2,review=ref(O/'review-rev2.json'))
save('check-rev2.json',c)
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(c))
