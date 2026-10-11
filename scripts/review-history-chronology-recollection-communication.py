"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-recollection-communication-rev1'
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
 (2746, 2790, 'RECOLLECTION',evidence('CAMPAIGN3_RECOLLECTION_QUALIFICATION.md'),'Five models20 runs159 prefixes distinguish frozen observation,surviving fragment,acquired category summary and current tagged recollection. Age3 candidate actually removes peripheral detail; ModalFill can reconstruct false detail without reading archive. FragmentOnly leaves unknown; KeepDetail preserves observed contradiction; TruthRestore leaks hidden detail; ReencodeGuess converts guess into retained fact. Repeated queries do not learn/count twice/rewrite episode; unseen episode cannot be manufactured from default. Missing initial detail may be reconstructed but never retrospectively observed. Consolidation140 changes only later40; current120 evidence cannot enable earlier recall. First public20/159 passed but readonly annotations failed build; preserved original and corrected final-source REV2 repeats identical rows without changing models/contract. No universal retention/compression,graded importance,recognition or downstream effect.'),
 (2791, 2835, 'FAMILIARITY',evidence('CAMPAIGN3_FAMILIARITY_QUALIFICATION.md'),'Five models24 runs94 prefixes compare admitted person/place features with surviving signatures after detail loss. Similarity and coverage separate: score1 from one feature differs from two matched positions; ties retain source references without identity. PartialMax familiar-different1/2 versus ExactOnly novel are viable alternatives. DetailRequired loses recognition despite signature; MissingAsFalse invents match; TruthIdentity leaks hidden identity. NoHistory,Unknown,NoPercept and known zero distinct. Snapshot20 recognition21 precedes encoding140 so first encounter cannot match itself. Whole hidden identity and denied-versus-absent views preserve later provenance. Raw-bigint branded-time oracle lookup build failure corrected before freeze,not psychological failure. No calibrated confidence,positive valence,general identity resolution or downstream action.'),
 (2836, 2881, 'CHOSEN COMMUNICATION',evidence('CAMPAIGN3_COMMUNICATION_QUALIFICATION.md'),'Eight models27 runs130 prefixes join acquired private belief,actual reasons/dice disclosure choice,frozen intent/expression,delivery/access and separate recipient learning. Serial predecessor completed4 runs20 prefixes then packaging interruption; not failed psychological result or completed qualification. Successor reruns all27 same identities in four workers;130 belongs completed successor,not additive coverage. Websocket warnings do not test browser/network delivery. Controlled adopted task grounds not personality or supplied choice. Honest mistaken disclosure is not deliberate lying. Silence/failed delivery/unknown knowledge supplies no Boolean sample. EvidenceMean/LastReceipt retain same observations,NoLearning separates receipt from update; PrivateCopy/IntentAsDelivery fail different boundaries. Speaker30 may affect current choice,recipient140 only later40. Whole later privacy includes contested draws. No receiver understanding,trust,listener model,strategy search or honesty identity update.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE RECOLLECTION FAMILIARITY COMMUNICATION ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-recollection-communication.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Reconstructed detail differs from retained observation and acquired summary.', 'blockedClaim': 'Plausible recall proves original observation or queries supply new evidence.', 'reopen': 'Reconstruction learning/downstream claims require provenance and independent consumers.'}, {'owner': 'RO-C3-020', 'distinction': 'Feature similarity,coverage,episodic detail and instance identity are distinct.', 'blockedClaim': 'Familiarity identifies an individual or implies liking/calibrated confidence.', 'reopen': 'Broader recognition requires acquisition,identity and source controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Chosen disclosure,delivery and recipient learning are distinct.', 'blockedClaim': 'Honest false belief is deliberate lying or silence supplies negative evidence.', 'reopen': 'New communication claims require explicit purpose,content and receipt controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Interrupted packaging and successful runtime with failed build retain separate status.', 'blockedClaim': 'Partial execution completes qualification or successful replay erases build failure.', 'reopen': 'Successor closure must bind exact identities and preserved predecessor receipts.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
