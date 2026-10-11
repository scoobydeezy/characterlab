"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-multisource-public-rev1'
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
 (1355, 1364, 'SELECTED DESCRIPTION PROPOSAL',evidence('MULTISOURCE_DESCRIPTION_CHECKPOINT.md'),'Actual singleton/duplicate/hull component57 tests,sixfiles,build/boundary;fourteen proposed shapes allocate noIDs and not whole-profile readiness. Hull conservative same-signal interval not sum/optimal fusion/independent sensors. Missing support makes aggregate unavailable,knownzero retains basis. Distinct description and ground identity cannot be emulated by extra task495 keys without changing motive ownership;old499 ancestry frozen.'),
 (1365, 1413, 'DESCRIPTION INTEGRATION PENDING',evidence('MULTISOURCE_DESCRIPTION_CHECKPOINT.md'),'At level20 widths10/20 threshold60 strengths1/2,1/3,1/3 bases a,b,ab give aggregate third0 total5/11 versus pairwise1/6 total1/2. Equal-magnitude order b before hull declared,not arbitrary renaming invariance. Component maxthree descriptions differs proposed four-description integration;whole registry/profile/ancestry and public rollback/replay still open. FamilyNormalized unchanged negative,not repaired normalizer. Independent A/B reserve controls separate from same-signal views. No Need owner/efficacy/source independence proof.'),
 (1414, 1454, 'PUBLIC INTEGRATION RUNNING',evidence('CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'707..733 namespace1149 pre-model selector/pattern correction and initial transaction tests do not close matrix. Legacy55 model images means55 named scenarios43 distinct identities,not55 models. Revision1 copied body instruction/action mismatch rejected;preserved images inadmissible,revision2 corrects new registry with compiler validation. Running cohort is historical status,not live worker. Public receiving ancestry must use actual registered parents;no old synthetic ancestor. Full qualification and decoder reexecution remain successor evidence.'),
 (1455, 1500, 'PUBLIC MULTISOURCE QUALIFIED',evidence('CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md'),'43 distinct models55 main scenarios plus7 matched interventions=62 runs227 prefix restorations. Shared fact preserves separate motive grounds;independent reserves not statistical sensors. Orphan removal leaves aggregate bodybase1/3 while family-normalized1/5to1/3 and probability1/2to3/5;not general prohibition of contracted belief/attention effects. Collective intermediate differences may share probability349/384,so equal probability not law equality. Main DescriptionDice omitted Situation and was unmatched;additional Base-only pairs same raw bytes establish2vs3/4 nuclei and differing exact probabilities. Shared seed not equal addresses across different allocation. Full suite2235pass1codec fail,focused22pass supports latest2236 coverage not single full-suite PASS. Finaldecoder62 save sequences exact;codec correction only explicitly open canonical slots,not inherited typedslots. No whole MULTI/Need/physiology/efficacy or universal receiving law.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography','reason-decision','audit-learn-epi','habit-relationship-long','workspace-skill-social','belief-affect']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR MULTISOURCE PUBLIC ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-multisource-public.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Descriptions and motive grounds have independent identities.', 'blockedClaim': 'Duplicate evidence creates additional motives or same-signal hull proves independent sensing.', 'reopen': 'New receiving sources require exact support and ground controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Intermediate receiver differences may be masked by downstream calibration.', 'blockedClaim': 'Equal probabilities establish law equivalence or unmatched DescriptionDice proves a dice-unit contrast.', 'reopen': 'New comparisons need matched raw bytes and intermediate witnesses.'}, {'owner': 'RO-C3-020', 'distinction': 'Named scenarios differ from distinct models and shared seeds from shared addresses.', 'blockedClaim': '55 scenarios are55 models or seed equality supplies pathwise coupling.', 'reopen': 'Counts/coupling claims must inspect identities and actual addressing.'}, {'owner': 'RO-C3-020', 'distinction': 'Final focused regression and exact reexecution do not rewrite a failed full-suite process.', 'blockedClaim': 'Latest2236-test coverage means original full suite passed.', 'reopen': 'Validation must preserve process receipts and affected-source reexecution.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
