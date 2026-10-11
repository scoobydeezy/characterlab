"""Reconcile Campaign3 entry and discovery audit lineage and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections,re,itertools
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-entry-discovery-audits-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev297/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
names=['CAMPAIGN3_PRE_ENTRY_AUDIT.json','CAMPAIGN3_DISCOVERY_AUDIT_REV2.json'];a,b=[load(P/n) for n in names]
assert (a['intakeEntries'],b['intakeEntries'])==(8,11)
assert a['requiredFieldsPerEntry']==b['requiredFieldsPerEntry']==12
assert (a['localLinksChecked'],b['localLinksChecked'])==(15,17)
assert a['preservedFingerprintChecks']==b['preservedFingerprintChecks']==446
assert a['productionSource']==b['productionSource'] and a['ablation']==b['ablation'] and a['evidence']==b['evidence']
assert 'tests not rerun' in a['productionSource'] and 'NO NEW WHOLE PHENOMENON PASS' in a['status'] and 'NO NEW WHOLE PHENOMENON PASS' in b['status']
notes={(P/n).as_posix():'Historical entry/discovery packet consistency audit, not a whole phenomenon PASS. Intake grows8->11 entries with12 required fields, local links15->17;446 preservation checks and the same two ablation evidence identities do not mean another full-suite run. Production tests explicitly not rerun. Four public matched pairs remain separate from generated-source component contrasts. Discovery adds body frontier while keeping physiology/attention/learning gaps explicit; missing family coverage is UNKNOWN, not low importance. DynamicCURRENT and revised readiness/intake documents must resolve by exact historical hash or retain provenance gaps; current prose cannot silently substitute. Identity-feedback ablation establishes narrow influence, not whole biography, general physiology or readiness for Campaign3 exit.' for n in names}
chain=[ref(P/n) for n in ['CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md','CAMPAIGN3_ENTRY_READINESS.md','CAMPAIGN3_IDENTITY_ABLATION_SUMMARY.json','CAMPAIGN3_FINAL_HISTORY_GATE.md']]
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
def kind(p,q):return 'BACKING' if q.startswith(('/documents/','/evidence/','/script/')) else 'NARRATIVE'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT ENTRY DISCOVERY SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL PACKET CONSISTENCY; NO WHOLE PHENOMENON PASS',judgment=n,acceptanceChain=chain))
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

save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV297 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='ENTRY DISCOVERY AUDITS RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Packet consistency and preservation do not establish scientific sufficiency.','Eight then eleven proposals are not new frozen corpus members; four public ablation pairs are not complete biography coverage.','Exact historical document/source gaps remain explicit; no historical audit or runtime rerun. Independent adequacy open.'],obligations=['RO-C3-001','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS ENTRY DISCOVERY AUDIT ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),intakeCounts=[8,11],preservationCount=446,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
