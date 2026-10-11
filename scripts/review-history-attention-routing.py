"""Reconcile dated review/routing claims without inventing unavailable source bytes."""
from pathlib import Path
import json,hashlib,re
P=Path('docs/planning');O=P/'campaign3-history-attention-routing-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
prior=load(P/'campaign3-history-source-roles-rev131/index.json');known={x['path']:x for x in prior['roleAssignments']};archives={x['sha256']:x['path'] for x in prior['explicitBackingOutsideProseManifest']}
specs={
 'docs/planning/CAMPAIGN3_POST_EMB_ATTENTION_REVIEW_REV1.json':'Dated initial documentation self-review: fourteen AT-A vectors NOT PASSED, BODY/MULTISOURCE partial and ATTENTION blocked then. Six explicit corrections preserve chronology, residual-vs-capacity, missing role, identity tie limits, encoding separation and heterogeneous evidence burden. Original44 link count and docs-only git diff are historical observations, not rerun/current facts. Two cited mutable prose snapshots unavailable; exact source identities retained without alias.',
 'docs/planning/ATTENTION_CLOSURE_REVIEW_REV2.json':'Dated forward self-review: eight SEM checks support supported-role expressibility, not fourteen AT2 vectors. Five findings and three pending shape gates map to preserved proposals, later exact shape/allocation and bounded public qualification. Original41 link count depends on unavailable CURRENT snapshot; excluded from scientific acceptance. No external review, runtime verdict or retroactive initial residual qualification.',
 'docs/planning/CAMPAIGN3_POST_EMB_COVERAGE.md':'Preserved later coverage reconciliation after bounded EMB and public attention: active selection partial, no encoding/probe from selection; independent same-option grounds not heterogeneous same-fact normalization; three-basis aggregate component not public vocabulary. Authored reference not body, support-only SEM not learned evidence. Historical corpus0.27 and blocked labels describe this checkpoint, not current exit state. Earlier receipt names another hash; current bytes are separately reviewed, never claimed identical. EMB/MULTISOURCE claim spine still needs its own full audit.'
}
assert not set(specs)&set(known)
initial=load(P/'CAMPAIGN3_POST_EMB_ATTENTION_REVIEW_REV1.json');later=load(P/'ATTENTION_CLOSURE_REVIEW_REV2.json')
assert initial['vectors']==[dict(id='AT-'+chr(65+i),status='NOT PASSED') for i in range(14)]
assert later['vectors']==[dict(id='AT2-'+chr(65+i),status='NOT PASSED') for i in range(14)]
assert re.findall(r'^\| (AT-[A-Z]) ',(P/'CAMPAIGN3_ATTENTION_DRAFT.md').read_text(),re.M)==[x['id'] for x in initial['vectors']]
assert re.findall(r'^\| (AT2-[A-Z]) ',(P/'CAMPAIGN3_ATTENTION_CLOSURE_REV2.md').read_text(),re.M)==[x['id'] for x in later['vectors']]
assert len(initial['selfReviewCorrections'])==6 and len(later['findings'])==5 and len(later['remainingGates'])==3 and later['componentChecks']==8
assert all(p.startswith('docs/') for p in initial['changedTrackedFiles'])
search=load(O/'local-history-search.json');assert len(search['rows'])==35 and not search['matches']
seed=load(O/'seed-admission.json');assert seed['status']=='PASS' and seed['acceptedSeedBytes']==32 and [x['length'] for x in seed['rejected']]==[0,4,31,33]
assert all(x['message']=='run seed must be exactly 32 bytes' for x in seed['rejected'])
for f in seed['sources']:assert ref(f['path'])==f
bindings=[];missing=[]
for p,fields in [(P/'CAMPAIGN3_POST_EMB_ATTENTION_REVIEW_REV1.json',['documents','inspectedSource']),(P/'ATTENTION_CLOSURE_REVIEW_REV2.json',['evidence'])]:
 for key in fields:
  for a in load(p)[key]:
   resolved=a['path'] if ref(a['path'])['sha256']==a['sha256'] else archives.get(a['sha256'])
   row=dict(source=p.as_posix(),originalPath=a['path'],sha256=a['sha256'])
   if resolved:
    assert ref(resolved)['sha256']==a['sha256'];bindings.append(dict(**row,resolvedPath=resolved))
   else:missing.append(row)
assert len(bindings)==16 and len(missing)==3 and {x['originalPath'] for x in missing}=={'docs/planning/CURRENT.md','docs/planning/CAMPAIGN3_POST_EMB_COVERAGE.md'}
emb=load(P/'CAMPAIGN3_EMBODIED_QUALIFICATION.json');preserved=emb['evidence']+emb['verifiedFingerprints']+[emb['script']];assert len(preserved)==453
for a in preserved:
 resolved=a['path'] if ref(a['path'])['sha256']==a['sha256'] else archives.get(a['sha256'])
 assert resolved and ref(resolved)['sha256']==a['sha256'];bindings.append(dict(source='docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json',originalPath=a['path'],sha256=a['sha256'],resolvedPath=resolved))
incomplete=load(P/'attention-model-review-rev1/INCOMPLETE.json');assert incomplete['sourceHash']=='545c132e438dde5c57c2d263c0612bfb7507c5682527791a7f8376db89fd1a77' and 'path' not in incomplete
dispositions=[]
for a in missing:
 current=a['originalPath'].endswith('/CURRENT.md')
 dispositions.append(dict(**a,disposition='UNAVAILABLE HISTORICAL REFERENCE; EXCLUDED FROM CURRENT ACCEPTANCE CHAIN',reason='Original review script uses this file only for local-link enumeration and fingerprinting. Its scientific findings/vectors are explicit in the preserved receipt and reviewed draft. No assertion that every unseen historical paragraph is recovered.' if current else 'Earlier mutable coverage version was fingerprinted for a documentation checkpoint. Current coverage prose is a distinct source, reviewed on its own and cross-referenced to exact qualified claim artifacts. No exact alias or full recovery claim.',blockedClaim='Exact old link-count reproduction and whole historical prose reconstruction remain unverified; neither supports runtime or scientific acceptance.',reopen='Historical exact bytes become available or a substantive claim depends on content unique to this missing version.',owner='RO-C3-021'))
dispositions.append(dict(source='docs/planning/attention-model-review-rev1/INCOMPLETE.json',sha256=incomplete['sourceHash'],disposition='UNATTRIBUTED HASH RETAINED; NOT USED AS AUTHENTICATED SCRIPT EVIDENCE',reason='Receipt gives no path. Local plausible materializer-path search did not match. Twelve partial images and failure report remain preserved; current factory independently rejects four-byte seeds. This does not authenticate the old failure execution.',blockedClaim='Exact failing script/source history remains unverified. Current seed admission is separately demonstrated.',reopen='Authenticated original bytes or an actual path mapping is supplied, or source-level attribution of the old failure is required.',owner='RO-C3-021'))
chain=[ref(O/'local-history-search.json'),ref(O/'seed-admission.json')]+[ref(P/n) for n in ['campaign3-history-attention-construction-rev1/review.json','campaign3-history-attention-public-rev1/review.json','campaign3-history-attention-declarations-rev1/review.json']]+[ref('scripts/'+n) for n in ['review-post-emb-attention-draft.mjs','review-attention-closure-rev2.mjs']]
entries={e['path']:e for e in load(B/'manifest.json')['entries']};roles=[];strings={}
for p,j in specs.items():
 assert ref(p)['sha256']==entries[p]['sha256'];roles.append(dict(**ref(p),role='DATED ATTENTION REVIEW / COVERAGE / ROUTING',judgment=j,acceptanceChain=chain))
 if p.endswith('.json'):
  for ptr,s in walk(load(p)):strings[p,ptr]=s
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  assert u['sourceSha256']==entries[u['source']]['sha256'];ptr=u['location'].get('pointer','')
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or ptr.startswith(('/status','/reviewer','/findings','/remainingGates','/limits','/coverage','/openShapeGates','/selfReviewCorrections'))
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='DATED REVIEWS RECONCILED; UNAVAILABLE HASHES EXPLICITLY EXCLUDED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),preservedArtifacts=[],bindings=bindings,unavailableSourceDispositions=dispositions,obligations=['RO-C3-001','RO-C3-004','RO-C3-006','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No reconstruction or alias of unavailable old CURRENT/coverage bytes. Original link counts and historical docs-only diff not rerun or accepted as scientific proof.','35 local exact-path versions searched without matches; no global/unreachable/renamed-history exhaustion claim.','Fresh seed-length admission:32 accepted with exact frozen RunIdentity,0/4/31/33 rejected. No settlement or replay of the original failed materializer.','Scientific distinctions map to already-reviewed drafts/component/public evidence; full underlying EMB/receiving/MULTISOURCE claim-spine review remains next. No broader intake or exit promotion.'])
c=dict(status='PASS WITH EXPLICIT SOURCE EXCLUSIONS; HQ011 OPEN',sources=len(specs),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=len(bindings),unavailableBindings=len(missing),unattributedHashes=1,checker=ref(__file__))
for n,v in [('review.json',r),('check.json',c)]:
 p=O/n
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
