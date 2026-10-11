"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-development-scope-rev1'
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
 (6043,6081,'HISTORY REPLAY IS NOT MATURATION',evidence('DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md','DEVELOPMENT_HISTORY_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_QUALIFICATION.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md'),'Two reused models/three known runs/51 public restores reproduce earlier exact results,not unseen replication. Early practice3/5 changes later competence and execution after episode expiry while identity/relationship/person views remain equal. Pre-update skill1/4 versus0 at difficulty1/4 produces success/failure; this is acquired history,not an independent developmental contributor. Disposition constitution/plastic/standing evidence remains separate. The initial query-suffix preflight failed before simulation. Later owner scope supersedes the direct-disposition-only next step,not this replay finding.'),
 (6082,6124,'OWNER SCOPE AMENDMENT',evidence('DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md','DEVELOPMENT_HISTORY_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_QUALIFICATION.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md'),'Owner requires younger learning plasticity and greater early personality-forming weight independently; direct current disposition alone cannot satisfy both. Preserve constitutional parameters,developmental state,competence/belief,eligibility,authorship and acquired personality. Eligible authored expressions are qualified before developmental weighting; youth cannot create agency. Use event-time phase/gain; current ageing never refolds old weights. Older learning and later correction remain possible. This authorizes effects,not calendar ages,critical periods,universal gain or irreversible destiny.'),
 (6125,6166,'COMPONENT EXECUTION PENDING',evidence('DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md','DEVELOPMENT_HISTORY_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_QUALIFICATION.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md'),'Thirteen focused tests plus328 reference/typecheck/build were implementation evidence,not the full prospective36-case/668-prefix matrix. Preserve6-pass/7-default-timeout cohort and unchanged production after longer timeout. Earlier51 native history restores do not qualify either new component matrix or native developmental admission. Archived four worker sessions and write commands are superseded by later completed component/public qualifications,not live instructions.'),
 (6167,6206,'COMPONENT QUALIFICATION',evidence('DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md','DEVELOPMENT_HISTORY_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_QUALIFICATION.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md'),'Seven models/36 runs/668 component prefixes earn independent age-dependent learning and personality routes. All eight early probe probabilities differ while sampled early actions equal; full sequences differ. NoLearning/NoFormation disable developmental amplification,not baseline updating. Original authorship/journal remain; later ageing does not reweight. Component closure left the owner integration order and Brief12.15-1 blocked pending native typed sources/owners/RNG/save/fault/publication. Later public verdict closes precisely that admission gate,not broader lifespan or all learning domains.'),
 (6207,6247,'FIRST NATIVE EXECUTION',evidence('DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md','DEVELOPMENT_HISTORY_CHECKPOINT.md','CAMPAIGN3_DEVELOPMENT_QUALIFICATION.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_PUBLIC_IMPLEMENTATION_CHECKPOINT.md'),'Thirteen registered stages,separate sole writers,closed originals and primary18 rows/234 traces establish implementation and focused evidence.21 passing tests in both cohorts coexist with first test-only readonly payload typecheck rejection; production unchanged.1508/16 and wrapper54/57 are dated allocation/publication scope,not complete native matrix. The expected668 native Save132 restores are distinct from completed668 component restores. Later native qualification and preserved harness revisions supersede running status without erasing original plan or partial receipts.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FIVE DEVELOPMENT SCOPE ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-development-scope.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Experienced practice and independently varying developmental state differ.', 'blockedClaim': 'History replay alone qualifies maturation or removes the developmental distinction.', 'reopen': 'A proposed simplification equates acquired history with developmental state.'}, {'owner': 'RO-C3-020', 'distinction': 'Owner-authorized developmental effects preserve eligibility and event-time authorship.', 'blockedClaim': 'Age grants agency,relabels external experience as authored choice,or retroactively reweights history.', 'reopen': 'New personality routes must preserve accepted provenance and ownership.'}, {'owner': 'RO-C3-021', 'distinction': 'Historical replay,component qualification and native admission have different evidence scopes.', 'blockedClaim': 'Identical prefix counts or focused tests satisfy another runtime gate.', 'reopen': 'Broader execution/admission claims need exact original-source and runtime evidence.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
