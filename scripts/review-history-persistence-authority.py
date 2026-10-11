"""Reconcile original bounded persistence authority without rerunning old writers."""
from pathlib import Path
import json, hashlib
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'; O=P/'campaign3-history-persistence-authority-rev1'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p): return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists(): assert load(p)==v,p
 else: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={
'docs/planning/CAMPAIGN2_PERSISTENCE_CLARIFICATION.md': 'Accepted revision2 shape independently derives Save132 fields8/9/10 as exact list([]) from admitted execution closure including unexercised branches: no run-owned anchors, random consumers or continuing coupling. None follows from another or from silent traces. Immutable REG references stay model-owned; changing anchors changes Registry/ModelIdentity, not redundant field8. Revision1 REG-copy/map/dedup proposal expressly retracted before runtime, not an implementation failure. Required absence remains distinct from zero; map/set/omission cannot alias empty list. Profile must bind exact RulesVersion/semantic bundle, not caller flag, build feature scan or nearest fallback. Original ordered-input manifest separately required; field10 cannot replace it. State admission and saved-time REG checks precede metadata/publication; no state scan for RNG IDs. Initial NOT IMPLEMENTED/NOT PASSED wording is historical shape status superseded only by the later bounded A..H qualification and distinct successor RNG evidence. No general mutable-anchor, coupling, RNG or whole-factory qualification.',
'docs/planning/CAMPAIGN2_BOUNDED_PERSISTENCE_QUALIFICATION_REVIEW.md': 'Accepted original no-RNG PERSIST-A..H qualification, not whole A..I/factory/VAL/Campaign2. Exact175schemas/82semantic entries/four consumers/five writable leaves are inventory, not behavioral proof. Optional bridge enabled/disabled and unexercised rule branches included; shared probe/carriage/memory code lacks capabilities in this model, so build presence is not admitted closure. Unsupported declarations reject even empty input. Three independent absence arguments justify fields8/9/10. Exact metadata, model-anchor intervention, original-input authority, saved-time validation, separate-process continuation and prepublication rejection retain distinct scopes. 700 negative public calls are175 omissions plus175 version increments at prepare and restore, one test; not700 tests or all malformed schemas.16 focused tests and earlier936 historical result not merged. Audit helper initially omitted expected type to dataRecord and failed before report, then corrected by explicit kind inspection; no production defect. PERSIST-I explicitly deferred in original verdict; later natural-address replay and subsequent cross-build module-graph assay are separate evidence, not retroactive tests.',
'docs/planning/CAMPAIGN2_PERSIST_I_SCOPE_ADDENDUM.md': 'Owner-approved sequencing preserves original PERSIST-I mandatory trigger: accepted production-supported RNG seam absent from committed model. drawBounded primitive, mock/plugin/declaration and RNG schema catalog cannot supply that precondition. Original six isolated catalog experiments detect separate save/restore build-inventory dependencies but are bounded component controls, not positive PERSIST-I witness. Same ModelIdentity across catalog intervention; save scan changes bytes/rejects restore while restore scan rejects unchanged valid save. Later cognitive qualification proves actual RNG complete-prefix restoration under successor profile, not by itself the original absent-consumer cross-build contrast. Post-cutoff history-persist-i proof supplies that missing contrast with two isolated supported-module graphs, actual existing production consumer, unchanged old empty-input model complete bytes and two named substitutions. No old binary reproduction, arbitrary plugin/build independence, broad coupling or scaling claim. Preserve first rejected runner targeting obsolete mutation anchor; corrected assay preserves cognitive branch and does not edit production. Reopen for profile/model, projection, admission or support changes; old deferred text retained as chronology, not a new owner blocker.'}
ip=P/'campaign3-history-source-roles-rev241/index.json'; ix=load(ip); entries={e['path']:e for e in load(B/'manifest.json')['entries']}
chain=[ref(p) for p in [P/'CAMPAIGN2_BOUNDED_PERSISTENCE_QUALIFICATION_REVIEW.md',P/'CAMPAIGN2_COGNITIVE_PERSISTENCE_QUALIFICATION.md',P/'CAMPAIGN3_HISTORY_PERSIST_I_CHECKPOINT.md',P/'campaign3-history-persist-i-rev1/proof.json']]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='ORIGINAL NO-RNG PERSISTENCE AUTHORITY AND SEPARATE LATER RNG EVIDENCE',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes: continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='THREE ORIGINAL PERSISTENCE AUTHORITY SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Original no-RNG A..H, successor RNG replay and later absent-consumer module-graph assay retain separate scopes and chronology.','Exact original occurrences preserved; later evidence does not rewrite historical DEFERRED into an original PASS.','No runtime/test/build rerun, new archive/source gap, law, model, verdict or obligation status change. Independent adequacy remains open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS ORIGINAL PERSISTENCE AUTHORITY HISTORY',sources=len(sources),originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
