"""Reconcile foundational deterministic and observation contracts without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-semantic-parent-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev309/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
notes={'docs/formal/EVENT_SEMANTIC_BINDING.md': 'Accepted A..H subdecisions and later I/J closure govern the finite semantic-binding baseline despite stale candidate/open labels. Observer-relative continuant and event files may falsely merge/split; recognition never repairs tracking from truth. Binding occurrences preserve multi-role and repeated-role relations; duplicate same-role/same-referent pairs need an explicit richer grammar. Role cardinalities are per event type and narrowing cannot widen domains. Continuant/event boolean classification distinguishes absent from explicit negative,keeps facets independent and has one model authority per facet. Truth Action is not a fabricated continuant or learned action identity. Recognition uses observer-owned catalog/mapping permission and typed same-window cues: unique uncontradicted support asserts,replacement appends,explicit contradiction without replacement withdraws; missing cues do not withdraw. Categorical commitment is not calibrated confidence. Evaluation is trace-only; resolution history self-sufficient and immutable. Evidence admission depends on exact producer/schema and consumer ReadDomain,ownership,time,carrier and scope; safe identity or temporal precedence alone grants no permission. Character provenance cannot traverse omniscient ancestry or exploit opaque truth equality. Causal-role evidence is separate nonrecursive companion evidence,not truth-role copying or envelope mutation. Two lanes reserve distinct experience IDs only for evidence,freeze inputs before recognition,and commit only at whole-instant settlement. Perceived consequence learning and truth-side automatic adaptation retain separate authorities. Earlier blocked allocation/I.3/J statements are superseded by explicit OPEN_DECISIONS I.2/I.3/J acceptance and integrated vector evidence. Early transition and cue sketches are refined by accepted I.1/I.2 shapes,not alternate schemas. Canonical collection wording follows the later specific schema inventory/registry and codec; source text is preserved. ONT/TRC and later learning/appraisal/action recognition requirements are outside this bounded closure; no new broad PASS follows.', 'docs/formal/CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md': 'Closed100-row regression manifest for finite PHEN-SEM-001. All100 historical statuses PASS,with13 formerly pending vectors explicitly mapped to integrated evidence rather than closed by aggregate. Closure does not retire the tests. Thirty-one negative controls distinguish actual closure failures from structural absence; DuplicateOpaqueOccurrence is owned by transition-history validation,and laundered recognition rewrite does not uniquely identify which INVALID_RESOLUTION_HISTORY clause fired. Ten acceptance items distinguish executable here,executable elsewhere and ledger conditions: a filename/existence check is not runtime proof. Single-observer codec persistence CV097 does not alone satisfy complete three-observer integrated replay. The carried symbolic-ID condition requires canonical in-memory occurrence identities,accepted field-to-namespace binding,legacy-version rejection and poisoned scaffolding-label invariance; canonical serialization after symbolic execution is insufficient. Registered Context9 stays unadmitted while Incidental10 remains stable. The measurement comparison cites accepted observation occurrence while omitting interval/precision/truth payload from character output; it is not a general measurement consumer. Three renderers preserve historical experience; current reinterpretation differs by appended resolution. Old migration-remaining and namespace1004 available wording is historical, superseded by J and Campaign2 respectively. Initial action-like-referent explanatory prose is constrained by the explicit event-file route,not ActionAsContinuant. The source states finite fixture proof,not general continuous perception,graded confidence,ontology,learning,appraisal or social cognition. No test suite or original writer rerun in this review.'}
chain=[ref(p) for p in ['docs/formal/OPEN_DECISIONS.md', 'docs/formal/EVENT_SEMANTIC_SCHEMA_INVENTORY.md', 'docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md', 'docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md', 'docs/planning/campaign3-history-semantic-allocation-rev1/review.json', 'src/test/sem001AcceptanceGate.test.ts', 'src/test/sem001JIntegratedGate.test.ts', 'src/test/semanticNegativeControls.test.ts', 'src/test/fixtures/phenSem001Run.ts', 'docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md']]
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
 sources.append(dict(**ref(p),role='ACCEPTED FINITE SEMANTIC BASELINE AND HISTORICAL INTEGRATED GATE',judgment=n,acceptanceChain=chain))
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

vectors=Path('docs/formal/CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md').read_text(encoding='utf-8')
vectorRows=[line for line in vectors.splitlines() if re.match(r'^\| `CV-SEM-\d{3}` \|',line) and '`PASS`' in line]
assert len(vectorRows)==100
assert {re.search(r'CV-SEM-\d{3}',line)[0] for line in vectorRows}=={f'CV-SEM-{i:03}' for i in range(1,101)}
save('vector-inventory.json',dict(status='EXACT HISTORICAL VECTOR ROW INVENTORY; NOT FRESH EXECUTION',rows=vectorRows,vectorCount=100))
save('sections.json',dict(status='WHOLE TWO-CONTRACT SCOPE REVIEW; NO FRESH EXECUTION CLAIM',sections=sections,traceBoundary='Specific later schema/allocation and I.3/J acceptance resolve early parent sketches and blocked labels; broader exclusions remain.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV309 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='SEMANTIC PARENT AUTHORITY SCOPE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Full parent contract and vector manifest reviewed, including100 vector rows,13 integrated entries,31 controls and10 gate conditions. No runtime/test suite or original writer rerun.','Dated symbolic-only, allocation-blocked and migration-open statements are superseded by named accepted gates; frozen source text remains unchanged.','No blanket later-runtime adequacy, public wrapper, family or campaign closure.'],sectionInventory=ref(O/'sections.json'),obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SEMANTIC PARENT AUTHORITY SCOPE ACCOUNTING',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),contractSources=2,sectionCount=len(sections),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
