"""Read-only diagnostic of exact occurrence links in bound historical review JSON."""
from pathlib import Path
from functools import cache
import json,hashlib,collections
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
index=load(P/'campaign3-history-source-roles-rev315/index.json')
original={}
for line in (P/'campaign3-history-universe-rev1/units.jsonl').open(encoding='utf-8'):
    u=json.loads(line);original[u['id']]=u['source']
assert len(original)==413894
pending=list(index['reviewedInputs'])+[x for r in index['roleAssignments'] for x in r['evidence']]
seen={};covered=set();shapes=collections.Counter();missing=collections.Counter();failed=[]
while pending:
    ref=pending.pop();path=ref['path']
    if path in seen:
        assert seen[path]==ref['sha256'];continue
    assert sha(path)==ref['sha256'],path
    seen[path]=ref['sha256'];v=load(path)
    stack=[v]
    while stack:
        obj=stack.pop()
        if isinstance(obj,dict):
            for key in ['occurrenceId','originalOccurrenceId','originalId','id']:
                oid=obj.get(key)
                if isinstance(oid,str) and oid in original:
                    covered.add(oid);shapes[(key,tuple(sorted(obj)))]+=1
            p=obj.get('path');h=obj.get('sha256')
            if isinstance(p,str) and isinstance(h,str) and p.startswith('docs/planning/campaign3-history-') and p.endswith('.json') and '/sources/' not in p and 'source-roles-rev' not in p and 'history-universe-' not in p:
                pending.append(dict(path=p,sha256=h))
            stack.extend(obj.values())
        elif isinstance(obj,list):stack.extend(obj)
    if len(seen)%100==0:print(json.dumps(dict(reviews=len(seen),covered=len(covered))),flush=True)
for oid,source in original.items():
    if oid not in covered:missing[source]+=1
print(json.dumps(dict(status='DIAGNOSTIC ONLY; ID PRESENCE IS NOT DISPOSITION ACCEPTANCE',boundJsonFiles=len(seen),originalOccurrences=len(original),explicitObjectIds=len(covered),withoutObjectId=len(original)-len(covered),missingBySource=missing.most_common(30),rowShapes=[dict(key=k[0],fields=k[1],count=n) for k,n in shapes.most_common(20)]),ensure_ascii=False),flush=True)
