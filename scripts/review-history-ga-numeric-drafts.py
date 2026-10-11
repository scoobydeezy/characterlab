"""Verify draft-to-freeze parity without reissuing any permanent allocation."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');F=Path('docs/formal');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ga-numeric-drafts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev189/index.json';ix=load(ip);assigned={x['path']:x for x in ix['roleAssignments']};entries={x['path']:x for x in load(B/'manifest.json')['entries']}
notes={};pairs=[];bindings=[];leaves=[];priorRoles=[]
note='Exact draft-to-frozen numeric parity except version/status and added acceptedReview. Symbolic domain predicates survive; namespace numbers alone do not authenticate holder/source/role. Actual producer owns occurrence; references allocate nothing. Allocation is not member/model/runtime/trace/work-ceiling qualification. Later scoped public evidence remains separate; no law or permanent byte changed.'
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
for kind in ['CARRIER','REGISTRY_MEMBER','WRITE_SCOPE']:
 p=P/f'GA_{kind}_ALLOCATION_DRAFT.json';f=F/f'GENERAL_ATTENTION_{kind}_ALLOCATION_TABLE.json';a=load(p);b=load(f)
 changed={k for k in a.keys()|b.keys() if a.get(k)!=b.get(k)};assert changed=={'version','status','acceptedReview'}
 assert {k:v for k,v in a.items() if k not in changed}=={k:v for k,v in b.items() if k not in changed}
 assert ref(b['acceptedReview']['path'])==b['acceptedReview']
 prior=assigned[f.as_posix()];assert ref(f)['sha256']==prior['sha256']
 for e in prior['evidence']:assert ref(e['path'])==e
 priorRoles.append(prior);pairs.append(dict(draft=ref(p),frozen=ref(f),changes=sorted(changed),acceptedReview=b['acceptedReview']))
 for x in a['sources']+a['priorAllocations']:assert ref(x['path'])==x;bindings.append(dict(owner=p.as_posix(),**x))
 notes[p.as_posix()]=note
 leaves.extend(dict(source=p.as_posix(),pointer=q,text=s) for q,s in walk(a))
a=load(P/'GA_CARRIER_ALLOCATION_DRAFT.json')
assert [r['typeId'] for r in a['records']]==list(range(542,705)) and sum(len(r['fields']) for r in a['records'])==523
assert len(a['fieldEnums'])==38 and len(a['recordUnions'])==11 and len(a['rolePositions'])==165
assert [n['namespace'] for n in a['namespaces']]==[1044,1045,1145,1146,1147,1148]
assert [(o['recordTypeId'],o['fieldId'],o['namespace']) for o in a['ownedOccurrences']]==[(549,1,1145),(568,1,1146),(575,1,1147),(590,1,1148),(603,1,1143)]
md=P/'GA_CARRIER_ALLOCATION_DRAFT.md';text=md.read_text(encoding='utf-8-sig');expected=[]
for r in a['records']:expected.append('|'+str(r['typeId'])+'/1|'+r['name']+'|'+'; '.join(str(f['id'])+' '+f['name']+('' if f['required'] else '?') for f in r['fields'])+'|')
expected.extend('|'+str(n['namespace'])+'|'+n['name']+'|'+n['payload']+'|' for n in a['namespaces'])
assert [line for line in text.splitlines() if line.startswith('|') and len(line)>1 and line[1].isdigit()]==expected
notes[md.as_posix()]=note+' Markdown163 record rows/six namespace rows exactly match proposal order,field ordinals and optionality. Field-local enums and unions explicitly delegated to JSON, not omitted from acceptance.'
m=load(P/'GA_REGISTRY_MEMBER_ALLOCATION_DRAFT.json');assert len(m['members'])==218 and not m['records'] and not m['newNamespaces']
assert len({(x['namespace'],x['payload']) for x in m['members']})==218
w=load(P/'GA_WRITE_SCOPE_ALLOCATION_DRAFT.json');assert [r['typeId'] for r in w['records']]==[705,706] and sum(len(r['fields']) for r in w['records'])==13
assert not w['members'] and not w['newNamespaces'] and [r['typeId'] for r in w['recordUnions'][0]['members']]==[322,705]
chain=[ref(P/'campaign3-history-ga-acceptance-receipts-rev1/review.json'),ref(P/'campaign3-history-ga-public-contracts-rev1/review.json')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='NUMERIC PROPOSAL SUPERSEDED BY EXACT FROZEN SUCCESSOR',judgment=n,acceptanceChain=chain))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  category='NARRATIVE' if u['source'].endswith('.md') or any(s in u['location'].get('pointer','') for s in ['/scope','/limits','/status','/pendingMembers']) else 'BACKING';counts[category]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=category,judgment=notes[u['source']]))
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,role='Numeric schema/enum/identity/role/reference backing except explicit scope/limits/status/pending prose. Frozen parity covers exact values without inferring runtime admission.'))
save('review.json',dict(status='FOUR NUMERIC DRAFT SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,draftFreezePairs=pairs,exactBindings=bindings,priorFrozenTableRoles=priorRoles,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=['Frozen tables already reviewed; their roles/evidence rebound, not counted twice. Draft differences only version/status/acceptedReview; no allocation change.','No old writer,test,build,runtime or fault controls executed. Metadata counts/byte parity do not prove source/subject/model/public behavior.','Existing source provenance gaps,formula source,legacy log and independent adequacy remain open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED NUMERIC DRAFT RECONCILIATION',sources=4,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),draftFreezePairs=3,markdownRecordRows=163,markdownNamespaceRows=6,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
