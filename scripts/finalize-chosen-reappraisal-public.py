from pathlib import Path
import json,hashlib,subprocess
p=Path('docs/planning');result=json.loads((p/'CHOSEN_REAPPRAISAL_PUBLIC_RESULT_REV1.json').read_text())
assert result['status']=='PASS' and result['runs']==43 and result['prefixes']==387
report=p/'CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md';assert not report.exists(),'Do not rerun finalization'
report.write_text("""# Native chosen reappraisal qualification — 2026-09-27

**BOUNDED NATIVE QUALIFIED — VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001.**
LOCAL DISPOSITION, chosen-reappraisal-public/0.1-candidate. Stages A–E close the
component's public integration gate. No architectural ruling required.

| Measure | Qualified scope |
|---|---|
| Native models / original runs |4 /43|
| Every complete native prefix |387:344 advancing /43 terminal|
| Native events per run |96 across eight instants and twelve actual stages|
| Focused / reference tests |21 /328; build passed|
| Native wrapper inventory |51 producers /54 factories|
| Records allocated this increment |1459..1467; existing namespace1165|
| Highest allocation / since verdict |1467 /0|

## Behavior and integration

All43 preserved component cases reproduce every appraisal, prior/updated belief,
goal operand, raw signal, reason nucleus, resolution, probability, actual choice,
intent, expression, plan, attempt, completion, observation and frame byte exactly.
Their committed random addresses also match. The component and earlier instructed
public profile retain their original source bytes and identities. The new factory
admits typed originals; it never receives a component-selected action or frame.

Balanced seeds1/4/5/6 choose reappraisal;0/2/3/7 choose competing work. BenefitRelative,
KnowledgeOnly and NoReappraisal remain separate native models, with a second affect
projection retained. Goal-only interventions change strategy at identical knowledge.
Interrupted completion preserves choice/expression/attempt and prevents framing.
NoReappraisal preserves actual choice and completion while removing frame application.
Known harmful framing increases later affect under KnowledgeOnly; successful operation
is not guaranteed relief. Unknown, same-instant evidence, denied/empty catalogue, absent
opportunity and zero-goal controls preserve their component distinctions.

The scheduler executes context40, appraisal50, reasons52, decision60, intent70,
expression80, plan90, attempt100, completion110, observation120, learning140 and frame140.
Choice is computed at60; expression is produced at80. Each stage is authenticated by
its original or generated parent/type/phase/payload and reserves a runtime slot.
Context alone owns goal root1462, learning owns1029, and framing owns1031. Frame
lineage uses the prior knowledge carried by1463, never newly learned evidence. Frame
application at4 changes appraisal at5; it cannot rewrite affect already appraised at4.

Whole observer projections remain byte-identical for changed hidden physical harm,
and denied versus absent catalogue. They exclude originals, physical truth, model/run
identity, roots and trace patches. Learned conditional estimates remain separate from
the interpreted frame. The considered protected condition is not enacted physical
protection. The competing work commitment has no qualified external work outcome.

## Native failure, publication and preservation

Every S0..S8 Save132 is restored from copied original inputs by fresh execution and
whole-byte comparison, then advanced to the exact next save or terminal no-op. The
save binds roots, queue, trace, outputs, allocators and committed random addresses.
Restore never installs caller-supplied state. Exact model/registry, empty S0, original
field/domain/order and uniform32-byte seed admission accompany opaque prepared handles.

Twenty-one focused tests cover component correspondence and actual trace phases,
all cross-owner writes, source/seed/handle admission, forged save and foreign model,
reached faults at all twelve phases plus commit, copying, hidden safe views and whole
wrapper publication. Faults are injected at instant4 after knowledge acquisition,
including actual decision draws. Rollback preserves all committed state and addresses;
the native scheduler stays Failed. Concurrent and microtask reads remain guarded
through the outer settlement's RNG ledger commit and cleanup.

The first test cohort's row-extraction helper failure is preserved in
CHOSEN_REAPPRAISAL_PUBLIC_TESTS_DEV1.json and CHOSEN_REAPPRAISAL_PUBLIC_FINDINGS.md.
Correcting that helper did not change behavior. All21 corrected native tests, all328
reference tests and the build pass. The plan freezes the implementation dependency
graph and canonical model/run/experiment/comparison identities before qualification.

CHOSEN_REAPPRAISAL_WRAPPER_EXTENSION_REV1.json closes the new-wrapper trigger for
RO022 at51 producers/54 factories. Exact hash-checked predecessor scopes preserve
both the earlier50 and original49 producer audits, without rewriting old sources or
inventing a general exemption for future wrappers. Reopen on the next addition.
CHOSEN_REAPPRAISAL_PUBLIC_RESULT_REV1.json and the closure receipt bind this evidence.

## Transfer and remaining scope

A chosen cognitive operation has the same causal and admission obligations as other
character actions: belief-relative reasons, actual choice, independently attempted
completion and a later effect owned by the receiving state. Successful feeling change
is not evidence that danger or the world changed. Native integration preserves that
separation instead of treating a component computation as a public action command.

MEC001/002/003/011..019/022 and P3-001/004/005/008/011 retain their component dispositions.
No comparator is retired. RO010/011/012/019/020 retain general inference, affect/control
and integration limits. The immediate chosen-reappraisal native debt is discharged;
old dated statements of its open status remain historical. RO021 final historical
reconciliation remains mandatory, and RO022 retains its next-wrapper trigger.

No general planning, learned efficacy, spontaneous goal discovery, physiology, social
embarrassment, Task/Biological identity join or whole Campaign3 exit is claimed.
Brief12.5-7 gains native evidence without a new clause promotion:109 bounded/20 partial/
3 blocked,132 clauses/15 families. AuditREV66,84 named verdicts; corpus0.29.0 unchanged.
Next EMBARRASSMENT_READINESS.md audits the distinct embarrassment-without-avoidance gap.
""",encoding='utf8')
subprocess.run(['node','scripts/check-chosen-reappraisal-public-closure.mjs','--write'],check=True)
verdict='VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001';refs=['RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022']
f=p/'RESEARCH_OBLIGATIONS.json';r=json.loads(f.read_text());r['date']='2026-09-27';r['verdictReviews'].append({'verdict':verdict,'obligations':refs})
reports=['CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md','CHOSEN_REAPPRAISAL_PUBLIC_FINDINGS.md','CHOSEN_REAPPRAISAL_PUBLIC_PLAN_REV1.json','CHOSEN_REAPPRAISAL_PUBLIC_RESULT_REV1.json','CHOSEN_REAPPRAISAL_PUBLIC_CLOSURE_REV1.json','CHOSEN_REAPPRAISAL_WRAPPER_EXTENSION_REV1.json','EMBARRASSMENT_READINESS.md']
for name in reports:r['reportReviews'].append({'path':'docs/planning/'+name,'obligations':refs})
for o in r['obligations']:
 if o['id'] in refs:
  o['verdicts'].append(verdict);o['evidence'].extend('docs/planning/'+n for n in reports)
  o['established']+=' VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001 discharges the immediate chosen-reappraisal native integration debt:4 models/43 runs/387 native prefixes, exact component rows and RNG, twelve actual stages, disjoint goal/learning/frame authority, whole safe projections and Failed rollback/publication.21 new/328 reference tests/build;1467/0. Native wrapper extension51/54 preserves prior50 and original49 source scopes.'
  o['unresolved']+=' Prior component-era native-open statements are historical after this scoped closure. General planning, social affect, learned efficacy, spontaneous goal discovery, physiology, physical protection and Task/Biological identity joins remain unqualified. Next embarrassment intake does not promote a clause. Final historical exit gate remains mandatory; new wrapper ownership reopens RO022.'
f.write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf8') as f:f.write("""

## `VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001` — bounded native chosen reappraisal (2026-09-27)

QUALIFIED NATIVE / LOCAL DISPOSITION, chosen-reappraisal-public/0.1-candidate.
4 models/43 runs/387 native prefixes;21 new/328 reference tests/build;1467/0.
Twelve actual stages reproduce component rows/RNG exactly. Typed originals, separate
goal/learning/frame owners, whole safe views, Failed rollback, Save132 replay and
whole-wrapper publication are qualified.51 producers/54 factories; earlier source
and audit scopes unchanged. No new psychological law or clause promotion.
RO010/011/012/019/020/021/022; CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md and
CHOSEN_REAPPRAISAL_PUBLIC_CLOSURE_REV1.json. Next EMBARRASSMENT_READINESS.md.
""")
for n in ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md']:
 with (p/n).open('a',encoding='utf8') as f:f.write("""

### Native chosen reappraisal — 2026-09-27
VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001 closes native admission:4/43/387,21+328 tests/build,
1467/0. MEC001/002/003/011..019/022 and P3-001/004/005/008/011 retain component dispositions;
no mechanism retired. Typed originals, actual twelve stages, exact component rows/RNG,
separate goal/learning/frame owners and whole Save132 replay now qualify public use.
RO022 current wrapper scope51/54; previous50 and49 remain preserved. No physical
protection, general planning or Task/Biological join. Next EMBARRASSMENT_READINESS.md.
""")
with Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md').open('a',encoding='utf8') as f:f.write('\n\n### 2026-09-27 — native chosen reappraisal\nVER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001 closes typed source/authority/twelve-stage/Save132 admission:4 models/43 runs/387 native prefixes,21+328 tests/build,1467/0. Exact component correspondence and51/54 wrapper audit. Next docs/planning/EMBARRASSMENT_READINESS.md; no owner ruling or Campaign3 exit.\n')
f=p/'CURRENT.md'
with (p/'CAMPAIGN3_LOG.md').open('a',encoding='utf8') as out:out.write('\n\n## Preserved native chosen reappraisal work in progress — 2026-09-27\n\n'+f.read_text())
f.write_text("""# Current research entry point

**Updated 2026-09-27. Replace this index; chronology belongs to CAMPAIGN3_LOG.md.**

**Native chosen reappraisal COMPLETE — VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001.**
LOCAL DISPOSITION; no architectural blocker. Start CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md
and CHOSEN_REAPPRAISAL_PUBLIC_CLOSURE_REV1.json; chosen-reappraisal-public/0.1-candidate.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1467** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 /RO-C3-022** |
| Corpus / named verdict entries | **0.29.0 -21 members /84 verdicts** |
| Brief clauses / families | **132 /15** |
| Brief clause dispositions | **109 bounded /20 partial /3 blocked** |
| Native experiment | **4 models /43 runs /387 prefixes** |
| Validation | **21 new /328 reference tests; build passed** |
| Native wrapper inventory | **51 producers /54 factories** |

All component rows and RNG match through twelve actual native stages. Typed originals,
separate goal/learning/frame owners, Failed rollback, whole safe views and Save132
replay close the immediate integration debt. Earlier component/instructed profiles and
wrapper audit source bytes remain unchanged. Preserve the first test-helper failure.
No new psychological law, physical protection, general planning or Task/Biological join.

Next EMBARRASSMENT_READINESS.md: audit bounded socially exposed self-evaluation and
competing participation motives before implementing embarrassment without avoidance.
No new clause promotion here. RO019 ACTIVE; RO021 final history gate unsatisfied;
RO022 reopens on future wrappers. AuditREV66; Campaign3 NOT EXIT-READY. No owner ruling.
""",encoding='utf8')
f=Path('AGENTS.md');s=f.read_text().replace('**Current routing (2026-09-27):** chosen reappraisal COMPONENT','**Prior routing (2026-09-27):** chosen reappraisal COMPONENT',1)
s=s.replace('## Active direction\n',"""## Active direction

**Current routing (2026-09-27):** native chosen reappraisal COMPLETE:
VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001. Start CURRENT.md and
CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md.4 models/43 runs/387 native prefixes;
21 new/328 reference tests/build;1467/0. Twelve actual stages reproduce all component
rows/RNG with separate goal/learning/frame owners. Wrapper inventory51/54; predecessor
sources unchanged. Preserve first test-helper failure. No physical protection, general
planning or Task join. AuditREV66:109 bounded/20 partial/3 blocked. Next
EMBARRASSMENT_READINESS.md; no owner ruling.
""",1);f.write_text(s,encoding='utf8')
with (p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md').open('a',encoding='utf8') as f:f.write('\n\n## REV66 — native chosen reappraisal, 2026-09-27\nVER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001 adds native evidence to Brief12.5-7 without another clause promotion:4/43/387,21+328 tests/build,1467/0;51/54 wrappers.109 bounded/20 partial/3 blocked;84 verdicts. Next embarrassment intake; no Campaign3 exit.\n')
f=Path('scripts/check-campaign3-exit-audit.mjs');s=f.read_text();archive=Path('scripts/check-campaign3-exit-audit-rev65.mjs');assert not archive.exists();archive.write_bytes(f.read_bytes())
s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV65.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV66.json'").replace('result.snapshotRevision=65;','result.snapshotRevision=66;').replace('result.counters.highestAllocatedRecordType=1458;','result.counters.highestAllocatedRecordType=1467;')
s=s.replace('const inventory=',"""// REV66: native chosen reappraisal closes its component admission gate.
{const clause=families[4].clauses[6];clause.evidence.push(p+'CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md',p+'CHOSEN_REAPPRAISAL_PUBLIC_CLOSURE_REV1.json');clause.rationale+=' VER-C3-CHOSEN-REAPPRAISAL-PUBLIC-001 now closes the previously open native gate:4 models/43 runs/387 native prefixes; twelve actual stages, exact component rows/RNG, disjoint owners, safe views and Save132/publication. No broader psychological claim.';clause.obligations=[...new Set([...clause.obligations,ro(22)])];}
families[4].rationale+=' REV66 closes native chosen-reappraisal admission; earlier component-open statements are historical. Social embarrassment remains unqualified.';
supplemental.push('CAMPAIGN3_CHOSEN_REAPPRAISAL_PUBLIC_QUALIFICATION.md','CHOSEN_REAPPRAISAL_PUBLIC_FINDINGS.md','CHOSEN_REAPPRAISAL_PUBLIC_CLOSURE_REV1.json','CHOSEN_REAPPRAISAL_WRAPPER_EXTENSION_REV1.json','EMBARRASSMENT_READINESS.md');
const inventory=""",1)
a=s.index('result.predecessor=');b=s.index('\n',a);s=s[:a]+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV65.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV65.json'),disposition:'Native chosen reappraisal closes its immediate source/authority/scheduler/Save132 gate;4/43/387,21+328 tests/build,1467/0.84 verdicts;109 bounded/20 partial/3 blocked; no new clause promotion or Campaign3 exit.'};"+s[b:]
s=s.replace("result.publicWrapperGate={path:p+'DISPOSITION_WRAPPER_EXTENSION_REV1.json',obligation:'RO-C3-022',status:'CLOSED',scope:'Declared50-producer/53-factory inventory; original49 audit retained. Reopen on new wrapper ownership.'};","result.publicWrapperGate={path:p+'CHOSEN_REAPPRAISAL_WRAPPER_EXTENSION_REV1.json',obligation:'RO-C3-022',status:'CLOSED',scope:'Declared51-producer/54-factory inventory; prior50 and original49 audits retained. Reopen on new wrapper ownership.'};")
f.write_text(s,encoding='utf8')
subprocess.run(['node','scripts/check-campaign3-exit-audit.mjs','--write'],check=True)
subprocess.run(['npm.cmd','run','check:research','--','--self-test'],check=True)
