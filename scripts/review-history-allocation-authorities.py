"""Reconcile foundational deterministic and observation contracts without running writers."""
from pathlib import Path
import json,hashlib,collections,itertools,re
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-allocation-authorities-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev310/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
notes={'docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md': 'Accepted frozen allocation0.2 assigns69 records260..328,18 namespaces,58 members,32 union layouts and10 finite values without changing accepted shape semantics or qualifying execution. Existing V04 is not widened by V06; direct record unions allocate no redundant wrappers. Exact NFC identity,context-specific role qualification and immutable assignments exclude aliases,ordinal meaning and fixture promotion. SemanticKind1004 corrects prior assumed allocation;Seam1036 is shared but narrows only admitting Campaign2 positions,not generic trace160 or accessor147. Regulatory parameters remain their sole map authority; PRJ collections do not create a new accessor registry. Five materialized ADAPT leaves have disjoint owner/key/value declarations; eight cognitive families remain unmaterialized. Static/domain/absence-zero equations belong to accepted E/F/REG,not new integer defaults. Read-only audit freshly passes60 specification checks including complete table parity and direct accepted observation SeamId. This is not fresh runtime/VAL/ADAPT proof. Dated NOT PASSED/OPEN statements describe allocation-stage scope; later bounded factory/OPEN_DECISIONS qualify VAL/ADAPT only in named profiles,not globally or merely by allocation.', 'docs/formal/CANONICAL_RECORD_REGISTRY.md': 'Permanent registry combines Campaign0 tuples and additive scoped successor links; it is not a complete standalone current schema listing or a qualification report. Structural Model/Run identities and complete manifests/saves remain required; ordered semantic lists are not canonical sets. Save handlers resolve from receiving model,not persisted callback authority. State patch absence uses presence bits with false padding,not a known-zero leaf; path selectors preserve order and conflicting patches reject. Introductory every-field-required wording has the explicit later type152 RecordTypeId optional exception; exact per-schema flags govern. Historical trace sets encoded as sorted lists are frozen representation,not permission to replace later cenc sets. Type170 presentation100 is removed before commitment. Observation203 provenance and token205 remain restricted controls,not general safe graph access. SEM blocked/scaffolding paragraphs are historical under explicit I.3/J closure. Campaign2 allocation is not implementation proof; later bounded gates preserve restrictions. All successor addenda retain model-specific state owners,typed profile-local occurrences and unchanged predecessor bytes. Reused namespace numbers require their admitted profile/record context and do not create cross-profile universal evidence. Counters and open-native statements are dated checkpoints,not current status. The frozen census ends at Development1508; current bytes append exactly444 bytes for Values1509..1519 allocation and bounded native closure. Preserve the original digest and exact occurrence set separately from that post-cutoff delta. Values native qualification is its own evidence and does not retroactively materialize Campaign2 Values or close wider developmental/appraisal/physical-feedback claims.'}
chain=[ref(p) for p in ['docs/formal/OPEN_DECISIONS.md', 'docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json', 'docs/formal/CAMPAIGN2_ALLOCATION_AUDIT.json', 'docs/planning/campaign3-history-base-allocation-rev1/review.json', 'docs/planning/campaign3-history-early-allocation-audits-rev1/review.json', 'docs/planning/CAMPAIGN2_BOUNDED_FACTORY_QUALIFICATION.md', 'docs/planning/campaign3-history-semantic-parent-rev1/review.json', 'docs/planning/CAMPAIGN3_VALUES_PUBLIC_QUALIFICATION.md', 'docs/formal/VALUES_PUBLIC_ALLOCATION_TABLE.json', 'docs/planning/campaign3-history-allocation-authorities-rev1/command.json', 'scripts/audit-campaign2-allocation.mjs', 'docs/planning/CAMPAIGN3_FINAL_HISTORY_GATE.md']]
actualSources={p:entries[p]["snapshot"] if ref(p)["sha256"]!=entries[p]["sha256"] else p for p in notes}
sections=[]
for p in notes:
 for i,line in enumerate(Path(actualSources[p]).read_text(encoding='utf-8').splitlines(),1):
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
 assert p in ix['unassignedCandidatePaths'] and ref(actualSources[p])['sha256']==entries[p]['sha256']
 sources.append(dict(path=p,sha256=entries[p]['sha256'],resolvedSource=ref(actualSources[p]),role='PERMANENT ALLOCATION AUTHORITY; DATED QUALIFICATION BOUNDARIES',judgment=n,acceptanceChain=chain))
 v=Path(actualSources[p]).read_text(encoding='utf-8-sig') if p.endswith('.md') else load(p);leaves.extend(dict(source=p,pointer=q,text=x,role=kind(p,q)) for q,x in walk(v))
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

rp='docs/formal/CANONICAL_RECORD_REGISTRY.md'
old=Path(actualSources[rp]).read_bytes();current=Path(rp).read_bytes()
assert current.startswith(old) and len(current)-len(old)==444
snapshot=O/'CANONICAL_RECORD_REGISTRY_CURRENT.md';assert snapshot.read_bytes()==current
preserved.append(dict(**ref(snapshot),method='EXACT CURRENT REGISTRY SNAPSHOT; ORIGINAL CENSUS RETAINED SEPARATELY'))
linked=[]
roles={x['path']:x for x in ix['roleAssignments']}
for name in sorted(set(re.findall(r'[A-Z][A-Z0-9_]+(?:ALLOCATION_TABLE|ALLOCATION)\.json',old.decode('utf-8')))):
 q='docs/formal/'+name
 assert q in roles,q
 linked.append(dict(source=ref(q),priorRole=roles[q]))
save('registry-delta.json',dict(status='EXACT APPEND-ONLY POST-CUTOFF DELTA',original=ref(actualSources[rp]),current=ref(snapshot),appendBytes=444,appendText=current[len(old):].decode('utf-8'),qualification=ref('docs/planning/CAMPAIGN3_VALUES_PUBLIC_QUALIFICATION.md'),linkedAllocationRoles=linked,scope='Source-role join,not new verification of each linked allocation or qualification.'))
save('sections.json',dict(status='WHOLE TWO-CONTRACT SCOPE REVIEW; NO FRESH EXECUTION CLAIM',sections=sections,traceBoundary='Permanent allocation does not qualify execution; original census registry and exact later Values addition remain separate.'))
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV310 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='ALLOCATION AUTHORITY SCOPE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),limits=['Full allocation document and original registry reviewed; exact appended Values delta reviewed separately. Fresh60-check specification audit only; no runtime qualification rerun.','Original census registry digest is preserved; current444-byte Values appendix is separately bound to native qualification.','No blanket later-runtime adequacy, public wrapper, family or campaign closure.'],sectionInventory=ref(O/'sections.json'),obligations=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS ALLOCATION AUTHORITY SCOPE ACCOUNTING',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),contractSources=2,sectionCount=len(sections),review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
