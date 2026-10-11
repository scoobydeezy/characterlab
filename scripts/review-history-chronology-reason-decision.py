"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-reason-decision-rev1'
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
 (2086, 2119, 'JOINED REASON',evidence('CAMPAIGN3_REASON_QUALIFICATION.md'),'Five models115 runs350 prefixes preserve exact option/motive/referent keys,role/sign partitions and collective redundancy under identical raw sources/acquired history. Aggregate17/29 d6 versus Pairwise37/61 d8 distinguishes collective coverage; repeated description is not new evidence. Zero base cannot acquire nucleus from standing; weak base1/11 plus actual earned modifier1 rescues. Sign applies entire distribution after signed consolidation. K1/100 calibration not real identity speed. REV1 unregistered freeze8/19,REV2 subthreshold separated source and empty saved RNG projection16/19 preserved;REV3 strengthens fixture/restores projection without lowering threshold.67 affected combines66 concurrent passes plus one targeted timeout retry,not single67/67 run. No arbitrary renaming invariance,general correlation law,direction-as-identity settlement or state reduction.'),
 (2120, 2155, 'DECISION COMPONENT',evidence('DECISION_COMPONENT_CHECKPOINT.md'),'576 component cases576 fresh replays29 tests,zero public runs/prefixes; no model/allocation/arithmetic change. Three regimes settled Auto31/32,balanced QuietRoll1/2,high-significance PlayerFacingRoll1/2. Low/high same authoritative transcripts/choices16 seeds,not newly drawn presentation. AlwaysRoll/NeverRoll/DecorativeDice/OpaqueWeightedChoice/IntentEqualsOutcome discriminate. Opaque exact marginal limited balanced domain,not general weighted sampler. REV1 tie transcript helper read423 field2 leaders instead of3;accepted arbitration correct unchanged. Component prevention control erases claimed intent; later public control specifically collapses historical expression,so exact implementations differ. Public source/ownership/post-attempt/rollback gates remain open at dated checkpoint.'),
 (2156, 2189, 'DECISION PUBLIC',evidence('CAMPAIGN3_DECISION_QUALIFICATION.md'),'Six models174 public runs360 prefixes qualify actual13-stage source/SEM/reasons/choice60/intent70/expression80/plan90/attempt100/execution110/consequence120/124/history140. Presentation projects same decision without new draw; intent/expression fixed across prevention. Public IntentEqualsOutcome retains prospective intent driving attempt but omits historical expression after admitted failure;does not read hidden permission. Closed character view excludes raw RNG,world outcome,player presentation;raw research save not safe view. Invisible consequence preserves allowed/prevented character history even violating comparator. Missing current evidence distinct observed zero despite same choice.72 affected328 reference;publicREV1 8/22 because14 rollback tests tried saves after failure,substrate correctly refused. Corrected tests inspect committed diagnostic ledger and assert failed-save rejection22/22;no model/contract change. Significance reason-mass proxy,opaque balanced-only,finite history not general memory/identity law.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE REASON DECISION ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-reason-decision.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Shared evidence descriptions do not add independent motivational authority.', 'blockedClaim': 'Standing manufactures a zero-base motive or pairwise overlap proves collective redundancy.', 'reopen': 'New compilation laws require exact keys,roles and acquired-history controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Decision resolution and player presentation share authoritative randomness.', 'blockedClaim': 'Decorative dice or fresh presentation draws satisfy genuine resolution.', 'reopen': 'Broader presentation must preserve exact draw authority and reason contributions.'}, {'owner': 'RO-C3-020', 'distinction': 'Component comparator and public historical-collapse control have distinct implementation scope.', 'blockedClaim': 'Component replay alone establishes public post-attempt semantics.', 'reopen': 'Public claims require actual source,history and safe-view evidence.'}, {'owner': 'RO-C3-020', 'distinction': 'Failed runtime saves are correctly unavailable after rollback.', 'blockedClaim': 'Rollback test failure proves model fault or successful retry erases original receipt.', 'reopen': 'Validation must inspect committed diagnostics and preserve rejected attempts.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
