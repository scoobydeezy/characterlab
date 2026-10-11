"""Reconcile VAL closed-declaration authority and its mechanical allocation gate."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-val-shape-allocation-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev244/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[]
ap='docs/formal/VAL_ALLOCATION_AUDIT.json';mp='docs/formal/VAL_PERMANENT_ALLOCATION.md';tp='docs/formal/VAL_ALLOCATION_TABLE.json';a=load(ap);t=load(tp)
for x in [dict(path=tp,sha256=a['tableSha256']),dict(path=mp,sha256=a['markdownSha256']),a['baseAllocation'],a['authority']]+a['priorRegistryEvidence']:
 actual=x['path'] if ref(x['path'])['sha256']==x['sha256'] else archives[x['sha256']]
 assert ref(actual)['sha256']==x['sha256'];bindings.append(dict(receipt=ap,original=x,actual=ref(actual)))
assert a['allocationSnapshot']==t and len(a['checks'])==40 and all(x['status']=='PASS' for x in a['checks'])
assert a['counts']==dict(records=2,fields=2,members=2,bindings=2,newNamespaces=0)
md=Path(mp).read_text(encoding='utf-8')
for r in t['records']:
 for f in r['fields']:assert f"| {r['typeId']} | {r['name']} | {r['schemaVersion']} | {f['id']} | {f['name']} | {f['type']} | {str(f['required']).lower()} |" in md
for r in t['members']:assert f"| {r['namespace']} | {r['payload']} |" in md
for r in t['bindings']:assert f"| {r['stableIdNamespace']} | {r['stableIdPayload']} | {r['registryKind']} | {r['definitionVersion']} | {r['definitionTypeId']}/{r['definitionSchemaVersion']} |" in md
notes={
'docs/planning/VAL_001_DRAFT_RESOLUTION.md':'Accepted governed-execution/content-kind/governed-domain-validator0.1 shape after revision1 lacked committed DomainValidator binding and exact CONTENT domain. Actual callback gap: same committed declarations could invoke different predicates, presentation or captured mutable environment. Source inspection here is not an executed exploit. Closed accepted version plus canonical declarations/run inputs define partial semantics including failures; fixed declarations with changed host behavior is unqualified implementation, not automatically new valid model. Build support can reject activation but is not a model operand; no source/binary hash, executable registry or third arbitrary-code case. Two conforming implementations may share identity. Model admission rejects supplied semantics and rebuilds from complete copied manifests; finite qualification cannot prove arbitrary host equivalence or self-detect modified code. Minimal170/1 character content has no invented body/roster/psychology predicate; invariants/mappings are committed data, not executable prose. Exact authored origin/content resolution/kind defines character role independently from content legality. Referenced/declared validator equality covers265/266/278 in all admitted branches, absent optional validator adds none, unused kind allowed but orphan validator forbidden. CONTENT validation precedes role closure; later corrected memory precedent preserves this order. Malformed declarations versus runtime role errors remain distinct. Historical NOTPASSED/activation wording superseded only by later scoped qualification, not allocation alone. Conditional second-kind positive and wider language/host/migration exclusions remain; new executable choice/dependency/predicate/failure semantics reopens scope.',
mp:'Accepted additive permanent freeze after mechanical gate:329/330 each one required field, two1023registry-kind members and two171bindings reuse1004/1021StableIds. No namespaces, roles, union layouts, runtime occurrences, state or executable selector added. RequiredSemanticKind physical TypedIdentifierValue is qualified by construction interpreter, not extra CanonicalRoleConstraint; malformed declaration INVALID_CONFIGURATION differs from runtime CANONICAL_ROLE_VIOLATION. ContentSchema is254schema dependency exactly170/1. Complete prior allocation preserved; frozen numbers not retasked. Allocation parity/freeze does not implement VAL or authorize activation. Historical OPEN and second-kind condition retain scope under later bounded VAL/factory qualification.',
ap:'Forty stored mechanical PASS checks bind complete allocation snapshot, exact table/Markdown/base/authority and three prior registry documents. Seven hashes freshly verified against current/indexed exact historical bytes; Markdown records/fields/members/bindings match table. Prior canonical registry snapshot remains available. Allocation audit does not establish behavioral A..W, build qualification or public runtime activation. Existing previously reviewed VAL table retained as backing without reassignment or double counting. All JSON strings including short statuses and declaration fields examined by schema; check names are mechanical inventory observations, not independent scientific findings.'}
chain=[ref(P/'campaign3-history-val-qualification-authority-rev1/review.json'),ref(P/'CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md'),ref(P/'campaign3-history-base-allocation-rev1/review.json')]
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','checks','limitations'])
sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='VAL SHAPE AND PERMANENT ALLOCATION WITH SEPARATE QUALIFICATION',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True);save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='THREE VAL SHAPE/ALLOCATION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=[],previouslyReviewedBackingTable=ref(tp),schema=ref(O/'schema.json'),limits=['Fresh parity and hash checks do not rerun historical writers or runtime qualification.','Closed semantics, model admission, build support and qualification remain distinct; no arbitrary program-equivalence proof.','No new archive/source gap, model, allocation, verdict, corpus or obligation status change. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS VAL SHAPE/ALLOCATION HISTORY',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
