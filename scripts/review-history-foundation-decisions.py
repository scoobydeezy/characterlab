"""HQ011 scoped Campaign0/SEM authority review, with three fresh test files."""
from pathlib import Path
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-foundation-decisions-rev1'
SOURCE='docs/formal/OPEN_DECISIONS.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,x):
 if p.exists():assert load(p)==x,p
 else:p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def excerpt(p,a=1,z=None):
 ls=Path(p).read_bytes().decode('utf-8-sig').splitlines(keepends=True);z=z or len(ls)
 assert 1<=a<=z<=len(ls)
 return dict(path=str(p).replace('\\','/'),sha256=sha(p),startLine=a,endLine=z,text=''.join(ls[a-1:z]))
specs=[
(241,'SECTION LABEL','Historical heading; acceptance comes from the scoped records below, not the heading date.', 'No blanket source acceptance.'),
(243,'SEM-001A','Observer-relative continuant identity and independently monotonic allocation; recognition never repairs/merges tracks. Binary continuity may be false.','Uncertain continuity, fusion, mutable joining/splitting or semantic ordinals require new proof.'),
(251,'SEM-001B','Immutable run-scoped event binding; role cardinality/domain narrowing and pair uniqueness; truth roles pass only through permitted evidence.','New roles/qualifiers, identical repeated pairs, cross-role constraints or different identity scope reopen.'),
(259,'SEM-001C','Observer-relative event files are distinct from continuants and experiences; false merge/split and explicit end remain lawful observer errors.','Probabilistic/hierarchical segmentation, fusion or changed occurrence lifecycle reopen.'),
(267,'SEM-001D','Separate truth/perceptual facet namespaces; exact optional Boolean assertions, missing distinct from false, one rule authority per facet.','Graded values, aggregation, new modalities/kinds or wider disclosure need a successor.'),
(275,'SEM-001E','Event-pattern facets use scoped necessary-feature conjunctions; roles and pattern classification independently intervenable. No truth Action copy or learned schema claim.','Cross-window evidence, graded/suggestive classifiers, facet inference or action-schema learning reopen.'),
(283,'SEM-001F','UniqueUncontradictedSupport over observer catalogs supports replace/withdraw/no-update; absence is not withdrawal; candidate metadata cannot truth-filter a track.','Tentative recognition, calibrated confidence, learned templates, ambiguity state, cross-modal/event recognition require new evidence.'),
(291,'SEM-001G','Evidence admissibility is relational to a transition ReadDomain; opaque/hashed truth handles still leak equality. Safe provenance is separate from omniscient ancestry.','New evidence classes, cross-observer ownership, recursive causal roles or historical reuse require explicit admission.'),
(299,'SEM-001H','Two fixed lanes, reserved experience only on emission, frozen recognition inputs and nonschedulable150; phase130 has no outcome truth read.','Ordering before30 is not belief-read permission; ORD001 remains separate. New lanes/late observation/classifier dependencies reopen.'),
(307,'SEM-001I.1','Shape/identity/state collection inventory accepted, not permanent allocation or integrated runtime; actual catalogs belong to initial state, legal rules to model identity.','Later I.2/I.3/J supply separate allocation/persistence/integration gates; shape alone earns none.'),
(314,'SEM-001I.2','Permanent210..259 and declared namespaces frozen; exact union grammar and typed occurrence families. Historical1004 availability is a dated allocation fact.','Do not use old available-hole prose to allocate today; later Campaign2 allocation owns1004. Changed schemas/roles require their own gate.'),
(323,'IDN-001 SHAPE','CharacterId is an authored semantic-kind role, not another identity namespace. Partial immutable observer-to-character roster is initial state; unbound observer fails only where character is required.','This record is shape-only, not runtime proof. Mutable binding, runtime-origin character qualification or fused perspectives require new contract; later Campaign2 handles implementation.'),
(339,'PRJ-001 SHAPE','Admitted payload selector and committed field projection supply required total construction; internal wrapper read is not transition-visible. Bidirectional key grammar is model admission, not chronology.','Shape-only P0..P12b gate remains historical at this point. Optional/composite projections or richer key semantics need successor proof, not an anonymous callback.'),
(353,'WRT-001','Common prefix is structural path, declared writable leaf, then owning authority. Operation-specific removal/precondition/value ordering remains unchanged. Single-operation malformed paths cannot rely on sorting.','Typed state failure guarantee does not imply nested scheduler causes; richer error vocabulary or changed operation ordering reopen. Two old defects and five diagnostic-code migrations remain preserved.'),
(368,'TRC MUTATION AUTHORITY ALLOCATION','1025 is a shared model-semantic authority namespace, not per-run producer identity. Leaf grammar/removal/ownership are committed; one authority per leaf does not mean unique authority for every leaf.','New leaf grammar or authority-level admissibility requires explicit schema/ownership proof. Old1004 hole is not current allocation permission.'),
(377,'SEM-001I.3','Accepted codecs/state authority supply canonical construction, persisted counters and resolution topology. Symbolic implementation scaffolding cannot become authoritative results.','Codec/persistence closure alone did not close SEM; J must use actual typed end-to-end identities. New roots, authority splits or tolerant unknown decode reopen.'),
(391,'SEM-001J','Finite integrated gate closes parent through actual canonical records, state and replay. Registered is not admitted; documents are audit targets, never runtime semantics. Poisoned scaffolding leaves authoritative bytes unchanged.','No continuous perception, probabilistic recognition, general ontology, learning/appraisal/social cognition or new lanes earned. Later domains need their own contracts.'),
(409,'MATH-006','Permitted Before/After/known bounds/polarity compile point/lower/upper intervals; missingness separate; truth saturation and Overflow cannot enter cognition.','No noisy/uncertain-bound sensor or general learning law; changed channel, timing, evidence vocabulary/precision requires comparison.'),
(417,'CAMPAIGN0 CLOSURE POLICY','Accepted candidate-era version IDs remain immutable so acceptance does not change model identity or random inputs.','A closure date does not authorize rewriting committed versions.'),
(421,'RND-001 / MATH-005','Canonical addressed SHA256 candidates, two rejection attempts plus fresh modulo fallback, span<=2^32; explicit role-compatible draw map is the coupling override.','Residual bias bound below2^-290 assumes ideal candidates; not exact unbiasedness. Changed range/hash/address/coupling requires proof. No fresh RNG suite claim in this batch.'),
(429,'TIME-001 / MATH-001','Checked integer time with exact linear anchors/remainder and nonmutating reads prevents incidental partition dependence.','Bounded signed linear rates only; nonlinear progression/range/reanchor changes need their own vectors. No universal clock-law claim.'),
(437,'ORD-003 / ORD-004','DueAt/Phase/EventSequence, whole-instant commit, bounded quiescence and canonical continuation; failed work cannot partly commit.','Wrapper-owned continuation adds separate publication obligations. Changed ordering/save/cascade/allocator semantics reopen.'),
(445,'TRC-001 / TRC-002','Sole mutation authority, capability-limited reads, exact patches/diffs and separate failed diagnostics versus committed trace.','No hash-only equality or direct mutation shortcut; changed path/projection/atomicity requires proof. Trace privacy remains separately scoped.'),
(453,'CONTENT-001','Governed content/registries and deterministic kind validation; authoritative fields committed, presentation excluded.','No free-form runtime interpretation. Later VAL addresses anonymous governed-executable gaps; this initial acceptance is not permission to leave behavior uncommitted.')]
assert sha(SOURCE)==sha(B/'sources'/SOURCE)
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 241<=u['location']['startLine']<=460:continue
  assert u['location']['endLine']<=460
  start,name,judgment,reopen=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  e=excerpt(B/'sources'/SOURCE,u['location']['startLine'],u['location']['endLine']);assert e['text']==u['text']
  rows.append(dict(occurrenceId=u['id'],source=e,decision=name,judgment=judgment,reopen=reopen,obligations=['RO-C3-020','RO-C3-021']))
# Explicit full nonblank-line coverage catches a dropped heading or unmarked paragraph.
lines=Path(B/'sources'/SOURCE).read_bytes().decode('utf-8-sig').splitlines()
covered={n for r in rows for n in range(r['source']['startLine'],r['source']['endLine']+1)}
assert covered=={n for n in range(241,461) if lines[n-1].strip()}
manifest=load(O/'source-manifest.json')
for item in manifest['files']:assert sha(item['path'])==item['sha256'],item['path']
t=load(O/'tests.json');assert t['success'] and t['numPassedTests']==33 and t['numFailedTests']==t['numPendingTests']==0
assert len(t['testResults'])==3
assert all(a['status']=='passed' for f in t['testResults'] for a in f['assertionResults'])
evidence=[excerpt(p) for p in ['docs/formal/EVENT_SEMANTIC_BINDING.md','docs/formal/EVENT_SEMANTIC_SCHEMA_INVENTORY.md','docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md','docs/formal/STATE_MODEL.md','docs/formal/DETERMINISTIC_SUBSTRATE.md','docs/formal/OBSERVATION_AND_EVIDENCE.md','docs/formal/CONTENT_GOVERNANCE.md','docs/planning/CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md']]
r=dict(status='HQ011 FOUNDATION DECISION BATCH REVIEWED; WIDER AUTHORITY AUDIT OPEN',rows=rows,evidence=evidence,
    tests=dict(path=(O/'tests.json').as_posix(),sha256=sha(O/'tests.json'),passed=33,files=3,titles=[a['fullName'] for f in t['testResults'] for a in f['assertionResults']]),
    sourceManifestSha256=sha(O/'source-manifest.json'),obligations=['RO-C3-007','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'],
    limits=['Source scope formal register241..460. Later Campaign2 evidence/adaptation/factory chronology and earlier historical summaries remain outside this batch.',
            '33 fresh focused tests: SEM gate audit11, integrated gate13, write-validation9. Not full Campaign0/SEM conformance, historical mutant reexecution, reference suite or build.',
            'Historical shape and allocation decisions remain distinct from runtime qualification. No primitive, contract or law changed.',
            'All original source occurrences preserved; documentary disposition is not universal necessity, corpus approval or final scientific adequacy.'],
    nextGate='Continue HQ011 at EVID-001 line461 through Campaign2 shape/allocation/factory qualification chain.')
def validate(v):
 assert v==r
 for e in [x['source'] for x in v['rows']]+v['evidence']:assert e==excerpt(e['path'],e['startLine'],e['endLine'])
 assert sha(v['tests']['path'])==v['tests']['sha256']
validate(r);faults=[]
for mode in ['missing-unmarked-unit','shape-as-runtime','unbiased-rng','false-test-total','lost-reopen']:
 v=copy.deepcopy(r)
 if mode=='missing-unmarked-unit':v['rows'].pop(0)
 elif mode=='shape-as-runtime':next(x for x in v['rows'] if x['decision']=='IDN-001 SHAPE')['judgment']='Runtime fully qualified here'
 elif mode=='unbiased-rng':next(x for x in v['rows'] if x['decision']=='RND-001 / MATH-005')['reopen']='Unbiased for all spans'
 elif mode=='false-test-total':v['tests']['passed']=328
 else:v['rows'][1]['reopen']=''
 try:validate(v)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
save(O/'review.json',r)
c=dict(status=r['status'],originalOccurrences=len(rows),decisionGroups=len(specs),freshTests=33,boundSourceFiles=len(manifest['files']),faultChecks=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
