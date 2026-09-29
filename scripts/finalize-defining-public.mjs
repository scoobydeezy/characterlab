// Closure bookkeeping for VER-C3-DEFINING-PUBLIC-001 (Node port of the earlier finalize-*.py pattern).
import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const p='docs/planning/',verdict='VER-C3-DEFINING-PUBLIC-001';
const refs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-009','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021','RO-C3-022'];
const read=f=>fs.readFileSync(f,'utf8');
const crlf=s=>s.includes('\r\n');
// Whole-file rewrites keep the file's own line endings; appends follow the earlier LF appends.
const rewrite=(f,s)=>fs.writeFileSync(f,crlf(read(f))?s.replace(/\r?\n/g,'\r\n'):s);
const append=(f,s)=>fs.appendFileSync(f,s);
const lf=s=>s.replace(/\r\n/g,'\n');

const closure=JSON.parse(read(p+'DEFINING_PUBLIC_CLOSURE_REV1.json'));assert.equal(closure.status,'PASS');assert.equal(closure.verdict,verdict);
assert(!read(p+'VERDICT_LEDGER.md').includes(verdict),'Verdict already recorded');

const summary='68 public programs/68 models/1680 restored prefixes (1612 advancing/68 terminal);376 exact native stages;8 diagnostic observer pairs;17 focused/328 reference tests/build;1492/0. Empty-S0 acquired history, goal-relative meaning, rehearsal, retention and final recall survive typed public admission, actual Save132 and original-input restore under four retention laws. Brief12.3-2 bounded.';
const limits='Restore checks one actual successor per prefix, not every full tail. Carried cue, empty graph, scheduled current baseline, diagnostic worldAfter, fixed zero32 seed and sparse idle horizons remain bounded controls. No law selection, comparator retirement, autobiographical identity, source trust or general consolidation.';

// Research obligations.
const oblPath=p+'RESEARCH_OBLIGATIONS.json',r=JSON.parse(lf(read(oblPath)));
assert(!r.verdictReviews.some(v=>v.verdict===verdict));r.verdictReviews.push({verdict,obligations:refs});
const reports=['CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md','DEFINING_PUBLIC_MATRIX_CHECK_REV1.json','DEFINING_PUBLIC_IDENTITIES_REV1.json','DEFINING_PUBLIC_CLOSURE_REV1.json'];
for(const n of reports){const path=p+n;assert(!r.reportReviews.some(x=>x.path===path),path);r.reportReviews.push({path,obligations:refs});}
for(const o of r.obligations)if(refs.includes(o.id)){
 o.verdicts.push(verdict);o.evidence.push(...reports.map(n=>p+n));
 o.established+=' '+verdict+' closes the full defining public matrix: '+summary;
 o.unresolved+=' '+limits+(o.id==='RO-C3-022'?' The1680-prefix matrix has now passed; this inventory stays closed and reopens on another wrapper change.':'')+(['RO-C3-019','RO-C3-021'].includes(o.id)?' AuditREV79:111 bounded/20 partial/1 blocked; Campaign3 NOT EXIT-READY.':'');
}
rewrite(oblPath,JSON.stringify(r,null,2)+'\n');

// Ledgers and plan.
append(p+'VERDICT_LEDGER.md','\n\n## `'+verdict+'` — defining memory: native public qualification (2026-09-29)\n\nBOUNDED NATIVE PUBLIC QUALIFIED / LOCAL DISPOSITION, defining-public/0.1-candidate.\n'+summary+'\n'+limits+' Preserve test-only Node typing rejection. RO005/006/007/009/010/019/020/021/022. Evidence CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md and DEFINING_PUBLIC_CLOSURE_REV1.json. Next DEVELOPMENT_COVERAGE_READINESS.md; no owner ruling.\n');
for(const name of ['SEAM_LEDGER.md','REFERENCE_MECHANISM_LEDGER.md'])append(p+name,'\n\n### Defining memory: native public qualification — 2026-09-29\n'+verdict+': '+summary+'\nRetain SignificanceFirst/SharedProtection/UseOnly/AgeOnly, historical content/credit, current judgment, retention, access and publication as separate owners. Wrapper53/56; no law retirement. See CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md and DEFINING_PUBLIC_FINDINGS.md.\n');
append('CharacterLab — Reference Architecture Build & Research Campaign Plan.md','\n\n### 2026-09-29 — defining memory native public qualification\n'+summary+' Next docs/planning/DEVELOPMENT_COVERAGE_READINESS.md under the escalation policy; no owner ruling or Campaign3 exit.\n');

// CURRENT.md is replaced; the prior index is preserved in the log.
append(p+'CAMPAIGN3_LOG.md','\n\n## Preserved index while full defining public matrix ran, 2026-09-28\n\n'+lf(read(p+'CURRENT.md')));
rewrite(p+'CURRENT.md',`# Current research entry point

**Updated 2026-09-29. Replace this index; chronology belongs in CAMPAIGN3_LOG.md.**

**Defining memory NATIVE PUBLIC QUALIFIED — VER-C3-DEFINING-PUBLIC-001.**
LOCAL DISPOSITION. Start CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md and
DEFINING_PUBLIC_CLOSURE_REV1.json; defining-public/0.1-candidate. No owner ruling pending.

| Counter | Value |
|---|---|
| Highest permanently allocated record type | **1492** |
| Allocated since last verdict/corpus member | **0** |
| Research obligations | **1 active / 19 conditional / 0 unowned** |
| Closed obligations | **2: RO-C3-018 /RO-C3-022** |
| Corpus /named verdict entries | **0.29.0 -21 members /89 verdicts** |
| Brief clauses /families | **132 /15** |
| Brief clause dispositions | **111 bounded /20 partial /1 blocked** |
| Public matrix | **68 programs /68 models /1680 restored prefixes** |
| Successor checks | **1612 advancing /68 terminal; 376 exact native stages** |
| Validation | **17 focused/328 reference tests; typecheck/build (receipts reverified)** |
| Native wrapper inventory | **53 producers /56 factories; prior scopes preserved** |

Every S0/settled prefix of all68 selected programs restores from original inputs
with exact Save132 and observer bytes, then one actual successor or terminal
exhaustion. No FAILURE record; zero production change. Eight diagnostic worldAfter
pairs keep whole observer projections equal. Brief12.3-2 (old but defining memory)
advances from BLOCKED to bounded. The workers finished after the executing session
lost context; the closing check and identity receipts were run afterwards on the
untouched write-once receipts.

Next DEVELOPMENT_COVERAGE_READINESS.md: audit existing evidence for a bounded
developmental witness before any allocation. Carried cue, empty graph, scheduled
baseline, diagnostic worldAfter and one-successor-per-prefix limits remain.
RO019 ACTIVE; RO021 final history unsatisfied; RO022 CLOSED for current inventory,
reopens on another wrapper change. AuditREV79; Campaign3 NOT EXIT-READY.
`);

// AGENTS.md routing.
{const f='AGENTS.md';let s=read(f);const nl=crlf(s)?'\r\n':'\n';
 const old='**Current routing (2026-09-28):** defining public implementation';assert(s.includes(old));
 s=s.replace(old,'**Prior routing (2026-09-28):** defining public implementation');
 const head='## Active direction'+nl;assert(s.includes(head));
 s=s.replace(head,head+nl+`**Current routing (2026-09-29):** defining memory NATIVE PUBLIC QUALIFIED:
VER-C3-DEFINING-PUBLIC-001. Start CURRENT.md and CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md.
68 public programs/68 models/1680 restored prefixes;1612 advancing/68 terminal
successors;376 exact native stages;17 focused/328 reference tests/build.1492/0.
Brief12.3-2 bounded. One successor per prefix, not full tails; carried cue, empty
graph, scheduled baseline and diagnostic worldAfter remain controls. No law selected
or comparator retired. Wrapper53/56. AuditREV79:111/20/1;89 verdicts. Next
DEVELOPMENT_COVERAGE_READINESS.md; no owner ruling. Campaign3 NOT EXIT-READY.
`.replace(/\n/g,nl));
 fs.writeFileSync(f,s);}

// Exit audit report and checker.
append(p+'CAMPAIGN3_EXIT_AUDIT_2026_09_21.md','\n\n## REV79 - defining memory native public qualification\n'+verdict+': '+summary+' Clause promoted from BLOCKED; family remains partial.111 bounded/20 partial/1 blocked;89 verdicts. '+limits+'\n');
{const f='scripts/check-campaign3-exit-audit.mjs',archive='scripts/check-campaign3-exit-audit-rev78.mjs';assert(!fs.existsSync(archive));fs.copyFileSync(f,archive);
 let s=read(f);const nl=crlf(s)?'\r\n':'\n';
 const sub=(a,b)=>{assert(s.includes(a),a);s=s.replace(a,b);};
 sub("const output=p+'CAMPAIGN3_EXIT_AUDIT_REV78.json'","const output=p+'CAMPAIGN3_EXIT_AUDIT_REV79.json'");
 sub('result.snapshotRevision=78;','result.snapshotRevision=79;');
 sub("result.date='2026-09-28';","result.date='2026-09-29';");
 sub('result.counters.allocatedSinceVerdict=8;','result.counters.allocatedSinceVerdict=0;');
 sub('Full defining public prefix matrix remains OPEN; reopen on new wrapper ownership.','Full defining public matrix passes under VER-C3-DEFINING-PUBLIC-001; reopen on new wrapper ownership.');
 sub('const inventory=',[
  '// REV79: full defining public matrix closes Brief12.3-2 in bounded scope.',
  "{const clause=families[2].clauses[1];clause.status=Q;clause.evidence.push(p+'CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md',p+'DEFINING_PUBLIC_CLOSURE_REV1.json');clause.rationale='VER-C3-DEFINING-PUBLIC-001: an old event acquired from empty S0 stays defining through goal-relative significance and actual use, while original content, historical credit, later judgment, retention and publication stay separate.68 public programs/1680 restored prefixes, exact Save132/observer bytes and one actual successor each;376 exact native stages. SignificanceFirst/SharedProtection/UseOnly/AgeOnly all retained. Carried cue, empty graph, scheduled baseline, diagnostic worldAfter and sparse idle horizons are bounded controls; no autobiographical identity, general consolidation or ageing law.';clause.obligations=[...new Set([...clause.obligations,ro(10),ro(21),ro(22)])];}",
  "families[2].rationale+=' REV79: VER-C3-DEFINING-PUBLIC-001 closes native public defining memory and promotes clause2 to bounded. Identity recognition, affect bias and broader consumers keep their earlier dispositions.';",
  "supplemental.push('CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md','DEFINING_PUBLIC_FINDINGS.md','DEFINING_PUBLIC_MATRIX_CHECK_REV1.json','DEFINING_PUBLIC_IDENTITIES_REV1.json','DEFINING_PUBLIC_CLOSURE_REV1.json','defining-public-matrix-rev1/MANIFEST.json','DEVELOPMENT_COVERAGE_READINESS.md');",
  'const inventory='].join(nl));
 const a=s.indexOf('result.predecessor='),b=s.indexOf(nl,a);
 s=s.slice(0,a)+"result.predecessor={path:p+'CAMPAIGN3_EXIT_AUDIT_REV78.json',sha256:sha(p+'CAMPAIGN3_EXIT_AUDIT_REV78.json'),disposition:'VER-C3-DEFINING-PUBLIC-001:68 public programs/1680 restored prefixes/376 native stages;17+328 tests/build;1492/0. Brief12.3-2 BLOCKED to bounded;111 bounded/20 partial/1 blocked;89 verdicts.'};"+s.slice(b);
 fs.writeFileSync(f,s);}

const npm=process.platform==='win32'?'npm.cmd':'npm';
execFileSync(process.execPath,['scripts/check-campaign3-exit-audit.mjs','--write'],{stdio:'inherit'});
execFileSync(npm,['run','check:research','--','--self-test'],{stdio:'inherit',shell:process.platform==='win32'});
