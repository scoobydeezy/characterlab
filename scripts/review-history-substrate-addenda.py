"""Reconcile foundational deterministic and observation contracts without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-substrate-addenda-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev311/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
notes={'docs/planning/SUBSTRATE_ADDENDA_DRAFT.md': 'Two independently accepted addenda,not one combined qualification. PRJ0.3 is shape accepted here; WRT0.3 was implemented with dated315-test/38-file evidence. Later allocation and bounded factory/generic projection evidence supersede timing-only NOT AUTHORIZED labels within their exact scopes. The six missing projection capabilities include static bindings,no immutable-family declaration,no identity-role/key grammar,single payload rather than invented input slots,and anonymous/lazy derivation. Six composition conditions hold but uncommitted extraction and lazy required reads fail. One closed required projection extracts an admitted payload selector,completes exactly one mapKey wildcard,validates domain and source grammar,then exposes only the required field. Admission precedes selector extraction; absence is discovered during projection construction before transition execution,not before the read needed to detect absence. OutputRole compatibility is exact namespace/validator matching,not inference. Atomic and record-shaped keys keep shape separate from recursively checked roles. Grammar coverage is total bidirectional closure for admitting models,not development chronology; read-only families are disjoint from writable and one another. No raw identity leaf,wrapper accessor,enumeration,chained state selector or arbitrary callback is added. Complete requirement identity is seam/version/accessor; shared accessor allocation does not narrow generic historical trace147. WRT owns only structural-validity/writability/authority prefix,with operation-specific suffix unchanged. Section2.3 shorthand ordering cannot override2.2 and explicit OPEN_DECISIONS; current set/remove preconditions precede their respective value/removal checks. Explicit structural validation fixes the single-element-sort hole. Five assertion sites in four tests were intentionally reclassified; historical315PASS is not freshly rerun. Typed first-divergence distinction ends at state-contract boundary; scheduler diagnostic still flattens it to text. General diagnostic nesting and broader projection grammar require separate contracts. Reopen prose about richer-than-one-identity keys is read with accepted IdentityKey/CanonicalRecordKey grammar and the clearer OPEN_DECISIONS wording; it does not revoke record-key support. Prior generic projection substitutions retain unresolved source identities and are not public roster-profile qualification.'}
chain=[ref(p) for p in ['docs/formal/OPEN_DECISIONS.md', 'docs/formal/STATE_MODEL.md', 'docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md', 'docs/planning/CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md', 'docs/planning/CAMPAIGN2_QUALIFICATION_SCOPE_REVIEW.md', 'docs/planning/campaign3-history-prj-cohorts-rev1/review.json', 'src/substrate/state.ts', 'src/test/wrt001WriteValidationOrder.test.ts', 'docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md']]
sections=[]
for p in notes:
 for i,line in enumerate(Path(p).read_text(encoding='utf-8').splitlines(),1):
  if line.startswith('## '):sections.append(dict(source=p,line=i,title=line,role='ACCEPTED BOUNDED CONTRACT SECTION; IMPLEMENTATION EVIDENCE SEPARATE'))

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
def kind(p,q):return 'NARRATIVE'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT FIXTURE GATE SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Routing receipt remains dated planning evidence; no later source bytes substituted for a missing original. Independent adequacy remains separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='SEPARATELY ACCEPTED PRJ SHAPE AND WRT REPAIR; SCOPED LATER PROOF',judgment=n,acceptanceChain=chain))
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

findings=[
 dict(id='PRJ-UNCOMMITTED-LAZY',owner='RO-C3-020',supported='Committed closed extraction and required projection construction address two distinct failures of the earlier derived callback.',blockedClaim='A named transformationId alone commits arbitrary callback behavior,or lazy read satisfies eager required presence.',reopen='A new optional,callback-driven,chained,multi-source or richer selector projection needs its own contract and tests.',evidence=chain),
 dict(id='WRT-ARITY-AND-PRECEDENCE',owner='RO-C3-020',supported='Explicit path validation precedes shared leaf resolution and authority independent of patch cardinality; five old assertions were deliberately reclassified.',blockedClaim='Sort-comparator validation covers one-element arrays,or WRT changes set/remove suffix ordering.',reopen='Any write entry point or validation order changes; preserve compound fault tests and current suffix semantics.',evidence=chain),
 dict(id='WRT-DIAGNOSTIC-BOUNDARY',owner='RO-C3-020',supported='Distinct typed state codes; scheduler diagnostic exposes outer STATE_VALIDATION_FAILURE plus text.',blockedClaim='Structured scheduler diagnostic comparisons distinguish those state causes without message parsing.',reopen='A consumer requires structural state-cause diagnostics; amend the owning diagnostic contract and prove its compatibility separately.',evidence=chain),
 dict(id='PRJ-QUALIFICATION-SCOPE',owner='RO-C3-021',supported='Later generic projection evidence and bounded public exclusion are distinct; old shape gate is not current global blocker.',blockedClaim='Public frozen zero-read EVID profile executed the generic roster-positive branch,or missing historical source hashes are now recovered.',reopen='Public roster admission or exact-source reproduction claim requires the separate profile/source gates.',evidence=chain)]
save('findings.json',dict(status='MATERIAL DISTINCTIONS RETAINED; NO OBLIGATION CLOSED',findings=findings))
save('sections.json',dict(status='WHOLE ADDENDA SOURCE REVIEW; NO FRESH EXECUTION CLAIM',sections=sections,traceBoundary='Typed state-contract first divergence is not structured scheduler diagnostic causality; committed traces exclude failed work.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV311 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='SUBSTRATE ADDENDA SCOPE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Full addenda source reviewed; existing code inspected for exact accepted prefix/suffix. No runtime/test suite or original writer rerun.','Shape acceptance, allocation and generic/public execution scopes remain separate; historical projection-source gaps are not cleared.','No blanket later-runtime adequacy, public wrapper, family or campaign closure.'],sectionInventory=ref(O/'sections.json'),obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SUBSTRATE ADDENDA SCOPE ACCOUNTING',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),contractSources=1,sectionCount=len(sections),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
