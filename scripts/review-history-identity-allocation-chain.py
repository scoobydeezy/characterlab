"""Reconcile identity decision/allocation chronology without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-identity-allocation-chain-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev236/index.json'; ix=load(ip)
entries={r['path']:r for r in load(B/'manifest.json')['entries']}
archives={r['sha256']:r['path'] for r in ix['explicitBackingOutsideProseManifest']}
notes={
 'docs/planning/CAMPAIGN2_CONTENT_STABLE_ID_DECISION.md':'Resolved missing production identity home, not missing encodability. Generic170 already holds complete typed StableId; origin wrapper does not allocate its base family. Permanent1038 chosen instead of promoting fixture20/23000 or borrowing another named family. First profile requires authored NFC identity; generic CONTENT remains polymorphic with no global PRJ field role. Six tests map eight controls; no-allocator F additionally uses source inspection, not full-factory proof. Earlier pending FCT work is historical routing; later scoped qualification required. Historical fixture bytes not relabelled equivalent.',
 'docs/planning/CAMPAIGN2_ORIGIN_BINDING_DECISION.md':'Accepted alternative2 explicitly supersedes decision-required prose: permanent1037/1122, complete authored typed StableId versus shared-allocator unsigned runtime ordinal. Reject fixture20/21 promotion; neither existing namespace-separation test nor text-only production codec proved required nested origin. Preserve this discovered conformance flaw and explicit migration, not hidden helper inference or revised old PHEN-SEM claim. Old/new committed bytes differ. Earlier71schemas/32union layouts/325test checkpoint was structural construction and VAL declarations, not runtime character role or integrated activation. Six string test occurrence IDs changed to bigint are separate test-data corrections, not origin semantics. ORIGIN-G2 interleaving adds proof obligation, not occurrence rule.',
 'docs/planning/CAMPAIGN2_OBSERVATION_UNIT_DECISION.md':'Required201/5 UnitId cannot be omitted because projection preserves measurements. Encodability did not supply governed unit authority; REG removal of Unit and scalar lattices remains valid. Fixed unit/fixture-pulse accepted, later appended1039 numeric freeze/component evidence supersedes pending text only at those gates. Namespace-only role and exact-member compiler remain separate. Counterfactual count preserves observer bytes; unit is not hidden dose/reward/skill magnitude. No dimension/conversion/general vocabulary or source-selected unit. Component controls using local vocabulary were not production-ready model bytes.'}
details={
 'CONTENT_ID':('One1038 authored model/content family, no individual permanent members and no generic170 role constraint. The complete typed StableId slot is reused without resolver, binding, runtime allocation or state.',37),
 'ORIGIN':('Two families1037/1122 nested under unchanged1002; complete authored identity versus opaque runtime ordinal.1122 is entity identity, not occurrence definition. No per-origin allocator, registry or new content base family; numeric adjacency has no semantics.',43),
 'OBSERVATION_UNIT':('One1039 model/vocabulary family and sole fixed unit/fixture-pulse member; not open authored units, conversion or REG dimensions. Namespace role and exact-member admission separate; zero occurrence/record/allocator additions.',77)}
bindings=[]; inventories=[]
def bind(receipt,p,h):
 actual=p if Path(p).is_file() and ref(p)['sha256']==h else archives[h]
 assert ref(actual)['sha256']==h
 bindings.append(dict(receipt=receipt,original=dict(path=p,sha256=h),actual=ref(actual)))
for n,(detail,count) in details.items():
 tp=f'docs/formal/{n}_ALLOCATION_TABLE.json'; ap=f'docs/formal/{n}_ALLOCATION_AUDIT.json'; mp=f'docs/formal/{n}_PERMANENT_ALLOCATION.md'
 t=load(tp); a=load(ap); md=Path(mp).read_text(encoding='utf-8')
 assert a['allocationSnapshot']==t
 assert len(a['checks'])==count and all(r['status']=='PASS' for r in a['checks'])
 assert t['status']=='PERMANENT AND FROZEN' and t['version'] in md
 for k in ['records','bindings','unionVariants','finiteValues','occurrenceDefinitions','stateRoots','saveFields']: assert t[k]==[]
 assert [r['namespace'] for r in t['namespaces']]==({'CONTENT_ID':[1038],'ORIGIN':[1037,1122],'OBSERVATION_UNIT':[1039]}[n])
 for r in t['namespaces']:
  assert '| '+' | '.join(str(r[k]) for k in ['namespace','name','scope','payload'])+' |' in md
 if n=='ORIGIN': assert t['outerNamespace']==1002
 if n=='OBSERVATION_UNIT':
  assert t['members']==[dict(namespace=1039,name='unit/fixture-pulse',payload='unit/fixture-pulse',owner='first Campaign-2 bridge profile')]
  assert '| 1039 | ObservationUnitId | unit/fixture-pulse | unit/fixture-pulse | first Campaign-2 bridge profile |' in md
 else: assert t['members']==[]
 for rp,v in [(tp,t),(ap,a['allocationSnapshot'])]:
  for r in v['preservedSources']: bind(rp,r['path'],r['sha256'])
 bind(ap,tp,a['tableSha256']);bind(ap,mp,a['markdownSha256'])
 bind(ap,t['authority'],a.get('authoritySha256') or a['authority']['sha256'])
 notes[mp]='Permanent allocation authority after conditional separate gate. '+detail+' Mechanical freeze permits subsequent implementation, not runtime controls or factory activation.'
 notes[tp]='Frozen machine allocation payload. '+detail+' Exact audit snapshot and displayed namespace/member rows checked; inherited source hashes bind current or separately preserved bytes. No scientific inference from numeric allocation.'
 notes[ap]=f'Historical {count}-check mechanical receipt; labels/statuses reviewed as bounded inventory/hash claims, not independent behavioral tests. '+detail+' Full snapshot equals frozen table. Exact source bindings/parity checked freshly; original checker not rerun. Limitations retain symbolic/runtime/activation distinction. Historical registry copy used rather than silently replacing its hash with current registry.'
 inventories.append(dict(name=n,table=ref(tp),audit=ref(ap),namespaceRows=len(t['namespaces']),members=len(t['members']),historicalCheckLabels=count,matchingSnapshot=True))
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','checks','limitations'])
chain=[ref(P/'campaign3-history-content-origin-authority-rev1/review.json'),ref(P/'campaign3-history-allocation-corrections-rev1/review.json'),ref(P/'CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md')]
sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='IDENTITY DECISION/ALLOCATION CHRONOLOGY WITH BOUNDED MECHANICAL EVIDENCE',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='TWELVE IDENTITY DECISION/ALLOCATION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,inventories=inventories,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=['Allocation namespace/row/snapshot parity and exact-byte bindings checked freshly; historical writers and runtime were not rerun.','Mechanical labels do not prove symbolic acceptance, behavioral qualification or whole-factory activation.','Prior text-only conformance flaw and non-equivalent migration retained; no fixture namespace promoted by retrospective audit.','No new archive/source gap, model/allocation/verdict/corpus or obligation status change; independent adequacy open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS IDENTITY ALLOCATION CHRONOLOGY AND EXACT BINDINGS',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
