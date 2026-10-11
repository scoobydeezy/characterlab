from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-predecessor-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
specs={
(P/'general-attention-model-review-rev1/REVIEW.json').as_posix():'Rejected unfrozen proposal.35 recipe labels produce two aliased three-member groups;five-field parameters omit sole required S0. Source inventory has only materializer entry. Exact images remain historical counterexample,not admitted models or evidence of psychological equivalence.',
(P/'general-attention-model-review-rev1/DISPOSITION.md').as_posix():'Rejection and correction record:role/disabled recipes incorrectly used spatial encoder;required S0 omitted;Windows inventory normalization failure. Corrected identities/parameters/source inventory verified;old execution defect is a preserved historical finding,not newly replayed. Suffixless SELECTED_ALLOCATION_CONTROLS resolves to docs/formal.',
'docs/formal/SELECTED_ALLOCATION_CONTROLS.md':'Normative bounded controls preserve selected capability,experience and spatial provenance;role attention=Role,disabled=1,Raw=Base*Role*Attention. Four retention/encoding budget laws remain distinct;complete position still required. Positive formation,source ownership and occurrence identity unchanged. Nonspatial residual feedback forbidden;exact required S0 joins model commitment,while actual S0 remains independently in RunIdentity.',
(P/'general-attention-model-review-rev2/REVIEW.json').as_posix():'Corrected35-model proposal with explicit registrations,six-field parameters including exact S0,186 source references and no aliases. Proposal status precedes exact review/freeze;not public activation. Two producer references now resolved from reconstructed scripts where applicable;definition source remains unverified historical bytes.',
(P/'GA_MODEL_IMAGE_REVIEW_2026_09_19.json').as_posix():'Historical35-model exact image review with105 rejection controls. Later43-model audit freshly checks preserved35 images within129 controls. Old review script hash unresolved;do not represent old105 script as freshly reproduced. Rejected revision1 means unfrozen proposal,not accepted frozen35 cohort.',
(P/'campaign3-general-attention-model-rev1/FREEZE.json').as_posix():'Accepted35 exact model/run commitments and247 files copied from reviewed proposal;all remain exact in later43 cohort. Freeze authorizes those images for next public gate,not runtime/corpus success.188 source references:184 current matches,two exact reconstructed,two unresolved historical implementation sources. Material image evidence retained without substituting source hashes.'}
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert sha(p)==entries[p]['sha256'];roles.append(dict(path=p,sha256=sha(p),role='HISTORICAL GA PROPOSAL/CORRECTION/FREEZE AUTHORITY',judgment=j,acceptanceChain=[ref(O/'predecessor-image-check.json'),ref(O/'proposal-correction-check.json'),ref(O/'proposal-check-finding.json'),ref(P/'CAMPAIGN3_HISTORY_GA_PREDECESSOR_DISPOSITION.md')]))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],u['location']['pointer']]==u['text']
  ptr=u['location'].get('pointer','');narr=u['source'].endswith('.md') or ptr.startswith(('/status','/scope'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narr else 'TYPED IMAGE/REVIEW BACKING',judgment=specs[u['source']]))
obs=['RO-C3-004','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021']
save(O/'review.json',dict(status='SIX PREDECESSOR/CORRECTION SOURCES ACCOUNTED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),obligations=obs,unresolvedHistoricalSources=load(O/'predecessor-image-check.json')['unresolved'],limits=['No historical-source equivalence or old105-control fresh replay claim.','Proposal aliases are packaging defects,not comparator reductions.','Original sources and failed audit harness retained.']))
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(r['role'].startswith('NARRATIVE') for r in rows),originalBackingOccurrences=sum(r['role'].startswith('TYPED') for r in rows),stringLeaves=len(strings),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
