"""Reconcile attribution and interoceptive source component limits."""
from pathlib import Path
import json,hashlib,ast
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-bookkeeping-findings-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/planning/BODY_PARTIAL_AUDIT_FINDING_REV1.json': 'Historical biological closure checker rejected repaired runtime bytes against the original pre-quiescence source hash. No simulation ran in that invocation. Exact original runtime is preserved; exact observed repaired bytes remain current. Separate wrapper-quiescence qualification reruns prior trajectories and blocks split scheduler/RNG publication. Mapping old to new source does not replace the historical hash or imply a new biological law.', 'docs/planning/BODY_PARTIAL_BOOKKEEPING_FINDING_REV1.json': 'Research checker rejected literal table formatting although numeric counts remained1/19/0. Required spaces after slash delimiters restore the expected presentation; this is not an obligation-state change or scientific failure. Original CURRENT bytes are independently recovered from the append-only log and reproduce the declared old hash.', 'docs/planning/MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json': 'Global git diff check encountered preserved CRCRLF chronology as trailing whitespace. Original diagnostic output was truncated, so no complete diagnostic capture is claimed. Historical log bytes remain intact; scoped diff checking excludes only that log. This is a formatting-check limit, not behavioral evidence or permission to skip research/hash validation.', 'docs/planning/LONGITUDINAL_PERSONAL_LOSS_BOOKKEEPING_FINDING_REV1.json': 'Post-qualification exact-string matcher failure caused by spacing, not stale numeric obligation values. Preserved original CURRENT and one-time recorder hashes are verified without executing the writer.480 runs,6240 restores and AuditREV110 remain historical experiment evidence, not rerun by this repair. Current table replacement preserves original bytes in chronology.', 'docs/planning/campaign3-history-inventory-development-rev1/FINDING.json': 'Pre-freeze Python parse failure occurred at unterminated marker-label key. Parsing the preserved source independently reproduces SyntaxError without executing it. No evidence universe or reconciled findings can be attributed to that failed invocation; later corrected extraction has separate committed method and universe. Do not treat absence of output as negative scientific evidence.', 'docs/planning/longitudinal-personal-loss-bookkeeping-rev1/CURRENT.md': 'Preserved original closure index has correct1/19/0 counts with checker-incompatible slash spacing. Its131 bounded/one partial and next affect-dimensionality routing are dated: later REV111 closes bounded clauses separately. Original loss composition preserves actual acquired relationship, fallible contact belief, maintained goal and subsequent choice/execution; reported5/8 and7/8 divergences do not imply universal action change. All jobs were terminal. No clinical grief, native receiving admission or affect-dimensionality claim follows from this index.'}
ip=P/'campaign3-history-source-roles-rev265/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
chain=[ref(P/n) for n in ['CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md', 'CAMPAIGN3_LONGITUDINAL_PERSONAL_LOSS_QUALIFICATION.md', 'CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md', 'campaign3-history-universe-rev1/manifest.json']]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='PRESERVED NONBEHAVIORAL FAILURE OR CORRECTED INDEX',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
log=(P/'CAMPAIGN3_LOG.md').read_bytes()
old=log[386290:388408]
expected=load(P/'BODY_PARTIAL_BOOKKEEPING_FINDING_REV1.json')['oldCurrentSha256']
assert hashlib.sha256(old).hexdigest()==expected
archive=O/'body-partial-current.md'
if archive.exists():assert archive.read_bytes()==old
else:archive.write_bytes(old)
artifacts=[dict(**ref(archive),method='Exact byte slice386290:388408 from append-only chronology; matches original recorded SHA256.')]
bindings=[]
for a in load(P/'LONGITUDINAL_PERSONAL_LOSS_BOOKKEEPING_FINDING_REV1.json')['files']:
 assert ref(a['path'])==a
 bindings.append(a)
 if not any(x['path']==a['path'] for x in ix['roleAssignments']+ix['explicitBackingOutsideProseManifest']):
  artifacts.append(dict(**a,method='Existing preserved one-time recorder; verified, never executed.'))
original=P/'biology-public-development-rev1/src/campaign3/biologyPublicRuntime.ts'
assert ref(original)['sha256']==load(P/'BODY_PARTIAL_AUDIT_FINDING_REV1.json')['expectedHistoricalSha256']
assert ref('src/campaign3/biologyPublicRuntime.ts')['sha256']==load(P/'BODY_PARTIAL_AUDIT_FINDING_REV1.json')['observedRepairedSha256']
bindings += [ref(original),ref('src/campaign3/biologyPublicRuntime.ts')]
rejected=P/'campaign3-history-inventory-development-rev1/campaign3-history-inventory.py'
try:ast.parse(rejected.read_text(encoding='utf-8'))
except SyntaxError as e:parseFailure=dict(message=e.msg,line=e.lineno)
else:raise AssertionError('Expected preserved parse failure')
assert 'unterminated string literal' in parseFailure['message']
if not any(x['path']==rejected.as_posix() for x in ix['explicitBackingOutsideProseManifest']):
 artifacts.append(dict(**ref(rejected),method='Existing preserved rejected extractor; parsed only, never executed.'))
def leaves(v,pointer=''):
 if isinstance(v,str):yield dict(pointer=pointer,value=v)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from leaves(x,pointer+'/'+str(i))
 elif isinstance(v,dict):
  for k,x in v.items():yield from leaves(x,pointer+'/'+k.replace('~','~0').replace('/','~1'))
allStrings=[dict(source=p,leaves=list(leaves(load(p)))) for p in notes if p.endswith('.json')]

save('review.json',dict(status='SIX BOOKKEEPING FINDINGS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=artifacts,exactBindings=bindings,allStringLeaves=allStrings,parseFailure=parseFailure,limits=['Planning and captured hashes do not establish completed replay; later qualifications preserve component/native distinctions.','Later bounded completion supersedes routing only within named profiles, not all ideal-loop phenomena.','No runtime/test/build rerun, source gap closure, law/model/verdict/corpus/obligation status change or historical adequacy claim.'],obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS BOOKKEEPING FINDING HISTORY',sources=len(sources),originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
