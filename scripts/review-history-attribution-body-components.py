"""Reconcile attribution and interoceptive source component limits."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-attribution-body-components-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/planning/ATTENTION_OUTCOME_ATTRIBUTION_DRAFT_REV1.md': 'Draft decomposes supported connection, evidence-valued effect and memory update. Supported is neither magnitude, benefit, success, causal certainty nor write permission; Unavailable is not contrary attribution or known zero. Existing227→269→270 remains unchanged, source IDs grant no payload resolver. Proposed SelectionId target and same-instant positive-retention proposal are historical, superseded by later acquisition identity and no-transient-access ruling. Observable motion/contact investigation must allow hidden confounding, not emit causal labels or import diagnostic prediction as efficacy. No causal belief store or ORD001 choice required merely to name attribution. Earlier32 recipes exclude this new source and cannot qualify it.', 'docs/planning/ATTENTION_CONTRASTIVE_ATTRIBUTION_CHECKPOINT.md': 'Candidate two-motion/two-stationary contrast requires equal observed baselines and strict conservative change separation. No effect/confidence/belief/write follows. CAH supplied-operand equality under hypothetical hidden explanations is not public false-attribution source proof. Six mutations show sensitivity, not general causal inference. Actual support-only SEM selects zero event units while qualified transient EMB pressure remains available.24tests=9attribution2selector6consolidation4barrier3nonidentifiability; earlier unsuffixedSEM fixture rejected and corrected to exactSEM001H without weakening production. Motion-source pairing and durable-body acquisition still owed then.', 'docs/planning/INTEROCEPTIVE_ACQUISITION_COMPONENT_CHECKPOINT.md': 'Sample-level bounded control uses actual461/463, one observer/time, unique channels/observations and selected-only one-use view. Seven tests after omitted rational-denominator fixture correction; six faults separate. Actual reserve27 with widths1/5/10 gives27..28,25..30,20..30, still three candidates; identical-width channels also consume slots. This is candidate resource behavior, not implementation defect or three-signal proof.20 combined tests retain earlier24scope separately. Transient pressure/trace/source existence cannot recover discarded bytes; correlated views not independent trials. Later signal-unit ruling preserves this control instead of relabeling it.', 'docs/planning/INTEROCEPTIVE_SIGNAL_ACQUISITION_CHECKPOINT.md': 'Grouped component counts supplied declared signal per explicit opportunity, preserving every contradictory selected view without fusion.3signals/3views/4096bytes/capacity2 are specimen limits, not public calibration. Eight tests plus7faults, explicit three-viewP plusQ shows no extra slot; supplied labels not authenticated signal diversity. Actual SEM opportunity tests distinguish same-time IDs, multi-support one-envelope and no-evidence noreservation; proposed typed1106 replaces only futurepublic packaging, not component bigint domain.27tests=8grouped7sample9attribution3identity, not public source/restore. Later synthetic multi-reserve ruling resolves old source choice, not physiological ontology or general sensation law.'}
ip=P/'campaign3-history-source-roles-rev258/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_CONSOLIDATION_CREDIT_RESOLUTION.md','GENERAL_ATTENTION_SAME_BARRIER_ACQUISITION_RESOLUTION.md','GENERAL_ATTENTION_INTEROCEPTIVE_UNIT_RESOLUTION.md','GENERAL_ATTENTION_MULTISIGNAL_BODY_SOURCE_RESOLUTION.md','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='ATTRIBUTION AND BODY COMPONENT WITH SCOPED LATER QUALIFICATION',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR ATTRIBUTION BODY COMPONENT SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Planning and captured hashes do not establish completed replay; later qualifications preserve component/native distinctions.','Later bounded completion supersedes routing only within named profiles, not all ideal-loop phenomena.','No runtime/test/build rerun, source gap closure, law/model/verdict/corpus/obligation status change or historical adequacy claim.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS ATTRIBUTION BODY COMPONENT HISTORY',sources=len(sources),originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
