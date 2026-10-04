"""Source-located review of the ledger's dated amendment tail, not whole-history closure."""
from pathlib import Path
import copy, hashlib, json, sys
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-hq010-rev1'
LEDGER='docs/planning/REFERENCE_MECHANISM_LEDGER.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
    if p.exists():assert load(p)==x,p
    else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a=1,z=None):
    ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);z=z or len(ls)
    assert 1<=a<=z<=len(ls)
    return dict(path=str(p).replace('\\','/'),sha256=sha(p),startLine=a,endLine=z,text=''.join(ls[a-1:z]))
def qual(n):return 'docs/planning/CAMPAIGN3_'+n+'_QUALIFICATION.md'

# Each judgment is reviewer-written. Exact original paragraphs are retained below;
# no status is inferred from keywords, verdict titles or the obligation registry.
specs=[
(256,'Bounded Campaign2 port retained, not a reduction. Equal seeds do not pair different addresses; public source scope excludes richer component Avoid/coverage. REASON later admits separate contextual role; general calibration, subset residual and causal attribution limits survive.', ['docs/planning/CAMPAIGN2_COGNITIVE_QUALIFICATION.md',qual('REASON'),'docs/planning/CAMPAIGN3_HISTORY_HQ007_CHECKPOINT.md']),
(301,'Pre-entry routing is historical. GA later supplies owned formation/association/cue/reinforcement and safe credit in its declared source; it does not equate spatial Incidental, select a law or infer general body ontology. Separate perception/consequence timing and no unselected sidecar remain. UI is now owner-deferred. Prior queue paragraphs are retained as prior reviews, not counted again.', ['docs/planning/GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','docs/planning/CAMPAIGN3_HISTORY_HQ005_DISPOSITION.md',qual('BIOLOGICAL_SYSTEM')]),
(402,'BELIEF remains binary observer-relative consequence learning; no automatic quantization/decay/Need-precision port. Later AFFECT and SOCIAL discharge bounded successors only; current-lane and general inference are not closed by that fact.',[qual('BELIEF'),qual('AFFECT'),qual('SOCIAL')]),
(419,'Pre-allocation arithmetic is a candidate collision, not psychological necessity. Actual AFFECT supplies observed mitigation and factor sources; action availability and relief alone remain insufficient evidence.',[qual('AFFECT')]),
(429,'Factor laws, no extra die and relief-not-evidence remain bounded. Later social affect and biology supersede only those broad future-routing phrases; fear extinction/generalization and timing-only gaps retain HQ008 triggers. TaskConcern is not general Affect.',[qual('AFFECT'),'docs/planning/CAMPAIGN3_HISTORY_HQ008_CROSSWALK.md']),
(455,'StoredSet/IndexedReplay derivation requires fixed deadlines and fully retained safe history. Controlled workspace has no motive authority; it does not replace memory/attention. The confounded priority fixture remains a finding, not fresh evidence in this audit.',[qual('WORKSPACE_CONTROL')]),
(471,'Competence, belief and identity remain distinct. Later development adds younger learning under its own source and law; original SKILL alternatives are not retired or collapsed into habit.',[qual('SKILL'),qual('DEVELOPMENT_PUBLIC')]),
(485,'SOCIAL qualifies local holder evidence and exact receipt correlation. Later embarrassment is a bounded successor to social-affect routing; general trust, recognition and jealousy remain conditional, not solved by named person models.',[qual('SOCIAL'),'docs/planning/CAMPAIGN3_HISTORY_HQ008_CROSSWALK.md']),
(497,'Habit cache derivation preserves full journal and bounded queries; it does not remove historical influence. Later biology supplies sensed pleasure and integrated pursuit, without selecting general Reward/Need/addiction laws or merging memory owners.',[qual('HABIT'),qual('BIOLOGICAL_SYSTEM')]),
(513,'Relationship response was prospective, not executed interaction. Later grief/embarrassment and attribution have separate witnesses; jealousy remains unmapped. Preserve nonrecipient leakage and ordering failures; derived cache equality is not deletion of relationship history.',[qual('RELATIONSHIP'),qual('REL_ATTRIBUTION'),'docs/planning/CAMPAIGN3_HISTORY_HQ008_CROSSWALK.md']),
(529,'Longitudinal retained folds do not establish arbitrary lossy-history equivalence. Developmental age was missing then and is later qualified separately; old symmetric-standing/adapter/threshold failures remain.',[qual('LONGITUDINAL'),qual('DEVELOPMENT_PUBLIC')]),
(544,'Previously reviewed LEARN paragraph retained via original queue occurrence. Accepted-bound full precision remains an approximation; old other-RO018-active routing is superseded by bounded COMMIT closure.',[qual('LEARN'),qual('COMMIT')]),
(559,'Previously reviewed EPI paragraph retained. Finite consumers and fixed roles/attention do not become general perception; new consumers reopen leak and evidence proofs.',[qual('EPI')]),
(573,'Previously reviewed REASON paragraph retained. ContextModulating is separately traced in this bounded receiver; larger-union residual, direction identity and calibration remain unresolved. Later BIO supersedes old whole-BIO routing only within its profile.',[qual('REASON'),qual('BIO')]),
(587,'DECISION retains authoritative draw/expression and physical outcome separation, with serious opaque balanced-marginal comparator. COMMIT-active routing is later discharged; no new DECISION learning or universal significance law follows.',[qual('DECISION'),qual('COMMIT')]),
(601,'COMMIT closes RO018 bounded lifecycle clause with recurrence identity and active-only pressure. Stale observer knowledge survives unobserved retirement; no generic lifecycle inference or Need relabeling.',[qual('COMMIT')]),
(613,'BODY storage behind sensing and authored REG remain distinct controls. Sampled current-evidence cache equality does not justify public query equivalence or deleting body truth. Later functional biology does not select one universal body ontology.',[qual('BODY_OWNERSHIP'),qual('BIOLOGICAL_SYSTEM')]),
(625,'Early-only seed and contrary-authorship BIO result remains component-scoped; exact old expressions survive. Refold with full history is not lossy compression or general source/coercion admission.',[qual('BIO')]),
(635,'Tolerance component establishes attenuated physical effect under candidate laws; prior displacement probe did not. Later integrated native biology adds bounded consumer scope, not clinical calibration or universal law.',[qual('TOLERANCE'),qual('BIOLOGY_PUBLIC')]),
(645,'Absence deficit separates acquired target from present state. World discrepancy alone is not subjective pressure; later sensing/learning integration is a separate witness. Preserve reference/build corrections.',[qual('ABSENCE_DEFICIT'),qual('BIOLOGY_PUBLIC')]),
(655,'Craving uses fixed recognition/recall controls and separates access, availability and urge. Later biological cue acquisition does not retroactively change that fixture or collapse these distinctions.',[qual('CRAVING'),qual('BIOLOGICAL_SYSTEM')]),
(667,'Relapse after actual withholding is distinct from physiological recovery. Integrated biology later earns bounded joint behavior; old seven-model histories and harness failures remain unchanged.',[qual('RELAPSE'),qual('BIOLOGICAL_SYSTEM')]),
(678,'Costly reward preserves learned benefit/harm and acquired cue access; feedback is not pathwise harm-reducing. Its then-next identity route was superseded by owner-directed biology first, then identity. No old two-option profile expansion implied.',[qual('COSTLY_REWARD'),qual('BIOLOGICAL_SYSTEM')]),
(691,'Functional biology closes18 declared behaviors, not organ-level/clinical or all-profile composition. Component no-public-admission limit is superseded only by the separate biological public qualification; candidate domain necessity remains unearned.',[qual('BIOLOGICAL_SYSTEM'),qual('BIOLOGY_PUBLIC')]),
(705,'Native biological admission preserves53 component trajectories;58 unique runs/270 prefixes are not59/273 unique coverage. Typed disjoint owners do not grant identity or forecasting; those require their separate successors.',[qual('BIOLOGY_PUBLIC')]),
(719,'Eligibility remains separate from choice, context and standing; native and biological sources were later admitted in their own qualification. Preserve equalities, pressure controls and rejected first wrapper. Component scope is not retroactively broadened.',[qual('IDENTITY_ELIGIBILITY'),qual('IDENTITY_PUBLIC')]),
(739,'Restricted-input correction is substantive: output exclusion alone did not limit helper capability. REV2 preserves equal trajectories after safe-context repair;104 executions are52 cases, not doubled coverage. Both cohorts remain.',[qual('IDENTITY_ELIGIBILITY')]),
(751,'Native identity has separate task/biological channels and fine/coarse calibration; distribution changes with equal sampled sequences are retained. Later self/observer belief is a separate owner, not standing renamed. No64-instant scaling inferred.',[qual('IDENTITY_PUBLIC'),qual('IDENTITY_BELIEF_PUBLIC')]),
(780,'Component identity belief distinguishes standing, self and observer estimates; timeout reruns are not new cases. Native admission later closes its own gate without adding social-action or natural recognition claims.',[qual('IDENTITY_BELIEF'),qual('IDENTITY_BELIEF_PUBLIC')]),
(810,'Identity-belief native closure retains torn-save development finding and exact ordinary replay. RO022-active/identity-recovery-deferred routing is superseded by wrapper repair and later recovery. Controlled reporting and prior140-to-next50 semantics remain limits.',[qual('IDENTITY_BELIEF_PUBLIC'),qual('PUBLIC_WRAPPER_QUIESCENCE'),qual('IDENTITY_RECOVERY')]),
(839,'Wrapper repair retains four failures and original serial scopes; new producers must extend inventory. RO021 ACTIVE prose is corrected by identity recovery: CONDITIONAL, mandatory before exit, not satisfied. Current55/58 is separately checked by Values, not inferred from original49.',[qual('PUBLIC_WRAPPER_QUIESCENCE'),qual('IDENTITY_RECOVERY'),qual('VALUES_PUBLIC')]),
(865,'Native standing/belief recovery does not by itself qualify dispositional adaptation; the latter has separate component/native witnesses. Historical expressions remain immutable; RO021 wording correction retained.',[qual('IDENTITY_RECOVERY'),qual('DISPOSITION_PUBLIC')]),
(875,'Disposition component distinguishes constitution/plastic/standing and retains Refold/fusion competitors. Public gate later qualifies separate admission; equality does not retire a conceptual owner.',[qual('DISPOSITION_ADAPTATION'),qual('DISPOSITION_PUBLIC')]),
(887,'Native disposition keeps constitution unwritable and original ADAPT domains unchanged. Step/Leaky and JointMax/JointAdd remain alternatives; larger vectors, fusion and scaling are conditional.',[qual('DISPOSITION_PUBLIC')]),
(899,'Sleep witness uses existing laws and controlled recovery; preserve initial empty-identity/confounded relief fixture. No general sleep physiology or new Task join implied.',[qual('SLEEP_CONTROL')]),
(911,'Intoxication separates clearance, control and execution at identical exposure; masked sensing and independent competence remain. Strict execution boundary is candidate-specific, not replacement of SKILL profiles.',[qual('INTOXICATION_CONTROL')]),
(922,'Chosen reappraisal component retains KnowledgeOnly/BenefitRelative/NoReappraisal; actual native admission follows separately. No physical protection or general planning inferred.',[qual('CHOSEN_REAPPRAISAL'),qual('CHOSEN_REAPPRAISAL_PUBLIC')]),
(933,'Native reappraisal qualifies12 stages and separate owners; no general Task/Biological join. Social-affect next route has separate embarrassment evidence.',[qual('CHOSEN_REAPPRAISAL_PUBLIC'),qual('EMBARRASSMENT_PUBLIC')]),
(942,'Embarrassment component retains coarse equality and fine sensitivity, with32 failed-development trajectories. Native admission later qualifies its own source; no general norm or physiological emotion law.',[qual('EMBARRASSMENT'),qual('EMBARRASSMENT_PUBLIC')]),
(953,'Native embarrassment preserves repaired complete110/display110 versus rejected115 cohort. Cue, actual choice and physical presence remain separate; no general social/physiological closure.',[qual('EMBARRASSMENT_PUBLIC')]),
(958,'Bridge shows significance can protect old event under pressure; retained versus selected differ. SharedProtection/UseOnly/AgeOnly equality does not retire them. Later public continuation is separately qualified.',[qual('DEFINING_MEMORY_BRIDGE'),qual('DEFINING_PUBLIC')]),
(963,'Meaning/use component keeps historical content/credit and later assessment separate; uncertain interval equality is not known equality. Public successor supplies native continuation within controlled carried-cue scope.',[qual('DEFINING_MEANING'),qual('DEFINING_PUBLIC')]),
(968,'Defining public qualifies68 programs and1680 prefixes; one successor per prefix is not full tails. Four laws and carried-cue/empty-graph controls remain; wrapper count is dated, not current inventory.',[qual('DEFINING_PUBLIC')]),
(973,'Development-history reuse proves acquired practice, not developmental state. The BLOCKED age clause and next intake are superseded by separate developmental component/native evidence, not relabeled old runs.',['docs/planning/DEVELOPMENT_HISTORY_CHECKPOINT.md',qual('DEVELOPMENT_PUBLIC')]),
(981,'Owner requirement for younger plasticity and personality weight remains binding; eligibility and historical event-time weighting stay distinct. Later native development qualifies bounded phase states, not calendar ageing or every learning domain.',['docs/planning/DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md',qual('DEVELOPMENT_PUBLIC')]),
(989,'Development component preserves Step/Ramp/disable controls and early probability differences despite equal early actions. Its native OPEN routing is superseded by separate36-program admission, not by component restores.',[qual('DEVELOPMENT'),qual('DEVELOPMENT_PUBLIC')]),
(1003,'Implementation VERIFIED/full matrix RUNNING is dated. Later qualification completes36 programs/668 native prefixes; primary18-row evidence alone did not. Preserve test-only mutation and all earlier cohorts.',[qual('DEVELOPMENT_PUBLIC')]),
(1015,'Native development qualifies event-time gains and immutable constitution; no universal age law.20-partial next routing is historical; later132 bounded clause count still does not close final corpus/history gates.',[qual('DEVELOPMENT_PUBLIC'),'docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md']),
]

assert sha(LEDGER)==sha(B/'sources'/LEDGER), 'Live ledger changed: review freshness before proceeding'
prior=load(P/'campaign3-history-queue-rev1/review.json'); old={r['occurrenceId'] for r in prior['amendments']}
if '--capture' in sys.argv:
    assert not O.exists(); O.mkdir()
    units=[]
    with (B/'units.jsonl').open(encoding='utf-8') as f:
        for line in f:
            u=json.loads(line)
            if u['source']==LEDGER and u['location']['startLine']>=256:units.append(u)
    save(O/'original-units.json',units)
units=load(O/'original-units.json')
assert all(u['location']['endLine']<=1027 for u in units)
assert len({u['id'] for u in units})==len(units)
rows=[]
for u in units:
    line=u['location']['startLine']; start,judgment,evidence=max((s for s in specs if s[0]<=line),key=lambda s:s[0])
    e=excerpt(B/'sources'/LEDGER,line,u['location']['endLine'])
    assert e['text']==u['text'] and e['sha256']==u['sourceSha256']
    rows.append(dict(occurrenceId=u['id'],source=e,reviewGroup=start,
                     accounting='PRIOR QUEUE REVIEW RETAINED' if u['id'] in old else 'NEW AMENDMENT REVIEW',
                     judgment=judgment,evidence=evidence,obligations=['RO-C3-020','RO-C3-021']))
assert old<={r['occurrenceId'] for r in rows}
evidence=[excerpt(p) for p in sorted({p for s in specs for p in s[2]})]
formula=excerpt('docs/formal/FORMULA_INTAKE_LEDGER.md',74,93)
expected=dict(status='HQ-010 DATED AMENDMENT ACCOUNTING COMPLETE IN SCOPE',rows=rows,evidence=evidence,
    formulaTail=dict(source=formula,judgment='Re-intake/versioning process remains valid. Statements treating the cited pin as an authenticated reproducible snapshot are unsupported under HQ009; no formula source equality or adoption is inferred. Require explicit provenance correction/reconciliation before such use.',evidence='docs/planning/CAMPAIGN3_HISTORY_HQ009_CHECKPOINT.md'),
    priorQueueSha256=sha(P/'campaign3-history-queue-rev1/review.json'),originalUnitsSha256=sha(O/'original-units.json'),
    hq009Sha256=sha(P/'CAMPAIGN3_HISTORY_HQ009_CHECKPOINT.md'),obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],
    nextGate='HQ-011 canonical universe and occurrence adequacy',
    limits=['Scope is reference ledger dated amendment tail256..1027 and formula re-intake tail74..93; not every ledger paragraph or whole historical universe.',
            'Qualification documents are bound documentary evidence, not fresh simulation/matrix/build executions or independent receipt revalidation.',
            'Prior12 queue occurrences are retained, not counted as newly reviewed. No original occurrence, ledger, qualification or frozen queue changed.',
            'Conditional distinctions survive routing supersession; no owner/state reduction, law selection, corpus approval or final-exit waiver.'])
def validate(x):
    assert x==expected
    for s in x['evidence']+[x['formulaTail']['source']]+[r['source'] for r in x['rows']]:
        assert s==excerpt(s['path'],s['startLine'],s['endLine'])
validate(expected)
faults=[]
for mode in ['missing-paragraph','lost-limit','changed-source','double-count-prior','false-ro021-status']:
    v=copy.deepcopy(expected)
    if mode=='missing-paragraph':v['rows'].pop()
    elif mode=='lost-limit':v['limits']=[]
    elif mode=='changed-source':v['rows'][0]['source']['text']='changed'
    elif mode=='double-count-prior':next(r for r in v['rows'] if r['accounting'].startswith('PRIOR'))['accounting']='NEW AMENDMENT REVIEW'
    else:next(r for r in v['rows'] if r['reviewGroup']==839)['judgment']='RO021 CLOSED'
    try:validate(v)
    except AssertionError:faults.append(mode)
    else:raise AssertionError(mode)
save(O/'review.json',expected)
c=dict(status='PASS SCOPED AMENDMENT ACCOUNTING',paragraphs=len(rows),prior=len(old),new=len(rows)-len(old),reviewGroups=len(specs),
    boundEvidenceDocuments=len(evidence),faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
