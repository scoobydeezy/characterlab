"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-packaging-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={
'CAMPAIGN2_MEASUREMENT_MEMORY_SYMBOLIC_CLOSURE.md':'Shape-accepted M5 revision4, not numeric or runtime qualification. Reject unearned global projection registry rows; requirements stay owned by executing TransitionSeamContract. Preserve existing state-family DefinitionVersion while changing only successor episodic Storage; no topology semantics rewrite. Private trace SeamVersion identifies memory semantics, not RulesVersion. Fourteen memory records later gain three packaging wrappers separately. Recall has authenticated delayed scheduler event input, no semantic cue identity or learning-route entry; formation shares learning route. Same TransitionKind across models is legal, duplicate row within model is not. Sixteen configurations derive F/R from committed registrations, not independent metadata. IDN values remain original S0/run data, not registry. Episode source IDs grant no lookup capability; direct authorized episode read has no derived-source transformation. Exclusive phase140 stage and real/private future association kinds remain fixed profile semantics. Prefix validation exports detached facts only after whole-save equality, not serialized capabilities or antirollback. Header whole-shape acceptance supersedes pending wording at document end; later packet/freeze/runtime qualify exact bounded scope, not arbitrary registration language.',
'CAMPAIGN2_MEASUREMENT_MEMORY_PACKAGING.md':'Whole packaging shape acceptance closes C2-MEM-PACK-001 after rejecting anonymous list serialization. Three typed wrappers commit exact registration and separate requirement collections through existing six-slot registry, with no seventh slot/global projection map or external static bindings. Nested343 path[2,2,2] resolves observer to qualified character; recall266 then349 same-contract dependency authorizes exact(C,E) read before presence access. Empty sets differ from absent schema fields, and canonical iteration order does not select dependency order. Profile selects wrapper grammar; DefinitionVersion retains inner registration meaning. Sixteen a/p/F/R model identities remain distinct even if suppression yields equal outputs. Delay1 is signed model SimDuration with atomic checked overflow for real/private branches. Source337 trace is historical provenance, not cue identity or read capability. Original14-role slot5 accounting is superseded only by C2-MEM-PACK-002 adding one IDN map-key role; old blocked packet remains never admitted. Old no-runtime/pending review text is chronological, not a current owner blocker. Later accepted qualification composes component permutation and public exclusions, not general memory coverage.',
'CAMPAIGN2_MEMORY_TRANSITION_WRAPPER_DRAFT.md':'Shape-accepted three exact wrapper schemas supersede anonymous heterogeneous envelope while leaving frozen342..355 and requirement semantics intact. All fields required; no arbitrary CanonicalValue/bytes/callback, wrapper identity or new role; static bindings profile-fixed empty even when externally supplied as empty argument. Outer registry profile, inner DefinitionVersion and executing seam version have distinct authority. Closed row matrix preserves bare inherited entries and opportunity350; no version fallback. Collections enforce exact case cardinalities, explicit empties, cross-collection accessor uniqueness and same-contract349-to266 dependency. Changed requirement commitments can be hashed yet rejected by exact-profile admission. Singleton/empty accepted collections cannot honestly supply a nontrivial valid permutation witness; substrate composition retained explicitly. MEM-PACK A..G planning labels were frozen obligations, not passed runtime vectors; later allocation/freeze/qualification supplies staged acceptance without enlarging the model language.'
}
notes={(P/k).as_posix():v for k,v in notes.items()}
ip=P/'campaign3-history-source-roles-rev219/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
chain=[ref(P/'campaign3-history-memory-qualification-rev1/review.json'),ref(P/'campaign3-history-memory-packets-rev1/review.json'),ref(P/'CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL MEMORY SYMBOLIC/PACKAGING ACCEPTANCE WITH EXPLICIT SUCCESSOR SCOPE',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE MEMORY SYMBOLIC/PACKAGING SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Symbolic/shape acceptance is distinct from numeric allocation, concrete freeze and runtime qualification; exact later evidence joins recorded.','Fourteen memory-role packaging delta superseded by accepted fifteen-role successor, without admitting blocked old specimens.','No runtime, test, build, constructor or writer rerun; no new source gap or archive.','No model, law, allocation, verdict, corpus or obligation status change; prior source gaps and independent adequacy remain open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED SYMBOLIC/PACKAGING HISTORY',sources=3,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
