"""Bind six dated cognition entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-cognition-rev1'
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
 (6870,6904,'UNCERTAINTY',evidence('CAMPAIGN3_UNCERTAINTY_QUALIFICATION.md'),
  'Admitted intervals represent compatible possibilities,not probabilities or calibrated confidence. At reserve550 both midpoint500 intervals have error50; radii100/300 produce different UpperRisk choices with6/8 sequence differences and two equal seeds. UpperRisk/MidpointRisk/LowerRisk/PointBelief/NoLearning remain. Biased intervals can exclude truth without privileged repair. Repetition does not narrow belief,missing evidence is no update,and current correction affects only later choice.155 runs/775 component prefixes do not execute replenishment or qualify native admission. The chronology phrase upper-deficit probability denotes the action probability from reason dice,not a posterior probability of deficit.'),
 (6905,6939,'VIVID RECOLLECTION',evidence('CAMPAIGN3_VIVID_RECOLLECTION_QUALIFICATION.md'),
  'The explicit sensory-clarity diagnostic distinguishes three clear from three weak facets at identical values,cue,rank and access. False recalled content can be vivid; clarity is not truth confidence or subjective phenomenology. Actual publication settles history; later fragmentation removes sensory facets unavailable to recall from research rows. DetailCount/AccessOnly named simplifications fail this declared readout,not every vividness definition. Empty sensory detail still needs observed episode identity as evidence basis; unrelated cue can select through baseline ranking. Both first-cohort failures remain.44 deterministic runs/308 component prefixes imply no RNG diversity,native admission or downstream behavior.'),
 (6940,6975,'AFFECT RETRIEVAL',evidence('CAMPAIGN3_AFFECT_RETRIEVAL_QUALIFICATION.md'),
  'Previously completed actual affect changes published recall at fixed prior memory/history/cue; NoFeedback removes the effect. A11/24 versus B1/2 at gain1 becomes A7/12 at gain2. Actual publication settles history without rewriting memory. Unknown is distinct from known zero despite baseline gain; no cue means no publication and empty graph cannot gain an association. Current appraisal arrives too late for same-step recall.56 deterministic component runs/280 prefixes qualify neither encoding suppression/salience nor native Save132. TaskConcern is not general Affect. Wrong harness path and premature concurrent launch remain pre-plan failures,not discarded behavioral cases.'),
 (6976,7013,'SCALAR RECEIVING EQUALITY',evidence('CAMPAIGN3_AFFECT_REDUCTION_COMPARISON.md','CAMPAIGN3_AFFECT_REGULATORY_QUALIFICATION.md'),
  'ScalarUncontrolled exactly preserves FullPair gain,ranks,content and settled history for14 retrieval cases.56 substitutions repeated112 times are not56 whole-runtime replays;14 producer runs/70 prefixes are separately counted. Exposure/HistoricalAverage fail the declared full-control receiver,not universal psychology. No new consumer was invented to force dimensionality. Later body-only regulatory failure promotes the bounded clause but retains psychological scalar successes; neither equality licenses global removal of exposure,belief,goals or appraisal factors. Previous24/328/build receipts were bound rather than freshly rerun for substitution.'),
 (7014,7050,'LATENT CAUSE',evidence('CAMPAIGN3_LATENT_CAUSE_QUALIFICATION.md'),
  'Admitted motion/resistance diagnostics revise support for two authored alternatives. Failure alone is Ambiguous,absent outcome Unknown,and observed success NotFailure. Hidden-cause swaps with identical evidence preserve cognition and can leave it wrong. Goal-only changes leave inference fixed but alter appraisal. Equal prior,authored likelihood ratios,latest-per-channel reports and exclusive/exhaustive two-cause set are assumptions,not learned likelihoods or general causal identification. Duplicate changed receipts retain first evidence within this finite rule.56 runs/392 prefixes qualify one-episode inference,not repeated-episode prediction,physical remediation or autonomous diagnosis.'),
 (7051,7087,'INTERFERENCE EXPECTATION',evidence('CAMPAIGN3_INTERFERENCE_EXPECTATION_QUALIFICATION.md','INTERFERENCE_EXPECTATION_SUCCESSOR_CONTROL.md'),
  'Actual distinct attempts contribute equal episode samples only with observed opportunity,route scope and admitted causal evidence. Reports within one episode do not create more attempts. Mean2/3,Latest0 and unknown EpisodeOnly/NoLearning have real appraisal consequences; failure is not interference. Primary10 native producers/90 prefixes and52 component comparisons/468 prefixes remain intact. Terminal8 duplicate/report cases originally proved storage only; separately frozen report7/probe8 adds2 native runs/18 prefixes and8 comparisons/72 prefixes. Combined12/108 native and60/540 component counts are separate replay surfaces,not a new joined public wrapper. Source-pooled2/4 is arithmetic only,not an extra qualified model. Missing denied-content control and temporal coverage discovery stay preserved. No later actor-choice,calibrated confidence,natural grouping or causal identification claim.')
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='SIX CHRONOLOGY ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-cognition.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',dict(status='OWNED LIMITS PRESERVED',findings=[
 dict(owner='RO-C3-020',distinction='Set uncertainty,choice probability,accuracy and confidence are distinct.',blockedClaim='Interval radius or reason-dice probability is a calibrated belief posterior.',reopen='A new consumer needs fusion,trust,correlation or probability calibration.'),
 dict(owner='RO-C3-020',distinction='Vivid sensory readout differs from access,truth,confidence and subjective experience.',blockedClaim='Clear recall establishes accuracy or universal imagery semantics.',reopen='Natural encoding,new modalities or downstream behavior requires independent evidence.'),
 dict(owner='RO-C3-020',distinction='Psychological scalar sufficiency survives failure of other projections and body-only reduction.',blockedClaim='The affect vector is proven necessary or its coordinates can be globally retired.',reopen='An independently motivated consumer discriminates what the retained scalar discards.'),
 dict(owner='RO-C3-020',distinction='Episode-local causal inference differs from cross-episode expectation.',blockedClaim='One revised explanation establishes learned likelihoods or general causal identification.',reopen='New hypotheses,co-occurring causes,empirical likelihoods or autonomous diagnosis are required.'),
 dict(owner='RO-C3-021',distinction='A terminal update demonstrates retained state,not a subsequent consumer effect.',blockedClaim='Primary terminal-report tests already qualified the later interference appraisal.',reopen='Broader replay/consumer claims require actual post-update probes with exact source lineage.')]))
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
