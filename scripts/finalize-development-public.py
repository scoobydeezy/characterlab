"""Publish native-development bookkeeping only after the full matrix checker passes."""
from pathlib import Path
import json, hashlib
p=Path('docs/planning')
read=lambda f:json.loads(f.read_text(encoding='utf-8'))
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
c=read(p/'DEVELOPMENT_PUBLIC_CHECK_REV3.json')
assert (c['status'],c['models'],c['runs'],c['prefixes'],c['nativeStages'],c['preservedOriginalPrefixes'])==('PASS',7,36,668,8216,113)
batch=read(p/'development-public-batch-rev1/STATUS.json')
assert len(batch['workers'])==12 and all(w['status']=='PASS' and w['exitCode']==0 for w in batch['workers'])
for f in c['files']:assert sha(Path(f['path']))==f['sha256'],f['path']
assert not (p/'DEVELOPMENT_PUBLIC_CLOSURE_REV1.json').exists()
v='VER-C3-DEVELOPMENT-PUBLIC-001'
qualification="""# Developmental learning and personality: native qualification — 2026-10-01

**BOUNDED NATIVE PUBLIC QUALIFIED — VER-C3-DEVELOPMENT-PUBLIC-001.**
LOCAL DISPOSITION, development-public/0.1-candidate. Stages A–E complete for the
owner-directed two-effect profile; no general lifespan or universal plasticity law.

| Measure | Qualified scope |
|---|---|
| Native models / public programs |7 /36|
| Actual Save132 prefix restores |668:632 advancing /36 terminal|
| Committed native stages across programs |8216;13 per instant|
| Focused / reference tests |21 /328; typecheck/build passed|
| Highest record / allocated since verdict |1508 /0|
| Public wrappers |54 producers /57 factories; predecessor scopes preserved|

The component's independent developmental routes now execute under actual scheduler
ownership. Equivalent young practice produces skill1/2 versus1/8, then changes actual
execution at difficulty3/8. Performance belief follows admitted report rather than
physical success. Hidden difficulty changes execution but leaves every declared safe
view unchanged through all public prefixes. Missing report, no opportunity, denied
practice, known zero and faster mistaken learning retain their component distinctions.

An identical eligible expression contributes1/9 before developmental weighting in
both ages, with unchanged authorship and original qualification journal. Its applied
personality delta is1/9 when young versus1/36 when mature. Matching early history
leaves different acquired personality after current phase converges. Later corrective
experience changes both; ageing never refolds old event weights. Youth neither grants
agency nor turns forced movement into a voluntary authored expression. Constitution,
current phase, competence, belief, qualification history and weighted personality
remain independently represented and owned.

All36 native trajectories match their frozen component rows. All eight declared
probe seeds preserve different early probabilities with equal early sampled actions;
all eight full probe sequences differ (young A/A/A/A; mature A/A/B/B). Step/Ramp,
independent gain-disable controls, constant phase, eligibility, false/missing evidence,
physical-outcome, constitution and saturation controls remain. No comparator retired.
NoLearning/NoFormation disable developmental amplification, not baseline updating.

Thirteen registered stages admit developmental phase, route safe task context, derive
actual inherited reasons/decision/intent/expression, execute from prior competence,
admit independent report and update learning/qualification/formation. Sole writers
exclude foreign mutations; immutable constitution has none. Personality stores the
phase/gain at the contribution event. Original typed inputs are copied, model handles
are opaque, acquired S0 is empty and authenticated children preserve native lineage.

Actual Save132 restores from original inputs and checks whole-save equality, full
public snapshots, safe projections and one actual successor or terminal step at every
prefix. This is not a full-tail-from-every-prefix claim. The primary18-instant test
also matches every actual inherited decision bundle; the full matrix checks actual
RNG addresses against native trace draws with no reuse. Every reached native stage
and final commit has a Failed rollback test. Runtime and factory publication barriers
cover commit microtasks and reject overlapping calls without releasing the first.

The frozen public plan commits model/run/experiment/comparison identities and source
graphs. All36 model/run identities remain identical across harness revisions. REV1
completed4 full programs/94 prefix receipts; REV2 retained those checks and added19
unique restores. REV3 preserves all113, reexecutes their prefixes and requires identical
save/view/successor hashes; the remaining555 restores execute afresh. Original results
and their transitive provenance remain sealed. The same668 distinct prefixes are
counted once, without inflating the qualification by repeated checks.

Preserve both development test cohorts: all21 tests passed; first typecheck rejected
test-only direct assignment to a read-only event payload. Object.assign fixes that
fixture with unchanged production. Initial sandbox Vite denial ran no tests. Later
batch execution exposed unnecessary recursive final-trace refinement and repository
file-watching overhead. The audit-only reader uses structural canonical decoding for
the same address comparison; the four earlier fully refined trace hashes match again.
An idle-worker profile and the3.209-second no-watch probe preserve the startup finding.
Eight workers then hit V8 allocation failures with the1536MB operational heap cap.
Their receipts and available diagnostics are preserved; recovery uses four concurrent
4096MB workers. No behavioral assertion failed, and no low-memory or long-horizon
scaling claim follows. No public input validation, native transition, source identity
or restore check changed.

North Star transfer: younger learning and greater early personality-forming influence
are independently expressible through the public runtime. The admitted sources remain
controlled phase0..4, adopted exercise/report apparatus and matched training history;
training acquired feedback is held zero and probes consume the acquired personality.
This does not qualify calendar ageing, developmental physiology, all learning domains,
critical periods, non-authored life-event personality routes, or irreversible childhood
formation. Exact gain and bounded scalar formation laws remain research candidates.

Brief12.15-1 becomes QUALIFIED BOUNDED for this public profile. AuditREV84 records
112 bounded/20 partial/0 blocked across132 clauses,91 named verdicts. Corpus0.29.0
remains21 members; no whole LONGITUDINAL composition or Campaign3 exit. RO019 remains
ACTIVE and RO021 final historical reconciliation remains unsatisfied. RO008/009/010/
013/017/019/020/021 retain scope; RO022 is CLOSED for current54/57 publication inventory.
Next CAMPAIGN3_PARTIAL_COVERAGE_READINESS.md: audit the20 remaining PARTIAL clauses
against existing evidence before allocating new mechanisms. No owner ruling pending.
"""
(p/'CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md').write_text(qualification,encoding='utf-8')
summary="""VER-C3-DEVELOPMENT-PUBLIC-001 qualifies development-public/0.1-candidate:
7 models/36 public programs/668 actual Save132 prefixes,632 advancing/36 terminal;
8216 committed native stages;21 focused/328 reference tests/typecheck/build;1508/0.
Independent learning and event-time personality weighting retain exact component
trajectories, original eligibility and immutable constitution under13 native stages.
Step/Ramp/gain controls, all seeds, both test cohorts and all harness revisions preserved;113 earlier
restore receipts retained without double counting. Wrapper54/57; prior scopes intact.
Brief12.15-1 bounded; AuditREV84:112 bounded/20 partial/0 blocked;91 verdicts.
No universal gain/calendar-age claim. RO008/009/010/013/017/019/020/021/022.
Evidence CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md and DEVELOPMENT_PUBLIC_CLOSURE_REV1.json.
Next CAMPAIGN3_PARTIAL_COVERAGE_READINESS.md; no owner ruling; Campaign3 NOT EXIT-READY.
"""
with (p/'VERDICT_LEDGER.md').open('a',encoding='utf-8') as f:f.write('\n\n## `'+v+'` — native developmental learning and personality (2026-10-01)\n\nQUALIFIED NATIVE / LOCAL DISPOSITION.\n'+summary)
for f in [p/'SEAM_LEDGER.md',p/'REFERENCE_MECHANISM_LEDGER.md',Path('CharacterLab — Reference Architecture Build & Research Campaign Plan.md'),p/'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md']:
 with f.open('a',encoding='utf-8') as out:out.write('\n\n## Native development qualification / REV84 — 2026-10-01\n\n'+summary)
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8');pos=s.index('## Active direction')+len('## Active direction');s=s[:pos]+'\n\n**Current routing (2026-10-01):** '+summary+'\nEarlier harness routing below is historical; the native matrix is complete.\n'+s[pos:];s=s.replace('**Current routing (2026-10-01):** Native development implementation','**Prior routing (2026-10-01):** Native development implementation');a.write_text(s,encoding='utf-8')
old=(p/'CURRENT.md').read_bytes()
with (p/'CAMPAIGN3_LOG.md').open('ab') as f:f.write(b'\n\n'+old)
(p/'CURRENT.md').write_text("""# Current research entry point

**Updated2026-10-01. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Development NATIVE PUBLIC QUALIFIED — VER-C3-DEVELOPMENT-PUBLIC-001.**
Start CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md. Both owner-required effects now
execute under typed native sources, separate writers, actual scheduler phases,
Save132/original-input restore, reached faults and guarded publication. Component
trajectories and event-time eligibility/provenance remain unchanged.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1508** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 /RO-C3-022** |
| Corpus /named verdict entries | **0.29.0 -21 members /91 verdicts** |
| Brief clauses /families | **132 /15** |
| Brief clause dispositions | **112 bounded /20 partial /0 blocked** |
| Native qualification | **7 models /36 programs /668 prefix restores** |
| Successors / committed native stages | **632 advancing /36 terminal /8216 stages** |
| Focused / reference tests | **21 /328; typecheck/build pass** |
| Public wrapper inventory | **54 producers /57 factories; prior scopes preserved** |

DEVELOPMENT_PUBLIC_PLAN_REV3.json and DEVELOPMENT_PUBLIC_CHECK_REV3.json govern the
full matrix; DEVELOPMENT_PUBLIC_CLOSURE_REV1.json seals the qualification. Preserve
both test cohorts and all harness revisions.113 earlier actual restore receipts were
retained and reexecuted byte-identically; one successor per prefix, not full tails.
No seed discarded, comparator retired or psychological law selected.

**Next: CAMPAIGN3_PARTIAL_COVERAGE_READINESS.md.** Audit20 remaining PARTIAL clauses
against later existing evidence before new mechanisms. Begin interoceptive uncertainty
and tolerance/sensitization coverage. No automatic whole-campaign exit from zero BLOCKED
labels: partial clauses and final history still matter.

LOCAL DISPOSITION; no owner ruling. AuditREV84; counters1508/0. RO019 ACTIVE;
RO021 final history unsatisfied; RO022 CLOSED for current54/57 publication scope.
No calendar-age, clinical, universal-plasticity or full lifespan claim.
Campaign3 NOT EXIT-READY.
""",encoding='utf-8')
files=['DEVELOPMENT_PUBLIC_CHECK_REV3.json','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_PUBLIC_BUILD_REV1.json','DEVELOPMENT_WRAPPER_EXTENSION_REV1.json','DEVELOPMENT_PUBLIC_HARNESS_REV2_FINDING.json','DEVELOPMENT_PUBLIC_HARNESS_REV3_FINDING.json','development-public-dev1/MANIFEST.json','development-public-dev1/PREFLIGHT.json','development-public-dev2/MANIFEST.json','DEVELOPMENT_PUBLIC_WORKER_MEMORY_REV1.json','DEVELOPMENT_PUBLIC_WORKER_MEMORY_FAILURE_REV1.json','DEVELOPMENT_PUBLIC_MEMORY_STOP_OUTPUTS_REV1.json']
files.append('development-public-batch-rev1/STATUS.json')
closure={'status':'PASS','verdict':v,'scope':'Bounded native development two-effect integration; no general lifespan law','models':7,'programs':36,'prefixes':668,'advancing':632,'terminal':36,'nativeStages':8216,'counters':{'highestAllocated':1508,'sinceVerdict':0},'files':[{'path':str(p/f).replace('\\','/'),'sha256':sha(p/f)} for f in files]}
(p/'DEVELOPMENT_PUBLIC_CLOSURE_REV1.json').write_text(json.dumps(closure,indent=2)+'\n')
r=read(p/'RESEARCH_OBLIGATIONS.json');ids=[f'RO-C3-{n:03}' for n in [8,9,10,13,17,19,20,21,22]];r['verdictReviews'].append({'verdict':v,'obligations':ids})
for name in ['CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_PUBLIC_CHECK_REV3.json','DEVELOPMENT_PUBLIC_CLOSURE_REV1.json']:
 file='docs/planning/'+name;r['reportReviews'].append({'path':file,'obligations':ids})
 for o in r['obligations']:
  if o['id'] in ids:o['evidence'].append(file)
for o in r['obligations']:
 if o['id'] in ids:
  o['verdicts'].append(v);o['established']+=' VER-C3-DEVELOPMENT-PUBLIC-001 closes the bounded native two-effect developmental profile:7 models/36 programs/668 original-input Save132 prefixes,8216 native stages,21 focused/328 reference tests/build;1508/0. Exact component trajectories preserve independent learning, event-time personality weighting, original eligibility and mature correction. Full public source/authority/restore/fault/publication gate passes. All113 earlier restore receipts and harness findings preserved; no law selected.'
  o['unresolved']+=' Earlier development native-open wording is historical for this36-program profile. Calendar ageing, universal learning-domain rates, non-authored life-event personality pathways, critical periods and joint lifelong composition remain unqualified. No obligation is retired by this bounded native admission.'
(p/'RESEARCH_OBLIGATIONS.json').write_text(json.dumps(r,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
a=Path('scripts/check-campaign3-exit-audit.mjs');s=a.read_text();s=s.replace("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV83.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV84.json'").replace('result.snapshotRevision=83;','result.snapshotRevision=84;').replace('result.counters.allocatedSinceVerdict=16;','result.counters.allocatedSinceVerdict=0;')
s=s.replace("result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV82.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV82.json'),disposition:'Development component qualified; native gate open.1492/0;111 bounded/20 partial/1 blocked;90 verdicts.'};","result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV83.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV83.json'),disposition:'Native development implementation verified; full matrix open.1508/16;111 bounded/20 partial/1 blocked;90 verdicts.'};")
s=s.replace('Native development publication checked; full36-program matrix remains OPEN.','Native development publication and full36-program/668-prefix matrix qualified under VER-C3-DEVELOPMENT-PUBLIC-001.')
s=s.replace('const inventory=',"""{const c=families[14].clauses[0];c.status=Q;c.evidence.push(p+'CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md',p+'DEVELOPMENT_PUBLIC_CLOSURE_REV1.json');c.rationale='VER-C3-DEVELOPMENT-PUBLIC-001 qualifies independent developmental learning and event-time personality formation under typed public native ownership:7 models/36 programs/668 actual Save132 prefixes and8216 committed stages,21 focused/328 reference tests/build. Original eligibility, authorship, immutable constitution and mature correction remain separate. All component rows, declared seeds, Step/Ramp/gain controls and113 earlier restore receipts preserved. One successor per prefix, not full tails. Controlled phase0..4 and adopted sources do not qualify calendar ageing, universal rates, critical periods, non-authored personality pathways or whole lifelong composition.';c.obligations=[...new Set([...c.obligations,ro(22)])];}
families[14].rationale+=' REV84 closes the bounded native development clause; other partial longitudinal clauses and final history still prevent exit.';
supplemental.push('CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md','DEVELOPMENT_PUBLIC_CHECK_REV3.json','DEVELOPMENT_PUBLIC_CLOSURE_REV1.json','DEVELOPMENT_PUBLIC_HARNESS_REV2_FINDING.json','DEVELOPMENT_PUBLIC_HARNESS_REV3_FINDING.json','CAMPAIGN3_PARTIAL_COVERAGE_READINESS.md');
const inventory=""",1);a.write_text(s)
print('Native qualification recorded. Next generate/verify auditREV84 and run research/closure checks.')
