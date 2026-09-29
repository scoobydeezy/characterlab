from pathlib import Path
import json, hashlib, subprocess
p=Path('docs/planning')
result=json.loads((p/'SLEEP_CONTROL_RESULT_REV1.json').read_text())
assert result['status']=='PASS' and result['runs']==20 and result['nativePrefixes']==52
report=p/'CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md'
assert not report.exists(), 'Closure already written; do not rerun finalization'
report.write_text('''# Sleep loss and control qualification — 2026-09-27

**COMPLETE / QUALIFIED — VER-C3-SLEEP-CONTROL-001. LOCAL DISPOSITION.**
Stages A–E; sleep-control-experiment/0.1-candidate using the existing native
identity-public/0.1-candidate Biological source. No architectural ruling required.

| Measure | Qualified scope |
|---|---|
| Native models / original runs |2 /20|
| Selected complete native prefixes |52:32 advancing /20 terminal|
| Focused / reference tests |13 /328; build passed|
| Highest allocation / since verdict |1458 /0; no new allocation|
| New production laws / factories |0 /0|

## Earned result

A common prelude admits reward experience and an actual contested protective
expression. The second instant earns a nonzero identity contribution; later probes
retain its exact original journal bytes. Within each seed, constitution, competence,
goal importance, adopted/maintained goals, learned outcome estimates and cue history
are identical before the sleep intervention. Identity learning is explicitly disabled
after acquisition; outcome receipts are withheld after the first practice experience.
There is no synthetic initialized biography or new Fatigued trait.

The main intervention is actual prior wake accumulation under the accepted body law.
It changes sensed sleepiness and control with stress/intoxicant/arousal/load held fixed
at probes. Sleep-related motivation is excluded by the training's known zero sleep
relief estimate; harm and threat feedback are also zero. At the eighth choice:

| Trajectory | Sensed sleepiness | Control | Inhibition | Options |
|---|---|---|---|---|
| Rested |100|950|active|withhold|
| Deprived |600|700|inactive|drug, withhold|
| Recovered, before its recovery consequence |600|700|inactive|drug, withhold|

The asleep consequence at8 resets physical debt after its choice. Decision9 senses100,
restores control950 and inhibits the reward option. It does not rewrite decision8,
the original identity expression or the adopted protective goal. Recovery remains
effective at12. Physical execution challenge stays0 and competence850 in the main
comparison, so these are control/access effects rather than execution failure.

The existing catalog key drug has reward600 and no intoxicant/injury in this fixture.
This is not an intoxication qualification. Sleep is externally provided, not chosen
bedtime. Tick gains and threshold800 are declared candidate calibrations, not hours
or a clinical sleep law. No production source, schema, writer or model law changed.

## Comparators and actual behavior

All four seeds0..3 were frozen before qualification. The common prelude earns
standing79327/329327 for seeds0/1 and -79327/329327 for2/3. Comparisons are within
seed; different seeds need not have the same biography. In the deprived eighth
probe, the reward probability is49/200 for positive standing and151/200 for negative
standing. All rested/recovered-after-sleep probes inhibit that option.

Seeds1/2 actually choose the reward option while deprived;0/3 still withhold. Seed0
was not discarded because its action did not switch. A changed distribution is a
causal finding independent of any one sampled choice. Prior acquired identity still
affects the contest after inhibition weakens; it has not been erased by sleep loss.

NoControl retains different sensed control values but removes the sleep-dependent
access difference, giving identical eighth-probe choices/distributions across the
main seed0 triplet. This local comparator supports the accepted inhibition path;
it does not establish a unique threshold or globally necessary control law.

BlindRested/BlindDeprived have different physical debt but byte-identical whole
observer streams, including later provenance and acquired journal output. Unknown
sleepiness leaves control unknown. FalseRested instead admits known zero sleepiness
despite debt600, computes control1000 and inhibits. Character control follows admitted
signal, not hidden world truth; unknown is not silently treated as rested.

Independent interference at the three seed0 probes prevents execution while preserving
whole safe output bytes and chosen withholding. This equivalence is scoped to inert
withholding, not reward failure that could change later sensation. Unmaintained is a
separate support control: protection stays adopted, maintenance becomes false, and
recovered control alone does not restore inhibition. No goal is silently retired.

## Evidence and preservation

SLEEP_CONTROL_PLAN_REV1.json binds source graph, immutable model/run/original bytes,
seeds, experiment identity and comparison identity before qualification. Full seed0
main triplets replay S0/S2/S7/S8/S9/S12; remaining seventeen cases replay S0/S12.
Every selected native Save132 restores through original execution, compares whole
bytes, and matches the exact next save or terminal no-op. This is52 selected-prefix
witnesses, not all-prefix coverage of every case. The public factory and whole-wrapper
guards are inherited unchanged. Existing50-producer/53-factory inventory remains valid.

SLEEP_CONTROL_RESULT_REV1.json checks the twenty run receipts and cross-case claims;
SLEEP_CONTROL_CLOSURE_REV1.json binds tests, build, findings and report. Thirteen new
focused tests pass, as do328 preserved reference tests and the build. Read-only
predecessor verification passes for biology, identity, represented identity belief,
recovery, disposition and wrapper closure. No previous qualification is overwritten.

The first exploratory fixture lacked nonzero acquired identity and accidentally taught
sleep relief during reward training. Its source and result remain in
sleep-control-development-rev1 and SLEEP_CONTROL_EXPLORATION_REV1.json. The corrected
REV2 exploration and findings record why the prelude changed before qualification.
An unchanged empty identity journal would have been a vacuous preservation test.

## North Star transfer and remaining obligations

A temporary embodied perturbation may change what a character can inhibit without
automatically rewriting who they have become. Tests must establish real acquired
state first, distinguish reduced inhibition from new motivation/execution failure,
and show recovery at the correct later causal boundary. Learning-disabled probes
prove preservation under this intervention, not immunity to subsequent lawful learning.

Brief12.1-6 now has this bounded native witness. It does not qualify every cognitive
function, memory/attention impairment, Task plastic disposition, represented self-belief
integration, natural sleep policy, development or general personality stability.
P3-009/010 and MEC001/003/011..019/022 retain their declared reference dispositions.
RO008/009/012/013/019/020 preserve broader scope; RO021 final historical reconciliation
remains mandatory and unsatisfied. No obligation is closed by deferral.

AuditREV63:107 bounded/20 partial/5 blocked among132 clauses/15 families. Corpus0.29.0
remains21 members;81 named verdicts. Campaign3 remains NOT EXIT-READY. No owner decision
is pending. Next INTOXICATION_CONTROL_READINESS.md: separate exposure, sensing, control
and execution, including an admitted constitutional comparison across characters.
''',encoding='utf8')
log=p/'SLEEP_CONTROL_BUILD_DEV1.log'
assert 'built in' in log.read_text() and 'error TS' not in log.read_text()
(p/'SLEEP_CONTROL_BUILD_REV1.json').write_text(json.dumps({'status':'PASS','command':'npm run build','exitCode':0,'log':str(log).replace('\\','/'),'logSha256':hashlib.sha256(log.read_bytes()).hexdigest()},indent=2)+'\n')
subprocess.run(['node','scripts/check-sleep-control-closure.mjs','--write'],check=True)
verdict='VER-C3-SLEEP-CONTROL-001';refs=['RO-C3-008','RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021']
reports=['CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md','SLEEP_CONTROL_FINDINGS.md','SLEEP_CONTROL_PLAN_REV1.json','SLEEP_CONTROL_RESULT_REV1.json','SLEEP_CONTROL_CLOSURE_REV1.json','SLEEP_CONTROL_EXPLORATION_REV1.json','SLEEP_CONTROL_EXPLORATION_REV2.json','sleep-control-development-rev1/PRESERVATION.json','INTOXICATION_CONTROL_READINESS.md']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text());r['date']='2026-09-27';r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
for n in reports:r['reportReviews'].append({'path':'docs/planning/'+n,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in ['CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md','SLEEP_CONTROL_CLOSURE_REV1.json','SLEEP_CONTROL_FINDINGS.md','INTOXICATION_CONTROL_READINESS.md'])
  o['established']+=' VER-C3-SLEEP-CONTROL-001 adds a bounded native sleep-loss/recovery witness:2 models/20 runs/52 selected complete prefixes;13 new/328 reference tests/build;1458/0. Common actual acquisition precedes sleep intervention. Control/access changes and later recovery preserve original nonzero identity journal, learned outcomes, goals and fixed competence/constitution. NoControl, whole-safe blind-history, biased sensing, independent execution and unmaintained-goal controls discriminate the path. Initial empty-identity and sleep-relief-confounded fixture remains preserved.'
  o['unresolved']+=' This sleep witness uses learning-disabled probes and externally provided sleep under finite gains; it does not qualify global cognition/personality stability, Task/Biological disposition joins, learned sleep policy, clinical timing or sleep-related execution impairment. Later lawful learning remains possible. Brief12.1-7 intoxication across characters remains unqualified; final historical reconciliation remains mandatory.'
f.write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write('''

## `VER-C3-SLEEP-CONTROL-001` — bounded sleep-loss/control recovery (2026-09-27)

QUALIFIED / LOCAL DISPOSITION, sleep-control-experiment/0.1-candidate. Existing
native Biological identity profile,2 models/20 runs/52 selected prefixes;13 new/
328 reference tests/build;1458/0. Actual prior wake history changes sensed control,
inhibition and choice distributions; recovery consequence8 affects choice9. Exact
nonzero identity journal, reward learning, goals and fixed competence/constitution
remain separate. NoControl, blind/biased sensing, execution and maintenance controls.
All seeds0..3 retained, including unchanged sampled actions. First empty-identity/
sleep-relief-confounded source preserved. Brief12.1-6 bounded; no general sleep law,
Task join, clinical physiology or later-learning immunity. RO008/009/012/013/019/020/021.
Evidence CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md and SLEEP_CONTROL_CLOSURE_REV1.json.
''')
for name in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/name).open('a',encoding='utf8') as f:f.write('''

### Sleep/control bounded witness — 2026-09-27
VER-C3-SLEEP-CONTROL-001:2 native models/20 runs/52 selected Save132 prefixes;
13 new/328 reference tests/build;1458/0. Existing contracts/laws only. P3-009/010
retain constitution/history separation; MEC001/003 preserve admitted estimates and
safe sensing; MEC011 distinguishes availability/access; MEC012..019/022 inherit
actual reasons/dice/expression/identity/independent execution and frozen provenance.
No reference mechanism retired. NoControl and false/blind sensory controls retained.
Initial empty identity and sleep-relief-confounded training remain archived. Gains,
threshold and exogenous recovery are candidate controls, not general sleep physiology.
Brief12.1-6 bounded; next intoxication/control across characters. No state-root change.
''')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — bounded sleep/control\nVER-C3-SLEEP-CONTROL-001 qualifies Brief12.1-6 under existing native Biological identity contracts:2 models/20 runs/52 selected prefixes;13+328 tests/build;1458/0. No new law or allocation. Next docs/planning/INTOXICATION_CONTROL_READINESS.md; no owner decision and no Campaign3 exit.\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved sleep/control qualification in progress — 2026-09-27\n\n'+f.read_text())
f.write_text('''# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded sleep/control COMPLETE — VER-C3-SLEEP-CONTROL-001.**
LOCAL DISPOSITION; no architectural blocker. Start CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md
and SLEEP_CONTROL_CLOSURE_REV1.json. sleep-control-experiment/0.1-candidate uses
the existing native Biological identity profile, with no production law change.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1458** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 - 21 members / 81 verdicts** |
| Brief clauses / families | **132 / 15** |
| Brief clause dispositions | **107 bounded / 20 partial / 5 blocked** |
| Native experiment | **2 models / 20 runs / 52 selected prefixes** |
| Validation | **13 new / 328 reference tests; build passed** |

Genuine prior wake accumulation changes sensed control950->700 and permits a reward
option. Recovery consequence8 restores control at9, preserving original acquired
identity, learned outcomes, adopted goals and fixed constitution/competence. Full/
NoControl, blind/biased sensing, execution and goal-maintenance controls discriminate
the path. All seeds0..3 retained: changed distributions do not force changed actions.

First exploratory fixture had empty identity and confounded sleep-relief learning;
preserve SLEEP_CONTROL_FINDINGS.md and sleep-control-development-rev1. No general sleep
law, global cognitive/personality join, chosen sleep policy or later-learning immunity.
Prior native disposition closure and50-producer/53-factory wrapper inventory stand.

Next INTOXICATION_CONTROL_READINESS.md: differential control/execution perturbation
across characters, using existing admitted source contracts first. RO019 ACTIVE;
RO021 final historical reconciliation remains unsatisfied. AuditREV63; Campaign3
NOT EXIT-READY. No owner ruling is pending. Counters1458/0; no allocation this pass.
''',encoding='utf8')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** native disposition','**Prior routing (2026-09-27):** native disposition',1)
s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-27):** bounded sleep/control COMPLETE:
VER-C3-SLEEP-CONTROL-001. Start CURRENT.md and CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md.
2 native models/20 runs/52 selected prefixes;13 new/328 reference tests/build;1458/0.
Prior wake history changes control/access; later recovery preserves original acquired
identity, learned outcomes, goals and fixed competence/constitution. Preserve first
empty-identity/sleep-relief-confounded fixture. No new production law, general sleep
model or Task join. AuditREV63:107 bounded/20 partial/5 blocked. Next
INTOXICATION_CONTROL_READINESS.md; no owner ruling. Wrapper inventory50/53 unchanged.
''',1);f.write_text(s,encoding='utf8')
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('''

## REV63 — bounded sleep/control, 2026-09-27
VER-C3-SLEEP-CONTROL-001 promotes Brief12.1-6 only:2 native models/20 runs/52 selected
prefixes;13 new/328 reference tests/build;1458/0. Actual wake/recovery, admitted
control, independent execution and preserved acquired identity are discriminated.
All four seeds retained; no global cognitive/personality or clinical sleep claim.
107 bounded/20 partial/5 blocked;81 verdicts. Existing50/53 wrapper scope unchanged.
Next intoxication/control across characters; historical exit gate still unsatisfied.
''')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();Path('scripts/check-campaign3-exit-audit-rev62.mjs').write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV62.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV63.json'").replace('result.snapshotRevision=62;','result.snapshotRevision=63;')
s=s.replace('const inventory=',"""// REV63: sleep loss with preserved acquired identity, existing native biology profile.
{const clause=families[0].clauses[5];clause.status=Q;clause.evidence.push(p+'CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md',p+'SLEEP_CONTROL_CLOSURE_REV1.json');clause.rationale='VER-C3-SLEEP-CONTROL-001: actual wake/recovery changes sensed control and inhibition under existing native Biological identity; original nonzero acquired journal, reward learning, goals and fixed constitution/competence remain separate. Full/NoControl and blind/biased/execution/maintenance controls,2 models/20 runs/52 selected prefixes. Learning-disabled probes, external sleep and finite gains only; no global cognitive/personality or clinical claim.';clause.obligations=[...new Set([...clause.obligations,ro(8),ro(9),ro(12),ro(13),ro(19),ro(20),ro(21)])];}
families[0].rationale+=' REV63 adds bounded sleep-loss/control with recovery and preserved prior identity. Intoxication across characters remains unqualified.';
supplemental.push('CAMPAIGN3_SLEEP_CONTROL_QUALIFICATION.md','SLEEP_CONTROL_FINDINGS.md','SLEEP_CONTROL_CLOSURE_REV1.json','INTOXICATION_CONTROL_READINESS.md');
const inventory=""",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV62.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV62.json'),disposition:'Brief12.1-6 bounded sleep/control witness;2/20/52 and13+328 tests/build.81 verdicts;107 bounded/20 partial/5 blocked. No Campaign3 exit.'};"+s[b:];f.write_text(s,encoding='utf8')
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
