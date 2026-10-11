"""Reconcile foundational deterministic and observation contracts without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-semantic-allocation-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev308/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
notes={'docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md': 'Accepted SEM001I.2 assigns permanent numbers without changing shapes or giving ordinals psychological meaning. Fifty records210..259 use schema1 and explicit optional presence; diagnostic names do not replace structural manifests. Twenty-four semantic and sixteen occurrence namespaces remain distinct; WorldEventId is not scheduler identity and observer-local file sequences differ from global occurrence allocation. Historical namespace1004 availability is superseded explicitly by Campaign2 SemanticKindId allocation,not current permission to reuse. Mapping replacement allocates a new immutable mapping ID. CausalRole Context9 remains registered but not admitted by this profile. Boolean feature laws,closed tags and exact union payload constraints retain separate meaning from rule-ID order. Canonical sets/maps retain their encoding tags; only semantically ordered collections are lists. Allocation gates CV091..095 do not admit codecs or prove execution; I.3 and later vectors remain separate. Fresh read-only parity verifies all50 names/versions and252 field IDs/names/required flags,not namespace/union behavior or runtime qualification.', 'docs/formal/EVENT_SEMANTIC_SCHEMA_INVENTORY.md': 'Accepted SEM001I.1 separates immutable occurrence records,four authoritative state roots,governed definitions,typed values,transaction staging and derived views. Truth,observer evidence and omniscient trace stay separate. Explicit false feature evidence is not absence; classification is not recognition; causal roles are companion evidence rather than a hidden Experience field. RecognitionEvaluation is trace-only including NoUpdate; persistent resolution is self-contained append-only state. Replacement symbol mappings preserve old cue provenance and allocate new IDs. Seeded recognition knowledge and callback definitions remain model inputs; recognition cannot silently learn that catalog. File transition/end keys prevent reuse; current/consequence ExperienceIDs remain separate. Revision links define per-track history,not allocation or timestamp order. Aborted staging allocations disappear; derived indexes cannot become independent authoritative saves. Fourteen reconciliation choices,six review dispositions and24 negative controls remain gates rather than implied implementation proof. The WorldEventTruth occurrence-row phrase canonical list conflicts with the specific canonical collection section: event bindings are duplicate-free canonical sets by complete validated binding bytes. The numeric collection rule and actual worldEventTruthValue set construction agree with the specific section. Preserve the wording inconsistency without rewriting frozen authorities or inferring list order. Later parent-contract/vector review and whole-runtime adequacy remain separate.'}
chain=[ref(p) for p in ['docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md', 'src/semanticBinding/semanticSchemaRegistry.ts', 'src/semanticBinding/semanticEvidenceCodecs.ts', 'docs/planning/campaign3-history-semantic-allocation-rev1/packet-check.json', 'docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md']]
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
 sources.append(dict(**ref(p),role='ACCEPTED SEMANTIC SHAPE/ALLOCATION; IMPLEMENTATION GATES SEPARATE',judgment=n,acceptanceChain=chain))
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

save('sections.json',dict(status='WHOLE TWO-CONTRACT SCOPE REVIEW; NO FRESH EXECUTION CLAIM',sections=sections,traceBoundary='Canonical set rule and codec resolve the historical list phrase; later Campaign2 allocation supersedes namespace1004 availability.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV308 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='SEMANTIC ALLOCATION SCOPE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Full two-contract text reviewed; read-only metadata check50 records/252 fields. No runtime/test suite or original writer rerun.','Namespace1004 and list/set wording dispositions are explicit; frozen source text remains unchanged.','No blanket later-runtime adequacy, public wrapper, family or campaign closure.'],sectionInventory=ref(O/'sections.json'),obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SEMANTIC ALLOCATION SCOPE ACCOUNTING',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),contractSources=2,sectionCount=len(sections),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
