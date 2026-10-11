"""Whole reference-ledger intro/table review, preserving earlier fragment limits."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-reference-parents-rev1'
SOURCE='docs/planning/REFERENCE_MECHANISM_LEDGER.md'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
fragments=[];evidence=[]
for name in ['mechanisms','corpus','proposals','controls','retirements','limitations']:
 p=P/('campaign3-history-'+name+'-rev1/review.json');v=load(p)
 evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
 for r in v.get('items',v.get('rows',[])):
  assert r['source']['path']==SOURCE
  fragments.append(dict(report=p.as_posix(),sha256=sha(p),row=r))
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes()==raw
lines=raw.decode('utf-8-sig').splitlines(keepends=True);rows=[];used=0
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or u['location']['startLine']>255:continue
  assert u['location']['endLine']<=255
  a=u['location']['startLine'];z=u['location']['endLine']
  assert ''.join(lines[a-1:z])==u['text']
  ff=[x for x in fragments if a<=x['row']['source']['startLine']<=z]
  for x in ff:assert x['row']['source']['text'].replace('\r\n','\n') in u['text'].replace('\r\n','\n')
  used+=len(ff)
  if ff:
   d='Preservation table/list fully reviewed through the exact earlier fragment dispositions below; headings and column labels establish roles, not new evidence.'
   limit='Retain all prior bounded comparisons, unresolved scope and correction history. Historical phase2.9/2.95 tests may use LEGACY compiler; later default success is not their automatic requalification. Compatible-bound gating is candidate-specific; small-matrix stability is not scale/cost/conditioning proof.'
  elif a<=50:
   d='Dated GA component/source progress is superseded by explicit bounded public qualification; observed acquisition, independent cue, access, encoding and significance remain distinct.'
   limit='No law selection or state reduction. Negative flat-tag control and retained law equalities survive later qualification; current words in old chronology are not routing.'
  elif a<90:
   d='Normative preservation/source policy: historical material supplies controls, candidates, contracts and corpus obligations; PORT means construction/comparison obligation, not RETAINED necessity.'
   limit='Source index does not authenticate every historical claim. Phase3 design was unearned then; later qualification requires independent evidence. Reference code remains quarantined as evidence/control, not implicit production authority.'
  elif a<119:
   d='Scoped substrate port summaries preserve exact arithmetic, addressed randomness, analytical remainder, event ordering and whole-instant persistence; later phase expansion does not alter scheduler ordering.'
   limit='Diagnostic hashes alone do not prove structural equivalence; no psychological pipeline port is inferred from substrate qualification.'
  elif a<180:
   d='Historical Phase3 proposal status is a dated scope statement; distinguish required phenomenon from unvalidated proposed formula or representation.'
   limit='Later belief/affect/biology/development/Values evidence can qualify named behavior without retroactively earning original seven-axis, quadratic, acquired-Need or clinical mechanisms.'
  else:
   d='Executable evidence map names backing test/code sources; porting gate requires explicit seam version, historical control, changed representation and disposition.'
   limit='A test filename is an evidence pointer, not acceptance of every assertion under a new identity. Preserve original controls and actual source/model/calibration when using their receipts.'
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],disposition=d,limits=limit,fragmentReviews=ff))
assert used==len(fragments)==94
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={n for n in range(1,256) if lines[n-1].strip()}
for name in ['CAMPAIGN3_HISTORY_RESEARCH_COMPLETE_CHECKPOINT.md','CAMPAIGN3_HISTORY_HQ008_CROSSWALK.md','CAMPAIGN3_HISTORY_LEDGER_COMPLETE_CHECKPOINT.md']:
 p=P/name;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='REFERENCE LEDGER INTRO/PARENTS REVIEWED; WIDER HQ011 OPEN',rows=rows,evidence=evidence,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['94 earlier row/list fragments are contained in whole original occurrences, not additional whole-occurrence counts.','No new production simulation, test suite, build, mechanism retirement or corpus acceptance.','Source authenticity and broader unearned phenomena remain governed by HQ009/HQ008 and final gate.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
# Prior94 dated occurrences include the12 queue occurrences already; deduplicate.
seen={r['occurrenceId'] for r in rows}
for name,key in [('hq010','rows'),('queue','amendments')]:
 for r in load(P/('campaign3-history-'+name+'-rev1/review.json'))[key]:seen.add(r['occurrenceId'])
original=set()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']==SOURCE:original.add(u['id'])
assert seen==original,(len(seen),len(original))
c=dict(status=v['status'],newWholeOccurrences=len(rows),priorFragmentReviews=used,completeReferenceOccurrences=len(seen),indexedWholeOccurrenceLinks=2152+len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
