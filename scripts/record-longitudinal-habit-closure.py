"""One-time closure bookkeeping; requires completed frozen REV2 matrix."""
from pathlib import Path
import json
p=Path('docs/planning')
m=json.loads((p/'LONGITUDINAL_HABIT_MATRIX_REV2.json').read_text())
assert m['status']=='COMPOSITION MATRIX PASS' and m['runs']==960 and m['receiverPrefixes']==16320
assert m['freshJoinedRuns']==4 and m['freshJoinedRestores']==8
assert not (p/'CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md').exists()
def write(path,s):Path(path).write_text(s,encoding='utf-8',newline='\n')
report='''# Longitudinal acquired habit/relearning qualification — 2026-10-03

**VER-C3-LONGITUDINAL-HABIT-001. QUALIFIED BOUNDED, component composition.**
Stages A–E; LOCAL DISPOSITION, no owner ruling. Counters **1508 /0**.
Contracts longitudinal-habit-component/0.1-candidate and longitudinal-habit-join/0.1-candidate.
Authoritative experiment: LONGITUDINAL_HABIT_PLAN_REV2.json and MATRIX_REV2; execution
protocol habit-reuse-harness/0.2-candidate. No allocation, corpus change or new native admission.

## Qualified distinction

Actually observed practice acquires both cue history and separately owned practice
episodes. Those episode children can be displaced while learned cue availability remains.
A current rest goal inhibits the available action without erasing that history. Release
permits a free response; later negative performance feedback lowers availability. Actual
renewed practice with admitted positive outcomes restores learned availability, which
survives a subsequent negative reward-belief report and goal withdrawal. Positive reports
alone do not relearn. This qualifies bounded longitudinal habit integration, Brief12.15-8.

The same LONG actor retains its independently acquired native biography, skill and
relationship history. The source's safe standing conditions receiving reasons; habit
learning cannot write that source. Original native recipe, empty initial state, inputs
and source causal owners remain unchanged. Both receiving memory settings use the same
default-retention native source for a seed, so the memory comparison changes only the
practice episode owner, not native source retention or biography.

At1 an explicit positive report and adopted practice goal support actual practice2..7.
At8 six admitted intervening context displays displace the six original practice episodes
under recency capacity6; KeepAll32 retains them. Negative reward belief and an opposed
rest goal are separate updates. Rest inhibits14/15, then retires;16 permits a free cue
response. A renewed goal becomes active17; a positive report follows17. Actual practice
at18/19 has positive physical outcomes. After19, a negative report corrects belief and
the renewed goal retires;20/21 test free learned response. All expiries22 lie beyond21.

## Frozen experiment and replay accounting

Ten model configurations cross5 laws and2 practice-episode retention settings. Each
crosses3 relearning conditions,2 cues,2 overall practice-outcome visibility conditions
and8 seeds: **960 fresh receiver trajectories**. Visibility masks practice observations
throughout the profile, including relearning; the additional Hidden condition specifically
masks18/19 when observations would otherwise be visible. Unavailable removes18/19
opportunities while preserving the explicit reports.

All **16320 original receiver prefixes** restore exact state and immediate successors:
15360 advancing/960 terminal. Restore uses the actual component restore function.
Twelve fresh boundary faults preserve memory, governance, goals, history, cache and
belief, then reproduce the successor after retry. Full future source sequences are
bound by the prospective RunIdentities; the online receiver alone does not bind them.

Eight default-retention native source trajectories and136 native prefixes are reused
qualified evidence, prospectively authenticated from the goal matrix. Original archive,
row and restore receipts remain bound. Native save hashes and881 observer projections
are verified; only standing enters the receiver. Decomposed save commitments bind full
receiver bytes, original source RunIdentity and exact native-save hash. These16320 checks
are not fresh native restore-factory calls, and no earlier goal/routine matrix is rerun.

Separately, **four fresh REV2 joined trajectories** execute the full16-instant horizon:
Derived/Observed, visible original cue, seeds0/1 under both practice retention settings.
All68 native-prefix comparisons and full receiving snapshots match decomposition.
**Eight fresh full joined restores**, at prefixes8/16, reproduce actual joined save
bytes and immediate successor/terminal behavior:4 advancing/4 terminal. This corroborates
composition, not960 new native admissions or all remaining-tail replay after every prefix.

Two fresh native-join tests and a fresh complete build passed before freeze. The prior
10 component tests,16 memory-owner tests and328 reference tests were reverified against
their frozen receipts/dependencies, not rerun during this qualification. Native tests
cover source standing, own practice-episode loss, three fault sites, all read/overlap
guards, prefix1 restore/successor and changed-profile rejection.

## Results and retained comparisons

| Comparison | Bounded result |
|---|---|
| Actual initial practice | All8 baseline seeds perform/observe six practices; cue strength63/64 |
| Practice-episode loss versus KeepAll | Six old practice children lost versus retained; habit evidence unchanged |
| Rest-goal inhibition | All8 inhibit at14/15 while learned option remains available and old episode content is absent |
| Free release at16 | Four act at16; four act at17 under renewed goal support |
| Negative feedback | All8 reach63/128 before positive renewed practice |
| Observed renewed practice | All8 perform/observe18/19; strength447/512 and availability remain after correction/retirement |
| Hidden / Unavailable renewed practice | All8 remain63/128, no corrected-belief availability or final free performance |
| Final free probes20/21 | Four seeds act; four do not despite restored availability |
| Stored versus Derived | All192 matched full receiving row comparisons agree |
| Recency versus KeepAll | All480 matched behavioral row projections agree; episodic contents/counts/losses differ |
| Changed cue | Old history cannot supply its free response; actual new practice learns the new cue to3/4 |
| ExplicitBeliefOnly / EraseHistory | Corrected-belief or history-erasure controls exclude the respective learned response; retained episodes alone do not restore it |

Final actions occur at20 for seeds0/2/5 and21 for seed4. Seeds1/3/6/7 do not act in
those two probes. These action equalities with no-relearning controls remain alongside
different available options/probabilities; do not infer absent learning from a non-action.
Old lost acquisition IDs302..307 remain complete-loss metadata and never return to the
episode owner. New practice forms new identities; correction does not rewrite old evidence.

## Preserved findings and limits

The initial dependency scan failed on a Vite ?raw suffix before writing a plan. Preserve
LONGITUDINAL_HABIT_FREEZE_FINDING_REV1.json and its original harness copy. The first frozen
receiver execution then failed because its fault oracle expected ROUTINE_INJECTED instead
of the correct LH_INJECTED. Preserve LONGITUDINAL_HABIT_ORACLE_FINDING_REV1.json, original
plan/runner and one completed joined seed0 receipt. The old native process was explicitly
stopped; REV2 froze corrected harness identities before new execution. Production semantics
never changed. Original and REV2 seed0 joined prefix/save/restore hashes are identical,
while their experiment-bound RunIdentities differ. The old joined run is not added to the
new four-run/eight-restore counts. No failure was erased or recast as a behavior result.

Episode formation here is a component adapter over actual admitted observations, not
native GA attention/selection/formation admission. recallPractice reads only surviving
episode children; it cannot recover content from diagnostics, protocol or habit history.
Nevertheless the full habit fold journal and audit rows still retain past observations:
this is local episodic-content loss, not global erasure, compressed learning history or
proof that recall can never be reconstructed. Stored/Derived remain read strategies with
diagnostic cache present in both. No state representation or architectural box is retired.

Controlled reports, cues, memory pressure, reward timing, initial goals and meaning remain
fixtures. Zero-reason free choices use HABIT's neutral policy, distinct from biological
NoActiveReasons. The finite extinction/relearning thresholds and standing calibration are
candidates, not universal or clinical laws. No native joined scheduler, new biological
effect, goal-attainment detector, natural exploration, general recollection or lifetime
scaling is qualified. Receiving practice does not write new native identity evidence.

Next: LONGITUDINAL_PERSONAL_LOSS_READINESS.md. Personal-loss12.15-11 and affect12.5-8
remain PARTIAL. RO009/012/013/014/015/017/019/020/021 retain all scope limits and
comparators; statuses unchanged. RO019 ACTIVE;RO021 historical exit gate unsatisfied;
RO022 CLOSED for existing54/57 native scope. AuditREV109:130 bounded/2 partial/0 blocked,
104 verdicts;corpus0.29.0/21. Campaign3 NOT EXIT-READY. North-Star transfer: episodic
content, learned habit, expectation, current inhibition and actual action remain distinct.
'''
write(p/'CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md',report)
summary='''VER-C3-LONGITUDINAL-HABIT-001: bounded habit/relearning COMPONENT QUALIFIED.
10 models/960 fresh receiver runs/16320 receiver-prefix restores (15360 advancing/960
terminal), over8 authenticated reused native sources/136 prior native prefixes.
Separately4 fresh REV2 joined horizons/68 prefix comparisons/8 joined restores pass.
Practice-specific episode loss preserves habit; rest inhibits; actual observed renewed
practice restores corrected-belief availability8/8. Hidden/unavailable controls do not.
Final free action4/8; four non-actions preserved. Stored/Derived192 pairs and retention480
behavioral pairs match.2 fresh joined tests/build; prior10+16+328 receipts reverified.
Preserve ?raw scanner and wrong fault-oracle findings, original plan and one old joined
receipt; REV2 is authoritative, no production semantics changed. No native admission or
global history erasure/compression. All execution jobs finished; no duplicate workers.
Start CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md. Next LONGITUDINAL_PERSONAL_LOSS_READINESS.md.
AuditREV109:130 bounded/2 partial/0 blocked;104 verdicts;1508/0;corpus0.29.0/21 and
wrappers54/57 unchanged. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED. No owner ruling;
Campaign3 NOT EXIT-READY.'''
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf-8',newline='\n') as f:f.write('\n\n## `VER-C3-LONGITUDINAL-HABIT-001` — bounded longitudinal habit and relearning (2026-10-03)\n\nQUALIFIED BOUNDED / LOCAL DISPOSITION. longitudinal-habit-component/0.1-candidate.\n'+summary+'\nEvidence: LONGITUDINAL_HABIT_MATRIX_REV2.json and LONGITUDINAL_HABIT_CLOSURE_REV1.json.\nRO-C3-009/012/013/014/015/017/019/020/021. Only Brief12.15-8 is promoted.\n')
for dest in [p/'SEAM_LEDGER.md',p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md',Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md')]:
 with dest.open('a',encoding='utf-8',newline='\n') as f:f.write('\n\n## Bounded longitudinal habit/relearning closure — 2026-10-03\n\n'+summary+'\n')
current=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('ab') as f:f.write(b'\n\n'+current.read_bytes())
write(current,'''# Current research entry point

**Updated2026-10-03. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded longitudinal habit/relearning COMPONENT QUALIFIED.** Start
CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md and its closure receipt.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1508** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 /RO-C3-022** |
| Corpus /named verdict entries | **0.29.0 -21 members /104 verdicts** |
| Brief clauses /families | **132 /15** |
| Brief clause dispositions | **130 bounded /2 partial /0 blocked** |
| Public wrapper inventory | **54 producers /57 factories; unchanged** |

'''+summary+'''

Remaining partials: personal-loss12.15-11 and affect dimensionality12.5-8. Reused source
prefixes are not fresh native restores. Habit/routine/goal matrix jobs are all finished;
do not relaunch them. Verbatim-log whitespace limitation remains preserved in
MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json.
''')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8');s=s.replace('**Current routing (2026-10-03):** Habit/relearning successor IMPLEMENTED','**Prior routing (2026-10-03):** Habit/relearning successor IMPLEMENTED',1);s=s.replace('## Active direction\n','## Active direction\n\n**Current routing (2026-10-03):** '+summary+'\n',1);write(a,s)
registry=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(registry.read_text(encoding='utf-8'));obs=['RO-C3-'+str(n).zfill(3) for n in [9,12,13,14,15,17,19,20,21]];verdict='VER-C3-LONGITUDINAL-HABIT-001';r['verdictReviews'].append({'verdict':verdict,'obligations':obs})
reports=['docs/formal/LONGITUDINAL_HABIT_REUSE_PROTOCOL_0_1.md','docs/formal/LONGITUDINAL_HABIT_REUSE_PROTOCOL_0_2.md']+['docs/planning/'+n for n in ['CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md','LONGITUDINAL_HABIT_PLAN_REV1.json','LONGITUDINAL_HABIT_PLAN_REV2.json','LONGITUDINAL_HABIT_MATRIX_REV2.json','LONGITUDINAL_HABIT_CLOSURE_REV1.json','LONGITUDINAL_HABIT_FREEZE_FINDING_REV1.json','LONGITUDINAL_HABIT_ORACLE_FINDING_REV1.json']]
for name in reports:r['reportReviews'].append({'path':name,'obligations':obs})
loss='docs/planning/LONGITUDINAL_PERSONAL_LOSS_READINESS.md';lossobs=['RO-C3-'+str(n).zfill(3) for n in [9,10,11,12,13,14,16,17,19,20,21]];r['reportReviews'].append({'path':loss,'obligations':lossobs})
for o in r['obligations']:
 if o['id'] in obs:
  if verdict not in o['verdicts']:o['verdicts'].append(verdict)
  for name in reports:
   if name not in o['evidence']:o['evidence'].append(name)
 if o['id'] in lossobs and loss not in o['evidence']:o['evidence'].append(loss)
 if o['id'] in ['RO-C3-015','RO-C3-017','RO-C3-019']:
  o['established']+=' VER-C3-LONGITUDINAL-HABIT-001 qualifies bounded same-actor acquired biography, practice-specific episode loss, retained habit, inhibition/release and actual relearning:960 receiver runs/16320 prefix restores over8 authenticated reused native sources;4 fresh joined horizons/8 joined restores. All8 observed cases recover availability;4 act in final free probes. Hidden/unavailable controls do not relearn. Only Brief12.15-8 is promoted.'
  o['unresolved']+=' Habit closure uses component episodic admission and retained raw habit/audit history;no native GA formation, global erasure, compressed representation, natural recognition, universal threshold/control law or new joined native scheduler. Stored/Derived192 and retention480 equalities do not retire candidates. Preserve first scanner failure, frozen oracle failure and unchanged old/new joined seed0 bytes. Personal loss and affect dimensionality remain partial;historical exit reconciliation remains mandatory.'
write(registry,json.dumps(r,ensure_ascii=False,indent=2)+'\n')
audit=Path('scripts/check-campaign3-exit-audit.mjs');s=audit.read_text(encoding='utf-8');s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV108.json';","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV109.json';").replace('result.snapshotRevision=108;','result.snapshotRevision=109;')
s=s.replace("result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV107.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV107.json'),disposition:'Bounded routine closure;129 bounded/3 partial/0 blocked;103 verdicts;1508/0.'};","result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV108.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV108.json'),disposition:'Habit/relearning implementation;129 bounded/3 partial/0 blocked;103 verdicts;1508/0.'};")
s=s.replace('const inventory=[',"// REV109: bounded acquired habit/own-episode loss/relearning composition.\n{const c=families[14].clauses[7];c.status=Q;c.evidence.push(p+'CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md',p+'LONGITUDINAL_HABIT_CLOSURE_REV1.json');c.obligations=[...new Set([...c.obligations,...[9,12,13,14,15,17,19,20,21].map(ro)])];c.rationale='REV109 bounded-qualified:10 models/960 receiver runs/16320 receiver-prefix restores,15360 advancing/960 terminal, over8 authenticated reused native sources/136 prior prefixes. Four fresh joined horizons/68 prefix comparisons/8 joined restores corroborate decomposition. Actual practice episodes are displaced while HABIT history persists;rest inhibits;release permits response;observed18/19 practice restores corrected-belief availability8/8,with4 actual free responses and4 non-actions. Hidden/unavailable controls do not relearn. Stored/Derived192 and retention480 behavioral pairs match. Two fresh join tests/build;prior10+16+328 receipts reverified. Preserve pre-freeze scanner/frozen oracle failures and original joined receipt;REV2 authoritative. Component memory admission,raw audit persists,no global erasure/compression,universal law or new native scheduler. Personal loss remains partial.';}\nsupplemental.push('CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md','LONGITUDINAL_HABIT_CLOSURE_REV1.json','LONGITUDINAL_HABIT_PLAN_REV2.json','LONGITUDINAL_HABIT_MATRIX_REV2.json','LONGITUDINAL_HABIT_QUALIFICATION_BUILD_REV1.json','LONGITUDINAL_HABIT_FREEZE_FINDING_REV1.json','LONGITUDINAL_HABIT_ORACLE_FINDING_REV1.json','LONGITUDINAL_PERSONAL_LOSS_READINESS.md');\nconst inventory=[",1);write(audit,s)
print('Habit/relearning closure documentation recorded; generate/check closure and audit receipts next.')
