"""Scoped retirement review using explicitly chosen frozen evidence passages."""
from pathlib import Path
import json,hashlib,copy,sys
p=Path('docs/planning'); b=p/'campaign3-history-universe-rev1'; out=p/'campaign3-history-retirements-rev1'
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def load(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def write(f,x):f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ledger='docs/planning/REFERENCE_MECHANISM_LEDGER.md'
ga='docs/planning/GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md'; epi='docs/planning/CAMPAIGN3_EPI_QUALIFICATION.md'; learn='docs/planning/CAMPAIGN3_LEARN_QUALIFICATION.md'; reason='docs/planning/CAMPAIGN3_REASON_QUALIFICATION.md'; commit='docs/planning/CAMPAIGN3_COMMIT_QUALIFICATION.md'; c2='docs/planning/CAMPAIGN2_COGNITIVE_QUALIFICATION.md'
def excerpt(path,a,z):
 f=b/'sources'/path; lines=f.read_text(encoding='utf-8-sig').splitlines(keepends=True)
 return {'path':path,'sha256':sha(f),'startLine':a,'endLine':z,'text':''.join(lines[a-1:z])}
def paragraph(path,phrase):
 lines=(b/'sources'/path).read_text(encoding='utf-8-sig').splitlines(keepends=True)
 hits=[i for i,line in enumerate(lines) if phrase in line]; assert len(hits)==1,(path,phrase,hits)
 a=z=hits[0]
 while a>0 and lines[a-1].strip():a-=1
 while z+1<len(lines) and lines[z+1].strip():z+=1
 return excerpt(path,a+1,z+1)
# Explicit reviewer-selected comparisons, not automatic mapping from the RO registry.
specs=[
 ('RETIRED DEFAULT; CONTROL RETAINED','Flat concept tagging remains a named negative encoding control; equal winners do not imply equal strengths, graph mass or later recall scores.','Preserve sparse/dense strengths, associations and later cue scores in the finite GA horizon; no universal footprint immunity or deletion of flat control.',['RO-C3-004','RO-C3-020'],[(ga,'retired negative control; a finite score equality')]),
 ('PROHIBITED DEFAULT; EXACT REPLACEMENT PROOF CHAIN OPEN','Authored causal-role/attention flags cannot replace lawful derivation. Controlled test operands are not a claim that roles were inferred.','Before claiming a natural-role port, bind permitted source identity, role derivation and receiving evidence; exact historical replacement vectors still require review.',['RO-C3-007','RO-C3-020'],[(epi,'Fixed base/role/attention1 and Need0')]),
 ('EVIDENCE-AWARE SUCCESSOR; EXACT OLD MUTANT REVIEW OPEN','Compatible lower-bound evidence has zero surprise despite a raw delta/prior distance. Bounded EPI corroborates the semantic correction; it does not itself identify an executed raw-absolute-error mutant.','Keep point/lower/upper semantics and old-prior timing. Future surprise law changes need comparisons; do not declare general necessity from this witness.',['RO-C3-010','RO-C3-020'],[(epi,'With prior1/100 and safe bound1/20')]),
 ('RETIRED POINT-RELABELING; DISTINCT COMPARATOR PRESERVED','Clipped deltas must retain censored evidence meaning. LEARN PointOnly ignores bounds; it is not the historical learner that relabels them as points.','Exact historical naive-point counterexample remains to trace; do not use PointOnly as a false substitute. Preserve saturation/compatible-bound cases and evidence vocabulary.',['RO-C3-010','RO-C3-020'],[(learn,'| Prior1/20,50 then bound1/10')]),
 ('NEGATIVE CONTROL QUALIFIED IN BOUNDED DOMAIN','UnconditionalPrecision manufactures precision from compatible/zero-information bounds; Gated distinguishes those cases. Accepted-bound full precision remains unresolved.','Retain complete learned leaves, unknown versus known0 and repeated-bound receiving point. No calibrated-posterior or universal source-deduplication claim.',['RO-C3-010'],[(learn,'| Prior2/5,50 then bound1/10'),(learn,'the supplementary six-bound run ends')]),
 ('EPISTEMIC PROHIBITION; BOUNDED LEAK CONTROLS','OverflowLeak/PotentialLeak violate observation and later receiving invariance. Hidden truth may remain in research traces, not cognitive reads.','Roster limited to declared EPI consumers; new consumers/projections reopen forbidden-read proof. No deletion of truth-side diagnostics.',['RO-C3-007','RO-C3-010'],[(epi,'Safe, PotentialLeak and OverflowLeak')]),
 ('RETIRED PIPELINE PLACEMENT; PROOF CHAIN PARTIAL','Historical separate identity bounding/flooring is rejected; raw compatible causes consolidate once. Bounded port and substitutions support the replacement, not arbitrary calibration equivalence.','Preserve weak-motive rescue, zero-base exclusion, raw evidence basis and old-vs-new tests; exact historical threshold counterexample remains to trace.',['RO-C3-009','RO-C3-020'],[(ledger,'- MEC-011/012/014/015/016:')]),
 ('RETIRED DEFAULT; EXPLICIT INDEPENDENT-DIE CONTROL','IdentityIndependentDie creates a reason from standing with zero base; Aggregate does not. This witnesses a specific semantic failure, not impossibility of every alternative identity model.','Preserve zero-base and weak-base cases, complete distributions, source roles and acquired standing; broader modifier law remains open.',['RO-C3-009','RO-C3-020'],[(reason,'| Zero base plus acquired standing')]),
 ('RETIRED PAIRWISE DISCOUNT; EXACT COLLECTIVE CONTROL','PairwiseOnly credits collective redundant evidence; Aggregate excludes its final contribution in the tested{1},{2},{1,2} case.','Larger-union subset residuals, arbitrary renaming and new source families remain open; no universal optimality of weighted Jaccard.',['RO-C3-001','RO-C3-020'],[(reason,'| Bases3/4 on{1},2/3 on{2}'),(reason,'Aggregate weighted Jaccard remains a candidate:')]),
 ('ONTOLOGICAL DISTINCTION RETAINED','A concrete commitment has lifecycle identity; recurrence B is separate from retired A. Actual task-lifecycle evidence supports the distinction, not an equivalence test of all possible Need models.','Maintain instance identity and active-only pressure; do not infer physiological ontology or collapse recurring instances. Exact legacy Need-relabeling comparison remains unreviewed.',['RO-C3-008','RO-C3-020'],[(commit,'| No instance |0 reasons|')]),
 ('RETIRED IMMORTAL PRESSURE; LIFECYCLE EVIDENCE','Strong earned standing survives retirement but cannot generate a commitment motive without an active instance.','Preserve retired A versus active recurrence B, current/next phase ordering, and observers who can remain unaware of private retirement.',['RO-C3-009','RO-C3-020'],[(commit,'| No instance |0 reasons|'),(commit,'Registered lifecycle source30')]),
 ('PROHIBITED EXTRA TRAIT BONUS; BOUNDED ADMISSION EVIDENCE','COMMIT admits no authored trait bonus/imported learned identity; actual earned standing is held fixed across probes. No second independent trait bonus is thereby licensed.','Preserve expression/evidence/standing separation and no double counting; exact legacy trait-bonus mutant still requires provenance review.',['RO-C3-009','RO-C3-020'],[(commit,'No authored trait bonus or imported learned state')]),
 ('HISTORICAL MEANING INVARIANT RETAINED','C2 preserves frozen expression/evidence under blocked execution and excludes standing from meaning. Later reinterpretation may coexist with historical meaning, not overwrite it.','Future biography/calibration/query changes must preserve original expression/evidence and distinguish current assessment; no claim of a general immutable-memory topology.',['RO-C3-009','RO-C3-020'],[(c2,'| RI-J..M: meaning, standing and empty identity')]),
 ('PROHIBITED NEW-PORT PATTERN','Copying full truth-side provenance/Applied assumes perfect observation and violates stricter observer boundaries. Safe EPI projection separately exposes researcher truth without character lookup.','New channels/consumers must prove lawful projection; historical perfect-observation control remains inspectable, not default character authority.',['RO-C3-007','RO-C3-010','RO-C3-020'],[(epi,'The finite consumer roster is sample900')])
]
def validate(r):
 assert len(r['items'])==14 and [x['id'] for x in r['items']]==[f'RET-{i:03}' for i in range(1,15)]
 for x in r['items']:
  assert x['id'] in x['source']['text'] and x['scopeAndFutureQueries'] and x['evidence'] and x['obligations']
  for e in [x['source']]+x['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert r['freshExecutions']==0 and not r['newRetirementVerdict']
if '--verify' not in sys.argv:
 assert not out.exists(); out.mkdir()
 rows=[{'id':f'RET-{i:03}','source':excerpt(ledger,197+i,197+i),'disposition':d,'assessment':a,'scopeAndFutureQueries':s,'obligations':ids,'evidence':[paragraph(*e) for e in es]} for i,(d,a,s,ids,es) in enumerate(specs,1)]
 r={'status':'14 RETIREMENT SCOPES REVIEWED; PROOF-CHAIN GAPS EXPLICIT','manifestSha256':sha(b/'manifest.json'),'items':rows,'freshExecutions':0,'newRetirementVerdict':False,'limits':['Source-level dispositions preserve historical retirements; not14 newly proved eliminations.','Exact historical mutant/replacement proof chains remain open where identified.','No new reduction or broad representation equivalence; receiving queries and bounded horizons remain material.','One table subdivided into14 rows; no fabricated count of newly reconciled original paragraphs.','Five source-provenance issues, remaining universe review, freshness and independent scientific adequacy remain open.']}
 validate(r);write(out/'review.json',r)
else:r=load(out/'review.json');validate(r)
faults=[]
for mode in ['omitted-control','changed-evidence','lost-scope','false-retirement']:
 q=copy.deepcopy(r)
 if mode=='omitted-control':q['items'].pop()
 elif mode=='changed-evidence':q['items'][0]['evidence'][0]['text']='wrong'
 elif mode=='lost-scope':q['items'][0]['scopeAndFutureQueries']=''
 else:q['newRetirementVerdict']=True
 try:validate(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
receipt={'status':'PASS ACCOUNTING; SCIENTIFIC PROOF-CHAIN REVIEW STILL OPEN','rows':14,'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==receipt
else:write(f,receipt)
print(json.dumps(receipt))
