"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-multisource-source-rev1'
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
 (1240, 1251, 'SELECTED SOURCE COMPONENT',evidence('MULTISOURCE_SELECTED_SOURCE_CHECKPOINT.md','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'One-shot selected capability and actual task candidate origin support separate interval interpretations; commitment Base copied without invented evidence.38 tests/four files include13 new source tests,not full-suite rerun. Initial Node-only helper build failure corrected by byte-array comparison,not production dependency. No permanent allocation/public admission or verdict.'),
 (1252, 1298, 'SELECTED SOURCE PUBLIC GATE OPEN',evidence('MULTISOURCE_SELECTED_SOURCE_CHECKPOINT.md','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'Independent B replenishment changes task1/2to1/6 with bodyA unchanged; threshold/polarity gives-1/4 without body change. Hidden21to29 samebin preserves entire bundle. Unavailable/denied/excluded selection differs knownzero with basis. Actual Baseoff retains plan/Situation but manufactures no motive; aggregate body1/3 versus roleblind1/5 is component strength,not public probability. Trusted operands cannot establish registry criterion adoption,observer-holder/time or actual public ancestry. Later public qualification closes bounded admission only; no Need/efficacy/general law.'),
 (1299, 1307, 'TRUSTED SOURCE JOIN',evidence('MULTISOURCE_SOURCE_JOIN_CHECKPOINT.md','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'Compiler-issued detached profile and actual task/body production read exactlyfour statepaths at oneinstant with no authoritative writes.49 tests/five files include11 new join tests; capacity1 workspace and valid inactive status union corrected in test fixture. Build/boundary pass;full suites not rerun. Repeat allocations rejected locally,not transactional rollback qualification.'),
 (1308, 1354, 'SOURCE JOIN PUBLIC GATE OPEN',evidence('MULTISOURCE_SOURCE_JOIN_CHECKPOINT.md','CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'Mapping/task status/task instruction/body instruction bound to compiled declarations,one selectedtask,forecast/Standingdisabled. External opaque source and trusted declarations remain; registry definition/action/criterion binding,source commitments and scheduler event authority still owed. All observed audit samples differ selected character assessment and state-read provenance differs observation support. Baseoff preserves adoption,not equivalent to deleting task adoption. Deterministic repeats are not original-prefix replay/new public ModelIdentity. Old499 graph cannot represent real successor ancestry; later public admission scoped to successor evidence,not retroactive trusted API authority.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography','reason-decision','audit-learn-epi','habit-relationship-long','workspace-skill-social','belief-affect','multisource-public']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR MULTISOURCE SOURCE ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-multisource-source.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Trusted component operands do not prove public source authority.', 'blockedClaim': 'Compiler capability or deterministic repeat establishes registry admission and complete-prefix replay.', 'reopen': 'New ingress must prove exact bindings,source commitments,event authority and transactional replay.'}, {'owner': 'RO-C3-020', 'distinction': 'Observed audit samples,state-read provenance and selected evidence have different roles.', 'blockedClaim': 'Every observed or internally read datum is admitted character knowledge.', 'reopen': 'New source joins must preserve selection and epistemic provenance boundaries.'}, {'owner': 'RO-C3-020', 'distinction': 'Base-off retains adoption and modifiers without creating motive.', 'blockedClaim': 'Removing adoption is equivalent to suppressing motive generation or component strengths qualify public probabilities.', 'reopen': 'New comparisons must match actual grounds,adoption and receiving stage.'}, {'owner': 'RO-C3-020', 'distinction': 'Passing focused validation follows preserved development corrections.', 'blockedClaim': '38/49 focused tests are full-suite reruns or first build/fixture passed.', 'reopen': 'Validation claims must retain failed helper and fixture cohorts and exact test-file counts.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
