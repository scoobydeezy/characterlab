"""Reconcile receiving machine revisions without erasing superseded aliases or scope."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');O=P/'campaign3-history-receiving-machinery-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def fingerprints(v):
 if isinstance(v,dict):
  if 'path' in v and 'sha256' in v:yield v
  for x in v.values():yield from fingerprints(x)
 elif isinstance(v,list):
  for x in v:yield from fingerprints(x)
specs={
 'EMBODIED_RECEIVING_SYMBOLIC_INVENTORY_REV1.json':'Historical31-record110-field proposal, not allocation input. Erroneous StatePathPattern160/1 is corrected to149/1 inREV2; RegistryDefinitionId alias still requiresREV3 correction. Other exact record/union/occurrence structure survives. Preserve old error and whole-source identity rather than rewriting reference strings.',
 'EMBODIED_RECEIVING_SYMBOLIC_INVENTORY_REV2.json':'ExactlyREV1 with StatePathPattern149/1. Unsupported RegistryDefinitionId1027 remains a naming error, superseded by accepted DefinitionId inREV3 without changing underlying namespace or topology. Historical open gates describe that revision, not a current owner decision.',
 'EMBODIED_RECEIVING_SYMBOLIC_INVENTORY_REV3.json':'ExactlyREV2 after replacing the unsupported alias in seven field types and the identity-family key.31records110orderedfields match485..515 allocation;16existing schemas14families and10new output mappings preserve generic occurrence reuse. Two conditional unions retain Task/Body and NoOptions/NoActiveReasons/Chosen distinctions; inline grounds are not independently allocated identities. Scalar/type grammar alone does not establish source association or semantic relations.',
 'EMBODIED_RECEIVING_VOCABULARY_REV1.json':'Historical51-member proposal contains unused1031 adopted-response-instructions and1032 leaf/embodied-response-instructions. These do not imply actual writable state or ADAPT route. REV2 removes exactly those members and adjusts count only; all16stages19roles4collectionchecks and separate StateMapKey role survive.',
 'EMBODIED_RECEIVING_VOCABULARY_REV2.json':'49text members plus5later union members are distinct categories. Six symbolic finite domains include two union discriminators, leaving four nonunion numeric domains; not two missing domains.16exact phases/input/output/seam rows match accepted prose.19scalar roles,4collection checks and1independent mapkey role bind allocation; no newnamespace. PublicApproach-only limit remains despite typedAvoid domain. Exact namespaces do not authenticate adopted/source membership.',
 'EMBODIED_RECEIVING_INHERITANCE_REVIEW_REV1.json':'Fresh original decoder/reference inspection reproduces16inherited schemas14families and3exact retained canonical declarations.359 remains measurement-prediction0.2 with diagnostic channel/unit and64support bound; exact authored character/task content references match. Retention does not activate prediction,REG,memory,identity or supply a forecast. New model must still bind same subject and passactualVAL; no model admission is claimed by this component.',
 'EMBODIED_RECEIVING_SCHEDULING_REV1.json':'Fresh actual scheduler with abstract text operands reproduces six variants:17/22/26events,13/14/18/19/22outputs and14/19ordinals; work25 rolls back26-event instant. Both sibling outputs exist before join allocation. Testnamespace10030,textlabels and fixedchosen/present switches are feasibility controls, not public source/SEM/PRJ/ground/RNG authority. Historical scheduler source is bound separately from current execution source.'
}
specs={(P/k).as_posix():v for k,v in specs.items()}
prior=load(P/'campaign3-history-source-roles-rev140/index.json');assert not set(specs)&{x['path'] for x in prior['roleAssignments']}
archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
i1,i2,i3=[load(P/f'EMBODIED_RECEIVING_SYMBOLIC_INVENTORY_REV{n}.json') for n in [1,2,3]]
v1,v2=[load(P/f'EMBODIED_RECEIVING_VOCABULARY_REV{n}.json') for n in [1,2]]
fixed=copy.deepcopy(i1);assert fixed['existingRecords']['StatePathPattern']=='160/1';fixed['existingRecords']['StatePathPattern']='149/1';assert fixed==i2
assert json.loads(json.dumps(i2).replace('RegistryDefinitionId','DefinitionId'))==i3
aliasFields=[dict(record=r['name'],field=f['name'],old=f['type']) for r in i2['records'] for f in r['fields'] if 'RegistryDefinitionId' in f['type']];assert len(aliasFields)==7
removed=[m for m in v1['members'] if m not in v2['members']]
assert [(m['existingNamespace'],m['payload']) for m in removed]==[(1031,'adopted-response-instructions'),(1032,'leaf/embodied-response-instructions')]
fixed=copy.deepcopy(v1);fixed['members']=[m for m in fixed['members'] if m not in removed];fixed['counts']['members']=49;assert fixed==v2
a=load(P.parent/'formal/EMBODIED_RECEIVING_ALLOCATION_TABLE.json');by={r['name']:r for r in a['records']}
assert len(i3['records'])==31 and sum(len(r['fields']) for r in i3['records'])==110
for r in i3['records']:
 x=by[r['name']];assert r['fields']==[{k:f[k] for k in ['name','type','required']} for f in x['fields']]
 assert [f['id'] for f in x['fields']]==list(range(1,len(r['fields'])+1))
assert sorted(r['typeId'] for r in by.values())==list(range(485,516))
assert i3['existingRecords']==a['existingRecordReferences'] and i3['existingIdentityFamilies']==a['identifierAliases'] and a['newNamespaces']==[]
def fieldId(record,name):return next(f['id'] for f in by[record]['fields'] if f['name']==name)
def numericRole(r):return dict(recordTypeId=by[r['record']]['typeId'],fieldId=fieldId(r['record'],r['field']),family=r['family'],requiredNamespace=r['requiredNamespace'],domainValidatorId=r['domainValidator'])
assert [numericRole(r) for r in v2['scalarRoles']]==a['roles']
assert [dict(**numericRole(r),containerGrammar=r['containerGrammar']) for r in v2['collectionIdentityChecks']]==a['collectionIdentityChecks']
assert [dict(**numericRole(v2['stateMapKeyRole']),position='StateMapKey')]==a['mapKeyRoles']
memberKey=lambda n,p:(n,json.dumps(p,separators=(',',':')))
members={memberKey(m['namespace'],m['payload']) for m in a['members']}
for m in v2['members']:assert memberKey(m['existingNamespace'],m['payload']) in members
assert len(v2['members'])==len(a['members'])==49 and len(a['members'])+len(a['unionDefinitions'])==54
unions=[]
for u in i3['unions']:
 for tag,v in enumerate(u['variants'],1):unions.append(dict(recordTypeId=by[u['record']]['typeId'],tag=tag,name=v['name'],requiredPayloadFieldIds=[fieldId(u['record'],n) for n in v['required']],forbiddenPayloadFieldIds=[fieldId(u['record'],n) for n in v['forbidden']]))
assert unions==a['unionDefinitions']
ordinary=[d for d in v2['finiteDomains'] if d['field']!='VariantTag'];assert len(ordinary)==4
domains=[dict(recordTypeId=by[d['record']]['typeId'],fieldId=fieldId(d['record'],d['field']),values=[dict(name=n,value=j) for n,j in zip(d['values'],d.get('inheritedNumbers',range(1,len(d['values'])+1)))]) for d in ordinary]
assert domains==a['finiteDomains']
assert [dict(recordTypeId=by[o['output']]['typeId'],schemaVersion=1,fieldId=1,family=o['family'],requiredNamespace=i3['existingIdentityFamilies'][o['family']]) for o in i3['occurrenceOutputs']]==a['occurrenceIdentities']
stages=load(P/'campaign3-history-receiving-intake-rev1/review.json')['stageTable'];assert len(stages)==len(v2['stages'])==16
for s,r in zip(v2['stages'],stages):
 parts=[x.strip() for x in r['exactLine'].strip('|').split('|')]
 assert parts[:4]==[s['stage'],str(s['phase']),s['input'],s['output']]
fresh=[]
for name in ['inheritance','scheduling']:
 r=load(O/(name+'.json'));assert r['status']=='PASS'
 for k in ['original','checker']:assert ref(r[k]['path'])==r[k]
 for b in r['bindings']:assert ref(b['resolvedPath'])['sha256']==b['sha256']
 for b in r.get('currentSources',[]):assert ref(b['path'])==b
 fresh.append(ref(O/(name+'.json')))
inherit=load(P/'EMBODIED_RECEIVING_INHERITANCE_REVIEW_REV1.json');assert len(inherit['inherited'])==16 and len(inherit['identityFamilies'])==14
assert inherit['dormantPrediction']['unit']=='unit/diagnostic-regulatory-level' and inherit['dormantPrediction']['maxEvidenceCount']=='64'
for d in inherit['retainedExactDeclarations']:assert hashlib.sha256(bytes.fromhex(d['canonicalHex'])).hexdigest()==d['sha256']
assert len(inherit['retainedExactDeclarations'])==3
sched=load(P/'EMBODIED_RECEIVING_SCHEDULING_REV1.json');assert [len(r['events']) for r in sched['results']]==[17,17,22,22,26,0]
assert sched['results'][-1]['failure']=='CASCADE_LIMIT_EXCEEDED' and sched['results'][-1]['runtimeOrdinals']=='0'
chain=fresh+[ref(P/'campaign3-history-receiving-intake-rev1/review.json'),ref(P/'campaign3-history-embodied-contracts-rev1/review.json'),ref(P/'campaign3-history-embodied-receiving-rev1/review.json')]
entries={x['path']:x for x in load(B/'manifest.json')['entries']};roles=[];strings={};bindings=[]
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='RECEIVING MACHINE REVISION / INHERITANCE / ABSTRACT SCHEDULING',judgment=j,acceptanceChain=chain))
 data=load(p)
 for ptr,s in walk(data):strings[p,ptr]=s
 for f in fingerprints(data):
  path=f['path'] if Path(f['path']).exists() and ref(f['path'])['sha256']==f['sha256'] else archives.get(f['sha256'])
  assert path and ref(path)['sha256']==f['sha256'],f
  bindings.append(dict(source=p,originalPath=f['path'],sha256=f['sha256'],resolvedPath=path))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location']['pointer'];assert u['sourceSha256']==entries[u['source']]['sha256'] and strings[u['source'],ptr]==u['text']
  narrative=ptr.startswith(('/status','/open','/limits')) or ptr.endswith(('/admission','/publicScope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='RECEIVING REVISIONS/INHERITANCE/ABSTRACT GRAPH RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,correctedAliasFields=aliasFields,removedUnusedMembers=removed,obligations=['RO-C3-001','RO-C3-004','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Fresh original inheritance decoder and6abstract scheduler variants only; prior28public runs/86prefixes/27tests/20mutants are reused evidence, not rerun.','Earlier inventory160/1 and unsupported alias remain exact historical errors; no old artifact rewritten or silently activated.','49text plus5union members and6symbolic versus4nonunion finite domains are different counts, not missing implementation.','585-check declaration receipt and remaining test/provenance metadata remain separate whole-source work.','No new law/model/allocation/corpus/verdict/obligation closure or HQ012 entry.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),records=31,fields=110,stages=16,scalarRoles=19,collectionChecks=4,stateKeyRoles=1,retainedDeclarations=3,inheritedSchemas=16,identityFamilies=14,schedulerVariants=6,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
