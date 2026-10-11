"""Reconcile stored component fault controls without rerunning historical writers."""
from pathlib import Path
import json, hashlib, collections
from fractions import Fraction as F
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-partial-intake-lineage-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev283/index.json'; ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']}
details=[
'First two of20 original partial clauses audited. Tolerance branch qualifies bounded disjunction, not sensitization or universal adaptation. Interoceptive uncertainty still requires a character-side quality/consumer comparison.',
'Motive audit distinguishes general importance from current urgency. One motive/multiple actions gains bounded substitution evidence with separate native corroboration, not option discovery or native substitution admission.',
'Memory audit leaves vividness and actual affect-biased retrieval partial; controlled episode/category consolidation qualifies without general fusion or downstream reuse. Duplicated prior citations/RO references remain occurrences, not independent corroboration.',
'Belief audit leaves uncertainty/accuracy and hidden-cause diagnosis partial. Repeated admitted prediction discrepancy is bounded component evidence, not a general surprise law or new native source.',
'Affect audit qualifies positive threat with chosen continuation under competing commitment, not literal locomotor flight. Salience/retrieval needs an actual consumer; independent factors alone do not prove a named scalar reduction insufficient.',
'Identity/agency audit requires shared cross-context meaning, enacted coercion, and cross-episode interference expectation. Eligibility filtering alone is not enacted coercion, and no intended action is rewritten by observed failure.',
'All20 starting clauses audited, five bounded and15 partial, not final campaign coverage. Scheduled repetition is not routine; instructions are not adopted goals; skill practice is not habitual access; detail expiry is not personal loss. Joined biography/retention comparisons remain the next gate. Later exact clause evidence supersedes these pending statuses without widening old fixtures.'
]
notes={f'PARTIAL_COVERAGE_INTAKE_REV{i+1}':d for i,d in enumerate(details)}
auditNames=['BODY','MOTIVE','MEMORY','BELIEF','AFFECT','IDENTITY_AGENCY','LONGITUDINAL']
chain=[ref(P/f'CAMPAIGN3_{n}_PARTIAL_COVERAGE_AUDIT.md') for n in auditNames]+[ref(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json'),ref(P/'CAMPAIGN3_FINAL_HISTORY_GATE.md')]

def walk(v,p=''):
 if isinstance(v,str): yield p,v
 elif isinstance(v,dict):
  for k,x in v.items(): yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v): yield from walk(x,p+'/'+str(i))
def kind(q): return 'BACKING' if q.startswith(('/sources/','/sourceFingerprints/','/baseline/','/draft/','/artifacts/')) or q.endswith(('/from','/to')) else 'NARRATIVE'
sources=[]; leaves=[]; bindings=[]; gaps=[]; preserved=[]; back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}; faults=[]
for name,n in notes.items():
 p=(P/(name+'.json')).as_posix(); v=load(p)
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 assert all(f['detected'] is True for f in v.get('faults',[]))
 faults.append(dict(source=p,count=len(v.get('faults',[])),controls=v.get('faults',[])))
 sources.append(dict(**ref(p),role='PARTIAL COVERAGE AUDIT INTAKE; SUPERSEDED ONLY BY SCOPED LATER EVIDENCE',judgment=n,acceptanceChain=chain))
 leaves.extend(dict(source=p,pointer=q,text=x,role=kind(q)) for q,x in walk(v))
 for x in [dict(path=(P/v['predecessor']).as_posix(),sha256=v['predecessorSha256'])]:
  actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
  if actual:
   assert ref(actual)['sha256']==x['sha256']
   bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
   if actual not in entries and actual not in back:
    preserved.append(dict(**ref(actual),method='EXISTING EXACT COMPONENT SOURCE; NO NEW COPY')); back.add(actual)
  else: gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not found in current path or predecessor indexed archives. Stored detection remains historical testimony; no fresh source-exact reproducibility claim. Later public qualification is independently scoped, not a replacement hash.'))
assert [f['count'] for f in faults]==[0]*7
versions=[load(P/f'PARTIAL_COVERAGE_INTAKE_REV{i}.json') for i in range(1,8)]
counts=[];deltas=[]
for i,v in enumerate(versions):
 cs=v['clauses'];assert len(cs)==20 and len({c['id'] for c in cs})==20
 count=collections.Counter(c['disposition'] for c in cs);counts.append(dict(count))
 assert sum(c['disposition']!='NOT YET AUDITED' for c in cs)==[2,4,7,10,13,16,20][i]
 for c in cs:
  assert all(Path(e).is_file() for e in c['priorEvidence'])
 if i:
  old=versions[i-1]['clauses'];changes=[]
  for a,b in zip(old,cs):
   assert all(a[k]==b[k] for k in ['id','text','priorEvidence','obligations'])
   if a!=b:
    assert a['disposition']=='NOT YET AUDITED';changes.append(dict(id=b['id'],before=a['disposition'],after=b['disposition'],next=b['next']))
  deltas.append(dict(revision=i+1,changes=changes))
assert counts[-1]=={'PARTIAL':15,'QUALIFIED BOUNDED':5}
later=load(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json')
# Later snapshot is separately fingerprinted authority; no new scientific promotion here.
assert later['disposition']=='NOT EXIT-READY'
rows=[]; selected={s['path'] for s in sources}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in selected: continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['location']['pointer'])))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named files and REV283 indexed backing hashes only; not a claim of global absence.',gaps=gaps))
save('review.json',dict(status='PARTIAL COVERAGE INTAKE LINEAGE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,faultControls=faults,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Stored mutation detection was inspected, not freshly rerun.','Component controls, serious model comparisons and native public qualification remain separate.','Exact missing bytes remain explicit; no model, law, allocation, verdict, corpus or obligation status changes. Independent adequacy remains open.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS PARTIAL INTAKE LINEAGE ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),distinctBindingPairs=len({(x['original']['path'],x['original']['sha256']) for x in bindings+gaps}),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),revisions=7,clauseOccurrences=140,dispositionCounts=counts,revisionDeltas=deltas,exactBindings=len(bindings),unresolvedBindings=len(gaps),newlyIndexedExistingSources=len(preserved),review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
