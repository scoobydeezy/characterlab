"""Reconcile foundational deterministic and observation contracts without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-adapt-shape-history-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev312/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
notes={'docs/planning/ADAPT_001_DRAFT_RESOLUTION.md': 'Whole-contract shape0.31,registration0.6 and settlement0.2 accepted with later permanent allocation; dated implementation/VAL/PHEN-open labels are superseded only by named bounded qualifications. Mutation authority owns state,not producer admission. Actual fact inputs carry basis/time/version,not target instructions,experience or truth linkage exposed to cognition. Regulatory/practice bases and actual competence versus capability belief remain distinct. Committed rules resolve membership before state and each targets one leaf/exact semantic path. No-rule dispatch,typed no-op,refused input and absent execution remain distinct. State-route closure derives directly from ten logical families,not empty EVID writable permissions; required output closure must be inhabited. Eight unmaterialized cognitive families remain honest scaffold,not cognition proof. Composite path keys expose subject/exposure/response-variable distinctions; Procedure is not Action,Character role reuses semantic identity without inventing Body. Authored Character qualification does not prove runtime-born character support. Per-definition exact integer scales and domain-only records preserve tolerance/sensitization/load/displacement/competence distinctions; the proportional interpretation is a bounded accepted modeling choice,not universal biological necessity forced by key shape. Reference R0 and learned D remain separate; validate R0+D at T rather than D alone. All five current leaves normalize absence to baseline and remove on return; no hidden materialization-history bit or general claim history is irrelevant. Explicitly reopen for equal current values with history-dependent behavior. Tolerance bound does not authorize clamp; out-of-domain count-step results reject. Main one-rule fixture and all-target-mutation wording are explicitly amended by accepted PHEN_ADAPT_FIXTURE_AMENDMENT to same nonempty rule set and independently expected changed subset. Early dispatch-at-resolve flow is refined by consolidation actual batch ordering: reject collisions before evaluator and output allocation. Section5.2 observation-derived lattice claim is withdrawn by consolidation and2.15a: observation is rational,ADAPT chooses its integer profile. No full physiology,addiction,skill-learning or general compression follows.', 'docs/planning/ADAPT_001_CONSOLIDATION_DRAFT.md': 'Pass8 whole shape acceptance governs older pass history. Logical family denotation replaces withdrawn root=family and dummy cognitive storage; route,physical ownership,input permission and actual change remain separate. V04 singleton/rows stay exact beside V06; the registration version selects grammar,not latest-version dispatch. StateWrites confines authority/family/one expected path and actual diff,never arbitrary nextState replacement. Dispatch plus exact rule-indexed output production cannot be faked by N arbitrary records or no-op labels. Collision checks cover all derived targets including prospective no-ops. ExclusiveAdaptation140 extracts original events without replacement,checks all targets before reads/evaluations,uses one private snapshot and capability-limited per-rule projections,then applies disjoint patches and validates complete candidate/diff before atomic settlement. EventSequence may change allocation/trace order but not values in this admitted independent-target scope. Ordinary140 coexistence,late generated adaptation,same-path aggregation and delayed adaptation remain excluded. Static full-map validation is separate from time-dependent REG retained-D checks; invalid retained D aborts before repair even without a new write. No clamp,constitution rewrite or fallback no-op hides failures. Two real phase130 EVID outputs remain independent from truth-side AAI and immutable across140; no cognitive state writer is fabricated. Fixed pulse is a controlled bridge,not general sensing or inference. All AC/D/E/F and inherited vectors retain their own evidence; no pass follows from prose. Earlier unaccepted/source-replay/old-version claims are historical; accepted D pending-source restore and later bounded factory qualification govern exact scopes. Legacy control equations remain controls,not adopted physiology. Frozen predecessor sources and failures stay separate.'}
chain=[ref(p) for p in ['docs/formal/OPEN_DECISIONS.md', 'docs/formal/PHEN_ADAPT_FIXTURE_AMENDMENT.md', 'docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md', 'docs/planning/ADAPT_001_RULE_INTERPRETER_DRAFT.md', 'docs/planning/ADAPT_001_PACKAGING_DRAFT.md', 'docs/planning/CAMPAIGN2_ADAPT_COMPOSITION_REVIEW.md', 'docs/planning/CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md', 'docs/planning/campaign3-history-early-fixture-gates-rev1/review.json', 'src/campaign2/adaptationEvaluation.ts', 'docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md']]
sections=[]
for p in notes:
 for i,line in enumerate(Path(p).read_text(encoding='utf-8').splitlines(),1):
  if line.startswith('## '):sections.append(dict(source=p,line=i,title=line,role='ACCEPTED BOUNDED CONTRACT SECTION; IMPLEMENTATION EVIDENCE SEPARATE'))

def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def refs(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):yield dict(path=v['path'],sha256=v['sha256'])
  for x in v.values():yield from refs(x)
 elif isinstance(v,list):
  for x in v:yield from refs(x)
def kind(p,q):return 'NARRATIVE'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT FIXTURE GATE SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Routing receipt remains dated planning evidence; no later source bytes substituted for a missing original. Independent adequacy remains separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='ACCEPTED ADAPT SHAPE HISTORY; AMENDED FIXTURE AND BOUNDED LATER PROOF',judgment=n,acceptanceChain=chain))
 v=Path(p).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
 for x in refs(v):bind(p,x)

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind(u['source'],u['location'].get('pointer',''))))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)

findings=[dict(id=i,owner="RO-C3-020",supported=x,blockedClaim=y,reopen=z,evidence=chain) for i,x,y,z in [('ADAPT-CLOSURE-DERIVATION', 'Logical state-route membership is independent of current writers; required EVID output closure is inhabited.', 'Empty writable permissions prove cognitive family absence or an empty output set satisfies the both-affected fixture.', 'A new family/producer requires explicit route and admission accounting.'), ('ADAPT-FIXTURE-AMENDMENT', 'Accepted four-rule fixture keeps a common nonempty applicable set and independent changed-path subset; count0 changes none,count1 allfour.', 'All evaluated targets must mutate or whole regulatory leaf-family complement alone proves isolation.', 'Any new profile must name expected paths and discriminating isolation controls.'), ('ADAPT-SNAPSHOT-COLLISION', 'Complete target collision checks precede reads/evaluators; outputs allocated in the batch after checking.', 'Deterministic event ordering is an earned biological aggregation rule or no-ops evade collision.', 'Simultaneous same-path accumulation/ordinary140 coexistence requires a new stage contract.'), ('ADAPT-BASELINE-REDUCTION', 'Five current-state leaves encode baseline by absence,with trace/history separate.', 'Equal current values imply equal behavior under arbitrary history-sensitive future consumers.', 'Identical present values and different histories must behave differently: add semantically owned retained history,not storage-presence flags.'), ('ADAPT-DOMAIN-ASSUMPTIONS', 'R0+D at exact T obeys REG bounds; scaled integer/proportional meanings are admitted ADAPT choices.', 'D alone suffices for validity,observation forces this lattice,or state keys prove universal biological proportionality.', 'New kinetics,response laws,numeric domains or biological consumer distinctions require independent experiments/contracts.'), ('ADAPT-QUALIFICATION-SCOPE', 'Later bounded factory and amended PHEN qualify finite routes/retained dependency; authored facts/fixed pulse remain controls.', 'Shape acceptance or this bookkeeping qualifies full biology,addiction,autonomous practice or runtime-born characters.', 'New producer/identity/world/body/learning profile requires its corresponding source and behavioral gates.')]]
save('findings.json',dict(status='MATERIAL DISTINCTIONS RETAINED; NO OBLIGATION CLOSED',findings=findings))
save('sections.json',dict(status='WHOLE ADAPT SHAPE SOURCES REVIEW; NO FRESH EXECUTION CLAIM',sections=sections,traceBoundary='Logical state closure and inhabited output closure differ; current-state baseline normalization does not discharge history-dependent behavior.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV312 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='ADAPT SHAPE HISTORY SCOPE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Full resolution and consolidation reviewed; exact later fixture amendment and bounded proof join retained. No runtime/test suite or original writer rerun.','Shape,allocation,amended fixture and bounded execution scopes remain separate; no new physiology or universal learning law.','No blanket later-runtime adequacy, public wrapper, family or campaign closure.'],sectionInventory=ref(O/'sections.json'),obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS ADAPT SHAPE HISTORY SCOPE ACCOUNTING',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),contractSources=2,sectionCount=len(sections),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
