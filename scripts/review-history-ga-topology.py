"""Reconcile composed symbolic topology and occurrence declarations, not execution."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-topology-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
names=['GA_COMPOSED_LOGICAL_TOPOLOGY_REV1.md','GA_OUTPUT_AND_OCCURRENCE_CLOSURE_REV1.md']+[f'GA_COMPOSED_LOGICAL_TOPOLOGY_REV{i}.json' for i in [1,2]]+[f'GA_OUTPUT_DECLARATIONS_REV{i}.json' for i in [1,2,3]]+[f'GA_LOGICAL_TOPOLOGY_REVIEW_REV{i}.json' for i in [1,2]]+[f'GA_OUTPUT_DECLARATIONS_REVIEW_REV{i}.json' for i in [1,2]]
common='Historical symbolic declarations only; no runtime allocation, branch evaluation, scheduling, future-time, join-once, patch, persistence or work-ceiling proof. Original static review reproduced without weakening assertions. Later public evidence is separate.'
notes={
'GA_COMPOSED_LOGICAL_TOPOLOGY_REV1.md':'66 templates comprise63 plus three independent goal-baseline stages. Baseline cannot become ordinary recall or presentation. Immediate DAG/phase checks do not enforce future-time or same-phase causal input equality. Last-parent join is one evaluation. Inherited probe/task work excluded; template count is not work.',
'GA_OUTPUT_AND_OCCURRENCE_CLOSURE_REV1.md':'Four new occurrence roles use existing allocator; local reserve/signal text identities remain separate. Hidden authored items retain world bindings; unavailable requested observations still allocate observations. One safe shared experience reservation precedes freeze. Empty selectors allocate but empty recall/acquisition does not; unavailable actual consequence/attribution differs from absence. Recollection per winner/purpose; no fresh transport/provenance IDs. GOA-A30 and GOA-B17 and RP/AP/GAP are referenced component claims, not freshly executed here; original allocation receipts remain the next review gate.',
}
for i in [1,2]:
 notes[f'GA_COMPOSED_LOGICAL_TOPOLOGY_REV{i}.json']=('66 templates including independent baseline; ' if i==1 else '67 templates; sole added stage is physical replenishment110 with exact composite leaf, no children, cognitive projection, learning route or fresh occurrence; ')+notes['GA_COMPOSED_LOGICAL_TOPOLOGY_REV1.md']
 notes[f'GA_LOGICAL_TOPOLOGY_REVIEW_REV{i}.json']=f'{10 if i==1 else 12} original symbolic faults reproduced. No future-time execution, join-once enforcement or B0 runtime proof.'
for i in [1,2,3]:
 notes[f'GA_OUTPUT_DECLARATIONS_REV{i}.json']=('Superseded unregistered descriptive identity names; eight replacements in REV2 are inherited names, not newly allocated families. Exact old builder SHA recovered by reversing those substitutions and destination. ' if i==1 else 'Inherited identity names corrected; no numeric allocation. ')+('REV3 adds only physical replenishment output, borrowed identity/no allocator. ' if i==3 else '')+notes['GA_OUTPUT_AND_OCCURRENCE_CLOSURE_REV1.md']
for i in [1,2]:notes[f'GA_OUTPUT_DECLARATIONS_REVIEW_REV{i}.json']=f'Reviewer revision{i} consumes declaration revision{i+1}, not same-number draft. {13 if i==1 else 14} original static faults reproduced. Actual predicates/slot equality/rollback remain separate gates.'
replay=load(O/'replay.json');assert sum(len(r['faults']) for r in replay['rows'])==49
archive=replay['recoveredBuilder'];assert ref(archive['path'])['sha256']==archive['sha256']
for row in replay['rows']:
 for k in ['script','output']:assert ref(row[k]['path'])==row[k]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};prior=load(P/'campaign3-history-source-roles-rev152/index.json');assigned={r['path'] for r in prior['roleAssignments']}
top=[load(P/f'GA_COMPOSED_LOGICAL_TOPOLOGY_REV{i}.json') for i in [1,2]]
assert top[1]['stages'][:-1]==top[0]['stages'] and top[1]['conditionalEdges']==top[0]['conditionalEdges']
assert [len(t['stages']) for t in top]==[66,67]
out=[load(P/f'GA_OUTPUT_DECLARATIONS_REV{i}.json') for i in [1,2,3]]
assert out[2]['stages'][:-1]==out[1]['stages']
changes=[]
def diff(a,b,p=''):
 if a==b:return
 if isinstance(a,dict) and isinstance(b,dict):
  assert set(a)==set(b)
  for k in a:diff(a[k],b[k],p+'/'+k)
 elif isinstance(a,list) and isinstance(b,list):
  assert len(a)==len(b)
  for i,(x,y) in enumerate(zip(a,b)):diff(x,y,p+'/'+str(i))
 else:changes.append(dict(pointer=p,before=a,after=b))
diff(out[0]['stages'],out[1]['stages']);assert len(changes)==16
for c in changes:
 s=c['after']
 for new,old in replay['names'].items():
  # Names here are whole identifiers or occur within a descriptive sentence.
  import re
  s=re.sub(r'\b'+new+r'\b',old,s)
 assert s==c['before']
roles=[];strings={};bindings=[]
for n in names:
 p=(P/n).as_posix();assert ref(p)['sha256']==entries[p]['sha256']
 if p in assigned:
  assert n in ['GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json','GA_OUTPUT_DECLARATIONS_REV3.json']
  continue
 judgment=notes[n]+' '+common
 roles.append(dict(**ref(p),role='SYMBOLIC TOPOLOGY AND OUTPUT HISTORY; EXECUTION GATES KEPT SEPARATE',judgment=judgment,acceptanceChain=[ref(O/'replay.json')]))
 if p.endswith('.json'):
  v=load(p)
  for ptr,s in walk(v):strings[p,ptr]=s
  for f in v['sources']:
   actual=ref(f['path'])
   if actual!=f:
    assert n=='GA_OUTPUT_DECLARATIONS_REV1.json' and f['path']==archive['originalPath'] and f['sha256']==archive['sha256'];actual=ref(archive['path'])
   bindings.append(dict(source=p,original=f,resolved=actual))
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  # Descriptive predicates, ownership and routing prose are substantive, even within JSON.
  narrative=u['source'].endswith('.md') or any(k in ptr.split('/') for k in ['status','limits','condition','rules','branch','allocation','projection','readGate','batch','contentGate','futureGate','projectionOutput','joinReadiness','terminal','definitionPurpose','authority','subject','gate','allocationPolicy','validationOrder'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='SYMBOLIC GA TOPOLOGY/OUTPUT HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=bindings,identityNameCorrections=changes,preservedArtifacts=[dict(**ref(archive['path']),method=archive['method'])],limits=[common,'Allocation witness receipts, replenishment production/failure history, accessors and registration carriers remain next. No obligation closure.'])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),reviewedSources=len(names),previouslyAssignedSupport=2,originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=0,freshSymbolicFaultExecutions=49,recoveredArtifacts=1,checker=ref(__file__),developmentFinding='First unpersisted checker rejected two already assigned successor packets; retain their existing roles and use them as support rather than recounting them.')
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
