import fs from 'node:fs';import assert from 'node:assert/strict';
const p='docs/planning/',receipt=JSON.parse(fs.readFileSync(p+'WORK_VALIDATION_CLOSURE_REV1.json'));assert.equal(receipt.status,'PASS');
const registry=JSON.parse(fs.readFileSync(p+'RESEARCH_OBLIGATIONS.json'));assert(!registry.obligations.some(o=>o.id==='RO-C3-012'));
registry.scope='Seeded from Campaign 3 verdicts and qualification reports, extended through VER-C3-WORK-001. Not a completed audit of all historical or Campaign 0-2 limitations.';
registry.obligations.push({id:'RO-C3-012',title:'Workspace/control beyond retained-history reconstruction',status:'CONDITIONAL',distinction:'Retained availability versus maintained active access; maintenance/control versus stateless priority; retained intention versus expired goal',established:'VER-C3-WORK-001 qualifies the bounded PHEN-WORK-001 realization with 48 models,78 public runs,624 complete-prefix restores and continuation equalities. StoredSet and IndexedReplay have equal cognitive outputs; the latter derives active access without a cache. Overload, distractor-only displacement/protection, cue return, expiry, source safety and grounded choice are executable.',unresolved:'General maintenance/indexing law and efficiency, larger/changing pools, decaying history, new adoption or fulfillment, ordinary cue recognition, retrieval integration, inhibition under load, fatigue, rumination, strategy switching, performance monitoring, reappraisal and control costs remain unqualified.',verdicts:['VER-C3-WORK-001'],evidence:[p+'WORKSPACE_CONTROL_READINESS.md',p+'WORK_PUBLIC_EXPERIMENT_REV1.json',p+'WORK_DISTRACTOR_DESIGN_FINDING.md',p+'WORK_DISTRACTOR_PLAN_REV1.json',p+'WORK_DISTRACTOR_REV1.json',p+'WORK_VALIDATION_CLOSURE_REV1.json',p+'CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md','src/test/workPublic.test.ts','src/test/workBoundary.test.ts'],owner:'Workspace/control and prospective-access seam',reopenTrigger:'Any larger or changing source/lifecycle domain, history deletion, control-order change, alternate maintenance mechanism, claimed cache reduction beyond the tested domain, or newly required Brief12.6 phenomenon.',blocks:['Universal workspace/control qualification','Removing maintained access or all active-set caches from the architecture','Claiming inhibition, fatigue, strategy switching, monitoring or reappraisal from this bounded fixture'],doesNotBlock:'Completed bounded WORKSPACE/CONTROL, GA, BODY/MULTISOURCE, BELIEF and AFFECT; readiness for PHEN-SKILL-001.',closureRequirement:'When triggered, preserve separately traceable retained/active state and replay matched public discrimination tests, including genuine overload, exact single-factor interventions and expired-cue controls. Re-derive indexed access for any new lifecycle or missing-history case; do not silently reuse the fixed-deadline proof. WORK-DESIGN-001 requires isolating the manipulated factor.',closure:null});
registry.verdictReviews.push({verdict:'VER-C3-WORK-001',obligations:['RO-C3-012']});registry.reportReviews.push({path:p+'CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md',obligations:['RO-C3-012']});
fs.writeFileSync(p+'RESEARCH_OBLIGATIONS.json',JSON.stringify(registry,null,2)+'\n');
const current=fs.readFileSync(p+'CURRENT.md','utf8');fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before workspace/control closure — 2026-09-21\n\n'+current);
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated 2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded WORKSPACE/CONTROL is COMPLETE / QUALIFIED. No owner ruling is open.**
Start with [the qualification](CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md) and
[VER-C3-WORK-001](VERDICT_LEDGER.md). GA, BODY/MULTISOURCE, BELIEF and AFFECT stay complete.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **781** |
| Allocated since last verdict/corpus member | **0** (16 this increment) |
| Research obligations | **0 active / 12 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 18 verdicts** |
| Frozen WORK models / public runs | **48 / 78** |
| Whole-prefix restores / continuation equalities | **624 / 624** |
| Affected tests / preserved reference tests | **40 / 328** |

Retained intention, active selection and accessible reason remain distinct. Three
available items overload capacities one/two. Maintenance protects against distraction;
a later cue restores an inactive intention before expiry and cannot recreate it after.
StoredSet and IndexedReplay have exactly equal tested cognitive outputs: the separate
active-set cache is DERIVED in this finite retained-history domain. Maintained access
is RETAINED; stateless priority, unlimited access and immortal goals fail named controls.

WORK-DESIGN-001 preserves a confounded priority fixture and its matched single-field
correction. RO-C3-012 conditionally owns wider maintenance/history/lifecycle domains,
inhibition, fatigue, rumination, monitoring, strategy switching, reappraisal and costs.
Build, TypeScript, boundary and research checks pass. No full active-suite claim.
The624 continuation checks include546 next-instant and78 terminal no-op equalities.

**Next natural large frontier:** PHEN-SKILL-001 readiness: competence, believed
competence and temporary impairment. Begin with historical intake and contract gates.
That implementation has not started. Do not reopen completed bounded domains without
a named phenomenon or conditional trigger. Whole Campaign3 remains open.

Corpus digest unchanged:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
let agents=fs.readFileSync('AGENTS.md','utf8'),a=agents.indexOf('Campaign 3 is active: start at'),b=agents.indexOf('`GENERAL_ATTENTION_RESUME_BRIEF.md`',a);assert(a>=0&&b>a);
agents=agents.slice(0,a)+`Campaign 3 is active: start at docs/planning/CURRENT.md and
CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md in that directory. Bounded
WORKSPACE/CONTROL is COMPLETE: VER-C3-WORK-001,48 frozen models,78 public runs,
624 whole-prefix restores and continuation equalities; counters781/0. GA,
BODY/MULTISOURCE, BELIEF and AFFECT stay complete. RO-C3-012 preserves broader
workspace/control and history/lifecycle limits; RO-C3-010/011 preserve belief/affect
limits. ORD-001 and ORD-005 are not closed. No owner ruling is pending. The next
natural frontier is PHEN-SKILL-001 readiness, beginning with phenomenon and historical
intake before contract acceptance. Do not automatically reopen completed bounded
domains or implement from an external review alone.
`+agents.slice(b);fs.writeFileSync('AGENTS.md',agents);
let seams=fs.readFileSync(p+'SEAM_LEDGER.md','utf8'),h=seams.indexOf('## Historical checkpoint summaries');assert(h>0);
seams=`# Seam Ledger

**Current routing, 2026-09-21:** [state index](CURRENT.md), [workspace/control qualification](CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md), and [verdict ledger](VERDICT_LEDGER.md). Corpus0.29.0 has21 members; bounded GA, public multisource, BELIEF, AFFECT and WORKSPACE/CONTROL are complete; zero owner rulings. Counters781/0. Research obligations:0 active/12 conditional/0 unowned.

Maintained access is retained; the independent active-set cache is derivable from the
bounded safe journal under VER-C3-WORK-001. RO-C3-012 preserves wider control and
source/lifecycle claims. PHEN-SKILL-001 readiness is next; implementation not started.

`+seams.slice(h);
const row='| Retained source/intention → maintained workspace → grounded choice | workspace-control/0.1-candidate; VER-C3-WORK-001 | [Qualified bounded PHEN-WORK-001](CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md):48 models,78 runs,624 prefix restores; overload, displacement/protection, cue and expiry; StoredSet/IndexedReplay equivalence | RO-C3-012 retains wider control, history, lifecycle, ordinary reminder recognition, costs and integration. |\n';
seams=seams.replace('| Workspace → appraisal → transient concern |',row+'| Workspace → appraisal → transient concern |');fs.writeFileSync(p+'SEAM_LEDGER.md',seams);
const campaign='CharacterLab — Reference Architecture Build & Research Campaign Plan.md';let cp=fs.readFileSync(campaign,'utf8');const from=cp.indexOf('are traversable; general affect/control/feedback laws remain conditional. The next'),to=cp.indexOf('Whole Campaign3 PASS remains unavailable',from);assert(from>=0&&to>from);
cp=cp.slice(0,from)+`are traversable; general affect/control/feedback laws remain conditional.
Bounded WORKSPACE/CONTROL is now complete under VER-C3-WORK-001:48 models,78 public
runs and624 complete-prefix restores/continuation equalities. See
docs/planning/CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md. Maintained access,
distraction/protection and cue/expiry are traversable; the active-set cache is derived
from retained safe history in this domain. RO-C3-012 conditionally preserves wider
control and history/lifecycle limits. Next natural frontier: PHEN-SKILL-001 readiness,
beginning with its phenomenon and historical-mechanism intake. These bounded closures
do not qualify the full Brief12.6 family or the whole campaign.

`+cp.slice(to);fs.writeFileSync(campaign,cp);
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## 2026-09-21 — bounded WORKSPACE/CONTROL disposition

VER-C3-WORK-001 and WORKSPACE_CONTROL_READINESS.md record the intake. MEC-011/
EXP-004 availability versus access and MEC-020/EXP-013 lifecycle distinctions are
RETAINED by public overload/distraction/cue/expiry contrasts. MEC-012..016 inherited
grounds/dice/arbitration execute downstream; C has no motive authority. P3-011 strict
later delivery and full-prefix replay are preserved. MEC-005/007/009/010 remain
separate attention/memory mechanisms, not silently replaced by the controlled board.
StoredSet versus IndexedReplay earns DERIVED for a separate active-set cache only
under the fixed-deadline, fully retained safe-history domain. RO-C3-012 carries broader
control, lifecycle, history and integration obligations. WORK-DESIGN-001 preserves
the confounded priority fixture and its exact one-field counterfactual correction.
Transfer: retained information, maintained selection and permission to supply a reason
remain separate even when active-set representation can be reconstructed.
`);
console.log('Recorded VER-C3-WORK-001; counters781/0; obligations0/12/0.');
