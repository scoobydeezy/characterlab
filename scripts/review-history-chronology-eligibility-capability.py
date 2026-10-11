"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-eligibility-capability-rev1'
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
 (4403,4422,'INITIAL ELIGIBILITY CLOSURE',evidence('CAMPAIGN3_IDENTITY_ELIGIBILITY_QUALIFICATION.md','IDENTITY_ELIGIBILITY_FINDINGS.md'),'Initial numerical52-run/312-prefix closure is superseded for restricted helper capability,not erased. Actual choice,frozen expression,safe context,qualification and standing remain distinct. Rejected pre-freeze expression426 imposed fixed free-choice context; serialized world permission also had to be removed. Later review found output exclusion still insufficient because helpers received full input. Final REV2 supplies safe-only inputs and reruns unchanged semantic trajectories under changed source-bound identities. No native/public/biological admission or enacted coercion is established at this component stage.'),
 (4423,4465,'ELIGIBILITY BEFORE CAPABILITY CORRECTION',evidence('CAMPAIGN3_IDENTITY_ELIGIBILITY_QUALIFICATION.md','IDENTITY_ELIGIBILITY_FINDINGS.md'),'Six models52 cases312 component prefixes test four actual learning choices then common-seed255 nonlearning probe. Meaningful,trivial and constrained choices match but qualification differs. Four probes differ; seed2 balances to zero and4/5/7 retain nonzero16796/377907 below modifier band,so equal probabilities do not imply absent learning. Work/Home changes motive magnitudes but shares referents/channel,not independently grounded domains. Instruction alone is not coercion; admitted refusal pressure excludes contribution without changing upstream motives in this fixture. Forced movement has no choice/draw/expression; failed execution preserves whole journals. Graded differs at intermediate values,Frequency/IgnorePressure fail exclusions,NoFeedback separates effect and Refold depends on full history. This REV1 routing overstates input authority; subsequent correction preserves evidence and narrows accepted authority.'),
 (4466,4477,'RESTRICTED INPUT CORRECTION',evidence('CAMPAIGN3_IDENTITY_ELIGIBILITY_QUALIFICATION.md','IDENTITY_ELIGIBILITY_FINDINGS.md'),'Output omission and unchanged arithmetic did not prove restricted input access: decision/qualification received world permission in the full object. Preserve development-rev2 source,old closure/report and checker as superseded authority evidence. REV2 builds fresh safe context and isolates world execution helper to intent/permission. New manifest freezes before52 reruns312 prefixes; all rows/snapshots match,while source-bound Model/Run identities change.104 executions624 checks are two cohorts,not104 distinct behavioral cases.60 affected tests/build freshly rerun; unchanged328 reference receipt is reused,not falsely counted fresh. Clause scope/allocation unchanged.'),
 (4478,4525,'FINAL ELIGIBILITY ROUTING',evidence('CAMPAIGN3_IDENTITY_ELIGIBILITY_QUALIFICATION.md','IDENTITY_ELIGIBILITY_FINDINGS.md','CAMPAIGN3_IDENTITY_PUBLIC_QUALIFICATION.md'),'Final REV2 binds restricted input authority and retains both development cohorts and all seed equalities. Triviality clause bounded; cross-domain and coercion clauses still partial at this checkpoint. Biology physical pressure/success is not automatic identity meaning; current withdrawal differs from forecast future abstinence and Full cue absence does not prove universal cue necessity. Public successor later admits richer typed Task/Biological channels independently without reusing fixed free-choice tag. Component312 prefixes remain separate from subsequent native coverage. No root retirement,self-belief or general voluntariness law is implied.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR ELIGIBILITY/CAPABILITY ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-eligibility-capability.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-021', 'distinction': 'Output noninterference and restricted helper input capability require different evidence.', 'blockedClaim': 'Passing numerical/view tests alone establish no hidden-world read capability.', 'reopen': 'Any new composition must inspect admitted input types/objects and preserve superseded authority cohorts.'}, {'owner': 'RO-C3-020', 'distinction': 'Absent identity learning,balanced evidence and nonzero subthreshold standing differ.', 'blockedClaim': 'Unchanged probe probabilities imply no acquired evidence.', 'reopen': 'Receiving-law changes or state reductions must preserve zero and subthreshold controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Controlled significance/pressure and shared task contexts are bounded sources.', 'blockedClaim': 'This component proves natural coercion inference,general voluntariness or independent cross-domain identity.', 'reopen': 'New domain/coercion claims require actual source and interaction evidence rather than renamed contexts.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
