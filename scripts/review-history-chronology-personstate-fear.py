"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-personstate-fear-rev1'
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
 (3192, 3218, 'PERSONSTATE INITIAL PENDING',evidence('CAMPAIGN3_PERSONSTATE_QUALIFICATION.md'),'Initial eight0.1 models and35 conformance tests/build did not qualify public behavior. Appraisal50 preceded actual intent70,so source tested future-choice prediction rather than inference about formed intent. Public aggregate interrupted without PASS; original contract/source/model/plan cohort retained and superseded. Namespace helper incorrectly rewrote inherited1128..1130 before runtime; corrected without model recipe change. Initially passing terminal-only four-request privacy fixture could not prove later provenance. Fifth common request adds newly received conduct after private intervention; no public plan yet existed at that correction.'),
 (3219, 3248, 'PERSONSTATE CORRECTED PENDING',evidence('CAMPAIGN3_PERSONSTATE_QUALIFICATION.md'),'Eight0.2 models refrozen after appraisal moved to consequence130 after intent70/execution110 and before conduct learning140. At this dated checkpoint public qualification still pending;35 tests/build alone are not public PASS. Actual phase regression and original0.1 preservation distinguish corrected implementation from retroactively qualifying superseded model identities. Default policy remains authored research control,not earned personality. Fifth-request horizon qualifies later observer provenance only within bounded fixture.'),
 (3249, 3287, 'PERSONSTATE QUALIFIED',evidence('CAMPAIGN3_PERSONSTATE_QUALIFICATION.md'),'Eight models28 public runs168 complete prefixes qualify corrected0.2. Learned conduct impression2/3 can fit helping default while current cue is wrong about actually formed intent. Split/Pooled/HistoryOnly/CueOnly preserve raw evidence; changed cue contaminates disposition under Pooled without establishing universal two-timescale necessity. Unknown,neutral1/2,negative0 remain distinct; absent current cue is not prior-request carry-forward. Failed execution preserves intent but adds no conduct sample; observed decline is negative evidence. Goal-only changes appraisal not estimates/choices. PrivateGoalOracle reads private relevance,not sampled intent; balanced case1/2 remains. Observer affect consumer is not observer action; default policy not earned trait/calibrated probability. No universal learning/source-trust law.'),
 (3288, 3321, 'FEAR GUILT QUALIFIED',evidence('CAMPAIGN3_FEAR_GUILT_QUALIFICATION.md'),'Five models19 public runs95 prefixes separate hidden wrongdoing,controlled private threat appraisal,unchosen nervous display,admitted evidence and attributed cause. Innocent fear can be mistaken for wrongdoing; ContextOdds unknown,3/4,3/8,3/4 contrasts CueOnly while unseen context yields15/16. Exact arbitrary weights are not calibrated probabilities or causal identification. Missing cue is not calm; context alone1/6,calm1/4. Latest fields recompute without repeatedly compounding old cues; learning140 affects later40/50 only. Goal changes appraisal without changing estimate. Whole privacy includes later common observations. Wrongdoing is incident fact,not guilt emotion/moral identity; no intentional expression or downstream action. Preserve short one-byte seed20 pre-settlement failures and missing dataRecord type15pass5fail/build rejection; corrected32-byte seed and helper leave production mechanism/model bytes unchanged. REV3 20 tests then REV4 adds regression21; no failed public cohort overwritten.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR PERSONSTATE AND FEAR ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-personstate-fear.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Appraisal before intent tests prediction rather than inference about formed intent.', 'blockedClaim': 'Passing0.1 tests qualify corrected0.2 phenomenon or frozen model identities.', 'reopen': 'Temporal claims require actual phase evidence and exact successor identities.'}, {'owner': 'RO-C3-020', 'distinction': 'Terminal privacy equality differs from equality after later admitted observations.', 'blockedClaim': 'Terminal-only fixture establishes later provenance safety.', 'reopen': 'New horizons must compare complete later observer views with common received evidence.'}, {'owner': 'RO-C3-020', 'distinction': 'Authored target default,learned impression,current estimate and actual intent are separate.', 'blockedClaim': 'Bounded impression establishes earned personality,calibrated trait or observer action.', 'reopen': 'Broader personality/action claims require acquisition and execution evidence.'}, {'owner': 'RO-C3-020', 'distinction': 'Nervous display and wrongdoing attribution are not private guilt or true responsibility.', 'blockedClaim': 'Context-sensitive exact weights establish calibrated causal detection or moral identity.', 'reopen': 'General attribution requires learned source quality,causal controls and richer phenomena.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
