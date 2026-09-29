from pathlib import Path
import json,hashlib,subprocess
p=Path('docs/planning');result=json.loads((p/'CHOSEN_REAPPRAISAL_RESULT_REV1.json').read_text())
assert result['status']=='PASS' and result['runs']==43 and result['prefixes']==387
report=p/'CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md';assert not report.exists(),'Do not rerun finalization'
report.write_text('''# Chosen reappraisal component qualification — 2026-09-27

**BOUNDED COMPONENT QUALIFIED — VER-C3-CHOSEN-REAPPRAISAL-001. LOCAL DISPOSITION.**
Stages A–E for chosen-reappraisal-component/0.1-candidate. Native public admission
remains OPEN and is the next integration gate. No owner ruling required.

| Measure | Qualified scope |
|---|---|
| Component models / runs |4 /43|
| All complete component prefixes |387:344 advancing /43 terminal|
| Focused / reference tests |13 /328; build passed|
| Highest allocation / since verdict |1458 /0; no new allocation|
| New native source / factory admission |None|

## Chosen strategy, applied frame and later affect

The character now chooses whether to consider a known conditional frame or pursue
an independent competing work goal through the actual inherited reason/dice pipeline.
Prior admitted observations establish unprotected/protected outcome means and a known
catalogue. BenefitRelative projects positive expected conditional benefit through an
adopted regulation goal; work has its independent adopted importance. Neither truth
nor a caller-selected action supplies the decision. Candidate catalogue identifiers
are not received commands to reappraise.

The fixed threat-concern appraisal remains distinct from the optional regulation goal
(the source's safety field). Goal-only removal of regulation does not erase threat,
change severity or edit beliefs. This is a bounded prospective-benefit projection,
not general planning, learned control efficacy or spontaneous goal discovery.

In the balanced contest, exact probabilities are1/2 for each strategy. Across every
seed0..7, seeds1/4/5/6 choose reappraisal and0/2/3/7 choose work. The full roster remains
in the result. Canonical reason nuclei, resolution, intent, DecisionExpression, plan
and attempt are retained. A helpful frame can lose to a competing motive.

Chosen successful reappraisal at4 installs the conditional frame after its earlier
appraisal. Affect at4 remains1; at5 it becomes0. The two-coordinate projection retains
[1,1] -> [0,0] separately. Original observations and both learned means remain unchanged.
This is affect under contemplated protection, not a claim that the world became safe
or that physical protection was executed. Felt relief supplies no outcome evidence.

## Discriminating controls

SafetyOnly versus WorkOnly changes actual strategy at identical learned knowledge.
Interrupted matches SafetyOnly's exact choice, intent, expression, plan and attempt,
but failed completion leaves the frame absent and later affect1. NoReappraisal retains
even successful completion and removes only frame installation. Neither operation
failure nor ablation retroactively rewrites the decision.

Unknown conditional belief, unavailable/denied catalogue and absent opportunity prevent
the appropriate operation. A condition first observed in consequence4 becomes known
at5 but cannot enable the earlier choice4. Zero goals yield no chosen action; no empty
option acquires a motive merely because it exists in the catalogue.

KnowledgeOnly is a meaningful comparator: it values considering an eligible known
frame without estimating positive conditional benefit. For equal-known balanced cases
it matches BenefitRelative exactly. Mixed protected evidence retains mean1/2 and
produces different choice probabilities across these laws. With no competing work,
KnowledgeOnly chooses an ineffective or harmful frame that BenefitRelative rejects.
The ineffective frame leaves later affect1; the harmful frame changes0 ->1. Knowledge
does not imply helpfulness, and successful reappraisal is not guaranteed relief.

Hidden physical harm changes preserve the entire safe component history, including
later occurrence provenance. Denied versus absent catalogue also yields whole-view
equality. Physical harm is diagnostic only; internal operation completion is not
world-danger evidence. Chosen work remains a competing commitment without an enacted
external work outcome. Identity learning, goal lifecycle, physiology and social affect
remain separately qualified domains rather than silently joined mechanisms.

## Evidence and precise admission scope

CHOSEN_REAPPRAISAL_PLAN_REV1.json freezes the full dependency graph, content, four
canonical ModelIdentities,43 RunIdentities with original inputs/seeds, ExperimentIdentity
and ComparisonCase before execution. Every S0..S8 component save restores through fresh
original replay and whole-byte equality, then matches its exact next state/save or
terminal no-op. Frozen law/input/projection/seed and committed RNG are authenticated.

Thirteen focused tests include malformed restore rejection, whole safe views, before/
after-decision and application/commit faults, retry equality and busy reads/concurrent
settlement rejection. All328 preserved reference tests and the build pass. The first
focused cohort passed; no failed implementation cohort was suppressed. Reappraisal and
subsequent biological/identity/disposition predecessor closure receipts remain valid.

This component implements explicit ownership and causal order in one transaction.
It does not prove native registered writer authority, actual scheduler phases, admitted
public source records, native Failed lifecycle or Save132 continuation. It adds no
native producer/factory; the existing50-producer/53-factory audit stays unchanged.
CHOSEN_REAPPRAISAL_RESULT_REV1.json and CHOSEN_REAPPRAISAL_CLOSURE_REV1.json bind the
bounded evidence. Native integration must close separately before a public claim.

## North Star transfer and obligations

A character can choose a cognitive operation for a goal-relative anticipated benefit,
fail to complete it, or prefer another goal. Successful completion changes the later
interpretive frame while preserving the evidence and belief that made it intelligible.
An operation may even worsen affect if merely known rather than expected helpful.

MEC001/002/003/011..019/022 and P3-001/004/005/008/011 retain the contract's reference
dispositions. Old DirectAffectOverride and ReliefAsEvidence failures remain binding;
the instructed profile is neither rewritten nor relabeled chosen. RO010/011/012/019/020
retain broader inference/affect/control and the immediate native integration debt.
RO021 historical reconciliation remains mandatory. No obligation closes by deferral.

Brief12.5-7 gains this component-scoped bounded witness. AuditREV65:109 bounded/20
partial/3 blocked among132 clauses/15 families; corpus0.29.0 still21 members,83 named
verdicts. No whole Campaign3 exit. Next CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md: admit
native source, authority, phases, original lineage, RNG and wrapper publication.
''',encoding='utf8')
log=p/'CHOSEN_REAPPRAISAL_BUILD_REV1.log';assert 'built in' in log.read_text() and 'error TS' not in log.read_text()
(p/'CHOSEN_REAPPRAISAL_BUILD_REV1.json').write_text(json.dumps({'status':'PASS','command':'npm run build','exitCode':0,'log':str(log).replace('\\','/'),'logSha256':hashlib.sha256(log.read_bytes()).hexdigest()},indent=2)+'\n')
subprocess.run(['node','scripts/check-chosen-reappraisal-closure.mjs','--write'],check=True)
verdict='VER-C3-CHOSEN-REAPPRAISAL-001';refs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text());r['date']='2026-09-27';r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
for name in ['CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md','CHOSEN_REAPPRAISAL_FINDINGS.md','CHOSEN_REAPPRAISAL_PLAN_REV1.json','CHOSEN_REAPPRAISAL_RESULT_REV1.json','CHOSEN_REAPPRAISAL_CLOSURE_REV1.json']:r['reportReviews'].append({'path':'docs/planning/'+name,'obligations':refs})
r['reportReviews'].append({'path':'docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md','obligations':refs+['RO-C3-022']})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in ['CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md','CHOSEN_REAPPRAISAL_CLOSURE_REV1.json','CHOSEN_REAPPRAISAL_FINDINGS.md','CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md'])
  o['established']+=' VER-C3-CHOSEN-REAPPRAISAL-001 adds bounded actual strategy choice -> attempted operation -> later conditional frame/affect:4 component models/43 runs/387 prefixes;13 new/328 reference tests/build;1458/0. Goal-only choice and independent completion are discriminated at fixed knowledge. BenefitRelative/KnowledgeOnly/NoReappraisal and two affect projections retained; harmful known frame can worsen affect. Original evidence stays unchanged; all eight balanced seeds retained.'
  o['unresolved']+=' Chosen reappraisal remains component-scoped: native source/authority/scheduler/lineage/RNG/Save132 and wrapper admission is the immediate next integration gate, not discharged by component byte replay. No general planning, physical protection, affect override, social regulation, physiology or Task/Biological identity join. Prior instructed-profile and invalid relief-as-evidence controls remain binding.'
 if o['id']=='RO-C3-022':o['evidence'].append('docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md')
f.write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write('''

## `VER-C3-CHOSEN-REAPPRAISAL-001` — bounded chosen reappraisal component (2026-09-27)

QUALIFIED COMPONENT / LOCAL DISPOSITION, chosen-reappraisal-component/0.1-candidate.
4 models/43 runs/387 component prefixes;13 new/328 reference tests/build;1458/0.
Actual inherited reason/dice strategy choice, intent/expression/attempt/completion,
later frame and affect remain distinct. Goal-only choice and failed completion preserve
knowledge; harmful known frames can increase affect. BenefitRelative/KnowledgeOnly/
NoReappraisal and two projections retained; all eight seeds. No physical protection
or native public admission. Brief12.5-7 bounded component witness; native gate next.
RO010/011/012/019/020/021. Evidence CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md and
CHOSEN_REAPPRAISAL_CLOSURE_REV1.json; next CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md.
''')
for n in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/n).open('a',encoding='utf8') as f:f.write('''

### Chosen reappraisal component — 2026-09-27
VER-C3-CHOSEN-REAPPRAISAL-001:4 models/43 runs/387 component prefixes;13+328 tests/
build;1458/0. MEC001/002/003 evidence, MEC011 access, MEC012..017/019/022 inherited
reason/dice/choice/expression/attempt and calibration remain explicit. MEC018 identity
controls retained separately. P3-001/004/005/011 preserve belief/frame/affect, projection
alternatives, relief-not-evidence and later order; P3-008 social affect remains outside.
No historical mechanism retired. KnowledgeOnly can choose harmful/ineffective frames;
BenefitRelative and NoReappraisal retained. Native source/authority/scheduler admission
is OPEN, next CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md. No new record allocation.
''')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — chosen reappraisal component\nVER-C3-CHOSEN-REAPPRAISAL-001 adds bounded actual strategy choice and later frame/affect:4 models/43 runs/387 component prefixes,13+328 tests/build,1458/0. Native public source/authority/scheduler admission remains OPEN under docs/planning/CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md; next integration gate. No owner ruling or Campaign3 exit.\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved chosen reappraisal qualification in progress — 2026-09-27\n\n'+f.read_text())
f.write_text('''# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Chosen reappraisal COMPONENT QUALIFIED — VER-C3-CHOSEN-REAPPRAISAL-001.**
LOCAL DISPOSITION; no architectural blocker. Start CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md
and CHOSEN_REAPPRAISAL_CLOSURE_REV1.json. chosen-reappraisal-component/0.1-candidate.
Native public admission is OPEN and is the next integration gate.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1458** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 - 21 members / 83 verdicts** |
| Brief clauses / families | **132 / 15** |
| Brief clause dispositions | **109 bounded / 20 partial / 3 blocked** |
| Component experiment | **4 models / 43 runs / 387 prefixes** |
| Validation | **13 new / 328 reference tests; build passed** |

Actual goal-relative choice consumes prior conditional knowledge and inherited dice.
Intent/expression/attempt/completion remain separate; frame application4 changes5,
never earlier affect or learned evidence. All eight balanced seeds retained: four
choose reappraisal, four work. BenefitRelative/KnowledgeOnly/NoReappraisal and two
affect projections remain; known harmful frame can increase later affect.

CHOSEN_REAPPRAISAL_FINDINGS.md preserves exact limits: constant threat concern versus
optional regulation goal, hypothetical frame versus physical protection, component
transaction versus native phases/authority. No new allocation or native producer.

Next CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md: successor native source/authority/schema/
phase/lineage/save contract and integration. Extend existing50/53 wrapper inventory
when adding a producer. RO019 ACTIVE; RO020 native debt explicit; RO021 final history
gate remains unsatisfied. AuditREV65; Campaign3 NOT EXIT-READY. No owner ruling.
''',encoding='utf8')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** bounded intoxication/control','**Prior routing (2026-09-27):** bounded intoxication/control',1)
s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-27):** chosen reappraisal COMPONENT QUALIFIED:
VER-C3-CHOSEN-REAPPRAISAL-001. Start CURRENT.md and
CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md.4 models/43 runs/387 component prefixes;
13 new/328 reference tests/build;1458/0. Actual strategy choice, independent attempted
completion and later conditional affect preserve evidence. BenefitRelative/KnowledgeOnly/
NoReappraisal and two projections retained. Native admission remains OPEN: next
CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md. AuditREV65:109 bounded/20 partial/3 blocked.
No owner ruling; existing50/53 native wrapper scope unchanged. No physical protection.
''',1);f.write_text(s,encoding='utf8')
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('''

## REV65 — chosen reappraisal component, 2026-09-27
VER-C3-CHOSEN-REAPPRAISAL-001 promotes Brief12.5-7 with a bounded COMPONENT witness:
4 models/43 runs/387 prefixes;13 new/328 reference tests/build;1458/0. Actual goal-relative
choice and independent completion change later conditional frame/affect without belief
credit. Native source/authority/scheduler admission is OPEN and is the next gate.
109 bounded/20 partial/3 blocked;83 verdicts. No whole Campaign3 exit or native claim.
''')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();Path('scripts/check-campaign3-exit-audit-rev64.mjs').write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV64.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV65.json'").replace('result.snapshotRevision=64;','result.snapshotRevision=65;')
s=s.replace('const inventory=',"""// REV65: chosen reappraisal component, native admission remains open.
{const clause=families[4].clauses[6];clause.status=Q;clause.evidence.push(p+'CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md',p+'CHOSEN_REAPPRAISAL_CLOSURE_REV1.json');clause.rationale='VER-C3-CHOSEN-REAPPRAISAL-001:4 models/43 runs/387 complete COMPONENT prefixes; actual goal-relative strategy choice, independent completion and later conditional frame/affect preserve learned evidence. BenefitRelative/KnowledgeOnly/NoReappraisal and both projections retained. No physical protection or native public admission; source/authority/scheduler/Save132 gate explicitly OPEN.';clause.obligations=[...new Set([...clause.obligations,ro(10),ro(11),ro(12),ro(19),ro(20),ro(21)])];}
families[4].rationale+=' REV65 adds chosen conditional reappraisal in component scope only; native public source/authority/scheduler integration remains OPEN. Prior instructed-framing profile unchanged.';
supplemental.push('CAMPAIGN3_CHOSEN_REAPPRAISAL_QUALIFICATION.md','CHOSEN_REAPPRAISAL_FINDINGS.md','CHOSEN_REAPPRAISAL_CLOSURE_REV1.json','CHOSEN_REAPPRAISAL_PUBLIC_READINESS.md');
const inventory=""",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV64.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV64.json'),disposition:'Brief12.5-7 gains component-scoped chosen reappraisal;4/43/387 and13+328 tests/build.83 verdicts;109 bounded/20 partial/3 blocked. Native admission OPEN; no Campaign3 exit.'};"+s[b:];f.write_text(s,encoding='utf8')
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
