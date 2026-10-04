from pathlib import Path
import json,hashlib,copy,sys,re
p=Path('docs/planning');b=p/'campaign3-history-universe-rev1';out=p/'campaign3-history-mechanisms-rev1'
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
e={
 'arith':(ledger,'`SUB-001` has an accepted Campaign 0 reference port'),
 'port':(ledger,'- SUB-001/002/004/005/007/008/012:'),
 'rng':(ledger,'**Campaign 0 port status'),
 'save':(ledger,'The ordering and persistence portion of `SUB-008`'),
 'couple':(ledger,'- SUB-009: natural-address'),
 'bundles':(ledger,'- SUB-003/010:'),
 'learn':(doc('CAMPAIGN3_LEARN_QUALIFICATION'),'| Prior2/5,50 then bound1/10'),
 'learnlimit':(doc('CAMPAIGN3_LEARN_QUALIFICATION'),'the supplementary six-bound run ends'),
 'epi':(doc('CAMPAIGN3_EPI_QUALIFICATION'),'The finite consumer roster is sample900'),
 'surprise':(doc('CAMPAIGN3_EPI_QUALIFICATION'),'With prior1/100 and safe bound1/20'),
 'ga':(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'| 2. Separate permission, selection'),
 'footprint':(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'retired negative control; a finite score equality'),
 'memory':(doc('GENERAL_ATTENTION_QUALIFICATION_2026_09_20'),'episode formed at 6 has base accessibility'),
 'reason':(doc('CAMPAIGN3_REASON_QUALIFICATION'),'| Same motive/referent, two independent samples'),
 'reasonlimit':(doc('CAMPAIGN3_REASON_QUALIFICATION'),'Aggregate weighted Jaccard remains a candidate:'),
 'cognitive':(ledger,'- MEC-011/012/014/015/016:'),
 'decision':(doc('CAMPAIGN3_DECISION_QUALIFICATION'),'Low/high significance has identical authoritative draw'),
 'bio':(doc('CAMPAIGN3_BIO_QUALIFICATION'),'After four positive contributions'),
 'refold':(doc('CAMPAIGN3_BIO_QUALIFICATION'),'DisplayOnly and HistoryOnly are behaviorally equivalent'),
 'commit':(doc('CAMPAIGN3_COMMIT_QUALIFICATION'),'| No instance |0 reasons|'),
 'attrib':(doc('CAMPAIGN3_REASON_QUALIFICATION'),'language understanding or a solution to nonparticipant referents.')
}
# Explicit judgments: a port result is never converted into universal necessity.
sub=[
 ('Bounded exact-rational port; canonical reduction, signed division and ties-to-even preserved.','Changed domain/range/rounding requires exact contract and vectors; no generic psychological numeric scale.',['arith']),
 ('Bounded lattice/quantization port with exact comparisons.','Preserve total budgets and tie order; historical scale is not optimality proof.',['port']),
 ('Typed/canonical identity port replaces old registries under committed versions.','Semantic identity is structural; fixture IDs cannot be promoted by aliasing hashes.',['rng','bundles']),
 ('SHA256 addressed draws replace historical delimiter/FNV mapping in accepted substrate.','Pure addressing, role coupling and finite bias bounds remain exact; future hash/range changes reopen.',['rng']),
 ('Exact finite distributions/convolution/tie sharing ported in bounded task profile.','No arbitrary distribution or psychological grammar necessity from arithmetic correctness.',['port']),
 ('Historical linear-algebra oracle/control retained; no broad character primitive inferred.','Independent active-port/consumer proof chain remains unreviewed; singularity and pivot order must be preserved when used.',[]),
 ('Collective evidence coverage has bounded port and explicit REASON discriminator.','Subset residuals and general correlation remain open; no universal weighted-Jaccard law.',['port','reason','reasonlimit']),
 ('Ordered atomic instants, canonical saves and bounded trace/replay ported.','Keep full state/queue/allocator identity; hash equality is not structural proof; new trace consumers reopen.',['save']),
 ('Explicit coupling port and later BIO pair exist; Campaign2 task excludes external maps.','Equal seeds alone do not couple differing addresses; preserve each profile and nondecision controls.',['rng','couple']),
 ('Separate committed old/new bundles and frozen recipes preserve comparison identity.','No silent recalibration or overwriting legacy defaults; full bundle history review remains open.',['bundles']),
 ('Correct-forward discipline remains a governing preservation obligation.','Every amendment must retain failed hypothesis, original evidence and correction; this review does not certify every past correction.',[]),
 ('Bounded-response utility ported as candidate arithmetic.','Preserve monotonicity/bounds and exact receiving queries; not a universal psychological saturation law.',['port']),
 ('Historical inspection UI and trace tooling remain controls; current UI parity not established here.','Exact UI/viewer/calibration workflow inspection remains owed; emitted traces alone are insufficient.',[])
]
mec=[
 ('Mean/precision remains a candidate/control with contradiction resistance and bound approximation.','No general confidence/covariance law; domain sharing and exact original equivalence proof remain scoped.',['learn','learnlimit']),
 ('LEARN exercises four bounded informativeness cases and retains point-like accepted-bound precision.','Broader censoring, correlated sources and calibrated posteriors remain open.',['learn','learnlimit']),
 ('EPI separates physical decomposition from permitted sensed evidence.','Do not infer universal stored Needs or admit authoritative Applied/Overflow directly.',['epi']),
 ('Old integrated-blocker wording is historical; later EPI/GA execute bounded safe source integrations.','Controlled identity and finite projection do not close general recognition/roles; no blanket SEM completion inferred.',['epi','ga']),
 ('GA preserves permission/perception versus selected attention; role/capacity controls execute.','Residual-pool calibration is candidate-specific, not a universal attention law.',['ga']),
 ('EPI uses evidence-aware surprise with old-prior encoding and distinct later learning.','Lower-bound/public scope does not discharge every upper-bound or new-consumer contract.',['surprise']),
 ('Independent/shared/hybrid multiplicative laws remain explicit alternatives.','Keep each factor and exact full scores; no universal winner selected.',['footprint']),
 ('GA formation/association/recall owners execute finite graph alternatives.','Row-budget/normalization invariants and historical controls persist; no graph-backbone or scaling claim.',['ga','footprint']),
 ('Finite spreading/accessibility and canonical tie/decay comparisons preserved.','Local alternatives, stability domain, quantization and future-query horizon must survive reduction.',['memory','footprint']),
 ('Actual retrieval reinforcement and unselected-history/decay controls remain separate.','No full reconstructive-memory equivalence or universal forgetting law.',['memory']),
 ('Bounded task port separates availability/relevance; later HABIT and substitution remain separate evidence.','World infeasibility cannot manufacture cue access; full original negative-control chain remains distinct.',['cognitive']),
 ('Joined REASON separates motive/referent and resolves signed direction after consolidation.','Direction-as-identity alternatives remain unresolved; no universal key normalization.',['reason','reasonlimit']),
 ('REASON includes context modulation as separately traced bounded modifier; older future-only routing is superseded in this scope.','New source families need admitted ownership/role contracts; no universal context mechanism.',['reason']),
 ('Bounded raw-cause consolidation and separate evidence basis ported.','Keep identity feedback out of its own evidence; calibration/threshold variants require exact comparisons.',['cognitive','reason']),
 ('Dice/modifier/arbitration grammar executes in bounded task and DECISION profiles.','Preserve exact distributions/modes/addressing; neither universal calibration nor uniqueness selected.',['cognitive','decision']),
 ('REASON tests zero-base exclusion and weak-motive rescue by modifiers.','Standing/context cannot manufacture base motivation; new compiler laws require same controls.',['reason']),
 ('Frozen choice meaning survives allowed versus prevented execution in DECISION.','Preserve alternatives/reasons/intent before world outcome; current reinterpretation cannot rewrite expression.',['decision']),
 ('BIO demonstrates acquired standing, contradiction and finite transformation.','Refold retains whole history; no compression or general identity law; extra trait-bonus mutant gap remains.',['bio','refold']),
 ('DECISION actual intent/expression precedes attempt/outcome with execution controls.','Do not derive commitment/courage from world success alone; later learning remains admitted evidence.',['decision']),
 ('COMMIT demonstrates concrete active-only lifecycle pressure and distinct recurrence.','No immortal appetite relabeling or automatic observer synchronization.',['commit']),
 ('Historical participant-attribution control remains; broader nonparticipant extension not established.','Need exact proportional participant and single-participant regression chain; dyadic explanations do not establish nonparticipant credit.',['attrib']),
 ('Original historical expression/qualification retained under later context and identity changes.','Allowed future queries and full contextual evidence matter; complete-history refold is not lossy compression.',['decision','refold'])
]
def validate(r):
 ids=[f'SUB-{i:03}' for i in range(1,14)]+[f'MEC-{i:03}' for i in range(1,23)]
 assert [x['id'] for x in r['items']]==ids
 for x in r['items']:
  assert x['id'] in x['source']['text'] and x['remaining'] and x['obligations']
  for q in [x['source']]+x['evidence']:assert q==excerpt(q['path'],q['startLine'],q['endLine'])
 assert not r['fullHistoryReconciled'] and r['freshExecutions']==0
if '--verify' not in sys.argv:
 assert not out.exists();out.mkdir()
 ls=(b/'sources'/ledger).read_text(encoding='utf-8-sig').splitlines();rows=[]
 for prefix,spec in [('SUB',sub),('MEC',mec)]:
  for i,(a,rem,keys) in enumerate(spec,1):
   id=f'{prefix}-{i:03}';hits=[n for n,l in enumerate(ls,1) if l.startswith(f'| `{id}` |')];assert len(hits)==1
   rows.append({'id':id,'source':excerpt(ledger,hits[0],hits[0]),'assessment':a,'remaining':rem,'obligations':['RO-C3-019','RO-C3-020','RO-C3-021'],'evidence':[para(*e[k]) for k in keys],'disposition':'SCOPED REVIEW; LIMITS RETAINED' if keys else 'PRESERVATION OBLIGATION; PROOF CHAIN OPEN'})
 r={'status':'13 SUBSTRATE AND22 MECHANISM ROWS REVIEWED','manifestSha256':sha(b/'manifest.json'),'items':rows,'fullHistoryReconciled':False,'freshExecutions':0,'limits':['Source-accounting crosswalk, not new35 qualifications or original extracted-unit completion.','SUB006/013 active-port/tooling chains and MEC021 attribution proof remain open; no missing evidence inferred as impossibility.','Historical routing corrected by scoped later records; old sources unchanged.','Scientific adequacy, entire canonical-universe reconciliation, freshness and exit corpus/native gates remain open.']}
 validate(r);write(out/'review.json',r)
else:r=load(out/'review.json');validate(r)
faults=[]
for mode in ['missing-row','altered-evidence','lost-limit','false-history-pass']:
 q=copy.deepcopy(r)
 if mode=='missing-row':q['items'].pop()
 elif mode=='altered-evidence':q['items'][0]['evidence'][0]['text']='incorrect'
 elif mode=='lost-limit':q['items'][0]['remaining']=''
 else:q['fullHistoryReconciled']=True
 try:validate(q)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
c={'status':'PASS SOURCE ACCOUNTING; SCIENTIFIC GATES OPEN','rows':35,'faultChecks':faults,'reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__))}
f=out/'check.json'
if f.exists():assert load(f)==c
else:write(f,c)
# Separate accounting index over every stable table ID, retaining each prior review.
reviews=[('campaign3-history-retirements-rev1',14),('campaign3-history-controls-rev1',10),('campaign3-history-corpus-rev1',15),('campaign3-history-proposals-rev1',12),('campaign3-history-mechanisms-rev1',35)]
index=[]
for folder,count in reviews:
 f=p/folder/'review.json';review=load(f);assert len(review['items'])==count
 for x in review['items']:index.append({'id':x['id'],'review':f.as_posix(),'reviewSha256':sha(f),'source':x['source']})
expected=set(re.findall(r'^\| `(SUB-\d+|MEC-\d+|EXP-\d+|P3-\d+|CTL-\d+|RET-\d+)` \|',(b/'sources'/ledger).read_text(encoding='utf-8-sig'),re.M))
assert len(index)==len(expected)==86 and {x['id'] for x in index}==expected
inventory={'status':'86 STABLE IDS ACCOUNTED; NOT86 CLOSED FINDINGS','entries':index,'limits':'All remaining fields and proof gaps still bind. Non-table ledger prose and wider source universe are not disposed by this index.'}
f=out/'stable-id-index.json'
if f.exists():assert load(f)==inventory
else:write(f,inventory)
print(json.dumps({'check':c,'stableIds':86}))
