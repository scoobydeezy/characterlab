from pathlib import Path
import json, subprocess
p=Path('docs/planning')
result=json.loads((p/'IDENTITY_RECOVERY_RESULT_REV1.json').read_text(encoding='utf-8'))
assert result['status']=='PASS'
assert result['probe']['sampleEquality']
assert result['probe']['feedback']['probabilities']==['7/9','2/9']
assert result['probe']['noFeedback']['probabilities']==['1/2','1/2']
report=p/'CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md'
assert not report.exists()
text='''# Bounded identity recovery qualification — 2026-09-27

**COMPLETE / QUALIFIED — VER-C3-IDENTITY-RECOVERY-001. LOCAL DISPOSITION.**
Stages A–E use accepted native sources and laws; no architectural ruling.
Contract: identity-recovery-experiment/0.1-candidate, over unchanged
identity-public/0.1-candidate and identity-belief-public/0.1-candidate.

| Counter | Value |
|---|---|
| Highest allocated record type |1450|
| Allocated since last verdict/corpus member |0; no new allocation|
| Reused models / native runs / complete prefixes |5 /13 /78|
| Advancing / terminal prefix checks |65 /13|
| New input cases / exact prior-case repeats |11 /2|
| Affected / preserved reference tests |8 /328; build passed|

## Finding
Actual biography can reverse or recover acquired standing and independently
represented identity belief without rewriting earlier choices. They need not change
sign together. The finite recovery fixture starts empty, makes B/A/B/A choices and
retains all four authenticated expressions. The third act has controlled significance0;
it remains in history but cannot enter the Threshold qualification journal.
This is recovery after a single initial negative act, not an entrenched lifetime
identity. Work/Home are inherited task contexts, not general cross-domain traits.

| After act | Choice | Standing | Mean self belief | Latest self belief |
|---|---|---|---|---|
|1|B|-111111/1111111|-1|-1|
|2|A|16796/627907|0|+1|
|3|B, insignificant|16796/627907|0|+1|
|4|A|178295/1400517|+1/3|+1|

The different update semantics are intentional competitors. NoLearning receives the
same safe observations but retains unknown belief. It still acquires source standing:
represented belief is not the standing fold and receives no extra choice bonus.
Meaningful recovery changes the probe distribution from(1/2,1/2) under NoFeedback
to(7/9,2/9) under inherited standing feedback. Both sample A. This qualifies changed
choice propensity, not a sampled action difference in that matched pair.

Removing only the final act's significance preserves the same four sampled choices,
but Mean remains known-neutral and standing remains16796/627907. Its later probe
stays(1/2,1/2). Recovery is not inferred from raw repetition or physical movement.
Failed execution preserves all three complete safe holder views. Withholding
observer-a's reports after act1 leaves its belief at-1 while self and observer-b
reach+1/3. Known-neutral reports produce0 and adverse1/2; absent reports preserve
unknown and absent appraisal. Changing only the probe goal preserves learned state
and changes adverse appraisal from1/3 to2/3.

Native appraisal50 consumes prior140: the fourth act's update cannot change its own
earlier appraisal. At probe5 the recovered estimate becomes available. All earlier
expression bytes and admitted holder-history entries survive subsequent updates.

Two prior Mean primary cases are freshly executed with exactly their old identities,
final saves and rows: seed3's A/B/B/B changes self belief+1,0,-1/3,-1/2; seed2's
A/B/B/A returns it from-1/3 to known0. This neutral recovery is not relabeled positive.
The other prior seed cases remain preserved controls, not added to this run count.
BIO's twelve-contrary-act standing reversal remains a separate composed-component
witness; LONG's skill reacquisition is not identity-belief recovery.

## Evidence and preservation
IDENTITY_RECOVERY_PLAN_REV1.json froze all five reused model identities, thirteen
run identities, complete inputs, experiment/comparison identities and source hashes
before qualification. IDENTITY_RECOVERY_RESULT_REV1.json checks cross-case findings.
Every S0..S5 native Save132 prefix restores and advances to the exact next whole save;
terminal prefixes remain exact no-ops. Trace checks verify decision60, intent70,
expression80, qualification/receipt130, learning140 and appraisal50. The injected
recovery-commit failure retains prior state, history, outputs, trace and RNG addresses.
Three new tests plus five inherited boundary tests pass;328 reference tests and the
TypeScript/production build pass. No full active-suite or scalability claim.

IDENTITY_RECOVERY_EXPLORATION_REV1.json preserves all24 exploratory setting/seed
cases. The fixture and comparator matrix were frozen after exploration, before
qualification. IDENTITY_RECOVERY_FINDINGS.md records the pre-freeze dependency-walker
failure and the canonical obligation-status clarification. No production module,
existing model, historical receipt, horizon, schema or calibration was changed.
The preceding public-wrapper closure still verifies against its preserved graph.

## Verdict, transfer and limits
RETAIN the distinction between original authored expression, qualified standing,
independently admitted self/observer belief and goal-relative later appraisal.
Recovery is relative to the state and observer being measured; absent reports need
not update a person model when actual biography changes. Opposite semantic states
can produce the same sampled act. Mean, Latest and NoLearning remain distinct
comparison models; the experiment does not choose a universal update law.

Brief12.12-8 is bounded-qualified. Identity/disposition as a whole remains PARTIAL:
long-run dispositional adaptation, broad cross-context identity and enacted coercion
are still separate gaps. No new causal edge or state root is reduced or retired.
MEC018/022 and EXP011/012 retain their port/control/corpus roles. Counters1450/0.
RO009/010/014/019/020 preserve wider scope; RO021 remains CONDITIONAL in the canonical
registry and mandatory before exit. RO019 is the ACTIVE frontier. No obligations
are closed here. AuditREV60:105 bounded/20 partial/7 blocked clauses;78 verdicts;
corpus0.29.0 unchanged,21 members. Campaign3 remains NOT EXIT-READY.

Next: DISPOSITIONAL_ADAPTATION_READINESS.md. Inspect the existing substrate before
adding a candidate for Brief12.12-7; self-belief recovery is not plastic adaptation.
'''
report.write_text(text,encoding='utf-8')
with (p/'IDENTITY_RECOVERY_FINDINGS.md').open('a',encoding='utf-8') as f:f.write('''

Qualified outcome:13 runs/78 native prefixes over5 unchanged models. Standing,
Mean and Latest recover at different instants; NoLearning preserves unknown despite
available evidence. The final probe distribution differs under NoFeedback but both
sample A. The excluded-significance control retains the actual act and its original
expression. No universal recovery rate, necessity claim or long-horizon adaptation.
See CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md and the immutable result/plan.
''')
subprocess.run(['node','scripts/check-identity-recovery-closure.mjs','--write'],check=True)
verdict='VER-C3-IDENTITY-RECOVERY-001'
refs=['RO-C3-009','RO-C3-010','RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021']
reports=['CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md','IDENTITY_RECOVERY_FINDINGS.md','IDENTITY_RECOVERY_CLOSURE_REV1.json','IDENTITY_RECOVERY_PLAN_REV1.json','IDENTITY_RECOVERY_RESULT_REV1.json','IDENTITY_RECOVERY_EXPLORATION_REV1.json','DISPOSITIONAL_ADAPTATION_READINESS.md']
rfile=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(rfile.read_text(encoding='utf-8'));r['date']='2026-09-27'
r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
for name in reports:r['reportReviews'].append({'path':'docs/planning/'+name,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict)
  o['evidence'].extend('docs/planning/'+x for x in ['CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md','IDENTITY_RECOVERY_CLOSURE_REV1.json'])
  o['established']+=' VER-C3-IDENTITY-RECOVERY-001 qualifies finite native Task reversal/recovery with separate standing/self/observer beliefs:5 reused models,13 runs,78 prefixes. Mean/Latest/NoLearning and NoFeedback remain controls; distribution change can coexist with sampled equality. Original expressions survive. This accounts for that checkpoint only, not final historical reconciliation.'
  o['unresolved']+=' Recovery scope remains four learning acts plus one probe, including controlled significance and admitted reports; no general maturity, long-run dispositional adaptation or biological/task trait fusion. Earlier RO022 ACTIVE wording is historical: VER-C3-PUBLIC-QUIESCENCE-001 closed its declared inventory. RO021 remains a mandatory, unsatisfied final-exit gate with canonical CONDITIONAL status.'
rfile.write_text(json.dumps(r,indent=2)+'\n',encoding='utf-8')
entry='''

## `VER-C3-IDENTITY-RECOVERY-001` — bounded native identity recovery (2026-09-27)

QUALIFIED / LOCAL DISPOSITION, identity-recovery-experiment/0.1-candidate.
RETAIN original expressions, qualified standing, self/observer belief and later
appraisal as separately traceable distinctions.5 reused models/13 runs/78 native
prefixes;8 affected/328 reference tests and build. Meaningful recovery changes Mean
from negative to positive; withheld reports leave an observer negative; NoFeedback
changes probe probabilities while preserving the sampled A. No new law/allocation.
Stage C: Mean/Latest/NoLearning and Threshold/NoFeedback retained, no reduction.
Brief12.12-8 bounded, not whole identity/disposition or general recovery law.
Report CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md; authoritative closure
IDENTITY_RECOVERY_CLOSURE_REV1.json. RO009/010/014/019/020/021 referenced.
Counters1450/0. Next DISPOSITIONAL_ADAPTATION_READINESS.md; no owner ruling.
'''
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf-8') as f:f.write(entry)
for name in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/name).open('a',encoding='utf-8') as f:f.write('''

### Identity recovery experiment — 2026-09-27
VER-C3-IDENTITY-RECOVERY-001; identity-recovery-experiment/0.1-candidate.
MEC018/022 and EXP011/012 retain their inherited port/control/corpus dispositions.
Native four-act standing and independently represented belief recovery preserve
original expressions;5 reused models/13 runs/78 prefixes,8+328 tests/build.
No new law or allocation;1450/0. BIO sustained standing reversal remains component;
LONG skill recovery is separate. No disposition-adaptation claim or state reduction.
See CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md. Next DISPOSITIONAL_ADAPTATION_READINESS.md.
''')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf-8') as f:f.write('\n\n### 2026-09-27 — bounded identity recovery\nVER-C3-IDENTITY-RECOVERY-001 qualifies Brief12.12-8 in the native Task five-instant scope:5 reused models/13 runs/78 prefixes,8+328 tests/build,1450/0. Standing, self/observer beliefs and later appraisal stay distinct. Next docs/planning/DISPOSITIONAL_ADAPTATION_READINESS.md; Campaign3 NOT EXIT-READY.\n')
current=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf-8') as f:f.write('\n\n## Preserved checkpoint before identity recovery — 2026-09-27\n\n'+current.read_text(encoding='utf-8'))
current.write_text('''# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded identity recovery COMPLETE — VER-C3-IDENTITY-RECOVERY-001.**
LOCAL DISPOSITION; no architectural blocker. Start
CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md and IDENTITY_RECOVERY_CLOSURE_REV1.json.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1450** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 - 21 members / 78 verdicts** |
| Brief clauses / families | **132 / 15** |
| Brief clause dispositions | **105 bounded / 20 partial / 7 blocked** |
| Recovery qualification | **5 reused models / 13 runs / 78 native prefixes** |
| Validation | **8 affected / 328 reference tests; build passed** |

Actual meaningful biography can reverse/recover standing and separately represented
self belief while an observer denied reports remains negative. Original expressions
survive; NoLearning stays unknown; Mean/Latest remain competitors. Standing feedback
changes probe probabilities from1/2 to7/9 for A; both sampled acts remain A.
No longer horizon, new runtime law, shared trait scale or dispositional adaptation.
Two prior cases reproduce old identities/saves exactly; eleven inputs are new.

Prior public-wrapper publication remains COMPLETE, RO022 CLOSED, with its unchanged
49-producer/149-case/747-prefix evidence. Recovery altered no production module.
The previous index's RO021 ACTIVE wording was inaccurate: canonical RO019 is ACTIVE,
RO021 CONDITIONAL with a mandatory final-exit trigger. The historical gate is still
unsatisfied; no status changed. AuditREV60; Campaign3 NOT EXIT-READY.

Next: DISPOSITIONAL_ADAPTATION_READINESS.md for Brief12.12-7 under the standing
escalation policy. No owner ruling pending. Review accepted ADAPT substrate and
preserve constitution, learned adaptation, standing and belief separately.
''',encoding='utf-8')
ag=Path('AGENTS.md');a=ag.read_text(encoding='utf-8');a=a.replace('**Current routing (2026-09-26):** bounded public-wrapper','**Prior routing (2026-09-26):** bounded public-wrapper',1)
a=a.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-27):** bounded identity recovery COMPLETE:
VER-C3-IDENTITY-RECOVERY-001. Start CURRENT.md and
CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md.5 reused models/13 runs/78 native prefixes;
8 affected/328 reference tests/build,1450/0. Standing, self/observer belief and later
appraisal stay separate; no production law changed. Brief12.12-8 bounded; auditREV60,
105 bounded/20 partial/7 blocked. Next DISPOSITIONAL_ADAPTATION_READINESS.md.
RO019 ACTIVE; RO021 CONDITIONAL and mandatory before exit; older ACTIVE prose for
RO021 was inaccurate. RO022 remains CLOSED. No owner ruling pending.
''',1);ag.write_text(a,encoding='utf-8')
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf-8') as f:f.write('''

## REV60 — bounded identity recovery, 2026-09-27
VER-C3-IDENTITY-RECOVERY-001 promotes only Brief12.12-8 to QUALIFIED BOUNDED.
5 reused models/13 runs/78 native prefixes;8 affected/328 reference tests/build.
105 bounded/20 partial/7 blocked clauses,78 verdicts,1450/0. Whole identity family
remains PARTIAL; disposition adaptation12.12-7 is still BLOCKED. Corpus unchanged.
RO021 mandatory exit gate remains unsatisfied (canonical CONDITIONAL); RO019 ACTIVE.
Original expressions, standing/self/observer differences, qualifier exclusion,
Mean/Latest/NoLearning and NoFeedback are retained. No universal recovery claim.
''')
checker=Path('scripts/check-campaign3-exit-audit.mjs');s=checker.read_text(encoding='utf-8')
Path('scripts/check-campaign3-exit-audit-rev59.mjs').write_bytes(checker.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV59.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV60.json'")
s=s.replace('const inventory=', '''// REV60: finite native biography recovery; adaptation remains a separate blocked clause.
{const clause=families[11].clauses[7];clause.status=Q;clause.evidence.push(p+'CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md',p+'IDENTITY_RECOVERY_CLOSURE_REV1.json');clause.rationale='VER-C3-IDENTITY-RECOVERY-001:5 reused models/13 runs/78 native prefixes. Actual qualified biography reverses/recover standing and represented self belief; withheld reports retain negative observer belief. Prior expressions survive. Mean/Latest/NoLearning and NoFeedback remain separate. Probe distributions change while sampled A remains equal. Four learning instants plus probe; not general mature-identity recovery or dispositional adaptation.';clause.obligations.push(ro(10),ro(14));}
families[11].rationale+=' REV60 qualifies bounded native recovery separately from report correction and long-run dispositional adaptation; no whole-family qualification.';
supplemental.push('CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md','IDENTITY_RECOVERY_FINDINGS.md','IDENTITY_RECOVERY_CLOSURE_REV1.json','DISPOSITIONAL_ADAPTATION_READINESS.md');
const inventory=''',1)
s=s.replace('result.snapshotRevision=59;','result.snapshotRevision=60;').replace("result.date='2026-09-26';","result.date='2026-09-27';")
start=s.index('result.predecessor=');end=s.index('\n',start)
s=s[:start]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV59.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV59.json'),disposition:'Bounded native identity recovery promotes12.12-8 only;13 runs/78 prefixes,8+328 tests/build.78 verdicts; historical gate remains unsatisfied.'};"+s[end:]
checker.write_text(s,encoding='utf-8')
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
