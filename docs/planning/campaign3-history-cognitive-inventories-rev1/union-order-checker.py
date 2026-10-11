"""Reconcile symbolic inventory revisions without rewriting draft or numeric authority."""
from pathlib import Path
import json,hashlib,re,collections
P=Path('docs/planning');O=P/'campaign3-history-cognitive-inventories-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev181/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
sources={};inventories=[];changes=[]
baseNote='Historical symbolic packaging, not numeric allocation or runtime qualification. Exact changes are retained; later accepted shape, allocation/model and scoped runtime evidence remain distinct.'
for n in range(1,6):
 p=P/f'CAMPAIGN2_COGNITIVE_SYMBOLIC_INVENTORY_REV{n}.json';v=load(p);inventories.append(v)
 assert len(v['records'])==v['counts']['records'] and sum(len(r['fields']) for r in v['records'])==v['counts']['fields']
 assert len(v['requiredIdentitySymbols'])==v['counts']['identitySymbolsRequiringInventoryReview']
 assert len({r['name'] for r in v['records']})==len(v['records'])
 assert all(r['numericAllocation'] is None and len({f['name'] for f in r['fields']})==len(r['fields']) for r in v['records'])
 notes={1:'43 records129 fields,18 symbols; incomplete decision/output/registration/history work explicitly unresolved.',2:'59 records184 fields;16 output records added and resolution OccurredAt inserted. The copied unresolved list still names some shapes already added; preserve as stale checkpoint prose, not proof those fields remained absent.',3:'59 records183 fields; removed StandingIdentityRead from raw context and added MotiveChannel symbol. Actual history remains separately owned; no deletion of learned state.',4:'77 records247 fields;18 registration/calibration/quantization records added and unused RandomComparisonRole removed. Natural-only profile does not retire substrate coupling.',5:'76 records244 fields; CoverageContribution removed as pure internal argument, not retired mathematics.373 successor explicit outside new-record count. Four unresolved packaging gates later addressed by shape/allocation/model, not by the status string alone.'}
 sources[p.as_posix()]=(ref(p),baseNote+' '+notes[n])
 if n>1:
  a={r['name']:r for r in inventories[-2]['records']};b={r['name']:r for r in v['records']}
  changes.append(dict(fromRevision=n-1,toRevision=n,addedRecords=sorted(set(b)-set(a)),removedRecords=sorted(set(a)-set(b)),changedRecords=[dict(name=k,before=a[k],after=b[k]) for k in sorted(a.keys()&b.keys()) if a[k]!=b[k]],addedIdentitySymbols=sorted(set(v['requiredIdentitySymbols'])-set(inventories[-2]['requiredIdentitySymbols'])),removedIdentitySymbols=sorted(set(inventories[-2]['requiredIdentitySymbols'])-set(v['requiredIdentitySymbols']))))
assert [len(x['addedRecords']) for x in changes]==[16,0,18,0]
assert [x['removedRecords'] for x in changes]==[[],[],[],['CoverageContribution']]
assert [[x['name'] for x in z['changedRecords']] for z in changes]==[['DecisionResolution'],['TaskRawSignalContext'],[],[]]
grammars=[]
for n in [1,2]:
 p=P/f'CAMPAIGN2_COGNITIVE_FIELD_GRAMMAR_REV{n}.json';v=load(p);grammars.append(v);inventory=load(v['sourceInventory'])
 assert [{**r,'fields':[{k:z for k,z in f.items() if k!='grammar'} for f in r['fields']]} for r in v['records']]==inventory['records']
 sources[p.as_posix()]=(ref(p),baseNote+' Field grammar covers exact field order/optional flags and seven closed unions; it is not a relational/cardinality/source validator. REV1 includes the internal CoverageContribution mistake; REV2 removes only that record plus source/correction metadata. Enum order is not numeric allocation.')
g1,g2=grammars;assert {k:v for k,v in g1.items() if k not in ['records','sourceInventory']}=={k:v for k,v in g2.items() if k not in ['records','sourceInventory','correction']}
assert [r for r in g1['records'] if r['name']!='CoverageContribution']==g2['records']
records={r['name']:r for r in g2['records']};fields={(r['name'],f['name']):f for r in g2['records'] for f in r['fields']}
assert len(records)==76 and len(fields)==244 and len(g2['enums'])==16 and sum(map(len,g2['unionRules'].values()))==17
branches=[]
for name,variants in g2['unionRules'].items():
 optional={f['name'] for f in records[name]['fields'] if f['optional']}
 assert set(variants)==set(g2['enums'][name])
 for variant,required in variants.items():
  assert set(required)<=optional
  branches.append(dict(record=name,variant=variant,required=required,forbidden=sorted(optional-set(required))))
audits=[];bindings=[]
for n in [1,2]:
 p=P/f'CAMPAIGN2_COGNITIVE_GRAMMAR_REFERENCE_AUDIT_REV{n}.json';v=load(p);audits.append(v)
 assert ref(v['source'])['sha256']==v['sha256'];bindings.append(dict(owner=p.as_posix(),**ref(v['source'])))
 sources[p.as_posix()]=(ref(p),baseNote+' Both reference audits bind grammarREV1 with77 records247 fields, not final grammarREV2. REV2 changes only three aliases: Seam1019 to1036, Event1008 to1001, Transition1020 to1009. Six recorded rejection controls do not constitute runtime or full refinement qualification.')
assert {k:v for k,v in audits[0].items() if k!='identifierAliases'}=={k:v for k,v in audits[1].items() if k!='identifierAliases'}
aliasChanges={k:dict(before=v,after=audits[1]['identifierAliases'][k]) for k,v in audits[0]['identifierAliases'].items() if v!=audits[1]['identifierAliases'][k]}
assert aliasChanges=={'SeamId':{'before':'1019','after':'1036'},'EventTypeId':{'before':'1008','after':'1001'},'TransitionKindId':{'before':'1020','after':'1009'}}
assert audits[1]['closedUnionBranches']==branches
p=P/'CAMPAIGN2_COGNITIVE_ROLE_OCCURRENCE_AUDIT_REV1.json';role=load(p)
sources[p.as_posix()]=(ref(p),baseNote+'52 scalar RecordField roles,32 collection positions,14 sole output families and16 inherited schema references are structural coverage. Scalar predicates do not authenticate occurrences or contextual random bindings.373 successor remains separate. Four recorded wrong-type controls are not all codec/persistence/runtime tests.')
for f in role['sourceFingerprints']:assert ref(f['path'])==f;bindings.append(dict(owner=p.as_posix(),**f))
expectedScalar={(a,b) for (a,b),f in fields.items() if f['grammar'].startswith('id(')}
assert {(x['record'],x['field']) for x in role['scalarRoles']}==expectedScalar and len(expectedScalar)==52
expectedCollections={(a,b) for (a,b),f in fields.items() if f['grammar'].startswith(('list(','set(','map('))}
assert {(x['record'],x['field']) for x in role['collectionPositions']}==expectedCollections and len(expectedCollections)==32
assert all(x['position']=='RecordField' for x in role['scalarRoles'])
assert len(role['outputs'])==len({x['family'] for x in role['outputs']})==14
for x in role['outputs']:
 assert fields[x['output'],x['identityField']]['grammar']=='id('+x['family']+')'
 assert x['allocationOwner']=='279/278' and x['multiplicity']=='ExactlyOne'
 for position in x['referencePositions']:
  a,b=position.split('.');assert fields[a,b]['grammar']=='id('+x['family']+')'
graph={name:{t for f in r['fields'] for t in re.findall(r'[A-Za-z][A-Za-z0-9]*',f['grammar']) if t in records} for name,r in records.items()}
def visit(n,stack):
 assert n not in stack,('recursive canonical graph',n)
 for child in graph[n]:visit(child,stack|{n})
for n in graph:visit(n,set())
p=Path('docs/formal/TASK_COGNITIVE_SHAPE_MANIFEST.json');shape=load(p)
sources[p.as_posix()]=(ref(p),'Internal whole-shape acceptance only; allocation/runtime/Campaign2 were pending at this checkpoint. All31 component documents independently reviewed in source roles, not accepted just because a link exists.76 new records244 fields, one existing-root successor,14 outputs52 scalars32 collection positions17 branches21 recipes. Later qualification separately supersedes runtime NOT PASSED; manifest bytes remain unchanged.')
assigned={x['path'] for x in ix['roleAssignments']}
for f in [shape['authority'],shape['review'],*shape['components'],shape['inventory'],shape['fieldGrammar'],shape['structuralAudit']]:
 assert ref(f['path'])==f;bindings.append(dict(owner=p.as_posix(),**f))
assert len(shape['components'])==31 and all(x['path'] in assigned for x in shape['components'])
chain=[ref('docs/formal/TASK_COGNITIVE_PATH.md'),ref(P/'CAMPAIGN2_COGNITIVE_WHOLE_SHAPE_REVIEW.md'),ref(P/'campaign3-history-cognitive-qualification-rev1/review.json')]
schemas=collections.defaultdict(lambda:dict(count=0,values=set()))
def walk(x,p=''):
 if isinstance(x,str):yield p,x
 elif isinstance(x,dict):
  for k,v in x.items():yield from walk(v,p+'/'+k)
 elif isinstance(x,list):
  for i,v in enumerate(x):yield from walk(v,p+'/'+str(i))
for path,(sr,note) in sources.items():
 assert path in ix['unassignedCandidatePaths'] and sr['sha256']==entries[path]['sha256']
 for pointer,s in walk(load(path)):
  key=re.sub(r'/\d+(?=/|$)','/*',pointer);schemas[key]['count']+=1;schemas[key]['values'].add(s)
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line);path=u['source']
  if path not in sources:continue
  assert u['sourceSha256']==sources[path][0]['sha256']
  pointer=u['location']['pointer'];category='NARRATIVE' if pointer.split('/')[1] in ['status','unresolved','limits','correction','notation','runtimeQualification','campaign2'] else 'BACKING'
  counts[category]+=1;rows.append(dict(occurrenceId=u['id'],source=path,sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=category,judgment=sources[path][1]))
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,fields=[dict(path=k,occurrences=v['count'],uniqueValues=len(v['values']),role='SYMBOLIC GRAMMAR/IDENTITY/REFERENCE METADATA UNLESS TOP-LEVEL STATUS/LIMIT/CORRECTION/UNRESOLVED NARRATIVE') for k,v in sorted(schemas.items())]))
save('review.json',dict(status='ELEVEN SYMBOLIC INVENTORY/SHAPE SOURCES RECONCILED; NOT RUNTIME REQUALIFICATION',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=[dict(**r,role='HISTORICAL SYMBOLIC INVENTORY WITH EXPLICIT CORRECTION CHAIN',judgment=n,acceptanceChain=chain) for r,n in sources.values()],changes=changes,aliasChanges=aliasChanges,exactBindings=bindings,rows=rows,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=['Early unresolved lists sometimes retain wording for already-added shapes; preserve checkpoint chronology rather than treating strings as current absence.','Both alias reference audits target grammarREV1; final structural audit targets grammarREV2. Shape links and structural counts are not source authenticity, numerical allocation, runtime behavior or independent universe adequacy.','No old writer, runtime test, model, corpus, allocation or obligation status changed.80 inventory identities and one older scheduler identity remain separate outstanding gaps.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED SYMBOLIC RECONCILIATION',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=sum(x['count'] for x in schemas.values()),records=76,fields=244,scalarPositions=52,collectionPositions=32,outputs=14,closedBranches=17,exactBindings=len(bindings),acyclic=True,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
