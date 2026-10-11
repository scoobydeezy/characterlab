"""Reconcile rejected AGENCY cohorts without replacing their exact identities."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-agency-cohorts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def objects(v,p=''):
 if isinstance(v,dict):
  yield p,v
  for k,x in v.items():yield from objects(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from objects(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','scope','reproduce','note','kind','preservedFailure','failures','correction','preserved'])
ip=P/'campaign3-history-source-roles-rev200/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
paths=[p for p in ix['unassignedCandidatePaths'] if 'agency' in p.lower()];assert len(paths)==26
archive={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};archive.update({x['sha256']:x['path'] for x in ix['roleAssignments']})
for i in [1,2]:
 for a in load(P/f'agency-rev{i}/PRESERVATION.json')['artifacts']:
  assert ref(a['path'])['sha256']==a['sha256'];archive[a['sha256']]=a['path']
bindings=[]
def bind(owner,pointer,p,h):
 actual=p if Path(p).exists() and ref(p)['sha256']==h else archive[h]
 assert ref(actual)['sha256']==h
 bindings.append(dict(owner=owner,pointer=pointer,original=dict(path=p,sha256=h),actual=ref(actual)))
for p in paths:
 if p.endswith('.json'):
  for q,v in objects(load(p)):
   if 'path' in v and 'sha256' in v:bind(p,q,v['path'],v['sha256'])
assert len(bindings)==164
plans=[load(P/f'AGENCY_PUBLIC_PLAN_REV{i}.json') for i in [1,2,3]]
cohorts=[]
for i in [1,2]:
 pp=P/f'AGENCY_PUBLIC_PLAN_REV{i}.json';rp=P/f'AGENCY_PUBLIC_RESULT_REV{i}.json';p=plans[i-1];r=load(rp);f=load(P/f'campaign3-agency-model-rev{i}/FREEZE.json')
 assert r['planSha256']==ref(pp)['sha256'] and r['status']=='PASS'
 assert len(f['models'])==r['models']==5
 assert len(r['results'])==len(p['runs'])==r['runs']==[17,19][i-1]
 assert len({x['runIdentity'] for x in p['runs']})==len(p['runs'])
 assert sum(x['prefixes'] for x in r['results'])==r['restores']==r['advancing']+r['terminal']==[61,71][i-1]
 assert r['terminal']==r['runs'] and r['advancing']==[44,52][i-1]
 for a,b in zip(p['runs'],r['results']):
  assert all(b[k]==v for k,v in a.items())
  assert a['modelIdentity'] in {m['modelIdentity'] for m in f['models']}
  assert len(b['observerSha256'])==2
 bind(str(pp),'result/plan',str(pp),r['planSha256'])
 bind(str(pp),'freeze/contract','docs/formal/AGENCY_PUBLIC_CONTRACT.md',f['contractSha256'])
 bind(str(pp),'freeze/allocation','docs/formal/AGENCY_PUBLIC_ALLOCATION_TABLE.json',f['allocationSha256'])
 assert Path(P/f'campaign3-agency-model-rev{i}/FREEZE.json').read_bytes()==Path(P/f'agency-rev{i}/docs/planning/campaign3-agency-model-rev{i}/FREEZE.json').read_bytes()
 cohorts.append(dict(revision=i,runs=r['runs'],prefixes=r['restores'],advancing=r['advancing'],terminal=r['terminal'],status='HISTORICAL MATRIX PASS; SUPERSEDED AS CLOSURE AUTHORITY'))
transitions=[]
for i,(a,b) in enumerate(zip(plans,plans[1:]),1):
 ma={(r['law'],r['name']):r for r in a['runs']};mb={(r['law'],r['name']):r for r in b['runs']};shared=set(ma)&set(mb)
 assert len(shared)==[17,19][i-1]
 assert all(ma[k]['orderedInputs']==mb[k]['orderedInputs'] and ma[k]['modelIdentity']!=mb[k]['modelIdentity'] and ma[k]['runIdentity']!=mb[k]['runIdentity'] for k in shared)
 transitions.append(dict(fromRevision=i,toRevision=i+1,sharedInputRows=len(shared),sameInputBytes=True,allModelAndRunIdentitiesChanged=True,added=[dict(law=k[0],name=k[1]) for k in sorted(set(mb)-set(ma))]))
assert {x['name'] for x in transitions[0]['added']}=={'unreceivedReport','noReport'} and not transitions[1]['added']
manual=load(P/'AGENCY_TESTS_REV1.json');assert manual['tests']==manual['passed']==sum(manual['groups'].values())==35 and manual['failed']==0 and 'not a Vitest JSON' in manual['kind']
c=load(P/'AGENCY_CLOSURE_REV1.json');assert (c['contract'],c['runs'],c['prefixes'],c['tests'])==('agency-public/0.2-candidate',19,71,36)
assert (P/'AGENCY_CLOSURE_REV1.json').read_bytes()==(P/'agency-rev2/docs/planning/AGENCY_CLOSURE_REV1.json').read_bytes()
common='Historical cohort, not final agency-public/0.3 closure. Preserve exact source/model/run identities and failed findings; no earlier PASS is retroactively widened. '
notes={}
for p in paths:
 n=Path(p).name
 if n=='AGENCY_INTERFERENCE_READINESS.md':s='Intake for separated chosen intent, external obstruction, observer-relative evidence and fallible reports. Outcome-only evidence cannot identify hidden cause or counterfactual efficacy. Repeated-interference prediction and coercion are separate later work, not earned by episode-local attribution. Stage-A no-allocation status is historical; final0.3 is accepted bounded successor.'
 elif n.startswith('AGENCY_BUILD_'):s='Recorded build/type/boundary PASS at its named revision, not raw execution logs or a full active-suite result. Later build does not repair earlier behavioral/phase findings. Retained328 reference receipt is not another newly run suite.'
 elif n=='AGENCY_TESTS_REV1.json':s='Explicit manual terminal-count receipt:35=26public+8source+1development. npm consumed reporter flags; no Vitest JSON export existed for that command. Exact three test-source hashes bound. Counts are historical, not fresh execution or proof of missing future-observer/phase cases.'
 elif n=='AGENCY_CLOSURE_REV1.json':s='Superseded0.2 closure:19runs/71prefixes/52advancing/19terminal/36tests/328reference. Corrected nonrecipient reservations but missed actual intent80 against required70. Exact old closure script and old qualification/findings resolved through archives; current0.3 bytes are not substituted.'
 elif n=='IDENTITY_AGENCY_AUDIT_BOOKKEEPING_FINDING_REV1.json':s='Documentation-only cp1252 decoding failure and unchanged REV89 EEXIST rejection. Explicit UTF8 and only unfinished edits resumed; no rewritten old snapshot, duplicate chronology or changed behavioral evidence. Historical bookkeeping correction, not agency runtime defect.'
 elif n=='PRESERVATION.json':s='Exact original-to-archive artifact mapping checked. First cohort misses future nonrecipient occurrence leakage; second fixes leakage but violates exact intent phase. Reproduction instructions are historical guidance, not execution now; unchanged imports and model artifacts are independent requirements.'
 elif n=='AGENCY_PUBLIC_CONTRACT.md':s='Superseded accepted implementation contract, never permission to violate its own intent70/expression80 order. Version0.2 adds fixed empty source/observer chains on probe instants; no evidence manufacture. Source limits8originals/16instants and independently admitted episode/report marks; outcome-only,omniscient,dropped-failed-history controls separate from Mean/Latest. No trust,blame,coercion or cross-episode efficacy law.'
 elif n=='AGENCY_IMPLEMENTATION_FINDINGS.md':s='Historical prefix of current findings: first records observation/counterfactual/identity/receipt limitations, second additionally preserves observer-ID defect. Later exact-phase finding was not yet present. Missing later finding does not invalidate earlier scoped observation or authorize claiming complete closure.'
 elif n=='CAMPAIGN3_AGENCY_QUALIFICATION.md':s='Superseded drafted qualification claims COMPLETE, but final authority explicitly withdraws that sufficiency. First17/61 misses unreceived-report future IDs; second19/71 fixes them yet intent80 remains wrong. Original bounded comparisons and serious learning alternatives retained; old Brief/status/next-frontier text is not current routing.'
 elif n=='FREEZE.json':s='Five immutable model images for its archived contract revision. Exact model identities and file hashes retained. Shared allocation grammar does not make model revisions interchangeable. Frozen-before-execution text is a declaration, not timestamp evidence.'
 elif n.startswith('AGENCY_PUBLIC_PLAN_'):s='Exact ordered inputs and model/run/experiment/comparison commitments. First17 rows persist unchanged as inputs in successor19 rows, with two new future-nonrecipient controls. Every shared ModelIdentity and RunIdentity changes on each revision; no rebranding of old runs as final0.3.'
 elif n.startswith('AGENCY_PUBLIC_RESULT_'):s='Exact original plan/result rows and prefix sums checked. First17runs61prefixes44advancing17terminal; second19runs71prefixes52advancing19terminal. Stored PASS remains true for those matrices but insufficient closure. Same safe-value results cannot prove phase conformance or untested future public-view equality.'
 else:raise AssertionError(p)
 notes[p]=common+s
chain=[ref(P/'campaign3-history-agency-rev1/review.json'),ref(P/'AGENCY_CLOSURE_REV2.json'),ref(P/'AGENCY_PHASE_FAILURE_REV1.json'),ref(P/'AGENCY_UNRECEIVED_REPORT_FAILURE_REV1.json'),ref(P/'AGENCY_IMPLEMENTATION_FINDINGS.md')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p in paths:
 assert ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL AGENCY COHORT / INTAKE / REJECTED CLOSURE; FINAL SUCCESSOR DISTINCT',judgment=notes[p],acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='Every JSON string leaf including hex IDs and short PASS statuses. All numeric fields remain bound by original source digest; no derived count is a new execution.'))
save('review.json',dict(status='26 AGENCY HISTORICAL SOURCES RECONCILED; TWO SUPERSEDED COHORTS PRESERVED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,cohorts=cohorts,transitions=transitions,preservedArtifacts=[],schema=ref(O/'schema.json'),limits=['No historical writer,failed runtime,test,restore or build rerun.','Original scope PASS and rejected whole-closure claims remain distinct.0.3 final authority already reviewed separately; no new verdict.','Hash/current/archive matches prove bytes, not execution time. All existing source gaps and independent adequacy remain open.','No model,law,allocation,corpus,verdict or obligation status changed.'],obligations=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EXACT HISTORICAL AGENCY COHORT JOINS',sources=26,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
