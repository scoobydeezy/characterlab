"""Reconcile historical build receipts without manufacturing fresh execution."""
from pathlib import Path
import json,hashlib,collections,subprocess
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-adapt-parent-pair-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def walk(v,p=''):
 if isinstance(v,str):yield p,v
 elif isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k.replace('~','~0').replace('/','~1'))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
def objects(v,p=''):
 if isinstance(v,dict):
  yield p,v
  for k,x in v.items():yield from objects(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from objects(x,p+'/'+str(i))
def narrative(p):return any(k in p.split('/') for k in ['status','scope','checks','limitations','amendment','existingWitness','researchVerdict','explanation','recommendation','promotionKind','disposition','aliasing'])
ip=P/'campaign3-history-source-roles-rev208/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
notes={
'CAMPAIGN2_ADAPT_PARENT_PAIR_PROOF.json':'Accepted bounded same-S0 count0/1 parent witness.52 recorded check labels include repeated allocator checks,not52 independent phenomena. Stored canonical bytes freshly verify sole authored-count input change,four body leaves versus absence,exact D diff/read,preserved earlier leaves plus one episode,measurement5 versus51/10 nested203/337/342/345 and352 recall.21-event topology/allocator bytes match. Exposure and probe remain independent roots;recall parent is carriage,not formation. Eight-family closure is recorded but not independently rederived from stored report;full traces,random addresses and saves absent,so claimed hidden interval,no random draws and original-S0 restore remain historical accepted harness evidence,not freshly verified here. Report has no complete executable source fingerprint manifest;current helper reading is explanatory,not recovery of original source identity.',
'CAMPAIGN2_PHEN_ADAPT_CONSOLIDATION_REVIEW.md':'Forward sequence preserves submitted control9 acceptance,fixture conflict,explicit accepted correction and final approved promotion. Frozen model has four independent single-path rules,not one multileaf rule;concrete freeze did not repeal one-rule fixture authority. Same rule set plus independently authored changed-path set and distinguished D-only read resolve specification mismatch without runtime change. Control3 leaf-family complement is non-discriminating;exact keys/paths,WRT/collision controls retain isolation.34focused tests and later assertion runner not fresh full599test suite. Omniscient state-dependency joins never become hidden character evidence or invented scheduler ancestry. Bounded PHEN-ADAPT acceptance is not PHEN-MEM,whole ADAPT/factory/VAL or Campaign2 completion.',
'PHEN_ADAPT_ACCEPTANCE_AND_CORPUS_VERSION_REVIEW.md':'Opening resolution and final accepted promotion supersede retained pending-owner prose. Exact member version string changes174field2,so1.11.0-draft and1.11.0 have distinct canonical bytes/digests. Aggregate corpus version is external label and cannot make them aliases. No architectural choice remains open here. Four-rule same-S0 fixture and control3 non-discrimination remain bounded;no arbitrary N-rule qualification.',
'PHEN_ADAPT_FIXTURE_AMENDMENT_AUDIT.json':'Historical specification/manifest-only audit;pending acceptance label is superseded forward,not rewritten. Freshly recompile ten members for old1.10 and proposed1.11draft reproduces exact stored bytes/digests. Script only checked presence of three parent-pair labels,not reexecuted behavior. Zero runtime/model/allocation deltas preserved;old0.26 commitment remains historical.',
'PHEN_ADAPT_CORPUS_PROMOTION_REVIEW.json':'Historical version/digest conflict receipt. Fresh exact compilation reproduces reviewed draft and requested suffix-free commitments with nine other members unchanged. Review is superseded by accepted promotion;recommendation is not a pending ruling. Historical reviewed draft is neither invalid nor current nor an alias.',
'PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json':'Historical accepted/frozen0.27 corpus,not current0.29 campaign corpus. Exact accepted bytes/digest recompiled;two historical artifact hashes match. Approved status/version promotion changes no semantics/model/runtime/allocation. Original audit/review retained byte-for-byte;no new promotion or research verdict.'}
notes={(P/n).as_posix():v for n,v in notes.items()};assert len(notes)==6
O.mkdir(exist_ok=True)
result=subprocess.run(['node','scripts/check-history-adapt-parent-pair.mjs'],capture_output=True,text=True,encoding='utf-8');assert result.returncode==0,result.stderr
verified=json.loads(result.stdout);assert verified['timelines']==2 and verified['manifests']==3
save('stored-check.json',dict(**verified,checker=ref('scripts/check-history-adapt-parent-pair.mjs'),readerSources=[ref(x) for x in ['src/campaign2/memoryCodecs.ts','src/substrate/canonicalEncoding.ts','src/substrate/state.ts','src/substrate/contentManifest.ts']],scopeNote='Current decoder/compiler read-only check; these are not historical runtime source bindings or full transitive dependency manifests.'))
chain=[ref(P/'../formal/PHEN_ADAPT_FIXTURE_AMENDMENT.md'),ref(P/'PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json')]
sources=[];leaves=[];rows=[];counts=collections.Counter()
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='HISTORICAL BOUNDED PARENT WITNESS / ACCEPTED FIXTURE ALIGNMENT / CORPUS PROMOTION',judgment=n,acceptanceChain=chain))
 if p.endswith('.json'):leaves.extend(dict(source=p,pointer=q,text=t,role='NARRATIVE' if narrative(q) else 'BACKING') for q,t in walk(load(p)))
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];kind='NARRATIVE' if u['source'].endswith('.md') or narrative(u['location']['pointer']) else 'BACKING';counts[kind]+=1
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category=kind))
assert len({r['occurrenceId'] for r in rows})==len(rows)
save('schema.json',dict(shortStringsIncluded=True,leaves=leaves,scope='Every JSON string leaf including short status,counts-as-text,canonical hex and commitment values.'))
save('review.json',dict(status='SIX PARENT-PAIR AND PROMOTION SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],schema=ref(O/'schema.json'),storedCheck=ref(O/'stored-check.json'),limits=['Stored joins do not reexecute every52 historical check,original-S0 replay or full trace/random evidence.','Current helper is explanatory;no original complete executable identity inferred. Accepted bounded witness retained with report limits.','No historical writer,runtime,test or build rerun. No new corpus promotion,verdict,allocation or obligation status change.','All prior exact-source gaps and independent adequacy remain open.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS SCOPED PARENT/COMMITMENT REVIEW',sources=len(sources),originalNarrativeOccurrences=counts['NARRATIVE'],originalBackingOccurrences=counts['BACKING'],stringLeaves=len(leaves),storedTimelines=2,exactManifestCompilations=3,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
