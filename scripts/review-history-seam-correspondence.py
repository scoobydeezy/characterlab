"""Reuse scoped reviews only for complete identical historical seam paragraphs."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-seam-correspondence-rev1'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
names=['foundation-decisions','campaign2-admission','probe-carriage','memory-parent','factory','cognitive','verdict-spine','ledger-campaign2','ledger-early','ledger-core','ledger-agency-social','ledger-biology','ledger-identity','ledger-residual']
reviewed={};bindings=[]
for n in names:
 p=P/('campaign3-history-'+n+'-rev1')/'review.json';v=load(p)
 for r in v['rows']:reviewed[r['occurrenceId']]=dict(path=p.as_posix(),sha256=sha(p),row=r)
 bindings.append(dict(path=p.as_posix(),sha256=sha(p)))
units=[];original={};candidates={}
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in ['docs/formal/OPEN_DECISIONS.md','docs/planning/VERDICT_LEDGER.md'] and u['id'] in reviewed:
   candidates.setdefault(u['text'].replace('\r\n','\n').strip(),[]).append(u)
  if u['source']=='docs/planning/SEAM_LEDGER.md' and u['location']['startLine']>=398:units.append(u)
rows=[];remaining=[]
for u in units:
 match=candidates.get(u['text'].replace('\r\n','\n').strip(),[])
 if not match:remaining.append(dict(occurrenceId=u['id'],location=u['location'],heading=u['heading']));continue
 # Only full identical text, including relative link text, qualifies for this pass.
 m=sorted(match,key=lambda x:(x['source'],x['location']['startLine']))[0]
 rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],basisOccurrence=dict(id=m['id'],source=m['source'],sourceSha256=m['sourceSha256'],location=m['location'],text=m['text']),priorReview=reviewed[m['id']],role='REPEATED_SCOPED_HISTORICAL_STATEMENT',rationale='The seam index republishes the same complete historical acceptance/qualification statement already reviewed in the formal decision register or verdict ledger. Reuse only that statement and its limits; this index gains no higher authority, current routing status or claim about neighboring paragraphs.'))
assert len({r['occurrenceId'] for r in rows})==len(rows)
raw=(B/'sources/docs/planning/SEAM_LEDGER.md').read_bytes();assert Path('docs/planning/SEAM_LEDGER.md').read_bytes().startswith(raw)
v=dict(status='EXACT HISTORICAL PARAGRAPH CORRESPONDENCES ACCOUNTED; REMAINDER OPEN',rows=rows,remaining=remaining,priorReviews=bindings,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Only line-ending normalization and outer whitespace trimming; no semantic paraphrase or link rewriting used.','Matching is a reproducibility check for reviewed historical content, not automatic acceptance of a source document or its current status.','All prior limitations and failed cohorts remain; no fresh production tests/build.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],accountedOccurrences=len(rows),unmatchedOccurrences=len(remaining),previousFrontOccurrences=64,totalFrozenSeamOccurrences=len(units)+64,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
