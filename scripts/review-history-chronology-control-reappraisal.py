"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-control-reappraisal-rev1'
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
 (2615, 2658, 'CONTROL',evidence('CAMPAIGN3_CONTROL_QUALIFICATION.md'),'Seven models17 runs142 prefixes qualify maintained-goal inhibition of acquired habit and load failure with unchanged belief,history and competence. Two unit slots are bounded candidate resource rule; neutral card adds no motive. Action witness reexecutes three frozen runs: load5 actually performs habit,no-load5 idle,recovery6 inhibition; not new cases. Load5 addressed draws equal NoInhibition despite earlier different inhibition. Goal retention differs active maintenance; retiring goal exposes unchanged habit,reminder restores access. Residual/Linear acquisition and five controls preserved. Negative belief removes reason without erasing history. First cohort violated inherited HABIT one-reason grammar;0.2 typed two-reason successor refreezes seven identities without widening old codec; no first-cohort public PASS. RNG assurance inherited trace replay,not new incremental ledger qualification. No general fatigue/effort/control law.'),
 (2659, 2701, 'INFERENCE CORRECTION',evidence('CAMPAIGN3_INFERENCE_CORRECTION_QUALIFICATION.md'),'Five reused agency0.3 models15 runs120 prefixes add correction horizon without new source/state/law/allocation. Same episode obstruction support1/1 to1/2 to1/3; LastClaim1/1 to0/1 to0/1 remains comparator. Diagnostic majority labels are research readout,not character thresholds/calibrated certainty. Main incompetence without blocker plus false initial report; negative report rejects obstruction without discovering incompetence. Hidden blocker with same reports makes correction less accurate,proving evidence-relative revision not world repair. Duplicate,denied,absent,foreign-episode reports do not add focal correction; unknown versus conflict versus known zero distinct. Earlier observations and actual intent/expression preserved. Seven new tests versus38 inherited checks not freshly rerun. No culprit,blame,trust,corroboration or general causal discovery.'),
 (2702, 2745, 'INSTRUCTED REAPPRAISAL',evidence('CAMPAIGN3_REAPPRAISAL_QUALIFICATION.md'),'Five models20 runs103 prefixes qualify instructed consideration of learned protection via separate frame applied140 affecting later50. Intent70/attempt100/execution110 remain; missing knowledge/catalogue or interruption prevents frame and same-instant learning cannot enable earlier intent. Evidence,estimates,valuation,physical danger fixed; harmful option raises likelihood,ineffective gives no relief. Protection represented once as conditional likelihood,not duplicated control factor. HistoricalProduct/SplitExposure retained; fixed factors do not discriminate general dimensional necessity. DirectAffectOverride zeroes unknown/harmful case,ReliefAsEvidence contaminates learned baseline without changing observation history. Contract explicitly narrower than readiness downstream proposal: ends at affect consumer,not motives,contested strategy,spontaneous regulation or action. FREEZE copied2026-09-22 date differs accepted23; frozen bytes/identities unchanged. No general frame expiry,resource cost or causal efficacy law.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE CONTROL INFERENCE REAPPRAISAL ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-control-reappraisal.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Maintained goal,candidate inhibition,habit history and competence differ.', 'blockedClaim': 'Load failure erases goal/habit or two-slot rule establishes general effort law.', 'reopen': 'Broader control requires independent load,maintenance and execution comparisons.'}, {'owner': 'RO-C3-020', 'distinction': 'Report-supported correction rejects one causal proposition without finding an alternative.', 'blockedClaim': 'Negative obstruction report proves incompetence or diagnostic majority is a character rule.', 'reopen': 'Causal discovery and blame require independent evidence and explicit consumers.'}, {'owner': 'RO-C3-020', 'distinction': 'Considering protection changes conditional appraisal without physical mitigation.', 'blockedClaim': 'Instructed frame qualifies spontaneous strategy choice or downstream action.', 'reopen': 'Broader regulation requires strategy competition and motive/action integration.'}, {'owner': 'RO-C3-020', 'distinction': 'Typed successor,readiness narrowing and frozen metadata retain exact scope.', 'blockedClaim': 'Old HABIT codec was broadened or inherited/readiness claims are newly qualified.', 'reopen': 'Extensions must name actual contract,identity and execution scope.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
