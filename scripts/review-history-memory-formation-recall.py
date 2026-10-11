"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-formation-recall-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={
'CAMPAIGN2_MEASUREMENT_MEMORY_M3_DRAFT.md':'Accepted component revision2 rejected duplicate insertion capability and independent state/restore-validator roster lookup. Existing StateWrites grants permission; deterministic one absent-to-present Set and exact diff are tighter seam behavior, not a new capability. Sparse(C,E) key is an address, not episode occurrence identity; full admitted M1 embeds sole337 historical authority. Formation gets only admitted L/projected C, no semantic occupancy read. Generic WRT precondition owns occupied valid-key rejection. Local schemas/roles/source-ID equality do not authenticate history; M5 must prove it without alternate IDN channel. Key condition later closed by same-address M4b. No frozen old-model validator relaxation; six ADAPT-plus-memory leaves do not count read-only IDN as a writable family. Proposed trace/failure tests were obligations, with actual bounded runtime acceptance separately linked.',
'CAMPAIGN2_MEASUREMENT_MEMORY_M4A_DRAFT.md':'Shape-accepted delayed branch derives content-free(O,E) from actual completed337, independently of formation success; parent is intake, phase20 at checked positive delay from intake DueAt. Cue has scheduler invocation identity and no separate semantic ID. Suppression creates no semantic cue; later private future padding is distinct M5 control. Full event/source association and single-use liveness precede extraction/IDN/episode read, even when observers resolve to same character. Existing V04 SameAsProducer/ExactImmediateProducerOutput cannot impersonate delayed projected input. Pending canonical queue alone, memory contents, archive or self-consistent certificate do not authenticate generation. Prefix replay appears here as unselected candidate and becomes accepted only in later M5; never infer selection from M4a acceptance. Overflow atomicity and future authority are distinct from decay/accessibility laws.',
'CAMPAIGN2_MEASUREMENT_MEMORY_M4B_DRAFT.md':'Accepted fixed composition uses current admitted cue IDN result C and same cue evidence E to build exact M3 key before exposing presence. Required IDN absence is an error; optional episode absence emits no recalled measurement. No other-character fallback, global source index, arbitrary dependency graph, derived callback or wildcard enumeration. Sole same-contract IDN-to-episode dependency and preauthorization precede one direct leaf read; later accesses use cached snapshot. Episode trace has empty DerivedSources and absent TransformationId, not fictional payload-extraction reads. Local valid state never establishes historical legitimacy, and nested returned observer gets no second roster lookup. Read ablation removes access rather than reading then hiding output; formation ablation differs. M4b closes M3 key condition, while scheduling/authentication and historical restore remain later separate obligations. No retrieval-strength/recency updates or general memory search.',
'CAMPAIGN2_MEASUREMENT_MEMORY_M5_DRAFT.md':'Composition revision2 accepted real-or-void result slots, exclusive phase140 stage, historical337 trace source and original-S0 prefix validation after rejecting unused typed reservations, mixed ADAPT-then-memory visibility and empty recall provenance. Self-consistent local certificate rejected as insufficient history root; MAC/signature requires unaccepted trust seam; deterministic prefix execution chosen for bounded model. Original initial digest cannot reconstruct S0. Exact N trace count stops only at whole quiescent instants, with special N=0 post-input-compilation equality; whole save compared before detached pending facts remint fresh capabilities in a separate restored runtime. Candidate may select an older valid prefix, so no antirollback/freshness claim. Resource inability yields no runnable handle, not weak restore. Derived g1..11/r0..7 tables are design until actual runtime evidence; phase order differs from allocation order, coincident future/source work adds contributions. Formation/read ablations retain IDN where applicable; suppressed private future work has no cue/read/evidence. Sixteen committed choices and sentinel coupling remain bounded controls. Later symbolic/wrapper/freeze/runtime acceptance closes exact composition without generic scaling or arbitrary registration claims.'
}
notes={(P/k).as_posix():v for k,v in notes.items()}
ip=P/'campaign3-history-source-roles-rev220/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
chain=[ref(P/'campaign3-history-memory-packaging-rev1/review.json'),ref(P/'campaign3-history-memory-qualification-rev1/review.json'),ref(P/'CAMPAIGN2_MEASUREMENT_MEMORY_QUALIFICATION.md')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL MEMORY FORMATION/RECALL/RESTORE COMPONENT ACCEPTANCE',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR MEMORY FORMATION/RECALL/RESTORE SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Component acceptance is distinct from complete allocation, model freeze and runtime qualification; exact successor evidence joins retained.','Rejected duplicate capability, alternate IDN validation, mixed stage and certificate-only trust proposals remain historical; no new authority channel or generic restore scaling claim.','No runtime, test, build, constructor or writer rerun; no new source gap or archive.','No model, law, allocation, verdict, corpus or obligation status change; prior source gaps and independent adequacy remain open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED FORMATION/RECALL/RESTORE HISTORY',sources=4,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
