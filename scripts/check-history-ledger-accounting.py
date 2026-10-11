"""Read-only exact coverage check for the frozen verdict ledger review overlays."""
from pathlib import Path
import json, hashlib
P=Path('docs/planning'); B=P/'campaign3-history-universe-rev1'
names=['verdict-spine','ledger-campaign2','ledger-early','ledger-core','ledger-agency-social','ledger-biology','ledger-identity','ledger-residual']
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p): return json.loads(p.read_text(encoding='utf-8-sig'))
original={}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']=='docs/planning/VERDICT_LEDGER.md': original[u['id']]=u
seen={};bindings=[]
for name in names:
 p=P/('campaign3-history-'+name+'-rev1')/'review.json';v=load(p)
 c=load(p.with_name('check.json'));assert sha(p)==c['reviewSha256']
 for r in v['rows']:
  k=r['occurrenceId'];assert k in original and k not in seen,k
  u=original[k]
  if 'source' in r:
   e=r['source'];assert e['startLine']==u['location']['startLine'] and e['endLine']==u['location']['endLine']
  else: assert r['location']==u['location'] and r['text']==u['text']
  seen[k]=p.as_posix()
 bindings.append(dict(path=p.as_posix(),sha256=sha(p),occurrences=len(v['rows'])))
assert set(seen)==set(original),(len(seen),len(original))
old=(B/'sources/docs/planning/VERDICT_LEDGER.md').read_bytes()
current=Path('docs/planning/VERDICT_LEDGER.md').read_bytes();assert current.startswith(old)
delta=load(P/'campaign3-history-verdict-spine-rev1/review.json')['delta']
assert delta['currentSha256']==hashlib.sha256(current).hexdigest()
assert current[len(old):].decode('utf-8')==delta['appendedText']
print(json.dumps(dict(status='PASS: exact frozen ledger coverage and separately bound post-cutoff delta; wider HQ011 OPEN',originalOccurrences=len(original),reviewBatches=bindings,postCutoffVerdicts=delta['addedVerdicts'],freshBehavioralTests=0)))
