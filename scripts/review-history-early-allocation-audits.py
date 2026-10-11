"""Reconcile early allocation audit lineage and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections,re,itertools
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-early-allocation-audits-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev296/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
F=Path('docs/formal');stems=['CAMPAIGN2','MEASUREMENT_EVIDENCE_CARRIAGE','MEASUREMENT_MEMORY','MEMORY_WRAPPER']
audits=[load(F/(n+'_ALLOCATION_AUDIT.json')) for n in stems]
tables=[load(F/(n+'_ALLOCATION_TABLE.json')) for n in stems]
assert [len(x['checks']) for x in audits]==[233,197,332,201]
for x in audits:assert all(c['status']=='PASS' for c in x['checks'])
assert audits[0]['unresolved']==[] and len(audits[0]['finalMechanicalGate']['checks'])==60
assert all(c['status']=='PASS' for c in audits[0]['finalMechanicalGate']['checks'])
assert audits[0]['counts']=={k:len(tables[0][k]) for k in ['records','namespaces','members','unionVariants','finiteValues']}
assert audits[0]['acceptedIdentityUses']==tables[0]['acceptedIdentityUses']
assert [list(range(start,end+1)) for start,end in [(260,328),(336,341),(342,355),(356,358)]]==[[r['typeId'] for r in t['records']] for t in tables]
for t in tables:
 assert len({r['name'] for r in t['records']})==len(t['records']) and all(r['schemaVersion']==1 for r in t['records'])
 for r in t['records']:
  assert len({f['id'] for f in r['fields']})==len(r['fields']) and len({f['name'] for f in r['fields']})==len(r['fields'])
assert [len(t['namespaces']) for t in tables[1:]]==[1,2,0]
assert [len(t['members']) for t in tables[1:]]==[6,15,0]
assert all(not tables[3][k] for k in ['roles','occurrenceIdentities','unionVariants','finiteValues'])
notes={}
for i,n in enumerate(stems):
 notes[(F/(n+'_ALLOCATION_AUDIT.json')).as_posix()]=[
 'Historical permanent allocation audit:69 records260..328,18 namespaces,58 members,32 union variants,10 finite values.233 initial and60 final mechanical checks reported PASS. GatesA/B bind Markdown/JSON parity and direct accepted observation seam declaration; five accepted identity uses have distinct owners. Rechecked current table counts/range/schema/field uniqueness and committed hashes where available. Specification checks do not pass runtime/codec/phenomenon or VAL001; empty unresolved is only this allocation audit scope.',
 'Carriage allocation consistency only:6 records336..341,namespace1124,six members/eight roles/two occurrence rules.197 checks include77 preserved-source labels. Excludes learning-route member,state root,CharacterId/observation/evidence-store families,new union/domain validator and runtime. Audit has no table hash; linked frozen table and later carriage qualification are separate evidence, not reconstructed historical writer provenance.',
 'Memory allocation consistency only:14 records342..355,namespaces1125/1126,15members/14roles/two occurrence rules.332 checks include127 preserved-source labels. Excludes new projection definitions/topology,CueId/MemoryEpisodeId,formation/padding occurrence IDs,stage policy,persistence certificates,new write capability/save field,concrete recall delay and runtime. Table hash binds exact declaration; runtime/restore qualification remains separate.',
 'Wrapper allocation consistency only:3 records356..358,zero new namespaces/members/roles/occurrence/union/finite values.201 checks include132 preservation labels. Typed seam-contract wrappers exclude generic CanonicalValue fields,heterogeneous sets,anonymous envelopes,wrapper/projection-set identity,new registry kind/bundle entry and changes342..355. Frozen allocation does not qualify packaging or runtime.'
 ][i]
chain=[ref(F/(n+'_ALLOCATION_TABLE.json')) for n in stems]+[ref(P/n) for n in ['CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md','CAMPAIGN2_MEASUREMENT_EVIDENCE_QUALIFICATION_REVIEW.md','CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md']]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
def kind(p,q):return 'BACKING' if q.endswith(('Sha256','/source','/symbol','/owner')) or q=='/version' else 'NARRATIVE'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT EARLY ALLOCATION SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL MECHANICAL ALLOCATION AUDIT; SEMANTIC QUALIFICATION SEPARATE',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

for n,v in zip(stems,audits):
 p=(F/(n+'_ALLOCATION_AUDIT.json')).as_posix()
 if 'tableSha256' in v:bind(p,dict(path=(F/(n+'_ALLOCATION_TABLE.json')).as_posix(),sha256=v['tableSha256']))
g=audits[0]['finalMechanicalGate'];p=(F/'CAMPAIGN2_ALLOCATION_AUDIT.json').as_posix()
bind(p,dict(path=(F/'CAMPAIGN2_PERMANENT_ALLOCATION.md').as_posix(),sha256=g['markdownSha256']))
bind(p,dict(path=g['observationAnchor']['source'],sha256=g['observationAnchor']['sourceSha256']))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)

save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV296 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='EARLY ALLOCATION AUDITS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Current exact table counts/ranges/schema/field uniqueness checked; historical audit writers and all parity predicates not rerun.','Preserved-source check labels without embedded hashes are not fresh source-byte verification. Carriage audit omits table commitment.','Mechanical allocation PASS cannot close runtime, codec, phenomenon, VAL or full campaign gates. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EARLY ALLOCATION AUDIT ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),primaryChecks=963,finalMechanicalChecks=60,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
