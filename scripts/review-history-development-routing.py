"""Experiential-history audit and subsequent native routing, without retroactive claims."""
from pathlib import Path
import json,hashlib,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-development-routing-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 'DEVELOPMENT_HISTORY_AUDIT.md':'Experiential practice is not maturation. Same-model retained/fresh contrast changes early practice at3/5, not later originals; prior competence at17 explains execution before update140. HalfAtGap is a different law, not same-constitution age intervention. Known trajectories reused, no unseen replication. Finite existing skill/biology/disposition/identity/defining evidence cannot supply a missing age writer. Later owner-directed two-effect development addresses the bounded clause separately; broader age/sensitive-period laws remain unearned.',
 'DEVELOPMENT_HISTORY_CHECKPOINT.md':'Historical2 models/3 reused runs/51 restores,48 advancing/3 terminal; no new trajectory/verdict. Both journals empty14; after identical interference16 skill1/4 versus0 gives success versus failure17, then1/2 versus1/4. Identity/person/relationship equal; rust comparator retained. Prior disposition checks and44/328 tests are preserved, not rerun. BLOCKED development and next direct-state intake are historical; owner requirements and DEVELOPMENT-PUBLIC supersede routing without reclassifying practice as maturation. Historical53/56,1492/0 and AuditREV80 counts remain unchanged.',
 'DEVELOPMENT_PUBLIC_IMPLEMENTATION_CHECKPOINT.md':'Historical focused implementation checkpoint, not full matrix qualification. Thirteen registered phases separate actual prior-competence execution, independent report and learning/identity/formation writers; immutable constitution has none. Primary18 rows/234 traces and21/328 tests do not alone prove36-program matrix. Test-only readonly assignment failure and no-tests Vite denial preserved. One-successor Save132/publication gate remains distinct. RUNNING,16 allocations since verdict and BLOCKED are superseded by final REV3/public verdict, not current process evidence. No full-suite, calendar-age, universal-rate or non-authored identity claim.',
 'DEVELOPMENT_HISTORY_CLOSURE_REV1.json':'Exact reconstruction of stored replay receipt binds source graph, predecessor results and intervention isolation. REPLAY VERIFIED does not discharge developmental-state requirement; subsequent public qualification is separate. Frozen status and counts are historical. No new test or simulation in this review.',
 'development-history-preflight-rev1/PRESERVATION.json':'Inventory resolver failed before plan freeze or execution because Vite resource query suffix was treated as a path. Exact failed script retained. Suffix stripping repairs dependency resolution only; no production change or failed behavioral experiment.'
}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};closure=P/'DEVELOPMENT_HISTORY_CLOSURE_REV1.json';c=load(closure)
assert set(c)==set('status disposition scope models reusedRuns publicRestores advancing terminal productionChanges newAllocations counters files'.split())
assert (c['models'],c['reusedRuns'],c['publicRestores'],c['advancing'],c['terminal'],c['productionChanges'],c['newAllocations'])==(2,3,51,48,3,0,0)
assert c['counters']==dict(highestAllocatedRecordType=1492,allocatedSinceVerdict=0)
for a in c['files']:assert set(a)=={'path','sha256'} and sha(a['path'])==a['sha256']
pre=P/'development-history-preflight-rev1/PRESERVATION.json';v=load(pre)
assert set(v)==set('status failure scriptSha256 productionChanged experimentExecuted'.split())
assert v['productionChanged'] is False and v['experimentExecuted'] is False
assert v['scriptSha256']==sha(pre.parent/'qualify-development-history.mjs')
O.mkdir(exist_ok=True);commands=O/'commands.json'
if not commands.exists():
 r=subprocess.run(['node','scripts/check-development-history.mjs'],capture_output=True,text=True);assert r.returncode==0,(r.stdout,r.stderr)
 save(commands,dict(command='node scripts/check-development-history.mjs',exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref('scripts/check-development-history.mjs'),scope='Read-only stored receipt reconstruction, no simulation.'))
roles=[];sources={}
for name,judgment in specs.items():
 p=P/name;assert sha(p)==entries[p.as_posix()]['sha256'];sources[p.as_posix()]=p
 chain=[ref(closure),ref(commands)]
 if name=='DEVELOPMENT_PUBLIC_IMPLEMENTATION_CHECKPOINT.md':chain=[ref(P/'CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md'),ref(P/'DEVELOPMENT_PUBLIC_CHECK_REV3.json')]
 chain.extend([ref(P/'DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md'),ref(P/'campaign3-history-development-sources-rev1/review.json')])
 roles.append(dict(**ref(p),role='HISTORICAL ROUTING / PRESERVED REPLAY SCOPE',judgment=judgment,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in sources:continue
  assert u['sourceSha256']==sha(sources[u['source']])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='HISTORICAL CLAIM / SCOPE / ROUTING',judgment=specs[u['source'][len(P.as_posix())+1:]]))
obs=['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-013','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='FIVE DEVELOPMENT HISTORY/ROUTING SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,obligations=obs,limits=['No whole-source role assigned to referenced plans/results by citation alone. Their canonical/schema review remains separate.','Historical source-freeze declarations do not establish independent timestamp proof. Reused known trajectories are not unseen validation.','Direct effective-disposition intake is not declared executed by the later two-effect qualification.']))
save(O/'check.json',dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=len(rows),sourceBindings=len(c['files']),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__)))
print(json.dumps(load(O/'check.json')))
