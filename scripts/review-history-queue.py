from pathlib import Path
import json,hashlib,copy,sys
p=Path('docs/planning');b=p/'campaign3-history-universe-rev1';out=p/'campaign3-history-queue-rev1'
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def load(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def write(f,x):f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ledger='docs/planning/REFERENCE_MECHANISM_LEDGER.md'
def para(path,phrase):
 f=b/'sources'/path;ls=f.read_bytes().decode('utf-8-sig').splitlines(keepends=True);hits=[i for i,l in enumerate(ls) if phrase in l];assert len(hits)==1,(path,phrase,hits)
 a=z=hits[0]
 while a>0 and ls[a-1].strip():a-=1
 while z+1<len(ls) and ls[z+1].strip():z+=1
 return {'source':path,'sourceSha256':sha(f),'location':{'startLine':a+1,'endLine':z+1},'text':''.join(ls[a:z+1])}
def doc(n):return 'docs/planning/'+n+'.md'
spec={
303:('HISTORICAL ROUTING SUPERSEDED IN BOUNDED GA','Public GA closes the planned bounded attention work; former unimplemented/proposed wording is dated. Comparators and broader attention limits remain.',[(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'**Next gate:**')]),
310:('BOUNDED BODY SUCCESSOR; CONTROL RETAINED','BODY ownership compares mediated pressure, sensed meter and authored reference. REG is not invalidated and universal physiology is not inferred.',[(doc('CAMPAIGN3_BODY_OWNERSHIP_QUALIFICATION'),'| MeterBehindSensor |')]),
314:('PRESERVED EARLY RESULT; LATER BIO WITNESS','Early four-seed result remains its own evidence. Later BIO qualifies early-only coupling and sustained contradiction in a declared component scope; broader biography remains conditional.',[(doc('CAMPAIGN3_BIO_QUALIFICATION'),'Six component models share exact content')]),
320:('UI/PROJECTION CLAIMS REQUIRE SEPARATE EVIDENCE','Inspection UI obligation remains unverified by this batch. Later safe character projections do not themselves prove interactive UI parity.',[]),
323:('HISTORICAL WORK ORDER; SCIENTIFIC LIMITS RETAINED','First-frontier sequence is historical. Later biology qualifies an integrated bounded source; stored-meter and cross-family law limits survive. No current UI exit waiver is inferred from the old entry statement.',[(doc('CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION'),'dispositions in the work order. CTL001 and CTL008')]),
546:('BOUNDED LEARN RESOLUTION; PRECISION LIMIT RETAINED','Four lower-bound cases qualified; full point-like accepted-bound precision remains an approximation. Old other-RO018-active routing cannot serve as current status without later corpus dispositions.',[(doc('CAMPAIGN3_LEARN_QUALIFICATION'),'the supplementary six-bound run ends')]),
561:('BOUNDED EPI RESOLUTION; CONSUMER LIMIT RETAINED','Actual finite receiving roster and leak controls support the scoped resolution; fixed roles/attention are controls and extra consumers reopen it.',[(doc('CAMPAIGN3_EPI_QUALIFICATION'),'The finite consumer roster is sample900'),(doc('CAMPAIGN3_EPI_QUALIFICATION'),'Safe, PotentialLeak and OverflowLeak')]),
575:('BOUNDED REASON RESOLUTION; BROADER LIMITS RETAINED','Source roles/grouping and controls survive. Old whole-BIO-open routing has later bounded evidence; neither overlap law, direction identity nor calibration becomes settled.',[(doc('CAMPAIGN3_REASON_QUALIFICATION'),'Aggregate weighted Jaccard remains a candidate:'),(doc('CAMPAIGN3_BIO_QUALIFICATION'),'After four positive contributions')])
}
qs=[
 ('Original satisfier/capacity/avoidance chains','Inspect reference/src/test/phase2Experiments.test.ts, expectation.test.ts and phase2_5Saturation.test.ts with their experiment implementations.','Bind exact interventions/assertions and original log corrections; distinguish equal-effect/different-capacity from EPI hidden-potential equivalence. Rerun only if needed for claimed execution.',['RO-C3-010','RO-C3-020'],['EXP-001','EXP-002','EXP-005']),
 ('Extra trait-bonus mutant','Inspect identity/decision source and preserved historical tests for an actual injected bonus control.','Either locate authenticated executed mutant or retain the proof gap; derived-label tests do not substitute. No new law required.',['RO-C3-009','RO-C3-020'],['RET-012']),
 ('Value formation/revision provenance','Trace CTL007 into original briefs, research log and executable fixtures.','Classify proposed versus executed tests with evidence; do not label goals or reward estimates as values to clear the row.',['RO-C3-019','RO-C3-020'],['CTL-007','P3-012']),
 ('Option-list/additive-scoring comparison','Trace CTL009 original implementation and later option-construction receiving comparisons.','Identify matched evidence or retain bounded comparison debt; REASON key grouping alone is insufficient.',['RO-C3-019','RO-C3-020'],['CTL-009']),
 ('Inspection UI scope','Inspect SUB013/TRC003 requirements and actual existing UI/trace affordances.','Separate required exit inspection from optional historic UI parity under governing authorities; no automatic UI rebuild or waived gate.',['RO-C3-019','RO-C3-021'],['SUB-013']),
 ('Linear algebra port/tool scope','Inspect preserved rational linear-algebra tests and admitted active consumers.','Record oracle/control versus active primitive disposition, pivot/singularity domain and necessary proof; do not invent a consumer.',['RO-C3-020','RO-C3-021'],['SUB-006']),
 ('Attribution regression chain','Trace proportional participant and single-participant equivalence tests and exact later owners.','Preserve nonparticipant limitation; distinguish current explanation from historical memory credit.',['RO-C3-020'],['MEC-021']),
 ('Bundled P3 phenomena','Map individual relief/extinction/generalization, jealousy/timing, value/obsession/multiplicity questions to exact later witnesses.','Every subclaim has scoped evidence or owned conditional debt; absence of a mapping is not proof no implementation exists.',['RO-C3-011','RO-C3-014','RO-C3-019','RO-C3-020'],['P3-005','P3-006','P3-008','P3-010','P3-011','P3-012']),
 ('External provenance','Continue authenticated source recovery for formula pin and missing legacy log; retain current comparison copy separately.','Resolve or explicitly disposition five citation issues under final-history requirements, without claiming current bytes equal historical bytes.',['RO-C3-021'],[]),
 ('Remaining ledger amendments','Review unhandled source-located paragraphs and their cited later evidence.','Preserve material limitations, separate dated routing and record exact supersession; table-ID coverage is not prose completeness.',['RO-C3-020','RO-C3-021'],[]),
 ('Canonical universe and occurrence adequacy','Review source acceptance/supersession and remaining marked/unmarked occurrences independently of registry completeness.','Explicit occurrence accounting, justified exclusions and independent scientific adequacy; no regex-only all-clear.',['RO-C3-021'],[]),
 ('Freshness and final exit gates','Reconcile post-cutoff additions/changes; independently review21 corpus members and15 families/native admission scopes.','No unexplained authoritative delta; required corpus/scaffold evidence and all material findings accounted. Current bounded clause counts alone cannot pass.',['RO-C3-019','RO-C3-021'],[])
]
def validate(r):
 assert len(r['amendments'])==12 and len({x['occurrenceId'] for x in r['amendments']})==12
 for x in r['amendments']:
  assert x['rationale'] and x['obligations']
  for a in [x]+x['evidence']:
   f=b/'sources'/a['source'];ls=f.read_bytes().decode('utf-8-sig').splitlines(keepends=True);v=a['location']
   assert sha(f)==a['sourceSha256'] and a['text']==''.join(ls[v['startLine']-1:v['endLine']])
 assert len(r['queue'])==12 and len({x['id'] for x in r['queue']})==12
 assert all(x['nextAction'] and x['completionEvidence'] and x['status']=='OPEN AUDIT WORK' for x in r['queue'])
 assert not r['conditionalDebtBecomesImplementationOrder'] and not r['historyComplete']
if '--verify' not in sys.argv:
 assert not (out/'review.json').exists();out.mkdir(exist_ok=True);units=[]
 for line in (b/'units.jsonl').open(encoding='utf-8'):
  u=json.loads(line)
  if u['source']==ledger and (300<=u['location']['startLine']<=330 or 543<=u['location']['startLine']<=584):units.append(u)
 rows=[]
 for u in units:
  n=u['location']['startLine']
  if n in spec:d,why,es=spec[n]
  else:
   assert u['text'].lstrip().startswith('#');d='REVIEWED HEADING';why='Section label; findings reviewed in its separate source-located paragraphs.';es=[]
  rows.append({**{k:u[k] for k in ['source','sourceSha256','location','text']},'occurrenceId':u['id'],'disposition':d,'rationale':why,'obligations':['RO-C3-019','RO-C3-020','RO-C3-021'],'evidence':[para(*e) for e in es]})
 queue=[{'id':f'HQ-{i:03}','title':t,'nextAction':a,'completionEvidence':c,'obligations':ids,'ledgerIds':refs,'status':'OPEN AUDIT WORK'} for i,(t,a,c,ids,refs) in enumerate(qs,1)]
 r={'status':'12 AUDIT QUEUE ITEMS;12 AMENDMENT PARAGRAPHS REVIEWED','manifestSha256':sha(b/'manifest.json'),'stableIdIndexSha256':sha(p/'campaign3-history-mechanisms-rev1/stable-id-index.json'),'amendments':rows,'queue':queue,'conditionalDebtBecomesImplementationOrder':False,'historyComplete':False,'limits':['Queue consolidation is a review plan, not12 new scientific obligations or implementation authorizations.','Four headings/eight substantive paragraphs reviewed; original occurrences unchanged.','Remaining non-table prose and wider inventory remain unreviewed; no corpus/exit approval.']}
 validate(r);write(out/'review.json',r)
else:r=load(out/'review.json');validate(r)
faults=[]
for mode in ['missing-amendment','altered-source','empty-completion','false-completion']:
 q=copy.deepcopy(r)
 if mode=='missing-amendment':q['amendments'].pop()
 elif mode=='altered-source':q['amendments'][0]['text']='wrong'
 elif mode=='empty-completion':q['queue'][0]['completionEvidence']=''
 else:q['historyComplete']=True
 try:validate(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c={'status':'PASS QUEUE AND SOURCE ACCOUNTING','amendments':12,'queueItems':12,'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==c
else:write(f,c)
print(json.dumps(c))
