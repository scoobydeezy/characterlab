from pathlib import Path
import json,subprocess
p=Path('docs/planning');result=json.loads((p/'EMBARRASSMENT_RESULT_REV1.json').read_text())
assert result['status']=='PASS' and result['runs']==69 and result['prefixes']==483
report=p/'CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md';assert not report.exists(),'Do not rerun finalization'
report.write_text("""# Embarrassment without avoidance — 2026-09-27

**BOUNDED COMPONENT QUALIFIED — VER-C3-EMBARRASSMENT-001. LOCAL DISPOSITION.**
Stages A–E for embarrassment-component/0.1-candidate. No owner ruling required.
Native public source/authority/scheduler admission remains OPEN as the next gate.

| Measure | Qualified scope |
|---|---|
| Models / distinct original runs |6 /69|
| Every complete component prefix |483:414 advancing /69 terminal|
| Focused / reference tests |15 /328; build passed|
| Highest allocation / since verdict |1467 /0; no allocation|
| New native producer / factory |None; existing51/54 inventory unchanged|

## Derived social affect and competing action

One character receives separately gated semantic reports about one fixed incident:
its own act mismatched a known competence standard, a known evaluator saw it, and that
evaluator judged it negatively. Actual hidden mismatch/awareness/judgment remain world
facts. Report histories and the character's estimates remain separate. Latest admitted
mismatch/awareness and Mean negative evaluation feed a contextual appraisal; no original
supplies an embarrassment value or instruction to withdraw. Architecture4.3 explicitly
supports this competence-exposure/personal-relevance pattern.

Reputation importance supplies severity. SplitExposure retains likelihood, severity,
vulnerability1, control0 and both derived coordinates. Known social configuration plus
negative evaluation and personal relevance produces the bounded embarrassment pattern.
The emotional label does not choose action. Independently adopted withdrawal and
participation goals emit base reasons; affect is a situation modifier on withdrawal,
not an independent reason die and not a substitute for a positive base.

In all eight primary Contextual seeds, embarrassment remains[1,1], the withdrawal base
is1/4 and participation base1. Exact action probabilities are1/2 each. Seeds0/1/2 withdraw;
3/4/5/6/7 actually continue participating. All intent, expression, plan, attempt and
execution records are retained. Physical participation tracks the completed selected
action. Thus positive embarrassment and a live avoidance motive can coexist with actual
participation, without defining embarrassment from behavior or choosing a favorable seed.

For every seed, removing only the participation goal leaves beliefs and affect fixed
but selects withdrawal and changes physical presence to false. Failed execution preserves
the withdrawal decision/expression/plan/attempt while leaving participation true. That
failed-withdrawal control is distinct from the primary freely chosen participation case.
Removing the withdrawal base still permits positive affect and participation; the orphan
modifier creates no nucleus. NoGoals and NoOpportunity produce no chosen action.

## Discriminating evidence and alternatives

Known unseen incident or known no mismatch retains negative-evaluation belief but makes
contextual affect zero. JudgmentOnly ignores these known contextual differences and
retains distress; that output is not automatically called embarrassment. Unknown any
required proposition leaves affect absent. Known nonnegative evaluation yields known
zero affect, and zero reputation relevance changes appraisal without changing evidence.
The complete-factor unknown policy remains an explicit conservative limitation.

Mean and Latest retain identical histories but disagree after contradictory reports.
A correction admitted in consequence4 cannot change decision4; it changes appraisal5.
Mean keeps1/2 after true/false reports; Latest becomes0. Prior decisions and reports are
not rewritten. Hidden world changes, false reports and denied report-content changes
preserve the entire safe view. No true evaluator-private judgment is a lawful operand.

Independent GradedDisplay yields a cue from private affect when enabled. DisplayOff
preserves private appraisal and actual choice/expression while suppressing that cue.
Known zero cue remains distinct from unknown/absent cue. DecisionExpression is not the
cue. No physiological blushing, receiver interpretation or chosen emotional concealment
is qualified. ScalarUncontrolled remains a separate model; coinciding coordinates at
control0 do not establish scalar sufficiency.

## Calibration finding and preserved development

The first32 exploratory runs used unchanged multisource modifier calibration. They
expressed the phenotype, but Contextual and NoAffectReasons had identical probabilities
(1/3 withdrawal,2/3 participation). Those source bytes and every result are preserved in
embarrassment-development-rev1; the old cohort is not evidence of affect influencing action.
The contract was amended before qualification to use AFFECT's already accepted unit1/4,
cap3 modifier calibration and to retain the original settings as CoarseUnit.

The qualified fine calibration changes withdrawal probability to1/2. Seed2 switches from
participation under NoAffectReasons/CoarseUnit to withdrawal, with identical affect.
This establishes bounded causal sensitivity while preserving the coarse equality and
all eight seeds. It does not settle general emotion units, unique representation or
psychological calibration. NoAffectReasons removes only the receiving modifier.

The first focused test cohort passed14/15; a generic decoder could not inspect registered
record408. EMBARRASSMENT_TESTS_DEV1.json preserves that test-helper failure. Using the
inherited receiving decoder fixes inspection without changing production behavior. All15
corrected tests,328 reference tests and build pass. FalseReport/HiddenTruth and
DeniedUnchanged/UnknownJudgment are exact fixture aliases, not independent run coverage.

## Reproducibility, scope and transfer

The plan freezes the full dependency graph, six ModelIdentities,69 RunIdentities,
ExperimentIdentity and ComparisonCase before qualification. Every S0..S6 component save
restores by original replay and whole-byte equality, then matches the next save or
terminal no-op. Before/after-decision, after-learning/application and precommit faults
preserve all committed state/RNG; retry matches uninterrupted execution. Busy reads and
concurrent steps reject. Hidden truth never shifts character occurrence coordinates.

This is a composed component with bounded truth-side execution. It does not prove native
registered writers, actual scheduler phases, source schema admission, native Failed
lifecycle, Save132 or public wrapper behavior. The existing51-producer/54-factory audit
is unchanged. Native integration is the next explicit gate, not waived by component replay.
No general norm discovery, source trust, self-deception, cultural emotion taxonomy,
learned social strategy, identity modification or Task/Biological join is inferred.

North Star transfer: self-relevant social evaluation, private affect, visible cue,
avoidance motive, actual chosen action and achieved outcome must remain independently
representable. A character may feel embarrassed, prefer less exposure, and still choose
to remain for another goal. Failed withdrawal must not masquerade as that free choice.

MEC001/002/003/004/011..019/020/022 and P3-001/004/005/008/011 retain the contract's
reference dispositions; no mechanism retired. RO010/011/012/019/020 preserve inference,
affect/control and immediate native integration debt. RO021 final history gate remains
mandatory. RO022 reopens if the successor adds a native wrapper.

Brief12.5-4 gains this bounded COMPONENT witness: AuditREV67 has110 bounded/20 partial/
2 blocked,132 clauses/15 families,85 named verdicts. Corpus0.29.0 remains21 members.
Campaign3 is NOT EXIT-READY. Next EMBARRASSMENT_PUBLIC_READINESS.md.
""",encoding='utf8')
subprocess.run(['node','scripts/check-embarrassment-closure.mjs','--write'],check=True)
verdict='VER-C3-EMBARRASSMENT-001';refs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text());r['date']='2026-09-27';r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
reports=['CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md','EMBARRASSMENT_FINDINGS.md','EMBARRASSMENT_PLAN_REV1.json','EMBARRASSMENT_RESULT_REV1.json','EMBARRASSMENT_CLOSURE_REV1.json','embarrassment-development-rev1/PRESERVATION.json']
for n in reports:r['reportReviews'].append({'path':'docs/planning/'+n,'obligations':refs})
r['reportReviews'].append({'path':'docs/planning/EMBARRASSMENT_PUBLIC_READINESS.md','obligations':refs+['RO-C3-022']})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in reports+['EMBARRASSMENT_PUBLIC_READINESS.md'])
  o['established']+=' VER-C3-EMBARRASSMENT-001 adds bounded component embarrassment with actual competing participation:6 models/69 distinct runs/483 prefixes,15 new/328 reference tests/build;1467/0. Prior self-mismatch/evaluator-awareness/negative-evaluation reports and personal relevance derive affect independently of cue, choice and execution. Five of eight fine-calibration seeds participate despite positive affect and avoidance base; matched participation-goal removal yields withdrawal. Fine versus CoarseUnit/NoAffectReasons preserves a receiving-calibration counterexample and seed2 action contrast. Mean/Latest and JudgmentOnly remain.'
  o['unresolved']+=' Embarrassment native source/authority/scheduler/Save132/public wrapper integration is the immediate next gate. General norm recognition, cultural/clinical emotion taxonomy, calibrated report trust, natural self-evaluation, physiology, observer interpretation, learned social strategy and Task/Biological joins remain unqualified. Component complete-factor unknown policy and coarse-unit equality remain live limits; no old mechanism retired. Final historical reconciliation remains mandatory.'
 if o['id']=='RO-C3-022':o['evidence'].append('docs/planning/EMBARRASSMENT_PUBLIC_READINESS.md')
f.write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write("""

## `VER-C3-EMBARRASSMENT-001` — bounded embarrassment without avoidance (2026-09-27)

QUALIFIED COMPONENT / LOCAL DISPOSITION, embarrassment-component/0.1-candidate.
6 models/69 distinct runs/483 prefixes;15 new/328 reference tests/build;1467/0.
Five of eight Contextual seeds participate with positive social affect and a positive
avoidance base. Same-seed participation-goal removal preserves appraisal and yields
withdrawal. Physical execution, display and earlier evidence stay distinct. Fine/CoarseUnit/
NoAffectReasons, Mean/Latest, JudgmentOnly and scalar projection retained. Preserve first
coarse-calibration cohort and decoder-test failure. Brief12.5-4 bounded component only;
native gate remains OPEN. RO010/011/012/019/020/021. Evidence
CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md and EMBARRASSMENT_CLOSURE_REV1.json.
Next EMBARRASSMENT_PUBLIC_READINESS.md; no owner ruling or Campaign3 exit.
""")
for n in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/n).open('a',encoding='utf8') as f:f.write("""

### Embarrassment without avoidance component — 2026-09-27
VER-C3-EMBARRASSMENT-001:6/69/483;15+328 tests/build;1467/0, no allocation.
MEC001/002/003 admitted evidence,004 fixed identity,011 access,012..017/019/022 actual
reasons/dice/expression/execution remain;018 identity stays separate,020 goals controlled.
P3-001/004/005/008/011 preserve social appraisal, independent cue and action, later
learning and calibration alternatives. No old mechanism retired. CoarseUnit equals
NoAffectReasons on primary probabilities; accepted AFFECT unit1/4 cap3 changes them.
Prior32 development trajectories preserved. Native admission OPEN; next
EMBARRASSMENT_PUBLIC_READINESS.md. No general norm or physiological emotion law.
""")
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — embarrassment without avoidance component\nVER-C3-EMBARRASSMENT-001:6 models/69 runs/483 prefixes,15+328 tests/build,1467/0. Actual participation despite positive social affect and avoidance base, with matched withdrawal and independent execution/cue controls. Native admission remains OPEN: next docs/planning/EMBARRASSMENT_PUBLIC_READINESS.md. No owner ruling or Campaign3 exit.\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved embarrassment implementation index — 2026-09-27\n\n'+f.read_text())
f.write_text("""# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Embarrassment without avoidance COMPONENT QUALIFIED — VER-C3-EMBARRASSMENT-001.**
LOCAL DISPOSITION; no architectural blocker. Start CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md
and EMBARRASSMENT_CLOSURE_REV1.json; embarrassment-component/0.1-candidate.
Native public admission remains OPEN and is the next integration gate.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1467** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /85 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **110 bounded /20 partial /2 blocked** |
| Component experiment | **6 models /69 runs /483 prefixes** |
| Validation | **15 new /328 reference tests; build passed** |

Self-mismatch, evaluator awareness/judgment, personal relevance, affect, display and
actual action remain distinct. Five of eight fine-calibration seeds participate with
positive embarrassment and avoidance base. Matched goal removal yields withdrawal;
failed withdrawal preserves intent but leaves presence unchanged. Preserve initial
coarse-unit equality and decoder-test failure; no universal emotion calibration.
Contextual/Latest/JudgmentOnly/NoAffectReasons/CoarseUnit and scalar projection retained.

Next EMBARRASSMENT_PUBLIC_READINESS.md: typed originals, disjoint owners, actual native
phases, lineage, RNG, Save132 and wrapper publication. Existing51/54 inventory unchanged.
RO019 ACTIVE; RO021 final history gate unsatisfied. AuditREV67; Campaign3 NOT EXIT-READY.
No general norm learning, physiological cue, Task/Biological join or owner ruling.
""",encoding='utf8')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** native chosen reappraisal','**Prior routing (2026-09-27):** native chosen reappraisal',1)
s=s.replace('## Active direction\n',"""## Active direction

**Current routing (2026-09-27):** embarrassment without avoidance COMPONENT QUALIFIED:
VER-C3-EMBARRASSMENT-001. Start CURRENT.md and CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md.
6 models/69 distinct runs/483 component prefixes;15 new/328 reference tests/build;1467/0.
Five of eight fine-calibration seeds participate despite positive social affect and an
avoidance base. Goal-only, failed execution, cue and evidence controls remain separate.
Preserve initial coarse-unit equality and decoder-test failure. AuditREV67:110 bounded/
20 partial/2 blocked. Native admission OPEN: next EMBARRASSMENT_PUBLIC_READINESS.md.
No owner ruling; native wrapper inventory51/54 unchanged.
""",1);f.write_text(s,encoding='utf8')
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('\n\n## REV67 — embarrassment component, 2026-09-27\nVER-C3-EMBARRASSMENT-001 promotes Brief12.5-4 with a bounded COMPONENT witness:6/69/483,15+328 tests/build,1467/0. Positive social affect with actual participation and positive avoidance base; matched goal-only withdrawal and independent execution/cue controls.110 bounded/20 partial/2 blocked;85 verdicts. Native admission OPEN; no Campaign3 exit.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev66.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV66.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV67.json'").replace('result.snapshotRevision=66;','result.snapshotRevision=67;')
s=s.replace('const inventory=',"""// REV67: embarrassment without avoidance, component scope.
{const clause=families[4].clauses[3];clause.status=Q;clause.evidence.push(p+'CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md',p+'EMBARRASSMENT_CLOSURE_REV1.json');clause.rationale='VER-C3-EMBARRASSMENT-001:6 models/69 runs/483 component prefixes; independent self-mismatch/evaluator-awareness/negative-evaluation evidence and personal relevance derive social affect. Five of eight fine-calibration seeds participate with positive affect and avoidance base; same-seed participation-goal removal yields withdrawal. Execution and cue remain separate. Fine/CoarseUnit/NoAffectReasons, Mean/Latest, JudgmentOnly and scalar projection retained; initial calibration equality preserved. Native admission OPEN; no general norm, physiological or clinical law.';clause.obligations=[...new Set([...clause.obligations,ro(10),ro(11),ro(12),ro(19),ro(20),ro(21)])];}
families[4].rationale+=' REV67 adds component embarrassment without avoidance; earlier social-embarrassment-unqualified prose is historical for this bounded witness only. Native integration remains OPEN.';
supplemental.push('CAMPAIGN3_EMBARRASSMENT_QUALIFICATION.md','EMBARRASSMENT_FINDINGS.md','EMBARRASSMENT_CLOSURE_REV1.json','EMBARRASSMENT_PUBLIC_READINESS.md','embarrassment-development-rev1/PRESERVATION.json');
const inventory=""",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV66.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV66.json'),disposition:'Brief12.5-4 gains component embarrassment-without-avoidance witness;6/69/483,15+328 tests/build,1467/0.85 verdicts;110 bounded/20 partial/2 blocked. Native admission OPEN; no Campaign3 exit.'};"+s[b:];f.write_text(s,encoding='utf8')
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
