"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-social-attribution-rev1'
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
 (3322, 3356, 'PERSON GOAL',evidence('CAMPAIGN3_PERSON_GOAL_QUALIFICATION.md'),'Five models21 runs126 prefixes distinguish adopted target goal,ordinary route planning,attempt,achieved destination,admitted evidence and inferred purpose. Shared hub gives known ambiguity1/2 rather than absence; failed visible attempts inform RouteAndOutcome while OutcomeOnly stays unknown. Alternate routes preserve inferred purpose. Known route catalogue and multiplied motion/outcome factors do not prove learned affordances,independent evidence or calibrated probability. Repeated probes use latest fields without compounding. Observer goal changes appraisal not target estimates. No contested Decision,goal fulfillment or downstream observer action. GoalOracle violates hidden-goal invariance; all privacy checks include later admitted provenance.'),
 (3357, 3390, 'HEARSAY',evidence('CAMPAIGN3_HEARSAY_QUALIFICATION.md'),'Five models23 runs138 prefixes separate hidden conduct,speaker evidence/belief,controlled report,direct recipient evidence and resulting estimate. DirectPriority and LatestEvidence differ after contrary report; false direct displays keep priority wrong,so direct evidence is not truth. Visible ticket deduplication is not independence: new tickets do not establish corroboration; denied receipt can arrive later without manufacturing negative evidence. Automatic relay is not chosen speech/global reputation. No learned trust/calibration or downstream action. Eight social clauses bounded across separate profiles,not joint integration. Whole privacy comparisons retain later provenance and immutable earlier judgments.'),
 (3391, 3424, 'RELATIONSHIP DIMENSIONS',evidence('CAMPAIGN3_REL_DIMENSIONS_QUALIFICATION.md'),'Six models23 runs161 prefixes derive separate affection,respect,trust,comfort proxies from assistance,competence,commitment and threat cue; no universal stored emotion axes. Known zero is not dislike/contempt and missing cue is not safety. SingleScore and PersonOnly lose fixture dissociations but retain raw journals and comparator status; no general dimensionality/state reduction. Four inherited reason/dice probes change prospective distributions only,not sampled action/intent/execution. Preserve initial21/23 tests: consolidate strength1 to1/2 before quantization gives d6 plus/minus2 and7/9,2/9; do not retune law. Participant intervention changes raw records legitimately while task projection stays equal; whole privacy invariance still exact. No production/model/contract change from corrected assertions.'),
 (3425, 3458, 'RELATIONSHIP ATTRIBUTION',evidence('CAMPAIGN3_REL_ATTRIBUTION_QUALIFICATION.md'),'Six models25 runs225 prefixes separate experienced dyadic harm,linked attributed withholding and current willingness. Later120 evidence learned140 changes next40 caution without rewriting history or old judgments. False exculpatory claim makes estimate less accurate under unchanged hidden deliberate withholding; not innocence,alternative causal diagnosis,forgiveness or repair. CurrentBeliefOnly substitutes willingness and loses contrast; InitialCause refuses revision while retaining evidence. Controlled incident-token link is not natural event recognition; foreign incident cannot alter original cause. Prospective contact2/9 to7/9 with cooperation7/9 does not enact contact. First23 tests/build pass; unavailable Python alias and UTF-8 prose correction are not failed scientific cohorts.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR SOCIAL ATTRIBUTION ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-social-attribution.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Goal inference weights depend on known routes and possibly correlated episode fields.', 'blockedClaim': 'Weights are calibrated confidence or learned general inverse planning.', 'reopen': 'Broader inference requires independent source and recognition controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Direct perception and named testimony are both fallible admitted evidence.', 'blockedClaim': 'Channel priority verifies truth or ticket uniqueness establishes independent corroboration.', 'reopen': 'Source trust and propagation require explicit acquisition and correlation comparisons.'}, {'owner': 'RO-C3-020', 'distinction': 'Split relational proxies preserve distinct source ownership and prospective consumers.', 'blockedClaim': 'Fixture dissociation establishes universal axes or enacted interaction.', 'reopen': 'Any reduction or action claim must preserve independent sources and actual execution.'}, {'owner': 'RO-C3-020', 'distinction': 'Incident explanation can change while experienced harm and current willingness stay fixed.', 'blockedClaim': 'Exculpation proves innocence,forgiveness or relationship repair.', 'reopen': 'Repair and causal discovery require independently qualified evidence and consumers.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
