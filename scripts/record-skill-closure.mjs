import fs from 'node:fs';import assert from 'node:assert/strict';
const p='docs/planning/',receipt=JSON.parse(fs.readFileSync(p+'SKILL_VALIDATION_CLOSURE_REV1.json'));assert.equal(receipt.status,'PASS');
const registry=JSON.parse(fs.readFileSync(p+'RESEARCH_OBLIGATIONS.json'));assert(!registry.obligations.some(o=>o.id==='RO-C3-013'));
registry.scope='Seeded from Campaign 3 verdicts and qualification reports, extended through VER-C3-SKILL-001. Not a completed audit of all historical or Campaign 0-2 limitations.';
registry.obligations.push({id:'RO-C3-013',title:'Procedural skill beyond the controlled single exercise',status:'CONDITIONAL',distinction:'Actual competence, observed performance belief, temporary impairment, intention and outcome; truth-side practice versus character-side evidence',established:'VER-C3-SKILL-001 qualifies bounded PHEN-SKILL-001 with27 frozen models,52 public runs,279 complete-prefix restores/continuation equalities. Actual skill and impairment change execution with equal intent/expression; practice can improve competence without observed feedback; false feedback changes performance belief without competence; recovery preserves retained skill.',unresolved:'General practice/impairment and competence representation laws, multiple procedures, rust, transfer, automaticity, precision/error distributions, execution noise, ordinary recognition, attribution/source quality, latent competence inference, separately composed outcome prediction, confidence-sensitive choice and body/control/workspace integration remain unqualified.',verdicts:['VER-C3-SKILL-001'],evidence:[p+'SKILL_READINESS.md',p+'SKILL_IMPLEMENTATION_FINDINGS.md',p+'SKILL_PUBLIC_TESTS_REV1.json',p+'SKILL_PUBLIC_TESTS_REV2.json',p+'SKILL_PUBLIC_EXPERIMENT_REV1.json',p+'SKILL_VALIDATION_CLOSURE_REV1.json',p+'CAMPAIGN3_SKILL_QUALIFICATION.md','src/test/skillPublic.test.ts','src/test/skillBoundary.test.ts'],owner:'Procedural adaptation, execution and capability-belief seams',reopenTrigger:'A new skill/practice/impairment domain, another learning law, richer performance attribution or capability inference, confidence-sensitive choice, proposed skill/memory/habit reduction or new body/control/workspace integration.',blocks:['Universal SKILL or Brief12.8 qualification','Treating empirical performance expectation as identified latent competence or calibrated confidence','Reducing procedural adaptation to observation-based belief updates'],doesNotBlock:'Completed bounded SKILL, WORKSPACE/CONTROL, AFFECT, BELIEF, BODY/MULTISOURCE and GA; PHEN-SOCIAL-001 readiness.',closureRequirement:'On a trigger, accept the new source/contract and run matched public controls retaining exact intent/expression equality under hidden physical changes, separate actual/observed performance, lawful practice without feedback, impairment-only recovery without practice, and separate mutation authorities. Preserve serious learning/impairment alternatives and explicitly test any new competence-belief/outcome-prediction distinction.',closure:null});
registry.verdictReviews.push({verdict:'VER-C3-SKILL-001',obligations:['RO-C3-013']});registry.reportReviews.push({path:p+'CAMPAIGN3_SKILL_QUALIFICATION.md',obligations:['RO-C3-013']});fs.writeFileSync(p+'RESEARCH_OBLIGATIONS.json',JSON.stringify(registry,null,2)+'\n');
const prior=fs.readFileSync(p+'CURRENT.md','utf8');fs.appendFileSync(p+'CAMPAIGN3_LOG.md','\n\n## Archived CURRENT before SKILL closure — 2026-09-21\n\n'+prior);
fs.writeFileSync(p+'CURRENT.md',`# Current research entry point

**Updated 2026-09-21. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Bounded SKILL is COMPLETE / QUALIFIED. No owner ruling is open.**
Start with [the qualification](CAMPAIGN3_SKILL_QUALIFICATION.md) and
[VER-C3-SKILL-001](VERDICT_LEDGER.md). Earlier bounded Campaign3 domains stay complete.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **802** |
| Allocated since last verdict/corpus member | **0** (21 this increment) |
| Research obligations | **0 active / 13 conditional / 0 unowned** |
| Corpus / named verdict entries | **0.29.0 — 21 members / 19 verdicts** |
| Frozen SKILL models / public runs | **27 / 52** |
| Whole-prefix restores / continuation equalities | **279 / 279** |
| Affected tests / preserved reference tests | **60 / 328** |

Actual competence and temporary impairment change execution while intent/expression
remain fixed. Practice can change competence without feedback; misleading reports
can change self-belief without competence. Impairment-only recovery preserves exact
retained skill. Procedural adaptation and epistemic learning have separate owners.

Linear/residual practice, multiplicative/additive impairment and evidence-learning
comparators remain distinct. RO-C3-013 conditionally owns broader laws, latent
competence inference, rust, transfer, automaticity, confidence-sensitive choice and
body/control/workspace integration. The belief estimates observed performance in one
exercise; the adopted instruction fixes a sole Auto choice. Neither is universal.

SKILL-IMPL-001 preserves and corrects initial arbitration API misuse. Build,
TypeScript, boundary and research checks pass. No full active-suite claim. The279
continuation checks include227 next-instant and52 terminal no-op equalities.

**Next natural large frontier:** PHEN-SOCIAL-001 readiness—independent observers,
misleading evidence and correction. Start with historical intake and contract gates.
That implementation has not started. Whole Campaign3 remains open; do not reopen
completed bounded domains without a named phenomenon or conditional trigger.

Corpus digest unchanged:
5dc8a6f23afe0c75b4b7d9fd0bf93c65f67bd4892ec7ec0e9e4d85d3a05a172d.
`);
let agents=fs.readFileSync('AGENTS.md','utf8'),start=agents.indexOf('Campaign 3 is active: start at'),end=agents.indexOf('`GENERAL_ATTENTION_RESUME_BRIEF.md`',start);assert(start>=0&&end>start);
agents=agents.slice(0,start)+`Campaign 3 is active: start at docs/planning/CURRENT.md and
CAMPAIGN3_SKILL_QUALIFICATION.md in that directory. Bounded SKILL is COMPLETE:
VER-C3-SKILL-001,27 frozen models,52 public runs,279 whole-prefix restores and
continuation equalities; counters802/0. GA, BODY/MULTISOURCE, BELIEF, AFFECT and
WORKSPACE/CONTROL stay complete. RO-C3-013 preserves broader skill, feedback,
inference and integration limits; RO-C3-010/011/012 retain their prior scopes.
ORD-001 and ORD-005 remain open outside these profiles. No owner ruling is pending.
The next natural frontier is PHEN-SOCIAL-001 readiness, beginning with phenomenon
and historical intake before contract acceptance. Do not automatically reopen
completed bounded domains or implement from an external review alone.
`+agents.slice(end);fs.writeFileSync('AGENTS.md',agents);
let seams=fs.readFileSync(p+'SEAM_LEDGER.md','utf8');const h=seams.indexOf('## Historical checkpoint summaries');assert(h>0);
seams=`# Seam Ledger

**Current routing, 2026-09-21:** [state index](CURRENT.md), [SKILL qualification](CAMPAIGN3_SKILL_QUALIFICATION.md), and [verdict ledger](VERDICT_LEDGER.md). Corpus0.29.0 has21 members. Bounded SKILL and prior Campaign3 domains are complete; zero owner rulings. Counters802/0. Research obligations:0 active/13 conditional/0 unowned.

Actual competence, observed performance belief and temporary impairment remain
separate under VER-C3-SKILL-001. RO-C3-013 preserves wider skill and integration
claims. PHEN-SOCIAL-001 readiness is next; implementation not started.

`+seams.slice(h);const marker='| Retained source/intention → maintained workspace → grounded choice |';assert(seams.includes(marker));seams=seams.replace(marker,'| Practice → actual skill → execution; observed performance → belief | skill-public/0.1-candidate; VER-C3-SKILL-001 | [Qualified bounded PHEN-SKILL-001](CAMPAIGN3_SKILL_QUALIFICATION.md):27 models,52 runs,279 prefix restores; fixed intent/different execution, false self-belief, unobserved practice and impairment recovery | RO-C3-013 retains broader laws, competence inference, rust, transfer, automaticity, choice and integration. |\n'+marker);fs.writeFileSync(p+'SEAM_LEDGER.md',seams);
const campaign='CharacterLab — Reference Architecture Build & Research Campaign Plan.md';let cp=fs.readFileSync(campaign,'utf8');const a=cp.indexOf('control and history/lifecycle limits. Next natural frontier: PHEN-SKILL-001 readiness,'),b=cp.indexOf('Whole Campaign3 PASS remains unavailable',a);assert(a>=0&&b>a);
cp=cp.slice(0,a)+`control and history/lifecycle limits.
Bounded SKILL is complete under VER-C3-SKILL-001:27 models,52 public runs and279
complete-prefix restores/continuation equalities. See
docs/planning/CAMPAIGN3_SKILL_QUALIFICATION.md. Actual competence, observed performance
belief, temporary impairment and intent/outcome are separately testable. Procedural
practice and epistemic learning have separate sources and owners. RO-C3-013 preserves
broader laws, rust, transfer, automaticity, competence inference and integration.
Next natural frontier: PHEN-SOCIAL-001 readiness and historical intake. These bounded
closures do not qualify whole Brief12.6/12.8 families or the whole campaign.

`+cp.slice(b);fs.writeFileSync(campaign,cp);
fs.appendFileSync(p+'REFERENCE_MECHANISM_LEDGER.md',`\n\n## 2026-09-21 — bounded SKILL disposition

SKILL_READINESS.md and VER-C3-SKILL-001 preserve MEC-019 intent/attempt/outcome;
P3-009 competence/belief/identity separation; MEC-001/002/006 and P3-001/002/003
observed opportunity and update controls; MEC-012..017 genuine reason/frozen-expression
boundaries; P3-011 strictly later updates. MEC-018 identity controls and existing
Campaign2 ADAPT ownership remain preserved and tested. No historical import or
skill-to-habit/memory reduction. Linear/residual practice and multiplicative/additive
impairment remain candidates. RO-C3-013 owns wider skill and capability-inference debt.
SKILL-IMPL-001 preserves the initial arbitration API failure and correction. Transfer:
practice may change what the character can do without changing what they believe;
observations may change that belief without changing actual competence.
`);
console.log('Recorded bounded SKILL; counters802/0; obligations0/13/0.');
