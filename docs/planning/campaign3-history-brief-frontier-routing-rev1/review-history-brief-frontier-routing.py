"""Reconcile historical Brief frontier routing without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-brief-frontier-routing-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev301/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
name='CAMPAIGN3_BRIEF_FRONTIER_INTAKE_REV1.json';v=load(P/name)
prior=load(P/'CAMPAIGN3_EXIT_AUDIT_REV9.json');later=load(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json')
clauses=[c for f in v['families'] for c in f['clauses']]
old={c['id']:c for f in prior['brief']['families'] for c in f['clauses']}
new={c['id']:c for f in later['brief']['families'] for c in f['clauses']}
assert len(clauses)==len(old)==len(new)==132 and len(v['families'])==15
assert {c['id'] for c in clauses}==old.keys()==new.keys()
assert v['counts']==dict(families=15,clauses=132,statuses={'QUALIFIED BOUNDED':45,'PARTIAL':39,'BLOCKED':48})
assert dict(collections.Counter(c['status'] for c in clauses))==v['counts']['statuses']
assert len(v['packageOrder'])==len(set(v['packageOrder']))==13
assert v['selectedFirstSlice']=='docs/planning/AGENCY_INTERFERENCE_READINESS.md'
for f in v['families']:
 g=next(x for x in prior['brief']['families'] if x['family']==f['family'])
 assert {k:x for k,x in f.items() if k!='clauses'}=={k:x for k,x in g.items() if k!='clauses'}
for c in clauses:
 assert {k:x for k,x in c.items() if k not in ['primaryPackage','routing']}==old[c['id']]
 assert c['primaryPackage'] in v['packageOrder']
 assert c['routing']==('PRESERVE' if c['status']=='QUALIFIED BOUNDED' else 'RESEARCH')
 assert c['text']==new[c['id']]['text'] and new[c['id']]['status']=='QUALIFIED BOUNDED'
 assert all(Path(p).exists() for p in c['evidence']+new[c['id']]['evidence'])
notes={(P/name).as_posix():'Dated Stage-A prioritization preserves all132 exact REV9 clauses across15 families and maps each to one of13 work packages:45 PRESERVE,87 RESEARCH (39 partial/48 blocked). Family rationales, source quotations, clause text/status/evidence/obligations are unchanged from REV9. Risk-based agency-before-goals order is not Campaign4 reduction ranking, automatic implementation admission or a closed family. Full skill coverage stays a preservation comparator, not a generic-skill law. REV111 retains every clause text and records132 bounded claims; its later evidence references are explicit document-level joins, not newly executed or transitively accepted proof. Original unknown/partial distinctions are preserved with later scope rather than cleared by routing.'}
chain=[ref(P/n) for n in ['CAMPAIGN3_BRIEF_FRONTIER_INTAKE.md','AGENCY_INTERFERENCE_READINESS.md','CAMPAIGN3_EXIT_AUDIT_REV9.json','CAMPAIGN3_EXIT_AUDIT_REV111.json','CAMPAIGN3_FINAL_HISTORY_GATE.md','campaign3-history-frontier-checkpoints-rev1/review.json','campaign3-history-exit-consolidation-rev2/review.json']]
crosswalk=[dict(id=c['id'],text=c['text'],historicalStatus=c['status'],package=c['primaryPackage'],routing=c['routing'],historicalEvidence=c['evidence'],historicalObligations=c['obligations'],laterStatus=new[c['id']]['status'],laterRationale=new[c['id']]['rationale'],laterEvidence=[ref(p) for p in new[c['id']]['evidence']],laterObligations=new[c['id']]['obligations'],disposition='Exact documentation join only; preserve bounded rationale and linked prior source-role review. Independent scientific adequacy is not proved by the status label.') for c in clauses]

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
def kind(p,q):return 'NARRATIVE' if q=='/disposition' or q.endswith(('/rationale','/status','/routing')) else 'BACKING'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT FRONTIER ROUTING SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Routing receipt remains dated planning evidence; no later source bytes substituted for a missing original. Independent adequacy remains separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='SUPERSEDED HABIT EXPERIMENT COHORT; PARTIAL EXECUTION PRESERVED',judgment=n,acceptanceChain=chain))
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

save('crosswalk.json',dict(status='DOCUMENT-LEVEL CLAUSE JOIN; SCIENTIFIC ADEQUACY REMAINS OPEN',predecessor=ref(P/'CAMPAIGN3_EXIT_AUDIT_REV9.json'),successor=ref(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json'),rows=crosswalk))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV301 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='HISTORICAL BRIEF FRONTIER ROUTING RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['All132 historical clauses and family rationales match REV9; mapping is prioritization, not execution.','Later132 bounded status claims are joined at document level only; full-source adequacy and joint family requirements remain open.','No corpus, runtime, comparator or obligation status changed.'],crosswalk=ref(O/'crosswalk.json'),obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS FRONTIER ROUTING ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),clauses=132,families=15,packages=13,preserveClauses=45,researchClauses=87,laterBoundedClaims=132,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
