"""Verify the new exit disposition without rewriting any predecessor receipt."""
from pathlib import Path
from functools import cache
import hashlib,json,sys
P=Path('docs/planning');O=P/'campaign3-values-exit-refresh-rev1'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
@cache
def sha(name):
 h=hashlib.sha256()
 with Path(name).open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
review=load(O/'review.json');inventory=load(O/'inventory.json');baseline=load(P/'campaign3-hq012-freshness-rev1/inventory.json')
assert review['status']=='BOUNDED CAMPAIGN3 EXIT ACCEPTED; VALIDATION REQUIRED' and not review['pending']
assert len(review['gates'])==3 and all(g['status']=='CLOSED BOUNDED' for g in review['gates'])
old={x['path']:x for x in baseline['entries']};current={x['path']:x for x in inventory['entries']}
files=set(Path('.').glob('*.md'))
for folder in ['docs/planning','docs/formal','reference']:files.update(p for p in Path(folder).rglob('*') if p.is_file() and p.suffix.lower() in ['.md','.json'])
files={p.as_posix() for p in files if not any(p.as_posix().startswith(x) for x in inventory['excludedPrefixes'])}
assert files==set(current),'source universe changed after freeze'
for name,x in current.items():
 assert sha(name)==x['sha256'],name
 prior=old.get(name);expected='ADDED' if prior is None else 'UNCHANGED' if prior['sha256']==x['sha256'] else 'CHANGED'
 assert x['change']==expected,name
assert not inventory['missing'] and all(Path(p).exists() for p in old)
delta={x['path'] for x in current.values() if x['change']!='UNCHANGED'}
assert delta=={x['source']['path'] for x in review['deltaDispositions']}
assert all(x['disposition'] and x['obligations'] for x in review['deltaDispositions'])
aliases={}
for x in load(O/'prior-sources.json'):
 assert sha(x['snapshot'])==x['sha256'];aliases[(x['path'],x['sha256'])]=x['snapshot']
recovered=load(O/'registry-byte-recovery.json');assert sha(recovered['snapshot'])==recovered['sha256']==old[recovered['path']]['sha256'];aliases[(recovered['path'],recovered['sha256'])]=recovered['snapshot']
for name in ['docs/planning/VERDICT_LEDGER.md','CharacterLab — Reference Architecture Build & Research Campaign Plan.md']:
 saved=next(x for x in load(O/'prior-sources.json') if x['path']==name);assert Path(name).read_bytes().startswith(Path(saved['snapshot']).read_bytes()),name
assert Path(recovered['path']).read_text(encoding='utf-8').startswith(Path(recovered['snapshot']).read_text(encoding='utf-8'))
before=O/'prior-sources/CURRENT.md';assert before.read_bytes() in (P/'CAMPAIGN3_LOG.md').read_bytes()
checked=set()
def refs(v,allow_prior=False):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):
   name=v['path'];actual=sha(name)
   if actual!=v['sha256']:
    assert allow_prior and (name,v['sha256']) in aliases,(name,'unaccounted historical source drift')
    assert sha(aliases[(name,v['sha256'])])==v['sha256']
   checked.add((name,v['sha256']))
  for x in v.values():refs(x,allow_prior)
 elif isinstance(v,list):
  for x in v:refs(x,allow_prior)
refs(review)
for name in ['corpus','families','open-gates','review','freshness-disposition']:
 refs(load(P/'campaign3-hq012-exit-review-rev1'/f'{name}.json'),True)
corpus=load(P/'campaign3-hq012-exit-review-rev1/corpus.json');families=load(P/'campaign3-hq012-exit-review-rev1/families.json');a=load(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json')
assert len(corpus['members'])==21 and corpus['mandatoryCount']==9
for member,prior in zip(corpus['members'],a['corpus']['members']):assert member['id']==prior['id'] and member['requirements']==prior['clauses'] and member['disposition']=='ACCEPTED PRIOR QUALIFICATION IN DECLARED SCOPE'
assert len(families['families'])==15
assert sum(len(f['clauses']) for f in families['families'])==132
for family,prior in zip(families['families'],a['brief']['families']):assert family['clauses']==prior['clauses']
registry=load(P/'RESEARCH_OBLIGATIONS.json');registered={x['path'] for x in registry['reportReviews']}
assert sum(o['status']=='ACTIVE' for o in registry['obligations'])==0
assert sum(o['status']=='CONDITIONAL' for o in registry['obligations'])==18
assert sum(o['status']=='CLOSED' for o in registry['obligations'])==4
for id in ['RO-C3-019','RO-C3-021']:
 o=next(o for o in registry['obligations'] if o['id']==id);assert o['closure']['disposition']=='RETAINED_DISTINCTION'
for p in [*O.rglob('*'),*(P/'values-integration-matrix-rev1').glob('*'),*(P/'values-integration-development-rev1').glob('*')]:
 if p.is_file():assert p.stat().st_size<50_000_000,p
for p in [O/'inventory.json',O/'review.json',O/'validation.json',P/'CAMPAIGN3_VALUES_INTEGRATION_QUALIFICATION.md',P/'CAMPAIGN3_VALUES_EXIT_REFRESH.md']:assert p.as_posix() in registered,p
closure=load(P/'values-integration-matrix-rev1/closure.json');assert closure['status']=='PASS' and closure['prefixes']==625
refs(closure)
terminal=[p for p in O.rglob('*') if p.is_file() and p.name!='validation.json']
result={'status':'PASS BOUNDED CAMPAIGN3 EXIT ACCEPTANCE','canonicalFiles':len(current),'deltaDispositions':len(delta),'boundPriorReferences':len(checked),'members':21,'families':15,'clauses':132,'verdicts':109,'valuesRuns':125,'valuesPrefixes':625,'producers':56,'factories':59,'active':0,'conditional':18,'closed':4,'unowned':0,'sourceRestrictionsRetained':208,'counters':{'highestAllocated':1529,'sinceVerdict':0},'terminalEvidence':[{'path':p.as_posix(),'sha256':sha(p.as_posix())} for p in sorted(terminal)],'checks':[{'path':p,'sha256':sha(p)} for p in ['scripts/record-values-integration-closure.py','scripts/record-values-exit-refresh.py','scripts/check-values-exit-refresh.py','scripts/check-values-integration-matrix.mjs','scripts/check-values-integration-wrapper-extension.mjs','scripts/values-integration-predecessor-inventory-loader.mjs']]}
out=O/'validation.json'
if '--write' in sys.argv:
 assert not out.exists();out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
else:assert load(out)==result,'validation drift'
print(json.dumps({k:v for k,v in result.items() if k not in ['terminalEvidence','checks']}))
