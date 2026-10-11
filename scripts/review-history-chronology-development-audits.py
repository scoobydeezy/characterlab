"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-development-audits-rev1'
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
 (6467,6507,'DEVELOPMENT PUBLIC CLOSURE',evidence('CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md'),'Both owner-directed developmental effects execute under distinct actual native owners: young skill1/2 versus1/8 changes execution at difficulty3/8; eligible expression1/9 becomes personality delta1/9 versus1/36. Admitted report can disagree with physical result; youth neither grants agency nor makes forced movement authored. Stored event-time phase/gain never refolds with later ageing.7 models/36 programs/668 unique prefixes comprise632 advancing and36 terminal checks,8216 stages.113 earlier restores reexecute byte-identically; they are not added again to668. NoLearning/NoFormation disable developmental amplification,not baseline updating. All eight early sampled actions equal despite different probabilities; full sequences differ. Preserve test-only readonly assignment,pre-test sandbox denial,trace-refinement/watching overhead and V8 allocation failure cohorts; four4096MB workers are an operational correction,not a low-memory scalability result. No calendar-age,critical-period,general learning-domain or universal formation law.'),
 (6508,6545,'BODY COVERAGE AUDIT',evidence('CAMPAIGN3_BODY_PARTIAL_COVERAGE_AUDIT.md','BODY_PARTIAL_AUDIT_FINDING_REV1.json','CAMPAIGN3_UNCERTAINTY_QUALIFICATION.md'),'The disjunctive tolerance-or-sensitization clause closes through acquired tolerance effect,not supplied sensitization. Four-exposure Reciprocal/Linear/Unattenuated potentials1/5,3/5,1 distinguish accumulation from its effect; clipping can mask differences. Constitutional gains250/125 produce first tolerance150/75 and next potentials522/558 with reward910/940 at matched exposure. Previously inspected data are not an unseen validation set. Component2389 and selected native270 prefix scopes differ. Direct historical checker rejected repaired source hash before any simulation; explicit preserved-source verification and separate repair evidence preserve both identities. Later UNCERTAINTY supplies admitted interval/consumer comparison that coarse bins or missingness alone did not earn.'),
 (6546,6622,'BODY AUDIT FORMATTING CORRECTION',evidence('CAMPAIGN3_BODY_PARTIAL_COVERAGE_AUDIT.md','BODY_PARTIAL_AUDIT_FINDING_REV1.json','BODY_PARTIAL_BOOKKEEPING_FINDING_REV1.json'),'This is the repeated embodiment audit after CURRENT table spacing correction,not a second tolerance experiment or another closure.1 active/19 conditional/0 unowned counts were correct throughout. Exact old bytes remain in chronology,including expanded blank lines; the checker was not relaxed. Historical source hash rejection and table matcher rejection are distinct nonbehavioral findings. Tolerance branch qualification does not imply acquired sensitization,calibrated uncertainty or broader native coverage.'),
 (6623,6658,'MOTIVE COVERAGE AUDIT',evidence('CAMPAIGN3_MOTIVE_PARTIAL_COVERAGE_AUDIT.md','CAMPAIGN3_IMPORTANCE_URGENCY_QUALIFICATION.md'),'One admitted relief TASK supplies two option-relative grounds and actual substitution after learned diversified training; this is multiple possible actions,not simultaneous action or a new motive per satisfier.5 models/29 runs/261 component prefixes remain the scope. ExpectationOnly explains primary substitution,so separate habit necessity is unearned. Preserve failed cohorts and inherited two-option limit. Native GOAL route replacement/gap/completion is separate corroboration with empty RNG ledger,not native substitution admission. Shared evidence/separate grounds does not itself prove multiple satisfiers. Later same-motive importance/urgency experiment resolves that missing contrast without universal exchange rate,new Need ontology or a mandatory stored importance cell.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR DEVELOPMENT/AUDIT ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-development-audits.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Developmental learning gain and event-time personality influence remain independent.', 'blockedClaim': 'Age rewrites earlier authorship or the finite phase source models calendar ageing.', 'reopen': 'New age domains,natural life-event sources or critical-period claims require evidence.'}, {'owner': 'RO-C3-020', 'distinction': 'Acquired tolerance effects differ from stored tolerance and supplied sensitization.', 'blockedClaim': 'Tolerance qualification establishes acquired sensitization or a universal attenuation law.', 'reopen': 'Repeated sensitization,cross-tolerance or new physiological sources are required.'}, {'owner': 'RO-C3-021', 'distinction': 'Historical hash mismatch,formatting rejection and repeated archive entries are not behavioral execution.', 'blockedClaim': 'Corrected checker receipts or duplicated log entries constitute additional simulation evidence.', 'reopen': 'New qualification must retain exact historical/current source identities and unique execution accounting.'}, {'owner': 'RO-C3-020', 'distinction': 'Multiple options for one motive do not prove habit necessity or general option discovery.', 'blockedClaim': 'Substitution alone requires a separate habit mechanism or grants native integration.', 'reopen': 'New repertoires,affordance learning or native composed scope requires its own gate.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
