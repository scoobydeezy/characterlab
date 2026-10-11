"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-lying-display-rev1'
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
 (2882, 2916, 'LYING RUNNING',evidence('CAMPAIGN3_LYING_QUALIFICATION.md'),'Eight models30 runs frozen and31 tests/reference328/build precede public143-prefix aggregate. Running workers are dated status,not current live handles or PASS. Private belief,purpose,intended assertion,delivery and recipient learning remain separately claimed pending qualification.'),
 (2917, 2962, 'LYING QUALIFIED',evidence('CAMPAIGN3_LYING_QUALIFICATION.md'),'Eight models30 runs143 prefixes qualify actual inherited reason/dice selection of informing versus misdirection,not selected action injected by fixture or Liar trait. Contrary assertion from mistaken belief can accidentally match truth; deception intent depends on belief/purpose,not correctness. Unknown belief cannot instantiate an assertion; empty chosen template is not a lie. Failure/denied receipt preserve intent without evidence. EvidenceMean ends2/3 versus LastReceipt0 after two true then false assertions: bounded resistance,not general persuasion. NoLearning distinct. TruthDefinedContent,IntentAsDelivery,PrivateCopy violate different boundaries. Whole later safe views include contested choices/draws. Speaker private learning30 can inform current choice; recipient140 only later40. No listener model,trust,general language or honesty identity update.'),
 (2963, 2994, 'DISPLAY RUNNING',evidence('CAMPAIGN3_EMOTIONAL_DISPLAY_QUALIFICATION.md'),'Ten models32 public runs frozen; running complete-prefix qualification is not PASS. Preserved helper/timeouts and confounded comparison are construction/proof issues,not rejected psychological models. Initial broad calm intervention changed current,baseline and treated evidence,leaving control unknown later. Corrected fixture changes only current-risk evidence and checks reassurance throughout sequence; runtime/contract/model unchanged.'),
 (2995, 3045, 'DISPLAY QUALIFIED',evidence('CAMPAIGN3_EMOTIONAL_DISPLAY_QUALIFICATION.md'),'Ten models32 runs160 prefixes32 tests/reference328/build qualify private SplitExposure factors and separate chosen assertion from unchosen produced cue. U is bounded distress operand,not general affect redefinition; protection can make U0 while E1. Independent likelihood/severity/vulnerability/control interventions and unknown versus zero retained. Semantic delivery failure may leave cue; display disabled may leave assertion; access channels separate. GradedDisplay versus ThresholdDisplay differs at U1/4,without identifying physiological law. NoLeak versus NoLearning distinct; PrivateCopy fabricates cue after channels fail,IntentEqualsDisplay wrongly erases cue with reassurance. Assertion/cue conflict proves neither deception nor guilt. Complete later privacy and addressed draws retained. Conditional apparatus does not requalify affect panel tracking; no fusion/trust,learned suppression or downstream social action.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR LYING AND DISPLAY ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-lying-display.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Contrary intended assertion depends on acquired belief and purpose,not hidden truth.', 'blockedClaim': 'Falsehood defines lying or unknown content counts as a lie.', 'reopen': 'Broader deception requires explicit content,purpose and actual acquisition controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Intended belief target,delivery and recipient belief change are separate.', 'blockedClaim': 'A heard lie necessarily succeeds or intent supplies recipient evidence.', 'reopen': 'Persuasion and listener modelling need independent receiving/source controls.'}, {'owner': 'RO-C3-020', 'distinction': 'Private affect,semantic assertion and unchosen display are independent channels.', 'blockedClaim': 'Reassurance erases distress or cue disagreement proves guilt/deception.', 'reopen': 'Physiological display,suppression and fusion require additional evidence.'}, {'owner': 'RO-C3-020', 'distinction': 'Likelihood-only intervention must preserve baseline/treated control evidence.', 'blockedClaim': 'Broad calm manipulation isolates likelihood or passing helper fixes settle causal adequacy.', 'reopen': 'Factor claims require independent operand controls across the full sequence.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
