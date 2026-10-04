"""Explicit reviewed crosswalk; no automatic acceptance based on filename/status."""
from pathlib import Path
import json,hashlib,sys,copy
p=Path('docs/planning'); b=p/'campaign3-history-universe-rev1'; out=p/'campaign3-history-intake-crosswalk-rev1'
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def load(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def write(f,x):f.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
manifest=load(b/'manifest.json'); entries={e['path']:e for e in manifest['entries']}
def passage(path,a,z):
 f=b/'sources'/path; lines=f.read_text(encoding='utf-8-sig').splitlines(keepends=True)
 return {'path':path,'sha256':entries[path]['sha256'],'startLine':a,'endLine':min(z,len(lines)),'text':''.join(lines[a-1:z])}
ledger='docs/planning/REFERENCE_MECHANISM_LEDGER.md'; formal='docs/formal/FORMULA_INTAKE_LEDGER.md'
specs=[
 (13,'BOUNDED SUBSTRATE PORT','substrate/0.2-candidate; bounded numeric contracts remain authoritative','SUB-001/002; bigint rational construction and signed rounding ported; no universal psychological scale inferred.','Any changed range, rounding or fixed-point representation requires its exact numeric contract and vectors.',['RO-C3-019','RO-C3-020'],[(ledger,106,110),('docs/formal/DETERMINISTIC_SUBSTRATE.md',1,13)]),
 (14,'BOUNDED SUBSTRATE PORT','substrate/0.2-candidate; ordering phase extensions separately versioned','Typed canonical identity, atomic ordered instants and continuation are accepted; hashes remain diagnostics.','New phase/order/encoding or hash-only equality requires explicit contract/proof review.',['RO-C3-019','RO-C3-020'],[(ledger,106,112),('docs/formal/DETERMINISTIC_SUBSTRATE.md',1,13)]),
 (15,'BOUNDED HAZARD RESOLVED','substrate/0.2-candidate','MATH-001/TIME-001 resolves incidental re-anchoring with exact linear anchors and remainder.','Nonlinear progression or changed time/rounding/re-anchor semantics reopens; no generic integration law.',['RO-C3-019','RO-C3-021'],[('docs/formal/OPEN_DECISIONS.md',429,435)]),
 (16,'BOUNDED SAMPLER ACCEPTED','substrate/0.2-candidate','MATH-005/RND-001 accepts bounded rejection with declared residual bias, not unbiasedness.','Changing address/hash/width/span/attempts/fallback/coupling reopens the bound.',['RO-C3-019','RO-C3-021'],[('docs/formal/OPEN_DECISIONS.md',421,427)]),
 (17,'HISTORICAL CONTROL; DISTINCT BOUNDED SUCCESSOR','biological-integration/0.1-candidate','Functional biology qualifies18 behaviors; this is not adoption of all legacy Needs/MPS/fulfillment equations or proof every Need is a meter.','Preserve CTL-001/008 and exact body/evidence distinctions; any retirement requires a named comparison, not broad biology closure.',['RO-C3-008','RO-C3-020'],[('docs/planning/CAMPAIGN3_BIOLOGICAL_SYSTEM_QUALIFICATION.md',1,30),(ledger,175,191)]),
 (18,'CONDITIONAL CANDIDATE; NO ADOPTION','No signal-field adoption established by this crosswalk','MATH-002 coefficient convention and MATH-003 distribution assumptions remain conditional.','Choose convention and equivalence vectors; declare fourth moments/distribution before comparison or adoption.',['RO-C3-020'],[('docs/formal/OPEN_DECISIONS.md',222,223)]),
 (19,'BOUNDED BELIEF; KALMAN CANDIDATE OPEN','belief-public/0.1-candidate','Evidence-owned scalar belief qualification does not adopt covariance/Kalman laws or calibrated probability confidence.','Covariance candidate requires PSD validity; richer confidence, correlations and general belief remain conditional.',['RO-C3-010','RO-C3-020'],[('docs/planning/CAMPAIGN3_BELIEF_QUALIFICATION.md',1,20),('docs/formal/OPEN_DECISIONS.md',224,224),(ledger,118,121)]),
 (20,'MANDATORY CONTROL PORT QUALIFIED IN BOUNDED TASK','task-cognitive-path/0.1-candidate','Campaign2 port executes reason/dice/standing loop and historical differential controls. PORT is not a general retained/reduction verdict.','Maintain pooled compiler and candidate grammar comparisons; broad biography/coercion and later source-role joins require their own evidence.',['RO-C3-009','RO-C3-020'],[(ledger,257,297),('docs/planning/CAMPAIGN2_COGNITIVE_QUALIFICATION.md',1,22)]),
 (21,'HISTORICAL HYPOTHESES; DISTINCT BOUNDED SUCCESSOR','disposition-adaptation/0.1-candidate','Constitution, plastic contributor and standing remain distinct; CTL-006 seven-dimensional ontology is not adopted by bounded adaptation.','No universal personality dimensionality or general fusion law; preserve competing historical projection/identity models.',['RO-C3-009','RO-C3-020'],[('docs/planning/CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION.md',1,24),(ledger,179,187)]),
 (22,'HISTORICAL CANDIDATES; DISTINCT BOUNDED SUCCESSOR','relationship-public/0.2-candidate','Own-participant history and person estimate are separate inputs; symbolic cooperation/rupture profile is not universal trust or legacy-formula adoption.','General attachment/trust law and natural recognition require new qualification, preserving direction and observer boundary.',['RO-C3-019','RO-C3-020'],[('docs/planning/CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md',1,26)]),
 (23,'VIVARIUM-ONLY INTAKE SCOPE','No character-side formula admission','Population/economy/spatial formulas are surrounding-world candidates under this row; world quantities do not thereby become character knowledge.','A seam proposing character-side consumption must explicitly justify/admit safe evidence; no source-file exclusion from history inferred.',['RO-C3-019','RO-C3-021'],[(formal,23,23)])
]
def validate(r):
 assert len(r['rows'])==11 and {x['source']['startLine'] for x in r['rows']}==set(range(13,24))
 assert len(r['referenceSources'])==8
 for x in r['rows']:
  assert x['scope'] and x['reopenOrRemaining'] and x['obligations'] and x['evidence']
 for e in [a for x in r['rows'] for a in [x['source']]+x['evidence']]+[x['header'] for x in r['referenceSources']]+r['referenceAuthority']:
  f=b/'sources'/e['path']; assert sha(f)==e['sha256']
  lines=f.read_text(encoding='utf-8-sig').splitlines(keepends=True)
  assert e['text']==''.join(lines[e['startLine']-1:e['endLine']])
 if r['referenceSources']:
  assert len({x['header']['path'] for x in r['referenceSources']})==8
  assert all(x['scientificAcceptance']=='INDIVIDUAL FINDINGS NOT REVIEWED HERE' for x in r['referenceSources'])
if '--verify' not in sys.argv:
 assert not out.exists(); out.mkdir()
 rows=[{'source':passage(formal,n,n),'disposition':d,'contractOrScope':c,'scope':s,'reopenOrRemaining':t,'obligations':ids,'evidence':[passage(*e) for e in es]} for n,d,c,s,t,ids,es in specs]
 names=['CharacterLab — Deterministic Cognitive Reference Model Brief.md','CharacterLab — Phase 2.5 Research Brief.md','CharacterLab — Phase 2.9 Research Brief.md','CharacterLab — Phase 2.97 Research Brief.md','CharacterLab — Phase 3 Research Brief.md','CharacterLab — Phase 3 Implementation Plan.md','RESEARCH.md','IMPLEMENTATION_README.md']
 refs=[]
 for name in names:
  role='HISTORICAL HYPOTHESIS AND CONTROL SOURCE'
  if name=='RESEARCH.md': role='CANONICAL HISTORICAL FINDINGS SOURCE; STANDING METHOD CORRECTIONS RETAINED'
  elif name=='IMPLEMENTATION_README.md':role='HISTORICAL IMPLEMENTATION MAP; NO ACTIVE SOURCE IMPORT'
  elif 'Phase 3' in name:role='SUPERSEDED ACTIVE ROADMAP; RETAINED HYPOTHESES'
  refs.append({'header':passage('reference/'+name,1,25),'role':role,'basis':'Explicit preservation-ledger source index; AGENTS authority7. Local document headers subordinate to current North Star/architecture/research method.','scientificAcceptance':'INDIVIDUAL FINDINGS NOT REVIEWED HERE','obligation':'RO-C3-021'})
 r={'status':'11 ROWS CROSSWALKED; EIGHT HISTORICAL SOURCE ROLES REVIEWED; EXIT OPEN','manifestSha256':sha(b/'manifest.json'),'rows':rows,'referenceSources':refs,'referenceAuthority':[passage(ledger,53,84),passage('AGENTS.md',32,44)],'obligations':['RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'],'limits':['Crosswalk dispositions are bounded scopes, not11 adopted formulas or closed obligations.','Original upstream formula provenance remains unresolved; current copy is not the historical snapshot.','Eight source-level relevance/authority roles reviewed, not every finding in those sources.','Historical claims are linked, not freshly executed. Independent scientific adequacy/proof-chain and corpus/native-scope gates remain open.','Prior34-paragraph review remains immutable; this overlay supplies the pending table row crosswalk. No mass-disposition of remaining inventory.']}
 validate(r); write(out/'review.json',r)
else:r=load(out/'review.json'); validate(r)
faults=[]
for mode in ['missing-row','wrong-evidence','missing-scope','promoted-history']:
 q=copy.deepcopy(r)
 if mode=='missing-row':q['rows'].pop()
 elif mode=='wrong-evidence':q['rows'][0]['evidence'][0]['text']='incorrect'
 elif mode=='missing-scope':q['rows'][0]['scope']=''
 else:q['referenceSources'][0]['scientificAcceptance']='ACCEPTED ALL'
 try:validate(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
receipt={'status':'PASS CROSSWALK ACCOUNTING; NOT SCIENTIFIC COMPLETENESS','rows':11,'sourceRoles':8,'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==receipt
else:write(f,receipt)
print(json.dumps(receipt))
