"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-prediction-design-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={
'docs/formal/TASK_COMMITMENT_PERMANENT_ALLOCATION.md':'Permanent seven records370..376/34fields/14members/three status tags, no namespace or occurrence; numericadjacency no meaning. Normative table includes historical role error later superseded0.2 without renumbering. Freeze grants packaging not TC/runtime/cognition.',
'docs/planning/TASK_COMMITMENT_ALLOCATION_DRAFT.md':'Human record/field/member tables plus embedded complete machine proposal. All rows and embeddedJSON exactly checked. Original two invalid mapkeyroles remain historical, not acceptedcurrentconstraints. Preserve proposalstatus and exactsourcebindings; parity does not fixsemantics.',
'docs/planning/TASK_COMMITMENT_ALLOCATION_DRAFT.json':'Seven records and34fields,tenRecordFieldroles,two proposed StateMapKey positions; latter erroneous and removed by latercorrectedtable. TaskSpecIds set has receivingcompiler collection check notscalar265; reused203/237roles. Status tags1Open/2PerceivedSatisfied/3DeadlineMissed withonlytag2requiringbothoptionalpayloads. No speculativeplanfields/newnamespace/occurrence.190exactbindings checked, no runtime.',
'docs/formal/TASK_COMMITMENT_ALLOCATION_TABLE.json':'Frozen0.1 inventory differs draft onlyversion/status/acceptance/reviewedrefs; permanentIDs preserved even though originalmapkeyrolemetadatawrong. Corrected0.2 retains records/fields/members/scalarroles/variants, deletesexacttwo mapkeyroles. No new373field2 or reinterpretation of StateMapKey. Frozen bytes remain authoritative history, correctedtable owns runtime metadata.',
'docs/planning/TASK_COMMITMENT_ALLOCATION_AUDIT.json':'Mechanicaldraftreview190unique inheritedsources,7records34fields14members10recordroles2mapkeyroles3variants. Eightchecks included complete role/collectionownership but missedwrongStateMapKeysemantics; broadownershipPASS narrowed by correction. Actualparity/hashresults distinct from false semanticinference. No numericpermanence or canonicalconstruction/TC then.',
'docs/formal/TASK_COMMITMENT_ALLOCATION_FREEZE_AUDIT.json':'Internalnumericfreeze190prior sources,twofrozen/three reviewed artifacts exact. DisplayedMarkdown andmachineparity legitimate; separatecharacter/taskmapkeyqualifier check didnotprovevalidcompositekeypositions. Roleclaimwithdrawn under explicit0.2correction, not hidden as genericgreenfreeze. TCnotpassedhistorical, futuremodelgate separate.'}
ip=P/'campaign3-history-source-roles-rev233/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
O=P/'campaign3-history-task-allocation-rev1';O.mkdir(exist_ok=True)
import collections
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']};bindings=[]
for p in notes:
 if not p.endswith('.json'):continue
 for k in ['sourceFingerprints','artifacts','reviewedDraftArtifacts','frozenArtifacts']:
  for r in load(p).get(k,[]):
   actual=r['path'] if ref(r['path'])['sha256']==r['sha256'] else archives[r['sha256']]
   assert ref(actual)['sha256']==r['sha256'];bindings.append(dict(receipt=p,original=r,actual=ref(actual)))
x=load('docs/formal/TASK_COMMITMENT_ALLOCATION_TABLE.json');y=load(P/'TASK_COMMITMENT_ALLOCATION_DRAFT.json');z=load('docs/formal/TASK_COMMITMENT_CORRECTION_ALLOCATION_TABLE.json')
assert [k for k in x if x[k]!=y.get(k)]==['version','status','acceptance','reviewedDraftArtifacts']
assert len(y['records'])==7 and sum(len(r['fields']) for r in y['records'])==34
assert len(y['members'])==14 and len(y['roles'])==10 and len(y['mapKeyRoles'])==2
assert not y['namespaces'] and not y['occurrenceIdentities']
assert [r['typeId'] for r in y['records']]==list(range(370,377))
for k in ['records','members','roles','unionVariants']:assert x[k]==z[k]
assert z['mapKeyRoles']==[]
text=Path('docs/planning/TASK_COMMITMENT_ALLOCATION_DRAFT.md').read_text(encoding='utf-8')
assert load(P/'TASK_COMMITMENT_ALLOCATION_DRAFT.json')==__import__('json').loads(text.split('```json')[1].split('```')[0])
for r in y['records']:
 section=text.split(f"## {r['typeId']}/1 {r['name']}")[1].split('## ')[0]
 for f in r['fields']:assert f"| {f['id']} | {f['name']} | {str(f['required']).lower()} | {f['type']} |" in section
for m in y['members']:assert f"| {m['namespace']} | {m['payload']} |" in text
assert len(y['sourceFingerprints'])==len({r['path'] for r in y['sourceFingerprints']})==190
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','checks','excluded','runtimeQualification','campaign2'])
chain=[ref('docs/formal/TASK_COMMITMENT_KEY_ROLE_CORRECTION.md'),ref(P/'campaign3-history-task-packaging-rev1/review.json'),ref(P/'campaign3-history-task-lifecycle-rev1/review.json')];sources=[];leaves=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL NUMERIC/ALLOCATION AUTHORITY WITH CORRECTED SEMANTIC CLAIM',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=x,role='NARRATIVE' if narrative(q) else 'BACKING') for q,x in walk(load(p)))
rows=[];counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({x['occurrenceId'] for x in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('review.json',dict(status='SIX TASK ALLOCATION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,schema=ref(O/'schema.json'),preservedArtifacts=[],limits=['Fresh inventory/parity/hash checks are not new runtime qualification or repair of historical audit semantics.','Historical composite-key StateMapKey error preserved; corrected metadata removes two invalid roles without renumbering permanentfields.','No new source gap/archive or runtime/test/build rerun; no model/allocation/verdict/corpus/obligation status change.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS TASK ALLOCATION HISTORY AND EXACT BINDINGS',sources=6,originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),exactBindings=len(bindings),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
