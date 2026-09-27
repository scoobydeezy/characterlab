"""Publish the checkpoint only after the frozen repair cohorts and checks finish."""
from pathlib import Path
import json
import subprocess

p = Path('docs/planning')
root = p / 'public-wrapper-quiescence-rev1'
read = lambda f: json.loads(Path(f).read_text(encoding='utf-8-sig'))
for i in range(4):
    assert read(root / f'REPAIR_PART_{i}.json')['status'] == 'PASS'
for i in range(142):
    assert read(root / f'REPAIR_RUN_{i}.json')['status'] == 'PASS'
assert read(root / 'EMBODIED_REPAIR_RESULT.json')['status'] == 'PASS'
assert read(root / 'TESTS_REV3.json')['numPassedTests'] == 72
assert read(root / 'ROLLBACK_TESTS_REV1.json')['numPassedTests'] == 2
assert read(root / 'REFERENCE_TESTS_REV1.json')['numPassedTests'] == 328
assert read(root / 'BUILD_REV3.json')['status'] == 'PASS'
verdict = 'VER-C3-PUBLIC-QUIESCENCE-001'
report = p / 'CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md'
assert not report.exists(), 'Do not duplicate a published checkpoint'

def append(file, text):
    with Path(file).open('ab') as stream:
        stream.write(('\n\n' + text.strip() + '\n').encode('utf8'))

summary = '''Bounded public-wrapper publication COMPLETE — VER-C3-PUBLIC-QUIESCENCE-001.
LOCAL DISPOSITION; no owner ruling. The49-producer inventory accounts for47 native
Campaign3 wrappers plus GA manual Save132 and Campaign2 shared adaptation. Three raw
RNG-ledger wrappers allowed torn saves (identity Task, identity Biological, Biology
public); embodied allowed a second settlement to overlap ingress cleanup. Four narrow
whole-wrapper barriers repair these failures.30 producers already have independent
guards;15 have no split public continuation state. Preserve both failure mechanisms,
the1,108-artifact pre-repair graph, probes and original serial qualification receipts.
Same50 models/149 prior cases/747 selected complete-prefix restores reproduce all
original ordinary save bytes; model/run identities, safe views and final outputs/
trace/state remain unchanged.74 affected/328 reference tests and build pass. The first
4-pass/2-fail regression cohort assumed a biological draw at1; corrected at9 while
retaining the draw assertion. The PersonState naming error is a preserved harness
failure. No new character law, state root, record allocation or psychological clause.
Counters1450/0. RO22 CLOSED within the declared inventory; RO21 historical reconciliation
still ACTIVE.1 active/19 conditional/2 closed/0 unowned;77 named verdicts. Corpus0.29.0
still21 members; Brief104 bounded/21 partial/7 blocked across132 clauses/15 families.
Campaign3 NOT EXIT-READY. Next IDENTITY_RECOVERY_READINESS.md.'''

report.write_text('''# Public-wrapper publication checkpoint — 2026-09-26

**Disposition:** QUALIFIED, bounded protocol scope. LOCAL DISPOSITION; no owner ruling.
**Stage (Brief §9):** E verdict. **VER-C3-PUBLIC-QUIESCENCE-001.**
**Contract:** public-wrapper-quiescence/0.1-candidate; prior character seam versions unchanged.

| Counter | Value |
|---|---|
| Highest allocated record type | 1450 |
| Allocated since last verdict/corpus member | 0 |

## What changed

Scheduler quiescence alone did not protect wrapper continuation bookkeeping.
Identity Task, identity Biological and Biology public could serialize new scheduler
state with the previous RNG ledger. A separate embodied defect let a second settlement
start before prior ingress cleanup finished, causing that new operation to fail.
Four narrow barriers now span settlement, bookkeeping and cleanup. Concurrent callers
cannot clear another call's barrier; fault cleanup preserves diagnostic snapshots
while failed schedulers still reject continuation saves.

The inventory accounts for49 producers:47 native Campaign3 runtimes, General Attention's
manual Save132 producer, and the Campaign2 adaptation runtime shared by its public
factories. Four are repaired,30 independently guarded,15 inapplicable to split
publication. The latter publish scheduler-owned state with constant continuation
metadata; this does not mean they lack state or psychological behavior. Existing
CognitiveRandomSession and MultisourceRandomSession ledgers already deny live reads.

## Evidence

PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json checks all receipts and preserved graph.
The exact prior identity84/428-prefix and biology58/270-prefix cohorts are rerun;
embodied adds its same7 cases and all49 prefixes. Total:50 unchanged models,
149 prior cases,747 complete-prefix restores. Every selected ordinary save equals
its prior bytes; restored next-prefix bytes and terminal behavior match. Public
model/run commitments, observer views, final state and trace/output bytes agree.
This is repeated coverage under repaired protocol enforcement, not149 new phenomena.

The deterministic before-commit microtask rejects at all tested scheduler-to-ledger
windows after repair. Embodied's overlapping call now rejects before ingress mutation
and leaves the first operation Active.74 affected tests,328 reference tests and the
production build pass. See public-wrapper-quiescence-rev1/TESTS_REV3.json (72 tests), ROLLBACK_TESTS_REV1.json
(2 additional contested-draw rollback tests), REFERENCE_TESTS_REV1.json and BUILD_REV3.json. Whole-prefix comparisons retain normal,
negative-control, no-opportunity, coarse-unit and other original comparator cases.

The failed4/2 initial test cohort and original test are preserved. The biological
fixture first draws at9, not1; the corrected regression still requires a nonempty
ledger. A separate PersonState export-name harness error is retained. See
PUBLIC_WRAPPER_QUIESCENCE_FINDINGS.md for their dispositions.

## Stage C competitor and historical evidence

The pre-repair wrappers remain executable controls in the preserved1,108-artifact
source graph. Scheduler-only quiescence fails the three raw ledger witnesses;
unlocked wrapper reentry fails embodied. Independent existing ledger barriers are
retained controls, not failures inferred from source resemblance. The chosen repair
adds no psychological competitor and canonizes no character law.

Historical closure checkers remain immutable and still certify their serial scopes.
Run node scripts/check-preserved-public-wrapper-evidence.mjs to check those receipts
against the explicit preserved graph. That loader is only a historical-source mapping;
it is not used to qualify current behavior. Current repair qualification uses the
live repaired source and frozen REPAIR_PLAN.json/EMBODIED_REPAIR_PLAN.json.

## North Star transfer

A saved character must represent one coherent committed causal history. Atomic
scheduler state is insufficient when a public wrapper owns additional continuation
state or cleanup. Keep this protocol authority separate from character beliefs,
biological adaptation and identity; do not fix publication by changing those laws.
No Brief clause, corpus member or psychological distinction is promoted or retired.

## Obligation disposition and next gate

RO-C3-022 CLOSED by this declared inventory, repaired boundary/fault tests and exact
continuation comparisons. New producers or changes to continuation/lifecycle ownership
reopen this check. RO-C3-021 remains ACTIVE and mandatory before Campaign3 exit.
The campaign remains NOT EXIT-READY:104 bounded/21 partial/7 blocked Brief clauses,
132 clauses/15 families, corpus0.29.0 with21 members.77 named verdicts;
1 active/19 conditional/2 closed/0 unowned obligations. Counters1450/0.

Next: IDENTITY_RECOVERY_READINESS.md. No architecture-owner decision pending.
''', encoding='utf8')
findings = p / 'PUBLIC_WRAPPER_QUIESCENCE_FINDINGS.md'
s = findings.read_text(encoding='utf8').replace('working findings,', 'preserved findings,').replace('RO-C3-022 ACTIVE while qualification runs.', 'RO-C3-022 CLOSED by VER-C3-PUBLIC-QUIESCENCE-001.')
s = s.replace('Closure remains pending until all repair receipts, affected tests, reference tests,\nbuild and the final inventory checker pass. No architectural escalation is needed.', 'All149 cases/747 prefix checks,74 affected/328 reference tests, build and the\n49-producer inventory checker pass. Closure: PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json.\nNo architectural escalation is needed.')
findings.write_text(s, encoding='utf8')
subprocess.run(['node', 'scripts/check-public-wrapper-repair.mjs', '--write'], check=True)

append(p / 'VERDICT_LEDGER.md', '## ' + verdict + '\n\n' + summary)
append(p / 'SEAM_LEDGER.md', '## Public-wrapper publication closure — 2026-09-26\n\n' + summary)
append(p / 'REFERENCE_MECHANISM_LEDGER.md', '## SUB-008 public-wrapper follow-up — 2026-09-26\n\n' + summary + '\n\nDisposition: retain the scheduler atomicity reference port and independent RNG guards;\nrepair the four exposed wrapper publication/lifecycle boundaries. No reference\nmechanism is retired. The pre-repair implementations remain explicit negative controls.')
append('CharacterLab — Reference Architecture Build & Research Campaign Plan.md', '## Public-wrapper protocol checkpoint — 2026-09-26\n\n' + summary)
# Those two historical intake/addendum files are hashed by the prior native-belief
# closure. Keep them immutable; CURRENT and the successor qualification route forward.

r = p / 'RESEARCH_OBLIGATIONS.json'
data = read(r)
evidence = ['docs/planning/CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md', 'docs/planning/PUBLIC_WRAPPER_QUIESCENCE_FINDINGS.md', 'docs/planning/PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json', 'docs/planning/public-wrapper-quiescence-rev1/INVENTORY_DISPOSITIONS.json', 'docs/planning/public-wrapper-quiescence-rev1/PRESERVATION.json']
for o in data['obligations']:
    if o['id'] in ['RO-C3-021', 'RO-C3-022']:
        o['verdicts'].append(verdict)
        for item in evidence:
            if item not in o['evidence']: o['evidence'].append(item)
    if o['id'] == 'RO-C3-022':
        o['status'] = 'CLOSED'
        o['established'] += ' ' + summary
        o['unresolved'] = 'No remaining exposure within the declared49-producer inventory. New factories or changes to wrapper-owned continuation/lifecycle state require a fresh boundary audit. This does not close RO21 or Campaign3.'
        o['owner'] = 'Native public factory/persistence integration; no immediate work under the resolved inventory'
        o['closureRequirement'] = 'Satisfied by VER-C3-PUBLIC-QUIESCENCE-001: complete inventory, preserved failures, four repairs, boundary/fault regressions and149 prior cases/747 exact continuations.'
        o['closure'] = {'disposition': 'RESOLVED_BY_EXPERIMENT', 'rationale': 'The declared49-producer inventory is accounted; all four proven exposures are repaired and qualified without changing ordinary bytes or character semantics.', 'evidence': evidence}
data['verdictReviews'].append({'verdict': verdict, 'obligations': ['RO-C3-021', 'RO-C3-022']})
for item in evidence:
    if not any(x['path'] == item for x in data['reportReviews']):
        data['reportReviews'].append({'path': item, 'obligations': ['RO-C3-021', 'RO-C3-022']})
r.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf8')

current = p / 'CURRENT.md'
with (p / 'CAMPAIGN3_LOG.md').open('ab') as log:
    log.write(b'\n\n## Preserved public-wrapper in-progress index\n\n')
    log.write(current.read_bytes())
current.write_text('''# Current research entry point

**Updated 2026-09-26. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Public-wrapper publication COMPLETE — VER-C3-PUBLIC-QUIESCENCE-001.**
LOCAL DISPOSITION; no architectural blocker. RO-C3-022 CLOSED within the declared
49-producer inventory. Start CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md and
PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1450** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 - 21 members / 77 verdicts** |
| Brief clauses / families | **132 / 15** |
| Brief clause dispositions | **104 bounded / 21 partial / 7 blocked** |
| Protocol requalification | **50 unchanged models / 149 prior cases / 747 prefixes** |
| Validation | **74 affected / 328 reference tests; build passed** |

Three raw-ledger wrappers (identity Task, identity Biological, Biology public) allowed
torn saves after scheduler commit; embodied allowed overlapping ingress cleanup.
Four whole-wrapper barriers repair those exact defects.30 producers already have
independent guards;15 publish only scheduler-owned values/constant continuation data.
All ordinary model/run identities, saves, views and final trace/state/output bytes
remain equal. No character law, state root, schema or psychological clause changes.

Preserve public-wrapper-quiescence-rev1:1,108 source/dependency artifacts, original
probes, the4/2 test-assumption failure and corrected74-test cohort. Historical closure
receipts are verified against that explicit preserved graph by
scripts/check-preserved-public-wrapper-evidence.mjs. Current repair receipts separately
qualify the live code. These are repeated cases, not additional behavioral coverage.

Next: IDENTITY_RECOVERY_READINESS.md, identity reversal/recovery after changed
biography, separate from represented-belief correction and dispositional adaptation.
Native identity-belief closure remains bounded and unchanged. No owner ruling pending.
RO-C3-021 final historical reconciliation remains ACTIVE and unsatisfied. AuditREV59;
Campaign3 NOT EXIT-READY. No mandatory gate is waived by this protocol closure.
''', encoding='utf8')

agents = Path('AGENTS.md')
s = agents.read_text(encoding='utf8')
marker = '**Current routing (2026-09-26):**'
assert s.count(marker) == 1
s = s.replace(marker, '''**Current routing (2026-09-26):** bounded public-wrapper publication COMPLETE:
VER-C3-PUBLIC-QUIESCENCE-001. Start CURRENT.md and
CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md.49 producers accounted,4 repaired;
same149 cases/747 prefix restores,74 affected/328 reference tests and build pass.
RO22 CLOSED; RO21 historical gate remains ACTIVE. Counters1450/0; no clause promotion.
Next IDENTITY_RECOVERY_READINESS.md under the same escalation policy.

**Prior routing (2026-09-26):**''', 1)
agents.write_text(s, encoding='utf8')
append(p / 'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md', '## REV59 — bounded public-wrapper protocol closure\n\n' + summary + '\nNo Brief or corpus-member disposition changes. RO22 is resolved; RO21 is not.')
audit = Path('scripts/check-campaign3-exit-audit.mjs')
(root / 'check-campaign3-exit-audit-rev58.mjs').write_bytes(audit.read_bytes())
s = audit.read_text(encoding='utf8').replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV58.json';", "const output=p+'CAMPAIGN3_EXIT_AUDIT_REV59.json';").replace('result.snapshotRevision=58;', 'result.snapshotRevision=59;')
s = s.replace("const inventory=[...new Set(", "supplemental.push('CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md','PUBLIC_WRAPPER_QUIESCENCE_FINDINGS.md','PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json');\nconst inventory=[...new Set(", 1)
start = s.index('result.predecessor=')
end = s.index('\nresult.finalHistoricalGate=', start)
s = s[:start] + "result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV58.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV58.json'),disposition:'RO22 protocol audit closes49-producer inventory with4 repairs,149 prior cases/747 prefixes and74 affected/328 reference tests/build. No clause promotion;77 verdicts. Historical gate remains unsatisfied.'};\nresult.publicWrapperGate={path:p+'PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json',obligation:'RO-C3-022',status:'CLOSED',scope:'Declared49-producer inventory; reopen on new wrapper continuation/lifecycle ownership. No psychological coverage promotion.'};" + s[end:]
audit.write_text(s, encoding='utf8')
subprocess.run(['npm.cmd', 'run', 'check:research', '--', '--self-test'], check=True)
subprocess.run(['node', 'scripts/check-campaign3-exit-audit.mjs', '--write'], check=True)
print('Published protocol checkpoint; historical Campaign3 exit gate remains unsatisfied.')
