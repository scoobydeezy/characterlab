"""Native staged contracts/checkpoints and exact historical check receipts."""
from pathlib import Path
import json,hashlib,subprocess,concurrent.futures
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-defining-native-stages-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs=[
 ('DEFINING_ACQUISITION_PRELUDE_CONTRACT','DEFINING_NATIVE_IMPLEMENTATION_CHECKPOINT','DEFINING_ACQUISITION_CHECK_REV1','check-defining-acquisition',
 'Acquisition-only successor commits original/emitted cutoff37 before construction; never cancels a live queue. Original IDs and allocator gaps preserved.19 instants/20 fresh complete prefixes,6 tests. Exact GA37 acquired state/output is not whole predecessor trace/save equality. No continuation handlers or public save qualification; instant/dueAt failed assertion retained.'),
 ('DEFINING_CONTINUATION_INPUTS_CONTRACT','DEFINING_CONTINUATION_INPUTS_CHECKPOINT','DEFINING_CONTINUATION_INPUTS_CHECK_REV1','check-defining-continuation-inputs',
 'Pure closed source/goal/report transitions, not registered native authority. Adoption37/140 active38 avoids future owner write feeding38/130; expiry5001 outside horizon. Inherited deadlines100 remain for400/4000. NotObserved/Missing/Observed distinct, trusted historical operands require later authenticated evidence.68 projected owner cases/36 affected tests are not68 native runs. REV2 narrows owner projection, REV1 passing but superseded. Different goal metadata and final presentation append are explicit native differences.'),
 ('DEFINING_NATIVE_LIFECYCLE_CONTRACT','DEFINING_NATIVE_LIFECYCLE_CHECKPOINT','DEFINING_NATIVE_LIFECYCLE_CHECK_REV1','check-defining-native-lifecycle',
 'One empty-S0 scheduler; disjoint1485/1486 authorities, predecessor partitions validated and merged without unknown roots. Adoption/report/deadlines/horizon only, not missing memory behaviors. One400 profile22 instants/23 repeated prefixes;12 owner combinations not native runs.44 tests, budget+1/actual registration commitment corrected after pre-review cohort; Map trace assertion and TS handler typing failures preserved. No physical worldAfter producer or public save.'),
 ('DEFINING_NATIVE_MEMORY_OWNER_CONTRACT','DEFINING_NATIVE_MEMORY_OWNER_CHECKPOINT','DEFINING_NATIVE_MEMORY_OWNER_CHECK_REV1','check-defining-native-memory-owner',
 'Actual supported attribution37 delivered to meaning38; goal1485/memory630 only. Prior attribution reuse is bounded to unchanged memory37..38, not fresh recomputation. Actual child credit38/140, retention42 atomically reconciles630/632/581 under original authorities/commonB0. Protocol bytes are invariant evidence, not cognitive reads.48 owner cases,2 native profiles; only primary24 instants/25 prefixes freshly repeated, control terminal.49 tests/five failed cohorts preserved. Rehearsal3/absent cue rejected and horizon not recall at this stage.'),
 ('DEFINING_NATIVE_CURRENT_ASSESSMENT_CONTRACT','DEFINING_NATIVE_CURRENT_CHECKPOINT','DEFINING_NATIVE_CURRENT_CHECK_REV1','check-defining-native-current',
 'Actual meaning38 receipt delivered43/125 after report43/120; assessment43/130 has both causal parents and reads only1485/1486. Historical Before is in-flight input, not output-history read or remembered event after loss. Missing report never falls back to old After; immutable goal must match receipt.1490 output only, no memory/credit writer.2 native profiles,primary23 instants/24 prefixes,68 owner comparisons,50 tests. Contrary overlap remains indeterminate; test144/145 correction preserved. Broader baseline access/goal amendment need new qualification.'),
 ('DEFINING_NATIVE_REHEARSAL_CONTRACT','DEFINING_NATIVE_REHEARSAL_CHECKPOINT','DEFINING_NATIVE_REHEARSAL_CHECK_REV1','check-defining-native-rehearsal',
 'Actual37 cue/focal carried to requests; not new perception, learned intent or recovered key. Separate event/body rank outputs in shared40 handler, publication40 then supported attribution130 and distinct owner patches140. Calibration erases use/significance before rank; empty graph control does not overwrite631.16 publications/uses and8 event presentations per rehearsal, finalk1 only632 append. No publication means no final event.3 native profiles,primary26 instants/27 prefixes;68 owner continuations not68 native runs.54 tests and test-only171/130 failure retained; extra8 work/20 outputs/20 allocations conservative. Full cohort/public gates separately owed.')
]
O.mkdir(exist_ok=True);cp=O/'commands.json'
if not cp.exists():
 def run(s):
  path='scripts/'+s[3]+'.mjs';r=subprocess.run(['node',path],capture_output=True,text=True);assert r.returncode==0,(path,r.stdout,r.stderr)
  return dict(command='node '+path,exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref(path))
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:commands=list(pool.map(run,specs))
 save(cp,dict(commands=commands,scope='Read-only reconstruction of historical six implementation receipts. No fresh tests, build or native execution.'))
entries={x['path']:x for x in load(B/'manifest.json')['entries']};roles=[];sources={};bindings=[]
for contract,checkpoint,receipt,script,judgment in specs:
 rp=P/(receipt+'.json');v=load(rp)
 assert set(v['counters'])=={'highestAllocated','sinceVerdict'} and v['referenceTests']==328
 for k,x in v.items():
  if k not in ['status','qualification','counters','files']:assert type(x)==int and x>=0
 assert v['qualification'].startswith('NONE;')
 for a in v['files']:assert set(a)=={'path','sha256'} and sha(a['path'])==a['sha256'];bindings.append(a)
 for p in [Path('docs/formal')/(contract+'.md'),P/(checkpoint+'.md'),rp]:
  path=p.as_posix();assert sha(p)==entries[path]['sha256'];sources[path]=load(p) if p.suffix=='.json' else None
  roles.append(dict(**ref(p),role='WHOLE NATIVE STAGE CONTRACT / CHECKPOINT / RECEIPT',judgment=judgment+' Historical OPEN routing is superseded only by later complete native/public qualification; no retroactive widening of this model or evidence.',acceptanceChain=[ref(rp),ref(cp),ref(P/'CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md')]))
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
strings={(p,ptr):s for p,v in sources.items() if v is not None for ptr,s in walk(v)};rows=[];rolemap={x['path']:x for x in roles}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);p=u['source']
  if p not in sources:continue
  assert u['sourceSha256']==entries[p]['sha256']
  if sources[p] is not None:assert strings[p,u['location']['pointer']]==u['text']
  rows.append(dict(occurrenceId=u['id'],source=p,sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='SCOPED CLAIM / HISTORICAL ROUTING',judgment=rolemap[p]['judgment']))
obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
save(O/'review.json',dict(status='18 NATIVE STAGE SOURCES RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,bindings=bindings,stringLeaves=len(strings),obligations=obs,limits=['Owner comparisons, fresh-prefix repeats, selected native profiles and public restores remain distinct denominators.','Carried queries and scheduled in-flight baseline do not establish autonomous rehearsal or remembered reassessment after loss.','Later qualification preserves explicit native goal metadata and final-presentation differences; no whole component byte-equality claim.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=len(rows),stringLeaves=len(strings),bindings=len(bindings),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
