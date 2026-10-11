"""Post-cutoff Values authority/claim reconciliation; never alter the frozen census."""
from pathlib import Path
import json,hashlib,re,subprocess,collections
P=Path('docs/planning');O=P/'campaign3-history-values-addition-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=str(p).replace('\\','/'),sha256=sha(p))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def identity(path,h,location,text):return hashlib.sha256(json.dumps([path,h,location,text],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
core=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']
groups={}
def spec(path,expected,parts):
 mapping={}
 for indices,role,judgment in parts:
  for i in indices:assert i not in mapping;mapping[i]=(role,judgment)
 assert set(mapping)==set(range(expected));groups[path]=(expected,mapping)
H='NAVIGATION';R='HISTORICAL ROUTING';L='PRESERVED LIMIT';E='BOUNDED EVIDENCE';C='ACCEPTED CANDIDATE CONTRACT';F='PRESERVED FAILED COHORT'
spec('docs/planning/VALUES_READINESS.md',19,[
 ([0,2,5,10,13],H,'Section label, not a separate scientific finding.'),
 ([1,17],R,'Readiness preceded the two Values verdicts. Those bounded successors supersede missing component/native gates only; HQ011 and broader topology stay open.'),
 ([3],E,'Unmaterialized Campaign2 family is a scoped ownership gap, not universal absence. Later Values uses new owners; frozen Campaign2 registration remains unchanged.'),
 ([4,8],C,'Canonical Consolidation-to-Values already permits the edge. Historical Need-derived formula and refold are candidates; existing ADAPT owner is not broadened.'),
 ([6,7,9,12],L,'Controlled category/outcome and actual inherited arbitration are bounded fixtures. No learned recognition, moral understanding, universal currency or primitive Value necessity; NeedOnly/refold equalities retained.'),
 ([11],L,'All ten readiness cases are separately crosswalked below. Controlled evidence and forbidden-field tests do not discharge physical-world cases2/3 or autonomous goal retirement in7.'),
 ([14,15],R,'Component0.2 external-original matrix and later public0.1 gate discharge named finite ownership/replay stages. Preserve rejected0.1 adapter and all candidate laws.'),
 ([16],L,'Learning plasticity and personality-authorship weighting are independent owner requirements. Neither is tested by this Values fixture; no age closure.'),
 ([18],C,'Existing escalation policy permits bounded law/control choices; epistemic/ontology/causal-edge changes still escalate.')])
spec('docs/planning/VALUES_COMPONENT_IMPLEMENTATION_CHECKPOINT.md',6,[
 ([0],H,'Historical component checkpoint title.'),([1,5],R,'Pre-matrix OPEN state was accurate then; only bounded component0.2 and public0.1 successors discharge it. Wider audit remains.'),
 ([2],E,'Internal replay/projections were tested but external-original authenticity was not yet earned. REV2 later adds externally committed originals.'),
 ([3],L,'Joint complete overlap is one shared contribution, not arbitrary provenance fusion. NeedOnly keeps expectation independent of NoConsolidation. Standing/physical/appraisal claims absent.'),
 ([4],F,'17-test checkpoint and pre-final-cache-edit build are historical. Configuration discovery failed before assertions; later successful scopes do not rewrite earlier source/build timing.')])
spec('docs/formal/VALUES_COMPONENT_CONTRACT.md',10,[
 ([0,8],H,'Versioned component heading; preserve existing bytes including header encoding.'),([1,2,3],C,'Finite Care/receipt/time domains and sole prospective consolidation preserve absent versus neutral and strict prior reads. Bounds are fixtures, not lifetime/resource laws.'),
 ([4],C,'Accumulated/Refold s/(n+1), Latest x/2 and NoConsolidation0 remain separate. Evidence weight is not correctness probability; Refold retains complete originals.'),
 ([5],L,'Inherited reason/arbitration law and empty basis carrier; Joint max-absolute with Value tie is complete-overlap only. Current Need0/1 and independent controlled goal do not establish a universal exchange rate.'),
 ([6,7],R,'Internal canonical replay requirements were component gates. Contract0.2 successor and REV2 add externally committed original-prefix checks; native Save132 remains distinct and later qualified separately.'),
 ([9],F,'Deadline65 exposed the chosenData assumption. Four rejected partitions, no completed run; corrected0.2 retains NoCandidates/NoReasons/Chosen and eligible64/expired65, without erasing preference.')])
spec('docs/planning/CAMPAIGN3_VALUES_QUALIFICATION.md',15,[
 ([0,2,7,11],H,'Bounded component qualification section label.'),([1],E,'VER-C3-VALUES-001 accepts component0.2 only; no native or whole Values qualification.'),
 ([3,4],E,'Admitted linked outcomes acquire3/4, revise2/5 versus Latest-1/2, and reverse-2/9. Unknown/neutral and expectation versus suppressed Value remain distinct.'),
 ([5],L,'Same-instant component demand0 comparison:3/8 chosen differences and5/8 equal; demand1 NeedOnly and complete-overlap Joint equal ValuesOnly. No independent necessity inferred.'),
 ([6],L,'Stored/refold projection and receiving equality supports this view derivation with complete retained history and bounded queries/horizon, not role retirement or lifetime compression.'),
 ([8,9],E,'Four models256 runs1248 prefixes:992 input successors include32 duplicate no-ops;256 terminal gap successors.1536 contexts; one successor, not full tails. Historical tests/build remain original evidence.'),
 ([10],F,'Preserve REV1 four terminal65 failures before any run completed and pre-freeze import discovery failure. Concurrent port diagnostics do not substitute for receipts.'),
 ([12,13],L,'Controlled categories/goal/evidence exclude physical action-feedback, learned recognition, autonomous lifecycle, general correlations, appraisal and age. Forbidden truth fields are not a physical-world invariance experiment.'),
 ([14],R,'Public gate subsequently qualified separately.107 then108 named verdicts do not alter frozen106 AuditREV111, corpus or wider exit obligations.')])
spec('docs/planning/VALUES_PUBLIC_READINESS.md',7,[
 ([0],H,'Public gate heading.'),([1,3,5],R,'Prospective public gate is discharged only by native0.1 source/owner/Save132/fault/publication matrix. No retroactive Campaign2 registration changes.'),
 ([2],L,'Keep four laws and expectation/Need/goal/identity distinctions despite shared-history equivalence.'),
 ([4],C,'Typed source40, separate prior receiver and sole140 writer, Refold root absence, inherited lifecycle, exact originals and publication are native proof requirements, not component properties by inference.'),
 ([6],L,'Physical feedback, learned categories, autonomous goals, appraisal, calibration and both developmental requirements remain outside native closure.')])
spec('docs/formal/VALUES_PUBLIC_CONTRACT.md',8,[
 ([0],H,'Native contract heading.'),([1,7],R,'Pre-implementation contract/allocation is not execution proof. Later public matrix/wrapper qualifies its finite declared scope; records1509..1519 and counters1519/11 become1519/0 after verdict.'),
 ([2,3,4],C,'Empty journal, four laws, strictly prior52/60 reads and sole140 ownership;40 authenticates originals. Refold omits1517. Generated-event authority and transactional RNG preserve causal order.'),
 ([5],L,'Typed1519 receiving is not identity or arbitrary fusion; choice1515 contains no physical execution or implicit learning.'),
 ([6],C,'Originals/empty marker/zero run-seed bind identity; probe seeds explicit. Whole Save132 replay, Failed rollback, safe projection and publication are mandatory finite runtime semantics.')])
spec('docs/planning/VALUES_PUBLIC_IMPLEMENTATION_CHECKPOINT.md',10,[
 ([0],H,'Historical native checkpoint title.'),([1,5,9],R,'RUNNING was historical. Public check now accounts256 runs/3040 prefixes, not inferred from the earlier plan. AuditREV111 and exit remain open.'),
 ([2,3,4],E,'Separate ownership/prospective tests and55/58 wrapper inventory were implementation evidence. Full matrix is separately bound; predecessor wrapper scopes stay fixed.'),
 ([6],L,'Native contexts59..64 have changed time addresses. Distributions are compared with declared operands; cross-context sampled differences are not controlled same-instant evidence.'),
 ([7],F,'Preserve allocation syntax/import/forgery-test/syntax-test findings. Port notices neither fail nor qualify runs. Rejected sources remain exact.'),
 ([8],L,'Controlled category/evidence, absent physical feedback/appraisal/age and no law selection remain after native closure.')])
spec('docs/planning/CAMPAIGN3_VALUES_PUBLIC_QUALIFICATION.md',15,[
 ([0,2,5,10],H,'Bounded native qualification section label.'),([1,3,4],E,'Native0.1 realizes prior receiver and sole140 writer for four laws; actual component correspondence, unknown/neutral, duplicate rules and Refold root absence qualify only bounded admission.'),
 ([6,7,8],E,'256 programs2784 instants11136 stages3040 prefixes/2784 advancing256 terminal;1536 contexts.31+328 historical tests/build and55/58 wrapper checks are distinct from new audit checks. One successor, not tails or entire65-instant domain.'),
 ([9],F,'Rejected factory/test sources and failures remain linked. No behavioral failure filtered from native matrix; startup notices are not evidence receipts.'),
 ([11],L,'Preserve native different-time limitation and independent unchanged-component equality at each actual instant. Component3/8 difference5/8 equality remains same-instant evidence.'),
 ([12],L,'No physical feedback, learned categories, autonomous goals, general provenance, appraisal, age or Values irreducibility. NeedOnly/Joint equality and frozen Campaign2 Unmaterialized family remain.'),
 ([13,14],R,'108/102 verdict counts and55/58 wrapper scope are current;106-verdict AuditREV111 stays frozen. Historical HQ004 routing subsequently progressed; HQ011 and Campaign3 exit are not completed here.')])
entries={e['path'] for e in load(P/'campaign3-history-universe-rev1/manifest.json')['entries']};rows=[];sources=[]
for path,(expected,mapping) in groups.items():
 assert path not in entries
 raw=Path(path).read_bytes().decode('utf-8-sig');h=sha(path);blocks=list(re.finditer(r'\S[\s\S]*?(?=\r?\n[ \t]*\r?\n|\Z)',raw));assert len(blocks)==expected,(path,len(blocks))
 for i,m in enumerate(blocks):
  text=m.group();loc=dict(startLine=raw[:m.start()].count('\n')+1,endLine=raw[:m.end()].count('\n')+1);role,judgment=mapping[i]
  rows.append(dict(occurrenceId=identity(path,h,loc,text),source=path,sourceSha256=h,location=loc,text=text,role=role,disposition=judgment,postCutoff=True,obligations=core))
 sources.append(dict(**ref(path),role='WHOLE POST-CUTOFF NARRATIVE/CONTRACT REVIEW',paragraphs=expected))
# Ten original work-order cases retain unmet portions; bounded verdicts do not silently
# promote requirements whose stronger physical/autonomous phenomenon was never run.
crosswalk=[
 (1,'BOUNDED PASS','Empty/positive input, independent expectation/preference/contribution/choice inspected across four laws.'),
 (2,'PARTIAL; STRONGER PHYSICAL CASE OPEN','Withheld outcome does not acquire, but no physical world is simulated. Same physical outcome with withheld observation remains unexecuted.'),
 (3,'PARTIAL; STRONGER PHYSICAL CASE OPEN','Forbidden truth fields reject and source is admitted evidence only. Different private physical outcomes with equal evidence was not enacted.'),
 (4,'BOUNDED PASS','Gap and targetA/B preserve supplied Care membership. Controlled membership is not learned recognition or generalization.'),
 (5,'BOUNDED PASS','Neutral mean0 with positive weight differs from unknown mean null.'),
 (6,'BOUNDED PASS','Accumulated2/5 versus Latest-1/2 after contradiction, accumulated-2/9 after sustained reversal; all seeds retained.'),
 (7,'PARTIAL; AUTONOMOUS LIFECYCLE OPEN','Need/goal probe changes preserve retained view; inherited carrier expiry65 does not erase Value. Autonomous goal completion/retirement is not simulated.'),
 (8,'BOUNDED PASS; GENERAL PROVENANCE OPEN','ValuesOnly/NeedOnly/Joint use a declared complete-overlap channel with fixed absent standing. Equality is preserved; no arbitrary correlation solution.'),
 (9,'BOUNDED PASS','Missing category prevents acquisition/use; no inferred person-to-category transfer.'),
 (10,'BOUNDED PASS','Externally committed component originals1248 prefixes and native Save1323040 prefixes, duplicates/conflicts and rollback; one successor per prefix only.')]
crosswalk=[dict(case=n,status=status,disposition=d,obligations=core) for n,status,d in crosswalk]
failureRefs=[]
for n in [0,64,128,192]:
 p=P/f'values-matrix-rev1/failure-{n}.json';v=load(p);assert v['index']==n and v['error']=='SchedulerContractError: chosen resolution required';failureRefs.append(ref(p))
assert not list((P/'values-matrix-rev1').glob('run-*.json'))
pres=P/'values-public-development-rev1/preservation.json'
for a in load(pres)['artifacts']:assert sha(a['path'])==a['sha256'],a['path']
findings=[]
for p in [P/'values-matrix-rev1/development-finding.json',P/'values-matrix-rev2/development-finding.json',P/'values-public-development-rev1/findings.json',P/'values-component-development-rev1/checkpoint.json']:
 v=load(p);texts=[]
 for k in ['finding','notices','developmentFindings','findings','limits']:
  if k in v:
   for i,text in enumerate(v[k] if isinstance(v[k],list) else [v[k]]):texts.append(dict(location=dict(pointer='/'+k+('/'+str(i) if isinstance(v[k],list) else '')),text=text))
 for x in texts:x['occurrenceId']=identity(p.as_posix(),sha(p),x['location'],x['text'])
 findings.append(dict(**ref(p),role='REVIEWED FINDING/LIMIT FIELDS; METADATA NOT SILENTLY WHOLE-QUALIFIED',occurrences=texts,disposition='Preserve original failure stage and scope. Corrected successors do not rewrite pre-freeze/compile failures, wrong forgery test shape, pre-final-edit build timing or unimplemented broader phenomena.'))
commands=[]
for tool in ['check-values-matrix.mjs','check-values-public-matrix.mjs','check-values-wrapper-extension.mjs']:
 command=['node','scripts/'+tool];r=subprocess.run(command,capture_output=True,text=True,encoding='utf-8');assert r.returncode==0,(command,r.stderr)
 commands.append(dict(command=command,exitCode=r.returncode,stdout=r.stdout,stderr=r.stderr,checker=ref(command[1]),scope='READ-ONLY STORED MATRIX/PUBLICATION EVIDENCE; NO FRESH SIMULATION'))
evidence=[ref(P/'values-matrix-rev2/check.json'),ref(P/'values-public-matrix-rev1/check.json'),ref(P/'VALUES_WRAPPER_EXTENSION_REV1.json'),ref(pres),ref(P/'campaign3-history-verdict-spine-rev1/review.json')]
v=dict(status='VALUES POST-CUTOFF CLAIMS REVIEWED; HQ011 OPEN',sourceRoles=sources,rows=rows,readinessCrosswalk=crosswalk,findingFields=findings,rejectedMatrixReceipts=failureRefs,evidence=evidence,obligations=core+['RO-C3-022'],limits=['These90 post-cutoff narrative/contract paragraphs are separate from original413894 census occurrences and do not increase original assigned-source totals.', 'Earlier verdict-spine review already preserved the appended two Values ledger entries; those entries are not counted twice here.', 'This review does not classify all512 component/native run files or every development metadata/test field. Their hash-bound checks substantiate named claims, while wider source adequacy remains open.', 'Readiness cases2/3 and the autonomous portion of7 remain stronger unexecuted requirements, owned under RO019/020/021. The bounded qualification is retained without marking the full work order complete.', 'Age plasticity and personality-authorship weighting remain separate owner requirements; no Value-specific developmental integration is inferred.'])
assert len(rows)==90
O.mkdir(exist_ok=True);save(O/'review.json',v);save(O/'commands.json',commands)
c=dict(status=v['status'],wholePostCutoffSources=len(sources),postCutoffParagraphs=len(rows),findingFieldOccurrences=sum(len(x['occurrences']) for x in findings),originalCensusOccurrencesAdded=0,readinessCases=len(crosswalk),strongerCasesRemaining=[2,3,7],preservedFailedPartitions=4,readOnlyChecks=3,reviewSha256=sha(O/'review.json'),commandsSha256=sha(O/'commands.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
