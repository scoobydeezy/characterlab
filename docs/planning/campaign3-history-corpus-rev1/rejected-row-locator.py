from pathlib import Path
import json,hashlib,copy,sys
p=Path('docs/planning');b=p/'campaign3-history-universe-rev1';out=p/'campaign3-history-corpus-rev1'
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def load(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def write(f,x):f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ledger='docs/planning/REFERENCE_MECHANISM_LEDGER.md'
def doc(n):return 'docs/planning/'+n+'.md'
def excerpt(path,a,z):
 f=b/'sources'/path;ls=f.read_text(encoding='utf-8-sig').splitlines(keepends=True)
 return {'path':path,'sha256':sha(f),'startLine':a,'endLine':z,'text':''.join(ls[a-1:z])}
def para(path,phrase):
 ls=(b/'sources'/path).read_text(encoding='utf-8-sig').splitlines(keepends=True);hits=[i for i,l in enumerate(ls) if phrase in l];assert len(hits)==1,(path,phrase,hits)
 a=z=hits[0]
 while a>0 and ls[a-1].strip():a-=1
 while z+1<len(ls) and ls[z+1].strip():z+=1
 return excerpt(path,a+1,z+1)
specs=[
 ('PARTIAL CHAIN; SEPARATE LEARNING/CHOICE','BELIEF contradiction resistance establishes retained evidence, not preference enactment alone. Biological learning/choice is a separate bounded witness, not a generic attachment law.','Retain subject-specific acquired evidence, actual preference, one-contradiction response and no authored attachment. Exact original reliable-satisfier fixture chain remains to reconcile.',['RO-C3-010','RO-C3-020'],[(doc('CAMPAIGN3_BELIEF_QUALIFICATION'),'| Contrary evidence |')]),
 ('BOUNDED CENSORING EVIDENCE; GENERAL INFERENCE OPEN','LEARN distinguishes compatible/informative/zero-information bounds. EPI proves hidden-potential noninterference for equal permitted measurements; that pair is not itself equal-effect/different-capacity.','Keep both interventions distinct. Accepted-bound precision remains approximate; exact original capacity-pair linkage not inferred from EPI alone.',['RO-C3-010'],[(doc('CAMPAIGN3_LEARN_QUALIFICATION'),'| Prior2/5,50 then bound1/10'),(doc('CAMPAIGN3_EPI_QUALIFICATION'),'Both runs start before19/20;')]),
 ('BOUNDED ACQUISITION WITNESS','Habit acquisition preserves actual practiced cue response after expectation correction. Learned availability differs from extra motive pressure; old flat-tag edge1/2 is not a universal learning target.','Preserve admitted training, unseen/other-cue controls and actual free response; no general automaticity or compression claim.',['RO-C3-015','RO-C3-020'],[(doc('CAMPAIGN3_HABIT_ACQUISITION_QUALIFICATION'),'| Rewarded observed practice |')]),
 ('HISTORICAL NEGATIVE CONTROL; LATER DISTINCT POSITIVE','Original lack of automatic accessibility transfer and later learned alternative-satisfier use answer different questions. New substitution qualification must not erase the old negative result.','Preserve fixed learned history with availability-only intervention versus independently changed repertoire. Original phase2Experiments fixture chain remains separately owned.',['RO-C3-015','RO-C3-020'],[(doc('CAMPAIGN3_SUBSTITUTION_QUALIFICATION'),'Both primary histories perform four')]),
 ('HISTORICAL AVOIDANCE CHAIN STILL OPEN','Aversive preference and upper-bound preservation require their original paired control. Lower-bound LEARN alone does not discharge this negative-expectation claim.','Trace phase2Experiments avoidance/censored-upper-bound assertions; no fresh execution claimed in this review and no generic inhibition primitive inferred.',['RO-C3-010','RO-C3-020'],[(doc('CAMPAIGN3_LEARN_QUALIFICATION'),'Upper bounds, decay, richer posterior distributions')]),
 ('BOUNDED MEMORY ACCESSIBILITY WITNESSES','GA compares actual retrieval reinforcement, decay, canonical ties and finite topK/source controls.','Preserve whole scores and unselected histories, not only winning items; broadened horizons/capacity/queries reopen.',['RO-C3-005','RO-C3-006','RO-C3-007'],[(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'episode formed at 6 has base accessibility')]),
 ('BOUNDED SALIENCE COMPOSITION','GA admits distinct permission/selection/strength and role controls; EPI supplies evidence-aware surprise. Fixed controlled operands are not natural role inference.','Keep same-object role, attention, Need relevance, surprise and trace/source boundaries separately intervenable; exact original scenario chain and natural recognition remain distinct.',['RO-C3-004','RO-C3-007','RO-C3-020'],[(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'| 2. Separate permission, selection'),(doc('CAMPAIGN3_EPI_QUALIFICATION'),'With prior1/100 and safe bound1/20')]),
 ('EXACT BOUNDED NONLEAKAGE','EPI changes hidden potential/Overflow while keeping permitted measurements and all declared character outputs/state equal.','Only declared consumer roster/horizon qualified; additional consumers and projections reopen noninterference.',['RO-C3-007','RO-C3-010'],[(doc('CAMPAIGN3_EPI_QUALIFICATION'),'Both runs start before19/20;'),(doc('CAMPAIGN3_EPI_QUALIFICATION'),'The finite consumer roster is sample900')]),
 ('BOUNDED REASON COMPARISON','Joined REASON preserves option/motive/referent grouping and independent versus collective evidence.','Keep raw sources, acquired standing and role/sign basis fixed across competitors; broader correlation/renaming remain unresolved.',['RO-C3-001','RO-C3-020'],[(doc('CAMPAIGN3_REASON_QUALIFICATION'),'| Change only motive or referent |')]),
 ('CALIBRATION LIMIT RETAINED','Exact distributions and grammar have bounded port evidence; historical modifier/bracket calibration remains unresolved rather than normalized away.','Preserve sweeps and complete distributions. A correct convolution does not select psychological exchange rates or prove every grammar dimension necessary.',['RO-C3-020'],[(doc('CAMPAIGN3_REASON_QUALIFICATION'),'Aggregate weighted Jaccard remains a candidate:'),(ledger,'- SUB-001/002/004/005/007/008/012:')]),
 ('BOUNDED EARLY-SEED AUTHORSHIP','BIO starts identical histories, couples non-decision draws, varies early decision seed and uses common later probe seed. Actual retained standing changes later settled intent.','Component scope and declared finite seeds/calibration; no arbitrary seed-space sufficiency or new native admission.',['RO-C3-009'],[(doc('CAMPAIGN3_BIO_QUALIFICATION'),'Six component models share exact content'),(doc('CAMPAIGN3_BIO_QUALIFICATION'),'At the matched probe, the positive history')]),
 ('BOUNDED FORMATION/CONTRADICTION; COMPOSITE CHAIN','BIO gives acquisition, one-contradiction resistance and sustained transformation; earlier focused historical tests support weak-signal combination/fault lines. Do not call one fixture the entire identity suite.','Keep original expressions and full qualified history, feedback controls, calibration and finite horizon. Refold equality does not authorize information loss.',['RO-C3-009','RO-C3-020'],[(doc('CAMPAIGN3_BIO_QUALIFICATION'),'After four positive contributions'),(doc('CAMPAIGN3_BIO_QUALIFICATION'),'DisplayOnly and HistoryOnly are behaviorally equivalent')]),
 ('BOUNDED PUBLIC LIFECYCLE','Public COMMIT executes active/retired/recurrent instance distinctions with fixed strong identity and selective observer learning. Historical input-removal fixture remains distinct.','Retain next-instant ordering, concrete referents and private retirement/stale observer belief. No immortal pressure or general social synchronization.',['RO-C3-009','RO-C3-020'],[(doc('CAMPAIGN3_COMMIT_QUALIFICATION'),'| No instance |0 reasons|'),(doc('CAMPAIGN3_COMMIT_QUALIFICATION'),'Registered lifecycle source30')]),
 ('EXACT COLLECTIVE REDUNDANCY WITNESS','REASON contrasts Aggregate versus PairwiseOnly on{1},{2},{1,2}; later collective contribution0 versus1/8.','Preserve atom weights/source identities and full raw comparison; larger-union subset residuals and universal overlap law unresolved.',['RO-C3-001','RO-C3-020'],[(doc('CAMPAIGN3_REASON_QUALIFICATION'),'| Bases3/4 on{1},2/3 on{2}')]),
 ('BOUNDED FOOTPRINT INTERVENTION','GA sparse/dense pairs vary admitted footprint across independent/shared/hybrid/flat laws with exact strengths, graph masses and later scores. Same winners do not imply equality.','Keep explicit tagging/source interventions and full retained query horizon; no universal independent-budget immunity.',['RO-C3-004','RO-C3-007','RO-C3-020'],[(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'| Historical shared |'),(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'retired negative control; a finite score equality')])
]
def validate(r):
 assert len(r['items'])==15 and [x['id'] for x in r['items']]==[f'EXP-{i:03}' for i in range(1,16)]
 for x in r['items']:
  assert x['id'] in x['source']['text'] and x['remaining'] and x['obligations'] and x['evidence']
  for e in [x['source']]+x['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert not r['wholeCorpusQualified'] and r['freshExecutions']==0
if '--verify' not in sys.argv:
 assert not out.exists();out.mkdir()
 rows=[{'id':f'EXP-{i:03}','source':excerpt(ledger,142+i,142+i),'disposition':d,'assessment':a,'remaining':s,'obligations':ids,'evidence':[para(*e) for e in es]} for i,(d,a,s,ids,es) in enumerate(specs,1)]
 r={'status':'15 PRESERVATION ROWS CROSSWALKED; FINAL CORPUS GATE OPEN','manifestSha256':sha(b/'manifest.json'),'items':rows,'wholeCorpusQualified':False,'freshExecutions':0,'limits':['Not the unchanged21-member corpus exit review or15-family exit approval.','Historical EXP IDs and current PHEN member identities are distinct; no automatic membership/status promotion.','Partial chains remain explicit; exact capacity/avoidance/satisfier fixtures not replaced by adjacent qualifications.','No new verdict or obligation closure; scientific completeness/freshness/provenance gates remain open.']}
 validate(r);write(out/'review.json',r)
else:r=load(out/'review.json');validate(r)
faults=[]
for mode in ['missing-row','altered-evidence','lost-limit','false-corpus-pass']:
 q=copy.deepcopy(r)
 if mode=='missing-row':q['items'].pop()
 elif mode=='altered-evidence':q['items'][0]['evidence'][0]['text']='wrong'
 elif mode=='lost-limit':q['items'][0]['remaining']=''
 else:q['wholeCorpusQualified']=True
 try:validate(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c={'status':'PASS ACCOUNTING; NOT CORPUS EXIT','rows':15,'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==c
else:write(f,c)
print(json.dumps(c))
