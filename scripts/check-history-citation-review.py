"""Validate citation accounting and byte provenance, not scientific adequacy."""
from pathlib import Path
import json,hashlib,copy
p=Path('docs/planning'); b=p/'campaign3-history-universe-rev1'; out=p/'campaign3-history-citation-review-rev1'
def load(f): return json.loads(f.read_text(encoding='utf-8-sig'))
def sha(f): return hashlib.sha256(f.read_bytes()).hexdigest()
r=load(out/'review.json'); old=load(Path(r['predecessor']['path']))
assert sha(Path(r['predecessor']['path']))==r['predecessor']['sha256']
assert sha(b/'manifest.json')==r['manifestSha256']
assert sha(Path('scripts/reconcile-history-citations.py'))==r['methodSha256']
entries={e['path']:e for e in load(b/'manifest.json')['entries']}
def key(x): return (x['source'],x['line'],x['raw'])
original={key(x):x for x in old['references']}
def validate(rows):
 assert len(rows)==len(original)==44
 assert len({key(x) for x in rows})==44
 assert {key(x) for x in rows}==set(original)
 for x in rows:
  assert x['sourceSha256']==original[key(x)]['sourceSha256']
  snapshot=b/'sources'/x['source']; assert sha(snapshot)==x['sourceSha256']
  lines=snapshot.read_text(encoding='utf-8-sig').splitlines(keepends=True)
  assert x['context']==''.join(lines[max(0,x['line']-2):x['line']+1])
  assert x['rationale'] and x['obligation']=='RO-C3-021'
  if x['disposition'].startswith('RESOLVED'):
   assert x['resolvedTargets'] or x['disposition']=='RESOLVED NAMING CONVENTION'
  else:
   assert x['disposition'] in ['EXTERNAL HISTORICAL PROVENANCE UNRESOLVED','LEGACY SOURCE UNLOCATED']
   assert not x['resolvedTargets']
  for t in x['resolvedTargets']:
   assert entries[t['path']]['sha256']==t['sha256']==sha(Path(t['path']))
 assert sum(x['disposition'].startswith('RESOLVED') for x in rows)==39
 assert sum(x['disposition']=='EXTERNAL HISTORICAL PROVENANCE UNRESOLVED' for x in rows)==4
validate(r['references'])
e=r['externalSource']; assert sha(Path(e['path']))==e['sha256'] and e['gitBlob'] is None
assert e['historicalLookup']['exitCode']!=0
assert sha(Path(r['externalUnits']['path']))==r['externalUnits']['sha256']
units=load(Path(r['externalUnits']['path'])); lines=Path(e['path']).read_text(encoding='utf-8-sig').splitlines(keepends=True)
assert len(units)==r['externalUnits']['count']==343
for u in units:
 assert u['text']==''.join(lines[u['startLine']-1:u['endLine']]) and u['review']=='UNREVIEWED'
 assert u['sourceSha256']==e['sha256']
 identity={k:v for k,v in u.items() if k!='id'}
 assert u['id']==hashlib.sha256(json.dumps([e['path'],identity],ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
faults=[]
for mode in ['omission','duplicate','wrong-context','wrong-source-hash','false-external-resolution']:
 rows=copy.deepcopy(r['references'])
 if mode=='omission': rows.pop()
 elif mode=='duplicate': rows[-1]=rows[0]
 elif mode=='wrong-context': rows[0]['context']='altered'
 elif mode=='wrong-source-hash': rows[0]['sourceSha256']='0'*64
 else: rows[0]['disposition']='RESOLVED CITATION ONLY'
 try: validate(rows)
 except AssertionError: faults.append(mode)
 else: raise AssertionError('Undetected fault:'+mode)
receipt={'status':'PASS; CITATION ACCOUNTING ONLY','reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__)),'references':44,'resolved':39,'unresolved':5,'supplementalParagraphs':343,'faultChecks':faults,'scientificReconciliation':'OPEN'}
target=out/'check.json'
if target.exists(): assert load(target)==receipt
else: target.write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
print(json.dumps(receipt))
