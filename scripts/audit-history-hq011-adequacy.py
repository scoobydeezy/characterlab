"""Audit the real historical gate; missing source adequacy must fail handoff."""
from pathlib import Path
from functools import cache
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-hq011-adequacy-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ref(p):return dict(path=Path(p).as_posix(),sha256=sha(p))
def walk(v):
    if isinstance(v,dict):
        if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield v
        for x in v.values():yield from walk(x)
    elif isinstance(v,list):
        for x in v:yield from walk(x)
def save(p,v):
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
mp=P/'campaign3-history-universe-rev1/manifest.json';manifest=load(mp)
ip=P/'campaign3-history-source-roles-rev315/index.json';index=load(ip)
roles={r['path']:r for r in index['roleAssignments']}
assert len(roles)==len(index['roleAssignments'])==len(manifest['entries'])==11373
assert set(roles)=={e['path'] for e in manifest['entries']}
assert not index['unassignedCandidatePaths'] and not manifest['registryUsedForSelection']
for e in manifest['entries']:
    # Markdown uses frozen mirrors; StructuredJSON commits its original named path.
    assert roles[e['path']]['sha256']==e['sha256']==sha(e.get('snapshot',e['path'])),e['path']
bindings=[]
for role in roles.values():
    assert role['role'] and (role.get('scope') or role.get('judgment')) and role.get('evidence'),role['path']
    bindings.extend(walk({k:v for k,v in role.items() if k not in ['path','sha256']}))
bindings.extend(walk(index['explicitBackingOutsideProseManifest']))
for b in bindings:assert sha(b['path'])==b['sha256'],b['path']
assert sha(P/'campaign3-history-universe-rev1/units.jsonl')=='801a6394dfc899f603278bf5d603c51aaf7ddb1930076e2cbe02ddec3b778e2e'
assert index['originalNarrativeOrFindingOccurrences']+index['originalBackingFieldOccurrences']==413894
gp=P/'campaign3-history-gap-consequences-rev1/review.json';g=load(gp)
assert len(g['groups'])==208 and len(g['noHashReferences'])==5
assert g['subsetCorrection']['correctRemainingExitPairs']==74
roots=P/'campaign3-history-root-accounting-rev1/review.json';rootreview=load(roots)
assert len(rootreview['bindings'])==4739
for b in rootreview['reports']:assert sha(b['path'])==b['sha256']
post=P/'campaign3-history-post-cutoff-join-rev1/review.json';postreview=load(post)
for b in postreview['inputs']:assert sha(b['path'])==b['sha256']
requirements=[
dict(id='HG1-CENSUS',requirement='Enumerable deterministic candidate universe selected independently of RO status.',result='SATISFIED FOR FROZEN CENSUS',evidence=[ref(mp),ref(ip)],reason='11373 exact source hashes and role paths revalidated. Candidate selection is not equivalent to acceptance of every embedded historical claim.'),
dict(id='HG1-AUTHORITY',requirement='Explicit authority/acceptance/supersession with unresolved references accounted.',result='SCOPED ROLES COMPLETE; HISTORICAL DEPENDENCY ADEQUACY OPEN',evidence=[ref(ip),ref(gp)],reason='Every frozen source has an evidence-backed role.208 unavailable historical versions have explicit restrictions. Missing contents are not accepted or proven immaterial by those restrictions.'),
dict(id='HG2-OCCURRENCES',requirement='Exact marked and unmarked occurrences, independently extracted; short JSON/schema boundary considered.',result='DECLARED EXTRACTION AND CONTENT ROLES VERIFIED',evidence=[ref(P/'campaign3-history-hq011-rev1/review.json'),ref(ip),ref(roots)],reason='Original413894-unit extraction remains byte-identical; prior independent reconstruction and explicit schema/content reviews address lexical limits.4739 root/navigation links are retained; this is not a claim that413894 units are material findings.'),
dict(id='HG3-DISPOSITIONS',requirement='Material unresolved distinctions owned with blocked claims/reopen conditions; no reduction by metadata.',result='REVIEWED AVAILABLE MATERIAL ACCOUNTED; MISSING-CONTENT COMPLETENESS UNPROVEN',evidence=[ref(gp),ref(P/'campaign3-history-chronology-consolidated-rev1/review.json'),ref(post)],reason='Original chronology, failure cohorts, candidate equalities and scoped reductions retain dispositions. Unavailable historical narrative content, especially the named legacy companion log, has no recovered content inventory or independent proof of material supersession.'),
dict(id='HG4-INTEGRITY',requirement='Fail missing/changed required artifacts, omitted IDs, orphan dispositions and unsupported source substitutions.',result='AVAILABLE ARTIFACT INTEGRITY VERIFIED; GAPS PREVENT UNQUALIFIED PASS',evidence=[ref(ip),ref(gp)],reason='All11373 frozen source bodies and indexed role/backing bindings validate. Required missing-version dependencies remain explicit rather than silently replaced. A preserved reference is not preserved referenced content.'),
dict(id='HG4-ADDITIONS',requirement='Reconcile named post-cutoff formula/Values/verdict additions and subsequent audit findings.',result='NAMED ADDITIONS JOINED; FINAL FRESHNESS REMAINS',evidence=[ref(post),ref(gp),ref(P/'campaign3-history-recovered-content-rev1/review.json')],reason='343 formula paragraphs,90 Values paragraphs,94036 backing strings and exact106-to108 ledger delta are joined. Correct-forward73-to74 subset finding preserved. This is not automatic inclusion of every generated audit document or final HQ012 freshness.'),
dict(id='HG4-SCIENTIFIC',requirement='Independently establish universe and scientific adequacy before zero unreconciled material findings.',result='NOT DEMONSTRATED',evidence=[ref(gp),ref(P/'campaign3-history-hq009-rev1/review.json')],reason='Available evidence cannot establish the contents or material supersession of the missing legacy log and all relevant unavailable historical narratives. Later passing results and complete role counts do not prove no findings were lost. No broad historical completeness claim is accepted.'),
dict(id='HG5-COVERAGE',requirement='Keep historical accounting separate from21-member corpus/15-family/native acceptance.',result='SEPARATION PRESERVED; HQ012 NOT STARTED',evidence=[ref(P/'CAMPAIGN3_FINAL_HISTORY_GATE.md'),ref(P/'HISTORY_AUTHORITY_RECONCILIATION_READINESS.md')],reason='No corpus member, family, model, law or runtime acceptance is promoted by this audit. Stronger Values cases2/3/autonomous7 remain unexecuted; conditional debt is not coverage.'),
dict(id='GOAL-HANDOFF',requirement='Hand off to HQ012 only after authority and source adequacy demonstrated.',result='WITHHELD',evidence=[ref(gp)],reason='Necessary source adequacy is not established. Original objective remains open; no replacement with a smaller available-files-only success criterion.')]
O.mkdir(exist_ok=True)
save(O/'development.json',dict(status='AUDIT SCHEMA ASSUMPTIONS CORRECTED; ORIGINAL SOURCES UNCHANGED',findings=['First invocation assumed snapshot on every census entry and raised KeyError before outputs. All1063 Markdown entries use mirrors;10310 StructuredJSON entries commit named paths. Corrected checker follows actual manifest schema.','Second invocation verified all11373 source hashes, then rejected BIOLOGY_PUBLIC_COMPARISON_REV1.json because it expected scope on every role. Ten reviewed role records use judgment instead; eight also carry schemaEvidence and two canonicalEvidence. Corrected checker requires a nonempty rationale in either documented field and verifies every nested role evidence binding.'],obligations=['RO-C3-020','RO-C3-021']))
save(O/'review.json',dict(status='HQ011 COMPLETION NOT PROVEN; HQ012 HANDOFF WITHHELD',checker=ref(__file__),authority=[ref(P/'CAMPAIGN3_FINAL_HISTORY_GATE.md'),ref(P/'HISTORY_AUTHORITY_RECONCILIATION_READINESS.md')],requirements=requirements,integrity=dict(frozenSourceHashes=11373,roleAndBackingBindings=len(bindings),originalOccurrences=413894,rootNavigationOccurrenceLinks=4739,outsideBackingResources=2825,unresolvedKnownHashTargets=208,unresolvedExitInventoryVersions=74),externalEvidenceNeeded=dict(subject='Missing legacy companion log and unavailable historical narrative provenance',namedSource='claude/characterlab-research-log.md',requested='An archive/backup/earlier location or authenticated source/supersession evidence that permits its material findings to be reconciled. A similarly named later log or blanket permission to ignore unknown findings is not equivalent evidence.',searches=[ref(P/'campaign3-history-hq009-rev1/review.json'),ref(P/'campaign3-history-git-object-recovery-rev1/review.json'),ref(P/'campaign3-history-temporary-object-recovery-rev1/review.json'),ref(P/'campaign3-history-sister-object-recovery-rev1/review.json')],condition='If no further independent local evidence can resolve this after the remaining adequacy review, HQ011 requires external input. No architectural ontology/law decision has been identified.'),limits=['This audit tests completion rather than presuming it from green metadata checks.','No historical writer/runtime/test/build rerun, no source mutation, and no waiver of the final-history gate.','No global absence claim; read-only local searches have explicit boundaries.','Requested external location information does not pause the goal or establish a completed blocked audit.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save(O/'check.json',dict(status='PASS COMPLETION-AUDIT ACCOUNTING; ACCEPTANCE NOT PASSED',requirements=len(requirements),handoffAllowed=False,verifiedFrozenSources=11373,verifiedRoleBackingBindings=len(bindings),unresolvedTargets=208,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
