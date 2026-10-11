"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-embarrassment-bridge-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
    p=O/n
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
roles={x['path']:x for x in load(P/'campaign3-history-source-roles-rev313/index.json')['roleAssignments']}
def evidence(*names):
    result=[]
    for name in names:
        p=P/name;r=roles[p.as_posix()]
        assert ref(p)['sha256']==r['sha256']
        for x in r.get('evidence',[]):assert ref(x['path'])['sha256']==x['sha256']
        result.append(dict(**ref(p),sourceRole=r))
    return result
sections=[
 (5419,5458,'CHOSEN REAPPRAISAL PUBLIC',evidence('CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md'),'Four models/43 native runs/387 prefixes reproduce component rows and RNG through twelve stages with separate goal,learning and frame owners. Frame consumes prior carried knowledge; later learning cannot retroactively author it. Interrupted completion gives no frame; NoReappraisal keeps choice/completion without application; KnowledgeOnly can increase later affect. Conditional protection is an appraisal frame,not physical protection. Competing work has no qualified external work outcome. Original-input replay and Failed rollback close bounded admission,not general planning or Task/Biological integration. Preserve first row-extraction helper failure.'),
 (5459,5494,'EMBARRASSMENT COMPONENT',evidence('CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md','CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md'),'Six models/69 distinct runs/483 component prefixes separate self mismatch,evaluator awareness and learned judgment from hidden truth. Five of eight fine-calibration seeds participate despite positive affect and an avoidance base; removing only participation goal causes withdrawal with same belief/affect. Failed withdrawal preserves intent and physical presence,not chosen participation. Affect modifies positive bases; no goals/opportunity gives no choice. Known zero differs from absent judgment. JudgmentOnly negative affect is not automatically embarrassment. Coarse calibration showed phenotype but equal Contextual/NoAffectReasons probabilities; later fine calibration changes seed2 action. Retain CoarseUnit and scalar projection; equal coordinates do not prove scalar sufficiency. DisplayOff leaves private choice/expression unchanged; zero cue is not missing. Preserve decoder408 failure and condition aliases; no physiological cue or norm-learning claim.'),
 (5495,5533,'NATIVE IMPLEMENTATION OPEN',evidence('CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md','CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md'),'Records1468..1484 and accepted native0.2 contract are implementation progress,not a new verdict. Repeated69/483 component counts do not become native evidence by placement under an implementation heading. Rejected0.1 scheduled display115 outside allowed phases:21 failed/1 passed did not establish reached-fault rollback. Native0.2 reruns actual reached faults and supplies original-input Save132 admission. Preserve the rejected cohort rather than treating it as psychological failure.'),
 (5534,5568,'NATIVE EMBARRASSMENT CLOSED',evidence('CAMPAIGN3_EMBARRASSMENT_PUBLIC_QUALIFICATION.md'),'Six models/69 native runs/483 prefixes match all component rows,RNG and physical presence. Goal1471,report1474 and presence1476 retain separate owners. Complete110 precedes separate child display110 by authenticated parentage,not phase115. Frozen summary copied next-instant frame wording erroneously; no frame state exists and actual report learning affects next appraisal. Keep the erratum without rewriting frozen metadata. Diagnostic physical transition1484 is excluded from safe observer views; Failed remains Failed; restore reexecutes typed originals rather than installing parsed state. Wrapper52/55 closes this admission scope,not a new psychological law,Task/Bio join or whole campaign.'),
 (5569,5605,'DEFINING MEMORY BRIDGE',evidence('CAMPAIGN3_DEFINING_MEMORY_BRIDGE_QUALIFICATION.md','CAMPAIGN3_DEFINING_MEANING_QUALIFICATION.md','CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md'),'Four models/288 component cases/864 repeated stages use actual GA37/38 acquisition with equal age/use and earned significance. Capacity1 SignificanceFirst preserves and recalls original time5 versus others time35; this earns bounded tier usefulness,not universal necessity. Capacity8 retains without selecting. Capacity0 has no archive fallback; absent cue gives no reads; unrelated cue may recall under unchanged ranking. Clock40/400/4000 idle probes are not active long-horizon simulation. Binary significance is not general current importance. Preserve rejected Set/List adapter cohort. Bridge lacked different goals,current fallible evidence,counted rehearsal and native continuation; later meaning/public qualification resolves those named scopes while retaining carried cue,empty graph and scheduled baseline limits.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FIVE EMBARRASSMENT/BRIDGE ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-embarrassment-bridge.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Affect,competing motive,intent,physical presence and display are separate.', 'blockedClaim': 'Failed withdrawal equals choosing participation,or an affect phenotype alone proves causal choice influence.', 'reopen': 'A new calibration or consumer must preserve matched goal and no-affect controls.'}, {'owner': 'RO-C3-021', 'distinction': 'Failed phase115 cohort and frozen frame-summary erratum are not final native semantics.', 'blockedClaim': 'Pre-handler failure proves reached rollback,or embarrassment contains a learned frame owner.', 'reopen': 'Any reuse must bind native0.2 actual stages and typed owner schema.'}, {'owner': 'RO-C3-020', 'distinction': 'Retaining an old significant event differs from selecting it and from current meaning.', 'blockedClaim': 'Capacity8 retention proves recall,or idle clock probes establish active long-horizon cognition.', 'reopen': 'New access,importance or active-horizon claims require their own evidence.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
