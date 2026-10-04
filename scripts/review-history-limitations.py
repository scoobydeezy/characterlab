"""Reviewed eight-item limitations overlay; exact frozen passages remain immutable."""
from pathlib import Path
import json,hashlib,copy,sys
p=Path('docs/planning'); b=p/'campaign3-history-universe-rev1'; out=p/'campaign3-history-limitations-rev1'
def load(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def write(f,x):f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ledger='docs/planning/REFERENCE_MECHANISM_LEDGER.md'
def excerpt(path,a,z):
 f=b/'sources'/path; lines=f.read_text(encoding='utf-8-sig').splitlines(keepends=True)
 return {'path':path,'sha256':sha(f),'startLine':a,'endLine':z,'text':''.join(lines[a-1:z])}
items=[
 (215,'SCOPED RESOLUTION','Exact linear anchors and retained remainder resolve incidental partition sensitivity in substrate/0.2-candidate.','No universal nonlinear/time-representation claim.','Changed range, rounding, anchors or nonlinear dynamics requires renewed contract/vector evidence.',['RO-C3-019','RO-C3-021'],[('docs/formal/OPEN_DECISIONS.md',429,435)]),
 (216,'CONDITIONAL LIMIT RETAINED','LEARN rejects compatible/zero-information bounds in tested cases; an established below-bound prior still reaches precision62 after six repeated bounds. Full point-like precision for accepted bounds remains an approximation.','No calibrated censored likelihood, universal deduplication or posterior confidence claim.','Before richer censored inference or confidence claims, compare precision laws with repetition, conflicting priors and declared evidence dependence.',['RO-C3-010'],[('docs/planning/CAMPAIGN3_LEARN_QUALIFICATION.md',45,63)]),
 (217,'CONDITIONAL LIMIT RETAINED','REASON retains modifier/bracket calibration as unresolved; exact arithmetic and observed candidate behavior do not select a psychological exchange rate.','No universal modifier-versus-base-die calibration or calibrated identity growth law.','Any general calibration or reduction claim needs matched distribution/behavior comparisons across brackets and retained controls.',['RO-C3-009','RO-C3-020'],[('docs/planning/CAMPAIGN3_REASON_QUALIFICATION.md',51,58),('docs/planning/CAMPAIGN3_REASON_QUALIFICATION.md',103,108)]),
 (218,'CONDITIONAL LIMIT RETAINED','REASON explicitly excludes a solution to nonparticipant referents. Relationship attribution revises an admitted dyadic causal proposition; it does not establish salience-weighted memory credit to an uninvolved causal object.','No general nonparticipant memory attribution claim from dyadic explanation or authored referent mappings.','Require a perceived salient causal nonparticipant, permitted identity/role evidence, actual attribution/retention and participant controls before claiming extension.',['RO-C3-020'],[('docs/planning/CAMPAIGN3_REASON_QUALIFICATION.md',96,101),('docs/planning/CAMPAIGN3_REL_ATTRIBUTION_QUALIFICATION.md',13,25)]),
 (219,'PROHIBITED PORT PATTERN RETAINED','Observation resolves a bounded safe projection with separate missingness. It does not authorize copying old full truth-side provenance into character state.','No wholesale historical SemanticExperience port, hidden Overflow or full truth identity admission.','Any projection/channel/recognition expansion must requalify permitted reads and forbidden-truth noninterference.',['RO-C3-007','RO-C3-010','RO-C3-020'],[('docs/formal/OPEN_DECISIONS.md',409,415),(ledger,207,209)]),
 (220,'CONDITIONAL LIMIT RETAINED','Joined REASON resolves signed direction after consolidation; it explicitly leaves direction-as-identity alternatives unresolved. A lawful bounded choice is not a comparative necessity verdict.','No universal direction-key reduction or identity equivalence.','Compare identity/grouping alternatives under opposite contributions, cancellation, changing signs and retained historical meaning before retirement.',['RO-C3-020'],[('docs/planning/CAMPAIGN3_REASON_QUALIFICATION.md',103,108)]),
 (221,'CONDITIONAL LIMIT RETAINED','Small-case graph/activation evidence is preserved. The reviewed GA qualification closes its declared finite profile, not Vivarium-scale throughput/storage or unrestricted long-horizon equivalence.','No production-scale complexity, resource ceiling or arbitrary graph/horizon claim.','Before scale deployment or graph reduction, declare workload/query/horizon/memory bounds and compare exact receiving outputs plus resources.',['RO-C3-007','RO-C3-020'],[(ledger,221,221),('docs/planning/GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md',111,122)]),
 (222,'HISTORICAL PROPOSAL STATUS; SCOPED SUCCESSORS','The statement describes pre-refoundation proposals. Later biology/disposition qualify their named bounded contracts, not all old Phase3 formulas or a seven-dimensional ontology. Preserve old hypotheses and current evidence separately.','Neither blanket never-implemented claim today nor wholesale acceptance of old proposed mechanisms.','Each claim must cite its current contract/qualification and scope; remaining formula/control comparisons stay conditional.',['RO-C3-008','RO-C3-009','RO-C3-020'],[('docs/planning/CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION.md',1,16),('docs/planning/CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION.md',1,20),(ledger,188,190)])
]
def validate(r):
 assert len(r['items'])==8 and {x['source']['startLine'] for x in r['items']}==set(range(215,223))
 for x in r['items']:
  assert x['blockedClaim'] and x['reopenCondition'] and x['obligations'] and x['evidence']
  for e in [x['source']]+x['evidence']:
   assert e==excerpt(e['path'],e['startLine'],e['endLine'])
   assert e['text'].strip()
 assert r['newVerdict'] is False and r['freshExecutions']==0
if '--verify' not in sys.argv:
 assert not out.exists(); out.mkdir()
 rows=[{'source':excerpt(ledger,n,n),'disposition':d,'assessment':a,'blockedClaim':c,'reopenCondition':t,'obligations':ids,'evidence':[excerpt(*e) for e in es]} for n,d,a,c,t,ids,es in items]
 r={'status':'EIGHT HISTORICAL LIMITATIONS REVIEWED; CONDITIONAL DEBT PRESERVED','manifestSha256':sha(b/'manifest.json'),'items':rows,'newVerdict':False,'freshExecutions':0,'limits':['Source-located list subdivision, not eight additional independently extracted paragraphs.','Later evidence is scoped and linked, not a fresh experiment or full independent proof-chain audit.','No claim that every newer document was searched or that absence of a found closure proves global absence.','No original source, candidate or failed cohort rewritten; no obligation closed.','Canonical-universe adequacy, remaining occurrences, five citation issues, freshness and final corpus/family/native-scope gates remain OPEN.']}
 validate(r); write(out/'review.json',r)
else:r=load(out/'review.json');validate(r)
faults=[]
for mode in ['omission','altered-evidence','lost-reopen','false-verdict']:
 q=copy.deepcopy(r)
 if mode=='omission':q['items'].pop()
 elif mode=='altered-evidence':q['items'][0]['evidence'][0]['text']='incorrect'
 elif mode=='lost-reopen':q['items'][0]['reopenCondition']=''
 else:q['newVerdict']=True
 try:validate(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
receipt={'status':'PASS SOURCE ACCOUNTING; SCIENTIFIC ADEQUACY REMAINS OPEN','items':8,'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==receipt
else:write(f,receipt)
print(json.dumps(receipt))
