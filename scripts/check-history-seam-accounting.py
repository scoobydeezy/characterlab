"""Read-only exact coverage of all frozen seam paragraphs, with no duplicate IDs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
original={}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']=='docs/planning/SEAM_LEDGER.md':original[u['id']]=u
seen=set();bindings=[]
for name in ['seam-front','seam-correspondence','seam-remainder']:
 p=P/('campaign3-history-'+name+'-rev1/review.json');v=load(p)
 assert sha(p)==load(p.with_name('check.json'))['reviewSha256']
 for r in v['rows']:
  k=r['occurrenceId'];assert k not in seen and k in original,k
  assert r['text']==original[k]['text'] and r['location']==original[k]['location']
  seen.add(k)
 bindings.append(dict(path=p.as_posix(),sha256=sha(p),occurrences=len(v['rows'])))
assert seen==set(original)
assert Path('docs/planning/SEAM_LEDGER.md').read_bytes()==(B/'sources/docs/planning/SEAM_LEDGER.md').read_bytes()
print(json.dumps(dict(status='PASS: exact frozen seam coverage; wider HQ011 OPEN',occurrences=len(seen),bindings=bindings)))
