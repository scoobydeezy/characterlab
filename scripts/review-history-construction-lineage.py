"""Reconcile EVID REG construction proof lineage and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-construction-lineage-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev293/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
names=['CAMPAIGN2_EVID_REG_CONSTRUCTION_PROOF'+s+'.json' for s in ['', '_REV2','_REV3','_REV4','_REV5']]
vs=[load(P/n) for n in names]
assert [len(v['baselines']) for v in vs]==[3,3,4,4,4]
assert [sum(len(x['tests']) for x in v['baselines']) for v in vs]==[17,19,29,30,30]
assert [len(v['mutations']) for v in vs]==[18,18,23,23,23]
for v in vs:
 assert v['status']=='COMPONENT PASS'
 for x in v['baselines']:assert x['status']=='PASS' and all(t['state']=='pass' for t in x['tests'])
 for x in v['mutations']:assert x['status']=='DETECTED' and any(t['state']=='fail' for t in x['tests']) and all(t['state'] in ['pass','fail'] for t in x['tests'])
deltas=[]
for old,new in zip(vs,vs[1:]):
 d={}
 for field in ['baselines','mutations']:
  x={(r['group'],r['name']):r for r in old[field]};y={(r['group'],r['name']):r for r in new[field]}
  assert not x.keys()-y.keys()
  d[field]=dict(added=[list(k) for k in sorted(y.keys()-x.keys())],changed=[list(k) for k in sorted(x.keys()&y.keys()) if x[k]!=y[k]])
  for k in x.keys()&y.keys():assert {t['name'] for t in x[k]['tests']} <= {t['name'] for t in y[k]['tests']}
 x={r['path']:r['sha256'] for r in old['sourceFingerprints']};y={r['path']:r['sha256'] for r in new['sourceFingerprints']}
 assert x.keys()==y.keys();d['changedSourcePaths']=sorted(k for k in x if x[k]!=y[k]);deltas.append(d)
assert [len(d['changedSourcePaths']) for d in deltas]==[7,2,2,1]
assert vs[3]['baselines']==vs[4]['baselines'] and vs[3]['mutations']==vs[4]['mutations'] and vs[3]['limitations']==vs[4]['limitations']
notes={}
for i,n in enumerate(names[:4]):
 notes[(P/n).as_posix()]='Historical assertion-based component mutation assay, not independent general EVID/REG interpreter. Baseline test entries17/19/29/30 acrossREV1..4, with18/18/23/23 detected substitutions. Named mutants each have an actual failed test state in the stored receipt; failures under injected mutations are expected detections, not baseline failures. Original test names retained across revisions. REV2 adds fallible Campaign1 E/L preservation and false-gate dispatch; REV3 adds REG family/domain/role/inert-content controls; REV4 adds distinct observers and shifted output identity chain. Exact AD-E5 frozen order witness remains. Only INVALID_CONFIGURATION carrier, not diagnostic message wording, is normative. Earlier pending namespace/role controls are explicitly added inREV3, not silently marked closed by repeated PASS. No complete EVID-S/REG-M/FCT-6 or release verdict. REV5 has equal result arrays with changed test source fingerprint; source versions remain distinct.'
chain=[ref(P/n) for n in ['CAMPAIGN2_EVID_REG_CONSTRUCTION_PROOF_REV5.json','CAMPAIGN2_INHERITED_CURRENT_REVIEW.md','CAMPAIGN2_FCT6_QUALIFICATION.md']]
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
def kind(p,q):return 'BACKING' if q.startswith('/sourceFingerprints/') else 'NARRATIVE'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT EVID REG CONSTRUCTION SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL COMPONENT MUTATION ASSAY; FINITE SCOPE',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('deltas.json',dict(revisions=deltas,scope='Exact baseline/mutation/source lineage using composite group/name keys; stored test results, no rerun.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV293 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='EVID REG CONSTRUCTION LINEAGE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),deltas=ref(O/'deltas.json'),limits=['Stored passing baselines and detected mutants inspected, not reexecuted.','REV3 discharges earlier pending family/domain/role controls only in the named finite assay. Public/runtime composition and general interpreter sufficiency remain separate.','Missing exact source identities remain explicit; later equal result arrays do not replace old source hashes. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EVID REG CONSTRUCTION ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),historicalAssays=4,mutationOccurrences=82,distinctMutations=23,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
