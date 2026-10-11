"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-workspace-skill-social-rev1'
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
 (1655, 1696, 'WORKSPACE',evidence('CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md'),'Forty-eight models78 runs624 prefixes=70 main plus8 distractor supplement. Retained task,active selection and accessible reason differ. Three cards overload1/2 capacity;neutral card occupies slot without motive,priority affects admission not strength. Main priority fixture confounded;single-field distractor1to3 supplement preserves goal/neutral priorities and preceding outputs. Reminder4 affects5;expiry half-open6 then deadline140;reminder6 cannot resurrect7. StoredSet/IndexedReplay equal cognitive outputs from complete safe journal,initial empty selection,oneframe/oneopportunity per original,fixed deadline only lifecycle. New adoption/fulfillment,irregular cognition or discarded history requires new derivation. Cache derived not maintained-access semantics;no general control cost/currentlane closure. Test-only narrowing build failure retained.'),
 (1697, 1740, 'SKILL',evidence('CAMPAIGN3_SKILL_QUALIFICATION.md'),'Twenty-seven models52 runs279 prefixes separate actual competence,temporary impairment and observed-performance belief. Hidden-feedback competence0/1 changes execution with identical cognitive intent;impairment recovery preserves skill. Practice truth-side engaged attempts can learn without feedback;misleading reports alter belief not competence. Same attempt uses prior skill before140. Linear/residual and multiplicative/additive remain alternatives;inclusive execution threshold exact. Permission gates engagement not competence;blocked engagement yields neither practice nor evidence even configuredsuccess. Single adopted exercise Auto not confidence-sensitive choice. Self-belief observed performance mean,not inferred latent skill or calibrated correctness. Zero roll threshold violated inherited API;positive fix retains Auto without model/contract overwrite. No skill/memory/belief reduction.'),
 (1741, 1784, 'SOCIAL',evidence('CAMPAIGN3_SOCIAL_QUALIFICATION.md'),'Eighteen models26 runs127 prefixes independent holder/target estimates follow controlled fallible commitment claims,not target deliberation/language. Same public delivery compatible private commitments;oneobserver correction0to1/2to2/3 leaves otherknown0 unchanged. Receipt dedup not source independence;different receipts/speakers may share hidden source. SourceGroupedMean/LastStatement serious,NoLearning evidencewithoutupdate;GlobalPersonModel/DirectPrivateReader/PresentationCounting separate failures. Fanout-order comparison normalizes occurrence provenance only;hidden/nonrecipient exactunnormalized. Closed view excludes private/otherobserver/denied/model identities but is routed research API,not security sandbox. ORD002 only immutable snapshot/disjoint updates;TRC003 only closed projection/read audit. Target self-knowledge not tested;external review corollary future capability. No general mentalizing,trust or downstream social action.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal','agency-goal','agency-intake','commit-body-biography','reason-decision','audit-learn-epi','habit-relationship-long']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE WORKSPACE SKILL SOCIAL ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-workspace-skill-social.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Active-set reconstruction assumes full ordered source journal and fixed lifecycle.', 'blockedClaim': 'Cache derivation removes maintained access or covers arbitrary adoption/history loss.', 'reopen': 'Changed opportunities,lifecycle or retention require new derivation.'}, {'owner': 'RO-C3-020', 'distinction': 'Observed performance belief differs from actual or inferred latent competence.', 'blockedClaim': 'Auto execution comparison qualifies confidence-sensitive choice or calibrated competence inference.', 'reopen': 'New choice/self-assessment claims need independent causal evidence.'}, {'owner': 'RO-C3-020', 'distinction': 'Repeated receipt deduplication differs from hidden source independence.', 'blockedClaim': 'Different reports or speakers establish corroboration or target self-knowledge.', 'reopen': 'Trust/hearsay/self-model claims require explicit source and ownership controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Fanout normalization and closed view have specifically bounded scope.', 'blockedClaim': 'General privacy tooling or all ordering is qualified.', 'reopen': 'New interactions/consumers require unnormalized hidden-source invariance and authority checks.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
