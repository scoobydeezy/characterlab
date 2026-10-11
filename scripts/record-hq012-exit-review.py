"""Record HQ-012's bounded review and explicit NOT EXIT-READY disposition."""
from pathlib import Path
import hashlib,json
P=Path('docs/planning');O=P/'campaign3-hq012-exit-review-rev1'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=p.as_posix(),sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def save(p,v):
    assert not p.exists(),p
    p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
assert not O.exists();O.mkdir()
fresh=load(P/'campaign3-hq012-freshness-rev1/review.json')
fixes={
 'docs/planning/campaign3-history-bookkeeping-findings-rev1/body-partial-current.md':(
   'REJECTED-PREPARATION ARCHIVE',
   'The dated routing copy survives a rejected bookkeeping preparation; it is not current authority. The accepted REV2 copy must be byte-identical.',
   P/'campaign3-history-bookkeeping-classification-finding-rev1/finding.json'),
 'docs/planning/campaign3-history-citation-review-rev1/VivariumMathematicalReference.md':(
   'REVIEWED FORMULA SNAPSHOT',
   'All343 paragraphs reviewed; unsupported historical commit pin corrected forward. This snapshot does not adopt its candidate laws.',
   P/'campaign3-history-external-formulas-rev1/review.json'),
 'docs/planning/campaign3-history-hq001-002-rev1/rejected-development-finding.json':(
   'PRESERVED AUDIT FAILURE',
   'Excerpt endpoint45 exceeded the44-line source. Corrected to44 before review; no production or source content changed. The rejection remains visible.',
   P/'campaign3-history-hq001-002-rev1/review.json')}
assert set(fresh['pending'])==set(fixes)
assert (P/'campaign3-history-bookkeeping-findings-rev1/body-partial-current.md').read_bytes()==(P/'campaign3-history-bookkeeping-findings-rev2/body-partial-current.md').read_bytes()
save(O/'freshness-disposition.json',dict(status='DECLARED SNAPSHOT DELTA ACCOUNTED',
    predecessor=ref(P/'campaign3-hq012-freshness-rev1/review.json'),
    resolved=[dict(source=ref(Path(p)),role=x[0],disposition=x[1],evidence=ref(x[2])) for p,x in fixes.items()],
    pending=[],sourceCounts=dict(unchanged=11367,changed=6,added=4406,missing=0),
    note='No blanket authority inferred from registration. Available source claims retain HQ011 acceptance scope. The three explicit joins supplement, never replace, the prior delta. Later HQ012 reports/routing are authored audit outputs, not new experiments. Final exit will require refreshing after implementation.'))

a=load(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json')
corpus=Path('docs/planning/PHENOMENON_CORPUS.md').read_text(encoding='utf-8-sig')
brief=Path(a['brief']['source']).read_text(encoding='utf-8-sig')
assert len(a['corpus']['members'])==21
assert len(a['brief']['families'])==15
assert sum(len(f['clauses']) for f in a['brief']['families'])==132
mandatory={'DET','ADAPT','EPI','LEARN','MEM','REASON','DECISION','BIO','COMMIT'}
memberNotes={
 'DET':'Accepted addressed-RNG and atomic/prefix replay scope remains. Reuse does not establish a new coupling domain.',
 'ADAPT':'Accepted1.11.0 amendment governs the four-rule common-B0 parent comparison; earlier draft unpassed labels are dated, not current blockers.',
 'EPI':'Exact saturation19/20 and1/10 versus4/5 comparison has a declared consumer roster. Adding consumers reopens coverage, not hidden-truth access.',
 'SEM':'Accepted finite semantic-binding/SEM-001J lifecycle and observer boundaries remain the regression companion; no general recognition theory is inferred.',
 'LEARN':'Exact lower-bound prior/precision, six repetitions and21/50 point witness satisfy the named finite domain. No upper-bound or general inference claim.',
 'MEM':'Recency, selected-only reinforcement, decay, K and canonical tie contrasts retain their declared GA domain. Later reconstruction/retention experiments are separate evidence.',
 'REASON':'Typed semantic grouping, signed source roles, collective redundancy, zero-base exclusion and weak rescue are jointly compared; general correlation is not settled.',
 'DECISION':'Settled, quiet and exposed resolution, matching authoritative roll, prevented execution and five comparators remain qualified. No broader grammar/calibration claim.',
 'BIO':'Accepted composed experiment closes the exact early-only coupling/third-seed/contrary-history comparison. Campaign Plan explicitly accepts that scope. No new native seed-routing requirement is imposed; component260 prefixes are never public Save132. Later native identity/LONG evidence is separate, not a replacement for this experiment.',
 'COMMIT':'Absent/live/retired/new-instance probes preserve acquired standing while concrete applicability and permitted observer knowledge vary. Wider lifecycle remains conditional.',
 'ATTN':'Public sparse/dense footprint, selection, encoding and later probe satisfy the executable1.1.0 fixture. Differences and winner equalities remain; no allocation law selected.',
 'BODY':'Historical16-source/79-prefix ownership comparison remains accepted. Current-source checker fails the known repaired embodiedRuntime hash; exact preserved-source assertions pass. Current wrapper repair/publication evidence is separate, not a fresh16-source rerun.',
 'BELIEF':'Fixed truth/different admitted display, correction, goal-only and opportunity controls preserve unknown/zero and evidence-weight versus calibrated confidence.',
 'AFFECT':'Four independently sourced factors, matched affect/different choices and strictly later feedback qualify the bounded public profile. Scalar contenders remain; regulatory reduction evidence does not prove universal dimensional necessity.',
 'WORK':'Overcapacity selection, isolated distractor/protection, retained versus accessed intention, cue and expiry controls qualify the finite public profile.',
 'SKILL':'Actual competence, performance belief, intent and temporary impairment remain separate; practice and recovery are independently witnessed. No confidence-sensitive general planner inferred.',
 'SOCIAL':'Observer-specific access, mistaken inference and selective explanation correction remain public evidence; target private state is not shared knowledge.',
 'MULTI':'Heterogeneous families, explicit shared/independent/aggregate support and candidate normalization laws execute publicly. Arbitrary cross-role overlap remains conditional.',
 'HABIT':'Public acquisition and changed-reward/reversal controls preserve belief and history distinctions; later addiction witnesses do not select one universal habit law.',
 'REL':'Own dyadic history versus matched current estimates, rupture/contact/absence and stored/refold alternatives retain their bounded distinctions. Correction is not automatically repair.',
 'LONG':'Native acquisition of biography, skill and relationship, selective interference, detail loss and skill relearning satisfy the declared three-family domain. Later component extensions do not become a single native lifetime simulation.'}
members=[]
for m in a['corpus']['members']:
    key=m['id'].split('-')[1]
    assert m['sourceText'] in corpus,m['id']
    members.append(dict(id=m['id'],version=m['version'],initialMandatory=key in mandatory,
        disposition='ACCEPTED PRIOR QUALIFICATION IN DECLARED SCOPE',
        scopeDecision=memberNotes[key],priorStatus=m['status'],authority=m['authority'],
        requirements=m['clauses'],
        currentEvidence=[ref(Path(p)) for p in sorted({p for c in m['clauses'] for p in c['evidence']})],
        limitation='This is an exit-review disposition of named evidence, not a new experiment, all-model corpus replay or waiver of wider topology gates.'))
save(O/'corpus.json',dict(status='21 MEMBER REQUIREMENTS REVIEWED; BOUNDED QUALIFICATIONS RETAINED',
    source=ref(P/'PHENOMENON_CORPUS.md'),priorAudit=ref(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json'),
    corpus=a['corpus']['version'],digest=a['corpus']['digest'],members=members,
    mandatoryCount=sum(m['initialMandatory'] for m in members),newBehavioralRuns=0))
familyLimits=[
 'Functional body and safe sensing are bounded; no organ-level or universal physiology claim.',
 'Need, expectation and durable Value remain distinct; Values closed-loop and appraisal gaps below prevent final topology acceptance.',
 'Acquisition, retention, access, reconstruction and defining-memory scopes remain distinct; no lifetime compression.',
 'Fallible admitted learning and controlled inference remain bounded; no calibrated trust or general causal discovery.',
 'Factor appraisal and regulatory contrasts retain scalar comparators; the Value-to-appraisal edge is not earned by Value-to-reason receiving.',
 'Access, maintenance, fatigue, inhibition and chosen regulation have bounded witnesses; no universal control resource.',
 'Goal ownership/lifecycle and strategy alternatives have bounded witnesses; controlled Values pressure is not autonomous Value/goal lifecycle integration.',
 'Actual skill, perceived performance and impairment are distinct; no universal transfer or practice law.',
 'Acquisition, resistance, reward, dependence, relapse and functional biology remain bounded; no clinical addiction model.',
 'Own/attributed/target state and fallible social inference remain distinct; no unrestricted recursive mentalizing.',
 'Own interaction history, person estimates and relationship effects remain separate; no general attachment law.',
 'Constitution, plastic disposition, standing and represented identity stay distinct; Values age integration is not implied.',
 'Controlled statement/display interpretation and deception witnesses do not establish natural language generation.',
 'Intent, expression, attempt, physical outcome and observed feedback retain distinct owners; not all component extensions are native.',
 'Finite acquired histories and relearning/loss compositions remain bounded; no single integrated lifetime simulation.'
]
families=[]
for f,limit in zip(a['brief']['families'],familyLimits):
    assert f['sourceText'] in brief,f['family']
    assert all(c['status']=='QUALIFIED BOUNDED' for c in f['clauses'])
    families.append(dict(family=f['family'],title=f['title'],
        disposition='BOUNDED CLAUSE WITNESSES RETAINED; NO WHOLE-FAMILY PASS',
        priorFamilyStatus=f['status'],clauses=f['clauses'],limit=limit,
        evidence=[ref(Path(p)) for p in sorted({p for c in f['clauses'] for p in c['evidence']})]))
save(O/'families.json',dict(status='15 FAMILIES /132 CLAUSES ACCOUNTED; TOPOLOGY EXIT GATE OPEN',
    source=ref(Path(a['brief']['source'])),priorAudit=ref(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json'),families=families,
    note='Prior family PARTIAL labels are preserved separately from132 bounded clause statuses. Neither a count nor a historical family label alone settles current topology adequacy.'))
gapEvidence=[ref(p) for p in [Path('CHARACTER_ARCHITECTURE.md'),Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md'),
    P/'VALUES_READINESS.md',P/'VALUES_PUBLIC_READINESS.md',P/'CAMPAIGN3_VALUES_QUALIFICATION.md',P/'CAMPAIGN3_VALUES_PUBLIC_QUALIFICATION.md',
    P/'campaign3-history-post-cutoff-join-rev1/review.json',Path('src/campaign3/valuesPublicRuntime.ts'),Path('src/campaign3/valuesPublicMath.ts')]]
gaps=[
 dict(id='HQ012-VALUES-OUTCOME',requirement='VALUES_READINESS cases2/3: same physical result with withheld evidence; same admitted evidence with different private outcome.',
      found='The accepted Values source admits controlled receipts and simulates no private physical world. Field rejection is not the required matched-world experiment.',
      next='Add a bounded actual action/outcome and observer-safe consequence source; hold physical truth and admitted evidence independently. Preserve no-opportunity, missing and observed-neutral distinctions.'),
 dict(id='HQ012-VALUES-GOAL',requirement='VALUES_READINESS case7: goal completion/retirement does not erase retained Value.',
      found='Current goal pressure is controlled; Task deadline65 proves carrier expiry, not autonomous goal completion or retirement.',
      next='Join an existing owned goal lifecycle to actual completion/retirement, with fixed learned Value and changed receiving. Retained preference must survive loss of that concrete goal.'),
 dict(id='HQ012-VALUES-APPRAISAL',requirement='Canonical Values -> Appraisal edge, distinct from Values -> Motives.',
      found='Native Values qualifies reasons52 and arbitration60; its qualification explicitly excludes Values-to-appraisal. A motif/reason contribution is not appraisal output.',
      next='Specify a conservative bounded read-only appraisal consumer under existing ownership. Hold belief and current goal fixed while learned preference varies, then hold preference fixed under goal/context interventions. Do not infer a general exchange rate or make affect choose action.')]
for g in gaps:g.update(owner='RO-C3-019',escalation='NONE: existing topology/source/owner precedent; no ontology change',evidence=gapEvidence)
save(O/'open-gates.json',dict(status='ACTIVE IMPLEMENTATION GATES; NO OWNER RULING',gates=gaps,
    preserved=['Accumulated','Latest','NoConsolidation','Refold','NeedOnly','ValuesOnly','Joint complete-overlap equality'],
    excludedClaims=['universal Value law','irreducible Value storage','natural category learning','clinical or lifetime generality'],
    existingVerdicts='VER-C3-VALUES-001 and VER-C3-VALUES-PUBLIC-001 remain valid; their exclusions identify the missing evidence rather than a behavioral failure.'))
save(O/'review.json',dict(status='HQ012 EXIT REVIEW COMPLETE; CAMPAIGN3 NOT EXIT-READY',
    disposition='LOCAL DISPOSITION; continue existing Values integration under RO019. No architectural ruling.',
    gates=[ref(O/n) for n in ['freshness-disposition.json','corpus.json','families.json','open-gates.json']],
    historicalHandoff=ref(P/'campaign3-history-hq011-handoff-rev1/review.json'),
    freshChecks=[ref(P/'campaign3-hq012-corpus-checks-rev1'/n) for n in ['check.json','body-history-check.json','archive-check.json']],
    wrapper=dict(command='node scripts/check-values-wrapper-extension.mjs',exitCode=0,producers=55,factories=58,
                 scope='Fresh inventory and preserved closure checks; not fresh behavioral replay.',
                 evidence=ref(P/'VALUES_WRAPPER_EXTENSION_REV1.json'),checker=ref(Path('scripts/check-values-wrapper-extension.mjs'))),
    biologicalComparison='No new BIO native gate: accepted Campaign Plan explicitly qualifies the composed comparison. Public RNG-profile admission remains outside that claim.',
    sourceLimits='208 unavailable historical targets, including74 exit-inventory versions, retain HQ011 per-claim restrictions. The legacy log is not a gate. No missing identity was used as source-exact proof.',
    finalAcceptance='WITHHELD pending the named Values integration gates and subsequent freshness/exit refresh. RO019 ACTIVE, RO021 UNSATISFIED, RO022 CLOSED in55/58 scope.',
    counters=dict(highestAllocated=1519,sinceLastVerdictOrCorpus=0),newVerdicts=0,newBehavioralRuns=0))
print('Recorded HQ012 scientific exit disposition; routing/registry registration follows separately.')
