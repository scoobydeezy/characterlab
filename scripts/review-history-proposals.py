from pathlib import Path
import json,hashlib,copy,sys
p=Path('docs/planning');b=p/'campaign3-history-universe-rev1';out=p/'campaign3-history-proposals-rev1'
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
 ('BOUNDED FOUR-LAYER WITNESS','BELIEF fixed false truth/display and goal-only interventions separate truth, evidence, belief and appraisal.','Controlled identity/display source; no general perception, belief law or calibrated confidence.',['RO-C3-010'],[(doc('CAMPAIGN3_BELIEF_QUALIFICATION'),'| Fixed false truth, misleading')]),
 ('BOUNDED OPPORTUNITY SEMANTICS','BELIEF distinguishes safe absence, no opportunity, censoring and unavailability; AFFECT groups admitted baseline/mitigation observations.','Do not infer general causal identification, natural opportunity discovery or adoption of old Phase3 type grammar.',['RO-C3-010','RO-C3-011'],[(doc('CAMPAIGN3_BELIEF_QUALIFICATION'),'| Safe absence versus no opportunity'),(doc('CAMPAIGN3_AFFECT_QUALIFICATION'),'The source distinguishes current-cue risk')]),
 ('BOUNDED NON-EVENT CONTROL','Safe negatives update only with an admitted opportunity. No-opportunity controls retain prior support; unconditional absence is a diagnostic arithmetic violation.','Retain missing versus observed negative; new opportunity sources/horizons require independent qualification.',['RO-C3-010'],[(doc('CAMPAIGN3_BELIEF_QUALIFICATION'),'| Safe absence versus no opportunity'),(doc('CAMPAIGN3_BELIEF_QUALIFICATION'),'TruthLookup, GoalAsBelief and UnconditionalAbsence')]),
 ('BOUNDED FOUR-FACTOR APPRAISAL','AFFECT sources likelihood, severity, vulnerability and control independently;48 cells compare candidate laws.','No uniquely necessary product formula, general causal efficacy inference or interchangeable factor collapse.',['RO-C3-011'],[(doc('CAMPAIGN3_AFFECT_QUALIFICATION'),'Likelihood is a retained current-cue estimate.'),(doc('CAMPAIGN3_AFFECT_QUALIFICATION'),'The main matrix has48 public factorial cells:')]),
 ('PARTIAL MULTI-PHENOMENON CROSSWALK','AFFECT links fallible appraisal to grounded reasons and actual outcome without a separate authoritative Fear primitive.','False fear/action contrast does not by itself reconcile relief, extinction, directional generalization and conditioning. Exact witnesses for each bundled phenomenon remain to map.',['RO-C3-010','RO-C3-011','RO-C3-019'],[(doc('CAMPAIGN3_AFFECT_QUALIFICATION'),'controlled display → safe observation'),(doc('CAMPAIGN3_AFFECT_QUALIFICATION'),'No independent authoritative Fear primitive')]),
 ('BOUNDED OBSERVER-RELATIVE SOCIAL EVIDENCE','SOCIAL separates private commitment, displayed claims and independent person-model updates; repeated presentation is not new receipt evidence.','One controlled support domain does not prove all multiple-beliefs/person families, natural recognition or general theory of mind.',['RO-C3-014','RO-C3-019'],[(doc('CAMPAIGN3_SOCIAL_QUALIFICATION'),'commitment → fallible displayed claim'),(doc('CAMPAIGN3_SOCIAL_QUALIFICATION'),'  SourceGroupedMean remains 1/2;')]),
 ('BOUNDED RELATIONSHIP CANDIDATE; NECESSITY OPEN','Relationship history and current person estimate separately affect social appraisal. The cooperation/rupture profile is not universal trust or attachment.','Derived-versus-stored trust/suspicion necessity cannot be settled by naming a history journal; preserve full query/history/horizon scope.',['RO-C3-016','RO-C3-020'],[(doc('CAMPAIGN3_RELATIONSHIP_QUALIFICATION'),'The profile is symbolic cooperation count')]),
 ('EMBARRASSMENT WITNESS; BUNDLED ROW STILL PARTIAL','Native embarrassment reproduces the component goal, report, affect, choice and execution distinctions.','Do not equate embarrassment with jealousy or automatically close all anticipatory/retrospective social-evaluation contrasts; exact additional witnesses remain to map.',['RO-C3-011','RO-C3-014','RO-C3-019'],[(doc('CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION'),'All69 component cases reproduce every goal')]),
 ('BOUNDED OWNER SEPARATION','Disposition keeps immutable constitution, plastic adaptation and acquired standing distinct; repeated biography can change the plastic contributor.','No single-roll constitution writer, duplicate trait bonus or general fusion law; represented belief requires its separate qualification.',['RO-C3-009','RO-C3-020'],[(doc('CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION'),'Repeated authenticated biography can change')]),
 ('BOUNDED CONSTITUTION/BIOGRAPHY; DIMENSIONS OPEN','Disposition retains constitutional/adaptation/standing interventions and historical seven-axis candidates.','Neither7-axis ontology nor universal projection is selected. Exact same-evidence/different-constitution and same-constitution/different-biography pair receipts still require final proof-chain audit.',['RO-C3-009','RO-C3-020'],[(doc('CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION'),'RETAIN immutable constitution, acquired plastic adaptation'),(doc('CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION'),'Historical seven-axis/quadratic personality remains')]),
 ('TIMING AND DECAY DISTINCT; FULL CROSSWALK OPEN','BELIEF demonstrates prior50 versus later140/next50; GA demonstrates retrieval/decay ties. These are separate bounded clocks and cannot stand in for every same-time belief-order/decay law.','Keep exact seam versions, current/consequence lanes, causal parents and partition semantics. Do not promote stale ORD-001 routing or claim all current-lane questions open from an old report.',['RO-C3-010','RO-C3-020','RO-C3-021'],[(doc('CAMPAIGN3_BELIEF_QUALIFICATION'),'| Consequence timing |'),(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'episode formed at 6 has base accessibility')]),
 ('BACKLOG HAS BOUNDED SUCCESSORS; NO BLANKET CLOSURE','Grief distinguishes believed enduring loss from temporary absence; rumination separates recurrence from evidence; biology supplies bounded hedonic/dependence dynamics.','Betrayal, obsession, motivational multiplicity and value formation/revision need their exact separate witnesses. No clinical universality or adoption of old proposed mechanisms.',['RO-C3-008','RO-C3-016','RO-C3-019','RO-C3-020'],[(doc('CAMPAIGN3_GRIEF_QUALIFICATION'),"At identical acquired relationship history"),(doc('CAMPAIGN3_RUMINATION_QUALIFICATION'),'Earlier admitted unresolved content repeatedly occupies'),(doc('CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION'),'dispositions in the work order. CTL001 and CTL008')])
]
def validate(r):
 assert len(r['items'])==12 and [x['id'] for x in r['items']]==[f'P3-{i:03}' for i in range(1,13)]
 for x in r['items']:
  assert x['id'] in x['source']['text'] and x['remaining'] and x['evidence'] and x['obligations']
  for e in [x['source']]+x['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert not r['wholeProposalValidated'] and r['freshExecutions']==0
if '--verify' not in sys.argv:
 assert not out.exists();out.mkdir()
 lines=(b/'sources'/ledger).read_text(encoding='utf-8-sig').splitlines()
 def row(i):
  hits=[n for n,l in enumerate(lines,1) if l.startswith(f'| `P3-{i:03}` |')];assert len(hits)==1
  return excerpt(ledger,hits[0],hits[0])
 rows=[{'id':f'P3-{i:03}','source':row(i),'disposition':d,'assessment':a,'remaining':s,'obligations':ids,'evidence':[para(*e) for e in es]} for i,(d,a,s,ids,es) in enumerate(specs,1)]
 r={'status':'12 PROPOSAL ROWS CROSSWALKED; BUNDLED PROOF GAPS RETAINED','manifestSha256':sha(b/'manifest.json'),'items':rows,'wholeProposalValidated':False,'freshExecutions':0,'limits':['Historical never-implemented wording describes old Phase3, not the current absence of all capabilities.','Later bounded contracts do not adopt the old roadmap or formulas wholesale.','Unmapped subphenomena are audit gaps, not evidence that implementation does not exist.','No new verdict, row/corpus promotion or obligation closure; final adequacy/freshness/corpus gates remain open.']}
 validate(r);write(out/'review.json',r)
else:r=load(out/'review.json');validate(r)
faults=[]
for mode in ['missing-row','wrong-evidence','lost-limit','blanket-validation']:
 q=copy.deepcopy(r)
 if mode=='missing-row':q['items'].pop()
 elif mode=='wrong-evidence':q['items'][0]['evidence'][0]['text']='wrong'
 elif mode=='lost-limit':q['items'][0]['remaining']=''
 else:q['wholeProposalValidated']=True
 try:validate(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c={'status':'PASS SOURCE ACCOUNTING; BUNDLED SCIENTIFIC REVIEW OPEN','rows':12,'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==c
else:write(f,c)
print(json.dumps(c))
