"""Reconcile identity feedback ablation lineage and freeze without running writers."""
from pathlib import Path
import json,hashlib,collections,re,itertools
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-identity-ablation-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
ip=P/'campaign3-history-source-roles-rev298/index.json';ix=load(ip)
entries={e['path']:e for e in load(B/'manifest.json')['entries']}
archives={x['sha256']:x['path'] for x in ix['explicitBackingOutsideProseManifest']+ix['roleAssignments']+list(entries.values())}
names=['CAMPAIGN3_IDENTITY_ABLATION_REVIEW_REV1.json','CAMPAIGN3_IDENTITY_ABLATION_REVIEW_REV2.json','CAMPAIGN3_IDENTITY_ABLATION_SUMMARY.json'];a,b,c=[load(P/n) for n in names]
pc=load(O/'packet-check.json');assert pc['status']=='PASS READ-ONLY IDENTITY ABLATION' and pc['checkerSha256']==ref('scripts/check-history-identity-ablation.mjs')['sha256']
assert a['results']==[{k:v for k,v in r.items() if k!='prefixes'} for r in b['results']]
assert a['component']==b['component'] and a['intervention']==b['intervention'] and a['limits']==b['limits']
assert len(a['results'])==12 and len(b['component'])==16 and sum(x['changed'] for x in b['component'])==9
assert all(len(r['prefixes'])==8 for r in b['results'])
assert [x['seed'] for x in b['pairs']]==list(range(4)) and pc['summaryRows']==c['results']
for x in c['results']:
 assert x['historyEntriesPreservedBeforeProbe']==3 and x['priorEntriesRemainByteIdenticalAfterProbe'] and x['sharedAddresses']==6
 assert [p['probability'] for p in x['intact']['probabilities']]==['1/2','1/2'] and [p['probability'] for p in x['ablated']['probabilities']]==['0/1','1/1']
notes={
(P/names[0]).as_posix():'Initial identity feedback review:12 stored runs across baseline/standing-access-off/standing-integer and four seeds; final state/history/draw arrays differ. Initial all-final equality summaries do not prove old history was deleted or random coupling failed. Same results/component rows retained inREV2, which adds matched pre-probe evidence. Generated-source compiler/analyzer contrasts are separate from public gate ablation; no predetermined RETAINED verdict or whole biography claim.',
(P/names[1]).as_posix():'Strengthened same-result review:96 stored prefix snapshots, not96 restores. Four public pairs have equal state/history before6 and first three decisions. Six shared addresses per pair retain identical complete draw records; full arrays differ legitimately after mode/choice divergence. Three old identity entries survive intact through final history. At6 baseline player-facing1/2,1/2 versus ablated Auto0,1; seed0 same choice while1..3 differ. Integer standing modifiers are zero but standing changes reason activation.16 generated-source comparisons yield9 changes and7 equalities; they are pure operand interventions, not a new combined public recipe. Four seeds/six originals bound scope.',
(P/names[2]).as_posix():'Decoded summary rederived read-only from stored prefixes/history/decision/draw bytes. Retained old entries differ from legitimate later new entries; whole final history inequality is not erasure. Seed0 choice equality does not erase distribution/mode differences. Full draw records at shared addresses prove bounded coupling, not identical total arrays or general calibration. Whole PHEN-BIO remains open at this checkpoint; no identity retraction or general early-history necessity follows.'}
chain=[ref(P/n) for n in ['CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md','CAMPAIGN3_ENTRY_READINESS.md','CAMPAIGN3_FINAL_HISTORY_GATE.md']]
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
def kind(p,q):
 return 'BACKING' if q.startswith(('/sourceFingerprints/','/source/','/script/')) or q.endswith(('/modelDigest','/state')) or '/actualDraws/' in q or '/choices/' in q or '/history/' in q or '/probabilities/' in q and q.endswith('/0') else 'NARRATIVE'
sources=[];leaves=[];bindings=[];gaps=[];preserved=[];back={x['path'] for x in ix['explicitBackingOutsideProseManifest']}
def bind(p,x):
 actual=x['path'] if Path(x['path']).exists() and ref(x['path'])['sha256']==x['sha256'] else archives.get(x['sha256'])
 if actual and Path(actual).exists() and ref(actual)['sha256']==x['sha256']:
  bindings.append(dict(receipt=p,original=x,actual=ref(actual)))
  if actual not in entries and actual not in back:
   preserved.append(dict(**ref(actual),method='EXISTING EXACT IDENTITY ABLATION SOURCE OR CANONICAL BACKING; NO COPY'));back.add(actual)
 else:gaps.append(dict(receipt=p,original=x,disposition='Exact historical bytes not recovered from named current path, indexed backing or census hashes. Declaration receipt remains historical evidence; no fresh source-exact construction rerun claimed. Model byte consistency and later runtime qualification are separate.'))
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='BOUNDED IDENTITY FEEDBACK EXPERIMENT; PUBLIC AND COMPONENT SCOPE DISTINCT',judgment=n,acceptanceChain=chain))
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

save('schema.json',dict(shortStringsIncluded=True,leaves=leaves))
save('unresolved.json',dict(searchScope='Current named paths, REV298 backing and all census/role hashes; no global absence claim.',gaps=gaps))
save('review.json',dict(status='IDENTITY ABLATION LINEAGE RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,exactBindings=bindings,preservedArtifacts=preserved,schema=ref(O/'schema.json'),unresolved=ref(O/'unresolved.json'),packetCheck=ref(O/'packet-check.json'),limits=['Read-only decoding verifies stored matched prefixes/draws/history and summary; no original runtime or writer rerun.','Full traces/final arrays may differ despite old-prefix equality. Pure generated-source contrasts remain component scope.','Four seeds/six originals do not qualify whole biography, general identity necessity or calibrated equivalence. Independent adequacy open.'],obligations=['RO-C3-008','RO-C3-013','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS IDENTITY ABLATION ACCOUNTING; SOURCE GAPS EXPLICIT',sources=len(sources),originalNarrativeOccurrences=sum(r['category']=='NARRATIVE' for r in rows),originalBackingOccurrences=sum(r['category']=='BACKING' for r in rows),stringLeaves=len(leaves),exactBindings=len(bindings),unresolvedBindings=len(gaps),distinctMissingPairs=len({(x['original']['path'],x['original']['sha256']) for x in gaps}),newBackingResources=len(preserved),publicPairs=4,storedRuns=12,storedPrefixSnapshots=96,componentComparisons=16,review=ref(O/'review.json')))
assert all(p.stat().st_size<50000000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
