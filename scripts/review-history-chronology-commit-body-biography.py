"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-commit-body-biography-rev1'
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
 (2190, 2225, 'COMMIT',evidence('CAMPAIGN3_COMMIT_QUALIFICATION.md'),'Four models10 runs70 prefixes join actually earned fixed identity+3 with concrete lifecycle baseline reason counts0/1/0/1/1. Training contribution held byte-identical across models/probes; standing creates no ground without active instance. CoreNeed recurring-drive proxy1/1/1/1/1 is erroneous commitment-as-Need hypothesis,not physiological qualification;Immortal0/1/1/2/2 andReusedId wrongA recurrence distinct. Lifecycle30 writes140,next context/choice only; cancellation does not erase identity,newB not resurrectA. Selective actual messages support positive observer learning; unobserved retirement leaves stale Active belief. Inspection removes research probe ordinal but preserves actual permitted support IDs; not whole raw omniscient output equality.27 focused and144 affected/328 reference not additive new cases. RO018 five named debts closed bounded,not BODY/BIO/Brief. No universal standing calibration,delegation or general commitment theory.'),
 (2226, 2261, 'BODY OWNERSHIP',evidence('CAMPAIGN3_BODY_OWNERSHIP_QUALIFICATION.md'),'Six existing source models16 public runs79 source prefixes feed five component candidates,not five new public models or80 independent source runs. MeterBehindSensor matches mediated sampled pressure; storage itself not forbidden. IndependentNeed reads hidden meter and fails alias/availability. AuthoredReference misses dynamics but does not reject REG operating-point role. CachedEvidence replaces entirely including Unavailable and matches samples,not proof against other acquired dynamics. Bodies41/49 same interval pressure0; width change alters safe estimate. Delivery110 cannot retroactively relieve earlier pressure; saturation/overflow/refill/partition invariance retained.47 affected includes10 new,328 reference/build. Pre-freeze type correction not failed behavioral cohort. RO008 immediate comparison discharged,broader conditional; no root retired/general physiology/action efficacy claim.'),
 (2262, 2298, 'BIOGRAPHY COUPLING',evidence('CAMPAIGN3_BIO_QUALIFICATION.md'),'BIO is earned biography,not biological system. Six component candidates13 ordered cases260 component prefixes start empty;early seeds6/0 differ,probe255 shared,nondecision254 matched. Earned histories differ later standing/intents;baseline probes Auto,feedback ablations actually roll common seed. One contradiction weakens,twelve reverse under explicit calibration. DisplayOnly/HistoryOnly same choices with display difference;Refold exact full-history equality not compression;RecomputedHistory violates frozen meaning. First32-seed calibration had0/0 modifiers and insufficient authorship;all failed and revised32 cohorts/contrary attempts retained. Missing canonical identities corrected by separate frozen identity supplement and13 complete reruns matching original final hashes;ordered coupled repeat intentionally duplicates identity. Original matrix not retroactively identity-complete;no new public factory/seed-routing admission. PlanREV3 stale prose correction in unexecuted predecessor not relabelled behavior. RO009 conditional broader biography,21-member bounded coverage not all15families/exit.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE COMMIT BODY BIOGRAPHY ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-commit-body-biography.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Earned identity strengthens an existing commitment without creating its existence.', 'blockedClaim': 'Standing is a recurring Need or retirement erases identity.', 'reopen': 'Broader lifecycle requires concrete instance and selective observer controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Stored physiology and character evidence have different authority.', 'blockedClaim': 'Scalar storage itself violates architecture or sampled cache equality permits general reduction.', 'reopen': 'New dynamics/reductions require admitted-source and independent-history comparisons.'}, {'owner': 'RO-C3-020', 'distinction': 'Biography component qualification differs from biological systems and public admission.', 'blockedClaim': 'BIO closure qualifies physiology or canonical public seed-routing.', 'reopen': 'Extensions require separately accepted sources,owners and public gates.'}, {'owner': 'RO-C3-020', 'distinction': 'Original component replay lacked instantiated canonical identities.', 'blockedClaim': 'Later metadata alone retroactively completes the original research package.', 'reopen': 'Qualification requires frozen supplement and actual identity-bound rerun evidence.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
