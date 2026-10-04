"""Ledger foundation claims and exact post-census Values delta; not all-ledger closure."""
from pathlib import Path
import json,hashlib,re,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-verdict-spine-rev1';O.mkdir(exist_ok=True)
SOURCE='docs/planning/VERDICT_LEDGER.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a=1,z=None):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);z=z or len(ls)
 return dict(path=str(p).replace('\\','/'),sha256=sha(p),startLine=a,endLine=z,text=''.join(ls[a-1:z]))
old=(B/'sources'/SOURCE).read_bytes();current=Path(SOURCE).read_bytes();assert current.startswith(old)
pattern=rb'^## `?(VER-[A-Z0-9-]+)'
before=[x.decode() for x in re.findall(pattern,old,re.M)];after=[x.decode() for x in re.findall(pattern,current,re.M)]
assert len(before)==106 and len(after)==108 and after[:106]==before
assert after[106:]==['VER-C3-VALUES-001','VER-C3-VALUES-PUBLIC-001']
specs=[
 (1,'Ledger policy','Findings require scoped contracts, domain, comparisons, evidence and reopen conditions; historical sources are neither automatically governing nor retracted.','An entry is a claim to assess, not automatic acceptance of every citation or whole source.'),
 (28,'VER-C0-RNG-001','Retains addressed random causality, replay, purpose separation and explicit role-compatible coupling in bounded spans; structured SHA256 changes representation.','Ideal-candidate quantified fallback bias is not exact unbiasedness; psychological dice and arbitrary addresses remain outside.'),
 (41,'VER-C0-TIME-001','Retains exact bigint rational and linear anchored progression with remainder, partition invariance and checked bounds.','Nonlinear dynamics, changed time units/profiles and new bounds reopen; no universal continuous biological law.'),
 (54,'VER-C0-ORD-001','Derived global ordering, whole-instant transaction, quiescent save and registry-resolved handlers.','Later multi-character/regulation phases and wrapper publication are distinct gates; generic scheduler proof does not qualify all wrappers.'),
 (67,'VER-C0-STATE-TRACE-001','Derived sole ownership, capability reads, canonical patches and finalized committed provenance; aborted staged diagnostics distinct.','Psychological owners and privacy-safe projections need their own seams; omniscient trace is not character evidence.'),
 (80,'VER-C0-CONTENT-001','Derived governed manifests, role validation, exact commitments and presentation separation.','Each new semantic kind/receiving seam needs its domain; structural commitment does not authorize authored interpretation or arbitrary callback semantics.'),
 (93,'VER-C1-OBS-001','Derived bounded scalar permitted evidence: known saturation yields interval, missing remains missing, hidden Overflow/provenance excluded.','Identity tokens only in identity-establishing channels. Later SEM capabilities require separate gates; old pending SEM runtime prose is historical, qualified by formal391..408 review rather than presumed here.'),
 (106,'Observation scope clarification','Opening SEM narrows the general-token claim without retracting bounded measurement or reopening MATH006.','Thin measurement envelope is not general event representation.')]
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 1<=u['location']['startLine']<=107:continue
  assert u['location']['endLine']<=107
  _,name,judgment,reopen=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  e=excerpt(B/'sources'/SOURCE,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
  rows.append(dict(occurrenceId=u['id'],source=e,claim=name,judgment=judgment,reopen=reopen,obligations=['RO-C3-020','RO-C3-021']))
lines=old.decode('utf-8-sig').splitlines()
assert {n for r in rows for n in range(r['source']['startLine'],r['source']['endLine']+1)}=={n for n in range(1,108) if lines[n-1].strip()}
# Revalidate the artifact chains without rerunning simulations or overwriting receipts.
receipts=[]
for path in [P/'values-matrix-rev2/check.json',P/'values-public-matrix-rev1/check.json']:
 v=load(path)
 for a in v['artifacts']:assert sha(a['path'])==a['sha256'],a['path']
 receipts.append(dict(path=path.as_posix(),sha256=sha(path),artifactReferences=len(v['artifacts']),models=v['models'],runs=v['runs'],prefixes=v['prefixes']))
assert receipts[0]['prefixes']==1248 and receipts[1]['prefixes']==3040
r=dict(status='HQ011 LEDGER FOUNDATION AND VALUES DELTA REVIEWED; WIDER CLAIM SPINE OPEN',rows=rows,
 delta=dict(frozenSha256=sha(B/'sources'/SOURCE),currentSha256=sha(SOURCE),unchangedPrefixBytes=len(old),frozenNamedVerdicts=106,currentNamedVerdicts=108,addedVerdicts=after[106:],appendedText=current[len(old):].decode('utf-8'),postCutoff=True),
 addedClaims=[dict(verdict=after[106],judgment='Bounded component durable preference separate from Need/goal; accumulation, Latest, NoConsolidation and Stored/Refold compared.3/8 differing choices and5/8 equal preserved.',limits='No physical feedback/native admission in component. NeedOnly equals ValuesOnly at demand1; Joint overlap adds nothing; no irreducible Value law or arbitrary history compression.'),
 dict(verdict=after[107],judgment='Bounded native source40, prior reasons52/choice60, sole update140; four models match component at actual instants; Save132 and publication controls qualified.',limits='One successor per prefix, not full tails. Native contexts59..64 differ in time addresses, not controlled same-instant sampled comparisons. No physical feedback, learned categories, appraisal consumer, age or general provenance claim.')],
 evidence=[excerpt(p) for p in ['docs/formal/DETERMINISTIC_SUBSTRATE.md','docs/formal/OBSERVATION_AND_EVIDENCE.md','docs/planning/CAMPAIGN3_HISTORY_FOUNDATION_DECISIONS_CHECKPOINT.md','docs/planning/CAMPAIGN3_VALUES_QUALIFICATION.md','docs/planning/CAMPAIGN3_VALUES_PUBLIC_QUALIFICATION.md']],
 receiptChecks=receipts,wrapper=dict(path='docs/planning/VALUES_WRAPPER_EXTENSION_REV1.json',sha256=sha(P/'VALUES_WRAPPER_EXTENSION_REV1.json'),producers=55,factories=58),
 limits=['No fresh behavioral or reference tests/build; existing Values matrices and current wrapper checker separately revalidated read-only.',
 'Only ledger1..107 plus post-cutoff Values tail accepted for these scoped claims. Remaining named verdicts and unnamed qualifications still require their claim reviews.',
 'AuditREV111 remains106-verdict historical snapshot; explicit ledger delta does not promote it to current acceptance or close HQ011.'],obligations=['RO-C3-007','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'],
 nextGate='Ledger108 onward: unnamed Campaign2 qualifications, then early Campaign3 verdicts; preserve distinction between named-verdict counts and all qualification headings.')
def validate(v):
 assert v==r
 for e in [x['source'] for x in v['rows']]+v['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
validate(r);faults=[]
for mode in ['omit-occurrence','rewrite-frozen-prefix','native-as-same-instant','erase-equalities','promote-audit-snapshot']:
 v=copy.deepcopy(r)
 if mode=='omit-occurrence':v['rows'].pop()
 elif mode=='rewrite-frozen-prefix':v['delta']['unchangedPrefixBytes']=0
 elif mode=='native-as-same-instant':v['addedClaims'][1]['limits']='All choices use same instant'
 elif mode=='erase-equalities':v['addedClaims'][0]['judgment']='Every sampled choice differs'
 else:v['limits']=[]
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',r)
c=dict(status=r['status'],originalOccurrences=len(rows),claimGroups=len(specs),addedPostCutoffVerdicts=2,indexedWholeOccurrenceLinks=521+len(rows),artifactReferencesVerified=sum(x['artifactReferences'] for x in receipts),freshBehavioralTests=0,faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
