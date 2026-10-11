"""Read-only reconciliation of VAL inventory/refresh and five REG receipts."""
from pathlib import Path
import json,hashlib,subprocess,re,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-val-reg-receipts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(b):return hashlib.sha256(b).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(Path(p).read_bytes()))
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev243/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[];gaps=[];artifacts=[]
O.mkdir(exist_ok=True)
for original,commit,h in [('src/campaign2/factory.ts','42c2713ce044a04d53c294032462dd6ac25446e0','fd1e681e9e287bd015d6713af631c35ad045b7f6b499dfcc895c5ca689c86820'),('scripts/prove-campaign2-reg-persistence.mjs','542cef006fcccfe5defc71bf557eb9049417f175','7834767c0f4283cf8e89edbaf185d65a2356429f662fb7004f8a70f90013870b')]:
 raw=subprocess.check_output(['git','show',commit+':'+original]);assert sha(raw)==h
 dest=O/'historical'/original;dest.parent.mkdir(parents=True,exist_ok=True)
 if dest.exists():assert dest.read_bytes()==raw
 else:dest.write_bytes(raw)
 artifacts.append(dict(**ref(dest),originalPath=original,commit=commit,method='Exact raw Git blob recovery; byte hash matches original receipt, no timestamp assertion'));archives[h]=dest.as_posix()
def bind(receipt,p,h):
 actual=p if ref(p)['sha256']==h else archives.get(h)
 if actual:
  assert ref(actual)['sha256']==h;bindings.append(dict(receipt=receipt,original=dict(path=p,sha256=h),actual=ref(actual)))
 else:gaps.append(dict(receipt=receipt,path=p,sha256=h,disposition='Previously recorded exact adaptation-runtime source gap; report retained but exact-source reproduction not claimed'))
notes={};regfiles=sorted(P.glob('CAMPAIGN2_REG_PERSISTENCE_MUTATION*.json'));assert len(regfiles)==5
base=None
for p in regfiles:
 v=load(p);payload={k:x for k,x in v.items() if k!='sourceFingerprints'}
 if base is not None:assert payload==base
 base=payload
 for x in v['sourceFingerprints']:bind(p.as_posix(),x['path'],x['sha256'])
 assert len(v['baselines'])==2 and len(v['mutations'])==11
 reg,persist=v['baselines'];assert reg['casesChecked']==len(reg['cases'])==252 and persist['casesChecked']==len(persist['cases'])==5
 assert all(x['agrees'] for x in reg['cases']+persist['cases'])
 for row in reg['cases']:
  m=re.fullmatch(r'rate=(-?\d+)/anchor=(\d+)/time=(\d+)/(reference|D=(-?\d+))',row['name']);assert m
  rate,anchor,t=map(int,m.group(1,2,3));r0=anchor+(rate*t)//(1 if rate==0 else 3)
  expected=str(r0) if m[4]=='reference' else 'Valid' if -(2**63-1)<=r0+int(m[5])<=2**63-1 else 'REG_ADAPTED_REFERENCE_OUT_OF_RANGE'
  assert row['expected']==row['actual']==expected
 assert [len(x['differences']) for x in v['mutations']]==[20,12,31,22,12,2,2,2,1,1,1]
 assert all(x['status']=='DETECTED' and all(not d['agrees'] for d in x['differences']) for x in v['mutations'])
 assert persist['cases'][-1]['constructionsBefore']==persist['cases'][-1]['constructionsAfter']==3
 assert v['mutations'][-1]['differences']==[dict(name='retained-time-rejects-unchanged-displacement',agrees=False,constructionsBefore=3,constructionsAfter=4)]
 notes[p.as_posix()]='Five receipts preserve identical baseline/mutation payloads under distinct source bindings.252 REG rows cover3rates x2anchors x7times x6reference/displacement queries, fresh Python integer-floor check agrees with stored expected/actual values. Five persistence observations are not a second implementation. Eleven mutants have disagreement counts20/12/31/22/12/2/2/2/1/1/1, overlapping finite rows not independent phenomena. Truncation differs from negative floor; valid endpoints remain included. Original restore-time-zero mutant was NOT DISTINGUISHED by rejection alone because runtime repeated saved-time validation. Construction counter3->4 detects bypass; baseline3->3 rejects before construction. Clock-edited checkpoint is a boundary challenge, not an executed late history. Save/restore projections independently substituted; immutable REG anchors not copied. Shared canonical transport/VAL setup and no whole FCT/PERSIST/VAL/PHEN claim retained. Exact old factory and refresh writer recovered; two repeated adaptation-runtime source gaps remain explicit, not repaired by identical payloads.'
audit=P/'CAMPAIGN2_VAL_CROSSWALK_AUDIT.json';a=load(audit)
assert a['vectors']==['VAL-'+chr(x) for x in range(65,88)] and a['actualFirstProfileRoleRecords']=={'265':58,'266':0,'278':6}
assert all((P/p).exists() for p in a['linkedReports'])
notes[audit.as_posix()]='Inventory-only receipt enumerates A..W and13 existing report links; actual first-model record counts265=58/266=0/278=6 are neither schema counts nor behavioral execution. PendingV scope proposal superseded by accepted memory-role revision2: another already accepted public profile supplied266. Audit absence in first specimen cannot justify future deferral. Existing links and vector parity freshly checked; original inventory writer not rerun and original statuses not rewritten.'
rp=P/'CAMPAIGN2_VAL_EVIDENCE_REFRESH.json';v=load(rp);assert len(v['results'])==5 and sum(x['mutants'] for x in v['results'])==46
for x in v['results']:
 bind(rp.as_posix(),x['assay'],x['assaySha256']);bind(rp.as_posix(),x['historical'],x['historicalSha256'])
 assert Path(x['current']).exists()
notes[rp.as_posix()]='Historical refresh manifest links five same-semantics finite assays after production fingerprint changes;7+7+11+10+11=46 mutations. Original reports retained and exact bound; refresh reports separate. Four runner hashes match current files; exact old REG writer recovered from Git. current means at that historical refresh, not current repo semantics. Manifest links do not themselves qualify runtime or independent compiler; constituent receipt reviews retain shared setup, finite domains, failed cohorts and unresolved source bindings.'
assert len(gaps)==2 and {x['sha256'] for x in gaps}=={'cb6adb0fb43cfdaab2acecbdb493bf21865b78aa68267efe014f60c5b00be93a','59b67856ea06a9705a22b20fb203bbbf4718e289ea265ed4e18531e002865ae0'}
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','scope','limits','limitations','supersededMutationAttempts'])
chain=[ref(P/'campaign3-history-val-qualification-authority-rev1/review.json'),ref(P/'campaign3-history-persistence-authority-rev1/review.json'),ref(P/'campaign3-history-declaration-dependencies-rev1/review.json')]
sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='FINITE VAL/REG RECEIPT AND EXACT SOURCE BINDING',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,backingRationale='Numeric case names/values, error diagnostics and exact mutation code are experimental backing; status, scope, limitations and superseded assay explanations are narrative.',leaves=leaves))
save('unresolved.json',dict(status='TWO PREVIOUSLY RECORDED SOURCE GAPS RETAINED',references=gaps,newSourceGapGroups=0))
save('review.json',dict(status='SEVEN VAL/REG RECEIPTS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=artifacts,unresolved=ref(O/'unresolved.json'),schema=ref(O/'schema.json'),currentInspectionSources=[ref(p) for p in ['scripts/audit-campaign2-val-crosswalk.mjs','scripts/prove-campaign2-reg-persistence.mjs','src/test/fixtures/campaign2RegComparison.ts','src/test/fixtures/campaign2PersistenceComparison.ts']],limits=['Fresh arithmetic/backing checks are not historical runtime reexecution.','Equal five result payloads do not replace exact source identity; two repeated gaps remain.','Clock intervention has no claimed executed history; construction counter fixes rejection-only blind spot.','No law/model/verdict/corpus/obligation status change or historical adequacy closure.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS VAL/REG RECEIPT CONTENT AND AVAILABLE BINDINGS',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),repeatedSourceGaps=len(gaps),newArchives=len(artifacts),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.rglob('*') if p.is_file())
print(json.dumps(load(O/'check.json')))
