"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-habit-relationship-long-rev1'
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
 (1785, 1829, 'HABIT',evidence('CAMPAIGN3_HABIT_QUALIFICATION.md'),'Twelve models23 runs291 prefixes separate admitted performed history from explicit reward expectation. Informational correction changes expectation without reinforcing action;neutral competitor gives1/2 availability-mediated persistence,not stronger compulsive preference. Residual/Linear differ;NoHistory/ExplicitBeliefOnly insufficient matched witness but not inherently unlawful;CurrentRewardOnly hidden truth violation. False positive reports train despite actual nonreward;unobserved acts add no admitted history. DerivedHistory/StoredSummary equal all three laws with complete journal retained;cache not required does not permit journal discard/general episodic reduction. Shared evidence may update separate owners simultaneously;admission not universal conscious-awareness requirement. Identity/body0 skill1 controls not integrated dynamics.'),
 (1830, 1873, 'RELATIONSHIP',evidence('CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md'),'Eleven successor models24 runs256 prefixes yield effective contact contrast under equal current person estimate but different own history. Proposed option selection not enacted social action. Positive willingness claim not causal correction/repair;absence not breach or grief. Witnessing does not create own participation;SharedHistory fails isolation and simultaneous transactions,not all shared storage. Derived/cache equality retains full journals;observer-order comparison normalizes1156 provenance only,hidden/nonrecipient comparisons exact unnormalized. Original0.1 24-run matrix failed effective-response despite changed appraisal fields because unit1 truncated modifiers;0.2 unit1/4cap3 changes calibration in new frozen11 models,old11 replayable. No universal trust/attachment law or history compression.'),
 (1874, 1895, 'LONG RUNNING',evidence('CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md'),'Dated0.2 implementation running29-case matrix with8 public/rollback tests is not final qualification32-run/513-prefix evidence. Preserved0.1 standing cohort and workspace adapter failure remain distinct. Kernel composition actual biography,skill,relationship and episode expiry does not by itself complete comparison/public restoration gates. No lifelong or whole campaign claim.'),
 (1896, 1936, 'LONG QUALIFIED',evidence('CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md'),'Fifteen models32 runs513 prefixes=29 main plus3 prospectively planned execution probes. One actor/scheduler acquires biography,skill,relationship from empty state;episode expiry leaves compact learned structure but minimal identity journal remains. Full/compact equal learned projections/effective biography decisions,not accessible detail/all social queries. EpisodicOnly/sharedslot fail specific shortcuts,not every shared physical store. Skill-only interference subtracts1/4;retained early practice then renewal1/2 versus removed early1/4 under NoRust,distinct HalfAtGap also1/4. Execution17 uses pre-update skill,not retroactive140. ObserverView includes actual competence,research diagnostic not character evidence/authentication;skill held fixed for hidden interaction tests. Adapter capacity2 selected one task,capacity3 restores uncertainty;0.1 acquired identity but symmetric/coarse standing inert,0.2 alignment/unit1/16 candidate not law. Preserve nondiscriminating difficulty and original terminal replay. Audit intake requires mandatory denominator,independent findings,reduction/query bounds and semantic transfer without final state topology.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography','reason-decision','audit-learn-epi']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR HABIT RELATIONSHIP LONG ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-habit-relationship-long.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'History-derived cache equality assumes complete journals and fixed folds.', 'blockedClaim': 'Cache redundancy proves safe history deletion or general episodic equivalence.', 'reopen': 'History loss,new folds or provenance queries require renewed comparison.'}, {'owner': 'RO-C3-020', 'distinction': 'Changed appraisal fields need not change effective response.', 'blockedClaim': 'Structural trace difference alone proves behavioral usefulness.', 'reopen': 'Qualification requires effective probability/action witnesses and preserved inert cohorts.'}, {'owner': 'RO-C3-020', 'distinction': 'Compact learned projections can match while accessible details differ.', 'blockedClaim': 'Finite LONG equality establishes lifelong or all-query equivalence.', 'reopen': 'New horizons/provenance queries require independent acquisition and retention evidence.'}, {'owner': 'RO-C3-020', 'distinction': 'Actual competence diagnostics and pre-update execution differ from self-belief.', 'blockedClaim': 'ObserverView is character-safe or renewed practice retroactively enabled execution.', 'reopen': 'Self-assessment/character consumers require admitted evidence and causal ordering.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
