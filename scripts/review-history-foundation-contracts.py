"""Reconcile foundational deterministic and observation contracts without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-foundation-contracts-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev307/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
notes={
'docs/formal/DETERMINISTIC_SUBSTRATE.md':'Accepted substrate/0.2-candidate retains immutable candidate identifier and separates structural Model/Run from Experiment/Comparison identities. Digest commitments require complete manifests; hash equality is not structural or timing proof. Save/trace schemas can change representation without a new model only when semantics do not change. Exact scalar units/domains/rounding/failure, permanent cenc1 tags/fields, canonical collection order and rejection prevent representation defaults becoming psychology. Addressed randomness excludes model/corpus/order/prior draws; explicit injective purpose-compatible coupling is authoritative run input. Two rejection attempts plus fresh modulo fallback have conditional ideal-candidate bounds,not proof of SHA256 uniformity. Positive weights/span through2^32 remain bounded. Time uses checked nonnegative Int64 instants,sign-correct floor/remainders,nonmutating queries and materialize-mutate-reanchor T-forward semantics; nonlinear algorithms need separate exact/versioned error and partition contracts. Section7 pending TIME001/MATH001 prose is historical,superseded by section9 and OPEN_DECISIONS closure. Full canonical continuation and comparison remain mandatory; later wrapper metadata barriers are separate qualification. No psychological law or blanket later implementation PASS follows.',
'docs/formal/OBSERVATION_AND_EVIDENCE.md':'Accepted observation/0.1-candidate closes MATH006 only for exact known-bound signed scalar channels and deterministic missingness. Applied/Overflow decomposition is validated,but classification uses observed delta/bounds/polarity,not hidden overflow. Increase-at-upper and decrease-at-lower emit directional bounds including zero; Signed zero-at-boundary rejects. ExactEffectControl is explicitly omniscient experiment control,not default evidence. Point/bound/missing remain distinct; no persistent cognition writes or stochastic/noisy/uncertain-bound inference is admitted. Restricted visible-slot earliest-wins token dedup needs channel-established identity and cannot express general multi-role event bindings or recognition. SafeSourceReferences truth handle is accepted only in single-effect fixture; it does not prove cross-event unlinkability. The actual-read provenance paragraph is constrained by closed evidence schema,forbidden truth paths and omniscient trace ownership; it is not authorization to publish raw truth paths into cognition. SEM001 and later source admission own general bindings/reference replacement. Earlier phase10/current and120/consequence statements remain this dated profile,not an override of accepted later lane contracts. Five forbidden comparators,exact structural equality and all mode/polarity/visibility/precision/timing/reference reopen conditions remain preserved.'}
chain=[ref(p) for p in ['docs/formal/OPEN_DECISIONS.md','docs/formal/CONFORMANCE_VECTORS.md','docs/formal/CAMPAIGN1_CONFORMANCE_VECTORS.md','docs/planning/campaign3-history-foundation-decisions-rev1/review.json','docs/planning/campaign3-history-early-fixture-gates-rev1/review.json','docs/planning/campaign3-history-substrate-observation-controls-rev1/review.json','docs/planning/CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md','docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md']]
sections=[]
for p in notes:
 for i,line in enumerate(Path(p).read_text(encoding='utf-8').splitlines(),1):
  if line.startswith('## '):sections.append(dict(source=p,line=i,title=line,role='ACCEPTED BOUNDED CONTRACT SECTION; IMPLEMENTATION EVIDENCE SEPARATE'))
assert len([x for x in sections if x['source'].endswith('DETERMINISTIC_SUBSTRATE.md')])==9

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
 sources.append(dict(**ref(p),role='ACCEPTED FOUNDATION CONTRACT; BOUNDED SEMANTICS AND REOPEN CONDITIONS',judgment=n,acceptanceChain=chain))
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

save('sections.json',dict(status='WHOLE TWO-CONTRACT SCOPE REVIEW; NO FRESH EXECUTION CLAIM',sections=sections,traceBoundary='Actual producer reads belong to omniscient instrumentation; closed permitted-evidence schema and single-effect reference limit constrain provenance wording.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV307 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='FOUNDATION CONTRACT SCOPE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Full contract text and accepted decisions reviewed; no runtime/test suite or original writer rerun.','Historical pending time sentence is superseded explicitly by accepted closure; candidate identifiers remain unchanged.','No blanket later-runtime adequacy, public wrapper, family or campaign closure.'],sectionInventory=ref(O/'sections.json'),obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS FOUNDATION CONTRACT SCOPE ACCOUNTING',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),contractSources=2,sectionCount=len(sections),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
