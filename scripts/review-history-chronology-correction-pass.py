"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-correction-pass-rev1'
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
 (717, 813, 'ARCHIVED CORRECTION INDEX',evidence('CAMPAIGN3_WORK_ORDER_2026_09_14.md','GENERAL_ATTENTION_RESUME_BRIEF.md','CAMPAIGN3_PENDING_OWNER_DECISIONS.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md'),'Dated paused/handoff routing is history,not current stop instruction.12reportedverdicts included3absent entries later honestlyrecordedSeptember20;13actualincludesGA.706allocation level unchanged sincepriorallocation,notunchanged sinceC2:452to706. Corpus21 includes10preserved+11new obligations,not21passes. CandidateA/B/C unresolved;ratified transient statefeedback notgeneralAffect,encoding/retrievalseparate,knownzero/unavailable/disableddistinct. Eightlaterfamily gaps subsequentlybounded in already reviewed successor chronologies,not erased by datedtable. InspectionUI debt remains scope-bound/userdeferred;not blocking this audit. Readingorder/authoritytable routes to evidence ratherthancreatesnewqualification.'),
 (814, 832, 'DOCUMENTATION SYNCHRONIZATION',evidence('CHECKPOINT_TEMPLATE.md','GENERAL_ATTENTION_RESUME_BRIEF.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md'),'Proseonly correction PHEN-ATTN-002to001 typednamespace,onepageCURRENT andhistoricalledger labels.28commitments/sixmanifests67stages201members preflight described in historicaltooloutput;notfresh behavioralrun or independently recovered processreceipt here. Fourannotatedschemas resolve377/381/384/388 withoutnewallocation. Preparation doesnot close registration or behavioral archetype. LaterGA evidence qualifies bounded implementation;no retroactive runtime claim from docschecks.'),
 (833, 840, 'CORPUS COUNT CORRECTED',evidence('CORPUS_0_28_0_PROMOTION_REV1.json','CORPUS_0_28_0_SUCCESSOR_MANIFEST.md','GENERAL_ATTENTION_RESUME_BRIEF.md'),'Promotion limitsprose incorrectlysaidtenofelevenblocked/partial;actual3partial+8blocked=11. Correction preservesoldreceipt andhashedsource,21members,versions/statuses/digests andprior0.27verdictidentity. Recompilation describedhistorically notfreshencoderexecution; laterpromotion0.29 preservespriorcommitments. Typednamespaceordinal001not002;skippingwouldinventreservation. Membershipisobligationnotqualification;13of15namedfamilycoverage notdedicatedexecutablecoverage orCampaign4exit.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography','reason-decision','audit-learn-epi','habit-relationship-long','workspace-skill-social','belief-affect','multisource-public','multisource-source','multisource-comparison','ga-closure','ga-integration']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE CORRECTION PASS ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-correction-pass.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Dated routing and claimed ledger counts can be superseded without rewriting source.', 'blockedClaim': 'A historical pause is current authorization or reported12entries proves actual12entries then.', 'reopen': 'Use current routing and explicit September20 recovered-entry correction.'}, {'owner': 'RO-C3-020', 'distinction': 'All11promotedmembers were3partial/eightblocked.', 'blockedClaim': 'Promotion proves passage or erroneous ten-count is an additional disposition.', 'reopen': 'Check actual status list and original identity before future corpus claims.'}, {'owner': 'RO-C3-020', 'distinction': 'Typednamespace ordinal and inherited record annotations differ from new allocation.', 'blockedClaim': 'Similar labels justify invented reservation or schema annotation creates newrecord.', 'reopen': 'Consult authoritative allocation before assigningIDs.'}, {'owner': 'RO-C3-020', 'distinction': 'Historical tool-output preflight is not an independently recovered executable receipt.', 'blockedClaim': 'This chronology reran preflight or sourcebinding alone proves scientific adequacy.', 'reopen': 'Require matching receipt/source evidence for stronger validation claims;retain adequacy limit.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
