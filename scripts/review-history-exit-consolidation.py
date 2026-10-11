"""Join scoped semantic reviews without granting transitive evidence acceptance."""
from pathlib import Path
import collections, hashlib, json, re
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'
O=P/'campaign3-history-exit-consolidation-rev1'; O.mkdir(exist_ok=True)
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p): return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(name,v):
 p=O/name; p.parent.mkdir(exist_ok=True)
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev172/index.json';ix=load(ip)
roles={x['path']:x for x in ix['roleAssignments']}
manifest={x['path']:x for x in load(B/'manifest.json')['entries']}
evidence_paths=[
 'campaign3-history-exit-identity-longitudinal-rev1/rationale-union-check.json',
 'campaign3-history-exit-authority-quotes-rev1/review.json',
 'campaign3-history-exit-authority-quotes-rev1/schema.json',
 'campaign3-history-exit-predecessor-summaries-rev1/review.json',
 'campaign3-history-exit-markdown-rev1/review.json',
 'campaign3-history-exit-inventory-mixed-rev1/review.json']
chain=[ref(P/p) for p in evidence_paths]
inventory=load(P/evidence_paths[-1]); schema=load(P/evidence_paths[2])
schema_paths={x['path'] for x in schema['fields']}
sources={}; data={}; leaves=collections.Counter()
for rev in range(1,112):
 p=P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json';s=p.as_posix()
 assert s in ix['unassignedCandidatePaths'] and sha(p)==manifest[s]['sha256']
 sources[s]=ref(p);data[s]=load(p)
def walk(v,pointer=''):
 if isinstance(v,str): yield pointer,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,pointer+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,pointer+'/'+str(i))
def field(pointer): return re.sub(r'/\d+(?=/|$)','/*',pointer)
def classify(pointer):
 f=field(pointer);assert f in schema_paths,f
 if f.endswith('/sourceText') or f.endswith('/text'):
  return 'NARRATIVE','QUOTED AUTHORITY; REQUIREMENT NOT SATISFACTION'
 if f.endswith('/rationale'): return 'NARRATIVE','DATED BOUNDED CLAIM; EXACT RATIONALE UNION'
 if f=='/predecessor/disposition': return 'NARRATIVE','DATED TRANSITION SUMMARY; PREDECESSOR TEMPORAL REVIEW'
 if f.endswith('/inspection'): return 'NARRATIVE','HISTORICAL INSPECTION CLAIM; NO TRANSITIVE ACCEPTANCE'
 if f in ['/scope','/finalHistoricalGate/blocks','/publicWrapperGate/blocks','/publicWrapperGate/scope']:
  return 'NARRATIVE','SCOPED GATE/LIMITATION; MANDATORY HISTORY UNSATISFIED'
 return 'BACKING','TYPED IDENTITY/STATUS/CITATION; NO INDEPENDENT QUALIFICATION'
for s,v in data.items():
 for pointer,text in walk(v):
  classify(pointer);leaves[field(pointer)]+=1
assert dict(leaves)=={x['path']:x['occurrences'] for x in schema['fields']}

entry='docs/planning/CAMPAIGN3_ENTRY_READINESS.md'
assert entry in ix['unassignedCandidatePaths'] and sha(entry)==manifest[entry]['sha256']
sources[entry]=ref(entry)
entry_judgment=('Whole dated readiness narrative reviewed. September11 corpus0.27/intake and missing-edge statements are historical; later corpus0.29 and bounded qualifications supersede only named scope. Accepted prior/PARTIAL/BLOCKED/NOT RUN/FAIL remain distinct. All15 families stay in denominator; ten prior members include SEM despite older nine-member campaign list. BIO means biography, not physiology. ADAPT displacement/safe sensing is not full tolerance behavior. Thirteen reviewer paths are not a normative cycle count. Implemented edge, executed feedback and necessity are different claims. MATH004 covariance is not automatically a blocker for scalar LEARN. Fixed procedural storage is not competence-dependent execution. Missing fixtures have unknown discrimination, not zero importance; no general reduction ranking from favorable slices. Final historical gate survives bounded progress; reserved IDs need not remain executing. Forward REV12..19 agency/goals/control/inference/reappraisal/recollection/familiarity/communication notices preserve exact scopes and no-whole-phenomenon limits; historical next tasks are superseded by reviewed later verdicts.')
rows=collections.defaultdict(list);counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);s=u['source']
  if s not in sources: continue
  assert u['sourceSha256']==sources[s]['sha256']
  if s==entry: category,role='NARRATIVE','DATED READINESS/FINDING; WHOLE DOCUMENT JUDGMENT'
  else:
   pointer=u['location']['pointer'];v=data[s]
   for k in pointer.split('/')[1:]:v=v[int(k)] if isinstance(v,list) else v[k]
   assert v==u['text'];category,role=classify(pointer)
  counts[category]+=1
  rows[s].append(dict(occurrenceId=u['id'],location=u['location'],
                     textSha256=hashlib.sha256(u['text'].encode()).hexdigest(),category=category,role=role))
assert set(rows)==set(sources)
assert len({r['occurrenceId'] for rr in rows.values() for r in rr})==sum(map(len,rows.values()))
occurrence_files=[]
for s,rr in sorted(rows.items()):
 name='occurrences/'+Path(s).stem+'.json'
 save(name,dict(source=sources[s],originalTextLocation='Exact pointer/line span in frozen universe source; text digest binds original extracted text without copying repeated quotations.',rows=rr))
 occurrence_files.append(ref(O/name))

preserved=[];missing=[]
for row in inventory['rows']:
 resolution=row['resolution'];b=resolution.get('bytes')
 if b is None:
  missing.append(dict(path=row['path'],sha256=row['sha256'],occurrences=row['occurrences'],
   disposition='UNRESOLVED HISTORICAL BYTE IDENTITY; DO NOT SUBSTITUTE CURRENT SOURCE',
   materiality='No claim of absence of lost findings. Current/frozen source review is independently scoped; historical identity adequacy remains for RO-C3-021/HQ011. This inventory field itself is historical metadata, not acceptance of missing contents.'))
  continue
 if '/campaign3-history-exit-inventory' not in b['path']:continue
 assert ref(b['path'])==b
 raw=Path(b['path']).read_bytes().replace(b'\r\n',b'\n')
 current=Path(row['path']).read_bytes().replace(b'\r\n',b'\n')
 if current.startswith(raw):
  judgment='Exact normalized text prefix of reviewed root; newline recipe adds no semantic finding. Historical truncation does not import later appended findings.'
 else:
  assert row['path']==entry and b['sha256']=='2825b31bd2ce505570b3f0c20cdfe54182b2636e95d7fe350c7d0c79971e4b72'
  old=raw.decode().splitlines();new=current.decode().splitlines()
  assert old[:5]==new[:5] and old[8:10]==new[8:10] and old[11:]==new[14:len(old)+3]
  judgment='Exact Git REV7 entry variant:16 bounded/3 prior/2 partial and BODY-next routing; later REV9 has18 bounded/3 prior/0 partial plus bounded BODY/BIO scope. Shared historical entry body unchanged. These are dated progression claims, not whole exit or fresh execution; later append-only notices excluded from this older variant.'
 root=roles.get(row['path'])
 assert root is not None or row['path']==entry
 preserved.append(dict(**b,originalPath=row['path'],method=resolution['method'],
                       judgment=judgment,rootReviewEvidence=root['evidence'] if root else [ref(O/'review.json')] if (O/'review.json').exists() else [],
                       reviewedRoot=sources.get(row['path'],ref(row['path']))))
# Avoid a self-hash dependency for entry: its judgment is in this report.
for a in preserved:
 if a['originalPath']==entry:a['rootReviewEvidence']=[]
assert len(preserved)==265 and len(missing)==80
save('unresolved-identities.json',dict(status='OPEN HISTORICAL IDENTITIES; NO CONTENT SUBSTITUTION',rows=missing,
 searchEvidence=chain[-1],obligations=['RO-C3-021']))
claim_scope=('Whole snapshot reviewed as a dated documentation claim record, with exact quotation, rationale, transition, gate and inventory field roles. No transitive acceptance of referenced evidence, no independent execution claim, no inference that bounded clauses discharge compound requirements or joint family coverage. Eighty historical inventory byte identities remain explicitly unresolved across the chain; supporting source and independent adequacy reviews remain open.')
source_roles=[dict(**s,role='DATED EXIT-AUDIT CLAIM RECORD; DEPENDENCIES NOT AUTOMATICALLY ACCEPTED',judgment=claim_scope,acceptanceChain=chain) for p,s in sources.items() if p!=entry]
source_roles.append(dict(**sources[entry],role='DATED ENTRY READINESS AND FORWARD ROUTING',judgment=entry_judgment,acceptanceChain=chain))
save('review.json',dict(status='AUDIT CLAIM RECORDS RECONCILED; HISTORICAL IDENTITY/SUPPORT ADEQUACY OPEN',
 checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=source_roles,occurrenceFiles=occurrence_files,
 stringSchema=chain[2],allStringLeaves=sum(leaves.values()),originalOccurrences=dict(counts),
 preservedArtifacts=preserved,unresolvedIdentities=ref(O/'unresolved-identities.json'),
 limits=[claim_scope,entry_judgment,'No runtime simulation/test/build, new scientific verdict, law selection, corpus promotion or obligation closure. HQ012 unstarted.'],
 obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
for s in sources.values():assert ref(s['path'])==s
assert all(p.stat().st_size<50000000 for p in O.rglob('*') if p.is_file())
save('check.json',dict(status='PASS;112 SOURCE ROLES,265 ARCHIVE ROLES;80 IDENTITY GAPS PRESERVED',
 sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],
 stringLeaves=sum(leaves.values()),stringSchemas=len(leaves),preservedArtifacts=len(preserved),
 unresolvedHistoricalIdentities=len(missing),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
