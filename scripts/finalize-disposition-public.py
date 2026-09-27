from pathlib import Path
import json,subprocess
p=Path('docs/planning');result=json.loads((p/'DISPOSITION_PUBLIC_RESULT_REV1.json').read_text())
assert result['status']=='PASS' and result['nativePrefixes']==285 and result['models']==9 and result['runs']==15
report=p/'CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md';assert not report.exists()
report.write_text('''# Native dispositional adaptation qualification — 2026-09-27

**COMPLETE / QUALIFIED — VER-C3-DISPOSITION-PUBLIC-001. LOCAL DISPOSITION.**
Stages A–E; disposition-public/0.1-candidate. The bounded component now has its own
native source, authority, phase, provenance and Save132 admission. No owner ruling.

| Measure | Qualified scope |
|---|---|
| Candidate models / original runs |9 /15|
| Complete native prefixes |285:270 advancing /15 terminal|
| Native trace events |2700:10 per instant,18 instants per run|
| Affected / reference tests |44 (17 native,27 inherited) /328; build passed|
| Permanent allocation / since verdict |1458 /0; eight new record types1451..1458|
| Current wrapper inventory |50 producers /53 public factory routes|

## What native admission establishes

The admitted domain is the existing opposed task-fidelity channel. Broader
constitutional vectors remain outside this profile. Constitution, plastic adaptation,
effective disposition and identity standing remain separate. Constitution has no mutation authority. Identity140 owns only the original
qualified journal; adaptation140 owns only the plastic leaf. Refold owns no duplicate
plastic leaf and derives its value from the retained journal. Physical execution has
its own owner. Every foreign writer and every attempted constitution writer rejects.

The native scheduler executes context40, reasons52, decision60, intent70, expression80,
attempt100, execution110, qualification130, identity140 and adaptation140 as distinct
traced events, including fixed empty reservations for gaps/inactive branches. Decision
uses prior plastic state. The fourth accepted choice creates a batch update only after
its original expression is frozen; that update affects later choices. Generated events
have authenticated phase, parent and payload. No caller can submit produced expressions
or qualifications through the public data-only factory.

Typed record1455 exposes immutable constitutional baseline, prior plastic contribution,
identity standing, effective disposition, selected feedback, exact original qualified
history and the resulting reasons. The fixed raw scalar projection therefore has an
explicit native derivation. It does not turn the inherited empty coverage basis into
a general fusion law, or make diagnostic history an observer testimony channel.
Represented self/observer belief remains a separately qualified family.
characterProjection() is a mechanism-side inspection surface; it grants no represented
self-knowledge or downstream evidence-reference admission.

All fifteen native cases reproduce their component's original expression and journal
bytes, exact probabilities, chosen options, authorship, contributions, standing,
plastic trajectory and physical execution results. Native RNG continuation matches
the component's addressed draws. Inactive instants emit no reason-operand record;
the comparison normalizes only their unconsumed baseline/effective display fields.
Constitution remains immutable in state and plastic values remain in the update record. Whole character projections are equal for Plastic
versus Refold and for successful versus failed physical execution. Diagnostic world
state can differ while character-side evidence remains fixed.

## Preserved comparisons and interpretation

All seven laws survive: Plastic, Leaky, Refold, StandingOnly, Neither, JointMax and
JointAdd, plus positive/negative constitutional controls. NoEvidence, Pressure,
FailedExecution, Seed0, InactiveProbes and NoContextChange retain their component
interpretations. Current context and temporary absence do not rewrite biography.
Inactive motives do not produce choices merely because a disposition is present.

At the final matched probe, Plastic chooses B while Neither chooses A under the same
original addressed seed. Refold matches stored Plastic. Step/Leaky remain different
candidate update laws; quantization can temporarily hide their internal difference.
JointMax equals StandingOnly in this profile's probabilities/choices; JointAdd can
amplify the same history. Independent necessity of two feedback effects, general
correlation handling and a universal plasticity law remain UNRESOLVED.

Equal numeric histories across laws do not imply equal causal trace bytes. Per-run
component correspondence preserves the distinct original provenance for each model.
No predecessor native identity/biology profile, schema, model/run identity or component
receipt changed. Their bounded scope is preserved rather than retroactively expanded.

## Persistence, fault and publication evidence

Every complete S0..S18 native save restores by fresh original-input execution,
whole-save byte equality and exact next-save continuation; terminal no-op is included.
Restore installs no parsed state and bounds the admitted prefix to18 complete instants.
The save contains authoritative roots, queue, traces, outputs, allocators and committed
RNG addresses. Tampered traces, changed laws and malformed model/input/initial/seed
admission reject. Caller byte mutation does not change captured inputs or outputs.

Reached faults at every native phase and before commit preserve the prior committed
snapshot while marking the run Failed. Component retry semantics are not imported.
Whole-wrapper guards reject overlapping settlement and public reads, including the
scheduler-to-RNG-ledger microtask window. A rejected second call cannot unlock the
first caller's guard. RO022 remains CLOSED for the explicitly extended inventory.

The successor wrapper audit accounts for50 producers and53 factory routes. The
immutable predecessor49-producer audit is rechecked under its exact historical
directory scope; current exhaustive checks separately include the new modules.
Use scripts/check-disposition-wrapper-extension.mjs for the current inventory.

DISPOSITION_PUBLIC_PLAN_REV1.json froze the roster, identities and source graph before
qualification. DISPOSITION_PUBLIC_EXPERIMENT_REV1.json binds its canonical experiment
and comparison identities; that packaging occurred during execution without changing
any frozen case or comparison. DISPOSITION_PUBLIC_RESULT_REV1.json checks all runs;
DISPOSITION_PUBLIC_CLOSURE_REV1.json closes this exact scope. Development and harness
corrections are recorded in DISPOSITION_PUBLIC_FINDINGS.md; predecessor source and
receipt preservation remains independently checked.

The primary eighteen-instant native save is44,252,262 bytes. Full diagnostic lineage
and trace retention have substantial storage/replay cost. This is not a scaling or
compression qualification; no distinction is retired to reduce that cost. The first
three measured final prefixes are recorded in DISPOSITION_PUBLIC_SAVE_SIZE_REV1.json.
Long horizons and any representation reduction retain RO020/021 obligations.

## Durable lesson and next gate

A changing character must have an explicitly identified plastic contributor, a
preserved constitutional baseline and original evidence that later adaptation cannot
rewrite. Public integration must carry the causal lineage and learning authority,
not merely reproduce the same numerical decision.

RO009/017/019/020/021 retain broader psychology, integration and historical obligations;
RO022 retains its future-wrapper reopening rule. No calendar-time ageing, clinical
personality, learned recognition, shared biological/task identity channel, general
fusion or independent-two-effects claim follows. The public seam is closed only for
this eighteen-instant profile. Brief12.12-7 stays bounded; no new clause promotion.

AuditREV62 remains106 bounded/20 partial/6 blocked across132 clauses/15 families.
Corpus0.29.0 still has21 members;80 named verdicts. Campaign3 is NOT EXIT-READY.
Next SLEEP_CONTROL_READINESS.md: a bounded matched sleep-loss/control witness using
existing biological source contracts before inventing a new perturbation mechanism.
''',encoding='utf8')
subprocess.run(['node','scripts/check-disposition-public-closure.mjs','--write'],check=True)
verdict='VER-C3-DISPOSITION-PUBLIC-001';refs=['RO-C3-009','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
reports=['CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md','DISPOSITION_PUBLIC_FINDINGS.md','DISPOSITION_PUBLIC_CLOSURE_REV1.json','DISPOSITION_PUBLIC_PLAN_REV1.json','DISPOSITION_PUBLIC_RESULT_REV1.json','DISPOSITION_PUBLIC_EXPERIMENT_REV1.json','DISPOSITION_PUBLIC_SAVE_SIZE_REV1.json','DISPOSITION_WRAPPER_EXTENSION_REV1.json']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text());r['date']='2026-09-27';r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
for name in reports:r['reportReviews'].append({'path':'docs/planning/'+name,'obligations':refs})
r['reportReviews'].append({'path':'docs/planning/SLEEP_CONTROL_READINESS.md','obligations':['RO-C3-008','RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021']})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in ['CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md','DISPOSITION_PUBLIC_CLOSURE_REV1.json','DISPOSITION_PUBLIC_FINDINGS.md'])
  o['established']+=' VER-C3-DISPOSITION-PUBLIC-001 closes the bounded native disposition seam:9 models/15 runs/285 whole Save132 prefixes,44 affected/328 reference tests/build,1458/0. Separate constitution/plastic/standing operands and original qualification lineage are admitted; ten actual scheduler phases and disjoint mutation authority preserve component expression bytes. Constitution has no writer. Refold has no plastic leaf. Whole projections preserve failed-execution and stored/derived equivalence. Native Failed rollback and whole-wrapper publication are qualified. No new Brief clause or general fusion law.'
  o['unresolved']+=' The former component-only disposition admission debt is discharged for disposition-public/0.1-candidate only. Broader trait recognition, biological/task/represented-belief joins, calendar-time development, independent dual-feedback necessity and lost-detail derivation remain unqualified. Full diagnostic saves are about44MB at18 instants: no long-horizon scaling or compression claim; preserve lineage before any reduction.'
 if o['id'] in ['RO-C3-008','RO-C3-009','RO-C3-012','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021']:o['evidence'].append('docs/planning/SLEEP_CONTROL_READINESS.md')
 if o['id']=='RO-C3-022':
  o['reopenTrigger']='Any new native save producer/public factory or changed wrapper continuation/lifecycle state; before broader quiescence or final-exit claims outside the audited inventory.'
  o['closureRequirement']='Satisfied for the current inventory by the original49-producer closure plus VER-C3-DISPOSITION-PUBLIC-001 and DISPOSITION_WRAPPER_EXTENSION_REV1.json: current50 producers/53 factories, boundary/concurrency/fault tests, exact native replay and preserved predecessor checks.'
  o['unresolved']='No remaining exposure within the now50-producer/53-factory declared inventory. New producers and changed wrapper continuation/lifecycle ownership require another explicit extension. No Campaign3 exit or psychological qualification follows.'
  o['evidence'].append('docs/planning/DISPOSITION_WRAPPER_EXTENSION_REV1.json');o['closure']['evidence'].append('docs/planning/DISPOSITION_WRAPPER_EXTENSION_REV1.json');o['closure']['rationale']+=' VER-C3-DISPOSITION-PUBLIC-001 extends the inventory by one guarded producer and one public factory, with microtask-window and concurrent/fault tests; predecessor scope and receipts remain intact.'
f.write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write('''

## `VER-C3-DISPOSITION-PUBLIC-001` — bounded native disposition admission (2026-09-27)

QUALIFIED / LOCAL DISPOSITION, disposition-public/0.1-candidate.9 models/15 runs/
285 native prefixes;44 affected/328 reference tests/build;1458/0. Typed constitution,
plastic, standing, effective and selected feedback operands retain original qualification
lineage. Ten actual phases, no constitution writer, separate identity/plastic/physical
owners, native Failed rollback and quiescent public save/restore. Exact per-run component
expression/journal/decision correspondence; failed execution preserves whole character
projection. Seven laws and constitutional controls remain distinct; Refold retains no
plastic leaf. No general fusion, independent dual-effect necessity or ageing claim.
RO009/017/019/020/021/022; wrapper inventory now50 producers/53 factories. About44MB
primary final save; no scaling or reduction qualification. Brief counts unchanged.
Evidence CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md and DISPOSITION_PUBLIC_CLOSURE_REV1.json.
Next SLEEP_CONTROL_READINESS.md; no owner ruling.
''')
for n in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/n).open('a',encoding='utf8') as f:f.write('''

### Native disposition admission — 2026-09-27
VER-C3-DISPOSITION-PUBLIC-001:9 models/15 runs/285 native prefixes;44+328 tests/build;
1458/0. P3-009/010, MEC012..019/022 and EXP011/012 retain their component dispositions
through typed original lineage, independent authorities and actual causal phases.
No constitution writer; no state-root retirement. Native admission extends neither
old ADAPT target sets nor identity/biology profile domains. Refold/Plastic, Step/Leaky,
StandingOnly/Neither and JointMax/JointAdd remain controls; general fusion and scaling
remain open. Historical seven-axis/quadratic projections remain candidate. Wrapper
inventory is50 producers/53 factories; original49 scope reverified. Next sleep/control
readiness; no whole-family or Campaign3 exit claim.
''')
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — native disposition admission\nVER-C3-DISPOSITION-PUBLIC-001 closes the bounded public source/authority/phase/lineage/save seam:9 models/15 runs/285 native prefixes,44+328 tests/build,1458/0. Predecessor identities preserved; no additional Brief clause. Next docs/planning/SLEEP_CONTROL_READINESS.md; Campaign3 remains NOT EXIT-READY.\n')
c=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as f:f.write('\n\n## Preserved native disposition work-in-progress — 2026-09-27\n\n'+c.read_text())
c.write_text('''# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Native disposition admission COMPLETE — VER-C3-DISPOSITION-PUBLIC-001.**
LOCAL DISPOSITION; no architectural blocker. Start CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md
and DISPOSITION_PUBLIC_CLOSURE_REV1.json. Contract disposition-public/0.1-candidate.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1458** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 / RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 - 21 members / 80 verdicts** |
| Brief clauses / families | **132 / 15** |
| Brief clause dispositions | **106 bounded / 20 partial / 6 blocked** |
| Native qualification | **9 models / 15 runs / 285 prefixes** |
| Validation | **44 affected / 328 reference tests; build passed** |

Ten actual phases preserve prior-learning causality and original component expression/
journal bytes. Constitution has no writer; identity, plastic and physical state have
separate owners. Typed operands expose original qualified lineage. Refold has no plastic
leaf. Step/Leaky and joint feedback competitors remain distinct; no general fusion or
independent dual-effect necessity is established. No calendar-time ageing claim.

All native prefixes restore/advance by whole-save replay. Whole character projections
preserve failed-execution and stored/derived controls. Reached phase faults and wrapper
microtask-window tests pass. Current wrapper inventory50 producers/53 factories; use
scripts/check-disposition-wrapper-extension.mjs. Original49 scope and predecessor
receipts remain unchanged. Primary final native save is about44MB; no scaling claim.

Next SLEEP_CONTROL_READINESS.md: matched sleep-loss/control effects without rewriting
constitution, values, goals or competence. Existing biological operands do not alone
qualify that currently BLOCKED clause. No owner ruling. RO019 ACTIVE; RO021 CONDITIONAL
and mandatory before final exit. AuditREV62; Campaign3 NOT EXIT-READY.
''',encoding='utf8')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** bounded dispositional adaptation','**Prior routing (2026-09-27):** bounded dispositional adaptation',1)
s=s.replace('## Active direction\n','''## Active direction

**Current routing (2026-09-27):** native disposition admission COMPLETE:
VER-C3-DISPOSITION-PUBLIC-001. Start CURRENT.md and
CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md.9 models/15 runs/285 native prefixes;
44 affected/328 reference tests/build;1458/0. Separate immutable constitution/plastic/
standing operands and original lineage; ten actual phases, no constitution writer.
Refold has no plastic leaf; no general fusion/ageing/scaling claim. Wrapper inventory
now50 producers/53 factories; check-disposition-wrapper-extension.mjs checks current
inventory and original49 scope without changing predecessor sources. AuditREV62:
106 bounded/20 partial/6 blocked. Next SLEEP_CONTROL_READINESS.md; no owner ruling.
''',1);f.write_text(s,encoding='utf8')
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('''

## REV62 — bounded native disposition admission, 2026-09-27
VER-C3-DISPOSITION-PUBLIC-001 strengthens Brief12.12-7 with native source/authority/
phase/lineage and Save132 evidence:9 models/15 runs/285 prefixes,44+328 tests/build;
1458/0. No extra clause promotion:106 bounded/20 partial/6 blocked;80 verdicts.
Typed operands preserve original history without general fusion or ageing claims.
Wrapper inventory50 producers/53 factories; old49 scope remains preserved. Roughly44MB
primary final save is a scaling limitation, not a reason to erase causal distinctions.
Next SLEEP_CONTROL_READINESS.md; historical reconciliation remains unsatisfied.
''')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();Path('scripts/check-campaign3-exit-audit-rev61.mjs').write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV61.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV62.json'")
s=s.replace('const inventory=', '''// REV62: native disposition strengthens the existing bounded clause only.
{const clause=families[11].clauses[6];clause.evidence.push(p+'CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md',p+'DISPOSITION_PUBLIC_CLOSURE_REV1.json');clause.rationale+=' VER-C3-DISPOSITION-PUBLIC-001 supplies9 native models/15 runs/285 complete prefixes, ten actual phases, separate authority and typed original lineage. No constitution writer, general fusion, calendar-time ageing or long-horizon scaling claim. Component-era native limits remain historical.';}
families[11].rationale+=' REV62 closes bounded native disposition admission, without another clause promotion. All seven laws and constitutional controls retained.';
supplemental.push('CAMPAIGN3_DISPOSITION_PUBLIC_QUALIFICATION.md','DISPOSITION_PUBLIC_FINDINGS.md','DISPOSITION_PUBLIC_CLOSURE_REV1.json','DISPOSITION_WRAPPER_EXTENSION_REV1.json','DISPOSITION_PUBLIC_SAVE_SIZE_REV1.json','SLEEP_CONTROL_READINESS.md');
const inventory=''',1).replace('result.snapshotRevision=61;','result.snapshotRevision=62;').replace('result.counters.highestAllocatedRecordType=1450;','result.counters.highestAllocatedRecordType=1458;')
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV61.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV61.json'),disposition:'Native disposition strengthens existing12.12-7 only;9/15/285 and44+328 tests/build.80 verdicts; no additional clause or exit promotion.'};"+s[b:]
a=s.index('result.publicWrapperGate=');b=s.index('\n',a);s=s[:a]+"result.publicWrapperGate={path:p+'DISPOSITION_WRAPPER_EXTENSION_REV1.json',obligation:'RO-C3-022',status:'CLOSED',scope:'Declared50-producer/53-factory inventory; original49 audit retained. Reopen on new wrapper ownership.'};"+s[b:];f.write_text(s,encoding='utf8')
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
