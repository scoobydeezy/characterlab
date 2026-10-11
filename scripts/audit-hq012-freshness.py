"""Freeze the current HQ-012 candidate delta, independent of the RO registry.

Discovery categories are not source acceptance. Never rewrite a frozen receipt.
"""
from pathlib import Path
from collections import Counter
import hashlib
import json

P = Path('docs/planning')
O = P/'campaign3-hq012-freshness-rev1'
def sha(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
    return h.hexdigest()
def ref(p): return dict(path=p.as_posix(),sha256=sha(p))
def load(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,v):
    text=json.dumps(v,ensure_ascii=False,indent=2)+'\n'
    if p.exists(): assert p.read_text(encoding='utf-8')==text,p
    else: p.write_text(text,encoding='utf-8',newline='\n')
assert not O.exists(), 'Freeze once; later changes require a successor delta.'
base=P/'campaign3-history-universe-rev1/manifest.json'
m=load(base); old={e['path']:e for e in m['entries']}
files=set(Path('.').glob('*.md'))
for directory in ['docs/planning','docs/formal','reference']:
    files.update(p for p in Path(directory).rglob('*') if p.is_file() and p.suffix.lower() in ['.md','.json'])
excludedPrefixes=['docs/planning/campaign3-history-universe-rev1/']
files=sorted(p for p in files if not any(p.as_posix().startswith(x) for x in excludedPrefixes))
rows=[]
for p in files:
    r=ref(p); prior=old.get(r['path']);r['bytes']=p.stat().st_size
    r['change']='ADDED' if prior is None else 'UNCHANGED' if prior['sha256']==r['sha256'] else 'CHANGED'
    if prior: r['previousSha256']=prior['sha256']
    r['rootAuthority']=m['roots'].get(r['path'])
    rows.append(r)
missing=[dict(path=p,previousSha256=e['sha256'],change='MISSING') for p,e in old.items() if not Path(p).exists()]
O.mkdir()
save(O/'inventory.json',dict(status='FROZEN CURRENT CANDIDATE INVENTORY; DELTA ACCEPTANCE OPEN',
    baseline=ref(base),selector='Same root Markdown and recursive docs/planning, docs/formal, reference Markdown/JSON domain; frozen universe mirrors excluded; no registry selection.',
    excludedPrefixes=excludedPrefixes,entries=rows,missing=missing,
    counts=dict(Counter(r['change'] for r in rows)),registryUsedForSelection=False))
delta=[r for r in rows if r['change']!='UNCHANGED']
save(O/'delta.json',dict(inventory=ref(O/'inventory.json'),entries=delta,missing=missing))
print(json.dumps(dict(counts=dict(Counter(r['change'] for r in rows)),missing=len(missing),
    changed=[r['path'] for r in rows if r['change']=='CHANGED'],
    addedTop=dict(Counter('/'.join(r['path'].split('/')[:3]) for r in rows if r['change']=='ADDED'))),ensure_ascii=False))
