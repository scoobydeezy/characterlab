"""HQ011 factory authority chronology and retained defect controls."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-factory-rev1'
SOURCE='docs/formal/OPEN_DECISIONS.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a=1,z=None):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);z=z or len(ls)
 return dict(path=str(p).replace('\\','/'),sha256=sha(p),startLine=a,endLine=z,text=''.join(ls[a-1:z]))
specs=[
 (1499,'PERSIST-I scope','Positive cross-build production RNG-consumer obligation retained and deferred, not passed. Primitive/schema catalog is not a consumer.','Mandatory when separately accepted production seam exists; admitting RNG requires its own profile. Historical deferral is not a present-day status audit.'),
 (1514,'Bounded persistence','A..H qualify original no-RNG profile; descriptor negatives prove omission/version sensitivity.','No whole A..I, VAL or factory implication; memory prefix replay is separately governed.'),
 (1528,'VAL reconciliation','E generic permutation, M and W current character scopes accepted.','Second-kind T positive conditional; do not invent a kind. Crosswalk proposals not yet verdicts.'),
 (1541,'VAL crosswalk','Finite scoped vectors accepted except V; actual memory OutputRole carrier exists in both recall branches.','Future deferral for V rejected; first-profile omission cannot imply build-wide absence.'),
 (1556,'VAL-V / sequencing gap','Real public memory role traversal accepted; whole VAL withheld for CONTENT-before-role ordering.','Matcher-first rejection is insufficient traversal evidence. Dual-defect prepare/restore precedence required; exact model guard retained.'),
 (1569,'VAL qualified','Current finite language qualified after CONTENT-before-role and dual-defect control.','Not universal compiler/host equivalence; T second-kind still conditional. Factory and RNG persistence separate.'),
 (1585,'Write-boundary correction','Capability-derived scope, WRT prefix, resolved-target/diff guards and staged publication accepted. Redundant patch-byte guard removed with survived assay retained.','No whole B/E4/E8/FCT from correction alone; later controls not retroactively covered.'),
 (1598,'B split scope','Generic family/subset and alternate-subject controls plus frozen public exclusion accepted.','Public witnesses conditional on separately admitted richer profiles. No qualification-only topology widening or universal resolver equivalence.'),
 (1616,'E4/E8 accepted','Finite operations/persistence and independent pre-snapshot RuleId/path oracle accepted.','One dispatch plus four evaluations is five outputs, not five evaluated rules. Public scope conditions remain.'),
 (1631,'Mixed Gate clarification','Original Always versus duplicate FrozenBaseline confirmed across five unchanged proof rows.','Directional acceptance not vector verdict yet; fingerprints preserve evidence without invented rerun.'),
 (1642,'E13 accepted','Finite collision matrix includes literal mixed Gate, Step, Match, keys and legal disjoint cases.','Three detected mutants do not qualify arbitrary policies; remaining vectors separate.'),
 (1653,'E3 accepted','Committed public Step/Gate/Match and generic V/L/source controls with public exclusions accepted.','Generic structural identities are not admitted richer models; future positive public controls depend on accepted domains.'),
 (1667,'E9 accepted','Finite underflow/endpoints/overflow/zero normalization and unbounded-domain cases; complete-state confinement plus E4/E8.','Not arbitrary-bigint proof; reference semantics and full rollback remain separate.'),
 (1679,'E10 accepted','R0 authored reference, D retained state; sum validated, never stored as new anchor. Boundary invalidity cannot be rescued by later repair.','Finite public/component mapping; unknown-variable translation composes earlier exclusion. No inferred full rollback.'),
 (1692,'Read-evidence defect','Four negative substitutions initially accepted omitted/reversed/shared/encoded evidence. New per-rule and staged snapshot guards correct publication.','Correction submitted only; old evaluator-sensitive receipts require explicit refresh.'),
 (1703,'Read-evidence correction accepted','Per-rule target/gate and structured/encoded snapshot guards accepted with existing failure precedence. PRJ owns values.','No ADAPT reread/value oracle; seven controls and two mutants not whole E7. Internal injection not public capability.'),
 (1716,'Binding alias defect','Caller binding mutation redirected validated direct/derived reads. Private binding/path/accessor snapshot and selected function capture repair alias.','Initial two failures retained; function capture does not establish closure purity.'),
 (1727,'Binding correction accepted','Snapshot before validation, retain same private graph; exact-domain isolation and accessor uniqueness accepted.','Wildcard domains remain lawful. No rebinding API, external captured-state purity or anonymous authoritative PRJ claim.'),
 (1740,'Lifetime defect','A-target/B-execute/A-gate bypassed token order. Active flag rejects nested execution and finish before publication.','Same-object sharing and named public hooks separately checked. Source-sensitive older assays not silently refreshed.'),
 (1753,'Authorized self-review','User authorized independent adversarial review; E7 finite scopes self-reviewed PASS.','Not external reviewer acceptance; full thin path and dice/identity still required.'),
 (1761,'E11/E12 self-review','Finite route/dependency splits and failure-stage rollback/restore qualified under authorization.','Preserve source correction and identity-carriage limitation; wider composition still pending.'),
 (1772,'ADAPT/REG consolidation','E1/2/5/6 finite controls accepted; REG selected-key/query isolation corrected before arithmetic.','Future body intervention conditional; no public body/multivariable adoption. Whole factory not yet inferred.'),
 (1784,'Bounded factory qualified','FCT1..6/A..F and mapped EVID/REG/ADAPT qualified for original no-RNG profiles and named splits, by authorized self-review.','No future body/belief/value/DecisionExpression/RNG admission. Historical721-test receipt not fresh full rerun. Full Campaign2 topology still open here.')]

assert sha(SOURCE)==sha(B/'sources'/SOURCE)
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 1499<=u['location']['startLine']<=1801:continue
  assert u['location']['endLine']<=1801
  _,name,judgment,reopen=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  e=excerpt(B/'sources'/SOURCE,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
  rows.append(dict(occurrenceId=u['id'],source=e,decision=name,judgment=judgment,reopen=reopen,obligations=['RO-C3-020','RO-C3-021']))
lines=Path(B/'sources'/SOURCE).read_bytes().decode('utf-8-sig').splitlines()
assert {n for r in rows for n in range(r['source']['startLine'],r['source']['endLine']+1)}=={n for n in range(1499,1802) if lines[n-1].strip()}
prior=load(P/'campaign3-history-memory-parent-rev1/review.json')['rows']
assert not {r['occurrenceId'] for r in rows}&{r['occurrenceId'] for r in prior}
manifest=load(O/'source-manifest.json')
for x in manifest['files']:assert sha(x['path'])==x['sha256'],x['path']
t=load(O/'tests.json');assert t['success'] and t['numPassedTests']==21 and t['numFailedTests']==t['numPendingTests']==0
assert len(t['testResults'])==4 and all(a['status']=='passed' for f in t['testResults'] for a in f['assertionResults'])
r=dict(status='HQ011 FACTORY BATCH REVIEWED; WIDER AUDIT OPEN',rows=rows,
 evidence=[excerpt(P/'CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md'),excerpt(P/'CAMPAIGN2_AD_E7_CONSOLIDATION_REVIEW.md'),excerpt(P/'CAMPAIGN2_PERSIST_I_SCOPE_ADDENDUM.md'),excerpt(P/'CAMPAIGN2_VAL_V_MEMORY_ROLE_REVIEW.md')],
 preservedFindings=['Matcher-first rejection failed to prove VAL role traversal; CONTENT-before-role sequencing and dual-defect controls required.',
 'Omitted/reversed/shared/encoded read substitutions initially accepted; per-rule instrumentation and staged snapshots repaired them.',
 'Caller binding aliases redirected validated reads; private snapshot repaired aliasing without proving closure purity.',
 'Nested execution during an active evaluation bypassed cursor order; active execute/finish guards repaired lifetime exclusion.',
 'Redundant patch-byte guard survived its assay; removal retained target/diff protection. One dispatch plus four evaluations is not five evaluated rules.'],
 tests=dict(path=(O/'tests.json').as_posix(),sha256=sha(O/'tests.json'),passed=21,files=4,titles=[a['fullName'] for f in t['testResults'] for a in f['assertionResults']]),
 sourceManifestSha256=sha(O/'source-manifest.json'),obligations=['RO-C3-007','RO-C3-008','RO-C3-005','RO-C3-019','RO-C3-020','RO-C3-021'],
 limits=['Formal register1499..1801 only; later RNG prediction/task/cognitive integration and current trigger reconciliation remain outside this batch.',
 '21 fresh focused tests across four files; not full historical mutants, full regression, reference suite or build.',
 'Historical no-RNG deferral preserved without projecting it onto current build. Generic/public splits, conditional positive controls and self-review provenance remain explicit.'],
 nextGate='Continue HQ011 at formal register1802: prediction/RNG, task lifecycle and cognitive integration qualification.')

def validate(v):
 assert v==r
 for e in [x['source'] for x in v['rows']]+v['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert sha(v['tests']['path'])==v['tests']['sha256']
validate(r);faults=[]
for mode in ['omitted-occurrence','bounded-as-universal','lost-rejected-packet','false-test-total','lost-split-scope']:
 v=copy.deepcopy(r)
 if mode=='omitted-occurrence':v['rows'].pop()
 elif mode=='bounded-as-universal':v['rows'][0]['judgment']='All persistence including future RNG is universally qualified'
 elif mode=='lost-rejected-packet':v['preservedFindings'].pop(0)
 elif mode=='false-test-total':v['tests']['passed']=328
 else:v['rows'][-1]['reopen']='Generic evidence proves arbitrary public profiles'
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',r)
c=dict(status=r['status'],originalOccurrences=len(rows),decisionGroups=len(specs),indexedWholeOccurrenceLinks=438+len(rows),freshTests=21,boundSourceFiles=len(manifest['files']),faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
