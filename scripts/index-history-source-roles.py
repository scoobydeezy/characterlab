"""Consolidate explicit source roles without treating the candidate census as accepted."""
from pathlib import Path
import json,hashlib,collections
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-source-roles-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
manifest=load(B/'manifest.json');entries={e['path']:e for e in manifest['entries']}
rootPath=P/'campaign3-history-root-accounting-rev1/review.json';roots=load(rootPath)
qualPath=P/'campaign3-history-late-qualifications-rev1/review.json';quals=load(qualPath)
contractPath=P/'campaign3-history-late-contracts-rev1/review.json';contracts=load(contractPath)
replayPath=P/'campaign3-history-goal-replay-backing-rev1/review.json';replay=load(replayPath)
goalPath=P/'campaign3-history-goal-backing-rev1/review.json';goal=load(goalPath)
roles={};fullIds=set();partialIds=set();inputs=[rootPath,qualPath,contractPath,replayPath,goalPath]
def add(path,sourceHash,category,role,evidence,scope):
 assert path in entries and entries[path]['sha256']==sourceHash,path
 assert path not in roles,path
 roles[path]=dict(path=path,sha256=sourceHash,category=category,role=role,evidence=evidence,scope=scope)
def ref(path):return dict(path=path.as_posix(),sha256=sha(path))
for source in roots['sources']:
 ids=source['occurrenceIds'];fullIds.update(ids)
 # Every original paragraph has an explicit judgment in the bound primary reviews.
 reports=sorted({b['path'] for oid in ids for b in roots['bindings'][oid]})
 evidence=[ref(rootPath)]+[ref(Path(p)) for p in reports]
 add(source['path'],source['sha256'],'WHOLE_NARRATIVE_SOURCE_ROLE_REVIEWED',source['role'],evidence,
  'Frozen source only. Exact original paragraphs have content-specific authority/historical/nonfinding/scientific-limit dispositions in the bound reviews; no independent evidentiary weight for repeated routing. Post-cutoff changes require separate accounting.')
for source in quals['sourceRoles']:
 add(source['path'],source['sha256'],'WHOLE_QUALIFICATION_OR_FINDING_SOURCE_ROLE_REVIEWED',source['role'],[ref(qualPath)],
  'Scope and acceptance/supersession rationale are explicit in the source-specific review, with exact closure/plan/checker or preserved-failure evidence. Not an unrestricted phenomenon or public-native qualification.')
for row in quals['rows']:fullIds.add(row['occurrenceId'])
for source in contracts['sources']:
 add(source['path'],source['sha256'],'WHOLE_CONTRACT_SOURCE_ROLE_REVIEWED',source['role'],[ref(contractPath)],
  'Exact versioned component or harness scope bound by prospective plan and named later qualification. Candidate psychological laws are not universal; predecessor0.1 harness is explicitly superseded.')
for row in contracts['rows']:fullIds.add(row['occurrenceId'])
for source in replay['files']:
 add(source['path'],source['sha256'],'WHOLE_CLOSED_SCHEMA_BACKING_ROLE_REVIEWED',source['role'],[ref(replayPath)],
  'All six fields and all string values inspected against exact original plan/run/prefix/save/successor semantics. Zero extracted prose and no omitted short material prose in this schema. Existing immediate-successor receipt; not a fresh execution or full-tail proof.')
for source in goal['files']:
 add(source['path'],source['sha256'],'PARTIAL_FIELD_ROLE_REVIEWED','GOAL LIFECYCLE AND REPLAY PARENT BINDING ONLY',[ref(goalPath),ref(replayPath)],
  'Only typed goal-status fields and original identity/archive/prefix bindings classified; remaining trajectory/schema content is not assigned a whole-source role here.')
for row in goal['rows']:partialIds.add(row['occurrenceId'])
assert not fullIds&partialIds
seenFull=set();seenPartial=set();bySource=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as stream:
 for line in stream:
  u=json.loads(line)
  if u['id'] in fullIds:seenFull.add(u['id']);bySource[u['source']]+=1
  if u['id'] in partialIds:seenPartial.add(u['id'])
assert seenFull==fullIds and seenPartial==partialIds
unassigned=sorted(set(entries)-set(roles))
assert len(roles)+len(unassigned)==len(entries)
counts=collections.Counter(r['category'] for r in roles.values())
archives=replay['archives']
assert all(a['path'] not in entries for a in archives)
v=dict(version='campaign3-history-source-roles/0.1',status='PARTIAL SOURCE-ROLE INDEX; HQ011 ADEQUACY OPEN',
 candidateManifest=ref(B/'manifest.json'),roleAssignments=[roles[p] for p in sorted(roles)],unassignedCandidatePaths=unassigned,
 explicitBackingOutsideProseManifest=[dict(path=a['path'],sha256=a['sha256'],role=a['role'],evidence=ref(replayPath)) for a in archives],
 reviewedInputs=[ref(p) for p in inputs],originalNarrativeOrFindingOccurrences=len(fullIds),originalBackingFieldOccurrences=len(partialIds),
 obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],
 rules=['Candidate selection stays the frozen11373-file census; this successor overlays roles without rewriting its original acceptance labels or source identities.',
 'Role assignment requires one of the explicit bound content reviews, never a filename, directory, status marker, hash equality or registry membership alone.',
 'Whole source-role review covers original prose and stated extraction/schema scope; it is not blanket scientific truth or current-state promotion.',
 'A partial field review cannot exclude other fields or mark the parent fully reconciled.',
 'Unassigned paths have no source-role assignment in THIS index. Earlier scoped reviews may exist and must be joined explicitly; absence here does not retract them or justify exclusion.',
 'Multiple occurrences/repeated reports retain exact identities without adding independent experimental weight. Superseded files remain accessible with their scoped correction.',
 'No remaining candidate is excluded here. Canonical inclusion/exclusion adequacy, post-cutoff deltas, unresolved references and final freshness remain required before HQ012.'],
 limits=['This partial index is a worklist, not zero unreconciled findings or whole Campaign3 exit.',
 'Frozen root/current-file differences,343 supplemental formula paragraphs, Values and other post-cutoff audit additions still require final delta accounting.',
 'Known missing historical formula/log provenance remains explicit; role classification does not recover or authenticate unknown historical bytes.',
 'No fresh simulation, test suite, build or native admission is performed by indexing.'])
O.mkdir(exist_ok=True);save(O/'index.json',v)
c=dict(status=v['status'],candidateFiles=len(entries),assignedSources=len(roles),byCategory=dict(counts),unassignedWithinThisIndex=len(unassigned),explicitArchivesOutsideCensus=len(archives),originalNarrativeOrFindingOccurrences=len(fullIds),originalBackingFieldOccurrences=len(partialIds),indexSha256=sha(O/'index.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
