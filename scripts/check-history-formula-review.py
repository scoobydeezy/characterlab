from pathlib import Path
import json,hashlib,copy
p=Path('docs/planning'); b=p/'campaign3-history-universe-rev1'; out=p/'campaign3-history-formula-review-rev1'
def sha(f): return hashlib.sha256(f.read_bytes()).hexdigest()
def load(f): return json.loads(f.read_text(encoding='utf-8-sig'))
r=load(out/'review.json'); units={}
for line in (b/'units.jsonl').open(encoding='utf-8'):
 u=json.loads(line)
 if u['source']==r['sourceAuthority']['path']: units[u['id']]=u
assert sha(b/'manifest.json')==r['manifestSha256']
def check(records):
 assert len(records)==len(units)==34
 assert {x['occurrenceId'] for x in records}==set(units)
 for x in records:
  u=units[x['occurrenceId']]
  for k in ['source','sourceSha256','location','text']: assert x[k]==u[k]
  assert x['rationale'] and x['obligations']
  for e in x['resolutionEvidence']:
   f=b/'sources'/e['source']; assert sha(f)==e['sourceSha256']
   lines=f.read_text(encoding='utf-8-sig').splitlines(keepends=True)
   assert e['text']==''.join(lines[e['startLine']-1:e['endLine']])
  if x['disposition'] in ['OWNED CONDITIONAL HAZARD','SCOPED HISTORICAL RESOLUTION LINKED']:
   assert x['resolutionEvidence'] and x['blockedClaim'] and x['reopenOrCompletion']
check(r['records']); faults=[]
for mode in ['omission','wrong-text','lost-reopen','false-evidence']:
 rows=copy.deepcopy(r['records']); substantive=next(x for x in rows if x['resolutionEvidence'])
 if mode=='omission': rows.pop()
 elif mode=='wrong-text': rows[0]['text']='changed'
 elif mode=='lost-reopen': substantive['reopenOrCompletion']=''
 else: substantive['resolutionEvidence'][0]['text']='unsupported'
 try: check(rows)
 except AssertionError: faults.append(mode)
 else: raise AssertionError(mode)
receipt={'status':'PASS DISPOSITION ACCOUNTING; SCIENTIFIC ADEQUACY REVIEW OPEN','reviewSha256':sha(out/'review.json'),'checkerSha256':sha(Path(__file__)),'occurrences':34,'faultChecks':faults,'freshExperimentExecutions':0}
f=out/'check.json'
if f.exists(): assert load(f)==receipt
else: f.write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(receipt))
