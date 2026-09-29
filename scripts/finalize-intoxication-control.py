from pathlib import Path
import json,hashlib,subprocess
p=Path('docs/planning');result=json.loads((p/'INTOXICATION_CONTROL_RESULT_REV1.json').read_text())
assert result['status']=='PASS' and result['models']==5 and result['runs']==20 and result['nativePrefixes']==55
report=p/'CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md';assert not report.exists(),'Do not rerun finalization'
report.write_text('''# Intoxication/control qualification — 2026-09-27

**COMPLETE / QUALIFIED — VER-C3-INTOXICATION-CONTROL-001. LOCAL DISPOSITION.**
Stages A–E; intoxication-control-experiment/0.1-candidate under existing native
identity-public/0.1-candidate Biological contracts. No architectural ruling needed.

| Measure | Qualified scope |
|---|---|
| Native models / runs |5 /20|
| Selected complete native prefixes |55:35 advancing /20 terminal|
| Focused / reference tests |12 /328; build passed|
| Highest allocation / since verdict |1458 /0; no new allocation|
| New production laws / factories |0 /0|

## What the experiment establishes

Characters with different constitutional clearance respond differently to the same
external exposure, without changing their competence, goals or prior acquired history.
Clearance100 versus400 is the only difference in the main character comparison.
Both receive intoxicant800 at consequence7, after that instant's decision/execution.
The sober control receives none. Native sensing, appraisal, inhibition, inherited
reason/dice choice, intent/expression, physical execution and later recovery remain
separately traceable. No new production model law was required.

| Eighth probe | Sensed burden | Control | Execution challenge | Inhibition | Execution |
|---|---|---|---|---|---|
| Sober |0|1000|0|active|succeeds|
| Slow clearance |700|650|350|inactive|fails|
| Fast clearance |400|800|200|active|succeeds|

Competence300 and inhibition threshold800 are independent. Slow-clearance execution
still fails at equality300 on9, succeeds at challenge250 on10, and inhibition only
returns at control800 on11. Functional recovery therefore has separate timing for
execution and inhibition. At12 slow burden remains300; recovery is not complete
bodily clearance. Fast clearance reaches zero by9. These finite units are not hours,
clinical concentrations or calibrated pharmacology.

The common prelude admits reward experience at1 and a genuine contested protective
expression at2. Original nonzero identity journal, learned outcomes and cue history
remain byte-identical within each seed across the main sources. Goals stay adopted
and maintained, competence and importance stay fixed. Subsequent identity learning
is explicitly disabled and outcome receipts withheld. Sleep/stress/load are controlled;
reward action drug contains no intoxicant or injury in this roster. Its inherited
catalog label does not substitute for a real biological source.

## Comparisons and limits

All seeds0..3 were frozen before qualification. Positive/negative acquired standing
from their common prelude is preserved; comparisons are within seed. At8 seeds1/2
choose the reward option under slow clearance,0/3 still withhold. Either chosen
attempt fails under challenge350. Sober/fast cases inhibit the reward option. Exact
distributions and sampled choices are recorded separately; no favorable seed is
selected or discarded after qualification.

NoControl removes access differences across the main seed0 triplet while physical
execution outcomes still differ. Higher competence850 preserves the first exposed
appraisal and seed1 chosen reward intent but allows execution that competence300
cannot achieve. Later sensations may legitimately diverge after this different
physical outcome; whole-stream equivalence is not claimed for that competence pair.

FalseSober admits biased zero intoxication, computes control1000 and inhibits reward,
yet physical challenge350 still prevents execution. Unknown intoxication instead
leaves control unknown. BlindSober/BlindSlow mask intoxication plus downstream reward,
pleasure and withdrawalReward from3: despite different burden/execution, their whole
observer streams, including later provenance, are byte-identical. Masking only the
intoxication channel would not justify that equality when reward execution changes
later sensations. This is conditional observer safety, not invisible intoxication.

Independent interference defeats sober execution with zero burden/challenge and
unchanged inhibition. Its whole observer view equals the sober baseline because the
blocked chosen withholding is physically inert. It is not a general claim that
all failed actions leave later sensations equal.

The strict execution boundary belongs to this biological contract. The separately
qualified SKILL profile's inclusive boundary and alternative impairment laws remain
preserved; they are not silently overridden. No control threshold, clearance law or
universal impairment formula is selected as psychologically final.

## Evidence and preservation

INTOXICATION_CONTROL_PLAN_REV1.json freezes all source artifacts, five model identities,
twenty original run identities/inputs, seeds, experiment and comparison identities.
Full seed0 Sober/Slow/Fast replay S0/S2/S7/S8/S10/S11/S12; the other seventeen cases
replay S0/S12. All55 selected saves restore by fresh original execution and whole
Save132 equality, then match the exact next save or terminal no-op. This is selected
prefix coverage, not every prefix of every run. The inherited wrapper and public
factory are unchanged; existing50-producer/53-factory scope remains valid.

INTOXICATION_CONTROL_RESULT_REV1.json checks all receipts and cross-case claims;
INTOXICATION_CONTROL_CLOSURE_REV1.json binds report, findings, tests and build.
Twelve focused tests pass,328 reference tests pass, build and predecessor closure
verification pass. No failing implementation cohort preceded qualification; source
masking and exact threshold scope were specified before freeze. The prior sleep
study's rejected empty-identity/sleep-relief fixture remains preserved and unchanged.

## North Star transfer and next gate

An embodied perturbation need not change decision control and execution capability
in lockstep. Different constitution can change its trajectory without changing
biography; different competence can change its consequence without changing intent.
Admitted evidence controls cognition while actual physical state governs execution.

Brief12.1-7 now has a bounded native witness. No learned clearance, clinical substance
model, tolerance calibration, multiple substances, spontaneous consumption/abstinence,
current performance inference, global cognition/personality stability, Task disposition
join or development claim follows. Learning-disabled probes do not forbid later lawful
learning. P3-009/010 and MEC001/003/011..019/022 retain the contract's dispositions.
RO008/009/012/013/019/020 remain responsible for broader scope; RO021 final historical
reconciliation remains mandatory and unsatisfied. No obligation closes by deferral.

AuditREV64:108 bounded/20 partial/4 blocked among132 clauses/15 families; corpus0.29.0
still21 members,82 named verdicts. Campaign3 remains NOT EXIT-READY. Next
CHOSEN_REAPPRAISAL_READINESS.md: actual strategy choice, attempted frame application
and later affect, preserving the narrower prior instructed-framing qualification.
''',encoding='utf8')
log=p/'INTOXICATION_CONTROL_BUILD_REV1.log';assert 'built in' in log.read_text() and 'error TS' not in log.read_text()
(p/'INTOXICATION_CONTROL_BUILD_REV1.json').write_text(json.dumps({'status':'PASS','command':'npm run build','exitCode':0,'log':str(log).replace('\\','/'),'logSha256':hashlib.sha256(log.read_bytes()).hexdigest()},indent=2)+'\n')
subprocess.run(['node','scripts/check-intoxication-control-closure.mjs','--write'],check=True)
verdict='VER-C3-INTOXICATION-CONTROL-001';refs=['RO-C3-008','RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text());r['date']='2026-09-27';r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
for name in ['CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md','INTOXICATION_CONTROL_FINDINGS.md','INTOXICATION_CONTROL_PLAN_REV1.json','INTOXICATION_CONTROL_RESULT_REV1.json','INTOXICATION_CONTROL_CLOSURE_REV1.json']:r['reportReviews'].append({'path':'docs/planning/'+name,'obligations':refs})
nextrefs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021'];r['reportReviews'].append({'path':'docs/planning/CHOSEN_REAPPRAISAL_READINESS.md','obligations':nextrefs})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in ['CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md','INTOXICATION_CONTROL_CLOSURE_REV1.json','INTOXICATION_CONTROL_FINDINGS.md'])
  o['established']+=' VER-C3-INTOXICATION-CONTROL-001 qualifies bounded Brief12.1-7 under existing native Biological identity:5 models/20 runs/55 selected prefixes,12 new/328 reference tests/build,1458/0. Identical exposure with constitution-only clearance differences changes sensed control and independent execution. Slow execution recovers10, inhibition11; residual burden remains. Original nonzero acquired history/goals retained; NoControl, high competence, masked/biased sensing and independent interference discriminate the paths.'
  o['unresolved']+=' Finite clearance/challenge thresholds do not qualify clinical substances, learned clearance/tolerance, multiple intoxicants, natural consumption/abstinence policy, current performance inference or global Task/Biological personality integration. Masked observer equality requires masking downstream reward sensation as well as intoxication. Functional recovery is not complete clearance. SKILL alternative impairment laws and final historical reconciliation remain preserved.'
 if o['id'] in nextrefs:o['evidence'].append('docs/planning/CHOSEN_REAPPRAISAL_READINESS.md')
f.write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write('''

## `VER-C3-INTOXICATION-CONTROL-001` — bounded differential intoxication/control (2026-09-27)

QUALIFIED / LOCAL DISPOSITION, intoxication-control-experiment/0.1-candidate.
Existing native Biological identity,5 models/20 runs/55 selected prefixes;12 new/
328 reference tests/build;1458/0. Identical exposure and clearance-only constitutions
separate sensed control and physical execution, with execution recovery preceding
inhibition in slow clearance. NoControl, competence, masked/biased sensing and
interference controls; original acquired identity/goals preserved. All seeds retained.
Brief12.1-7 bounded. No clinical kinetics, learned clearance, Task join, or general
impairment-law choice. RO008/009/012/013/019/020/021; historical gate unsatisfied.
Evidence CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md and
INTOXICATION_CONTROL_CLOSURE_REV1.json. Next chosen reappraisal/later affect intake.
''')
for n in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/n).open('a',encoding='utf8') as f:f.write('''

### Differential intoxication/control — 2026-09-27
VER-C3-INTOXICATION-CONTROL-001:5 native models/20 runs/55 selected prefixes;
12 new/328 reference tests/build;1458/0. P3-009/010 constitution/history; MEC001/003
admitted estimates/sensing; MEC011 availability/access; MEC012..019/022 inherited
reasons/dice/expression/identity/execution and exact provenance remain retained.
Identical exposure with clearance-only differences discriminates control/execution.
NoControl, separate competence, masked/biased sensing and interference retained.
Biological strict execution boundary does not replace SKILL's alternative profiles.
No new law, factory, root or clinical claim. Brief12.1-7 bounded; next chosen reappraisal.
''')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — differential intoxication/control\nVER-C3-INTOXICATION-CONTROL-001 qualifies Brief12.1-7 with existing native biology/identity:5 models/20 runs/55 selected prefixes;12+328 tests/build;1458/0. No new production law or allocation. Next docs/planning/CHOSEN_REAPPRAISAL_READINESS.md. No owner ruling; Campaign3 remains NOT EXIT-READY.\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved intoxication/control in progress — 2026-09-27\n\n'+f.read_text())
f.write_text('''# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded intoxication/control COMPLETE — VER-C3-INTOXICATION-CONTROL-001.**
LOCAL DISPOSITION; no architectural blocker. Start CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md
and INTOXICATION_CONTROL_CLOSURE_REV1.json. Existing native Biological identity;
intoxication-control-experiment/0.1-candidate. No new production law or allocation.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1458** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 - 21 members / 82 verdicts** |
| Brief clauses / families | **132 / 15** |
| Brief clause dispositions | **108 bounded / 20 partial / 4 blocked** |
| Native experiment | **5 models / 20 runs / 55 selected prefixes** |
| Validation | **12 new / 328 reference tests; build passed** |

Identical exposure with clearance100/400 separates control and execution across
constitutions. Slow execution recovers10, inhibition11; residual burden remains.
Nonzero acquired identity, learned outcomes and adopted goals remain unchanged.
NoControl, independent competence, masked/biased sensing and interference controls
retain actual distributions/intent/outcomes. Unknown and false sober are distinct.

INTOXICATION_CONTROL_FINDINGS.md records strict execution versus inclusive inhibition
boundaries and the need to mask downstream reward sensation for whole-safe equality.
No clinical kinetics, learned clearance, global cognition/personality or Task join.
Prior closure receipts and50-producer/53-factory wrapper scope stand unchanged.

Next CHOSEN_REAPPRAISAL_READINESS.md: deliberate strategy choice -> attempted frame
application -> later affect. Preserve the narrower instructed-framing qualification.
RO019 ACTIVE; RO021 historical reconciliation remains unsatisfied. AuditREV64;
Campaign3 NOT EXIT-READY. No owner ruling pending. Counters1458/0.
''',encoding='utf8')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** bounded sleep/control','**Prior routing (2026-09-27):** bounded sleep/control',1)
s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-27):** bounded intoxication/control COMPLETE:
VER-C3-INTOXICATION-CONTROL-001. Start CURRENT.md and
CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md.5 models/20 runs/55 selected prefixes;
12 new/328 reference tests/build;1458/0. Identical exposure, different constitutional
clearance; control and execution recover separately without rewriting identity/goals.
Preserve masked-sensation and exact-boundary limits. No clinical law or Task join.
AuditREV64:108 bounded/20 partial/4 blocked. Next CHOSEN_REAPPRAISAL_READINESS.md;
no owner ruling. Existing wrapper inventory50/53 unchanged.
''',1);f.write_text(s,encoding='utf8')
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('''

## REV64 — differential intoxication/control, 2026-09-27
VER-C3-INTOXICATION-CONTROL-001 promotes Brief12.1-7 only:5 native models/20 runs/
55 selected prefixes;12 new/328 reference tests/build;1458/0. Same exposure across
clearance-only constitutions, distinct control/execution recovery and preserved
acquired history. No clinical model, general impairment law or Task personality join.
108 bounded/20 partial/4 blocked;82 verdicts. Wrapper scope50/53 unchanged.
Next chosen reappraisal; prior instructed framing remains separately bounded.
''')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();Path('scripts/check-campaign3-exit-audit-rev63.mjs').write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV63.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV64.json'").replace('result.snapshotRevision=63;','result.snapshotRevision=64;')
s=s.replace('const inventory=',"""// REV64: differential intoxication under existing native biological laws.
{const clause=families[0].clauses[6];clause.status=Q;clause.evidence.push(p+'CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md',p+'INTOXICATION_CONTROL_CLOSURE_REV1.json');clause.rationale='VER-C3-INTOXICATION-CONTROL-001: identical exposure with clearance-only constitutions changes sensed control and physical execution separately; competence, NoControl, masked/biased sensing and interference controls.5 models/20 runs/55 selected native prefixes, prior acquired history preserved. Finite units only; functional recovery is not complete clearance. No clinical, learned clearance or Task join claim.';clause.obligations=[...new Set([...clause.obligations,ro(8),ro(9),ro(12),ro(13),ro(19),ro(20),ro(21)])];}
families[0].rationale+=' REV64 adds bounded intoxication/control differences across constitutional clearance, preserving independent execution and prior acquired history. No clinical model or global integration.';
supplemental.push('CAMPAIGN3_INTOXICATION_CONTROL_QUALIFICATION.md','INTOXICATION_CONTROL_FINDINGS.md','INTOXICATION_CONTROL_CLOSURE_REV1.json','CHOSEN_REAPPRAISAL_READINESS.md');
const inventory=""",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV63.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV63.json'),disposition:'Brief12.1-7 bounded differential intoxication/control;5/20/55 and12+328 tests/build.82 verdicts;108 bounded/20 partial/4 blocked. No Campaign3 exit.'};"+s[b:];f.write_text(s,encoding='utf8')
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
