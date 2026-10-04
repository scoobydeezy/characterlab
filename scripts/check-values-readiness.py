from pathlib import Path
import json, hashlib, copy
P=Path('docs/planning/values-readiness-rev1')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
r=json.loads((P/'review.json').read_text(encoding='utf-8'))
def validate(v):
 assert v['status']=='VALUES OWNER READINESS; NO QUALIFICATION'
 assert len(v['evidence'])==6
 for x in v['evidence']:
  p=Path(x['path']);ls=p.read_bytes().decode('utf-8-sig').splitlines(keepends=True)
  assert sha(p)==x['sha256']
  assert 1<=x['firstLine']<=x['lastLine']<=len(ls)
  assert ''.join(ls[x['firstLine']-1:x['lastLine']])==x['text']
 assert v['obligations']==['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']
validate(r)
faults=[]
for name in ['changed-source','missing-evidence','missing-obligation']:
 v=copy.deepcopy(r)
 if name=='changed-source':v['evidence'][0]['text']+='x'
 elif name=='missing-evidence':v['evidence'].pop()
 else:v['obligations'].pop()
 try:validate(v)
 except AssertionError:faults.append(name)
 else:raise AssertionError(name)
c=dict(status='PASS READINESS SOURCE ACCOUNTING; NO EXECUTION CLAIM',faultChecks=faults,
 reviewSha256=sha(P/'review.json'),readinessSha256=sha('docs/planning/VALUES_READINESS.md'),checkerSha256=sha(__file__))
f=P/'check.json'
if f.exists():assert json.loads(f.read_text(encoding='utf-8'))==c
else:f.write_text(json.dumps(c,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(c))
