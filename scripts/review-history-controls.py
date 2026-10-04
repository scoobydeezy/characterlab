"""Ten explicitly reviewed historical control dispositions, with scoped evidence."""
from pathlib import Path
import json,hashlib,copy,sys
p=Path('docs/planning');b=p/'campaign3-history-universe-rev1';out=p/'campaign3-history-controls-rev1'
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def load(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def write(f,x):f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ledger='docs/planning/REFERENCE_MECHANISM_LEDGER.md'
def excerpt(path,a,z):
 f=b/'sources'/path;ls=f.read_text(encoding='utf-8-sig').splitlines(keepends=True)
 return {'path':path,'sha256':sha(f),'startLine':a,'endLine':z,'text':''.join(ls[a-1:z])}
def para(path,phrase):
 ls=(b/'sources'/path).read_text(encoding='utf-8-sig').splitlines(keepends=True);hits=[i for i,l in enumerate(ls) if phrase in l];assert len(hits)==1,(path,phrase,hits)
 a=z=hits[0]
 while a>0 and ls[a-1].strip():a-=1
 while z+1<len(ls) and ls[z+1].strip():z+=1
 return excerpt(path,a+1,z+1)
def doc(name):return 'docs/planning/'+name+'.md'
specs=[
 ('BOUNDED COMPARISON; CONTROL RETAINED','BODY compares MeterBehindSensor, IndependentNeed, AuthoredReference and CachedEvidence against mediated pressure. Sampled equality of meter/cache does not establish universal necessity or redundancy.','Retain sensed versus hidden urgency, declared probe schedule and kinetics. Widened queries, between-probe behavior or source history need new comparisons.',['RO-C3-008'],[(doc('CAMPAIGN3_BODY_OWNERSHIP_QUALIFICATION'),'| MeterBehindSensor |')]),
 ('CONTROL RETAINED; GENERAL REPRESENTATION OPEN','Scalar mean/precision remains a comparison representation. LEARN preserves full-point precision for accepted bounds as an approximation; bounded belief is not a covariance or calibrated uncertainty result.','Preserve repeated bounds, contradiction, unknown/known0 and numeric family. Correlated reports/posteriors/confidence need qualified alternatives.',['RO-C3-010'],[(doc('CAMPAIGN3_LEARN_QUALIFICATION'),'the supplementary six-bound run ends')]),
 ('CONTROL RETAINED; SCALING/REDUCTION OPEN','Global row-substochastic graph remains a control, not the universal cognitive backbone. Finite GA graph differences do not prove production scalability or superiority over all local/indexed mechanisms.','Before graph reduction retain admitted cue/encoding history, exact receiving scores, query set, memory capacity and horizon; separately measure resources.',['RO-C3-007','RO-C3-020'],[(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'| Historical shared |')]),
 ('CONTROL EXECUTED; NO UNIVERSAL LAW','GA compares Independent, shared, hybrid and retired-flat encoding; winner equality can hide strength/edge/score differences.','Keep semantic-footprint intervention and later recall scores. No universal independent-budget law or graph-retention equivalence.',['RO-C3-004','RO-C3-020'],[(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'retired negative control; a finite score equality')]),
 ('CONTROL RETAINED; BOUNDED GROUPING COMPARISON','REASON PooledChannel collapses distinct motives/referents in its exact comparison. This is bounded evidence, not identity proof that every PooledChannel specimen is the original historical compiler.','Keep original pooled compiler and model identities; exact old-vs-new source provenance and full corpus remain separate from a shared label.',['RO-C3-001','RO-C3-020'],[(doc('CAMPAIGN3_REASON_QUALIFICATION'),'| Change only motive or referent |'),(ledger,'  CONTROL/CORPUS/CANDIDATE dispositions. CTL-005')]),
 ('HISTORICAL CANDIDATE RETAINED','Disposition qualifies separate immutable constitution, plastic adaptation and acquired standing. Historical seven-axis/quadratic personality remains a candidate; no general personality dimension selection follows.','Keep identical-evidence/different-constitution and identical-constitution/different-biography interventions; universal fusion and dimensionality remain conditional.',['RO-C3-009','RO-C3-020'],[(doc('CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION'),'Historical seven-axis/quadratic personality remains')]),
 ('CANDIDATE; EXACT FORMATION/REVISION CHAIN OPEN','Ledger asks to preserve tests of values derived from repeated Need satisfaction. No exact earned value-derivation fixture is established by this review; later maintained goals or hedonic expectations cannot silently stand in for values.','Trace proposed and executed value-formation/revision evidence before adoption, retirement or claiming this historical obligation discharged.',['RO-C3-019','RO-C3-020'],[(ledger,'| `CTL-007` |')]),
 ('BROADER CONTROL RETAINED','Biology makes its18 specified behaviors expressible while explicitly retaining CTL001/008 as broader controls. This does not select acquired Need as the accepted addiction explanation or prove all comparisons against it complete.','Keep adaptation, deficit, cue, goals, control and actual consequences distinct; whole-system old-control replacement needs its own matched comparison.',['RO-C3-008','RO-C3-020'],[(doc('CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION'),'dispositions in the work order. CTL001 and CTL008')]),
 ('CONTROL RETAINED; NOT CANONICAL','Universal candidates/additive scoring remains historical control scope. REASON demonstrates key/role separation, but is not by itself a complete universal-list-versus-constructed-options assay.','Need explicit option-generation/availability and receiver comparisons before reducing construction or claiming additive scoring equivalent. Preserve original list/control.',['RO-C3-019','RO-C3-020'],[(ledger,'| `CTL-009` |'),(doc('CAMPAIGN3_REASON_QUALIFICATION'),'| Change only motive or referent |')]),
 ('TRACE-ONLY ROUTING SUPERSEDED IN BOUNDED BIOLOGY','The later biology report explicitly instantiates CTL010 as a bounded sensed hedonic candidate. Current/consequence experience teaches pleasure, relief and harm; this supersedes a blanket current trace-only reading, not the original historical record.','Keep physical activation, experienced pleasure/distress and learned valuation distinct; no universal Reward scalar, biological fidelity or law necessity implied.',['RO-C3-008','RO-C3-010','RO-C3-020'],[(doc('CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION'),'dispositions in the work order. CTL001 and CTL008'),(doc('CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION'),'pleasure, withdrawal relief, restorative benefit and harm learning.')])
]
def validate(r):
 assert len(r['items'])==10 and [x['id'] for x in r['items']]==[f'CTL-{i:03}' for i in range(1,11)]
 for x in r['items']:
  assert x['id'] in x['source']['text'] and x['blockedOrReopen'] and x['obligations'] and x['evidence']
  for e in [x['source']]+x['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert r['freshExecutions']==0 and not r['newVerdict']
if '--verify' not in sys.argv:
 assert not out.exists();out.mkdir()
 rows=[{'id':f'CTL-{i:03}','source':excerpt(ledger,182+i,182+i),'disposition':d,'assessment':a,'blockedOrReopen':s,'obligations':ids,'evidence':[para(*e) for e in es]} for i,(d,a,s,ids,es) in enumerate(specs,1)]
 r={'status':'10 HISTORICAL CONTROLS REVIEWED; CANDIDATES AND PROOF GAPS RETAINED','manifestSha256':sha(b/'manifest.json'),'items':rows,'freshExecutions':0,'newVerdict':False,'limits':['No control retired or obligation closed. One existing table subdivided, not10 independently extracted paragraphs.','CTL010 has a scoped later instantiation, not a new verdict or universal hedonic ontology.','Exact CTL007 value-formation/revision chain and CTL009 full option-list comparison remain open.','No whole-universe/source acceptance, independent scientific completeness or Campaign3 exit claim.']}
 validate(r);write(out/'review.json',r)
else:r=load(out/'review.json');validate(r)
faults=[]
for mode in ['missing-control','wrong-evidence','lost-reopen','false-verdict']:
 q=copy.deepcopy(r)
 if mode=='missing-control':q['items'].pop()
 elif mode=='wrong-evidence':q['items'][0]['evidence'][0]['text']='incorrect'
 elif mode=='lost-reopen':q['items'][0]['blockedOrReopen']=''
 else:q['newVerdict']=True
 try:validate(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c={'status':'PASS SOURCE ACCOUNTING; SCIENTIFIC ADEQUACY OPEN','controls':10,'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==c
else:write(f,c)
print(json.dumps(c))
