"""HQ011 first authority batch: owner rulings plus the formal register table.
Historical formal resolution chronology is explicitly outside this batch.
"""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-authority-decisions-rev1'
OWNER='docs/planning/CAMPAIGN3_PENDING_OWNER_DECISIONS.md';FORMAL='docs/formal/OPEN_DECISIONS.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a=1,z=None):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);z=z or len(ls)
 assert 1<=a<=z<=len(ls)
 return dict(path=str(p).replace('\\','/'),sha256=sha(p),startLine=a,endLine=z,text=''.join(ls[a-1:z]))
def q(n):return 'docs/planning/CAMPAIGN3_'+n+'_QUALIFICATION.md'
GA='docs/planning/GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md'
owner_groups=[
 (1,'REGISTER POLICY / RESOLVED STATUS','Only architecture-level escalations belong here; Open0 is not zero research debt. Later resolutions govern the preserved original packet.',['RO-C3-021']),
 (14,'ACCEPTED OWNER DESIGN DIRECTION','Separate encoding and retrieval functions under qualitative constraints. A/B remain controls; no final modulation law selected.',['RO-C3-002']),
 (68,'ACCEPTED SCOPE AMENDMENT / CONDITIONAL LIMIT','C6 is fixture-relative, not arbitrary-recency dominance. Family omega<=2 remains visible; A reaches2 only with peripheral pool0. Reopen response family if a required crossover>=2; do not build it for a hypothetical case.',['RO-C3-003']),
 (106,'CANDIDATE DISPOSITIONS / NOT UNIVERSAL LAW','A fails nonzero peripheral constraint, B cannot cross original fixture, C meets seven constraints there. No general Affect representation or curve-family selection follows.',['RO-C3-002','RO-C3-003']),
 (122,'RATIFIED TOPOLOGY WITH CANDIDATE LAW','Prior transient character-state feedback to later attention is ratified; TaskConcern is not general Affect. Eligibility/K unchanged; disabled comparator permanent. GA-open language is dated, later bounded GA qualifies separately.',['RO-C3-002','RO-C3-007']),
 (168,'COMPARISON OBLIGATION DISCHARGED IN SCOPE','A/B shape comparison, then C, discharge named comparison work. Calibration-only alternatives would not satisfy it. Broader psychological correctness stays unresolved.',['RO-C3-002','RO-C3-003']),
 (201,'PRESERVED THREE-WAY DISTINCTION','EnabledKnown, enabled-but-unavailable and Disabled are distinct; unavailable/absent mechanism must not silently become knownq0.',['RO-C3-002']),
 (209,'HISTORICAL BLOCKER SUPERSEDED ONLY IN BOUNDED GA','Seam existence required source/join/path, reliance on shape required comparison. Bounded GA later earns its own footprint/retrieval/public gate; the early concern result alone never did.',['RO-C3-002','RO-C3-007']),
 (222,'PRESERVED PRE-RULING PACKET; NOT CURRENT BLOCKER','Original proposal/recommendation/against/if-declined wording is historical. Scope-amended ruling rejects the implication TaskConcern is general Affect and declines to canonize the formula. Actual implementation description is Candidate A, not a universal law.',['RO-C3-002','RO-C3-003','RO-C3-021']),
 (313,'RESOLUTION INDEX','Both named owner rulings resolved; broader source/curve obligations remain. Cross-reference to historical resolutions is not acceptance of every log entry.',['RO-C3-021'])]
specs=[
('ATTN-001','BOUNDED CLOSED','GA qualifies43 models/36 comparisons, not all attention/modality inference or final laws. Retain all source/encoding/recall distinctions.','New source/modality or law claim requires successor evidence.',[GA],['RO-C3-007']),
('EMB-001','BOUNDED SUCCESSORS; GENERAL SCOPE OPEN','Old body-only experiment is superseded in integration scope by BODY ownership and biology public, not retrospectively expanded.','General Need/physiology and new joint consumers require separate comparison.',[q('BODY_OWNERSHIP'),q('BIOLOGY_PUBLIC')],['RO-C3-008']),
('C2-TRACE-001','SHAPE/COMMITMENT CLOSED','Preserve0.2 wrapper commitment; later bounded Campaign2 completion does not authorize generic trace/VAL/factory widening.','New profile or public continuation authority reopens its gate.',['docs/planning/CAMPAIGN2_COMPLETION_REVIEW.md'],['RO-C3-020']),
('C2-MODEL-PACK-001','PACKET CLOSED','Two version authorities and exact model bytes are packet-specific; no general manifest substitution.','Changed model/registry/profile requires new freeze.',['docs/planning/CAMPAIGN2_FIRST_MODEL_BYTE_REVIEW.md'],['RO-C3-020']),
('C2-OBS-UNIT-001','ALLOCATION/COMPONENT CLOSED','Observation unit identity remains distinct from factory/phenomenon qualification.','Changed bridge unit domain requires its own semantic/allocation proof.',['docs/planning/CAMPAIGN2_OBSERVATION_UNIT_IMPLEMENTATION.md'],['RO-C3-020']),
('C2-BRIDGE-OBS-001','BOUNDED BRIDGE CLOSED','Projected203 is sole authoritative observation; private raw candidate is not character evidence.','New observation route must preserve authority and epistemic admission.',['docs/planning/CAMPAIGN2_BRIDGE_OBSERVATION_DECISION.md'],['RO-C3-020']),
('C2-INPUT-ENC-001','ENCODING CLOSED','Five-item positional input encoding is versioned and model-bound, not arbitrary ingress.','Changed profile/encoding needs accepted contract and vectors.',['docs/planning/CAMPAIGN2_ORDERED_INPUT_ENCODING_DECISION.md'],['RO-C3-020']),
('ORD-001','GENERAL QUESTION RETAINED','BELIEF explicitly leaves same-event/current-lane timing open; consequence140 to later50 does not settle it.','A consumer needing newly learned belief in the same event needs explicit phase contract.',[q('BELIEF')],['RO-C3-010']),
('ORD-002','BOUNDED FAN-OUT DISCHARGED','SOCIAL immutable snapshot/disjoint updates and normalized reversed fan-out equality discharge first fixture only.','Reciprocal/conflicting simultaneous interactions need their own ordering proof.',[q('SOCIAL')],['RO-C3-014']),
('ORD-005','BOUNDED LATER-FEEDBACK WITNESSES','AFFECT and regulatory reduction qualify strictly later consequences; this is not a general same-instant regulation rule.','New current/later feedback topology needs explicit phase mapping.',[q('AFFECT'),q('AFFECT_REGULATORY')],['RO-C3-011']),
('TRC-003','BOUNDED PROJECTION; WIDER PRIVACY OPEN','SOCIAL ObserverView814 is closed and read-audited; omniscient research saves are not observer views. UI is owner-deferred.','New consumers/projections or authentication claims reopen privacy proof.',[q('SOCIAL'),'docs/planning/CAMPAIGN3_HISTORY_HQ005_DISPOSITION.md'],['RO-C3-014','RO-C3-019']),
('TRC-004','BOUNDED PUBLIC SUCCESSORS','MULTISOURCE/REASON later exercise public sources and aggregate coverage. General weighted-overlap law and subset residual remain.','New correlation/source/role law or reduction requires comparison.',[q('MULTISOURCE_PUBLIC'),q('REASON')],['RO-C3-001','RO-C3-020']),
('DEC-001','BROADER BOUNDED WITNESSES; NO BLANKET CLOSURE','Native identity and enacted refusal-cost component add qualified contexts beyond free task choice. Component coercion is not native Expression426 admission or all intervention semantics.','General qualification/cost/coercion/source or native-join claims require scoped proof.',[q('IDENTITY_PUBLIC'),q('ENACTED_COERCION')],['RO-C3-009','RO-C3-019']),
('ADAPT-001','QUALIFIED BOUNDED PROFILES','Preserve current finite composition and PHEN-ADAPT result; no automatic new kinetics/state admission.','New profile or adaptation owner/domain requires its own contract.',['docs/planning/CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md'],['RO-C3-020']),
('VAL-001','QUALIFIED GOVERNED EXECUTABLES','VAL means fixed committable executable meaning, not acquired Values; no anonymous callback admission.','New compiler/profile semantics require qualification.',['docs/planning/CAMPAIGN2_COMPLETION_REVIEW.md'],['RO-C3-020']),
('C2-PERSIST-001','QUALIFIED QUIESCENT PROFILES','Actual cognitive draws are included in bounded complete-prefix persistence; no mid-instant/imported learned S0 or external coupling maps.','Changed continuation state or save boundary requires proof; wrapper atomicity is separate.',['docs/planning/CAMPAIGN2_COMPLETION_REVIEW.md',q('PUBLIC_WRAPPER_QUIESCENCE')],['RO-C3-020']),
('MATH-002','CONDITIONAL CANDIDATE HAZARD','Upper-triangle polynomial and symmetric matrix coefficients are not interchangeable.','Signal-field adoption must declare convention and equivalence vectors.',['docs/formal/FORMULA_INTAKE_LEDGER.md'],['RO-C3-020']),
('MATH-003','CONDITIONAL CANDIDATE HAZARD','Mean/covariance do not supply arbitrary fourth moments.','Quadratic variance candidate must declare distribution or extra moments.',['docs/formal/FORMULA_INTAKE_LEDGER.md'],['RO-C3-010','RO-C3-020']),
('MATH-004','CONDITIONAL CANDIDATE HAZARD','Scalar BELIEF does not solve covariance positive-semidefinite validity under quantization.','Covariance-bearing candidate requires PSD-preserving representation/proof.',['docs/formal/FORMULA_INTAKE_LEDGER.md',q('BELIEF')],['RO-C3-010']),
('ONT-001','GENERAL ONTOLOGY GATE RETAINED','Finite admitted identities/facets do not establish generalized inheritance, affordance closure or natural recognition.','Broader inference requires typed rules/conflicts/versioning and no appraisal-to-world-truth leakage.',['docs/planning/CAMPAIGN3_HISTORY_HQ008_CROSSWALK.md'],['RO-C3-007','RO-C3-020'])]
for p in [OWNER,FORMAL]:assert sha(p)==sha(B/'sources'/p)
units=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']==OWNER:units.append(u)
assert len(units)==71
rows=[]
for u in units:
 start,disposition,judgment,obs=max((g for g in owner_groups if g[0]<=u['location']['startLine']),key=lambda g:g[0])
 e=excerpt(B/'sources'/OWNER,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
 rows.append(dict(occurrenceId=u['id'],source=e,disposition=disposition,judgment=judgment,obligations=obs))
formal=[]
for ident,disposition,finding,trigger,evidence,obs in specs:
 ls=Path(FORMAL).read_bytes().decode('utf-8-sig').splitlines(keepends=True)
 hits=[i+1 for i,s in enumerate(ls) if s.startswith('| `'+ident+'`')];assert len(hits)==1
 formal.append(dict(id=ident,source=excerpt(B/'sources'/FORMAL,hits[0],hits[0]),disposition=disposition,finding=finding,reopen=trigger,evidence=evidence,obligations=obs))
evidence=[excerpt(p) for p in sorted({p for s in specs for p in s[4]})]
evidence += [excerpt('docs/planning/VERDICT_LEDGER.md',844,1070),excerpt(B/'sources'/FORMAL,191,239),excerpt(B/'sources'/FORMAL,1940,2000)]
receipts=[dict(path=str(P/n).replace('\\','/'),sha256=sha(P/n)) for n in ['CONCERN_MODULATION_COMPARISON_REV1.json','CONCERN_MODULATION_CANDIDATE_C_REV1.json','CONCERN_RETRIEVAL_CEILING_REV1.json']]
r=dict(status='OWNER REGISTER REVIEWED; FORMAL TABLE SCOPED; HQ011 STILL OPEN',ownerOccurrences=rows,formalRowFragments=formal,evidence=evidence,receipts=receipts,
    obligations=['RO-C3-001','RO-C3-002','RO-C3-003','RO-C3-007','RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-011','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'],
    limits=['71 whole owner occurrences;20 formal row fragments are not all371 formal occurrences. Formal resolution chronology still requires review.',
            'Source acceptance is limited to recorded owner authority and exact scoped decisions; evidence binding is not fresh execution or general law selection.',
            'Original escalation packets remain historical; zero pending owner rulings is not zero scientific debt.',
            'Broader P1/P2 rows are preserved with triggers. No automatic architectural escalation or blanket decision closure.'],
    nextGate='Continue HQ011 formal resolution chronology, then verdict/qualification spine.')
def validate(x):
 assert x==r
 for e in [z['source'] for z in x['ownerOccurrences']+x['formalRowFragments']]+x['evidence']:
  assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 for e in x['receipts']:assert sha(e['path'])==e['sha256']
validate(r);faults=[]
for mode in ['missing-owner-occurrence','law-canonized','lost-three-branches','blanket-table-closure','erased-limit']:
 x=copy.deepcopy(r)
 if mode=='missing-owner-occurrence':x['ownerOccurrences'].pop()
 elif mode=='law-canonized':x['ownerOccurrences'][0]['judgment']='Candidate C is universal law'
 elif mode=='lost-three-branches':x['ownerOccurrences'][40]['judgment']='Unavailable equals disabled equals known0'
 elif mode=='blanket-table-closure':x['formalRowFragments'][7]['disposition']='GENERAL CLOSED'
 else:x['limits']=[]
 try:validate(x)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
O.mkdir(exist_ok=True);save(O/'review.json',r)
c=dict(status=r['status'],ownerOccurrences=71,formalRowFragments=20,faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
