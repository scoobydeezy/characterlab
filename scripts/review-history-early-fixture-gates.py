"""Reconcile early conformance gates and accepted fixture amendment without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-early-fixture-gates-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev302/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
notes={
'docs/formal/CONFORMANCE_VECTORS.md':'Accepted Campaign0 vector requirements and dated execution claims:39 distinct vector rows preserve complete inspectable inputs/expected structures, independent encoding/hash/arithmetic oracles, named negative failures, addressed randomness and research/execution identity separation. Test-only candidate injection is not runtime authority. Actual versus permitted reads, unique ownership versus one-authority-per-leaf, exact patches, terminal whole-instant rollback, quiescence and full continuation remain distinct. Earlier ORD003/004 pending prose is historical and is superseded by the same document final gate and OPEN_DECISIONS closure, not an active owner ruling. Candidate version suffixes remain immutable. Dated PASS assertions do not independently establish present whole-runtime or later public-wrapper correctness; source/test review and final adequacy remain separate.',
'docs/formal/CAMPAIGN1_CONFORMANCE_VECTORS.md':'Accepted bounded observation manifest:8 distinct CV-OBS/EPI rows. Exact19/20 baseline plus1/10 versus4/5 potential effect yields common1/20 applied effect and equal admitted evidence despite unequal hidden overflow. Missing observation remains distinct from observed zero and lower/upper/point bounds. Visible-slot closure, canonical slot priority, invalid-input rollback, thin experience and same-instant consumer equality constrain five forbidden comparators. MATH006 closure is bounded to registered exact known-bound scalar channels; token projection does not establish general event binding, referent recognition, noisy sensors, uncertain bounds or learning. SEM001 vector family and later admission remain separate. Historical test PASS labels are not fresh test executions.',
'docs/formal/PHEN_ADAPT_FIXTURE_AMENDMENT.md':'Accepted correct-forward fixture amendment explicitly resolves the one-rule prose versus four-rule frozen model conflict without changing N-rule grammar, runtime, allocations or frozen model. Both timelines use the same nonempty rule set; each rule owns one exact path; independently specified changed subsets are empty at count0 and allfour paths at count1. Duplicate targets reject even for no-op results. Control3 leaf-family complement is non-discriminating here; exact-path3a, wrong-key7g/7g-prime, ownership and collision controls carry isolation. D-only diagnostic read mediates5 versus51/10 through337/342/retention/352; state dependency is not a fabricated scheduler-parent edge. Three historical corpus commitments remain distinct; accepted0.27/1.11 is dated, not current0.29. Prior parent/manifest read-only review supplies bounded corroboration; no new behavioral run, general ADAPT/factory/VAL, PHEN-MEM or campaign completion claim.'}
chain=[ref(p) for p in ['docs/formal/OPEN_DECISIONS.md','docs/planning/campaign3-history-foundation-decisions-rev1/review.json','docs/planning/campaign3-history-adapt-parent-pair-rev1/review.json','docs/planning/campaign3-history-adapt-parent-pair-rev1/stored-check.json','docs/planning/PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json','docs/planning/PHEN_ADAPT_FIXTURE_AMENDMENT_AUDIT.json','docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md']]
vectorRows=[]
for p,expected in [('docs/formal/CONFORMANCE_VECTORS.md',39),('docs/formal/CAMPAIGN1_CONFORMANCE_VECTORS.md',8)]:
 rows0=[]
 for line,text in enumerate(Path(p).read_text(encoding='utf-8').splitlines(),1):
  m=re.match(r'^\| `(CV-[A-Z]+-\d+)` \|',text)
  if m:rows0.append(dict(source=p,line=line,vector=m[1],exactRow=text,role='NORMATIVE VECTOR REQUIREMENT / DATED EVIDENCE CLAIM; NO FRESH EXECUTION'))
 assert len(rows0)==len({x['vector'] for x in rows0})==expected
 vectorRows+=rows0
amendment=Path('docs/formal/PHEN_ADAPT_FIXTURE_AMENDMENT.md').read_text(encoding='utf-8')
audit=load(P/'PHEN_ADAPT_FIXTURE_AMENDMENT_AUDIT.json');promotion=load(P/'PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json')
assert all(x in amendment for x in [audit['prior']['digest'],audit['proposed']['digest'],promotion['digest']])
assert len({audit['prior']['digest'],audit['proposed']['digest'],promotion['digest']})==3
assert audit['changes']==[dict(phenomenon='PHEN-ADAPT-001',**{'from':'1.10.0-draft','to':'1.11.0-draft'})]
assert promotion['historicalReviewedDraft']['digest']==audit['proposed']['digest']
assert audit['modelChanges']==audit['runtimeChanges']==audit['allocationChanges']==[]
assert promotion['modelChanges']==promotion['runtimeChanges']==promotion['allocationChanges']==[]
assert all(ref(x['path'])==x for x in promotion['historicalArtifacts'])
assert sum(1 for line in amendment.splitlines() if re.match(r'^\| (Tolerance|Sensitization|Regulatory displacement D|Accumulated load) \|',line))==4

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
 sources.append(dict(**ref(p),role='ACCEPTED BOUNDED GATE OR FIXTURE AUTHORITY; DATED EVIDENCE CLAIMS',judgment=n,acceptanceChain=chain))
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

save('vectors.json',dict(status='47 EXACT NORMATIVE ROWS; NO FRESH RUNTIME EXECUTION',rows=vectorRows,manifestDigests=[audit['prior']['digest'],audit['proposed']['digest'],promotion['digest']],priorReadOnlyProof=ref(P/'campaign3-history-adapt-parent-pair-rev1/stored-check.json')))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV302 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='EARLY FIXTURE GATE AUTHORITY RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Normative vectors and dated acceptance claims reviewed; no runtime/test suite or original writer rerun.','Prior stored-timeline/manifest read-only evidence reverified by exact commitment, not freshly reproduced. Missing full traces/saves/source manifest remain prior report limitations.','No blanket later-runtime adequacy, public wrapper, family or campaign closure.'],vectorInventory=ref(O/'vectors.json'),obligations=['RO-C3-008','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS EARLY FIXTURE AUTHORITY ACCOUNTING',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),normativeVectors=47,amendedRuleTargets=4,historicalCorpusCommitments=3,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
