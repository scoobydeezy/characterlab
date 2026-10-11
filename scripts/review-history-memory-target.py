"""Reconcile memory symbolic and wrapper packaging authority without erasing historical rejected designs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-memory-target-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={
'CAMPAIGN2_RESPONDING_COGNITION_TARGET_REVIEW.md':'Accepted target is persistent observation-relative episodic retention plus separately mandatory later usable recall, not changed digest/wrapper/archive or belief about present hidden regulation. Inspection-first authorization did not select records, equations or runtime law.337 availability does not grant persistent write authority; distinct governed learning evidence and PRJ/IDN owner projection are required, with SubjectId excluded as substitute. Belief/estimate was a considered alternative requiring proposition/time/uncertainty/revision decisions, not rejected psychology. Historical MEC021 attribution remains control/corpus, MEC022/RET013 preserve historical calibration and forbid biography recomputation; precision1 is metadata, not confidence/weight/surprise. General retrieval/decay/topK and censored estimates remain outside target. Later scoped memory acceptance and separate same-S0 parent pair supply evidence; old pending decision language is answered history, not current owner ruling.',
'CAMPAIGN2_MEASUREMENT_MEMORY_DRAFT.md':'Revision3 accepts M1 V04 reuse and bounded M2 nested projection while preserving staged M3/M4/M5 decisions. Rejected new M1 ingress grammar mistook a current compiler/model limitation for a missing formal cross-version RegisteredTransitionProducer relation. M1 only copies actual live337 into distinct typed learning evidence with shared output identity and no state read/write; no widening of frozen consequence270. M2 accepts finite required-record descent[2,2,2], not maps/lists/reference traversal, fallback or arbitrary schema search; admission precedes extraction and sole IDN state read. New path list does not permit list-valued traversal. StrategyB duplicated ObserverId with enforced equality remains viable, not retired/prohibited; avoiding duplicate bytes alone did not justify A. No new source field becomes separate epistemic authority if exact equality is earned at every boundary. M3 key tentative until M4b; cue generation separated from owned addressing and formation success. Historical memory implementation is not a ready-made equivalent: no imported Need outcomes, participant attribution, salience, retrieval history, prediction error or accessibility mathematics. Precision remains observation metadata. All MEMR A..P proof burdens preserved; first cognitive formation divergence and later recall usability differ. Old initial-adaptation-state pair did not meet stronger same-S0 parent experiment, which later separate evidence supplies. Broader PHEN-MEM and reference candidates remain deferred, not rejected or waived. Shape, allocation, model identity and runtime acceptance remain distinct stages.'
}
notes={(P/k).as_posix():v for k,v in notes.items()}
ip=P/'campaign3-history-source-roles-rev221/index.json';ix=load(ip);entries={x['path']:x for x in load(B/'manifest.json')['entries']}
chain=[ref(P/'campaign3-history-memory-formation-recall-rev1/review.json'),ref(P/'campaign3-history-memory-qualification-rev1/review.json'),ref(P/'campaign3-history-adapt-parent-pair-rev1/review.json')]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL MEMORY TARGET AND M1/M2 ACCEPTANCE WITH RETAINED COMPETITORS',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='TWO MEMORY TARGET AND M1/M2 SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Component acceptance is distinct from complete allocation, model freeze and runtime qualification; exact successor evidence joins retained.','Rejected redundant M1 registration grammar remains historical; top-level observer-copy StrategyB remains a viable comparator, not prohibited. Broad reference memory phenomena are not qualified by exact retention.','No runtime, test, build, constructor or writer rerun; no new source gap or archive.','No model, law, allocation, verdict, corpus or obligation status change; prior source gaps and independent adequacy remain open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED MEMORY TARGET AND M1/M2 HISTORY',sources=2,originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
