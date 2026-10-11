"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-agency-intake-rev1'
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
 (2299, 2339, 'BRIEF FRONTIER INTAKE',evidence('CAMPAIGN3_BRIEF_FRONTIER_INTAKE.md','CAMPAIGN3_AGENCY_QUALIFICATION.md'),'Risk-ordered Stage A sequence prioritizes agency before goals because causal credit can invalidate multiple downstream systems. It preserves all132 exact REV9 clauses15 families and21 corpus members; routing neither qualifies nor excludes a clause. Not Campaign4 general reduction ranking,no final law/edge/implementation/allocation. Packages may reorder for actual failed witnesses/dependencies with reasons,not ease or invented numeric score. Post-choice obstruction does not settle pre-choice coercion. Skill remains preserved bounded controls. Dated45/39/48 coverage and31 verdicts are historical,not current status.'),
 (2340, 2381, 'AGENCY SOURCE KERNEL',evidence('AGENCY_INTERFERENCE_SOURCE_CHECKPOINT.md','CAMPAIGN3_AGENCY_QUALIFICATION.md'),'Eight focused boundary tests and no-emit check establish pure source development,not public registered qualification or actual generated decision. Frozen intent is supplied input; failure alone gives no causal evidence; blocked competent/incompetent views equal without proving unblocking success. Unique visible reports deduplicate; GroupedMean1/2 versus LastClaim0 retained. The checkpoint next-step intent/expression80 and attempt90 is historical provisional routing,not final exact phase authority. Final agency0.3 explicitly establishes intent70/expression80/plan90/attempt100/execution110 after preserved phase correction. No coercion,general prediction/trust,allocation or new verdict.'),
 (2382, 2430, 'AGENCY NONRECIPIENT CORRECTION',evidence('CAMPAIGN3_AGENCY_QUALIFICATION.md','CAMPAIGN3_AGENCY_QUALIFICATION.md'),'Running correction snapshot combines pending PlanREV2 and draftREV10 coverage with appended19-run71-prefix completion. First17-run PASS missed a report-to-A shifting later B occurrence IDs; failure receipt and exact sources preserved.0.2 equal empty reservations repair later safe-view provenance without giving denied observer evidence. Draft closure/auditREV10 superseded; appended0.2 matrix completion is not final0.3 authority because separate later intent80 versus70 failure remains. Final0.3 PlanREV3/ResultREV3/ClosureREV2 supersedes both cohorts. No reinterpretation of proof failures as psychological candidate falsification; bounded attribution/obstruction does not imply coercion,blame or cross-episode expectation.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE AGENCY INTAKE ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-agency-intake.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Risk routing preserves denominator but is not qualification.', 'blockedClaim': 'Prioritized package or completed intake closes family coverage.', 'reopen': 'Coverage claims require actual accepted witnesses and preserved clause mapping.'}, {'owner': 'RO-C3-020', 'distinction': 'Source kernel receives frozen intent rather than generating it.', 'blockedClaim': 'Eight boundary tests establish actual choice or public replay qualification.', 'reopen': 'Integration must bind actual upstream owners and canonical identities.'}, {'owner': 'RO-C3-020', 'distinction': 'Historical next-step phase prose differs from final corrected exact contract.', 'blockedClaim': 'Source checkpoint intent80/attempt90 overrides final intent70/attempt100.', 'reopen': 'Phase claims require accepted contract and actual producer traces.'}, {'owner': 'RO-C3-020', 'distinction': 'Later provenance can leak despite no received content and an earlier passing matrix.', 'blockedClaim': 'No receipt or initial17-run PASS proves whole later observer invariance.', 'reopen': 'New source paths require common later observations and exact provenance comparisons.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
