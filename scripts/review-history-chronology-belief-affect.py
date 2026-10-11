"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-belief-affect-rev1'
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
 (1501, 1543, 'BELIEF',evidence('CAMPAIGN3_BELIEF_QUALIFICATION.md'),'Nine models48 runs381 prefixes qualify controlled displayed binary evidence,sole-owner140 learning and next50 goal-relative appraisal. Fixed false truth/different displays givesmean1/0;goalonly preserves belief. Eight misleading trialsmean1weight8diagnostic8/9 thencontradictions8/17;diagnostic can rise with conflict,not calibrated correctness. Observed complete monitoring distinguishes safe negative from no-opportunity,censoring,silence. Scalar lowerbound/currentlane remain unqualified. TruthLookup/GoalAsBelief/UnconditionalAbsence researcher arithmetic controls,not illegal public readers. LastObservation serious,NoLearning ablation.101 distinct tests=99 initial plus final17 overlap,not116. All visible samples admitted,controlled condition identities not general attention/recognition.'),
 (1544, 1582, 'AFFECT ARITHMETIC',evidence('CAMPAIGN3_AFFECT_QUALIFICATION.md'),'81cells243 arithmetic evaluations and6 component tests retain HistoricalProduct/SplitExposure/ScalarUncontrolled;no public models,allocation or verdict at this checkpoint. Equal uncontrolled threat may hide exposure but does not prove vector necessity. Generic BELIEF channelB and option availability do not establish mitigation efficacy. Source gate requires observed trial membership/action/outcome and independent unknown versus ineffective control before public integration.'),
 (1583, 1614, 'AFFECT RUNNING',evidence('CAMPAIGN3_AFFECT_QUALIFICATION.md'),'Accepted source/public contract15 stages18 models91 planned runs and18 integrated tests are dated running status,not final1236-prefix qualification. Conditional estimates derive actual perceived trial membership/action/outcome;no source-index or hidden-action repair. Derived affect modifies genuine adopted commitment grounds through inherited choices. RO011 stays active until final matrix/verdict;no new verdict follows preliminary tests.'),
 (1615, 1654, 'AFFECT QUALIFIED',evidence('CAMPAIGN3_AFFECT_QUALIFICATION.md'),'Eighteen models91 main runs1236 prefixes,14 supplementary executions=8 timing6 interior not additional distinct main runs/restores.48 public factorial cells independent likelihood,severity,vulnerability,control;learned efficacy distinct availability;baseline0 makes efficacy unknown,knownineffective0 differs. Missing action not inaction,missing panel continuity not repaired by hidden ancestry;one episode maxone estimate. Equal affect differing competing goal changes choices2/8 seeds;no safety base no affect reason. Strictly later feedback completed13 affects14;all3 candidates interior1/2to5/8,so scalar full-control zero not inability to feedback. Relief changes reserve/appraisal not danger belief. Researcher-side FearAsCommand/ExtraDie/ReliefAsEvidence not public boundary violators. Receiving maps do not establish vector necessity.82 distinct affected22new60inherited;timeoutREV1 preserved. Fixed severity/goals,training versus attempts,catalogue/context carry not general planning/memory/physiology;TaskConcern not general affect.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography','reason-decision','audit-learn-epi','habit-relationship-long','workspace-skill-social']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR BELIEF AFFECT ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-belief-affect.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-010', 'distinction': 'Accumulated evidence weight can increase while beliefs conflict.', 'blockedClaim': 'Confidence diagnostic is calibrated correctness or binary censoring solves scalar bounds.', 'reopen': 'Calibration/new evidence classes require independent tests and update laws.'}, {'owner': 'RO-C3-020', 'distinction': 'Mitigation efficacy requires observed contextual trial evidence distinct from availability.', 'blockedClaim': 'A known option or attempted action supplies efficacy knowledge.', 'reopen': 'New control sources must preserve trial/action/outcome admission and ownership.'}, {'owner': 'RO-C3-020', 'distinction': 'Scalar interior feedback and independent factors do not prove vector necessity.', 'blockedClaim': 'Full-control zero makes scalar feedback impossible or receiving map establishes irreducible affect dimensions.', 'reopen': 'Reduction claims require broader matched receivers and factor/feedback controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Affect modifies grounded reasons and later appraisal without supplying truth evidence.', 'blockedClaim': 'Relief updates danger belief or affect commands action/manufactures motives.', 'reopen': 'New consumers require causal ordering and independent motive/evidence controls.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
