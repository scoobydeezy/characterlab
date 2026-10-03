"""One-time bookkeeping after the frozen routine matrix passes; never launches replay."""
from pathlib import Path
import json

p = Path('docs/planning')
matrix = json.loads((p/'LONGITUDINAL_ROUTINE_MATRIX_REV1.json').read_text(encoding='utf-8'))
assert matrix['status'] == 'COMPOSITION MATRIX PASS'
assert matrix['runs'] == 504 and matrix['receiverPrefixes'] == 8568
assert matrix['freshJoinedRuns'] == 4 and matrix['freshJoinedRestores'] == 8
assert not (p/'CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md').exists()

def write(path, text):
    Path(path).write_text(text, encoding='utf-8', newline='\n')

report = '''# Longitudinal routine qualification — 2026-10-03

**VER-C3-LONGITUDINAL-ROUTINE-001. QUALIFIED BOUNDED, component composition.**
Stages A–E; LOCAL DISPOSITION, no owner ruling. Counters **1508 /0**.
Contract longitudinal-routine-component/0.1-candidate; prospective authenticated
source reuse under routine-reuse-harness/0.1-candidate. No permanent allocation,
corpus change or new native public admission.

## Qualified distinction

Actual repeated practice acquires cue/outcome history before interruption. After a
separate negative reward report, same-cue history can keep the practiced action
available even though reward belief is no longer positive. Current goals and acquired
biography influence whether and when it is selected. Mere restored opportunity does
not explain the learned receiver's behavior. This qualifies bounded routine integration
for Brief12.15-2; it does not qualify the separate habit/relearning clause12.15-8.

The unchanged native LONG source acquires biography, skill and relationship state.
Its original16 instants at1..8,14..21 remain fixed. The same actor's receiving owner
actually chooses and performs practice at2..7. A positive report and goal adoption
at1 are controlled initial support, not learned exploration. At8 opportunity is absent,
a separate negative report corrects reward belief, and the goal is maintained,
withdrawn or replaced with an opposed rest goal. History is not deleted by absence
or belief correction. Opportunities return14 with the same or a different admitted cue.
Only observed actual performance and its admitted outcome append receiving history.
The active goal creates reasons for available options, not the option itself.

## Frozen execution and replay scope

LONGITUDINAL_ROUTINE_PLAN_REV1.json froze6 ModelIdentities and504 RunIdentities before
execution. Five laws x3 goal modes x4 cue/visibility combinations x8 seeds produce480
default-retention receivers. Derived additionally supplies24 KeepAll receivers.
LONGITUDINAL_ROUTINE_MATRIX_REV1.json records all504 trajectories and8568 complete
receiver original-prefix reconstructions:8064 advancing/504 terminal successors.
Twelve fresh fault checks at withdrawal and resumption boundaries preserve exact
receiving state and reproduce the next successor after retry.

The16 native source trajectories and272 native source prefixes are **reused qualified
evidence**, prospectively hash-bound from the completed longitudinal goal matrix.
Their original row/archive/restore receipts are checked, embedded native save hashes
authenticated, and standing/episode counts recovered from the original881 observer
views. The source cannot read or receive updates from the routine receiver. Every
new decomposed prefix commitment binds full receiver bytes, source RunIdentity and
the exact native-save hash. Only standing is passed as a character-side operand.
This is not8568 fresh calls to the joined public restore factory, and the earlier2040
goal restores are neither repeated nor counted as fresh routine validation.

Separately, **four fresh joined native trajectories** execute all16 instants: seeds0/1,
Derived/Maintained, original cue/visible outcomes under both retention settings.
All68 native-prefix hashes match the bound sources; complete receiver snapshots match
independent receiver execution at every prefix. **Eight fresh original joined restores**
at prefixes8/16 reproduce the actual complete joined save bytes and immediate successor
or terminal result:4 advancing/4 terminal. These corroborate composition, not an all504-
run native admission matrix. No claim of all remaining tails after every prefix.

The prior10 focused and328 reference test receipts and frozen source graphs were
reverified, not freshly rerun. They include three joined fault sites and publication/
overlap guards. The complete build was freshly run and passed. The independent closure
checker and matrix checker verify counts, artifacts, comparisons and preservation.
No production source changed after the implementation checkpoint or prospective freeze.

## Comparisons and retained findings

| Comparison | Bounded result |
|---|---|
| Maintained goal, acquired cue history | All8 resume once;7 resume at14, seed0 at15 |
| Withdrawn goal, acquired cue history | All8 eventually resume through neutral choice;2 at14 |
| Opposed goal | All8 inhibit throughout the later horizon, preserving original history |
| Maintained versus withdrawn | All8 probability sequences differ;5 action sequences differ;3 equal |
| Derived versus Stored | All96 default-retention cue/visibility/goal/seed pairs have identical rows |
| KeepAll versus native recent-episode expiry | All24 Derived pairs have identical receiving rows |
| ExplicitBeliefOnly / EraseHistory | No post-gap learned resumption under corrected reward belief |
| Alternate cue / hidden practice outcomes | Derived/Stored do not acquire usable same-cue availability for the probe |
| ScheduledOnly, maintained goal | Available at all8 later opportunities;7 performances at seed0 and8 at seeds1..7; differs from Derived in all8 seeds |

Every baseline seed actually practices six times, acquiring strength63/64. A later
observed negative performed outcome lowers that cue strength to63/128, below the1/2
availability threshold, and further learned practice stops despite opportunities.
This is a bounded candidate threshold crossing, not general extinction calibration.
Stored and Derived are read strategies with a diagnostic fold cache present in both;
their equality does not establish a cache-free representation or compressed history.
ScheduledOnly can coincide with inhibited cases; no universal behavioral inequality
or unique mechanism necessity is asserted.

Seed0's contrary standing -100733/600733 leaves practice available but selects idle
at14. The full horizon now shows resumption at15, so the earlier development finding
must not be read as permanent non-resumption. Seed1's positive163071/1163071 resumes
at14. The original mistaken must-resume-at14 assertion remains preserved, alongside
the earlier text-versus-unsigned occurrence adapter rejection. Neither calibration
nor source bytes were changed to force a witness. Both development cohorts remain
byte-bound by their PRESERVATION.json files.

## Limits and next gate

The native recent episodes that expire are source skill/social/person observations,
not the new practice episodes retained by the receiving HABIT journal. This experiment
shows routine behavior alongside that source-memory loss; it does not establish habit
survival after forgetting its own practice or make the raw fold journal disposable.
Episode retention equality is receiver-specific, not proof of general memory irrelevance.

Controlled cue recognition, positive/negative reports, reward timing, source commitment
meaning and goal adoption remain fixtures. Receiving practice has actual performance
and observed outcome, but no new biological effects, general planner, goal-attainment
detector or natural autonomous scheduling. Same-actor source/receiver composition is
not one registered native scheduler. No comparator, law or architectural box is retired.

Next: LONGITUDINAL_HABIT_RELEARNING_READINESS.md. Require actual renewed practice and
admitted outcomes after inhibition/extinction, followed by a free corrected-belief
probe; preserve practice-specific episodic ownership if making that forgetting claim.
Habit12.15-8, personal-loss12.15-11 and affect-dimensionality12.5-8 remain PARTIAL.
RO009/012/013/014/015/017/019/020/021 carry limits without status changes. RO019 ACTIVE;
RO021 final history unsatisfied;RO022 CLOSED for the existing54/57 native inventory.
AuditREV107:129 bounded/3 partial/0 blocked;103 verdicts;corpus0.29.0/21 unchanged.
Campaign3 NOT EXIT-READY. North-Star transfer: admitted practice, cue availability,
current goals, enduring biography and actual action remain separately testable.
'''
write(p/'CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md', report)
summary = '''VER-C3-LONGITUDINAL-ROUTINE-001: bounded routine integration COMPONENT QUALIFIED.
6 models/504 receiver trajectories/8568 receiver prefix reconstructions,8064 advancing/
504 terminal.16 native sources/272 native prefixes reused under frozen authentication;
separately4 fresh joined horizons/68 prefix comparisons/8 joined restores (4 advancing,
4 terminal).12 fresh receiver faults; prior10 focused/328 reference receipts reverified;
fresh build passes. All8 maintained and withdrawn cases resume; opposed cases inhibit.
Maintained/withdrawn probabilities differ8/8, actions5/8. Stored/Derived96 pairs and
retention24 pairs match. Preserve seed0 delayed resumption at15 and negative-outcome
extinction; both development failures remain. No all504-run native admission claim.
Source episode expiry is not forgetting the new practice itself. No law retired.
Start CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md. Next
LONGITUDINAL_HABIT_RELEARNING_READINESS.md. All matrix processes finished.
AuditREV107:129 bounded/3 partial/0 blocked;103 verdicts;1508/0;corpus0.29.0/21 and
wrappers54/57 unchanged. RO019 ACTIVE/RO021 unsatisfied/RO022 CLOSED.
No owner ruling; Campaign3 NOT EXIT-READY.'''
with (p/'VERDICT_LEDGER.md').open('a', encoding='utf-8', newline='\n') as f:
    f.write('\n\n## `VER-C3-LONGITUDINAL-ROUTINE-001` — bounded longitudinal routines (2026-10-03)\n\nQUALIFIED BOUNDED / LOCAL DISPOSITION. longitudinal-routine-component/0.1-candidate.\n'+summary+'\nEvidence: LONGITUDINAL_ROUTINE_MATRIX_REV1.json and LONGITUDINAL_ROUTINE_CLOSURE_REV1.json.\nRO-C3-009/012/013/014/015/017/019/020/021. Brief12.15-2 only is promoted.\n')
for dest in [p/'SEAM_LEDGER.md', p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md', Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md')]:
    with dest.open('a', encoding='utf-8', newline='\n') as f:
        f.write('\n\n## Bounded longitudinal routine closure — 2026-10-03\n\n'+summary+'\n')
current = p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('ab') as f:
    f.write(b'\n\n'+current.read_bytes())
write(current, '''# Current research entry point

**Updated2026-10-03. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded longitudinal routine integration COMPONENT QUALIFIED.** Start
CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md and its closure receipt.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1508** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 /RO-C3-022** |
| Corpus /named verdict entries | **0.29.0 -21 members /103 verdicts** |
| Brief clauses /families | **132 /15** |
| Brief clause dispositions | **129 bounded /3 partial /0 blocked** |
| Public wrapper inventory | **54 producers /57 factories; unchanged** |

'''+summary+'''

Three partials remain: affect12.5-8 and longitudinal12.15-8/11. Reused source prefixes
are not new native restore executions. Both this matrix and the earlier goal matrix
are finished; do not relaunch their workers. Verbatim-log whitespace limitation remains
preserved in MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json.
''')
a = Path('AGENTS.md');s = a.read_text(encoding='utf-8')
s = s.replace('**Current routing (2026-10-03):** Routine integration IMPLEMENTED', '**Prior routing (2026-10-03):** Routine integration IMPLEMENTED', 1)
s = s.replace('## Active direction\n', '## Active direction\n\n**Current routing (2026-10-03):** '+summary+'\n', 1)
write(a, s)
registry = p/'RESEARCH_OBLIGATIONS.json';r = json.loads(registry.read_text(encoding='utf-8'))
obs = ['RO-C3-'+str(n).zfill(3) for n in [9,12,13,14,15,17,19,20,21]]
verdict = 'VER-C3-LONGITUDINAL-ROUTINE-001'
r['verdictReviews'].append({'verdict':verdict,'obligations':obs})
reports = ['docs/formal/LONGITUDINAL_ROUTINE_REUSE_PROTOCOL_0_1.md']+['docs/planning/'+n for n in ['CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md','LONGITUDINAL_ROUTINE_PLAN_REV1.json','LONGITUDINAL_ROUTINE_MATRIX_REV1.json','LONGITUDINAL_ROUTINE_CLOSURE_REV1.json','LONGITUDINAL_HABIT_RELEARNING_READINESS.md']]
for name in reports:
    r['reportReviews'].append({'path':name,'obligations':obs})
for o in r['obligations']:
    if o['id'] in obs:
        if verdict not in o['verdicts']:o['verdicts'].append(verdict)
        for name in reports:
            if name not in o['evidence']:o['evidence'].append(name)
    if o['id'] in ['RO-C3-015','RO-C3-017','RO-C3-019']:
        o['established'] += ' VER-C3-LONGITUDINAL-ROUTINE-001 qualifies bounded routine integration:504 fresh receiver trajectories/8568 receiver prefixes over16 authenticated reused native sources, corroborated by4 fresh joined horizons/8 joined restores. Same-cue history supports later actual practice; goals alter timing or inhibit without erasing history. Stored/Derived96 and retention24 pairs match. Only Brief12.15-2 is promoted.'
        o['unresolved'] += ' Routine closure does not establish forgetting of its own practice episodes: native recent skill/social/person observations expire while the separate receiving HABIT journal remains. Practice-specific episodic loss, actual relearning, natural scheduling/recognition, cache-free representation, universal extinction law and new joined native admission remain open. Reused native272 prefixes are not fresh restore work. Preserve seed0 delayed resumption and both development failure cohorts.'
write(registry, json.dumps(r, ensure_ascii=False, indent=2)+'\n')
audit = Path('scripts/check-campaign3-exit-audit.mjs');s = audit.read_text(encoding='utf-8')
s = s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV106.json';", "const output=p+'CAMPAIGN3_EXIT_AUDIT_REV107.json';")
s = s.replace('result.snapshotRevision=106;', 'result.snapshotRevision=107;')
s = s.replace("result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV105.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV105.json'),disposition:'Bounded longitudinal goal closure;128 bounded/4 partial/0 blocked;102 verdicts;1508/0.'};", "result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV106.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV106.json'),disposition:'Routine development checkpoint;128 bounded/4 partial/0 blocked;102 verdicts;1508/0.'};")
s = s.replace('const inventory=[', "// REV107: bounded routine composition qualification; habit/relearning remains partial.\n{const c=families[14].clauses[1];c.status=Q;c.evidence.push(p+'CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md',p+'LONGITUDINAL_ROUTINE_CLOSURE_REV1.json');c.obligations=[...new Set([...c.obligations,...[9,12,13,14,15,17,19,20,21].map(ro)])];c.rationale='REV107 bounded-qualified:6 models/504 receiver trajectories/8568 receiver-prefix reconstructions over16 authenticated reused native sources (272 prior native prefixes, not fresh restores). Four fresh joined horizons/68 prefix comparisons/8 joined restores corroborate decomposition. All8 maintained and withdrawn cases resume; opposed cases inhibit. Maintained/withdrawn probabilities differ8/8 and actions5/8;Stored/Derived96 and retention24 pairs match. Preserve seed0 delay to15, negative-outcome extinction and both development failures. Prior10 focused/328 reference receipts reverified;fresh build. Actual source memory expiry is not forgetting its own new practice episodes;relearning/habit clause remains partial. Controlled cue/reward/goal/meaning, no general planning, cache-free representation, universal law or new native admission.';}\nsupplemental.push('CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md','LONGITUDINAL_ROUTINE_CLOSURE_REV1.json','LONGITUDINAL_ROUTINE_PLAN_REV1.json','LONGITUDINAL_ROUTINE_MATRIX_REV1.json','LONGITUDINAL_ROUTINE_CLOSURE_BUILD_REV1.json','LONGITUDINAL_HABIT_RELEARNING_READINESS.md');\nconst inventory=[", 1)
write(audit, s)
print('Routine closure bookkeeping written; generate/check closure and audit receipts next.')
